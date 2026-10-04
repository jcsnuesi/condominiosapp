"""Internal, authenticated extraction API. No payment or database privileges."""

import asyncio
import hmac
import json
import logging
import os
import sys
import tempfile
import time
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

app = FastAPI(title="Bank document extraction", docs_url=None, redoc_url=None)
MAX_BYTES = 10 * 1024 * 1024
gate = asyncio.Lock()
logger = logging.getLogger("uvicorn.error")


@app.middleware("http")
async def log_extraction(request: Request, call_next: RequestResponseEndpoint) -> Response:
    """Log extraction lifecycle without document contents or credentials."""
    if request.method != "POST" or request.url.path not in ("/extract", "/statement"):
        return await call_next(request)
    request_id = uuid4().hex
    request.state.ocr_request_id = request_id
    started = time.monotonic()
    status = 500
    logger.info("OCR request started id=%s endpoint=%s", request_id, request.url.path)
    try:
        response = await call_next(request)
        status = response.status_code
        return response
    finally:
        logger.info(
            "OCR request finished id=%s status=%s duration_ms=%d",
            request_id, status, int((time.monotonic() - started) * 1000),
        )


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness only; model assets initialize on first extraction."""
    return {"status": "ok", "model": "lazy"}


async def process(request: Request, statement: bool) -> dict[str, Any]:
    """Bound upload and processing independently; all results need review."""
    token_file = os.getenv("OCR_SERVICE_TOKEN_FILE")
    expected = (
        (await asyncio.to_thread(Path(token_file).read_text)).strip()
        if token_file
        else os.getenv("OCR_SERVICE_TOKEN", "")
    )
    if len(expected) < 32:
        raise HTTPException(503, "OCR token is not configured (minimum 32 characters)")
    if not hmac.compare_digest(request.headers.get("x-ocr-token", ""), expected):
        raise HTTPException(401, "Invalid service token")
    media = request.headers.get("content-type", "").split(";")[0].lower()
    allowed = (
        ("application/pdf", "text/csv")
        if statement
        else ("application/pdf", "image/png", "image/jpeg")
    )
    if media not in allowed:
        raise HTTPException(415, "Unsupported document type")
    if gate.locked():
        raise HTTPException(503, "Extraction capacity busy; retry later")
    async with gate:
        body = bytearray()
        try:
            async with asyncio.timeout(30):
                async for chunk in request.stream():
                    body.extend(chunk)
                    if len(body) > MAX_BYTES:
                        raise HTTPException(413, "Maximum document size is 10 MB")
        except TimeoutError:
            raise HTTPException(408, "Upload timeout") from None
        if not body:
            raise HTTPException(422, "Empty document")
        if media == "application/pdf" and not body.startswith(b"%PDF-"):
            raise HTTPException(422, "Invalid PDF signature")
        with tempfile.TemporaryDirectory(prefix="bank-ocr-") as directory:
            source, output = Path(directory) / "source", Path(directory) / "result.json"
            await asyncio.to_thread(source.write_bytes, body)
            child = await asyncio.create_subprocess_exec(
                sys.executable,
                "worker.py",
                str(source),
                media,
                "statement" if statement else "receipt",
                str(output),
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
            )
            try:
                await asyncio.wait_for(child.wait(), timeout=150)
            except TimeoutError:
                child.kill()
                await child.wait()
                raise HTTPException(504, "Extraction timeout") from None
            except asyncio.CancelledError:
                child.kill()
                await child.wait()
                raise
            if child.returncode or not output.exists():
                raise HTTPException(
                    422, "Document could not be extracted; review original or retry"
                )
            result: dict[str, Any] = json.loads(
                await asyncio.to_thread(output.read_text, encoding="utf-8")
            )
            logger.info(
                "OCR extraction completed id=%s lines=%d fields_detected=%d review_required=true",
                request.state.ocr_request_id,
                len(result.get("lines", [])),
                sum(value is not None for value in result.get("fields", {}).values()),
            )
            return result


@app.post("/extract")
async def receipt(request: Request) -> dict[str, Any]:
    """Extract receipt fields; never confirms a payment."""
    return await process(request, False)


@app.post("/statement")
async def statement(request: Request) -> dict[str, Any]:
    """Return untrusted statement candidates requiring administrator review."""
    return await process(request, True)
