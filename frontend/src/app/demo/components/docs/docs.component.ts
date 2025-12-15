import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../service/user.service';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

@Component({
    selector: 'app-docs',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // PrimeNG
        TableModule,
        ButtonModule,
        DropdownModule,
        DialogModule,
        MultiSelectModule,
        TagModule,
        FileUploadModule,
        InputTextareaModule,
        InputTextModule,
        HasPermissionsDirective,
    ],
    templateUrl: './docs.component.html',
    styleUrl: './docs.component.css',
    providers: [UserService],
})
export class DocsComponent implements OnInit {
    /** Access control state */
    isAdmin = false;

    /** UI states */
    isLoading = false;
    isError = false;
    errorMessage = '';

    /** Upload form and Edit form */
    uploadForm!: FormGroup;
    editForm!: FormGroup;

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

    /** Options */
    readonly documentTypeOptions: { value: DocumentType; label: string }[] = [
        { value: 'RULE', label: 'Rule' },
        { value: 'NOTICE', label: 'Notice' },
        { value: 'REGULATION', label: 'Regulation' },
        { value: 'OTHER', label: 'Other' },
    ];
    readonly statusOptions: { value: DocumentStatus; label: string }[] = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
    ];

    // NOTE: The services are assumed to exist in the project.
    // Use proper types in your project; kept as `any` here to avoid coupling.
    constructor(
        private fb: FormBuilder,
        private _userService: UserService // private condominiumService: any
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        // this.isAdmin = this.checkAdminAccess();

        // Initialize forms early so template bindings are safe
        this.initForms();

        if (!this.isAdmin) {
            return; // Stop further loading for non-admin users
        }

        this.loadCondominiums();
        this.loadDocuments();
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

    /** Initialize reactive forms */
    private initForms(): void {
        this.uploadForm = this.fb.group({
            type: ['', Validators.required],
            condominiumIds: [[], Validators.required],
            description: [''],
        });

        this.editForm = this.fb.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            condominiumIds: [[], Validators.required],
            status: ['ACTIVE', Validators.required],
            description: [''],
        });
    }

    /** Load condominiums (service or mock) */
    private loadCondominiums(): void {
        // const mockIfMissing = !this.condominiumService?.listAllForAdmin;
        // if (mockIfMissing) {
        //     this.condominiums = [
        //         { id: 'c1', name: 'Residencial Arias III' },
        //         { id: 'c2', name: 'Conjunto Los Cedros' },
        //         { id: 'c3', name: 'Torres del Sol' },
        //     ];
        //     return;
        // }
        // this.isLoading = true;
        // try {
        //     this.condominiumService.listAllForAdmin().subscribe({
        //         next: (res: Condominium[]) => {
        //             this.condominiums = res || [];
        //             this.isLoading = false;
        //         },
        //         error: () => {
        //             this.isError = true;
        //             this.errorMessage = 'Failed to load condominiums';
        //             this.isLoading = false;
        //         },
        //     });
        // } catch {
        //     this.isError = true;
        //     this.errorMessage = 'Failed to load condominiums';
        //     this.isLoading = false;
        // }
    }

    /** Load documents (service or mock) */
    private loadDocuments(): void {
        // const mockIfMissing = !this.docsService?.getDocuments;
        if (true) {
            const now = new Date();
            this.docs = [
                {
                    id: 'd1',
                    name: 'Internal Rules 2025',
                    type: 'RULE',
                    condominiumIds: ['c1'],
                    uploadedDate: now,
                    uploadedBy: 'System Admin',
                    status: 'ACTIVE',
                    url: '#',
                    filename: 'internal_rules_2025.pdf',
                    description: 'Updated with latest policy changes.',
                },
                {
                    id: 'd2',
                    name: 'Maintenance Notice',
                    type: 'NOTICE',
                    condominiumIds: ['c2', 'c3'],
                    uploadedDate: new Date(now.getTime() - 86400000),
                    uploadedBy: 'Admin Cedros',
                    status: 'ACTIVE',
                    url: '#',
                    filename: 'maintenance_notice.docx',
                },
                {
                    id: 'd3',
                    name: 'Pool Usage Manual',
                    type: 'OTHER',
                    condominiumIds: ['*'],
                    uploadedDate: new Date(now.getTime() - 604800000),
                    uploadedBy: 'Admin Sol',
                    status: 'INACTIVE',
                    url: '#',
                    filename: 'pool_manual.pdf',
                },
            ];
            return;
        }

        this.isLoading = true;
        // try {
        //     this.docsService.getDocuments().subscribe({
        //         next: (res: DocumentItem[]) => {
        //             this.docs = res || [];
        //             this.isLoading = false;
        //         },
        //         error: () => {
        //             this.isError = true;
        //             this.errorMessage = 'Failed to load documents';
        //             this.isLoading = false;
        //         },
        //     });
        // } catch {
        //     this.isError = true;
        //     this.errorMessage = 'Failed to load documents';
        //     this.isLoading = false;
        // }
    }

    // ===== Upload handling via p-fileUpload (custom upload) =====
    onFileSelect(event: any): void {
        this.selectedFiles = event?.files || [];
    }

    onFileClear(): void {
        this.selectedFiles = [];
    }

    onFileRemove(event: any): void {
        const toRemove: File = event?.file;
        this.selectedFiles = this.selectedFiles.filter((f) => f !== toRemove);
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

        const newDoc: DocumentItem = {
            id: 'new_' + Math.random().toString(36).slice(2),
            name: file.name.replace(/\.[^.]+$/, ''),
            type,
            condominiumIds: condominiumIds?.length ? condominiumIds : ['*'],
            uploadedDate: new Date(),
            uploadedBy: this.identity?.name || 'You',
            status: 'ACTIVE',
            url: '#',
            filename: file.name,
            description: description || '',
        };

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
    onView(doc: DocumentItem): void {
        if (doc.url && doc.url !== '#') {
            window.open(doc.url, '_blank');
        }
    }

    onDownload(doc: DocumentItem): void {
        if (doc.url && doc.url !== '#') {
            const a = document.createElement('a');
            a.href = doc.url;
            a.download = doc.filename || doc.name;
            a.click();
        }
    }

    onEdit(doc: DocumentItem): void {
        this.editingDoc = { ...doc };
        this.editForm.patchValue({
            name: doc.name,
            type: doc.type,
            condominiumIds: doc.condominiumIds,
            status: doc.status,
            description: doc.description || '',
        });
        this.editDialogVisible = true;
    }

    onEditSubmit(): void {
        if (!this.editForm.valid || !this.editingDoc) {
            return;
        }
        const values = this.editForm.value;
        const updated: DocumentItem = {
            ...this.editingDoc,
            name: values.name,
            type: values.type,
            condominiumIds: values.condominiumIds,
            status: values.status,
            description: values.description || '',
        };

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
        const ok = window.confirm(
            `Delete "${doc.name}"? This cannot be undone.`
        );
        if (!ok) return;

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
            case 'NOTICE':
                return 'warning';
            case 'REGULATION':
                return 'success';
            default:
                return 'secondary';
        }
    }

    tagSeverityForStatus(status: DocumentStatus): string {
        return status === 'ACTIVE' ? 'success' : 'danger';
    }

    trackByDocId(_: number, item: DocumentItem): string {
        return item.id;
    }
}

/** Supported document types */
export type DocumentType = 'RULE' | 'NOTICE' | 'REGULATION' | 'OTHER';

/** Supported document statuses */
export type DocumentStatus = 'ACTIVE' | 'INACTIVE';

/** Condominium model */
export interface Condominium {
    id: string;
    name: string;
}

/** Document model */
export interface DocumentItem {
    id: string;
    name: string;
    type: DocumentType;
    condominiumIds: string[]; // Empty or ["*"] means all condominiums
    uploadedDate: Date;
    uploadedBy: string;
    status: DocumentStatus;
    url?: string;
    filename?: string;
    description?: string;
}
