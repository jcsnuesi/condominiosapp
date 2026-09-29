import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports_primeng';
import {
    OrganizationProvisionRequest,
    OrganizationProvisioningService,
} from '../../service/organization-provisioning.service';

@Component({
    selector: 'app-organization-provisioning',
    standalone: true,
    imports: [CommonModule, FormsModule, ImportsModule],
    providers: [MessageService],
    templateUrl: './organization-provisioning.component.html',
    styleUrl: './organization-provisioning.component.css',
})
export class OrganizationProvisioningComponent {
    private readonly provisioning = inject(OrganizationProvisioningService);
    private readonly messages = inject(MessageService);

    submitting = false;
    createdOrganizationName = '';
    form: OrganizationProvisionRequest = {
        organization: {
            name: '',
            email: '',
            rnc: '',
            address: { city: '', state: '', country: '' },
        },
        admin: { email: '', password: '' },
    };

    provision(): void {
        if (this.submitting || !this.form.organization.name || !this.form.organization.email || !this.form.admin.email || !this.form.admin.password) {
            this.messages.add({ severity: 'warn', summary: 'Datos requeridos', detail: 'Completa la organización y el ADMIN propietario.' });
            return;
        }

        this.submitting = true;
        this.provisioning.provision(this.form).subscribe({
            next: (response) => {
                this.createdOrganizationName = response.message.organization.name;
                this.submitting = false;
                this.messages.add({ severity: 'success', summary: 'Organización creada', detail: 'El ADMIN propietario ya puede iniciar sesión.' });
            },
            error: (error: { error?: { message?: string } }) => {
                this.submitting = false;
                this.messages.add({ severity: 'error', summary: 'No se pudo crear', detail: error.error?.message ?? 'Verifica los datos e inténtalo de nuevo.' });
            },
        });
    }
}
