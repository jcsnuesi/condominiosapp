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
    getPropertyByOwner(token: string, id: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'condominioByOwnerId/' + id, {
            headers: header,
        });
    }

    getOwnerAssets(token: string, id: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-assets-by-owner/' + id, {
            headers: header,
        });
    }

    addUnitToOwner(token: string, data: any): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'add-new-owner-unit', data, {
            headers: header,
        });
    }
    updateUnitToOwner(token: string, data: any): Observable<any> {
        let datos = JSON.stringify(data);

        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.put(this.url + 'update-owner-unit', datos, {
            headers: header,
        });
    }

    deleteUnitToOwner(
        token: string,
        data: { propertyId: string; ownerId: string; unit: string }
    ): Observable<any> {
        let params = JSON.stringify(data);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'delete-owner-unit', params, {
            headers: header,
        });
    }

    getOwnerByIdOrEmail(token: string, data: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'get-owner-by-id-or-email/' + data, {
            headers: header,
        });
    }

    createMultipleUnitsOwners(token: string, data: any): Observable<any> {
        let params = JSON.stringify(data);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.post(this.url + 'create-multiple-owner', params, {
            headers: header,
        });
    }
}
