import { PhoneFormatDirective } from 'src/app/phone-format.directive';
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
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { PanelModule } from 'primeng/panel';
import { UserService } from '../../service/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
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

interface BookingHistoryRow {
    id: string;
    guest?: unknown[];
    alias?: string;
    bookingName?: string;
    condoId?: any;
    unit?: string;
    area?: string;
    checkIn: string;
    checkOut: string;
    checkOutAt: string | Date | null;
    checkInAt?: string | Date | null;
    status?: string;
    visitorNumber: number;
    verified: boolean;
    comments?: string;
}

@Component({
    selector: 'app-booking-area',
    imports: [
        PhoneFormatDirective,
        FullCalendarModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        ToastModule,
        InputNumberModule,
        ConfirmDialogModule,
        TextareaModule,
        InputTextModule,
        RadioButtonModule,
        HasPermissionsDirective,
        CommonModule,
        DatePickerModule,
        FormsModule,
        FieldsetModule,
        FloatLabelModule,
        SelectModule,
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
    public bookingHistory: BookingHistoryRow[] = [];
    public bookingView: 'table' | 'calendar' = 'table';
    public calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        height: 'auto',
        timeZone: 'local',
        dayMaxEvents: 3,
        nowIndicator: true,
        editable: false,
        eventInteractive: true,
        eventClick: ({ event }) => {
            const booking = this.bookingHistory.find(row => row.id === event.id);
            if (booking) {
                this.showDialog(booking);
                this.cdr.detectChanges();
            }
        },
        events: [],
    };

    buildCalendarEvents(bookings: BookingHistoryRow[]): EventInput[] {
        return bookings.flatMap(booking => {
            const start = booking.checkInAt ? new Date(booking.checkInAt) : null;
            if (!start || !Number.isFinite(start.getTime())) return [];
            const end = booking.checkOutAt ? new Date(booking.checkOutAt) : null;
            const colors: Record<string, string> = {
                reserved: 'var(--app-dark-info-bg, #e8f2f5)',
                guest: 'var(--app-dark-success-bg, #e9f8f2)',
                cancelled: 'var(--app-dark-danger-bg, #fff0ed)',
                completed: 'var(--app-dark-surface-muted, #f1f5f8)',
                expired: 'var(--app-dark-warning-bg, #fbf3db)',
            };
            const textColors: Record<string, string> = {
                reserved: 'var(--app-dark-info-text, #105d76)',
                guest: 'var(--app-dark-success-text, #08785d)',
                cancelled: 'var(--app-dark-danger-text, #c44732)',
                completed: 'var(--app-dark-muted, #66758d)',
                expired: 'var(--app-dark-warning-text, #956400)',
            };
            return [{
                id: booking.id,
                title: [booking.alias, booking.bookingName, booking.unit ? `Unit ${booking.unit}` : '',
                    booking.area, booking.status].filter(Boolean).join(' · '),
                start,
                end: end && end.getTime() > start.getTime() ? end : undefined,
                allDay: false,
                backgroundColor: colors[(booking.status ?? '').toLowerCase()] ?? 'var(--app-dark-surface-muted, #f1f5f8)',
                borderColor: 'var(--app-dark-border, #dce5ee)',
                textColor: textColors[(booking.status ?? '').toLowerCase()] ?? 'var(--app-dark-text, #183153)',
                display: 'block',
            }];
        });
    }
    public valRadio: string = '';
    public notifyOptions: any[];

    public token: string;
    public identity: any;
    public headerStatus: any[];
    public selectedRow: BookingHistoryRow[];
    public isDeletingBookings: boolean = false;
    public isSubmittingBooking = false;
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
    public canDeleteBookings: boolean = false;

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private getResponseData<T>(response: any, fallback: T): T {
        if (response?.data !== undefined && response?.data !== null) {
            return response.data as T;
        }
        if (response?.message !== undefined && response?.message !== null) {
            return response.message as T;
        }
        return fallback;
    }

    private setLoadingState(value: boolean) {
        setTimeout(() => {
            this.loading = value;
        });
    }

    private setBookingHistory(value: BookingHistoryRow[]) {
        setTimeout(() => {
            this.bookingHistory = value;
            this.calendarOptions = { ...this.calendarOptions, events: this.buildCalendarEvents(value) };
            this.selectedRow = [];
            this.cdr.markForCheck();
        });
    }

    private getBookingCollection(response: any): any[] {
        const payload = this.getResponseData<any>(response, []);

        if (Array.isArray(payload)) {
            return payload;
        }

        if (Array.isArray(payload.message)) {
            return payload.message;
        }

        if (Array.isArray(payload?.docs)) {
            return payload.docs;
        }

        if (Array.isArray(payload?.bookings)) {
            return payload.bookings;
        }

        if (Array.isArray(payload?.items)) {
            return payload.items;
        }

        return [];
    }

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
        this.canDeleteBookings = [
            'ADMIN',
            'STAFF_ADMIN',
            'ROLE_ADMIN',
            'ROLE_STAFF_ADMIN',
            'STAFF',
            'ROLE_STAFF',
        ].includes(String(this.identity?.role ?? '').toUpperCase());
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
        const routeCondoId = this._route.snapshot.paramMap.get('id');
        const resolvedCondoId = this.condoId || routeCondoId;

        if (resolvedCondoId) {
            this.condoId = resolvedCondoId;
            this.getAllBookings(this.condoId);
        }

        this.isOwner();
    }
    getAllBookings(paramId: string | [string]) {
        /**Este metodo obtiene las reservas del condominio*/

        this._bookingService.getBooking(paramId).subscribe({
            next: (response) => {
                const bookings = this.getBookingCollection(response);
                if (this.isSuccessResponse(response)) {
                    const bookingHistory = bookings.map((booking) => {
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
                            checkOutAt: booking?.checkOut ?? null,
                            checkInAt: booking.checkIn ?? null,
                            status: booking.status,
                            visitorNumber: booking?.visitorNumber ?? 0,
                            verified: Boolean(booking.guestCode),
                            comments: booking?.comments,
                        };
                    });
                    this.setBookingHistory(bookingHistory);
                } else {
                    this.setBookingHistory([]);
                }
                this.setLoadingState(false);
            },
            error: (errors) => {
                console.log('Error:', errors);
                this.setBookingHistory([]);
                this.setLoadingState(false);
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

    isDeletionEligible(
        booking: BookingHistoryRow,
        systemDate: Date = new Date()
    ): boolean {
        if (String(booking.status ?? '').toLowerCase() !== 'reserved') {
            return false;
        }

        if (!booking.checkOutAt) {
            return false;
        }

        const checkOutTime = new Date(booking.checkOutAt).getTime();
        return (
            Number.isFinite(checkOutTime) && checkOutTime < systemDate.getTime()
        );
    }

    get selectedEligibleRows(): BookingHistoryRow[] {
        return (this.selectedRow ?? []).filter((booking) =>
            this.isDeletionEligible(booking)
        );
    }

    getDeletionEligibilityLabel(booking: BookingHistoryRow): string {
        if (String(booking.status ?? '').toLowerCase() !== 'reserved') {
            return 'Only reserved bookings can be deleted';
        }

        if (!booking.checkOutAt) {
            return 'Bookings without a checkout date cannot be deleted';
        }

        return new Date(booking.checkOutAt).getTime() < Date.now()
            ? 'Select booking for deletion'
            : 'Bookings can be deleted after their checkout has passed';
    }

    confirmDeleteSelectedBookings(): void {
        const bookings = this.selectedEligibleRows;
        if (bookings.length === 0 || this.isDeletingBookings) {
            return;
        }

        if (bookings.length > 100) {
            this.showDeleteError(
                'Select no more than 100 bookings per deletion.'
            );
            return;
        }

        const bookingLabel = bookings.length === 1 ? 'booking' : 'bookings';
        this._confirmationService.confirm({
            header: 'Delete booking history',
            message: `Permanently delete ${bookings.length} selected ${bookingLabel}? This action cannot be undone.`,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonStyleClass: 'p-button-danger',
            acceptLabel: 'Delete',
            rejectLabel: 'Keep bookings',
            accept: () => this.deleteSelectedBookings(bookings),
        });
    }

    private deleteSelectedBookings(bookings: BookingHistoryRow[]): void {
        const ids = bookings.map((booking) => booking.id);
        this.isDeletingBookings = true;

        this._bookingService.deleteReservations(ids).subscribe({
            next: (response) => {
                this.isDeletingBookings = false;
                if (!this.isSuccessResponse(response)) {
                    this.showDeleteError(
                        response?.message ??
                            'The selected bookings could not be deleted.'
                    );
                    return;
                }

                this.selectedRow = [];
                const result = this.getResponseData<{
                    deletedCount?: number;
                    skippedCount?: number;
                }>(response, {});
                const deletedCount = result.deletedCount ?? 0;
                const skippedCount = result.skippedCount ?? 0;

                if (deletedCount > 0) {
                    const bookingLabel =
                        deletedCount === 1 ? 'booking' : 'bookings';
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Bookings deleted',
                        detail: `${deletedCount} ${bookingLabel} deleted permanently.`,
                        life: 5000,
                    });
                }

                if (skippedCount > 0) {
                    const bookingLabel =
                        skippedCount === 1 ? 'booking was' : 'bookings were';
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'History changed',
                        detail: `${skippedCount} selected ${bookingLabel} not deleted because they are no longer eligible.`,
                        life: 10000,
                    });
                }

                if (this.condoId) {
                    this.getAllBookings(this.condoId);
                }
            },
            error: (error) => {
                this.isDeletingBookings = false;
                this.showDeleteError(
                    error?.error?.message ??
                        'The selected bookings may no longer be eligible. Refresh the history and try again.'
                );
            },
        });
    }

    private showDeleteError(detail: string): void {
        this._messageService.add({
            severity: 'error',
            summary: 'Bookings not deleted',
            detail,
            life: 10000,
        });
    }

    public propertyDetails: any[] = [];
    public dropListData: any[] = [];

    isOwner() {
        if (this.identity.role !== 'OWNER') {
            return;
        }

        this._ownerService.getPropertyByOwner(this.getId()).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    const { propertyDetails } = res.message;
                    const activeProperties = propertyDetails.filter(
                        (property) => property.addressId?._id &&
                            property.status_property !== 'inactive'
                    );
                    this.dropListData = activeProperties.map((condo) => ({
                            id: condo.addressId._id,
                            unit: condo.condominium_unit,
                            areas: condo.addressId.socialAreas ?? [],
                    }));
                    this.condoOptions = [...new Map(activeProperties.map((condo) => [
                        condo.addressId._id, {
                            label: condo.addressId.alias,
                            code: condo.addressId._id,
                        },
                    ])).values()] as Array<{ label: string; code: string }>;
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
        this.bookingInfo.unit = '';
        this.bookingInfo.areaId = '';
        this.areaOptions = [];

        this.unitOption = this.dropListData
            .filter((condo) => condo.id === unitObj?.code)
            .map((condo) => {
                return {
                    label: condo.unit,
                    code: unitObj.code,
                };
            });
    }

    getAreaInfo(event: any) {
        let areaObj = event.value;
        this.bookingInfo.areaId = '';
        const areas: string[] = this.dropListData
            .filter((condo) => condo.id === areaObj?.code && condo.unit === areaObj?.label)
            .flatMap((condo) => condo.areas);
        this.areaOptions = [...new Set(areas)].map((area) => ({ label: area, code: area }));
        if (this.areaOptions.length === 0) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Notification',
                detail: 'No social areas found for the selected condominium.',
            });
        }
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
    validateDates(form: NgForm, value?: Date, field?: 'checkIn' | 'checkOut') {
        const checkInValue = field === 'checkIn' ? value : this.bookingInfo.checkIn;
        const checkOutValue = field === 'checkOut' ? value : this.bookingInfo.checkOut;
        const checkInDate = checkInValue ? new Date(checkInValue) : null;
        const checkOutDate = checkOutValue ? new Date(checkOutValue) : null;
        this.checkOutMgs = '';
        for (const name of ['checkIn', 'checkOut']) {
            const control = form.controls[name];
            if (control?.hasError('invalidDate')) {
                const { invalidDate, ...otherErrors } = control.errors ?? {};
                control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
            }
        }
        if (!checkInDate || !Number.isFinite(checkInDate.getTime())) return;
        this.bookingInfo.checkIn = this.setIntervalTime(checkInDate);
        const hasCheckOut = Boolean(checkOutDate && Number.isFinite(checkOutDate.getTime()));
        if (form.controls['checkOut'] && hasCheckOut) {
            this.bookingInfo.checkOut = this.setIntervalTime(checkOutDate);
        }
        if (checkInDate < new Date()) {
            form.controls['checkIn']?.setErrors({ ...form.controls['checkIn'].errors, invalidDate: true });
            this.checkOutMgs = 'Check In date and time cannot be in the past';
        } else if (form.controls['checkOut'] && hasCheckOut && checkInDate >= checkOutDate) {
            form.controls['checkOut'].setErrors({ ...form.controls['checkOut'].errors, invalidDate: true });
            this.checkOutMgs = 'Check Out date and time must be greater than Check In date and time';
        }
    }

    submit(form: any) {
        this.validateDates(form);
        if (form.invalid || this.checkOutMgs || this.isSubmittingBooking) return;
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
        if (!data.isguest) {
            data.name = this.identity.name;
            data.lastname = this.identity.lastname;
        }

        this._confirmationService.confirm({
            message: message,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                if (this.isSubmittingBooking) return;
                this.isSubmittingBooking = true;
                this._bookingService.createBooking(data).subscribe({
                    next: (response) => {
                        this.isSubmittingBooking = false;
                        if (this.isSuccessResponse(response)) {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Booking was successful',
                                life: 5000,
                            });
                            form.reset();
                            this.updateBookingObj();
                            this.unitOption = [];
                            this.areaOptions = [];
                            this.ngOnInit();
                        }
                        // console.log('Booking Response:', response)
                    },
                    error: (errors) => {
                        this.isSubmittingBooking = false;
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errors.error?.error?.message ?? errors.error?.message ?? 'The booking could not be created.',
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

    getSeverity(status: string | null | undefined) {
        const statuses = String(status ?? '').toLowerCase();

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
        const storedProperty = localStorage.getItem('property');
        if (!storedProperty) {
            return;
        }

        let areasJson: { socialAreas?: unknown };
        try {
            areasJson = JSON.parse(storedProperty);
        } catch {
            return;
        }

        if (Array.isArray(areasJson?.socialAreas)) {
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
                this._bookingService.update(data).subscribe({
                    next: (response) => {
                        if (this.isSuccessResponse(response)) {
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
