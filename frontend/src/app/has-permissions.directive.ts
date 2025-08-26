import { Directive, Input } from '@angular/core';
import { UserService } from './demo/service/user.service';
import { StaffService } from './demo/service/staff.service';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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
        private cookieService: CookieService
    ) {
        this.identity = JSON.parse(this.cookieService.get('identity'));
        this.permissions = [];
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
            // TODO: USER ROLE

            const permissionsFound = this.permissions.some(
                (perm) =>
                    perm.toLowerCase() === this.identity.role.toLowerCase()
            );

            if (permissionsFound) {
                has_perms = true;
            }
        }
        return has_perms;
    }
}
