import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { global } from '../../service/global.service';
import { BillingAdjustment, CapacityChange, CapacitySubscriptionView, CondominiumCapacity } from '../../service/saas-capacity.types';

@Component({ standalone: true, selector: 'app-saas-capacity', imports: [CommonModule, FormsModule], styleUrl: './platform.css', template: `
@if (data.capacity; as capacity) {
  <section class="editor" aria-labelledby="capacity-title"><h2 id="capacity-title">{{ capacity.resource === 'units' ? 'Capacidad de unidades' : 'Capacidad de residencias personales' }}</h2>
    <dl class="indicator-list"><div><dt>Incluidas en el plan</dt><dd>{{ capacity.included ?? 'Sin límite' }}</dd></div><div><dt>Adicionales contratadas</dt><dd>{{ capacity.additional }}</dd></div><div><dt>Capacidad total</dt><dd>{{ capacity.total ?? 'Sin límite' }}</dd></div><div><dt>Utilizadas</dt><dd>{{ capacity.used }}</dd></div>
      @if (capacity.distributionEnabled) { <div><dt>Cupos asignados</dt><dd>{{ capacity.allocated }}</dd></div><div><dt>Capacidad sin asignar</dt><dd>{{ capacity.unallocated ?? 'Sin límite' }}</dd></div> }
    </dl>
    @if (error()) { <p role="alert" class="notice error">{{ error() }}</p> }
    @if (notice()) { <p role="status" class="notice">{{ notice() }}</p> }
    @if (data.extraPriceMinor && capacity.total !== null && data.subscription?.state === 'ACTIVE' && !data.pendingChange) {
      <form #extraForm="ngForm" (ngSubmit)="quoteCapacity()"><label>Cantidad total de {{ capacity.resource === 'units' ? 'unidades' : 'residencias' }} adicionales que deseas contratar<input type="number" name="additionalQuantity" min="0" step="1" required [(ngModel)]="quantity" (ngModelChange)="quote.set(null)"></label>
        <p>Cada cupo adicional cuesta {{ data.extraPriceMinor / 100 | currency:'USD' }} al mes, aunque esté vacío.</p>
        <button type="submit" [disabled]="extraForm.invalid || busy() || !data.checkoutEnabled || quantity === capacity.additional">Cotizar cambio de capacidad</button>
      </form>
    }
    @if (quote(); as quoted) { <div class="panel"><h3>Revisar contratación</h3><p>Adicionales: {{ quoted.after.additionalQuantity }} · Nueva mensualidad: {{ quoted.after.priceMinor / 100 | currency:'USD' }}</p><p>Pago inmediato por el período restante: {{ quoted.prorationMinor / 100 | currency:'USD' }}</p><p>La nueva mensualidad está prevista desde {{ quoted.effectiveAt | date:'dd/MM/yyyy HH:mm':'-0400' }}; se confirmará con PayPal.</p><p>{{ quoted.after.priceMinor > quoted.before.priceMinor ? 'La ampliación se activa al confirmar el pago y la autorización de renovación.' : 'La reducción se aplica al renovar, sin devolución del período actual.' }}</p><p>Cotización válida hasta {{ quoted.expiresAt | date:'HH:mm':'-0400' }}.</p><button (click)="contract(quoted)" [disabled]="busy()">Confirmar y autorizar en PayPal</button><button (click)="quote.set(null)" [disabled]="busy()">Volver</button></div> }
    @if (data.pendingChange; as change) { <div class="panel"><h3>Cambio pendiente</h3><p>{{ changeLabel(change.state) }}</p><p>{{ change.after.additionalQuantity }} adicionales · {{ change.after.priceMinor / 100 | currency:'USD' }} / mes</p>
      @if (change.failureReason) { <p role="status">{{ change.failureReason }}</p> }
      @if (change.approvalUrl) { <a class="action-link" [href]="change.approvalUrl" rel="noopener noreferrer">{{ change.state === 'RESTORING' ? 'Autorizar restauración de mensualidad' : 'Autorizar nueva mensualidad en PayPal' }}</a> }
      @if (change.paymentUrl && change.state === 'PAYMENT') { <a class="action-link" [href]="change.paymentUrl" rel="noopener noreferrer">Pagar prorrateo de {{ change.prorationMinor / 100 | currency:'USD' }}</a> }
      <button (click)="complete(change)" [disabled]="busy()">Verificar autorización y pago</button>
      @if (change.state !== 'RESTORING') { <button (click)="cancelChange(change)" [disabled]="busy()">Cancelar cambio</button> }
    </div> }
    @for (adjustment of data.adjustments || []; track adjustment._id) { <div class="panel"><h3>Ajuste de renovación</h3><p>{{ adjustment.differenceMinor > 0 ? 'Diferencia pendiente de pago' : 'Devolución pendiente' }}: {{ abs(adjustment.differenceMinor) / 100 | currency:'USD' }}</p>
      @if (adjustment.paymentUrl) { <a class="action-link" [href]="adjustment.paymentUrl" rel="noopener noreferrer">Pagar diferencia</a> }<button (click)="completeAdjustment(adjustment)" [disabled]="busy()">{{ adjustment.paymentUrl ? 'Verificar pago' : 'Conciliar ajuste' }}</button>
    </div> }
  </section>
  @if (capacity.resource === 'units' && (capacity.distributionEnabled || capacity.canEnableDistribution)) {
    <section class="editor"><h2>{{ capacity.distributionEnabled ? 'Distribución por condominio' : 'Vista previa de distribución por condominio' }}</h2><p>Asigna capacidad a cada condominio. Redistribuir cupos dentro del total contratado no cambia la mensualidad.</p>
      @if (!capacity.distributionEnabled) { <p>Al confirmar esta distribución, los cupos individuales reemplazarán el máximo uniforme por condominio para esta organización.</p> }
      <form #distributionForm="ngForm" (ngSubmit)="saveDistribution()"><div class="table-wrap"><table><thead><tr><th>Condominio</th><th>Unidades activas</th><th>Cupo asignado</th></tr></thead><tbody>@for (row of allocations; track row.condominiumId) { <tr><td>{{ row.name }} {{ row.active ? '' : '(inactivo)' }}</td><td>{{ row.used }}</td><td><input type="number" [name]="row.condominiumId" [attr.aria-label]="'Cupo de ' + row.name" [min]="row.used" step="1" required [(ngModel)]="row.capacity"></td></tr> }</tbody></table></div>
        <p>Total asignado: {{ assigned() }} / {{ capacity.total ?? 'Sin límite' }}. Sin asignar: {{ capacity.total === null ? 'Sin límite' : capacity.total - assigned() }}.</p>
        <button type="submit" [disabled]="distributionForm.invalid || busy() || (capacity.total !== null && assigned() > capacity.total)">{{ capacity.distributionEnabled ? 'Guardar distribución' : 'Confirmar y activar distribución' }}</button>
      </form>
    </section>
  }
}` })
export class SaasCapacityComponent implements OnChanges {
  private readonly http = inject(HttpClient);
  @Input({ required: true }) data!: CapacitySubscriptionView;
  @Output() readonly updated = new EventEmitter<void>();
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly quote = signal<CapacityChange | null>(null);
  quantity = 0;
  allocations: CondominiumCapacity[] = [];
  private requestKey = '';
  ngOnChanges(): void { this.quantity = this.data.capacity?.additional || 0; this.allocations = (this.data.capacity?.condominiums || []).map(row => ({ ...row })); }
  abs(value: number): number { return Math.abs(value); }
  assigned(): number { return this.allocations.reduce((total, row) => total + (Number(row.capacity) || 0), 0); }
  changeLabel(state: string): string { return ({ CREATED: 'Preparando autorización', APPROVAL: 'Esperando autorización de la nueva mensualidad', PAYMENT: 'Esperando pago del prorrateo', SCHEDULED: 'Reducción programada para la renovación', RESTORING: 'Restaurando las condiciones anteriores; puede requerir autorización en PayPal' } as Record<string, string>)[state] || state; }
  quoteCapacity(): void { this.busy.set(true); this.error.set(''); this.http.post<{ data: CapacityChange }>(`${global.url}saas/capacity/quote`, { additionalQuantity: this.quantity }).subscribe({ next: result => { this.quote.set(result.data); this.requestKey = crypto.randomUUID(); this.busy.set(false); }, error: e => this.failed(e) }); }
  contract(quote: CapacityChange): void { this.post('changes', { quoteId: quote._id }, { 'Idempotency-Key': this.requestKey }); }
  complete(change: CapacityChange): void { this.post(`changes/${change._id}/complete`); }
  cancelChange(change: CapacityChange): void { this.post(`changes/${change._id}/cancel`); }
  completeAdjustment(adjustment: BillingAdjustment): void { this.post(`adjustments/${adjustment._id}/complete`); }
  saveDistribution(): void {
    this.busy.set(true); this.error.set('');
    this.http.put(`${global.url}saas/capacity/distribution`, { revision: this.data.capacity?.revision, allocations: this.allocations.map(row => ({ condominiumId: row.condominiumId, capacity: row.capacity })) }).subscribe({ next: () => { this.busy.set(false); this.quote.set(null); this.notice.set('Distribución guardada.'); this.updated.emit(); }, error: e => this.failed(e) });
  }
  private post(path: string, body: unknown = {}, headers: Record<string, string> = {}): void {
    this.busy.set(true); this.error.set(''); this.http.post(`${global.url}saas/capacity/${path}`, body, { headers }).subscribe({ next: () => { this.busy.set(false); this.quote.set(null); this.updated.emit(); }, error: e => { this.updated.emit(); this.failed(e); } });
  }
  private failed(e: unknown): void { this.busy.set(false); this.error.set(e instanceof HttpErrorResponse ? e.error?.message || 'No se pudo completar el cambio de capacidad.' : 'No se pudo completar el cambio de capacidad.'); }
}
