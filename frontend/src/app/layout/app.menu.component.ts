import { Component, computed } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { CookieService } from 'ngx-cookie-service';
import { AccessContextService } from '../demo/service/access-context.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: false,
})
export class AppMenuComponent {
    readonly model = computed(() => this.buildMenu());
    private cookieValue: any;
    constructor(
        public layoutService: LayoutService,
        private cookieService: CookieService,
        private accessContext: AccessContextService
    ) {
        this.cookieValue = this.getIdentityFromCookie();
    }

    private getIdentityFromCookie(): any {
        const identityCookie = this.cookieService.get('identity');

        if (!identityCookie) {
            return null;
        }

        try {
            return JSON.parse(identityCookie);
        } catch {
            return null;
        }
    }

    checkRole(role: String[]) {
        if (this.cookieValue && role.length > 0) {
            if (Array.isArray(role)) {
                let roles = role.filter(
                    (r) =>
                        r.toLowerCase() === this.cookieValue.role.toLowerCase()
                );
                if (roles && roles.length > 0) {
                    return true;
                }
            }

            return false;
        } else {
            return false;
        }
    }

    checkSeparator(role: string) {
        if (this.cookieValue && Boolean(role !== undefined)) {
            if (this.cookieValue.role.includes(role)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    hasPermission(permission: string): boolean {
        return this.accessContext.hasPermission(permission);
    }

    hasAnyPermission(...permissions: string[]): boolean {
        return permissions.some((permission) => this.hasPermission(permission));
    }

    private buildMenu() {
        if (this.accessContext.access()?.isPlatform) {
            const links = [
                { label: 'KPIs del SaaS', icon: 'pi pi-chart-bar', routerLink: ['/platform/kpis'], permission: 'platform.kpis.read' },
                { label: 'Cuentas y membresías', icon: 'pi pi-building', routerLink: ['/platform/accounts'], permission: 'platform.accounts.read' },
                { label: 'Supervisores', icon: 'pi pi-users', routerLink: ['/platform/supervisors'], permission: 'platform.supervisors.read' },
                { label: 'Políticas de supervisión', icon: 'pi pi-shield', routerLink: ['/platform/policies'], permission: 'platform.policies.read' },
                { label: 'Planes', icon: 'pi pi-list', routerLink: ['/platform/plans'], permission: 'platform.memberships.read' },
                { label: 'Auditoría', icon: 'pi pi-history', routerLink: ['/platform/audit'], permission: 'platform.audit.read' },
                { label: 'Migración a gratis', icon: 'pi pi-check-square', routerLink: ['/platform/migrations'], permission: 'platform.memberships.manage' },
                { label: 'Facturación SaaS', icon: 'pi pi-credit-card', routerLink: ['/platform/billing'], permission: 'platform.billing.read' },
                { label: 'Soporte', icon: 'pi pi-comments', routerLink: ['/platform/support'], permission: 'platform.support.read' },
                { label: 'Avisos', icon: 'pi pi-megaphone', routerLink: ['/platform/communications'], permission: 'platform.communications.read' },
                { label: 'Operación técnica', icon: 'pi pi-heart', routerLink: ['/platform/health'], permission: 'platform.operations.read' },
                { label: 'Configuración', icon: 'pi pi-cog', routerLink: ['/platform/configuration'], permission: 'platform.operations.read' },
                { label: 'Ciclo de datos', icon: 'pi pi-database', routerLink: ['/platform/lifecycle'], permission: 'platform.data.read' },
            ];
            return [{ label: 'Administración SaaS', items: [...links.filter(item => this.hasPermission(item.permission)), { label: 'Seguridad', icon: 'pi pi-lock', routerLink: ['/platform/security'] }], visible: true }];
        }
        const identityId = this.cookieValue?._id;
        const isOwner = this.checkRole(['OWNER']);
        const isOrganizationOwner =
            isOwner &&
            Boolean(
                this.accessContext.access()?.organization ||
                    this.cookieValue?.organizationId
            );
        const canSeePaymentMonitor = isOwner
            ? !isOrganizationOwner
            : this.hasPermission('finance.read');

        const sections = [
            { label: 'Comunard', items: [{ label: 'Mi suscripción', icon: 'pi pi-credit-card', routerLink: ['/subscription'] }], visible: this.accessContext.isOwnerAdmin() || (isOwner && !isOrganizationOwner) },
            {
                label: 'Maintenance',
                items: [
                    {
                        label: 'Maintenance',
                        icon: 'pi pi-calendar-clock',
                        routerLink: ['/schedule'],
                    },
                ],
                visible: this.hasPermission('schedules.read'),
            },
            {
                label: 'Setup',
                items: [
                    {
                        label: 'Getting started',
                        icon: 'pi pi-list',
                        routerLink: ['/onboarding'],
                    },
                ],
                visible:
                    this.accessContext.isOwnerAdmin() &&
                    this.accessContext.access()?.onboardingRequired === true,
            },
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/start', identityId],
                        visible: this.hasPermission('dashboard.read'),
                    },
                ],
                visible: this.hasPermission('dashboard.read'),
            },
            {
                label: 'Access management',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        routerLink: ['/usermanagement'],
                    },
                    {
                        label: 'Staffs',
                        icon: 'pi pi-user',
                        routerLink: ['/staff', identityId],
                        visible: this.hasPermission('staff.read'),
                    },
                ],
                visible: this.hasPermission('users.read'),
            },

