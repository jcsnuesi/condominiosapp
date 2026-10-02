import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Input,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { CondominioService } from '../../service/condominios.service';
import { OwnerModel } from '../../models/owner.model';
import { ActivatedRoute } from '@angular/router';
import { global } from '../../service/global.service';
import { UserService } from '../../service/user.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { InviceGeneraterComponent } from '../invice-generater/invoice-generater.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { Router } from '@angular/router';
import { StaffService } from '../../service/staff.service';
import { BookingServiceService } from '../../service/booking-service.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { InquiryComponent } from '../inquiry/inquiry.component';
import { PropertiesByOwnerComponent } from '../properties-by-owner/properties-by-owner.component';
import { OwnerProfileSettingsComponent } from '../owner-profile-settings/owner-profile-settings.component';
import { ImportsModule } from '../../imports_primeng';
import * as XLSX from 'xlsx';
import { PoolFileLoaderComponent } from '../pool-file-loader/pool-file-loader.component';
import { StaffComponent } from '../staff/staff.component';
import { InvoiceHistoryComponent } from '../invoice-history/invoice-history.component';
import { InquiryService } from '../../service/inquiry.service';
import { DocsComponent } from '../docs/docs.component';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

type FamilyAccess = {
    avatar: string;
    name: string;
    lastname: string;
    gender: string;
    phone: string;
    email: string;
    password: string;
    status: string;
    role: string;
};

type Condominio = {
    _id: string;
    alias: string;
    availableUnits: string[];
    avatar: string;
    city: string;
    country: string;
    createdAt: string;
    createdBy: string;
    employees: unknown[];
    invoiceDueDate: string;
    mPayment: number;
    paymentDate: string;
    phone: string;
    phone2: string;
    province: string;
    sector_name: string;
    socialAreas: unknown[];
    status: string;
    street_1: string;
    street_2: string;
    typeOfProperty: string;
    units_ownerId: string[];
    updatedAt: string;
    zipcode: string;
    type: string;
};

type InvoiceRecord = {
    createdAt?: string;
    invoice_paid_date?: string | null;
    issueDate?: string;
    paymentStatus?: string;
    status?: string;
};

