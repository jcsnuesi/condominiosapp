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
import { Router, RouterModule } from '@angular/router';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { TabViewModule } from 'primeng/tabview';
import { global } from '../../service/global.service';
import { CondominioService } from '../../service/condominios.service';

type FamilyMember = {
    addressId: string;
    avatar?: string;
    name: string;
    lastname: string;
    gender: string;
    email: string;
    phone: string;
    status?: string;
    role?: string;
    unit: string;
    ownerId: string;
};

@Component({
    selector: 'app-family-member',
    standalone: true,
    imports: [
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
    ],
})
export class FamilyMemberComponent implements OnInit {
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
    public condoOptions: any;
    public unitsOptions: { label: string; code: string }[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _userService: UserService,
        private _stringFormating: FormatFunctions,
        private router: Router,
        private _condoService: CondominioService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.url = global.url;

        this.genderOptions = [
            { label: 'Male', code: 'M' },
            { label: 'Female', code: 'F' },
        ];

        console.log(this.identity);
        this.familyMemberInfo = {
            addressId: '',
            avatar: '',
            name: '',
            lastname: '',
            gender: '',
            email: '',
            phone: '',
            status: '',
            role: '',
            unit: '',
            ownerId: '',
        };

        this.unitsOptions = [];
    }

    sendData() {
        return this.dataToSend;
    }

    onSubmit() {
        console.log(this.familyMemberInfo);
    }

    getCondoOptions() {
        this.condoOptions = this.identity.propertyDetails.map((property) => {
            this.unitsOptions.push({
                label: property.condominium_unit,
                code: property.condominium_unit,
            });
            return {
                label: property.addressId.alias,
                value: property.addressId._id,
            };
        });
    }

    ngOnInit(): void {
        this.image = this.url + 'main-avatar/owners/noimage.jpeg';
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

    statusOptions(status: string) {
        const statusAuth = { active: 'Authorized', inactive: 'Unauthorized' };
        return statusAuth[status];
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

    updateFamilyUser() {
        // this.addProperty.addressId = this.propertySelected.id;
        // console.log("alreadyAdded", this.addProperty)

        const familyFound = this.addressInfo.filter(
            (family) =>
                family.addressId === this.addProperty.addressId &&
                family.id__ === this.addProperty._id
        );

        console.log('alreadyAdded', familyFound);
        console.log('alreadyAdded.......', this.addProperty._id);

        if (familyFound) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Address already added to this user!',
                life: 3000,
            });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to confirm this action?',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._userService
                        .addNewProperty(this.token, this.addProperty)
                        .subscribe({
                            next: (data) => {
                                if (data.status == 'success') {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Successful',
                                        detail: 'User Updated',
                                        life: 3000,
                                    });
                                    this.visibleUpdate = false;
                                } else {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: data.message,
                                        life: 3000,
                                    });
                                }
                            },
                            error: (error) => {
                                this.messageService.add({
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
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'You have rejected this action',
                        life: 3000,
                    });
                },
            });
        }
    }
}
