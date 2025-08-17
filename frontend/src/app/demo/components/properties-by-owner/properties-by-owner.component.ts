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
import { Button } from 'primeng/button';
import { global } from '../../service/global.service';
import { KeysValuesPipe } from 'src/app/pipes/perservedOrder';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';

@Component({
    selector: 'app-properties-by-owner',
    standalone: true,
    imports: [
        ImportsModule,
        CommonModule,
        FormsModule,
        KeysValuesPipe,
        OwnerRegistrationComponent,
    ],
    providers: [
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
    public propertiesOwner: any;
    public unitEditActive: { valid: boolean; index: number }[] = [
        {
            valid: false,
            index: -1,
        },
    ];
    public unitsOptions: Array<{ label: string }> = [{ label: '' }];
    public unitSelected: { label: string }[];
    public parkingOptions: Array<{ label: number }>;
    public parkingSelected: { label: number }[];
    private token: string;
    public showAvailableProperties: boolean = false;
    public sendOwnerDataToPropertyRegistration: any = {};
    public url: string;
    public editBtnStyle: {
        severity: string;
        icon: string;
        class: string;
    }[];
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
        private _invoiceService: InvoiceService,
        private _formatFunctions: FormatFunctions
    ) {
        this.token = this._userService.getToken();
        this.url = global.url;
        this.sendOwnerDataToPropertyRegistration = {};

        this.ownerData = [];
        this.unitsOptions = [{ label: '' }];
        this.unitSelected = [{ label: '' }];
        this.parkingOptions = [
            { label: 0 },
            { label: 1 },
            { label: 2 },
            { label: 3 },
            { label: 4 },
            { label: 5 },
        ];
        this.parkingSelected = [{ label: 0 }];
    }
    ngOnInit(): void {
        this.getActiveProperties();
    }
    getSeverity(status: string) {
        return status == 'active' ? 'primary' : 'danger';
    }

    // Metodo para traer las propiedades activas de un propietario  addProperty
    public availableUnitsList: any[] = [];
    getActiveProperties(): void {
        var [owner, propertyDetails, invoices, _] = [...this.ownerData];
        // variable para las unidades disponibles

        this.propertiesOwner = this.buildData(propertyDetails);
    }

    buildData(propertyDetails: any) {
        propertyDetails.forEach((element, i) => {
            element.id = element.addressId._id;
            element.address =
                element.addressId.street_1 +
                ', ' +
                element.addressId.street_2 +
                ', ' +
                element.addressId.sector_name +
                ', ' +
                element.addressId.province +
                ', ' +
                element.addressId.city +
                ', ' +
                (Boolean(element.addressId.zipcode)
                    ? element.addressId.zipcode
                    : '00000') +
                ', ' +
                element.addressId.country;
            element.alias = element.addressId.alias;
            element.pending_balance = this.getInvoiceByOwnerByOwnerId(
                element.addressId._id
            );
            element.status = element.addressId.status;
            element.units = String(element.condominium_unit);
            element.showUnits = true;
            element.unitSelected = { label: element.units };
            element.parkingSelected = { label: element.parkingsQty };
        });
        this.editBtnStyle = new Array(propertyDetails.length).fill({
            severity: 'warning',
            icon: 'pi pi-pencil',
            class: 'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white',
        });
        console.log('*9****************', propertyDetails);
        // console.log('BTN CONFIG POSITION', this.editBtnStyle);
        return propertyDetails;
    }

    public invoiceFullData = [];
    getInvoiceByOwnerByOwnerId(condoId: string): number {
        let [owner, propertyDetails, invoices, ownerId] = [...this.ownerData];

        if (invoices.length == 0) return 0;

        let invoice = invoices.filter(
            (inv) => inv.ownerId === ownerId && inv.condoId === condoId
        )[0];
        return invoice ? invoice.totalAmount : 0;
    }

    addNewProperty() {
        this.showAvailableProperties = this.showAvailableProperties
            ? false
            : true;

        let [owner, propertyDetails, invoices, ownerId] = [...this.ownerData];

        this.sendOwnerDataToPropertyRegistration = {
            name: owner.name,
            lastname: owner.lastname,
            gender: owner.gender,
            phone: owner.phone.replace(/\D/g, ''),
            id_number: owner.id_number.replace(/\D/g, ''),
            email: owner.email,
        };
    }

    activarEditarUnit(index: any, data: any): void {
        let unitAvilable = [];
        data.showUnits = data.showUnits ? false : true;

        data.addressId.availableUnits.forEach((element: any) => {
            unitAvilable.push({ label: element });
        });

        this.unitsOptions = unitAvilable;

        let btnConfig = this.editBtnStyle[index];

        if (btnConfig.severity == 'success') {
            this.updateProperty(
                data,
                data.unitSelected.label,
                data.parkingSelected.label,
                data.units
            );
        }

        this.editBtnStyle[index] = {
            severity: btnConfig.severity === 'warning' ? 'success' : 'warning',
            icon:
                btnConfig.icon === 'pi pi-pencil'
                    ? 'pi pi-check'
                    : 'pi pi-pencil',
            class:
                btnConfig.class ===
                'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white'
                    ? 'p-button-rounded hover:bg-green-600 hover:border-green-600 hover:text-white'
                    : 'p-button-rounded hover:bg-yellow-600 hover:border-yellow-600 hover:text-white',
        };
    }

    updateProperty(
        data: any,
        unitSelected: string,
        parkingSelected: number,
        currentUnit: string
    ) {
        this._confirmationService.confirm({
            header: 'Confirm',
            message: 'Do you want to save the changes?',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass:
                'p-button-success hover:bg-green-600 hover:border-green-600 hover:text-white',
            rejectButtonStyleClass:
                'p-button-danger hover:bg-red-600 hover:border-red-600 hover:text-white',

            accept: () => {
                this._ownerService
                    .updateUnitToOwner(this.token, {
                        ownerId: this.ownerData[this.ownerData.length - 1],
                        propertyId: data.id,
                        newUnit: unitSelected,
                        parkingsQty: parkingSelected,
                        unit: currentUnit,
                    })
                    .subscribe({
                        next: (response) => {
                            const { propertyDetails } = response.owner;

                            if (response.status === 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Property updated successfully',
                                });

                                this.propertiesOwner =
                                    this.buildData(propertyDetails);
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
                                this.getActiveProperties();
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
                                this.getActiveProperties();
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
