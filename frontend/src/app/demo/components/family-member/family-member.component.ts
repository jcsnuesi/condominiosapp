import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
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
    addressId: Array<{ label: string; code: string }>;
    avatar?: string;
    name: string;
    lastname: string;
    gender: { label: string; code: string };
    email: string;
    phone: string;
    unit: Array<{ label: string; code: string }>;
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
    public condoOptions: { label: string; code: string }[];
    public unitsOptions: { label: string; code: string }[];
    public tempAccountOptions: { label: string; code: string }[];
    public statusOptions: { label: string; code: string }[];
    public tempAccountSelected: any = 'No';
    public minDate: Date = new Date();
    public btn_label: string = 'Create';
    public showOnUpdate: boolean = false;
    @Output() hideFamilyDialog: EventEmitter<boolean | {}> = new EventEmitter<
        boolean | {}
    >();
    @Input() memberInfoFromDetail: any;
    @Output() memberUpdated: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _userService: UserService,
        private _formatPipe: FormatFunctions,
        private router: Router,
        private _activateRoute: ActivatedRoute,
        private _condoService: CondominioService,
        private _familyService: FamilyServiceService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.url = global.url;
        this.hideFamilyDialog.emit(true);

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
            let param = params['id'];

            this.familyMemberInfo = {
                memberId: '',
                addressId: [{ label: '', code: '' }],
                avatar: '',
                name: '',
                lastname: '',
                gender: { label: '', code: '' },
                email: '',
                phone: '',
                unit: [{ label: '', code: '' }],
                ownerId: param,
                tempAccess: { label: 'No', code: 'no' },
                accountAvailabilityDate: null,
                accountExpirationDate: null,
                memberStatus: { label: '', code: '' },
            };
        });

        this.condoOptions = [];
        this.unitsOptions = [];
        this.image = this.url + 'main-avatar/owners/noimage.jpeg';
    }

    sendData() {
        return this.dataToSend;
    }

    getCondoOptions() {
        this.condoOptions = this.identity.propertyDetails.map((property) => {
            this.unitsOptions.push({
                label: property.condominium_unit,
                code: property.condominium_unit,
            });
            return {
                label: property.addressId.alias,
                code: property.addressId._id,
            };
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        let datos = this.memberInfoFromDetail.data;
        this.btn_label = 'Update';
        this.familyMemberInfo.memberId = datos._id;
        this.familyMemberInfo.memberStatus = {
            label: this._formatPipe.titleCase(datos.status),
            code: datos.status,
        };

        this.showOnUpdate = true;
        // Eliminar las siguientes keys para evitar vueltas innecesarias en el bucle
        delete datos.unit;
        delete datos.createdAt;
        delete datos.updatedAt;
        delete datos.__v;

        this.image = this.url + 'main-avatar/families/' + datos.avatar;

        if (datos) {
            for (const key in datos) {
                if (key === 'propertyDetails') {
                    datos[key].forEach((condo, index) => {
                        if (this.familyMemberInfo.addressId.length > 0) {
                            this.familyMemberInfo.addressId = [];
                            this.familyMemberInfo.unit = [];
                        }
                        this.familyMemberInfo.addressId.push({
                            label: condo.addressId.alias,
                            code: condo.addressId._id,
                        });

                        this.familyMemberInfo.unit.push({
                            label: condo.condominium_unit,
                            code: condo.condominium_unit,
                        });
                    });
                } else if (key === 'gender') {
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
        // console.log('familyMemberInfo----------', this.familyMemberInfo);
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
        let checkDate = ['accountAvailabilityDate', 'accountExpirationDate'];

        for (const key in this.familyMemberInfo) {
            if (key === 'addressId' || key === 'unit') {
                let joindata = '';
                this.familyMemberInfo[key].forEach(
                    (e) => (joindata += e.code + ',')
                );
                formData.append(key, joindata);
            } else if (
                Object.prototype.hasOwnProperty.call(
                    this.familyMemberInfo[key],
                    'code'
                )
            ) {
                formData.append(key, this.familyMemberInfo[key].code);
            } else if (
                checkDate.includes(key) &&
                this.familyMemberInfo.tempAccess.code === 'yes'
            ) {
                let dateLabelFound = checkDate.find((word) => word === key);
                formData.append(
                    key,
                    this.familyMemberInfo[dateLabelFound].toISOString()
                );
            } else if (key == 'addressId' || key == 'unit') {
                formData.append(
                    key,
                    JSON.stringify(this.familyMemberInfo[key])
                );
            } else {
                formData.append(key, this.familyMemberInfo[key]);
            }
        }

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
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'New member Created',
                                    life: 3000,
                                });
                                form.reset();
                                this.image =
                                    this.url +
                                    'main-avatar/owners/noimage.jpeg';
                                this.hideFamilyDialog.emit(false);
                            } else {
                                console.log(data);
                                this.hideFamilyDialog.emit({
                                    msg: data.message,
                                });
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
                                this.visibleUpdate = false;
                                this.memberUpdated.emit('updated');
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

    // statusOptions(status: string) {
    //     const statusAuth = { active: 'Authorized', inactive: 'Unauthorized' };
    //     return statusAuth[status];
    // }

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
