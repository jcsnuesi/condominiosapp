import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { global } from '../../../service/global.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly http = inject(HttpClient);
  readonly step = signal<'choice' | 'account' | 'organization' | 'sent'>('choice');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  form = { name: '', lastname: '', email: '', phone: '', password: '', company: '',
    street_1: '', city: '', state: '', country: 'República Dominicana', terms: false };

  next(form: NgForm): void {
    if (form.invalid) { form.control.markAllAsTouched(); return; }
    this.step.set('organization');
  }

  resend(): void {
    if (this.busy()) return;
    this.busy.set(true); this.error.set(''); this.notice.set('');
    this.http.post(`${global.url}auth/admin/resend-verification`, { email: this.form.email })
      .pipe(finalize(() => this.busy.set(false))).subscribe({
        next: () => this.notice.set('Si tu cuenta sigue pendiente, recibirás un nuevo enlace. Revisa también el correo no deseado.'),
        error: () => this.error.set('No pudimos reenviar el enlace. Intenta nuevamente.'),
      });
  }

  submit(form: NgForm): void {
    if (form.invalid || !this.form.terms || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.http.post(`${global.url}auth/admin/register`, this.form)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => { this.form.password = ''; this.step.set('sent'); },
        error: (err: HttpErrorResponse) => this.error.set(err.error?.error?.message || err.error?.message || 'No pudimos crear tu cuenta. Intenta nuevamente.'),
      });
  }
}
