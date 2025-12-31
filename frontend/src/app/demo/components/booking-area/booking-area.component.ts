import {
    Component,
    AfterViewInit,
    EventEmitter,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    Renderer2,
    ChangeDetectorRef,
    OnChanges,
    SimpleChanges,
    ElementRef,
    Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { PanelModule } from 'primeng/panel';
import { UserService } from '../../service/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BookingServiceService } from '../../service/booking-service.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router, ActivatedRoute } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { DialogModule, Dialog } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OwnerServiceService } from '../../service/owner-service.service';
import { CondominioService } from '../../service/condominios.service';

type BookingType = {
    fullname?: string;
    phone?: string;
    unit: string;
    condoId: any;
    areaId?: any;
    checkIn: Date;
    checkOut?: Date;
    status?: string;
    comments?: string;
    visitorNumber?: number;
    notifyType?: string;
    notify?: string;
};

type BookingSettings = {
    id: string;
    bookingName: string;
    condoId: { label: string; code: string };
    unit: { label: string; code: string };
    areaId: { label: string; code: string };
    checkIn: string;
    checkOut: string;
    status: { label: string; code: string };
    comments: string;
};

@Component({
    selector: 'app-booking-area',
    standalone: true,
    imports: [
        IconFieldModule,
        InputIconModule,
        DialogModule,
        ToastModule,
        InputNumberModule,
        ConfirmDialogModule,
        InputTextareaModule,
        InputTextModule,
        RadioButtonModule,
        HasPermissionsDirective,
        CommonModule,
        CalendarModule,
        FormsModule,
        FieldsetModule,
        FloatLabelModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        TagModule,
        PanelModule,
    ],
    providers: [
        UserService,
        BookingServiceService,
        ConfirmationService,
        FormatFunctions,
        OwnerServiceService,
        CondominioService,
    ],
    templateUrl: './booking-area.component.html',
    styleUrl: './booking-area.component.css',
})
export class BookingAreaComponent implements OnInit {
    public dates: Date[];
    public selectedArea: any[];
    public areaOptions: any[];
    public bookingInfo: BookingType;

    public condoOptions: Array<{ label: string; code: string }>;
    public unitOption: Array<{ label: string; code: string }>;
    public selectedCondo: any[];
    public loading: boolean;
    public bookingHistory: any[];
    public valRadio: string = '';
    public notifyOptions: any[];

    public token: string;
    public identity: any;
    public headerStatus: any[];
    public selectedRow: any[];
    public visibleDialog: boolean = false;
    public searchValue: string = '';
    public bookingId: string;
    public headerBooking: string;
    public today: Date;
    public inputValues: Array<{
        notificationType: string;
        fullname: string;
        phone: string;
    }> = [{ notificationType: '', fullname: '', phone: '' }];

    @Input() condoId: string | [string];
    public bookingInfoApt: BookingSettings;
    public isAdmin: boolean = false;

    constructor(
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _format: FormatFunctions,
        private cdr: ChangeDetectorRef,
        private _ownerService: OwnerServiceService,
        private _condominioService: CondominioService
    ) {
        this.identity = this._userService.getIdentity();
        this.isAdmin = this._userService.isAdmin();
        this.token = this._userService.getToken();
        this.headerBooking =
            this.identity.role == 'OWNER' ? 'Booking name' : 'Condo name';

        this.today = new Date();
        this.today.setMilliseconds(0);

        this.bookingInfo = {
            unit: '',
            condoId: '',
            areaId: '',
            checkIn: new Date(),
            checkOut: new Date(),
            status: '',
            visitorNumber: 0,
            notifyType: '',
            notify: '',
            phone: '',
            fullname: '',
        };

        this.headerStatus = [
            { label: 'Reserved', code: 'Reserved' },
            { label: 'Cancelled', code: 'Cancelled' },
            { label: 'Guest', code: 'Guest' },
            { label: 'Expired', code: 'expired' },
        ];

        this.condoOptions = [{ label: '', code: '' }];
        this.selectedRow = [];
        this.areaOptions = [];
        this.unitOption = [];
        this.loading = true;
        this.notifyOptions = [{ label: 'Email' }, { label: 'None' }];
        this.bookingInfoApt = {
            id: '',
            bookingName: '',
            condoId: { label: '', code: '' },
            unit: { label: '', code: '' },
            areaId: { label: '', code: '' },
            checkIn: '',
            checkOut: '',
            status: { label: '', code: '' },
            comments: '',
        };
    }

