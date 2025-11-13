import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
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
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../service/notification.service';
import { UserService } from '../../service/user.service';

interface Inquiry {
    _id?: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    ownerId: string;
    condominiumId: string;
    responses?: InquiryResponse[];
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface InquiryResponse {
    _id?: string;
    message: string;
    respondedBy: string;
    respondedByName?: string;
    respondedByRole?: string;
    createdAt: Date;
    isAdminResponse: boolean;
}

interface Notice {
    _id?: string;
    title: string;
    content: string;
    type: 'general' | 'maintenance' | 'payment' | 'event' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    condominiumId: string;
    targetAudience: 'all' | 'owners' | 'tenants' | 'specific';
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
export class NotificationComponent implements OnInit {
    // Dialog Controls
    displayInquiryDialog: boolean = false;
    displayInquiryDetailDialog: boolean = false;
    displayNoticeDialog: boolean = false;

    // Data Arrays
    inquiries: Inquiry[] = [];
    notices: Notice[] = [];
    selectedInquiry: Inquiry | null = null;

    // New Inquiry Form
    newInquiry: Inquiry = {
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        status: 'open',
        ownerId: '',
        condominiumId: '',
    };

    // Response to inquiry
    newResponse: string = '';

    // Filters and Pagination
    inquiryStatusFilter: string = 'all';
    noticeTypeFilter: string = 'all';
    loading: boolean = false;

    // Pagination
    inquiryRows: number = 10;
    inquiryFirst: number = 0;
    noticeRows: number = 10;
    noticeFirst: number = 0;

    // Dropdown Options
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
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
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

    // Statistics
    inquiryStats = {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
    };

    unreadNoticesCount: number = 0;
    public identity: any;
    public token: any;
    @Input() condoId: string = '';
    @Input() isHome: boolean = false;
    @Input() dataDialog: boolean = false;

    constructor(
        private _notificationService: NotificationService,
        private _userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        // this.loadUserData();
        this.loadInquiries();
        // this.loadNotices();
        this.getFilteredInquiries();
        console.log('Condo ID in NotificationComponent:', this.dataDialog);
    }

    loadUserData(): void {
        if (this.identity) {
            // this.newInquiry.ownerId = userData.sub;
            // this.newInquiry.condominiumId = userData.condominiumId;
        }
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
            open: this.inquiries.filter((i) => i.status === 'open').length,
            inProgress: this.inquiries.filter((i) => i.status === 'in-progress')
                .length,
            resolved: this.inquiries.filter((i) => i.status === 'resolved')
                .length,
            closed: this.inquiries.filter((i) => i.status === 'closed').length,
        };
    }

    openInquiryDialog(): void {
        this.newInquiry = {
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            status: 'open',
            ownerId: '',
            condominiumId: '',
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
        // this._notificationService.createInquiry(this.newInquiry).subscribe({
        //     next: (response) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail: 'Inquiry submitted successfully',
        //         });
        //         this.displayInquiryDialog = false;
        //         this.loadInquiries();
        //         this.loading = false;
        //     },
        //     error: (error) => {
        //         console.error('Error creating inquiry:', error);
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Failed to submit inquiry',
        //         });
        //         this.loading = false;
        //     },
        // });
    }

    viewInquiryDetails(inquiry: Inquiry): void {
        this.selectedInquiry = inquiry;
        this.newResponse = '';
        this.displayInquiryDetailDialog = true;

        // Load full inquiry details with responses
        this._notificationService.getInquiryDetails(inquiry._id!).subscribe({
            next: (response) => {
                console.log('Inquiry details loaded:', response);
                // this.selectedInquiry = [];
            },
            error: (error) => {
                console.error('Error loading inquiry details:', error);
            },
        });
    }

    addResponseToInquiry(): void {
        if (!this.newResponse.trim() || !this.selectedInquiry?._id) {
            return;
        }

        const responseData = {
            inquiryId: this.selectedInquiry._id,
            message: this.newResponse.trim(),
        };

        this._notificationService.addInquiryResponse(responseData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Response added successfully',
                });
                this.newResponse = '';
                this.viewInquiryDetails(this.selectedInquiry!); // Reload details
                this.loadInquiries(); // Refresh list
            },
            error: (error) => {
                console.error('Error adding response:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add response',
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
                    // this.notices = response.notices || [];
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
        this.selectedInquiry = null; // Reset selected inquiry
        this.displayNoticeDialog = true;

        // Mark as read if not already
        if (!notice.isRead) {
            this.markNoticeAsRead(notice._id!);
            notice.isRead = true;
            this.unreadNoticesCount--;
        }
    }

    markNoticeAsRead(noticeId: string): void {
        this._notificationService.markNoticeAsRead(noticeId).subscribe({
            next: () => {
                // Notice marked as read
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
        switch (priority) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            case 'low':
                return 'success';
            default:
                return 'info';
        }
    }

    getStatusClass(status: string): string {
        console.log('Status:', status);
        switch (status) {
            case 'sent':
                return 'info';
            case 'responded':
                return 'warning';
            case 'closed':
                return 'secondary';
            default:
                return 'info';
        }
    }

    getNoticeTypeClass(type: string): string {
        switch (type) {
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
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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

    // Pagination methods
    onInquiryPageChange(event: any): void {
        this.inquiryFirst = event.first;
        this.inquiryRows = event.rows;
    }

    onNoticePageChange(event: any): void {
        this.noticeFirst = event.first;
        this.noticeRows = event.rows;
    }
}
