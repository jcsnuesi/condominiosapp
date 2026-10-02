"""Conservative extraction: output is evidence for review, never payment approval."""

import csv
import io
import re
import unicodedata
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import Any


def key(value: str) -> str:
    """Normalize header accents without altering source values."""
    return "".join(
        c
        for c in unicodedata.normalize("NFD", value.lower())
        if unicodedata.category(c) != "Mn"
    ).strip()


def money(value: str) -> str | None:
    """Return exact decimal text, rejecting ambiguous grouping."""
    value = re.sub(r"(?:RD\$|US\$|DOP|USD|EUR|\$|€|\s)", "", value, flags=re.IGNORECASE)
    if re.fullmatch(r"-?[.,]\d{1,2}", value):
        value = value.replace(".", "0.", 1) if "." in value else value.replace(",", "0,", 1)
    if not re.fullmatch(r"-?\d+(?:[.,]\d+)*", value):
        return None
    # A lone separator followed by three digits is ambiguous; never guess.
    if re.fullmatch(r"-?\d+[.,]\d{3}", value):
        return None
    if "," in value and "." in value:
        decimal = "," if value.rfind(",") > value.rfind(".") else "."
        thousands = "." if decimal == "," else ","
        pattern = rf"-?\d{{1,3}}(?:{re.escape(thousands)}\d{{3}})+{re.escape(decimal)}\d{{1,2}}"
        if not re.fullmatch(pattern, value):
            return None
        value = value.replace("." if decimal == "," else ",", "").replace(decimal, ".")
    elif "," in value:
        value = value.replace(",", ".")
    try:
        amount = Decimal(value)
        return (
            format(amount, ".2f")
            if amount.is_finite() and amount == amount.quantize(Decimal(".01"))
            else None
        )
    except InvalidOperation:
        return None


def date(value: str) -> str | None:
    """Parse day-first bank dates or explicit ISO dates."""
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            parsed_date = datetime.strptime(value.strip(), fmt)  # noqa: DTZ007
            return parsed_date.date().isoformat()
        except ValueError:
            pass
    return None


def receipt_fields(text: str) -> dict[str, str | None]:
    """Extract unique labeled candidates; missing or conflicting fields stay null."""
    fields: dict[str, str | None] = dict.fromkeys(
        ("amount", "currency", "date", "reference", "bank")
    )
    normalized = key(text)
    amounts = re.findall(
        r"(?:monto(?:\s+transferido)?|importe|total)\s*[:\-]?\s*((?:RD\$|US\$|DOP|USD|EUR|\$)?\s*\d[\d.,]*)",
        text,
        re.IGNORECASE,
    )
    values = {money(v) for v in amounts} - {None}
    if len(values) == 1:
        fields["amount"] = values.pop()
    currencies = set()
    for pattern, currency in (
        (r"RD\$|\bDOP\b", "DOP"),
        (r"US\$|\bUSD\b", "USD"),
        (r"€|\bEUR\b", "EUR"),
    ):
        if re.search(pattern, text, re.IGNORECASE):
            currencies.add(currency)
    if len(currencies) == 1:
        fields["currency"] = currencies.pop()
    dates = {
        date(v)
        for v in re.findall(r"\b(?:\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})\b", text)
    } - {None}
    if len(dates) == 1:
        fields["date"] = dates.pop()
    references = re.findall(
        r"(?:referencia|comprobante|confirmacion)(?:\s*(?:no\.?|numero|#))?\s*[:\-]?\s*([a-z0-9][a-z0-9-]{3,})",
        normalized,
    )
    if len(set(references)) == 1:
        fields["reference"] = references[0].upper()
    banks = re.findall(
        r"^\s*banco(?:\s+(?:emisor|receptor|destino|origen))?\s*:\s*([^\n\r]+)",
        text,
        re.IGNORECASE | re.MULTILINE,
    )
    if len(set(banks)) == 1:
        fields["bank"] = banks[0].strip()
    return fields


def statement_csv(data: bytes) -> dict[str, Any]:
    """Return bank-independent candidates and original cells for human mapping."""
    if data.startswith((b"\xff\xfe", b"\xfe\xff")) or b"\x00" in data[:100]:
        text = data.decode(
            "utf-16" if data.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-16-le"
        )
    else:
        try:
            text = data.decode("utf-8-sig")
        except UnicodeDecodeError:
            text = data.decode("cp1252")
    # Bank exports may contain account metadata before the transaction header.
    # Sniff transaction header onward when a bank metadata preamble differs.
    sample_lines = text.splitlines()
    start = next(
        (
            i
            for i, line in enumerate(sample_lines)
            if re.search(r"\b(fecha|date)\b", key(line))
            and any(
                word in key(line)
                for word in ("credito", "credit", "monto", "amount", "importe")
            )
        ),
        0,
    )
    sample = "\n".join(sample_lines[start : start + 20])
    try:
        delimiter = csv.Sniffer().sniff(sample, delimiters=",;\t|").delimiter
    except csv.Error:
        delimiter = (
            max(",;\t|", key=lambda item: sample_lines[start].count(item))
            if sample_lines
            else ","
        )
    parsed = list(csv.reader(io.StringIO(text), delimiter=delimiter))
    header_at = next(
        (
            i
            for i, row in enumerate(parsed)
            if "fecha" in [key(c) for c in row]
            and any(key(c) in ("credito", "monto", "importe") for c in row)
        ),
        None,
    )
    if header_at is None:
        return {
            "rows": [],
            "rawRows": parsed[:10001],
            "headers": [],
            "text": text,
            "requiresReview": True,
            "warnings": [
                "Formato CSV no reconocido: mapear columnas manualmente contra el original"
            ]
            + (
                [
                    "Vista previa limitada a 10001 filas; dividir el archivo antes de importar"
                ]
                if len(parsed) > 10001
                else []
            ),
        }
    headers = [key(c) for c in parsed[header_at]]
    rows, warnings = [], []
    if len(parsed) > 10001:
        warnings.append(
            "Vista previa limitada a 10001 filas; revisar el original completo"
        )
    for index, values in enumerate(parsed[header_at + 1 :], header_at + 2):
        if not any(v.strip() for v in values):
            continue
        raw = dict(zip(headers, values))
        credit, debit = raw.get("credito", "").strip(), raw.get("debito", "").strip()
        if money(credit) == "0.00":
            credit = ""
        if money(debit) == "0.00":
            debit = ""
        amount = money(credit or debit or raw.get("monto", raw.get("importe", "")))
        day = date(raw.get("fecha", ""))
        if amount is None or day is None:
            warnings.append(
                f"Fila {index}: fecha o monto no reconocido; revisar el original"
            )
            continue
        direction = (
            "credit"
            if credit and not debit
            else "debit" if debit and not credit else "unknown"
        )
        if credit and debit:
            warnings.append(
                f"Fila {index}: contiene débito y crédito; dirección ambigua"
            )
        rows.append(
            {
                "date": day,
                "amount": format(abs(Decimal(amount)), ".2f"),
                "currency": raw.get("moneda", "").strip().upper() or None,
                "reference": raw.get(
                    "referencia", raw.get("numero de referencia", "")
                ).strip()
                or None,
                "description": raw.get("descripcion", raw.get("concepto", "")).strip(),
                "direction": direction,
                "sourceRow": index,
            }
        )
        if len(rows) > 10000:
            raise ValueError("Máximo 10000 movimientos por archivo")
    return {
        "rows": rows,
        "warnings": warnings,
        "requiresReview": True,
        "text": text,
        "rawRows": parsed[:10001],
        "headers": parsed[header_at],
    }
