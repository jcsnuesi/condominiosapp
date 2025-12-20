import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter, // ← NUEVO
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload'; // ← NUEVO
import { MultiSelectModule } from 'primeng/multiselect'; // ← NUEVO
import { MessageService, ConfirmationService } from 'primeng/api';
import { InquiryService } from '../../service/inquiry.service';
import { UserService } from '../../service/user.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { FileUpload } from 'primeng/fileupload'; // ← NUEVO
import { CondominioService } from '../../service/condominios.service';
import { global } from '../../service/global.service';
import { HttpClient } from '@angular/common/http';
import { OwnerServiceService } from '../../service/owner-service.service';

// ============ INTERFACES ACTUALIZADAS ============

interface RespondedByUser {
    _id: string;
    name: string;
    lastname?: string;
    email?: string;
    role?: string;
    phone?: string;
    position?: string;
}

interface InquiryResponse {
    _id?: string;
    message: string;
    respondedBy: RespondedByUser;
    respondedByModel?: string;
    respondedByRole: string;
    isAdminResponse: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

interface Inquiry {
    _id?: string;
    title: string;
    content: string;
    category: string;
    unitId?: string | { label: string; value: string };
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'sent' | 'responded' | 'closed';
    createdBy: string;
    condominiumId: string;
    responses?: InquiryResponse[];
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    closedAt?: Date;
    closedBy?: RespondedByUser;
    createdInquiryBy?: string;
}

interface Notice {
    _id?: string;
    title: string;
    content: string;
    type:
        | 'general'
        | 'maintenance'
        | 'payment'
        | 'event'
        | 'emergency'
        | 'parking'; // ← ACTUALIZADO
    priority: 'low' | 'medium' | 'high' | 'urgent';
    condominiumId: string;
    targetAudience?: 'all' | 'owners' | 'family' | 'specific';
    isRead?: boolean;
    attachments?: string[];
    createdAt?: Date;
    expiresAt?: Date;
}

// ← NUEVA INTERFACE
interface NewNotice {
    _id?: string;
    title: string;
    content: string;
    type:
        | 'general'
        | 'maintenance'
        | 'payment'
        | 'event'
        | 'emergency'
        | 'parking';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    condominiumId: string;
    targetAudience: 'all' | 'owners' | 'family' | 'specific';
    specificRecipients?: string[];
    expiresAt?: Date;
    publishImmediately?: boolean;
    attachments?: File[] | string[]; // ← Updated to accept both types
    publishedAt?: Date | null;
    createdBy?: string;
    createdInquiryBy?: string;
    isActive?: boolean;
}

// ← NEW INTERFACE for backend attachments
interface BackendAttachment {
    filename: string;
    storedFilename: string;
    url: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}

@Component({
    selector: 'app-inquiry',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MenuModule,
        ButtonModule,
        CardModule,
        TabViewModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        DialogModule,
        TagModule,
        TimelineModule,
        BadgeModule,
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        PaginatorModule,
        TooltipModule,
        CalendarModule,
        CheckboxModule,
        FileUploadModule, // ← NUEVO
        MultiSelectModule, // ← NUEVO
    ],
    providers: [
        MessageService,
        ConfirmationService,
        InquiryService,
        UserService,
        FormatFunctions,
        OwnerServiceService,
    ],
    templateUrl: './inquiry.component.html',
    styleUrl: './inquiry.component.css',
})
export class InquiryComponent implements OnInit, OnChanges {
    // ============ VIEW CHILD FOR FILE UPLOADERS ============
    @ViewChild('fileUploader') fileUploader!: FileUpload;
    @ViewChild('noticeFileUploader') noticeFileUploader!: FileUpload; // ← AÑADIR

    // ============ DIALOG CONTROLS ============
    displayInquiryDialog: boolean = false;
    displayInquiryDetailDialog: boolean = false;
    displayNoticeDialog: boolean = false;
    displayCreateNoticeDialog: boolean = false; // ← NUEVO

    // ============ DATA ARRAYS ============
    inquiries: Inquiry[] = [];
    notices: Notice[] = [];
    selectedInquiry: Inquiry | null = null;

    // ============ FORM DATA ============
    newInquiry: Inquiry = {
        title: '',
        content: '',
        category: '',
        priority: 'medium',
        status: 'sent',
        createdBy: '',
        condominiumId: '',
        createdInquiryBy: '',
    };

    // ← NUEVO: Notice form data
    newNotice: NewNotice = {
        title: '',
        content: '',
        type: 'general',
        priority: 'medium',
        condominiumId: '',
        targetAudience: 'all',
        publishImmediately: true,
        attachments: [], // ← AÑADIR
    };

    // Response to inquiry
    newResponse: string = '';

    // ============ LOADING STATES ============
    loading: boolean = false;
    isSendingResponse: boolean = false;
    isClosingInquiry: boolean = false;
    isReopeningInquiry: boolean = false;
    isCreatingNotice: boolean = false; // ← NUEVO
    loadingCondoUsers: boolean = false; // ← NUEVO

    // ============ FILTERS AND PAGINATION ============
    inquiryStatusFilter: string = 'all';
    noticeTypeFilter: string = 'all';

    inquiryRows: number = 10;
    inquiryFirst: number = 0;
    noticeRows: number = 10;
    noticeFirst: number = 0;

    // ← NUEVO: Min expiration date
    minExpirationDate: Date = new Date();

