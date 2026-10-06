"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_iot-owner-register_iot-owner-register_module_ts"],{

/***/ 91986
/*!**********************************************************************************************!*\
  !*** ./src/app/demo/components/auth/iot-owner-register/iot-owner-register-routing.module.ts ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTOwnerRegisterRoutingModule: () => (/* binding */ IoTOwnerRegisterRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _iot_owner_register_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iot-owner-register.component */ 78572);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class IoTOwnerRegisterRoutingModule {
  static {
    this.ɵfac = function IoTOwnerRegisterRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTOwnerRegisterRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: IoTOwnerRegisterRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _iot_owner_register_component__WEBPACK_IMPORTED_MODULE_1__.IoTOwnerRegisterComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](IoTOwnerRegisterRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 78572
/*!*****************************************************************************************!*\
  !*** ./src/app/demo/components/auth/iot-owner-register/iot-owner-register.component.ts ***!
  \*****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTOwnerRegisterComponent: () => (/* binding */ IoTOwnerRegisterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 40311);
/* harmony import */ var src_app_demo_service_iot_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/demo/service/iot.service */ 52589);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _phone_format_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../phone-format.directive */ 26707);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/password */ 41188);












function IoTOwnerRegisterComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.errorMessage());
  }
}
function IoTOwnerRegisterComponent_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.notice());
  }
}
function IoTOwnerRegisterComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "SMART HOME");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "h1", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Revisa tu correo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 5)(5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Si el correo puede registrarse, recibir\u00E1s un enlace de verificaci\u00F3n. \u00C1brelo para activar tu cuenta y luego inicia sesi\u00F3n. El enlace vence en 24 horas. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](7, IoTOwnerRegisterComponent_Conditional_2_Conditional_7_Template, 2, 1, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](8, IoTOwnerRegisterComponent_Conditional_2_Conditional_8_Template, 2, 1, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IoTOwnerRegisterComponent_Conditional_2_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.resend());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, "Reenviar enlace");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IoTOwnerRegisterComponent_Conditional_2_Template_button_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.goToLogin());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx_r1.errorMessage() ? 7 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx_r1.notice() ? 8 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx_r1.submitting());
  }
}
function IoTOwnerRegisterComponent_Conditional_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "p-message", 11);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("text", ctx_r1.errorMessage());
  }
}
function IoTOwnerRegisterComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "\u2190 Elegir otro tipo de cuenta");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "OWNER PERSONAL \u00B7 REGISTRO");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "h1", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "Crea tu cuenta personal");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " Gestiona tu vivienda personal y sus dispositivos Smart Home. Tu cuenta no pertenece a una organizaci\u00F3n. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](8, IoTOwnerRegisterComponent_Conditional_3_Conditional_8_Template, 1, 1, "p-message", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "form", 12, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function IoTOwnerRegisterComponent_Conditional_3_Template_form_ngSubmit_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.submit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "Nombre");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("name", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "Apellido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("lastname", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "Correo electr\u00F3nico");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_19_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("email", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "label", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "Tel\u00E9fono");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_22_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("phone", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "label", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](24, "Contrase\u00F1a (12 a 128 caracteres)");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "p-password", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_p_password_ngModelChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("password", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "label", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](27, "Nombre de tu vivienda");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "input", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("residenceLabel", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](29, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, "Si tu condominio ya utiliza la plataforma, tu administraci\u00F3n crea tu cuenta y te env\u00EDa las credenciales por correo.");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "a", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](33, "\u00BFYa tienes cuenta? Inicia sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const registerForm_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](10);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx_r1.errorMessage() ? 8 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r1.form().name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r1.form().lastname);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r1.form().email);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r1.form().phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("toggleMask", true)("feedback", false)("ngModel", ctx_r1.form().password);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r1.form().residenceLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("loading", ctx_r1.submitting())("disabled", registerForm_r4.invalid || ctx_r1.submitting());
  }
}
class IoTOwnerRegisterComponent {
  constructor() {
    this.iot = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(src_app_demo_service_iot_service__WEBPACK_IMPORTED_MODULE_3__.IoTService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router);
    this.submitting = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "submitting"
    }] : /* istanbul ignore next */[]));
    this.submitted = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "submitted"
    }] : /* istanbul ignore next */[]));
    this.errorMessage = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "errorMessage"
    }] : /* istanbul ignore next */[]));
    this.notice = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "notice"
    }] : /* istanbul ignore next */[]));
    this.form = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      residenceLabel: ''
    }, ...(ngDevMode ? [{
      debugName: "form"
    }] : /* istanbul ignore next */[]));
  }
  update(field, value) {
    this.form.update(current => ({
      ...current,
      [field]: value
    }));
  }
  submit() {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set('');
    this.iot.registerPersonalOwner(this.form()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.form.update(current => ({
          ...current,
          password: ''
        }));
        this.submitted.set(true);
      },
      error: error => this.errorMessage.set(error.error?.error?.message || error.error?.message || 'El registro no está disponible. Intenta nuevamente.')
    });
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
  resend() {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.errorMessage.set('');
    this.notice.set('');
    this.iot.resendPersonalOwnerVerification(this.form().email).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => this.submitting.set(false))).subscribe({
      next: () => this.notice.set('Si tu cuenta sigue pendiente, recibirás un nuevo enlace. Revisa también el correo no deseado.'),
      error: () => this.errorMessage.set('No pudimos reenviar el enlace. Intenta nuevamente.')
    });
  }
  static {
    this.ɵfac = function IoTOwnerRegisterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTOwnerRegisterComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: IoTOwnerRegisterComponent,
      selectors: [["app-iot-owner-register"]],
      standalone: false,
      decls: 4,
      vars: 1,
      consts: [["registerForm", "ngForm"], [1, "register-page"], ["aria-labelledby", "register-title", 1, "register-panel"], [1, "register-eyebrow"], ["id", "register-title"], ["role", "status", 1, "register-success"], ["role", "alert"], ["role", "status"], ["type", "button", 3, "click", "disabled"], ["pButton", "", "type", "button", "label", "Ir a iniciar sesi\u00F3n", "icon", "pi pi-arrow-left", 3, "click"], ["routerLink", "/auth/register"], ["severity", "error", 3, "text"], [1, "register-form", 3, "ngSubmit"], ["for", "owner-name", 1, "half"], ["pInputText", "", "id", "owner-name", "name", "name", "required", "", "maxlength", "100", 1, "half", 3, "ngModelChange", "ngModel"], ["for", "owner-lastname", 1, "half"], ["pInputText", "", "id", "owner-lastname", "name", "lastname", "required", "", "maxlength", "100", 1, "half", 3, "ngModelChange", "ngModel"], ["for", "owner-email"], ["pInputText", "", "id", "owner-email", "name", "email", "type", "email", "required", "", "email", "", "autocomplete", "email", 3, "ngModelChange", "ngModel"], ["for", "owner-phone"], ["appPhoneFormat", "", "pInputText", "", "id", "owner-phone", "name", "phone", "type", "tel", "required", "", "pattern", "^\\+?[0-9]{8,16}$", "autocomplete", "tel", 3, "ngModelChange", "ngModel"], ["for", "owner-password"], ["inputId", "owner-password", "name", "password", "required", "", "minlength", "12", "maxlength", "128", "autocomplete", "new-password", 3, "ngModelChange", "toggleMask", "feedback", "ngModel"], ["for", "residence-label"], ["pInputText", "", "id", "residence-label", "name", "residenceLabel", "required", "", "maxlength", "100", "placeholder", "Casa principal, apartamento de playa\u2026", 3, "ngModelChange", "ngModel"], ["pButton", "", "type", "submit", "icon", "pi pi-arrow-right", "iconPos", "right", "label", "Crear cuenta personal", 3, "loading", "disabled"], ["routerLink", "/auth/login"]],
      template: function IoTOwnerRegisterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "main", 1)(1, "section", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](2, IoTOwnerRegisterComponent_Conditional_2_Template, 12, 3)(3, IoTOwnerRegisterComponent_Conditional_3_Template, 34, 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx.submitted() ? 2 : 3);
        }
      },
      dependencies: [_phone_format_directive__WEBPACK_IMPORTED_MODULE_5__.PhoneFormatDirective, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_8__.ButtonDirective, primeng_inputtext__WEBPACK_IMPORTED_MODULE_9__.InputText, primeng_message__WEBPACK_IMPORTED_MODULE_10__.Message, primeng_password__WEBPACK_IMPORTED_MODULE_11__.Password],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  color: #18372f;\n}\n\n.register-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 1.25rem;\n  background: #f5f8f5;\n}\n\n.register-panel[_ngcontent-%COMP%] {\n  width: min(100%, 34rem);\n  padding: 2rem;\n  border: 1px solid #dce7e1;\n  border-radius: 8px;\n  background: #fff;\n}\n\n.register-panel[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0.5rem;\n  font-size: 1.7rem;\n}\n\n.register-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #6f817b;\n  line-height: 1.5;\n}\n\n.register-eyebrow[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #147454 !important;\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n\n.register-form[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.8rem;\n  margin-top: 1.5rem;\n}\n\n.register-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  margin-bottom: -0.5rem;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n\n.register-form[_ngcontent-%COMP%]   label.half[_ngcontent-%COMP%] {\n  grid-column: auto;\n}\n\n.register-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  grid-column: 1/-1;\n}\n\n.register-form[_ngcontent-%COMP%]   .half[_ngcontent-%COMP%] {\n  grid-column: auto;\n}\n\n.register-form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  margin-top: 0.5rem;\n}\n\n.register-success[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n  padding-top: 1rem;\n}\n\n@media (max-width: 480px) {\n  .register-panel[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n  }\n  .register-form[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .register-form[_ngcontent-%COMP%]   .half[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvaW90LW93bmVyLXJlZ2lzdGVyL2lvdC1vd25lci1yZWdpc3Rlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ1k7RUFDSSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBQWhCOztBQUVZO0VBQ0ksaUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0FBQ2hCOztBQUNZO0VBQ0ksdUJBQUE7RUFDQSxhQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBRWhCOztBQUFZO0VBQ0ksdUJBQUE7RUFDQSxpQkFBQTtBQUdoQjs7QUFEWTtFQUNJLGNBQUE7RUFDQSxnQkFBQTtBQUloQjs7QUFGWTtFQUNJLFNBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUFLaEI7O0FBSFk7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUFNaEI7O0FBSlk7RUFDSSxpQkFBQTtFQUNBLHNCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQU9oQjs7QUFMWTtFQUNJLGlCQUFBO0FBUWhCOztBQU5ZO0VBQ0ksV0FBQTtFQUNBLGlCQUFBO0FBU2hCOztBQVBZO0VBQ0ksaUJBQUE7QUFVaEI7O0FBUlk7RUFDSSxpQkFBQTtFQUNBLGtCQUFBO0FBV2hCOztBQVRZO0VBQ0ksYUFBQTtFQUNBLFdBQUE7RUFDQSxpQkFBQTtBQVloQjs7QUFWWTtFQUNJO0lBQ0ksZ0JBQUE7RUFhbEI7RUFYYztJQUNJLDBCQUFBO0VBYWxCO0VBWGM7SUFDSSxpQkFBQTtFQWFsQjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XG4gICAgICAgICAgICAgICAgY29sb3I6ICMxODM3MmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAucmVnaXN0ZXItcGFnZSB7XG4gICAgICAgICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEuMjVyZW07XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogI2Y1ZjhmNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5yZWdpc3Rlci1wYW5lbCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCAzNHJlbSk7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogMnJlbTtcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGNlN2UxO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnJlZ2lzdGVyLXBhbmVsIGgxIHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAuMnJlbSAwIDAuNXJlbTtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEuN3JlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5yZWdpc3Rlci1wYW5lbCBwIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogIzZmODE3YjtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnJlZ2lzdGVyLWV5ZWJyb3cge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogIzE0NzQ1NCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMC43cmVtO1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAucmVnaXN0ZXItZm9ybSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgICAgICAgICAgICAgZ2FwOiAwLjhyZW07XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMS41cmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnJlZ2lzdGVyLWZvcm0gbGFiZWwge1xuICAgICAgICAgICAgICAgIGdyaWQtY29sdW1uOiAxIC8gLTE7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogLTAuNXJlbTtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnJlZ2lzdGVyLWZvcm0gbGFiZWwuaGFsZiB7XG4gICAgICAgICAgICAgICAgZ3JpZC1jb2x1bW46IGF1dG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAucmVnaXN0ZXItZm9ybSBpbnB1dCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5yZWdpc3Rlci1mb3JtIC5oYWxmIHtcbiAgICAgICAgICAgICAgICBncmlkLWNvbHVtbjogYXV0bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC5yZWdpc3Rlci1mb3JtIGJ1dHRvbiB7XG4gICAgICAgICAgICAgICAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAucmVnaXN0ZXItc3VjY2VzcyB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgICAgICAgICBnYXA6IDAuOHJlbTtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLXRvcDogMXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuICAgICAgICAgICAgICAgIC5yZWdpc3Rlci1wYW5lbCB7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEuMjVyZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC5yZWdpc3Rlci1mb3JtIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC5yZWdpc3Rlci1mb3JtIC5oYWxmIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ },

