import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    AfterViewInit,
    Input,
    SimpleChanges,
    OnChanges,
    Output,
    EventEmitter,
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
import { Stepper, StepperPanel } from 'primeng/stepper';

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
        ConfirmationService,
        FormatFunctions,
    ],
    templateUrl: './owner-registration.component.html',
    styleUrl: './owner-registration.component.css',
})
export class OwnerRegistrationComponent implements OnInit, OnChanges {
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
        typeOfProperty: string;
        street_1: string;
        street_2: string;
        sector_name: string;
        city: string;
        province: string;
        country: string;
    } = {
        typeOfProperty: '',
        street_1: '',
        street_2: '',
        sector_name: '',
        city: '',
        province: '',
        country: '',
    };
    @ViewChild('stepperComponent') stepperComponent: Stepper;
    // @ViewChild('unitFormDos') propertyInfo: NgForm;
    public items: any;
    public homeId: string;
    @Input('ownerData') ownerData: any;
    @Output() ownerCreated = new EventEmitter<boolean>();

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
        // this.showBackBtn = true;
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

        this.image = this.url + 'main-avatar/owners/noimage.jpeg';
        this.apiUnitResponse = false;

        this.genderOption = [{ label: 'Male' }, { label: 'Female' }];

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

    // public showBackBtn: boolean;

    // ngAfterViewInit(): void {
    //     // console.log('this.ownerObj', this.ownerObj);
    //     if (this.ownerObj.email != '' && this.ownerObj.id_number != '') {
    //         this.stepperComponent.activeStep = 1;
    //         this.showBackBtn = false;
    //     }
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ownerData']?.currentValue) {
            this.ownerObj = { ...changes['ownerData'].currentValue };
            // console.log('ownerData CHANGES ->', this.ownerObj);
        }
    }

    OnLoad(param: string) {
        this.ownerObj.addressId = param;
        this._condominioService.getBuilding(this.token, param).subscribe({
            next: (response) => {
                console.log('getBuilding response', response);
                if (response.status == 'success') {
                    // Formatear los detalles de la dirección

                    for (const key in this.addreesDetails) {
                        this.addreesDetails[key] =
                            this._formatFunctions.titleCase(
                                response.condominium[0][key]
                            );
                    }

                    this.unitOptions =
                        response.condominium[0].availableUnits.map((units) => {
                            return {
                                label: units,
                                code: units,
                            };
                        });
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
    onPropertiesChange(event: any) {
        let propertyId = event.value.code;
        // console.log('onPropertiesChange', propertyId);
        this.OnLoad(propertyId);
    }

    public searchUserValue: string = '';
    searchExistingUser() {
        this._ownerService
            .getOwnerByIdOrEmail(this.token, this.searchUserValue)
            .subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        const ownerFound = response.message;
                        console.log('searchExistingUser', this.ownerObj);
                        let gender = {
                            label: this._formatFunctions.titleCase(
                                ownerFound.gender
                            ),
                            code: ownerFound.gender,
                        };

                        this.ownerObj.name = ownerFound.name;
                        this.ownerObj.lastname = ownerFound.lastname;
                        this.ownerObj.gender = gender;
                        this.ownerObj.phone = ownerFound.phone;
                        this.ownerObj.avatar = ownerFound.avatar;
                        this.ownerObj.email = ownerFound.email;
                        this.ownerObj.id_number = ownerFound.id_number;

                        this.image =
                            this.url + 'owner-avatar/' + this.ownerObj.avatar;
                        this.searchUserValue = '';
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se ha encontrado el usuario',
                        });
                    }
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

    onUnitChange() {
        // Formatear los detalles del propietario
        this.ownerObj.name = this._formatFunctions.titleCase(
            this.ownerObj.name
        );
        this.ownerObj.lastname = this._formatFunctions.titleCase(
            this.ownerObj.lastname
        );
    }

    onStepChange(event: number) {
        this.indexStepper = event;
    }

    resetStepper() {
        this.indexStepper = 0;
        this.apiUnitResponse = false;
    }

    getId(): string {
        return this.identity.role.toLowerCase() == 'admin'
            ? this.identity._id
            : this.identity.createdBy;
    }

    getPropertiesByAdminId() {
        this._condominioService
            .getPropertyByIdentifier(this.token, this.getId())
            .subscribe({
                next: (response) => {
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
     *
     *
     */

    formDataAndValidation(): FormData {
        const formData = new FormData();

        try {
            for (const key in this.ownerObj) {
                if (
                    typeof this.ownerObj[key] === 'object' &&
                    Boolean(this.ownerObj[key].code != undefined)
                ) {
                    formData.append(key, this.ownerObj[key].code);
                } else if (
                    typeof this.ownerObj[key] === 'object' &&
                    Boolean(this.ownerObj[key].label != undefined)
                ) {
                    formData.append(key, this.ownerObj[key].label);
                } else if (key === 'avatar' && this.ownerObj.avatar != '') {
                    formData.append(key, this.ownerObj.avatar);
                } else if (
                    Boolean(this.ownerObj[key] == undefined) ||
                    this.ownerObj[key] === ''
                ) {
                    continue;
                } else {
                    formData.append(key, this.ownerObj[key]);
                }
            }
            return formData;
        } catch (error) {
            throw Error('Error processing form data: ' + error);
        }
    }

    enable_next(
        apartmentsUnit: any,
        isRenting: any,
        parkingsQty: any
    ): boolean {
        console.log('apartmentsUnit', apartmentsUnit.invalid);
        return (
            apartmentsUnit.invalid || isRenting.invalid || parkingsQty.invalid
        );
    }

    onSubmitUnit() {
        const formData = this.formDataAndValidation();

        this._ownerService.createOwner(this.token, formData).subscribe({
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
                    // this.ownerObj.avatar = '../../assets/noimage2.jpeg';
                    // this.messageApiResponse.forEach((item) => {
                    //     item.detail = response.message;
                    //     item.severity = 'success';
                    // });

                    this._messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Owner Created',
                        life: 3000,
                    });
                    this.resetStepper();

                    // if (this.ownerData) {
                    //     this.ownerCreated.emit(false);
                    // } else {
                    //     this.OnLoad(this.homeId);
                    //     this.indexStepper = 0;
                    // }
                } else {
                    // this.messageApiResponse.forEach((item) => {
                    //     item.detail = response.message;
                    //     item.severity = 'danger';
                    // });
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Owner was not Created',
                        life: 3000,
                    });
                }
                // this.apiUnitResponse = true;
            },
            error: (error) => {
                // this._messageService.add({
                //     severity: 'warn',
                //     summary: 'Message for server',
                //     detail: 'Unit was not Created',
                //     life: 3000,
                // });
                // this.messageApiResponse.forEach((item) => {
                //     item.detail = error.error.message;
                //     item.severity = 'danger';
                // });
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: error.error.message,
                    life: 3000,
                });
                console.log(error);
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
            // this.ownerObj.avatar = '../../assets/noimage2.jpeg';

            this.apiUnitResponse = false;
        } else {
            this.apiUnitResponse = true;
        }

        form.reset();
    }
}
