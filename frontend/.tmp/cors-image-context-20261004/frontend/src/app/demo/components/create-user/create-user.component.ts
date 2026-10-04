import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { delay, forkJoin, Observable } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { UserService } from '../../service/user.service';
import { Staff } from '../../models/staff.model';
import { StaffService } from '../../service/staff.service';
import { ImportsModule } from '../../imports_primeng';
import { global } from '../../service/global.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { AccessManagementComponent } from '../access-management/access-management.component';
import { AccessContextService } from '../../service/access-context.service';
import {
    AccessManagementService,
    AdministrativeUser,
    unwrapApiMessage,
} from '../../service/access-management.service';

type SelectOption = { label: string; code: string };
type ManagedRole = 'STAFF_ADMIN' | 'STAFF';
type ManagedUser = AdministrativeUser & {
    fullname: string;
    role: ManagedRole;
    permissions?: string[];
};

@Component({
    selector: 'app-create-user',
    imports: [
        ImportsModule,
        FormsModule,
        CommonModule,
        AccessManagementComponent,
    ],
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
    @ViewChild(AccessManagementComponent)
    private accessManagement?: AccessManagementComponent;

    userModel: Staff;
    token: string;
    identity: any;
    selectedStaffs: ManagedUser[] = [];
    rowMenuItems: MenuItem[] = [];
    userDialog = false;
    passwordActive = false;
    dialogHeader = '';
    btnLabel = '';
    managedUsers: ManagedUser[] = [];
    url = global.url;
    totalRecords = 0;
    passval = false;
    passMessage = '';
    readonly isOwnerAdmin;

    genderModel: SelectOption[] = [
        { label: 'Female', code: 'Female' },
        { label: 'Male', code: 'Male' },
    ];
    positionOptions: SelectOption[] = [
        { label: 'Manager', code: 'manager' },
        { label: 'Accounting', code: 'accounting' },
        { label: 'Sales', code: 'sales' },
        { label: 'Marketing', code: 'marketing' },
        { label: 'Human Resources', code: 'human_resources' },
        { label: 'Handyman', code: 'handyman' },
        { label: 'Customer care', code: 'customer_care' },
    ];
    roleOptions: SelectOption[] = [
        { label: 'Staff Admin', code: 'STAFF_ADMIN' },
        { label: 'Staff', code: 'STAFF' },
    ];
    accountStatusOptions: SelectOption[] = [
        { label: 'Active', code: 'active' },
        { label: 'Inactive', code: 'inactive' },
        { label: 'Pending', code: 'pending' },
    ];
    condominiumOptions: SelectOption[] = [];
    selectedRole: SelectOption = this.roleOptions[0];
    selectedCondominium: SelectOption | null = null;

    constructor(
        private readonly userService: UserService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly staffService: StaffService,
        private readonly formatFunctions: FormatFunctions,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly accessContext: AccessContextService,
        private readonly accessService: AccessManagementService
    ) {
        this.isOwnerAdmin = this.accessContext.isOwnerAdmin;
        this.token = this.userService.getToken();
        this.identity = this.userService.getIdentity();
        this.userModel = this.emptyUser();
    }

    ngOnInit(): void {
        this.loadUsers();
        this.loadCondominiums();
    }

    private emptyUser(): Staff {
        return new Staff(
            '',
            '',
            '',
            { label: '', code: '' },
            '',
            { label: '', code: '' },
            '',
            [],
            { label: 'Active', code: 'active' },
            ''
        );
    }

    upperCase(value?: string): string {
        return value?.toUpperCase() ?? '';
    }

    loadUsers(): void {
        this.accessService.getUsers().pipe(delay(0)).subscribe({
            next: (response) => {
                const users = unwrapApiMessage(response) ?? [];
                this.managedUsers = users.map((user) => ({
                    ...user,
                    fullname: `${user.name} ${user.lastname}`,
                    role:
                        user.subjectModel === 'Staff_Admin'
                            ? 'STAFF_ADMIN'
                            : 'STAFF',
                }));
                this.totalRecords = this.managedUsers.length;
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.managedUsers = [];
                this.totalRecords = 0;
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    this.errorMessage(
                        error,
                        'No se pudieron cargar los usuarios de la organización.'
                    )
                );
            },
        });
    }

    private loadCondominiums(): void {
        this.accessService.getCondominiums().pipe(delay(0)).subscribe({
            next: (response) => {
                this.condominiumOptions = (
                    unwrapApiMessage(response) ?? []
                ).map((condominium) => ({
                    label: condominium.alias,
                    code: condominium._id,
                }));
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    this.errorMessage(
                        error,
                        'No se pudieron cargar los condominios.'
                    )
                );
            },
        });
    }

    createNewUser(): void {
        this.userDialog = true;
        this.btnLabel = 'Create';
        this.dialogHeader = 'Create User';
        this.passwordActive = false;
        this.userModel = this.emptyUser();
        this.selectedRole = this.roleOptions[0];
        this.selectedCondominium = null;
    }

    hideDialog(): void {
        this.userDialog = false;
    }

    editStaff(user: ManagedUser): void {
        this.userDialog = true;
        this.btnLabel = 'Update';
        this.dialogHeader = 'Edit User';
        this.passwordActive = true;
        this.selectedRole =
            this.roleOptions.find((role) => role.code === user.role) ??
            this.roleOptions[0];
        const condominiumId =
            typeof user.condo_id === 'string'
                ? user.condo_id
                : user.condo_id?._id;
        this.selectedCondominium =
            this.condominiumOptions.find(
                (condominium) => condominium.code === condominiumId
            ) ?? null;
        this.userModel = {
            ...this.emptyUser(),
            ...user,
            gender: { label: user.gender ?? '', code: user.gender ?? '' },
            status: {
                label: this.formatFunctions.titleCase(user.status),
                code: user.status,
            },
            position: {
                label: this.formatFunctions.titleCase(user.position),
                code: user.position,
            },
            permissions: (user.permissions ?? []).map((permission) => ({
                label: this.formatFunctions.titleCase(permission),
                code: permission,
            })),
        };
    }

    openUserMenu(menu: Menu, event: Event, user: ManagedUser): void {
        const isInactive = user.status === 'inactive';
        this.rowMenuItems = [
            {
                label: 'Edit user',
                icon: 'pi pi-pencil',
                command: () => this.editStaff(user),
            },
            {
                label: isInactive ? 'Active user' : 'Inactive user',
                icon: isInactive ? 'pi pi-check-circle' : 'pi pi-pause-circle',
                command: () => this.confirmUserStatusChange(user),
            },
            { separator: true },
            {
                label: 'Permanently delete',
                icon: 'pi pi-trash',
                styleClass: 'create-user-permanent-delete-action',
                command: () => this.confirmPermanentDelete(user),
            },
        ];

        menu.model = this.rowMenuItems;
        menu.toggle(event);
    }

    private confirmUserStatusChange(user: ManagedUser): void {
        const activate = user.status === 'inactive';
        const nextStatus: 'active' | 'inactive' = activate
            ? 'active'
            : 'inactive';
        const actionLabel = activate ? 'activate' : 'inactivate';

        this.confirmationService.confirm({
            header: activate ? 'Activate user' : 'Inactive user',
            message: `Are you sure you want to ${actionLabel} ${user.fullname}?`,
            icon: activate ? 'pi pi-check-circle' : 'pi pi-pause-circle',
            acceptLabel: activate ? 'Activate' : 'Inactivate',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: activate
                ? 'p-button-success'
                : 'p-button-warning',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                this.accessService.updateUserStatus(user, nextStatus).subscribe({
                    next: () => {
                        this.notify(
                            'success',
                            activate
                                ? 'Usuario activado correctamente.'
                                : 'Usuario inactivado correctamente.'
                        );
                        this.refreshUsers();
                    },
                    error: (error) =>
                        this.notify(
                            'error',
                            this.errorMessage(
                                error,
                                'No se pudo cambiar el estado del usuario.'
                            )
                        ),
                });
            },
        });
    }

    private confirmPermanentDelete(user: ManagedUser): void {
        this.confirmationService.confirm({
            header: 'Permanently delete user',
            message: `${user.fullname} will be permanently deleted. This action cannot be undone.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Permanently delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                this.accessService.deleteUserPermanently(user).subscribe({
                    next: () => {
                        this.selectedStaffs = this.selectedStaffs.filter(
                            (selectedUser) => selectedUser._id !== user._id
                        );
                        this.notify(
                            'success',
                            'Usuario eliminado permanentemente.'
                        );
                        this.refreshUsers();
                    },
                    error: (error) =>
                        this.notify(
                            'error',
                            this.errorMessage(
                                error,
                                'No se pudo eliminar permanentemente el usuario.'
                            )
                        ),
                });
            },
        });
    }

    createUpdateUser(event: { label?: string }): void {
        const isCreate = event.label === 'Create';
        this.confirmationService.confirm({
            message: `Are you sure you want to ${isCreate ? 'create' : 'update'} this user?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: isCreate ? 'Create' : 'Update',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: isCreate
                ? 'p-button-success'
                : 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => (isCreate ? this.createUserStaff() : this.update()),
        });
    }

    createUserStaff(): void {
        const data = this.commonPayload();
        if (!this.isFormComplete(data)) return;

        let request: Observable<any>;
        if (this.selectedRole.code === 'STAFF') {
            if (!this.selectedCondominium?.code) {
                this.notify(
                    'warn',
                    'Selecciona el condominio al que pertenecerá el Staff.'
                );
                return;
            }
            request = this.staffService.create(
                this.staffFormData(data, this.selectedCondominium.code),
                this.token
            );
        } else {
            request = this.staffService.createAdmin(data, this.token);
        }

        request.subscribe({
            next: (response) => {
                const emailSent = this.responseData(response)?.emailSent !== false;
                this.userDialog = false;
                this.notify(
                    emailSent ? 'success' : 'warn',
                    emailSent
                        ? 'Usuario creado y correo de credenciales enviado.'
                        : 'Usuario creado, pero no se pudo enviar el correo de credenciales.'
                );
                this.refreshUsers();
            },
            error: (error) =>
                this.notify(
                    'error',
                    this.errorMessage(error, 'No se pudo crear el usuario.')
                ),
        });
    }

    update(): void {
        const data: any = this.commonPayload();
        if (!this.isFormComplete(data)) return;
        data._id = this.userModel._id;
        if (this.userModel.password) data.password = this.userModel.password;

        let request: Observable<any>;
        if (this.selectedRole.code === 'STAFF') {
            if (!this.selectedCondominium?.code) {
                this.notify('warn', 'Selecciona el condominio del Staff.');
                return;
            }
            request = this.staffService.updateStaff(
                this.staffFormData(data, this.selectedCondominium.code)
            );
        } else {
            request = this.staffService.updateStaffAdmin(data);
        }

        request.subscribe({
            next: () => {
                this.userDialog = false;
                this.notify('success', 'Usuario actualizado correctamente.');
                this.refreshUsers();
            },
            error: (error) =>
                this.notify(
                    'error',
                    this.errorMessage(error, 'No se pudo actualizar el usuario.')
                ),
        });
    }

    deleteSelectedUsers(): void {
        const activeUsers = this.selectedStaffs.filter(
            (user) => user.status !== 'inactive'
        );
        if (!activeUsers.length) {
            this.notify('warn', 'Selecciona al menos un usuario activo.');
            return;
        }
        this.confirmationService.confirm({
            message: `¿Deseas inactivar ${activeUsers.length} usuario(s)?`,
            header: 'Confirmar inactivación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Inactivar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => this.inactivateUsers(activeUsers),
        });
    }

    deleteAnUser(user: ManagedUser): void {
        this.selectedStaffs = [user];
        this.deleteSelectedUsers();
    }

    private inactivateUsers(users: ManagedUser[]): void {
        const adminIds = users
            .filter((user) => user.subjectModel === 'Staff_Admin')
            .map((user) => user._id);
        const staffUsers = users
            .filter((user) => user.subjectModel === 'Staff')
            .map((user) => ({ _id: user._id }));
        const requests: Observable<any>[] = [];
        if (adminIds.length) {
            requests.push(
                this.staffService.deleteStaffAdmin({
                    id: adminIds,
                    status: 'active',
                })
            );
        }
        if (staffUsers.length) {
            requests.push(this.staffService.deleteStaff(staffUsers));
        }
        forkJoin(requests).subscribe({
            next: () => {
                this.selectedStaffs = [];
                this.notify('success', 'Usuarios inactivados correctamente.');
                this.refreshUsers();
            },
            error: (error) =>
                this.notify(
                    'error',
                    this.errorMessage(error, 'No se pudieron inactivar los usuarios.')
                ),
        });
    }

    private commonPayload(): Record<string, any> {
        return {
            name: this.userModel.name,
            lastname: this.userModel.lastname,
            phone: this.userModel.phone,
            email: this.userModel.email,
            position: this.userModel.position?.code,
            gender: this.userModel.gender?.code,
            status: this.userModel.status?.code || 'active',
            permissions: [],
        };
    }

    private staffFormData(
        data: Record<string, any>,
        condominiumId: string
    ): FormData {
        const formData = new FormData();
        Object.entries({ ...data, condo_id: condominiumId }).forEach(
            ([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(
                        key,
                        Array.isArray(value) ? JSON.stringify(value) : String(value)
                    );
                }
            }
        );
        return formData;
    }

    private isFormComplete(data: Record<string, any>): boolean {
        const complete = [
            data['name'],
            data['lastname'],
            data['gender'],
            data['email'],
            data['phone'],
            data['position'],
        ].every(Boolean);
        if (!complete) {
            this.notify('warn', 'Completa todos los campos requeridos.');
        }
        return complete;
    }

    private refreshUsers(): void {
        this.loadUsers();
        this.accessManagement?.reloadUsers();
    }

    private responseData(response: any): any {
        return response?.data ?? response ?? {};
    }

    private errorMessage(error: any, fallback: string): string {
        return (
            error?.error?.error?.message ??
            error?.error?.data?.message ??
            error?.error?.message ??
            error?.message ??
            fallback
        );
    }

    private notify(
        severity: 'success' | 'error' | 'warn',
        detail: string
    ): void {
        this.messageService.add({
            severity,
            summary:
                severity === 'success'
                    ? 'Completado'
                    : severity === 'warn'
                      ? 'Atención'
                      : 'Error',
            detail,
            life: severity === 'warn' ? 6000 : 3000,
        });
    }

    getDate(date?: string): string {
        return date ? new Date(date).toDateString() : '';
    }

    getSeverity(status: string): 'success' | 'danger' {
        return status === 'active' ? 'success' : 'danger';
    }

    verifyPasswordInput(event: Event): void {
        const confirmPassword = (event.target as HTMLInputElement).value;
        if ((this.userModel.password?.length ?? 0) < 8) {
            this.passMessage = 'Password must be at least 8 characters';
            this.passval = true;
            return;
        }
        const matches =
            this.userModel.password === confirmPassword &&
            this.userModel.repeatPassword === confirmPassword;
        this.passMessage = matches ? 'Password Match' : 'Password does not match';
        this.passval = !matches;
    }
}
