import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
    CommonModule,
    KeyValuePipe,
} from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { StaffService } from '../../service/staff.service';
import { CondominioService } from '../../service/condominios.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { global } from '../../service/global.service';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { ImportsModule } from '../../imports_primeng';

type StaffInfo = {
    _id: string;
    createdBy?: string;
    condo_id: string;
    name: string;
    lastname: string;
    gender: string;
    government_id: string;
    phone: string;
    position: string;
    email: string;
    password?: string;
    password_verify: string;
    dob: '';
    createdAt?: string;
    updatedAt?: string;
    avatar?: string;
    fullname?: string;
    status?: string;
};

@Component({
    selector: 'app-staff',
    standalone: true,
    imports: [
        ImportsModule,
        PipesModuleModule,
        CommonModule,
        InputTextModule,
        FormsModule,
        TitleCasePipe,
        DatePipe,
        HasPermissionsDirective,
    ],
    providers: [
        UserService,
        StaffService,
        FormatFunctions,
        KeyValuePipe,
        CondominioService,
        ConfirmationService,
        MessageService,
    ],
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.css',
})
export class StaffComponent implements OnInit, AfterViewInit {
    public staffInfo: StaffInfo;
    public positionOptions: Array<{ label: string; code: string }>;
    public genderOptions: Array<{ label: string; code: string }>;
    public condominioList: Array<{ label: string; code: string }>;
    public loadingCondo: boolean;
    public token: string;
    public loginInfo: any;
    public loading: boolean;

    //Table settings
    public propertyDetailsVar: Array<StaffInfo>;
    public globalFilters: any;
    public headerTitleDict: any;
    // public selectedPayment: StaffInfo;
    public staffSelected: StaffInfo[] = [];
    public url: string;

    public visibleStaff: boolean;
    public statusStaff: Array<{ label: string; code: string }>;

    public passval: boolean;
    public passMessage: string;
    public previwImage: any;
    public statusApi: boolean;

    public staffVisibleBackBtn: boolean;
    public ownerId: string;
    public dataToUpdate: any;
    public previewGender: any;
    public previwImageEdit: any;
    public currentPasswordMsg: string;
    public passwordMatch: boolean;
    public submitStatus: boolean;

    @ViewChild('genderRef') genderDropDown!: ElementRef;
    @ViewChild('positionRef') genderPositionRef!: ElementRef;
    @ViewChild('buildingRef') buildingRef!: ElementRef;
    @ViewChild('editGenderRef') editGenderRef!: ElementRef;
    @ViewChild('editpositionRef') editpositionRef!: ElementRef;
    @ViewChild('editbuildingRef') editbuildingRef!: ElementRef;
    @ViewChild('editStatusRef') editStatusRef!: ElementRef;
    @ViewChild('btnInactiveStaff') btnInactiveStaff!: ElementRef;
    @Input() condoId: any;
    @Input() isHome: boolean = false;
    @Output() staffUpdated = new EventEmitter<any>();

    public identity: any;

