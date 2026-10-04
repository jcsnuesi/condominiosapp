import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
    signal,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../demo/service/user.service';
import { global } from '../../demo/service/global.service';

export interface AuthenticatedProfile {
    _id: string;
    avatar?: string;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    role: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProfileResponse {
    success: boolean;
    data?: {
        user?: AuthenticatedProfile;
        access?: {
            organization?: { id: string; name: string } | null;
        };
    };
    error?: { message?: string } | null;
}

const passwordsMatch: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
        ? { passwordsMismatch: true }
        : null;
};

@Component({
    selector: 'app-authenticated-user-profile',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        InputTextModule,
        ReactiveFormsModule,
    ],
    templateUrl: './authenticated-user-profile.component.html',
    styleUrl: './authenticated-user-profile.component.css',
})
export class AuthenticatedUserProfileComponent implements OnChanges {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() profileUpdated = new EventEmitter<AuthenticatedProfile>();

    private readonly formBuilder = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly cookieService = inject(CookieService);
    private readonly messageService = inject(MessageService);

    readonly isLoading = signal(false);
    readonly isSavingProfile = signal(false);
    readonly isSavingPassword = signal(false);
    readonly avatarPreview = signal('');
    readonly organizationName = signal('');
    readonly accountRole = signal('');
    readonly accountStatus = signal('');
    readonly memberSince = signal('');

    private selectedAvatar: File | null = null;

    readonly profileForm = this.formBuilder.nonNullable.group({
        name: ['', [Validators.required, Validators.maxLength(50)]],
        lastname: ['', [Validators.required, Validators.maxLength(50)]],
        phone: [
            '',
            [
                Validators.required,
                Validators.pattern(/^[+0-9()\-\s]{7,20}$/),
            ],
        ],
        email: ['', [Validators.required, Validators.email]],
    });

    readonly passwordForm = this.formBuilder.nonNullable.group(
        {
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
        },
        { validators: passwordsMatch }
    );

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.loadProfile();
        }
    }

    close(): void {
        this.visibleChange.emit(false);
        this.passwordForm.reset();
    }

    onVisibleChange(isVisible: boolean): void {
        if (!isVisible) this.close();
    }

    selectAvatar(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formato no compatible',
                detail: 'Selecciona una imagen JPG, PNG o WebP.',
            });
            input.value = '';
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Imagen demasiado grande',
                detail: 'El avatar debe pesar menos de 3 MB.',
            });
            input.value = '';
            return;
        }

        this.selectedAvatar = file;
        const reader = new FileReader();
        reader.onload = () => this.avatarPreview.set(String(reader.result));
        reader.readAsDataURL(file);
    }

    saveProfile(): void {
        if (this.profileForm.invalid || this.isSavingProfile()) {
            this.profileForm.markAllAsTouched();
            return;
        }

        const payload = new FormData();
        const profile = this.profileForm.getRawValue();
        Object.entries(profile).forEach(([key, value]) =>
            payload.append(key, value.trim())
        );
        if (this.selectedAvatar) payload.append('avatar', this.selectedAvatar);

        this.isSavingProfile.set(true);
        this.userService.updateAuthenticatedProfile(payload).subscribe({
            next: (response: ProfileResponse) => {
                const updatedUser = response.data?.user;
                if (!response.success || !updatedUser) {
                    this.showError(
                        response.error?.message || 'No se pudo guardar el perfil.'
                    );
                    return;
                }

                this.applyProfile(updatedUser);
                this.updateIdentityCookie(updatedUser);
                this.profileUpdated.emit(updatedUser);
                this.selectedAvatar = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Perfil actualizado',
                    detail: 'Tus datos personales fueron guardados.',
                });
            },
            error: (error) => this.showError(this.errorMessage(error)),
            complete: () => this.isSavingProfile.set(false),
        });
    }

    changePassword(): void {
        if (this.passwordForm.invalid || this.isSavingPassword()) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        const { currentPassword, newPassword } =
            this.passwordForm.getRawValue();
        this.isSavingPassword.set(true);
        this.userService
            .changeAuthenticatedPassword({ currentPassword, newPassword })
            .subscribe({
                next: (response: ProfileResponse) => {
                    if (!response.success) {
                        this.showError(
                            response.error?.message ||
                                'No se pudo actualizar la contraseña.'
                        );
                        return;
                    }

                    this.passwordForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Contraseña actualizada',
                        detail: 'Tu nueva contraseña ya está activa.',
                    });
                },
                error: (error) => this.showError(this.errorMessage(error)),
                complete: () => this.isSavingPassword.set(false),
            });
    }

    private loadProfile(): void {
        this.isLoading.set(true);
        this.userService.getAuthenticatedProfile().subscribe({
            next: (response: ProfileResponse) => {
                const user = response.data?.user;
                if (!response.success || !user) {
                    this.showError('No se pudo cargar la información de la cuenta.');
                    return;
                }

                this.applyProfile(user);
                this.organizationName.set(
                    response.data?.access?.organization?.name ||
                        'Cuenta independiente'
                );
            },
            error: (error) => this.showError(this.errorMessage(error)),
            complete: () => this.isLoading.set(false),
        });
    }

    private applyProfile(profile: AuthenticatedProfile): void {
        this.profileForm.reset({
            name: profile.name || '',
            lastname: profile.lastname || '',
            phone: profile.phone || '',
            email: profile.email || '',
        });
        this.accountRole.set(profile.role || 'Usuario');
        this.accountStatus.set(profile.status || 'active');
        this.memberSince.set(this.formatDate(profile.createdAt));
        this.avatarPreview.set(this.resolveAvatar(profile));
    }

    private resolveAvatar(profile: AuthenticatedProfile): string {
        if (!profile.avatar) return '';
        if (/^(https?:|data:|blob:)/.test(profile.avatar)) return profile.avatar;

        const role = String(profile.role || '').toUpperCase();
        const directory =
            role === 'OWNER'
                ? 'owners'
                : role === 'FAMILY'
                  ? 'family'
                  : 'users';
        return `${global.url}main-avatar/${directory}/${profile.avatar}`;
    }

    private updateIdentityCookie(profile: AuthenticatedProfile): void {
        const currentIdentity = this.userService.getIdentity() || {};
        this.cookieService.set(
            'identity',
            JSON.stringify({ ...currentIdentity, ...profile })
        );
    }

    private formatDate(value?: string): string {
        if (!value) return 'No disponible';
        return new Intl.DateTimeFormat('es-DO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(value));
    }

    private errorMessage(error: {
        error?: { error?: { message?: string }; message?: string };
    }): string {
        return (
            error?.error?.error?.message ||
            error?.error?.message ||
            'No pudimos completar la solicitud. Inténtalo nuevamente.'
        );
    }

    private showError(detail: string): void {
        this.isSavingProfile.set(false);
        this.isSavingPassword.set(false);
        this.isLoading.set(false);
        this.messageService.add({
            severity: 'error',
            summary: 'Revisa la información',
            detail,
        });
    }
}
