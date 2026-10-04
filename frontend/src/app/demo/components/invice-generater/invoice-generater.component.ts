import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { unitOwerDetails } from '../../models/property_details_type';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InvoiceService } from '../../service/invoice.service';
import { CondominioService } from '../../service/condominios.service';
import { TextareaModule } from 'primeng/textarea';

type InvoiceDetails = {
    issueDate: Date | string;
    amount: number;
    description?: string;
    condominiumId: string;
    ownerId: { label: string; value: string; unitNumber: string } | null;
    paymentDescription: { label: string; value: string } | null;
};

type UpdateInvoiceInfo = {
    mPayment: number;
    paymentDate: string;
    id: string;
};

@Component({
    selector: 'app-invice-generater',
    imports: [
        TextareaModule,
        IconFieldModule,
        InputIconModule,
        SelectModule,
        DatePickerModule,
        ConfirmPopupModule,
        ButtonModule,
        TagModule,
        CardModule,
        ConfirmDialogModule,
        TableModule,
        SelectModule,
        FormsModule,
        FileUploadModule,
        InputGroupModule,
        InputGroupAddonModule,
        ToastModule,
        InputTextModule,
        AvatarModule,
        AvatarGroupModule,
        ToolbarModule,
        DialogModule,
        InputTextModule,
    ],
    templateUrl: './invoice-generater.component.html',
    styleUrl: './invoice-generater.component.css',
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        InvoiceService,
        CondominioService,
    ],
})
export class InviceGeneraterComponent {
    public invoice_date_label: Date | undefined;
    public updateInfo: UpdateInvoiceInfo;
    public display: boolean;
    public invoiceInfo: InvoiceDetails;
    public invoiceBelongsTo: { label: string; value: string }[];
    public condoInfo: any;
    public invoiceSetup: boolean;
    public token: string;
    public invoiceBelongsToSelected: any;
    public paymentDescriptionSelected: Array<{ label: string; value: string }> =
        [
            { label: 'Rent', value: 'Rent' },
            { label: 'Plumber', value: 'Plumber' },
            { label: 'Electricity', value: 'Electricity' },
            { label: 'Water', value: 'Water' },
            { label: 'Others', value: 'Others' },
        ];
    public ownerSelected: Array<{ label: string; value: string; unitNumber: string }> = [];
    private invoiceOperationKey = crypto.randomUUID();
    @Output() facturaGenerada = new EventEmitter<any>();
    @Input() invoiceData: any;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _userService: UserService,
        private _invoiceService: InvoiceService,
        private _condoService: CondominioService
    ) {
        this.token = this._userService.getToken();

        let dataFromFatherComponent = { ...this.invoiceData };
        this.invoiceInfo = {
            issueDate: '',
            amount: 0,
            description: '',
            condominiumId: '',
            ownerId: null,
            paymentDescription: null,
        };

        this.updateInfo = {
            mPayment: dataFromFatherComponent.mPayment ?? 0,
            paymentDate: dataFromFatherComponent.paymentDate,
            id: dataFromFatherComponent._id,
        };
        // console.log('Update Info:', this.updateInfo);
        this.invoiceSetup = false;
    }

    setTodayDate() {
        const today = new Date(this.condoInfo.paymentDate);

        return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }

    dueDateInfo() {
        let dueDate = new Date(this.condoInfo.paymentDate);

        dueDate.setDate(dueDate.getDate() + 30);

        return dueDate.toISOString().split('T')[0];
    }

    onClickInvoiceOwnerMultiSelect() {
        interface Property { condominium_unit: string; addressId?: string | { _id: string }; status_property?: string; }
        interface InvoiceOwner { _id: string; name: string; lastname: string; propertyDetails: Property[]; }
        const entries = this.invoiceData.units_ownerId as Array<InvoiceOwner | { ownerId: InvoiceOwner; status?: string }>;
        this.ownerSelected = entries.flatMap(entry => {
            if ('status' in entry && entry.status === 'inactive') return [];
            const owner = 'ownerId' in entry ? entry.ownerId : entry;
            return (owner.propertyDetails || []).filter(property => {
                const address = typeof property.addressId === 'object' ? property.addressId._id : property.addressId;
                return property.status_property !== 'inactive' && (!address || address === this.invoiceData._id);
            }).map(property => ({ label: owner.name + ' ' + owner.lastname + ' · ' + property.condominium_unit, value: owner._id, unitNumber: property.condominium_unit }));
        });
    }

    saveInvoice() {
        const data = {
            issueDate: this.invoiceInfo.issueDate,
            amount: this.invoiceInfo.amount,
            description: this.invoiceInfo.description,
            condominiumId: this.invoiceData._id,
            ownerId: this.invoiceInfo.ownerId?.value,
            unitNumber: this.invoiceInfo.ownerId?.unitNumber,
            paymentDescription: this.invoiceInfo.paymentDescription?.value,
            idempotencyKey: this.invoiceOperationKey,
        };

        // console.log('INVOICE data:*----->', data);
        // return;
        this.confirmationService.confirm({
            message: 'Are you sure you want to do this action?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._invoiceService.createInvoice(data).subscribe({
                    next: (data) => {
                        if (data.status === 'success') {
                            this.invoiceSetup = true;
                            this.invoiceOperationKey = crypto.randomUUID();

                            // Emitimos el evento para que se actualie el toast de factura generada
                            this.facturaGenerada.emit({
                                severity: 'success',
                                summary: 'Successfully!',
                                detail: 'Invoice generated successfully!',
                            });
                            // Cerramos el dialogo de invoice
                            this.onHide();
                        } else {
                            this.facturaGenerada.emit({
                                severity: 'error',
                                summary: 'Unsuccessful!',
                                detail: 'Invoice was not generated.',
                            });
                        }
                    },
                    error: (error) => {
                        this.facturaGenerada.emit({
                            severity: 'error',
                            summary: 'Unsuccessful!',
                            detail: 'Invoice was not generated.',
                        });
                        console.error('There was an error!', error);
                    },
                    complete: () => {
                        console.log('Completed');
                    },
                });
            },
        });
    }

    generateNow() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to do this action?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successfully!',
                    detail: 'Invoice generated successfully!',
                });

                this._invoiceService
                    .generateInvoice({ condominiumId: this.invoiceData._id })
                    .subscribe({
                        next: (data) => {
                            if (data.status === 'success') {
                                this.invoiceSetup = true;

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successfully!',
                                    detail: 'Invoice generated successfully!',
                                });
                            }
                            console.log(data);
                        },
                        error: (error) => {
                            console.error('There was an error!', error);
                        },
                        complete: () => {
                            console.log('Completed');
                        },
                    });
            },
        });
    }

    onHide() {
        this.display = false;

        this.condoInfo = JSON.parse(localStorage.getItem('property'));
    }

    open() {
        this.display = true;
    }
}
