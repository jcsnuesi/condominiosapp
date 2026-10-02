import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import {
    IoTContext,
    IoTDashboard,
    IoTDevice,
    IoTDeviceType,
    IoTService,
} from 'src/app/demo/service/iot.service';
import { UserService } from 'src/app/demo/service/user.service';

interface SelectOption<T> {
    label: string;
    value: T;
}

function payloadOf<T>(response: { data?: T } & Record<string, unknown>): T {
    return (response.data ?? response) as T;
}

function normalizeDashboard(value: Partial<IoTDashboard>): IoTDashboard {
    return {
        total: value.total ?? 0,
        online: value.online ?? 0,
        offline: value.offline ?? 0,
        unknown: value.unknown ?? 0,
        alerts: value.alerts ?? 0,
        plan: value.plan ?? null,
        deviceLimit: value.deviceLimit ?? 0,
        deviceUsage: value.deviceUsage ?? 0,
        remainingDevices: value.remainingDevices ?? 0,
        devices: Array.isArray(value.devices) ? value.devices : [],
        recentAlerts: Array.isArray(value.recentAlerts)
            ? value.recentAlerts
            : [],
        recentActivity: Array.isArray(value.recentActivity)
            ? value.recentActivity
            : [],
    };
}

@Component({
    selector: 'app-iot-dashboard',
    templateUrl: './iot-dashboard.component.html',
    styleUrls: ['./iot-dashboard.component.scss'],
    providers: [MessageService, ConfirmationService],
    standalone: false,
})
export class IoTDashboardComponent {
    private readonly iot = inject(IoTService);
    private readonly messages = inject(MessageService);
    private readonly confirmation = inject(ConfirmationService);
    private readonly userService = inject(UserService);
    readonly canAddResidence =
        String(this.userService.getIdentity()?.role || '').toUpperCase() ===
        'OWNER';

    readonly contexts = signal<IoTContext[]>([]);
    readonly selectedContextId = signal('');
    readonly dashboard = signal<IoTDashboard | null>(null);
    readonly loading = signal(true);
    readonly saving = signal(false);
    readonly errorMessage = signal('');
    readonly deviceDialogOpen = signal(false);
    readonly residenceDialogOpen = signal(false);
    readonly detailsDialogOpen = signal(false);
    readonly selectedDevice = signal<IoTDevice | null>(null);
    readonly latestState = signal<Record<string, unknown> | null>(null);
    readonly deviceName = signal('');
    readonly deviceLocation = signal('');
    readonly selectedDeviceType = signal<IoTDeviceType>('LIGHT');
    readonly temperature = signal(22);
    readonly residenceLabel = signal('');

    readonly selectedContext = computed(
        () =>
            this.contexts().find(
                (context) =>
                    this.contextKey(context) === this.selectedContextId()
            ) ?? null
    );
    readonly deviceTypes: SelectOption<IoTDeviceType>[] = [
        { label: 'Light', value: 'LIGHT' },
        { label: 'Air conditioner', value: 'AIR_CONDITIONER' },
        { label: 'Smart lock', value: 'SMART_LOCK' },
        { label: 'Water sensor', value: 'WATER_SENSOR' },
        { label: 'Energy meter', value: 'ENERGY_METER' },
        { label: 'Water pump', value: 'WATER_PUMP' },
    ];

    constructor() {
        this.loadContexts();
    }

    contextKey(context: IoTContext): string {
        return [
            context.scopeType,
            context.condominiumId ?? '',
            context.unitId ?? '',
            context.residenceId ?? '',
        ].join(':');
    }

