import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ImportsModule } from '../../imports_primeng';
import { CondominioService } from '../../service/condominios.service';
import { InvoiceService } from '../../service/invoice.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { UserService } from '../../service/user.service';
import { BookingServiceService } from '../../service/booking-service.service';
import { OwnerModel } from '../../models/owner.model';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-owner-profile-settings',
    standalone: true,
    imports: [
        ImportsModule,
        CommonModule,
        FormsModule,
        TableModule,
        HasPermissionsDirective,
    ],
    providers: [
        CondominioService,
        UserService,
        OwnerServiceService,
        InvoiceService,
        ConfirmationService,
        MessageService,
    ],
    templateUrl: './owner-profile-settings.component.html',
    styleUrl: './owner-profile-settings.component.css',
})
export class OwnerProfileSettingsComponent {
    public token: string;
    public identity: any;
    @Input() ownerObj: OwnerModel;

    @Output() ownerUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
    public genderOptions: Array<{ label: string }>;
    public passwordOwner: boolean = false;

    constructor(
        private _messageService: MessageService,
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _confirmationService: ConfirmationService,
        private _condominioService: CondominioService
    ) {
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
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.genderOptions = [{ label: 'Male' }, { label: 'Female' }];

        if (this.identity.role == 'OWNER') {
            this.passwordOwner = true;
        } else {
            this.passwordOwner = false;
        }
    }

    delAccount(data: any) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Confirmation',
            message: 'Do you want to delete this profile?',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonStyleClass: 'p-button-danger  p-button-sm',
            accept: () => {
                this._ownerService
                    .deactivateOwner(this.token, {
                        _id: data._id,
                        status:
                            data.status == 'inactive' ? 'active' : 'inactive',
                    })
                    .subscribe({
                        next: (response) => {
                            if (response.status == 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Profile Deleted',
                                    detail: 'You have deleted this profile',
                                    life: 3000,
                                });
                                this.ownerUpdated.emit(true);
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Action was not completed',
                                detail: 'There is a problem on the server',
                                life: 3000,
                            });
                            console.log(error);
                        },
                    });

                console.log(data);
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Profile not deleted',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    confirmUpdate(event: Event) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Confirmation',
            message: 'Please confirm to proceed moving forward.',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-  mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                this.onUpdate();
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    onUpdate() {
        const formData = new FormData();

        for (const key in this.ownerObj) {
            if (
                typeof this.ownerObj[key] === 'object' &&
                Boolean(this.ownerObj[key].label != undefined)
            ) {
                formData.append(key, this.ownerObj[key].label);
            } else if (key === 'avatar') {
                formData.append(key, this.ownerObj.avatar);
            } else {
                formData.append(key, this.ownerObj[key]);
            }
        }

        this._ownerService.updateOwner(this.token, formData).subscribe({
            next: (response) => {
                if (response.status == 'success') {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'User Updated',
                        detail: 'You have updated this user',
                        life: 5000,
                    });
                }
            },
            error: (error) => {
                this._messageService.add({
                    severity: 'error',
                    summary: 'User was not updated',
                    detail: 'There was a problem on the server',
                    life: 5000,
                });
                console.log(error);
            },
        });
    }

    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.ownerObj.avatarPreview = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.ownerObj.avatar = file.files[0];
    }
}
