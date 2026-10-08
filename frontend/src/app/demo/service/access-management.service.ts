import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessGrant, AccessPolicy } from '../models/access.model';
import { global } from './global.service';

export interface ApiResponse<T> {
    success?: boolean;
    status?: string;
    message?: T;
    data?: { message?: T } | T;
}

export function unwrapApiMessage<T>(response: ApiResponse<T>): T | undefined {
    if (response?.data && typeof response.data === 'object' && 'message' in response.data) {
        return (response.data as { message?: T }).message;
    }
    if (response?.data !== undefined && (typeof response.data !== 'object' || Array.isArray(response.data))) {
        return response.data as T;
    }
    return response?.message;
}

export interface AdministrativeUser {
    _id: string;
    subjectModel: 'Staff_Admin' | 'Staff';
    name: string;
    lastname: string;
    email: string;
    position: string;
    status: string;
    phone?: string;
    gender?: string;
    createdAt?: string;
    avatar?: string;
    condo_id?: string | { _id: string; alias: string } | null;
    accessGrant: AccessGrant | null;
}

@Injectable({ providedIn: 'root' })
export class AccessManagementService {
    organizationId: string | null = null;
    private endpoint(path: string): string {
        if (!this.organizationId) return `${global.url}${path}`;
        const base = `${global.url}platform/organizations/${encodeURIComponent(this.organizationId)}/access`;
        if (path === 'get-properties/current') return `${base}/condominiums`;
        if (path === 'organization-users') return `${base}/users`;
        return `${base}/${path.replace(/^access\//, '')}`;
    }
    constructor(private readonly http: HttpClient) {}

    getCatalog(): Observable<ApiResponse<{ modules: Record<string, string[]>; permissions: string[] }>> {
        return this.http.get<ApiResponse<{ modules: Record<string, string[]>; permissions: string[] }>>(this.endpoint('access/catalog'));
    }

    getPolicies(): Observable<ApiResponse<AccessPolicy[]>> {
        return this.http.get<ApiResponse<AccessPolicy[]>>(this.endpoint('access/policies'));
    }

    createPolicy(policy: Pick<AccessPolicy, 'name' | 'description' | 'permissions'>): Observable<ApiResponse<AccessPolicy>> {
        return this.http.post<ApiResponse<AccessPolicy>>(this.endpoint('access/policies'), policy);
    }

    updatePolicy(policy: AccessPolicy): Observable<ApiResponse<AccessPolicy>> {
        return this.http.put<ApiResponse<AccessPolicy>>(this.endpoint(`access/policies/${policy._id}`), policy);
    }

    archivePolicy(policyId: string): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(this.endpoint(`access/policies/${policyId}`));
    }

    getUsers(): Observable<ApiResponse<AdministrativeUser[]>> {
        return this.http.get<ApiResponse<AdministrativeUser[]>>(this.endpoint('organization-users'));
    }

    updateUserStatus(
        user: AdministrativeUser,
        status: 'active' | 'inactive'
    ): Observable<ApiResponse<AdministrativeUser>> {
        return this.http.patch<ApiResponse<AdministrativeUser>>(
            `${global.url}organization-users/${encodeURIComponent(user.subjectModel)}/${encodeURIComponent(user._id)}/status`,
            { status }
        );
    }

    deleteUserPermanently(
        user: AdministrativeUser
    ): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(
            `${global.url}organization-users/${encodeURIComponent(user.subjectModel)}/${encodeURIComponent(user._id)}`
        );
    }

    saveGrant(user: AdministrativeUser, grant: AccessGrant): Observable<ApiResponse<AccessGrant>> {
        return this.http.put<ApiResponse<AccessGrant>>(
            this.endpoint(`access/grants/${user.subjectModel}/${user._id}`),
            grant
        );
    }

    getCondominiums(): Observable<ApiResponse<Array<{ _id: string; alias: string }>>> {
        return this.http.get<ApiResponse<Array<{ _id: string; alias: string }>>>(this.endpoint('get-properties/current'));
    }
}
