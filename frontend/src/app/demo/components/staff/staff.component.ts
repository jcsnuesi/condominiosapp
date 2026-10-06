import { PhoneFormatDirective } from 'src/app/phone-format.directive';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
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
    condo_alias?: string;
    name: string;
    lastname: string;
    gender: string;
    phone: string;
    position: string;
    email: string;
    password?: string;
    password_verify: string;
    dob: any;
    createdAt?: string | Date;
    updatedAt?: string;
    avatar?: string;
    fullname?: string;
    status?: string;
};

@Component({
    selector: 'app-staff',
    imports: [
        PhoneFormatDirective,
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
export class StaffComponent implements OnInit, OnDestroy {
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
    public searchValue: string;
    public statuses: Array<{ label: string; value: string }>;
    public url: string;

    public visibleStaff: boolean;
    public statusStaff: Array<{ label: string; code: string }>;
    public activeTab: string;

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

    @Input() condoId: any;
    @Input() isHome: boolean = false;
    @Output() staffUpdated = new EventEmitter<any>();

    public identity: any;
    private currentCondoId: string;
    private routeParamsSubscription: Subscription;

    constructor(
        private _userService: UserService,
        private _staffService: StaffService,
        private _formatFunctions: FormatFunctions,
        private _route: ActivatedRoute,
        private _router: Router,
        private _condominioService: CondominioService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.condominioList = [];
        this.propertyDetailsVar = [];

        this.url = global.url;

        this.previwImage = '../../../assets/noimage.jpeg';
        this.loadingCondo = false;
        this.visibleStaff = false;
        this.submitStatus = false;
        this.statusApi = false;
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
        this.activeTab = 'staff';

        this.token = this._userService.getToken();
        this.loginInfo = this._userService.getIdentity();

        this.dataToUpdate = {
            _id: '',
            createdBy: '',
            condo_id: '',
            name: '',
            lastname: '',
            gender: '',
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

        this.searchValue = '';
        this.statuses = [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
        ];

        // table settings
        this.globalFilters = [
            'fullname',
            'phone',
            'gender',
            'condo_id',
            'condo_alias',
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

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private getResponseData<T>(response: any, fallback: T): T {
        if (response?.data !== undefined && response?.data !== null) {
            return response.data as T;
        }

        if (response?.message !== undefined && response?.message !== null) {
            return response.message as T;
        }

        return fallback;
    }

    private getStaffCollection(response: any): any[] {
        const payload = this.getResponseData<any>(response, []);

        if (Array.isArray(payload)) {
            return payload;
        }

        if (Array.isArray(payload.message)) {
            return payload.message;
        }

        if (Array.isArray(payload?.staff)) {
            return payload.staff;
        }

        if (Array.isArray(payload?.staffs)) {
            return payload.staffs;
        }

        if (Array.isArray(payload?.docs)) {
            return payload.docs;
        }

        if (Array.isArray(payload?.items)) {
            return payload.items;
        }

        return [];
    }

    private mapStaffRows(staffList: any[]): StaffInfo[] {
        return staffList.map((staff) => {
            return {
                _id: staff._id,
                fullname: `${staff?.name ?? ''} ${
                    staff?.lastname ?? ''
                }`.trim(),
                name: staff?.name ?? '',
                lastname: staff?.lastname ?? '',
                phone: staff?.phone ?? '',
                gender: staff?.gender ?? '',
                createdBy: staff.createdBy,
                condo_alias: staff.condo_id?.alias ?? staff.condo_alias ?? '',
                condo_id: staff.condo_id?._id ?? staff.condo_id ?? '',
                position: staff?.position ?? '',
                email: staff?.email ?? '',
                password_verify: staff.password_verify ?? '',
                dob: staff.dob ?? '',
                status: staff?.status ?? '',
                createdAt: staff.createdAt ? new Date(staff.createdAt) : null,
                avatar: staff?.avatar,
            };
        });
    }

    private setStaffTableState(rows: StaffInfo[], loading = false) {
        this.propertyDetailsVar = [...rows];
        this.loading = loading;
        this._changeDetectorRef.detectChanges();
    }

    private clearStaffSelection() {
        setTimeout(() => {
            this.staffSelected = [];
            this._changeDetectorRef.markForCheck();
        });
    }

    private setCondoState(
        options: Array<{ label: string; code: string }>,
        loading = false
    ) {
        setTimeout(() => {
            this.condominioList = options;
            this.loadingCondo = loading;
            this._changeDetectorRef.detectChanges();
        });
    }

    private getCondoCollection(response: any): any[] {
        const payload = this.getResponseData<any>(response, []);

        if (Array.isArray(response?.condominiums)) {
            return response.condominiums;
        }

        if (Array.isArray(payload)) {
            return payload;
        }

        if (Array.isArray(payload?.condominiums)) {
            return payload.condominiums;
        }

        if (Array.isArray(payload?.docs)) {
            return payload.docs;
        }

        if (Array.isArray(payload?.items)) {
            return payload.items;
        }

        return [];
    }

    public condoData: any;
    public backBtnVisible: boolean;

    ngOnInit(): void {
        this.resetStaffFormModel();
        this.setSubmitStatus(false);

        this.routeParamsSubscription?.unsubscribe();
        this.routeParamsSubscription = this._route.params.subscribe(
            (params) => {
                this.currentCondoId = this.condoId ?? params['id'];
                this.reloadStaffData();
                this.reloadCondoOptions();
            }
        );
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription?.unsubscribe();
    }

    private resetStaffFormModel() {
        this.staffInfo = {
            _id: '',
            createdBy: '',
            condo_id: '',
            name: '',
            lastname: '',
            gender: '',
            phone: '',
            position: '',
            email: '',
            password: '',
            password_verify: '',
            dob: '',
        };
    }

    private setSubmitStatus(status: boolean) {
        setTimeout(() => {
            this.submitStatus = status;
            this._changeDetectorRef.detectChanges();
        });
    }

    private setStaffDialogVisible(visible: boolean) {
        setTimeout(() => {
            this.visibleStaff = visible;
            this._changeDetectorRef.detectChanges();
        });
    }

    private setStatusApi(status: boolean) {
        setTimeout(() => {
            this.statusApi = status;
            this._changeDetectorRef.detectChanges();
        });
    }

    private reloadStaffData() {
        if (!this.currentCondoId) {
            this.setStaffTableState([]);
            return;
        }

        if (this.identity.role.toLowerCase() == 'admin') {
            this.getStaffByCondoIdOrAdminId(this.currentCondoId);
        } else {
            this.getStaffByOwnerIds(this.currentCondoId);
        }
    }

    private reloadCondoOptions() {
        if (this.isHome) {
            this.getCondoById(this.currentCondoId);
        } else {
            this.getAdminsProperties();
        }
    }

    getCondoById(condo) {
        this.setCondoState(this.condominioList, true);
        this._condominioService.getCondoById(condo).subscribe({
            next: (response) => {
                const condominium =
                    response?.condominium ??
                    this.getResponseData<any>(response, {})?.condominium;

                if (this.isSuccessResponse(response) && condominium) {
                    this.setCondoState([
                        {
                            label: condominium.alias,
                            code: condominium._id,
                        },
                    ]);
                } else {
                    this.setCondoState([]);
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Condominium not found',
                        life: 3000,
                    });
                }
            },
            error: (error) => {
                this.setCondoState([]);
                console.log('getCondoById Error:', error);
            },
        });
    }

    getStaffByOwnerIds(id: string) {
        this.loading = true;
        this._staffService.getStaffByOwnerId(id).subscribe({
            next: (response) => {
                const rows = this.isSuccessResponse(response)
                    ? this.mapStaffRows(this.getStaffCollection(response))
                    : [];

                this.setStaffTableState(rows);
            },
            error: (error) => {
                this.setStaffTableState([]);
                console.log(error);
            },
        });
    }

    getStaffByCondoIdOrAdminId(id: string) {
        this.loading = true;
        this._staffService.getStaffByOwnerCondo(id).subscribe({
            next: (response) => {
                const rows = this.isSuccessResponse(response)
                    ? this.mapStaffRows(this.getStaffCollection(response))
                    : [];

                this.setStaffTableState(rows);
            },
            error: (error) => {
                this.setStaffTableState([]);
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
        this.setCondoState(this.condominioList, true);

        this._condominioService
            .getPropertyByIdentifier(this.getId())
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        const condoOptions = this.getCondoCollection(
                            response
                        ).map((element) => {
                            return {
                                label: element.alias,
                                code: element._id,
                            };
                        });
                        this.setCondoState(condoOptions);
                    } else {
                        this.setCondoState([]);
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No properties were found',
                            key: 'br',
                            life: 3000,
                        });
                    }
                    // console.log('[else] - getAdminsProperties:', response);
                },
                error: (error) => {
                    console.log('[error] - getAdminsProperties:', error);
                    this.setCondoState([]);
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
        this.setStaffDialogVisible(true);
        this.passwordMatch = false;
        let { ...res } = info;

        this.dataToUpdate = {
            _id: res._id,
            condo_id: { label: res.condo_alias, code: res.condo_id },
            name: res.name,
            lastname: res.lastname,
            gender: this.genderOptions.find((gend) =>
                gend.code.startsWith(res.gender)
            ),
            dob: new Date(),
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
        if (form.invalid) {
            form.control.markAllAsTouched();
            this._messageService.add({
                severity: 'warn',
                summary: 'Invalid form',
                detail: 'Please enter a valid staff email before submitting.',
                life: 3000,
            });
            return;
        }

        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.setSubmitStatus(true);
                const formSfaff = this.buildStaffCreateFormData();

                this._staffService.create(formSfaff, this.token).subscribe({
                    next: (response) => {
                        if (this.isSuccessResponse(response)) {
                            const emailSent = this.getResponseData<any>(
                                response,
                                {}
                            )?.emailSent;
                            const emailWarning =
                                emailSent === false
                                    ? ' Staff was created, but the registration email could not be sent.'
                                    : '';

                            this._messageService.add({
                                severity:
                                    emailSent === false ? 'warn' : 'success',
                                summary: 'Confirmed',
                                detail: `Staff successfully registered!${emailWarning}`,
                                life: emailSent === false ? 6000 : 3000,
                            });
                            this.staffUpdated.emit();
                            form.reset();
                            this.resetStaffFormModel();
                            this.reloadStaffData();
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
                        this.setSubmitStatus(false);
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

    private buildStaffCreateFormData(): FormData {
        const formSfaff = new FormData();
        const fieldMap = {
            name: this.staffInfo.name,
            lastname: this.staffInfo.lastname,
            gender: this.getSelectCode(this.staffInfo.gender),
            phone: this.staffInfo.phone,
            position: this.getSelectCode(this.staffInfo.position),
            condo_id: this.getSelectCode(this.staffInfo.condo_id),
            email: this.normalizeEmail(this.staffInfo.email),
            createdBy: this.loginInfo._id,
        };

        Object.entries(fieldMap).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                formSfaff.append(key, value);
            }
        });

        const avatar = this.staffInfo.avatar as any;

        if (avatar instanceof File) {
            formSfaff.append('avatar', avatar);
        }

        return formSfaff;
    }

    private getSelectCode(value: any): string {
        return typeof value === 'object' ? value?.code : value;
    }

    private normalizeEmail(email: string): string {
        return (email ?? '').trim().toLowerCase();
    }

    get canManagePasswordWithoutVerification(): boolean {
        const role = this.identity?.role?.toUpperCase();
        return role === 'ADMIN' || role === 'STAFF_ADMIN';
    }

    get canEditPassword(): boolean {
        return this.canManagePasswordWithoutVerification || this.passwordMatch;
    }

    private getResponseMessage(response: any, fallback: string): string {
        const message = response?.detail ?? response?.message;
        return typeof message === 'string' && message.trim()
            ? message
            : fallback;
    }

    update(form: NgForm) {
        if (
            form.invalid ||
            (!this.passval && this.dataToUpdate.password_verify)
        ) {
            form.control.markAllAsTouched();
            return;
        }

        const formdata = new FormData();

        let keys = ['condo_id', 'position', 'gender', 'status'];

        for (const key in this.dataToUpdate) {
            const value = this.dataToUpdate[key];

            if (
                (key === 'password' ||
                    key === 'password_verify' ||
                    key === 'currentPassword') &&
                !value
            ) {
                continue;
            }

            if (keys.includes(key)) {
                formdata.append(key, value?.code ?? value);
            } else {
                formdata.append(key, value);
            }
        }

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
                this._staffService.updateStaff(formdata).subscribe({
                    next: (response) => {
                        if (this.isSuccessResponse(response)) {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Staff updated',
                                detail: this.getResponseMessage(
                                    response,
                                    'Staff successfully updated!'
                                ),
                                life: 3000,
                            });
                            this.staffUpdated.emit(response);
                            this.setStaffDialogVisible(false);
                            this.reloadStaffData();
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Update failed',
                                detail: this.getResponseMessage(
                                    response,
                                    'You do not have permission to update this staff member.'
                                ),
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        console.log('Response update staff:', error);

                        if (error?.error?.message == 'Password incorrect') {
                            this.setStatusApi(true);

                            this.currentPasswordMsg = error.error.message;
                            setTimeout(() => {
                                this.setStatusApi(false);
                            }, 6000);
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    error?.error?.message ??
                                    'Staff could not be updated.',
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

            this._staffService.verifyPassword(data).subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        this.setStatusApi(true);
                        this.passwordMatch = true;
                        this.currentPasswordMsg = 'Password Match';
                        setTimeout(() => {
                            this.setStatusApi(false);
                        }, 6000);
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.setStatusApi(true);
                    this.passwordMatch = false;
                    this.currentPasswordMsg = error.error.message;
                    setTimeout(() => {
                        this.setStatusApi(false);
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
                this._staffService.deleteStaff(this.staffSelected).subscribe({
                    next: (response) => {
                        if (this.isSuccessResponse(response)) {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Staff inactived',
                                detail: 'Staff was successfully inactivated',
                                key: 'br',
                                life: 3000,
                            });
                            this.clearStaffSelection();
                            this.reloadStaffData();
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

    deleteStaffPermanent() {
        if (this.staffSelected.length !== 1) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Select one staff member',
                detail: 'Select exactly one record to delete permanently.',
                life: 4000,
            });
            return;
        }

        const selectedStaff = this.staffSelected[0];
        const staffName =
            selectedStaff.fullname ||
            `${selectedStaff.name} ${selectedStaff.lastname}`.trim();

        this._confirmationService.confirm({
            header: 'Permanently delete staff',
            message: `Delete ${staffName}? This action cannot be undone.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete permanently',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            accept: () => {
                this._staffService
                    .deleteStaffPermanent(selectedStaff._id)
                    .subscribe({
                        next: (response) => {
                            if (this.isSuccessResponse(response)) {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Staff deleted',
                                    detail: this.getResponseMessage(
                                        response,
                                        'Staff member permanently deleted.'
                                    ),
                                    life: 4000,
                                });
                                this.clearStaffSelection();
                                this.staffUpdated.emit(response);
                                this.reloadStaffData();
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Deletion failed',
                                detail:
                                    error?.error?.message ||
                                    'Staff member could not be permanently deleted.',
                                life: 5000,
                            });
                        },
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
                this._staffService.updateStaff(formdata).subscribe({
                    next: (response) => {
                        if (this.isSuccessResponse(response)) {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Staff successfully updated!',
                                key: 'br',
                                life: 3000,
                            });
                            this.clearStaffSelection();
                            this.setStaffDialogVisible(false);
                            this.reloadStaffData();
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
                            this.setStatusApi(true);
                            this.currentPasswordMsg = error.error.message;
                            setTimeout(() => {
                                this.setStatusApi(false);
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
