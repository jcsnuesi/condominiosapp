import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { IoTDevice, IoTDeviceType, IoTScopeType } from './iot.service';

export type IoTProtocol = 'AWS_SHADOW' | 'ZIGBEE' | 'ONVIF' | 'FRIGATE';
export type InventoryScope =
  | { scopeType: 'COMMON_AREA'; condominiumId: string }
  | { scopeType: 'CONDOMINIUM_UNIT'; condominiumId: string; unitId: string }
  | { scopeType: 'PERSONAL_RESIDENCE'; residenceId: string };

export interface InventoryResponse<T> {
  success: boolean;
  data: T | null;
  error: { message?: string } | null;
  code: string;
}

export interface IoTGateway {
  id: string;
  displayName: string;
  scopeType: IoTScopeType;
  hardwareModel: string;
  status: 'PROVISIONING' | 'ACTIVE' | 'ERROR' | 'REVOKED';
  adapters: IoTProtocol[];
  lastHeartbeatAt: string | null;
  agentVersion: string | null;
  configurationVersion: number;
  connectivity: 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
  health: {
    reportedConfigurationVersion: number;
    uptimeSeconds: number;
    spoolCommandCount: number;
    spoolAccountedBytes: number;
    spoolCapacityBytes: number;
    storageBlocked: boolean;
  } | null;
  createdAt: string;
}

export interface IoTProfileField {
  name: string;
  type: 'boolean' | 'number' | 'string';
  unit?: string;
  min?: number;
  max?: number;
  values?: string[];
}

export interface IoTDeviceProfile {
  id: string;
  key: string;
  version: number;
  manufacturer: string;
  model: string;
  protocol: IoTProtocol;
  deviceTypes: IoTDeviceType[];
  certification: 'CERTIFIED' | 'SUPPORTED' | 'EXPERIMENTAL' | 'UNSUPPORTED';
  commandFeedback: 'NONE' | 'DEVICE_REPORT';
  testedFirmware: string[];
  stateFields: IoTProfileField[];
  commandFields: IoTProfileField[];
}

export interface IoTCommandResult {
  id: string;
  deviceId: string;
  status: 'REQUESTED' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  expiresAt: string;
  dispatchedAt: string | null;
  acknowledgedAt: string | null;
  executedAt: string | null;
  confirmed: boolean;
  failureCode: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class IoTInventoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${global.url}iot`;

  listGateways(scope: InventoryScope, page: { limit?: number; after?: string } = {}): Observable<InventoryResponse<{ gateways: IoTGateway[]; nextCursor: string | null }>> {
    return this.http.get<InventoryResponse<{ gateways: IoTGateway[]; nextCursor: string | null }>>(`${this.url}/gateways`, { params: this.params({ ...scope, ...page }) });
  }

  registerGateway(input: { scope: InventoryScope; displayName: string; hardwareModel?: string; idempotencyKey: string }): Observable<InventoryResponse<{ gateway: IoTGateway }>> {
    return this.http.post<InventoryResponse<{ gateway: IoTGateway }>>(`${this.url}/gateways`, input);
  }

  getGateway(id: string): Observable<InventoryResponse<{ gateway: IoTGateway }>> {
    return this.http.get<InventoryResponse<{ gateway: IoTGateway }>>(`${this.url}/gateways/${encodeURIComponent(id)}`);
  }

  updateGateway(id: string, input: Partial<Pick<IoTGateway, 'displayName' | 'hardwareModel'>>): Observable<InventoryResponse<{ gateway: IoTGateway }>> {
    return this.http.patch<InventoryResponse<{ gateway: IoTGateway }>>(`${this.url}/gateways/${encodeURIComponent(id)}`, input);
  }

  listProfiles(filter: { protocol?: IoTProtocol; limit?: number; after?: string } = {}): Observable<InventoryResponse<{ profiles: IoTDeviceProfile[]; nextCursor: string | null }>> {
    return this.http.get<InventoryResponse<{ profiles: IoTDeviceProfile[]; nextCursor: string | null }>>(`${this.url}/profiles`, { params: this.params(filter) });
  }

  bindDevice(id: string, input: { gatewayId: string; profileId: string; bindingAddress: string }): Observable<InventoryResponse<{ device: IoTDevice }>> {
    return this.http.patch<InventoryResponse<{ device: IoTDevice }>>(`${this.url}/devices/${encodeURIComponent(id)}/binding`, input);
  }

  getCommand(commandId: string): Observable<InventoryResponse<{ command: IoTCommandResult }>> {
    return this.http.get<InventoryResponse<{ command: IoTCommandResult }>>(`${this.url}/commands/${encodeURIComponent(commandId)}`);
  }

  requestCommand(input: { deviceId: string; payload: Record<string, string | number>; idempotencyKey: string; ttlSeconds?: number }): Observable<InventoryResponse<{ command: IoTCommandResult }>> {
    return this.http.post<InventoryResponse<{ command: IoTCommandResult }>>(`${this.url}/commands`, input);
  }

  private params(values: Record<string, string | number | undefined>): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) params = params.set(key, String(value));
    }
    return params;
  }
}
