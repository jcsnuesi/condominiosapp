import os
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app import app


def test_subprocess_failure_and_timeout():
    with patch.dict(os.environ, {"OCR_SERVICE_TOKEN": "a" * 32}), TestClient(
        app
    ) as client:
        headers = {"x-ocr-token": "a" * 32, "content-type": "text/csv"}
        child = AsyncMock()
        child.returncode = 2
        with patch("app.asyncio.create_subprocess_exec", return_value=child):
            assert (
                client.post("/statement", content=b"hello", headers=headers).status_code
                == 422
            )
        from unittest.mock import Mock

        child.kill = Mock()
        child.wait.side_effect = [TimeoutError(), None]
        with patch("app.asyncio.create_subprocess_exec", return_value=child):
            assert (
                client.post("/statement", content=b"hello", headers=headers).status_code
                == 504
            )
        child.kill.assert_called_once()


def test_health_and_authentication():
    with TestClient(app) as client:
        assert client.get("/health").status_code == 200
        with patch.dict(os.environ, {"OCR_SERVICE_TOKEN": ""}):
            assert client.post("/extract").status_code == 503
        with patch.dict(os.environ, {"OCR_SERVICE_TOKEN": "a" * 32}):
            assert client.post("/extract").status_code == 401


def test_media_empty_signature_size_and_csv():
    with patch.dict(os.environ, {"OCR_SERVICE_TOKEN": "a" * 32}), TestClient(
        app
    ) as client:
        headers = {"x-ocr-token": "a" * 32, "content-type": "text/csv"}
        assert client.post("/extract", content=b"x", headers=headers).status_code == 415
        assert (
            client.post("/statement", content=b"", headers=headers).status_code == 422
        )
        assert (
            client.post(
                "/statement", content=b"x" * (10 * 1024 * 1024 + 1), headers=headers
            ).status_code
            == 413
        )
        headers["content-type"] = "application/pdf"
        assert (
            client.post("/extract", content=b"bad", headers=headers).status_code == 422
        )
        headers["content-type"] = "text/csv"
        response = client.post(
            "/statement", content=b"Fecha,Credito\n01/10/2026,100.00", headers=headers
        )
        assert response.status_code == 200
        assert response.json()["requiresReview"] is True
        assert response.json()["rows"][0]["direction"] == "credit"
