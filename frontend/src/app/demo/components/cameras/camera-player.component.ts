import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, input, signal, viewChild, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Camera, CameraLiveSession, CamerasService } from '../../service/cameras.service';
import { connectWhep, LiveConnection } from './whep-client';

@Component({
  selector: 'app-camera-player', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="monitor">
      <video #video autoplay muted playsinline [srcObject]="stream()" [attr.aria-label]="camera().displayName"></video>
      @if (!stream()) { <div class="placeholder">{{ connecting() ? 'Conectando video…' : 'Vista en vivo' }}</div> }
    </div>
    <div class="controls">
      @if (!stream()) { <button type="button" [disabled]="connecting()" (click)="start()">Ver en vivo</button> }
      @else {
        <button type="button" (click)="stop()">Cerrar video</button>
        <button type="button" (click)="fullscreen()">Pantalla completa</button>
      }
    </div>
    @if (error()) { <p role="alert">{{ error() }}</p> }
  `,
  styles: [`
    :host{display:block}.monitor{position:relative;aspect-ratio:16/9;background:#e8ecec;border-radius:6px;overflow:hidden}
    video{width:100%;height:100%;object-fit:contain;background:transparent}.placeholder{position:absolute;inset:0;display:grid;place-items:center;color:#536769}
    .controls{display:flex;gap:.75rem;padding-top:.85rem}button{padding:.55rem .85rem;border:1px solid #c8d4d5;border-radius:5px;background:white;color:#21494d;cursor:pointer}
    button:disabled{opacity:.6;cursor:wait}button:focus-visible{outline:3px solid #357d85;outline-offset:3px}p{color:#9b3333;font-size:.9rem}
  `],
})
export class CameraPlayerComponent implements OnDestroy {
  readonly camera = input.required<Camera>();
  readonly stream = signal<MediaStream | null>(null);
  readonly error = signal('');
  readonly connecting = signal(false);
  private readonly api = inject(CamerasService);
  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private connection: LiveConnection | null = null;
  private session: CameraLiveSession | null = null;
  private abort: AbortController | null = null;
  private renewal: ReturnType<typeof setTimeout> | null = null;
  private expiry: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;

  async start(): Promise<void> {
    if (this.connecting() || this.connection) return;
    const generation = ++this.generation;
    this.connecting.set(true); this.error.set(''); const abort = new AbortController(); this.abort = abort;
    try {
      const response = await firstValueFrom(this.api.live(this.camera().id));
      if (!response.data) throw new Error('No se pudo abrir la cámara.');
      if (generation !== this.generation) {
        await firstValueFrom(this.api.close(this.camera().id, response.data.id)).catch(() => undefined); return;
      }
      this.session = response.data;
      this.armExpiry(response.data.expiresAt);
      const connection = await connectWhep(response.data.whepUrl, response.data.token, abort.signal);
      if (generation !== this.generation) { await connection.close(); return; }
      this.connection = connection; this.stream.set(connection.stream);
      this.scheduleRenewal();
    } catch (failure: unknown) {
      if (generation === this.generation) { await this.stop(); this.error.set(failure instanceof Error ? failure.message : 'No se pudo conectar la cámara.'); }
    } finally { if (generation === this.generation) this.connecting.set(false); }
  }

  private armExpiry(expiresAt: string): void {
    if (this.expiry) clearTimeout(this.expiry);
    this.expiry = setTimeout(() => {
      void this.stop(); this.error.set('La sesión expiró. Abre de nuevo la cámara.');
    }, Math.max(0, new Date(expiresAt).getTime() - Date.now()));
  }
  private scheduleRenewal(): void {
    this.renewal = setTimeout(async () => {
      const session = this.session, generation = this.generation;
      if (!session) return;
      try {
        const response = await firstValueFrom(this.api.renew(this.camera().id, session.id));
        if (generation !== this.generation) return;
        if (!response.data) throw new Error('La sesión de video no se pudo renovar.');
        this.armExpiry(response.data.expiresAt); this.scheduleRenewal();
      } catch { if (generation === this.generation) { await this.stop(); this.error.set('El acceso al video terminó. Abre de nuevo la cámara.'); } }
    }, 40000);
  }
  async stop(): Promise<void> {
    ++this.generation;
    this.abort?.abort(); this.abort = null;
    if (this.renewal) clearTimeout(this.renewal);
    if (this.expiry) clearTimeout(this.expiry);
    const connection = this.connection, session = this.session;
    this.connection = null; this.session = null; this.stream.set(null); this.connecting.set(false);
    await Promise.all([connection?.close(), session ? firstValueFrom(this.api.close(this.camera().id, session.id)).catch(() => undefined) : undefined]);
  }
  fullscreen(): void { void this.video()?.nativeElement.requestFullscreen().catch(() => this.error.set('Este navegador no permite pantalla completa.')); }
  ngOnDestroy(): void { void this.stop(); }
}
