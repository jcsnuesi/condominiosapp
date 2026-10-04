import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
    CommonModule,
    KeyValuePipe,
    formatDate,
} from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { BankAccount, BankReconciliationService, Receipt } from '../../service/bank-reconciliation.service';
import { firstValueFrom } from 'rxjs';

type InvoiceBody = {
    _id: string;
    fullname: string;
    phone: string;
    unit: string;
    invoice_issue: string;
    invoice_amount: number;
    invoice_status: string;
    paymentStatus: string;
    alias: string;
    email: string;
    condominiumId: string;
    attachments: Receipt[];
    currency: string;
};

type CondoInvoiceGroup = {
    condominiumId: string;
    alias: string;
    invoiceCount: number;
    totalAmount: number;
    invoices: InvoiceBody[];
    selected: boolean;
};

type MonthOption = {
    label: string;
    value: string;
};

@Component({
    selector: 'app-invoice-history',
    imports: [
        PipesModuleModule,
        CommonModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        FormsModule,
        SelectModule,
        TableModule,
        ButtonModule,
        CheckboxModule,
        MenuModule,
        TitleCasePipe,
        DatePipe,
        FloatLabelModule,
        DatePickerModule,
        CurrencyPipe,
    ],
    providers: [UserService, InvoiceService, FormatFunctions, KeyValuePipe],
    templateUrl: './invoice-history.component.html',
    styleUrl: './invoice-history.component.css',
})
export class InvoiceHistoryComponent implements OnInit {
    public voucherVisible = false;
    public attachmentVisible = false;
    public voucherGroup: CondoInvoiceGroup | null = null;
    public attachmentGroup: CondoInvoiceGroup | null = null;
    public voucherInvoice: InvoiceBody | null = null;
    public bankAccounts: BankAccount[] = [];
    public bankAccountId = '';
    public voucherLoading = false;
    public voucherUploading = false;
    public voucherMessage = '';
    public voucherError = '';
    public downloadError = '';
    public voucherDeleting = false;
    public deleteVisible = false;
    public pendingDeletion: { invoice: InvoiceBody; receipt: Receipt } | null = null;
    public deleteError = '';
    private voucherRequest = 0;

    get voucherOptions() {
        return (this.voucherGroup?.invoices ?? []).map(invoice => ({
            label: `${formatDate(invoice.invoice_issue, 'MM/dd/yyyy', 'en-US')} · Unit ${invoice.unit} · ${invoice.currency} ${invoice.invoice_amount.toFixed(2)}`,
            value: invoice,
        }));
    }

    attachmentCount(group: CondoInvoiceGroup): number {
        return group.invoices.reduce((sum, invoice) => sum + invoice.attachments.length, 0);
    }

    openAttachments(group: CondoInvoiceGroup): void {
        this.attachmentGroup = group;
        this.downloadError = '';
        this.voucherError = '';
        this.voucherMessage = '';
        this.attachmentVisible = true;
    }

    openVoucher(group: CondoInvoiceGroup): void {
        this.voucherGroup = group;
        this.voucherVisible = true;
        this.voucherInvoice = group.invoices.length === 1 ? group.invoices[0] : null;
        this.voucherError = '';
        this.voucherMessage = '';
        this.downloadError = '';
        void this.loadVoucherInvoice();
    }

