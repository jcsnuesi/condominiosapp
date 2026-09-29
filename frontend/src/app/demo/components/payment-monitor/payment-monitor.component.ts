import { afterNextRender, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';

import { UserService } from '../../service/user.service';
import { InvoiceService } from '../../service/invoice.service';

@Component({
    selector: 'app-payment-monitor',
    standalone: true,
    templateUrl: './payment-monitor.component.html',
    styleUrl: './payment-monitor.component.css',
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TagModule,
        CardModule,
        ProgressSpinnerModule,
        DialogModule,
        TextareaModule,
    ],
    providers: [MessageService],
})
export class PaymentMonitorComponent {
    token = '';
    loading = false;
    docs: any[] = [];
    total = 0;
    first = 0;
    rowsPerPageOptions = [10, 20, 50, 100];
    reconciliationDialogVisible = false;
    importDialogVisible = false;
    importLoading = false;
    selectedTransaction: any = null;
    reconciliationForm = {
        reconciliationStatus: 'matched',
        note: '',
    };
    importForm = {
        provider: 'AZUL',
        csvText: '',
    };
    importResult: any = null;

    filters = {
        ownerId: '',
        invoiceId: '',
        provider: '',
        status: '',
        reconciliationStatus: '',
        attemptedFrom: '',
        attemptedTo: '',
        page: 1,
        limit: 20,
    };

    providerOptions = [
        { label: 'All', value: '' },
        { label: 'AZUL', value: 'AZUL' },
        { label: 'CARDNET', value: 'CARDNET' },
    ];

