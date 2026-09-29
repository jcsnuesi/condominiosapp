import {
    Component,
    ElementRef,
    ViewChild,
    DoCheck,
    OnInit,
    Input,
    SimpleChanges,
    OnChanges,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../demo/service/user.service';
import { User } from '../demo/models/user.model';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CondominioService } from '../demo/service/condominios.service';
import { ActivatedRoute } from '@angular/router';
import { FormatFunctions } from '../pipes/formating_text';
import { global } from '../demo/service/global.service';
import { Condominio } from '../demo/models/condominios.model';
import { FileUpload } from 'primeng/fileupload';
import { Stepper } from 'primeng/stepper';
import {
    InboxNotification,
    NotificationInboxService,
} from '../services/notification-inbox.service';
import { AuthenticatedProfile } from './authenticated-user-profile/authenticated-user-profile.component';

type Condo = {
    _id: string;
    alias: string;
    typeOfProperty: { label: string };
    phone: string;
    phone2: string;
    street_1: string;
    street_2: string;
    sector_name: string;
    city: string;
    province: string;
    country: string;
    status: boolean;
    socialAreas: Array<any>;
    avatar: string;
    mPayment: number;
    availableUnits: Array<any>;
    propertyUnitFormat: string;
    paymentDate?: any;
};

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./style.css'],
    providers: [MessageService, CondominioService, FormatFunctions],
    standalone: false
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('fileInput') fileInput!: FileUpload;
    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('dialogUpdateCondoComponent') dialogUpdateCondo!: Stepper;

    public currentProperty: any;
    public identity: User;
    public urlValidator: boolean;
    public url: string;
    public avatar: string = '';
    public image: string = '';
    public fullname: string = '';
    public role: string = '';
    public userData: { _id: string; email: string; token: string };
    public token: string = '';
    public needChangePassword: boolean;
    public notificationMenuVisible = false;
    public notifications: InboxNotification[] = [];
    public unreadNotificationCount = 0;
    public notificationsLoading = false;
    public notificationsError: string | null = null;
    public profileDialogVisible = false;
    private readonly notificationSubscriptions = new Subscription();

    constructor(
        public layoutService: LayoutService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _cookieService: CookieService,
        private _router: Router,
        private _condominioService: CondominioService,
        private _activatedRoute: ActivatedRoute,
        private _format: FormatFunctions,
        private readonly notificationInbox: NotificationInboxService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.needChangePassword = this.identity.first_password_changed;

        this.url = global.url;
        this.avatar = this.getAvatar(this.identity.role);
    }

    getAvatar(role: string): string {
        if (
            role === 'ADMIN' ||
            role === 'SUPER_ADMIN' ||
            role === 'STAFF_ADMIN'
        ) {
            return this.url + 'main-avatar/users/' + this.identity.avatar;
        } else if (role === 'OWNER') {
            return this.url + 'main-avatar/owners/' + this.identity.avatar;
        } else {
            return this.url + 'main-avatar/family/' + this.identity.avatar;
        }
    }

    ngOnInit(): void {
        this.role = this.identity.role;
        this.fullname = this._format.fullNameFormat(this.identity);
        this.notificationSubscriptions.add(
            this.notificationInbox.notifications$.subscribe(
                (notifications) => (this.notifications = notifications)
            )
        );
        this.notificationSubscriptions.add(
            this.notificationInbox.unreadCount$.subscribe(
                (count) => (this.unreadNotificationCount = count)
            )
        );
        this.notificationSubscriptions.add(
            this.notificationInbox.loading$.subscribe(
                (loading) => (this.notificationsLoading = loading)
            )
        );
        this.notificationSubscriptions.add(
            this.notificationInbox.error$.subscribe(
                (error) => (this.notificationsError = error)
            )
        );
        this.notificationInbox.connect();
        this.notificationInbox.refresh();
    }

    ngOnDestroy(): void {
        this.notificationSubscriptions.unsubscribe();
    }

    toggleNotificationMenu(): void {
        this.notificationMenuVisible = !this.notificationMenuVisible;
        if (this.notificationMenuVisible) this.notificationInbox.refresh();
    }

    openNotifications(): void {
        this.notificationMenuVisible = false;
        this._router.navigate(['communication-log']);
    }

    openNotification(notification: InboxNotification): void {
        this.notificationMenuVisible = false;
        const condominiumId =
            typeof notification.condominiumId === 'string'
                ? notification.condominiumId
                : notification.condominiumId._id;
        this._router.navigate(['communication-log'], {
            queryParams: { notificationId: notification._id, condominiumId },
        });
    }

    openProfileSettings() {
        this.layoutService.hideProfileSidebar();
        this.profileDialogVisible = true;
    }

    handleProfileUpdated(profile: AuthenticatedProfile): void {
        this.identity = { ...this.identity, ...profile };
        this.fullname = `${profile.name} ${profile.lastname}`.trim();
        this.avatar = this.getAvatar(profile.role);
    }

    destroySession() {
        this.layoutService.hideProfileSidebar();
        this.notificationInbox.disconnect();
        this._cookieService.deleteAll();
        this._router.navigate(['auth/login']);
    }
}
