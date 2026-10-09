import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformKpis, PlatformService } from '../../service/platform.service';
import { AccessContextService } from '../../service/access-context.service';

@Component({
  standalone: true, selector: 'app-platform-kpis', imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './platform.css',
  template: `
    <section class="platform-shell" aria-labelledby="kpi-title">
      <header class="platform-heading"><div><h1 id="kpi-title">KPIs del SaaS</h1><p>Capacidad y cumplimiento de las cuentas bajo tu supervisión.</p></div><button type="button" (click)="load()" [disabled]="loading()">Actualizar</button></header>
      @if (error()) { <p class="notice error" role="alert">{{ error() }}</p> }
      @if (loading()) { <p role="status">Actualizando indicadores…</p> }
      @if (kpis(); as k) {
        <p class="timestamp">Datos al {{ k.generatedAt | date:'dd/MM/yyyy HH:mm':'-0400' }} · Alcance: {{ access.access()?.scope?.mode === 'ALL' ? 'todas las cuentas' : 'cuentas asignadas' }}</p>
        <div class="metric-grid">
          @for (metric of metrics(k); track metric.label) { <article class="metric"><h2>{{ metric.label }}</h2><strong>{{ metric.value | number }}</strong><p>{{ metric.description }}</p></article> }
        </div>
        <div class="platform-columns">
          @if (k.mrrBaseMinor !== undefined) { <section class="panel"><h2>Desglose comercial</h2><p>Planes base: {{ k.mrrBaseMinor / 100 | currency:'USD' }} / mes</p><p>Capacidad adicional: {{ (k.mrrExtraMinor || 0) / 100 | currency:'USD' }} / mes</p><p>Prorrateos cobrados este mes UTC: {{ (k.prorationRevenueMonthMinor || 0) / 100 | currency:'USD' }}</p><p>Ajustes cobrados este mes UTC: {{ (k.adjustmentRevenueMonthMinor || 0) / 100 | currency:'USD' }}</p></section> }
          <section class="panel"><h2>Suscripciones de Comunard</h2><p>{{ k.freeAccounts || 0 }} gratis · {{ k.paidAccounts || 0 }} de pago · {{ k.graceAccounts || 0 }} en gracia</p>@if (k.mrrMinor !== undefined) { <p>MRR contratado: {{ k.mrrMinor / 100 | currency:'USD' }}</p><p>Cobros del mes UTC: {{ (k.revenueMonthMinor || 0) / 100 | currency:'USD' }}</p><p>Reembolsos y reversos del mes: {{ (k.refundsMonthMinor || 0) / 100 | currency:'USD' }}</p><p>{{ k.cancelledSubscriptions || 0 }} suscripciones canceladas</p> }</section>
          <section class="panel"><h2>Cumplimiento de membresías</h2><dl class="indicator-list"><div><dt>Dentro del plan</dt><dd>{{ k.compliant }}</dd></div><div><dt>Exceden cupos</dt><dd>{{ k.exceeded }}</dd></div><div><dt>Vencidas</dt><dd>{{ k.expired }}</dd></div><div><dt>Suspendidas</dt><dd>{{ k.suspendedMemberships }}</dd></div><div><dt>Pago pendiente</dt><dd>{{ k.pastDue }}</dd></div><div><dt>Vencen en 30 días</dt><dd>{{ k.expiringSoon }}</dd></div><div><dt>Sin membresía configurada</dt><dd>{{ k.unprovisioned }}</dd></div></dl><p>Los estados pueden coincidir en una misma cuenta.</p>@if (access.hasPermission('platform.accounts.read')) { <a routerLink="/platform/accounts">Revisar cuentas y consumo</a> }</section>
          <section class="panel"><h2>Cuentas por plan</h2>@for (plan of k.plans; track plan.plan) { <div class="plan-row"><span>{{ plan.plan }}</span><strong>{{ plan.accounts }}</strong><progress [value]="plan.accounts" [max]="k.accounts || 1" [attr.aria-label]="plan.plan"></progress></div> } @empty { <p>Asigna membresías para ver la distribución por plan.</p> }</section>
        </div>
      }
    </section>`
})
export class PlatformKpisComponent {
  private readonly api = inject(PlatformService);
  readonly access = inject(AccessContextService);
  readonly kpis = signal<PlatformKpis | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  constructor() { this.load(); }
  load(): void { this.loading.set(true); this.error.set(''); this.api.get<PlatformKpis>('kpis').subscribe({ next: value => { this.kpis.set(value); this.loading.set(false); }, error: error => { this.error.set(this.api.errorMessage(error)); this.loading.set(false); } }); }
  metrics(k: PlatformKpis): { label: string; value: number; description: string }[] {
    return [ { label: 'Organizaciones', value: k.organizations, description: 'Cuentas de administración de condominios' }, { label: 'OWNER independientes', value: k.personalOwners, description: 'Cuentas con residencias personales' }, { label: 'Condominios', value: k.condominiums, description: 'Condominios activos registrados' }, { label: 'Unidades', value: k.units, description: 'Capacidad activa, asignada o disponible' }, { label: 'Residencias personales', value: k.residences, description: 'Residencias activas de OWNER independientes' }, { label: 'Cuentas activas', value: k.activeAccounts, description: k.suspendedAccounts + ' cuentas suspendidas o inactivas' } ];
  }
}
