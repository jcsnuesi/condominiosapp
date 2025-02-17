import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { global } from '../../service/global.service';

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
    avatar?: string;
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
    providers: [
        UserService,
        FormatFunctions,
        MessageService,
        ConfirmationService,
    ],
    templateUrl: './family-member-details.component.html',
    styleUrl: './family-member-details.component.css',
})
export class FamilyMemberDetailsComponent implements OnInit {
    public token: string;
    public urlId: string;
    public familyMemberDetails: FamilyMemberDetails;
    public nodata: boolean;
    public tableInfo: any;
    public userId: string;
    public identity: any;
    public url: string;
    @Output() memberInfo: EventEmitter<any> = new EventEmitter();

    constructor(
        private _router: Router,
        private _routeActivated: ActivatedRoute,
        private _userService: UserService,
        private _format: FormatFunctions,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _familyService: FamilyServiceService
    ) {
        this.nodata = false;
        this.url = global.url;

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
            avatar: '',
        };

        this.tableInfo = [];
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
    }

    ngOnInit(): void {
        this._routeActivated.params.subscribe((params) => {
            if (params['dashid']) {
                this.userId = params['dashid'];
            } else {
                this._routeActivated.queryParams.subscribe((param) => {
                    this.userId = param['userid'];
                });
            }

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
                    if (res.status == 'success') {
                        this.nodata = false;
                        // console.log('************TABLE INFO************');
                        // console.log(res.message);
                        this.data = res.message;
                    } else {
                        this.nodata = true;
                    }
                },
                error: (err) => {
                    this.nodata = true;
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

    getMemberSince(date: string) {
        return this._format.dateFormat(date);
    }

    getAddres(address: any) {
        return `${address.addressId.street_1}, 
    ${address.addressId.street_2}, 
    ${address.addressId.city},  
    ${address.addressId.sector_name}
    ${address.addressId.province}
    ${address.addressId.country}
    `;
    }

    settingsMember(property: any) {
        let propertyData = { ...property };
        this.memberInfo.emit({ show: true, data: propertyData });
    }

    public id_member: string;
    authSetting(condoInfo: any, propertyInfo: any) {
        this._confirmationService.confirm({
            header: 'Confirmation',
            message: 'Please confirm to proceed moving forward.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass:
                'p-button-outlined p-button-sm p-button-danger',
            accept: () => {
                let authObject = {
                    familyId: propertyInfo._id,
                    propertyId: condoInfo.addressId._id,
                    status: condoInfo.family_status,
                };

                this._familyService
                    .updateFamilyAuth(this.token, authObject)
                    .subscribe({
                        next: (res) => {
                            if (res.status == 'success') {
                                this._messageService.add({
                                    severity: 'info',
                                    summary: 'Confirmed',
                                    detail: 'Authorization updated!',
                                    life: 3000,
                                });

                                this.getFamilyMemberDetails();
                            } else {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'error',
                                    detail: res.message,
                                    life: 3000,
                                });
                            }
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'error',
                                detail: err.error.message,
                                life: 3000,
                            });
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
}
