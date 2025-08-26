import { Component, Input, OnInit } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
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
};

@Component({
    selector: 'app-invoice-history',
    standalone: true,
    imports: [
        PipesModuleModule,
        CommonModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        TableModule,
        TitleCasePipe,
        DatePipe,
        FloatLabelModule,
        CalendarModule,
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

    //Table settings
    public globalFilters: any;
    public headerTitleDict: any;
    public tableBody: InvoiceBody;
    public selectedPayment: any;
    public excludedColumns: any[];
    @Input() ownerId: string;

    constructor(
        private _userService: UserService,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _invoiceService: InvoiceService,
        private _formatFunctions: FormatFunctions,
        private _http: HttpClient
    ) {
        this.excludedColumns = ['_id', 'alias', 'email'];
        this.displayHistory = true;
        this.displayStaff = false;

        this.token = this._userService.getToken();
        this.dialogVisible = false;
        this.globalFilters = [
            'fullname',
            'phone',
            'unit',
            'invoice_issue',
            'invoice_amount',
            'invoice_status',
            'paymentStatus',
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
    }

    ngOnInit() {
        this._activateRoute.params.subscribe((params) => {
            this.idCondo = params['condoId'] ?? this.ownerId;

            this.getInvoiceHistory();
            this.convertImageToBase64();
        });
    }

    generatePDF() {
        this._invoiceService.genPDF(this.selectedInvoice, this.logoBase64);
    }

    getInvoiceStatus(invoice_status: string) {
        if (invoice_status == 'new') {
            return '';
        } else if (invoice_status == 'completed') {
            return 'success';
        } else {
            return 'danger';
        }
    }

    public searchValue: string;
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    getPaymentStatus(payment_status: string) {
        if (payment_status == 'pending') {
            return 'warning';
        } else if (payment_status == 'unpaid') {
            return 'danger';
        } else {
            return 'success';
        }
    }

    public idCondo: string;
    public dateOptions: any[];
    public propertyDetailsVar: any[] = [];
    getInvoiceHistory() {
        this._invoiceService
            .getInvoiceByCondo(this.token, this.idCondo)
            .subscribe({
                next: (res) => {
                    if (res.status == 'success') {
                        this.propertyDetailsVar = res.invoices.map(
                            (invoice) => {
                                this.tableBody = {
                                    fullname: '',
                                    phone: '',
                                    unit: '',
                                    invoice_issue: '',
                                    invoice_amount: 0,
                                    invoice_status: '',
                                    paymentStatus: '',
                                    _id: '',
                                    alias: '',
                                    email: '',
                                };

                                invoice.invoice_issue = new Date(
                                    <Date>invoice.invoice_issue
                                );

                                invoice.ownerId.propertyDetails.map(
                                    (property) => {
                                        invoice.unit =
                                            property.condominium_unit;
                                    }
                                );

                                this.tableBody.fullname =
                                    invoice.ownerId.name +
                                    ' ' +
                                    invoice.ownerId.lastname;
                                this.tableBody.unit = invoice.unit;
                                this.tableBody.phone = invoice.ownerId.phone;
                                this.tableBody.invoice_issue =
                                    invoice.issueDate;
                                this.tableBody.invoice_amount = invoice.amount;
                                this.tableBody.invoice_status = invoice.status;
                                this.tableBody.paymentStatus =
                                    invoice.paymentStatus;
                                this.tableBody.alias =
                                    invoice.condominiumId.alias;
                                this.tableBody._id = invoice._id;
                                this.tableBody.email = invoice.ownerId.email;

                                return this.tableBody;
                            }
                        );

                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.propertyDetailsVar = [];
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.loading = false;
                    this.propertyDetailsVar = [];
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
    public selectedInvoice: any;
    // public invoiceSelected:any;

    getInvoiceInfo(info: any) {
        this.dialogVisible = true;
        let dateIssue = new Date(info.invoice_issue).getMonth();

        const invoInfo = {
            fullname: info.fullname,
            unit: info.unit,
            phone: info.phone,
            email: info.email,
            invoice_amount: info.invoice_amount,
            invoice_issue: this._formatFunctions.getMonthName(dateIssue),
            alias: info.alias,
            invoice_status: info.invoice_status,
            description: `Maintenance Fee - ${this._formatFunctions.getMonthName(
                dateIssue
            )}`,
            total: info.invoice_amount,
        };

        // this.invoiceSelected = info;
        this.selectedInvoice = invoInfo;
        console.log('info:', invoInfo);
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
