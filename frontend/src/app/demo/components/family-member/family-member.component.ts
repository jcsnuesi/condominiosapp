import {
    Component,
    EventEmitter,
    input,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
    ChangeDetectorRef,
} from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { FormatFunctions } from '../../../pipes/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { TabViewModule } from 'primeng/tabview';
import { global } from '../../service/global.service';
import { CondominioService } from '../../service/condominios.service';
import { CalendarModule } from 'primeng/calendar';
import { FamilyServiceService } from '../../service/family-service.service';

type FamilyMember = {
    memberId: string;
    addressId: Array<{ label: string; code: string; unit: string }> | any;
    avatar?: string;
    name: string;
    lastname: string;
    gender: { label: string; code: string };
    email: string;
    phone: string;
    ownerId: string;
    tempAccess?: { label: string; code: string };
    accountAvailabilityDate?: Date;
    accountExpirationDate?: Date;
    memberStatus?: { label: string; code: string };
};

@Component({
    selector: 'app-family-member',
    standalone: true,
    imports: [
        CalendarModule,
        FamilyMemberDetailsComponent,
        RouterModule,
        PipesModuleModule,
        PdfViewerModule,
        ProgressSpinnerModule,
        HasPermissionsDirective,
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
        DynamicTableComponent,
        TabViewModule,
    ],
    templateUrl: './family-member.component.html',
    styleUrl: './family-member.component.css',
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        FormatFunctions,
        FamilyServiceService,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class FamilyMemberComponent implements OnInit, OnChanges {
    public userDialog: boolean;
    public visible_spinner: boolean;
    public dynamicHeaders: any;
    public propertyDetailsUser: any;
    public familyMemberInfo!: FamilyMember;
    private token: string;
    public authorizedUser: any;
    public selectedPermission!: Permissions[];
    public permission!: Permissions[];
    private identity: any;
    public genderOptions: { label: string; code: string }[];
    public propertySelected: any;
    public genderSelected: any;
    public visible_dynamic: boolean;
    public nodata: boolean;
    public visibleUpdate: boolean;
    public addProperty: { _id: string; addressId: string };
    @Input() ownerIdInput!: string;
    public dataToSend: [{ name: string; lastname: string }];
    public addressInfo: any;
    public getSeverityColor: any;
    public _upperUfunction: any;
    public header_modal_aux = 'Family Member Details';
    public image: string;
    url: string;
    public condoOptions: { label: string; code: string; unit: string }[];
    public tempAccountOptions: { label: string; code: string }[];
    public statusOptions: { label: string; code: string }[];
    public tempAccountSelected: any = 'No';
    public minDate: Date = new Date();
    public btn_label: string = 'Create';
    public showOnUpdate: boolean = false;
    // @Output() hideFamilyDialog: EventEmitter<boolean | {}> = new EventEmitter<
    //     boolean | {}
    // >();
    @Input() memberInfoFromDetail: any;

    @Output() msgEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _userService: UserService,
        private _formatPipe: FormatFunctions,
        private router: Router,
        private _activateRoute: ActivatedRoute,
        private _condoService: CondominioService,
        private _familyService: FamilyServiceService,
        private cdr: ChangeDetectorRef
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.url = global.url;
        // this.hideFamilyDialog.emit(true);

        this.genderOptions = [
            { label: 'Male', code: 'M' },
            { label: 'Female', code: 'F' },
        ];

        this.tempAccountOptions = [
            { label: 'Yes', code: 'yes' },
            { label: 'No', code: 'no' },
        ];

        this.statusOptions = [
            { label: 'Active', code: 'active' },
            { label: 'Inactive', code: 'inactive' },
        ];

        this._activateRoute.params.subscribe((params) => {
            let param = params['dashid'];

            this.familyMemberInfo = {
                memberId: '',
                addressId: [{ label: '', code: '', unit: '' }],
                avatar: '',
                name: '',
                lastname: '',
                gender: { label: '', code: '' },
                email: '',
                phone: '',
                ownerId: param || '',
                tempAccess: { label: 'No', code: 'no' },
                accountAvailabilityDate: null,
                accountExpirationDate: null,
                memberStatus: { label: '', code: '' },
            };
        });

        this.condoOptions = [
            { label: 'No properties available', code: '', unit: '' },
        ];
        this.image = this.url + 'main-avatar/owners/noimage.jpeg';
    }

    sendData() {
        return this.dataToSend;
    }

    getCondoOptions() {
        if (this.memberInfoFromDetail) {
            this.condoOptions = [
                {
                    label: 'No properties available',
                    code: '',
                    unit: '',
                },
            ];
        } else {
            this.condoOptions = this.identity.propertyDetails.map(
                (property) => {
                    return {
                        label:
                            property.addressId.alias +
                            ' - (' +
                            property.condominium_unit +
                            ')',
                        code: property.addressId._id,
                        unit: property.condominium_unit,
                    };
                }
            );
        }
    }

    fillCondoUnitDropdown(propertyDetail) {
        // PROPIEDADES DEL OWNER (ADMIN)
        let { propertyDetails, ...res } = propertyDetail.ownerId;
        let addressIdListInMember = propertyDetail.propertyDetails;

        this.condoOptions = propertyDetails.map((property) => {
            let data = addressIdListInMember.filter(
                (condo) =>
                    condo.addressId._id === property.addressId._id &&
                    condo.unit === property.condominium_unit
            );

            if (data.length > 0) {
                this.condoFound.push({
                    label:
                        data[0].addressId.alias + ' - (' + data[0].unit + ')',
                    code: property.addressId._id,
                    unit: property.condominium_unit,
                });
                this.familyMemberInfo.addressId = [...this.condoFound];

                console.log('carga de datos', this.familyMemberInfo.addressId);
                return { label: '', code: '' };
            } else {
                return {
                    label:
                        property.alias +
                        ' - (' +
                        property.condominium_unit +
                        ')',
                    code: property._id,
                    unit: property.condominium_unit,
                };
            }
        });

        this.btnDisabled = this.condoOptions[0].label === '' ? true : false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        let datos = this.memberInfoFromDetail.data;
        this.btn_label = 'Update';
        this.familyMemberInfo.memberId = datos._id;
        this.familyMemberInfo.ownerId = datos.ownerId._id;
        console.log('datos', this.familyMemberInfo.ownerId);
        this.familyMemberInfo.memberStatus = {
            label: this._formatPipe.titleCase(datos.status),
            code: datos.status,
        };
        this.fillCondoUnitDropdown(datos);

        this.showOnUpdate = true;
        // Eliminar las siguientes keys para evitar vueltas innecesarias en el bucle
        delete datos.unit;
        delete datos.createdAt;
        delete datos.updatedAt;
        delete datos.__v;
        delete datos.propertyDetails;
        delete datos.ownerId;

        this.image = this.url + 'main-avatar/families/' + datos.avatar;

        if (datos) {
            for (const key in datos) {
                if (key === 'gender') {
                    this.familyMemberInfo.gender = {
                        label: this._formatPipe.genderPipe(datos.gender),
                        code: datos.gender,
                    };
                } else {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            this.familyMemberInfo,
                            key
                        )
                    ) {
                        this.familyMemberInfo[key] = datos[key];
                    }
                }
            }
        }
        console.log(
            'this.familyMemberInfo.gender ----------',
            this.familyMemberInfo.gender
        );
        // console.log('genderSelected**************', this.genderSelected);
    }

    ngOnInit(): void {
        this.getCondoOptions();

        // this.image = this.url + 'main-avatar/owners/' + events.avatar;
        /**
         * Owner:
         * Metodo para crear un family member
         * Crear metodo que busque los datos de los family members por el id del propietario
         * Metodo para modificar un family member
         * Metodo para eliminar un family member
         * Metodo para crear un unit
         * Metodo para modificar un unit
         * Metodo para eliminar un unit
         *
         *
         * Admin:
         * Crear metodo para obtener todas las propiedades por el id del admin
         *
         *
         * Crear metodo que obtenga todas las propiedad
         */
        // this.sendData();
    }

    chooseAction(form: NgForm) {
        if (this.btn_label === 'Create') {
            this.onSubmit(form);
        } else {
            this.updateFamilyUser();
        }
    }

    formatFormData(): FormData {
        const formData = new FormData();
        console.log(
            'this.familyMemberInfo.addressId --> formatFormData',
            this.familyMemberInfo.addressId
        );
        if (this.familyMemberInfo.addressId.length === 0) {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a property',
                life: 8000,
                closable: true,
            });
            throw new Error('Please select a property');
        } else {
            this.familyMemberInfo.addressId.forEach((condo) =>
                formData.append('addressId', condo.code)
            );
        }

        if (this.familyMemberInfo.tempAccess.code === 'yes') {
            formData.append(
                'accountAvailabilityDate',
                this.familyMemberInfo['accountAvailabilityDate'].toISOString()
            );
            formData.append(
                'accountExpirationDate',
                this.familyMemberInfo['accountExpirationDate'].toISOString()
            );
        }

        for (const key in this.familyMemberInfo) {
            if (
                key === 'addressId' ||
                key === 'accountAvailabilityDate' ||
                key === 'accountExpirationDate'
            ) {
                continue;
            }
            if (
                Object.prototype.hasOwnProperty.call(
                    this.familyMemberInfo[key],
                    'code'
                )
            ) {
                formData.append(key, this.familyMemberInfo[key].code);
            } else {
                formData.append(key, this.familyMemberInfo[key]);
            }
        }

        // formData.forEach((value, key) => {
        //     console.log(key, ' : ', value);
        // });

        return formData;
    }

    onSubmit(form: NgForm) {
        const formData = this.formatFormData();

        this._confirmationService.confirm({
            header: 'Confirmation',
            message: 'Please confirm to proceed moving forward.',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                this._familyService
                    .createFamily(this.token, formData)
                    .subscribe({
                        next: (data) => {
                            if (data.status == 'success') {
                                // Dispatamos un output para que se active el toast
                                this.msgEvent.emit('created');
                                this.condoFound = [];
                                this.getCondoOptions();
                                form.reset();
                                this.image =
                                    this.url +
                                    'main-avatar/owners/noimage.jpeg';
                                // this.hideFamilyDialog.emit(false);
                            }
                        },
                        error: (error) => {
                            console.log(error);
                        },
                        complete: () => {
                            console.log('Create Family Completed');
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    updateFamilyUser() {
        const formData = this.formatFormData();

        this._confirmationService.confirm({
            message: 'Do you want to confirm this action?',
            header: 'Update Confirmation',
            icon: 'pi pi-sync',

            accept: () => {
                this._familyService
                    .updateFamilyMember(this.token, formData)
                    .subscribe({
                        next: (data) => {
                            if (data.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Member updated successfully',
                                    life: 3000,
                                });

                                this.msgEvent.emit('updated');
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: data.message,
                                    life: 3000,
                                });
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.message,
                                life: 3000,
                            });
                        },
                        complete: () => {
                            console.log('Add new property Completed');
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected this action',
                    life: 3000,
                });
            },
        });
    }

    public condoOptions_: any = [{ label: '', code: '', unit: '' }];
    deleteMember(familyMember) {
        this._confirmationService.confirm({
            message: 'Do you want to confirm this action?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this._familyService
                    .deleteFamilyMember(this.token, familyMember.memberId)
                    .subscribe({
                        next: (data) => {
                            console.log(data);
                            if (data.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Member deleted successfully',
                                    life: 3000,
                                });

                                this.msgEvent.emit('deleted');
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: data.message,
                                    life: 3000,
                                });
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.message,
                                life: 3000,
                            });
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected this action',
                    life: 3000,
                });
            },
        });
    }

    public condoFound: any = [];
    public btnDisabled: boolean = false;
    addUnit(address) {
        const dataCondo = { ...address };

        let indexFound = this.condoOptions.findIndex(
            (condo) =>
                condo.code === dataCondo.code && condo.unit === dataCondo.unit
        );

        this.condoFound.push(this.condoOptions[indexFound]);
        this.familyMemberInfo.addressId.push(this.condoOptions[indexFound]);

        this.condoOptions.splice(indexFound, 1);

        if (this.condoOptions.length === 0) {
            this.btnDisabled = true;
            this.condoOptions.push({
                label: 'No properties available',
                code: '',
                unit: '',
            });
        }
    }

    removeUnit(index) {
        if (this.condoOptions[0].code === '') {
            this.condoOptions[0] = this.condoFound[index];
            this.condoFound.splice(index, 1);
            this.familyMemberInfo.addressId.splice(index, 1);
        } else {
            this.condoOptions.push(this.condoFound[index]);
            this.condoFound.splice(index, 1);
            this.familyMemberInfo.addressId.splice(index, 1);
        }

        this.btnDisabled = false;
    }

    getSeverity(status) {
        const severityObj = { active: 'success', inactive: 'danger' };

        return severityObj[status];
    }

    openNew() {
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.visibleUpdate = false;
    }

    public familyId: string;
    editItem(event: any) {
        this.visible_dynamic = true;
        this.familyId = event._id;
        // console.log(event)
    }

    showDialogToAddProperty(familyMember: any) {
        this.visibleUpdate = true;
        this.addProperty._id = familyMember.id__;
    }

    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.familyMemberInfo.avatar = file.files[0];
    }
}
