import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class OwnerServiceService {
    public url: string;
    constructor(private _http: HttpClient, private _cookies: CookieService) {
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

    updateOwner(owner: FormData): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this._http.put(this.url + 'update-owner', owner, {
            headers: header,
        });
    }

    deactivateOwner(owner: {
        _id: string;
        condoId: string;
        status: string;
        ishome?: boolean;
    }): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        let isHome = owner.ishome ? owner.ishome : false;
        return this._http.put(
            this.url + 'deactivate-owner',
            { ...owner, ishome: isHome },
            {
                headers: header,
            }
        );
    }

    // Get all logged user's properties
    getPropertyByOwner(id: string): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this._http.get(this.url + 'condominioByOwnerId/' + id, {
            headers: header,
        });
    }

    getOwnerAssets(id: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'))
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache');

        return this._http.get(
            this.url + 'get-assets-by-owner/' + encodeURIComponent(id),
            {
                headers: header,
            }
        );
    }

    addUnitToOwner(data: any): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));

        return this._http.put(this.url + 'add-new-owner-unit', data, {
            headers: header,
        });
    }
    updateUnitToOwner(data: any): Observable<any> {
        let datos = JSON.stringify(data);

        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));
        return this._http.put(this.url + 'update-owner-unit', datos, {
            headers: header,
        });
    }

    deleteUnitToOwner(data: {
        propertyId: string;
        ownerId: string;
        unit: string;
    }): Observable<any> {
        let params = JSON.stringify(data);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));

        return this._http.put(this.url + 'delete-owner-unit', params, {
            headers: header,
        });
    }

    // getAllOwners(createdBy: string): Observable<any> {
    //     let header = new HttpHeaders().set(
    //         'Authorization',
    //         this._cookies.get('token')
    //     );

    //     return this._http.get(this.url + 'get-all-owners/' + createdBy, {
    //         headers: header,
    //     });
    // }

    getOwnerByIdOrEmail(data: string): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        const identifier = encodeURIComponent(data.trim());

        return this._http.get(
            this.url + 'get-owner-by-id-or-email/' + identifier,
            {
                headers: header,
            }
        );
    }

    createOwner(ownerProfile: FormData): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this._http.post(this.url + 'create-owner', ownerProfile, {
            headers: header,
        });
    }

    createMultipleUnitsOwners(data: any): Observable<any> {
        let params = JSON.stringify(data);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));
        return this._http.post(this.url + 'create-multiple-owner', params, {
            headers: header,
        });
    }

    getAllOwners(createdBy: string): Observable<any> {
        let header = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this._http.get(this.url + 'get-all-owners/' + createdBy, {
            headers: header,
        });
    }
}
