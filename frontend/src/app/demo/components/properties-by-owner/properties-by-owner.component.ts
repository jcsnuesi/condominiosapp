import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ImportsModule } from '../../imports_primeng';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogModule, Dialog } from 'primeng/dialog';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { InvoiceService } from '../../service/invoice.service';

import { global } from '../../service/global.service';
import { KeysValuesPipe } from 'src/app/pipes/perservedOrder';
import { FormatFunctions } from 'src/app/pipes/formating_text';

@Component({
    selector: 'app-properties-by-owner',
    standalone: true,
    imports: [ImportsModule, CommonModule, FormsModule, KeysValuesPipe],
    providers: [
        MessageService,
        ConfirmationService,
        CondominioService,
        UserService,
        OwnerServiceService,
        FormatFunctions,
    ],
    templateUrl: './properties-by-owner.component.html',
    styleUrl: './properties-by-owner.component.css',
})
export class PropertiesByOwnerComponent implements OnInit {
    public title: string = 'Properties by Owner';
    public propertiesOwner: any[] = [];
    public unitEditActive: { valid: boolean; index: number }[] = [
        {
            valid: false,
            index: -1,
        },
    ];
    public propertiesSelected: { label: string } = { label: '' };
    public parkingSelected: { label: string } = { label: '' };
    private token: string;
    public showAvailableProperties: boolean = false;
    public url: string;
    public parkingOptions: any[] = [
        { label: '0' },
        { label: '1' },
        { label: '2' },
        { label: '3' },
        { label: '4' },
        { label: '5' },
    ];
    public editBtnStyle: {
        severity: string;
        icon: string;
        class: string;
    }[];
    public unitAvilable: any;
    @Input() ownerData: any;
    @Input('propertyData') propertyData: [] = [];
    @Output() propertyDataChange: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _formatFunctions: FormatFunctions
    ) {
        this.token = this._userService.getToken();
        this.url = global.url;
        this.editBtnStyle = [
            {
                severity: 'warning',
                icon: 'pi pi-pencil',
                class: 'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white',
            },
        ];
        this.unitAvilable = JSON.parse(localStorage.getItem('property')!);

        this.unitAvilable.address =
            this.unitAvilable.street_1 +
            ', ' +
            this.unitAvilable.street_2 +
            ', ' +
            this.unitAvilable.sector_name +
            ', ' +
            this.unitAvilable.province +
            ', ' +
            this.unitAvilable.city +
            ', ' +
            (Boolean(this.unitAvilable.zipcode)
                ? this.unitAvilable.zipcode
                : '00000') +
            ', ' +
            this.unitAvilable.country;
    }
    ngOnInit(): void {
        this.fetchActiveProperties();
        // this.sortUnits();
        // console.log('this.unitAvilable', this.ownerData);
        // this.fetchAvailableProperties();
    }
    getSeverity(status: string) {
        return status == 'active' ? 'success' : 'danger';
    }

    // Metodo para traer las propiedades activas de un propietario  addProperty
    public availableUnitsList: any[] = [];
    fetchActiveProperties(): void {
        let id = this.ownerData + '-properties';
        this.unitAvilable.ownerId = this.ownerData;

        this._ownerService.getPropertyByOwner(this.token, id).subscribe({
            next: (data) => {
                this._invoiceService
                    .getInvoiceByOwner(this.token, id)
                    .subscribe({
                        next: (invoice) => {
                            if (invoice.status === 'success') {
                                console.log(
                                    'data',
                                    data.message[0].propertyDetails
                                );
                                this.propertiesOwner =
                                    data.message[0].propertyDetails.map(
                                        (property: any, index: number) => {
                                            this.editBtnStyle[index] = {
                                                severity: 'warning',
                                                icon: 'pi pi-pencil',
                                                class: 'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white',
                                            };
                                            this.unitEditActive[index] = {
                                                valid: false,
                                                index: -1,
                                            };

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
                                                parkingsQty:
                                                    property.parkingsQty,
                                            };
                                        }
                                    );
                                let availableUnt =
                                    data.message[0].propertyDetails[
                                        data.message[0].propertyDetails.length -
                                            1
                                    ].addressId;
                                let uniqueObjects: any = {};
                                data.message.forEach((obj) => {
                                    if (obj.propertyDetails.length > 0) {
                                        obj.propertyDetails.forEach(
                                            (property: any) => {
                                                if (property.addressId.alias) {
                                                    uniqueObjects[
                                                        property.addressId.alias
                                                            .split(' ')
                                                            .join('_')
                                                    ] = {
                                                        alias: property
                                                            .addressId.alias,
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
                                                            property.addressId
                                                                .city +
                                                            ', ' +
                                                            (property.addressId
                                                                .zipcode ??
                                                                '00000') +
                                                            ', ' +
                                                            property.addressId
                                                                .country,
                                                        availableUnits:
                                                            this._formatFunctions.splitlist(
                                                                property
                                                                    .addressId
                                                                    .availableUnits
                                                            ),
                                                    };
                                                }
                                            }
                                        );
                                    }
                                });

                                this.availableUnitsList.push(uniqueObjects);

                                console.log(
                                    'availableUnitsList',
                                    this.availableUnitsList
                                );
                                this.propertyDataChange.emit(true);
                            }
                            // console.log('INVOICE', this.propertiesOwner);
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

    activarEditarUnit(index: number, data: any): void {
        let condition = Boolean(this.unitEditActive[index].valid == false)
            ? true
            : false;
        if (condition) {
            this.editBtnStyle[index] = {
                severity: 'success',
                icon: 'pi pi-check',
                class: 'p-button-rounded hover:bg-green-600 hover:border-green-600 hover:text-white',
            };
            this.propertiesSelected = { label: data.unit };
            this.parkingSelected = { label: data.parkingsQty };

            this.unitEditActive[index].valid = condition;
            this.unitEditActive[index].index = index;
        } else {
            this._confirmationService.confirm({
                header: 'Confirm',
                message: 'Do you want to save the changes?',
                icon: 'pi pi-exclamation-triangle',
                acceptButtonStyleClass:
                    'p-button-success hover:bg-green-600 hover:border-green-600 hover:text-white',
                rejectButtonStyleClass:
                    'p-button-danger hover:bg-red-600 hover:border-red-600 hover:text-white',

                accept: () => {
                    this.updateProperty(
                        data,
                        this.propertiesSelected,
                        this.parkingSelected,
                        this.propertiesOwner[index].unit
                    );
                },
                reject: () => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'error',
                        detail: 'Changes not saved',
                    });
                },
            });
            this.editBtnStyle[index] = {
                severity: 'warning',
                icon: 'pi pi-pencil',
                class: 'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white',
            };
            this.unitEditActive[index].valid = condition;
            this.unitEditActive[index].index = -1;
        }
    }

    updateProperty(
        data: any,
        unitSelected: { label: string },
        parkingSelected: { label: string },
        currentUnit: { label: string }
    ) {
        this._ownerService
            .updateUnitToOwner(this.token, {
                ownerId: this.ownerData,
                propertyId: data.id,
                newUnit: unitSelected.label,
                parkingsQty: parkingSelected.label,
                unit: currentUnit,
            })
            .subscribe({
                next: (response) => {
                    if (response.status === 'success') {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Property updated successfully',
                        });

                        this.fetchActiveProperties();
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error updating property',
                        });
                    }
                },
                error: (err) => {
                    console.log('ERROR', err);
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error updating property',
                    });
                },
            });
    }

    public loading: boolean = false;
    addProperty(data: any, unitSelected: any, parkingSelected: any): void {
        let { _id, ownerId } = data;

        if (unitSelected.label === '' || parkingSelected.label === '') {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a unit and parking space',
            });
            return;
        }

        this._confirmationService.confirm({
            header: 'Confirm',
            message: 'Do you want to add this property?',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass:
                'p-button-success hover:bg-green-600 hover:border-green-600 hover:text-white',
            rejectButtonStyleClass:
                'p-button-danger hover:bg-red-600 hover:border-red-600 hover:text-white',

            accept: () => {
                this.loading = true;
                this._ownerService
                    .addUnitToOwner(this.token, {
                        addressId: _id,
                        ownerId: ownerId,
                        unit: unitSelected.label,
                        parkingsQty: parkingSelected.label,
                    })
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Property added successfully',
                                });
                                this.fetchActiveProperties();
                                this.showAvailableProperties = false;
                                this.loading = false;
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Error adding property',
                                });
                                this.loading = false;
                            }
                        },
                        error: (err) => {
                            console.log('ERROR', err);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error adding property',
                            });
                            this.loading = false;
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'error',
                    detail: 'Changes not saved',
                });
            },
        });
    }

    deleteUnit(addressId: string, unit: string): void {
        this._confirmationService.confirm({
            header: 'Confirm',
            message: 'Do you want to delete this property?',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass:
                'p-button-success hover:bg-green-600 hover:border-green-600 hover:text-white',
            rejectButtonStyleClass:
                'p-button-danger hover:bg-red-600 hover:border-red-600 hover:text-white',
            accept: () => {
                this._ownerService
                    .deleteUnitToOwner(this.token, {
                        propertyId: addressId,
                        ownerId: this.ownerData,
                        unit: unit,
                    })
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Property deleted successfully',
                                });
                                this.fetchActiveProperties();
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Error deleting property',
                                });
                            }
                        },
                        error: (err) => {
                            console.log('ERROR', err);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error deleting property',
                            });
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unit not deleted',
                });
            },
        });
    }
}
