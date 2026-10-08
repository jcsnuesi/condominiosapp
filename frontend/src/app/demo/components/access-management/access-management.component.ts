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
import { ActivatedRoute } from '@angular/router';
import { AccessContextService } from '../../service/access-context.service';

@Component({
    selector: 'app-access-management',
    standalone: true,
    imports: [CommonModule, FormsModule, ImportsModule],
    templateUrl: './access-management.component.html',
    styleUrl: './access-management.component.css',
    providers: [AccessManagementService, ConfirmationService, MessageService],
})
export class AccessManagementComponent implements OnInit {
    canManage = true;
    policies: AccessPolicy[] = [];
    users: AdministrativeUser[] = [];
    condominiums: Array<{ _id: string; alias: string }> = [];
    permissionOptions: Array<{ label: string; value: string }> = [];
    moduleOptions: Array<{ label: string; value: string }> = [];
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
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly route: ActivatedRoute,
        private readonly accessContext: AccessContextService
    ) {}

    ngOnInit(): void {
        this.accessService.organizationId = this.route.snapshot.paramMap.get('organizationId');
        this.canManage = !this.accessService.organizationId || this.accessContext.hasPermission('platform.access.manage');
        this.loadAll();
    }

    openNewPolicy(): void {
        if (!this.canManage) return;
        this.policyDraft = this.emptyPolicy();
        this.isPolicyDialogVisible = true;
    }

    editPolicy(policy: AccessPolicy): void {
        if (!this.canManage) return;
        if (policy.isSystem) return;
        this.policyDraft = { ...policy, permissions: [...policy.permissions], excludedModules: [...(policy.excludedModules ?? [])] };
        this.isPolicyDialogVisible = true;
    }

    savePolicy(): void {
        if (!this.canManage) return;
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
        if (!this.canManage) return;
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
        if (!this.canManage) return;
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
        if (!this.canManage) return;
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
            .filter((policy) => policy.status === 'active' && (this.grantDraft.policyIds as string[]).includes(policy._id))
            .flatMap((policy) => policy.permissions);
        const denied = new Set(this.grantDraft.overrides.deny);
        const excluded = this.policies
            .filter(policy => policy.status === 'active' && (this.grantDraft.policyIds as string[]).includes(policy._id))
            .flatMap(policy => policy.excludedModules ?? []);
        return [...new Set([...fromPolicies, ...this.grantDraft.overrides.allow])]
            .filter((permission) => !denied.has(permission) && !excluded.some(moduleName => permission.startsWith(`${moduleName}.`)))
            .sort();
    }

    moduleLabels(modules: string[]): string {
        return modules.map(value => this.moduleOptions.find(option => option.value === value)?.label ?? value).join(', ');
    }

    private loadAll(): void {
        this.accessService.getCatalog().pipe(delay(0)).subscribe({
            next: (response) => {
                const labels: Record<string, string> = {
                    dashboard: 'Panel de inicio', users: 'Usuarios', condominiums: 'Condominios', owners: 'Propietarios',
                    staff: 'Personal', bookings: 'Reservas', documents: 'Documentos', inquiries: 'Solicitudes',
                    str: 'Alquiler de corta duración', finance: 'Finanzas', communications: 'Comunicaciones',
                    iot: 'IoT / Smart Home', schedules: 'Programaciones', maintenance: 'Mantenimiento', vendors: 'Proveedores',
                    cameras: 'Cámaras', 'cameras.recordings': 'Grabaciones de cámaras', vehicles: 'Vehículos', gates: 'Control de acceso',
                };
                this.moduleOptions = Object.keys(unwrapApiMessage(response)?.modules ?? {}).map(value => ({ label: labels[value] ?? value, value }));
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
            _id: '', name: '', description: '', permissions: [], excludedModules: [],
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
