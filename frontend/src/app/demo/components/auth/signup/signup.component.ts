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
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  confirmPassword = '';
  form = { name: '', lastname: '', email: '', phone: '', password: '', company: '',
    street_1: '', city: '', state: '', country: 'Dominican Republic', terms: false };

  get passwordsMatch(): boolean {
    return this.form.password.length > 0 && this.form.password === this.confirmPassword;
  }

  next(form: NgForm): void {
    if (form.invalid || !this.passwordsMatch) { form.control.markAllAsTouched(); return; }
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
    this.error.set('');
    this.step.set('organization');
  }

  resend(): void {
    if (this.busy()) return;
    this.busy.set(true); this.error.set(''); this.notice.set('');
    this.http.post(`${global.url}auth/admin/resend-verification`, { email: this.form.email })
      .pipe(finalize(() => this.busy.set(false))).subscribe({
        next: () => this.notice.set('If your account is still pending, you will receive a new link. Check your spam folder too.'),
        error: () => this.error.set('We could not resend the link. Please try again.'),
      });
  }

  submit(form: NgForm): void {
    if (this.busy()) return;
    if (form.invalid || !this.form.terms || !this.passwordsMatch) {
      form.control.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.http.post(`${global.url}auth/admin/register`, this.form)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => { this.form.password = ''; this.confirmPassword = ''; this.step.set('sent'); },
        error: (err: HttpErrorResponse) => this.error.set(err.error?.error?.message || err.error?.message || 'We could not create your account. Please try again.'),
      });
  }
}
