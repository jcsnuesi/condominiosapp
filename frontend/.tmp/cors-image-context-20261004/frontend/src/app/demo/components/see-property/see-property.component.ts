import {
    afterNextRender,
    ChangeDetectorRef,
    Component,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import {
    CondominioService,
    PermanentDeleteImpact,
} from '../../service/condominios.service';
import { AccessContextService } from '../../service/access-context.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Menu, MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

import { FormatFunctions } from '../../../pipes/formating_text';
import { OwnerServiceService } from '../../service/owner-service.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { BtnToggleStyle } from 'src/app/pipes/btnToggle';
import { finalize } from 'rxjs';

interface PropertyAddressSource {
    street_1?: unknown;
    street_2?: unknown;
    sector_name?: unknown;
    city?: unknown;
    province?: unknown;
    country?: unknown;
    paymentDate?: string;
    phone?: string;
    [key: string]: unknown;
}

@Component({
    selector: 'app-see-property',
    templateUrl: './see-property.component.html',
    styleUrls: ['./see-property.component.scss'],
    imports: [
        FamilyMemberDetailsComponent,
        PaymentsHistoryComponent,
        CommonModule,
        FormsModule,
        DialogModule,
        TabsModule,
        TagModule,
        TableModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        SelectModule,
        MenuModule,
        TooltipModule,
        RouterModule,
        ConfirmDialogModule,
        ToastModule,
        CheckboxModule,
        PasswordModule,
        ProgressSpinnerModule,
        TabsModule,
        HasPermissionsDirective,
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
export class SeePropertyComponent {
    viewMode: 'table' | 'cards' = 'cards';
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
    public properties: any[] = [];
    public changePasswordDialog: boolean = false;
    public delProperty: boolean;
    public _btnToggle = BtnToggleStyle.btnToggleDeleteActive;
    public rowMenuItems: MenuItem[] = [];
    public activeMenuProperty: any;
    public permanentDeletePassword = '';
    public permanentDeleteAcknowledged = false;
    public readonly permanentDeleteDialogVisible = signal(false);
    public readonly permanentDeleteImpact =
        signal<PermanentDeleteImpact | null>(null);
    public readonly permanentDeleteImpactLoading = signal(false);
    public readonly permanentDeleteSubmitting = signal(false);

    constructor(
        private _router: Router,
        public _userService: UserService,
        private _condominioService: CondominioService,
        private _format: FormatFunctions,
        private _ownerServiceService: OwnerServiceService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly accessContext: AccessContextService
    ) {
        this.url = global.url;

        this.statuses = [
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
        ];

        this.identity = this._userService.getIdentity();
        this.loading = true;
        this.delProperty = false;

        afterNextRender(() => this.getProperties());
    }

    public data: any;
    openRowMenu(menu: Menu, event: Event, property: any): void {
        this.activeMenuProperty = property;
        this.rowMenuItems = [
            {
                label: 'View details',
                icon: 'pi pi-eye',
                command: () => this.openPropertyDetails(property),
            },
        ];

        if (
            this.identity?.role?.toLowerCase() === 'admin' ||
            this.accessContext.hasPermission('condominiums.delete')
        ) {
            this.rowMenuItems.push(
                { separator: true },
                {
                    label:
                        property.status === 'inactive'
                            ? 'Activate property'
                            : 'Suspend property',
                    icon:
                        property.status === 'inactive'
                            ? 'pi pi-check-circle'
                            : 'pi pi-pause-circle',
                    styleClass:
                        property.status === 'inactive'
                            ? 'see-property-activate-action'
                            : 'see-property-delete-action',
                    command: () => this.deletePropertyFunc(property),
                },
                { separator: true },
                {
                    label: 'Permanently delete',
                    icon: 'pi pi-trash',
                    styleClass: 'see-property-permanent-delete-action',
                    command: () => this.openPermanentDelete(property),
                }
            );
        }

        menu.model = this.rowMenuItems;
        menu.toggle(event);
    }

    private openPropertyDetails(property: any): void {
        if (this.identity?.role?.toLowerCase() === 'owner') {
            this.ownerDialogDetails(property);
            return;
        }
        this.goToDashboard(property);
    }

    deletePropertyFunc(property: any) {
        this.delProperty = true;

        this._confirmationService.confirm({
            message: 'Are you sure you want to delete this property?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._condominioService
                    .deletePropertyWithAuth(property._id)
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

    openPermanentDelete(property: { _id: string; alias: string }): void {
        this.activeMenuProperty = property;
        this.permanentDeletePassword = '';
        this.permanentDeleteAcknowledged = false;
        this.permanentDeleteImpact.set(null);
        this.permanentDeleteDialogVisible.set(true);
        this.permanentDeleteImpactLoading.set(true);

        this._condominioService
            .getPermanentDeleteImpact(property._id)
            .pipe(finalize(() => this.permanentDeleteImpactLoading.set(false)))
            .subscribe({
                next: (response) => {
                    const impact = response.data?.impact;
                    if (response.success && impact) {
                        this.permanentDeleteImpact.set(impact);
                        return;
                    }

                    this.showPermanentDeleteError(
                        response.error?.message ||
                            'The deletion impact could not be loaded.'
                    );
                },
                error: (error: unknown) =>
                    this.showPermanentDeleteError(
                        this.permanentDeleteErrorMessage(error)
                    ),
            });
    }

    onPermanentDeleteVisibilityChange(visible: boolean): void {
        if (visible) {
            this.permanentDeleteDialogVisible.set(true);
            return;
        }

        this.closePermanentDeleteDialog();
    }

    closePermanentDeleteDialog(): void {
        if (this.permanentDeleteSubmitting()) return;

        this.permanentDeleteDialogVisible.set(false);
        this.permanentDeleteImpact.set(null);
        this.permanentDeletePassword = '';
        this.permanentDeleteAcknowledged = false;
    }

    confirmPermanentDelete(): void {
        const propertyId = this.activeMenuProperty?._id;
        if (
            !propertyId ||
            !this.permanentDeletePassword ||
            !this.permanentDeleteAcknowledged ||
            this.permanentDeleteSubmitting()
        ) {
            return;
        }

        this.permanentDeleteSubmitting.set(true);
        this._condominioService
            .permanentlyDeleteProperty(propertyId, this.permanentDeletePassword)
            .pipe(finalize(() => this.permanentDeleteSubmitting.set(false)))
            .subscribe({
                next: (response) => {
                    if (!response.success) {
                        this.showPermanentDeleteError(
                            response.error?.message ||
                                'The property could not be permanently deleted.'
                        );
                        return;
                    }

                    const alias = response.data?.alias || 'The property';
                    this.permanentDeleteDialogVisible.set(false);
                    this.permanentDeleteImpact.set(null);
                    this.permanentDeletePassword = '';
                    this.permanentDeleteAcknowledged = false;
                    this.getProperties();
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Property permanently deleted',
                        detail: `${alias} was removed. Financial records were preserved.`,
                        life: 4500,
                    });
                },
                error: (error: unknown) =>
                    this.showPermanentDeleteError(
                        this.permanentDeleteErrorMessage(error)
                    ),
            });
    }

    private permanentDeleteErrorMessage(error: unknown): string {
        if (!error || typeof error !== 'object') {
            return 'The property could not be permanently deleted.';
        }

        const httpError = error as {
            error?: {
                error?: { message?: string };
                message?: string;
            };
        };
        return (
            httpError.error?.error?.message ||
            httpError.error?.message ||
            'The property could not be permanently deleted.'
        );
    }

    private showPermanentDeleteError(detail: string): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Permanent deletion unavailable',
            detail,
            life: 4500,
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
        const role = this.identity?.role?.toLowerCase();
        return ['admin', 'owner'].includes(role)
            ? this.identity?._id
            : this.identity?.createdBy;
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

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private getPropertyCollection(response: any): any[] {
        if (Array.isArray(response?.condominiums)) {
            return response.condominiums;
        }

        if (Array.isArray(response?.data?.condominiums)) {
            return response.data.condominiums;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    }

    getProperties() {
        const identifier = this.getId();
        if (!identifier) {
            this.loading = false;
            this.properties = [];
            this._changeDetectorRef.detectChanges();
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'The property owner could not be identified.',
                life: 3000,
            });
            return;
        }

        this.loading = true;
        this._condominioService
            .getPropertyByIdentifier(identifier)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this._changeDetectorRef.detectChanges();
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        this.properties = this.row_formating(
                            this.getPropertyCollection(response)
                        );
                    } else {
                        this.properties = [];
                    }
                },
                error: (error) => {
                    this.properties = [];
                    if (error?.status !== 404) {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Properties could not be loaded.',
                            life: 3000,
                        });
                    }
                },
            });
    }

    public ownerIdInput: string;
    ownerDialogDetails(property?: any) {
        const propertyId = property?._id ?? this.properties?.[0]?._id;
        if (!propertyId) {
            this._messageService.add({
                severity: 'warn',
                summary: 'No properties',
                detail: 'There are no properties available to display.',
            });
            return;
        }

        this.visible = true;
        let id = this.identity._id ?? this.identity.ownerId;
        this.ownerIdInput = id;
        this._router.navigate([], {
            queryParams: { userid: id, condoId: propertyId },
            queryParamsHandling: 'merge',
        });
    }

    row_formating(properties: PropertyAddressSource[]) {
        return properties.map((p) => ({
            ...p,
            address: this.formatAddress(p),
            paymentDate: this._format.monthlyBillFormat(p.paymentDate),
            phone: this._format.phoneFormat(p.phone),
        }));
    }

    private formatAddress(property: PropertyAddressSource): string {
        const addressParts = [
            property.street_1,
            property.street_2,
            property.sector_name,
            property.city,
            property.province,
            property.country,
        ]
            .map((value) => (typeof value === 'string' ? value.trim() : ''))
            .filter(
                (value) =>
                    value.length > 0 &&
                    value.toLowerCase() !== 'undefined' &&
                    value.toLowerCase() !== 'null'
            );

        return addressParts.join(', ') || 'Address not available';
    }

    onHide() {
        this.delProperty = false;
        this._router.navigate([]);
    }
}
