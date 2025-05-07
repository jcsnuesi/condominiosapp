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

@Component({
    selector: 'app-owner-profile',
    standalone: true,
    imports: [
        ImportsModule,
        CommonModule,
        FormsModule,
        TableModule,
        OwnerProfileSettingsComponent,
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
    public ownerObj: OwnerModel;
    public token: string;
    public url: string;

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
    }
    public memberShipSince: string;
    public bookings: any;
    public invoiceCards: { total: number; counts: number } = {
        total: 0,
        counts: 0,
    };
    public invoicePaid: any[] = [];
    public _id: string;
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
            this._id = param['id'];

            this._ownerService.getOwnerAssets(this.token, this._id).subscribe({
                next: (response) => {
                    console.log(response.message);
                    if (response.status == 'success') {
                        let { owner, bookings, invoices, invoicePaid } =
                            response.message;
                        this.ownerObj = owner;
                        this.invoicePaid = invoicePaid;
                        this.invoiceCards.counts = invoices[0].count;
                        this.invoiceCards.total = invoices[0].totalAmount;
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
                        this.bookings = bookings[0].count;
                        console.log(this.ownerObj);
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
    settings() {
        this.settingShow = true;
    }
}
