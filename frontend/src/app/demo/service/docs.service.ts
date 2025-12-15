import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';

@Injectable({
    providedIn: 'root',
})
export class DocsService {
    private readonly baseUrl = `${global.url || ''}/docs`;

    constructor(private http: HttpClient) {}

    /**
     * GET /getDirectory/:id
     * Returns the list of files for the given address/directory id.
     */
    getDirectory(id: string): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.baseUrl}/getDirectory/${encodeURIComponent(id)}`
        );
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
        formData: FormData
    ): Observable<{ ok: boolean; message?: string; filePath?: string }> {
        return this.http.post<{
            ok: boolean;
            message?: string;
            filePath?: string;
        }>(`${this.baseUrl}/createDoc`, formData);
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

    // ===== Compatibility wrappers for component =====

    /** Adapter for component usage: list documents for a directory */
    getDocuments(options?: { directoryId?: string }): Observable<string[]> {
        const directoryId = options?.directoryId || 'default';
        return this.getDirectory(directoryId);
    }

    /** Adapter: upload document */
    uploadDocument(
        fd: FormData
    ): Observable<{ ok: boolean; message?: string; filePath?: string }> {
        return this.createDoc(fd);
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
