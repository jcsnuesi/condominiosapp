import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
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
import { TooltipModule } from 'primeng/tooltip'; // ← NUEVO
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../service/notification.service';
import { UserService } from '../../service/user.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';

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
    respondedBy: RespondedByUser; // ← CAMBIADO de string a objeto
    respondedByModel?: string;
    respondedByRole: string; // ← Ahora requerido
    isAdminResponse: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

interface Inquiry {
    _id?: string;
    title: string;
    description: string;
    category: string;
    type?: string; // ← NUEVO para compatibilidad con tabla
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'sent' | 'responded' | 'closed'; // ← ACTUALIZADO
    ownerId: string;
    condominiumId: string;
    responses?: InquiryResponse[];
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    closedAt?: Date; // ← NUEVO
    closedBy?: RespondedByUser; // ← NUEVO
}

interface Notice {
    _id?: string;
    title: string;
    content: string;
    type: 'general' | 'maintenance' | 'payment' | 'event' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    condominiumId: string;
    targetAudience?: 'all' | 'owners' | 'tenants' | 'specific';
    isRead?: boolean;
    createdAt?: Date;
    expiresAt?: Date;
}

@Component({
    selector: 'app-notification',
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
        TooltipModule, // ← NUEVO
    ],
    providers: [
        MessageService,
        ConfirmationService,
        NotificationService,
        UserService,
    ],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit, OnChanges {
    // ============ DIALOG CONTROLS ============
    displayInquiryDialog: boolean = false;
    displayInquiryDetailDialog: boolean = false;
    displayNoticeDialog: boolean = false;

    // ============ DATA ARRAYS ============
    inquiries: Inquiry[] = [];
    notices: Notice[] = [];
    selectedInquiry: Inquiry | null = null;

    // ============ FORM DATA ============
    newInquiry: Inquiry = {
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        status: 'sent',
        ownerId: '',
        condominiumId: '',
    };

    // Response to inquiry
    newResponse: string = '';

    // ============ LOADING STATES (NUEVOS) ============
    loading: boolean = false;
    isSendingResponse: boolean = false;
    isClosingInquiry: boolean = false;
    isReopeningInquiry: boolean = false;

    // ============ FILTERS AND PAGINATION ============
    inquiryStatusFilter: string = 'all';
    noticeTypeFilter: string = 'all';

    // Pagination
    inquiryRows: number = 10;
    inquiryFirst: number = 0;
    noticeRows: number = 10;
    noticeFirst: number = 0;

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
    ];

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

    constructor(
        private _notificationService: NotificationService,
        private _userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _formatFunctions: FormatFunctions
    ) {
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        this.loadInquiries();
        this.getFilteredInquiries();
        this.isAdmin();
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
                    this.viewInquiryDetails(data_filtered);
                }
            }, 500);
        }
    }

    // ============ USER MANAGEMENT ============

    /**
     * Verifica si el usuario actual es administrador
     */
    isAdmin(): boolean {
        console.log('User role:', this.dataDialog.identity.role);
        if (!this.dataDialog.identity.role) {
            return false;
        }

        const adminRoles = ['ADMIN', 'STAFF_ADMIN', 'STAFF'];
        return adminRoles.includes(this.dataDialog.identity.role);
    }

    /**
     * Obtiene el nombre del modelo basado en el rol del usuario
     */
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
        this._notificationService
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

    calculateInquiryStats(): void {
        this.inquiryStats = {
            total: this.inquiries.length,
            open: this.inquiries.filter((i) => i.status === 'sent').length,
            inProgress: this.inquiries.filter((i) => i.status === 'responded')
                .length,
            resolved: 0, // No se usa en el modelo actual
            closed: this.inquiries.filter((i) => i.status === 'closed').length,
        };
    }

    openInquiryDialog(): void {
        this.newInquiry = {
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            status: 'sent',
            ownerId: this.identity?._id || '',
            condominiumId: this.condoId,
        };
        this.displayInquiryDialog = true;
    }

    submitInquiry(): void {
        if (
            !this.newInquiry.title ||
            !this.newInquiry.description ||
            !this.newInquiry.category
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all required fields',
            });
            return;
        }

        this.loading = true;
        // TODO: Implementar cuando el servicio esté listo
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Create inquiry feature coming soon',
        });
        this.loading = false;
    }

    viewInquiryDetails(inquiry: Inquiry): void {
        this.selectedInquiry = inquiry;
        console.log('Inquiry details loaded:', inquiry);
        this.newResponse = '';
        this.displayInquiryDetailDialog = true;
    }

    // ============ RESPONSE MANAGEMENT (ACTUALIZADO) ============

    /**
     * Limpia el campo de respuesta
     */
    clearResponse(): void {
        this.newResponse = '';
    }

    /**
     * Agrega una respuesta al inquiry seleccionado
     */
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

        this._notificationService
            .addInquiryResponse(responseData, this.token)
            .subscribe({
                next: (response) => {
                    console.log('Response added:', response);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Response added successfully',
                    });

                    // Actualizar inquiry en la lista
                    const index = this.inquiries.findIndex(
                        (inq) => inq._id === this.selectedInquiry!._id
                    );
                    if (index !== -1) {
                        this.inquiries[index] = response.data;
                    }

                    // Actualizar selectedInquiry
                    this.selectedInquiry = response.data;

                    // Limpiar campo
                    this.clearResponse();

                    // Actualizar estadísticas
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

    // ============ INQUIRY ACTIONS (NUEVOS) ============

    /**
     * Cierra un inquiry (solo administradores)
     */
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

                this._notificationService
                    .addInquiryResponse(closeData, this.token)
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Inquiry closed successfully',
                                });
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

    /**
     * Reabre un inquiry cerrado (solo administradores)
     */
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

                this._notificationService
                    .addInquiryResponse(reopenData, this.token)
                    .subscribe({
                        next: (response) => {
                            if (response.status === 'success') {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Inquiry reopened successfully',
                                });

                                // Actualizar inquiry en la lista
                                const index = this.inquiries.findIndex(
                                    (inq) => inq._id === inquiryId
                                );
                                if (index !== -1) {
                                    this.inquiries[index] = response.data;
                                }

                                // Actualizar selectedInquiry
                                this.selectedInquiry = response.data;

                                // Actualizar estadísticas
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
        this._notificationService
            .getCondominiumNotices(this.token, this.condoId)
            .subscribe({
                next: (response) => {
                    this.notices = response.data?.docs || [];
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

    viewNoticeDetails(notice: Notice): void {
        this.selectedInquiry = null;
        this.displayNoticeDialog = true;

        if (!notice.isRead && notice._id) {
            this.markNoticeAsRead(notice._id);
            notice.isRead = true;
            this.unreadNoticesCount--;
        }
    }

    markNoticeAsRead(noticeId: string): void {
        this._notificationService.markNoticeAsRead(noticeId).subscribe({
            next: () => {
                console.log('Notice marked as read');
            },
            error: (error) => {
                console.error('Error marking notice as read:', error);
            },
        });
    }

    markAllNoticesAsRead(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to mark all notices as read?',
            header: 'Confirm Action',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._notificationService.markAllNoticesAsRead().subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'All notices marked as read',
                        });
                        this.loadNotices();
                    },
                    error: (error) => {
                        console.error(
                            'Error marking all notices as read:',
                            error
                        );
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to mark notices as read',
                        });
                    },
                });
            },
        });
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
                return 'success';
            case 'closed':
                return 'secondary';
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

    /**
     * Formatea solo la hora de una fecha (NUEVO)
     */
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
}
