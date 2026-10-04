import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccessGrant, AccessPolicy } from '../../models/access.model';
import {
    AccessManagementService,
    AdministrativeUser,
    unwrapApiMessage,
} from '../../service/access-management.service';
import { ImportsModule } from '../../imports_primeng';
import { delay } from 'rxjs';

@Component({
    selector: 'app-access-management',
    standalone: true,
    imports: [CommonModule, FormsModule, ImportsModule],
    templateUrl: './access-management.component.html',
    styleUrl: './access-management.component.css',
    providers: [ConfirmationService, MessageService],
})
export class AccessManagementComponent implements OnInit {
    policies: AccessPolicy[] = [];
    users: AdministrativeUser[] = [];
    condominiums: Array<{ _id: string; alias: string }> = [];
    permissionOptions: Array<{ label: string; value: string }> = [];
    policyOptions: Array<{ label: string; value: string }> = [];
    condominiumOptions: Array<{ label: string; value: string }> = [];
    isPolicyDialogVisible = false;
    isGrantDialogVisible = false;
    selectedUser: AdministrativeUser | null = null;
    policyDraft: AccessPolicy = this.emptyPolicy();
    grantDraft: AccessGrant = this.emptyGrant();

    constructor(
        private readonly accessService: AccessManagementService,
        private readonly confirmationService: ConfirmationService,
        private readonly messages: MessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadAll();
    }

    openNewPolicy(): void {
        this.policyDraft = this.emptyPolicy();
        this.isPolicyDialogVisible = true;
    }

    editPolicy(policy: AccessPolicy): void {
        if (policy.isSystem) return;
        this.policyDraft = { ...policy, permissions: [...policy.permissions] };
        this.isPolicyDialogVisible = true;
    }

    savePolicy(): void {
        const request = this.policyDraft._id
            ? this.accessService.updatePolicy(this.policyDraft)
            : this.accessService.createPolicy(this.policyDraft);
        request.subscribe({
            next: () => {
                this.isPolicyDialogVisible = false;
                this.notify('success', 'Política guardada');
                this.loadPolicies();
            },
            error: (error) => this.notify('error', error?.error?.message ?? 'No se pudo guardar la política'),
        });
    }

    confirmArchivePolicy(policy: AccessPolicy): void {
        this.confirmationService.confirm({
            header: 'Confirmar eliminación',
            message: `¿Quieres eliminar la política “${policy.name}”? Esta acción la archivará y no podrá usarse en nuevas asignaciones.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => this.archivePolicy(policy),
        });
    }

    private archivePolicy(policy: AccessPolicy): void {
        this.accessService.archivePolicy(policy._id).subscribe({
            next: () => {
                this.notify('success', 'Política archivada');
                this.loadPolicies();
            },
            error: (error) => this.notify('error', error?.error?.message ?? 'No se pudo archivar la política'),
        });
    }

    editGrant(user: AdministrativeUser): void {
        this.selectedUser = user;
        const grant = user.accessGrant;
        this.grantDraft = grant
            ? {
                  policyIds: grant.policyIds.map((policy) =>
                      typeof policy === 'string' ? policy : policy._id
                  ),
                  overrides: {
                      allow: [...(grant.overrides?.allow ?? [])],
                      deny: [...(grant.overrides?.deny ?? [])],
                  },
                  scope: {
                      mode: grant.scope?.mode ?? 'SELECTED',
                      condominiumIds: [...(grant.scope?.condominiumIds ?? [])],
                  },
              }
            : this.emptyGrant();
        this.isGrantDialogVisible = true;
    }

    saveGrant(): void {
        if (!this.selectedUser) return;
        if (this.grantDraft.scope.mode === 'ALL') {
            this.grantDraft.scope.condominiumIds = [];
        }
        this.accessService.saveGrant(this.selectedUser, this.grantDraft).subscribe({
            next: () => {
                this.isGrantDialogVisible = false;
                this.notify('success', 'Acceso actualizado');
                this.loadUsers();
            },
            error: (error) =>
                this.notify(
                    'error',
                    error?.error?.error?.message ??
                        error?.error?.message ??
                        'No se pudo actualizar el acceso'
                ),
        });
    }

    effectivePermissions(): string[] {
        const fromPolicies = this.policies
            .filter((policy) => (this.grantDraft.policyIds as string[]).includes(policy._id))
            .flatMap((policy) => policy.permissions);
        const denied = new Set(this.grantDraft.overrides.deny);
        return [...new Set([...fromPolicies, ...this.grantDraft.overrides.allow])]
            .filter((permission) => !denied.has(permission))
            .sort();
    }

    private loadAll(): void {
        this.accessService.getCatalog().pipe(delay(0)).subscribe({
            next: (response) => {
                this.permissionOptions = (unwrapApiMessage(response)?.permissions ?? []).map(
                    (permission) => ({
                        label: permission,
                        value: permission,
                    })
                );
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    error?.error?.message ??
                        'No se pudo cargar el catálogo de permisos'
                );
            },
        });
        this.accessService.getCondominiums().pipe(delay(0)).subscribe({
            next: (response) => {
                this.condominiums = unwrapApiMessage(response) ?? [];
                this.condominiumOptions = this.condominiums.map((condominium) => ({
                    label: condominium.alias,
                    value: condominium._id,
                }));
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.condominiums = [];
                this.condominiumOptions = [];
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    error?.error?.message ??
                        'No se pudieron cargar los condominios'
                );
            },
        });
        this.loadPolicies();
        this.loadUsers();
    }

    private loadPolicies(): void {
        this.accessService.getPolicies().pipe(delay(0)).subscribe({
            next: (response) => {
                this.policies = unwrapApiMessage(response) ?? [];
                this.policyOptions = this.policies
                    .filter((policy) => policy.status === 'active')
                    .map((policy) => ({
                        label: policy.name,
                        value: policy._id,
                    }));
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.policies = [];
                this.policyOptions = [];
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    error?.error?.message ??
                        'No se pudieron cargar las políticas'
                );
            },
        });
    }

    reloadUsers(): void {
        this.loadUsers();
    }

    private loadUsers(): void {
        this.accessService.getUsers().pipe(delay(0)).subscribe({
            next: (response) => {
                this.users = unwrapApiMessage(response) ?? [];
                this.changeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.users = [];
                this.changeDetectorRef.markForCheck();
                this.notify(
                    'error',
                    error?.error?.message ??
                        'No se pudieron cargar los usuarios administrativos'
                );
            },
        });
    }

    private emptyPolicy(): AccessPolicy {
        return {
            _id: '', name: '', description: '', permissions: [],
            isSystem: false, status: 'active',
        };
    }

    private emptyGrant(): AccessGrant {
        return {
            policyIds: [], overrides: { allow: [], deny: [] },
            scope: { mode: 'SELECTED', condominiumIds: [] },
        };
    }

    private notify(severity: 'success' | 'error', detail: string): void {
        this.messages.add({ severity, summary: severity === 'success' ? 'Completado' : 'Error', detail });
    }
}