/***/ 91931
/*!**************************************************************************************!*\
  !*** ./src/app/demo/components/auth/iot-owner-register/iot-owner-register.module.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTOwnerRegisterModule: () => (/* binding */ IoTOwnerRegisterModule)
/* harmony export */ });
/* harmony import */ var src_app_phone_format_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/phone-format.directive */ 26707);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var _iot_owner_register_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./iot-owner-register.component */ 78572);
/* harmony import */ var _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./iot-owner-register-routing.module */ 91986);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 94975);











class IoTOwnerRegisterModule {
  static {
    this.ɵfac = function IoTOwnerRegisterModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTOwnerRegisterModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineNgModule"]({
      type: IoTOwnerRegisterModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputTextModule, primeng_message__WEBPACK_IMPORTED_MODULE_6__.MessageModule, primeng_password__WEBPACK_IMPORTED_MODULE_7__.PasswordModule, _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_9__.IoTOwnerRegisterRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsetNgModuleScope"](IoTOwnerRegisterModule, {
    declarations: [_iot_owner_register_component__WEBPACK_IMPORTED_MODULE_8__.IoTOwnerRegisterComponent],
    imports: [src_app_phone_format_directive__WEBPACK_IMPORTED_MODULE_0__.PhoneFormatDirective, _angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputTextModule, primeng_message__WEBPACK_IMPORTED_MODULE_6__.MessageModule, primeng_password__WEBPACK_IMPORTED_MODULE_7__.PasswordModule, _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_9__.IoTOwnerRegisterRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_iot-owner-register_iot-owner-register_module_ts.js.map