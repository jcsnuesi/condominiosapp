import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    Input,
    ElementRef,
    ViewChild,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { finalize, Subscription, timeout } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { withChartTheme } from 'src/app/layout/service/chart-theme';
import { ActivatedRoute, Router } from '@angular/router';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { unitOwerDetails } from '../../models/property_details_type';
import { dateTimeFormatter } from '../../service/datetime.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { OwnerModel } from '../../models/owner.model';
import { BookingServiceService } from '../../service/booking-service.service';
import { StaffService } from '../../service/staff.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { ImportsModule } from '../../imports_primeng';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StaffComponent } from '../staff/staff.component';
import { InvoiceService } from '../../service/invoice.service';
import { InvoiceHistoryComponent } from '../invoice-history/invoice-history.component';
import { InquiryService } from '../../service/inquiry.service';
import { InquiryComponent } from '../inquiry/inquiry.component';
import { DocsComponent } from '../docs/docs.component';
import { DocsService } from '../../service/docs.service';

type DashboardCardKey =
    | 'balance'
    | 'units'
    | 'bookings'
    | 'staff'
    | 'inquiries'
    | 'documents';

type DashboardCardErrors = Record<DashboardCardKey, string | null>;

@Component({
    templateUrl: './dashboard.component.html',
    imports: [
        DocsComponent,
        ImportsModule,
        HasPermissionsDirective,
        BookingAreaComponent,
        StaffComponent,
        InvoiceHistoryComponent,
        InquiryComponent,
    ],
    providers: [
        CondominioService,
        UserService,
        MessageService,
        ConfirmationService,
        OwnerServiceService,
        InvoiceService,
        InquiryService,
        DocsService,
    ],
    styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    files = [];
    public totalInquiries: number = 0;
    totalSize: number = 0;

    totalSizePercent: number = 0;

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;
    ownerObj: OwnerModel;
    public property_typeOptions: any[] = [];

    subscription!: Subscription;
    public units: number;
    private token: string;
    public dateFormatted: string;
    public currentIcon: string;
    public gbColor: string;
    public url: string;
    public parkingOptions: any;

    public formValidation: boolean;

    public apiUnitResponse: boolean;
    public messageApiResponse: { message: string; severity: string };
    public identity: any;
    public areaSocial: boolean;
    public options: any;
    public data: any;
    public bookingVisible: boolean;
    public totalBooked: number = 0;
    public condoOptions: any[];
    public idroute: string;
    public first_password: boolean = false;
    public changePasswordDialog: boolean = false;
    public messagesNoProperty: any;
    public totalUnits: number;
    public visibleCreateOwnerUnit: boolean = false;
    public itemsx: any;
    public condoId: any;
    public totalDocuments: number = 0;
    public bookingExpiring: number = 0;
    public totalRespondedInquiries: number = 0;
    public activeSectionLabel: string = 'Overview';
    public dashboardCardLoading = {
        balance: true,
        units: true,
        bookings: true,
        staff: true,
        inquiries: true,
        documents: true,
    };
    public dashboardCardErrors: DashboardCardErrors = {
        balance: null,
        units: null,
        bookings: null,
        staff: null,
        inquiries: null,
        documents: null,
    };

    public get hasDashboardCardErrors(): boolean {
        return Object.values(this.dashboardCardErrors).some(Boolean);
    }

    public get bookingExpiryLabel(): string {
        return this.bookingExpiring === 1
            ? 'reservation expires today'
            : 'reservations expire today';
    }

    @Output() propertyInfoEvent: EventEmitter<any> = new EventEmitter();
    componentsToShow: {
        booking: boolean;
        staff: boolean;
        main: boolean;
        invoice: boolean;
        inquiry: boolean;
        documents: boolean;
    };
    public inquiryDialogData: {
        _id?: string;
        visible?: boolean;
        identity: any;
        inquiry?: any;
    };

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private toArray<T = any>(value: any): T[] {
        return Array.isArray(value) ? value : [];
    }

    private settleCardLoading(
        key: keyof typeof this.dashboardCardLoading
    ): void {
        this.dashboardCardLoading[key] = false;
        this._changeDetectorRef.detectChanges();
    }

    private setCardError(key: DashboardCardKey, message: string): void {
        this.dashboardCardErrors[key] = message;
    }

    private clearCardError(key: DashboardCardKey): void {
        this.dashboardCardErrors[key] = null;
    }

    constructor(
        public _condominioService: CondominioService,
        public _userService: UserService,
        public layoutService: LayoutService,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _bookingService: BookingServiceService,
        private _staffService: StaffService,
        private _invoiceService: InvoiceService,
        private _inquiryService: InquiryService,
        private _docsService: DocsService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
            if (this.options) this.options = withChartTheme(this.options);
        });

        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.currentIcon = 'pi-building';
        this.gbColor = 'blue-100';
        this.url = global.url;
        this.ownerObj = new OwnerModel(
            'noimage.jpeg',
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
        this.componentsToShow = {
            invoice: false,
            booking: false,
            staff: false,
            main: true,
            inquiry: false,
            documents: false,
        };

        this.formValidation =
            this.ownerObj.apartmentsUnit != '' &&
            this.ownerObj.parkingsQty != '' &&
            this.ownerObj.isRenting != ''
                ? false
                : true;
        this.image = '../../assets/noimage2.jpeg';
        this.idroute = this.identity._id;

        this.condoOptions = [];

        this.apiUnitResponse = false;
        this.messageApiResponse = { message: '', severity: '' };
        this.visible_owner = false;
        this.areaSocial = false;
        this.first_password =
            this.identity.first_password_changed == false ? true : false;
        this.propertyInactive = [];

        this.itemsx = [
            {
                label: 'Home',
                command: () => {
                    this.showComponent('main');
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-home',
            },
        ];
        this.invoiceCards = {
            totalBalance: 0,
            counts: 0,
        };
        this.invoiceDataForCharts = [];
    }

    showInquiryDialog(inquiry) {
        this.inquiryDialogData = {
            _id: inquiry.id,
            visible: true,
            identity: this.identity,
            inquiry: inquiry.detail,
        };
        this.showComponent('inquiry');
    }

    clearInquiryDialogSelection(): void {
        this.inquiryDialogData = {
            identity: this.identity,
            visible: false,
        };
    }

    ngOnInit() {
        this.onInitInfo();

        this.inquiryDialogData = {
            identity: this.identity,
        };
        this.genderOption = [
            { name: 'Male', gender: 'm' },
            { name: 'Female', gender: 'f' },
        ];

        this.parkingOptions = [];

        for (let index = 1; index < 5; index++) {
            this.parkingOptions.push(index);
        }

        this.isRentOptions = [
            { name: 'Yes', code: true },
            { name: 'No', code: false },
        ];

        this.property_typeOptions = [
            { name: 'House', code: 'house' },
            { name: 'Apartment', code: 'apartment' },
            { name: 'Condo', code: 'condo' },
            { name: 'Townhouse', code: 'townhouse' },
            { name: 'Villa', code: 'villa' },
            { name: 'Penthouse', code: 'penthouse' },
        ];

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];

        this.condoId = this.getId();
        this.refreshDashboard();
    }

    refreshDashboard() {
        this.dashboardCardLoading = {
            balance: true,
            units: true,
            bookings: true,
            staff: true,
            inquiries: true,
            documents: true,
        };
        this.dashboardCardErrors = {
            balance: null,
            units: null,
            bookings: null,
            staff: null,
            inquiries: null,
            documents: null,
        };
        this.loadBookingCard();

        this.getStaffQty();

        this.loadUnitsCard();

        this.getAllInvoices();

        this.inquiriesCard();

        this.documentsCard();
    }

    public dataOwner: any;
    ownerChart() {
        const documentStyle = getComputedStyle(document.documentElement);

        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        let data = { unpaid: {}, paid: {} };
        this.invoiceDataForCharts.forEach((invoice) => {
            const date = new Date(invoice.createdAt);
            const monthName = date
                .toLocaleString('es-ES', { month: 'long' })
                .replace(/^\w/, (c) => c.toUpperCase());

            if (
                invoice.paymentStatus === 'pending' ||
                invoice.paymentStatus === 'failed'
            ) {
                if (!Object.keys(data.unpaid).includes(monthName)) {
                    data.unpaid[monthName] = 1;
                } else {
                    data.unpaid[monthName] += 1;
                }
            } else {
                if (!Object.keys(data.paid).includes(monthName)) {
                    data.paid[monthName] = 1;
                } else {
                    data.paid[monthName] += 1;
                }
            }
        });

        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');
        let monthLabels = new Set<string>();
        Object.keys(data.paid).forEach((month) => monthLabels.add(month));
        Object.keys(data.unpaid).forEach((month) => monthLabels.add(month));
        let [unpaid, paid] = Object.keys(data);

        this.dataOwner = {
            labels: Array.from(monthLabels),
            datasets: [
                {
                    label: paid.charAt(0).toUpperCase() + paid.slice(1),
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: Object.values(data.paid),
                },
                {
                    label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
                    backgroundColor:
                        documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: Object.values(data.unpaid),
                },
            ],
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    documentsCard() {
        this._docsService
            .docCard( this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('documents');
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        this.totalDocuments =
                            Number(
                                response.data?.message ?? response.data ?? 0
                            ) || 0;
                        this.clearCardError('documents');
                    } else {
                        this.totalDocuments = 0;
                        this.setCardError(
                            'documents',
                            'Documents could not be loaded.'
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.totalDocuments = 0;
                    this.setCardError(
                        'documents',
                        'Documents could not be loaded.'
                    );
                },
            });
    }

    AdminsChart() {
        const documentStyle = getComputedStyle(document.documentElement);

        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );

        let data = { unpaid: {}, paid: {} };
        this.invoiceDataForCharts.forEach((invoice) => {
            const date = new Date(invoice.createdAt);
            const monthName = date
                .toLocaleString('es-ES', { month: 'long' })
                .replace(/^\w/, (c) => c.toUpperCase());

            if (
                invoice.paymentStatus === 'pending' ||
                invoice.paymentStatus === 'failed'
            ) {
                if (!Object.keys(data.unpaid).includes(monthName)) {
                    data.unpaid[monthName] = 1;
                } else {
                    data.unpaid[monthName] += 1;
                }
            } else {
                if (!Object.keys(data.paid).includes(monthName)) {
                    data.paid[monthName] = 1;
                } else {
                    data.paid[monthName] += 1;
                }
            }
        });

        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');
        let monthLabels = new Set<string>();
        Object.keys(data.paid).forEach((month) => monthLabels.add(month));
        Object.keys(data.unpaid).forEach((month) => monthLabels.add(month));
        let [unpaid, paid] = Object.keys(data);

        this.data = {
            labels: Array.from(monthLabels),
            datasets: [
                {
                    label: paid.charAt(0).toUpperCase() + paid.slice(1),
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: Object.values(data.paid),
                },
                {
                    label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
                    backgroundColor:
                        documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: Object.values(data.unpaid),
                },
            ],
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    public inquiries: {
        id: string;
        fullname: string;
        title: string;
        status: string;
        detail: any;
    }[];
    public areThereInquiries: boolean = false;

    inquiriesCard() {
        this._inquiryService
            .getOwnerInquiries( this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('inquiries');
                })
            )
            .subscribe({
                next: (response) => {
                    const isSuccess =
                        response?.success === true ||
                        response?.status === 'success';
                    const docs = response?.data?.docs || [];

                    if (isSuccess) {
                        this.totalInquiries =
                            Number(response?.data?.totalDocs ?? docs.length) ||
                            0;
                        this.totalRespondedInquiries =
                            Number(response?.data?.responded ?? 0) || 0;
                        this.inquiries = docs.map((inquiry) => ({
                            id: inquiry._id,
                            fullname:
                                (inquiry?.createdBy?.name ?? '') +
                                ' ' +
                                (inquiry?.createdBy?.lastname ?? ''),
                            title: inquiry?.title ?? '',
                            status: inquiry?.priority ?? 'low',
                            detail: inquiry,
                        }));

                        this.areThereInquiries =
                            this.inquiries.length > 0 ? true : false;
                        this.clearCardError('inquiries');
                    } else {
                        this.totalInquiries = 0;
                        this.totalRespondedInquiries = 0;
                        this.inquiries = [];
                        this.areThereInquiries = false;
                        this.setCardError(
                            'inquiries',
                            'Inquiries could not be loaded.'
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.totalInquiries = 0;
                    this.totalRespondedInquiries = 0;
                    this.inquiries = [];
                    this.areThereInquiries = false;
                    this.setCardError(
                        'inquiries',
                        'Inquiries could not be loaded.'
                    );
                },
            });
    }

    showComponent(show: string) {
        this.componentsToShow = {
            invoice: false,
            booking: false,
            staff: false,
            main: false,
            inquiry: false,
            documents: false,
        };
        this.componentsToShow[show] = true;
        const sectionLabels: Record<string, string> = {
            main: 'Overview',
            invoice: 'Balance',
            booking: 'Bookings',
            staff: 'Staff',
            inquiry: 'Inquiries',
            documents: 'Documents',
        };
        this.activeSectionLabel = sectionLabels[show] ?? 'Overview';
    }

    getId() {
        if (!this.identity || !this.identity.role) {
            return undefined;
        }

        const role = this.identity.role.toLowerCase();
        if (role === 'owner' || role === 'admin') {
            return this.identity._id;
        } else if (role === 'family') {
            return this.identity.ownerId;
        } else {
            return this.identity.createdBy;
        }
    }

    public invoiceDataForCharts: any[];

    public invoiceCards: { totalBalance: number; counts: number };
    getAllInvoices() {
        this._invoiceService
            .getInvoiceSummary(this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('balance');
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        const monthly = this.toArray(response.data?.monthly);
                        const summary = response.data?.summary ?? {};

                        const monthNames = [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ];

                        const labels = monthly.map(
                            (x) => monthNames[x?.month] ?? ''
                        );
                        const paidData = monthly.map(
                            (x) => Number(x?.paid) || 0
                        );
                        const unpaidData = monthly.map(
                            (x) => Number(x?.unpaid) || 0
                        );

                        const documentStyle = getComputedStyle(
                            document.documentElement
                        );
                        const textColor =
                            documentStyle.getPropertyValue('--text-color');
                        const textColorSecondary =
                            documentStyle.getPropertyValue(
                                '--text-color-secondary'
                            );
                        const surfaceBorder =
                            documentStyle.getPropertyValue('--surface-border');

                        const chartData = {
                            labels,
                            datasets: [
                                {
                                    label: 'Paid',
                                    backgroundColor:
                                        documentStyle.getPropertyValue(
                                            '--blue-500'
                                        ),
                                    borderColor:
                                        documentStyle.getPropertyValue(
                                            '--blue-500'
                                        ),
                                    data: paidData,
                                },
                                {
                                    label: 'Unpaid',
                                    backgroundColor:
                                        documentStyle.getPropertyValue(
                                            '--pink-500'
                                        ),
                                    borderColor:
                                        documentStyle.getPropertyValue(
                                            '--pink-500'
                                        ),
                                    data: unpaidData,
                                },
                            ],
                        };

                        this.dataOwner = chartData;
                        this.data = chartData;

                        this.options = {
                            maintainAspectRatio: false,
                            aspectRatio: 0.8,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: textColor,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: textColorSecondary,
                                        font: {
                                            weight: 500,
                                        },
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false,
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: textColorSecondary,
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false,
                                    },
                                },
                            },
                        };

                        this.invoiceCards.totalBalance =
                            Number(summary?.totalAmountDue) || 0;
                        this.invoiceCards.counts =
                            Number(summary?.pending) || 0;
                        this.clearCardError('balance');
                    } else {
                        this.invoiceCards.totalBalance = 0;
                        this.invoiceCards.counts = 0;
                        this.setCardError(
                            'balance',
                            'Balance could not be loaded.'
                        );
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to load invoices',
                            life: 3000,
                        });
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.invoiceCards.totalBalance = 0;
                    this.invoiceCards.counts = 0;
                    this.setCardError(
                        'balance',
                        'Balance could not be loaded.'
                    );
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load invoices',
                        life: 3000,
                    });
                },
            });
    }

    loadUnitsCard() {
        this._condominioService
            .getUnits(this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('units');
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        this.totalUnits = this.toArray(
                            response.data?.units
                        ).length;
                        this.clearCardError('units');
                    } else {
                        this.totalUnits = 0;
                        this.setCardError(
                            'units',
                            'Units could not be loaded.'
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.totalUnits = 0;
                    this.setCardError('units', 'Units could not be loaded.');
                },
            });
    }

    hideFamilyDialogfunc(visible: boolean | { msg: string }) {
        if (typeof visible === 'boolean') {
            this.visibleCreateOwnerUnit = visible;
            this._messageService.add({
                severity: 'success',
                summary: 'Member submited',
                detail: 'Member Created Successfully!',
                life: 8000,
            });
        } else {
            this._messageService.add({
                severity: 'error',
                summary: 'Member was not created',
                detail: `${visible.msg}`,
                life: 8000,
            });
        }
    }

    passwordChanged(event: boolean) {
        if (event) {
            this.first_password = false;
            this._messageService.add({
                severity: 'info',
                summary: 'Success',
                detail: 'Password Changed successfully!',
                life: 3000,
            });
        } else {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Password was not Changed',
                life: 3000,
            });
        }
    }
    public totalStaff: number = 0;
    getStaffQty() {
        this._staffService

            .getStaffCard(this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('staff');
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        this.totalStaff =
                            Number(
                                response?.data?.message ??
                                    response?.message ??
                                    response?.data ??
                                    0
                            ) || 0;
                        this.clearCardError('staff');
                    } else {
                        this.totalStaff = 0;
                        this.setCardError(
                            'staff',
                            'Staff could not be loaded.'
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.totalStaff = 0;
                    this.setCardError('staff', 'Staff could not be loaded.');
                },
            });
    }

    propertyData(data) {
        // emit data to parent component
        this.propertyInfoEvent.emit(data);
    }

    loadBookingCard() {
        this._bookingService
            .getBookingCount(this.getId())
            .pipe(
                timeout(15000),
                finalize(() => {
                    this.settleCardLoading('bookings');
                })
            )
            .subscribe({
                next: (response) => {
                    if (this.isSuccessResponse(response)) {
                        const counts = response?.data ?? response;
                        this.totalBooked = Number(counts?.total ?? 0);
                        this.bookingExpiring = Number(
                            counts?.expiringToday ?? 0
                        );
                        this.clearCardError('bookings');
                    } else {
                        this.totalBooked = 0;
                        this.bookingExpiring = 0;
                        this.setCardError(
                            'bookings',
                            'Bookings could not be loaded.'
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.totalBooked = 0;
                    this.bookingExpiring = 0;
                    this.setCardError(
                        'bookings',
                        'Bookings could not be loaded.'
                    );
                },
            });
    }

    public indexStepper: number = 0;

    onMouseOver(): void {
        this.currentIcon = 'pi-plus';
        this.gbColor = 'yellow-200';
    }
    onMouseOut(): void {
        this.currentIcon = 'pi-building';
        this.gbColor = 'blue-100';
    }

    image: any;
    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.ownerObj.avatar = file.files[0];
    }

    onTemplatedUpload() {
        this._messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
            life: 3000,
        });
    }

    public customers: any[];
    public propertyObj: any;
    public genderOption: any;
    public selectedGenero: any[];
    public isRentOptions: any[];
    public propertyInactive: any[];
    public units_ownerId: string;
    public documentsData: Array<{ value: string; label: string }> = [
        { value: '*', label: 'All' },
    ];

    onInitInfo() {
        this._activatedRoute.params.subscribe(() => {
            const id = this.getId();

            this._condominioService.getPropertyByIdentifier(id).subscribe({
                next: (response) => {
                    const condominiums = this.toArray(
                        response?.condominiums ?? response?.data?.condominiums
                    );
                    this.documentsData = [
                        { value: '*', label: 'All' },
                        ...condominiums.map((doc) => ({
                            value: doc._id,
                            label: doc.alias,
                        })),
                    ];

                    if (this.isSuccessResponse(response)) {
                        this.units_ownerId = id;
                        this.units = condominiums.length;
                    } else {
                        this.units = 0;
                        console.log('Error--->', response);
                    }
                },
                error: (error) => {
                    this.units = 0;
                    this.documentsData = [{ value: '*', label: 'All' }];
                    console.log(error);
                },
            });
        });
    }

    unitFormatOnInit(unit) {
        var unitList = [];
        for (let index = 0; index < unit.length; index++) {
            unitList.push(unit[index].condominium_unit);
        }

        return unitList.join(', ');
    }

    btnSecondStepper() {
        if (
            this.ownerObj.name != '' &&
            this.ownerObj.lastname != '' &&
            this.ownerObj.phone != '' &&
            this.ownerObj.gender != ''
        ) {
            return false;
        }
        return true;
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    public ownerDetails: any;
    public passwordOwner: boolean;
    public visible_owner: boolean;
    public propertyDetailsUser: unitOwerDetails;

    showOwnerDialog(events) {
        this.ownerObj = events;

        this.propertyDetailsUser = events;
        this.propertyDetailsUser.units =
            events.propertyDetails.condominium_unit;
        this.propertyDetailsUser.fullname = events.name + ' ' + events.lastname;
        this.propertyDetailsUser.isRent = events.isRenting;
        this.propertyDetailsUser.emergecyPhoneNumber = '809-555-5555';
        this.propertyDetailsUser.paymentMehtod = 'Deposit: Bank of America';
        // this.propertyDetailsUser.condominium_unit = events.propertyDetails.condominium_unit
        // this.propertyDetailsUser.isRenting = events.propertyDetails.isRenting
        // this.propertyDetailsUser.parkingsQty = events.propertyDetails.parkingsQty
        // this.propertyDetailsUser.payment = this.propertyObj.mPayment

        this.visible_owner = true;

        if (this.identity._id == events._id) {
            this.passwordOwner = true;
        } else {
            this.passwordOwner = false;
        }
    }

    public updateUnitDetails: boolean;
    editProduct(details: unitOwerDetails) {
        this.propertyDetailsUser = { ...details };
        this.updateUnitDetails = true;
    }

    getSeverity(severity: string) {
        return severity == 'active' ? 'success' : 'danger';
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public visible: boolean = false;
    public formData: FormData;

    confirmUpdate(event: Event) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Please confirm to proceed moving forward.',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                this._messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                    life: 3000,
                });

                this.onUpdate();
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

    onUpdate() {
        this.formData.append(
            'avatar',
            this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'
        );

        for (const key in this.ownerObj) {
            if (
                key == 'avatar' ||
                key == 'propertyDetails' ||
                key == 'familyAccount'
            ) {
                continue;
            } else {
                this.formData.append(key, this.ownerObj[key]);
            }
        }
    }

    hideDialog() {}

    // Crear table de manera dinamica para el modal
    setModalContent(modalKey: string) {
        let template = {
            headers: {
                unit_detalis: {
                    title: 'Create unit',
                    thead: [
                        'Image',
                        'Unit Number',
                        'Owner',
                        'Email',
                        'Phone',
                        'Status',
                        'Actions',
                    ],
                    tdata: this.propertyObj,
                },
            },
        };

        return template.headers[modalKey];
    }

    getModalContent() {
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
        // return this.setModalContent('unit_detalis')
    }
}
