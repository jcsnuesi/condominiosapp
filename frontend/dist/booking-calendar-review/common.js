"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["common"],{

/***/ 41343
/*!**********************************************!*\
  !*** ./src/app/demo/service/i18n.service.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18nService: () => (/* binding */ I18nService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);

const MESSAGES = {
  'auth.appName': 'CondominiosApp',
  'auth.login.title': 'Bienvenido de vuelta',
  'auth.login.subtitle': 'Inicia sesion para gestionar condominios, reservas, documentos y pagos.',
  'auth.login.email': 'Correo',
  'auth.login.emailPlaceholder': 'correo@empresa.com',
  'auth.login.password': 'Contrasena',
  'auth.login.passwordPlaceholder': 'Ingresa tu contrasena',
  'auth.login.rememberMe': 'Recordarme',
  'auth.login.forgotPassword': 'Olvide mi contrasena',
  'auth.login.submit': 'Entrar',
  'auth.login.error': 'No pudimos validar tus credenciales. Intenta de nuevo.',
  'auth.login.invalidEmail': 'Ingresa un correo valido.',
  'auth.login.requiredPassword': 'La contrasena es obligatoria.',
  'auth.forgot.title': 'Recuperar acceso',
  'auth.forgot.subtitle': 'Te enviaremos instrucciones para restablecer la contrasena.',
  'auth.forgot.submit': 'Enviar enlace',
  'auth.forgot.success': 'Si la cuenta existe, enviamos instrucciones de recuperacion al correo.',
  'auth.reset.title': 'Nueva contrasena',
  'auth.reset.subtitle': 'Ingresa tu nueva contrasena para recuperar el acceso.',
  'auth.reset.submit': 'Actualizar contrasena',
  'auth.reset.success': 'Contrasena actualizada correctamente.',
  'auth.reset.invalidToken': 'El enlace no es valido o ya expiro. Solicita una nueva recuperacion.'
};
class I18nService {
  constructor() {
    this.locale = 'es';
  }
  get currentLocale() {
    return this.locale;
  }
  t(key) {
    return MESSAGES[key] ?? key;
  }
  static {
    this.ɵfac = function I18nService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || I18nService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: I18nService,
      factory: I18nService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=common.js.map