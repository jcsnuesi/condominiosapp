import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class FamilyServiceService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = global.url;
    }

    // Family methods

    createFamily(token: string, family: FormData): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        family.forEach((value, key) => {
            console.log(key, value);
        });
        return this._http.post(this.url + 'create-family', family, {
            headers: header,
        });
    }

    getFamilies(token: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'get-family', { headers: header });
    }

    getFamiliesById(token: string, id): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'family-member-details/' + id, {
            headers: header,
        });
    }

    getFamiliesByOwnerId(token: string, id: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'get-familyMembers/' + id, {
            headers: header,
        });
    }

    updateFamilyAuth(token: string, info: any): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'update-family-auth', info, {
            headers: header,
        });
    }

    // End - Family methods
}
