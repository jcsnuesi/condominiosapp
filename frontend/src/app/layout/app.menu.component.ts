import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    private cookieValue: any;
    constructor(
        public layoutService: LayoutService,
        private cookieService: CookieService
    ) {
        this.cookieValue = JSON.parse(this.cookieService.get('identity'));
    }

    checkRole(role: any) {
        if (this.cookieValue && Boolean(role !== undefined)) {
            if (Array.isArray(role)) {
                let roles = role.filter((r) => r === this.cookieValue.role);
                if (roles && roles.length > 0) {
                    return false;
                } else {
                    return true;
                }
            }

            if (role && this.cookieValue.role === role) {
                return false;
            } else {
                return true;
            }
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

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/start', this.cookieValue._id],
                    },
                ],
            },
            {
                label: 'User management',
                items: [
                    {
                        label: 'See all',
                        icon: 'pi pi-users',
                        routerLink: ['/usermanagement'],
                    },
                ],
                role: 'ADMIN',
            },
            {
                label: 'Customers',
                items: [
                    {
                        label: 'See all',
                        icon: 'pi pi-users',
                        routerLink: ['/customers'],
                    },
                    {
                        label: 'Register for company',
                        icon: 'pi pi-user-plus',
                        routerLink: ['/register'],
                    },
                    {
                        label: 'edit',
                        icon: 'pi pi-user-edit',
                        routerLink: ['/'],
                    },
                    {
                        label: 'delete',
                        icon: 'pi pi-user-minus',
                        routerLink: ['/'],
                    },
                ],
                role: 'ADMIN',
            },
            {
                label: 'Options',
                items: [
                    {
                        label: 'Properties',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/see-property'],
                    },
                    {
                        label: 'Family members',
                        icon: 'pi pi-users',
                        routerLink: ['/family-area', this.cookieValue._id],
                    },
                ],
                role: 'OWNER',
            },
            {
                label: 'Staffs',
                items: [
                    {
                        label: 'See Staff',
                        icon: 'pi pi-users',
                        routerLink: ['/staff-regular', this.cookieValue._id],
                    },
                ],
                role: ['ADMIN', 'OWNER'],
            },

            {
                label: 'Properties',
                items: [
                    {
                        label: 'Add property',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/create-property'],
                    },
                    {
                        label: 'See properties',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/see-property'],
                    },
                ],
                role: 'ADMIN',
            },
            {
                label: 'Partners',
                items: [
                    {
                        label: 'See Partners',
                        icon: 'pi pi-briefcase',
                        routerLink: ['/staff-regular', this.cookieValue._id],
                    },
                ],
                role: ['ADMIN'],
            },
            {
                label: 'Documents',
                items: [
                    {
                        label: 'Files',
                        icon: 'pi pi-file',
                        routerLink: ['/', this.cookieValue._id],
                    },
                ],
                role: ['ADMIN', 'OWNER'],
            },
        ];
    }
}
