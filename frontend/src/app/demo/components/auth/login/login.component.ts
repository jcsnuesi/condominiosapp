import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from 'src/app/demo/service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { global } from 'src/app/demo/service/global.service';
import { MessageService } from 'primeng/api';
import { I18nService } from 'src/app/demo/service/i18n.service';
import { AccessContextService } from 'src/app/demo/service/access-context.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.35);
                margin-right: 0.75rem;
                color: var(--primary-color) !important;
            }

            .login-shell {
                min-height: 100vh;
                min-height: 100dvh;
                min-width: 100vw;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                overflow-x: hidden;
                overflow-y: auto;
                padding: 2rem;
                background: radial-gradient(
                        circle at top left,
                        color-mix(
                            in srgb,
                            var(--primary-color) 16%,
                            transparent
                        ),
                        transparent 28rem
                    ),
                    radial-gradient(
                        circle at bottom right,
                        rgba(14, 165, 233, 0.14),
                        transparent 30rem
                    ),
                    var(--surface-ground);
            }

            .login-card-wrap {
                width: min(100%, 30rem);
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-block: auto;
            }

            .login-logo {
                width: 6rem;
                flex-shrink: 0;
                margin-bottom: 2rem;
            }

            .login-gradient-frame {
                width: 100%;
                padding: 0.3rem;
                border-radius: 2rem;
                background: linear-gradient(
                    180deg,
                    var(--primary-color) 0%,
                    rgba(33, 150, 243, 0) 42%
                );
                box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
            }

            .login-card {
                width: 100%;
                border-radius: 1.75rem;
                padding: clamp(2rem, 7vw, 3rem);
            }

            :host ::ng-deep .login-avatar {
                box-shadow: 0 0 0 6px var(--surface-100);
            }

            .login-card h1 {
                margin: 0.35rem 0;
                color: var(--text-color);
                font-size: clamp(1.8rem, 5vw, 2.35rem);
            }

            .login-card p {
                margin: 0;
                color: var(--text-color-secondary);
            }

            .login-input {
                padding: 1rem;
            }

            :host ::ng-deep .login-password .p-password,
            :host ::ng-deep .login-password .p-inputtext {
                width: 100%;
            }

            .login-options {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin: 0.75rem 0 1.5rem;
            }

            .forgot-link {
                color: var(--primary-color);
                cursor: pointer;
                font-weight: 600;
                text-decoration: none;
                white-space: nowrap;
            }

            @media (max-width: 480px) {
                .login-shell {
                    padding: 1rem;
                }

                .login-options {
                    align-items: flex-start;
                    flex-direction: column;
                }
            }

            @media (max-height: 680px) {
                .login-card-wrap {
                    margin-block: 0;
                }

                .login-logo {
                    width: 4.75rem;
                    margin-bottom: 1rem;
                }
            }
        `,
    ],
    providers: [UserService, CookieService, MessageService],
    standalone: false,
})
export class LoginComponent {
    public url;
    public loginInProgress = false;
    public rememberMe = false;
    public t = (key: string) => this._i18n.t(key);

    password!: string;
    public administrator: {
        email: string;
        password: string;
        rememberMe?: boolean;
    } = {
        email: '',
        password: '',
    };

    constructor(
        public layoutService: LayoutService,
        private _userService: UserService,
        private _cookieService: CookieService,
        private _route: Router,
        private _messageService: MessageService,
        private _i18n: I18nService,
        private _accessContext: AccessContextService
    ) {
        this.url = global.url;
    }

    loginAdministrators(loginForm?: NgForm) {
        if (loginForm?.invalid || this.loginInProgress) {
            loginForm?.control.markAllAsTouched();
            return;
        }

        this.loginInProgress = true;
        const payload = {
            ...this.administrator,
            rememberMe: this.rememberMe,
        };

        this._userService.login(payload, false).subscribe(
            (login) => {
                if (login?.success && login?.data?.token && login?.data?.user) {
                    const identity = login.data.user;
                    const token = login.data.token;
                    const expiresAt = login?.data?.session?.expiresAt;
                    const access = login?.data?.access ?? null;

                    if (this.rememberMe && expiresAt) {
                        const expiry = new Date(expiresAt);
                        this._cookieService.set(
                            'identity',
                            JSON.stringify(identity),
                            {
                                expires: expiry,
                            }
                        );
                        this._cookieService.set('token', token, {
                            expires: expiry,
                        });
                    } else {
                        this._cookieService.set(
                            'identity',
                            JSON.stringify(identity)
                        );
                        this._cookieService.set('token', token);
                    }

                    this._accessContext.set(access);

                    const target = String(identity.role || '').toUpperCase() === 'SUPERUSER'
                        ? ['/platform/organizations']
                        : ['/start', identity._id];
                    this._route.navigate(target);
                } else {
                    this.show();
                }

                this.loginInProgress = false;
            },

            (error) => {
                this.loginInProgress = false;
                this.show();
            }
        );
    }

    goToForgotPassword(): void {
        this._route.navigate(['/auth/forgot-password']);
    }

    show() {
        this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.t('auth.login.error'),
        });
    }
}
