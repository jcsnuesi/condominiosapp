import { Injectable } from "@angular/core";
import { global } from "./global.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class CondominioService {

    public url:any;

    constructor(private _http:HttpClient){
        
        this.url = global.url

    }

    getBuilding(id:string, token:string):Observable<any>{

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.get(this.url + 'buildingDetail/'+id, {headers:header})
    }
}