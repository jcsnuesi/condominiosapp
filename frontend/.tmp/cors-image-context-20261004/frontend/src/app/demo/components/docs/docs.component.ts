import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
// PrimeNG modules

import { UserService } from '../../service/user.service';
import { DocsService } from '../../service/docs.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ImportsModule } from '../../imports_primeng';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { global } from '../../service/global.service';
import { finalize, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-docs',
    imports: [
        CommonModule,
        FormsModule,
        ImportsModule,
        // PrimeNG
    ],
    templateUrl: './docs.component.html',
    styleUrl: './docs.component.css',
    providers: [UserService, DocsService, MessageService, ConfirmationService],
})
export class DocsComponent implements OnInit {
    /** Access control state */

    /** UI states */
    isLoading = false;
    isError = false;
    errorMessage = '';
    submitError = '';
    viewMode: 'table' | 'cards' = 'cards';
    searchValue = '';
    public url: string;

    /** Upload form and Edit form */
    uploadForm!: any;
    editForm!: any;

    /** Selected files via p-fileUpload (custom upload) */
    selectedFiles: File[] = [];

    /** Dialog visibility and context */
    editDialogVisible = false;
    editingDoc: DocumentItem | null = null;

    /** Data sources */
    condominiums: Condominium[] = [];
    docs: DocumentItem[] = [];
    public identity: any;
    public token: string;
    public displayDocsDialog: boolean;
    public maxFileSize: number = 10 * 1024 * 1024; // 10MB
    filePreviewUrls: Map<string, string> = new Map();
    public docModel: DocumentItem;
    public condoOptions: [
        {
            label: string;
            value: string;
        }
    ];
    @Input() isDashboard: boolean;
    @Input() dataDocs: Array<{ value: string; label: string }>;
    @Input() userId: string;

