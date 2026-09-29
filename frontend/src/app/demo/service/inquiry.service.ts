import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { global } from './global.service';

interface ApiResponse<T> {
    success: boolean;
    status: string;
    message: string;
    data?: T | null;
    error?: any;
    code?: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class InquiryService {
    private apiUrl = global.url;

    constructor(private http: HttpClient, private _cookies: CookieService) {}

    private normalizeResponse<T>(response: any): ApiResponse<T> {
        if (response && typeof response === 'object') {
            if (typeof response.success === 'boolean') {
                const success = response.success;
                const errorMessage =
                    response?.error?.message ||
                    response?.error?.detail ||
                    response?.message ||
                    '';

                return {
                    success,
                    status: success ? 'success' : 'error',
                    message: success
                        ? response?.data?.message || ''
                        : errorMessage,
                    data: response.data ?? null,
                    error: response.error ?? null,
                    code: response.code,
                };
            }

            if (typeof response.status === 'string') {
                const success = response.status.toLowerCase() === 'success';

                return {
                    success,
                    status: response.status,
                    message:
                        typeof response.message === 'string'
                            ? response.message
                            : success
                            ? ''
                            : response?.error?.message || '',
                    data: response.data ?? response.message ?? null,
                    error: response.error ?? null,
                    code: response.code,
                };
            }
        }

        return {
            success: false,
            status: 'error',
            message: 'Invalid API response',
            data: null,
            error: { message: 'Invalid API response' },
        };
    }

    // ============ INQUIRY METHODS ============

    createInquiry(inquiry: any): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));
        return this.http
            .post<any>(`${this.apiUrl}create-inquiry`, inquiry, {
                headers: header,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    getOwnerInquiries(id: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .get<any>(`${this.apiUrl}inquiries/${id}`, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    // getInquiryDetails(inquiryId: string): Observable<ApiResponse<any>> {
    //     return this.http.get<ApiResponse<any>>(
    //         `${this.apiUrl}inquiries/${inquiryId}`
    //         // { headers: this.getHeaders() }
    //     );
    // }

    addInquiryResponse(responseData: any): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));
        return this.http
            .post<any>(`${this.apiUrl}inquiries/response`, responseData, {
                headers: header,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    updateInquiryStatus(
        inquiryId: string,
        status: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .patch<any>(
                `${this.apiUrl}inquiries/${inquiryId}/status`,
                {
                    status,
                },
                { headers }
            )
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    // ============ NOTICE METHODS ============

    getCondominiumNotices(condominiumId: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .get<any>(
                `${this.apiUrl}notification-by-condominium/${condominiumId}`,
                { headers: headers }
            )
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    getNoticeDetails(noticeId: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .get<any>(`${this.apiUrl}notices/${noticeId}`, { headers })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    markNoticeAsRead(noticeId: string): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));
        return this.http
            .put<any>(
                `${this.apiUrl}notices-read/${noticeId}`,
                { read: true },
                { headers: header }
            )
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    markAllNoticesAsRead(): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .patch<any>(`${this.apiUrl}notices/mark-all-read`, {}, { headers })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    // ============ ADMIN METHODS (if needed) ============

    getCondominiumInquiries(
        condominiumId: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .get<any>(`${this.apiUrl}inquiries/${condominiumId}`, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    /**
     * Crea un nuevo notice oficial (solo admins)
     * @param noticeData Datos del notice a crear
     * @returns Observable con la respuesta del servidor
     */
    createNotice(noticeData: FormData): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this.http
            .post<any>(`${this.apiUrl}create-notification`, noticeData, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    /**
     * Actualiza un notice existente
     * @param noticeId ID del notice
     * @param updateData Datos a actualizar
     *
     * @returns Observable con la respuesta
     */
    updateNotice(updateData: FormData): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this.http
            .put<any>(`${this.apiUrl}update-notices`, updateData, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    deleteAttachment(filename: {}): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._cookies.get('token'));

        return this.http
            .put<any>(`${this.apiUrl}delete-attachment`, filename, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    downloadNoticeAttachment(filename: string): Observable<Blob> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http.get(
            `${this.apiUrl}notifications/file/${encodeURIComponent(filename)}`,
            { headers, responseType: 'blob' }
        );
    }

    /**
     * Elimina (desactiva) un notice
     * @param noticeId ID del notice
     * @param token Token de autenticación
     * @returns Observable con la respuesta
     */
    deleteNotice(noticeId: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );

        return this.http
            .delete<any>(`${this.apiUrl}notices/${noticeId}`, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    /**
     * Crea un nuevo inquiry con archivos adjuntos
     * @param formData FormData con inquiry y archivos
     * @param token Token de autenticación
     * @returns Observable con la respuesta
     */
    createInquiryWithFiles(formData: FormData): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        // NO establecer Content-Type, FormData lo hace automáticamente

        return this.http
            .post<any>(`${this.apiUrl}create-inquiry`, formData, {
                headers: headers,
            })
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }

    // ← NUEVO: obtener usuarios del condominio para audiencias específicas
    getCondominiumUsers(condominiumId: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set(
            'Authorization',
            this._cookies.get('token')
        );
        return this.http
            .get<any>(
                `${this.apiUrl}get-usersby/condominiums/${condominiumId}`,
                { headers: headers }
            )
            .pipe(map((response) => this.normalizeResponse<any>(response)));
    }
}
