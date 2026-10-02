"""Reconstruct statement columns from OCR coordinates for mandatory review."""

import re
from decimal import Decimal
from typing import Any

from normalize import date, key, money, receipt_fields


def statement_pdf(lines: list[dict[str, Any]], text: str | None = None) -> list[dict[str, Any]]:
    text = text if text is not None else "\n".join(str(line.get("text", "")) for line in lines)
    months = "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split()
    periods = re.findall(r"\b(" + "|".join(months) + r")\s+(20\d{2})\b", key(text))
    period = next(iter(set(periods))) if len(set(periods)) == 1 else None
    currency = receipt_fields(text)["currency"]
    cells = []
    for line in lines:
        box = line.get("box")
        if not box or len(box) < 4:
            continue
        xs, ys = [float(p[0]) for p in box], [float(p[1]) for p in box]
        cells.append({"text": str(line.get("text", "")), "x": (min(xs) + max(xs)) / 2,
                      "y": (min(ys) + max(ys)) / 2, "height": max(ys) - min(ys),
                      "page": line.get("page", 1)})
    groups: list[list[dict[str, Any]]] = []
    for cell in sorted(cells, key=lambda c: (c["page"], c["y"], c["x"])):
        if (groups and groups[-1][0]["page"] == cell["page"]
                and abs(groups[-1][0]["y"] - cell["y"]) <= min(groups[-1][0]["height"], cell["height"]) * .5):
            groups[-1].append(cell)
        else:
            groups.append([cell])
    aliases = {"dia": "date", "fecha": "date", "refer": "reference", "referencia": "reference",
               "descripcion": "description", "debitos": "debit", "debito": "debit",
               "creditos": "credit", "credito": "credit", "balance": "balance", "saldo": "balance"}
    columns: list[tuple[float, str]] = []
    page = None
    rows = []
    for group in groups:
        if group[0]["page"] != page:
            columns = []
            page = group[0]["page"]
        headers = [(c["x"], aliases[key(c["text"]).rstrip(".")]) for c in group
                   if key(c["text"]).rstrip(".") in aliases]
        if {name for _, name in headers} >= {"date", "debit", "credit"}:
            columns = sorted(headers)
            continue
        if not columns:
            continue
        values: dict[str, list[str]] = {}
        for cell in sorted(group, key=lambda c: c["x"]):
            name = min(columns, key=lambda column: abs(column[0] - cell["x"]))[1]
            values.setdefault(name, []).append(cell["text"])
        raw_date = " ".join(values.get("date", []))
        parsed_date = date(raw_date)
        if not parsed_date and period and re.fullmatch(r"\d{1,2}", raw_date):
            parsed_date = date(f"{int(raw_date):02}/{months.index(period[0]) + 1:02}/{period[1]}")
        if not parsed_date:
            continue
        amounts = {name: money(" ".join(values.get(name, []))) for name in ("debit", "credit")}
        populated = [(name, amount) for name, amount in amounts.items()
                     if amount is not None and Decimal(amount) > 0]
        if len(populated) != 1:
            continue
        direction, amount = populated[0]
        other = "credit" if direction == "debit" else "debit"
        if values.get(other) and amounts[other] != "0.00":
            continue
        rows.append({"sourceRow": len(rows) + 1, "date": parsed_date, "amount": amount,
                     "currency": currency, "reference": " ".join(values.get("reference", [])) or None,
                     "description": " ".join(values.get("description", [])), "direction": direction})
    return rows
