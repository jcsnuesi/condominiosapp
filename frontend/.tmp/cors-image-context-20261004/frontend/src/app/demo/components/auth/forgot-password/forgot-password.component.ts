import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/demo/service/user.service';
import { I18nService } from 'src/app/demo/service/i18n.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    providers: [MessageService],
    standalone: false,
})
export class ForgotPasswordComponent {
    public email = '';
    public loading = false;
    public t = (key: string) => this._i18n.t(key);

    constructor(
        private _userService: UserService,
        private _messageService: MessageService,
        private _router: Router,
        private _i18n: I18nService
    ) {}

    submit(): void {
        if (!this.email || this.loading) {
            return;
        }

        this.loading = true;
        this._userService.forgotPassword(this.email).subscribe({
            next: () => {
                this.loading = false;
                this._messageService.add({
                    severity: 'success',
                    summary: 'OK',
                    detail: this.t('auth.forgot.success'),
                });
            },
            error: () => {
                this.loading = false;
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.t('auth.login.error'),
                });
            },
        });
    }

    goToLogin(): void {
        this._router.navigate(['/auth/login']);
    }
}
