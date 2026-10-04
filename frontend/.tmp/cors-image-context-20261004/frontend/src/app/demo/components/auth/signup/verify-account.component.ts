import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { global } from '../../../service/global.service';

@Component({
  selector: 'app-verify-account', standalone: true, imports: [RouterLink],
  styleUrl: './signup.component.css',
  template: `<main class="signup-page"><section class="signup-panel" aria-labelledby="verify-title">
    <a class="brand" routerLink="/auth/login">Condominios App</a>
    <p class="eyebrow">VERIFICAR CUENTA</p><h1 id="verify-title">{{ verified() ? 'Tu cuenta está lista' : 'Confirma tu correo' }}</h1>
    @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
    @if (verified()) { <p role="status">Inicia sesión para comenzar a configurar {{ type === 'admin' ? 'tu organización' : 'tu vivienda' }}.</p><a class="primary" routerLink="/auth/login">Iniciar sesión</a> }
    @else { <p>Confirma que deseas activar tu cuenta {{ type === 'admin' ? 'ADMIN' : 'OWNER personal' }}.</p>
      <button class="primary" [disabled]="busy()" (click)="verify()">{{ busy() ? 'Verificando…' : 'Verificar mi cuenta' }}</button> }
    <footer><a routerLink="/auth/register">Volver al registro</a></footer>
  </section></main>`,
})
export class VerifyAccountComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  readonly type = this.route.snapshot.paramMap.get('type');
  readonly verified = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');

  verify(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token || !/^[a-f0-9]{64}$/i.test(token) || !['admin', 'owner'].includes(this.type || '')) {
      this.error.set('El enlace no es válido. Vuelve al registro para solicitar uno nuevo.'); return;
    }
    if (this.busy()) return;
    this.busy.set(true); this.error.set('');
    const request = this.type === 'admin'
      ? this.http.post(`${global.url}auth/admin/verify/${token}`, {})
      : this.http.get(`${global.url}iot/owners/verify/${token}`);
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => this.verified.set(true),
      error: (err: HttpErrorResponse) => this.error.set(err.error?.error?.message || err.error?.message || 'No pudimos verificar tu cuenta. Intenta nuevamente.'),
    });
  }
}
