import { Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { BankAccount, BankFields, BankMovement, BankReconciliationService, Candidate, Confirmation, Receipt, Statement } from '../../service/bank-reconciliation.service';
import { UserService } from '../../service/user.service';
import { AccessContextService } from '../../service/access-context.service';

@Component({
  selector: 'app-bank-reconciliation', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-reconciliation.component.html',
  styleUrl: './bank-reconciliation.component.css',
})
export class BankReconciliationComponent implements OnChanges {
  @Input() invoiceId = '';
  @Input() condominiumId = '';
  @Input() ownerMode = false;
  @Input() ownerId = '';
  @Input() condominiums: Array<{ label: string; value: string }> = [];
  @Output() condominiumIdChange = new EventEmitter<string>();
  readonly credits = signal<Array<{ condominiumId: string; currency: string; amount: number }>>([]);
  private readonly api = inject(BankReconciliationService);
  private readonly user = inject(UserService);
  private readonly access = inject(AccessContextService);
  private readonly destroyRef = inject(DestroyRef);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly accounts = signal<BankAccount[]>([]);
  readonly receipts = signal<Receipt[]>([]);
  readonly candidates = signal<Candidate[]>([]);
  readonly selected = signal<Receipt | null>(null);
  readonly statement = signal<Statement | null>(null);
  readonly statements = signal<Statement[]>([]);
  readonly confirmation = signal<Confirmation | null>(null);
  accountId = '';
  bank = '';
  accountLabel = '';
  currency = 'DOP';
  note = '';
  correctionNote = '';
  correction: BankFields = {};
  movementId = '';
  reviewed = false;
  file: File | null = null;
  statementFile: File | null = null;
  columnFields = [ { key: 'date', label: 'Fecha' }, { key: 'amount', label: 'Monto' }, { key: 'reference', label: 'Referencia' }, { key: 'currency', label: 'Moneda' }, { key: 'description', label: 'Descripción' }, { key: 'direction', label: 'Tipo abono/débito' } ];
  columns: Record<string, string> = {};
  dateFormat = 'DMY';
  decimalSeparator = '.';
  headerRow = 1;
  private refreshPending = false;
  get csvHeaders() { return this.statement()?.rawRows?.[this.headerRow - 1] || []; }
  get canAdmin() { return !this.ownerMode && this.user.isAdmin() && this.access.hasPermission('finance.update'); }
  get canCreateAccount() { return this.canAdmin && this.access.hasPermission('finance.create'); }
  selectCondominium(value: string) { this.condominiumIdChange.emit(value || ''); }
  ngOnChanges() {
    this.accountId = ''; this.selected.set(null); this.statement.set(null); this.statements.set([]); this.receipts.set([]); this.candidates.set([]);
    if (this.busy()) this.refreshPending = true; else this.refresh();
  }
  async run(action: () => Promise<void>) {
    if (this.busy()) return;
    this.busy.set(true); this.error.set(''); this.message.set('');
    try { await action(); } catch (error: unknown) {
      const failure = error as { error?: { error?: { message?: string }; message?: string } };
      this.error.set(failure.error?.error?.message || failure.error?.message || 'No se pudo completar la operación. Intente nuevamente.');
    } finally { this.busy.set(false); if (this.refreshPending) { this.refreshPending = false; this.refresh(); } }
  }
  private value<T>(source: import('rxjs').Observable<T>) { return firstValueFrom(source.pipe(takeUntilDestroyed(this.destroyRef))); }
  async load() {
    const query = this.condominiumId ? { condominiumId: this.condominiumId } : {};
    const accounts = await this.value(this.api.get<{ docs: BankAccount[] }>('bank-accounts', query));
    this.accounts.set(accounts.docs);
    const filter = this.invoiceId ? { invoiceId: this.invoiceId } : query;
    this.receipts.set((await this.value(this.api.get<{ docs: Receipt[] }>('receipts', filter))).docs);
    if (this.accountId && this.canAdmin) this.statements.set((await this.value(this.api.get<{ docs: Statement[] }>('statements', { bankAccountId: this.accountId }))).docs);
    if (this.ownerMode && this.ownerId) {
      const response = await this.value(this.api.get<{ totals?: Array<{ condominiumId: string; currency: string; amount: number }> }>('owner-credits', { ...query, ownerId: this.ownerId }));
      this.credits.set(response.totals || []);
    }
  }
  refresh() { return this.run(() => this.load()); }
  accountChanged() { this.statement.set(null); this.statements.set([]); this.reviewed = false; this.columns = {}; this.headerRow = 1; this.refresh(); }
  chooseFile(event: Event, statement = false) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (file && file.size > 8 * 1024 * 1024) {
      this.error.set('El archivo debe pesar como máximo 8 MB.');
      if (statement) this.statementFile = null; else this.file = null;
      return;
    }
    if (statement) this.statementFile = file; else this.file = file;
  }
  upload(statement = false) {
    return this.run(async () => {
      const file = statement ? this.statementFile : this.file;
      if (!file || !this.accountId || (!statement && !this.invoiceId)) throw new Error('Missing fields');
      const form = new FormData(); form.append('file', file); form.append('bankAccountId', this.accountId);
      if (!statement) form.append('invoiceId', this.invoiceId);
      if (statement) { this.statement.set(await this.value(this.api.post<Statement>('statements', form))); this.reviewed = false; }
      else { this.selected.set(await this.value(this.api.post<Receipt>('receipts', form))); }
      this.message.set('Archivo recibido. La extracción no confirma el pago. Actualice para consultar el resultado.');
      await this.load();
    });
  }
  createAccount() {
    return this.run(async () => {
      const account = await this.value(this.api.post<BankAccount>('bank-accounts', { condominiumId: this.condominiumId, bank: this.bank, accountLabel: this.accountLabel, currency: this.currency }));
      this.accountId = account._id; await this.load();
    });
  }
  inspect(receipt: Receipt) {
    return this.run(async () => {
      this.selected.set(await this.value(this.api.get<Receipt>(`receipts/${receipt._id}`)));
      this.correction = { ...this.fields(this.selected()!) }; this.correctionNote = '';
      this.candidates.set([]); this.movementId = ''; this.note = ''; this.confirmation.set(null);
      const fields = this.fields(this.selected()!);
      if (this.canAdmin && this.selected()?.reconciliationStatus !== 'confirmed' && fields.amount && fields.date && fields.currency) this.candidates.set((await this.value(this.api.get<{ docs: Candidate[] }>(`receipts/${receipt._id}/candidates`))).docs);
    });
  }
  saveCorrection() {
    return this.run(async () => {
      const receipt = this.selected(); if (!receipt || !this.canAdmin || this.correctionNote.trim().length < 10) return;
      this.selected.set(await this.value(this.api.patch<Receipt>(`receipts/${receipt._id}/fields`, { ...this.correction, note: this.correctionNote })));
      this.candidates.set((await this.value(this.api.get<{ docs: Candidate[] }>(`receipts/${receipt._id}/candidates`))).docs);
      this.movementId = ''; await this.load();
    });
  }
  openOriginal(receipt: Receipt) {
    return this.run(async () => {
      const blob = await this.value(this.api.file(receipt._id));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = receipt.originalName || 'comprobante'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  openStatementOriginal(id: string) {
    return this.run(async () => {
      const blob = await this.value(this.api.statementFile(id));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = blob.type.includes('pdf') ? 'estado-de-cuenta.pdf' : 'estado-de-cuenta.csv'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  retry(id: string, statement = false) {
    return this.run(async () => {
      if (statement) this.statement.set(await this.value(this.api.post<Statement>(`statements/${id}/retry`, {})));
      else this.selected.set(await this.value(this.api.post<Receipt>(`receipts/${id}/retry`, {})));
      this.message.set('Extracción reprogramada. Actualice para consultar el resultado.');
    });
  }
  loadStatement(id: string) { return this.run(async () => { this.statement.set(await this.value(this.api.get<Statement>(`statements/${id}`))); this.reviewed = false; }); }
  addRow() {
    const statement = this.statement(); if (!statement) return;
    statement.rows = [...statement.rows, { _id: '', sourceRow: Math.max(0, ...statement.rows.map(row => row.sourceRow || 0)) + 1, date: '', amount: '', currency: this.accounts().find(account => account._id === this.accountId)?.currency || 'DOP', reference: '', description: '', direction: 'unknown' }];
    this.reviewed = false;
  }
  removeRow(index: number) { const statement = this.statement(); if (statement) statement.rows = statement.rows.filter((_, rowIndex) => rowIndex !== index); this.reviewed = false; }
  mapColumns() {
    const statement = this.statement(); if (!statement?.rawRows) return;
    statement.rows = statement.rawRows.slice(this.headerRow).map((cells, index) => {
      const cell = (key: string) => this.columns[key] === undefined || this.columns[key] === '' ? '' : String(cells[Number(this.columns[key])] ?? '').trim();
      const parts = cell('date').split(/[\/.-]/);
      const date = parts.length === 3 && this.dateFormat !== 'ISO' ? `${parts[2]}-${parts[this.dateFormat === 'DMY' ? 1 : 0].padStart(2, '0')}-${parts[this.dateFormat === 'DMY' ? 0 : 1].padStart(2, '0')}` : cell('date');
      const rawAmount = cell('amount').replace(/\s/g, '');
      const amount = this.decimalSeparator === ',' ? rawAmount.replace(/\./g, '').replace(',', '.') : rawAmount.replace(/,/g, '');
      return { _id: '', sourceRow: index + this.headerRow + 1, date, amount, currency: cell('currency') || this.accounts().find(account => account._id === this.accountId)?.currency || '', reference: cell('reference'), description: cell('description'), direction: cell('direction') || 'unknown' };
    });
    this.reviewed = false;
  }
  commitStatement() {
    return this.run(async () => {
      const statement = this.statement(); if (!statement || !this.reviewed || !this.canAdmin) return;
      const invalidDirections = statement.rows.flatMap((row, index) =>
        row.direction === 'credit' || row.direction === 'debit' ? [] : [index + 1]);
      if (invalidDirections.length) {
        this.error.set(`Seleccione Abono o Débito en las filas ${invalidDirections.join(', ')} antes de importar. El tipo Revisar está pendiente de revisión.`);
        this.reviewed = false;
        return;
      }
      this.statement.set(await this.value(this.api.post<Statement>(`statements/${statement._id}/commit`, { rows: statement.rows, reviewed: true })));
      this.message.set('Movimientos bancarios importados. Ya puede comparar los comprobantes.'); await this.load();
    });
  }
  confirm() {
    return this.run(async () => {
      const receipt = this.selected(); if (!receipt || !this.movementId || !this.canAdmin) return;
      this.confirmation.set(await this.value(this.api.post<Confirmation>(`receipts/${receipt._id}/confirm`, { movementId: this.movementId, note: this.note })));
      this.selected.set(await this.value(this.api.get<Receipt>(`receipts/${receipt._id}`)));
      this.candidates.set([]); this.message.set('Pago conciliado contra el movimiento bancario.'); await this.load();
    });
  }
  fields(receipt: Receipt): BankFields { return receipt.fields || receipt.extractedFields || {}; }
  movement(candidate: Candidate): BankMovement { return candidate.movement; }
  accountName(id?: string) { const account = this.accounts().find(item => item._id === id); return account ? `${account.bank} · ${account.accountLabel} · ${account.currency}` : id || 'Sin identificar'; }
}
