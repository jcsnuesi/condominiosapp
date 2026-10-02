import { BankReconciliationComponent } from '../bank-reconciliation/bank-reconciliation.component';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { unitOwerDetails } from '../../models/property_details_type';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from '../../../pipes/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpClient } from '@angular/common/http';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { Router } from '@angular/router';
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

type tableData = {
    id: string;
    invoiceId: string;
    fullname: string;
    alias: string;
    unit: string;
    phone: string;
    email: string;
    amounts: number;
    paymentMethod: string;
    invoice_issue_date: string;
    invoice_due_date: string;
    status: string;
    paymentStatus: string;
    txStatus: string;
    txProvider: string;
    actions: boolean;
    propertyDetails: any;
};

type invoiceData = {
    num_invoice: string;
    fullname: string;
    email: string;
    phone: string;
    amount: number;
    invoice_due: string;
    invoice_issue: string;
    status: string;
    unit: string;
};

@Component({
    selector: 'app-payments-history',
    imports: [
        BankReconciliationComponent,
        PipesModuleModule,
        PdfViewerModule,
        DialogModule,
        ProgressSpinnerModule,
        ConfirmPopupModule,
        ButtonModule,
        TagModule,
        CardModule,
        MultiSelectModule,
        ConfirmDialogModule,
        TableModule,
        SelectModule,
        FormsModule,
        CommonModule,
        FileUploadModule,
        InputGroupModule,
        InputGroupAddonModule,
        ToastModule,
        InputTextModule,
        AvatarModule,
        AvatarGroupModule,
        ToolbarModule,
        DialogModule,
    ],
    templateUrl: './payments-history.component.html',
    styleUrl: './payments-history.component.css',
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        InvoiceService,
        FormatFunctions,
    ],
})
export class PaymentsHistoryComponent implements OnInit, OnChanges {
    receiptInvoice: tableData | null = null;
    receiptDialogVisible = false;
    @Input() ownerIdInput!: string;
    public bodyTableInfo: any[];
    public token: string;
    public headertbl: string = 'Payments History';
    public dynamicHeaders: any;
    public visible_spinner: boolean;
    public logoBase64: string;
    public providerOptions: Array<{ label: string; value: string }> = [
        { label: 'AZUL', value: 'AZUL' },
        { label: 'CARDNET', value: 'CARDNET' },
    ];
    public selectedProvider: string = 'AZUL';
    public whatsappDialogVisible: boolean = false;
    public whatsappLoading: boolean = false;
    public selectedWhatsappInvoice: tableData | null = null;
    public whatsappOptions: Array<{ label: string; value: string }> = [
        { label: 'Payment reminder', value: 'payment_reminder' },
        { label: 'Payment confirmation', value: 'payment_confirmation' },
    ];
    public whatsappForm = {
        type: 'payment_reminder',
        note: '',
        paymentLink: '',
    };

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _userService: UserService,
        private _invoiceService: InvoiceService,
        private _stringFormating: FormatFunctions,
        private _http: HttpClient,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.token = this._userService.getToken();
        this.bodyTableInfo = [];
        this.visible_spinner = false;
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

    ngOnInit(): void {
        this.dynamicHeaders = {
            id: 'id',
            alias: 'Alias',
            unit: 'Unit',
            phone: 'Phone',
            amounts: 'Amounts',
            invoice_issue_date: 'Invoice Issue Date',
            invoice_due_date: 'Invoice Due Date',
            status: 'Status',
            actions: 'Actions',
        };

        if (this.ownerIdInput) {
            this.getInvoiceByOwner();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['ownerIdInput']?.currentValue &&
            changes['ownerIdInput'].currentValue !==
                changes['ownerIdInput'].previousValue
        ) {
            this.getInvoiceByOwner();
        }
    }

    getInvoiceByOwner() {
        if (!this.ownerIdInput) {
            console.warn('getInvoiceByOwner called without ownerIdInput');
            return;
        }
        this.visible_spinner = true;
        this._invoiceService.getInvoiceByOwner(this.ownerIdInput).subscribe({
            next: (result) => {
                if (this.isSuccessResponse(result)) {
                    const responseData = this.getResponseData<any>(result, {});
                    const invoiceData =
                        responseData?.invoices || result.invoices || [];
                    const invoice = Array.isArray(invoiceData)
                        ? invoiceData
                        : [];
                    this.bodyTableInfo = invoice.map((item: any) => {
                        const unitFromDetails =
                            item?.ownerId?.propertyDetails?.[0]
                                ?.condominium_unit || item?.unitNumber;

                        return {
                            id: item._id,
                            invoiceId: item._id,
                            fullname:
                                (item?.ownerId?.name || '') +
                                ' ' +
                                (item?.ownerId?.lastname || ''),
                            alias: item?.condominiumId?.alias || '-',
                            unit: unitFromDetails || '-',
                            phone: item?.ownerId?.phone || '-',
                            email: item?.ownerId?.email || '-',
                            amounts: item.amount,
                            paymentMethod: item.paymentMethod || '-',
                            invoice_issue_date:
                                this._stringFormating.dateFormat(
                                    item.issueDate
                                ),
                            invoice_due_date: this._stringFormating.dateFormat(
                                item.dueDate || item.issueDate
                            ),
                            status: item.status,
                            paymentStatus: item.paymentStatus || 'pending',
                            txStatus: 'n/a',
                            txProvider: '-',
                            actions: true,
                            propertyDetails: item,
                        } as tableData;
                    });

                    this.syncPaymentTransactions();
                }
                this.visible_spinner = false;
                this._changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.log('error', error);
                this.visible_spinner = false;
                this._changeDetectorRef.detectChanges();
            },
        });
    }