            {
                label: 'Bookings',
                items: [
                    {
                        label: 'Bookings',
                        icon: 'pi pi-address-book',
                        routerLink: ['/bookings', identityId],
                        visible: this.hasPermission('bookings.read'),
                    },
                ],
                visible: this.hasPermission('bookings.read'),
            },

            {
                label: 'Smart Home',
                items: [
                    {
                        label: 'Devices',
                        icon: 'pi pi-bolt',
                        routerLink: ['/smart-home'],
                          visible: this.hasPermission('iot.read'),
                      },
                      {
                          label: 'Cámaras',
                          icon: 'pi pi-video',
                          routerLink: ['/cameras'],
                          visible: this.hasPermission('cameras.read'),
                      },
                  ],
                  visible: this.hasAnyPermission('iot.read', 'cameras.read'),
            },
            {
                label: 'Properties',
                items: [
                    {
                        label: 'Create property',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/create-property'],
                        visible: this.hasPermission('condominiums.create'),
                    },
                    {
                        label: 'Properties',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/see-property'],
                        visible: this.hasPermission('condominiums.read'),
                    },
                    {
                        label: 'Family members',
                        icon: 'pi pi-users',
                        routerLink: ['/family-area', identityId],
                        visible: this.checkRole(['OWNER']),
                    },
                ],
                visible: this.hasAnyPermission(
                    'condominiums.read',
                    'condominiums.create'
                ),
            },
            {
                label: 'Customer 360',
                items: [
                    {
                        label: 'Partners',
                        icon: 'pi pi-briefcase',
                        routerLink: ['/all-partners'],
                        visible: this.hasPermission('owners.read'),
                    },
                ],
                visible: this.hasPermission('owners.read'),
            },

            {
                label: 'Docs',
                items: [
                    {
                        label: 'Documents',
                        icon: 'pi pi-folder',
                        routerLink: ['/docs', identityId],
                        visible: this.hasPermission('documents.read'),
                    },
                ],
                visible: this.hasPermission('documents.read'),
            },
            {
                label: 'Short-term Rental',
                items: [
                    {
                        label: 'iCal channels',
                        icon: 'pi pi-calendar',
                        routerLink: ['/str-integration'],
                        visible: this.hasPermission('str.read'),
                    },
                ],
                visible: this.hasPermission('str.read'),
            },
            {
                label: 'Finance',
                items: [
                    {
                        label: 'Financial Management',
                        icon: 'pi pi-chart-bar',
                        routerLink: ['/finance'],
                        visible: this.hasPermission('finance.read'),
                    },
                    {
                        label: 'Payment Monitor',
                        icon: 'pi pi-wallet',
                        routerLink: ['/payment-monitor'],
                        visible: canSeePaymentMonitor,
                    },
                ],
                visible:
                    canSeePaymentMonitor || this.hasPermission('finance.read'),
            },
            {
                label: 'Communications',
                items: [
                    {
                        label: 'Communication History',
                        icon: 'pi pi-comments',
                        routerLink: ['/communication-log'],
                        visible: this.hasPermission('communications.read'),
                    },
                ],
                visible: this.hasPermission('communications.read'),
            },
        ];

        const navigationGroups = [
            { label: 'Setup', sections: ['Setup'] },
            {
                label: 'Overview',
                sections: ['Home', 'Properties', 'Access management'],
            },
            {
                label: 'Operations',
                sections: ['Maintenance', 'Bookings', 'Smart Home'],
            },
            {
                label: 'Management',
                sections: [
                    'Customer 360',
                    'Docs',
                    'Short-term Rental',
                    'Finance',
                    'Communications',
                ],
            },
        ];

        return navigationGroups.map((group) => {
            const items = group.sections.flatMap((label) => {
                const section = sections.find(
                    (section) => section.label === label
                );
                if (!section?.visible) return [];
                return section.items.filter((item) => item.visible !== false);
            });
            return { label: group.label, items, visible: items.length > 0 };
        });
    }
}
