import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountPage, PlatformAccount, PlatformService, SaasPlan, SubjectType } from '../../service/platform.service';
interface Selection { subjectType: SubjectType; subjectId: string; }
interface Preview { rows: { name: string; exceeded: string[]; removedModules: string[] }[]; expiresAt: number; token: string; }
@Component({ standalone: true, selector: 'app-platform-migration', imports: [CommonModule, FormsModule], styleUrl: './platform.css', template: `
<section class="platform-shell"><h1>Migración revisada a la capa gratis</h1><p>Selecciona hasta 50 cuentas del mismo tipo. Revisa los excesos y módulos que perderán acceso antes de aplicar.</p>@if (error()) { <p role="alert">{{ error() }}</p> }@if (notice()) { <p role="status">{{ notice() }}</p> }
<label>Plan gratuito<select [(ngModel)]="planId" (ngModelChange)="reset()"><option value="">Seleccionar</option>@for (plan of plans(); track plan._id) { <option [value]="plan._id">{{ plan.name }} — {{ plan.subjectType }}</option> }</select></label>
<form class="toolbar" (ngSubmit)="page = 1; loadAccounts()"><input name="search" [(ngModel)]="search" placeholder="Buscar cuenta"><button>Buscar</button></form>
<div class="check-grid">@for (account of accounts(); track account.id) { <label><input type="checkbox" [disabled]="account.subjectType !== selectedPlan()?.subjectType || busy()" [checked]="selected(account)" (change)="toggle(account, $event)">{{ account.name }} — {{ account.membership?.plan || 'Pendiente de migración' }}</label> }</div>
<div class="pagination"><button (click)="page = page - 1; loadAccounts()" [disabled]="page === 1">Anterior</button><span>Página {{ page }} · {{ selections.length }} seleccionadas</span><button (click)="page = page + 1; loadAccounts()" [disabled]="page * 25 >= total()">Siguiente</button></div>
<button type="button" [disabled]="!planId || !selections.length || busy()" (click)="review()">Previsualizar cambios</button>
@if (preview(); as data) { <div class="editor"><h2>Revisión del lote</h2>@for (row of data.rows; track row.name) { <article><strong>{{ row.name }}</strong><p>Excesos: {{ row.exceeded.join(', ') || 'Ninguno' }}</p><p>Módulos retirados: {{ row.removedModules.join(', ') || 'Ninguno' }}</p></article> }<form (ngSubmit)="apply()"><label>Motivo<textarea name="reason" [(ngModel)]="reason" required maxlength="500"></textarea></label><p>Se conservarán los datos y se aplicarán las prestaciones y cupos del plan seleccionado.</p><button type="submit" [disabled]="busy() || !reason.trim()">Confirmar migración revisada</button></form></div> }</section>` })
export class PlatformMigrationComponent {
  private readonly api = inject(PlatformService);
  readonly plans = signal<SaasPlan[]>([]); readonly accounts = signal<PlatformAccount[]>([]); readonly total = signal(0);
  readonly preview = signal<Preview | null>(null); readonly busy = signal(false); readonly error = signal(''); readonly notice = signal('');
  selections: Selection[] = []; planId = ''; reason = ''; search = ''; page = 1;
  constructor() { this.api.get<SaasPlan[]>('membership-plans').subscribe({ next: plans => this.plans.set(plans.filter(p => p.kind === 'FREE' && p.status === 'active')), error: e => this.failed(e) }); this.loadAccounts(); }
  loadAccounts(): void { this.api.get<AccountPage>(`accounts?page=${this.page}&search=${encodeURIComponent(this.search)}`).subscribe({ next: data => { this.accounts.set(data.rows); this.total.set(data.total); }, error: e => this.failed(e) }); }
  selectedPlan(): SaasPlan | undefined { return this.plans().find(p => p._id === this.planId); }
  selected(account: PlatformAccount): boolean { return this.selections.some(row => row.subjectId === account.id && row.subjectType === account.subjectType); }
  reset(): void { this.preview.set(null); this.selections = []; }
  toggle(account: PlatformAccount, event: Event): void { this.preview.set(null); if ((event.target as HTMLInputElement).checked && this.selections.length < 50) this.selections.push({ subjectType: account.subjectType, subjectId: account.id }); else this.selections = this.selections.filter(row => row.subjectId !== account.id || row.subjectType !== account.subjectType); }
  review(): void { this.busy.set(true); this.api.post<Preview>('migrations/preview', { planId: this.planId, accounts: this.selections }).subscribe({ next: data => { this.preview.set(data); this.busy.set(false); }, error: e => this.failed(e) }); }
  apply(): void { const preview = this.preview(); if (!preview) return; this.busy.set(true); this.api.post<{ migrated: number }>('migrations/apply', { planId: this.planId, accounts: this.selections, reason: this.reason, expiresAt: preview.expiresAt, token: preview.token }).subscribe({ next: data => { this.notice.set(data.migrated + ' cuentas migradas.'); this.busy.set(false); this.reset(); this.loadAccounts(); }, error: e => this.failed(e) }); }
  private failed(e: unknown): void { this.busy.set(false); this.error.set(this.api.errorMessage(e)); }
}
