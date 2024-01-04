import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { global } from "./global.service";

@Injectable()
export class UserService{

    public url:string;
    public identity:any;
    public token:string;


    constructor(private _http: HttpClient){

        this.url = global.url

    }


    create(user:FormData, token:string):Observable<any>{

        let header = new HttpHeaders().set('Authorization',token)
      
        return this._http.post(this.url + 'createAccount', user,{headers:header})


    }

    admins(token:string):Observable<any>{

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
