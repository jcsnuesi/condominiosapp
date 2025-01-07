import { Component, OnInit, DoCheck } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { CondominioService } from '../../service/condominios.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { HasRoleDirective } from 'src/app/has-role.directive';
import { FormatFunctions } from '../../../pipes/formating_text';
import { OwnerServiceService } from '../../service/owner-service.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-see-property',
    templateUrl: './see-property.component.html',
    styleUrls: ['./see-property.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        TabMenuModule,
        TagModule,
        TableModule,
        ButtonModule,
        HasRoleDirective,
        ChangePasswordComponent,
        ConfirmDialogModule,
        ToastModule,
    ],
    providers: [
        UserService,
        CondominioService,
        MessageService,
        FormatFunctions,
        OwnerServiceService,
        ConfirmationService,
    ],
})
export class SeePropertyComponent implements OnInit {
    private token: string = this._userService.getToken();
    public sendDataToModal: any;
    public customers: any[] = [];
    public url: string;
    public selectedCustomers: any;
    public loading: boolean;
    public identity: any;
    public header_changer: string;
    public addressInfo: any[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    public layout: string;
    public statuses!: any[];
    public representatives: any;
    public visible: boolean = false;
    public modify: boolean;
    public items: any[] = [];
    public activeItem: any;
    messageEvent: any;
    public status: string;
    public properties: any;
    public changePasswordDialog: boolean = false;
    public delProperty: boolean;

    constructor(
        private _router: Router,
        public _userService: UserService,
        private _condominioService: CondominioService,
        private _format: FormatFunctions,
        private _ownerServiceService: OwnerServiceService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService
    ) {
        this.url = global.url;

        this.statuses = [
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
        ];

        this.identity = this._userService.getIdentity();
        this.loading = true;
        this.delProperty = false;
    }

    ngOnInit() {
        this.getAdminsProperties();
    }

    public data: any;
    deletePropertyFunc(property: any) {
        this.delProperty = true;
        this.data = property;
    }

    passwordChanged(event: boolean) {
        if (event) {
            this.delProperty = false;
            this._messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Property deleted successfully!',
                life: 3000,
            });
            this.getAdminsProperties();
        } else {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Password was not Changed',
                life: 3000,
            });
        }
    }

    goToDashboard(event: any) {
        this._router.navigate(['home/', event._id]);
    }

    clear(table: Table) {
        table.clear();
    }

    fechaCreacion(fecha) {
        return this._format.dateFormat(fecha);
    }

    getAdminsProperties() {
        switch (this.identity.role) {
            case 'ADMIN':
                this._condominioService
                    .getPropertyByAdminId(this.token)
                    .subscribe({
                        next: (response) => {
                            this.loading = false;

                            if (response.status == 'success') {
                                this.properties = response.message;
                            }
                        },
                        error: (error) => {
                            console.log(error);
                        },
                        complete: () => {
                            console.log('See property completed!');
                        },
                    });
                break;

            case 'OWNER':
                this._ownerServiceService
                    .getPropertyByOwner(this.token)
                    .subscribe({
                        next: (response) => {
                            this.properties = [];
                            this.loading = false;

                            if (response.status == 'success') {
                                response.message[0].propertyDetails.forEach(
                                    (element) => {
                                        console.log('ELEMENT:', element);
                                        this.properties.push({
                                            avatar: element.addressId.avatar,
                                            alias: element.addressId.alias,
                                            phone: element.addressId.phone,
                                            address: element.addressId.address,
                                            city: element.addressId.city,
                                            country: element.addressId.country,
                                            province:
                                                element.addressId.province,
                                            sector_name:
                                                element.addressId.sector_name,
                                            street_1:
                                                element.addressId.street_1,
                                            street_2:
                                                element.addressId.street_2,
                                            createdAt: this._format.dateFormat(
                                                element.addressId.createdAt
                                            ),
                                            property_id: element.addressId._id,
                                            status: element.addressId.status,
                                            mPayment:
                                                element.addressId.mPayment,
                                        });
                                    }
                                );
                            }
                        },
                        error: (error) => {
                            console.log('For owner propuse:', error);
                        },
                        complete: () => {
                            console.log('See OWNER property completed!');
                        },
                    });

                break;
        }
    }

    ownerDialogDetails() {
        this.visible = true;
    }

    full_address_func(customer) {
        return `${customer.street_1}, ${customer.street_2}, ${customer.sector_name}, ${customer.city}, ${customer.province}, ${customer.country}`;
    }

    propertyName(alias) {
        return alias.toUpperCase();
    }
}
