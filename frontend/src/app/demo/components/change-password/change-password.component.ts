import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CookieService } from 'ngx-cookie-service';
import { CondominioService } from '../../service/condominios.service';

type ChangePassword = {
    _id: string;
    email: string;
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
    public changePassword: ChangePassword;
    public passMessage: string = '';
    public identity: any;
    private token: any;

    @Input() userData: boolean;

    constructor(
        private _userService: UserService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService
    ) {
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.changePassword = {
            _id: this.identity._id,
            email: this.identity.email,
            password: '',
            retryPassword: '',
        };
    }

    verifyPasswordInput(confirmPassword: any) {
        let passwordInput = confirmPassword.target.value;

        if (this.changePassword.password.length < 8) {
            this.passMessage = 'Password must be at least 8 characters';
            this.passval = true;
        } else {
            if (
                this.changePassword.password === passwordInput &&
                this.changePassword.retryPassword === passwordInput
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
                this.updatePassword();
            },
            reject: () => {
                console.log('reject');
            },
        });
    }

    updatePassword() {
        this._userService
            .updatePassword(this.token, this.changePassword)
            .subscribe({
                next: (response) => {
                    if (response.status === 'success') {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Password updated successfully',
                        });
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update password',
                        });
                    }
                },
                error: (error) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update password',
                    });
                },
            });
    }
}
