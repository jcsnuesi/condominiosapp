import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({ standalone: true, selector: 'app-platform-welcome', changeDetection: ChangeDetectionStrategy.OnPush, styleUrl: './platform.css', template: '<section class="platform-shell"><h1>Administración SaaS</h1><p>Selecciona una opción del menú para supervisar tus cuentas. Si no aparecen opciones, solicita una política de acceso al administrador de plataforma.</p></section>' })
export class PlatformWelcomeComponent {}
