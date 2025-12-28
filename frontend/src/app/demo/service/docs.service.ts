import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class DocsService {
    private readonly baseUrl = `${global.url || ''}docs`;

    constructor(private http: HttpClient) {}

    /**
     * GET /getDirectory/:id
     * Returns the list of files for the given address/directory id.
     */
    getDirectory(token: string, id: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get(`${this.baseUrl}/getDirectories/${id}`, {
            headers,
        });
    }

    /**
     * GET /getDocsByName/:id/:file
     * Retrieves a file by its path (id + filename) as Blob for preview/download.
     */
    openFileByPath(id: string, file: string): Observable<Blob> {
        return this.http.get(
            `${this.baseUrl}/getDocsByName/${encodeURIComponent(
                id
            )}/${encodeURIComponent(file)}`,
            {
                responseType: 'blob',
            }
        );
    }

    /**
     * POST /createDoc
     * Uploads a new document. FormData must include:
     * - id (directory/address id)
     * - type (document type)
     * - description (optional)
     * - file (the actual file)
     */
    createDoc(
        token: string,
        formData: FormData
    ): Observable<{ status: string; message: any }> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.post<{
            status: string;
            message: any;
        }>(`${this.baseUrl}/createDoc`, formData, { headers });
    }

    /**
     * DELETE /deleteDoc
     * Deletes a file by name. Backend expects body with { id, file }.
     */
    deleteDoc(payload: {
        id: string;
        file: string;
    }): Observable<{ ok: boolean; message?: string }> {
        return this.http.request<{ ok: boolean; message?: string }>(
            'DELETE',
            `${this.baseUrl}/deleteDoc`,
            {
                body: payload,
            }
        );
    }

    downloadFile(
        token: string,
        id: string,
        filename: string
    ): Observable<Blob> {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get(
            `${this.baseUrl}/getDocsByName/${id}/${filename}`,
            {
                headers,
                responseType: 'blob',
            }
        );
    }

    // ===== Compatibility wrappers for component =====

    /** Adapter: upload document */
    uploadDocument(
        token: string,
        fd: FormData
    ): Observable<{ status: string; message: any }> {
        return this.createDoc(token, fd);
    }

    /** Placeholder: update metadata (not implemented in backend) */
    updateDocument(_id: string, _payload: unknown): Observable<never> {
        throw new Error('updateDocument route not implemented on backend');
    }

    /** Adapter: delete document using id + filename */
    deleteDocument(
        id: string,
        filename: string
    ): Observable<{ ok: boolean; message?: string }> {
        return this.deleteDoc({ id, file: filename });
    }
}
