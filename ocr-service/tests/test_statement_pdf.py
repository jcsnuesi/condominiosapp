import unittest

from statement_pdf import statement_pdf


def cell(text, x, y, page=1):
    return {"text": text, "page": page, "box": [[x - 15, y - 5], [x + 15, y - 5], [x + 15, y + 5], [x - 15, y + 5]]}


class StatementPdfTests(unittest.TestCase):
    def fixture(self):
        return [cell("SEPTIEMBRE 2026", 150, 10), cell("DOP", 150, 20)] + [
            cell(label, x, 50) for label, x in
            [("DIA", 30), ("REFER.", 100), ("DESCRIPCIÓN", 220),
             ("DEBITOS", 350), ("CREDITOS", 450), ("BALANCE", 550)]]

    def test_separate_ocr_cells_and_day_only_dates(self):
        lines = self.fixture() + [cell("05", 30, 80), cell("000123", 100, 80),
                                 cell("Transferencia", 220, 80), cell("1,250.00", 450, 80),
                                 cell("9,999.00", 550, 80)]
        row = statement_pdf(list(reversed(lines)))[0]
        self.assertEqual(row["date"], "2026-09-05")
        self.assertEqual(row["amount"], "1250.00")
        self.assertEqual(row["reference"], "000123")
        self.assertEqual(row["direction"], "credit")
        self.assertEqual(row["currency"], "DOP")

    def test_debit_zero_credit_and_full_date(self):
        lines = self.fixture() + [cell("06/09/2026", 30, 80), cell("50.00", 350, 80),
                                 cell("0.00", 450, 80), cell("500.00", 550, 80)]
        row = statement_pdf(lines)[0]
        self.assertEqual(row["direction"], "debit")
        self.assertEqual(row["amount"], "50.00")

    def test_ambiguous_invalid_and_balance_only_rows_skipped(self):
        for amounts in [[cell("10.00", 350, 80), cell("20.00", 450, 80)],
                        [cell("999.00", 550, 80)],
                        [cell("10.00", 350, 80), cell("garbled", 450, 80)]]:
            self.assertEqual(statement_pdf(self.fixture() + [cell("05", 30, 80)] + amounts), [])
        self.assertEqual(statement_pdf(self.fixture() + [cell("31", 30, 80), cell("10.00", 450, 80)]), [])

    def test_headers_required_on_each_page(self):
        self.assertEqual(statement_pdf(self.fixture() + [cell("05", 30, 80, 2), cell("10.00", 450, 80, 2)]), [])


if __name__ == "__main__":
    unittest.main()
