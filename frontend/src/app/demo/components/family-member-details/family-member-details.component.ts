import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../service/user.service';
import { FormatFunctions } from '../../../pipes/formating_text';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FamilyServiceService } from '../../service/family-service.service';

type FamilyMemberDetails = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    alias: string;
    address: string;
    units: string;
    status: string;
    memberSince?: string;
    createdAt?: string;
};

@Component({
    selector: 'app-family-member-details',
    standalone: true,
    imports: [
        ToastModule,
        ConfirmDialogModule,
        CommonModule,
        TableModule,
        RouterModule,
        HasPermissionsDirective,
        TagModule,
        ButtonModule,
    ],
    providers: [UserService, FormatFunctions, MessageService],
    templateUrl: './family-member-details.component.html',
    styleUrl: './family-member-details.component.scss',
})
export class FamilyMemberDetailsComponent implements OnInit {
    public token: string;
    public urlId: string;
    public familyMemberDetails: FamilyMemberDetails;
    public nodata: boolean;
    public tableInfo: any;
    public userId: string;

    constructor(
        private _router: Router,
        private _routeActivated: ActivatedRoute,
        private _userService: UserService,
        private _format: FormatFunctions,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _familyService: FamilyServiceService
    ) {
        this.nodata = true;

        this.familyMemberDetails = {
            id: '',
            name: '',
            lastname: '',
            email: '',
            phone: '',
            alias: '',
            address: '',
            units: '',
            status: '',
            memberSince: '',
            createdAt: '',
        };

        this.tableInfo = [];
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        this._routeActivated.queryParams.subscribe((params) => {
            this.userId = params['userid'];
            console.log('this.userId:', this.userId);

            if (this.userId) {
                this.getFamilyMemberDetails();
            }
        });
    }

    public data: any;
    public expandedRows = {};
    getFamilyMemberDetails() {
        this._familyService
            .getFamiliesByOwnerId(this.token, this.userId)
            .subscribe({
                next: (res) => {
                    this.nodata = true;
                    if (res.status == 'success') {
                        // console.log("************TABLE INFO************");
                        // console.log(res.message);
                        this.data = res.message;
                    } else {
                        this.nodata = false;
                    }
                },
                error: (err) => {
                    this.nodata = false;
                    console.error(err);
                },
            });
    }

    expandAll() {
        this.expandedRows = this.data.reduce((acc, item) => {
            acc[item._id] = true;
            return acc;
        }, {});
    }

    public memberId: string;
    setMemberId(property) {
        this.memberId = property._id;
    }

    collapseAll() {
        this.expandedRows = {};
    }

    getSeverity(status: string) {
        return this._format.getSeverity(status);
    }

    getMemberSince(date: string) {
        return this._format.dateFormat(date);
    }

    getAddres(address: any) {
        return `${address.condominioId.street_1}, 
    ${address.condominioId.street_2}, 
    ${address.condominioId.city},  
    ${address.condominioId.state}
    ${address.condominioId.province}
    ${address.condominioId.country}
    `;
    }

    public id_member: string;

    authSetting(property: any, id_property: any) {
        this._confirmationService.confirm({
            header: 'Confirmation',
            message: 'Please confirm to proceed moving forward.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this._messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'Authorization updated!',
                    life: 3000,
                });
                let authObject = {
                    familyId: property._id,
                    propertyId: id_property.condominioId._id,
                    status: id_property.family_status,
                };

                this._familyService
                    .updateFamilyAuth(this.token, authObject)
                    .subscribe({
                        next: (res) => {
                            this.getFamilyMemberDetails();
                        },
                        error: (err) => {
                            console.error(err);
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Action cancelled',
                    life: 3000,
                });
            },
        });
    }

    getSeverityAuth(status: string) {
        if (status == 'active') {
            return 'danger';
        } else {
            return 'primary';
        }
    }

    getLabelAuth(status: string) {
        if (status == 'active') {
            return 'Unauthorize';
        } else {
            return 'Authorize';
        }
    }
}
