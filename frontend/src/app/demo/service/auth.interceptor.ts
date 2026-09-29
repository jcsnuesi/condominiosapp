import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpResponse,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private _cookies: CookieService, private _router: Router) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const token = this._cookies.get('token');
        const authRequest =
            token &&
            !request.headers.has('Authorization') &&
            !request.headers.has('authorization')
                ? request.clone({
                      setHeaders: {
                          Authorization: token,
                      },
                  })
                : request;

        return next.handle(authRequest).pipe(
            map((event: HttpEvent<unknown>) => {
                if (event instanceof HttpResponse) {
                    const normalizedBody = this.normalizeApiBody(event.body);

                    if (normalizedBody !== event.body) {
                        return event.clone({ body: normalizedBody });
                    }
                }

                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.clearAuthState();
                    this._router.navigate(['auth/login']);
                }

                return throwError(() => error);
            })
        );
    }

    private clearAuthState(): void {
        this._cookies.delete('identity');
        this._cookies.delete('token');
        this._cookies.delete('identity', '/');
        this._cookies.delete('token', '/');
        this._cookies.delete('access_context');
        this._cookies.delete('access_context', '/');
    }

    private normalizeApiBody(body: unknown): unknown {
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return body;
        }

        const payload = body as Record<string, any>;

        if (typeof payload['success'] === 'boolean') {
            const success = payload['success'];
            return {
                ...payload,
                status:
                    typeof payload['status'] === 'string'
                        ? payload['status']
                        : success
                        ? 'success'
                        : 'error',
                message:
                    typeof payload['message'] === 'string'
                        ? payload['message']
                        : success
                        ? payload?.['data']?.message || ''
                        : payload?.['error']?.message ||
                          payload?.['error']?.detail ||
                          '',
            };
        }

        if (typeof payload['status'] === 'string') {
            const success = payload['status'].toLowerCase() === 'success';
            const data = payload['data'] ?? payload['message'] ?? null;

            return {
                ...payload,
                success,
                data,
                error: success
                    ? payload['error'] ?? null
                    : payload['error'] ?? {
                          message: payload['message'] || 'Request failed',
                      },
                code:
                    payload['code'] ||
                    (success ? 'REQUEST_OK' : 'REQUEST_ERROR'),
            };
        }

        return body;
    }
}
