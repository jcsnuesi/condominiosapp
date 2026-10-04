import { BankReconciliationComponent } from '../bank-reconciliation/bank-reconciliation.component';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';

import { UserService } from '../../service/user.service';
import { InvoiceService, PaymentProvider } from '../../service/invoice.service';
import { AccessContextService } from '../../service/access-context.service';

interface MonitorProperty {
    label: string;
    value: string;
    units: string[];
}

interface MonitorResponse<T> {
    success: boolean;
    data: T;
}

interface PaidMonitorInvoice {
    invoiceId: string;
    invoicePaymentStatus: string;
    invoiceAmount: number;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    condominiumAlias?: string;
    unitNumber?: string;
    issueDate?: string;
    dueDate?: string;
}

@Component({
    selector: 'app-payment-monitor',
    standalone: true,
    templateUrl: './payment-monitor.component.html',
    styleUrl: './payment-monitor.component.css',
    imports: [
        BankReconciliationComponent,
        CommonModule,
        FormsModule,
        ToastModule,
        TableModule,
        PaginatorModule,
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
export class PaymentMonitorComponent implements OnInit, OnDestroy {
    viewMode: 'table' | 'cards' = 'cards';
    providerDialogVisible = false;
    providers: PaymentProvider[] = [];
    providersLoading = false;
    providerSaving = false;
    providerError = '';
    newProviderName = '';
    private providerRequest?: Subscription;
    private providerMutation?: Subscription;
    isOwner = false;
    propertyOptions: MonitorProperty[] = [];
    optionsLoading = false;
    unitOptions = [{ label: 'All', value: '' }];
    private transactionRequest?: Subscription;
    private optionsRequest?: Subscription;
    // Source: Superintendencia de Bancos, entidades operando (September 2026).
    bankOptions = ['', 'Banreservas', 'Banco Popular', 'Banco BHD',
        'Banco Santa Cruz', 'Scotiabank', 'Banco Promerica', 'Banco Caribe',
        'Banesco', 'Banco BDI', 'Banco López de Haro', 'Banco Vimenca',
        'Banco Ademi', 'Otros'].map((bank) => ({ label: bank || 'All', value: bank }));
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
        condominiumId: '',
        unitNumber: '',
        bankName: '',
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
        { label: 'Toke', value: 'TOKE' },
        { label: 'Transferencia', value: 'TRANSFERENCIA' },
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
        { label: 'Not started', value: 'not_started' },
        { label: 'pending', value: 'pending' },
        { label: 'matched', value: 'matched' },
        { label: 'mismatched', value: 'mismatched' },
        { label: 'manual_review', value: 'manual_review' },
    ];

    constructor(
        private userService: UserService,
        private invoiceService: InvoiceService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private accessContext: AccessContextService
    ) {
        this.token = this.userService.getToken();
        this.isOwner = ['OWNER', 'ROLE_OWNER'].includes(String(this.userService.getIdentity()?.role).toUpperCase());
    }

    ngOnInit(): void {
        this.loadOptions();
        this.loadProviders();
        this.loadTransactions();
    }

    ngOnDestroy(): void {
        this.transactionRequest?.unsubscribe();
        this.optionsRequest?.unsubscribe();
        this.providerRequest?.unsubscribe();
        this.providerMutation?.unsubscribe();
    }

    get canCreateProvider(): boolean {
        return this.userService.isAdmin() && this.accessContext.hasPermission('finance.create');
    }

    get canDeleteProvider(): boolean {
        return this.userService.isAdmin() && this.accessContext.hasPermission('finance.delete');
    }

    openProviderDialog(): void {
        this.newProviderName = '';
        this.providerDialogVisible = true;
        this.loadProviders();
    }

    loadProviders(): void {
        this.providerRequest?.unsubscribe();
        this.providersLoading = true;
        this.providerError = '';
        this.providerRequest = this.invoiceService.getPaymentProviders().subscribe({
            next: (response) => {
                this.providers = response.data;
                this.refreshProviderOptions();
                this.providersLoading = false;
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.providerError = 'No se pudieron cargar los proveedores.';
                this.providersLoading = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    private refreshProviderOptions(): void {
        this.providerOptions = [{ label: 'All', value: '' },
            ...this.providers.map((provider) => ({ label: provider.name, value: provider.code }))];
    }

    createProvider(): void {
        const name = this.newProviderName.trim();
        if (!this.canCreateProvider || !name || name.length > 80 || this.providerSaving) return;
        this.providerSaving = true;
        this.providerError = '';
        this.providerMutation = this.invoiceService.createPaymentProvider(name).subscribe({
            next: (response) => {
                this.providers = [...this.providers, response.data];
                this.refreshProviderOptions();
                this.newProviderName = '';
                this.providerSaving = false;
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.providerError = error?.error?.error?.message || 'No se pudo crear el proveedor.';
                this.providerSaving = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    deleteProvider(provider: PaymentProvider): void {
        if (!this.canDeleteProvider || !provider._id || provider.builtIn || this.providerSaving) return;
        this.providerSaving = true;
        this.providerError = '';
        this.providerMutation = this.invoiceService.deletePaymentProvider(provider._id).subscribe({
            next: () => {
                this.providers = this.providers.filter((item) => item._id !== provider._id);
                this.refreshProviderOptions();
                if (this.filters.provider === provider.code) {
                    this.filters.provider = '';
                    this.onProviderChange();
                }
                this.providerSaving = false;
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.providerError = error?.error?.error?.message || 'No se pudo eliminar el proveedor.';
                this.providerSaving = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    loadOptions(): void {
        this.optionsLoading = true;
        this.optionsRequest = this.invoiceService.getPaymentMonitorData<MonitorResponse<MonitorProperty[]>>('monitor/options').subscribe({
            next: (response) => {
                this.propertyOptions = response.data || [];
                this.optionsLoading = false;
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.optionsLoading = false;
                this.messageService.add({ severity: 'error', summary: 'Propiedades', detail: 'No se pudieron cargar las propiedades. Intente recargar la página.' });
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    onPropertyChange(): void {
        this.filters.unitNumber = '';
        const units = this.propertyOptions.find((property) => property.value === this.filters.condominiumId)?.units || [];
        this.unitOptions = [{ label: 'All', value: '' }, ...units.map((unit) => ({ label: unit, value: unit }))];
    }

    onBankCondominiumChange(condominiumId: string): void {
        this.filters.condominiumId = condominiumId;
        this.onPropertyChange();
        this.applyFilters();
    }

    onProviderChange(): void {
        this.filters.bankName = '';
        this.applyFilters();
    }

    private validDates(): boolean {
        if (this.filters.attemptedFrom && this.filters.attemptedTo && this.filters.attemptedFrom > this.filters.attemptedTo) {
            this.messageService.add({ severity: 'warn', summary: 'Fechas', detail: 'From debe ser anterior o igual a To.' });
            return false;
        }
        return true;
    }

    applyFilters(): void {
        this.transactionRequest?.unsubscribe();
        this.docs = [];
        this.total = 0;
        this.loading = false;
        if (!this.validDates()) return;
        this.loadTransactions(true);
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
        if (!this.validDates()) return;
        this.transactionRequest?.unsubscribe();
        if (resetPage) {
            this.resetPagination();
        }

        this.loading = true;
        this.transactionRequest = this.invoiceService.getPaymentMonitorData('monitor/invoices', this.filters).subscribe({
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
            condominiumId: '',
            unitNumber: '',
            bankName: '',
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
        this.unitOptions = [{ label: 'All', value: '' }];
        this.applyFilters();
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
        if (!this.validDates()) return;
        const exportFilters = {
            ...this.filters,
            page: 1,
            limit: 500,
        };

        this.invoiceService.getPaymentMonitorData('monitor/invoices', exportFilters).subscribe({
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
                    'ownerName',
                    'unitNumber',
                    'issueDate',
                    'dueDate',
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
                            row.ownerName,
                            row.unitNumber,
                            row.issueDate,
                            row.dueDate,
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

    canDownloadInvoice(row: PaidMonitorInvoice): boolean {
        return !!row.invoiceId && row.invoicePaymentStatus === 'completed';
    }

    downloadInvoice(row: PaidMonitorInvoice): void {
        if (!this.canDownloadInvoice(row)) return;
        this.invoiceService.genPDF({
            alias: row.condominiumAlias || '-',
            fullname: row.ownerName || 'Owner unavailable',
            phone: row.ownerPhone || '-',
            email: row.ownerEmail || '-',
            unit: row.unitNumber || '-',
            invoice_issue: row.issueDate,
            invoice_due: row.dueDate,
            invoice_status: row.invoicePaymentStatus,
            invoice_amount: row.invoiceAmount,
        });
    }

    canReconcile(row: any): boolean {
        const status = String(row?.reconciliationStatus || '').toLowerCase();
        return !this.isOwner && row?.rowType === 'transaction' && (status === 'manual_review' || status === 'mismatched');
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
    ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'succeeded' || normalized === 'matched') {
            return 'success';
        }
        if (normalized === 'processing' || normalized === 'pending') {
            return 'warn';
        }
        if (normalized === 'failed' || normalized === 'cancelled') {
            return 'danger';
        }
        return 'info';
    }
}
