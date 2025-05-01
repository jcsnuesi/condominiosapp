import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports_primeng';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../../service/user.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { CondominioService } from '../../service/condominios.service';
import { global } from '../../service/global.service';

@Component({
    selector: 'app-all-partners',
    standalone: true,
    imports: [ImportsModule, CommonModule],
    providers: [
        MessageService,
        ConfirmationService,
        UserService,
        CondominioService,
    ],
    templateUrl: './all-partners.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-paginator {
                    .p-paginator-current {
                        margin-left: auto;
                    }
                }

                .p-progressbar {
                    height: 0.5rem;
                    background-color: #d8dadc;

                    .p-progressbar-value {
                        background-color: #607d8b;
                    }
                }

                .table-header {
                    display: flex;
                    justify-content: space-between;
                }

                .p-calendar .p-datepicker {
                    min-width: 25rem;

                    td {
                        font-weight: 400;
                    }
                }

                .p-datatable.p-datatable-customers {
                    .p-datatable-header {
                        padding: 1rem;
                        text-align: left;
                        font-size: 1.5rem;
                    }

                    .p-paginator {
                        padding: 1rem;
                    }

                    .p-datatable-thead > tr > th {
                        text-align: left;
                    }

                    .p-datatable-tbody > tr > td {
                        cursor: auto;
                    }

                    .p-dropdown-label:not(.p-placeholder) {
                        text-transform: uppercase;
                    }
                }

                .p-w-100 {
                    width: 100%;
                }

                /* Responsive */
                .p-datatable-customers
                    .p-datatable-tbody
                    > tr
                    > td
                    .p-column-title {
                    display: none;
                }
            }

            @media screen and (max-width: 960px) {
                :host ::ng-deep {
                    .p-datatable {
                        &.p-datatable-customers {
                            .p-datatable-thead > tr > th,
                            .p-datatable-tfoot > tr > td {
                                display: none !important;
                            }

                            .p-datatable-tbody > tr {
                                border-bottom: 1px solid var(--layer-2);

                                > td {
                                    text-align: left;
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                    border: 0 none;

                                    .p-column-title {
                                        min-width: 30%;
                                        display: inline-block;
                                        font-weight: bold;
                                    }

                                    p-progressbar {
                                        width: 100%;
                                    }

                                    &:last-child {
                                        border-bottom: 1px solid
                                            var(--surface-d);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
    ],
})
export class AllPartnersComponent implements OnInit {
    public token: string;
    public identity: any;
    public datatable: any[];
    public selectedCustomers: any[] = [];
    public loading: boolean = true;
    public url: string;

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _userService: UserService,
        private _ownerService: OwnerServiceService,
        private _condominioService: CondominioService
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
                            id: item.owner._id,
                            avatar: item.owner.avatar,
                            fullname:
                                item.owner.name + ' ' + item.owner.lastname,
                            email: item.owner.email,
                            phone: item.owner.phone,
                            createdAt: item.owner.createdAt,
                            invoiceCount: item.count,
                            totalAmount: item.totalAmount,
                            lastPayment: item.invoice_paid_date,
                        };
                    });
                    this.loading = false;
                    console.log(this.datatable);
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
}