    async loadVoucherInvoice(): Promise<void> {
        const request = ++this.voucherRequest;
        const invoice = this.voucherInvoice;
        this.bankAccounts = [];
        this.bankAccountId = '';
        this.voucherLoading = !!invoice;
        this.voucherError = '';
        this.voucherMessage = '';
        if (!invoice) return;
        try {
            const [accounts, receipts] = await Promise.all([
                firstValueFrom(this.bankApi.get<{ docs: BankAccount[] }>('bank-accounts', { condominiumId: invoice.condominiumId })),
                firstValueFrom(this.bankApi.get<{ docs: Receipt[] }>('receipts', { invoiceId: invoice._id })),
            ]);
            if (request !== this.voucherRequest) return;
            this.replaceAttachments(invoice._id, receipts.docs);
            this.bankAccounts = accounts.docs.filter(account => account.currency === invoice.currency);
            if (this.bankAccounts.length === 1) this.bankAccountId = this.bankAccounts[0]._id;
        } catch (error: unknown) {
            if (request === this.voucherRequest) this.voucherError = this.bankError(error);
        } finally {
            if (request === this.voucherRequest) this.voucherLoading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    private bankError(error: unknown): string {
        const response = error as { error?: { error?: { message?: string }; message?: string } };
        return response?.error?.error?.message ?? response?.error?.message ?? 'Unable to complete the operation. Please retry.';
    }

    private replaceAttachments(invoiceId: string, receipts: Receipt[]): void {
        const rows: InvoiceBody[] = [
            ...this.propertyDetailsVar,
            ...(this.voucherGroup?.invoices ?? []),
            ...(this.selectedCondoGroup?.invoices ?? []),
            ...(this.attachmentGroup?.invoices ?? []),
        ];
        rows.filter(row => row._id === invoiceId).forEach(row => row.attachments = receipts);
    }

    requestVoucherDeletion(invoice: InvoiceBody, receipt: Receipt): void {
        if (this.voucherDeleting || this.voucherUploading || receipt.reconciliationStatus !== 'pending') return;
        this.pendingDeletion = { invoice, receipt };
        this.deleteError = '';
        this.deleteVisible = true;
    }

    async deleteVoucher(): Promise<void> {
        const target = this.pendingDeletion;
        if (!target || this.voucherDeleting || this.voucherUploading) return;
        this.voucherDeleting = true;
        this.deleteError = '';
        this.voucherError = '';
        this.voucherMessage = '';
        try {
            await firstValueFrom(this.bankApi.deleteReceipt(target.receipt._id));
            this.replaceAttachments(target.invoice._id, target.invoice.attachments.filter(receipt => receipt._id !== target.receipt._id));
            this.deleteVisible = false;
            this.pendingDeletion = null;
            this.voucherMessage = 'Voucher deleted. You can now upload the correct file.';
            this.getInvoiceHistory();
        } catch (error: unknown) {
            this.deleteError = this.bankError(error);
            try {
                const receipts = await firstValueFrom(this.bankApi.get<{ docs: Receipt[] }>('receipts', { invoiceId: target.invoice._id }));
                this.replaceAttachments(target.invoice._id, receipts.docs);
            } catch { /* Keep the deletion error visible if refresh also fails. */ }
        } finally {
            this.voucherDeleting = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    uploadCorrectVoucher(invoice: InvoiceBody): void {
        if (!this.attachmentGroup || this.voucherDeleting || this.voucherUploading) return;
        this.voucherGroup = this.attachmentGroup;
        this.attachmentVisible = false;
        this.voucherInvoice = invoice;
        this.voucherVisible = true;
        void this.loadVoucherInvoice();
    }

    async uploadVoucher(input: HTMLInputElement): Promise<void> {
        const file = input.files?.[0];
        input.value = '';
        const invoice = this.voucherInvoice;
        if (!file || !invoice || this.voucherUploading || this.voucherLoading || this.voucherDeleting) return;
        this.voucherError = '';
        this.voucherMessage = '';
        if (!this.bankAccountId) { this.voucherError = 'Select a receiving bank account.'; return; }
        if (invoice.attachments.length >= 3) { this.voucherError = 'Each invoice allows up to three vouchers.'; return; }
        if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type) || !/\.(pdf|png|jpe?g)$/i.test(file.name)) {
            this.voucherError = 'Use a PDF, PNG or JPEG file.'; return;
        }
        if (file.size > 8 * 1024 * 1024 || file.size === 0) { this.voucherError = 'Choose a nonempty file up to 8 MiB.'; return; }
        this.voucherUploading = true;
        this.voucherMessage = `Uploading ${file.name}…`;
        try {
            const form = new FormData();
            form.append('file', file, file.name);
            form.append('invoiceId', invoice._id);
            form.append('bankAccountId', this.bankAccountId);
            const receipt = await firstValueFrom(this.bankApi.post<Receipt>('receipts', form));
            this.replaceAttachments(invoice._id, [...invoice.attachments, receipt]);
            this.voucherMessage = 'Voucher uploaded successfully. Payment remains subject to reconciliation.';
            this.getInvoiceHistory();
        } catch (error: unknown) {
            this.voucherMessage = '';
            this.voucherError = this.bankError(error);
            try {
                const receipts = await firstValueFrom(this.bankApi.get<{ docs: Receipt[] }>('receipts', { invoiceId: invoice._id }));
                this.replaceAttachments(invoice._id, receipts.docs);
            } catch { /* Keep the upload error visible if refresh also fails. */ }
        } finally {
            this.voucherUploading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    async downloadVoucher(receipt: Receipt): Promise<void> {
        this.downloadError = '';
        try {
            const blob = await firstValueFrom(this.bankApi.file(receipt._id));
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = receipt.originalName || 'voucher';
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch { this.downloadError = 'Unable to download the voucher. Please retry.'; }
        this._changeDetectorRef.detectChanges();
    }
    public tbl_invoice: any[];
    public loading: boolean = true;
    public token: string;
    public dateInput: Date;
    public statuses!: any[];
    public paymentStatuses!: any[];
    public dialogVisible: boolean;
    public moduleTitle: string = 'Invoice History';
    public displayHistory: boolean;
    public displayStaff: boolean;
    public selectedMonth: string = 'all';
    public monthOptions: MonthOption[] = [];
    private invoiceHistoryRequestId: number = 0;

    //Table settings
    public globalFilters: any;
    public headerTitleDict: any;
    public tableBody: InvoiceBody;
    public selectedPayment: any;
    public excludedColumns: any[];
    @Input() ownerId: string;
    @Input() isHome: boolean;

    constructor(
        private _userService: UserService,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _invoiceService: InvoiceService,
        private _formatFunctions: FormatFunctions,
        private _http: HttpClient,
        private bankApi: BankReconciliationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.excludedColumns = ['_id', 'alias', 'email'];
        this.displayHistory = true;
        this.displayStaff = false;

        this.token = this._userService.getToken();
        this.dialogVisible = false;
        this.globalFilters = ['alias'];

        this.rowMenuItems = [
            { label: 'Upload Voucher', icon: 'pi pi-upload', command: () => this.openVoucher(this.activeMenuGroup) },
            {
                label: 'See details',
                icon: 'pi pi-eye',
                command: () => this.getInvoiceInfo(this.activeMenuGroup),
            },
            {
                label: 'Download CSV',
                icon: 'pi pi-file',
                command: () => this.exportGroupCsv(this.activeMenuGroup),
            },
            {
                label: 'Download PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportGroupPdf(this.activeMenuGroup),
            },
        ];

        this.headerTitleDict = {
            fullname: 'Owner',
            phone: 'Phone',
            unit: 'Unit',
            invoice_issue: 'Issue Date',
            invoice_amount: 'Amount',
            invoice_status: 'Status',
            paymentStatus: 'Payment Status',
        };

        this.tableBody = {
            _id: '',
            fullname: '',
            phone: '',
            unit: '',
            invoice_issue: '',
            invoice_amount: 0,
            invoice_status: '',
            paymentStatus: '',
            alias: '',
            email: '',
            condominiumId: '',
            attachments: [],
            currency: 'DOP',
        };
        this.statuses = [
            { label: 'New', value: 'new' },
            { label: 'Overdue', value: 'overdue' },
        ];

        this.paymentStatuses = [
            { label: 'Paid', value: 'paid' },
            { label: 'Unpaid', value: 'unpaid' },
            { label: 'Split payment', value: 'splited' },
            { label: 'Pending', value: 'pending' },
        ];
        this.monthOptions = this.buildMonthOptions();
    }

    ngOnInit() {
        this._activateRoute.params.subscribe((params) => {
            this.idCondo = params['condoId'] ?? this.ownerId;

            this.getInvoiceHistory();
            this.convertImageToBase64();
        });
    }

    generatePDF() {
        this.exportGroupPdf(this.selectedCondoGroup);
    }

    getInvoiceStatus(invoice_status: string) {
        if (invoice_status == 'active') {
            return 'info';
        } else if (invoice_status == 'completed') {
            return 'success';
        } else if (invoice_status == 'pending') {
            return 'warn';
        } else {
            return 'danger';
        }
    }

    public searchValue: string = '';
    public searchValueHome: string = '';
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
        this.searchValueHome = '';
        if (this.selectedMonth !== 'all') {
            this.selectedMonth = 'all';
            this.getInvoiceHistory();
        }
    }

    onMonthChange(): void {
        this.getInvoiceHistory();
    }

    private buildMonthOptions(referenceDate: Date = new Date()): MonthOption[] {
        const options: MonthOption[] = [{ label: 'All', value: 'all' }];
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
        });

        for (let offset = 0; offset < 12; offset += 1) {
            const date = new Date(
                referenceDate.getFullYear(),
                referenceDate.getMonth() - offset,
                1
            );
            options.push({
                label: formatter.format(date),
                value: `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`,
            });
        }

        return options;
    }

    getPaymentStatus(payment_status: string) {
        if (payment_status == 'pending') {
            return 'warn';
        } else if (payment_status == 'unpaid') {
            return 'danger';
        } else {
            return 'success';
        }
    }

    public idCondo: string;
    public dateOptions: any[];
    public propertyDetailsVar: any[] = [];
    public condoGroups: CondoInvoiceGroup[] = [];
    public selectAll: boolean = false;
    public rowMenuItems: MenuItem[];
    public activeMenuGroup: CondoInvoiceGroup;

    private setInvoiceTableState(rows: InvoiceBody[]): void {
        this.propertyDetailsVar = rows;

        this.condoGroups = this.groupInvoicesByCondo(rows);
        this.selectAll = false;
        this.loading = false;
        this._changeDetectorRef.detectChanges();
    }

    private groupInvoicesByCondo(rows: InvoiceBody[]): CondoInvoiceGroup[] {
        const groups = new Map<string, CondoInvoiceGroup>();
        rows.forEach((row) => {
            const key = row.condominiumId || row.alias || 'unknown';

            if (!groups.has(key)) {
                groups.set(key, {
                    condominiumId: row.condominiumId,
                    alias: row.alias,
                    invoiceCount: 0,
                    totalAmount: 0,
                    invoices: [],
                    selected: false,
                });
            }
            const group = groups.get(key);
            if (group) {
                group.invoiceCount += 1;
                group.totalAmount += Number(row.invoice_amount) || 0;
                group.invoices.push(row);
            }
        });

        return Array.from(groups.values());
    }

    get hasSelectedGroups(): boolean {
        return this.condoGroups.some((group) => group.selected);
    }

    get selectedGroups(): CondoInvoiceGroup[] {
        return this.condoGroups.filter((group) => group.selected);
    }

    toggleSelectAll(checked: boolean): void {
        this.selectAll = checked;
        this.condoGroups.forEach((group) => (group.selected = checked));
    }

    onRowSelectChange(): void {
        this.selectAll =
            this.condoGroups.length > 0 &&
            this.condoGroups.every((group) => group.selected);
    }

    openRowMenu(menu: any, event: Event, group: CondoInvoiceGroup): void {
        this.activeMenuGroup = group;
        menu.toggle(event);
    }

    private buildCsvContent(groups: CondoInvoiceGroup[]): string {
        const header = [
            'Condominium',
            'Owner',
            'Unit',
            'Phone',
            'Issue Date',
            'Amount',
            'Status',
            'Payment Status',
        ];
        const escape = (value: any) =>
            `"${String(value ?? '').replace(/"/g, '""')}"`;
        const lines = [header.map(escape).join(',')];

        groups.forEach((group) => {
            group.invoices.forEach((invoice) => {
                lines.push(
                    [
                        group.alias,
                        invoice.fullname,
                        invoice.unit,
                        invoice.phone,
                        invoice.invoice_issue,
                        invoice.invoice_amount,
                        invoice.invoice_status,
                        invoice.paymentStatus,
                    ]
                        .map(escape)
                        .join(',')
                );
            });
        });

        return lines.join('\n');
    }

    private downloadCsv(content: string, filename: string): void {
        const blob = new Blob([content], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    exportGroupCsv(group: CondoInvoiceGroup): void {
        if (!group) {
            return;
        }
        const content = this.buildCsvContent([group]);
        this.downloadCsv(
            content,
            `invoices-${group.alias || group.condominiumId}.csv`
        );
    }

    exportGroupPdf(group: CondoInvoiceGroup): void {
        if (!group) {
            return;
        }
        this._invoiceService.genGroupPDF(
            group.alias,
            group.invoices,
            this.logoBase64
        );
    }

    exportSinglePdf(invoice: InvoiceBody): void {
        if (!invoice) {
            return;
        }
        this._invoiceService.genPDF(invoice, this.logoBase64);
    }

    exportSelectedCsv(): void {
        const groups = this.selectedGroups;
        if (!groups.length) {
            return;
        }
        const content = this.buildCsvContent(groups);
        this.downloadCsv(content, `invoices-selected-${Date.now()}.csv`);
    }

    getInvoiceHistory() {
        const identity = this._userService.getIdentity();
        const identifier = this.idCondo || identity?._id;
        const requestId = ++this.invoiceHistoryRequestId;
        this.loading = true;

        this._invoiceService
            .getInvoiceByCondo(identifier, this.selectedMonth)
            .subscribe({
                next: (res) => {
                    if (requestId !== this.invoiceHistoryRequestId) {
                        return;
                    }
                    const isSuccess =
                        res?.success === true || res?.status === 'success';
                    const invoices = res?.data?.invoices ?? res?.invoices;

                    if (!isSuccess || !Array.isArray(invoices)) {
                        this.setInvoiceTableState([]);
                        return;
                    }

                    const rows = invoices.map((invoice) => {
                        const owner = invoice?.ownerId;
                        const condominium = invoice?.condominiumId;
                        const propertyDetails = Array.isArray(
                            owner?.propertyDetails
                        )
                            ? owner.propertyDetails
                            : [];
                        const condominiumId =
                            condominium?._id ?? condominium ?? this.idCondo;
                        const property =
                            propertyDetails.find(
                                (detail) =>
                                    String(
                                        detail?.addressId?._id ??
                                            detail?.addressId
                                    ) === String(condominiumId)
                            ) ?? propertyDetails[0];

                        return {
                            fullname: [owner?.name, owner?.lastname]
                                .filter(Boolean)
                                .join(' '),
                            phone: owner?.phone ?? '',
                            unit: property?.condominium_unit ?? '',
                            invoice_issue: invoice?.issueDate ?? '',
                            invoice_amount: invoice?.amount ?? 0,
                            invoice_status: invoice?.status ?? '',
                            paymentStatus: invoice?.paymentStatus ?? '',
                            alias: condominium?.alias ?? '',
                            _id: invoice?._id ?? '',
                            email: owner?.email ?? '',
                            condominiumId: String(condominiumId ?? ''),
                            attachments: invoice?.attachments ?? [],
                            currency: invoice?.currency ?? 'DOP',
                        } satisfies InvoiceBody;
                    });
                    this.setInvoiceTableState(rows);
                },
                error: (err) => {
                    if (requestId !== this.invoiceHistoryRequestId) {
                        return;
                    }
                    console.log(err);
                    this.setInvoiceTableState([]);
                },
            });
    }

    getSeverityFunc(severity) {
        return this._formatFunctions.getSeverity(severity);
    }

    back() {
        this._router.navigate(['/home', this.idCondo]);
    }

    public logoBase64: any;
    public selectedCondoGroup: CondoInvoiceGroup;

    getInvoiceInfo(group: CondoInvoiceGroup) {
        this.dialogVisible = true;
        this.selectedCondoGroup = group;
    }

    convertImageToBase64() {
        this._http
            .get('./assets/noimage.jpeg', { responseType: 'blob' })
            .subscribe((blob) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    this.logoBase64 = reader.result as string;
                };
                reader.readAsDataURL(blob);
            });
    }
}
