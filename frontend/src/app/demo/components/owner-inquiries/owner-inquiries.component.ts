import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ImportsModule } from '../../imports_primeng';
import { InquiryService } from '../../service/inquiry.service';

interface OwnerInquiryProperty {
    addressId?: { _id?: string; alias?: string };
    condominium_unit?: string;
    status_property?: string;
}

interface OwnerInquiry {
    _id: string;
    title: string;
    content: string;
    category: string;
    priority: string;
    status: string;
    apartmentUnit: string;
    createdAt: string;
    condominiumId?: { _id?: string; alias?: string };
    responses?: unknown[];
}

interface InquiryFormValue {
    title: string;
    content: string;
    category: string;
    priority: string;
    condominiumId: string;
    apartmentUnit: string;
}

@Component({
    selector: 'app-owner-inquiries',
    imports: [CommonModule, FormsModule, ImportsModule],
    templateUrl: './owner-inquiries.component.html',
    styleUrl: './owner-inquiries.component.css',
})
export class OwnerInquiriesComponent implements OnChanges {
    @Input({ required: true }) ownerId = '';
    @Input() ownerName = '';
    @Input() properties: OwnerInquiryProperty[] = [];

    inquiries: OwnerInquiry[] = [];
    loading = false;
    submitting = false;
    createDialogVisible = false;
    loadError = '';

    readonly categoryOptions = [
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Payment issue', value: 'payment' },
        { label: 'Noise complaint', value: 'noise' },
        { label: 'Security', value: 'security' },
        { label: 'Common areas', value: 'common-areas' },
        { label: 'Parking', value: 'parking' },
        { label: 'Other', value: 'other' },
    ];

    readonly priorityOptions = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
    ];

    formValue: InquiryFormValue = this.emptyForm();

    constructor(
        private readonly inquiryService: InquiryService,
        private readonly messageService: MessageService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ownerId']?.currentValue) {
            this.loadInquiries();
        }
    }

    get condominiumOptions(): Array<{ label: string; value: string }> {
        const options = this.properties
            .filter(
                (property) =>
                    property.addressId?._id &&
                    property.status_property !== 'inactive'
            )
            .map((property) => ({
                label: property.addressId?.alias || 'Condominium',
                value: property.addressId?._id || '',
            }));

        return options.filter(
            (option, index, all) =>
                all.findIndex((candidate) => candidate.value === option.value) ===
                index
        );
    }

    get unitOptions(): Array<{ label: string; value: string }> {
        return this.properties
            .filter(
                (property) =>
                    property.addressId?._id === this.formValue.condominiumId &&
                    property.condominium_unit
            )
            .map((property) => ({
                label: property.condominium_unit || '',
                value: property.condominium_unit || '',
            }));
    }

    loadInquiries(): void {
        if (!this.ownerId) return;
        this.loading = true;
        this.loadError = '';

        this.inquiryService.getInquiriesByOwner(this.ownerId).subscribe({
            next: (response) => {
                this.loading = false;
                if (!response.success) {
                    this.inquiries = [];
                    this.loadError = response.message || 'Inquiries could not be loaded.';
                    return;
                }
                const data = response.data as { docs?: OwnerInquiry[] } | null;
                this.inquiries = Array.isArray(data?.docs) ? data.docs : [];
            },
            error: (error) => {
                this.loading = false;
                this.inquiries = [];
                this.loadError =
                    error?.error?.message || 'Inquiries could not be loaded.';
            },
        });
    }

    openCreateDialog(): void {
        this.formValue = this.emptyForm();
        if (this.condominiumOptions.length === 1) {
            this.formValue.condominiumId = this.condominiumOptions[0].value;
            if (this.unitOptions.length === 1) {
                this.formValue.apartmentUnit = this.unitOptions[0].value;
            }
        }
        this.createDialogVisible = true;
    }

    condominiumChanged(): void {
        this.formValue.apartmentUnit = '';
        if (this.unitOptions.length === 1) {
            this.formValue.apartmentUnit = this.unitOptions[0].value;
        }
    }

    submit(form: NgForm): void {
        if (form.invalid || this.submitting) {
            form.control.markAllAsTouched();
            return;
        }

        this.submitting = true;
        this.inquiryService
            .createInquiryForOwner({
                ownerId: this.ownerId,
                ...this.formValue,
            })
            .subscribe({
                next: (response) => {
                    this.submitting = false;
                    if (!response.success) {
                        this.showCreateError(response.message);
                        return;
                    }
                    this.createDialogVisible = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Inquiry created',
                        detail: `The inquiry was added to ${this.ownerName || 'the owner'}'s profile.`,
                        life: 4000,
                    });
                    this.loadInquiries();
                },
                error: (error) => {
                    this.submitting = false;
                    this.showCreateError(
                        error?.error?.error?.message ||
                            error?.error?.message ||
                            'The inquiry could not be created.'
                    );
                },
            });
    }

    statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        if (status === 'closed') return 'success';
        if (status === 'responded') return 'info';
        return 'warn';
    }

    prioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' {
        if (priority === 'urgent' || priority === 'high') return 'danger';
        if (priority === 'medium') return 'warn';
        return 'success';
    }

    private emptyForm(): InquiryFormValue {
        return {
            title: '',
            content: '',
            category: '',
            priority: 'medium',
            condominiumId: '',
            apartmentUnit: '',
        };
    }

    private showCreateError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Inquiry not created',
            detail,
            life: 4500,
        });
    }
}
