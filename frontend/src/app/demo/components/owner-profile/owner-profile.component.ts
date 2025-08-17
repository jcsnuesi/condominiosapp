import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports_primeng';
import { UserService } from '../../service/user.service';
import { CondominioService } from '../../service/condominios.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { InvoiceService } from '../../service/invoice.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { BookingServiceService } from '../../service/booking-service.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { OwnerModel } from '../../models/owner.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerProfileSettingsComponent } from '../owner-profile-settings/owner-profile-settings.component';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { global } from '../../service/global.service';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { MenuItem } from 'primeng/api';
import { PropertiesByOwnerComponent } from '../properties-by-owner/properties-by-owner.component';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';

@Component({
    selector: 'app-owner-profile',
    standalone: true,
    imports: [
        ImportsModule,
        CommonModule,
        FormsModule,
        TableModule,
        OwnerProfileSettingsComponent,
        PaymentsHistoryComponent,
        PropertiesByOwnerComponent,
        FamilyMemberDetailsComponent,
        BookingAreaComponent,
    ],
    providers: [
        CondominioService,
        UserService,
        OwnerServiceService,
        InvoiceService,
        ConfirmationService,
        MessageService,
        FormatFunctions,
    ],
    templateUrl: './owner-profile.component.html',
    styleUrl: './owner-profile.component.css',
})
export class OwnerProfileComponent implements OnInit {
    public image: string;
    public settingShow: boolean = false;
    // public paymentShow: boolean = false;
    public itemsShow: Array<{
        item: string;
        visible: boolean;
        label: string;
        disabled: boolean;
    }> = [
        {
            item: 'payments',
            visible: false,
            label: 'Payment History',
            disabled: true,
        },
        { item: 'units', visible: false, label: 'Units', disabled: true },
        { item: 'members', visible: false, label: 'Members', disabled: true },
        {
            item: 'booking',
            visible: false,
            label: 'Booking Areas',
            disabled: true,
        },
    ];
    public ownerCard: { count: number } = {
        count: 0,
    };
    public ownerObj: OwnerModel;
    public token: string;
    public url: string;
    public items: MenuItem[] | undefined;
    public memberShipSince: string;
    public bookingsCard: { count: number; today_booking: number } = {
        count: 0,
        today_booking: 0,
    };
    public invoiceCards: { total: number; counts: number } = {
        total: 0,
        counts: 0,
    };
    public bookingCards: { total: number; counts: number } = {
        total: 0,
        counts: 0,
    };

    public invoicePaid: any[] = [];
    public OwnerData: Array<any> = [];
    public memberCard: { count: 0; active: 0 } = {
        count: 0,
        active: 0,
    };

    public showComponents: {
        invoice: boolean;
        payments: boolean;
        units: boolean;
        members: boolean;
        booking: boolean;
    };

    constructor(
        private _messageService: MessageService,
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _confirmationService: ConfirmationService,
        private _activatedRoute: ActivatedRoute,
        private _formatFunctions: FormatFunctions
    ) {
        this.image = 'https://www.w3schools.com/howto/img_avatar.png';
        this.token = this._userService.getToken();
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
        this.url = global.url;
        this.bookingsCard = { count: 0, today_booking: 0 };
        this.showComponents = {
            invoice: false,
            payments: true,
            units: false,
            members: false,
            booking: false,
        };

        this.items = [
            {
                label: 'Home',
                command: () => {
                    this.showComponentsOnClick('payments');
                },
                styleClass: 'cursor-pointer',
                icon: 'pi pi-home',
            },
        ];
    }

    showComponentsOnClick(event: any) {
        this.showComponents = {
            invoice: false,
            payments: false,
            units: false,
            members: false,
            booking: false,
        };
        this.showComponents[event] = true;
    }

    itemsChange() {
        this.items = this.items.splice(0, 1);
        this.itemsShow.forEach((item) => {
            item.visible = false;
        });
    }

