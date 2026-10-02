"""Integration regression: a textual PDF must work without PaddleOCR installed."""

import builtins
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from reportlab.pdfgen import canvas
from worker import extract


class NativePdfTests(unittest.TestCase):
    def test_text_pdf_tabulated_without_loading_or_rendering_ocr(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "statement.pdf"
            pdf = canvas.Canvas(str(path))
            pdf.setFont("Helvetica", 9)
            pdf.drawString(30, 780, "CUENTAS DE AHORROS DOP")
            pdf.drawString(30, 760, "SEPTIEMBRE 2026")
            for text, x in [("DIA", 30), ("REFER.", 100), ("DESCRIPCION", 220),
                            ("DEBITOS", 350), ("CREDITOS", 450), ("BALANCE", 550)]:
                pdf.drawString(x, 720, text)
            for y, day, ref, debit, credit in [(700, "05", "000123", "0.00", "1,250.00"),
                                              (680, "06", "000124", "50.00", "0.00"),
                                              (660, "30", "000125", ".17", "0.00")]:
                for text, x in [(day, 30), (ref, 100), ("Transferencia bancaria", 220),
                                (debit, 350), (credit, 450), ("9,999.00", 550)]:
                    pdf.drawString(x, y, text)
            pdf.save()
            original_import = builtins.__import__

            def forbid_ocr(name, *args, **kwargs):
                if name.split(".")[0] in ("paddleocr", "numpy"):
                    raise AssertionError("Text PDFs must not load OCR")
                return original_import(name, *args, **kwargs)

            with patch("builtins.__import__", side_effect=forbid_ocr), patch("pypdfium2.PdfPage.render", side_effect=AssertionError("Text PDFs must not render")):
                result = extract(path, "application/pdf", True)
            self.assertEqual(result["engine"], "pdfplumber")
            self.assertEqual(len(result["rows"]), 3)
            self.assertEqual(result["rows"][0]["date"], "2026-09-05")
            self.assertEqual(result["rows"][0]["amount"], "1250.00")
            self.assertEqual(result["rows"][0]["reference"], "000123")
            self.assertEqual(result["rows"][0]["description"], "Transferencia bancaria")
            self.assertEqual(result["rows"][0]["direction"], "credit")
            self.assertEqual(result["rows"][1]["direction"], "debit")
            self.assertEqual(result["rows"][2]["amount"], "0.17")
            self.assertEqual(result["rows"][0]["currency"], "DOP")
