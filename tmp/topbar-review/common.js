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

/***/ },

/***/ 52589
/*!*********************************************!*\
  !*** ./src/app/demo/service/iot.service.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTService: () => (/* binding */ IoTService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var _global_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.service */ 53796);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 94975);




class IoTService {
  constructor(http) {
    this.http = http;
    this.apiUrl = _global_service__WEBPACK_IMPORTED_MODULE_1__.global.url;
  }
  getContexts() {
    return this.http.get(`${this.apiUrl}iot/my/contexts`);
  }
  getDashboard(context) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpParams().set('scopeType', context.scopeType);
    if (context.residenceId) params = params.set('residenceId', context.residenceId);
    if (context.condominiumId) params = params.set('condominiumId', context.condominiumId);
    if (context.unitId) params = params.set('unitId', context.unitId);
    return this.http.get(`${this.apiUrl}iot/dashboard`, {
      params
    });
  }
  createDevice(context, payload) {
    return this.http.post(`${this.contextDevicesUrl(context)}`, payload);
  }
  controlDevice(deviceId, command) {
    return this.http.post(`${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}/commands`, command);
  }
  getDeviceState(deviceId) {
    return this.http.get(`${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}/state`);
  }
  updateDevice(deviceId, changes) {
    return this.http.patch(`${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}`, changes);
  }
  deleteDevice(deviceId) {
    return this.http.delete(`${this.apiUrl}iot/devices/${encodeURIComponent(deviceId)}`);
  }
  acknowledgeAlert(eventId) {
    return this.http.patch(`${this.apiUrl}iot/events/${encodeURIComponent(eventId)}/acknowledge`, {});
  }
  createResidence(residenceLabel) {
    return this.http.post(`${this.apiUrl}iot/my/residences`, {
      residenceLabel
    });
  }
  registerPersonalOwner(input) {
    return this.http.post(`${this.apiUrl}iot/owners/register`, input);
  }
  resendPersonalOwnerVerification(email) {
    return this.http.post(`${this.apiUrl}iot/owners/resend-verification`, {
      email
    });
  }
  contextDevicesUrl(context) {
    if (context.scopeType === 'PERSONAL_RESIDENCE' && context.residenceId) {
      return `${this.apiUrl}iot/my/residences/${encodeURIComponent(context.residenceId)}/devices`;
    }
    if (context.scopeType === 'CONDOMINIUM_UNIT' && context.condominiumId && context.unitId) {
      return `${this.apiUrl}iot/condominiums/${encodeURIComponent(context.condominiumId)}/units/${encodeURIComponent(context.unitId)}/devices`;
    }
    if (context.scopeType === 'COMMON_AREA' && context.condominiumId) {
      return `${this.apiUrl}iot/condominiums/${encodeURIComponent(context.condominiumId)}/common-area/devices`;
    }
    throw new Error('IoT context is incomplete');
  }
  static {
    this.ɵfac = function IoTService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: IoTService,
      factory: IoTService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=common.js.map