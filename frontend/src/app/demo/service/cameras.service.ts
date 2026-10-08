import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global.service';
import { InventoryResponse, InventoryScope } from './iot-inventory.service';

export interface Camera {
  equipment: CameraEquipment | null;
  motionStatus: 'UNVERIFIED' | 'CONFIRMED' | 'UNAVAILABLE';
  configurationVersion: number;
  id: string;
  displayName: string;
  scopeType: InventoryScope['scopeType'];
  gatewayId: string;
  protocol: 'RTSP' | 'ONVIF';
  recordingMode: 'NONE' | 'EVENT' | 'BUFFER';
  status: 'PROVISIONING' | 'ACTIVE' | 'DISABLED' | 'REVOKED';
  motionClipSeconds: number;
  retentionDays: number;
  createdAt: string;
}
export interface CameraContext { scope: InventoryScope; label: string; }
export interface CameraEquipment {
  manufacturer: string; model: string; firmware: string;
  sourceKind: 'IP_CAMERA' | 'DVR_NVR'; channel: number; motionDeclaration: 'YES' | 'NO' | 'UNKNOWN';
}
export interface CameraSetup extends CameraEquipment {
  connection: { host: string; port: number; path: string; username: string; password: string };
}
export interface CameraRecording {
  occurredAt: string;
  id: string;
  cameraId: string;
  eventId: string;
  status: 'PENDING' | 'AVAILABLE' | 'FAILED' | 'EXPIRED';
  kind: 'CLIP' | 'SNAPSHOT';
  durationSeconds: number;
  sizeBytes: number;
  expiresAt: string;
  createdAt: string;
}
export interface CameraLiveSession { id: string; token: string; whepUrl: string; expiresAt: string; }

@Injectable({ providedIn: 'root' })
export class CamerasService {
  private readonly http = inject(HttpClient);
  private readonly url = global.url;
  contexts(): Observable<InventoryResponse<{ contexts: CameraContext[] }>> {
    return this.http.get<InventoryResponse<{ contexts: CameraContext[] }>>(`${this.url}cameras/contexts`);
  }
  list(scope: InventoryScope, after?: string): Observable<InventoryResponse<{ cameras: Camera[]; nextCursor: string | null }>> {
    let params = new HttpParams().set('limit', 50);
    for (const [key, value] of Object.entries(scope)) params = params.set(key, value);
    if (after) params = params.set('after', after);
    return this.http.get<InventoryResponse<{ cameras: Camera[]; nextCursor: string | null }>>(`${this.url}cameras`, { params });
  }
  create(input: { scope: InventoryScope; displayName: string; gatewayId: string; protocol: 'RTSP' | 'ONVIF'; idempotencyKey: string; setup: CameraSetup }): Observable<InventoryResponse<{ camera: Camera }>> {
    return this.http.post<InventoryResponse<{ camera: Camera }>>(`${this.url}cameras`, { ...input, recordingMode: 'EVENT' });
  }
  setup(cameraId: string, setup: CameraSetup): Observable<InventoryResponse<{ camera: Camera }>> {
    return this.http.post<InventoryResponse<{ camera: Camera }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/setup`, setup);
  }
  activate(cameraId: string): Observable<InventoryResponse<{ camera: Camera }>> {
    return this.http.post<InventoryResponse<{ camera: Camera }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/activate`, {});
  }
  changeStatus(cameraId: string, status: 'DISABLED' | 'PROVISIONING'): Observable<InventoryResponse<{ camera: Camera }>> {
    return this.http.patch<InventoryResponse<{ camera: Camera }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}`, { status });
  }
  live(cameraId: string): Observable<InventoryResponse<CameraLiveSession>> {
    return this.http.post<InventoryResponse<CameraLiveSession>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/live-session`, {});
  }
  renew(cameraId: string, sessionId: string): Observable<InventoryResponse<{ id: string; expiresAt: string }>> {
    return this.http.post<InventoryResponse<{ id: string; expiresAt: string }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/live-session/${encodeURIComponent(sessionId)}/renew`, {});
  }
  close(cameraId: string, sessionId: string): Observable<InventoryResponse<{ id: string; status: string }>> {
    return this.http.delete<InventoryResponse<{ id: string; status: string }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/live-session/${encodeURIComponent(sessionId)}`);
  }
  recordings(cameraId: string, from: string, to: string, after?: string): Observable<InventoryResponse<{ recordings: CameraRecording[]; nextCursor: string | null }>> {
    let params = new HttpParams().set('from', from).set('to', to).set('limit', 50);
    if (after) params = params.set('after', after);
    return this.http.get<InventoryResponse<{ recordings: CameraRecording[]; nextCursor: string | null }>>(`${this.url}cameras/${encodeURIComponent(cameraId)}/recordings`, { params });
  }
  playback(recordingId: string): Observable<InventoryResponse<{ url: string; expiresAt: string }>> {
    return this.http.post<InventoryResponse<{ url: string; expiresAt: string }>>(`${this.url}camera-recordings/${encodeURIComponent(recordingId)}/playback`, {});
  }
}
