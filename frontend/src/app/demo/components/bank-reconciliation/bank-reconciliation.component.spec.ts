import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BankReconciliationComponent } from './bank-reconciliation.component';
import { BankReconciliationService } from '../../service/bank-reconciliation.service';
import { UserService } from '../../service/user.service';
import { AccessContextService } from '../../service/access-context.service';

describe('Bank transfer review boundaries', () => {
  const api = { get: jasmine.createSpy('get').and.returnValue(of({ docs: [] })), post: jasmine.createSpy('post').and.returnValue(of({})) };
  beforeEach(async () => {
    api.post.calls.reset();
    await TestBed.configureTestingModule({ imports: [BankReconciliationComponent], providers: [
      { provide: BankReconciliationService, useValue: api },
      { provide: UserService, useValue: { isAdmin: () => true } },
      { provide: AccessContextService, useValue: { hasPermission: () => true } },
    ] }).compileComponents();
  });
  it('keeps owner OCR results pending and hides bank confirmation/import', async () => {
    const fixture = TestBed.createComponent(BankReconciliationComponent);
    const component = fixture.componentInstance;
    component.ownerMode = true;
    component.selected.set({ _id: 'receipt', invoiceId: 'invoice', bankAccountId: 'account', ocrStatus: 'ready', reconciliationStatus: 'pending', fields: { amount: '100', currency: 'DOP' } });
    component.movementId = 'movement';
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('no acreditan por sí solos');
    expect(text).not.toContain('Confirmar contra movimiento bancario');
    expect(text).not.toContain('Importar estado de cuenta');
    await component.confirm();
    expect(api.post).not.toHaveBeenCalled();
  });
  it('requires a bank movement before administrator confirmation', async () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    component.selected.set({ _id: 'receipt', invoiceId: 'invoice', bankAccountId: 'account' });
    await component.confirm();
    expect(api.post).not.toHaveBeenCalled();
  });
  it('requires explicit statement review before importing movements', async () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    component.statement.set({ _id: 'statement', status: 'ready', rows: [] });
    await component.commitStatement();
    expect(api.post).not.toHaveBeenCalled();
  });
  it('shows only confirmed movements after a partial statement import', () => {
    const fixture = TestBed.createComponent(BankReconciliationComponent);
    fixture.componentInstance.statement.set({
      _id: 'statement', status: 'committed',
      rows: [{ _id: '', description: 'Movimiento extraído pendiente' }, { _id: '' }],
      reviewedRows: [{ _id: '', date: '2026-09-30', amount: '1.69', currency: 'DOP', reference: '000123', direction: 'credit', description: 'Intereses confirmados' }],
    });
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const text = host.textContent || '';
    expect(text).toContain('Movimientos bancarios importados');
    expect(text).toContain('Intereses confirmados');
    expect(text).toContain('Abono');
    expect(text).toContain('Se extrajeron 2 movimientos');
    expect(text).not.toContain('Movimiento extraído pendiente');
    expect(text).not.toContain('Importar movimientos revisados');
    expect(host.querySelectorAll('table tbody tr').length).toBe(1);
    expect(host.querySelector('table input')).toBeNull();
  });
  it('identifies unresolved directions before posting a reviewed statement', async () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    const rows = Array.from({ length: 32 }, (_, index) => ({
      _id: '', date: '2026-09-30', amount: '1.69', currency: 'DOP',
      reference: String(index), direction: index === 30 ? 'unknown' : 'credit',
    }));
    component.statement.set({ _id: 'statement', status: 'ready', rows });
    component.reviewed = true;
    await component.commitStatement();
    expect(api.post).not.toHaveBeenCalled();
    expect(component.error()).toContain('filas 31');
    expect(component.reviewed).toBeFalse();
    expect(component.statement()?.rows.length).toBe(32);
  });
  it('preserves the reviewed credit and debit values in the commit payload', async () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    const rows = [
      { _id: '', date: '2026-09-30', amount: '1.69', currency: 'DOP', direction: 'credit' },
      { _id: '', date: '2026-09-30', amount: '0.17', currency: 'DOP', direction: 'debit' },
    ];
    component.statement.set({ _id: 'statement', status: 'ready', rows });
    component.reviewed = true;
    await component.commitStatement();
    expect(api.post).toHaveBeenCalledWith('statements/statement/commit', { rows, reviewed: true });
  });
  it('displays outstanding and credit amounts from the bank allocation', () => {
    const fixture = TestBed.createComponent(BankReconciliationComponent);
    fixture.componentInstance.ownerMode = true;
    fixture.componentInstance.selected.set({ _id: 'receipt', invoiceId: 'invoice', bankAccountId: 'account', reconciliationStatus: 'confirmed', allocation: { appliedAmount: 100, remainingBalance: 25, creditAmount: 0 } });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('Balance pendiente'); expect(text).toContain('25'); expect(text).toContain('Balance a favor');
  });
  it('maps arbitrary bank CSV columns preserving leading zero references and source row', () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    component.statement.set({ _id: 'statement', status: 'ready', rows: [], rawRows: [['Banco desconocido'], ['Dia', 'Valor', 'Operacion'], ['01/10/2026', '1.234,50', '000123']] });
    component.headerRow = 2; component.columns = { date: '0', amount: '1', reference: '2' }; component.decimalSeparator = ',';
    component.reviewed = true; component.mapColumns();
    expect(component.statement()?.rows[0]).toEqual(jasmine.objectContaining({ date: '2026-10-01', amount: '1234.50', reference: '000123', sourceRow: 3, direction: 'unknown' }));
    expect(component.reviewed).toBeFalse();
  });
  it('manual PDF rows and removals invalidate previous review', () => {
    const component = TestBed.createComponent(BankReconciliationComponent).componentInstance;
    component.statement.set({ _id: 'statement', status: 'ready', rows: [] });
    component.reviewed = true; component.addRow();
    expect(component.statement()?.rows.length).toBe(1); expect(component.reviewed).toBeFalse();
    component.reviewed = true; component.removeRow(0);
    expect(component.statement()?.rows.length).toBe(0); expect(component.reviewed).toBeFalse();
  });
  it('shows owner credits separately by currency without summing them', () => {
    const fixture = TestBed.createComponent(BankReconciliationComponent);
    fixture.componentInstance.ownerMode = true;
    fixture.componentInstance.credits.set([{ condominiumId: 'condo', currency: 'DOP', amount: 100 }, { condominiumId: 'condo', currency: 'USD', amount: 10 }]);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('DOP'); expect(text).toContain('100.00'); expect(text).toContain('10.00'); expect(text).toContain('no se aplica automáticamente');
  });
  it('enables account creation and statement review after selecting a condominium and account', async () => {
    const fixture = TestBed.createComponent(BankReconciliationComponent);
    const component = fixture.componentInstance;
    component.condominiums = [{ label: 'Torre Central', value: 'condo-1' }];
    const chosen: string[] = [];
    component.condominiumIdChange.subscribe(value => chosen.push(value));
    fixture.detectChanges();
    const condominium = (fixture.nativeElement as HTMLElement).querySelector('label select') as HTMLSelectElement;
    condominium.value = 'condo-1';
    condominium.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(chosen).toEqual(['condo-1']);

    const readyFixture = TestBed.createComponent(BankReconciliationComponent);
    const ready = readyFixture.componentInstance;
    ready.condominiumId = 'condo-1';
    ready.bank = 'Banco libre';
    ready.accountLabel = 'Cuenta operativa';
    ready.accountId = 'account-1';
    ready.statementFile = new File(['Fecha,Monto\n01/10/2026,10'], 'movimientos.csv', { type: 'text/csv' });
    readyFixture.detectChanges();
    const buttons = [...(readyFixture.nativeElement as HTMLElement).querySelectorAll('button')];
    expect(buttons.find(button => button.textContent?.trim() === 'Registrar cuenta')?.disabled).toBeFalse();
    expect(buttons.find(button => button.textContent?.trim() === 'Preparar revisión')?.disabled).toBeFalse();
  });
});