    // ============ DROPDOWN OPTIONS ============
    categoryOptions = [
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Payment Issues', value: 'payment' },
        { label: 'Noise Complaint', value: 'noise' },
        { label: 'Security', value: 'security' },
        { label: 'Common Areas', value: 'common-areas' },
        { label: 'Parking', value: 'parking' },
        { label: 'Other', value: 'other' },
    ];

    priorityOptions = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
    ];

    statusOptions = [
        { label: 'All', value: 'all' },
        { label: 'Sent', value: 'sent' },
        { label: 'Responded', value: 'responded' },
        { label: 'Closed', value: 'closed' },
    ];

    noticeTypeOptions = [
        { label: 'All', value: 'all' },
        { label: 'General', value: 'general' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Payment', value: 'payment' },
        { label: 'Event', value: 'event' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Parking', value: 'parking' }, // ← NUEVO
    ];

    // ← NUEVO: Notice type options for creation
    noticeTypeOptionsForCreate = [
        {
            label: 'General Announcement',
            value: 'general',
            icon: 'pi pi-info-circle',
        },
        {
            label: 'Maintenance Work',
            value: 'maintenance',
            icon: 'pi pi-wrench',
        },
        {
            label: 'Payment Reminder',
            value: 'payment',
            icon: 'pi pi-money-bill',
        },
        { label: 'Event Notification', value: 'event', icon: 'pi pi-calendar' },
        {
            label: 'Emergency Alert',
            value: 'emergency',
            icon: 'pi pi-exclamation-triangle',
        },
        { label: 'Parking Notice', value: 'parking', icon: 'pi pi-car' },
    ];
    // ← NUEVO: Target audience options
    targetAudienceOptions = [
        {
            label: 'All Residents',
            value: 'all',
            icon: 'pi pi-users',
            description: 'Send to all owners and family',
        },
        {
            label: 'Owners Only',
            value: 'owners',
            icon: 'pi pi-user',
            description: 'Send only to property owners',
        },
        {
            label: 'Family Only',
            value: 'family',
            icon: 'pi pi-home',
            description: 'Send only to family',
        },
        {
            label: 'Specific Users',
            value: 'specific',
            icon: 'pi pi-user-edit',
            description: 'Select specific recipients',
        },
    ];

    // ← NUEVO: Condominium users for specific targeting
    condoUsersOptions: { label: string; value: string; role: string }[] = [];

    // ============ STATISTICS ============
    inquiryStats = {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
    };

    unreadNoticesCount: number = 0;

    // ============ USER DATA ============
    public identity: any;
    public token: any;
    @Input() condoId: string = '';
    @Input() isHome: boolean = false;
    @Input() dataDialog: any;
    @Output() clearSelectedInquiryDialog: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    public url: string;

    constructor(
        private _inquiryService: InquiryService,
        private _userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _formatFunctions: FormatFunctions,
        private _ownerService: OwnerServiceService,
        private http: HttpClient // ← ADD
    ) {
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();

        this.url = global.url;
    }

    ngOnInit(): void {
        this.loadInquiries();
        this.loadNotices();
        this.getFilteredInquiries();
        if (
            this.identity.role.toUpperCase() === 'OWNER' ||
            this.identity.role.toUpperCase() === 'FAMILY'
        ) {
            this.getCondoAndUnitInfo();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['dataDialog'] && this.dataDialog) {
            var condoId = changes['dataDialog'].currentValue._id;
            this.identity = changes['dataDialog'].currentValue.identity;
            setTimeout(() => {
                let data_filtered = this.inquiries.find(
                    (inquiry) => inquiry._id === condoId
                );
                if (data_filtered) {
                    this.selectedInquiry = data_filtered;

                    this.displayInquiryDetailDialog =
                        changes['dataDialog'].currentValue.visible;
                }
            }, 500);
        }
    }

    // ============ USER MANAGEMENT ============

    isAdmin(): boolean {
        if (!this.dataDialog?.identity?.role) {
            return false;
        }
        const adminRoles = ['ADMIN', 'STAFF_ADMIN', 'STAFF'];
        return adminRoles.includes(this.dataDialog.identity.role.toUpperCase());
    }

    private getModelNameFromRole(role: string): string {
        const roleToModel: { [key: string]: string } = {
            ADMIN: 'Admin',
            STAFF_ADMIN: 'Staff_Admin',
            STAFF: 'Staff',
            OWNER: 'Owner',
            FAMILY: 'Family',
        };
        return roleToModel[role.toUpperCase()] || 'Owner';
    }

    // ============ INQUIRY MANAGEMENT ============

    loadInquiries(): void {
        this.loading = true;

        this._inquiryService
            .getOwnerInquiries(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    this.inquiries = response.data.docs || [];
                    this.calculateInquiryStats();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading inquiries:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load inquiries',
                    });
                    this.loading = false;
                },
            });
    }

    public condoOptions: any[] = [];
    public unitOptions: any[] = [];
    getCondoAndUnitInfo(): void {
        this._ownerService
            .getPropertyByOwner(this.token, this.identity._id)
            .subscribe({
                next: (response) => {
                    if (response.status === 'success') {
                        this.condoOptions =
                            response.message.propertyDetails.map(
                                (property: any) => {
                                    return {
                                        label: property.addressId.alias,
                                        value: property.addressId._id,
                                    };
                                }
                            );

                        this.unitOptions = response.message.propertyDetails.map(
                            (property: any) => {
                                return {
                                    label: property.condominium_unit,
                                    value: property.condominium_unit,
                                };
                            }
                        );
                    }
                },
                error: (error) => {
                    console.error('Error loading property info:', error);
                },
            });
    }

    calculateInquiryStats(): void {
        this.inquiryStats = {
            total: this.inquiries.length,
            open: this.inquiries.filter((i) => i.status === 'sent').length,
            inProgress: this.inquiries.filter((i) => i.status === 'responded')
                .length,
            resolved: 0,
            closed: this.inquiries.filter((i) => i.status === 'closed').length,
        };
    }

    openInquiryDialog(): void {
        this.newInquiry = {
            title: '',
            content: '',
            category: '',
            unitId: '',
            priority: 'medium',
            status: 'sent',
            createdBy: this.identity?._id || '',
            condominiumId: this.condoId,
            createdInquiryBy: this.getModelNameFromRole(this.identity.role),
        };
        this.displayInquiryDialog = true;
    }

    /**
     * Cierra el dialog de crear inquiry
     */
    closeInquiryDialog(): void {
        if (
            this.newInquiry.title ||
            this.newInquiry.content ||
            this.selectedFiles.length > 0
        ) {
            this.confirmationService.confirm({
                message:
                    'Are you sure you want to cancel? All entered data and selected files will be lost.',
                header: 'Confirm Cancel',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes, Cancel',
                rejectLabel: 'Continue Editing',
                acceptButtonStyleClass: 'p-button-danger',
                accept: () => {
                    this.displayInquiryDialog = false;
                    this.resetInquiryForm();
                },
            });
        } else {
            this.displayInquiryDialog = false;
            this.resetInquiryForm();
        }
    }

    /**
     * Resetea el formulario de inquiry
     */
    private resetInquiryForm(): void {
        this.newInquiry = {
            title: '',
            content: '',
            category: '',
            priority: 'medium',
            status: 'sent',
            createdBy: this.identity?._id || '',
            condominiumId: this.condoId,
        };
        this.selectedFiles = [];
        this.filePreviewUrls.clear();
        if (this.fileUploader) {
            this.fileUploader.clear();
        }
    }

    /**
     * Resetea el formulario de notice
     */
    private resetNoticeForm(): void {
        this.newNotice = {
            title: '',
            content: '',
            type: 'general',
            priority: 'medium',
            condominiumId: this.condoId,
            targetAudience: 'all',
            publishImmediately: true,
        };
        this.selectedNoticeFiles = [];
        this.noticeFilePreviewUrls.clear();
        if (this.noticeFileUploader) {
            this.noticeFileUploader.clear();
        }
    }

    /**
     * Envía el inquiry con archivos adjuntos
     */
    submitInquiry(): void {
        if (
            !this.newInquiry.title ||
            !this.newInquiry.content ||
            !this.newInquiry.category
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all required fields',
            });
            return;
        }

        // Validar tamaño total de archivos
        const totalSize = this.selectedFiles.reduce(
            (sum, file) => sum + file.size,
            0
        );
        if (totalSize > 50 * 1024 * 1024) {
            // 50MB total
            this.messageService.add({
                severity: 'error',
                summary: 'Files Too Large',
                detail: 'Total file size cannot exceed 50MB',
            });
            return;
        }

        this.loading = true;

        // Crear FormData para enviar archivos
        const formData = new FormData();
        formData.append('title', this.newInquiry.title);
        formData.append('content', this.newInquiry.content);
        formData.append('category', this.newInquiry.category);
        formData.append('priority', this.newInquiry.priority);
        formData.append('createdBy', this.condoId); // this.identity?._id
        formData.append('condominiumId', this.newInquiry.condominiumId || '');
        formData.append(
            'createdInquiryBy',
            this.identity.role.charAt(0) +
                this.identity.role.slice(1).toLowerCase()
        ); //this.newInquiry.createdInquiryBy
        formData.append(
            'apartmentUnit',
            typeof this.newInquiry?.unitId === 'object'
                ? this.newInquiry?.unitId?.label
                : this.newInquiry?.unitId || ''
        ); //this.newInquiry.createdInquiryBy

        // Agregar archivos
        this.selectedFiles.forEach((file, index) => {
            formData.append('attachments', file, file.name);
        });

        // Llamar al servicio
        this._inquiryService
            .createInquiryWithFiles(formData, this.token)
            .subscribe({
                next: (response) => {
                    if (response.status === 'success') {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Inquiry submitted successfully',
                            life: 5000,
                        });

                        this.displayInquiryDialog = false;
                        this.resetInquiryForm();
                        this.loadInquiries();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                response.message || 'Failed to submit inquiry',
                            life: 5000,
                        });
                        this.loading = false;
                    }
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error submitting inquiry:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error.error?.message ||
                            'Failed to submit inquiry. Please try again.',
                        life: 5000,
                    });
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }

    // ============ RESPONSE MANAGEMENT ============

    clearResponse(): void {
        this.newResponse = '';
    }

    addResponseToInquiry(): void {
        if (!this.newResponse.trim() || !this.selectedInquiry?._id) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a response message',
            });
            return;
        }

        if (this.newResponse.length > 2000) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Response cannot exceed 2000 characters',
            });
            return;
        }

        this.isSendingResponse = true;

        const responseData = {
            inquiryId: this.selectedInquiry._id,
            message: this.newResponse.trim(),
            respondedBy: this.identity._id,
            respondedByModel: this.getModelNameFromRole(this.identity.role),
            respondedByRole: this.identity.role.toUpperCase(),
            status: 'responded',
        };

        this._inquiryService
            .addInquiryResponse(responseData, this.token)
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Response added successfully',
                    });

                    const index = this.inquiries.findIndex(
                        (inq) => inq._id === this.selectedInquiry!._id
                    );
                    if (index !== -1) {
                        this.inquiries[index] = response.data;
                    }

                    this.selectedInquiry = response.data;
                    this.clearResponse();
                    this.calculateInquiryStats();
                },
                error: (error) => {
                    console.error('Error adding response:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error.error?.message || 'Failed to add response',
                    });
                },
                complete: () => {
                    this.isSendingResponse = false;
                },
            });
    }

    // ============ INQUIRY ACTIONS ============

    clearSelectedInquiry() {
        this.clearSelectedInquiryDialog.emit(false);
    }

    closeInquiry(inquiryId: string): void {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to close this inquiry? This action will prevent new responses.',
            header: 'Close Inquiry',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Close',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.isClosingInquiry = true;

                const closeData = {
                    inquiryId: inquiryId,
                    message: 'Inquiry closed by administration.',
                    respondedBy: this.identity._id,
                    respondedByModel: this.getModelNameFromRole(
                        this.identity.role
                    ),
                    respondedByRole: this.identity.role.toUpperCase(),
                    status: 'closed',
                };

                this._inquiryService
                    .addInquiryResponse(closeData, this.token)
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                if (this.selectedInquiry) {
                                    this.selectedInquiry.status = 'closed';
                                }
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Inquiry closed successfully',
                                });

                                const index = this.inquiries.findIndex(
                                    (inq) => inq._id === inquiryId
                                );
                                if (index !== -1) {
                                    this.inquiries[index] = response.data;
                                }
                                this.calculateInquiryStats();
                            }
                        },
                        error: (error) => {
                            console.error('Error closing inquiry:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    error.error?.message ||
                                    'Failed to close inquiry',
                            });
                        },
                        complete: () => {
                            this.isClosingInquiry = false;
                        },
                    });
            },
        });
    }

    reopenInquiry(inquiryId: string): void {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to reopen this inquiry? Users will be able to add new responses.',
            header: 'Reopen Inquiry',
            icon: 'pi pi-question-circle',
            acceptLabel: 'Yes, Reopen',
            rejectLabel: 'Cancel',
            accept: () => {
                this.isReopeningInquiry = true;

                const reopenData = {
                    inquiryId: inquiryId,
                    message: 'Inquiry reopened by administration.',
                    respondedBy: this.identity._id,
                    respondedByModel: this.getModelNameFromRole(
                        this.identity.role
                    ),
                    respondedByRole: this.identity.role.toUpperCase(),
                    status: 'responded',
                };

                this._inquiryService
                    .addInquiryResponse(reopenData, this.token)
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Inquiry reopened successfully',
                                });

                                const index = this.inquiries.findIndex(
                                    (inq) => inq._id === inquiryId
                                );
                                if (index !== -1) {
                                    this.inquiries[index] = response.data;
                                }

                                this.selectedInquiry = response.data;
                                this.calculateInquiryStats();
                            }
                        },
                        error: (error) => {
                            console.error('Error reopening inquiry:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    error.error?.message ||
                                    'Failed to reopen inquiry',
                            });
                        },
                        complete: () => {
                            this.isReopeningInquiry = false;
                        },
                    });
            },
        });
    }

    // ============ NOTICE MANAGEMENT ============

    loadNotices(): void {
        this.loading = true;
        this._inquiryService
            .getCondominiumNotices(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    const noticesData = response.data || [];

                    // Map notices and check if they are read by current user
                    this.notices = noticesData.map((notice: any) => {
                        const isRead =
                            notice.readBy && Array.isArray(notice.readBy)
                                ? notice.readBy.some((reader: any) => {
                                      const readerId =
                                          typeof reader === 'string'
                                              ? reader
                                              : reader._id;
                                      return readerId === this.identity._id;
                                  })
                                : false;

                        return {
                            ...notice,
                            isRead: isRead,
                        };
                    });

                    // Calculate unread notices count
                    this.unreadNoticesCount = this.notices.filter(
                        (n) => !n.isRead
                    ).length;

                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading notices:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load notices',
                    });
                    this.loading = false;
                },
            });
    }

    public dialogNoticeTitle: string = '';
    viewNoticeDetails(notice: Notice): void {
        this.loadCondoUsers();
        this.dialogNoticeTitle = 'Notice Details';
        this.selectedInquiry = null;
        this.displayCreateNoticeDialog = true;

        this.newNotice = {
            ...notice,
            targetAudience: notice.targetAudience || 'all',
        };

        // reset selected previews
        this.selectedNoticeFiles = [];
        this.noticeFilePreviewUrls.clear();

        // Preload backend attachments as File objects
        if (
            Array.isArray(notice.attachments) &&
            notice.attachments.length > 0
        ) {
            const first = notice.attachments[0] as any;
            if (typeof first === 'string') {
                // string filenames → map to BackendAttachment and fetch
                const mapped = (notice.attachments as string[]).map((name) => ({
                    filename: name,
                    storedFilename: name,
                    url: `/uploads/notifications/${name}`,
                    mimetype: this.guessMimeTypeFromName(name),
                    size: 0,
                    uploadedAt: new Date().toISOString(),
                }));
                this.preloadNoticeAttachmentsFromBackend(mapped);
            } else {
                // objects from backend (filename, mimetype, storedFilename, url, ...)
                this.preloadNoticeAttachmentsFromBackend(
                    notice.attachments as unknown as BackendAttachment[]
                );
            }
        }

        // mark as read if needed
        if (!notice.isRead && notice._id) {
            this.markNoticeAsRead(notice._id);
            notice.isRead = true;
            this.unreadNoticesCount--;
        }
    }

    // ← NEW: convert backend attachments to File objects and add to selectedNoticeFiles
    async preloadNoticeAttachmentsFromBackend(
        attachments: BackendAttachment[]
    ): Promise<void> {
        if (!attachments || attachments.length === 0) return;

        const tasks = attachments.map((att) => this.fetchAttachmentAsFile(att));
        await Promise.allSettled(tasks);

        // Feedback
        if (this.selectedNoticeFiles.length > 0) {
            this.messageService.add({
                severity: 'info',
                summary: 'Attachments Loaded',
                detail: `${this.selectedNoticeFiles.length} attachment(s) ready`,
                life: 3000,
            });
        }
    }

    // ← NEW: fetch one backend attachment as Blob, make File, push, and generate preview if image
    private fetchAttachmentAsFile(att: BackendAttachment): Promise<void> {
        const downloadUrl = this.getAttachmentDownloadUrl(att);
        const filename = att.filename || att.storedFilename || 'attachment';
        const lastModified =
            new Date(att.uploadedAt || Date.now()).getTime() || Date.now();

        return new Promise((resolve) => {
            this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
                next: (blob) => {
                    const type =
                        att.mimetype || blob.type || 'application/octet-stream';
                    const file = new File([blob], filename, {
                        type,
                        lastModified,
                    });

                    if (
                        !this.selectedNoticeFiles.find(
                            (f) => f.name === file.name && f.size === file.size
                        )
                    ) {
                        this.selectedNoticeFiles.push(file);
                        if (this.isImage(file)) {
                            this.generateNoticeFilePreview(file);
                        }
                    }
                    resolve();
                },
                error: (err) => {
                    console.error('Attachment load error:', err);
                    resolve(); // continue even if one fails
                },
            });
        });
    }

    // ← NEW: build a proper download URL for the backend
    private getAttachmentDownloadUrl(att: BackendAttachment): string {
        // Prefer backend file route using storedFilename; fallback to att.url (static path)
        if (att.storedFilename) {
            return `${this.url}notifications/file/${att.storedFilename}`;
        }
        if (att.url) {
            // ensure single slash between base url and path
            const base = this.url.endsWith('/')
                ? this.url.slice(0, -1)
                : this.url;
            return `${base}${att.url}`;
        }
        return `${this.url}notifications/file/${att.filename}`;
    }

    // ← NEW: basic mime guesser for string-only filenames
    private guessMimeTypeFromName(name: string): string {
        const ext = name.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
            case 'pdf':
                return 'application/pdf';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'txt':
                return 'text/plain';
            default:
                return 'application/octet-stream';
        }
    }

    /**
     * Marks a notice as read for the current user
     */
    markNoticeAsRead(noticeId: string): void {
        this._inquiryService.markNoticeAsRead(this.token, noticeId).subscribe({
            next: (response) => {
                // console.log('Notice marked as read:', response);
            },
            error: (error) => {
                console.error('Error marking notice as read:', error);
            },
        });
    }

    /**
     * Marca todas las notificaciones como leídas para el usuario actual
     */
    markAllNoticesAsRead(): void {
        const unread = this.notices.filter((n) => !n.isRead && !!n._id);

        if (unread.length === 0) {
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'No unread notices',
            });
            return;
        }

        this.loading = true;
        let completed = 0;
        let failed = 0;

        unread.forEach((notice) => {
            this._inquiryService
                .markNoticeAsRead(this.token, notice._id as string)
                .subscribe({
                    next: () => {
                        notice.isRead = true;
                        this.unreadNoticesCount = Math.max(
                            0,
                            this.unreadNoticesCount - 1
                        );
                    },
                    error: (err) => {
                        console.error('Error marking notice as read:', err);
                        failed++;
                    },
                    complete: () => {
                        completed++;
                        if (completed === unread.length) {
                            this.loading = false;
                            const succeeded = unread.length - failed;
                            this.messageService.add({
                                severity: failed ? 'warn' : 'success',
                                summary: failed ? 'Partial Success' : 'Success',
                                detail: `Marked ${succeeded} of ${unread.length} notices as read`,
                            });
                        }
                    },
                });
        });
    }

    // ============ NOTICE CREATION METHODS (NUEVOS) ============

    openCreateNoticeDialog(): void {
        this.dialogNoticeTitle = 'Create New Notice';
        this.newNotice = {
            title: '',
            content: '',
            type: 'general',
            priority: 'medium',
            condominiumId: this.condoId,
            targetAudience: 'all',
            publishImmediately: true,
        };

        this.displayCreateNoticeDialog = true;

        // Si ya está en "specific", cargar usuarios
        if (this.newNotice.targetAudience === 'specific') {
            this.loadCondoUsers();
        }
    }

    // ← NUEVO: manejar cambio de audiencia
    onTargetAudienceChange(value: string): void {
        if (value === 'specific') {
            this.loadCondoUsers();
        }
    }

    // ← NUEVO: cargar usuarios del condominio
    private loadCondoUsers(): void {
        if (!this.condoId || !this.token) return;
        this.loadingCondoUsers = true;

        this._inquiryService
            .getCondominiumUsers(this.token, this.condoId)
            .subscribe({
                next: (res) => {
                    const users = res.data || [];
                    this.condoUsersOptions = users.units_ownerId.map(
                        (u: any) => ({
                            label: `${u.name || ''} ${u.lastname || ''} ${
                                u.email ? ' - ' + u.email : ''
                            }`.trim(),
                            value: u._id,
                            role: (u.role || '').toUpperCase(),
                        })
                    );
                },
                error: (err) => {
                    console.error('Error loading condominium users:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load condominium users',
                    });
                },
                complete: () => {
                    this.loadingCondoUsers = false;
                },
            });
    }

    submitNotice(): void {
        // Validaciones
        if (!this.newNotice.title || this.newNotice.title.trim().length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Title is required',
            });
            return;
        }

        if (
            !this.newNotice.content ||
            this.newNotice.content.trim().length === 0
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Content is required',
            });
            return;
        }

        if (this.newNotice.title.length > 200) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Title cannot exceed 200 characters',
            });
            return;
        }

        if (this.newNotice.content.length > 5000) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Content cannot exceed 5000 characters',
            });
            return;
        }

        if (this.newNotice.expiresAt) {
            const expirationDate = new Date(this.newNotice.expiresAt);
            if (expirationDate <= new Date()) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation Error',
                    detail: 'Expiration date must be in the future',
                });
                return;
            }
        }

        // ← NUEVO: validar receptores cuando targetAudience = specific
        if (
            this.newNotice.targetAudience === 'specific' &&
            (!this.newNotice.specificRecipients ||
                this.newNotice.specificRecipients.length === 0)
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Select at least one recipient',
            });
            return;
        }

        this.isCreatingNotice = true;
        this.condoUsersOptions;
        let rolesRecipientModel = this.condoUsersOptions.map((u) => {
            if (
                u.value &&
                this.newNotice.specificRecipients.includes(u.value)
            ) {
                var specificRecipientModel = u.role;
                var specificRecipients = u.value;
            }
            return {
                specificRecipients: specificRecipients,
                specificRecipientModel: specificRecipientModel,
            };
        });

        const formData = new FormData();
        formData.append('title', this.newNotice.title.trim());
        formData.append('content', this.newNotice.content.trim());
        formData.append('type', this.newNotice.type);
        formData.append('priority', this.newNotice.priority);
        formData.append('condominiumId', this.condoId);
        formData.append('targetAudience', this.newNotice.targetAudience);
        formData.append('createdBy', this.identity._id);
        formData.append(
            'createdByModel',
            this.getModelNameFromRole(this.identity.role)
        );
        formData.append('createdByRole', this.identity.role.toUpperCase());
        if (this.newNotice.expiresAt) {
            formData.append(
                'expiresAt',
                new Date(this.newNotice.expiresAt).toISOString()
            );
        }
        // Add specific recipients if exists
        if (
            Boolean(this.newNotice?.specificRecipients) &&
            this.newNotice?.specificRecipients.length > 0
        ) {
            rolesRecipientModel.forEach((recipientId) => {
                formData.append(
                    'specificRecipients[]',
                    recipientId.specificRecipients
                );
                formData.append(
                    'specificRecipientModel',
                    this._formatFunctions.titleCase(
                        recipientId.specificRecipientModel
                    )
                );
            });
        }

        // Add attachments
        this.selectedNoticeFiles.forEach((file) => {
            formData.append('attachments', file, file.name);
        });

        this._inquiryService.createNotice(formData, this.token).subscribe({
            next: (response) => {
                // console.log('Notice created successfully:', response);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: this.newNotice.publishImmediately
                        ? 'Notice created and published successfully'
                        : 'Notice created successfully',
                    life: 5000,
                });

                this.displayCreateNoticeDialog = false;
                this.loadNotices();

                this.newNotice = {
                    title: '',
                    content: '',
                    type: 'general',
                    priority: 'medium',
                    condominiumId: this.condoId,
                    targetAudience: 'all',
                    publishImmediately: true,
                };

                if (formData.get('publishedAt')) {
                    setTimeout(() => {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Notification Sent',
                            detail: `Notice has been sent to ${this.getAudienceDescription(
                                this.newNotice.targetAudience
                            )}`,
                            life: 5000,
                        });
                    }, 1000);
                }
            },
            error: (error) => {
                console.error('Error creating notice:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error.error?.message ||
                        'Failed to create notice. Please try again.',
                    life: 5000,
                });
                this.isCreatingNotice = false;
            },
            complete: () => {
                this.isCreatingNotice = false;
            },
        });
    }

    updateNotice(): void {
        var rolesRecipientModel = [];
        if (this.condoUsersOptions) {
            rolesRecipientModel = this.condoUsersOptions
                .filter(
                    (f) =>
                        f.value != null &&
                        this.newNotice.specificRecipients.includes(f.value)
                )
                .map((u) => {
                    return {
                        specificRecipients: u.value,
                        specificRecipientModel: u.role,
                    };
                });
        }

        const formData = new FormData();
        formData.append('_id', this.newNotice._id);
        formData.append('title', this.newNotice.title.trim());
        formData.append('content', this.newNotice.content.trim());
        formData.append('type', this.newNotice.type);
        formData.append('priority', this.newNotice.priority);
        formData.append('condominiumId', this.condoId);
        formData.append('targetAudience', this.newNotice.targetAudience);
        formData.append('createdBy', this.identity._id);
        formData.append(
            'createdByModel',
            this.getModelNameFromRole(this.identity.role)
        );
        formData.append('createdByRole', this.identity.role.toUpperCase());
        if (this.newNotice.expiresAt) {
            formData.append(
                'expiresAt',
                new Date(this.newNotice.expiresAt).toISOString()
            );
        }
        // Add specific recipients if exists
        if (
            Boolean(this.newNotice?.specificRecipients) &&
            this.newNotice?.specificRecipients.length > 0
        ) {
            rolesRecipientModel.forEach((recipientId) => {
                formData.append(
                    'specificRecipients[]',
                    recipientId.specificRecipients
                );
                formData.append(
                    'specificRecipientModel',
                    this._formatFunctions.titleCase(
                        recipientId.specificRecipientModel
                    )
                );
            });
        }

        // Add attachments
        this.selectedNoticeFiles.forEach((file) => {
            formData.append('attachments', file, file.name);
        });

        this._inquiryService.updateNotice(formData, this.token).subscribe({
            next: (response) => {
                // console.log('Notice updated successfully:', response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Notice updated successfully',
                    life: 5000,
                });
                this.displayCreateNoticeDialog = false;
                this.loadNotices();
            },
            error: (error) => {
                console.error('Error updating notice:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update notice',
                    life: 5000,
                });
            },
        });
    }

    private getAudienceDescription(audience: string): string {
        switch (audience) {
            case 'all':
                return 'all residents';
            case 'owners':
                return 'all property owners';
            case 'family':
                return 'all family';
            case 'specific':
                return 'selected recipients';
            default:
                return 'recipients';
        }
    }

    // ============ UTILITY METHODS ============

    getPriorityClass(priority: string): string {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'danger';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'info';
        }
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'sent':
                return 'info';
            case 'responded':
                return 'warning';
            case 'closed':
                return 'success';
            default:
                return 'info';
        }
    }

    getNoticeTypeClass(type: string): string {
        switch (type?.toLowerCase()) {
            case 'emergency':
                return 'danger';
            case 'maintenance':
                return 'warning';
            case 'payment':
                return 'info';
            case 'event':
                return 'success';
            case 'general':
                return 'secondary';
            case 'parking': // ← NUEVO
                return 'warning';
            default:
                return 'secondary';
        }
    }

    formatDate(date: Date | string): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    formatTime(date: Date | string): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    getFilteredInquiries(): Inquiry[] {
        if (this.inquiryStatusFilter === 'all') {
            return this.inquiries;
        }
        return this.inquiries.filter(
            (inquiry) => inquiry.status === this.inquiryStatusFilter
        );
    }

    getFilteredNotices(): Notice[] {
        if (this.noticeTypeFilter === 'all') {
            return this.notices;
        }
        return this.notices.filter(
            (notice) => notice.type === this.noticeTypeFilter
        );
    }

    // ============ PAGINATION METHODS ============

    onInquiryPageChange(event: any): void {
        this.inquiryFirst = event.first;
        this.inquiryRows = event.rows;
    }

    onNoticePageChange(event: any): void {
        this.noticeFirst = event.first;
        this.noticeRows = event.rows;
    }

    // ============ FILE UPLOAD PROPERTIES (NUEVAS) ============
    selectedFiles: File[] = []; // ← NUEVO
    filePreviewUrls: Map<string, string> = new Map(); // ← NUEVO
    maxFileSize: number = 10 * 1024 * 1024; // 10MB
    acceptedFileTypes: string[] = ['image/*', '.pdf', '.doc', '.docx', '.txt'];

    // ============ FILE UPLOAD FOR NOTICES (AÑADIR) ============
    selectedNoticeFiles: File[] = [];
    noticeFilePreviewUrls: Map<string, string> = new Map();

    // ============ FILE UPLOAD METHODS (NUEVOS) ============

    /**
     * Maneja la selección de archivos
     */
    onFileSelect(event: any): void {
        const files: File[] = event.files || event.currentFiles;

        for (const file of files) {
            // Validar tamaño
            if (file.size > this.maxFileSize) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'File Too Large',
                    detail: `${file.name} exceeds 10MB limit`,
                });
                continue;
            }

            // Validar tipo de archivo
            if (!this.isFileTypeAccepted(file)) {
                this.messageService.add({
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
        this.messageService.add({
            severity: 'success',
            summary: 'Files Selected',
            detail: `${this.selectedFiles.length} file(s) ready to upload`,
            life: 3000,
        });
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

    /**
     * Limpia todos los archivos seleccionados
     */
    onFilesClear(): void {
        this.selectedFiles = [];
        this.filePreviewUrls.clear();
        // console.log('All files cleared');
    }

    /**
     * Elimina un archivo específico por índice
     */
    removeFile(index: number): void {
        const file = this.selectedFiles[index];
        if (file) {
            this.filePreviewUrls.delete(file.name);
            this.selectedFiles.splice(index, 1);

            this.messageService.add({
                severity: 'info',
                summary: 'File Removed',
                detail: `${file.name} has been removed`,
                life: 2000,
            });
        }
    }

    /**
     * Limpia todos los archivos (botón manual)
     */
    clearAllFiles(): void {
        if (this.selectedFiles.length === 0) return;

        this.confirmationService.confirm({
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

                this.messageService.add({
                    severity: 'success',
                    summary: 'Files Cleared',
                    detail: 'All files have been removed',
                });
            },
        });
    }

    /**
     * Genera preview para imágenes
     */
    private generateFilePreview(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.filePreviewUrls.set(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Obtiene el preview de un archivo
     */
    getFilePreview(file: File): string {
        return this.filePreviewUrls.get(file.name) || '';
    }

    /**
     * Verifica si un archivo es imagen
     */
    isImage(file: File): boolean {
        return file.type.startsWith('image/');
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
     * Obtiene el tamaño total de todos los archivos
     */
    getTotalFilesSize(): string {
        const totalBytes = this.selectedFiles.reduce(
            (sum, file) => sum + file.size,
            0
        );
        return this.formatFileSize(totalBytes);
    }

    // ============ NOTICE FILE UPLOAD METHODS (NUEVOS) ============

    /**
     * Maneja la selección de archivos para notices
     */
    onNoticeFileSelect(event: any): void {
        const files: File[] = event.files || event.currentFiles;

        for (const file of files) {
            // Validar tamaño
            if (file.size > this.maxFileSize) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'File Too Large',
                    detail: `${file.name} exceeds 10MB limit`,
                });
                continue;
            }

            // Validar tipo de archivo
            if (!this.isFileTypeAccepted(file)) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid File Type',
                    detail: `${file.name} is not an accepted file type`,
                });
                continue;
            }

            // Agregar archivo si no existe
            if (!this.selectedNoticeFiles.find((f) => f.name === file.name)) {
                this.selectedNoticeFiles.push(file);

                // Generar preview para imágenes
                if (this.isImage(file)) {
                    this.generateNoticeFilePreview(file);
                }
            }
        }

        // Actualizar contador
        if (this.selectedNoticeFiles.length > 0) {
            this.messageService.add({
                severity: 'success',
                summary: 'Files Selected',
                detail: `${this.selectedNoticeFiles.length} file(s) ready to upload`,
                life: 3000,
            });
        }
    }

    /**
     * Maneja la eliminación de un archivo de notice
     */
    onNoticeFileRemove(event: any): void {
        const file = event.file;
        this.selectedNoticeFiles = this.selectedNoticeFiles.filter(
            (f) => f.name !== file.name
        );
        this.noticeFilePreviewUrls.delete(file.name);

        // console.log('Notice file removed:', file.name);
    }

    /**
     * Limpia todos los archivos de notice
     */
    onNoticeFilesClear(): void {
        this.selectedNoticeFiles = [];
        this.noticeFilePreviewUrls.clear();
        // console.log('All notice files cleared');
    }

    /**
     * Elimina un archivo específico de notice por índice
     * newNotice.specificRecipients
     */
    removeNoticeFile(newNotice: any, index: number): void {
        const file = this.selectedNoticeFiles[index];
        let filenameToRemove = newNotice.attachments[index].storedFilename;
        let noticeId = newNotice._id;

        if (file) {
            this.noticeFilePreviewUrls.delete(file.name);
            this.selectedNoticeFiles.splice(index, 1);
            this._inquiryService
                .deleteAttachment(
                    { filename: filenameToRemove, noticeId: noticeId },
                    this.token
                )
                .subscribe({
                    next: (response) => {
                        if (response.status === 'success') {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Attachment Deleted',
                                detail: `${file.name} has been deleted from backend`,
                                life: 3000,
                            });
                            this.loadNotices();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Deletion Failed',
                                detail: `Failed to delete ${file.name} from backend`,
                                life: 3000,
                            });
                        }
                    },
                    error: (error) => {
                        console.error(
                            'Error removing attachment from backend:',
                            error
                        );
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Deletion Failed',
                            detail: `Failed to delete ${error.error.message} from backend`,
                            life: 3000,
                        });
                    },
                });

            this.messageService.add({
                severity: 'info',
                summary: 'File Removed',
                detail: `${file.name} has been removed`,
                life: 2000,
            });
        }
    }

    /**
     * Limpia todos los archivos de notice (botón manual)
     */
    clearAllNoticeFiles(): void {
        if (this.selectedNoticeFiles.length === 0) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to remove all ${this.selectedNoticeFiles.length} file(s)?`,
            header: 'Confirm Clear',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Clear All',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.selectedNoticeFiles = [];
                this.noticeFilePreviewUrls.clear();
                if (this.noticeFileUploader) {
                    this.noticeFileUploader.clear();
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Files Cleared',
                    detail: 'All files have been removed',
                });
            },
        });
    }

    /**
     * Genera preview para imágenes de notice
     */
    private generateNoticeFilePreview(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.noticeFilePreviewUrls.set(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Obtiene el preview de un archivo de notice
     */
    getNoticeFilePreview(file: File): string {
        return this.noticeFilePreviewUrls.get(file.name) || '';
    }

    /**
     * Obtiene el tamaño total de archivos de notice
     */
    getTotalNoticeFilesSize(): string {
        const totalBytes = this.selectedNoticeFiles.reduce(
            (sum, file) => sum + file.size,
            0
        );
        return this.formatFileSize(totalBytes);
    }

    /**
     * Descarga un archivo adjunto existente
     */
    downloadExistingAttachment(filename: string): void {
        // Ajustar ruta según tu backend real
        // console.log('Downloading attachment:', filename);
        const url = `${this.url}notifications/file/${filename}`;
        window.open(url, '_blank');
    }

    // Returns true when there are selected File objects for the notice
    hasSelectedNoticeFileObjects(): boolean {
        return (
            Array.isArray(this.selectedNoticeFiles) &&
            this.selectedNoticeFiles.length > 0
        );
    }

    // Returns true when newNotice.attachments is an array of string filenames
    hasExistingAttachmentNames(): boolean {
        const atts =
            this.newNotice && Array.isArray(this.newNotice.attachments)
                ? this.newNotice.attachments
                : [];
        return atts.length > 0 && typeof atts[0] === 'string';
    }
}
