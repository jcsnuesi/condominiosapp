import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { global } from '../../service/global.service';
import { Membership, SaasPlan } from '../../service/platform.service';
import { AccessContextService } from '../../service/access-context.service';
import { limitLabels, moduleLabels, stateLabels } from './platform-labels';
import { SaasCapacityComponent } from './saas-capacity.component';
import { CapacitySubscriptionView } from '../../service/saas-capacity.types';
interface Subscription { _id: string; planId: string; state: string; paidThrough: string | null; graceUntil: string | null; approvalUrl: string | null; }
interface Charge { _id: string; kind: string; amountMinor: number; occurredAt: string; component?: string; breakdown?: { basePriceMinor?: number; additionalQuantity?: number; extraPriceMinor?: number }; }
interface SubscriptionView extends CapacitySubscriptionView { membership: Membership | null; subscription: Subscription | null; plans: SaasPlan[]; charges: Charge[]; checkoutEnabled: boolean; }
@Component({ standalone: true, selector: 'app-saas-subscription', imports: [CommonModule, SaasCapacityComponent], styleUrl: './platform.css', template: `
<section class="platform-shell"><h1>Mi suscripción a Comunard</h1><p>El plan gratuito es permanente. Los planes de pago se renuevan mensualmente en USD.</p>
@if (error()) { <p role="alert">{{ error() }}</p> }<button type="button" (click)="load()" [disabled]="busy()">Actualizar estado</button>
@if (view(); as data) { <div class="editor"><h2>{{ data.membership?.plan || 'Pendiente de asignación' }}</h2><p>{{ stateLabels[data.subscription?.state || data.membership?.status || ''] }}</p>@if (data.subscription?.paidThrough) { <p>Período pagado hasta {{ data.subscription?.paidThrough | date:'dd/MM/yyyy' }}</p> }@if (data.subscription?.graceUntil) { <p>Regulariza el pago antes del {{ data.subscription?.graceUntil | date:'dd/MM/yyyy' }}. Después se aplicará el plan gratis conservando tus datos.</p> }
@if (data.subscription?.approvalUrl && data.subscription?.state === 'PENDING') { <a class="action-link" [href]="data.subscription?.approvalUrl" rel="noopener noreferrer">Completar contratación en PayPal</a> }
@if (data.subscription?.state === 'PENDING' && !data.subscription?.approvalUrl) { <button type="button" [disabled]="busy()" (click)="subscribe(data.subscription!.planId)">Reintentar contratación pendiente</button> }
@if (data.subscription) { <button type="button" [disabled]="busy()" (click)="confirmCancel.set(true)">Cancelar renovación</button> }</div>
@if (confirmCancel()) { <div class="editor"><p>Se detendrá la renovación. Conservarás las prestaciones hasta terminar el período pagado y luego pasarás al plan gratis.</p><button type="button" [disabled]="busy()" (click)="cancel()">Confirmar cancelación</button><button type="button" (click)="confirmCancel.set(false)">Volver</button></div> }
<app-saas-capacity [data]="data" (updated)="load()" />
<div class="form-grid">@for (plan of data.plans; track plan._id) { <article class="editor"><h2>{{ plan.name }}</h2><p>{{ plan.kind === 'FREE' ? 'Gratis, sin vencimiento' : ((plan.priceMinor || 0) / 100 | currency:'USD') + ' / mes' }}</p><p>Módulos: {{ includedModules(plan) }}</p><dl class="indicator-list">@for (key of plan.subjectType === 'PERSONAL_OWNER' ? ['residences'] : ['condominiums', 'units', 'unitsPerCondominium']; track key) { <div><dt>{{ limitLabels[key] }}</dt><dd>{{ plan.limits[key] === null || plan.limits[key] === undefined ? 'Sin límite' : plan.limits[key] }}</dd></div> }</dl>@if (plan.kind === 'PAID' && !data.subscription) { <button type="button" [disabled]="busy() || !data.checkoutEnabled" (click)="subscribe(plan._id)">Contratar con PayPal</button> }</article> }</div>
<h2>Historial de cobros</h2><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Movimiento</th><th>Importe USD</th><th>Comprobante</th></tr></thead><tbody>@for (charge of data.charges; track charge._id) { <tr><td>{{ charge.occurredAt | date:'dd/MM/yyyy' }}</td><td>{{ charge.kind }}<small>{{ componentLabel(charge.component) }}</small>@if (charge.component === 'RENEWAL' && charge.breakdown) { <small>Base: {{ (charge.breakdown.basePriceMinor || 0) / 100 | currency:'USD' }} · Extras: {{ charge.breakdown.additionalQuantity || 0 }} × {{ (charge.breakdown.extraPriceMinor || 0) / 100 | currency:'USD' }}</small> }</td><td>{{ charge.amountMinor / 100 | currency:'USD' }}</td><td><button (click)="receipt(charge._id)">Descargar</button></td></tr> }</tbody></table></div> }</section>` })
export class SaasSubscriptionComponent {
  private readonly http = inject(HttpClient);
  private readonly access = inject(AccessContextService);
  readonly stateLabels = stateLabels; readonly limitLabels = limitLabels;
  componentLabel(component?: string): string { return ({ RENEWAL: 'Renovación mensual', PRORATION: 'Prorrateo de capacidad adicional', ADJUSTMENT: 'Ajuste de renovación' } as Record<string, string>)[component || 'RENEWAL']; }
  includedModules(plan: SaasPlan): string { return plan.modules === null || plan.modules === undefined ? 'Todos los módulos disponibles' : plan.modules.map(key => moduleLabels[key] || key).join(', ') || 'Ninguno'; }
  readonly view = signal<SubscriptionView | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly confirmCancel = signal(false);
  private readonly requestKeys = new Map<string, string>();
  constructor() { this.load(); }
  load(): void { this.http.get<{ data: SubscriptionView }>(`${global.url}saas/subscription`).subscribe({ next: result => { this.view.set(result.data); this.error.set(''); this.access.refresh().subscribe({ error: e => this.failed(e) }); }, error: e => this.failed(e) }); }
  subscribe(planId: string): void {
    this.busy.set(true); this.error.set('');
    const key = this.requestKeys.get(planId) || crypto.randomUUID(); this.requestKeys.set(planId, key);
    this.http.post<{ data: Subscription }>(`${global.url}saas/subscription`, { planId }, { headers: { 'Idempotency-Key': key } }).subscribe({ next: () => { this.busy.set(false); this.load(); }, error: e => this.failed(e) });
  }
  cancel(): void { this.busy.set(true); this.http.post(`${global.url}saas/subscription/cancel`, {}).subscribe({ next: () => { this.busy.set(false); this.confirmCancel.set(false); this.load(); }, error: e => this.failed(e) }); }
  receipt(id: string): void { this.http.get(`${global.url}saas/receipts/${id}`, { responseType: 'blob' }).subscribe({ next: blob => { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `comunard-${id}.json`; link.click(); URL.revokeObjectURL(url); }, error: e => this.failed(e) }); }
  private failed(e: unknown): void { this.busy.set(false); this.error.set(e instanceof HttpErrorResponse ? e.error?.message || 'No se pudo completar la operación.' : 'No se pudo completar la operación.'); }
}
