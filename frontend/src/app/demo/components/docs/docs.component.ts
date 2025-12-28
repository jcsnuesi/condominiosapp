import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// PrimeNG modules

import { UserService } from '../../service/user.service';
import { DocsService } from '../../service/docs.service';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ImportsModule } from '../../imports_primeng';
import { FileUpload } from 'primeng/fileupload';
import { global } from '../../service/global.service';

@Component({
    selector: 'app-docs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ImportsModule,
        // PrimeNG

        HasPermissionsDirective,
    ],
    templateUrl: './docs.component.html',
    styleUrl: './docs.component.css',
    providers: [UserService, DocsService],
})
export class DocsComponent implements OnInit {
    /** Access control state */

    /** UI states */
    isLoading = false;
    isError = false;
    errorMessage = '';
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
        private _docsService: DocsService
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

    openInquiryDialog(): void {
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

    ngOnInit(): void {
        this.isAdmin();
        this.dialogHeader = 'Create New Documentation';
        this.loadDocuments();
    }

    isAdmin(): boolean {
        if (!this.identity?.role) {
            return false;
        }
        const adminRoles = ['ADMIN', 'STAFF_ADMIN', 'STAFF'];
        // return adminRoles.includes(this.identity.role.toUpperCase());
        return false;
    }
    /** Check ADMIN access using AuthService */
    // private checkAdminAccess(): boolean {
    //     try {
    //         const role: string | undefined = this._userService?.getRole?.();
    //         return (role || '').toUpperCase() === 'ADMIN';
    //     } catch {
    //         return false;
    //     }
    // }

    closeInquiryDialog(): void {
        if (
            this.docModel.title ||
            this.docModel.description ||
            this.selectedFiles.length > 0
        ) {
            this._confirmationService.confirm({
                message:
                    'Are you sure you want to cancel? All entered data and selected files will be lost.',
                header: 'Confirm Cancel',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes, Cancel',
                rejectLabel: 'Continue Editing',
                acceptButtonStyleClass: 'p-button-danger',
                accept: () => {
                    this.displayDocsDialog = false;
                    this.resetInquiryForm();
                },
            });
        } else {
            this.displayDocsDialog = false;
            this.resetInquiryForm();
        }
    }

    /**
     * Resetea el formulario de inquiry
     */
    private resetInquiryForm(): void {
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

    submitDocs() {
        const formData = new FormData();
        formData.append('title', this.docModel.title);
        formData.append('category', this.docModel.category);
        formData.append('condominiumId', this.docModel.condominiumId);
        formData.append('description', this.docModel.description);

        formData.append('uploadedBy', this.identity._id);
        formData.append(
            'uploadedRole',
            this.identity.role.charAt(0).toUpperCase() +
                this.identity.role.slice(1).toLowerCase()
        );
        this.selectedFiles.forEach((file) => {
            formData.append('file', file, file.name);
        });

        this._confirmationService.confirm({
            message: `Are you sure you want to upload the document "${this.docModel.title}"?`,
            header: 'Confirm Upload',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Upload',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this._docsService.createDoc(this.token, formData).subscribe({
                    next: (res) => {
                        this.loadDocuments();
                        this.displayDocsDialog = false;
                    },
                    error: (err) => {
                        console.error('Error creating document:', err);
                    },
                });
            },
            reject: () => {
                // console.log('Upload cancelled');
            },
        });
    }

    /** Load documents (service or mock) */
    public docModelTable: any;
    loadDocuments(): void {
        // const mockIfMissing = !this.docsService?.getDocuments;

        this._docsService.getDirectory(this.token, this.userId).subscribe({
            next: (res: any) => {
                console.log('Documents loaded:', res);
                this.docModelTable = res.message || [];
                this.isLoading = false;
            },
            error: () => {
                this.isError = true;
                this.errorMessage = 'Failed to load documents';
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

    /**
     * Descarga un archivo adjunto existente
     */
    downloadExistingAttachment(file: any): void {
        // Ajustar ruta según tu backend real
        console.log('Downloading attachment:', file);
        this._docsService
            .downloadFile(this.token, file.condoId, file.name)
            .subscribe({
                next: (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
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
            this.filePreviewUrls.delete(file.name);
            this.selectedFiles.splice(index, 1);

            this._messageService.add({
                severity: 'info',
                summary: 'File Removed',
                detail: `${file.name} has been removed`,
                life: 2000,
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
        console.log('Clearing all files');

        this._confirmationService.confirm({
            message: `Are you sure you want to remove all ${this.selectedFiles.length} file(s)?`,
            header: 'Confirm Clear',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Clear All',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
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
        });
    }

    onFileClear(): void {
        this.selectedFiles = [];
    }

    onUploadHandler(event: any): void {
        if (!this.uploadForm.valid || (event?.files?.length || 0) === 0) {
            return;
        }
        const file = event.files[0] as File;
        this.performUpload(file);
    }

    private performUpload(file: File): void {
        const { type, condominiumIds, description } = this.uploadForm.value;

        // const newDoc: DocumentItem = {
        //     id: 'new_' + Math.random().toString(36).slice(2),
        //     name: file.name.replace(/\.[^.]+$/, ''),
        //     type,
        //     condominiumIds: condominiumIds?.length ? condominiumIds : ['*'],
        //     uploadedDate: new Date(),
        //     uploadedBy: this.identity?.name || 'You',
        //     status: 'ACTIVE',
        //     url: '#',
        //     filename: file.name,
        //     description: description || '',
        // };

        // if (this.docsService?.uploadDocument) {
        //     const fd = new FormData();
        //     fd.append('type', type);
        //     fd.append('condominiumIds', JSON.stringify(condominiumIds));
        //     fd.append('description', description || '');
        //     fd.append('file', file);
        //     try {
        //         this.docsService.uploadDocument(fd).subscribe({
        //             next: (saved: DocumentItem) => {
        //                 this.docs.unshift(saved || newDoc);
        //                 this.resetUploadForm();
        //             },
        //             error: () => {
        //                 this.docs.unshift(newDoc);
        //                 this.resetUploadForm();
        //             },
        //         });
        //     } catch {
        //         this.docs.unshift(newDoc);
        //         this.resetUploadForm();
        //     }
        // } else {
        //     this.docs.unshift(newDoc);
        //     this.resetUploadForm();
        // }
    }

    private resetUploadForm(): void {
        this.uploadForm.reset({
            type: '',
            condominiumIds: [],
            description: '',
        });
        this.selectedFiles = [];
    }

    // ===== Actions: View, Download, Edit, Delete =====
    dialogHeader: string;
    onView(doc: any): void {
        this.dialogHeader = 'Document Details';
        this.docModel = doc;
        this.docModel.condominiumId = doc.condoId._id;
        this.docModel.category = doc.category;

        this.displayDocsDialog = true;
        this.selectedFiles = doc.file.map((f) => {
            const blob = new Blob([], { type: f.mimetype });
            const fileData = new File([blob], f.filename, { type: f.mimetype });
            fileData['condoId'] = doc.condoId._id;
            return fileData;
        });

        console.log(' this.  this.selectedFiles', this.selectedFiles);
        // if (doc.url && doc.url !== '#') {
        //     window.open(doc.url, '_blank');
        // }
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

    onEditSubmit(): void {
        if (!this.editForm.valid || !this.editingDoc) {
            return;
        }
        const values = this.editForm.value;
        // const updated: DocumentItem = {
        //     ...this.editingDoc,
        //     name: values.name,
        //     type: values.type,
        //     condominiumIds: values.condominiumIds,
        //     status: values.status,
        //     description: values.description || '',
        // };

        // if (this.docsService?.updateDocument) {
        //     try {
        //         this.docsService.updateDocument(updated.id, updated).subscribe({
        //             next: (saved: DocumentItem) => {
        //                 this.replaceDoc(saved || updated);
        //                 this.closeEditDialog();
        //             },
        //             error: () => {
        //                 this.replaceDoc(updated);
        //                 this.closeEditDialog();
        //             },
        //         });
        //     } catch {
        //         this.replaceDoc(updated);
        //         this.closeEditDialog();
        //     }
        // } else {
        //     this.replaceDoc(updated);
        //     this.closeEditDialog();
        // }
    }

    private replaceDoc(doc: DocumentItem): void {
        this.docs = this.docs.map((d) => (d.id === doc.id ? doc : d));
    }

    closeEditDialog(): void {
        this.editDialogVisible = false;
        this.editingDoc = null;
    }

    onDelete(doc: DocumentItem): void {
        // const ok = window.confirm(
        //     `Delete "${doc.name}"? This cannot be undone.`
        // );
        // if (!ok) return;
        // if (this.docsService?.deleteDocument) {
        //     try {
        //         this.docsService.deleteDocument(doc.id).subscribe({
        //             next: () => {
        //                 this.docs = this.docs.filter((d) => d.id !== doc.id);
        //             },
        //             error: () => {
        //                 this.docs = this.docs.filter((d) => d.id !== doc.id);
        //             },
        //         });
        //     } catch {
        //         this.docs = this.docs.filter((d) => d.id !== doc.id);
        //     }
        // } else {
        //     this.docs = this.docs.filter((d) => d.id !== doc.id);
        // }
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

    getFilePreview(file: File): string {
        return this.filePreviewUrls.get(file.name) || '';
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
    condominiumId: string; // Empty or ["*"] means all condominiums
    description: string;
    uploadedBy: string;
    uploadedRole: string;
    category: DocumentType;
    status: DocumentStatus;
    file?: BackendAttachment[];
}
