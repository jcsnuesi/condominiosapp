import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { global } from '../demo/service/global.service';

export interface InboxNotification {
    _id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    publishedAt: string;
    condominiumId: { _id: string; name?: string; alias?: string } | string;
    readBy: Array<{ userId: string }>;
    source?: 'schedule';
    taskId?: string;
}

interface InboxResponse {
    data?: { notifications?: InboxNotification[]; unreadCount?: number };
}

@Injectable({ providedIn: 'root' })
export class NotificationInboxService {
    private readonly notificationsSubject = new BehaviorSubject<
        InboxNotification[]
    >([]);
    private readonly unreadCountSubject = new BehaviorSubject<number>(0);
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    private readonly errorSubject = new BehaviorSubject<string | null>(null);
    private socket: Socket | null = null;
    private refreshSubscription: Subscription | null = null;
    private refreshTimer: ReturnType<typeof setInterval> | null = null;

    readonly notifications$ = this.notificationsSubject.asObservable();
    readonly unreadCount$ = this.unreadCountSubject.asObservable();
    readonly loading$ = this.loadingSubject.asObservable();
    readonly error$ = this.errorSubject.asObservable();

    constructor(
        private readonly http: HttpClient,
        private readonly cookies: CookieService
    ) {}

    connect(): void {
        const token = this.cookies.get('token');
        if (!token || this.socket) return;

        if (!this.refreshTimer) this.refreshTimer = setInterval(() => this.refresh(), 60000);

        this.socket = io(this.socketUrl(), {
            auth: { token },
        });
        this.socket.on('notifications:changed', () => this.refresh());
        this.socket.on('connect_error', () => {
            if (this.socket) {
                this.errorSubject.next(
                    'No se pudo conectar a las actualizaciones en tiempo real.'
                );
            }
        });
    }

    refresh(): void {
        if (!this.cookies.get('token')) { this.disconnect(); return; }
        if (this.refreshSubscription) return;

        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        this.refreshSubscription = this.http
            .get<InboxResponse>(`${global.url}notifications/inbox?limit=8`)
            .subscribe({
                next: (response) => {
                    const data = response?.data ?? {};
                    this.notificationsSubject.next(data.notifications ?? []);
                    this.unreadCountSubject.next(data.unreadCount ?? 0);
                    this.loadingSubject.next(false);
                    this.refreshSubscription = null;
                },
                error: () => {
                    this.errorSubject.next('No se pudieron cargar los avisos.');
                    this.loadingSubject.next(false);
                    this.refreshSubscription = null;
                },
            });
    }

    disconnect(): void {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
        this.refreshTimer = null;
        this.refreshSubscription?.unsubscribe();
        this.refreshSubscription = null;
        this.socket?.disconnect();
        this.socket = null;
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
    }

    markScheduleRead(id: string): void {
        this.http.post(`${global.url}schedules/notices/${id}/read`, {}).subscribe({
            next: () => this.refresh(),
            error: () => this.errorSubject.next('No se pudo marcar el aviso como leído.'),
        });
    }

    private socketUrl(): string {
        // Keep Socket.IO on the application origin so Nginx can proxy the
        // upgrade through /socket.io/ instead of exposing the backend port.
        return window.location.origin;
    }

}
