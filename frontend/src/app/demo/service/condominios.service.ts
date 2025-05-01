import { Injectable, EventEmitter, Output } from '@angular/core';
import { global } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CondominioService {
    public url: any;

    constructor(private _http: HttpClient) {
        this.url = global.url;
    }

    createCondominium(token: string, condominio: any): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.post(this.url + 'create-condominio', condominio, {
            headers: header,
        });
    }

    getPropertyByAdminId(token: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'condominioByAdmin', {
            headers: header,
        });
    }

    getBuilding(id: string, token: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'buildingDetail/' + id, {
            headers: header,
        });
    }

    createOwner(token: string, ownerProfile: FormData): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.post(this.url + 'create-owner', ownerProfile, {
            headers: header,
        });
    }

    updateCondominium(
        token: string,
        condominioInfo: FormData
    ): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(this.url + 'updateCondominio', condominioInfo, {
            headers: header,
        });
    }

    deletePropertyWithAuth(token: string, id: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(
            this.url + 'admin-deleteProperty/' + id,
            {},
            {
                headers: header,
            }
        );
    }

    getUnits(token: string, id: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'getUnits/' + id, {
            headers: header,
        });
    }

    getProperties(token: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-properties', {
            headers: header,
        });
    }
}