@Component({
    selector: 'app-home',
    imports: [
        DocsComponent,
        InvoiceHistoryComponent,
        StaffComponent,
        PoolFileLoaderComponent,
        ImportsModule,
        OwnerProfileSettingsComponent,
        PropertiesByOwnerComponent,
        InquiryComponent,
        BookingAreaComponent,
        PaymentsHistoryComponent,
        OwnerRegistrationComponent,
        InviceGeneraterComponent,
        FamilyMemberDetailsComponent,
        HasPermissionsDirective,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [
        MessageService,
        ConfirmationService,
        CondominioService,
        UserService,
        OwnerServiceService,
        InvoiceService,
        StaffService,
        DialogService,
        FormatFunctions,
        InquiryService,
    ],
})
export class HomeComponent implements OnInit {
    public maximized: boolean;
    public customers: any[];
    public items!: any[];
    public options: any;
    public dataChart: any;
    public image: any;
    public ownerObj: OwnerModel;
    public visible: boolean = false;
    public visible_invoice: boolean = false;
    public visible_owner: boolean = false;
    public activeOwnerTab: string = 'basic-info';
    public identity: any;
    private token: string;
    public genderOption: any;
    public passwordOwner: boolean;
    public messageApiResponse: { message: string; severity: string };
    public apiUnitResponse: boolean;
    public isRentOptions: any[];
    public property_typeOptions: any[] = [];
    public units: number;
    public url: string;
    public card_unit_member_date: string;
    public authorizedUser: FamilyAccess[];
    public addressInfo: any;
    public nodata: boolean;
    public visible_dynamic: boolean;
    public genderModel: { name: string; code: string }[];
    public bookingVisible: boolean;
    public chartVisible: boolean;
    public stafflistNumber: number;
    public home: MenuItem[] | undefined;
    public condoInfo: any;
    public itemsx: MenuItem[];
    public updateDateFromTopbar: any;
    public is_loading: boolean = false;

    @Input()
    ownerData: any[] = [];

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    private getResponseValue<T>(response: any, key: string, fallback: T): T {
        const value = response?.[key];

        if (value === undefined || value === null) {
            return fallback;
        }

        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            Object.prototype.hasOwnProperty.call(value, 'message')
        ) {
            return value.message ?? fallback;
        }

        return value as T;
    }

    constructor(
        private _staffService: StaffService,
        private _messageService: MessageService,
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _confirmationService: ConfirmationService,
        public _condominioService: CondominioService,
        private _activatedRoute: ActivatedRoute,
        private dialogService: DialogService,
        private _formatFunctions: FormatFunctions,
        private _router: Router,
        private _inquiryService: InquiryService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];

        this.chartVisible = false;
        this.stafflistNumber = 0;

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

        this.condoInfo = {
            id: '',
            alias: '',
            type: '',
            avatar: '',
            status: '',
            paymentDate: '',
            mPayment: 0,
        };
        this.componentsToShow = {
            booking: false,
            staff: false,
            invoiceHistory: false,
            main: true,
            inquiry: false,
            documents: false,
        };
        this.bookingVisible = false;
        this.url = global.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.isRentOptions = [
            { name: 'Yes', code: true },
            { name: 'No', code: false },
        ];

        this.authorizedUser = [
            {
                avatar: 'avatar1.png',
                name: 'John',
                lastname: 'Mendez',
                gender: 'Male',
                phone: '809-555-5555',
                email: 'jmendex@mail.com',
                password: 'password',
                status: 'active',
                role: 'Owner',
            },
        ];

        this.property_typeOptions = [
            { name: 'House', code: 'house' },
            { name: 'Apartment', code: 'apartment' },
            { name: 'Condo', code: 'condo' },
            { name: 'Townhouse', code: 'townhouse' },
            { name: 'Villa', code: 'villa' },
            { name: 'Penthouse', code: 'penthouse' },
        ];
        this.messageApiResponse = { message: '', severity: '' };
        this.itemsx = [
            {
                label: 'Home',
                command: () => {
                    this.showComponent('main');
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-home',
            },
            {
                label: 'Documents',
                command: () => {
                    this.showComponent('documents');
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-folder',
            },
            {
                label: 'Invoices',
                command: () => {
                    this.showComponent('invoiceHistory');
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-file',
            },
            {
                label: 'Invoice generator',
                command: () => {
                    this.showInvoiceGenerator();
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-money-bill',
            },
        ];
    }

    ngOnInit() {
        this.inquiryDialogData = {
            identity: this.identity,
        };

        this._activatedRoute.paramMap.subscribe((params) => {
            const id = params.get('homeid');
            this.condoId = id ?? undefined;

            if (this.condoId == undefined) {
                console.error(
                    'Condo ID is undefined. Please check the route parameters.'
                );
            }
        });
        this.onInitInfo();
    }

    closeDialogRegistration() {
        this.onInitInfo();
    }

    ownerRegistrationCreated(created: boolean): void {
        if (!created) return;
        this.visible = false;
        this.onInitInfo();
    }

    procesarFactura(event) {
        this.onInitInfo();
        this.visible_invoice = false;
        this._messageService.add(event);
    }

    unitFormatOnInit(property_data): void {
        // console.log('property_data: ', property_data);
        const propertyDetails = Array.isArray(property_data?.propertyDetails)
            ? property_data.propertyDetails
            : [];

        const units = [
            ...new Set(
                propertyDetails
                    .filter((owner) => owner?.addressId?._id === this.condoId)
                    .map((owner) => owner.condominium_unit)
                    .filter(Boolean)
            ),
        ];

        if (units.length === 0) {
            return;
        }

        property_data.condominium_unit = units.join(', ');
    }

    public userDialog: boolean;
    openNew() {
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.maximized = false;
    }

    public totalBooked: number = 0;
    public expiringBookingsToday: number = 0;
    public condoId: string;
    public availableUnitsObject: any[] = [];
    public invoiceInfo: any = {};
    onInitInfo() {
        // end paramMap.subscribe
        this._condominioService.getBuilding(this.condoId).subscribe({
            next: (response) => {
                if (this.isSuccessResponse(response)) {
                    const condominiums: Condominio = this.getResponseValue<any>(
                        response,
                        'data',
                        null
                    ).condominium;

                    if (!condominiums) {
                        this._messageService.add({
                            severity: 'warn',
                            summary: 'Condominium not found',
                            detail: 'No information is available for the selected condominium.',
                            life: 4000,
                        });
                        return;
                    }

                    this.condoInfo = { ...condominiums[0] };
                    this.condoInfo.avatar =
                        this.url +
                        'main-avatar/properties/' +
                        condominiums[0].avatar;

                    this.customers = condominiums[0].units_ownerId;

                    // Info para enviar al componente 'invoice generator'
                    this.invoiceData(condominiums[0]);
                    this.units = this.customers.reduce((total, entry) => {
                        const unitCount = new Set(
                            (entry?.ownerId?.propertyDetails ?? [])
                                .filter(
                                    (property) =>
                                        property?.addressId?._id ===
                                        this.condoId
                                )
                                .map((property) => property.condominium_unit)
                                .filter(Boolean)
                        ).size;
                        return total + unitCount;
                    }, 0);

                    this.card_unit_member_date =
                        this._formatFunctions.dateFormat2(
                            condominiums[0].createdAt
                        );

                    this.getInvoiceByCondoFunc(condominiums[0].units_ownerId);

                    this.customers.forEach((owner) => {
                        this.unitFormatOnInit(owner.ownerId);
                    });

                    this.condoInfo.paymentDate =
                        this._formatFunctions.monthlyBillFormat(
                            this.condoInfo.paymentDate
                        );

                    this._changeDetectorRef.markForCheck();
                    this.staffCard();
                    this.loadBookingCard();
                    this.inquiriesCard();
                }
            },
            error: (error) => {
                console.log('Error en el metodo Oninit componente HOME', error);
            },
        });
    }
    ownerUpdated(event: boolean) {
        if (event) {
            this.onInitInfo();
        }
    }
    invoiceData(data: Condominio) {
        // console.log(
        //     'data invoiceData: ',
        //     data.mPayment,
        //     data.paymentDate,
        //     data._id,
        //     data.units_ownerId
        // );
        this.invoiceInfo.mPayment = data.mPayment;
        this.invoiceInfo.paymentDate = data.paymentDate;
        this.invoiceInfo.id = data._id;
        this.invoiceInfo.units_ownerId = data.units_ownerId;
    }

    handleCondoUpdate(event: any) {
        this.onInitInfo();
    }

    getSeverity(severity: string) {
        return severity == 'active' ? 'success' : 'danger';
    }

    showDialog() {
        this.visible = true;
    }

    loadBookingCard() {
        if (!this.condoId) {
            this.totalBooked = 0;
            this.expiringBookingsToday = 0;
            return;
        }

        this._bookingService.getBookingCount(this.condoId).subscribe({
            next: (response) => {
                // console.log('Booking counts response: ', response);
                if (this.isSuccessResponse(response)) {
                    const counts = response?.data ?? response;
                    this.totalBooked = Number(counts?.total ?? 0);
                    this.expiringBookingsToday = Number(
                        counts?.expiringToday ?? 0
                    );
                    this._changeDetectorRef.markForCheck();
                    return;
                }

                this.totalBooked = 0;
                this.expiringBookingsToday = 0;
                this._changeDetectorRef.markForCheck();
                this._messageService.add({
                    severity: 'warn',
                    summary: 'No bookings found',
                    detail: 'There are no bookings for this condominium',
                    life: 3000,
                });
            },
            error: (error) => {
                console.log(error);
                this.totalBooked = 0;
                this.expiringBookingsToday = 0;
                this._changeDetectorRef.markForCheck();
                this._messageService.add({
                    severity: 'warn',
                    summary: 'No bookings found',
                    detail: 'There are no bookings for this condominium',
                    life: 3000,
                });
            },
        });
    }
    public totalInquiries: number = 0;
    public respondedInquiries: number = 0;
    public inquiries: {
        id: string;
        fullname: string;
        title: string;
        status: string;
    }[];
    inquiriesCard() {
        if (!this.condoId) {
            this.totalInquiries = 0;
            this.respondedInquiries = 0;
            return;
        }

        this._inquiryService.getOwnerInquiries(this.condoId).subscribe({
            next: (response) => {
                const isSuccess =
                    response?.success === true ||
                    response?.status === 'success';
                const docs = response?.data?.docs || [];

                if (isSuccess) {
                    this.totalInquiries = Number(
                        response?.data?.totalDocs ?? docs.length
                    );
                    this.respondedInquiries = Number(
                        response?.data?.responded ?? 0
                    );
                    this.inquiries = docs.map((inquiry) => ({
                        id: inquiry._id,
                        fullname:
                            inquiry.createdBy.name +
                            ' ' +
                            inquiry.createdBy.lastname,
                        title: inquiry.title,
                        status: inquiry.priority,
                    }));
                    this._changeDetectorRef.markForCheck();
                } else {
                    this.totalInquiries = 0;
                    this.respondedInquiries = 0;
                    this._changeDetectorRef.markForCheck();
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'No inquiries found',
                        detail: 'There are no inquiries for this condominium',
                        life: 3000,
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this.totalInquiries = 0;
                this.respondedInquiries = 0;
                this._changeDetectorRef.markForCheck();
            },
        });
    }

    public inquiryDialogData: {
        _id?: string;
        visible?: boolean;
        identity: any;
    };
    showInquiryDialog(inquiry) {
        this.inquiryDialogData = {
            _id: inquiry.id,
            visible: true,
            identity: this.identity,
        };
        this.showComponent('inquiry');
    }

    closeInquiryDialog(visible: boolean) {
        this.inquiryDialogData = {
            _id: '',
            visible: visible,
            identity: '',
        };
    }

    titleCase(value: unknown): string {
        return String(value ?? '')
            .toLowerCase()
            .split(' ')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }

    showOwnerDialog(event: any): void {
        console.log('this.ownerObj: ', event);
        const owner = event?.ownerId ?? event;
        const info = { ...owner };
        info.condoId = this.condoId;
        this.ownerData = [];

        this.ownerData.push(info);

        this.ownerData.push(this.invoicesObj.invoices);

        this.ownerObj = info;
        this.ownerObj.status = event.status;
        this.ownerObj.name = this.titleCase(info.name);
        this.ownerObj.lastname = this.titleCase(info.lastname);
        this.ownerObj.avatar = this.url + 'main-avatar/owners/' + info.avatar;
        this.ownerObj.gender = {
            label: this.titleCase(info.gender),
        };

        this.maximized = false;
        this.image = this.url + 'main-avatar/owners/' + info.avatar;
        this.activeOwnerTab = 'basic-info';
        this.visible_owner = true;
    }

    closeDialog(): void {
        this.visible_owner = false;

        this._router.navigate([], {
            queryParams: { userid: null },
            queryParamsHandling: 'merge',
        });
    }

    showOwnerTab(value: string | number): void {
        this.activeOwnerTab = String(value);
        this._changeDetectorRef.markForCheck();
    }

    public visible_staff: boolean = false;
    public componentsToShow: {
        booking: boolean;
        staff: boolean;
        invoiceHistory: boolean;
        main: boolean;
        inquiry: boolean;
        documents: boolean;
    };
    showInvoiceGenerator() {
        this.invoiceInfo.invoiceGenerator = true;
    }
    showComponent(show) {
        // console.log('showComponent: ', show);
        this.is_loading = true;

        for (const key in this.componentsToShow) {
            this.componentsToShow[key] = false;
            if (key === show) {
                this.componentsToShow[key] = true;
                this.is_loading = false;
            }
        }

        // this.componentsToShow.booking = false;
        // this.componentsToShow.staff = false;
        // this.componentsToShow.invoiceHistory = false;
        // this.componentsToShow.main = false;
        // this.componentsToShow.inquiry = false;
        // this.componentsToShow.documents = false;
        // this.componentsToShow[show] = true;
    }

    onSubmitUnit() {
        const formData = new FormData();
        // main-avatar/owners/noimage.jpeg
        formData.append('avatar', this.url + 'main-avatar/owners/noimage.jpeg');
        formData.append('name', this.ownerObj.name);
        formData.append('lastname', this.ownerObj.lastname);
        formData.append('gender', this.ownerObj.gender);
        formData.append('id_number', this.ownerObj.id_number);
        formData.append('phone', this.ownerObj.phone);
        formData.append('phone2', this.ownerObj.phone2);
        formData.append('email', this.ownerObj.email);
        formData.append('addressId', this.ownerObj.addressId);
        formData.append('apartmentUnit', this.ownerObj.apartmentsUnit);
        formData.append('parkingsQty', this.ownerObj.parkingsQty);
        formData.append('isRenting', this.ownerObj.isRenting);

        this._ownerService.createOwner(formData).subscribe({
            next: (response) => {
                if (this.isSuccessResponse(response)) {
                    this.messageApiResponse.message = response.message;
                    this.messageApiResponse.severity = 'success';
                    this.apiUnitResponse = true;
                } else {
                    this.messageApiResponse.message = response.message;
                    this.messageApiResponse.severity = 'danger';
                    this.apiUnitResponse = true;
                }
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

    public activeStaffQty: number;
    // Carga los staff por condominio
    staffCard() {
        if (!this.condoId) {
            this.activeStaffQty = 0;
            this.stafflistNumber = 0;
            return;
        }

        // let data = this.condoId + '_' + 'homeId'; // comparte variable admin y owner

        this._staffService.getStaffByOwnerCondo(this.condoId).subscribe({
            next: (response) => {
                if (response?.status == 'success') {
                    const staff = this.getResponseValue<any[]>(
                        response,
                        'message',
                        []
                    );
                    this.activeStaffQty =
                        staff.filter(
                            (staffMember) => staffMember.status == 'active'
                        ).length ?? 0;
                    this.stafflistNumber = staff.length;
                    this._changeDetectorRef.markForCheck();
                }
            },
            error: (error) => {
                console.log(error);
                this.activeStaffQty = 0;
                this.stafflistNumber = 0;
                this._messageService.add({
                    severity: 'error',
                    summary: 'Message for server',
                    detail: 'Server error, getting staff by condo',
                    life: 3000,
                });
            },
        });
    }

    public invoicesObj: any = {};
    public noDataForChart: boolean = false;
    public chartEmptyMessage: string =
        'No invoices have been generated yet. Your monthly payment activity will appear here.';

    getInvoiceByCondoFunc(cantidadOwner) {
        this._invoiceService.getInvoiceByCondo(this.condoId).subscribe({
            next: (response) => {
                // GRAPH VARIABLES
                this.chartEmptyMessage =
                    'No invoices have been generated yet. Your monthly payment activity will appear here.';

                const invoiceResp: any = this.getResponseValue<any>(
                    response,
                    'data',
                    {}
                );
                const invoices: InvoiceRecord[] = Array.isArray(
                    invoiceResp?.invoices
                )
                    ? invoiceResp.invoices
                    : [];

                this.invoicesObj.invoices = invoices;
                const documentStyle = getComputedStyle(
                    document.documentElement
                );
                const textColor =
                    documentStyle.getPropertyValue('--text-color');

                const textColorSecondary = documentStyle.getPropertyValue(
                    '--text-color-secondary'
                );

                const surfaceBorder =
                    documentStyle.getPropertyValue('--surface-border');
                if (this.isSuccessResponse(response)) {
                    if (invoices.length === 0) {
                        this.noDataForChart = true;
                        this.chartVisible = true;
                        this._changeDetectorRef.markForCheck();
                        return;
                    }

                    const labels = [
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
                    const paidData = Array<number>(12).fill(0);
                    const unpaidData = Array<number>(12).fill(0);

                    invoices.forEach((element) => {
                        const invoiceDate =
                            element.invoice_paid_date ?? element.issueDate;
                        const monthIndex =
                            Number(invoiceDate?.split(/[-T]/)[1]) - 1;

                        if (monthIndex < 0 || monthIndex >= labels.length) {
                            return;
                        }

                        const monthlyData = element.invoice_paid_date
                            ? paidData
                            : unpaidData;
                        monthlyData[monthIndex] += 1;
                    });

                    const dataChart = {
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
                                    documentStyle.getPropertyValue('--red-500'),
                                borderColor:
                                    documentStyle.getPropertyValue('--red-500'),
                                data: unpaidData,
                            },
                        ],
                    };
                    const options = {
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
                                beginAtZero: true,
                                max: cantidadOwner.length,
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

                    this.dataChart = dataChart;
                    this.options = options;
                    this.noDataForChart = false;
                    this.chartVisible = true;
                    this._changeDetectorRef.markForCheck();
                }
            },
            error: (error) => {
                this.chartVisible = true;
                this.noDataForChart = true;
                this.chartEmptyMessage =
                    error?.status === 404
                        ? 'No invoices have been generated yet. Your monthly payment activity will appear here.'
                        : 'We could not load invoice information right now. Please try again later.';

                if (error?.status !== 404) {
                    console.error('Unable to load invoice information:', error);
                }
            },
        });
    }

    public multipleOwners: any[] = [];
    onSelect(event: any): void {
        const file: File = event.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;
            if (!result) return;

            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            });

            if (jsonData.length < 2) {
                console.log([]);
                return;
            }

            const [headers, ...rows] = jsonData;
            headers.push('addressId');

            const results = rows
                .filter((row) => row.length > 0)
                .map(
                    (row) =>
                        row.push(this.condoId) &&
                        Object.fromEntries(headers.map((h, i) => [h, row[i]]))
                );

            this.multipleOwners = results;
            // Puedes reemplazar esto con la lógica que necesites
        };

        reader.readAsArrayBuffer(file);
    }

    createMultipleOwners() {
        this._confirmationService.confirm({
            message:
                '¿Estás seguro de que deseas crear múltiples propietarios?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-success',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                // Acción a realizar si se acepta la confirmación
                this._ownerService
                    .createMultipleUnitsOwners(this.multipleOwners)
                    .subscribe({
                        next: (response) => {
                            if (this.isSuccessResponse(response)) {
                                this.messageApiResponse.message =
                                    response.message;
                                this.messageApiResponse.severity = 'success';
                                this.apiUnitResponse = true;
                            } else {
                                this.messageApiResponse.message =
                                    response.message;
                                this.messageApiResponse.severity = 'danger';
                                this.apiUnitResponse = true;
                            }
                        },
                        error: (error) => {
                            console.log(error);
                        },
                        complete: () => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Units Created',
                                life: 3000,
                            });
                        },
                    });
            },
            reject: () => {
                // Acción a realizar si se rechaza la confirmación
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Action Cancelled',
                    detail: 'Users were not created.',
                    life: 3000,
                });
            },
        });
    }

    public visible_settings: boolean = false;
    settings() {
        this.visible_settings = true;
    }

    setTodayDate(data: string): string {
        const today = new Date(this.condoInfo.paymentDate);
        let day = today.getDate();
        let month = today.getMonth() + 1; // Los meses son 0-indexados
        let year = today.getFullYear();

        return `${month}-${day}-${year}`; // Formato MM-DD-YYYY
    }

    updateCondo() {
        const formData = new FormData();
        formData.append('alias', this.condoInfo.alias);
        formData.append('phone', this.condoInfo.phone);
        formData.append('phone2', this.condoInfo.phone2);
        formData.append('mPayment', this.condoInfo.mPayment);
        formData.append(
            'paymentDate',
            this.setTodayDate(this.condoInfo.paymentDate)
        );

        this._confirmationService.confirm({
            message:
                '¿Estás seguro de que deseas actualizar la información del condominio?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._condominioService
                    .updateCondominium(formData, this.condoId)
                    .subscribe({
                        next: (res) => {
                            // console.log('res', res);
                            if (res.status === 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Data Updated',
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
            },
            reject: () => {
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Action Cancelled',
                    detail: 'Users were not created.',
                    life: 3000,
                });
            },
        });
    }
}
