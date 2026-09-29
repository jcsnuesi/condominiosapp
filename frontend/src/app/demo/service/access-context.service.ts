import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { AccessContext } from '../models/access.model';
import { global } from './global.service';

interface AccessMessage {
    user: Record<string, unknown>;
    access: AccessContext;
}

interface MeResponse {
    // Interceptor-normalized legacy response.
    message?: AccessMessage;
    // Current API envelope plus legacy nesting retained during migration.
    data?: Partial<AccessMessage> & { message?: AccessMessage };
}

@Injectable({ providedIn: 'root' })
export class AccessContextService {
    private readonly accessState = signal<AccessContext | null>(
        this.readCachedAccess()
    );
    readonly access = this.accessState.asReadonly();
    readonly permissions = computed(
        () => new Set(this.accessState()?.permissions ?? [])
    );
    readonly isOwnerAdmin = computed(
        () => this.accessState()?.isOwnerAdmin ?? false
    );

    constructor(
        private readonly http: HttpClient,
        private readonly cookies: CookieService
    ) {}

    refresh(): Observable<MeResponse> {
        return this.http.get<MeResponse>(`${global.url}auth/me`).pipe(
            tap((response) => {
                const access =
                    response.data?.access ??
                    response.message?.access ??
                    response.data?.message?.access;
                this.set(access ?? null);
            })
        );
    }

    set(access: AccessContext | null): void {
        this.accessState.set(access);
        if (access) {
            this.cookies.set('access_context', JSON.stringify(access));
        } else {
            this.cookies.delete('access_context', '/');
            this.cookies.delete('access_context');
        }
    }

    hasPermission(permission: string): boolean {
        return this.permissions().has(permission.toLowerCase());
    }

    canAccessCondominium(condominiumId: string): boolean {
        const scope = this.accessState()?.scope;
        return Boolean(
            scope &&
                (scope.mode === 'ALL' ||
                    scope.condominiumIds.includes(condominiumId))
        );
    }

    private readCachedAccess(): AccessContext | null {
        const value = this.cookies.get('access_context');
        if (!value) return null;
        try {
            return JSON.parse(value) as AccessContext;
        } catch {
            return null;
        }
    }
}
