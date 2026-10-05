import { Component, ChangeDetectorRef, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AccessContextService } from '../../service/access-context.service';
import { ScheduleService, ScheduleContext, Responsible, ScheduleRow, TaskRow, VendorRow, HistoryRow, EvidenceRow, PageResult } from './schedule.service';

type Tab = 'schedules' | 'tasks' | 'history' | 'vendors';
type Editor = 'schedule' | 'complete' | 'reschedule' | 'vendor' | 'history';
@Component({
  selector: 'app-schedule', standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, FullCalendarModule],
  templateUrl: './schedule.component.html', styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private readonly api = inject(ScheduleService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly access = inject(AccessContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly subscriptions = new Subscription();
  tab: Tab = 'schedules'; view: 'list' | 'calendar' = 'list';
  contexts: ScheduleContext[] = []; responsibles: Responsible[] = [];
  filterResponsibles: Responsible[] = [];
  documents: Array<{ _id: string; title: string }> = [];
  documentIds: string[] = [];
  schedules: ScheduleRow[] = []; tasks: TaskRow[] = []; history: HistoryRow[] = []; vendors: VendorRow[] = [];
  total = 0; page = 1; readonly limit = 20; loading = false; saving = false;
  error = ''; message = ''; selectedLocation = ''; statusFilter = ''; from = ''; to = ''; responsibleFilter = ''; providerFilter = '';
  editor: Editor = 'schedule'; dialog = false; editingId = ''; task: TaskRow | null = null; selectedHistory: HistoryRow | null = null;
  draft = this.emptyDraft(); vendorDraft = { name: '', contact: '', notes: '', isActive: true };
  completion = { performedAt: this.localDate(new Date()), providerId: '', cost: '0', currency: 'DOP', description: '', notes: '', nextRecommendedDate: '', documentIds: '' };
  rescheduleDate = ''; files: File[] = [];
  calendar: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin], initialView: 'dayGridMonth', locale: 'en', height: 'auto',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    datesSet: info => { this.calendarFrom = info.startStr; this.calendarTo = info.endStr; if (this.view === 'calendar') this.loadCalendar(); },
    eventClick: info => { const row = this.calendarTasks.find(t => t._id === info.event.id); if (row) this.openComplete(row); },
  };
  private calendarFrom = ''; private calendarTo = ''; private calendarTasks: TaskRow[] = [];
  private listRequest: Subscription | null = null; private responsibleRequest: Subscription | null = null;
  ngOnInit() {
    this.subscriptions.add(this.api.get<ScheduleContext[]>('schedules/contexts').subscribe({ next: contexts => { this.contexts = contexts; this.load(); this.changeDetector.markForCheck(); }, error: e => this.report(e) }));
    this.loadVendors();
    this.subscriptions.add(this.route.queryParams.subscribe(params => {
      if (params['taskId']) {
        this.tab = 'tasks';
        this.subscriptions.add(this.api.get<TaskRow>(`tasks/${params['taskId']}`).subscribe({ next: t => { if (t.isOpen) this.openComplete(t); else { this.message = 'This task is already closed. Check the history.'; this.tab = 'history'; } this.load(); }, error: e => this.report(e) }));
      }
    }));
  }
  ngOnDestroy() { this.subscriptions.unsubscribe(); this.listRequest?.unsubscribe(); this.responsibleRequest?.unsubscribe(); }
  has(permission: string) { return this.access.hasPermission(permission); }
  selectTab(tab: Tab) { this.tab = tab; this.page = 1; this.view = 'list'; this.load(); }
  resetFilters() { this.page = 1; this.load(); }
  locationFilterChanged() {
    this.responsibleFilter = ''; this.filterResponsibles = []; this.resetFilters();
    const context = this.contexts[Number(this.selectedLocation)];
    if (this.selectedLocation === '' || !context) return;
    const query: Record<string, string> = {};
    for (const key of ['condominiumId', 'unitId', 'residenceId'] as const) if (context[key]) query[key] = context[key];
    this.subscriptions.add(this.api.get<Responsible[]>('schedules/responsibles', query).subscribe({ next: r => { this.filterResponsibles = r; this.changeDetector.markForCheck(); }, error: e => this.report(e) }));
  }
  private query(): Record<string, string> {
    const query: Record<string, string> = { page: String(this.page), limit: String(this.limit) };
    const context = this.contexts[Number(this.selectedLocation)];
    if (this.selectedLocation !== '' && context) for (const key of ['condominiumId', 'unitId', 'residenceId'] as const) if (context[key]) query[key] = context[key];
    if (this.tab === 'tasks') { query['source'] = 'schedule'; if (this.statusFilter) query['status'] = this.statusFilter; }
    if (this.tab !== 'vendors') {
      if (this.from) query['from'] = new Date(`${this.from}T00:00`).toISOString();
      if (this.to) query['to'] = new Date(`${this.to}T23:59:59`).toISOString();
      if (this.responsibleFilter && this.tab !== 'history') query['assignedUserId'] = this.responsibleFilter;
      if (this.providerFilter && this.tab === 'history') query['providerId'] = this.providerFilter;
    }
    return query;
  }
  load() {
    if (this.view === 'calendar') { this.loadCalendar(); return; }
    this.listRequest?.unsubscribe(); this.loading = true; this.error = '';
    const path = { schedules: 'schedules', tasks: 'tasks', history: 'maintenance/history', vendors: 'maintenance/vendors' }[this.tab];
    this.listRequest = this.api.get<PageResult<ScheduleRow | TaskRow | HistoryRow | VendorRow>>(path, this.query()).subscribe({
      next: r => { this.total = r.total; if (this.tab === 'schedules') this.schedules = r.docs as ScheduleRow[]; else if (this.tab === 'tasks') this.tasks = r.docs as TaskRow[]; else if (this.tab === 'history') this.history = r.docs as HistoryRow[]; else this.vendors = r.docs as VendorRow[]; this.loading = false; this.changeDetector.markForCheck(); },
      error: e => this.report(e),
    });
  }
  setView(view: 'list' | 'calendar') { this.view = view; if (view === 'list') this.load(); }
  loadCalendar() {
    if (!this.calendarFrom) return;
    this.listRequest?.unsubscribe(); this.loading = true;
    const query = { ...this.query(), source: 'schedule', page: '1', limit: '100', from: this.calendarFrom, to: this.calendarTo };
    this.listRequest = this.api.get<PageResult<TaskRow>>('tasks', query).subscribe({
      next: r => {
        if (r.total > 100) {
          const requests = Array.from({ length: Math.ceil(r.total / 100) - 1 }, (_, i) => this.api.get<PageResult<TaskRow>>('tasks', { ...query, page: String(i + 2) }));
          this.subscriptions.add(forkJoin(requests).subscribe({ next: pages => this.setCalendar([ ...r.docs, ...pages.flatMap(p => p.docs) ]), error: e => this.report(e) }));
        } else this.setCalendar(r.docs);
      }, error: e => this.report(e),
    });
  }
  private setCalendar(tasks: TaskRow[]) {
    this.calendarTasks = tasks; this.loading = false;
    this.calendar = { ...this.calendar, events: tasks.map(t => ({ id: t._id, title: `${t.name} · ${this.statusLabel(t.status)}`, start: t.dueDate, backgroundColor: t.status === 'OVERDUE' ? '#b54738' : t.status === 'COMPLETED' ? '#287a56' : '#326c9b' })) };
    this.changeDetector.markForCheck();
  }
  private loadVendors() {
    if (!this.has('vendors.read')) return;
    this.subscriptions.add(this.api.get<PageResult<VendorRow>>('maintenance/vendors', { limit: '100' }).subscribe({ next: r => { this.vendors = r.docs; this.changeDetector.markForCheck(); }, error: e => this.report(e) }));
  }
  emptyDraft() { return { name: '', description: '', equipmentName: '', frequencyType: 'MONTH', frequencyValue: 4, startDate: this.localDate(new Date()), timezone: 'America/Santo_Domingo', remindBeforeDays: 7, location: '', responsible: '' }; }
  openSchedule(row?: ScheduleRow) {
    this.error = ''; this.editingId = row?._id || ''; this.editor = 'schedule'; this.draft = this.emptyDraft();
    if (row) this.draft = { name: row.name, description: row.description, equipmentName: row.equipmentName, frequencyType: row.frequencyType, frequencyValue: row.frequencyValue, startDate: this.localDate(new Date(row.startDate)), timezone: row.timezone, remindBeforeDays: row.remindBeforeDays, location: String(this.contexts.findIndex(c => ['condominiumId', 'unitId', 'residenceId'].every(k => String(c[k as keyof ScheduleContext] || '') === String(row[k as keyof ScheduleRow] || '')))), responsible: `${row.assignedRole}:${row.assignedUserId}` };
    else if (this.contexts.length === 1) this.draft.location = '0';
    this.dialog = true; if (this.draft.location !== '') this.loadResponsibles();
  }
  loadResponsibles() {
    const context = this.contexts[Number(this.draft.location)]; if (!context) return;
    this.responsibles = []; this.responsibleRequest?.unsubscribe();
    const query: Record<string, string> = {}; for (const key of ['condominiumId', 'unitId', 'residenceId'] as const) if (context[key]) query[key] = context[key];
    this.responsibleRequest = this.api.get<Responsible[]>('schedules/responsibles', query).subscribe({ next: r => { this.responsibles = r; if (!this.editingId) this.draft.responsible = ''; this.changeDetector.markForCheck(); }, error: e => this.report(e) });
  }
  saveSchedule() {
    if (!this.draft.name.trim() || this.draft.location === '') { this.error = 'Select a location and enter a name.'; return; }
    const { location, responsible, startDate, ...fields } = this.draft;
    const [assignedRole, assignedUserId] = responsible.split(':');
    const body = { ...fields, ...(responsible ? { assignedRole, assignedUserId } : { assignedRole: null, assignedUserId: null }), ...(!this.editingId ? { ...this.contexts[Number(location)], startDate: new Date(startDate).toISOString() } : {}) };
    this.save(this.editingId ? this.api.patch(`schedules/${this.editingId}`, body) : this.api.post('schedules', body));
  }
  toggle(row: ScheduleRow) { this.save(this.api.post(`schedules/${row._id}/${row.isActive ? 'pause' : 'resume'}`, {})); }
  openComplete(task: TaskRow) {
    if (!task.isOpen || !this.has('maintenance.update')) { this.message = 'View this task and its history in the list.'; return; }
    this.task = task; this.editor = 'complete'; this.files = []; this.error = '';
    this.documentIds = []; this.documents = [];
    if (this.has('documents.read') && task.condominiumId) {
      const query: Record<string, string> = { condominiumId: task.condominiumId };
      if (task.unitId) query['unitId'] = task.unitId;
      this.subscriptions.add(this.api.get<Array<{ _id: string; title: string }>>('schedules/documents', query).subscribe({ next: r => { this.documents = r; this.changeDetector.markForCheck(); }, error: e => this.report(e) }));
    }
    this.completion = { performedAt: this.localDate(new Date()), providerId: '', cost: '0', currency: 'DOP', description: '', notes: '', nextRecommendedDate: '', documentIds: '' };
    this.loadVendors(); this.dialog = true;
  }
  selectFiles(event: Event) {
    const input = event.target as HTMLInputElement; const files = Array.from(input.files || []);
    if (files.length > 5 || files.some(f => f.size > 10 * 1024 * 1024)) { this.error = 'Up to five files, 10 MB each.'; input.value = ''; this.files = []; } else this.files = files;
  }
  complete() {
    if (!this.task) return;
    const body = new FormData();
    for (const [key, value] of Object.entries(this.completion)) {
      if (!value && ['providerId', 'nextRecommendedDate'].includes(key)) continue;
      const field = key === 'performedAt' || key === 'nextRecommendedDate' ? new Date(value).toISOString() : key === 'documentIds' ? JSON.stringify(this.documentIds) : value;
      body.append(key, field);
    }
    for (const file of this.files) body.append('evidence', file);
    this.save(this.api.post(`tasks/${this.task._id}/complete`, body));
  }
  changeStatus(task: TaskRow, status: string) { this.save(this.api.patch(`tasks/${task._id}/status`, { status })); }
  openReschedule(task: TaskRow) { this.task = task; this.editor = 'reschedule'; this.rescheduleDate = this.localDate(new Date(task.dueDate)); this.error = ''; this.dialog = true; }
  reschedule() { if (this.task) this.save(this.api.post(`tasks/${this.task._id}/reschedule`, { dueDate: new Date(this.rescheduleDate).toISOString() })); }
  openVendor(row?: VendorRow) { this.editingId = row?._id || ''; this.vendorDraft = row ? { name: row.name, contact: row.contact, notes: row.notes, isActive: row.isActive } : { name: '', contact: '', notes: '', isActive: true }; this.editor = 'vendor'; this.error = ''; this.dialog = true; }
  saveVendor() { this.save(this.editingId ? this.api.patch(`maintenance/vendors/${this.editingId}`, this.vendorDraft) : this.api.post('maintenance/vendors', this.vendorDraft)); }
  openHistory(row: HistoryRow) { this.selectedHistory = row; this.editor = 'history'; this.error = ''; this.dialog = true; }
  download(record: HistoryRow, file: EvidenceRow) {
    this.subscriptions.add(this.api.download(record._id, file).subscribe({ next: blob => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = file.filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }, error: e => this.report(e) }));
  }
  save<T>(request: Observable<T>) {
    if (this.saving) return; this.saving = true; this.error = ''; this.message = '';
    this.subscriptions.add(request.subscribe({ next: () => { this.saving = false; this.dialog = false; this.message = 'Changes saved.'; this.load(); this.changeDetector.markForCheck(); }, error: e => this.report(e) }));
  }
  report(error: HttpErrorResponse) { this.loading = false; this.saving = false; this.error = error.error?.error?.message || 'Unable to complete the operation. Please try again.'; this.changeDetector.markForCheck(); }
  localDate(date: Date) { return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
  formatDate(value: string, timezone = 'America/Santo_Domingo') { return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone }).format(new Date(value)); }
  cost(row: HistoryRow) { return typeof row.cost === 'string' ? row.cost : row.cost?.$numberDecimal || '0'; }
  locationLabel(row: { condominiumId?: string; unitId?: string; residenceId?: string }) { return this.contexts.find(c => ['condominiumId', 'unitId', 'residenceId'].every(k => String(c[k as keyof ScheduleContext] || '') === String(row[k as keyof typeof row] || '')))?.label || 'Location'; }
  statusLabel(status: string) { const labels: Record<string, string> = { SCHEDULED: 'Scheduled', PENDING: 'Pending', IN_PROGRESS: 'In progress', OVERDUE: 'Overdue', COMPLETED: 'Completed', CANCELLED: 'Cancelled', SKIPPED: 'Skipped' }; return labels[status] || status; }
  frequencyLabel(type: string) { const labels: Record<string, string> = { ONCE: 'Once', DAY: 'day(s)', WEEK: 'week(s)', MONTH: 'month(s)', YEAR: 'year(s)' }; return labels[type] || type; }
}
