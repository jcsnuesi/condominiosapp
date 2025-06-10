import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    AfterViewInit,
    viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OwnerModel } from '../../models/owner.model';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { ImportsModule } from '../../imports_primeng';
import { OwnerServiceService } from '../../service/owner-service.service';
import { global } from '../../service/global.service';

type MessageType = {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
    closeIcon?: string;
};

@Component({
    selector: 'app-owner-registration',
    standalone: true,
    imports: [ImportsModule, FormsModule],
    providers: [
        CondominioService,
        UserService,
        MessageService,
        ConfirmationService,
        FormatFunctions,
    ],
    templateUrl: './owner-registration.component.html',
    styleUrl: './owner-registration.component.css',
})
export class OwnerRegistrationComponent implements OnInit {
    public ownerObj: OwnerModel;
    public image: any;
    private token: string;
    private identity: any;
    public apiUnitResponse!: boolean;
    public messageApiResponse: MessageType[] | undefined;

    public genderOption: any;
    public parkingOptions: any;
    public property_typeOptions: any[] = [];
    public indexStepper: number = 0;
    public condoOptions: any[] = [];
    public unitOptions: any[] = [];

    public addreesDetails: {
        street_1: string;
        street_2: string;
        sector_name: string;
        city: string;
        province: string;
        country: string;
    } = {
        street_1: '',
        street_2: '',
        sector_name: '',
        city: '',
        province: '',
        country: '',
    };
    @ViewChild('unitFormUno') basicInfo: NgForm;
    @ViewChild('unitFormDos') propertyInfo: NgForm;
    public items: any;
    public homeId: string;

    public isRentOptions: { label: string; code: string }[] = [
        { label: 'Yes', code: 'yes' },
        { label: 'No', code: 'no' },
    ];
    public propertiesOptions: { label: string; code: string }[] = [
        { label: '', code: '' },
    ];
    public url: string = global.url;

    constructor(
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _formatFunctions: FormatFunctions,
        private _ownerService: OwnerServiceService
    ) {
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();

        this.ownerObj = new OwnerModel(
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        );

        this.messageApiResponse = [
            {
                detail: '',
                severity: '',
            },
        ];

        this.image = '../../assets/noimage.jpeg';
        this.apiUnitResponse = false;

        this.genderOption = [
            { label: 'Male', code: 'male' },
            { label: 'Female', code: 'female' },
        ];

        this.items = [
            {
                label: 'Personal Info',
            },
            {
                label: 'Reservation',
            },
            {
                label: 'Review',
            },
        ];
    }

