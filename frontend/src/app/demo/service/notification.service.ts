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
export class NotificationService {
    private apiUrl = global.url;

    constructor(private http: HttpClient) {}

    // ============ INQUIRY METHODS ============

    createInquiry(inquiry: any, token: string): Observable<ApiResponse<any>> {
        let header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}/create-inquiry`,
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

    getInquiryDetails(inquiryId: string): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}inquiries/${inquiryId}`
            // { headers: this.getHeaders() }
        );
    }

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

    markNoticeAsRead(noticeId: string): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}notices/${noticeId}/read`,
            {}
            //    { headers: this.getHeaders() }
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

    createNotice(notice: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}admin/notices`,
            notice
            //    { headers: this.getHeaders() }
        );
    }
}
