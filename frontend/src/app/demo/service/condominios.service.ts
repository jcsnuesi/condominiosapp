import { Injectable, EventEmitter, Output } from "@angular/core";
import { global } from "./global.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class CondominioService {

    public url:any;
     
 
    constructor(private _http:HttpClient){
        
        this.url = global.url

    }

       
    createCondominium(token:string, condominio:any):Observable<any>{


        let header = new HttpHeaders().set('Authorization', token);

        return this._http.post(this.url + 'create-condominio', condominio,{headers:header})
    }
 
    getPropertyByAdminId(token: string, id: string): Observable<any> {

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.get(this.url + 'condominioByAdmin/' + id, { headers: header })
    }

    getPropertyByOwner(token: string): Observable<any> {

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.get(this.url + 'condominioByOwner' ,{ headers: header })
    }

    getBuilding(id:string, token:string):Observable<any>{

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
 
        return this._http.get(this.url + 'buildingDetail/'+id, {headers:header})
    }

    createOwner(token: string, ownerProfile: FormData):Observable<any>{
        let header = new HttpHeaders().set('Authorization', token);
   
        
        return this._http.post(this.url + 'create-owner', ownerProfile, {headers:header})
    }

    updateCondominium(token:string, condominio:any):Observable<any>{

        let params = JSON.stringify(condominio);
      
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.put(this.url + 'updateCondominio', params,{headers:header})
    }

    
}