    ngOnInit(): void {
        // Obtener:
        // Las propiedades
        // Las invoices
        // Los bookings:
        /**
         * Tener todas las reservas de este propietario
         * Listas las reservas proximo a vencer
         * Historial de reservas
         */

        this._activatedRoute.params.subscribe((param) => {
            const ownerId = param['id'];
            this.OwnerData = [];

            this._ownerService.getOwnerAssets(this.token, ownerId).subscribe({
                next: (response) => {
                    if (response.status == 'success') {
                        let { owner, bookings, invoices, invoicePaid } =
                            response.message;
                        let { propertyDetails } = owner;
                        this.OwnerData.push(owner);
                        this.OwnerData.push(propertyDetails);
                        this.OwnerData.push(invoices);
                        this.OwnerData.push(ownerId);
                        let { familyAccount } = owner;
                        this.ownerObj = owner;
                        this.ownerObj.status = owner.status;

                        console.log('response.message', response.message);
                        console.log('this.OwnerData', this.OwnerData);
                        // console.log(this.ownerObj.status);
                        this.ownerCard.count = propertyDetails.length;
                        this.memberCard.count = familyAccount.length;
                        if (familyAccount.length > 0) {
                            this.memberCard.active = familyAccount.filter(
                                (member) => member.status === 'active'
                            ).length;
                        }

                        if (invoicePaid.length > 0) {
                            this.invoicePaid = invoicePaid;
                            this.invoicePaid[0]['fullname'] =
                                owner.name + ' ' + owner.lastname;
                            this.invoicePaid[0]['phone'] = owner.phone;
                            this.invoicePaid[0]['email'] = owner.email;
                            this.invoiceCards.counts = invoices[0].count;
                            this.invoiceCards.total = invoices[0].totalAmount;
                        }

                        this.memberShipSince = owner.createdAt.split('T')[0];
                        owner.name = this._formatFunctions.titleCase(
                            owner.name
                        );
                        owner.lastname = this._formatFunctions.titleCase(
                            owner.lastname
                        );
                        owner.gender = {
                            label: this._formatFunctions.titleCase(
                                owner.gender
                            ),
                        };

                        this.ownerObj.avatarPreview =
                            this.url + 'main-avatar/owners/' + owner.avatar;

                        this.bookingsCard.count = bookings.length;

                        for (let index = 0; index < bookings.length; index++) {
                            this.bookingsCard.today_booking +=
                                this.checkoutDate(
                                    bookings[index].bookings[0].checkOut
                                );
                        }

                        // Limitar el invoicePaid a 5
                        if (this.invoicePaid.length > 5) {
                            this.invoicePaid = this.invoicePaid.slice(0, 5);
                        }
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'There was a problem on the server',
                            life: 3000,
                        });
                    }
                },
                error: (errors) => {
                    console.log(errors);
                },
            });
        });
    }

    checkoutDate(date: string): number {
        if (!date) return 0;
        const today = new Date();
        const dateObj = new Date(date.split('T')[0]);
        // Compare only the date parts (year, month, day)

        if (
            today.getFullYear() === dateObj.getFullYear() &&
            today.getMonth() + 1 === dateObj.getMonth() + 1 &&
            today.getDate() === dateObj.getDate() + 1
        ) {
            return 1;
        }
        return 0;
    }

    settings() {
        this.settingShow = true;
    }

    openInvoice(item: any) {
        const invoiceTemplate = {
            alias: item.condominiumId.alias,
            invoice_issue: item.issueDate,
            invoice_paid_date: item.invoice_paid_date,
            fullname: item.fullname,
            phone: item.phone,
            unit: item.unit,
            email: item.email,
            invoice_amount: item.amount,
            invoice_status: item.status,
        };
        // console.log('invoiceTemplate', item);

        this._invoiceService.genPDF(invoiceTemplate);
    }
}
