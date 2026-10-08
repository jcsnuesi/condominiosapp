import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PlatformService } from '../../service/platform.service';
import { AccessContextService } from '../../service/access-context.service';
import { Router } from '@angular/router';
@Component({ standalone: true, selector: 'app-platform-security', imports: [CommonModule, FormsModule, RouterLink], styleUrl: './platform.css', template: `
<section class="platform-shell"><h1>Seguridad de plataforma</h1><p>Configura tu autenticador y guarda los códigos de recuperación en un lugar seguro.</p>
@if (error()) { <p role="alert">{{ error() }}</p> }
@if (notice()) { <p role="status">{{ notice() }}</p> }
@if (!configured()) { <button type="button" [disabled]="busy()" (click)="setup()">Configurar MFA</button> }
@if (secret()) { <div class="editor"><p>Agrega una cuenta TOTP en tu autenticador con esta clave:</p><code>{{ secret() }}</code><p>Emisor: Comunard. Código de seis dígitos cada 30 segundos.</p></div> }
<form class="editor" (ngSubmit)="verify()"><label>Código de autenticador o recuperación<input name="code" [(ngModel)]="code" autocomplete="one-time-code" maxlength="16" required></label><button type="submit" [disabled]="busy() || !code">{{ configured() ? 'Verificar MFA' : 'Confirmar configuración' }}</button></form>
@if (recoveryCodes().length) { <div class="editor"><h2>Códigos de recuperación</h2><p>Se muestran una sola vez. Cada código puede usarse una vez.</p>@for (item of recoveryCodes(); track item) { <p><code>{{ item }}</code></p> }</div> }
<p><a routerLink="/platform">Volver a plataforma</a></p><button type="button" (click)="revoke()" [disabled]="busy()">Cerrar todas mis sesiones</button></section>` })
export class PlatformSecurityComponent {
  private readonly api = inject(PlatformService);
  private readonly cookies = inject(CookieService);
  private readonly access = inject(AccessContextService);
  private readonly router = inject(Router);
  readonly configured = signal(false);
  readonly busy = signal(false);
  readonly secret = signal('');
  readonly recoveryCodes = signal<string[]>([]);
  readonly error = signal('');
  readonly notice = signal('');
  code = '';
  constructor() { this.api.get<{ enabled: boolean }>('security').subscribe({ next: result => this.configured.set(result.enabled), error: e => this.error.set(this.api.errorMessage(e)) }); }
  setup(): void { this.busy.set(true); this.api.post<{ secret: string }>('security/setup').subscribe({ next: result => { this.secret.set(result.secret); this.busy.set(false); }, error: e => this.failed(e) }); }
  verify(): void {
    this.busy.set(true); this.error.set('');
    this.api.post<{ token: string; recoveryCodes?: string[] }>(this.configured() ? 'security/challenge' : 'security/enroll', { code: this.code }).subscribe({ next: result => {
      this.cookies.set('token', result.token, { path: '/' }); this.configured.set(true); this.secret.set(''); this.code = ''; this.recoveryCodes.set(result.recoveryCodes || []); this.notice.set('MFA verificado. Puedes realizar acciones sensibles durante diez minutos.'); this.busy.set(false);
      this.access.refresh().subscribe({ error: e => this.failed(e) });
    }, error: e => this.failed(e) });
  }
  revoke(): void { this.busy.set(true); this.api.post('security/revoke').subscribe({ next: () => { this.cookies.delete('token', '/'); this.cookies.delete('identity', '/'); this.access.set(null); this.router.navigate(['/auth/login']); }, error: e => this.failed(e) }); }
  private failed(e: unknown): void { this.busy.set(false); this.error.set(this.api.errorMessage(e)); }
}