    paymentProviderOptions = [
        { label: 'AZUL', value: 'AZUL' },
        { label: 'CARDNET', value: 'CARDNET' },
    ];

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'pending', value: 'pending' },
        { label: 'processing', value: 'processing' },
        { label: 'succeeded', value: 'succeeded' },
        { label: 'failed', value: 'failed' },
        { label: 'cancelled', value: 'cancelled' },
    ];

    reconciliationOptions = [
        { label: 'Matched', value: 'matched' },
        { label: 'Mismatched', value: 'mismatched' },
        { label: 'Manual review', value: 'manual_review' },
    ];

    reconciliationFilterOptions = [
        { label: 'All', value: '' },
        { label: 'pending', value: 'pending' },
        { label: 'matched', value: 'matched' },
        { label: 'mismatched', value: 'mismatched' },
        { label: 'manual_review', value: 'manual_review' },
    ];

    constructor(
        private userService: UserService,
        private invoiceService: InvoiceService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.token = this.userService.getToken();
        afterNextRender(() => this.loadTransactions());
    }

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private getResponseData<T>(response: any, fallback: T): T {
        if (response?.data !== undefined && response?.data !== null) {
            return response.data as T;
        }
        return fallback;
    }

    private resetPagination(): void {
        this.first = 0;
        this.filters.page = 1;
    }

    loadTransactions(resetPage = false): void {
        if (resetPage) {
            this.resetPagination();
        }

        this.loading = true;
        this.invoiceService.getPaymentTransactions(this.filters).subscribe({
            next: (response) => {
                if (!this.isSuccessResponse(response)) {
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                    return;
                }

                const data = this.getResponseData<any>(response, {
                    docs: [],
                    total: 0,
                });
                this.docs = data?.docs || [];
                this.total = Number(data?.total || 0);
                this.filters.page = Number(data?.page || this.filters.page);
                this.filters.limit = Number(data?.limit || this.filters.limit);
                this.first = (this.filters.page - 1) * this.filters.limit;
                this.loading = false;
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.loading = false;
                this.changeDetectorRef.detectChanges();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error?.error?.error?.message ||
                        error?.error?.message ||
                        'Could not load payment transactions',
                });
            },
        });
    }

    clearFilters(): void {
        this.filters = {
            ownerId: '',
            invoiceId: '',
            provider: '',
            status: '',
            reconciliationStatus: '',
            attemptedFrom: '',
            attemptedTo: '',
            page: 1,
            limit: 20,
        };
        this.first = 0;
        this.loadTransactions();
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = Number(event.first || 0);
        const rows = Number(event.rows || this.filters.limit || 20);

        this.first = first;
        this.filters.limit = rows;
        this.filters.page = Math.floor(first / rows) + 1;
        this.loadTransactions();
    }

    exportCsv(): void {
        const exportFilters = {
            ...this.filters,
            page: 1,
            limit: 500,
        };

        this.invoiceService.getPaymentTransactions(exportFilters).subscribe({
            next: (response) => {
                if (!this.isSuccessResponse(response)) {
                    return;
                }

                const data = this.getResponseData<any>(response, {
                    docs: [],
                });
                const docs = Array.isArray(data?.docs) ? data.docs : [];

                if (docs.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Export',
                        detail: 'No hay datos para exportar con estos filtros.',
                    });
                    return;
                }

                const header = [
                    'invoiceId',
                    'ownerId',
                    'provider',
                    'amount',
                    'currency',
                    'status',
                    'reconciliationStatus',
                    'providerTransactionId',
                    'attemptedAt',
                    'confirmedAt',
                ];

                const escapeCell = (value: any): string => {
                    const raw = String(value ?? '');
                    const escaped = raw.replace(/"/g, '""');
                    return `"${escaped}"`;
                };

                const lines = [
                    header.join(','),
                    ...docs.map((row: any) =>
                        [
                            row.invoiceId,
                            row.ownerId,
                            row.provider,
                            row.amount,
                            row.currency,
                            row.status,
                            row.reconciliationStatus,
                            row.providerTransactionId,
                            row.attemptedAt,
                            row.confirmedAt,
                        ]
                            .map(escapeCell)
                            .join(',')
                    ),
                ];

                const blob = new Blob([lines.join('\n')], {
                    type: 'text/csv;charset=utf-8;',
                });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = `payment-transactions-${Date.now()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Export',
                    detail:
                        error?.error?.error?.message ||
                        error?.error?.message ||
                        'No se pudo exportar CSV de transacciones',
                });
            },
        });
    }

    openImportDialog(): void {
        this.importResult = null;
        this.importForm = {
            provider: 'AZUL',
            csvText:
                'providerTransactionId,providerReference,idempotencyKey,amount,currency,status,settledAt,note\n',
        };
        this.importDialogVisible = true;
    }

    private parseCsvLine(line: string): string[] {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let index = 0; index < line.length; index += 1) {
            const char = line[index];
            const nextChar = line[index + 1];

            if (char === '"' && nextChar === '"') {
                current += '"';
                index += 1;
                continue;
            }

            if (char === '"') {
                inQuotes = !inQuotes;
                continue;
            }

            if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
                continue;
            }

            current += char;
        }

        values.push(current.trim());
        return values;
    }

    private parseImportRows(): any[] {
        const lines = String(this.importForm.csvText || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (lines.length < 2) {
            return [];
        }

        const headers = this.parseCsvLine(lines[0]).map((header) =>
            header.trim()
        );

        return lines.slice(1).map((line) => {
            const cells = this.parseCsvLine(line);
            return headers.reduce((row, header, index) => {
                row[header] = cells[index] ?? '';
                return row;
            }, {} as any);
        });
    }

    submitImport(): void {
        const rows = this.parseImportRows();

        if (rows.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Import',
                detail: 'Paste a CSV header and at least one transaction row.',
            });
            return;
        }

        this.importLoading = true;
        this.invoiceService
            .importPaymentReconciliation({
                provider: this.importForm.provider,
                rows,
            })
            .subscribe({
                next: (response) => {
                    this.importLoading = false;
                    if (!this.isSuccessResponse(response)) {
                        return;
                    }

                    this.importResult = this.getResponseData<any>(response, {
                        summary: {},
                        results: [],
                    });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Import',
                        detail: 'Payment reconciliation import processed.',
                    });
                    this.loadTransactions(true);
                },
                error: (error) => {
                    this.importLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Import',
                        detail:
                            error?.error?.error?.message ||
                            error?.error?.message ||
                            'Could not import payment reconciliation',
                    });
                },
            });
    }

    canReconcile(row: any): boolean {
        const status = String(row?.reconciliationStatus || '').toLowerCase();
        return status === 'manual_review' || status === 'mismatched';
    }

    openReconciliationDialog(row: any, status = 'matched'): void {
        this.selectedTransaction = row;
        this.reconciliationForm = {
            reconciliationStatus: status,
            note: '',
        };
        this.reconciliationDialogVisible = true;
    }

    submitReconciliation(): void {
        if (!this.selectedTransaction?._id) {
            return;
        }

        this.loading = true;
        this.invoiceService
            .reconcilePaymentTransaction(
                this.selectedTransaction._id,
                this.reconciliationForm
            )
            .subscribe({
                next: (response) => {
                    this.loading = false;
                    if (!this.isSuccessResponse(response)) {
                        return;
                    }

                    this.reconciliationDialogVisible = false;
                    this.selectedTransaction = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Reconciliation',
                        detail: 'Transaction reconciliation updated.',
                    });
                    this.loadTransactions();
                },
                error: (error) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Reconciliation',
                        detail:
                            error?.error?.error?.message ||
                            error?.error?.message ||
                            'Could not update transaction reconciliation',
                    });
                },
            });
    }

    getSeverity(
        status: string
    ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'succeeded' || normalized === 'matched') {
            return 'success';
        }
        if (normalized === 'processing' || normalized === 'pending') {
            return 'warning';
        }
        if (normalized === 'failed' || normalized === 'cancelled') {
            return 'danger';
        }
        return 'info';
    }
}
