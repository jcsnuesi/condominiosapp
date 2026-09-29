import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class FamilyServiceService {
    public url: string;

    constructor(
        private _http: HttpClient,
        private _cookieService: CookieService
    ) {
        this.url = global.url;
    }

    // Family methods

    createFamily(family: FormData): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        family.forEach((value, key) => {
            console.log(key, value);
        });
        return this._http.post(this.url + 'create-family', family, {
            headers: header,
        });
    }

    getFamilies(): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.get(this.url + 'get-family', { headers: header });
    }

    getFamiliesById(id): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.get(this.url + 'family-member-details/' + id, {
            headers: header,
        });
    }

    getFamiliesByOwnerId(id: string): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.get(this.url + 'get-familyMembers/' + id, {
            headers: header,
        });
    }
    getFamiliesByCondoId(id: string): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.get(this.url + 'familyMembers-byCondo/' + id, {
            headers: header,
        });
    }

    updateFamilyMember(info: FormData): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.put(this.url + 'update-family-member', info, {
            headers: header,
        });
    }

    updateFamilyAuth(info: any): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookieService.get('token'));

        return this._http.put(this.url + 'update-family-auth', info, {
            headers: header,
        });
    }

    deleteFamilyMember(id: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookieService.get('token'));

        return this._http.put(this.url + 'delete-family-member/' + id, null, {
            headers: header,
        });
    }

    // End - Family methods
}
