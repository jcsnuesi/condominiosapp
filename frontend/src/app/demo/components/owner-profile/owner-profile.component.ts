import { CommonModule, Location } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil, timeout } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ImportsModule } from '../../imports_primeng';
import { OwnerModel } from '../../models/owner.model';
import { global } from '../../service/global.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';
import { OwnerInquiriesComponent } from '../owner-inquiries/owner-inquiries.component';
import { OwnerProfileSettingsComponent } from '../owner-profile-settings/owner-profile-settings.component';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { PropertiesByOwnerComponent } from '../properties-by-owner/properties-by-owner.component';

type ProfileSection =
    | 'overview'
    | 'units'
    | 'billing'
    | 'family'
    | 'bookings'
    | 'inquiries';

interface OwnerProperty {
    addressId?: {
        _id?: string;
        alias?: string;
        street_1?: string;
        street_2?: string;
        sector_name?: string;
        city?: string;
        province?: string;
    };
    condominium_unit?: string;
    parkingsQty?: number;
    isRenting?: boolean;
    status_property?: string;
}

interface OwnerBooking {
    _id?: string;
    status?: string;
    areaName?: string;
    socialArea?: string;
    checkIn?: string;
    createdAt?: string;
    [key: string]: unknown;
}

type OwnerProfile = OwnerModel & {
    createdAt?: string;
    emailVerified?: boolean;
    propertyDetails?: OwnerProperty[];
    familyAccount?: unknown[];
};

interface OwnerAssetResponse {
    owner?: OwnerProfile;
    invoices?: Array<{
        count?: number;
        totalAmount?: number;
        invoices?: unknown[];
    }>;
    bookings?: Array<{ count?: number; bookings?: OwnerBooking[] }>;
    invoicePaid?: any[];
}

