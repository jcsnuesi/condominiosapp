import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Input,
    ViewChild,
    OnDestroy,
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
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { InquiryComponent } from '../inquiry/inquiry.component';
import { PropertiesByOwnerComponent } from '../properties-by-owner/properties-by-owner.component';
import { OwnerProfileSettingsComponent } from '../owner-profile-settings/owner-profile-settings.component';
import { ImportsModule } from '../../imports_primeng';
import * as XLSX from 'xlsx';
import { PoolFileLoaderComponent } from '../pool-file-loader/pool-file-loader.component';
import { StaffComponent } from '../staff/staff.component';
import { InvoiceHistoryComponent } from '../invoice-history/invoice-history.component';
import { InquiryService } from '../../service/inquiry.service';

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

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        InvoiceHistoryComponent,
        StaffComponent,
        PoolFileLoaderComponent,
        ImportsModule,
        OwnerProfileSettingsComponent,
        PropertiesByOwnerComponent,
        InquiryComponent,
        HasPermissionsDirective,
        BookingAreaComponent,
        PaymentsHistoryComponent,
        OwnerRegistrationComponent,
        InviceGeneraterComponent,
        FamilyMemberDetailsComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
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
    public itemsx: any;
    public updateDateFromTopbar: any;

    @Input()
    ownerData: any[] = [];

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
        private _inquiryService: InquiryService
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
        ];
    }

    ngOnInit() {
        // INIT INFO

        this.onInitInfo();
        this.staffCard();
        this.loadBookingCard();
        this.inquiriesCard();
        this.inquiryDialogData = {
            identity: this.identity,
        };
    }

    closeDialogRegistration() {
        // // INIT INFO
        // fileSelected.clear();
        this.onInitInfo();
        this.staffCard();
        this.loadBookingCard();
    }

    procesarFactura(event) {
        this.onInitInfo();
        this.visible_invoice = false;
        this._messageService.add(event);
    }

    unitFormatOnInit(property_data): void {
        const propertyDetails = property_data.propertyDetails;

        const units = propertyDetails
            .filter((owner) => owner.addressId._id === this.condoId)
            .map((owner) => {
                return owner.condominium_unit;
            });

        if (units.length === 0) {
            return;
        }

        property_data.condominium_unit =
            units.length > 2
                ? `${units.slice(0, 2).join(', ')}...`
                : units.join(', ');
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
    public condoId: string;
    public availableUnitsObject: any[] = [];
    public invoiceInfo: any = {};
    onInitInfo() {
        this._activatedRoute.params.subscribe((param) => {
            let id = param['homeid'];

            this.condoId = id;
            if (id != undefined) {
                this._condominioService.getBuilding(this.token, id).subscribe(
                    (response) => {
                        if (response.status == 'success') {
                            // Info para enviar al componente 'invoice generator'
                            var unitList = response.condominium[0];

                            this.invoiceInfo.mPayment = unitList.mPayment;
                            this.invoiceInfo.paymentDate = unitList.paymentDate;
                            this.invoiceInfo.id = unitList._id;
                            this.invoiceInfo.units_ownerId =
                                unitList.units_ownerId;

                            this.condoInfo = { ...unitList };

                            this.condoInfo.avatar =
                                this.url +
                                'main-avatar/properties/' +
                                unitList.avatar;
                            this.condoInfo.alias = unitList.alias;
                            this.condoInfo.type = unitList.typeOfProperty;
                            this.condoInfo.status = unitList.status;

                            this.units = unitList.units_ownerId.length;

                            this.card_unit_member_date =
                                this._formatFunctions.dateFormat2(
                                    unitList.createdAt
                                );

                            this.getInvoiceByCondoFunc(unitList);
                            this.customers = unitList.units_ownerId;

                            this.customers.forEach((owner) => {
                                this.unitFormatOnInit(owner);
                            });

                            this.condoInfo.paymentDate =
                                this._formatFunctions.monthlyBillFormat(
                                    this.condoInfo.paymentDate
                                );
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
        });
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
        this._bookingService.getBooking(this.token, this.condoId).subscribe({
            next: (response) => {
                // console.log('response:--------------->', response);

                if (response.status == 'success') {
                    this.totalBooked = response.message.length;
                } else {
                    this.totalBooked = 0;
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'No bookings found',
                        detail: 'There are no bookings for this condominium',
                        life: 3000,
                    });
                }
            },
            error: (error) => {
                console.log(error);
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
    public inquiries: {
        id: string;
        fullname: string;
        title: string;
        status: string;
    }[];
    inquiriesCard() {
        this._inquiryService
            .getOwnerInquiries(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        this.totalInquiries = response.data.docs.length;
                        this.inquiries = response.data.docs.map((inquiry) => ({
                            id: inquiry._id,
                            fullname:
                                inquiry.createdBy.name +
                                ' ' +
                                inquiry.createdBy.lastname,
                            title: inquiry.title,
                            status: inquiry.priority,
                        }));
                    } else {
                        this.totalInquiries = 0;
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

    titleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }

    showOwnerDialog(events) {
        let info = { ...events };
        info.condoId = this.condoId;
        this.ownerData = [];

        this.ownerData.push(info);

        // this.ownerData.push(null);
        this.ownerData.push(this.invoicesObj.invoices);
        // this.ownerData.push(null);

        this.ownerObj = info;
        this.ownerObj.name = this.titleCase(info.name);
        this.ownerObj.lastname = this.titleCase(info.lastname);
        this.ownerObj.avatar = this.url + 'main-avatar/owners/' + events.avatar;
        this.ownerObj.gender = {
            label: this.titleCase(info.gender),
        };

        this.maximized = false;
        this.image = this.url + 'main-avatar/owners/' + events.avatar;
        this.visible_owner = true;

        // this._router.navigate([], {
        //     queryParams: { userid: events._id },
        //     queryParamsHandling: 'merge',
        // });
    }

    closeDialog(): void {
        this.visible_owner = false;

        this._router.navigate([], {
            queryParams: { userid: null },
            queryParamsHandling: 'merge',
        });
    }

    public visible_staff: boolean = false;
    public componentsToShow: {
        booking: boolean;
        staff: boolean;
        invoiceHistory: boolean;
        main: boolean;
        inquiry: boolean;
    };
    showInvoiceGenerator() {
        this.invoiceInfo.invoiceGenerator = true;
    }
    showComponent(show) {
        this.componentsToShow.booking = false;
        this.componentsToShow.staff = false;
        this.componentsToShow.invoiceHistory = false;
        this.componentsToShow.main = false;
        this.componentsToShow.inquiry = false;
        this.componentsToShow[show] = true;
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

        this._ownerService.createOwner(this.token, formData).subscribe({
            next: (response) => {
                if (response.status == 'success') {
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
        // let data = this.condoId + '_' + 'homeId'; // comparte variable admin y owner

        this._staffService
            .getStaffByOwnerCondo(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    console.log('staffByOwnerCondo response', response);
                    if (response?.status == 'success') {
                        this.activeStaffQty =
                            response.message.filter(
                                (staff) => staff.status == 'active'
                            ).length ?? 0;
                        this.stafflistNumber = response.message.length ?? 0;
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
    getInvoiceByCondoFunc(cantidadOwner) {
        this._invoiceService
            .getInvoiceByCondo(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    // GRAPH VARIABLES
                    this.invoicesObj.invoices = response.invoices;
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
                    this.dataChart = {
                        labels: [
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
                        ],
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
                                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            },
                            {
                                label: 'Unpaid',
                                backgroundColor:
                                    documentStyle.getPropertyValue('--red-500'),
                                borderColor:
                                    documentStyle.getPropertyValue('--red-500'),
                                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            },
                        ],
                    };
                    let paidData = {};
                    let unpaidData = {};
                    if (response.status == 'success') {
                        this.chartVisible = true;

                        let invoiceResp = response.invoices;

                        invoiceResp.forEach((element) => {
                            let {
                                invoice_amount,
                                invoice_status,
                                paymentStatus,
                                invoice_paid_date,
                                issueDate,
                            } = element;

                            if (invoice_paid_date != null) {
                                let monthName =
                                    this._formatFunctions.getMonthName(
                                        parseInt(
                                            invoice_paid_date.split(/[-T]/)[1]
                                        )
                                    );

                                if (paidData[monthName] == undefined) {
                                    paidData[monthName] = 0;
                                }
                                paidData[monthName] = paidData[monthName] + 1;
                            } else {
                                let monthNameUnpaid =
                                    this._formatFunctions.getMonthName(
                                        parseInt(issueDate.split(/[-T]/)[1])
                                    );

                                if (unpaidData[monthNameUnpaid] == undefined) {
                                    unpaidData[monthNameUnpaid] = 0;
                                }
                                unpaidData[monthNameUnpaid] =
                                    unpaidData[monthNameUnpaid] + 1;
                            }
                        });

                        for (const key in paidData) {
                            this.dataChart.datasets[0].data[
                                this.dataChart.labels.indexOf(key)
                            ] = paidData[key];
                        }

                        for (const key in unpaidData) {
                            this.dataChart.datasets[1].data[
                                this.dataChart.labels.indexOf(key)
                            ] = unpaidData[key];
                        }

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
                                    beginAtZero: true,
                                    max: cantidadOwner.units_ownerId.length,
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
                },
                error: (error) => {
                    console.log(error);
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
                    .createMultipleUnitsOwners(this.token, this.multipleOwners)
                    .subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
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
                    .updateCondominium(this.token, formData, this.condoId)
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
