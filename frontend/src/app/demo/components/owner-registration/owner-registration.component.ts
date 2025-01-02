import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    AfterViewInit,
    viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { OwnerModel } from '../../models/owner.model';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { StepperModule } from 'primeng/stepper';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';

type MessageType = {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
    closeIcon?: string;
};

@Component({
    selector: 'app-owner-registration',
    standalone: true,
    imports: [
        CardModule,
        DropdownModule,
        StepsModule,
        MessagesModule,
        StepperModule,
        DialogModule,
        ConfirmDialogModule,
        IconFieldModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputTextModule,
        FileUploadModule,
        ButtonModule,
        ToastModule,
        FormsModule,
        CommonModule,
    ],
    providers: [
        CondominioService,
        UserService,
        MessageService,
        ConfirmationService,
    ],
    templateUrl: './owner-registration.component.html',
    styleUrl: './owner-registration.component.css',
})
export class OwnerRegistrationComponent implements OnInit {
    public ownerObj: OwnerModel;
    public image: any;
    private token: string;
    private identity: any;
    public apiUnitResponse!: boolean;
    public messageApiResponse: MessageType[] | undefined;

    public genderOption: any;
    public parkingOptions: any;
    public property_typeOptions: any[] = [];
    public indexStepper: number = 0;

    public addreesDetails: {
        street_1: string;
        street_2: string;
        sector_name: string;
        city: string;
        province: string;
        country: string;
    } = {
        street_1: '',
        street_2: '',
        sector_name: '',
        city: '',
        province: '',
        country: '',
    };
    @ViewChild('unitFormUno') basicInfo: NgForm;
    @ViewChild('unitFormDos') propertyInfo: NgForm;
    @ViewChild('stepperOw') stepsOwner: any;
    public items: any;

    public isRentOptions: { label: string; code: string }[] = [
        { label: 'Yes', code: 'yes' },
        { label: 'No', code: 'no' },
    ];

    constructor(
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();

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
            ''
        );

        this.messageApiResponse = [
            {
                detail: '',
                severity: '',
            },
        ];

        this.image = '../../assets/noimage.jpeg';
        this.apiUnitResponse = false;

        this.genderOption = [
            { label: 'Male', code: 'male' },
            { label: 'Female', code: 'female' },
        ];

        this.items = [
            {
                label: 'Personal Info',
            },
            {
                label: 'Reservation',
            },
            {
                label: 'Review',
            },
        ];
    }

    ngOnInit(): void {
        this.parkingOptions = [];

        let property = JSON.parse(localStorage.getItem('property'));

        this.ownerObj.propertyType = property.typeOfProperty.toUpperCase();

        for (let index = 1; index < 5; index++) {
            this.parkingOptions.push({ label: index, code: index });
        }
        // this.stepsOwner.start = 1;
        console.log(this.propertyInfo, 'STEPS');
        // Address Details - Card
        this.ownerObj.addressId = property._id;
        this.addreesDetails.street_1 = property.street_1;
        this.addreesDetails.street_2 = property.street_2;
        this.addreesDetails.sector_name = property.sector_name;
        this.addreesDetails.city = property.city;
        this.addreesDetails.province = property.province;
        this.addreesDetails.country = property.country;
    }

    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data;
        };

        reader.readAsDataURL(file.files[0]);
        this.ownerObj.avatar = file.files[0];
        console.log('Avatar loaded:', typeof this.ownerObj.avatar);
    }

    confirmNewOwner(event: Event) {
        this._confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.onSubmitUnit();
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

    onStepChange(event: number) {
        this.indexStepper = event;
    }

    resetStepper() {
        this.indexStepper = 0;
        this.apiUnitResponse = false;
    }
    onSubmitUnit() {
        const formData = new FormData();

        for (const key in this.ownerObj) {
            if (
                typeof this.ownerObj[key] === 'object' &&
                Boolean(this.ownerObj[key].code != undefined)
            ) {
                formData.append(key, this.ownerObj[key].code);
            } else if (key === 'avatar') {
                console.log('Avatar:', this.ownerObj.avatar);
                formData.append(
                    key,
                    Boolean(this.ownerObj.avatar != undefined)
                        ? this.ownerObj.avatar
                        : 'noimage.jpeg'
                );
            } else {
                formData.append(key, this.ownerObj[key]);
            }
        }
        this._condominioService.createOwner(this.token, formData).subscribe({
            next: (response) => {
                if (response.status == 'success') {
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
                        ''
                    );
                    this.ownerObj.avatar = '../../assets/noimage2.jpeg';
                    this.messageApiResponse.forEach((item) => {
                        item.detail = response.message;
                        item.severity = 'success';
                    });
                    this.indexStepper = 0;
                    this.image = '../../assets/noimage.jpeg';
                } else {
                    this.messageApiResponse.forEach((item) => {
                        item.detail = response.message;
                        item.severity = 'danger';
                    });
                }
                this.apiUnitResponse = true;
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

    reset(form: NgForm) {
        console.log(form.reset());
        // this.propertyInfo.reset();
    }

    alertStatus(form: NgForm) {
        if (this.apiUnitResponse) {
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
                ''
            );
            this.ownerObj.avatar = '../../assets/noimage2.jpeg';

            this.apiUnitResponse = false;
        } else {
            this.apiUnitResponse = true;
        }

        form.reset();
    }
}
