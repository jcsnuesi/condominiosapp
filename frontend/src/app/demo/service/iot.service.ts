import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';

export type IoTScopeType =
    | 'CONDOMINIUM_UNIT'
    | 'PERSONAL_RESIDENCE'
    | 'COMMON_AREA';
export type IoTDeviceType =
    | 'LIGHT'
    | 'AIR_CONDITIONER'
    | 'SMART_LOCK'
    | 'WATER_SENSOR'
    | 'ENERGY_METER'
    | 'WATER_PUMP';

export interface IoTContext {
    scopeType: IoTScopeType;
    condominiumId?: string;
    unitId?: string;
    ownerId?: string;
    residenceId?: string;
    label: string;
    deviceCount: number;
    plan: string | null;
    deviceLimit: number;
    deviceUsage: number;
    remainingDevices: number;
    status: string;
}

export interface IoTDevice {
    id: string;
    displayName: string;
    deviceType: IoTDeviceType;
    protocol?: 'AWS_SHADOW' | 'ZIGBEE' | 'ONVIF' | 'FRIGATE';
    gatewayId?: string | null;
    profileId?: string | null;
    profileVersion?: number | null;
    location: string;
    scopeType: IoTScopeType;
    status: 'PROVISIONING' | 'ACTIVE' | 'ERROR' | 'DELETING' | 'DELETED';
    connectivity: 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
    lastSeen: string | null;
    capabilities: string[];
    alerts: number;
    createdAt: string;
    awsThingName?: string;
    enabled?: boolean;
    shadow?: {
        reported: Record<string, unknown>;
        desired?: Record<string, unknown>;
        delta?: Record<string, unknown>;
        version: number;
        updatedAt: string | null;
    };
}

export interface IoTDashboard {
    total: number;
    online: number;
    offline: number;
    unknown: number;
    alerts: number;
    plan: string | null;
    deviceLimit: number;
    deviceUsage: number;
    remainingDevices: number;
    devices: IoTDevice[];
    recentAlerts: Array<{
        id: string;
        eventType: string;
        severity: string;
        status: string;
        deviceName: string;
        occurredAt: string;
    }>;
    recentActivity: Array<{
        id: string;
        action: string;
        success: boolean;
        createdAt: string;
    }>;
}

export interface IoTApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    code?: string;
    error?: { message?: string } | null;
    [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class IoTService {
    private readonly apiUrl = global.url;

    constructor(private readonly http: HttpClient) {}

    getContexts(): Observable<IoTApiResponse<{ contexts: IoTContext[] }>> {
        return this.http.get<IoTApiResponse<{ contexts: IoTContext[] }>>(
            `${this.apiUrl}iot/my/contexts`
        );
    }

    getDashboard(
        context: IoTContext
    ): Observable<IoTApiResponse<IoTDashboard>> {
        let params = new HttpParams().set('scopeType', context.scopeType);
        if (context.residenceId)
            params = params.set('residenceId', context.residenceId);
        if (context.condominiumId)
            params = params.set('condominiumId', context.condominiumId);
        if (context.unitId) params = params.set('unitId', context.unitId);
        return this.http.get<IoTApiResponse<IoTDashboard>>(
            `${this.apiUrl}iot/dashboard`,
            { params }
        );
    }

    createDevice(
        context: IoTContext,
        payload: {
            displayName: string;
            deviceType: IoTDeviceType;
            location: string;
            idempotencyKey: string;
        }
    ): Observable<IoTApiResponse<{ device: IoTDevice }>> {
        return this.http.post<IoTApiResponse<{ device: IoTDevice }>>(
            `${this.contextDevicesUrl(context)}`,
            payload
        );
    }

    controlDevice(
        deviceId: string,
        command: Record<string, string | number>
    ): Observable<IoTApiResponse<{ state: unknown }>> {
        return this.http.post<IoTApiResponse<{ state: unknown }>>(
            `${this.apiUrl}iot/devices/${encodeURIComponent(
                deviceId
            )}/commands`,
            command
        );
    }

    getDeviceState(
        deviceId: string
    ): Observable<IoTApiResponse<{ state: unknown }>> {
        return this.http.get<IoTApiResponse<{ state: unknown }>>(
            `${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}/state`
        );
    }

    updateDevice(
        deviceId: string,
        changes: Partial<
            Pick<IoTDevice, 'displayName' | 'location' | 'enabled'>
        >
    ): Observable<IoTApiResponse<{ device: IoTDevice }>> {
        return this.http.patch<IoTApiResponse<{ device: IoTDevice }>>(
            `${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}`,
            changes
        );
    }

    deleteDevice(
        deviceId: string
    ): Observable<IoTApiResponse<{ deleted: boolean }>> {
        return this.http.delete<IoTApiResponse<{ deleted: boolean }>>(
            `${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}`
        );
    }

    acknowledgeAlert(
        eventId: string
    ): Observable<IoTApiResponse<{ acknowledged: boolean }>> {
        return this.http.patch<IoTApiResponse<{ acknowledged: boolean }>>(
            `${this.apiUrl}iot/events/${encodeURIComponent(
                eventId
            )}/acknowledge`,
            {}
        );
    }

    createResidence(
        residenceLabel: string
    ): Observable<
        IoTApiResponse<{ residence: { id: string; label: string } }>
    > {
        return this.http.post<
            IoTApiResponse<{ residence: { id: string; label: string } }>
        >(`${this.apiUrl}iot/my/residences`, { residenceLabel });
    }

    registerPersonalOwner(input: {
        name: string;
        lastname: string;
        email: string;
        phone: string;
        password: string;
        residenceLabel: string;
    }): Observable<IoTApiResponse<unknown>> {
        return this.http.post<IoTApiResponse<unknown>>(
            `${this.apiUrl}iot/owners/register`,
            input
        );
    }

    resendPersonalOwnerVerification(email: string): Observable<IoTApiResponse<unknown>> {
        return this.http.post<IoTApiResponse<unknown>>(`${this.apiUrl}iot/owners/resend-verification`, { email });
    }

    private contextDevicesUrl(context: IoTContext): string {
        if (context.scopeType === 'PERSONAL_RESIDENCE' && context.residenceId) {
            return `${this.apiUrl}iot/my/residences/${encodeURIComponent(
                context.residenceId
            )}/devices`;
        }
        if (
            context.scopeType === 'CONDOMINIUM_UNIT' &&
            context.condominiumId &&
            context.unitId
        ) {
            return `${this.apiUrl}iot/condominiums/${encodeURIComponent(
                context.condominiumId
            )}/units/${encodeURIComponent(context.unitId)}/devices`;
        }
        if (context.scopeType === 'COMMON_AREA' && context.condominiumId) {
            return `${this.apiUrl}iot/condominiums/${encodeURIComponent(
                context.condominiumId
            )}/common-area/devices`;
        }
        throw new Error('IoT context is incomplete');
    }
}
