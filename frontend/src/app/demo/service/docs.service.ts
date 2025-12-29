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

      deleteDoc(
        token: string,
        id: string
    ): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.delete<any>(`${this.baseUrl}/deleteDoc/${id}`, {
            headers,
         
        });
    }

    docCard(token: string, id: string): Observable<any> 
    {
        const headers = new HttpHeaders().set('Authorization', token);
        return this.http.get(`${this.baseUrl}/docCard/${id}`, {
            headers,
        });

    }

    deleteAttachment(payload: {
        token: string;
        id: string;
        filename: string;
        condoId: string;
    }): Observable<{ status: boolean; message: string }> {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', payload.token);
        return this.http.put<{ status: boolean; message: string }>(
            `${this.baseUrl}/deleteDoc`,
            payload,
            {
                headers,
            }
        );
    }

  
    deleteAllAttachments(
        token: string,
        payload: {
            id: string;
            filename: string;
            condoId: string;
        }[]
    ): Observable<{ status: boolean; message: string }> {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.put<{ status: boolean; message: string }>(
            `${this.baseUrl}/deleteAllAttachments`,
            JSON.stringify(payload),
            {
                headers: headers,
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

    updateDocument(
        token: string,
        id: string,
        payload: FormData
    ): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        return this.http.put<any>(`${this.baseUrl}/updateDoc/${id}`, payload, {
            headers,
        });
    }
}
