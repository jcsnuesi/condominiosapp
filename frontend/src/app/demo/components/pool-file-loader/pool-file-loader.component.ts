import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportsModule } from '../../imports_primeng';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OwnerServiceService } from '../../service/owner-service.service';
import { UserService } from '../../service/user.service';
import { CondominioService } from '../../service/condominios.service';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'app-pool-file-loader',
    standalone: true,
    imports: [ImportsModule, CommonModule, FormsModule],
    providers: [ConfirmationService, UserService, CondominioService],
    templateUrl: './pool-file-loader.component.html',
    styleUrl: './pool-file-loader.component.scss',
})
export class PoolFileLoaderComponent {
    public token: string;
    @Input() services: {
        service_key: string;
        keys_to_add: string[];
        extras: any;
    }; // Controla la visibilidad del stepper
    @ViewChild('fileSelected') fileSelected: FileUpload;
    public lettersFormatted: string[] = [];
    public service: any;

    constructor(
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
        private _ownerService: OwnerServiceService,
        private _userService: UserService,
        private _condominioService: CondominioService
    ) {
        this.token = this._userService.getToken();
        this.service = {
            ownersByFile: this._ownerService.createMultipleUnitsOwners.bind(
                this._ownerService
            ),
            condoByFile: this._condominioService.createMultipleCondo.bind(
                this._condominioService
            ),
        };
    }

    // Hacer dinamico el envio de datos al backend
    createMultipleByFile(): void {
        this._confirmationService.confirm({
            message:
                '¿Estás seguro de que deseas crear múltiples propietarios?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-success',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                // Acción a realizar si se acepta la confirmación
                this.service[this.services.service_key](
                    this.token,
                    this.multipleOwners
                ).subscribe({
                    next: (response) => {
                        // console.log('response:--------------->', response);
                        if (response.status == 'success') {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Units Created',
                                life: 3000,
                            });
                        } else {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to create units',
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        // console.log(error);
                        this._messageService.add({
                            severity: 'error',
                            summary: error || 'Error',
                            detail: 'Failed to create units',
                            life: 3000,
                        });
                    },
                });
            },
            reject: () => {
                // Acción a realizar si se rechaza la confirmación
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Action Cancelled',
                    detail: 'Users were not created.',
                    life: 3000,
                });
            },
        });
    }

    public multipleOwners: any[] = [];
    onSelect(event: any): void {
        const file: File = event.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;
            if (!result) return;

            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            });

            if (jsonData.length < 2) {
                // console.log([]);
                return;
            }

            // console.log(jsonData);
            const [headers, ...rows] = jsonData;
            if (this.services.keys_to_add.length > 0) {
                this.services.keys_to_add.forEach((key) => {
                    if (!headers.includes(key)) {
                        headers.push(key);
                    }
                });
            }

            const results = rows
                .filter((row) => row.length > 0)
                .map((row) => {
                    return Object.fromEntries(
                        headers.map((h, i) => this.fileValidation(h, row[i]))
                    );
                });

            // Darle formato a cada unidad por condominio
            results.forEach((item) => {
                this.previewUnits(item);
            });
            this.multipleOwners = results;

            console.log('results: ', this.multipleOwners);
        };

        reader.readAsArrayBuffer(file);
    }

    public colValidation: string[] = [];
    fileValidation(k: string, v: string): Array<string> {
        if (this.services.keys_to_add.includes(k)) {
            return [k, this.services.extras[k]];
        }

        if (
            Boolean(
                this.services.extras.required_cols &&
                    this.services.extras.required_cols.length > 0 &&
                    this.services.extras.required_cols.includes(k) &&
                    !this.isEmptyAfterCoercion(v)
            )
        ) {
            return [k, v];
        } else {
            this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Hay registros sin datos válidos.`,
                life: 3000,
            });
            throw Error(`Hay registros sin datos válidos.`);
        }
    }

    // Esto captura null y undefined como strings vacíos tras trim()
    isEmptyAfterCoercion(value) {
        return String(value ?? '').trim() === '';
    }

    previewUnits(formatUnit): void {
        this.lettersFormatted = [];
        // console.log('formatUnit: ', formatUnit);
        switch (formatUnit.unit_type) {
            case 'numbers':
                for (
                    let i = formatUnit.start_range;
                    i <= formatUnit.end_range;
                    i++
                ) {
                    this.lettersFormatted.push(i.toString());
                }
                formatUnit.availableUnits = this.lettersFormatted;
                // // console.log(this.lettersFormatted);
                break;
            case 'numbers_with_zeros':
                for (
                    let i = formatUnit.start_range;
                    i <= formatUnit.end_range;
                    i++
                ) {
                    this.lettersFormatted.push(i);
                }

                formatUnit.availableUnits = this.lettersFormatted;
                // // console.log(this.lettersFormatted);
                break;
            case 'letters':
                const abecedario: Set<string> = new Set(
                    'abcdefghijklmnopqrstuvwxyz'.split('')
                );

                for (const word of abecedario) {
                    for (
                        let index = 1;
                        index <= formatUnit.end_range;
                        index++
                    ) {
                        this.lettersFormatted.push(
                            `${word.toUpperCase()} - ${index}`
                        );
                    }

                    if (word == formatUnit.end_lettler) {
                        break;
                    }
                }

                formatUnit.availableUnits = this.lettersFormatted;

                break;
            default:
                break;
        }
    }
}
