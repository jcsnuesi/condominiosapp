import { Injectable } from "@angular/core";
import { global } from "./global.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Injectable()
export class InvoiceService {

    public url:any;
     

    constructor(
        private _http:HttpClient
    ){
        
        this.url = global.url

    }

       
    createInvoice(token:string, invoice:any):Observable<any>{

    
        let params =  JSON.stringify(invoice);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'create-invoice', params, {headers:headers});

    }

    generateInvoice(token:string, invoice:any):Observable<any>{
            
            let params = JSON.stringify(invoice);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
    
        return this._http.post(this.url + 'generate-invoice', params, { headers: headers });
    } 

    getInvoiceByOwner(token:string, id:string):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);

        return this._http.get(this.url + 'get-invoices/'+id, {headers:headers});

    }

    getInvoiceById(token:string, id:string):Observable<any>{
        
        let headers = new HttpHeaders()
            .set('Content-Type', 'application / pdf')
                                    .set('Authorization', token);

        return this._http.get(this.url + '/get-invoicesById/'+id, {headers:headers});
    }

    getInvoiceByCondo(token:string, id:string):Observable<any>{
            
            let headers = new HttpHeaders().set('Authorization', token);
    
            return this._http.get(this.url + 'get-invoicesByCondo/'+id, {headers:headers});
    }

    genPDF(data:any, logoBase64:string){ {
        
        let alias = (typeof data.condominiumId.alias === 'string') ? data.condominiumId.alias : 'null';
        let dateIssue = new Date(data.invoice_issue).toDateString();
        let dateDue = new Date(data.invoice_due).toDateString();
        let ownerFullname = (typeof data.ownerId.ownerName === 'string') && (typeof data.ownerId.lastname === 'string') ? `${data.ownerId.ownerName} ${data.ownerId.lastname}`: 'null';
        let unit = (typeof data.unit === 'string') ? data.unit : 'null';

        let docDefinition = {

            content: [
                {
                    image: logoBase64,
                    width: 50,
                    height: 50,
                    alignment: 'left'
                },

                { text: 'INVOICE', style: 'header' },
                { text: `CONDOMINIUM: ${alias}` , style: 'subheader' },
                { text: `Invoice issue: ${dateIssue}`, style: 'bodyStyle' },
                { text: `Invoice due:${dateDue} `, style: 'bodyStyle' },

                {
                    table: {
                        body: [

                            ['Fullname', 'Phone', 'Email', 'Unit', 'Status'],
                            [
                                ownerFullname,
                                data.ownerId.phone, 
                                data.ownerId.email,
                                unit,
                                data.invoice_status],
                        ],
                    },

                },
                { text: 'Payment Details', style: 'subheader' },
                {
                    table: {
                        body: [
                            ['Description', 'Qty', 'Amount', 'Total'],
                            [
                                'Condominium Fee', 1, data.invoice_amount, data.invoice_amount
                            ]


                        ]
                    },

                }
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 14,
                    margin: [0, 15, 0, 0]
                },

                bodyStyle: {
                    fontSize: 12,
                    margin: [0, 15, 0, 0]

                }
            }
        }

        pdfMake.createPdf(docDefinition).open();

    }
}

}