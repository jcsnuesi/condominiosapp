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
    constructor(private readonly http: HttpClient) {}

    getCatalog(): Observable<ApiResponse<{ modules: Record<string, string[]>; permissions: string[] }>> {
        return this.http.get<ApiResponse<{ modules: Record<string, string[]>; permissions: string[] }>>(`${global.url}access/catalog`);
    }

    getPolicies(): Observable<ApiResponse<AccessPolicy[]>> {
        return this.http.get<ApiResponse<AccessPolicy[]>>(`${global.url}access/policies`);
    }

    createPolicy(policy: Pick<AccessPolicy, 'name' | 'description' | 'permissions'>): Observable<ApiResponse<AccessPolicy>> {
        return this.http.post<ApiResponse<AccessPolicy>>(`${global.url}access/policies`, policy);
    }

    updatePolicy(policy: AccessPolicy): Observable<ApiResponse<AccessPolicy>> {
        return this.http.put<ApiResponse<AccessPolicy>>(`${global.url}access/policies/${policy._id}`, policy);
    }

    archivePolicy(policyId: string): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${global.url}access/policies/${policyId}`);
    }

    getUsers(): Observable<ApiResponse<AdministrativeUser[]>> {
        return this.http.get<ApiResponse<AdministrativeUser[]>>(`${global.url}organization-users`);
    }

    saveGrant(user: AdministrativeUser, grant: AccessGrant): Observable<ApiResponse<AccessGrant>> {
        return this.http.put<ApiResponse<AccessGrant>>(
            `${global.url}access/grants/${user.subjectModel}/${user._id}`,
            grant
        );
    }

    getCondominiums(): Observable<ApiResponse<Array<{ _id: string; alias: string }>>> {
        return this.http.get<ApiResponse<Array<{ _id: string; alias: string }>>>(`${global.url}get-properties/current`);
    }
}
