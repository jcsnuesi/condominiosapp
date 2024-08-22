import { Injectable } from "@angular/core";
import { global } from "./global.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class InvoiceService {

    public url:any;
     

    constructor(private _http:HttpClient){
        
        this.url = global.url

    }

       
    createInvoice(token:string, invoice:any):Observable<any>{

        let params = JSON.stringify(invoice);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);

        return this._http.post(this.url + 'create-invoice', params, {headers:headers});

    }

    generateInvoice(token:string, invoice:any):Observable<any>{
            
            let params = JSON.stringify(invoice);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
    
        return this._http.post(this.url + 'generate-invoice', params, { headers: headers });
    }

}