import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Staff } from '../../models/staff.model';
import { StaffService } from '../../service/staff.service';
import { ImportsModule } from '../../imports_primeng';
import { global } from '../../service/global.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';

type StaffAdmin = {
    fullname: string;
    email: string;
    position: string;
    createdAt: string;
    gender: string;
    government_id: string;
    phone: string;
    status: string;
    emailVerified: boolean;
    createdBy: string;
    permissions: Array<string>;
}[];

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [ImportsModule, FormsModule, CommonModule],
    templateUrl: './create-user.component.html',
    styleUrl: './create-user.component.css',
    providers: [
        UserService,
        ConfirmationService,
        MessageService,
        StaffService,
        FormatFunctions,
    ],
})
export class CreateUserComponent implements OnInit {
    public userModel: Staff;
    public users: any;
    public userInfo: any;
    public token: string;
    public selectedStaffs: any[];
    public userDialog: boolean;
    public genderModel: { label: string; code: string }[];
    public passwordActive: boolean = false;
    public positionOptions: { label: string; code: string }[];
    public roleOptions: { label: string; code: string }[];
    public permissionsOptions: { label: string; code: string }[];
    public permissions: any;
    public current_permissions: any;
    public dialogHeader: string;
    public identity: any;
    public staffAdminData: StaffAdmin[];
    public url: string;
    public accountStatusOptions: { label: string; code: string }[];
    public totalRecords: number;

    constructor(
        private _userService: UserService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
        private _staffService: StaffService,
        private _formatFunctions: FormatFunctions
    ) {
        this.selectedStaffs = [];

        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.url = global.url;
        this.userModel = new Staff(
            '',
            '',
            '',
            { label: '', code: '' },
            '',
            '',
            { label: '', code: '' },
            '',
            [],
            { label: '', code: '' },
            ''
        );
        this.genderModel = [
            { label: 'Female', code: 'Female' },
            { label: 'Male', code: 'Male' },
        ];
        this.passwordActive = false;
        this.positionOptions = [
            { label: 'Manager', code: 'manager' },
            { label: 'Accounting', code: 'accounting' },
            { label: 'Sales', code: 'sales' },
            { label: 'Marketing', code: 'marketing' },
            { label: 'Human Resources', code: 'human_resources' },
            { label: 'Handyman', code: 'handyman' },
            { label: 'Customer care', code: 'customer_care' },
        ];

        this.permissionsOptions = [
            { label: 'Create', code: 'create' },
            { label: 'Read', code: 'read' },
            { label: 'Update', code: 'update' },
            { label: 'Delete', code: 'delete' },
        ];

        this.accountStatusOptions = [
            { label: 'Active', code: 'active' },
            { label: 'Inactive', code: 'inactive' },
            { label: 'Pending', code: 'pending' },
        ];
    }

    ngOnInit(): void {
        // Cargamos todos los usuarios
        console.log('Create user component initialized');
        this.getStaffAdmin();
    }

    upperCase(user) {
        return user.toUpperCase();
    }

    getId() {
        const role = this.identity.role.toLowerCase();
        if (role === 'owner' || role === 'admin') {
            return this.identity._id;
        } else if (role === 'family') {
            return this.identity.ownerId;
        } else {
            return this.identity.createdBy;
        }
    }

