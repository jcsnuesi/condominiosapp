import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router"
import { CookieService } from "ngx-cookie-service";
import { UserService } from "./user.service";
import { AccessContextService } from './access-context.service';


@Injectable()
export class UserGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _cookies: CookieService,
        private _accessContext: AccessContextService,
      
    ){}
   

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const identity = this._userService.getIdentity();
        const token = this._userService.getToken();
        const payload = this.decodeToken(token);

        if (identity && identity._id && payload && !this.isExpired(payload) && this.hasRequiredRole(route, identity, payload) && this.hasRequiredPermission(route)) {
            if (this.isSuperuser(payload, identity) && !state.url.startsWith('/platform/organizations')) {
                this._router.navigate(['/platform/organizations']);
                return false;
            }
            return true; 
        }

        this.clearAuthState();
        this._router.navigate(['auth/login'], {
            queryParams: { returnUrl: state.url },
        });
        return false;
    }

    private decodeToken(token: string): any {
        if (!token) {
            return null;
        }

        const tokenParts = token.replace(/['"]+/g, '').split('.');
        if (tokenParts.length < 2) {
            return null;
        }

        try {
            const payload = this.padBase64(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/'));
            const decodedPayload = decodeURIComponent(
                atob(payload)
                    .split('')
                    .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(decodedPayload);
        } catch {
            return null;
        }
    }

    private isExpired(payload: any): boolean {
        if (!payload.exp) {
            return true;
        }

        return payload.exp <= Math.floor(Date.now() / 1000);
    }

    private padBase64(value: string): string {
        const padding = value.length % 4;
        return padding ? value + '='.repeat(4 - padding) : value;
    }

    private hasRequiredRole(route: ActivatedRouteSnapshot, identity: any, payload: any): boolean {
        const requiredRoles = this.getRequiredRoles(route);
        if (!requiredRoles.length) {
            return true;
        }

        const currentRole = (payload.role || identity.role || '').toString().toUpperCase();
        return requiredRoles.includes(currentRole);
    }

    private isSuperuser(payload: any, identity: any): boolean {
        return String(payload?.role || identity?.role || '').toUpperCase() === 'SUPERUSER';
    }

    private getRequiredRoles(route: ActivatedRouteSnapshot): string[] {
        const configuredRoles = route.data?.['roles'] || route.data?.['role'];
        if (!configuredRoles) {
            return [];
        }

        const roles = Array.isArray(configuredRoles) ? configuredRoles : [configuredRoles];
        return roles.map((role) => role.toString().toUpperCase());
    }

    private hasRequiredPermission(route: ActivatedRouteSnapshot): boolean {
        const permission = route.data?.['permission'];
        return !permission || this._accessContext.hasPermission(permission);
    }

    private clearAuthState(): void {
        this._cookies.delete('identity');
        this._cookies.delete('token');
        this._cookies.delete('identity', '/');
        this._cookies.delete('token', '/');
        this._accessContext.set(null);

    }
    
}