    constructor(
        private _userService: UserService,
        private _staffService: StaffService,
        private _formatFunctions: FormatFunctions,
        private _route: ActivatedRoute,
        private _router: Router,
        private _condominioService: CondominioService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {
        this.condominioList = [];

        this.url = global.url;

        this.previwImage = '../../../assets/noimage.jpeg';
        this.loadingCondo = true;
        this.staffVisibleBackBtn = false;
        this.identity = this._userService.getIdentity();

        this.genderOptions = [
            { label: 'Male', code: 'male' },
            { label: 'Female', code: 'female' },
        ];

        this.statusStaff = [
            { label: 'Active', code: 'active' },
            { label: 'Inactive', code: 'inactive' },
        ];

        this.token = this._userService.getToken();
        this.loginInfo = this._userService.getIdentity();

        this.dataToUpdate = {
            _id: '',
            createdBy: '',
            condo_id: '',
            name: '',
            lastname: '',
            gender: '',
            government_id: '',
            phone: '',
            position: '',
            email: '',
            password: '',
            password_verify: '',
            dob: '',
            currentPassword: '',
        };

        this.positionOptions = [
            { label: 'Admin', code: 'admin' },
            { label: 'Staff', code: 'staff' },
            { label: 'Security', code: 'security' },
            { label: 'Maintenance', code: 'maintenance' },
            { label: 'Receptionist', code: 'receptionist' },
            { label: 'Cleaning', code: 'vleaning' },
            { label: 'Accounting', code: 'accounting' },
            { label: 'Gardener', code: 'gardener' },
        ];

        // table settings
        this.globalFilters = [
            'fullname',
            'phone',
            'gender',
            'condo_id',
            'government_id',
            'position',
            'status',
            'createdAt',
        ];

        this.loading = true;

        this.headerTitleDict = {
            fullname: 'Fullname',
            phone: 'Phone',
            condo_id: 'Condominium',
            position: 'Position',
            status: 'Status',
            createdAt: 'Start Date',
        };
    }

    showBtnMethod(btn: any) {
        console.log('showBtnMethod', btn);
    }

    ngAfterViewInit() {
        if (this.genderDropDown) {
            const dropdownElement = this.genderDropDown.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropdPositionRef = this.genderPositionRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropdbuildingRef = this.buildingRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropdeditGenderRef = this.editGenderRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropdeditpositionRef = this.editpositionRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropeditbuildingRef = this.editbuildingRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');
            const dropeditStatusRef = this.editStatusRef.nativeElement
                .querySelector('.p-inputwrapper')
                .querySelector('.p-dropdown');

            if (dropdownElement) {
                [
                    dropeditStatusRef,
                    dropeditbuildingRef,
                    dropdeditpositionRef,
                    dropdownElement,
                    dropdPositionRef,
                    dropdbuildingRef,
                    dropdeditGenderRef,
                ].forEach((element) => {
                    element.style.width = '100%';
                    element.style.borderRadius = '0';
                });
            } else {
                console.error(
                    'Dropdown element not found inside the template.'
                );
            }
        }
    }

    public condoData: any;
    public backBtnVisible: boolean;

    ngOnInit(): void {
        this.staffInfo = {
            _id: '',
            createdBy: '',
            condo_id: '',
            name: '',
            lastname: '',
            gender: '',
            government_id: '',
            phone: '',
            position: '',
            email: '',
            password: '',
            password_verify: '',
            dob: '',
        };
        this.submitStatus = false;
        // Obtiene el id del condominio
        this._route.params.subscribe((params) => {
            let condoId = this.condoId ?? params['id'];
         
            if (this.identity.role.toLowerCase() == 'admin') {
                this.getStaffByCondoIdOrAdminId(condoId);
            } else {
                this.getStaffByOwnerIds(condoId);
            }

            if (this.isHome) {
                this.getCondoById(condoId);
            } else {
                this.getAdminsProperties();
            }
        });
    }

    getCondoById(condo) {
        this._condominioService.getCondoById(this.token, condo).subscribe({
            next: (response) => {
                this.condominioList = [];
                if (response.status == 'success') {
                    this.loadingCondo = false;
                    this.condominioList.push({
                        label: response.condominium.alias,
                        code: response.condominium._id,
                    });
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Condominium not found',
                        life: 3000,
                    });
                }
            },
            error: (error) => {
                console.log('getCondoById Error:', error);
            },
        });
    }

    getStaffByOwnerIds(id: string) {
        this._staffService.getStaffByOwnerId(this.token, id).subscribe({
            next: (response) => {
            
                if (response.status == 'success') {
                    this.propertyDetailsVar = response.message.map((staff) => {
                        return {
                            _id: staff._id,
                            fullname: staff?.name + ' ' + staff?.lastname,
                            phone: staff.phone,
                            gender: staff.gender,
                            government_id: staff.government_id,
                            createdBy: staff.createdBy,
                            condo_alias: staff.condo_id?.alias,
                            condo_id: staff.condo_id?._id,
                            position: staff.position,
                            email: staff.email,
                            status: staff.status,
                            createdAt: staff.createdAt,
                            avatar: staff.avatar,
                        };
                    });

                    this.loading = false;
                }
            },
            error: (error) => {
                this.loading = false;
                console.log(error);
            },
        });
    }

    getStaffByCondoIdOrAdminId(id: string) {
        this._staffService.getStaffByOwnerCondo(this.token, id).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.propertyDetailsVar = response.message.map((staff) => {
                        return {
                            _id: staff._id,
                            fullname: staff?.name + ' ' + staff?.lastname,
                            phone: staff.phone,
                            gender: staff.gender,
                            government_id: staff.government_id,
                            createdBy: staff.createdBy,
                            condo_alias: staff.condo_id?.alias,
                            condo_id: staff.condo_id?._id,
                            position: staff.position,
                            email: staff.email,
                            status: staff.status,
                            createdAt: staff.createdAt,
                            avatar: staff.avatar,
                        };
                    });

                    this.loading = false;
                }
            },
            error: (error) => {
                this.loading = false;
                console.log(error);
            },
        });
    }
    getId(): string {
       
        let roles = ['STAFF_ADMIN'];
        return roles.includes(this.identity.role.toUpperCase())
            ? this.identity.createdBy
            : this.identity._id;
    }

    getAdminsProperties() {
        this.loadingCondo = true;

        this._condominioService
            .getPropertyByIdentifier(this.token, this.getId())
            .subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        this.loadingCondo = false;
                        this.condominioList = [];
                        this.condominioList = response.condominiums.map(
                            (element) => {
                                return {
                                    label: element.alias,
                                    code: element._id,
                                };
                            }
                        );
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se encontraron propiedades',
                            key: 'br',
                            life: 3000,
                        });
                    }
                    // console.log('[else] - getAdminsProperties:', response);
                },
                error: (error) => {
                    console.log('[error] - getAdminsProperties:', error);
                    this.loadingCondo = false;
                },
            });
    }

    clear(dt: any) {
        dt.clear();
    }

    backToDashboard() {
        const id = this.condoData.split('_')[0];

        this._router.navigate(['/home', id]);
    }

    public condo_id: string;

    genderFormat(genderRaw: any): string {
        return this._formatFunctions.genderPipe(genderRaw);
    }

    showDialog(info: any) {
        this.visibleStaff = true;
        this.passwordMatch = false;
        let { ...res } = info;

        this.dataToUpdate = {
            _id: res._id,
            condo_id: { label: res.condo_alias, code: res.condo_id },
            name: res.fullname.split(' ')[0],
            lastname: res.fullname.split(' ')[1],
            gender: this.genderOptions.find((gend) =>
                gend.code.startsWith(res.gender)
            ),
            dob: new Date(),
            government_id: res.government_id,
            phone: res.phone,
            position: this.positionOptions.find(
                (pos) => pos.code == res.position
            ),
            email: res.email,
            status: this.statusStaff.find((stat) => stat.code == res.status),
        };

        // console.log('BACK TO DASHBOARD', this.dataToUpdate);

        this.previwImageEdit = this.url + 'avatar-staff/' + res.avatar;
    }

    getSeverity(status: string) {
        return this._formatFunctions.getSeverityUser(status);
    }

    onUpload(event: any) {
        const reader = new FileReader();

        reader.onloadend = (e) => {
            const base64Data = reader.result as string;
            this.previwImage = base64Data;
        };

        reader.readAsDataURL(event.files[0]);
        this.staffInfo.avatar = event.files[0];
        this.dataToUpdate.avatar = event.files[0];
    }

    onsubmit(form: NgForm) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.submitStatus = true;
                const formSfaff = new FormData();

                let keys = ['condo_id', 'position', 'gender'];

                this.staffInfo.createdBy = this.loginInfo._id;

                for (const key in this.staffInfo) {
                    if (keys.find((element) => element === key)) {
                        formSfaff.append(key, this.staffInfo[key].code);
                    } else {
                        formSfaff.append(key, this.staffInfo[key]);
                    }
                }

                this._staffService.create(formSfaff, this.token).subscribe({
                    next: (response) => {
                        if (response.status == 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Staff successfully registered!',
                                life: 3000,
                            });
                            this.staffUpdated.emit();
                            form.reset();
                            this.ngOnInit();
                            this.previwImage = '../../../assets/noimage.jpeg';
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Staff was not registered!',
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Staff was not registered!',
                            life: 3000,
                        });
                    },
                    complete: () => {
                        this.submitStatus = false;
                        this.previwImage = '../../../assets/noimage2.jpeg';
                        
                    },
                });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    key: 'br',
                    life: 3000,
                });
            },
        });
    }

    update(form: NgForm) {
        const formdata = new FormData();

        let keys = ['condo_id', 'position', 'gender', 'status'];

        for (const key in this.dataToUpdate) {
            if (keys.includes(key)) {
                formdata.append(key, this.dataToUpdate[key].code);
            } else {
                formdata.append(key, this.dataToUpdate[key]);
            }
        }

        // formdata.forEach((value, key) => {
        //     console.log(key, value);
        // });

        this._confirmationService.confirm({
            target: event.target as EventTarget,
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
                this._staffService.updateStaff(this.token, formdata).subscribe({
                    next: (response) => {
                    
                        if (response.status == 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Staff successfully updated!',
                                life: 3000,
                            });
                            this.visibleStaff = false;
                            this.ngOnInit();
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Forbidden',
                                detail: 'You do not have permission to update this staff member.',
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        console.log('Response update staff:', error);

                        if (error.error.message == 'Password incorrect') {
                            this.statusApi = true;

                            this.currentPasswordMsg = error.error.message;
                            setTimeout(() => {
                                this.statusApi = false;
                            }, 6000);
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.message,
                                life: 3000,
                            });
                        }
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

    verifyPasswordInput(confirmPassword: any) {
        let passwordInput = confirmPassword.target.value;
        this.passval = false;

        if (this.dataToUpdate.password === passwordInput) {
            this.passMessage = 'Password Match';

            this.passval = true;
        } else {
            this.passMessage = 'Password does not match';

            this.passval = false;
        }
    }

    verifyPasswordAPI(confirmPassword: any) {
        let passwordInput = '';
        passwordInput += confirmPassword.target.value;

        if (passwordInput.length >= 8) {
            let data = {
                _id: this.dataToUpdate._id,
                currentPassword: passwordInput,
            };

            this._staffService.verifyPassword(this.token, data).subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        this.statusApi = true;
                        this.passwordMatch = true;
                        this.currentPasswordMsg = 'Password Match';
                        setTimeout(() => {
                            this.statusApi = false;
                        }, 6000);
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.statusApi = true;
                    this.passwordMatch = false;
                    this.currentPasswordMsg = error.error.message;
                    setTimeout(() => {
                        this.statusApi = false;
                    }, 6000);
                },
            });
        } else {
            this.currentPasswordMsg = 'Password does not match';
            this.passval = false;
        }
    }

    deleteStaff() {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this._staffService
                    .deleteStaff(this.token, this.staffSelected)
                    .subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Staff inactived',
                                    detail: 'Staff was successfully inactivated',
                                    key: 'br',
                                    life: 3000,
                                });
                                this.ngOnInit();
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Staff was not deleted!',
                                key: 'br',
                                life: 3000,
                            });
                            console.log(error);
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'info',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    key: 'br',
                    life: 3000,
                });
            },
        });
    }

    activateStaff() {
        const formdata = new FormData();
        this.staffSelected.forEach((staff) => {
            for (const key in staff) {
                if (key == 'status') {
                    formdata.append(key, 'active');
                } else {
                    formdata.append(key, staff[key]);
                }
            }
        });

        this._confirmationService.confirm({
            target: event.target as EventTarget,
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
                this._staffService.updateStaff(this.token, formdata).subscribe({
                    next: (response) => {
                        if (response.status == 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Staff successfully updated!',
                                key: 'br',
                                life: 3000,
                            });
                            this.visibleStaff = false;

                            this.ngOnInit();
                        }
                    },
                    error: (error) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Staff was not updated!',
                            key: 'br',
                            life: 3000,
                        });

                        if (error.error.message == 'Password incorrect') {
                            this.statusApi = true;
                            this.currentPasswordMsg = error.error.message;
                            setTimeout(() => {
                                this.statusApi = false;
                            }, 6000);
                        }
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
}
