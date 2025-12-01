import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { global } from './global.service';

interface ApiResponse<T> {
    status: string;
    message: string;
    data?: T;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class InquiryService {
    private apiUrl = global.url;

    constructor(private http: HttpClient) {}

    // ============ INQUIRY METHODS ============

    createInquiry(inquiry: any, token: string): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}create-inquiry`,
            inquiry,
            { headers: header }
        );
    }

    getOwnerInquiries(token: string, id: string): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}inquiries/${id}`,
            { headers: headers }
        );
    }

    // getInquiryDetails(inquiryId: string): Observable<ApiResponse<any>> {
    //     return this.http.get<ApiResponse<any>>(
    //         `${this.apiUrl}inquiries/${inquiryId}`
    //         // { headers: this.getHeaders() }
    //     );
    // }

    addInquiryResponse(
        responseData: any,
        token: string
    ): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}inquiries/response`,
            responseData,
            { headers: header }
        );
    }

    updateInquiryStatus(
        inquiryId: string,
        status: string
    ): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}inquiries/${inquiryId}/status`,
            { status }
            //    { headers: this.getHeaders() }
        );
    }

    // ============ NOTICE METHODS ============

    getCondominiumNotices(
        token: string,
        condominiumId: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}notification-by-condominium/${condominiumId}`,
            { headers: headers }
        );
    }

    getNoticeDetails(noticeId: string): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}notices/${noticeId}`
            //    { headers: this.getHeaders() }
        );
    }

    markNoticeAsRead(
        token: string,
        noticeId: string
    ): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.put<ApiResponse<any>>(
            `${this.apiUrl}notices-read/${noticeId}`,
            { read: true },
            { headers: header }
        );
    }

    markAllNoticesAsRead(): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}notices/mark-all-read`,
            {}
            //    { headers: this.getHeaders() }
        );
    }

    // ============ ADMIN METHODS (if needed) ============

    getCondominiumInquiries(
        token: string,
        condominiumId: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}inquiries/${condominiumId}`,
            { headers: headers }
        );
    }

    /**
     * Crea un nuevo notice oficial (solo admins)
     * @param noticeData Datos del notice a crear
     * @param token Token de autenticación
     * @returns Observable con la respuesta del servidor
     */
    createNotice(
        noticeData: FormData,
        token: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);

        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}create-notification`,
            noticeData,
            { headers: headers }
        );
    }

    /**
     * Actualiza un notice existente
     * @param noticeId ID del notice
     * @param updateData Datos a actualizar
     * @param token Token de autenticación
     * @returns Observable con la respuesta
     */
    updateNotice(
        noticeId: string,
        updateData: any,
        token: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}notices/${noticeId}`,
            updateData,
            { headers: headers }
        );
    }

    /**
     * Elimina (desactiva) un notice
     * @param noticeId ID del notice
     * @param token Token de autenticación
     * @returns Observable con la respuesta
     */
    deleteNotice(
        noticeId: string,
        token: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);

        return this.http.delete<ApiResponse<any>>(
            `${this.apiUrl}notices/${noticeId}`,
            { headers: headers }
        );
    }

    /**
     * Crea un nuevo inquiry con archivos adjuntos
     * @param formData FormData con inquiry y archivos
     * @param token Token de autenticación
     * @returns Observable con la respuesta
     */
    createInquiryWithFiles(
        formData: FormData,
        token: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);
        // NO establecer Content-Type, FormData lo hace automáticamente

        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}create-inquiry`,
            formData,
            { headers: headers }
        );
    }

    // ← NUEVO: obtener usuarios del condominio para audiencias específicas
    getCondominiumUsers(
        token: string,
        condominiumId: string
    ): Observable<ApiResponse<any>> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}get-usersby/condominiums/${condominiumId}`,
            { headers: headers }
        );
    }
}
