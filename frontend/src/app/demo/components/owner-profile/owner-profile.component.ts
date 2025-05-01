import { Component } from '@angular/core';
import { ImportsModule } from '../../imports_primeng';
import { UserService } from '../../service/user.service';
import { CondominioService } from '../../service/condominios.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { InvoiceService } from '../../service/invoice.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { BookingServiceService } from '../../service/booking-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-owner-profile',
    standalone: true,
    imports: [ImportsModule, CommonModule, FormsModule, TableModule],
    providers: [
        CondominioService,
        UserService,
        OwnerServiceService,
        InvoiceService,
        ConfirmationService,
        MessageService,
    ],
    templateUrl: './owner-profile.component.html',
    styleUrl: './owner-profile.component.css',
})
export class OwnerProfileComponent {
    public image: string;

    constructor(
        private _messageService: MessageService,
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _confirmationService: ConfirmationService
    ) {
        this.image = 'https://www.w3schools.com/howto/img_avatar.png';
    }
}