    getStaffAdmin() {
        this._staffService.getStaffAdmin(this.token, this.getId()).subscribe({
            next: (res) => {
                this.totalRecords = res.message.length;
                let r = res.message.map((data) => {
                    data.fullname = data.name + ' ' + data.lastname;

                    return data;
                });
                this.staffAdminData = r;
                console.log('this.staffAdminData', this.staffAdminData);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    btnToggleDeleteActive(status: string) {
        return status === 'inactive'
            ? {
                  severity: 'success',
                  icono: 'pi pi-user-plus',
                  class: 'p-button-rounded hover:bg-green-600 hover:border-green-600 hover:text-white',
              }
            : {
                  severity: 'danger',
                  icono: 'pi pi-user-minus',
                  class: 'p-button-rounded hover:bg-red-600 hover:border-red-600 hover:text-white',
              };
    }

    deleteSelectedUsers() {
        this._confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedStaffs.map((staff) => staff._id);

                this._staffService
                    .deleteStaffAdmin(this.token, { id: ids })
                    .subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Staffs deleted successfully!',
                                    life: 3000,
                                });

                                this.getStaffAdmin();
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Staffs not deleted',
                                    life: 3000,
                                });
                            }
                        },

                        error: (error) => {
                            console.log('error', error);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Staffs not deleted',
                                life: 3000,
                            });
                        },
                        complete: () => {
                            console.log('Staffs deleted!');
                        },
                    });
            },
        });
    }

    public btnLabel: string;
    createNewUser() {
        this.userDialog = true;
        this.btnLabel = 'Create';
        this.dialogHeader = 'Create User';
        this.passwordActive = false;

        Object.keys(this.userModel).forEach((key) => {
            this.userModel[key] = '';
        });

        // Restablecer todos los campos del modelo userModel
        this.userModel = new Staff(
            '',
            '',
            '',
            { label: '', code: '' },
            '',
            '',
            { label: '', code: '' },
            '',
            [],
            { label: '', code: '' },
            ''
        );

        // // Restablecer las variables relacionadas con el formulario
    }

    hideDialog() {
        this.userDialog = false;
    }

    txtGender: string;
    editStaff(user: any) {
        this.userDialog = true;
        this.btnLabel = 'Update';
        this.dialogHeader = 'Edit User';
        this.passwordActive = true;
        this.userModel = { ...user };
        this.userModel.gender = { label: user.gender, code: user.gender };
        this.userModel.status = {
            label: this._formatFunctions.titleCase(user.status),
            code: user.status,
        };
        this.userModel.position = {
            label: this._formatFunctions.titleCase(user.position),
            code: user.position,
        };
        this.userModel.permissions = user.permissions.map((perm) => ({
            label: this._formatFunctions.titleCase(perm),
            code: perm,
        }));
    }

    getAvatarFirstLetter(name: string) {
        return name?.charAt(0).toUpperCase();
    }

    getDate(date: any) {
        return new Date(date).toDateString();
    }

    deleteAnUser(user: any) {
        this._confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = new Array(user._id);
                let data = { id: ids, status: user.status };

                console.log('data', data);

                this._staffService
                    .deleteStaffAdmin(this.token, data)
                    .subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Staffs deleted successfully!',
                                    life: 3000,
                                });

                                this.getStaffAdmin();
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Staffs not deleted',
                                    life: 3000,
                                });
                            }
                        },

                        error: (error) => {
                            console.log('error', error);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Staffs not deleted',
                                life: 3000,
                            });
                        },
                        complete: () => {
                            console.log('Staffs deleted!');
                        },
                    });
            },
        });
    }

    transformUserModel(userModel: Staff) {
        let dataFormatted = {
            position: '',
            gender: '',
            permissions: [],
            status,
        };
        dataFormatted['name'] = userModel.name;
        dataFormatted['lastname'] = userModel.lastname;
        dataFormatted['government_id'] = userModel.government_id;
        dataFormatted['phone'] = userModel.phone;
        dataFormatted['email'] = userModel.email;
        dataFormatted.position = this.userModel.position.code;
        dataFormatted.gender = this.userModel.gender.code;
        dataFormatted.status = this.userModel.status.code;
        dataFormatted.permissions = this.userModel.permissions.map(
            (perm) => perm.code
        );

        return dataFormatted;
    }

    createUserStaff() {
        const formData = this.transformUserModel(this.userModel);
        formData.status = 'active';

        this._staffService.createAdmin(formData, this.token).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.userDialog = false;
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Staff created successfully',
                        life: 3000,
                    });
                    this.getStaffAdmin();
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Staff not created',
                        life: 3000,
                    });
                }
            },
            error: (error) => {
                console.log('error', error);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Staff not created',
                    life: 3000,
                });
            },
            complete: () => {
                console.log('Staff created!');
            },
        });
    }

    createUpdateUser(event: any) {
        switch (event.label) {
            case 'Create':
                this._confirmationService.confirm({
                    message: 'Are you sure you want to create this user?',
                    header: 'Confirm',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.createUserStaff();
                    },
                });

                break;
            case 'Update':
                this._confirmationService.confirm({
                    message: 'Are you sure you want to update this user?',
                    header: 'Confirm',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.update();
                    },
                });

                break;
        }
    }

    getSeverity(status: string) {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'danger';
            default:
                return 'danger';
        }
    }

    update() {
        const data = this.transformUserModel(this.userModel);
        data['_id'] = this.userModel._id;
        data['password'] = this.userModel.password;

        this._staffService.updateStaffAdmin(this.token, data).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.userDialog = false;
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Staff updated successfully!',
                        life: 3000,
                    });
                    this.getStaffAdmin();
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Staff not updated',
                        life: 3000,
                    });
                }
            },

            error: (error) => {
                console.log('error', error);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Staff not updated',
                    life: 3000,
                });
            },
            complete: () => {
                console.log('Staff updated!');
            },
        });
    }

    public passval: boolean;
    public passMessage: string;
    verifyPasswordInput(confirmPassword: any) {
        let passwordInput = confirmPassword.target.value;

        if (this.userModel.password.length < 8) {
            this.passMessage = 'Password must be at least 8 characters';
            this.passval = true;
        } else {
            if (
                this.userModel.password === passwordInput &&
                this.userModel.repeatPassword === passwordInput
            ) {
                this.passMessage = 'Password Match';
                this.passval = false;
            } else {
                this.passMessage = 'Password does not match';
                this.passval = true;
            }
        }
    }
}
