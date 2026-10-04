import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class StrService {
    private url = global.url;

    constructor(
        private http: HttpClient,
        private _cookieService: CookieService
    ) {}

    private authHeaders(): HttpHeaders {
        return new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );
    }

    listChannels(params?: {
        condoId?: string;
        status?: string;
        ownerId?: string;
    }): Observable<any> {
        const headers = this.authHeaders();
        const search = new URLSearchParams();

        if (params?.condoId) search.set('condoId', params.condoId);
        if (params?.status) search.set('status', params.status);
        if (params?.ownerId) search.set('ownerId', params.ownerId);

        const query = search.toString();
        const endpoint = `${this.url}rental-channels${
            query ? `?${query}` : ''
        }`;

        return this.http.get(endpoint, { headers });
    }

    upsertChannel(payload: any): Observable<any> {
        const headers = this.authHeaders().set(
            'Content-Type',
            'application/json'
        );
        return this.http.post(`${this.url}rental-channels`, payload, {
            headers,
        });
    }

    updateChannelStatus(channelId: string, status: string): Observable<any> {
        const headers = this.authHeaders().set(
            'Content-Type',
            'application/json'
        );
        return this.http.put(
            `${this.url}rental-channels/${channelId}/status`,
            { status },
            { headers }
        );
    }

    syncChannel(channelId: string): Observable<any> {
        const headers = this.authHeaders();
        return this.http.post(
            `${this.url}rental-channels/${channelId}/sync`,
            {},
            { headers }
        );
    }

    listConflicts(condoId: string, apartmentUnit?: string): Observable<any> {
        const headers = this.authHeaders();
        const query = apartmentUnit
            ? `?apartmentUnit=${encodeURIComponent(apartmentUnit)}`
            : '';

        return this.http.get(
            `${this.url}external-reservations/conflicts/${condoId}${query}`,
            {
                headers,
            }
        );
    }

    listExternalReservations(
        condoId: string,
        apartmentUnit?: string
    ): Observable<any> {
        const headers = this.authHeaders();
        const query = apartmentUnit
            ? `?apartmentUnit=${encodeURIComponent(apartmentUnit)}`
            : '';

        return this.http.get(
            `${this.url}external-reservations/${condoId}${query}`,
            {
                headers,
            }
        );
    }
}
