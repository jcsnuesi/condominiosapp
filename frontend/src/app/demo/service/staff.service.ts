import { Injectable, EventEmitter, Output } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { global } from "./global.service";
import { CookieService } from "ngx-cookie-service";


@Injectable(
    { providedIn: 'root' }
)
export class StaffService{

    public url:string;
    public static identity:any;
    public token:string;
    public cookieInfo:any;
   
    constructor(
        private _http: HttpClient,
        private _cookies: CookieService){

        this.url = global.url

    }

    create(staff:FormData, token:string):Observable<any>{
        
        let header = new HttpHeaders()
                        .set('Authorization',token)
                    
        return this._http.post(this.url + 'create-staff', staff,{headers:header})


    }

    login(user:any, token:boolean):Observable<any>{

      
        if (token) {
            
            user.gettoken = true
        }

        let param = JSON.stringify(user)

       
        let header = new HttpHeaders().set('Content-Type', 'application/json')

        return this._http.post(this.url + 'login', param, { headers: header })
    }

    getIdentityStaff(){
  
        return JSON.parse(this._cookies.get('identity') ||  'false')

    }    

    getTokenStaff(){

        return this._cookies.get('token')
    }
    
    updateStaff(token: string, staff: any):Observable<any>{

        let header = new HttpHeaders()
            .set('Authorization', token)

        return this._http.put(this.url + 'update-staff', staff,{headers:header})
    }

    deleteStaff(token:string, user:any):Observable<any>{

        let param = JSON.stringify(user)

       
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token)

        return this._http.put(this.url + 'delete-staff', param, {headers:header})
    }

    reactiveStaff(token: string, info: any): Observable<any>{

        let params = JSON.stringify(info)
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.put(this.url + 'reactiveAccount', params, {headers:header})
    }

    getStaff(token: string, company_id:string): Observable<any>{

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)
       
        return this._http.get(this.url + 'staffs/'+ company_id, {headers:header})
    }

    verifyPassword(token: string, password: any): Observable<any>{
        let params = JSON.stringify(password)
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.post(this.url + 'verify-password-staff', params, {headers:header})
    }


    
}
