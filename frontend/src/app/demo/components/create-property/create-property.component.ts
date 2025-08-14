import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CardModule } from 'primeng/card';
import { RouterModule, Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PoolFileLoaderComponent } from '../pool-file-loader/pool-file-loader.component';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
    selector: 'app-create-property',
    standalone: true,
    imports: [
        PoolFileLoaderComponent,
        CommonModule,
        ToastModule,
        FormsModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        MultiSelectModule,
        FileUploadModule,
        CardModule,
        RouterModule,
        StepperModule,
        CalendarModule,
        RadioButtonModule,
        InputNumberModule,
        ConfirmDialogModule,
        TabMenuModule,
    ],
    templateUrl: './create-property.component.html',
    styleUrls: ['./create-property.component.css'],
    providers: [
        CondominioService,
        UserService,
        ConfirmationService,
        MessageService,
    ],
})
export class CreatePropertyComponent implements OnInit {
    public condominioModel: Condominio;
    public condoType: any[];
    public condoSelected: any;
    public countrySelector: any[] = [];
    public areas: any[] = [];
    public selectedAreas: any;
    public image: any;
    public status: any;
    public avatar: any;
    public token: string;
    public identity: any;
    public numberingType: string = 'numeric';
    public numberingOptions = [
        { label: 'Números (1, 2, 3...)', value: 'numeric' },
        { label: 'Números con ceros (001, 002, 003...)', value: 'padded' },
        { label: 'Letras (A, B, C...)', value: 'letters' },
    ];
    public startUnit: number = 1;
    public endUnit: number = 1;
    public totalUnits: number = 1;
    public fromLetter: string = 'A';
    public toLetter: string = 'Z';

    @ViewChild('fileInput') fileInput!: FileUpload;
    items: MenuItem[] | undefined;
    public visibleStepper: boolean;
    public fileInputData: {
        service_key: string;
        keys_to_add: string[];
        extras: any;
    };

    constructor(
        private _condominioService: CondominioService,
        private _userService: UserService,
        private _router: Router,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService
    ) {
        this.visibleStepper = true;
        this.condominioModel = new Condominio(
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
            [],
            [],
            null,
            new Date(),
            [],
            ''
        );

        this.image = '../../assets/noimage.jpeg';
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        if (this.identity.role == 'ADMIN') {
            this.condominioModel.user_id = this.identity._id;
        } else {
            this.condominioModel.user_id = this.identity.createdBy;
        }

        this.items = [
            {
                label: 'Basic Info',
                icon: 'pi pi-building',
                command: () => {
                    this.visibleStepper = true;
                },
            },
            {
                label: 'File Loader',
                icon: 'pi pi-file-excel',
                command: () => {
                    this.visibleStepper = false;
                },
            },
        ];

        this.fileInputData = {
            service_key: 'condoByFile',
            keys_to_add: ['createdBy'],
            extras: {
                createdBy: this.identity._id,
                required_cols: [
                    'alias',
                    'typeOfProperty',
                    'unit_type',
                    'start_lettler',
                    'end_lettler',
                    'start_range',
                    'end_range',
                    'phone',
                    'phone2',
                    'street_1',
                    'street_2',
                    'city',
                    'zipcode',
                    'province',
                    'country',
                    'mPayment',
                    'paymentDate',
                    'sector_name',
                    'createdBy',
                ],
            },
        };
    }

    ngOnInit(): void {
        this.status = 'showForm';

        this.lettersRangeVisible = false;
        this.condominioModel.country = 'Dominican Republic';

        this.condoType = [
            { property: 'House' },
            { property: 'Tower' },
            { property: 'Apartments' },
        ];

        this.countrySelector = [{ country: 'Dominican Republic' }];

        this.areas = [
            { areasOptions: 'Pool' },
            { areasOptions: 'Gym' },
            { areasOptions: 'Park' },
            { areasOptions: 'Playground' },
            { areasOptions: 'Guest parking' },
        ];

        this.lettersFormatted = [];
    }

    public lettersRangeVisible: boolean;
    public lettersFormatted: any[] = [];

