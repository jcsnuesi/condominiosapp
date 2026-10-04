import { Injectable } from '@angular/core';
import { global } from './global.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;
import { UserService } from './user.service';

export interface PaymentProvider {
    _id?: string;
    name: string;
    code: string;
    builtIn: boolean;
}

interface ProviderResponse<T> {
    success: boolean;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    public url: any;
    public logoBase64: string;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = global.url;
        this.logoBase64 = this.base64();
    }

    getToken() {
        return this._userService.getToken();
    }

    createInvoice(invoice: any): Observable<any> {
        let params = JSON.stringify(invoice);
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'create-invoice', params, {
            headers: headers,
        });
    }

    generateInvoice(invoice: any): Observable<any> {
        let params = JSON.stringify(invoice);
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'generate-invoice', params, {
            headers: headers,
        });
    }

    getInvoiceByOwner(id: string): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-invoices/' + id, {
            headers: headers,
        });
    }

    getInvoiceById(id: string): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application / pdf')
            .set('Authorization', token);

        return this._http.get(this.url + '/get-invoicesById/' + id, {
            headers: headers,
        });
    }

    getInvoiceByCondo(id: string, month: string = 'all'): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        let params = new HttpParams();
        if (month !== 'all') {
            params = params.set('month', month);
        }

        return this._http.get(this.url + 'get-invoicesByCondo/' + id, {
            headers,
            params,
        });
    }

    getInvoiceSummary(id: string): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'get-invoices-summary/' + id, {
            headers: headers,
        });
    }

    createPaymentIntent(payload: any): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'payments/intent', payload, {
            headers: headers,
        });
    }

    getPaymentProviders(): Observable<ProviderResponse<PaymentProvider[]>> {
        return this._http.get<ProviderResponse<PaymentProvider[]>>(this.url + 'payments/providers', {
            headers: new HttpHeaders().set('Authorization', this.getToken()),
        });
    }

    createPaymentProvider(name: string): Observable<ProviderResponse<PaymentProvider>> {
        return this._http.post<ProviderResponse<PaymentProvider>>(this.url + 'payments/providers', { name }, {
            headers: new HttpHeaders().set('Authorization', this.getToken()),
        });
    }

    deletePaymentProvider(id: string): Observable<ProviderResponse<{ _id: string }>> {
        return this._http.delete<ProviderResponse<{ _id: string }>>(this.url + 'payments/providers/' + encodeURIComponent(id), {
            headers: new HttpHeaders().set('Authorization', this.getToken()),
        });
    }

    getPaymentTransactions(filters: any = {}): Observable<any> {
        return this.getPaymentMonitorData('transactions', filters);
    }

    getPaymentMonitorData<T>(resource: 'transactions' | 'monitor/options' | 'monitor/invoices', filters: object = {}): Observable<T> {
        let token = this.getToken();
        let headers = new HttpHeaders().set('Authorization', token);
        let params = new HttpParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this._http.get<T>(this.url + 'payments/' + resource, {
            headers,
            params,
        });
    }

    getCommunicationLogs(filters: any = {}): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders().set('Authorization', token);
        let params = new HttpParams();

        Object.keys(filters || {}).forEach((key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        return this._http.get(this.url + 'payments/communications', {
            headers,
            params,
        });
    }

    runPaymentReminderJob(payload: any): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'payments/reminders/run', payload, {
            headers,
        });
    }

    reconcilePaymentTransaction(
        transactionId: string,
        payload: any
    ): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.patch(
            this.url +
                'payments/transactions/' +
                transactionId +
                '/reconciliation',
            payload,
            { headers }
        );
    }

    importPaymentReconciliation(payload: {
        provider: string;
        rows: any[];
    }): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(
            this.url + 'payments/reconciliation/import',
            payload,
            { headers }
        );
    }

    sendInvoiceWhatsappReminder(
        invoiceId: string,
        payload: any
    ): Observable<any> {
        let token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(
            this.url + 'payments/invoices/' + invoiceId + '/whatsapp-reminder',
            payload,
            { headers }
        );
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

    genGroupPDF(
        alias: string,
        invoices: any[],
        logoBase64: string = this.logoBase64
    ) {
        try {
            const totalAmount = invoices.reduce(
                (sum, invoice) => sum + (Number(invoice.invoice_amount) || 0),
                0
            );

            const docDefinition = {
                content: [
                    {
                        image: logoBase64,
                        width: 50,
                        height: 50,
                        alignment: 'left',
                    },
                    { text: 'INVOICE SUMMARY', style: 'header' },
                    { text: `CONDOMINIUM: ${alias}`, style: 'subheader' },
                    {
                        text: `Total invoices: ${invoices.length}`,
                        style: 'bodyStyle',
                    },
                    {
                        text: `Total amount: ${totalAmount}`,
                        style: 'bodyStyle',
                    },
                    {
                        table: {
                            body: [
                                [
                                    'Owner',
                                    'Unit',
                                    'Issue Date',
                                    'Amount',
                                    'Status',
                                    'Payment Status',
                                ],
                                ...invoices.map((invoice) => [
                                    invoice.fullname,
                                    invoice.unit,
                                    invoice.invoice_issue,
                                    invoice.invoice_amount,
                                    invoice.invoice_status,
                                    invoice.paymentStatus,
                                ]),
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

            pdfMake.createPdf(docDefinition).download(`invoices_${alias}.pdf`);
        } catch (error) {
            console.log(error);
        }
    }
}
