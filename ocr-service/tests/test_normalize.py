import unittest

from normalize import date, money, receipt_fields, statement_csv


class NormalizationTests(unittest.TestCase):
    def test_mobile_voucher_columns_spanish_date_and_transaction_id(self) -> None:
        def line(text: str, left: int, top: int, right: int) -> dict:
            return {"text": text, "page": 1,
                    "box": [[left, top], [right, top], [right, top + 30], [left, top + 30]]}

        text = (
            "Pagos y transferencias\nDatos Confirmación Completado\n"
            "TRANSACCIÓN PROCESADA\n27 de Septiembre 2026 - 12:50 AM\n"
            "123456789012\nMonto Impuesto\nDOP 1,000.00 DOP 2.00\n"
            "Origen\nDOP *1234\nDestino\nDOP *5678"
        )
        lines = [line("Monto", 120, 693, 208), line("Impuesto", 434, 693, 546),
                 line("DOP 1,000.00", 52, 755, 273), line("DOP 2.00", 419, 752, 579)]
        self.assertEqual(receipt_fields(text, lines), {
            "amount": "1000.00", "currency": "DOP", "date": "2026-09-27",
            "reference": "123456789012", "bank": None,
        })
        self.assertIsNone(receipt_fields("Datos Confirmación Completado")["reference"])
        self.assertIsNone(receipt_fields(text + "\n987654321012", lines)["reference"])
        self.assertIsNone(receipt_fields(text + "\nMonto DOP 2000.00", lines)["amount"])
        self.assertIsNone(receipt_fields(text, [lines[1], lines[3]])["amount"])

    def test_ach_voucher_heading_and_unlabeled_amount(self) -> None:
        fields = receipt_fields(
            "Banco Ejemplo\nComprobante\nTransferencia ACH\nRD$1,500.00\n"
            "Fecha: 02/10/2026 10:49:31 a.m.\nNo. Referencia: 00001234\n"
            "Beneficiario: Ejemplo\n*******0017\nVía:\nACH"
        )
        self.assertEqual(
            fields,
            {
                "amount": "1500.00",
                "currency": "DOP",
                "date": "2026-10-02",
                "reference": "00001234",
                "bank": "Banco Ejemplo",
            },
        )

    def test_voucher_headings_do_not_capture_descriptions_or_conflicts(self) -> None:
        self.assertIsNone(receipt_fields("Comprobante\nTransferencia ACH")["reference"])
        self.assertIsNone(receipt_fields("RD$1,500.00\nRD$2,000.00")["amount"])
        self.assertIsNone(receipt_fields("Monto RD$100.00\nRD$200.00")["amount"])
        self.assertIsNone(receipt_fields("Banco Ejemplo\nBanco Otro")["bank"])
        self.assertIsNone(
            receipt_fields("No. Referencia: 00001234\nReferencia: 00005678")[
                "reference"
            ]
        )
        self.assertIsNone(receipt_fields("RD$1,500")["amount"])

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
        self.assertEqual(date("27 de Septiembre 2026"), "2026-09-27")
        self.assertEqual(date("2 de octubre de 2026"), "2026-10-02")
        self.assertIsNone(date("31 de febrero 2026"))
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
