import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { global } from './global.service';
import { UserService } from './user.service';

export interface BankAccount { _id: string; condominiumId: string; bank: string; accountLabel: string; currency: string; }
export interface BankFields { amount?: number | string; date?: string; reference?: string; bank?: string; currency?: string; }
export interface BankMovement extends BankFields { _id: string; description?: string; sourceRow?: number; direction?: string; }
export interface Receipt { _id: string; invoiceId: string; bankAccountId: string; status?: string; ocrStatus?: string; reconciliationStatus?: string; fields?: BankFields; extractedFields?: BankFields; originalName?: string; error?: string; warnings?: string[]; allocation?: { appliedAmount: number; creditAmount: number; remainingBalance: number }; }
export interface Statement { _id: string; bankAccountId?: string; status: string; rows: BankMovement[]; reviewedRows?: BankMovement[]; error?: string; headers?: string[]; rawRows?: string[][]; ocr?: { text?: string }; warnings?: string[]; }
export interface Candidate { movement: BankMovement; reasons?: string[]; eligible?: boolean; }
export interface Confirmation { outstandingBalance?: number; creditBalance?: number; }

@Injectable({ providedIn: 'root' })
export class BankReconciliationService {
  private readonly http = inject(HttpClient);
  private readonly user = inject(UserService);
  private readonly base = `${global.url}payments/`;
  private get headers() { return new HttpHeaders().set('Authorization', this.user.getToken()); }
  get<T>(path: string, query: Record<string, string> = {}) {
    const params = new HttpParams({ fromObject: query });
    return this.http.get<{ data: T }>(this.base + path, { headers: this.headers, params }).pipe(map(response => response.data));
  }
  post<T>(path: string, body: unknown) {
    return this.http.post<{ data: T }>(this.base + path, body, { headers: this.headers }).pipe(map(response => response.data));
  }
  patch<T>(path: string, body: unknown) {
    return this.http.patch<{ data: T }>(this.base + path, body, { headers: this.headers }).pipe(map(response => response.data));
  }
  file(id: string) { return this.http.get(`${this.base}receipts/${id}/file`, { headers: this.headers, responseType: 'blob' }); }
  statementFile(id: string) { return this.http.get(`${this.base}statements/${id}/file`, { headers: this.headers, responseType: 'blob' }); }
}
