import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { global } from '../../service/global.service';
import { UserService } from '../../service/user.service';
import { AccessContextService } from '../../service/access-context.service';

interface OnboardingStatus {
  name: string;
  completed: boolean;
  condominiumCount: number;
  unitCount: number;
  ownerCount: number;
  firstCondominiumId: string | null;
}

@Component({
  selector: 'app-organization-onboarding', standalone: true,
  imports: [RouterLink, ButtonModule, TagModule, ProgressSpinnerModule],
  templateUrl: './organization-onboarding.component.html',
  styleUrl: './organization-onboarding.component.css',
})
export class OrganizationOnboardingComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly user = inject(UserService);
  private readonly access = inject(AccessContextService);
  readonly status = signal<OnboardingStatus | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() { this.refresh(); }

  refresh(): void {
    this.loading.set(true); this.error.set('');
    this.http.get<{ data: { message: OnboardingStatus } }>(`${global.url}organization/onboarding`)
      .pipe(finalize(() => this.loading.set(false))).subscribe({
        next: response => this.status.set(response.data.message),
        error: () => this.error.set('We could not load your progress. Please try again.'),
      });
  }

  finish(): void {
    if (this.loading()) return;
    this.loading.set(true); this.error.set('');
    this.http.post(`${global.url}organization/onboarding/complete`, {})
      .pipe(switchMap(() => this.access.refresh()), finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/start', this.user.getIdentity()._id]),
        error: (_error: HttpErrorResponse) => this.error.set('We could not save your progress. Please try again.'),
      });
  }
}
