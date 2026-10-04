import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
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
import { BtnToggleStyle } from 'src/app/pipes/btnToggle';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'app-owner-profile-settings',
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
    ],
    templateUrl: './owner-profile-settings.component.html',
    styleUrl: './owner-profile-settings.component.css',
})
export class OwnerProfileSettingsComponent {
    @ViewChild('fileInput') fileInput!: FileUpload;

    public token: string;
    public identity: any;
    @Input() ownerObj: OwnerModel;
    @Input() isHome: boolean = false;
    @Input() condoId: string = '';

    private isSuccessResponse(response: any): boolean {
        return response?.success === true || response?.status === 'success';
    }

    @Output() ownerUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
    public genderOptions: Array<{ label: string }>;
    public passwordOwner: boolean = false;
    public avatarPreview: string = '';
    public _btnToggle = BtnToggleStyle.btnToggleDeleteActive;

    constructor(
        private _messageService: MessageService,
        private _userService: UserService,
        private _bookingService: BookingServiceService,
        private _ownerService: OwnerServiceService,
        private _invoiceService: InvoiceService,
        private _confirmationService: ConfirmationService,
        private _condominioService: CondominioService
    ) {
        // this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.genderOptions = [{ label: 'Male' }, { label: 'Female' }];

        if (this.identity?.role == 'OWNER') {
            this.passwordOwner = true;
        } else {
            this.passwordOwner = false;
        }
    }

    triggerFileUpload(): void {
        this.fileInput.basicFileInput.nativeElement.click();
    }

    inactivateOwner(ownerId: string, status: string) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Confirmation',
            message:
                'Are you sure you want to ' +
                (status == 'inactive' ? 'inactivate' : 'activate') +
                ' this owner?',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonStyleClass: 'p-button-danger  p-button-sm',
            accept: () => {
                this._condominioService
                    .inactiveOwnerFromCondo(ownerId, this.condoId, status)
                    .subscribe({
                        next: (response) => {
                            if (this.isSuccessResponse(response)) {
                                this._messageService.add({
                                    severity: 'success',
                                    summary:
                                        'Owner' +
                                        (status == 'inactive'
                                            ? ' Inactivated'
                                            : ' Activated'),
                                    detail:
                                        'You have ' +
                                        (status == 'inactive'
                                            ? 'inactivated'
                                            : 'activated') +
                                        ' this owner from the condominium',
                                    life: 5000,
                                });

                                this.ownerObj.status = status;
                                this.ownerUpdated.emit(true);
                            }
                        },
                        error: (error) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Owner was not inactivated',
                                detail: 'There was a problem on the server',
                                life: 5000,
                            });
                            console.log(error);
                        },
                    });
            },
            reject: () => {
                this._messageService.add({
                    severity: 'error',
                    summary:
                        status == 'inactive'
                            ? 'Owner not inactivated'
                            : 'Owner not activated',
                    detail:
                        status == 'inactive'
                            ? 'You have rejected the inactivation of this owner'
                            : 'You have rejected the activation of this owner',
                    life: 5000,
                });
            },
        });
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
                    .deactivateOwner({
                        _id: data._id,
                        condoId: data.condoId,
                        status:
                            data.status == 'inactive' ? 'active' : 'inactive',
                        ishome: this.isHome,
                    })
                    .subscribe({
                        next: (response) => {
                            console.log('response', data.status);
                            if (this.isSuccessResponse(response)) {
                                this._messageService.add({
                                    severity: 'success',
                                    summary:
                                        data.status == 'inactive'
                                            ? 'Profile Activated'
                                            : 'Profile Deactivated',
                                    detail:
                                        data.status == 'inactive'
                                            ? 'You have activated this profile'
                                            : 'You have deactivated this profile',
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
                        },
                    });
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

        this._ownerService.updateOwner(formData).subscribe({
            next: (response) => {
                if (this.isSuccessResponse(response)) {
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
            this.avatarPreview = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.ownerObj.avatar = file.files[0];
    }
}
