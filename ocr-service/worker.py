"""Isolated OCR process: parent kills this process when its deadline expires."""

import json
import re
import sys
from contextlib import closing
from pathlib import Path
from typing import Any

from normalize import date, money, receipt_fields, statement_csv
from statement_pdf import statement_pdf


def extract(path: Path, media: str, statement: bool) -> dict[str, Any]:
    """Extract local document text and candidates without financial side effects."""
    if media == "text/csv":
        return statement_csv(path.read_bytes())
    engine = None
    used_ocr = False
    lines: list[dict[str, Any]] = []

    def recognize(image: Any, page: int) -> None:
        nonlocal engine, used_ocr
        import numpy as np
        from paddleocr import PaddleOCR

        used_ocr = True
        if engine is None:
            engine = PaddleOCR(lang="es", device="cpu", use_doc_orientation_classify=False,
                               use_doc_unwarping=False, use_textline_orientation=False)
        if image.width * image.height > 20_000_000:
            raise ValueError("Imagen demasiado grande")
        for result in engine.predict(np.asarray(image.convert("RGB"))):
            data = result.json
            if isinstance(data, str):
                data = json.loads(data)
            data = data.get("res", data)
            for text, score, box in zip(
                data.get("rec_texts", []),
                data.get("rec_scores", []),
                data.get("rec_polys", []),
            ):
                lines.append(
                    {"text": text, "confidence": float(score), "box": box, "page": page}
                )
                if len(lines) > 20000:
                    raise ValueError("Demasiado texto")

    if media == "application/pdf":
        import pdfplumber

        with pdfplumber.open(path) as document:
            if len(document.pages) > 20:
                raise ValueError("Máximo 20 páginas")
            for number, native_page in enumerate(document.pages):
                words = native_page.extract_words(x_tolerance=2, y_tolerance=3)
                if words:
                    for word in words:
                        left, top, right, bottom = (word[k] for k in ("x0", "top", "x1", "bottom"))
                        lines.append({"text": word["text"], "confidence": 1.0, "page": number + 1,
                                      "box": [[left, top], [right, top], [right, bottom], [left, bottom]]})
                    if len(lines) > 20000:
                        raise ValueError("Demasiado texto")
                    native_page.close()
                    continue
                import pypdfium2 as pdfium
                from PIL import Image

                Image.MAX_IMAGE_PIXELS = 20_000_000
                with closing(pdfium.PdfDocument(path)) as raster_document, closing(raster_document[number]) as page:
                    width, height = page.get_size()
                    if width * height * 4 > 20_000_000:
                        raise ValueError("Página demasiado grande")
                    bitmap = page.render(scale=2)
                    try:
                        recognize(bitmap.to_pil(), number + 1)
                    finally:
                        bitmap.close()
    else:
        from PIL import Image

        Image.MAX_IMAGE_PIXELS = 20_000_000
        with Image.open(path) as image:
            if image.format not in ("PNG", "JPEG"):
                raise ValueError("Formato de imagen no permitido")
            recognize(image, 1)
    # Native extraction returns words. Reassemble visual lines for labels/dates.
    text_groups: list[list[dict[str, Any]]] = []
    for line in sorted(lines, key=lambda item: (item["page"], item["box"][0][1], item["box"][0][0])):
        if (text_groups and text_groups[-1][0]["page"] == line["page"]
                and abs(text_groups[-1][0]["box"][0][1] - line["box"][0][1]) <= 3):
            text_groups[-1].append(line)
        else:
            text_groups.append([line])
    text = "\n".join(" ".join(item["text"] for item in sorted(group, key=lambda item: item["box"][0][0])) for group in text_groups)
    result: dict[str, Any] = {
        "text": text,
        "lines": lines,
        "fields": receipt_fields(text, lines),
        "requiresReview": True,
        "engine": "PaddleOCR+pdfplumber" if used_ocr and media == "application/pdf" else "PaddleOCR" if used_ocr else "pdfplumber",
        "version": "3.2.0" if used_ocr else "0.11.9",
    }
    if statement:
        # Use explicit column headers and geometry; all candidates require review.
        rows = statement_pdf(lines, text)
        for index, line in enumerate(text.splitlines() if not rows else [], 1):
            match = re.match(r"^(\d{2}[/-]\d{2}[/-]\d{4})\s+(.+?)\s+(-?[\d,.]+)$", line)
            if match and date(match[1]) and money(match[3]):
                rows.append(
                    {
                        "date": date(match[1]),
                        "amount": money(match[3]),
                        "description": match[2],
                        "reference": None,
                        "currency": None,
                        "direction": "unknown",
                        "sourceRow": index,
                    }
                )
        result.update(
            rows=rows,
            warnings=[
                "PDF: verificar columnas, dirección, moneda y cada movimiento contra el original; la extracción puede ser incompleta."
            ],
        )
    return result


if __name__ == "__main__":
    try:
        output = extract(Path(sys.argv[1]), sys.argv[2], sys.argv[3] == "statement")
        Path(sys.argv[4]).write_text(
            json.dumps(output, ensure_ascii=False), encoding="utf-8"
        )
    except Exception:  # noqa: BLE001 -- subprocess boundary, redact financial data
        # Do not leak account data, file text or library paths in logs/responses.
        sys.exit(2)
