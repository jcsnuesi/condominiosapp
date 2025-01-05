import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class OwnerServiceService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = global.url;
    }

    login(user: any, token: boolean): Observable<any> {
        if (token) {
            user.gettoken = true;
        }

        let param = JSON.stringify(user);
        let header = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login-user', param, {
            headers: header,
        });
    }

    updateOwner(token: string, owner: FormData): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(this.url + 'update-owner', owner, {
            headers: header,
        });
    }

    deactivateOwner(
        token: string,
        owner: { _id: string; status: string }
    ): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(this.url + 'deactivate-owner', owner, {
            headers: header,
        });
    }

    // Get all logged user's properties
    getPropertyByOwner(token: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'condominioByOwnerId', {
            headers: header,
        });
    }
}
