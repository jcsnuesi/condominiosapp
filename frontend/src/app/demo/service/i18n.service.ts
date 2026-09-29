import { Injectable } from '@angular/core';

const MESSAGES: Record<string, string> = {
    'auth.appName': 'CondominiosApp',
    'auth.login.title': 'Bienvenido de vuelta',
    'auth.login.subtitle':
        'Inicia sesion para gestionar condominios, reservas, documentos y pagos.',
    'auth.login.email': 'Correo',
    'auth.login.emailPlaceholder': 'correo@empresa.com',
    'auth.login.password': 'Contrasena',
    'auth.login.passwordPlaceholder': 'Ingresa tu contrasena',
    'auth.login.rememberMe': 'Recordarme',
    'auth.login.forgotPassword': 'Olvide mi contrasena',
    'auth.login.submit': 'Entrar',
    'auth.login.error':
        'No pudimos validar tus credenciales. Intenta de nuevo.',
    'auth.login.invalidEmail': 'Ingresa un correo valido.',
    'auth.login.requiredPassword': 'La contrasena es obligatoria.',
    'auth.forgot.title': 'Recuperar acceso',
    'auth.forgot.subtitle':
        'Te enviaremos instrucciones para restablecer la contrasena.',
    'auth.forgot.submit': 'Enviar enlace',
    'auth.forgot.success':
        'Si la cuenta existe, enviamos instrucciones de recuperacion al correo.',
    'auth.reset.title': 'Nueva contrasena',
    'auth.reset.subtitle':
        'Ingresa tu nueva contrasena para recuperar el acceso.',
    'auth.reset.submit': 'Actualizar contrasena',
    'auth.reset.success': 'Contrasena actualizada correctamente.',
    'auth.reset.invalidToken':
        'El enlace no es valido o ya expiro. Solicita una nueva recuperacion.',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
    private readonly locale = 'es';

    get currentLocale(): string {
        return this.locale;
    }

    t(key: string): string {
        return MESSAGES[key] ?? key;
    }
}
