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
import { TabViewModule } from 'primeng/tabview';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { BtnToggleStyle } from 'src/app/pipes/btnToggle';

@Component({
    selector: 'app-see-property',
    templateUrl: './see-property.component.html',
    styleUrls: ['./see-property.component.scss'],
    standalone: true,
    imports: [
        FamilyMemberDetailsComponent,
        PaymentsHistoryComponent,
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
        TabViewModule,
    ],
    providers: [
        UserService,
        CondominioService,
        MessageService,
        FormatFunctions,
        OwnerServiceService,
        ConfirmationService,
        BtnToggleStyle,
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
    public datos: any[] = [];

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
    public _btnToggle = BtnToggleStyle.btnToggleDeleteActive;

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
        this.getProperties();
    }

    public data: any;
    deletePropertyFunc(property: any) {
        this.delProperty = true;

        this._confirmationService.confirm({
            message: 'Are you sure you want to delete this property?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._condominioService
                    .deletePropertyWithAuth(this.token, property._id)
                    .subscribe({
                        next: (response) => {
                            console.log(
                                'response deletePropertyWithAuth',
                                response
                            );
                            if (response.status === 'success') {
                                this.getProperties();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Property deleted successfully!',
                                    life: 3000,
                                });
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Property could not be deleted!',
                                    life: 3000,
                                });
                            }
                        },
                        error: (error) => {
                            console.log('error deletePropertyWithAuth', error);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Property could not be deleted!',
                                life: 3000,
                            });
                        },
                    });
            },
            reject: () => {
                this.delProperty = false;
            },
        });
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
            this.getProperties();
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

    clear(table: Table, searchInput: HTMLInputElement) {
        table.clear();
        searchInput.value = '';
        console.log('Table cleared', table);
    }

    getId(): string {
        return ['admin', 'owner'].includes(this.identity.role.toLowerCase())
            ? this.identity._id
            : this.identity.createdBy;
    }

    btnToggleDeleteActive(status: string) {
        return status === 'inactive'
            ? {
                  severity: 'success',
                  icono: 'pi pi-plus',
                  class: 'p-button-rounded hover:bg-green-600 hover:border-green-600 hover:text-white',
              }
            : {
                  severity: 'danger',
                  icono: 'pi pi-trash',
                  class: 'p-button-rounded hover:bg-red-600 hover:border-red-600 hover:text-white',
              };
    }

    getProperties() {
        this._condominioService
            .getPropertyByIdentifier(this.token, this.getId())
            .subscribe({
                next: (response) => {
                    this.loading = false;
                    if (response.status == 'success') {
                        console.log('ELEMENT:', response);
                        this.properties = response.condominiums;
                        this.row_formating(this.properties);
                    }
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    public ownerIdInput: string;
    ownerDialogDetails() {
        this.visible = true;
        let id = this.identity._id ?? this.identity.ownerId;
        this.ownerIdInput = id;
        this._router.navigate([], {
            queryParams: { userid: id, condoId: this.properties[0]._id },
            queryParamsHandling: 'merge',
        });
    }

    row_formating(properties: any) {
        properties.forEach((p) => {
            p.address = `${p.street_1}, ${p.street_2}, ${p.sector_name}, ${p.city}, ${p.province}, ${p.country}`;
            p.paymentDate = this._format.monthlyBillFormat(p.paymentDate);
            p.phone = this._format.phoneFormat(p.phone);
        });
    }

    onHide() {
        this.delProperty = false;
        this._router.navigate([]);
    }
}