    /** Options */
    readonly documentTypeOptions: { value: DocumentType; label: string }[] = [
        { value: 'RULE', label: 'Rule' },
        { value: 'SPENDING', label: 'Spending' },
        { value: 'REGULATION', label: 'Regulation' },
        { value: 'OTHER', label: 'Other' },
    ];
    readonly statusOptions: { value: DocumentStatus; label: string }[] = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
    ];

    // ============ VIEW CHILD FOR FILE UPLOADERS ============
    @ViewChild('fileUploader') fileUploader!: FileUpload;

    // NOTE: The services are assumed to exist in the project.
    // Use proper types in your project; kept as `any` here to avoid coupling.
    constructor(
        private _userService: UserService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _docsService: DocsService,
        private _activeRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.condoOptions = [{ label: 'Residencial Arias III', value: 'c1' }];
        this.docModel = {
            id: '',
            title: '',
            category: 'OTHER',
            condominiumId: '',

            uploadedBy: '',
            uploadedRole: '',
            status: 'Active',
            description: '',
        };
        this.url = global.url;
    }

    clearFilters(table: Table): void {
        this.searchValue = '';
        table.clear();
    }

    searchDocuments(value: string, table: Table): void {
        this.searchValue = value;
        table.filterGlobal(value, 'contains');
    }

    openInquiryDialog(): void {
        this.dialogHeader = 'Create New Documentation';
        this.btnLabel = 'Submit';
        this.submitError = '';
        this.selectedFiles = [];
        this.filePreviewUrls.clear();
        this.fileUploader?.clear();
        this.docModel = {
            id: '',
            title: '',
            category: 'OTHER',
            condominiumId: '',

            uploadedBy: '',
            uploadedRole: '',
            status: 'Active',
            description: '',
        };
        this.displayDocsDialog = true;
    }

    public isAdmin: boolean;
    ngOnInit(): void {
        this._activeRoute.params.subscribe((params) => {
            const userId = params['id'];

            if (Boolean(userId)) {
                this.userId = userId;
            }

            this.isAdmin = this._userService.isAdmin();
            this.docModelTable = [];

            setTimeout(() => this.loadDocuments());
        });
    }

    /**
     * Resetea el formulario de inquiry
     */
    resetDocForm(): void {
        this.submitError = '';
        this.loadDocuments();

        this.docModel = {
            id: '',
            title: '',
            category: 'OTHER',
            condominiumId: '',
            uploadedBy: '',
            uploadedRole: '',
            status: 'Active',
            description: '',
        };
        this.selectedFiles = [];
        this.filePreviewUrls.clear();
        if (this.fileUploader) {
            this.fileUploader.clear();
        }
    }

    updateDocs(): void {
        const formData = new FormData();
        formData.append('title', this.docModel.title);
        formData.append('category', this.docModel.category);
        formData.append('condominiumId', this.docModel.condominiumId);
        formData.append('status', this.docModel.status);
        formData.append('description', this.docModel.description);
        formData.append('uploadedBy', this.identity._id);
        formData.append(
            'uploadedRole',
            this.identity.role.charAt(0).toUpperCase() +
                this.identity.role.slice(1).toLowerCase()
        );
        let existingFileMetaData: any[] = [];
        this.selectedFiles.forEach((file) => {
            if (Object.hasOwn(file, 'condoId')) {
                existingFileMetaData.push({
                    filename: file.name,
                    size: file.size,
                    mimetype: file.type,
                    url: `/getDocsByName/${file['condoId']}/${file.name}`,
                });
            } else {
                formData.append('file', file, file.name);
            }
        });
        formData.append('existingFiles', JSON.stringify(existingFileMetaData));

        this._confirmationService.confirm({
            message: `Are you sure you want to update the document "${this.docModel.title}"?`,
            header: 'Confirm Update',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Update',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this._docsService
                    .updateDocument(this.docModel.id, formData)
                    .subscribe({
                        next: (res) => {
                            if (res.status === 'success') {
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: `Document updated successfully.`,
                                });

                                this.loadDocuments();
                                this.displayDocsDialog = false;
                            }
                        },
                        error: (err) => {
                            console.error('Error updating document:', err);
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: `Failed to update document.`,
                            });
                        },
                    });
            },
            reject: () => {
                console.log('Update cancelled');
            },
        });
    }

    saveDocument(form: NgForm): void {
        if (!this.isAdmin || this.loading) return;
        this.submitError = '';
        if (form.invalid) {
            form.control.markAllAsTouched();
            this.submitError = 'Complete all required fields before saving.';
            return;
        }
        if (this.docModel.id) {
            this.updateDocs();
        } else {
            this.submitDocs();
        }
    }

    submitDocs(): void {
        if (!this.isAdmin || this.loading) return;
        const condominiumId = this.isDashboard
            ? this.docModel.condominiumId
            : this.userId;
        if (!condominiumId || !this.docModel.title.trim() || !this.docModel.description.trim()) {
            this.submitError = 'Enter a title, description and condominium before submitting.';
            return;
        }
        this.submitError = '';
        const formData = new FormData();
        formData.append('title', this.docModel.title.trim());
        formData.append('category', this.docModel.category);
        formData.append('condominiumId', condominiumId);
        formData.append('status', this.docModel.status);
        formData.append('description', this.docModel.description.trim());
        formData.append('uploadedBy', this.identity._id);
        formData.append('uploadedRole', this.identity.role.charAt(0).toUpperCase() + this.identity.role.slice(1).toLowerCase());
        this.selectedFiles.forEach((file) => formData.append('file', file, file.name));

        this._confirmationService.confirm({
            message: `Are you sure you want to upload the document "${this.docModel.title}"?`,
            header: 'Confirm Upload',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Upload',
            rejectLabel: 'Cancel',
            accept: () => {
                if (this.loading) return;
                this.loading = true;
                this._docsService.createDoc(formData)
                    .pipe(finalize(() => {
                        this.loading = false;
                        this._changeDetectorRef.markForCheck();
                    }))
                    .subscribe({
                        next: (res) => {
                            if (res.status !== 'success') {
                                this.submitError = typeof res.message === 'string'
                                    ? res.message : 'Document could not be created. Please try again.';
                                return;
                            }
                            this._messageService.add({
                                severity: 'success', summary: 'Document created',
                                detail: 'The document was uploaded successfully.',
                            });
                            this.displayDocsDialog = false;
                        },
                        error: () => {
                            this.submitError = 'Document could not be created. Please try again.';
                        },
                    });
            },
        });
    }

    /** Load documents (service or mock) */
    public docModelTable: any;
    loadDocuments(): void {
        // const mockIfMissing = !this.docsService?.getDocuments;
        this._docsService.getDirectory(this.userId).subscribe({
            next: (res: any) => {
                console.log('Documents loaded:', res);
                if (res.status === 'success') {
                    this.docModelTable = res.message;
                    this.docModelTable.file = res.message.map((f: any) => {
                        f.file.forEach((file: any) => {
                            file.condoId = f.condoId._id;
                        });
                        return {
                            ...f,
                        };
                    });
                    this._changeDetectorRef.detectChanges();
                } else {
                    this.docModelTable = [];
                    this._changeDetectorRef.detectChanges();
                }

                this.isLoading = false;
            },
            error: () => {
                this.isError = true;
                this.errorMessage = 'Failed to load documents';
                this.docModelTable = [];
                this._changeDetectorRef.detectChanges();
                this.isLoading = false;
            },
        });
    }
    /**
     * Verifica si el tipo de archivo es aceptado
     */
    private isFileTypeAccepted(file: File): boolean {
        const acceptedExtensions = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'pdf',
            'doc',
            'docx',
            'txt',
        ];
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension ? acceptedExtensions.includes(extension) : false;
    }

    /**
     * Verifica si un archivo es imagen
     */
    isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }

    private generateFilePreview(file: File): void {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.filePreviewUrls.set(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    getFilePreview(file: File): string {
        return this.filePreviewUrls.get(file.name) || '';
    }

    /**
     * Descarga un archivo adjunto existente
     */
    downloadExistingAttachment(file: any): void {
        // Ajustar ruta según tu backend real

        this._docsService
            .downloadFile(file.condoId, file?.name ?? file?.filename)
            .subscribe({
                next: (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name ?? file.filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                error: (err) => {
                    console.error('Error downloading file:', err);
                },
            });
    }

    /**
     * Obtiene el ícono según el tipo de archivo
     */
    getFileIcon(fileType: string): string {
        if (fileType.startsWith('image/')) return 'pi pi-image';
        if (fileType.includes('pdf')) return 'pi pi-file-pdf';
        if (fileType.includes('word') || fileType.includes('document'))
            return 'pi pi-file-word';
        if (fileType.includes('text')) return 'pi pi-file';
        return 'pi pi-file';
    }
    /**
     * Obtiene el color del ícono según el tipo de archivo
     */
    getFileIconColor(fileType: string): string {
        if (fileType.startsWith('image/')) return '#4CAF50';
        if (fileType.includes('pdf')) return '#F44336';
        if (fileType.includes('word') || fileType.includes('document'))
            return '#2196F3';
        if (fileType.includes('text')) return '#9E9E9E';
        return '#607D8B';
    }

    /**
     * Obtiene la extensión del archivo
     */
    getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toUpperCase() || 'FILE';
    }

    /**
     * Elimina un archivo específico por índice
     */
    removeFile(index: number): void {
        const file = this.selectedFiles[index];
        if (file) {
            this._confirmationService.confirm({
                message: `Are you sure you want to remove ${file.name}?`,
                header: 'Confirm File Removal',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes, Remove',
                rejectLabel: 'Cancel',
                acceptButtonStyleClass: 'p-button-danger',
                accept: () => {
                    this.filePreviewUrls.delete(file.name);
                    this.selectedFiles.splice(index, 1);
                    // File removed
                    this._docsService
                        .deleteAttachment({
                            id: this.docModel.id,
                            filename: file.name,
                            condoId: this.docModel.condominiumId,
                        })
                        .subscribe({
                            next: (r: any) => {
                                if (r.status == 'success') {
                                    this._messageService.add({
                                        severity: 'info',
                                        summary: 'File Removed',
                                        detail: `${file.name} has been removed`,
                                        life: 2000,
                                    });
                                }
                            },
                            error: (err) => {
                                console.error('Error deleting file:', err);
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: `Failed to remove ${file.name}`,
                                });
                            },
                        });
                },
                reject: () => {
                    // Removal cancelled
                },
            });
        }
    }

    // ===== Upload handling via p-fileUpload (custom upload) =====
    onFileSelect(event: any): void {
        const files: File[] = event.files || event.currentFiles;

        for (const file of files) {
            // Validar tamaño
            if (file.size > this.maxFileSize) {
                this._messageService.add({
                    severity: 'error',
                    summary: 'File Too Large',
                    detail: `${file.name} exceeds 10MB limit`,
                });
                continue;
            }

            // Validar tipo de archivo
            if (!this.isFileTypeAccepted(file)) {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Invalid File Type',
                    detail: `${file.name} is not an accepted file type`,
                });
                continue;
            }

            // Agregar archivo si no existe
            if (!this.selectedFiles.find((f) => f.name === file.name)) {
                this.selectedFiles.push(file);

                // Generar preview para imágenes
                if (this.isImage(file)) {
                    this.generateFilePreview(file);
                }

                // // console.log('File selected:', file.name, file.size, file.type);
            }
        }

        // Actualizar contador
        this._messageService.add({
            severity: 'success',
            summary: 'Files Selected',
            detail: `${this.selectedFiles.length} file(s) ready to upload`,
            life: 3000,
        });
    }

    /**
     * Obtiene el tamaño total de todos los archivos
     */
    getTotalFilesSize(): string {
        const totalBytes = this.selectedFiles.reduce(
            (sum, file) => sum + file.size,
            0
        );
        return this.formatFileSize(totalBytes);
    }

    /**
     * Formatea el tamaño del archivo
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    }

    /**
     * Maneja la eliminación de un archivo
     */
    onFileRemove(event: any): void {
        const file = event.file;
        this.selectedFiles = this.selectedFiles.filter(
            (f) => f.name !== file.name
        );
        this.filePreviewUrls.delete(file.name);

        // console.log('File removed:', file.name);
    }

    clearAllFiles(): void {
        if (this.selectedFiles.length === 0) return;

        this._confirmationService.confirm({
            message: `Are you sure you want to remove all ${this.selectedFiles.length} file(s)?`,
            header: 'Confirm Clear',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Clear All',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                let metadata = this.selectedFiles.map((f) => ({
                    id: this.docModel.id,
                    filename: f.name,
                    condoId: this.docModel.condominiumId,
                }));

                this._docsService.deleteAllAttachments(metadata).subscribe({
                    next: (response: any) => {
                        console.log('All files deleted response:', response);
                        this.selectedFiles = [];
                        this.filePreviewUrls.clear();
                        if (this.fileUploader) {
                            this.fileUploader.clear();
                        }

                        this._messageService.add({
                            severity: 'success',
                            summary: 'Files Cleared',
                            detail: 'All files have been removed',
                        });
                    },
                    error: (err) => {
                        console.error('Error deleting all files:', err);
                    },
                });
            },
        });
    }

    onFileClear(): void {
        this.selectedFiles = [];
    }

    // ===== Actions: View, Download, Edit, Delete =====
    dialogHeader = 'Create New Documentation';
    btnLabel = 'Submit';
    async onView(doc: any): Promise<void> {
        this.submitError = '';
        this.dialogHeader = 'Document Details';
        this.btnLabel = 'Update';
        this.docModel = { ...doc };
        this.docModel.id = doc._id;
        this.docModel.condominiumId = doc.condoId._id;
        this.docModel.category = doc.category;

        this.displayDocsDialog = true;
        this.selectedFiles = await Promise.all(
            doc.file.map(async (f) => {
                const blob = await firstValueFrom(
                    this._docsService.downloadFile(
                        this.docModel.condominiumId,
                        f?.name ?? f?.filename
                    )
                );

                const fileData = new File([blob], f.filename, {
                    type: f.mimetype,
                    lastModified: Date.now(),
                });

                fileData['condoId'] = doc.condoId._id;

                if (this.isImage(fileData)) {
                    this.generateFilePreview(fileData);
                }

                return fileData;
            })
        );
    }

    onEdit(doc: DocumentItem): void {
        this.editingDoc = { ...doc };
        // this.editForm.patchValue({
        //     name: doc.name,
        //     type: doc.type,
        //     condominiumIds: doc.condominiumIds,
        //     status: doc.status,
        //     description: doc.description || '',
        // });
        this.editDialogVisible = true;
    }

    private replaceDoc(doc: DocumentItem): void {
        this.docs = this.docs.map((d) => (d.id === doc.id ? doc : d));
    }

    closeEditDialog(): void {
        this.editDialogVisible = false;
        this.editingDoc = null;
    }

    onDelete(doc: DocumentItem): void {
        this._confirmationService.confirm({
            message: `Are you sure you want to delete the document "${doc.title}"? This action cannot be undone.`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this._docsService.deleteDoc(doc.id).subscribe({
                    next: (res) => {
                        console.log('Delete response:', res);
                        if (res.status === 'success') {
                            this.docs = this.docs.filter(
                                (d) => d.id !== doc.id
                            );
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Deleted',
                                detail: `Document "${doc.title}" has been deleted.`,
                            });
                            this.displayDocsDialog = false;
                        }
                    },
                    error: (err) => {
                        console.error('Error deleting document:', err);
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to delete document "${doc.title}".`,
                        });
                    },
                });
            },
            reject: () => {
                console.log('Deletion cancelled');
                this._messageService.add({
                    severity: 'error',
                    summary: 'Cancelled',
                    detail: `Deletion of document "${doc.title}" was cancelled.`,
                });
            },
        });
    }

    // ===== Helpers =====
    isAllCondominiums(ids: string[]): boolean {
        return !ids || ids.length === 0 || ids.includes('*');
    }

    condoNamesFor(ids: string[]): string {
        if (this.isAllCondominiums(ids)) return 'All condominiums';
        const names = this.condominiums
            .filter((c) => ids.includes(c.id))
            .map((c) => c.name);
        return names.length ? names.join(', ') : '—';
    }

    tagSeverityForType(type: DocumentType): string {
        switch (type) {
            case 'RULE':
                return 'info';
            case 'SPENDING':
                return 'warning';
            case 'REGULATION':
                return 'success';
            default:
                return 'secondary';
        }
    }

    tagSeverityForStatus(status: DocumentStatus): string {
        return status === 'Active' ? 'success' : 'danger';
    }

    trackByDocId(_: number, item: DocumentItem): string {
        return item.id;
    }

    loading = false;
    /**
     * Limpia todos los archivos seleccionados
     */
    onFilesClear(): void {
        this.selectedFiles = [];
        this.filePreviewUrls.clear();
        // console.log('All files cleared');
    }
}

/** Supported document types */
export type DocumentType = 'RULE' | 'REGULATION' | 'OTHER' | 'SPENDING';

/** Supported document statuses */
export type DocumentStatus = 'Active' | 'Inactive';

/** Condominium model */
export interface Condominium {
    id: string;
    name: string;
}

interface BackendAttachment {
    filename: string;
    storedFilename: string;
    url: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}

/** Document model */
export interface DocumentItem {
    id: string;
    title: string;
    condominiumId: string;
    description: string;
    uploadedBy: string;
    uploadedRole: string;
    category: DocumentType;
    status: DocumentStatus;
    file?: BackendAttachment[];
}
