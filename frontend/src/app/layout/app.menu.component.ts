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
