import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { global } from './global.service';
import { UserService } from './user.service';

export interface FinanceUnit {
    ownerId: string;
    unitNumber: string;
    ownerName: string;
}
export interface FinanceCondominium {
    _id: string;
    alias: string;
    mPayment: number;
    units: FinanceUnit[];
}
export interface FinanceSettings {
    enabled: boolean;
    cashbookEnabled: boolean;
    reportsEnabled: boolean;
    lateFee: {
        enabled: boolean;
        mode: 'fixed' | 'percent';
        value: number;
        graceDays: number;
        effectiveFrom?: string;
    };
}
export interface FinanceInvoice {
    _id: string;
    invoice_number: string;
    unitNumber: string;
    ownerId: string;
    amount: number;
    balancePending: number;
    pendingMinor: number;
    currency: string;
    chargeType?: string;
    bucket: string;
    dueDate?: string;
}
export interface FinanceCredit {
    _id: string;
    ownerId: string;
    unitNumber?: string;
    currency: string;
    amountMinor: number;
    availableMinor: number;
    needsReview?: boolean;
}
export interface FinanceAccount {
    _id: string;
    bank: string;
    accountLabel: string;
    currency: string;
    openingDate?: string;
    openingBalanceMinor?: number;
    calculatedBalanceMinor?: number | null;
    unclassifiedCount?: number;
}
export interface FinanceEntry {
    _id: string;
    kind: 'income' | 'expense' | 'transfer';
    date: string;
    category: string;
    currency: string;
    amountMinor: number;
    reason: string;
    reversalOf?: string;
    reversedById?: string;
    movementId?: string;
    destinationMovementId?: string;
    bankAccountId?: string;
    destinationAccountId?: string;
}
export interface FinanceMovement {
    _id: string;
    bankAccountId: string;
    direction: 'credit' | 'debit';
    date: string;
    amountMinor: number;
    currency: string;
    description?: string;
    reference?: string;
}
export interface BudgetLine {
    month: number;
    kind: 'income' | 'expense';
    category: string;
    amount: number;
}
export interface BudgetResponse {
    lines: Array<Omit<BudgetLine, 'amount'> & { amountMinor: number }>;
    revision: number;
}
export interface HistoryRow {
    id: string;
    date: string;
    kind: string;
    description: string;
    debitMinor: number;
    creditMinor: number;
    balanceMinor: number;
    applicationId?: string;
    reversible?: boolean;
}
export interface UnitHistory {
    docs: HistoryRow[];
    total: number;
    page: number;
    openingMinor: number;
    closingMinor: number;
    currentPendingMinor: number;
    currency: string;
    credits: FinanceCredit[];
    warnings: { undatedLegacyPayments: number; undatedPayments: number };
}
export interface ReceivableTotal {
    currency: string;
    amountMinor: number;
    buckets: Record<string, number>;
}
export interface CashRow {
    id: string;
    date: string;
    kind: string;
    category: string;
    amountMinor: number;
    reference: string;
}
export interface FinanceReport {
    incomeMinor: number;
    expenseMinor: number;
    netMinor: number;
    currency: string;
    rows: CashRow[];
    banks: FinanceAccount[];
    receivables: ReceivableTotal[];
    receivablesAsOf: string;
    budget: Array<
        Omit<BudgetLine, 'amount'> & {
            plannedMinor: number;
            actualMinor: number;
            varianceMinor: number;
            variancePercent: number | null;
        }
    >;
    warnings: {
        undatedSuccessfulPayments: number;
        legacyPaidWithoutTransactions: number;
    };
}
export interface Page<T> {
    docs: T[];
    total: number;
    page: number;
    limit: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
    private readonly http = inject(HttpClient);
    private readonly user = inject(UserService);
    private readonly base = `${global.url}finance/`;
    private get headers() {
        return new HttpHeaders().set('Authorization', this.user.getToken());
    }
    get<T>(path: string, query: Record<string, string> = {}) {
        return this.http
            .get<{ data: T }>(this.base + path, {
                headers: this.headers,
                params: new HttpParams({ fromObject: query }),
            })
            .pipe(map((response) => response.data));
    }
    post<T>(path: string, body: unknown) {
        return this.http
            .post<{ data: T }>(this.base + path, body, {
                headers: this.headers,
            })
            .pipe(map((response) => response.data));
    }
    put<T>(path: string, body: unknown) {
        return this.http
            .put<{ data: T }>(this.base + path, body, { headers: this.headers })
            .pipe(map((response) => response.data));
    }
    export(path: string, query: Record<string, string>) {
        return this.http.get(this.base + path, {
            headers: this.headers,
            params: new HttpParams({ fromObject: { ...query, format: 'csv' } }),
            responseType: 'blob',
        });
    }
}
