import { afterNextRender, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { InvoiceService } from '../../service/invoice.service';
import { UserService } from '../../service/user.service';

@Component({
    selector: 'app-communication-log',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        CardModule,
        DialogModule,
        InputNumberModule,
        InputTextModule,
        SelectModule,
        TagModule,
    ],
    providers: [MessageService],
    templateUrl: './communication-log.component.html',
    styleUrl: './communication-log.component.css',
})
export class CommunicationLogComponent {
    token = '';
    loading = false;
    jobLoading = false;
    docs: any[] = [];
    total = 0;
    first = 0;
    rowsPerPageOptions = [10, 20, 50, 100];
    jobDialogVisible = false;
    jobResult: any = null;

    filters = {
        channel: '',
        type: '',
        status: '',
        invoiceId: '',
        ownerId: '',
        condominiumId: '',
        sentFrom: '',
        sentTo: '',
        page: 1,
        limit: 20,
    };

    jobForm = {
        dryRun: true,
        graceDays: 1,
        minDaysBetween: 7,
        batchSize: 50,
    };

    channelOptions = [
        { label: 'All', value: '' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Email', value: 'email' },
        { label: 'Push', value: 'push' },
        { label: 'SMS', value: 'sms' },
    ];

    typeOptions = [
        { label: 'All', value: '' },
        { label: 'payment_reminder', value: 'payment_reminder' },
        { label: 'payment_confirmation', value: 'payment_confirmation' },
        { label: 'access', value: 'access' },
        { label: 'general', value: 'general' },
    ];

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'sent', value: 'sent' },
        { label: 'skipped', value: 'skipped' },
        { label: 'failed', value: 'failed' },
    ];

    constructor(
        private userService: UserService,
        private invoiceService: InvoiceService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.token = this.userService.getToken();
        afterNextRender(() => this.loadLogs());
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

    loadLogs(resetPage = false): void {
        if (resetPage) {
            this.resetPagination();
        }

        this.loading = true;
        this.invoiceService.getCommunicationLogs(this.filters).subscribe({
            next: (response) => {
                this.loading = false;
                if (!this.isSuccessResponse(response)) {
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
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.loading = false;
                this.changeDetectorRef.detectChanges();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Communications',
                    detail:
                        error?.error?.error?.message ||
                        error?.error?.message ||
                        'Could not load communication logs',
                });
            },
        });
    }

    clearFilters(): void {
        this.filters = {
            channel: '',
            type: '',
            status: '',
            invoiceId: '',
            ownerId: '',
            condominiumId: '',
            sentFrom: '',
            sentTo: '',
            page: 1,
            limit: 20,
        };
        this.first = 0;
        this.loadLogs();
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = Number(event.first || 0);
        const rows = Number(event.rows || this.filters.limit || 20);

        this.first = first;
        this.filters.limit = rows;
        this.filters.page = Math.floor(first / rows) + 1;
        this.loadLogs();
    }

    runReminderDryRun(): void {
        this.jobLoading = true;
        this.invoiceService
            .runPaymentReminderJob({
                dryRun: this.jobForm.dryRun,
                config: {
                    graceDays: this.jobForm.graceDays,
                    minDaysBetween: this.jobForm.minDaysBetween,
                    batchSize: this.jobForm.batchSize,
                },
            })
            .subscribe({
                next: (response) => {
                    this.jobLoading = false;
                    if (!this.isSuccessResponse(response)) {
                        return;
                    }

                    this.jobResult = this.getResponseData<any>(response, {});
                    this.jobDialogVisible = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Reminders',
                        detail: this.jobForm.dryRun
                            ? 'Dry-run completed.'
                            : 'Reminder job executed.',
                    });
                    this.loadLogs(true);
                },
                error: (error) => {
                    this.jobLoading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Reminders',
                        detail:
                            error?.error?.error?.message ||
                            error?.error?.message ||
                            'Could not run reminder job',
                    });
                },
            });
    }

    getSeverity(
        status: string
    ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'sent') {
            return 'success';
        }
        if (normalized === 'skipped') {
            return 'warning';
        }
        if (normalized === 'failed') {
            return 'danger';
        }
        return 'info';
    }
}
