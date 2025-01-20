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
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, NgForm } from '@angular/forms';
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
import { format, parse, parseISO } from 'date-fns';
import { OwnerServiceService } from '../../service/owner-service.service';

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
    notifingType?: string;
    notifing?: string;
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
        MessageService,
        ConfirmationService,
        FormatFunctions,
        OwnerServiceService,
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
    public notifingOptions: any[];

    public token: string;
    public identity: any;
    public headerStatus: any[];

    public selectedRow: any[];
    public visibleDialog: boolean = false;
    public searchValue: string = '';
    public bookingId: string;
    public headerBooking: string;
    public today: Date;
    @Input('showBackBtn') showBackBtn: boolean = false;

    constructor(
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _format: FormatFunctions,
        private cdr: ChangeDetectorRef,
        private _ownerService: OwnerServiceService
    ) {
        this.identity = this._userService.getIdentity();
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
            notifingType: '',
            notifing: '',
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
        this.unitOption = [{ label: 'Select unit...', code: '' }];
        this.loading = true;
        this.notifingOptions = [{ label: 'Email' }, { label: 'None' }];
        this.bookingInfoApt = {};

        // console.log("GET IDENTITY:", this.identity)
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
            notifingType: '',
            notifing: '',
            phone: '',
            fullname: '',
        };
    }
    public pathId: string;
    ngOnInit(): void {
        this._route.params.subscribe((params) => {
            this.bookingId = params['homeid'] ?? params['dashid'];
            this.pathId = Object.keys(params)[0];

            console.log('paramId--->', this.pathId);
            if (this.bookingId) {
                this.getAllBookings(this.bookingId);
                if (this.identity.role != 'ADMIN') {
                    this.getPropertyType();
                }
            }
        });
    }

    back() {
        this._router.navigate(['/home', this.bookingId]);
    }

    clear(dt: any) {
        dt.clear();
        this.searchValue = '';
    }

    public propertyDetails: any[] = [];
    getPropertyType() {
        /**Este metodo obtiene las propiedades del propietario y carga el dropdown de condominios*/
        this._ownerService.getPropertyByOwner(this.token).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    res.message.forEach((prop) => {
                        prop.propertyDetails.forEach((property) => {
                            this.propertyDetails.push(property);
                            this.condoOptions.push({
                                label: property.addressId.alias.toUpperCase(),
                                code: property.addressId._id,
                            });

                            if (Boolean(property.condominium_unit)) {
                                this.unitOption.push({
                                    label: property.condominium_unit,
                                    code: property.condominium_unit,
                                });
                            }

                            // console.log('Property this.unitOption-->:', this.identity)
                        });
                    });
                }
            },
            error: (err) => {
                console.log('Error:', err);
            },
        });
    }

    getAreaInfo(event: any) {
        let areaObj = event.value;

        this.propertyDetails.forEach((area, index) => {
            if (Boolean(areaObj == undefined)) {
                this.areaOptions = area.addressId.socialAreas.map(
                    (areaFound) => {
                        return {
                            label: areaFound.toUpperCase(),
                            code: areaFound.toUpperCase(),
                        };
                    }
                );
            } else if (
                area.addressId._id === areaObj.code &&
                area.addressId.socialAreas.length > 0
            ) {
                this.areaOptions = area.addressId.socialAreas.map(
                    (areaFound) => {
                        return { label: areaFound, code: areaFound };
                    }
                );
            }
        });
    }

    setIntervalTime(event: Date): Date | null {
        if (!event) return null;

        try {
            // Convertir el evento a un objeto Date si no lo es ya
            const date = event;

            // Validar que sea una fecha válida
            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida recibida:', event);
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
            console.log('form.controls:---------->', form.controls['checkIn']);
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

        let condominioId = data.condoId?.code;
        let unitId = data.unit?.code;
        let areaId = data.areaId?.code;
        data.condoId = condominioId;
        data.unit = unitId;
        data.areaId = areaId;

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
                            this.bookingInfo.notifingType = '';
                            this.getAllBookings(this.bookingId);
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

    getAllBookings(paramId: string) {
        /**Este metodo obtiene las reservas del condominio*/
        let id = null;
        if (this.identity.role === 'ADMIN') {
            id = paramId + '.' + this.pathId;
        } else {
            id = paramId;
        }
        console.log('id path--->', id);
        this._bookingService.getBooking(this.token, id).subscribe({
            next: (response) => {
                // this.bookingHistory = response.booking;
                if (response.status === 'success') {
                    let allBookinInfo = response.message;
                    console.log('Booking Info HISTORY:', allBookinInfo);
                    try {
                        this.bookingHistory = allBookinInfo.map((booking) => {
                            let bookName = null;
                            if (
                                Boolean(booking.guest.length > 0) &&
                                this.identity.role == 'OWNER'
                            ) {
                                bookName = booking.guest[0].fullname;
                                console.log(
                                    'booking.guest.fullname:',
                                    booking.guest
                                );
                            } else {
                                bookName = booking.condoId.alias;
                                console.log(
                                    'booking.condoId:',
                                    booking.condoId
                                );
                            }
                            return {
                                id: booking._id,
                                guest: booking?.guest,
                                bookingName: bookName,
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
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errors.error.message,
                    life: 10000,
                });
                this.loading = false;
                // console.log('Booking Error:', errors.error)
            },
        });
    }

    // public inputData: string[] = [];
    public inputValues: Array<{
        notificationType: string;
        fullname: string;
        phone: string;
    }> = [{ notificationType: '', fullname: '', phone: '' }];

    addVisitor() {
        // this.inputData.push('');
        this.inputValues.push({
            notificationType: '',
            fullname: '',
            phone: '',
        });
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

    public bookingInfoApt: any;
    showDialog(customer: any) {
        // Limpiar el array de visitantes
        console.log('Customer Data:', customer);
        let customerData = { ...customer };
        this.loadVisitorArray(customerData.guest);

        let guestInfo = customerData.guest;

        if (this.identity.role !== 'ADMIN') {
            this.getAreaInfo(customerData.area);
            this.areaOptions = [
                {
                    label: (customerData?.area).toUpperCase(),
                    code: (customerData?.area).toUpperCase(),
                },
            ];
        } else {
            this.unitOption = [
                { label: customerData.unit, code: customerData.unit },
            ];
            this.condoOptions = [
                {
                    label: customerData.condoId.alias.toUpperCase(),
                    code: customerData.condoId._id,
                },
            ];
        }
        // console.log('customerData.checkOut:', customerData?.checkOut);
        this.bookingInfoApt = {
            id: customerData.id,
            memberId: this.identity._id,
            fullname: guestInfo?.fullname,
            unit: { label: customerData.unit, code: customerData.unit },
            phone: guestInfo?.phone,
            checkIn: this._format.dateTimeFormat(customerData.checkIn),
            checkOut:
                customerData?.checkOut != 'N/A'
                    ? this._format.dateTimeFormat(customerData?.checkOut)
                    : null,
            condoId: {
                label: customerData.condoId.alias.toUpperCase(),
                code: customerData.condoId._id,
            },
            areaId: {
                label: (customerData?.area).toUpperCase(),
                code: (customerData?.area).toUpperCase(),
            },
            notifingType: guestInfo?.notifingType,
            notifing: guestInfo?.notifing,
            visitorNumber: customerData?.visitorNumber,
            status: {
                label: this._format.titleCase(customerData.status),
                code: this.headerStatus.find(
                    (status_result) =>
                        status_result.label.toLowerCase() ===
                        customerData.status.toLowerCase()
                ).code,
            },
            comments: customerData?.comments,
            guest: [],
        };

        this.visibleDialog = true;
        this.cdr.detectChanges();
    }

    onStatusChange(event: any) {
        this.bookingInfoApt.status = event;
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
        let data = { ...this.bookingInfoApt };
        data.guest = this.inputValues;
        let unitlabel = this.bookingInfoApt.unit.code;
        let condoIdlabel = this.bookingInfoApt.condoId.code;
        let areaIdlabel = this.bookingInfoApt.areaId.label;
        let statuslabel = this.bookingInfoApt.status.code;

        data.unit = unitlabel;
        data.condoId = condoIdlabel;
        data.areaId = areaIdlabel;
        data.status = statuslabel;

        // console.log('Booking Response//////////////////:', this.bookingInfoApt)
        //   return

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