    loadContexts(): void {
        this.loading.set(true);
        this.errorMessage.set('');
        this.iot
            .getContexts()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) => {
                    const result = payloadOf(
                        response as {
                            data?: { contexts: IoTContext[] };
                        } & Record<string, unknown>
                    );
                    const contexts = result.contexts ?? [];
                    this.contexts.set(contexts);
                    const current = this.selectedContextId();
                    const selected =
                        contexts.find(
                            (context) => this.contextKey(context) === current
                        ) ??
                        contexts[0] ??
                        null;
                    this.selectedContextId.set(
                        selected ? this.contextKey(selected) : ''
                    );
                    if (selected) this.loadDashboard(selected);
                    else this.dashboard.set(null);
                },
                error: (error: { error?: { message?: string } }) => {
                    this.errorMessage.set(
                        error.error?.message ||
                            'Smart Home could not load. Try again.'
                    );
                },
            });
    }

    onContextChange(key: string): void {
        this.selectedContextId.set(key);
        const context = this.selectedContext();
        if (context) this.loadDashboard(context);
    }

    loadDashboard(context = this.selectedContext()): void {
        if (!context) return;
        this.loading.set(true);
        this.errorMessage.set('');
        this.iot
            .getDashboard(context)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.dashboard.set(
                        normalizeDashboard(
                            payloadOf(
                                response as {
                                    data?: Partial<IoTDashboard>;
                                } & Record<string, unknown>
                            )
                        )
                    ),
                error: (error: { error?: { message?: string } }) => {
                    this.errorMessage.set(
                        error.error?.message ||
                            'Devices could not load. Try again.'
                    );
                },
            });
    }

    openNewDevice(): void {
        this.deviceName.set('');
        this.deviceLocation.set('');
        this.selectedDeviceType.set('LIGHT');
        this.deviceDialogOpen.set(true);
    }

    saveDevice(): void {
        const context = this.selectedContext();
        const displayName = this.deviceName().trim();
        if (!context || !displayName || this.saving()) return;
        this.saving.set(true);
        this.iot
            .createDevice(context, {
                displayName,
                deviceType: this.selectedDeviceType(),
                location: this.deviceLocation().trim(),
                idempotencyKey: this.createIdempotencyKey(),
            })
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe({
                next: () => {
                    this.deviceDialogOpen.set(false);
                    this.messages.add({
                        severity: 'success',
                        summary: 'Device added',
                        detail: displayName,
                    });
                    this.loadContexts();
                },
                error: (error: { error?: { message?: string } }) => {
                    this.messages.add({
                        severity: 'error',
                        summary: 'Device not added',
                        detail:
                            error.error?.message ||
                            'Check the subscription and try again.',
                    });
                },
            });
    }

    openNewResidence(): void {
        this.residenceLabel.set('');
        this.residenceDialogOpen.set(true);
    }

    saveResidence(): void {
        const label = this.residenceLabel().trim();
        if (!label || this.saving()) return;
        this.saving.set(true);
        this.iot
            .createResidence(label)
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe({
                next: () => {
                    this.residenceDialogOpen.set(false);
                    this.messages.add({
                        severity: 'success',
                        summary: 'Residence added',
                        detail: label,
                    });
                    this.loadContexts();
                },
                error: (error: { error?: { message?: string } }) => {
                    this.messages.add({
                        severity: 'error',
                        summary: 'Residence not added',
                        detail: error.error?.message || 'Try again.',
                    });
                },
            });
    }

    powerValue(device: IoTDevice): string {
        return String(device.shadow?.reported?.['power'] ?? '');
    }

    setPower(device: IoTDevice): void {
        const value = this.powerValue(device) === 'ON' ? 'OFF' : 'ON';
        this.sendCommand(device, { power: value });
    }

    setLock(device: IoTDevice): void {
        const value =
            device.shadow?.reported?.['lock'] === 'LOCKED' ? 'UNLOCK' : 'LOCK';
        this.sendCommand(device, { lock: value });
    }

    setTemperature(device: IoTDevice): void {
        this.sendCommand(device, { temperature: this.temperature() });
    }

    sendCommand(
        device: IoTDevice,
        command: Record<string, string | number>
    ): void {
        this.iot.controlDevice(device.id, command).subscribe({
            next: () => {
                this.messages.add({
                    severity: 'success',
                    summary: 'Command sent',
                    detail: device.displayName,
                });
                const context = this.selectedContext();
                if (context) this.loadDashboard(context);
            },
            error: (error: { error?: { message?: string } }) => {
                this.messages.add({
                    severity: 'error',
                    summary: 'Command not sent',
                    detail:
                        error.error?.message ||
                        'The device did not accept the command.',
                });
            },
        });
    }

    showDetails(device: IoTDevice): void {
        this.selectedDevice.set(device);
        this.latestState.set(null);
        this.detailsDialogOpen.set(true);
        this.iot.getDeviceState(device.id).subscribe({
            next: (response) => {
                const result = payloadOf(
                    response as {
                        data?: { state: Record<string, unknown> };
                    } & Record<string, unknown>
                );
                this.latestState.set(result.state ?? {});
            },
            error: () => this.latestState.set(device.shadow ?? {}),
        });
    }

    confirmDelete(device: IoTDevice): void {
        this.confirmation.confirm({
            header: 'Remove device',
            message: `Remove ${device.displayName} from this residence?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Remove',
            rejectLabel: 'Keep device',
            accept: () => this.removeDevice(device),
        });
    }

    removeDevice(device: IoTDevice): void {
        this.iot.deleteDevice(device.id).subscribe({
            next: () => {
                this.messages.add({
                    severity: 'success',
                    summary: 'Device removed',
                    detail: device.displayName,
                });
                this.detailsDialogOpen.set(false);
                this.loadContexts();
            },
            error: (error: { error?: { message?: string } }) => {
                this.messages.add({
                    severity: 'error',
                    summary: 'Device removal pending',
                    detail: error.error?.message || 'Try again later.',
                });
            },
        });
    }

    acknowledgeAlert(eventId: string): void {
        this.iot.acknowledgeAlert(eventId).subscribe({
            next: () => {
                const context = this.selectedContext();
                if (context) this.loadDashboard(context);
            },
            error: (error: { error?: { message?: string } }) => {
                this.messages.add({
                    severity: 'error',
                    summary: 'Alert not acknowledged',
                    detail: error.error?.message || 'Try again.',
                });
            },
        });
    }

    deviceIcon(type: IoTDeviceType): string {
        const icons: Record<IoTDeviceType, string> = {
            LIGHT: 'pi pi-sun',
            AIR_CONDITIONER: 'pi pi-sliders-h',
            SMART_LOCK: 'pi pi-lock',
            WATER_SENSOR: 'pi pi-exclamation-circle',
            ENERGY_METER: 'pi pi-chart-line',
            WATER_PUMP: 'pi pi-sync',
        };
        return icons[type];
    }

    statusText(device: IoTDevice): string {
        if (device.status === 'ERROR') return 'Needs attention';
        if (device.status !== 'ACTIVE') return 'Setting up';
        if (device.connectivity === 'ONLINE') return 'Online';
        if (device.connectivity === 'OFFLINE') return 'Offline';
        return 'Awaiting signal';
    }

    private createIdempotencyKey(): string {
        return (
            globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(16).slice(2)}`
        );
    }
}
