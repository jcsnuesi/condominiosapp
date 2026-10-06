import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { global } from '../../service/global.service';
interface SupportSettings { enabled: boolean; staffId: string | null; }
interface StaffOption { _id: string; name: string; lastname: string; }
@Component({
  selector: 'app-resident-support-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="support-settings">
      <h3>Garita o recepción</h3>
      @if (loading()) { <p role="status">Cargando atención…</p> }
      @else if (loaded()) {
        <label class="toggle"><input type="checkbox" [(ngModel)]="support.enabled" [ngModelOptions]="{standalone: true}"> Tiene garita o recepción</label>
        <label for="support-staff">STAFF responsable de atención</label>
        <select id="support-staff" [(ngModel)]="support.staffId" [ngModelOptions]="{standalone: true}">
          <option [ngValue]="null">Selecciona un responsable</option>
          @for (person of staff(); track person._id) { <option [ngValue]="person._id">{{ person.name }} {{ person.lastname }}</option> }
        </select>
        @if (!staff().length) { <p>Registra un STAFF activo en este condominio para habilitar las llamadas.</p> }
        <p>Un único responsable recibe las llamadas de OWNER/FAMILY dentro de la app.</p>
        <button type="button" [disabled]="saving() || (support.enabled && !support.staffId)" (click)="save()">{{ saving() ? 'Guardando…' : 'Guardar atención' }}</button>
      }
      @if (message()) { <p role="status">{{ message() }}</p> }
    </section>`,
  styles: [`
    .support-settings { padding: 1rem 0; display: grid; gap: .75rem; border-top: 1px solid var(--surface-border); }
    h3, p { margin: 0; } p { color: var(--text-color-secondary); }
    .toggle { display: flex; align-items: center; gap: .5rem; min-height: 44px; }
    select, button { min-height: 44px; padding: .6rem; border: 1px solid var(--surface-border); border-radius: .5rem; background: var(--surface-card); color: var(--text-color); }
    button { justify-self: start; cursor: pointer; } button:disabled { opacity: .5; }
  `],
})
export class ResidentSupportSettingsComponent implements OnChanges {
  @Input({ required: true }) condominiumId = '';
  private readonly http = inject(HttpClient);
  readonly staff = signal<StaffOption[]>([]);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly saving = signal(false);
  readonly message = signal('');
  support: SupportSettings = { enabled: false, staffId: null };
  async ngOnChanges(): Promise<void> {
    this.loaded.set(false);
    if (!this.condominiumId) return;
    const id = this.condominiumId;
    this.loading.set(true);
    this.message.set('');
    try {
      const result = await firstValueFrom(this.http.get<{ support: SupportSettings; staff: StaffOption[] }>(`${global.url}calls/settings/${id}`));
      if (id !== this.condominiumId) return;
      this.support = result.support;
      this.staff.set(result.staff);
      this.loaded.set(true);
    } catch { this.message.set('No se pudo cargar la configuración de atención.'); }
    finally { if (id === this.condominiumId) this.loading.set(false); }
  }
  async save(): Promise<void> {
    this.saving.set(true);
    this.message.set('');
    try {
      await firstValueFrom(this.http.put(`${global.url}calls/settings/${this.condominiumId}`, this.support));
      this.message.set('Configuración de atención guardada.');
    } catch { this.message.set('No se pudo guardar. Verifica que el responsable siga activo en este condominio.'); }
    finally { this.saving.set(false); }
  }
}
