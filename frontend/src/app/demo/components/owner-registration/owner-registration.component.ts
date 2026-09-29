import {
    Component,
    OnInit,
    ViewChild,
    Input,
    SimpleChanges,
    OnChanges,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OwnerModel } from '../../models/owner.model';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { ImportsModule } from '../../imports_primeng';
import { OwnerServiceService } from '../../service/owner-service.service';
import { global } from '../../service/global.service';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { finalize, Subscription } from 'rxjs';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

interface SelectOption {
    label: string;
    code: string;
}

interface CondominiumSummary {
    _id: string;
    alias: string;
}

interface CondominiumDetails extends CondominiumSummary {
    availableUnits?: string[];
    typeOfProperty?: string;
    street_1?: string;
    street_2?: string;
    sector_name?: string;
    city?: string;
    province?: string;
    country?: string;
}

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
    imports: [ImportsModule, FormsModule, HasPermissionsDirective],
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
export class OwnerRegistrationComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('fileInput') fileInput?: FileUpload;

    public ownerObj: OwnerModel;
    public image: string;
    private token: string;
    private identity: any;
    public apiUnitResponse!: boolean;
    public isSubmittingOwner: boolean = false;
    public messageApiResponse: MessageType[] | undefined;

    public genderOption: SelectOption[];
    public parkingOptions: any;
    public property_typeOptions: any[] = [];
    public indexStepper: number = 1;
    public unitOptions: SelectOption[] = [];
    public isLoadingCondominiums = false;
    public isLoadingUnits = false;

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
    // @ViewChild('stepperComponent') stepperComponent: Stepper;
    // @ViewChild('unitFormDos') propertyInfo: NgForm;
    public items: any;
    public homeId = '';
    @Input('ownerData') ownerData: any;
    @Input() condominiumId: string | null = null;
    @Input() allowCondominiumSelection = true;
    @Output() ownerCreated = new EventEmitter<boolean>();

    private isInitialized = false;
    private isDestroyed = false;
    private unitsRequest?: Subscription;

    public isRentOptions: { label: string; code: string }[] = [
        { label: 'Yes', code: 'yes' },
        { label: 'No', code: 'no' },
    ];
    public propertiesOptions: SelectOption[] = [];
    public url: string = global.url;

    constructor(
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _activatedRoute: ActivatedRoute,
        private _formatFunctions: FormatFunctions,
        private _ownerService: OwnerServiceService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
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

        this.image = this.url + 'main-avatar/owners/noimage1.jpeg';
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
            this.isInitialized = true;
            this.homeId = this.condominiumId ?? params['homeid'] ?? '';

            if (this.homeId) {
                this.loadCondominium(this.homeId);
            } else if (this.allowCondominiumSelection) {
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
            this.normalizeOwnerSelections();
        }

        if (changes['condominiumId'] && this.isInitialized) {
            this.homeId = changes['condominiumId'].currentValue ?? '';
            if (this.homeId) {
                this.loadCondominium(this.homeId);
            }
        }
    }

    ngOnDestroy(): void {
        this.isDestroyed = true;
        this.unitsRequest?.unsubscribe();
    }

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    loadCondominium(condominiumId: string): void {
        this.unitsRequest?.unsubscribe();
        this.ownerObj.addressId = condominiumId;
        this.ownerObj.apartmentsUnit = '';
        this.unitOptions = [];
        this.isLoadingUnits = true;

        this.unitsRequest = this._condominioService
            .getBuilding(condominiumId)
            .pipe(
                finalize(() => {
                    queueMicrotask(() => {
                        if (this.isDestroyed) return;
                        this.isLoadingUnits = false;
                        this._changeDetectorRef.markForCheck();
                    });
                })
            )
            .subscribe({
            next: (response) => {
                if (this.isSuccessResponse(response)) {
                    const rawCondominium =
                        response?.data?.condominium ?? response?.condominium;
                    const condominium: CondominiumDetails | undefined =
                        Array.isArray(rawCondominium)
                            ? rawCondominium.find(
                                  (item) => item?._id === condominiumId
                              ) ?? rawCondominium[0]
                            : rawCondominium;

                    if (!condominium) {
                        this.unitOptions = [];
                        this.showLoadError('Condominium was not found.');
                        return;
                    }

                    this.addreesDetails = {
                        typeOfProperty: condominium.typeOfProperty ?? '',
                        street_1: condominium.street_1 ?? '',
                        street_2: condominium.street_2 ?? '',
                        sector_name: condominium.sector_name ?? '',
                        city: condominium.city ?? '',
                        province: condominium.province ?? '',
                        country: condominium.country ?? '',
                    };

                    this.unitOptions = (condominium.availableUnits ?? [])
                        .filter((unit): unit is string => Boolean(unit))
                        .map((unit) => ({ label: unit, code: unit }));
                }
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error('Error loading condominium units', error);
                this.showLoadError('Units could not be loaded.');
            },
        });
    }

    /** @deprecated Use loadCondominium. Kept for existing callers. */
    OnLoad(param: string): void {
        this.loadCondominium(param);
    }

    getPropertiesByAdminId() {
        const adminId = this.getId();

        if (!adminId) {
            return;
        }

        this.isLoadingCondominiums = true;
        this._condominioService
            .getPropertyByIdentifier(adminId)
            .pipe(
                finalize(() => {
                    queueMicrotask(() => {
                        if (this.isDestroyed) return;
                        this.isLoadingCondominiums = false;
                        this._changeDetectorRef.markForCheck();
                    });
                })
            )
            .subscribe({
            next: (response) => {
                const condominiums: CondominiumSummary[] =
                    response?.data?.condominiums ??
                    response?.condominiums ??
                    response?.data?.message ??
                    response?.message ??
                    [];

                if (
                    this.isSuccessResponse(response) &&
                    Array.isArray(condominiums)
                ) {
                    const options = condominiums.map((item) => ({
                        label: item.alias,
                        code: item._id,
                    }));
                    queueMicrotask(() => {
                        if (this.isDestroyed) return;
                        this.propertiesOptions = options;
                        this._changeDetectorRef.markForCheck();
                    });
                } else {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se han encontrado condominios',
                    });
                }
            },
            error: (error) => {
                console.error('Error loading organization condominiums', error);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los condominios',
                });
            },
        });
    }

    onPropertiesChange(event: { value?: string }): void {
        const propertyId = event.value;
        if (propertyId) {
            this.loadCondominium(propertyId);
        }
    }

    private normalizeOwnerSelections(): void {
        const selectionCode = (value: unknown): string => {
            if (typeof value === 'string') return value;
            if (value && typeof value === 'object') {
                const option = value as Partial<SelectOption>;
                return option.code ?? option.label ?? '';
            }
            return '';
        };

        this.ownerObj.gender = selectionCode(this.ownerObj.gender);
        this.ownerObj.addressId = selectionCode(this.ownerObj.addressId);
        this.ownerObj.apartmentsUnit = selectionCode(
            this.ownerObj.apartmentsUnit
        );
        this.ownerObj.isRenting = selectionCode(this.ownerObj.isRenting);
    }

    private showLoadError(detail: string): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail,
        });
    }

    public searchUserValue: string = '';
    searchExistingUser() {
        const identifier = this.searchUserValue.trim();

        if (!identifier) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Dato requerido',
                detail: 'Ingrese el correo o la identificación del usuario',
            });
            return;
        }

        this._ownerService.getOwnerByIdOrEmail(identifier).subscribe({
            next: (response) => {
                const owner =
                    response?.data?.message ??
                    response?.data ??
                    response?.message;

                if (
                    !this.isSuccessResponse(response) ||
                    !owner ||
                    typeof owner !== 'object'
                ) {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se ha encontrado el usuario',
                    });
                    return;
                }

                const genderCode =
                    typeof owner.gender === 'string' ? owner.gender : '';

                this.ownerObj = {
                    ...this.ownerObj,
                    ...owner,
                    gender: genderCode
                        ? {
                              label: this._formatFunctions.titleCase(
                                  genderCode
                              ),
                              code: genderCode,
                          }
                        : '',
                };

                this.image = owner.avatar
                    ? `${this.url}owner-avatar/${encodeURIComponent(
                          owner.avatar
                      )}`
                    : `${this.url}main-avatar/owners/noimage1.jpeg`;

                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.log('searchExistingUser error', error);
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error?.error?.message ?? 'Error al buscar el usuario',
                });
            },
        });
    }

    triggerFileUpload(): void {
        this.fileInput?.basicFileInput?.nativeElement.click();
    }

    onSelect(event: FileSelectEvent): void {
        const [selectedFile] = event.files;

        if (!selectedFile) {
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
            this._changeDetectorRef.detectChanges();
        };

        reader.readAsDataURL(selectedFile);
        this.ownerObj.avatar = selectedFile;
    }

    confirmNewOwner() {
        if (this.isSubmittingOwner) {
            return;
        }

        this._confirmationService.confirm({
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
        this.indexStepper = 1;
        this.apiUnitResponse = false;
    }

    getId(): string | null {
        const role = this.identity?.role?.toLowerCase();
        const identifier =
            role === 'admin' ? this.identity?._id : this.identity?.createdBy;

        return typeof identifier === 'string' && identifier.length > 0
            ? identifier
            : null;
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
                const value = this.ownerObj[key];

                if (value === undefined || value === null || value === '') {
                    continue;
                }

                if (value instanceof File) {
                    formData.append(key, value);
                    continue;
                }

                if (typeof value === 'object' && 'code' in value) {
                    formData.append(key, String(value.code));
                    continue;
                }

                if (typeof value === 'object' && 'label' in value) {
                    formData.append(key, String(value.label));
                    continue;
                }

                formData.append(key, String(value));
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
        // console.log('apartmentsUnit', apartmentsUnit.invalid);
        return (
            apartmentsUnit.invalid || isRenting.invalid || parkingsQty.invalid
        );
    }

    onSubmitUnit() {
        if (this.isSubmittingOwner) {
            return;
        }

        this.token = this._userService.getToken();

        if (!this.token) {
            this._messageService.add({
                severity: 'error',
                summary: 'Session expired',
                detail: 'Please sign in again before creating an owner.',
                life: 5000,
            });
            return;
        }

        let formData: FormData;

        try {
            formData = this.formDataAndValidation();
        } catch (error) {
            this._messageService.add({
                severity: 'error',
                summary: 'Invalid form data',
                detail: 'The owner information could not be processed.',
                life: 5000,
            });
            return;
        }

        this.isSubmittingOwner = true;

        this._ownerService
            .createOwner(formData)
            .pipe(finalize(() => (this.isSubmittingOwner = false)))
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
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
                        if (this.homeId) {
                            this.ownerObj.addressId = this.homeId;
                            this.loadCondominium(this.homeId);
                        } else {
                            this.unitOptions = [];
                        }
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
                        this.image =
                            this.url + 'main-avatar/owners/noimage1.jpeg';
                        this.resetStepper();
                        this._changeDetectorRef.markForCheck();
                        this.ownerCreated.emit(true);

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
                        detail:
                            error?.error?.message ??
                            'Owner could not be created.',
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
