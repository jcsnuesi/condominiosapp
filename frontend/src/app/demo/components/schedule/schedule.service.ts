import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { global } from '../../service/global.service';

export interface ScheduleContext { condominiumId?: string; unitId?: string; residenceId?: string; label: string; contextType: string; }
export interface Responsible { id: string; role: string; name: string; }
export interface ScheduleRow {
  _id: string; name: string; description: string; equipmentName: string;
  frequencyType: string; frequencyValue: number; startDate: string; nextRunAt?: string;
  timezone: string; remindBeforeDays: number; assignedUserId: string; assignedRole: string;
  condominiumId?: string; unitId?: string; residenceId?: string; isActive: boolean; notificationError?: string;
}
export interface TaskRow { _id: string; scheduleId: string; name: string; dueDate: string; timezone: string; status: string; isOpen: boolean; assignedUserId: string; condominiumId?: string; residenceId?: string; unitId?: string; }
export interface VendorRow { _id: string; name: string; contact: string; notes: string; isActive: boolean; }
export interface EvidenceRow { _id: string; filename: string; }
export interface HistoryRow { _id: string; taskId: string; name: string; performedAt: string; completedAt: string; timezone: string; cost: string | { $numberDecimal: string }; currency: string; description: string; notes: string; providerSnapshot?: { name: string; contact: string }; nextRecommendedDate?: string; evidence: EvidenceRow[]; }
export interface PageResult<T> { docs: T[]; total: number; page: number; limit: number; }
interface Envelope<T> { data: T; }

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly url = global.url;
  get<T>(path: string, query: Record<string, string> = {}) {
    return this.http.get<Envelope<T>>(`${this.url}${path}`, { params: new HttpParams({ fromObject: query }) }).pipe(map(r => r.data));
  }
  post<T>(path: string, body: object) { return this.http.post<Envelope<T>>(`${this.url}${path}`, body).pipe(map(r => r.data)); }
  patch<T>(path: string, body: object) { return this.http.patch<Envelope<T>>(`${this.url}${path}`, body).pipe(map(r => r.data)); }
  download(record: string, file: EvidenceRow) {
    return this.http.get(`${this.url}maintenance/history/${record}/evidence/${file._id}`, { responseType: 'blob' });
  }
}
