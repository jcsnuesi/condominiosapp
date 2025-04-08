import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogModule, Dialog } from 'primeng/dialog';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { InvoiceService } from '../../service/invoice.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { global } from '../../service/global.service';

@Component({
    selector: 'app-properties-by-owner',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        TagModule,
        PanelModule,
        ConfirmDialogModule,
        DialogModule,
        AvatarModule,
        AvatarGroupModule,
    ],
    providers: [
        MessageService,
        ConfirmationService,
        CondominioService,
        UserService,
        OwnerServiceService,
    ],
    templateUrl: './properties-by-owner.component.html',
    styleUrl: './properties-by-owner.component.css',
})
export class PropertiesByOwnerComponent implements OnInit {
    public title: string = 'Properties by Owner';
    public propertiesOwner: any[] = [];
    public propertiesSelected: { label: string } = { label: '' };
    public parkingSelected: { label: string } = { label: '' };
    private token: string;
    public showAvailableProperties: boolean = false;
    public url: string;
    public parkingOptions: any[] = [
        { label: '1' },
        { label: '2' },
        { label: '3' },
        { label: '4' },
        { label: '5' },
    ];
    @Input() ownerData: any;
    @Input('propertyData') propertyData: [] = [];

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService
    ) {
        this.token = this._userService.getToken();
        this.url = global.url;
    }
    ngOnInit(): void {
        this.fetchActiveProperties();
        // this.fetchAvailableProperties();
    }
    getSeverity(status: string) {
        return status == 'active' ? 'success' : 'danger';
    }

    // Metodo para traer las propiedades activas de un propietario
    fetchActiveProperties(): void {
        let id = this.ownerData + '-properties';

        this._ownerService.getPropertyByOwner(this.token, id).subscribe({
            next: (data) => {
                this._invoiceService
                    .getInvoiceByOwner(this.token, id)
                    .subscribe({
                        next: (invoice) => {
                            console.log('INVOICE', invoice);
                            if (invoice.status === 'success') {
                                this.propertiesOwner =
                                    data.message[0].propertyDetails.map(
                                        (property: any) => {
                                            return {
                                                id: property.addressId._id,
                                                alias: property.addressId.alias,
                                                unit: property.condominium_unit,
                                                address:
                                                    property.addressId
                                                        .street_1 +
                                                    ', ' +
                                                    property.addressId
                                                        .street_2 +
                                                    ', ' +
                                                    property.addressId
                                                        .sector_name +
                                                    ', ' +
                                                    property.addressId
                                                        .province +
                                                    ', ' +
                                                    property.addressId.city +
                                                    ', ' +
                                                    (property.addressId
                                                        .zipcode ?? '00000') +
                                                    ', ' +
                                                    property.addressId.country,
                                                status: property.addressId
                                                    .status,
                                                pending_balance:
                                                    invoice.invoices.reduce(
                                                        (
                                                            acc: any,
                                                            curr: any
                                                        ) => {
                                                            return (
                                                                acc +
                                                                curr.amount
                                                            );
                                                        },
                                                        0
                                                    ),
                                            };
                                        }
                                    );
                            }
                        },
                        error: (err: any) => {
                            console.log('ERROR2', err);
                        },
                    });
            },
            error: (err: any) => {
                console.log('ERROR', err);
            },
        });
    }

    addProperty(data: any, unitSelected: any, parkingSelected: any): void {
        let datos = { ...data };
        datos['unit'] = unitSelected.label;
        datos['parkingsQty'] = parkingSelected.label;
        delete datos['units'];
        const id = datos.ownerId.filter(
            (owner: any) => owner._id === this.ownerData
        )[0]._id;
        datos['ownerId'] = id;

        console.log('RESPONSE', datos);

        this._ownerService.addUnitToOwner(this.token, datos).subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Property added successfully',
                    });
                    this.fetchActiveProperties();
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error adding property',
                    });
                }
            },
            error: (err) => {
                console.log('ERROR', err);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error adding property',
                });
            },
        });
    }
}
