import { Injectable, EventEmitter, Output } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { global } from "./global.service";
import { CookieService } from "ngx-cookie-service";


@Injectable(
    { providedIn: 'root' }
)
export class UserService{

    public url:string;
    public static identity:any;
    public token:string;
    public cookieInfo:any;
    public static role: string;
 
    @Output() disparador: EventEmitter<string> = new EventEmitter<string>();
    @Output() customEvent: EventEmitter<string> = new EventEmitter<string>();


    constructor(
        private _http: HttpClient,
        private _cookies: CookieService){

        this.url = global.url

    }

   create(user:FormData, token:string):Observable<any>{

        let header = new HttpHeaders().set('Authorization',token)
      
        return this._http.post(this.url + 'createAccount', user,{headers:header})


    }

    login(user:any, token:boolean):Observable<any>{

      
        if (token) {
            
            user.gettoken = true
        }

        let param = JSON.stringify(user)

       
        let header = new HttpHeaders().set('Content-Type', 'application/json')

        return this._http.post(this.url + 'login', param, { headers: header })
    }

    getIdentity(){
  
        return JSON.parse(this._cookies.get('identity') ||  'false')

    }    

    getToken(){

        return this._cookies.get('token')
    }

    getSeverity(status: string) {

        switch (status.toLowerCase()) {

            case 'suspended':
                return 'danger';

            case 'active':
                return 'success';

        }

        return null;
    }

    dateFormat(date: string) {
        //2023-11-05T19:32:38.422Z
        var longDate = date.split(/[-T]/)

        var year = longDate[0]
        var month = longDate[1]
        var day = longDate[2]
        const fullDate = year + '-' + month + '-' + day

        return fullDate


    }

    getAdmins(token:string):Observable<any>{

        let header = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', token)

        return this._http.get(this.url + 'admins',{headers:header})
    }

    updateUser(token: string, user: FormData):Observable<any>{

        let header = new HttpHeaders().set('Authorization',token)

        return this._http.put(this.url + 'update-account', user,{headers:header})
    }

    deleteUser(token:string, user:any):Observable<any>{

        let param = JSON.stringify(user)

       
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token)

        return this._http.put(this.url + 'inactive-account', param, {headers:header})
    }

    reactiveAccount(token: string, info: any): Observable<any>{

        let params = JSON.stringify(info)
        let header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)

        return this._http.put(this.url + 'reactiveAccount', params, {headers:header})
    }

    

    
}