    updateBookingObj() {
        this.bookingInfo = {
            unit: '',
            condoId: '',
            areaId: '',
            checkIn: new Date(),
            checkOut: new Date(),
            status: '',
            visitorNumber: 0,
            notifyType: '',
            notify: '',
            phone: '',
            fullname: '',
        };
    }

    ngOnInit(): void {
        this._route.params.subscribe((params) => {
            this.condoId = params['id'];

            this.getAllBookings(this.condoId);
            this.isOwner();
        });
    }
    getAllBookings(paramId: string | [string]) {
        /**Este metodo obtiene las reservas del condominio*/

        this._bookingService.getBooking(this.token, paramId).subscribe({
            next: (response) => {
                console.log('Bookings Response:', response);
                if (response?.status === 'success') {
                    let allBookinInfo = response.message;
                    try {
                        this.bookingHistory = allBookinInfo.map((booking) => {
                            return {
                                id: booking._id,
                                guest: booking?.guest,
                                alias: booking?.condoId?.alias,
                                bookingName: booking.bookingName,
                                condoId: booking.condoId,
                                unit: booking.apartmentUnit,
                                area: booking?.areaToReserve ?? 'N/A',
                                checkIn: this._format.dateTimeFormat(
                                    booking.checkIn
                                ),
                                checkOut:
                                    this._format.dateTimeFormat(
                                        booking?.checkOut
                                    ) ?? 'N/A',
                                status: booking.status,
                                visitorNumber: booking?.visitorNumber ?? 0,
                                verified: Boolean(booking.guestCode),
                                comments: booking?.comments,
                            };
                        });
                    } catch (error) {
                        console.log('Error:', error);
                    }

                    this.loading = false;
                } else {
                    this.loading = false;
                }
            },
            error: (errors) => {
                console.log('Error:', errors);
                this.loading = false;
            },
        });
    }

    getId(): string {
        return ['admin', 'owner'].includes(this.identity.role.toLowerCase())
            ? this.identity._id
            : this.identity.createdBy;
    }

    clear(dt: any) {
        dt.clear();
        this.searchValue = '';
    }

    public propertyDetails: any[] = [];
    public dropListData: any[] = [];

