import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { CookieService } from 'ngx-cookie-service';

interface BookingCounts {
    total: number;
    expiringToday: number;
}

interface BookingCountsResponse {
    success?: boolean;
    status?: string;
    data?: BookingCounts;
    total?: number;
    expiringToday?: number;
}

@Injectable({
    providedIn: 'root',
})
export class BookingServiceService {
    public url: string;
    constructor(
        private _http: HttpClient,
        private _cookieService: CookieService
    ) {
        this.url = global.url;
    }

    createBooking(booking: any): Observable<any> {
        let params = JSON.stringify(booking);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookieService.get('token'));
        return this._http.post(this.url + 'create-booking', params, {
            headers: headers,
        });
    }

    getBooking(id: any): Observable<any> {
        let headers = new HttpHeaders().set(
            'Authorization',
            this._cookieService.get('token')
        );

        return this._http.get(
            this.url + 'get-bookings/' + id,

            {
                headers: headers,
            }
        );
    }

    getBookingCount(id: string): Observable<BookingCountsResponse> {
        let token = this._cookieService.get('token');
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'get-bookings-count/' + id, {
            headers,
        });
    }

    update(booking: any): Observable<any> {
        let params = JSON.stringify(booking);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookieService.get('token'));
        return this._http.put(this.url + 'update-booking/', params, {
            headers: headers,
        });
    }

    deleteReservations(ids: string[]): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookieService.get('token'));

        return this._http.delete(this.url + 'deleteReservations', {
            headers,
            body: { ids },
        });
    }
}
