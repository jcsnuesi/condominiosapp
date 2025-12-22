import { Component, Input, OnInit } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
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
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';

// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

type tableData = {
    id: string;
    fullname: string;
    unit: string;
    phone: string;
    email: string;
    amounts: number;
    paymentMehtod: string;
    // isRent: boolean,
    invoice_issue_date: string;
    invoice_due_date: string;
    status: string;
    actions: boolean;
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
    standalone: true,
    imports: [
        FamilyMemberDetailsComponent,
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
        DropdownModule,
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
    templateUrl: '../dynamic-table/dynamic-table.component.html',
    styleUrl: './payments-history.component.css',
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        InvoiceService,
        FormatFunctions,
    ],
})
export class PaymentsHistoryComponent implements OnInit {
    @Input() ownerIdInput!: string;
    public bodyTableInfo: any[];
    public token: string;
    public tableDataStructure: tableData;
    public headertbl: string = 'Payments History';
    public dynamicHeaders: any;
    public getSeverityColor: any;
    public _upperUfunction: any;
    // public _stringFormating:any;
    public visible_dynamic: boolean;
    public visible_spinner: boolean;
    public header_modal_aux = 'Invoice Details';
    public fullItem: any[];
    // public familyMember: any;
    public modalAuxInfo: any;
    public logoBase64: string;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _userService: UserService,
        private _invoiceService: InvoiceService,
        private _stringFormating: FormatFunctions,
        private _http: HttpClient
    ) {
        this.token = this._userService.getToken();
        this.bodyTableInfo = [];
        // this._stringFormating =  new FormatFunctions();
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

        this.getInvoiceByOwner();
        this.base64();
        // console.log('this.ownerIdInput', this.ownerIdInput);
    }

    getInvoiceByOwner() {
        this._invoiceService
            .getInvoiceByOwner(this.token, this.ownerIdInput)
            .subscribe({
                next: (result) => {
                    if (result?.status == 'success') {
                        let invoice = result.invoices;
                        // console.log('===================>invoice', invoice);
                        this.bodyTableInfo = invoice.map((invoice) => {
                            let { condominiumId, _ } = invoice;
                            // let fullname = `${invoice.ownerId.name} ${invoice.ownerId.lastname}`;

                            return {
                                id: invoice._id,
                                fullname:
                                    invoice.ownerId.name +
                                    ' ' +
                                    invoice.ownerId.lastname,
                                alias: condominiumId.alias,
                                unit: invoice.ownerId.propertyDetails[0]
                                    .condominium_unit,
                                phone: invoice.ownerId.phone,
                                email: invoice.ownerId.email,
                                amounts: invoice.amount,
                                paymentMehtod: invoice.payment_method,
                                invoice_issue_date:
                                    this._stringFormating.dateFormat(
                                        invoice.issueDate
                                    ),
                                invoice_due_date:
                                    this._stringFormating.dateFormat(
                                        invoice.issueDate
                                    ),
                                status: invoice.status,
                                actions: true,
                                propertyDetails: invoice,
                            };
                        });
                        // console.log('bodyTableInfo', this.bodyTableInfo);
                    }
                },
                error: (error) => {
                    console.log('error', error);
                },
            });
    }

    base64() {
        this._http
            .get('assets/noimage.jpeg', { responseType: 'blob' })
            .subscribe({
                next: (result) => {
                    var reader = new FileReader();
                    reader.onloadend = () => {
                        this.logoBase64 = reader.result.toString();
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

        console.log('data....', data);
        this._invoiceService.genPDF(data, this.logoBase64);
    }
}
