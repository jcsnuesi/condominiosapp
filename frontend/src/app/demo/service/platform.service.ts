import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { global } from './global.service';

export type SubjectType = 'ORGANIZATION' | 'PERSONAL_OWNER';
export interface Limits { condominiums: number | null; units: number | null; unitsPerCondominium: number | null; residences: number | null; }
export interface Membership { plan: string; status: string; billingStatus: string; endsAt: string | null; limits: Limits; reason: string; }
export interface PlatformAccount { id: string; subjectType: SubjectType; name: string; status: string; compliance: string; exceeded: string[]; membership: Membership | null; usage: Record<keyof Limits, number>; }
export interface AccountPage { rows: PlatformAccount[]; total: number; page: number; pageSize: number; }
export interface PlatformPolicy { _id: string; name: string; description: string; permissions: string[]; status: string; }
export interface PlatformScope { mode: 'ALL' | 'SELECTED'; organizationIds: string[]; ownerIds: string[]; }
export interface Supervisor { _id: string; name: string; lastname: string; email: string; phone: string; status: string; policyIds: PlatformPolicy[]; scope: PlatformScope; }
export interface SaasPlan { _id: string; name: string; subjectType: SubjectType; limits: Limits; status: string; }
export interface PlatformAudit { _id: string; actorId: string; action: string; targetType: string; targetId: string; createdAt: string; }
export interface PlatformKpis { generatedAt: string; accounts: number; organizations: number; personalOwners: number; activeAccounts: number; suspendedAccounts: number; condominiums: number; units: number; residences: number; compliant: number; exceeded: number; unprovisioned: number; expired: number; suspendedMemberships: number; pastDue: number; expiringSoon: number; plans: { plan: string; accounts: number }[]; }
interface Envelope<T> { data: T; }

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly http = inject(HttpClient);
  get<T>(path: string): Observable<T> { return this.http.get<Envelope<T>>(`${global.url}platform/${path}`).pipe(map(response => response.data)); }
  save<T>(path: string, body: unknown, id?: string): Observable<T> {
    const url = `${global.url}platform/${path}${id ? `/${encodeURIComponent(id)}` : ''}`;
    return (id ? this.http.put<Envelope<T>>(url, body) : this.http.post<Envelope<T>>(url, body)).pipe(map(response => response.data));
  }
  saveMembership(account: PlatformAccount, body: Membership): Observable<unknown> { return this.http.put(`${global.url}platform/memberships/${account.subjectType}/${account.id}`, body); }
  setStatus(account: PlatformAccount, status: string): Observable<unknown> { return this.http.patch(`${global.url}platform/accounts/${account.subjectType}/${account.id}`, { status }); }
  errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) return error.error?.error?.message || error.error?.message || 'No se pudo completar la operación. Intenta nuevamente.';
    return 'No se pudo completar la operación. Intenta nuevamente.';
  }
}
