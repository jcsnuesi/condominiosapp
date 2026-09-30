import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
    CommonModule,
    KeyValuePipe,
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
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.excludedColumns = ['_id', 'alias', 'email'];
        this.displayHistory = true;
        this.displayStaff = false;

        this.token = this._userService.getToken();
        this.dialogVisible = false;
        this.globalFilters = ['alias'];

        this.rowMenuItems = [
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