    /**
     * Este componente se encarga de registrar un nuevo owner.
     *
     *
     * Quienes pueden crear un nuevo owner:
     * 1. El rol admin
     *
     *
     *
     */
    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params) => {
            this.homeId = params['homeid'];

            if (params['homeid'] !== undefined) {
                this.OnLoad(this.homeId);
            } else {
                this.getPropertiesByAdminId();
            }
        });
    }

    OnLoad(param: string) {
        this._condominioService.getBuilding(param, this.token).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.status == 'success') {
                    console.log(
                        'response.condominium.availableUnits',
                        response.condominium.availableUnits
                    );
                    this.unitOptions = response.condominium.availableUnits.map(
                        (units) => {
                            return {
                                label: units,
                                code: units,
                            };
                        }
                    );
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
    onPropertiesChange(event: any) {
        let propertyId = event.value.code;
        this.OnLoad(propertyId);
    }

    public searchUserValue: string = '';
    searchExistingUser() {
        this._ownerService
            .getOwnerByIdOrEmail(this.token, this.searchUserValue)
            .subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        this.ownerObj = response.message;
                        let gender = {
                            label: this._formatFunctions.titleCase(
                                this.ownerObj.gender
                            ),
                            code: 'female',
                        };

                        this.ownerObj.gender = gender;
                        this.image =
                            this.url + 'owner-avatar/' + this.ownerObj.avatar;
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se ha encontrado el usuario',
                        });
                    }
                    console.log('searchExistingUser', this.ownerObj);
                },
                error: (error) => {
                    console.log(error);
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al buscar el usuario',
                    });
                },
            });
    }

    reviewOwnerCard(event: any) {
        let property = JSON.parse(localStorage.getItem('property'));
        this.ownerObj.propertyType = property.typeOfProperty.toUpperCase();
        // Address Details - Card
        this.ownerObj.addressId = this._formatFunctions.titleCase(property._id);
        this.addreesDetails.street_1 = this._formatFunctions.titleCase(
            property.street_1
        );
        this.addreesDetails.street_2 = this._formatFunctions.titleCase(
            property.street_2
        );
        this.addreesDetails.sector_name = this._formatFunctions.titleCase(
            property.sector_name
        );
        this.addreesDetails.city = this._formatFunctions.titleCase(
            property.city
        );
        this.addreesDetails.province = this._formatFunctions.titleCase(
            property.province
        );
        this.addreesDetails.country = this._formatFunctions.titleCase(
            property.country
        );
        event.emit();
    }

    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.ownerObj.avatar = file.files[0];
    }

    confirmNewOwner(event: Event) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.onSubmitUnit();
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    onStepChange(event: number) {
        this.indexStepper = event;
    }

    resetStepper() {
        this.indexStepper = 0;
        this.apiUnitResponse = false;
    }

    getPropertiesByAdminId() {
        this._condominioService.getPropertyByAdminId(this.token).subscribe({
            next: (response) => {
                console.log('getPropertiesByAdminId', response);
                if (response.status == 'success') {
                    this.propertiesOptions = response.message.map(
                        (item: any) => {
                            return {
                                label: item.alias,
                                code: item._id,
                            };
                        }
                    );
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se han encontrado condominios',
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los condominios',
                });
            },
        });
    }
    /**
     * Metodo para crear propiedad:
     * Principal: Definir si vamos a crear un family member o una unidad
     * 1.Tomamos el id del owner
     * 2.Tomamos el id del condominio
     * 3. Seleccionamos el condominio al que pertenece el owner
     * 4. Si vamos agregar una nueva unidad, actualizamos el owner para que se registre la nueva unidad
     * 5. Solo el rol owner puede registrar una nueva unidad
     */
    onSubmitUnit() {
        const formData = new FormData();

        for (const key in this.ownerObj) {
            if (
                typeof this.ownerObj[key] === 'object' &&
                Boolean(this.ownerObj[key].code != undefined)
            ) {
                formData.append(key, this.ownerObj[key].code);
            } else if (key === 'avatar') {
                formData.append(
                    key,
                    Boolean(this.ownerObj.avatar != undefined)
                        ? this.ownerObj.avatar
                        : 'noimage.jpeg'
                );
            } else {
                formData.append(key, this.ownerObj[key]);
            }
        }
        this._condominioService.createOwner(this.token, formData).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.ownerObj = new OwnerModel(
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        ''
                    );
                    this.ownerObj.avatar = '../../assets/noimage2.jpeg';
                    this.messageApiResponse.forEach((item) => {
                        item.detail = response.message;
                        item.severity = 'success';
                    });
                    this.OnLoad(this.homeId);
                    this.indexStepper = 0;
                    this.image = '../../assets/noimage.jpeg';
                } else {
                    this.messageApiResponse.forEach((item) => {
                        item.detail = response.message;
                        item.severity = 'danger';
                    });
                }
                this.apiUnitResponse = true;
            },
            error: (error) => {
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Message for server',
                    detail: 'Unit was not Created',
                    life: 3000,
                });
                console.log(error);
            },
            complete: () => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Unit Created',
                    life: 3000,
                });
            },
        });
    }

    reset(form: NgForm) {
        form.reset();
    }

    alertStatus(form: NgForm) {
        if (this.apiUnitResponse) {
            this.ownerObj = new OwnerModel(
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            );
            this.ownerObj.avatar = '../../assets/noimage2.jpeg';

            this.apiUnitResponse = false;
        } else {
            this.apiUnitResponse = true;
        }

        form.reset();
    }
}
