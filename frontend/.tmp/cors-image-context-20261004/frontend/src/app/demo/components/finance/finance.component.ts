import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
    FinanceService,
    FinanceCondominium,
    FinanceUnit,
    FinanceSettings,
    FinanceInvoice,
    FinanceCredit,
    FinanceAccount,
    FinanceEntry,
    FinanceMovement,
    BudgetLine,
    BudgetResponse,
    UnitHistory,
    FinanceReport,
    Page,
    ReceivableTotal,
} from '../../service/finance.service';
import { BankReconciliationService } from '../../service/bank-reconciliation.service';
import { AccessContextService } from '../../service/access-context.service';
import { UserService } from '../../service/user.service';

type Tab =
    | 'receivables'
    | 'charges'
    | 'history'
    | 'cashbook'
    | 'budget'
    | 'reports'
    | 'settings';
interface ChargeUnit extends FinanceUnit {
    selected: boolean;
    amount: number;
}

@Component({
    selector: 'app-finance',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
    ],
    templateUrl: './finance.component.html',
    styleUrl: './finance.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent implements OnInit {
    private readonly api = inject(FinanceService);
    private readonly bankApi = inject(BankReconciliationService);
    private readonly access = inject(AccessContextService);
    private readonly user = inject(UserService);
    readonly busy = signal(false);
    readonly error = signal('');
    readonly notice = signal('');
    readonly condos = signal<FinanceCondominium[]>([]);
    readonly invoices = signal<FinanceInvoice[]>([]);
    readonly totals = signal<ReceivableTotal[]>([]);
    readonly credits = signal<FinanceCredit[]>([]);
    readonly accounts = signal<FinanceAccount[]>([]);
    readonly entries = signal<FinanceEntry[]>([]);
    readonly movements = signal<FinanceMovement[]>([]);
    readonly history = signal<UnitHistory | null>(null);
    readonly report = signal<FinanceReport | null>(null);
    readonly settings = signal<FinanceSettings | null>(null);
    readonly migrationReady = signal(false);
    readonly ownerMode =
        (this.user.getIdentity() as { role?: string } | null)?.role === 'OWNER';
    readonly tabs: Array<{ id: Tab; label: string }> = [
        { id: 'receivables', label: 'Accounts receivable' },
        { id: 'charges', label: 'Charges and adjustments' },
        { id: 'history', label: 'Unit statement' },
        { id: 'cashbook', label: 'Income and expenses' },
        { id: 'budget', label: 'Budget' },
        { id: 'reports', label: 'Reports' },
        { id: 'settings', label: 'Settings' },
    ];
    condominiumId = '';
    currency = 'DOP';
    tab: Tab = this.ownerMode ? 'history' : 'receivables';
    units: ChargeUnit[] = [];
    unitNumber = '';
    year = new Date().getFullYear();
    from = `${this.year}-01-01`;
    to = `${this.year}-12-31`;
    receivablePage = 1;
    receivableTotal = 0;
    entryPage = 1;
    entryTotal = 0;
    movementPage = 1;
    movementTotal = 0;
    link = { entryId: '', movementId: '', destinationMovementId: '' };
    historyPage = 1;
    charge = {
        chargeType: 'extraordinary',
        amount: 0,
        issueDate: this.localToday(),
        dueDate: this.localToday(),
        description: '',
    };
    adjustment = {
        invoiceId: '',
        kind: 'discount',
        amount: 0,
        reason: '',
        creditId: '',
    };
    entry = {
        kind: 'expense',
        amount: 0,
        date: this.localToday(),
        category: '',
        reason: '',
        reference: '',
        supportReference: '',
        bankAccountId: '',
        destinationAccountId: '',
        movementId: '',
        destinationMovementId: '',
    };
    accountDraft = { bank: '', accountLabel: '' };
    opening = { accountId: '', amount: 0, date: this.localToday() };
    draftSettings: FinanceSettings = this.defaultSettings();
    reviewed = false;
    budgetLines: BudgetLine[] = [];
    budgetRevision = 0;
    budgetDraft: BudgetLine = {
        month: 1,
        kind: 'expense',
        category: '',
        amount: 0,
    };
    reversalReason = '';
    private readonly operationKeys = new Map<string, string>();

    get canCreate() {
        return (
            !this.ownerMode &&
            (this.access.isOwnerAdmin() ||
                this.access.hasPermission('finance.create'))
        );
    }
    get canUpdate() {
        return (
            !this.ownerMode &&
            (this.access.isOwnerAdmin() ||
                this.access.hasPermission('finance.update'))
        );
    }
    get settingsValidationError(): string {
        const draft = this.draftSettings;
        if (draft.enabled && !this.migrationReady())
            return 'Data and index migration must be completed before enabling finance.';
        if (draft.enabled && !this.settings()?.enabled && !this.reviewed)
            return 'Confirm that you reviewed the balances before enabling finance.';
        if (
            (draft.cashbookEnabled && !draft.enabled) ||
            (draft.reportsEnabled && !draft.cashbookEnabled)
        )
            return 'Enable the previous stages first.';
        if (draft.lateFee.enabled && !draft.enabled)
            return 'Enable finance before enabling late fees.';
        const { value, graceDays, mode } = draft.lateFee;
        if (
            value === null ||
            !Number.isFinite(value) ||
            value < 0 ||
            value > 9999999999.99 ||
            Number(value.toFixed(2)) !== value ||
            (draft.lateFee.enabled && value === 0) ||
            (mode === 'percent' && value > 100)
        )
            return 'Enter a valid late fee amount. Percentages cannot exceed 100%; enabled fees must be greater than zero.';
        if (
            graceDays === null ||
            !Number.isInteger(graceDays) ||
            graceDays < 0 ||
            graceDays > 365
        )
            return 'Grace days must be a whole number between 0 and 365.';
        return '';
    }
    changeFinanceEnabled(enabled: boolean) {
        this.draftSettings.enabled = enabled;
        if (!enabled) {
            this.draftSettings.cashbookEnabled = false;
            this.draftSettings.reportsEnabled = false;
            this.draftSettings.lateFee.enabled = false;
        }
    }
    changeCashbookEnabled(enabled: boolean) {
        this.draftSettings.cashbookEnabled = enabled;
        if (!enabled) this.draftSettings.reportsEnabled = false;
    }
    get selectedInvoice() {
        return this.invoices().find(
            (invoice) => invoice._id === this.adjustment.invoiceId
        );
    }
    get usableCredits() {
        const invoice = this.selectedInvoice;
        return this.credits().filter(
            (credit) =>
                invoice &&
                credit.ownerId === invoice.ownerId &&
                credit.unitNumber?.trim().toLowerCase() ===
                    invoice.unitNumber.trim().toLowerCase() &&
                credit.currency === invoice.currency &&
                credit.availableMinor > 0
        );
    }
    get currencyAccounts() {
        return this.accounts().filter(
            (account) => account.currency === this.currency
        );
    }
    kindLabel(kind: string) {
        return (
            (
                {
                    income: 'Income',
                    expense: 'Expense',
                    transfer: 'Transfer',
                } as Record<string, string>
            )[kind] || kind
        );
    }
    chargeLabel(kind?: string) {
        return (
            (
                {
                    monthly: 'Monthly fee',
                    extraordinary: 'Special assessment',
                    individual: 'Individual charge',
                    fine: 'Fine',
                    late_fee: 'Late fee',
                    legacy: 'Historical charge',
                } as Record<string, string>
            )[kind || 'legacy'] || 'Historical charge'
        );
    }
    bucketLabel(bucket: string) {
        return bucket === 'current'
            ? 'Current'
            : bucket === '90+'
            ? 'Over 90 days'
            : `${bucket} days`;
    }
    get availableTabs() {
        return this.tabs.filter(
            (tab) =>
                !this.ownerMode || ['receivables', 'history'].includes(tab.id)
        );
    }
    ngOnInit() {
        void this.perform(async () => {
            this.condos.set(
                (
                    await firstValueFrom(
                        this.api.get<{ docs: FinanceCondominium[] }>('options')
                    )
                ).docs
            );
            this.condominiumId = this.condos()[0]?._id || '';
            if (this.condominiumId) await this.loadCondominium();
        });
    }
    localToday() {
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'America/Santo_Domingo',
        }).format(new Date());
    }
    private defaultSettings(): FinanceSettings {
        return {
            enabled: false,
            cashbookEnabled: false,
            reportsEnabled: false,
            lateFee: { enabled: false, mode: 'fixed', value: 0, graceDays: 0 },
        };
    }
    private query(extra: Record<string, string> = {}) {
        return {
            condominiumId: this.condominiumId,
            currency: this.currency,
            year: String(this.year),
            ...extra,
        };
    }
    private dates() {
        return this.query({ from: this.from, to: this.to });
    }
    private key(name: string) {
        if (!this.operationKeys.has(name))
            this.operationKeys.set(name, crypto.randomUUID());
        return this.operationKeys.get(name)!;
    }
    private async perform(action: () => Promise<void>, notice = '') {
        if (this.busy()) return;
        this.busy.set(true);
        this.error.set('');
        this.notice.set('');
        try {
            await action();
            if (notice) this.notice.set(notice);
        } catch (error: unknown) {
            const response =
                error instanceof HttpErrorResponse
                    ? (error.error as {
                          error?: { message?: string };
                          message?: string;
                      })
                    : null;
            const message = response?.error?.message || response?.message;
            const settingsMessages: Record<string, string> = {
                'Confirme que revisó los saldos antes de activar esta etapa':
                    'Confirm that you reviewed the balances before enabling finance.',
                'Ejecute la revisión y migración de índices antes de activar finanzas':
                    'Data and index migration must be completed before enabling finance.',
                'Active las etapas anteriores primero':
                    'Enable the previous stages first.',
                'Configuración inválida': 'Invalid settings.',
                'Política de mora inválida': 'Invalid late fee policy.',
                'Importe o porcentaje de mora inválido':
                    'Invalid late fee amount or percentage.',
                'No autorizado':
                    'You are not authorized to perform this operation.',
                'No tiene permiso financiero':
                    'You do not have permission to perform this financial operation.',
                'Condominio fuera de alcance':
                    'This condominium is outside your access scope.',
                'Condominio no encontrado': 'Condominium not found.',
                'Reporte fuera de alcance':
                    'The report is outside your access scope.',
                'Se requiere MongoDB con replica set; no se aplicó la operación':
                    'MongoDB must run as a replica set. The operation was not applied.',
                'La operación ya existe; vuelva a consultar antes de repetirla':
                    'This operation already exists. Refresh before trying again.',
            };
            this.error.set(
                error instanceof HttpErrorResponse
                    ? settingsMessages[message || ''] ||
                          (error.status === 0
                              ? 'Unable to reach the server. Check your connection and try again.'
                              : error.status === 403
                              ? 'You do not have permission to perform this operation.'
                              : 'The financial operation could not be completed. Check your entries and try again.')
                    : error instanceof Error
                    ? error.message
                    : 'The operation could not be completed'
            );
        } finally {
            this.busy.set(false);
        }
    }
    changeCondominium() {
        void this.perform(() => this.loadCondominium());
    }
    private async loadCondominium() {
        this.invoices.set([]);
        this.totals.set([]);
        this.entries.set([]);
        this.movements.set([]);
        this.credits.set([]);
        this.accounts.set([]);
        this.history.set(null);
        this.report.set(null);
        this.budgetLines = [];
        this.operationKeys.clear();
        this.link = { entryId: '', movementId: '', destinationMovementId: '' };
        this.movementPage = 1;
        this.adjustment.invoiceId = '';
        this.adjustment.creditId = '';
        this.reviewed = false;
        this.entry.bankAccountId = '';
        this.entry.destinationAccountId = '';
        this.entry.movementId = '';
        this.entry.destinationMovementId = '';
        this.opening.accountId = '';
        this.receivablePage = 1;
        this.entryPage = 1;
        this.historyPage = 1;
        const condo = this.condos().find(
            (item) => item._id === this.condominiumId
        );
        this.units = (condo?.units || []).map((unit) => ({
            ...unit,
            selected: false,
            amount: condo?.mPayment || 0,
        }));
        this.unitNumber = this.units[0]?.unitNumber || '';
        this.charge.amount = condo?.mPayment || 0;
        if (!condo) {
            this.settings.set(null);
            return;
        }
        const response = await firstValueFrom(
            this.api.get<{
                settings: FinanceSettings;
                migrationReady: boolean;
            }>(`condominiums/${this.condominiumId}/settings`)
        );
        this.settings.set(response.settings);
        this.draftSettings = structuredClone(response.settings);
        this.migrationReady.set(response.migrationReady);
        if (!this.ownerMode)
            this.accounts.set(
                (
                    await firstValueFrom(
                        this.api.get<{ docs: FinanceAccount[] }>(
                            'accounts',
                            this.query()
                        )
                    )
                ).docs
            );
        if (response.settings.enabled) await this.loadActiveTab();
    }
    switchTab(tab: Tab) {
        this.tab = tab;
        void this.perform(() => this.loadActiveTab());
    }
    refresh() {
        void this.perform(() =>
            this.tab === 'settings'
                ? this.loadCondominium()
                : this.loadActiveTab()
        );
    }
    private async loadActiveTab() {
        if (!this.settings()?.enabled || !this.condominiumId) return;
        if (this.tab === 'receivables' || this.tab === 'charges')
            await this.loadReceivables();
        if (this.tab === 'history' && this.unitNumber) await this.loadHistory();
        if (this.tab === 'cashbook' && this.settings()?.cashbookEnabled)
            await this.loadEntries();
        if (this.tab === 'budget' && this.settings()?.reportsEnabled)
            await this.loadBudget();
        if (this.tab === 'reports' && this.settings()?.reportsEnabled) {
            this.report.set(null);
            this.report.set(
                await firstValueFrom(
                    this.api.get<FinanceReport>('report', this.dates())
                )
            );
        }
    }
    private async loadReceivables() {
        const response = await firstValueFrom(
            this.api.get<Page<FinanceInvoice> & { totals: ReceivableTotal[] }>(
                'receivables',
                this.query({ page: String(this.receivablePage) })
            )
        );
        this.invoices.set(response.docs);
        this.totals.set(response.totals);
        this.receivableTotal = response.total;
        this.credits.set(
            (
                await firstValueFrom(
                    this.api.get<{ docs: FinanceCredit[] }>(
                        'credits',
                        this.query()
                    )
                )
            ).docs
        );
    }
    private async loadEntries() {
        const response = await firstValueFrom(
            this.api.get<Page<FinanceEntry>>(
                'entries',
                this.query({ page: String(this.entryPage) })
            )
        );
        this.entries.set(response.docs);
        this.entryTotal = response.total;
        await this.loadMovements();
    }
    private async loadMovements() {
        const response = await firstValueFrom(
            this.api.get<Page<FinanceMovement>>(
                'movements',
                this.query({ page: String(this.movementPage) })
            )
        );
        this.movements.set(response.docs);
        this.movementTotal = response.total;
    }
    movementOptions(destination = false, linking = false) {
        const target = linking
            ? this.entries().find((item) => item._id === this.link.entryId)
            : this.entry;
        if (!target) return [];
        const accountId = destination
            ? target.destinationAccountId
            : target.bankAccountId;
        const direction =
            destination || target.kind === 'income' ? 'credit' : 'debit';
        return this.movements().filter(
            (movement) =>
                movement.bankAccountId === accountId &&
                movement.currency === this.currency &&
                movement.direction === direction
        );
    }
    selectEntry(item: FinanceEntry) {
        this.link = {
            entryId: item._id,
            movementId: '',
            destinationMovementId: '',
        };
    }
    linkEntry() {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.post(`entries/${this.link.entryId}/link`, this.link)
            );
            this.link = {
                entryId: '',
                movementId: '',
                destinationMovementId: '',
            };
            await this.loadEntries();
        }, 'Bank transaction linked');
    }
    paginateMovements(delta: number) {
        this.movementPage += delta;
        void this.perform(() => this.loadMovements());
    }
    private async loadHistory() {
        this.history.set(null);
        this.history.set(
            await firstValueFrom(
                this.api.get<UnitHistory>('history', {
                    ...this.dates(),
                    unitNumber: this.unitNumber,
                    page: String(this.historyPage),
                })
            )
        );
    }
    private async loadBudget() {
        const response = await firstValueFrom(
            this.api.get<BudgetResponse>('budget', this.query())
        );
        this.budgetRevision = response.revision || 0;
        this.budgetLines = response.lines.map((line) => ({
            month: line.month,
            kind: line.kind,
            category: line.category,
            amount: line.amountMinor / 100,
        }));
    }
    changeHistoryFilter() {
        this.historyPage = 1;
        this.refresh();
    }
    selectInvoice(invoice: FinanceInvoice) {
        this.adjustment.invoiceId = invoice._id;
        this.adjustment.amount = invoice.balancePending;
        this.adjustment.creditId = '';
        this.tab = 'charges';
    }
    equalAmounts() {
        this.units = this.units.map((unit) => ({
            ...unit,
            amount: this.charge.amount,
        }));
    }
    saveCharges() {
        void this.perform(async () => {
            const units = this.units
                .filter((unit) => unit.selected)
                .map((unit) => ({
                    ownerId: unit.ownerId,
                    unitNumber: unit.unitNumber,
                    amount: unit.amount,
                }));
            if (!units.length) throw new Error('Select at least one unit');
            await firstValueFrom(
                this.api.post('charges', {
                    ...this.charge,
                    condominiumId: this.condominiumId,
                    currency: this.currency,
                    units,
                    idempotencyKey: this.key('charges'),
                })
            );
            this.operationKeys.delete('charges');
            this.units = this.units.map((unit) => ({
                ...unit,
                selected: false,
            }));
            await this.loadReceivables();
        }, 'Charges recorded');
    }
    saveAdjustment(useCredit = false) {
        void this.perform(
            async () => {
                if (!this.adjustment.invoiceId)
                    throw new Error('Select an outstanding invoice');
                await firstValueFrom(
                    this.api.post(
                        `invoices/${this.adjustment.invoiceId}/${
                            useCredit ? 'credits' : 'adjustments'
                        }`,
                        {
                            ...this.adjustment,
                            idempotencyKey: this.key(
                                useCredit ? 'credit' : 'adjustment'
                            ),
                        }
                    )
                );
                this.operationKeys.delete(useCredit ? 'credit' : 'adjustment');
                this.adjustment.invoiceId = '';
                await this.loadReceivables();
            },
            useCredit ? 'Credit applied' : 'Adjustment recorded'
        );
    }
    reverseApplication(id: string) {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.post(`applications/${id}/reversal`, {
                    reason: this.reversalReason,
                    idempotencyKey: this.key(`reverse:${id}`),
                })
            );
            this.operationKeys.delete(`reverse:${id}`);
            await this.loadHistory();
        }, 'Operation reversed');
    }
    saveEntry() {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.post('entries', {
                    ...this.entry,
                    condominiumId: this.condominiumId,
                    currency: this.currency,
                    idempotencyKey: this.key('entry'),
                })
            );
            this.operationKeys.delete('entry');
            await this.loadEntries();
        }, 'Transaction recorded');
    }
    reverseEntry(id: string) {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.post(`entries/${id}/reversal`, {
                    reason: this.reversalReason,
                    idempotencyKey: this.key(`entry-reverse:${id}`),
                })
            );
            this.operationKeys.delete(`entry-reverse:${id}`);
            await this.loadEntries();
        }, 'Transaction reversed');
    }
    saveSettings() {
        void this.perform(async () => {
            if (this.settingsValidationError)
                throw new Error(this.settingsValidationError);
            const settings = await firstValueFrom(
                this.api.put<FinanceSettings>(
                    `condominiums/${this.condominiumId}/settings`,
                    { ...this.draftSettings, reviewed: this.reviewed }
                )
            );
            this.settings.set(settings);
            this.draftSettings = structuredClone(settings);
        }, 'Settings saved');
    }
    runLateFees() {
        void this.perform(async () => {
            const result = await firstValueFrom(
                this.api.post<{ created: number }>('late-fees/run', {
                    condominiumId: this.condominiumId,
                })
            );
            this.notice.set(`${result.created} late fee charges created`);
            await this.loadReceivables();
        });
    }
    addBudgetLine() {
        if (!this.budgetDraft.category.trim() || this.budgetDraft.amount < 0) {
            this.error.set('Enter a valid category and amount');
            return;
        }
        const line = {
            ...this.budgetDraft,
            category: this.budgetDraft.category.trim(),
        };
        const existing = this.budgetLines.findIndex(
            (item) =>
                item.month === line.month &&
                item.kind === line.kind &&
                item.category === line.category
        );
        this.budgetLines =
            existing < 0
                ? [...this.budgetLines, line]
                : this.budgetLines.map((item, index) =>
                      index === existing ? line : item
                  );
    }
    removeBudgetLine(index: number) {
        this.budgetLines = this.budgetLines.filter(
            (_, current) => index !== current
        );
    }
    saveBudget() {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.put('budget', {
                    condominiumId: this.condominiumId,
                    currency: this.currency,
                    year: this.year,
                    lines: this.budgetLines,
                    revision: this.budgetRevision,
                })
            );
            await this.loadBudget();
        }, 'Budget saved');
    }
    createAccount() {
        void this.perform(async () => {
            await firstValueFrom(
                this.bankApi.post('bank-accounts', {
                    ...this.accountDraft,
                    condominiumId: this.condominiumId,
                    currency: this.currency,
                })
            );
            this.accounts.set(
                (
                    await firstValueFrom(
                        this.api.get<{ docs: FinanceAccount[] }>(
                            'accounts',
                            this.query()
                        )
                    )
                ).docs
            );
        }, 'Account created');
    }
    saveOpening() {
        void this.perform(async () => {
            await firstValueFrom(
                this.api.put(
                    `accounts/${this.opening.accountId}/opening-balance`,
                    this.opening
                )
            );
            this.accounts.set(
                (
                    await firstValueFrom(
                        this.api.get<{ docs: FinanceAccount[] }>(
                            'accounts',
                            this.query()
                        )
                    )
                ).docs
            );
        }, 'Opening balance recorded');
    }
    paginate(kind: 'receivables' | 'history' | 'entries', delta: number) {
        if (kind === 'receivables') this.receivablePage += delta;
        else if (kind === 'history') this.historyPage += delta;
        else this.entryPage += delta;
        this.refresh();
    }
    export(path: 'receivables' | 'history' | 'report') {
        void this.perform(async () => {
            const blob = await firstValueFrom(
                this.api.export(path, {
                    ...this.dates(),
                    ...(path === 'history'
                        ? { unitNumber: this.unitNumber }
                        : {}),
                })
            );
            const url = URL.createObjectURL(blob),
                link = document.createElement('a');
            link.href = url;
            link.download = `${path}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        });
    }
}
