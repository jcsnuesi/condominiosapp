import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/demo/service/user.service';
import { I18nService } from 'src/app/demo/service/i18n.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    providers: [MessageService],
    standalone: false,
})
export class ResetPasswordComponent {
    public password = '';
    public loading = false;
    public resetToken = '';
    public t = (key: string) => this._i18n.t(key);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _messageService: MessageService,
        private _i18n: I18nService
    ) {
        this.resetToken = this._route.snapshot.paramMap.get('token') || '';
    }

    submit(): void {
        if (!this.password || this.password.length < 8 || this.loading) {
            return;
        }

        this.loading = true;

        this._userService
            .resetPassword(this.resetToken, this.password)
            .subscribe({
                next: () => {
                    this.loading = false;
                    this._messageService.add({
                        severity: 'success',
                        summary: 'OK',
                        detail: this.t('auth.reset.success'),
                    });
                    this._router.navigate(['/auth/login']);
                },
                error: (err) => {
                    this.loading = false;
                    const detail =
                        err?.error?.code === 'AUTH_RESET_INVALID_TOKEN'
                            ? this.t('auth.reset.invalidToken')
                            : this.t('auth.login.error');
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail,
                    });
                },
            });
    }

    goToLogin(): void {
        this._router.navigate(['/auth/login']);
    }
}
