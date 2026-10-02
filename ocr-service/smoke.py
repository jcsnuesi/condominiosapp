"""Run inside image with synthetic data only; no application database needed."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from worker import extract

canvas = Image.new("RGB", (1100, 500), "white")
draw = ImageDraw.Draw(canvas)
font = ImageFont.load_default(size=36)
draw.multiline_text(
    (35, 35),
    "Banco: Ejemplo\nMonto RD$ 1250.00\nFecha 01/10/2026\nReferencia: 00012345",
    fill="black",
    font=font,
    spacing=25,
)
source = Path("/tmp/synthetic-receipt.png")
canvas.save(source)
result = extract(source, "image/png", False)
assert result["requiresReview"] is True
assert result["lines"], "No OCR text recognized"
assert result["fields"]["amount"] == "1250.00", result["fields"]
assert result["fields"]["reference"] == "00012345", result["fields"]
print({"success": True, "fields": result["fields"], "lines": len(result["lines"])})
pdf = Path("/tmp/synthetic-statement.pdf")
canvas.save(pdf, "PDF")
statement = extract(pdf, "application/pdf", True)
assert statement["requiresReview"] is True
assert statement["warnings"] and statement["lines"]
print({"pdfSuccess": True, "lines": len(statement["lines"])})