@Component({
    selector: 'app-owner-profile',
    imports: [
        CommonModule,
        ImportsModule,
        OwnerProfileSettingsComponent,
        PaymentsHistoryComponent,
        PropertiesByOwnerComponent,
        FamilyMemberDetailsComponent,
        OwnerInquiriesComponent,
    ],
    providers: [MessageService],
    templateUrl: './owner-profile.component.html',
    styleUrl: './owner-profile.component.css',
})
export class OwnerProfileComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    ownerId = '';
    owner: OwnerProfile | null = null;
    activeSection: ProfileSection = 'overview';
    loading = true;
    loadError = '';
    settingsVisible = false;
    avatarFailed = false;
    pendingInvoiceCount = 0;
    pendingBalance = 0;
    paidInvoices: any[] = [];
    bookings: OwnerBooking[] = [];
    familyCount = 0;

    readonly sections: Array<{
        id: ProfileSection;
        label: string;
        icon: string;
    }> = [
        { id: 'overview', label: 'Overview', icon: 'pi pi-th-large' },
        { id: 'units', label: 'Units', icon: 'pi pi-building' },
        { id: 'billing', label: 'Billing', icon: 'pi pi-wallet' },
        { id: 'family', label: 'Family', icon: 'pi pi-users' },
        { id: 'bookings', label: 'Bookings', icon: 'pi pi-calendar' },
        { id: 'inquiries', label: 'Inquiries', icon: 'pi pi-comments' },
    ];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly ownerService: OwnerServiceService,
        private readonly messageService: MessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const ownerId = params.get('id');
            if (!ownerId) {
                this.loading = false;
                this.loadError = 'The owner identifier is missing.';
                return;
            }

            this.ownerId = ownerId;
            this.loadOwner();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadOwner(): void {
        this.loading = true;
        this.loadError = '';
        this.avatarFailed = false;
        this.owner = null;

        this.ownerService
            .getOwnerAssets(this.ownerId)
            .pipe(
                timeout(15000),
                takeUntil(this.destroy$),
                finalize(() => {
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                })
            )
            .subscribe({
                next: (response) => {
                    try {
                        const data = this.resolveOwnerAssets(response);

                        if (
                            !(
                                response?.success === true ||
                                response?.status === 'success'
                            ) ||
                            !data.owner
                        ) {
                            this.handleLoadError(
                                this.resolveErrorMessage(response) ||
                                    'Owner information was not returned by the server.'
                            );
                            return;
                        }

                        this.owner = data.owner;
                        const pendingGroup = data.invoices?.[0];
                        const bookingGroups = Array.isArray(data.bookings)
                            ? data.bookings
                            : [];

                        this.pendingInvoiceCount =
                            pendingGroup?.count ??
                            pendingGroup?.invoices?.length ??
                            0;
                        this.pendingBalance = pendingGroup?.totalAmount ?? 0;
                        this.paidInvoices = Array.isArray(data.invoicePaid)
                            ? data.invoicePaid
                            : [];
                        this.bookings = bookingGroups.flatMap((group) =>
                            Array.isArray(group.bookings) ? group.bookings : []
                        );
                        this.familyCount = Array.isArray(
                            data.owner.familyAccount
                        )
                            ? data.owner.familyAccount.length
                            : 0;
                    } catch (error) {
                        console.error('Owner profile response error', error);
                        this.owner = null;
                        this.handleLoadError(
                            'The owner data could not be displayed. Try again.'
                        );
                    }
                },
                error: (error) =>
                    this.handleLoadError(
                        this.resolveErrorMessage(error?.error) ||
                            'The owner profile could not be loaded.'
                    ),
            });
    }

    private resolveOwnerAssets(response: unknown): OwnerAssetResponse {
        if (!response || typeof response !== 'object') return {};

        const envelope = response as Record<string, unknown>;
        const data = envelope['data'];
        const legacyMessage = envelope['message'];

        if (this.hasOwner(data)) return data;

        if (data && typeof data === 'object') {
            const nestedMessage = (data as Record<string, unknown>)['message'];
            if (this.hasOwner(nestedMessage)) return nestedMessage;
        }

        return this.hasOwner(legacyMessage) ? legacyMessage : {};
    }

    private hasOwner(value: unknown): value is OwnerAssetResponse {
        return Boolean(
            value &&
                typeof value === 'object' &&
                (value as Record<string, unknown>)['owner']
        );
    }

    private resolveErrorMessage(value: unknown): string {
        if (typeof value === 'string') return value;
        if (!value || typeof value !== 'object') return '';

        const payload = value as Record<string, unknown>;
        if (typeof payload['message'] === 'string') return payload['message'];
        if (payload['error'] && typeof payload['error'] === 'object') {
            const error = payload['error'] as Record<string, unknown>;
            if (typeof error['message'] === 'string') return error['message'];
            if (typeof error['detail'] === 'string') return error['detail'];
        }
        return '';
    }

    private handleLoadError(message: string): void {
        this.loading = false;
        this.loadError = message;
        this.messageService.add({
            severity: 'error',
            summary: 'Profile unavailable',
            detail: message,
            life: 4500,
        });
    }

    setSection(section: ProfileSection): void {
        this.activeSection = section;
    }

    goBack(): void {
        this.location.back();
    }

    openSettings(): void {
        this.settingsVisible = true;
    }

    refreshOwner(): void {
        this.settingsVisible = false;
        this.loadOwner();
    }

    get fullName(): string {
        return [this.owner?.name, this.owner?.lastname]
            .filter(Boolean)
            .join(' ');
    }

    get initials(): string {
        return (
            [this.owner?.name, this.owner?.lastname]
                .filter(Boolean)
                .map((value) => String(value).charAt(0).toUpperCase())
                .join('') || 'OW'
        );
    }

    get avatarUrl(): string {
        const avatar = this.owner?.avatar;
        if (!avatar || typeof avatar !== 'string') return '';
        if (avatar.startsWith('http') || avatar.startsWith('data:')) {
            return avatar;
        }
        return `${global.url}main-avatar/owners/${avatar}`;
    }

    get properties(): OwnerProperty[] {
        return Array.isArray(this.owner?.propertyDetails)
            ? this.owner.propertyDetails
            : [];
    }

    propertyAddress(property: OwnerProperty): string {
        const address = property.addressId;
        return (
            [
                address?.street_1,
                address?.street_2,
                address?.sector_name,
                address?.city,
                address?.province,
            ]
                .filter(Boolean)
                .join(', ') || 'Address not available'
        );
    }

    bookingLabel(booking: OwnerBooking): string {
        return String(
            booking.areaName ||
                booking.socialArea ||
                (booking['area'] as any)?.name ||
                'Common area booking'
        );
    }

    bookingDate(booking: OwnerBooking): string | undefined {
        return booking.checkIn || booking.createdAt;
    }

    statusLabel(status?: string): string {
        return String(status || 'active').toLowerCase() === 'active'
            ? 'Active'
            : 'Inactive';
    }
}
