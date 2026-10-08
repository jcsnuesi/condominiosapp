import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Camera, CameraContext, CameraRecording, CameraSetup, CamerasService } from '../../service/cameras.service';
import { AccessContextService } from '../../service/access-context.service';
import { IoTGateway, IoTInventoryService } from '../../service/iot-inventory.service';
import { CameraPlayerComponent } from './camera-player.component';

@Component({
  selector: 'app-cameras', standalone: true, imports: [CommonModule, FormsModule, CameraPlayerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './cameras.component.html', styleUrl: './cameras.component.scss',
})
export class CamerasComponent implements OnInit, OnDestroy {
  private readonly api = inject(CamerasService);
  private readonly inventory = inject(IoTInventoryService);
  readonly access = inject(AccessContextService);
  readonly contexts = signal<CameraContext[]>([]);
  readonly contextIndex = signal(0);
  readonly cameras = signal<Camera[]>([]);
  readonly gateways = signal<IoTGateway[]>([]);
  readonly recordings = signal<CameraRecording[]>([]);
  readonly selected = signal<Camera | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly nextCamera = signal<string | null>(null);
  readonly nextRecording = signal<string | null>(null);
  readonly context = computed(() => this.contexts()[this.contextIndex()]);
  readonly canManage = computed(() => this.access.hasPermission('cameras.manage'));
  readonly canLive = computed(() => this.access.hasPermission('cameras.live'));
  readonly canRecordings = computed(() => this.access.hasPermission('cameras.recordings.read'));
  readonly formVisible = signal(false);
  readonly setupStep = signal(0);
  readonly editingCamera = signal<Camera | null>(null);
  readonly steps = ['Ubicación', 'Equipo', 'Conexión', 'Revisión'];
  manufacturer = ''; model = ''; firmware = '';
  sourceKind: 'IP_CAMERA' | 'DVR_NVR' = 'DVR_NVR';
  channel = 1;
  motionDeclaration: 'YES' | 'NO' | 'UNKNOWN' = 'UNKNOWN';
  host = ''; port = 554; streamPath = ''; username = ''; password = '';
  displayName = '';
  gatewayId = '';
  protocol: 'RTSP' | 'ONVIF' = 'RTSP';
  date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  readonly playbackUrl = signal<string | null>(null);
  private playbackExpiry: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;
  private timelineGeneration = 0;
  private createKey = crypto.randomUUID();
  private createFingerprint = '';
  private destroyed = false;

  async ngOnInit(): Promise<void> {
    this.busy.set(true);
    try {
      const response = await firstValueFrom(this.api.contexts());
      if (this.destroyed) return;
      this.contexts.set(response.data?.contexts ?? []);
      await this.loadContext(0);
    } catch (failure: unknown) { this.showError(failure); }
    finally { this.busy.set(false); }
  }
  private showError(failure: unknown): void {
    if (failure instanceof HttpErrorResponse) {
      const body: unknown = failure.error;
      const code = body && typeof body === 'object' && 'code' in body ? String(body.code) : '';
      this.error.set(code === 'CAMERA_CODEC_UNSUPPORTED' ? 'El stream debe usar H.264. Cambia la codificación del canal en tu cámara o DVR/NVR y vuelve a comprobar.'
        : code === 'CAMERA_NOT_READY' ? 'Todavía no llega video. Espera unos segundos; si continúa, revisa IP, ruta y credenciales con “Revisar configuración”.'
        : code === 'CAMERA_SETUP_UNCONFIGURED' ? 'El gateway aún necesita activar el registro seguro de cámaras. Solicita su configuración inicial.'
        : code === 'CAMERA_SETUP_INVALID' ? 'Revisa la IP local, puerto, ruta de video y datos del equipo.'
        : code === 'CAMERAS_DISABLED' ? 'La integración de cámaras aún no está habilitada. Contacta al administrador.'
        : failure.status === 403 ? 'No tienes permiso para realizar esta acción.'
        : 'No se pudo completar la operación. Revisa la conexión y vuelve a intentar.');
    } else this.error.set(failure instanceof Error ? failure.message : 'No se pudo completar la operación.');
  }
  async loadContext(index: number): Promise<void> {
    if (index !== this.contextIndex()) this.closeSetup();
    const generation = ++this.generation;
    this.contextIndex.set(index); this.selected.set(null); this.recordings.set([]); this.cameras.set([]);
    this.gateways.set([]); this.error.set(''); this.nextCamera.set(null); this.stopPlayback(); ++this.timelineGeneration;
    this.gatewayId = '';
    const context = this.context();
    if (!context) return;
    this.busy.set(true);
    try {
      const response = await firstValueFrom(this.api.list(context.scope));
      if (generation !== this.generation) return;
      this.cameras.set(response.data?.cameras ?? []); this.nextCamera.set(response.data?.nextCursor ?? null);
      if (this.canManage() && this.access.hasPermission('iot.read')) {
        const gateways = await firstValueFrom(this.inventory.listGateways(context.scope));
        if (generation === this.generation) this.gateways.set((gateways.data?.gateways ?? []).filter((gateway) => gateway.status === 'ACTIVE'));
      }
    } catch (failure: unknown) { if (generation === this.generation) this.showError(failure); }
    finally { if (generation === this.generation) this.busy.set(false); }
  }
  async moreCameras(): Promise<void> {
    const context = this.context(), after = this.nextCamera(), generation = this.generation;
    if (!context || !after || this.busy()) return;
    this.busy.set(true);
    try {
      const response = await firstValueFrom(this.api.list(context.scope, after));
      if (generation !== this.generation) return;
      this.cameras.update((items) => [...items, ...(response.data?.cameras ?? [])]); this.nextCamera.set(response.data?.nextCursor ?? null);
    } catch (failure: unknown) { this.showError(failure); } finally { this.busy.set(false); }
  }
  async register(): Promise<void> {
    const context = this.context();
    if (!context || !this.gatewayId || !this.displayName.trim() || this.busy() || !this.validateStep(0) || !this.validateStep(1) || !this.validateStep(2)) return;
    this.busy.set(true); this.error.set('');
    try {
      const setup = this.setupInput(), editing = this.editingCamera();
      const fingerprint = JSON.stringify({ scope: context.scope, gatewayId: this.gatewayId, displayName: this.displayName.trim(), protocol: this.protocol, setup });
      if (this.createFingerprint && fingerprint !== this.createFingerprint) this.createKey = crypto.randomUUID();
      this.createFingerprint = fingerprint;
      if (editing) await firstValueFrom(this.api.setup(editing.id, setup));
      else await firstValueFrom(this.api.create({ scope: context.scope, gatewayId: this.gatewayId, displayName: this.displayName.trim(), protocol: 'RTSP', idempotencyKey: this.createKey, setup }));
      if (this.destroyed) return;
      this.createKey = crypto.randomUUID(); this.closeSetup();
      this.notice.set('Configuración guardada. Cuando el gateway esté conectado recibirá los datos. Espera unos segundos y pulsa “Comprobar video”. Puedes agregar otra cámara en esta ubicación.');
      await this.loadContext(this.contextIndex());
    } catch (failure: unknown) { this.showError(failure); } finally { this.busy.set(false); }
  }
  openSetup(camera?: Camera): void {
    if (this.busy()) return;
    this.closeSetup(); this.error.set(''); this.notice.set(''); this.formVisible.set(true);
    this.editingCamera.set(camera ?? null); this.setupStep.set(camera ? 1 : 0);
    this.displayName = camera?.displayName ?? ''; this.gatewayId = camera?.gatewayId ?? (this.gateways().length === 1 ? this.gateways()[0].id : '');
    this.manufacturer = camera?.equipment?.manufacturer ?? ''; this.model = camera?.equipment?.model ?? '';
    this.firmware = camera?.equipment?.firmware ?? ''; this.channel = camera?.equipment?.channel ?? 1;
    this.sourceKind = camera?.equipment?.sourceKind ?? 'DVR_NVR'; this.motionDeclaration = camera?.equipment?.motionDeclaration ?? 'UNKNOWN';
  }
  closeSetup(): void {
    this.formVisible.set(false); this.editingCamera.set(null); this.setupStep.set(0);
    this.password = ''; this.username = ''; this.host = ''; this.streamPath = ''; this.port = 554;
    this.createFingerprint = ''; this.createKey = crypto.randomUUID();
  }
  nextSetup(): void { if (this.validateStep(this.setupStep())) { this.error.set(''); this.setupStep.update((value) => Math.min(3, value + 1)); } }
  submitSetup(): void { if (this.setupStep() < 3) this.nextSetup(); else void this.register(); }
  suggestHikvisionPath(stream: 1 | 2): void {
    if (this.manufacturer.trim().toLowerCase() === 'hikvision' && Number.isInteger(this.channel) && this.channel >= 1 && this.channel <= 256)
      this.streamPath = `/Streaming/Channels/${this.channel * 100 + stream}`;
  }
  private validateStep(step: number): boolean {
    let message = '';
    if (step === 0 && (!this.context() || !this.displayName.trim() || !this.gatewayId ||
      (!this.editingCamera() && !this.gateways().some((gateway) => gateway.id === this.gatewayId)))) message = 'Indica un nombre y selecciona un gateway de esta ubicación.';
    if (step === 1 && (!this.manufacturer.trim() || !this.model.trim() || !Number.isInteger(this.channel) || this.channel < 1 || this.channel > 256))
      message = 'Indica marca, modelo y canal. Si desconoces la marca o el modelo, escribe “Desconocido”.';
    const octets = this.host.split('.').map(Number);
    const local = /^\d{1,3}(\.\d{1,3}){3}$/.test(this.host) && octets.every((n) => n >= 0 && n <= 255) &&
      (octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168));
    if (step === 2 && (!local || !Number.isInteger(this.port) || this.port < 1 || this.port > 65535 || !this.streamPath.startsWith('/') ||
      this.streamPath.startsWith('//') || /[\s#@]/.test(this.streamPath) || (this.password && !this.username)))
      message = 'Usa la IP privada del equipo, un puerto válido y una ruta que empiece por /. Introduce el usuario si el equipo requiere contraseña.';
    if (message) this.error.set(message);
    return !message;
  }
  private setupInput(): CameraSetup {
    return { manufacturer: this.manufacturer.trim(), model: this.model.trim(), firmware: this.firmware.trim(),
      sourceKind: this.sourceKind, channel: this.channel, motionDeclaration: this.motionDeclaration,
      connection: { host: this.host, port: this.port, path: this.streamPath, username: this.username, password: this.password } };
  }
  motionLabel(camera: Camera): string {
    return camera.motionStatus === 'CONFIRMED' ? 'Movimiento verificado' : camera.motionStatus === 'UNAVAILABLE' ? 'Solo video en vivo'
      : 'Eventos de movimiento sin verificar';
  }
  async select(camera: Camera): Promise<void> {
    this.selected.set(camera); await this.loadRecordings();
  }
  async activate(camera: Camera): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true); this.error.set('');
    try { await firstValueFrom(this.api.activate(camera.id)); await this.loadContext(this.contextIndex()); }
    catch (failure: unknown) { this.showError(failure); } finally { this.busy.set(false); }
  }
  async changeStatus(camera: Camera, status: 'DISABLED' | 'PROVISIONING'): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true); this.error.set('');
    try {
      await firstValueFrom(this.api.changeStatus(camera.id, status));
      this.notice.set(status === 'DISABLED' ? 'Cámara deshabilitada. El gateway retirará su conexión.' : 'Reconexión solicitada. Espera unos segundos y comprueba el video.');
      await this.loadContext(this.contextIndex());
    } catch (failure: unknown) { this.showError(failure); } finally { this.busy.set(false); }
  }
  async loadRecordings(more = false): Promise<void> {
    const camera = this.selected();
    if (!camera || !this.canRecordings()) return;
    const generation = ++this.timelineGeneration;
    this.stopPlayback(); this.error.set('');
    const from = new Date(`${this.date}T00:00:00`), to = new Date(`${this.date}T23:59:59.999`);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) return;
    try {
      const response = await firstValueFrom(this.api.recordings(camera.id, from.toISOString(), to.toISOString(), more ? this.nextRecording() ?? undefined : undefined));
      if (generation !== this.timelineGeneration) return;
      this.recordings.set(more ? [...this.recordings(), ...(response.data?.recordings ?? [])] : response.data?.recordings ?? []);
      this.nextRecording.set(response.data?.nextCursor ?? null);
    } catch (failure: unknown) { if (generation === this.timelineGeneration) this.showError(failure); }
  }
  async play(recording: CameraRecording): Promise<void> {
    this.stopPlayback();
    const generation = ++this.timelineGeneration;
    try {
      const response = await firstValueFrom(this.api.playback(recording.id));
      if (generation !== this.timelineGeneration || !response.data) return;
      this.playbackUrl.set(response.data.url);
      this.playbackExpiry = setTimeout(() => this.stopPlayback(), Math.max(0, new Date(response.data.expiresAt).getTime() - Date.now()));
    } catch (failure: unknown) { this.showError(failure); }
  }
  stopPlayback(): void { this.playbackUrl.set(null); if (this.playbackExpiry) clearTimeout(this.playbackExpiry); }
  label(camera: Camera): string { return { ACTIVE: 'Disponible', PROVISIONING: 'Pendiente de conexión', DISABLED: 'Deshabilitada', REVOKED: 'Acceso revocado' }[camera.status]; }
  ngOnDestroy(): void { this.destroyed = true; ++this.generation; ++this.timelineGeneration; this.stopPlayback(); this.closeSetup(); }
}
