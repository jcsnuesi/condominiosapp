import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports_primeng';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { CondominioService } from '../../service/condominios.service';
import { global } from '../../service/global.service';
import { ProgressBar } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';

@Component({
    selector: 'app-all-partners',
    standalone: true,
    imports: [ImportsModule, CommonModule, OwnerRegistrationComponent],
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        CondominioService,
    ],
    templateUrl: './all-partners.component.html',
    styleUrls: ['./all-partners.component.css'],
})
export class AllPartnersComponent implements OnInit {
    public token: string;
    public visible: boolean = false;
    public identity: any;
    public datatable: any[];
    public selectedCustomers: any[] = [];
    public loading: boolean = true;
    public url: string;
    @ViewChild('prossBar') prossBar: ProgressBar; // Reference to the datatable
    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _condominioService: CondominioService,
        private _router: Router
    ) {
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.url = global.url;
        this.datatable = [];
    }

    ngOnInit(): void {
        this.getAllPartners();
    }

    clear(dt: any) {
        dt.clear();
    }

    getAllPartners() {
        this._condominioService.getProperties(this.token).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    const apiResponse = response.message;
                    this.datatable = apiResponse.map((item: any) => {
                        return {
                            id: item._id,
                            avatar: item.avatar,
                            fullname: item.name + ' ' + item.lastname,
                            email: item.email,
                            phone: item.phone,
                            createdAt: item.createdAt,
                            invoiceCount: item.count,
                            totalAmount: item.totalAmount,
                            lastPayment: item.invoice_paid_date,
                        };
                    });
                    this.loading = false;
                    // console.log(this.datatable);
                } else {
                    this.loading = false;
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se han encontrado socios',
                    });
                }
            },
            error: (error) => {
                console.log(error);
                this.loading = false;
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los socios',
                });
            },
        });
    }

    // Método para calcular el porcentaje
    calculateProgress(value: number): number {
        const max = 5;

        if (value == 0) return 0;

        return (value / max) * 100;
    }
    getProgressBarColor(invoiceCount: number): string {
        switch (invoiceCount) {
            case 0:
                return 'progress-bar-default';
            case 1:
                return 'progress-bar-default';
            case 2:
                return 'progress-bar-orange';
            case 3:
                return 'progress-bar-orange2';
            case 4:
                return 'progress-bar-red';

            default:
                return 'progress-bar-red';
        }
    }

    showOwner(id: string) {
        this._router.navigate(['/partners', id]);
    }

    closeDialogRegistration() {
        // INIT INFO
        this.visible = false;
        this.ngOnInit();
        // console.log('closeDialogRegistration');
    }
}
