import { Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom, interval } from 'rxjs';
import { BankAccount, BankFields, BankMovement, BankReconciliationService, Candidate, Confirmation, Receipt, ReceiptPage, Statement } from '../../service/bank-reconciliation.service';
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
  readonly receiptTotal = signal(0);
  readonly receiptPages = signal(1);
  receiptStatus: 'pending' | 'confirmed' = 'pending';
  receiptPage = 1;
  receiptLimit = 20;
  receiptFilters = { from: '', to: '', unitNumber: '', invoiceId: '', ocrStatus: '' };
  private appliedReceiptFilters = { ...this.receiptFilters };
  readonly candidates = signal<Candidate[]>([]);
  readonly excludedCandidates = signal<Candidate[]>([]);
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
  reviewingPending = false;
  pendingRows: BankMovement[] = [];
  get reviewRows(): BankMovement[] { return this.reviewingPending ? this.pendingRows : this.statement()?.rows || []; }
  set reviewRows(rows: BankMovement[]) {
    if (this.reviewingPending) this.pendingRows = rows;
    else { const statement = this.statement(); if (statement) this.statement.set({ ...statement, rows }); }
  }
  get statementRows(): Array<BankMovement & { imported: boolean }> {
    const statement = this.statement();
    if (!statement) return [];
    const imported = statement.reviewedRows || [];
    const rows = statement.rows.map(row => {
      const saved = imported.find(item => item.sourceRow != null && item.sourceRow === row.sourceRow);
      return { ...(saved || row), imported: !!saved };
    });
    return [...rows, ...imported.filter(item => !rows.some(row => row.imported && row.sourceRow === item.sourceRow)).map(row => ({ ...row, imported: true }))];
  }
  reviewPendingRows() {
    this.pendingRows = this.statementRows.filter(row => !row.imported).map(({ imported, ...row }) => ({ ...row }));
    this.reviewingPending = true; this.reviewed = false;
  }
  columnFields = [ { key: 'date', label: 'Fecha' }, { key: 'amount', label: 'Monto' }, { key: 'reference', label: 'Referencia' }, { key: 'currency', label: 'Moneda' }, { key: 'description', label: 'Descripción' }, { key: 'direction', label: 'Tipo abono/débito' } ];
  columns: Record<string, string> = {};
  dateFormat = 'DMY';
  decimalSeparator = '.';
  headerRow = 1;
  private refreshPending = false;
  constructor() {
    interval(5000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.busy() && (this.receipts().some(receipt => this.isProcessing(receipt.ocrStatus)) || this.isProcessing(this.selected()?.ocrStatus) || this.isProcessing(this.statement()?.status))) this.refresh();
    });
  }
  private isProcessing(status?: string) { return status === 'queued' || status === 'processing'; }
  get csvHeaders() { return this.statement()?.rawRows?.[this.headerRow - 1] || []; }
  get canAdmin() { return !this.ownerMode && this.user.isAdmin() && this.access.hasPermission('finance.update'); }
  get canCreateAccount() { return this.canAdmin && this.access.hasPermission('finance.create'); }
  get selectedCandidate(): Candidate | undefined {
    return this.candidates().find(candidate => candidate.movement._id === this.movementId && candidate.eligible !== false);
  }
  get hasUnsavedCorrection(): boolean {
    const receipt = this.selected();
    if (!receipt) return false;
    const saved = this.fields(receipt);
    return (['amount', 'date', 'reference', 'bank', 'currency'] as const).some(key => {
      const value = (fields: BankFields) => {
        const text = String(fields[key] ?? '').trim();
        return key === 'amount' && text ? String(Number(text)) : text;
      };
      return value(saved) !== value(this.correction);
    });
  }
  get correctionBlockedReason(): string {
    if (this.busy()) return 'Espere a que termine la operación en curso.';
    const receipt = this.selected();
    if (!this.canAdmin || !receipt || receipt.reconciliationStatus !== 'pending' || receipt.ocrStatus !== 'ready') return 'Solo puede corregir comprobantes extraídos pendientes de conciliación.';
    if (!this.correction.amount || !this.correction.date || !this.correction.currency) return 'Complete el monto, la fecha y la moneda.';
    if (this.correctionNote.trim().length < 10) return 'Escriba un motivo de corrección de al menos 10 caracteres.';
    return '';
  }
  get confirmationBlockedReason(): string {
    const receipt = this.selected();
    if (!receipt || !this.canAdmin) return 'Se necesita acceso administrativo para confirmar.';
    if (receipt.reconciliationStatus === 'confirmed') return 'Este comprobante ya está conciliado.';
    if (this.busy()) return 'Espere a que termine la operación en curso.';
    if (receipt.ocrStatus !== 'ready') return 'Espere a que termine la extracción o reintente si falló.';
    if (this.hasUnsavedCorrection) return 'Guarde la corrección antes de confirmar. La búsqueda de movimientos utiliza los datos guardados del comprobante.';
    const fields = this.fields(receipt);
    if (!fields.amount || !fields.date || !fields.currency) return 'Complete y guarde el monto, la fecha y la moneda del comprobante.';
    if (!this.candidates().length && this.excludedCandidates().length) return 'Los abonos importados del mismo monto y moneda fueron descartados. Revise los motivos indicados; no hay un movimiento compatible que pueda confirmar.';
    if (!this.candidates().length) return 'Importe y revise el estado de la cuenta receptora. Se requiere un abono disponible con el mismo monto y moneda, y una fecha dentro de cinco días del comprobante.';
    const candidate = this.selectedCandidate;
    if (!candidate) return 'Seleccione un movimiento bancario candidato para confirmar.';
    if (candidate.referenceMatches !== true && !candidate.reasons?.includes('reference_match') && this.note.trim().length < 10) return 'La referencia falta o es distinta. Escriba una nota de revisión de al menos 10 caracteres.';
    return '';
  }
  private async loadCandidates(receipt: Receipt): Promise<void> {
    this.candidates.set([]);
    this.excludedCandidates.set([]);
    const fields = this.fields(receipt);
    if (this.canAdmin && receipt.ocrStatus === 'ready' && receipt.reconciliationStatus !== 'confirmed' && fields.amount && fields.date && fields.currency) {
      const response = await this.value(this.api.get<{ docs: Candidate[]; excluded?: Candidate[] }>(`receipts/${receipt._id}/candidates`));
      this.candidates.set(response.docs);
      this.excludedCandidates.set(response.excluded || []);
    }
    if (!this.selectedCandidate) this.movementId = '';
  }
  selectCondominium(value: string) { this.condominiumIdChange.emit(value || ''); }
  ngOnChanges() {
    this.receiptPage = 1; this.receiptTotal.set(0); this.receiptPages.set(1);
    this.statementFile = null; this.reviewingPending = false;
    this.excludedCandidates.set([]);
    this.movementId = ''; this.note = '';
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
  async loadReceipts(): Promise<void> {
    const query: Record<string, string> = {
      ...this.appliedReceiptFilters,
      reconciliationStatus: this.receiptStatus,
      page: String(this.receiptPage), limit: String(this.receiptLimit),
    };
    if (this.condominiumId) query['condominiumId'] = this.condominiumId;
    if (this.invoiceId) query['invoiceId'] = this.invoiceId;
    const response = await this.value(this.api.get<ReceiptPage>('receipts', query));
    this.receipts.set(response.docs);
    this.receiptTotal.set(response.total ?? response.docs.length);
    this.receiptPages.set(response.pages ?? 1);
    this.receiptPage = response.page ?? 1;
  }
  async changeReceiptStatus(status: 'pending' | 'confirmed'): Promise<void> {
    if (this.busy()) return;
    this.receiptStatus = status;
    this.receiptPage = 1;
    this.selected.set(null); this.candidates.set([]); this.excludedCandidates.set([]); this.confirmation.set(null);
    return this.run(() => this.loadReceipts());
  }
  async applyReceiptFilters(): Promise<void> {
    if (this.busy()) return;
    if (this.receiptFilters.from && this.receiptFilters.to && this.receiptFilters.from > this.receiptFilters.to) {
      this.error.set('Desde debe ser anterior o igual a Hasta.'); return;
    }
    this.appliedReceiptFilters = { ...this.receiptFilters };
    this.receiptPage = 1;
    this.selected.set(null); this.candidates.set([]); this.excludedCandidates.set([]); this.confirmation.set(null);
    return this.run(() => this.loadReceipts());
  }
  async clearReceiptFilters(): Promise<void> {
    if (this.busy()) return;
    this.receiptFilters = { from: '', to: '', unitNumber: '', invoiceId: '', ocrStatus: '' };
    return this.applyReceiptFilters();
  }
  async paginateReceipts(delta: number): Promise<void> {
    if (this.busy() || this.receiptPage + delta < 1 || this.receiptPage + delta > this.receiptPages()) return;
    this.receiptPage += delta;
    this.selected.set(null); this.candidates.set([]); this.excludedCandidates.set([]);
    return this.run(() => this.loadReceipts());
  }
  async load() {
    const query = this.condominiumId ? { condominiumId: this.condominiumId } : {};
    const accounts = await this.value(this.api.get<{ docs: BankAccount[] }>('bank-accounts', query));
    this.accounts.set(accounts.docs);
    await this.loadReceipts();
    if (this.accountId && this.canAdmin) this.statements.set((await this.value(this.api.get<{ docs: Statement[] }>('statements', { bankAccountId: this.accountId }))).docs);
    if (this.ownerMode && this.ownerId) {
      const response = await this.value(this.api.get<{ totals?: Array<{ condominiumId: string; currency: string; amount: number }> }>('owner-credits', { ...query, ownerId: this.ownerId }));
      this.credits.set(response.totals || []);
    }
  }
  refresh() {
    return this.run(async () => {
      await this.load();
      const selected = this.selected();
      if (selected) {
        const receipt = await this.value(this.api.get<Receipt>(`receipts/${selected._id}`));
        this.selected.set(receipt);
        if (this.isProcessing(selected.ocrStatus) && receipt.ocrStatus === 'ready') {
          this.correction = { ...this.fields(receipt) };
        }
        await this.loadCandidates(receipt);
      }
      const statement = this.statement();
      if (statement && this.isProcessing(statement.status)) this.statement.set(await this.value(this.api.get<Statement>(`statements/${statement._id}`)));
    });
  }
  accountChanged() { this.statement.set(null); this.statements.set([]); this.statementFile = null; this.reviewingPending = false; this.reviewed = false; this.columns = {}; this.headerRow = 1; this.refresh(); }
  chooseFile(event: Event, statement = false) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (file && file.size > 8 * 1024 * 1024) {
      this.error.set('El archivo debe pesar como máximo 8 MB.');
      if (statement) this.statementFile = null; else this.file = null;
      return;
    }
    if (statement) this.statementFile = file; else this.file = file;
    (event.target as HTMLInputElement).value = '';
  }
  upload(statement = false) {
    return this.run(async () => {
      const file = statement ? this.statementFile : this.file;
      if (!file || !this.accountId || (!statement && !this.invoiceId)) throw new Error('Missing fields');
      const form = new FormData(); form.append('file', file); form.append('bankAccountId', this.accountId);
      if (!statement) form.append('invoiceId', this.invoiceId);
      if (statement) { this.statement.set(await this.value(this.api.post<Statement>('statements', form))); this.reviewed = false; this.reviewingPending = false; this.columns = {}; this.headerRow = 1; }
      else { this.selected.set(await this.value(this.api.post<Receipt>('receipts', form))); }
      this.message.set('Archivo recibido. El resultado de la extracción se actualizará automáticamente; no confirma el pago.');
      if (statement && this.statement()?.status === 'committed') this.message.set('Este archivo ya estaba registrado. Puede ver el estado completo y revisar los movimientos pendientes sin duplicar los importados.');
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
      this.accountId = this.selected()!.bankAccountId;
      await this.load();
      await this.loadCandidates(this.selected()!);
    });
  }
  async saveCorrection(): Promise<void> {
    if (this.correctionBlockedReason) return;
    return this.run(async () => {
      const receipt = this.selected(); if (!receipt || !this.canAdmin || this.correctionNote.trim().length < 10) return;
      this.selected.set(await this.value(this.api.patch<Receipt>(`receipts/${receipt._id}/fields`, { ...this.correction, note: this.correctionNote })));
      this.correction = { ...this.fields(this.selected()!) };
      this.movementId = ''; await this.loadCandidates(this.selected()!); await this.load();
      this.message.set('Corrección guardada. La búsqueda de movimientos utiliza los datos actualizados.');
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
      this.message.set('Extracción reprogramada. El resultado se actualizará automáticamente.');
      await this.load();
    });
  }
  loadStatement(id: string) { return this.run(async () => { this.statement.set(await this.value(this.api.get<Statement>(`statements/${id}`))); this.reviewed = false; this.reviewingPending = false; this.columns = {}; this.headerRow = 1; }); }
  addRow() {
    const statement = this.statement(); if (!statement) return;
    this.reviewRows = [...this.reviewRows, { _id: '', sourceRow: Math.max(0, ...statement.rows.map(row => row.sourceRow || 0), ...(statement.reviewedRows || []).map(row => row.sourceRow || 0), ...this.reviewRows.map(row => row.sourceRow || 0)) + 1, date: '', amount: '', currency: this.accounts().find(account => account._id === this.accountId)?.currency || 'DOP', reference: '', description: '', direction: 'unknown' }];
    this.reviewed = false;
  }
  removeRow(index: number) { this.reviewRows = this.reviewRows.filter((_, rowIndex) => rowIndex !== index); this.reviewed = false; }
  mapColumns() {
    const statement = this.statement(); if (!statement?.rawRows) return;
    this.reviewRows = statement.rawRows.slice(this.headerRow).map((cells, index) => {
      const cell = (key: string) => this.columns[key] === undefined || this.columns[key] === '' ? '' : String(cells[Number(this.columns[key])] ?? '').trim();
      const parts = cell('date').split(/[\/.-]/);
      const date = parts.length === 3 && this.dateFormat !== 'ISO' ? `${parts[2]}-${parts[this.dateFormat === 'DMY' ? 1 : 0].padStart(2, '0')}-${parts[this.dateFormat === 'DMY' ? 0 : 1].padStart(2, '0')}` : cell('date');
      const rawAmount = cell('amount').replace(/\s/g, '');
      const amount = this.decimalSeparator === ',' ? rawAmount.replace(/\./g, '').replace(',', '.') : rawAmount.replace(/,/g, '');
      return { _id: '', sourceRow: index + this.headerRow + 1, date, amount, currency: cell('currency') || this.accounts().find(account => account._id === this.accountId)?.currency || '', reference: cell('reference'), description: cell('description'), direction: cell('direction') || 'unknown' };
    }).filter(row => !this.reviewingPending || !(statement.reviewedRows || []).some(saved => saved.sourceRow === row.sourceRow));
    this.reviewed = false;
  }
  commitStatement() {
    return this.run(async () => {
      const statement = this.statement(); if (!statement || !this.reviewed || !this.canAdmin) return;
      const invalidDirections = this.reviewRows.flatMap((row, index) =>
        row.direction === 'credit' || row.direction === 'debit' ? [] : [index + 1]);
      if (invalidDirections.length) {
        this.error.set(`Seleccione Abono o Débito en las filas ${invalidDirections.join(', ')} antes de importar. El tipo Revisar está pendiente de revisión.`);
        this.reviewed = false;
        return;
      }
      this.statement.set(await this.value(this.api.post<Statement>(`statements/${statement._id}/commit`, { rows: this.reviewRows, reviewed: true })));
      this.reviewingPending = false; this.reviewed = false;
      this.message.set('Movimientos bancarios importados. Ya puede comparar los comprobantes.'); await this.load();
      const receipt = this.selected();
      if (receipt) await this.loadCandidates(receipt);
    });
  }
  async confirm(): Promise<void> {
    if (this.confirmationBlockedReason) return;
    return this.run(async () => {
      const receipt = this.selected(); if (!receipt || !this.movementId || !this.canAdmin) return;
      this.confirmation.set(await this.value(this.api.post<Confirmation>(`receipts/${receipt._id}/confirm`, { movementId: this.movementId, note: this.note })));
      this.selected.set(null); this.candidates.set([]); this.excludedCandidates.set([]);
      this.message.set('Pago conciliado contra el movimiento bancario. El comprobante está disponible en el historial de conciliados.'); await this.load();
    });
  }
  fields(receipt: Receipt): BankFields { return receipt.fields || receipt.extractedFields || {}; }
  candidateReasons(candidate: Candidate): string {
    const labels: Record<string, string> = {
      date_outside_window: `Fecha fuera del margen permitido: ${candidate.dayDifference ?? '?'} días de diferencia; máximo 5 días.`,
      reference_requires_review: 'La referencia bancaria falta o es distinta; requiere revisión.',
      reference_match: 'Referencia coincidente.',
      amount_mismatch: 'El monto no coincide.', currency_mismatch: 'La moneda no coincide.',
      not_credit: 'El movimiento no es un abono.', already_allocated: 'El movimiento ya está aplicado.',
      incomplete_receipt: 'Los datos guardados del comprobante están incompletos.',
    };
    return (candidate.reasons || []).map(reason => labels[reason] || 'Requiere revisión bancaria.').join(' ');
  }
  movement(candidate: Candidate): BankMovement { return candidate.movement; }
  accountName(id?: string) { const account = this.accounts().find(item => item._id === id); return account ? `${account.bank} · ${account.accountLabel} · ${account.currency}` : id || 'Sin identificar'; }
}