    isOwner() {
        if (this.identity.role !== 'OWNER') {
            return;
        }

        this._ownerService
            .getPropertyByOwner(this.token, this.getId())
            .subscribe({
                next: (res) => {
                    if (res.status === 'success') {
                        let { propertyDetails } = res.message;

                        this.condoOptions = propertyDetails.map((condo) => {
                            this.dropListData.push({
                                id: condo.addressId._id,
                                unit: condo.condominium_unit,
                                areas: condo.addressId.socialAreas,
                            });
                            return {
                                label: condo.addressId.alias,
                                code: condo.addressId._id,
                            };
                        });
                    }
                },
                error: (err) => {
                    console.error('Error fetching owner properties:', err);
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se encontraron propiedades para el propietario.',
                    });
                },
            });
    }

    getUnit(event: any) {
        let unitObj = event.value;

        this.unitOption = this.dropListData
            .filter((condo) => condo.id === unitObj.code)
            .map((condo) => {
                return {
                    label: condo.unit,
                    code: unitObj.code,
                };
            });
    }

    getAreaInfo(event: any) {
        let areaObj = event.value;

        this.areaOptions = this.dropListData
            .filter((condo) => condo.id === areaObj.code)
            .map((condo) => {
                if (condo.areas.length > 0) {
                    return {
                        label: condo.areas,
                        code: condo.areas,
                    };
                }

                this._messageService.add({
                    severity: 'warn',
                    summary: 'Notification',
                    detail: 'No social areas found for the selected condominium.',
                });
                return [];
            })
            .flat();
    }

    setIntervalTime(event: Date): Date | null {
        if (!event) return null;

        try {
            // Convertir el evento a un objeto Date si no lo es ya
            const date = event;

            // Validar que sea una fecha válida
            if (isNaN(date.getTime())) {
                // console.warn('Fecha inválida recibida:', event);
                return null;
            }

            // Obtener los minutos actuales y redondearlos al intervalo más cercano (15 minutos)
            const currentMinutes = date.getMinutes();
            const remainder = currentMinutes % 15;
            const adjustedMinutes =
                remainder === 0
                    ? currentMinutes
                    : currentMinutes + (15 - remainder);

            if (currentMinutes > 45) {
                date.setMinutes(0);
                date.setHours(date.getHours() + 1);
            } else {
                date.setMinutes(adjustedMinutes);
            }

            // Establecer segundos y milisegundos en 0 para mayor precisión
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date;
        } catch (error) {
            console.error('Error al procesar la fecha:', error);
            return null;
        }
    }
    public checkOutMgs: any;
    validateDates(form: NgForm) {
        /**
         * Esta función valida las fechas de checkIn y checkOut
         * Valida que checkOut sea mayor que checkIn en fecha y hora
         * Valida que checkIn y checkOut no sean menor que la fecha y hora actual
         */

        if (form.controls['checkIn'].value != null) {
            let checkInDate = new Date(form.controls['checkIn'].value);
            checkInDate.setMilliseconds(0);
            let checkOutDate = new Date(form?.controls['checkOut']?.value);
            const today = new Date();

            this.bookingInfo.checkIn = this.setIntervalTime(checkInDate);

            // Remover milisegundos para comparación precisa
            if (checkOutDate) {
                checkOutDate.setMilliseconds(0);
                this.bookingInfo.checkOut = this.setIntervalTime(checkOutDate);
            }
            today.setMilliseconds(0);

            if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
                form.controls['checkOut'].setErrors({ invalidDate: true });
                form.controls['checkIn'].setErrors({ invalidDate: true });
                this.checkOutMgs =
                    'Check Out date and time must be greater than Check In date and time';
            } else if (checkInDate < today) {
                form.controls['checkIn'].setErrors({ invalidDate: true });
                this.checkOutMgs =
                    'Check In date and time cannot be in the past';
            } else {
                this.checkOutMgs = false;
                form.controls['checkIn'].setErrors(null);
                form.controls['checkOut']?.setErrors(null);
            }
        }
    }

    submit(form: any) {
        let data = null;
        let message = null;
        data = { ...this.bookingInfo };

        if (this.valRadio === 'guest') {
            data.isguest = true;
            message = 'Are you sure you want to make this action?';
        } else {
            data.isguest = false;
            message = 'Are you sure you want to book this area?';
        }

        data.condoId = data.condoId?.code;
        data.unit = data.unit?.label;
        data.areaId = data.areaId?.label;
        data.memberModel =
            this.identity.role.charAt(0).toUpperCase() +
            this.identity.role.slice(1).toLowerCase();

        this._confirmationService.confirm({
            message: message,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this._bookingService.createBooking(this.token, data).subscribe({
                    next: (response) => {
                        if (response.status === 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Booking was successful',
                                life: 5000,
                            });
                            form.reset();
                            this.bookingInfo.notifyType = '';
                            this.ngOnInit();
                        }
                        // console.log('Booking Response:', response)
                    },
                    error: (errors) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errors.error.message,
                            life: 10000,
                        });
                        // console.log('Booking Error:', errors.error)
                    },
                });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'info',
                    summary: 'Rejected',
                    detail: 'You have rejected the booking',
                });
            },
        });
    }

    // public inputData: string[] = [];

    addVisitor() {
        // this.inputData.push('');

        if (this.inputValues.length == 0) {
            this.inputValues.push({
                notificationType: '',
                fullname: '',
                phone: '',
            });
        } else if (this.inputValues.length < 3) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'You can only add up to 3 visitors',
            });
        }
    }

    loadVisitorArray(guestList: any) {
        if (guestList.length == 0) {
            this.inputValues = [];
        } else {
            this.inputValues = guestList;
        }
    }

    public datoss: any;
    removeInput(id: number) {
        // this.inputData.splice(id, 1)
        this.inputValues.splice(id, 1);
    }

    showDialog(customer: any) {
        this.visibleDialog = true;
        // console.log(':guest', customer);

        // Limpiar el array de visitantes
        let customerData = { ...customer };
        this.bookingInfoApt.id = customerData.id;
        this.bookingInfoApt.bookingName = this._format.titleCase(
            customerData.bookingName
        );
        this.condoOptions = [
            {
                label: customerData.condoId.alias,
                code: customerData.condoId._id,
            },
        ];
        this.bookingInfoApt.condoId = {
            label: customerData.condoId.alias,
            code: customerData.condoId._id,
        };
        this.unitOption = [
            {
                label: customerData.unit,
                code: customerData.unit,
            },
        ];
        this.bookingInfoApt.unit = {
            label: customerData.unit,
            code: customerData.unit,
        };
        this.areaOptions = [
            {
                label: customerData.area,
                code: customerData.area,
            },
        ];
        this.bookingInfoApt.areaId = {
            label: customerData.area,
            code: customerData.area,
        };
        this.bookingInfoApt.checkIn = this._format.dateTimeFormat(
            customerData.checkIn
        );
        this.bookingInfoApt.checkOut = this._format.dateTimeFormat(
            customerData.checkOut
        );

        this.headerStatus = [
            {
                label: customerData.status,
                code: customerData.status,
            },
        ];
        this.bookingInfoApt.status = {
            label: customerData.status,
            code: customerData.status,
        };

        this.bookingInfoApt.comments = customerData.comments;
        this.loadVisitorArray(customerData.guest);
    }

    getSeverity(status: string) {
        let statuses = status.toLowerCase();

        if (statuses === 'reserved') {
            return 'success';
        } else if (statuses === 'cancelled') {
            return 'danger';
        } else if (statuses === 'expired') {
            return 'warning';
        } else {
            return 'info';
        }
    }
    areasAvailable() {
        let areasJson = JSON.parse(localStorage.getItem('property'));

        if (areasJson.socialAreas && areasJson.socialAreas.length > 0) {
            areasJson.socialAreas.forEach((area, index) => {
                this.areaOptions.push({ label: area, name: area });
            });
        }
    }

    update() {
        let data: any = {};
        data.guest = this.inputValues;
        data.id = this.bookingInfoApt.id;
        let unitlabel = this.bookingInfoApt.unit.code;
        let condoIdlabel = this.bookingInfoApt.condoId.code;
        let areaIdlabel = this.bookingInfoApt.areaId.label;
        let statuslabel = this.bookingInfoApt.status.code;

        data.unit = unitlabel;
        data.condoId = condoIdlabel;
        data.areaId = areaIdlabel;
        data.status = statuslabel;

        this._confirmationService.confirm({
            message: 'Are you sure you want to update this booking?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this._bookingService.update(this.token, data).subscribe({
                    next: (response) => {
                        if (response.status === 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Booking was successful',
                                life: 5000,
                            });
                            this.visibleDialog = false;
                            this.getAllBookings(this.identity._id);
                        }
                    },
                    error: (errors) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errors.error.message,
                            life: 10000,
                        });
                        // console.log('Booking Error:', errors.error)
                    },
                });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'info',
                    summary: 'Rejected',
                    detail: 'You have rejected the booking',
                });
            },
        }); // console.log("SELECTIONS:", data)
    }
}
