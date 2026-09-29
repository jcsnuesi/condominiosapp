import { Directive, Input } from '@angular/core';
import { UserService } from './demo/service/user.service';
import { StaffService } from './demo/service/staff.service';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccessContextService } from './demo/service/access-context.service';

@Directive({
    selector: '[appHasPermissions]',
    standalone: true,
    providers: [UserService, StaffService, CookieService],
})
export class HasPermissionsDirective {
    public identity: any;
    public permissions: string[];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private cookieService: CookieService,
        private accessContext: AccessContextService
    ) {
        this.identity = this.getIdentityFromCookie();
        this.permissions = [];
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

    @Input()
    set appHasPermissions(permissionsUser: string[]) {
        this.permissions = permissionsUser;

        this.UpdateView();
    }

    private UpdateView() {
        this.viewContainer.clear();
        if (this.checkRole()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

    private checkRole(): boolean {
        let has_perms = false;

        if (
            this.identity &&
            this.identity.role &&
            this.permissions.length > 0
        ) {
            const permissionsFound = this.permissions.some(
                (permissionOrRole) =>
                    permissionOrRole.includes('.')
                        ? this.accessContext.hasPermission(permissionOrRole)
                        : permissionOrRole.toLowerCase() ===
                          this.identity.role.toLowerCase()
            );

            if (permissionsFound) {
                has_perms = true;
            }
        }
        return has_perms;
    }
}
