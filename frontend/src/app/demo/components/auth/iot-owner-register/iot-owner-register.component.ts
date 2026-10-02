import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IoTService } from 'src/app/demo/service/iot.service';

function payloadOf<T>(response: { data?: T } & Record<string, unknown>): T {
    return (response.data ?? response) as T;
}

@Component({
    selector: 'app-iot-owner-register',
    templateUrl: './iot-owner-register.component.html',
    styles: [
        `
            :host {
                display: block;
                min-height: 100vh;
                color: #18372f;
            }
            .register-page {
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 1.25rem;
                background: #f5f8f5;
            }
            .register-panel {
                width: min(100%, 34rem);
                padding: 2rem;
                border: 1px solid #dce7e1;
                border-radius: 8px;
                background: #fff;
            }
            .register-panel h1 {
                margin: 0.2rem 0 0.5rem;
                font-size: 1.7rem;
            }
            .register-panel p {
                color: #6f817b;
                line-height: 1.5;
            }
            .register-eyebrow {
                margin: 0;
                color: #147454 !important;
                font-size: 0.7rem;
                font-weight: 800;
            }
            .register-form {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.8rem;
                margin-top: 1.5rem;
            }
            .register-form label {
                grid-column: 1 / -1;
                margin-bottom: -0.5rem;
                font-size: 0.8rem;
                font-weight: 700;
            }
            .register-form label.half {
                grid-column: auto;
            }
            .register-form input {
                width: 100%;
                grid-column: 1 / -1;
            }
            .register-form .half {
                grid-column: auto;
            }
            .register-form button {
                grid-column: 1 / -1;
                margin-top: 0.5rem;
            }
            .register-success {
                display: grid;
                gap: 0.8rem;
                padding-top: 1rem;
            }
            @media (max-width: 480px) {
                .register-panel {
                    padding: 1.25rem;
                }
                .register-form {
                    grid-template-columns: 1fr;
                }
                .register-form .half {
                    grid-column: 1 / -1;
                }
            }
        `,
    ],
    standalone: false,
})
export class IoTOwnerRegisterComponent {
    private readonly iot = inject(IoTService);
    private readonly router = inject(Router);
    readonly submitting = signal(false);
    readonly submitted = signal(false);
    readonly errorMessage = signal('');
    readonly form = signal({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        residenceLabel: '',
    });

    update(field: keyof ReturnType<typeof this.form>, value: string): void {
        this.form.update((current) => ({ ...current, [field]: value }));
    }

    submit(): void {
        if (this.submitting()) return;
        this.submitting.set(true);
        this.errorMessage.set('');
        this.iot
            .registerPersonalOwner(this.form())
            .pipe(finalize(() => this.submitting.set(false)))
            .subscribe({
                next: () => this.submitted.set(true),
                error: (error: { error?: { message?: string } }) =>
                    this.errorMessage.set(
                        error.error?.message ||
                            'Registration is unavailable. Try again later.'
                    ),
            });
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login']);
    }
}
