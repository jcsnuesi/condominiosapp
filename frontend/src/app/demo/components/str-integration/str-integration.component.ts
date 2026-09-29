import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

import { UserService } from '../../service/user.service';
import { StrService } from '../../service/str.service';
import { OwnerServiceService } from '../../service/owner-service.service';
import { CondominioService } from '../../service/condominios.service';

@Component({
    selector: 'app-str-integration',
    standalone: true,
    templateUrl: './str-integration.component.html',
    styleUrl: './str-integration.component.css',
    imports: [
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TabsModule,
        TagModule,
        CardModule,
    ],
    providers: [MessageService],
})
export class StrIntegrationComponent implements OnInit {
    token = '';
    identity: any;

    condoOptions: Array<{ label: string; value: string }> = [];
    selectedCondoId = '';

    loadingChannels = false;
    loadingReservations = false;
    loadingConflicts = false;
    syncingChannelId = '';

    channels: any[] = [];
    reservations: any[] = [];
    conflicts: any[] = [];

    channelForm = {
        id: '',
        channelType: 'AIRBNB',
        channelLabel: '',
        calendarUrl: '',
        apartmentUnit: '',
        syncFrequencyMinutes: 30,
        status: 'active',
    };

    channelTypeOptions = [
        { label: 'Airbnb', value: 'AIRBNB' },
        { label: 'Booking', value: 'BOOKING' },
        { label: 'VRBO', value: 'VRBO' },
        { label: 'Direct', value: 'DIRECT' },
        { label: 'Other', value: 'OTHER' },
    ];

    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Error', value: 'error' },
    ];

    private createdBy: string;

    constructor(
        private userService: UserService,
        private strService: StrService,
        private ownerService: OwnerServiceService,
        private condominioService: CondominioService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.token = this.userService.getToken();
        this.identity = this.userService.getIdentity();
        this.createdBy = this.identity?.createdBy ?? this.identity?._id ?? '';
    }

    ngOnInit(): void {
        this.loadCondominiums();
    }

    get isAdminOrSecurity(): boolean {
        const role = String(this.identity?.role || '').toUpperCase();
        return ['ADMIN', 'STAFF_ADMIN', 'STAFF'].includes(role);
    }

    private extractData<T>(response: any, fallback: T): T {
        if (response?.data !== undefined && response?.data !== null) {
            return response.data as T;
        }
        if (response?.message !== undefined && response?.message !== null) {
            return response.message as T;
        }
        return fallback;
    }

    private setViewState(mutator: () => void, afterUpdate?: () => void): void {
        setTimeout(() => {
            mutator();
            this.changeDetectorRef.detectChanges();
            afterUpdate?.();
        });
    }

    private setCondoOptions(
        options: Array<{ label: string; value: string }>
    ): void {
        this.setViewState(
            () => {
                this.condoOptions = options;
                this.selectedCondoId = options[0]?.value ?? '';
            },
            () => {
                if (this.selectedCondoId) {
                    this.refreshData();
                }
            }
        );
    }

    private setChannelsState(channels: any[], loadingChannels = false): void {
        this.setViewState(() => {
            this.channels = channels;
            this.loadingChannels = loadingChannels;
        });
    }

    private setReservationsState(
        reservations: any[],
        loadingReservations = false
    ): void {
        this.setViewState(() => {
            this.reservations = reservations;
            this.loadingReservations = loadingReservations;
        });
    }

    private setConflictsState(
        conflicts: any[],
        loadingConflicts = false
    ): void {
        this.setViewState(() => {
            this.conflicts = conflicts;
            this.loadingConflicts = loadingConflicts;
        });
    }

    private setChannelsLoading(loadingChannels: boolean): void {
        this.setViewState(() => {
            this.loadingChannels = loadingChannels;
        });
    }

    private setReservationsLoading(loadingReservations: boolean): void {
        this.setViewState(() => {
            this.loadingReservations = loadingReservations;
        });
    }

    private setConflictsLoading(loadingConflicts: boolean): void {
        this.setViewState(() => {
            this.loadingConflicts = loadingConflicts;
        });
    }

    private setSyncingChannel(channelId: string): void {
        this.setViewState(() => {
            this.syncingChannelId = channelId;
        });
    }

    private describeSyncResult(result: any): string {
        const fetched = Number(result?.fetched || 0);
        const upserted = Number(result?.upserted || 0);
        const conflicts = Number(result?.conflicts || 0);

        return `Sync completed: ${fetched} events read, ${upserted} saved, ${conflicts} conflicts.`;
    }

    private finishChannelChange(resetForm = false): void {
        if (resetForm) {
            this.resetForm();
        }

        this.loadChannels();
        this.loadReservations();
        if (this.isAdminOrSecurity) {
            this.loadConflicts();
        }
    }

    private syncChannelById(
        channelId: string,
        options: { resetFormOnComplete?: boolean; saveContext?: boolean } = {}
    ): void {
        if (!channelId) {
            this.finishChannelChange(Boolean(options.resetFormOnComplete));
            return;
        }

        this.setSyncingChannel(channelId);
        this.strService.syncChannel(channelId).subscribe({
            next: (response) => {
                const result = this.extractData<any>(response, {});
                this.messageService.add({
                    severity: 'success',
                    summary: options.saveContext
                        ? 'Saved and synced'
                        : 'Synced',
                    detail: this.describeSyncResult(result),
                });
                this.setSyncingChannel('');
                this.finishChannelChange(Boolean(options.resetFormOnComplete));
            },
            error: (error) => {
                this.messageService.add({
                    severity: options.saveContext ? 'warn' : 'error',
                    summary: options.saveContext
                        ? 'Saved, sync failed'
                        : 'Sync failed',
                    detail:
                        error?.error?.error?.detail ||
                        error?.error?.error?.message ||
                        error?.error?.message ||
                        'Could not sync iCal channel',
                });
                this.setSyncingChannel('');
                this.finishChannelChange(Boolean(options.resetFormOnComplete));
            },
        });
    }

    private extractCondoOptions(
        response: any
    ): Array<{ label: string; value: string }> {
        const result: Array<{ label: string; value: string }> = [];

        const ownerProperties =
            response?.message?.propertyDetails ||
            response?.data?.propertyDetails ||
            [];
        if (Array.isArray(ownerProperties) && ownerProperties.length > 0) {
            ownerProperties.forEach((property: any) => {
                if (property?.addressId?._id) {
                    result.push({
                        label: property?.addressId?.alias || 'Condominium',
                        value: property.addressId._id,
                    });
                }
            });
            return result;
        }

        const adminProperties = response?.message || response?.data || [];

        if (Array.isArray(adminProperties)) {
            adminProperties.forEach((condo: any) => {
                if (condo?._id) {
                    result.push({
                        label: condo?.alias || 'Condominium',
                        value: condo._id,
                    });
                }
            });
        }

        return result;
    }

    loadCondominiums(): void {
        if (this.isAdminOrSecurity) {
            this.condominioService.getProperties(this.createdBy).subscribe({
                next: (response) => {
                    this.setCondoOptions(this.extractCondoOptions(response));
                },
            });
            return;
        }

        this.ownerService.getPropertyByOwner(this.identity._id).subscribe({
            next: (response) => {
                this.setCondoOptions(this.extractCondoOptions(response));
            },
        });
    }

    onCondoChange(): void {
        this.refreshData();
    }

    refreshData(): void {
        if (!this.selectedCondoId) return;
        this.loadChannels();
        if (this.isAdminOrSecurity) {
            this.loadConflicts();
        }
    }

    loadChannels(): void {
        this.setChannelsLoading(true);
        this.strService
            .listChannels({ condoId: this.selectedCondoId })
            .subscribe({
                next: (response) => {
                    this.setChannelsState(
                        this.extractData<any[]>(response, [])
                    );
                },
                error: () => {
                    this.setChannelsState([]);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not load STR channels',
                    });
                },
            });
    }

    loadReservations(): void {
        this.setReservationsLoading(true);
        this.strService
            .listExternalReservations(this.selectedCondoId)
            .subscribe({
                next: (response) => {
                    const data = this.extractData<any>(response, { docs: [] });
                    this.setReservationsState(
                        Array.isArray(data?.docs) ? data.docs : []
                    );
                },
                error: () => {
                    this.setReservationsState([]);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not load external reservations',
                    });
                },
            });
    }

    loadConflicts(): void {
        this.setConflictsLoading(true);
        this.strService.listConflicts(this.selectedCondoId).subscribe({
            next: (response) => {
                const data = this.extractData<any>(response, { docs: [] });
                this.setConflictsState(
                    Array.isArray(data?.docs) ? data.docs : []
                );
            },
            error: () => {
                this.setConflictsState([]);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not load conflict list',
                });
            },
        });
    }

    editChannel(channel: any): void {
        this.channelForm = {
            id: channel._id,
            channelType: channel.channelType,
            channelLabel: channel.channelLabel || '',
            calendarUrl: channel.calendarUrl || '',
            apartmentUnit: channel?.metadata?.apartmentUnit || '',
            syncFrequencyMinutes: channel.syncFrequencyMinutes || 30,
            status: channel.status || 'active',
        };
    }

    resetForm(): void {
        this.channelForm = {
            id: '',
            channelType: 'AIRBNB',
            channelLabel: '',
            calendarUrl: '',
            apartmentUnit: '',
            syncFrequencyMinutes: 30,
            status: 'active',
        };
    }

    saveChannel(): void {
        if (!this.selectedCondoId || !this.channelForm.calendarUrl) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Select condominium and enter a valid iCal URL',
            });
            return;
        }

        const payload: any = {
            condoId: this.selectedCondoId,
            channelType: this.channelForm.channelType,
            channelLabel: this.channelForm.channelLabel,
            calendarUrl: this.channelForm.calendarUrl,
            apartmentUnit: this.channelForm.apartmentUnit,
            syncFrequencyMinutes: this.channelForm.syncFrequencyMinutes,
            status: this.channelForm.status,
        };

        if (this.channelForm.id) {
            payload.id = this.channelForm.id;
        }

        this.strService.upsertChannel(payload).subscribe({
            next: (response) => {
                const savedChannel = this.extractData<any>(response, null);
                if (savedChannel?._id) {
                    this.syncChannelById(savedChannel._id, {
                        resetFormOnComplete: true,
                        saveContext: true,
                    });
                    return;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Saved',
                    detail: 'Channel configuration saved',
                });
                this.finishChannelChange(true);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error?.error?.error?.message ||
                        error?.error?.message ||
                        'Could not save channel',
                });
            },
        });
    }

    syncChannel(channel: any): void {
        this.syncChannelById(channel?._id);
    }

    toggleStatus(channel: any): void {
        const nextStatus = channel.status === 'active' ? 'inactive' : 'active';
        this.strService.updateChannelStatus(channel._id, nextStatus).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Channel is now ${nextStatus}`,
                });
                this.loadChannels();
            },
        });
    }

    formatDate(value: string | Date): string {
        if (!value) return '-';
        return new Date(value).toLocaleString('es-DO');
    }

    getConflictSeverity(status: string): 'danger' | 'warning' | 'info' {
        if (status === 'confirmed') return 'danger';
        if (status === 'potential') return 'warning';
        return 'info';
    }
}
