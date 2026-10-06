import { Injectable, NgZone, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { global } from '../demo/service/global.service';

export interface SupportDestination {
  condominiumId: string;
  alias: string;
  staffId: string;
  status?: 'available' | 'busy' | 'offline';
}
interface CallSession { token: string | null; destinations: SupportDestination[]; }
export interface SupportCall {
  callId: string;
  alias: string;
  name: string;
  residentRole: string;
  units: string[];
  state: 'ringing' | 'connecting' | 'active';
}
interface Ack { ok: boolean; code?: string; iceServers?: RTCIceServer[]; }
interface CallSignal { callId: string; description?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit; }

@Injectable({ providedIn: 'root' })
export class SupportCallService {
  private readonly http = inject(HttpClient);
  private readonly zone = inject(NgZone);
  readonly destinations = signal<SupportDestination[]>([]);
  readonly call = signal<SupportCall | null>(null);
  readonly available = signal(false);
  readonly connected = signal(false);
  readonly preparing = signal(false);
  readonly muted = signal(false);
  readonly message = signal('');
  readonly seconds = signal(0);
  readonly audioBlocked = signal(false);
  role = '';
  private socket: Socket | null = null;
  private stream: MediaStream | null = null;
  private peer: RTCPeerConnection | null = null;
  private remoteAudio: HTMLAudioElement | null = null;
  private sound: AudioContext | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private durationTimer: ReturnType<typeof setInterval> | null = null;
  private ringTimer: ReturnType<typeof setInterval> | null = null;
  private refreshing = false;
  private sessionGeneration = 0;
  private mediaGeneration = 0;
  private signals: CallSignal[] = [];
  private signalChain: Promise<void> = Promise.resolve();
  private readonly visibility = () => {
    if (document.hidden && this.available()) this.setAvailable(false);
  };
  private readonly unload = () => this.stop();

  connect(role: string): void {
    this.stop();
    this.role = role.toUpperCase();
    if (!['OWNER', 'FAMILY', 'STAFF'].includes(this.role)) return;
    document.addEventListener('visibilitychange', this.visibility);
    window.addEventListener('pagehide', this.unload);
    void this.refresh();
    this.refreshTimer = setInterval(() => void this.refresh(), 60000);
  }

  private async refresh(): Promise<void> {
    if (this.refreshing) return;
    const generation = this.sessionGeneration;
    this.refreshing = true;
    try {
      const session = await firstValueFrom(this.http.get<CallSession>(`${global.url}calls/session`));
      if (generation !== this.sessionGeneration) return;
      if (!session.token) { this.destinations.set([]); return; }
      if (this.socket) {
        this.socket.auth = { token: session.token };
        if (this.socket.connected) await this.request('calls:refresh', { token: session.token });
        else this.socket.connect();
      } else {
        this.destinations.set(session.destinations.map((target) => ({ ...target, status: 'offline' })));
        this.socket = io(window.location.origin, { path: '/calls/socket.io/', auth: { token: session.token }, autoConnect: false });
        this.bindSocket();
        this.socket.connect();
      }
    } catch {
      if (generation === this.sessionGeneration) this.message.set('No se pudo actualizar la atención. Se reintentará automáticamente.');
    } finally { this.refreshing = false; }
  }

  private bindSocket(): void {
    const socket = this.socket!;
    socket.on('connect', () => this.zone.run(() => this.connected.set(true)));
    socket.on('connect_error', () => this.zone.run(() => {
      this.connected.set(false);
      this.message.set('Servicio de llamadas no disponible.');
    }));
    socket.on('disconnect', () => this.zone.run(() => {
      this.connected.set(false);
      this.available.set(false);
      this.destinations.update((targets) => targets.map((target) => ({ ...target, status: 'offline' })));
      if (this.call() || this.preparing()) this.message.set('La llamada terminó por pérdida de conexión.');
      this.clearMedia();
      this.call.set(null);
    }));
    socket.on('calls:destinations', (targets: SupportDestination[]) => this.zone.run(() => {
      this.destinations.set(targets);
      if (!targets.length) this.available.set(false);
    }));
    socket.on('calls:created', (call: SupportCall) => this.zone.run(() => {
      this.call.set(call);
      this.preparing.set(false);
    }));
    socket.on('calls:incoming', (call: SupportCall) => this.zone.run(() => {
      this.call.set(call);
      this.message.set('');
      this.beep();
      this.ringTimer = setInterval(() => this.beep(), 2000);
    }));
    socket.on('calls:accepted', (call: SupportCall & { initiator: boolean }) => this.zone.run(() => {
      this.stopRinging();
      this.call.set(call);
      void this.createPeer(call.callId, call.initiator).catch(() => this.failCall(call.callId));
    }));
    socket.on('calls:signal', (payload: CallSignal) => this.zone.run(() => {
      if (payload.callId !== this.call()?.callId) return;
      this.signals.push(payload);
      this.drainSignals();
    }));
    socket.on('calls:active', ({ callId }: { callId: string }) => this.zone.run(() => {
      if (callId !== this.call()?.callId) return;
      this.call.update((call) => call ? { ...call, state: 'active' } : null);
      const started = Date.now();
      this.durationTimer = setInterval(() => this.seconds.set(Math.floor((Date.now() - started) / 1000)), 1000);
    }));
    socket.on('calls:answered_elsewhere', ({ callId }: { callId: string }) => this.zone.run(() => {
      if (callId !== this.call()?.callId) return;
      this.clearMedia();
      this.call.set(null);
      this.message.set('La llamada se atendió en otra sesión.');
    }));
    socket.on('calls:ended', ({ callId, result }: { callId: string; result: string }) => this.zone.run(() => {
      if (callId !== this.call()?.callId) return;
      this.clearMedia();
      this.call.set(null);
      const messages: Record<string, string> = { rejected: 'Atención rechazó la llamada.', missed: 'Atención no respondió.', failed: 'No se pudo establecer el audio.', disconnected: 'La llamada terminó por pérdida de conexión.', cancelled: 'Llamada cancelada.', service_restart: 'El servicio se reinició. Puedes volver a llamar.', ended: 'Llamada finalizada.' };
      this.message.set(messages[result] || 'Llamada finalizada.');
    }));
  }

  private request(event: string, body: object): Promise<Ack> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) { reject(new Error('offline')); return; }
      this.socket.timeout(10000).emit(event, body, (error: Error | null, response: Ack) => {
        if (error || !response?.ok) reject(new Error(response?.code || 'service_unavailable'));
        else resolve(response);
      });
    });
  }

  private async microphone(): Promise<MediaStream> {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error('microphone_unavailable');
    const generation = this.mediaGeneration;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
    if (generation !== this.mediaGeneration) { stream.getTracks().forEach((track) => track.stop()); throw new Error('cancelled'); }
    return stream;
  }

  async setAvailable(value: boolean): Promise<void> {
    if (!value) {
      this.available.set(false);
      if (this.socket?.connected) void this.request('calls:availability', { available: false }).catch(() => {});
      return;
    }
    if (this.preparing()) return;
    this.preparing.set(true);
    try {
      await this.unlockSound();
      const stream = await this.microphone();
      stream.getTracks().forEach((track) => track.stop());
      if (document.hidden) throw new Error('offline');
      await this.request('calls:availability', { available: true });
      this.available.set(true);
      this.message.set('Disponible mientras mantengas la app abierta.');
    } catch (error) { this.showError(error); }
    finally { this.preparing.set(false); }
  }

  async start(target: SupportDestination): Promise<void> {
    if (this.call() || this.preparing()) return;
    this.preparing.set(true);
    this.message.set('');
    try {
      await this.unlockSound();
      this.stream = await this.microphone();
      await this.request('calls:start', { condominiumId: target.condominiumId });
    } catch (error) {
      if (this.call()) void this.end();
      this.clearMedia();
      this.showError(error);
    }
    finally { this.preparing.set(false); }
  }

  async accept(): Promise<void> {
    const callId = this.call()?.callId;
    if (!callId || this.preparing()) return;
    this.preparing.set(true);
    try {
      this.stream = await this.microphone();
      if (this.call()?.callId !== callId) { this.clearMedia(); return; }
      await this.request('calls:accept', { callId });
    } catch (error) {
      if (this.call()?.callId === callId) void this.end();
      this.clearMedia();
      this.showError(error);
    } finally { this.preparing.set(false); }
  }

  async end(): Promise<void> {
    const callId = this.call()?.callId;
    this.clearMedia();
    this.call.set(null);
    if (callId) {
      try { await this.request('calls:end', { callId }); }
      catch { this.socket?.disconnect(); }
    }
  }

  toggleMute(): void {
    this.muted.update((value) => !value);
    this.stream?.getAudioTracks().forEach((track) => track.enabled = !this.muted());
  }

  async playAudio(): Promise<void> {
    try { await this.remoteAudio?.play(); this.audioBlocked.set(false); }
    catch { this.message.set('Toca Activar audio para escuchar la llamada.'); }
  }

  private async createPeer(callId: string, initiator: boolean): Promise<void> {
    const ice = await this.request('calls:ice', { callId });
    if (this.call()?.callId !== callId || !this.stream) return;
    const peer = new RTCPeerConnection({ iceServers: ice.iceServers });
    this.peer = peer;
    this.remoteAudio = new Audio();
    this.remoteAudio.autoplay = true;
    peer.ontrack = (event) => {
      if (this.peer !== peer || !this.remoteAudio) return;
      this.remoteAudio.srcObject = event.streams[0] || new MediaStream([event.track]);
      void this.remoteAudio.play().catch(() => this.zone.run(() => this.audioBlocked.set(true)));
    };
    peer.onicecandidate = (event) => {
      if (event.candidate && this.peer === peer) void this.request('calls:signal', { callId, candidate: event.candidate.toJSON() }).catch(() => this.failCall(callId));
    };
    peer.onconnectionstatechange = () => this.zone.run(() => {
      if (this.peer !== peer) return;
      if (peer.connectionState === 'connected') void this.request('calls:connected', { callId }).catch(() => this.failCall(callId));
      if (peer.connectionState === 'failed') this.failCall(callId);
    });
    this.stream.getTracks().forEach((track) => peer.addTrack(track, this.stream!));
    if (initiator) {
      await peer.setLocalDescription(await peer.createOffer());
      await this.request('calls:signal', { callId, description: peer.localDescription?.toJSON() });
    }
    this.drainSignals();
  }

  private drainSignals(): void {
    const callId = this.call()?.callId;
    this.signalChain = this.signalChain.then(async () => {
      const peer = this.peer;
      if (!peer) return;
      const pending: CallSignal[] = [];
      while (this.signals.length && this.peer === peer) {
        const payload = this.signals.shift()!;
        if (payload.description) {
          await peer.setRemoteDescription(payload.description);
          if (payload.description.type === 'offer') {
            await peer.setLocalDescription(await peer.createAnswer());
            await this.request('calls:signal', { callId: payload.callId, description: peer.localDescription?.toJSON() });
          }
        } else if (payload.candidate) {
          if (peer.remoteDescription) await peer.addIceCandidate(payload.candidate);
          else pending.push(payload);
        }
      }
      if (peer.remoteDescription) {
        for (const payload of pending) await peer.addIceCandidate(payload.candidate!);
      } else this.signals.unshift(...pending);
    }).catch(() => { if (callId) this.failCall(callId); });
  }

  private failCall(expectedId?: string): void {
    const callId = this.call()?.callId;
    if (expectedId && expectedId !== callId) return;
    if (callId) void this.request('calls:end', { callId, reason: 'failed' }).catch(() => this.socket?.disconnect());
    this.clearMedia();
    this.call.set(null);
    this.message.set('No se pudo establecer el audio. Revisa tu conexión y vuelve a llamar.');
  }

  private async unlockSound(): Promise<void> {
    this.sound ??= new AudioContext();
    await this.sound.resume();
  }

  private beep(): void {
    if (!this.sound || this.sound.state !== 'running') return;
    const tone = this.sound.createOscillator();
    const gain = this.sound.createGain();
    tone.frequency.value = 660;
    gain.gain.value = 0.08;
    tone.connect(gain).connect(this.sound.destination);
    tone.start();
    tone.stop(this.sound.currentTime + 0.25);
  }

  private stopRinging(): void {
    if (this.ringTimer) clearInterval(this.ringTimer);
    this.ringTimer = null;
  }

  private clearMedia(): void {
    this.mediaGeneration++;
    this.stopRinging();
    if (this.durationTimer) clearInterval(this.durationTimer);
    this.durationTimer = null;
    const peer = this.peer;
    this.peer = null;
    peer?.close();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.remoteAudio?.pause();
    if (this.remoteAudio) this.remoteAudio.srcObject = null;
    this.remoteAudio = null;
    this.signals = [];
    this.muted.set(false);
    this.audioBlocked.set(false);
    this.preparing.set(false);
    this.seconds.set(0);
  }

  private showError(error: unknown): void {
    const code = error instanceof Error ? error.message : '';
    const messages: Record<string, string> = { busy: 'Atención está ocupada.', offline: 'Atención no está conectada.', unauthorized: 'Ya no tienes acceso a este servicio.', rate_limited: 'Espera un momento antes de volver a llamar.', already_answered: 'La llamada ya fue atendida.', cancelled: 'Operación cancelada.' };
    this.message.set(messages[code] || (['NotAllowedError', 'NotFoundError', 'NotReadableError'].includes(error instanceof Error ? error.name : '') || code === 'microphone_unavailable' ? 'Permite el micrófono y abre la app con HTTPS para llamar.' : 'No se pudo completar la llamada. Inténtalo nuevamente.'));
  }

  stop(): void {
    this.sessionGeneration++;
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = null;
    this.socket?.disconnect();
    this.socket = null;
    this.clearMedia();
    this.call.set(null);
    this.connected.set(false);
    this.available.set(false);
    this.destinations.set([]);
    if (this.sound) void this.sound.close();
    this.sound = null;
    document.removeEventListener('visibilitychange', this.visibility);
    window.removeEventListener('pagehide', this.unload);
  }
}
