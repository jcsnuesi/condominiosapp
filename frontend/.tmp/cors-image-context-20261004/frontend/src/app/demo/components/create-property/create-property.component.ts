import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { FileUpload } from 'primeng/fileupload';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PoolFileLoaderComponent } from '../pool-file-loader/pool-file-loader.component';
import { ImportsModule } from '../../imports_primeng';
import { StepPanel } from 'primeng/stepper';

const DEFAULT_PROPERTY_IMAGE = 'assets/noimage.jpeg';

interface PropertyImageSelectEvent {
    files: File[];
}

@Component({
    selector: 'app-create-property',
    imports: [
        PoolFileLoaderComponent,
        CommonModule,
        RouterModule,
        FormsModule,
        ImportsModule,
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
    public readonly imagePreview = signal(DEFAULT_PROPERTY_IMAGE);
    public status: any;

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
    public activeTab: number = 0;
    public activeStep: number = 1;
    private selectedAvatar: File | null = null;

    @ViewChild('fileInput') fileInput!: FileUpload;
    @ViewChild('stepperP') stepperP!: StepPanel;

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
        this.identity = this._userService.getIdentity();

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

        this.condominioModel = this.createInitialCondominium();

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
    public lettersFormatted: Array<any>;

    previewUnits(): void {
        this.lettersFormatted = [];
        this.condominioModel.unitFormat = [];
        switch (this.numberingType) {
            case 'numeric':
                for (let i = this.startUnit; i <= this.endUnit; i++) {
                    this.lettersFormatted.push(i);
                    this.condominioModel.unitFormat.push(i.toString());
                }
                break;
            case 'padded':
                this.condominioModel.unitFormat = [];
                for (let i = this.startUnit; i <= this.endUnit; i++) {
                    if (this.endUnit <= 99) {
                        this.lettersFormatted.push(
                            i.toString().padStart(3, '0')
                        );
                        this.condominioModel.unitFormat.push(
                            i.toString().padStart(3, '0')
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
            this.selectedAvatar ??
                this.condominioModel.avatar ??
                'noimage.jpeg'
        );
        formdata.append('user_id', this.condominioModel.user_id);
        formdata.append('alias', this.condominioModel.alias);
        formdata.append(
            'typeOfProperty',
            this.condominioModel.typeOfProperty.property
        );
        this.condominioModel.unitFormat.forEach((units) => {
            formdata.append('availableUnits', units);
        });

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
                this._condominioService.createCondominium(formdata).subscribe({
                    next: (response) => {
                        if (response.status == 'success') {
                            this.status = response.status;

                            this._messageService.add({
                                severity: 'success',
                                summary: 'Created',
                                detail: 'Condominium created successfully',
                                life: 3000,
                            });
                            this.resetPropertyForm(condominiumForm);
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to create condominium',
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        console.error(error);
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create condominium',
                            life: 3000,
                        });
                    },
                });
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

    onSelect(event: PropertyImageSelectEvent): void {
        const selectedFile = event.files?.[0];
        if (!selectedFile) return;

        this.selectedAvatar = selectedFile;
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                this.imagePreview.set(reader.result);
            }
        };
        reader.onerror = () => {
            this.imagePreview.set(DEFAULT_PROPERTY_IMAGE);
            this.selectedAvatar = null;
            this.fileInput?.clear();
            this._messageService.add({
                severity: 'error',
                summary: 'Invalid image',
                detail: 'The selected image could not be previewed.',
                life: 3000,
            });
        };

        reader.readAsDataURL(selectedFile);
    }

    private createInitialCondominium(): Condominio {
        const condominium = new Condominio(
            'noimage.jpeg',
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

        condominium.user_id =
            this.identity.role === 'ADMIN'
                ? this.identity._id
                : this.identity.createdBy;
        condominium.country = 'Dominican Republic';

        return condominium;
    }

    private resetPropertyForm(condominiumForm: NgForm): void {
        condominiumForm.resetForm();
        this.condominioModel = this.createInitialCondominium();
        this.imagePreview.set(DEFAULT_PROPERTY_IMAGE);
        this.selectedAvatar = null;
        this.fileInput?.clear();
        this.activeStep = 1;
        this.numberingType = 'numeric';
        this.startUnit = 1;
        this.endUnit = 1;
        this.totalUnits = 1;
        this.fromLetter = 'A';
        this.toLetter = 'Z';
        this.lettersRangeVisible = false;
        this.lettersFormatted = [];
    }
}
