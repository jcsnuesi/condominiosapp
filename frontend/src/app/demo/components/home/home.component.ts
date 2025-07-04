import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Input,
    ViewChild,
    OnDestroy,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { CondominioService } from '../../service/condominios.service';
import { dateTimeFormatter } from '../../service/datetime.service';
import { OwnerModel } from '../../models/owner.model';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { global } from '../../service/global.service';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from '../../service/user.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToolbarModule } from 'primeng/toolbar';
import { FamilyMemberComponent } from '../family-member/family-member.component';
import { DropdownModule } from 'primeng/dropdown';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { InviceGeneraterComponent } from '../invice-generater/invoice-generater.component';
import { DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StepperModule } from 'primeng/stepper';
import { DividerModule } from 'primeng/divider';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { StaffService } from '../../service/staff.service';
import { BookingServiceService } from '../../service/booking-service.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { NotificationComponent } from '../notification/notification.component';
import { PropertiesByOwnerComponent } from '../properties-by-owner/properties-by-owner.component';
import { OwnerProfileSettingsComponent } from '../owner-profile-settings/owner-profile-settings.component';
import { ImportsModule } from '../../imports_primeng';
import * as XLSX from 'xlsx';

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
        ImportsModule,
        OwnerProfileSettingsComponent,
        PropertiesByOwnerComponent,
        NotificationComponent,
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
        CondominioService,
        UserService,
        OwnerServiceService,
        InvoiceService,
        StaffService,
        ConfirmationService,
        DialogService,
        FormatFunctions,
    ],
})
export class HomeComponent implements OnInit, OnDestroy {
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
    // public ref: DynamicDialogRef;
    public bookingVisible: boolean;
    public chartVisible: boolean;
    public stafflistNumber: number;

    public updateDateFromTopbar: any;

    @ViewChild(InviceGeneraterComponent)
    invoiceGenerator: InviceGeneraterComponent;
    @Output('homeEvent') homeEvent = new EventEmitter<any>();

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
        private _router: Router
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
        // this.apiUnitResponse = false
    }

    ngOnInit() {
        // INIT INFO

        this.onInitInfo();
        this.getStaffByCondoId();
        this.loadBookingCard();
    }

    closeDialogRegistration(fileSelected: any) {
        // INIT INFO
        fileSelected.clear();
        this.onInitInfo();
        this.getStaffByCondoId();
        this.loadBookingCard();
    }

    procesarFactura(event) {
        this.onInitInfo();
        this.visible_invoice = false;
        this._messageService.add(event);
    }

    // Open Invoice generater dialog
    openInvoiceGenerator() {
        this.invoiceGenerator.open();
    }

    unitFormatOnInit(property_data) {
        var unitList = [];
        for (let index = 0; index < property_data.length; index++) {
            unitList.push(property_data[index].condominium_unit);
        }
        if (unitList.length > 1) {
            return unitList.slice(0, 2).join(', ') + '...';
        }

        return unitList.join(', ');
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
    onInitInfo() {
        this._activatedRoute.params.subscribe((param) => {
            let id = param['homeid'];

            this.condoId = id;
            if (id != undefined) {
                this._condominioService.getBuilding(id, this.token).subscribe(
                    (response) => {
                        if (response.status == 'success') {
                            var unitList = response.condominium;
                            unitList['units'] = unitList.availableUnits.map(
                                (unit) => {
                                    return { label: unit };
                                }
                            );

                            // localStorage.setItem(
                            //     'property',
                            //     JSON.stringify(unitList)
                            // );
                            this.units = unitList.units_ownerId.length;

                            this.card_unit_member_date =
                                this._formatFunctions.dateFormat2(
                                    unitList.createdAt
                                );

                            if (
                                this.identity.role == 'ADMIN' ||
                                this.identity.role == 'STAFF'
                            ) {
                                // console.log(
                                //     'unitList------->',
                                //     response.condominium
                                // );
                                // Configurar encabezado con los datos del condominio
                                new Array(response.condominium).forEach(
                                    (element) => {
                                        unitList.alias = this.titleCase(
                                            element.alias
                                        );
                                        unitList.typeOfProperty = {
                                            label:
                                                this.titleCase(
                                                    element.typeOfProperty
                                                ) + ':',
                                        };

                                        unitList.socialAreas =
                                            element.socialAreas.map((s) => {
                                                return { areasOptions: s };
                                            });
                                        unitList.paymentDate =
                                            this._formatFunctions.dateFormat(
                                                element.paymentDate
                                            );
                                        unitList.propertyUnitFormat =
                                            typeof unitList.availableUnits[0] ==
                                            'string'
                                                ? 'Letters'
                                                : 'Numbers';
                                    }
                                );
                                this.homeEvent.emit(unitList);

                                // Sun Jan 19 2025
                                //Sat Jan 18 2025 00:00:00 GMT-0400 (Atlantic Standard Time)
                            }

                            this.getInvoiceByCondoFunc(unitList);
                            this.customers = unitList.units_ownerId;

                            this.customers.forEach((owner) => {
                                owner.condominium_unit = this.unitFormatOnInit(
                                    owner.propertyDetails
                                );
                            });
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

        // this.ownerObj = new OwnerModel(
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     '',
        //     ''
        // );
    }

    loadBookingCard() {
        this._bookingService.getBooking(this.token, this.condoId).subscribe({
            next: (response) => {
                // console.log('response:--------------->', response);

                if (response.status == 'success') {
                    this.totalBooked = response.message.length;
                } else {
                    this.totalBooked = 0;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
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

    public idOwner: string;
    showOwnerDialog(events) {
        let info = { ...events };

        this.idOwner = events._id;

        this.ownerObj = info;
        this.ownerObj.name = this.titleCase(info.name);
        this.ownerObj.lastname = this.titleCase(info.lastname);
        this.ownerObj.gender = {
            label: this.titleCase(info.gender),
        };

        this.maximized = false;
        this.image = this.url + 'main-avatar/owners/' + events.avatar;
        this.visible_owner = true;
        this._router.navigate([], {
            queryParams: { userid: events._id },
            queryParamsHandling: 'merge',
        });
    }

    closeDialog(): void {
        this.visible_owner = false;

        this._router.navigate([], {
            queryParams: { userid: null },
            queryParamsHandling: 'merge',
        });
    }

    onSubmitUnit() {
        const formData = new FormData();
        formData.append(
            'avatar',
            this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'
        );
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

        this._condominioService.createOwner(this.token, formData).subscribe({
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
    getStaffByCondoId() {
        let data = this.condoId + '_' + 'homeId'; // comparte variable admin y owner

        this._staffService.getStaffByOwnerCondo(this.token, data).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this.activeStaffQty = response.message.filter(
                        (staff) => staff.status == 'active'
                    ).length;
                    this.stafflistNumber = response.message.length;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    getInvoiceByCondoFunc(cantidadOwner) {
        this._invoiceService
            .getInvoiceByCondo(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    // GRAPH VARIABLES
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
                complete: () => {
                    console.log('completed');
                },
            });
    }

    invoiceHistory() {
        this._router.navigate(['/invoice-history', this.condoId]);
    }

    ngOnDestroy(): void {
        this.homeEvent.emit({
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
            console.log(results);
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
                            console.log('response:--------------->', response);
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
}
