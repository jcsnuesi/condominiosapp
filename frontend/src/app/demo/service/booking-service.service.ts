import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class BookingServiceService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = global.url;
    }

    createBooking(token: any, booking: any): Observable<any> {
        let params = JSON.stringify(booking);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.post(this.url + 'create-booking', params, {
            headers: headers,
        });
    }

    getBooking(token: any, id: any): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'get-bookings/' + id, {
            headers: headers,
        });
    }

    update(token: string, booking: any): Observable<any> {
        let params = JSON.stringify(booking);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.put(this.url + 'update-booking/', params, {
            headers: headers,
        });
    }
}
