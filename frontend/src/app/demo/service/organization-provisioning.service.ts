import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from './global.service';

export interface OrganizationAddress {
    city: string;
    state: string;
    country: string;
    [key: string]: string;
}

export interface OrganizationProvisionRequest {
    organization: {
        name: string;
        email: string;
        rnc?: string;
        phone?: string[];
        address?: OrganizationAddress;
    };
    admin: {
        email: string;
        password: string;
    };
}

export interface ProvisionedOrganization {
    _id: string;
    name: string;
    status: string;
}

export interface OrganizationProvisionResponse {
    status: 'success' | 'error';
    message: {
        organization: ProvisionedOrganization;
    };
}

@Injectable({ providedIn: 'root' })
export class OrganizationProvisioningService {
    constructor(private readonly http: HttpClient) {}

    provision(payload: OrganizationProvisionRequest): Observable<OrganizationProvisionResponse> {
        return this.http.post<OrganizationProvisionResponse>(`${global.url}organizations`, payload);
    }
}
