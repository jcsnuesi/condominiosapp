import unittest

from normalize import date, money, receipt_fields, statement_csv


class NormalizationTests(unittest.TestCase):
    def test_semicolon_decimal_comma_not_mistaken_for_separator(self):
        fixture = "Fecha;Descripción;Crédito;Balance\n01/10/2026;Abono;100,50;100,50\n02/10/2026;Abono;100,50;201,00"
        result = statement_csv(fixture.encode("utf-8"))
        self.assertEqual(len(result["rows"]), 2)
        self.assertEqual(result["rows"][0]["amount"], "100.50")
        self.assertEqual(result["headers"][0], "Fecha")
        self.assertEqual(len(result["rawRows"]), 3)

    def test_extra_money_and_generic_bank(self):
        self.assertIsNone(money("1,2,3.45"))
        self.assertEqual(money("20,50"), "20.50")
        self.assertIsNone(money("1.2.3"))
        self.assertEqual(
            receipt_fields("Banco receptor: Banco Nuevo")["bank"], "Banco Nuevo"
        )

    def test_csv_zero_columns_and_ambiguous_direction(self):
        fixture = "Fecha,Descripción,Débito,Crédito\n01/10/2026,Crédito,0.00,100.00\n\n02/10/2026,Débito,50.00,0.00\n03/10/2026,Ambiguo,10.00,20.00"
        result = statement_csv(fixture.encode("cp1252"))
        self.assertEqual(
            [row["direction"] for row in result["rows"]], ["credit", "debit", "unknown"]
        )
        self.assertEqual(len(result["warnings"]), 1)

    def test_money_formats_and_ambiguity(self):
        self.assertEqual(money(".17"), "0.17")
        self.assertEqual(money(".80"), "0.80")
        self.assertEqual(money(".00"), "0.00")
        self.assertEqual(money("RD$ 1,234.56"), "1234.56")
        self.assertEqual(money("1.234,56"), "1234.56")
        self.assertIsNone(money("1,234"))
        self.assertIsNone(money("nan"))
        self.assertIsNone(money("1.1234"))

    def test_receipt_is_conservative(self):
        fields = receipt_fields(
            "Banco Popular\nMonto RD$ 1,250.00\nFecha 01/10/2026\nReferencia: 00012345"
        )
        self.assertEqual(fields["reference"], "00012345")
        self.assertEqual(fields["amount"], "1250.00")
        self.assertEqual(fields["currency"], "DOP")
        self.assertIsNone(receipt_fields("Monto $ 100.00")["currency"])
        self.assertIsNone(receipt_fields("Monto 100.00\nTotal 200.00")["amount"])
        self.assertIsNone(receipt_fields("Banco Popular a Banreservas")["bank"])

    def test_dates(self):
        self.assertEqual(date("01/10/2026"), "2026-10-01")
        self.assertIsNone(date("31/02/2026"))

    def test_utf16_bank_preamble_and_debits(self):
        fixture = 'Titular,Número de cuenta\nEjemplo,123\nMovimientos,\nFecha,Descripción,Débito,Crédito,Balance\n01/10/2026,Abono,,"1,250.00",1250\n02/10/2026,Cargo,-2.50,,1247.50\n'
        result = statement_csv(fixture.encode("utf-16"))
        self.assertTrue(result["requiresReview"])
        self.assertEqual(len(result["rows"]), 2)
        self.assertEqual(result["rows"][0]["direction"], "credit")
        self.assertEqual(result["rows"][1]["direction"], "debit")
        self.assertIsNone(result["rows"][0]["currency"])

    def test_unknown_signed_amount_never_implies_credit(self):
        result = statement_csv(
            b"Fecha;Monto;Referencia\n01/10/2026;100.00;000123\ninvalid;100.00;123\n"
        )
        self.assertEqual(result["rows"][0]["direction"], "unknown")
        self.assertEqual(result["rows"][0]["reference"], "000123")
        self.assertEqual(len(result["warnings"]), 1)

    def test_unknown_headers_rejected(self):
        result = statement_csv(b"foo,bar\n1,2")
        self.assertEqual(result["rows"], [])
        self.assertTrue(result["rawRows"])
        self.assertTrue(result["warnings"])


if __name__ == "__main__":
    unittest.main()
