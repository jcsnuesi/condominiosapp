import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class UserService {
    public url: string;
    public static identity: any;
    public token: string;
    public cookieInfo: any;
    public static role: string;

    @Output() disparador: EventEmitter<string> = new EventEmitter<string>();
    @Output() customEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _http: HttpClient, private _cookies: CookieService) {
        this.url = global.url;
    }

    create(user: FormData, token: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.post(this.url + 'createAccount', user, {
            headers: header,
        });
    }

    isAdmin(): boolean {
        if (!this.getIdentity()?.role) {
            return false;
        }
        const adminRoles = ['ADMIN', 'STAFF_ADMIN'];
        return adminRoles.includes(this.getIdentity().role.toUpperCase());
        // return false;
    }

    login(user: any, token: boolean): Observable<any> {
        if (token) {
            user.gettoken = true;
        }

        let param = JSON.stringify(user);

        let header = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', param, { headers: header });
    }

    forgotPassword(email: string): Observable<any> {
        return this._http.post(
            this.url + 'forgot-password',
            JSON.stringify({ email }),
            {
                headers: new HttpHeaders().set(
                    'Content-Type',
                    'application/json'
                ),
            }
        );
    }

    resetPassword(token: string, password: string): Observable<any> {
        return this._http.post(
            this.url + 'reset-password',
            JSON.stringify({ token, password }),
            {
                headers: new HttpHeaders().set(
                    'Content-Type',
                    'application/json'
                ),
            }
        );
    }

    getIdentity() {
        return JSON.parse(this._cookies.get('identity') || 'false');
    }

    getToken() {
        return this._cookies.get('token');
    }

    getAuthenticatedProfile(): Observable<any> {
        return this._http.get(this.url + 'auth/me');
    }

    updateAuthenticatedProfile(profile: FormData): Observable<any> {
        return this._http.put(this.url + 'auth/me', profile);
    }

    changeAuthenticatedPassword(passwords: {
        currentPassword: string;
        newPassword: string;
    }): Observable<any> {
        return this._http.put(this.url + 'auth/me/password', passwords);
    }

    getAdmins(token: string): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('authorization', token);

        return this._http.get(this.url + 'admins', { headers: header });
    }

    // Get data for charts Dashboard
    getDashboardData(token: string, id: string): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);
        return this._http.get(this.url + 'get-owner-payments-stats/' + id, {
            headers: header,
        });
    }

    updateUser(token: string, user: FormData): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(this.url + 'update-account', user, {
            headers: header,
        });
    }
    updatePassword(token: string, user: any): Observable<any> {
        let header = new HttpHeaders().set('Authorization', token);

        return this._http.put(this.url + 'update-password', user, {
            headers: header,
        });
    }

    deleteUser(token: string, user: any): Observable<any> {
        let param = JSON.stringify(user);

        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'inactive-account', param, {
            headers: header,
        });
    }

    reactiveAccount(token: string, info: any): Observable<any> {
        let params = JSON.stringify(info);
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'reactiveAccount', params, {
            headers: header,
        });
    }

    addNewProperty(token: string, property: any): Observable<any> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.url + 'add-prop-family', property, {
            headers: header,
        });
    }
}
