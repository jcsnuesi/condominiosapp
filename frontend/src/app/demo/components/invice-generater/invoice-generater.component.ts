import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { FormsModule, NgForm } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { unitOwerDetails } from '../../models/property_details_type';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InvoiceService } from '../../service/invoice.service';
import { CondominioService } from '../../service/condominios.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

type InvoiceDetails = {
    issueDate: Date | string;
    amount: number;
    description?: string;
    condominiumId: string;
    ownerId: Array<{ label: string; value: string }>;
    paymentDescription: Array<{ label: string; value: string }>;
};

type UpdateInvoiceInfo = {
    mPayment: number;
    paymentDate: string;
    id: string;
};

@Component({
    selector: 'app-invice-generater',
    standalone: true,
    imports: [
        InputTextareaModule,
        HasPermissionsDirective,
        IconFieldModule,
        InputIconModule,
        DropdownModule,
        CalendarModule,
        ConfirmPopupModule,
        ButtonModule,
        TagModule,
        CardModule,
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
    public ownerSelected: Array<{ label: string; value: string }> = [];
    @Output() facturaGenerada = new EventEmitter<any>();

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _userService: UserService,
        private _invoiceService: InvoiceService,
        private _condoService: CondominioService
    ) {
        this.token = this._userService.getToken();
        this.condoInfo = JSON.parse(localStorage.getItem('property'));

        this.invoiceInfo = {
            issueDate: '',
            amount: 0,
            description: '',
            condominiumId: '',
            ownerId: [],
            paymentDescription: [],
        };

        this.updateInfo = {
            mPayment: 0,
            paymentDate: '',
            id: '',
        };

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

    updateInvoice() {
        const formData = new FormData();
        formData.append('mPayment', this.updateInfo.mPayment.toString());
        formData.append('paymentDate', this.updateInfo.paymentDate);
        formData.append('id', this.updateInfo.id);
        this._condoService.updateCondominium(this.token, formData).subscribe({
            next: (data) => {
                if (data.status === 'success') {
                    // localStorage.setItem('property', JSON.stringify(data.property));
                    // Emitimos el evento para que se actualie el toast de factura generada
                    this.facturaGenerada.emit({
                        severity: 'success',
                        summary: 'Successfully!',
                        detail: 'Invoice updated successfully!',
                    });
                    // Cerramos el dialogo de invoice
                    this.onHide();
                } else {
                    this.facturaGenerada.emit({
                        severity: 'error',
                        summary: 'Fail',
                        detail: 'Invoice was not updated.',
                    });
                }
            },
            error: (error) => {
                this.facturaGenerada.emit({
                    severity: 'danger',
                    summary: 'Fail',
                    detail: 'Invoice was not updated.',
                });
                console.error('There was an error!', error);
            },
            complete: () => {
                console.log('Completed');
            },
        });
    }

    onClickInvoiceOwnerMultiSelect() {
        // let propertyOwner = this.condoInfo;

        this.ownerSelected = this.condoInfo.units_ownerId.map((owner: any) => {
            let propertyInfo = {};
            owner.propertyDetails.forEach((property: any) => {
                propertyInfo = {
                    label: `${owner.name} ${owner.lastname} - ${property.condominium_unit}`,
                    value: owner._id,
                };
            });
            return propertyInfo;
        });
    }

    saveInvoice() {
        let data = {};
        for (const key in this.invoiceInfo) {
            if (
                typeof this.invoiceInfo[key] === 'object' &&
                Boolean(this.invoiceInfo[key].value != undefined)
            ) {
                data[key] = this.invoiceInfo[key].value;
            } else {
                data[key] = this.invoiceInfo[key];
            }
        }

        // console.log('INVOICE data:*----->', data);
        // return;
        this.confirmationService.confirm({
            message: 'Are you sure you want to do this action?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._invoiceService.createInvoice(this.token, data).subscribe({
                    next: (data) => {
                        if (data.status === 'success') {
                            this.invoiceSetup = true;

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
                    .generateInvoice(this.token, this.invoiceInfo)
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

        this.updateInfo = {
            mPayment: this.condoInfo.mPayment,
            paymentDate: this.setTodayDate(),
            id: this.condoInfo._id,
        };

        this.invoiceInfo = {
            issueDate: '',
            amount: 0,
            condominiumId: this.condoInfo._id,
            ownerId: [],
            paymentDescription: [],
        };
    }
}
