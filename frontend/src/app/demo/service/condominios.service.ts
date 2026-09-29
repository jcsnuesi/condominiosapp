import { Injectable, EventEmitter, Output } from '@angular/core';
import { global } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

export interface PermanentDeleteImpact {
    pendingInvoices: number;
    pendingInvoiceAmount: number;
    unitsToDeactivate: number;
    familyAccountsToUnlink: number;
    staffAccountsToDeactivate: number;
}

export interface PermanentDeleteImpactResponse {
    success: boolean;
    data?: {
        condominium: { id: string; alias: string; status: string };
        impact: PermanentDeleteImpact;
        invoicesArePreserved: boolean;
    };
    error?: { message?: string } | null;
}

export interface PermanentDeleteResponse {
    success: boolean;
    data?: {
        condominiumId: string;
        alias: string;
        impact: PermanentDeleteImpact;
        invoicesPreserved: boolean;
    };
    error?: { message?: string } | null;
}

@Injectable()
export class CondominioService {
    public url: any;

    constructor(private _http: HttpClient, private _userService: UserService) {
        this.url = global.url;
    }

    getToken() {
        return this._userService.getToken();
    }

    createCondominium(condominio: any): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.post(this.url + 'create-condominio', condominio, {
            headers: header,
        });
    }

    getPropertyByIdentifier(id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'condominioByAdmin/' + id, {
            headers: header,
        });
    }
    getCondoById(id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'condominioById/' + id, {
            headers: header,
        });
    }

    getBuilding(id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'buildingDetail/' + id, {
            headers: header,
        });
    }
    getCondoWithInvoice(id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.get(this.url + 'condoWithInvoice/' + id, {
            headers: header,
        });
    }

    inactiveOwnerFromCondo(
        idOwner: string,
        idCondo: string,
        status: string
    ): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(
            this.url +
                'deactivate-owner/' +
                idCondo +
                '/' +
                idOwner +
                '/' +
                status,

            {
                headers: header,
            }
        );
    }

    updateCondominium(condominioInfo: FormData, id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(
            this.url + 'updateCondominio/' + id,
            condominioInfo,
            {
                headers: header,
            }
        );
    }

    deletePropertyWithAuth(id: string): Observable<any> {
        let token = this.getToken();
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

    getPermanentDeleteImpact(
        condominiumId: string
    ): Observable<PermanentDeleteImpactResponse> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this.getToken()
        );

        return this._http.get<PermanentDeleteImpactResponse>(
            `${this.url}condominiums/${condominiumId}/permanent-delete-impact`,
            { headers }
        );
    }

    permanentlyDeleteProperty(
        condominiumId: string,
        password: string
    ): Observable<PermanentDeleteResponse> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this._http.delete<PermanentDeleteResponse>(
            `${this.url}condominiums/${condominiumId}/permanent`,
            { headers, body: { password } }
        );
    }

    getUnits(id: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'getUnits/' + id, {
            headers: header,
        });
    }

    getProperties(adminId: string): Observable<any> {
        let token = this.getToken();
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-properties/' + adminId, {
            headers: header,
        });
    }

    createMultipleCondo(data: any): Observable<any> {
        let token = this.getToken();
        let params = JSON.stringify(data);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'create-multiple-condo', params, {
            headers: header,
        });
    }
}
