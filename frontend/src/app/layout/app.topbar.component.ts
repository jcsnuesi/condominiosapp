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
} from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../demo/service/user.service';
import { User } from '../demo/models/user.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CondominioService } from '../demo/service/condominios.service';
import { ActivatedRoute } from '@angular/router';
import { FormatFunctions } from '../pipes/formating_text';
import { global } from '../demo/service/global.service';
import { Condominio } from '../demo/models/condominios.model';
import { FileUpload } from 'primeng/fileupload';
import { NgForm } from '@angular/forms';
import { Stepper } from 'primeng/stepper';

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
})
export class AppTopBarComponent implements OnInit {
    items: MenuItem[] | undefined;

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

    constructor(
        public layoutService: LayoutService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _cookieService: CookieService,
        private _router: Router,
        private _condominioService: CondominioService,
        private _activatedRoute: ActivatedRoute,
        private _format: FormatFunctions
    ) {
        this.identity = this._userService.getIdentity();
        let avatarPath = this.identity.role == 'ADMIN' ? 'users' : 'owners';

        this.url = global.url;
        this.avatar =
            this.url + 'main-avatar/' + avatarPath + '/' + this.identity.avatar;
    }

    ngOnInit(): void {
        this.role = this.identity.role;
        this.fullname = this._format.fullNameFormat(this.identity);

        this.items = [
            {
                label: 'Profile',
                items: [
                    {
                        label: 'setting',
                        icon: 'pi pi-cog',
                        command: () => {
                            console.log('Settings clicked');
                        },
                    },
                ],
            },
            {
                label: 'Loggout',
                items: [
                    {
                        label: 'Exit',
                        icon: 'pi pi-power-off',
                        command: () => {
                            this.destroySession();
                        },
                    },
                ],
            },
        ];
    }

    destroySession() {
        this._cookieService.deleteAll();
        this._router.navigate(['auth/login']);
    }
}
