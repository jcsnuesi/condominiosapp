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
export class AppTopBarComponent implements OnInit, OnChanges {
    items: MenuItem[] | undefined;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('fileInput') fileInput!: FileUpload;
    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('dialogUpdateCondoComponent') dialogUpdateCondo!: Stepper;

    @Output() updateCondoInfo = new EventEmitter<any>();
    @Input() currentCondoInfo: Condo;
    public currentCondo: Condo;

    public currentProperty: any;
    public identity: User;
    public condominio_info: any;
    public propertyInfo: any;
    public urlValidator: boolean;
    public url: string;
    dataCondo: any;
    public avatar: string = '';
    public visible_settings: boolean = false;
    public image: string = '';
    public numberingType: string = 'numeric';
    public numberingOptions = [
        { label: 'Números (1, 2, 3...)', value: 'numeric' },
        { label: 'Números con ceros (001, 002, 003...)', value: 'padded' },
        { label: 'Letras (A, B, C...)', value: 'letters' },
    ];
    public startUnit: number = 1;
    public endUnit: number = 1;
    public totalUnits: number = 1;
    public fromLetter: string = 'A';
    public toLetter: string = 'Z';
    public condoType: { label: string }[];
    public areas: { areasOptions: string }[];
    public today: Date = new Date();
    public indexStepper: number = 0;

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

        this.currentCondo = {
            _id: '',
            alias: '',
            typeOfProperty: { label: '' },
            phone: '',
            phone2: '',
            street_1: '',
            street_2: '',
            sector_name: '',
            city: '',
            province: '',
            socialAreas: [],
            mPayment: 0,
            paymentDate: '',
            propertyUnitFormat: '',
            avatar: '',
            status: false,
            availableUnits: [],
            country: '',
        };

        this.condoType = [
            { label: 'House' },
            { label: 'Tower' },
            { label: 'Apartments' },
        ];

        this.areas = [
            { areasOptions: 'Pool' },
            { areasOptions: 'Gym' },
            { areasOptions: 'Park' },
            { areasOptions: 'Playground' },
            { areasOptions: 'Guest parking' },
        ];

        this.image = this.currentCondo?.avatar
            ? this.currentCondo.avatar
            : '../../assets/noimage.jpeg';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['currentCondoInfo'] &&
            changes['currentCondoInfo'].currentValue
        ) {
            this.currentCondo = {
                _id: changes['currentCondoInfo'].currentValue._id || '',
                alias: changes['currentCondoInfo'].currentValue.alias || '',
                typeOfProperty: changes['currentCondoInfo'].currentValue
                    .typeOfProperty || { label: '' },
                phone: changes['currentCondoInfo'].currentValue.phone || '',
                phone2: changes['currentCondoInfo'].currentValue.phone2 || '',
                street_1:
                    changes['currentCondoInfo'].currentValue.street_1 || '',
                street_2:
                    changes['currentCondoInfo'].currentValue.street_2 || '',
                sector_name:
                    changes['currentCondoInfo'].currentValue.sector_name || '',
                city: changes['currentCondoInfo'].currentValue.city || '',
                province:
                    changes['currentCondoInfo'].currentValue.province || '',
                socialAreas:
                    changes['currentCondoInfo'].currentValue.socialAreas.map(
                        (areas) => {
                            return areas;
                        }
                    ) ?? [],

                mPayment:
                    changes['currentCondoInfo'].currentValue.mPayment || 0,
                paymentDate:
                    changes['currentCondoInfo'].currentValue.paymentDate,
                propertyUnitFormat:
                    changes['currentCondoInfo'].currentValue
                        .propertyUnitFormat || '',
                avatar: changes['currentCondoInfo'].currentValue.avatar || '',
                status:
                    changes['currentCondoInfo'].currentValue.status || false,
                availableUnits:
                    changes['currentCondoInfo'].currentValue.availableUnits ||
                    [],
                country: changes['currentCondoInfo'].currentValue.country || '',
            };
        }
    }

    public fullname: string = '';
    public role: string = '';
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
                            this.update();
                        },
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-times',
                        command: () => {
                            this.delete();
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
                    {
                        label: 'Router',
                        icon: 'pi pi-upload',
                        routerLink: '/fileupload',
                    },
                ],
            },
        ];
    }

    onSelect(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.currentCondo.avatar = file.files[0];
    }

    openSettings() {
        this.visible_settings = true;
    }

    triggerFileUpload() {
        // Accedemos al componente y simulamos el clic
        this.fileInput.basicFileInput.nativeElement.click();
    }

    onStepChange(event: any) {
        this.indexStepper = event;
        console.log('resetStepper', this.indexStepper);
    }

    resetStepper() {
        this.indexStepper = 0;
        this.visible_settings = false;
    }

    updateCondo(condominiumForm: NgForm) {
        const formData = new FormData();

        for (const key in this.currentCondo) {
            if (
                this.currentCondo[key] !== undefined &&
                this.currentCondo[key] !== null
            ) {
                if (key === 'typeOfProperty') {
                    formData.append(key, this.currentCondo[key].label);
                } else if (key === 'socialAreas') {
                    let areas = this.currentCondo[key]
                        .map((area) => area.areasOptions)
                        .join(',');
                    formData.append(key, areas);
                } else {
                    formData.append(key, this.currentCondo[key]);
                }
            }
        }

        this._condominioService
            .updateCondominium(this._cookieService.get('token'), formData)
            .subscribe({
                next: (res) => {
                    console.log('res', res);
                    if (res.status === 'success') {
                        this.resetStepper();
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Data Updated',
                        });
                        this.updateCondoInfo.emit({
                            data: 'topbar-updated',
                        });
                    }
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error updating data',
                    });
                    console.log('err', err);
                },
            });
    }
    update() {
        this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data Updated',
        });
    }

    delete() {
        this._messageService.add({
            severity: 'warn',
            summary: 'Delete',
            detail: 'Data Deleted',
        });
    }

    destroySession() {
        this._cookieService.deleteAll();
        this._router.navigate(['auth/login']);
    }
}
