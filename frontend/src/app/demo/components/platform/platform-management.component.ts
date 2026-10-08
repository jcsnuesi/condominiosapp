import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccessContextService } from '../../service/access-context.service';
import { AccountPage, Limits, Membership, PlatformAccount, PlatformAudit, PlatformPolicy, PlatformScope, PlatformService, SaasPlan, Supervisor } from '../../service/platform.service';

type Section = 'accounts' | 'supervisors' | 'policies' | 'plans' | 'audit';
interface UserDraft { _id: string; name: string; lastname: string; email: string; phone: string; password: string; status: string; policyIds: string[]; scope: PlatformScope; }
const emptyLimits = (): Limits => ({ condominiums: null, units: null, unitsPerCondominium: null, residences: null });

@Component({ standalone: true, selector: 'app-platform-management', imports: [CommonModule, FormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './platform-management.component.html', styleUrl: './platform.css' })
export class PlatformManagementComponent {
  private readonly api = inject(PlatformService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly access = inject(AccessContextService);
  readonly section = signal<Section>('accounts');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly accounts = signal<PlatformAccount[]>([]);
  readonly users = signal<Supervisor[]>([]);
  readonly policies = signal<PlatformPolicy[]>([]);
  readonly permissions = signal<string[]>([]);
  readonly plans = signal<SaasPlan[]>([]);
  readonly audits = signal<PlatformAudit[]>([]);
  readonly total = signal(0);
  readonly accountOptions = signal<PlatformAccount[]>([]);
  readonly accountOptionTotal = signal(0);
  page = 1;
  search = '';
  compliance = '';
  scopeSearch = '';
  selectedAccount: PlatformAccount | null = null;
  memberDraft: Membership = { plan: '', status: 'ACTIVE', billingStatus: 'MANUAL', endsAt: null, limits: emptyLimits(), reason: '' };
  policyDraft: PlatformPolicy | null = null;
  planDraft: SaasPlan | null = null;
  userDraft: UserDraft | null = null;
  readonly titles: Record<Section, string> = { accounts: 'Cuentas y membresías', supervisors: 'Supervisores', policies: 'Políticas de supervisión', plans: 'Planes del SaaS', audit: 'Auditoría del SaaS' };
  readonly limitLabels: Record<keyof Limits, string> = { condominiums: 'Condominios por cuenta', units: 'Unidades totales', unitsPerCondominium: 'Unidades por condominio', residences: 'Residencias personales' };
  readonly permissionLabels: Record<string, string> = {
    'platform.kpis.read': 'Consultar KPIs', 'platform.accounts.read': 'Consultar cuentas', 'platform.accounts.update': 'Activar y suspender cuentas',
    'platform.memberships.read': 'Consultar planes', 'platform.memberships.manage': 'Gestionar planes y membresías', 'platform.policies.read': 'Consultar políticas de supervisión', 'platform.policies.manage': 'Crear y editar políticas de supervisión',
    'platform.supervisors.read': 'Consultar supervisores', 'platform.supervisors.manage': 'Crear supervisores y delegar acceso', 'platform.access.read': 'Consultar políticas de organizaciones', 'platform.access.manage': 'Asignar y editar políticas de organizaciones', 'platform.audit.read': 'Consultar auditoría'
  };
  constructor() { this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => { this.section.set(data['section'] as Section); this.page = 1; this.cancel(); this.load(); }); }
  load(): void {
    this.loading.set(true); this.error.set('');
    const section = this.section();
    if (section === 'accounts') {
      this.api.get<AccountPage>(`accounts?page=${this.page}&search=${encodeURIComponent(this.search)}&compliance=${this.compliance}`).subscribe({ next: data => { this.accounts.set(data.rows); this.total.set(data.total); this.loading.set(false); }, error: e => this.failed(e) });
      if (this.access.hasPermission('platform.memberships.manage')) this.loadPlans('membership-plans');
    } else if (section === 'supervisors') {
      this.api.get<Supervisor[]>('supervisors').subscribe({ next: data => { this.users.set(data); this.loading.set(false); }, error: e => this.failed(e) });
      if (this.access.hasPermission('platform.supervisors.manage')) {
        this.api.get<{ policies: PlatformPolicy[] }>('supervisor-policies').subscribe({ next: data => this.policies.set(data.policies), error: e => this.failed(e) });
        this.searchScope();
      }
    } else if (section === 'policies') this.api.get<{ policies: PlatformPolicy[]; permissions: string[] }>('policies').subscribe({ next: data => { this.policies.set(data.policies); this.permissions.set(data.permissions); this.loading.set(false); }, error: e => this.failed(e) });
    else if (section === 'plans') this.loadPlans('plans');
    else this.api.get<{ rows: PlatformAudit[]; total: number }>(`audit?page=${this.page}`).subscribe({ next: data => { this.audits.set(data.rows); this.total.set(data.total); this.loading.set(false); }, error: e => this.failed(e) });
  }
  private loadPlans(path: string): void { this.api.get<SaasPlan[]>(path).subscribe({ next: data => { this.plans.set(data); if (this.section() === 'plans') this.loading.set(false); }, error: e => this.failed(e) }); }
  searchScope(): void { this.api.get<AccountPage>(`scope-accounts?pageSize=100&search=${encodeURIComponent(this.scopeSearch)}`).subscribe({ next: data => { this.accountOptions.set(data.rows); this.accountOptionTotal.set(data.total); }, error: e => this.failed(e) }); }
  changePage(delta: number): void { this.page += delta; this.load(); }
  filter(): void { this.page = 1; this.load(); }
  openMembership(account: PlatformAccount): void {
    this.cancel(); this.selectedAccount = account;
    this.memberDraft = account.membership ? { ...account.membership, endsAt: account.membership.endsAt ? new Date(new Date(account.membership.endsAt).getTime() - 4 * 3600000).toISOString().slice(0, 10) : null, limits: { ...account.membership.limits }, reason: '' } : { plan: '', status: 'ACTIVE', billingStatus: 'MANUAL', endsAt: null, limits: emptyLimits(), reason: '' };
  }
  applicablePlans(): SaasPlan[] { return this.plans().filter(p => p.subjectType === this.selectedAccount?.subjectType && (p.status === 'active' || p.name === this.selectedAccount?.membership?.plan)); }
  applyPlan(): void { const plan = this.applicablePlans().find(p => p.name === this.memberDraft.plan); if (plan) this.memberDraft.limits = { ...plan.limits }; }
  limitKeys(type: string): (keyof Limits)[] { return type === 'PERSONAL_OWNER' ? ['residences'] : ['condominiums', 'units', 'unitsPerCondominium']; }
  saveMembership(): void { if (!this.selectedAccount || this.saving()) return; this.saving.set(true); this.api.saveMembership(this.selectedAccount, this.memberDraft).subscribe({ next: () => this.saved(), error: e => this.failed(e) }); }
  setStatus(account: PlatformAccount): void {
    const status = account.status === 'active' ? (account.subjectType === 'ORGANIZATION' ? 'suspended' : 'inactive') : 'active';
    if (this.saving()) return; this.saving.set(true);
    this.api.setStatus(account, status).subscribe({ next: () => this.saved(), error: e => this.failed(e) });
  }
  newPolicy(policy?: PlatformPolicy): void { this.cancel(); this.policyDraft = policy ? { ...policy, permissions: [...policy.permissions] } : { _id: '', name: '', description: '', permissions: [], status: 'active' }; }
  togglePermission(permission: string, event: Event): void { if (!this.policyDraft) return; const checked = (event.target as HTMLInputElement).checked; this.policyDraft.permissions = checked ? [...this.policyDraft.permissions, permission] : this.policyDraft.permissions.filter(p => p !== permission); }
  savePolicy(): void { if (!this.policyDraft || this.saving()) return; this.saving.set(true); this.api.save('policies', this.policyDraft, this.policyDraft._id).subscribe({ next: () => this.saved(), error: e => this.failed(e) }); }
  newPlan(plan?: SaasPlan): void { this.cancel(); this.planDraft = plan ? { ...plan, limits: { ...plan.limits } } : { _id: '', name: '', subjectType: 'ORGANIZATION', limits: emptyLimits(), status: 'active' }; }
  savePlan(): void { if (!this.planDraft || this.saving()) return; this.saving.set(true); this.api.save('plans', this.planDraft, this.planDraft._id).subscribe({ next: () => this.saved(), error: e => this.failed(e) }); }
  newUser(user?: Supervisor): void { this.cancel(); this.userDraft = user ? { ...user, password: '', policyIds: user.policyIds.map(p => p._id), scope: { ...user.scope, organizationIds: [...user.scope.organizationIds], ownerIds: [...user.scope.ownerIds] } } : { _id: '', name: '', lastname: '', email: '', phone: '', password: '', status: 'active', policyIds: [], scope: { mode: 'SELECTED', organizationIds: [], ownerIds: [] } }; }
  selectAccount(account: PlatformAccount, event: Event): void { if (!this.userDraft) return; const key = account.subjectType === 'ORGANIZATION' ? 'organizationIds' : 'ownerIds'; const checked = (event.target as HTMLInputElement).checked; this.userDraft.scope[key] = checked ? [...new Set([...this.userDraft.scope[key], account.id])] : this.userDraft.scope[key].filter(id => id !== account.id); }
  isSelected(account: PlatformAccount): boolean { return Boolean(this.userDraft?.scope[account.subjectType === 'ORGANIZATION' ? 'organizationIds' : 'ownerIds'].includes(account.id)); }
  saveUser(): void { if (!this.userDraft || this.saving()) return; this.saving.set(true); this.api.save('supervisors', { ...this.userDraft, password: this.userDraft.password || undefined }, this.userDraft._id).subscribe({ next: () => this.saved(), error: e => this.failed(e) }); }
  cancel(): void { this.selectedAccount = null; this.policyDraft = null; this.planDraft = null; this.userDraft = null; }
  private saved(): void { this.saving.set(false); this.notice.set('Cambios guardados'); this.cancel(); this.load(); }
  private failed(error: unknown): void { this.loading.set(false); this.saving.set(false); this.error.set(this.api.errorMessage(error)); }
  complianceLabel(value: string): string { return ({ UNPROVISIONED: 'Sin membresía', COMPLIANT: 'Dentro del plan', EXCEEDED: 'Cupo excedido', INACTIVE: 'Membresía no vigente' } as Record<string, string>)[value] || value; }
}
