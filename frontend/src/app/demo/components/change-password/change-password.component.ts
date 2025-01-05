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
    providers: [UserService, OwnerServiceService, ConfirmationService],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
    public passval: boolean = true;
    public password: Password;
    public passMessage: string = '';
    private identity: any;
    private token: any;
    @Input() changePasswordDialog: boolean = false;
    @Output() passwordChanged = new EventEmitter<boolean>();

    constructor(
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _confirmationService: ConfirmationService,
        private _cookieService: CookieService
    ) {
        this.password = {
            password: '',
            retryPassword: '',
        };

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
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
            message: 'Are you sure that you want to change your password?',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                this.updatePassword();
            },
            reject: () => {
                console.log('reject');
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
