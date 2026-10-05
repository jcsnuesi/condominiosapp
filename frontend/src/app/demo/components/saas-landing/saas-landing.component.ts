import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccessContextService } from '../../service/access-context.service';
import { UserService } from '../../service/user.service';
import { accountDestination } from './account-destination';

type PreviewKey = 'finance' | 'bookings' | 'documents' | 'home';
interface ProductPreview {
  key: PreviewKey;
  label: string;
  title: string;
  description: string;
  columns: readonly string[];
  rows: ReadonlyArray<{ name: string; detail: string; status: string }>;
  note: string;
}

@Component({
  selector: 'app-saas-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './saas-landing.component.html',
  styleUrls: ['./saas-landing.component.css', './saas-landing-sections.css', './saas-landing-responsive.css'],
})
export class SaasLandingComponent implements OnDestroy {
  private readonly user = inject(UserService);
  private readonly access = inject(AccessContextService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly previousTitle = this.title.getTitle();
  private readonly previousDescription = this.meta.getTag('name="description"')?.content;
  private readonly session = this.readSession();
  readonly menuOpen = signal(false);
  readonly selectedPreview = signal<PreviewKey>('finance');
  readonly accountLink = computed(() => accountDestination(this.session.identity, this.session.token, this.access.access()));
  readonly previews: readonly ProductPreview[] = [
    { key: 'finance', label: 'Finanzas', title: 'Cada movimiento, en su lugar.',
      description: 'Consulta cuotas, cargos y pagos. Mantén a mano el estado de cuenta de cada unidad.',
      columns: ['Unidad', 'Concepto', 'Estado'],
      rows: [{ name: 'A-101', detail: 'Cuota de mantenimiento', status: 'Registrada' },
        { name: 'A-102', detail: 'Pago de cuota', status: 'Aplicado' },
        { name: 'B-201', detail: 'Estado de cuenta', status: 'Disponible' }],
      note: 'Cuotas · Comprobantes · Conciliación · Reportes' },
    { key: 'bookings', label: 'Reservas', title: 'Espacios compartidos, bien coordinados.',
      description: 'Organiza las reservas de áreas comunes y consulta las visitas asociadas a cada unidad.',
      columns: ['Espacio', 'Reserva', 'Estado'],
      rows: [{ name: 'Salón social', detail: 'Unidad A-101 · Sábado', status: 'Reservado' },
        { name: 'Área de BBQ', detail: 'Unidad B-201 · Domingo', status: 'Reservado' },
        { name: 'Visitas', detail: 'Consulta de invitados', status: 'Disponible' }],
      note: 'Áreas comunes · Calendario · Invitados' },
    { key: 'documents', label: 'Documentos', title: 'La información que todos necesitan.',
      description: 'Reúne documentos, atiende consultas y organiza la comunicación con los propietarios.',
      columns: ['Documento', 'Categoría', 'Estado'],
      rows: [{ name: 'Reglamento', detail: 'Convivencia', status: 'Disponible' },
        { name: 'Aviso de mantenimiento', detail: 'Comunicación', status: 'Publicado' },
        { name: 'Consulta de propietario', detail: 'Solicitud', status: 'Recibida' }],
      note: 'Documentos · Consultas · Comunicaciones' },
    { key: 'home', label: 'Smart Home', title: 'Tu vivienda también tiene su espacio.',
      description: 'Consulta y controla tus dispositivos compatibles desde una cuenta personal o un contexto del condominio.',
      columns: ['Dispositivo', 'Ubicación', 'Estado'],
      rows: [{ name: 'Luz de entrada', detail: 'Casa principal', status: 'Encendida' },
        { name: 'Sensor de puerta', detail: 'Entrada', status: 'Cerrada' },
        { name: 'Historial de eventos', detail: 'Actividad de dispositivos', status: 'Disponible' }],
      note: 'Requiere dispositivos compatibles y suscripción habilitada' },
  ];
  readonly services = [
    { key: 'management', name: 'Una administración organizada', subtitle: 'Condominios y personas',
      description: 'Gestiona condominios, unidades, propietarios y personal dentro de tu organización.', tags: ['Unidades', 'Propietarios', 'Personal'] },
    { key: 'finance', name: 'Las cuentas, claras', subtitle: 'Finanzas y cobranza',
      description: 'Registra cuotas, cargos y pagos. Consulta estados de cuenta, conciliación y reportes financieros.', tags: ['Cuotas y pagos', 'Conciliación', 'Reportes'] },
    { key: 'bookings', name: 'Un espacio para cada reserva', subtitle: 'Reservas y visitas',
      description: 'Coordina las áreas comunes y mantén organizada la información de reservas e invitados.', tags: ['Calendario', 'Áreas comunes', 'Visitas'] },
    { key: 'documents', name: 'La información, a mano', subtitle: 'Documentos y comunicación',
      description: 'Comparte documentos y avisos, recibe consultas y da seguimiento a las solicitudes de los propietarios.', tags: ['Documentos', 'Avisos', 'Consultas'] },
    { key: 'rentals', name: 'Estancias mejor coordinadas', subtitle: 'Alquileres temporales',
      description: 'Consulta reservas de alquiler temporal y sincroniza calendarios mediante las integraciones disponibles.', tags: ['Estancias', 'Calendarios', 'Integraciones'] },
    { key: 'home', name: 'Una vivienda más conectada', subtitle: 'Smart Home',
      description: 'Gestiona dispositivos compatibles, consulta su estado y revisa su actividad en viviendas o condominios.', tags: ['Dispositivos', 'Control', 'Historial'] },
  ];
  readonly questions = [
    { question: '¿Qué tipo de cuenta necesito?', answer: 'Elige ADMIN si vas a administrar condominios y sus propietarios. Elige OWNER personal si quieres gestionar tu vivienda y sus dispositivos Smart Home. El registro te ayuda a elegir antes de crear tu cuenta.' },
    { question: '¿Cómo entro si mi condominio ya usa CondominiosApp?', answer: 'Tu administración crea tu cuenta, te asigna el condominio y la unidad, y te envía las credenciales por correo. Con esas credenciales puedes iniciar sesión. Si ya tienes cuenta y olvidaste tu contraseña, puedes recuperarla desde el acceso.' },
    { question: '¿Puedo administrar varios condominios?', answer: 'Sí. La cuenta ADMIN permite registrar y gestionar varios condominios dentro de tu propia organización, con sus unidades y propietarios.' },
    { question: '¿Qué sucede después de crear mi cuenta?', answer: 'Recibirás un enlace para verificar tu correo. Después podrás iniciar sesión y configurar tu organización o vivienda. Los enlaces vencen en 24 horas y puedes solicitar un nuevo envío desde el registro.' },
    { question: '¿Qué necesito para usar Smart Home?', answer: 'Necesitas dispositivos compatibles y una suscripción IoT habilitada para tu vivienda o contexto del condominio. La disponibilidad de las funciones depende de los dispositivos y de la configuración de tu cuenta.' },
  ];

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const key = params.get('vista');
      this.selectedPreview.set(this.previews.find(item => item.key === key)?.key ?? 'finance');
    });
    this.title.setTitle('Gestión de condominios y Smart Home | CondominiosApp');
    this.meta.updateTag({ name: 'description', content: 'Organiza condominios, propietarios, finanzas, reservas y documentos con CondominiosApp. Crea tu cuenta de administración o gestiona tu vivienda personal.' });
  }

  closeMenu(): void {
    const navigation = this.document.getElementById('public-navigation');
    if (this.menuOpen() && navigation?.contains(this.document.activeElement)) {
      this.document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
    }
    this.menuOpen.set(false);
  }

  selectPreview(key: PreviewKey): void {
    this.selectedPreview.set(key);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { vista: key === 'finance' ? null : key }, queryParamsHandling: 'merge', preserveFragment: true, replaceUrl: true });
  }

  focusContent(): void { this.document.getElementById('main-content')?.focus(); }

  moveTab(event: KeyboardEvent): void {
    const index = this.previews.findIndex(item => item.key === this.selectedPreview());
    const next = event.key === 'ArrowRight' ? (index + 1) % this.previews.length
      : event.key === 'ArrowLeft' ? (index + this.previews.length - 1) % this.previews.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? this.previews.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    this.selectPreview(this.previews[next].key);
    const tablist = (event.target as HTMLElement).closest('[role="tablist"]');
    (tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next])?.focus();
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.previousTitle);
    if (this.previousDescription === undefined) this.meta.removeTag('name="description"');
    else this.meta.updateTag({ name: 'description', content: this.previousDescription });
  }

  private readSession(): { identity: unknown; token: string } {
    try { return { identity: this.user.getIdentity(), token: this.user.getToken() || '' }; }
    catch { return { identity: null, token: '' }; }
  }
}
