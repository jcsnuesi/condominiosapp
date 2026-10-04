import { CookieService } from 'ngx-cookie-service';

export class CheckPermissionsService {
    constructor(private _cookieService: CookieService) {}

    public hasPermission(permission: string): boolean {
        const userPermissions = this._cookieService.get('permissions');
        return userPermissions.includes(permission);
    }
}
