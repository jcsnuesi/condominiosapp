import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CookieService } from 'ngx-cookie-service';
import { CondominioService } from '../../service/condominios.service';

type Password = {
    password: string;
    retryPassword: string;
};

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        PasswordModule,
        ConfirmDialogModule,
    ],
    providers: [
        UserService,
        OwnerServiceService,
        ConfirmationService,
        CondominioService,
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
    public passval: boolean = true;
    public password: Password;
    public passMessage: string = '';
    public identity: any;
    private token: any;

    @Input() changePasswordDialog: boolean = false;
    @Output() passwordChanged = new EventEmitter<boolean>();
    @Input() componentHeader: string = '';
    @Input() componentMessage: string = '';
    @Input() data: any;

    constructor(
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _confirmationService: ConfirmationService,
        private _cookieService: CookieService,
        private _condominioService: CondominioService
    ) {
        this.password = {
            password: '',
            retryPassword: '',
        };

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        // console.log('deleteProperty changePassword', this.componentHeader);
    }

    verifyPasswordInput(confirmPassword: any) {
        let passwordInput = confirmPassword.target.value;

        if (this.password.password.length < 8) {
            this.passMessage = 'Password must be at least 8 characters';
            this.passval = true;
        } else {
            if (
                this.password.password === passwordInput &&
                this.password.retryPassword === passwordInput
            ) {
                this.passMessage = 'Password Match';
                this.passval = false;
            } else {
                this.passMessage = 'Password does not match';
                this.passval = true;
            }
        }
    }

    confirmChangePassword() {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Confirmation',
            message: 'Are you sure that you want to do this action?',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                if (this.identity.role === 'ADMIN') {
                    this.deletePropertyByAdmin();
                } else {
                    this.updatePassword();
                }
            },
            reject: () => {
                console.log('reject');
            },
        });
    }

    deletePropertyByAdmin() {
        let user = {
            email: this.identity.email_company,
            password: this.password.password,
        };

        this._userService.login(user, true).subscribe({
            next: (response) => {
                if (response.token) {
                    this._condominioService
                        .deletePropertyWithAuth(this.token, this.data._id)
                        .subscribe({
                            next: (response) => {
                                if (response.status === 'success') {
                                    this.changePasswordDialog = false;
                                    this.emitChange();
                                }
                                console.log('response-------->', response);
                            },
                            error: (error) => {
                                console.log('error', error);
                            },
                        });
                } else {
                    console.log('response-------->', response);
                }
                console.log('response-------->', response);
            },
            error: (error) => {
                console.log('error', error);
            },
        });
    }

    updatePassword() {
        const formdata = new FormData();
        formdata.append('password', this.password.password);
        formdata.append('_id', this.identity._id);
        formdata.append('role', this.identity.role);

        switch (this.identity.role) {
            case 'ADMIN':
                // this._userService.updateUser(this.token, this.password).subscribe({
                //     next: (response) => {},
                //     error: (error) => {}
                // });
                break;
            case 'OWNER':
                this._ownerService.updateOwner(this.token, formdata).subscribe({
                    next: (response) => {
                        if (response.status === 'success') {
                            this._cookieService.delete('identity');
                            this._cookieService.set(
                                'identity',
                                JSON.stringify(response.user_updated)
                            );
                            this.changePasswordDialog = false;
                            this.emitChange();
                        }
                        console.log('response', response);
                    },
                    error: (error) => {
                        console.log('error', error);
                    },
                });
                break;
        }
    }

    emitChange() {
        this.passwordChanged.emit(true);
    }
}