    previewUnits(): void {
        let previewUnits: any = null;

        switch (this.numberingType) {
            case 'numeric':
                this.lettersFormatted = [];
                this.condominioModel.unitFormat = [];
                for (let i = this.startUnit; i <= this.endUnit; i++) {
                    this.lettersFormatted.push(i + ', ');
                    this.condominioModel.unitFormat.push(i + ', ');
                }
                break;
            case 'padded':
                this.condominioModel.unitFormat = [];
                for (let i = this.startUnit; i <= this.endUnit; i++) {
                    if (this.endUnit <= 99) {
                        this.lettersFormatted.push(
                            i.toString().padStart(3, '0') + ', '
                        );
                        this.condominioModel.unitFormat.push(
                            i.toString().padStart(3, '0') + ', '
                        );
                    } else {
                        this.lettersFormatted.push(i + ', ');
                        this.condominioModel.unitFormat.push(i + ', ');
                    }
                }

                break;
            case 'letters':
                let stopFindingWord = true;
                this.lettersRangeVisible = true;

                if (this.lettersRangeVisible) {
                    let counter = 1;
                    let letters = [];
                    this.lettersFormatted = [];
                    this.condominioModel.unitFormat = [];
                    this.toLetter = this.toLetter.toUpperCase();

                    while (stopFindingWord) {
                        if (
                            String.fromCharCode(64 + counter) === this.toLetter
                        ) {
                            stopFindingWord = false;
                        }
                        letters.push(String.fromCharCode(64 + counter));
                        counter++;
                    }

                    for (const word of letters) {
                        for (let index = 1; index <= this.endUnit; index++) {
                            if (index === this.endUnit) {
                                this.lettersFormatted.push(
                                    word +
                                        ' - ' +
                                        1 +
                                        '... ' +
                                        word +
                                        ' - ' +
                                        index
                                );
                            }
                            this.condominioModel.unitFormat.push(
                                `${word} - ${index}`
                            );
                        }
                    }
                }

                break;
            default:
                break;
        }
    }

    triggerFileUpload() {
        // Accedemos al componente y simulamos el clic
        this.fileInput.basicFileInput.nativeElement.click();
    }

    /**
     * Crear metodo para definir las numeraciones de las unidades:
     *  En caso se que comience con 001, 002, 003, etc.
     *  En caso se que comience con A, B, C, etc.
     *  En caso se que comience con 1, 2, 3, etc.
     * Crear el componente html para estas opciones
     */

    reloadWindows() {
        this._router.navigate(['/create-property']);
    }

    public areaSocialString: any;

    dateFormat(date: Date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        return year + '-' + month + '-' + day;
    }

    submit(condominiumForm: NgForm) {
        const formdata = new FormData();
        formdata.append(
            'avatar',
            this.avatar != null ? this.avatar : 'noimage.jpeg'
        );
        formdata.append('user_id', this.condominioModel.user_id);
        formdata.append('alias', this.condominioModel.alias);
        formdata.append(
            'typeOfProperty',
            this.condominioModel.typeOfProperty.property
        );
        formdata.append(
            'availableUnits',
            JSON.stringify(this.condominioModel.unitFormat)
        );
        formdata.append('phone', this.condominioModel.phone);
        formdata.append('phone2', this.condominioModel.phone2);
        formdata.append('street_1', this.condominioModel.street_1);
        formdata.append('street_2', this.condominioModel.street_2);
        formdata.append('sector_name', this.condominioModel.sector_name);
        formdata.append('city', this.condominioModel.city);
        formdata.append('zipcode', this.condominioModel.zipcode);
        formdata.append('province', this.condominioModel.province);
        formdata.append('country', this.condominioModel.country);
        formdata.append('mPayment', this.condominioModel.mPayment);
        formdata.append(
            'paymentDate',
            this.dateFormat(this.condominioModel.paymentDate)
        );
        this.condominioModel.socialAreas.forEach((areas) => {
            formdata.append('socialAreas', areas.areasOptions);
        });
        this._confirmationService.confirm({
            header: 'Confirmation',
            message: 'Please confirm to proceed moving forward.',
            icon: 'pi pi-exclamation-circle',
            acceptIcon: 'pi pi-check mr-1',
            rejectIcon: 'pi pi-times mr-1',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            rejectButtonStyleClass: 'p-button-outlined p-button-sm',
            acceptButtonStyleClass: 'p-button-sm',
            accept: () => {
                this._condominioService
                    .createCondominium(this.token, formdata)
                    .subscribe(
                        (response) => {
                            if (response.status == 'success') {
                                this.status = response.status;
                                condominiumForm.reset();
                                this.ngOnInit();
                                this.status = 'success';
                            }
                        },
                        (error) => {
                            console.error(error);
                        }
                    );
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

    onSelect(file: any) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;

            this.image = base64Data;
            this.status = 'true';

            setTimeout(() => {
                this.status = 'false';
            }, 3000);
        };

        reader.readAsDataURL(file.files[0]);
        this.avatar = file.files[0];
    }
}