    syncPaymentTransactions() {
        if (!this.ownerIdInput) {
            return;
        }
        this._invoiceService
            .getPaymentTransactions({
                ownerId: this.ownerIdInput,
                limit: 500,
            })
            .subscribe({
            next: (result) => {
                if (!this.isSuccessResponse(result)) {
                    return;
                }

                const responseData = this.getResponseData<any>(result, {});
                const transactionData =
                    responseData?.docs || result?.docs || [];
                const docs = Array.isArray(transactionData)
                    ? transactionData
                    : [];
                const latestByInvoice = new Map<string, any>();

                docs.forEach((tx: any) => {
                    const invoiceId = String(tx?.invoiceId || '');
                    if (!invoiceId || latestByInvoice.has(invoiceId)) {
                        return;
                    }
                    latestByInvoice.set(invoiceId, tx);
                });

                this.bodyTableInfo = this.bodyTableInfo.map(
                    (row: tableData) => {
                        const tx = latestByInvoice.get(String(row.invoiceId));
                        if (!tx) {
                            return row;
                        }

                        return {
                            ...row,
                            txStatus: tx.status || row.txStatus,
                            txProvider: tx.provider || row.txProvider,
                            paymentMethod:
                                tx.provider || row.paymentMethod || '-',
                        };
                    }
                );
                this._changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.log('error loading payment transactions', error);
            },
        });
    }

    payInvoice(row: tableData) {
        const payload = {
            invoiceId: row.invoiceId,
            provider: this.selectedProvider,
            idempotencyKey: `${row.invoiceId}-${Date.now()}`,
        };

        this._invoiceService.createPaymentIntent(payload).subscribe({
            next: (result) => {
                if (this.isSuccessResponse(result)) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cobro iniciado',
                        detail: 'Se registro el intento de pago correctamente.',
                        life: 3000,
                    });
                    this.syncPaymentTransactions();
                    return;
                }

                this.messageService.add({
                    severity: 'warn',
                    summary: 'Atencion',
                    detail: 'No fue posible registrar el cobro.',
                    life: 3000,
                });
            },
            error: (error) => {
                console.log(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo ejecutar el cobro.',
                    life: 3000,
                });
            },
        });
    }

    openWhatsappDialog(row: tableData) {
        this.selectedWhatsappInvoice = row;
        this.whatsappForm = {
            type:
                row.paymentStatus === 'completed' ||
                row.txStatus === 'succeeded'
                    ? 'payment_confirmation'
                    : 'payment_reminder',
            note: '',
            paymentLink: '',
        };
        this.whatsappDialogVisible = true;
    }

    sendWhatsappReminder() {
        if (!this.selectedWhatsappInvoice?.invoiceId) {
            return;
        }

        this.whatsappLoading = true;
        this._invoiceService
            .sendInvoiceWhatsappReminder(
                this.selectedWhatsappInvoice.invoiceId,
                this.whatsappForm
            )
            .subscribe({
                next: (result) => {
                    this.whatsappLoading = false;
                    if (!this.isSuccessResponse(result)) {
                        return;
                    }

                    this.messageService.add({
                        severity: 'success',
                        summary: 'WhatsApp',
                        detail: 'Mensaje de pago enviado correctamente.',
                        life: 3000,
                    });
                    this.whatsappDialogVisible = false;
                    this.selectedWhatsappInvoice = null;
                    this.getInvoiceByOwner();
                },
                error: (error) => {
                    this.whatsappLoading = false;
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'WhatsApp',
                        detail:
                            error?.error?.error?.message ||
                            error?.error?.message ||
                            'No se pudo enviar el mensaje de WhatsApp.',
                        life: 3000,
                    });
                },
            });
    }

    base64(onReady?: () => void) {
        this._http
            .get('assets/noimage.jpeg', { responseType: 'blob' })
            .subscribe({
                next: (result) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.logoBase64 = reader.result?.toString() ?? '';
                        onReady?.();
                    };
                    reader.readAsDataURL(result);
                },
                error: (error) => {
                    console.log('error', error);
                },
            });
    }

    editItem(event: any) {
        let data = { ...event };

        data['alias'] = event.propertyDetails.condominiumId.alias;
        data['invoice_issue'] = event.invoice_issue_date;
        data['invoice_due'] = event.invoice_due_date;

        if (this.logoBase64) {
            this._invoiceService.genPDF(data, this.logoBase64);
            return;
        }

        this.base64(() => this._invoiceService.genPDF(data, this.logoBase64));
    }

    canPay(row: tableData): boolean {
        if (row.propertyDetails?.paymentWorkflow === 'bank_transfer') return false;
        return (
            row.paymentStatus !== 'completed' && row.txStatus !== 'succeeded'
        );
    }

    pendingBalance(row: tableData): number {
        if (row.propertyDetails?.balancePending != null) return Number(row.propertyDetails.balancePending);
        if (row.paymentStatus === 'completed') return 0;
        return Math.max(0, Number(row.amounts || 0) - Number(row.propertyDetails?.paidAmount || 0));
    }
}
