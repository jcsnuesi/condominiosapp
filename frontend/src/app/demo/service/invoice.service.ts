import { Injectable } from '@angular/core';
import { global } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

@Injectable()
export class InvoiceService {
    public url: any;
    public logoBase64: string;

    constructor(private _http: HttpClient) {
        this.url = global.url;
        this.logoBase64 = this.base64();
    }

    createInvoice(token: string, invoice: any): Observable<any> {
        let params = JSON.stringify(invoice);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'create-invoice', params, {
            headers: headers,
        });
    }

    generateInvoice(token: string, invoice: any): Observable<any> {
        let params = JSON.stringify(invoice);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'generate-invoice', params, {
            headers: headers,
        });
    }

    getInvoiceByOwner(token: string, id: string): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-invoices/' + id, {
            headers: headers,
        });
    }

    getInvoiceById(token: string, id: string): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application / pdf')
            .set('Authorization', token);

        return this._http.get(this.url + '/get-invoicesById/' + id, {
            headers: headers,
        });
    }

    getInvoiceByCondo(token: string, id: string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'get-invoicesByCondo/' + id, {
            headers: headers,
        });
    }

    base64() {
        this._http
            .get('assets/noimage.jpeg', { responseType: 'blob' })
            .subscribe({
                next: (result) => {
                    var reader = new FileReader();
                    reader.onloadend = () => {
                        this.logoBase64 = reader.result.toString();
                    };
                    reader.readAsDataURL(result);
                },
                error: (error) => {
                    console.log('error', error);
                },
            });

        return this.logoBase64;
    }

    genPDF(data: any, logoBase64: string = this.logoBase64) {
        try {
            let alias = data.alias;
            let dateIssue = new Date(data.invoice_issue).toDateString();
            let dateDue = new Date(data.invoice_due).toDateString();
            let ownerFullname = data.fullname;
            let phone = data.phone;
            let unit = typeof data.unit === 'string' ? data.unit : 'null';
            let email = data.email;
            let docDefinition = null;

            console.log('data', data);
            docDefinition = {
                content: [
                    {
                        image: logoBase64,
                        width: 50,
                        height: 50,
                        alignment: 'left',
                    },
                    { text: 'INVOICE', style: 'header' },
                    { text: `CONDOMINIUM: ${alias}`, style: 'subheader' },
                    {
                        text: `Invoice issue: ${dateIssue}`,
                        style: 'bodyStyle',
                    },
                    { text: `Invoice due:${dateDue} `, style: 'bodyStyle' },

                    {
                        table: {
                            body: [
                                [
                                    'Fullname',
                                    'Phone',
                                    'Email',
                                    'Unit',
                                    'Status',
                                ],
                                [
                                    ownerFullname,
                                    phone,
                                    email,
                                    unit,
                                    data.invoice_status ?? data.status,
                                ],
                            ],
                        },
                    },
                    { text: 'Payment Details', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Description', 'Qty', 'Amount', 'Total'],
                                [
                                    'Condominium Fee',
                                    1,
                                    data.invoice_amount ?? data.amounts,
                                    data.invoice_amount ?? data.amounts,
                                ],
                            ],
                        },
                    },
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                    },
                    subheader: {
                        fontSize: 14,
                        margin: [0, 15, 0, 0],
                    },

                    bodyStyle: {
                        fontSize: 12,
                        margin: [0, 15, 0, 0],
                    },
                },
            };

            Promise.all([
                pdfMake
                    .createPdf(docDefinition)
                    .download(`invoice_${alias}.pdf`),
            ]);
        } catch (error) {
            console.log(error);
        }
    }
}
