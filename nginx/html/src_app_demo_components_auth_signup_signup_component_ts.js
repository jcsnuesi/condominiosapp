"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_signup_signup_component_ts"],{

/***/ 44588
/*!*****************************************************************!*\
  !*** ./src/app/demo/components/auth/signup/signup.component.ts ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SignupComponent: () => (/* binding */ SignupComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 40311);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../service/global.service */ 53796);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 58440);








function SignupComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "CREAR CUENTA");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "h1", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "\u00BFQu\u00E9 necesitas gestionar?");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Te ayudamos a elegir la cuenta adecuada para comenzar.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 9)(7, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupComponent_Conditional_4_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.step.set("account"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "ADMIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Administrar condominios");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "Crea tu organizaci\u00F3n, registra condominios y unidades, y gestiona propietarios, cobros y comunicaciones.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Crear cuenta de administraci\u00F3n \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "a", 13)(17, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18, "OWNER PERSONAL");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20, "Gestionar mi vivienda");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](22, "Registra tu vivienda personal y gestiona sus dispositivos Smart Home desde tu propia cuenta.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24, "Crear cuenta personal \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "aside")(26, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](27, "\u00BFTu condominio ya utiliza la plataforma?");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](28, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](29, "Tu administraci\u00F3n crea tu acceso, te asigna el condominio y la unidad, y te env\u00EDa las credenciales por correo.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31, "Iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](32, " \u00B7 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](33, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](34, "Recuperar contrase\u00F1a");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function SignupComponent_Conditional_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function SignupComponent_Conditional_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.notice());
  }
}
function SignupComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "ADMIN \u00B7 VERIFICACI\u00D3N");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "h1", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Revisa tu correo");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Si el correo puede registrarse, recibir\u00E1s un enlace para activar tu cuenta y tu organizaci\u00F3n. El enlace vence en 24 horas.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, "Si ya tienes cuenta, inicia sesi\u00F3n o recupera tu contrase\u00F1a.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](8, SignupComponent_Conditional_5_Conditional_8_Template, 2, 1, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](9, SignupComponent_Conditional_5_Conditional_9_Template, 2, 1, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupComponent_Conditional_5_Template_button_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.resend());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Reenviar enlace");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "Ir a iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Recuperar contrase\u00F1a");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx_r1.error() ? 8 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx_r1.notice() ? 9 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx_r1.busy());
  }
}
function SignupComponent_Conditional_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function SignupComponent_Conditional_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "form", 22, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function SignupComponent_Conditional_6_Conditional_7_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const accountForm_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.next(accountForm_r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "label", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Nombre");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "input", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_7_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.name, $event) || (ctx_r1.form.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "label", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Apellido");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "input", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_7_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.lastname, $event) || (ctx_r1.form.lastname = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "label", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "Correo electr\u00F3nico");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "input", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_7_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.email, $event) || (ctx_r1.form.email = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "label", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "Tel\u00E9fono");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "input", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_7_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.phone, $event) || (ctx_r1.form.phone = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Entre 8 y 16 d\u00EDgitos; puedes incluir el prefijo +.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Contrase\u00F1a");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_7_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.password, $event) || (ctx_r1.form.password = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20, "Entre 12 y 128 caracteres.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "div", 33)(22, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupComponent_Conditional_6_Conditional_7_Template_button_click_22_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.step.set("choice"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](23, "Volver");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](25, "Continuar \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const accountForm_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.lastname);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", accountForm_r5.invalid);
  }
}
function SignupComponent_Conditional_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "form", 22, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function SignupComponent_Conditional_6_Conditional_8_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const organizationForm_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.submit(organizationForm_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "label", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Nombre de la organizaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.company, $event) || (ctx_r1.form.company = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "label", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Direcci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "input", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.street_1, $event) || (ctx_r1.form.street_1 = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "Ciudad");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "input", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.city, $event) || (ctx_r1.form.city = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "label", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "Provincia");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "input", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.state, $event) || (ctx_r1.form.state = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "label", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Pa\u00EDs");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.country, $event) || (ctx_r1.form.country = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "label", 46)(18, "input", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_6_Conditional_8_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayBindingSet"](ctx_r1.form.terms, $event) || (ctx_r1.form.terms = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, "Acepto los t\u00E9rminos y condiciones de la plataforma.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "p", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](21, "Al verificar tu correo, crearemos tu organizaci\u00F3n y ser\u00E1s su administrador principal.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "div", 33)(23, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupComponent_Conditional_6_Conditional_8_Template_button_click_23_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.step.set("account"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24, "Volver");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const organizationForm_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.company);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.street_1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.city);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.state);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.country);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.terms);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", organizationForm_r7.invalid || !ctx_r1.form.terms || ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.busy() ? "Enviando\u2026" : "Crear cuenta ADMIN");
  }
}
function SignupComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "h1", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](6, SignupComponent_Conditional_6_Conditional_6_Template, 2, 1, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](7, SignupComponent_Conditional_6_Conditional_7_Template, 26, 6, "form", 21)(8, SignupComponent_Conditional_6_Conditional_8_Template, 27, 9, "form", 21);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("ADMIN \u00B7 PASO ", ctx_r1.step() === "account" ? "1" : "2", " DE 2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.step() === "account" ? "Crea tu acceso" : "Tu organizaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.step() === "account" ? "Esta cuenta te permite administrar condominios dentro de tu propia organizaci\u00F3n." : "Puede ser una empresa administradora o la administraci\u00F3n de tu condominio.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx_r1.error() ? 6 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx_r1.step() === "account" ? 7 : 8);
  }
}
class SignupComponent {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient);
    this.step = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('choice', ...(ngDevMode ? [{
      debugName: "step"
    }] : /* istanbul ignore next */[]));
    this.busy = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "busy"
    }] : /* istanbul ignore next */[]));
    this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "error"
    }] : /* istanbul ignore next */[]));
    this.notice = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "notice"
    }] : /* istanbul ignore next */[]));
    this.form = {
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      company: '',
      street_1: '',
      city: '',
      state: '',
      country: 'República Dominicana',
      terms: false
    };
  }
  next(form) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.step.set('organization');
  }
  resend() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_5__.global.url}auth/admin/resend-verification`, {
      email: this.form.email
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.busy.set(false))).subscribe({
      next: () => this.notice.set('Si tu cuenta sigue pendiente, recibirás un nuevo enlace. Revisa también el correo no deseado.'),
      error: () => this.error.set('No pudimos reenviar el enlace. Intenta nuevamente.')
    });
  }
  submit(form) {
    if (form.invalid || !this.form.terms || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_5__.global.url}auth/admin/register`, this.form).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.busy.set(false))).subscribe({
      next: () => {
        this.form.password = '';
        this.step.set('sent');
      },
      error: err => this.error.set(err.error?.error?.message || err.error?.message || 'No pudimos crear tu cuenta. Intenta nuevamente.')
    });
  }
  static {
    this.ɵfac = function SignupComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SignupComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: SignupComponent,
      selectors: [["app-signup"]],
      decls: 11,
      vars: 1,
      consts: [["accountForm", "ngForm"], ["organizationForm", "ngForm"], [1, "signup-page"], ["aria-labelledby", "signup-title", 1, "signup-panel"], ["routerLink", "/auth/login", 1, "brand"], ["routerLink", "/auth/login"], [1, "eyebrow"], ["id", "signup-title"], [1, "intro"], [1, "choices"], ["type", "button", 1, "choice", 3, "click"], [1, "tag"], [1, "choice-action"], ["routerLink", "/auth/iot-register", 1, "choice"], [1, "tag", "personal"], ["routerLink", "/auth/forgot-password"], ["role", "status"], ["role", "alert", 1, "error"], ["type", "button", 1, "secondary", 3, "click", "disabled"], ["routerLink", "/auth/login", 1, "primary"], ["routerLink", "/auth/forgot-password", 1, "secondary"], [1, "signup-form"], [1, "signup-form", 3, "ngSubmit"], ["for", "name"], ["id", "name", "name", "name", "required", "", "maxlength", "100", "autocomplete", "given-name", 3, "ngModelChange", "ngModel"], ["for", "lastname"], ["id", "lastname", "name", "lastname", "required", "", "maxlength", "100", "autocomplete", "family-name", 3, "ngModelChange", "ngModel"], ["for", "email", 1, "wide"], ["id", "email", "type", "email", "name", "email", "email", "", "required", "", "maxlength", "254", "autocomplete", "email", 3, "ngModelChange", "ngModel"], ["for", "phone", 1, "wide"], ["id", "phone", "type", "tel", "name", "phone", "required", "", "pattern", "^\\+?[0-9]{8,16}$", "autocomplete", "tel", 3, "ngModelChange", "ngModel"], ["for", "password", 1, "wide"], ["id", "password", "type", "password", "name", "password", "required", "", "minlength", "12", "maxlength", "128", "autocomplete", "new-password", 3, "ngModelChange", "ngModel"], [1, "actions", "wide"], ["type", "button", 1, "secondary", 3, "click"], ["type", "submit", 1, "primary", 3, "disabled"], ["for", "company", 1, "wide"], ["id", "company", "name", "company", "required", "", "maxlength", "160", "autocomplete", "organization", 3, "ngModelChange", "ngModel"], ["for", "street", 1, "wide"], ["id", "street", "name", "street", "required", "", "maxlength", "200", "autocomplete", "street-address", 3, "ngModelChange", "ngModel"], ["for", "city"], ["id", "city", "name", "city", "required", "", "maxlength", "100", "autocomplete", "address-level2", 3, "ngModelChange", "ngModel"], ["for", "state"], ["id", "state", "name", "state", "required", "", "maxlength", "100", "autocomplete", "address-level1", 3, "ngModelChange", "ngModel"], ["for", "country", 1, "wide"], ["id", "country", "name", "country", "required", "", "maxlength", "100", "autocomplete", "country-name", 3, "ngModelChange", "ngModel"], ["for", "terms", 1, "terms", "wide"], ["id", "terms", "type", "checkbox", "name", "terms", "required", "", 3, "ngModelChange", "ngModel"], [1, "wide"]],
      template: function SignupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "main", 2)(1, "section", 3)(2, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Condominios App");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](4, SignupComponent_Conditional_4_Template, 35, 0)(5, SignupComponent_Conditional_5_Template, 16, 3)(6, SignupComponent_Conditional_6_Template, 9, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](8, "\u00BFYa tienes cuenta? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "a", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10, "Inicia sesi\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.step() === "choice" ? 4 : ctx.step() === "sent" ? 5 : 6);
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.CheckboxRequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgForm, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      styles: ["[_nghost-%COMP%] { display: block; color: var(--app-dark-text, #2f3437); font-family: 'Helvetica Neue', system-ui, sans-serif; }\n.signup-page[_ngcontent-%COMP%] { min-height: 100vh; background: var(--app-dark-warning-bg, #f7f6f3); padding: 56px 24px; }\n.signup-panel[_ngcontent-%COMP%] { max-width: 840px; margin: auto; padding: 44px; background: var(--app-dark-surface, #fff); border: 1px solid var(--app-dark-border, #eaeaea); border-radius: 12px; }\n.brand[_ngcontent-%COMP%] { color: var(--app-dark-text, #2f3437); font-weight: 600; text-decoration: none; }\n.eyebrow[_ngcontent-%COMP%] { margin-top: 40px; font-size: 11px; letter-spacing: .12em; color: var(--app-dark-muted, #787774); }\nh1[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: clamp(30px, 5vw, 42px); line-height: 1.15; letter-spacing: -.025em; margin: 16px 0; font-weight: 400; }\nh2[_ngcontent-%COMP%] { font-size: 20px; font-weight: 500; }\np[_ngcontent-%COMP%] { line-height: 1.65; }\n.intro[_ngcontent-%COMP%] { color: var(--app-dark-muted, #787774); max-width: 580px; margin-bottom: 32px; }\n.choices[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n.choice[_ngcontent-%COMP%] { display: block; text-align: left; padding: 28px; border: 1px solid var(--app-dark-border, #eaeaea); border-radius: 8px; color: inherit; background: var(--app-dark-surface, #fff); font: inherit; text-decoration: none; cursor: pointer; }\n.choice[_ngcontent-%COMP%]:hover { background: var(--app-dark-surface, #fbfbfa); border-color: var(--app-dark-border, #787774); }\n.choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: var(--app-dark-muted, #787774); min-height: 120px; }\n.tag[_ngcontent-%COMP%] { display: inline-block; padding: 5px 8px; font-size: 10px; letter-spacing: .08em; background: var(--app-dark-success-bg, #edf3ec); color: var(--app-dark-text, #346538); border-radius: 4px; }\n.personal[_ngcontent-%COMP%] { background: var(--app-dark-info-bg, #e1f3fe); color: var(--app-dark-accent, #1f6c9f); }\n.choice-action[_ngcontent-%COMP%] { font-size: 13px; font-weight: 600; }\naside[_ngcontent-%COMP%] { border-top: 1px solid var(--app-dark-border, #eaeaea); margin-top: 32px; padding-top: 24px; }\naside[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { font-size: 16px; }\na[_ngcontent-%COMP%] { color: inherit; text-underline-offset: 3px; }\n.signup-form[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }\nlabel[_ngcontent-%COMP%] { font-size: 14px; display: grid; gap: 8px; }\ninput[_ngcontent-%COMP%]:not([type=checkbox]) { width: 100%; border: 1px solid var(--app-dark-border, #eaeaea); padding: 12px; border-radius: 4px; color: inherit; font: inherit; background: var(--app-dark-surface, #fff); }\nsmall[_ngcontent-%COMP%] { color: var(--app-dark-muted, #787774); }\n.wide[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n.terms[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }\n.terms[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { margin-top: 4px; }\n.actions[_ngcontent-%COMP%] { display: flex; justify-content: space-between; gap: 12px; }\n.primary[_ngcontent-%COMP%] { display: inline-block; border: 1px solid var(--app-dark-border, #111); border-radius: 4px; padding: 12px 20px; background: #111; color: #fff; font: inherit; text-decoration: none; cursor: pointer; }\n.secondary[_ngcontent-%COMP%] { display: inline-block; border: none; padding: 12px; background: transparent; color: inherit; font: inherit; text-decoration: underline; cursor: pointer; }\nbutton[_ngcontent-%COMP%]:disabled { opacity: .5; cursor: default; }\n.error[_ngcontent-%COMP%] { padding: 12px; background: var(--app-dark-danger-bg, #fdebec); color: var(--app-dark-danger-text, #9f2f2d); border-radius: 4px; }\nfooter[_ngcontent-%COMP%] { margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--app-dark-border, #eaeaea); font-size: 13px; color: var(--app-dark-muted, #787774); }\n[_ngcontent-%COMP%]:is(button,a,input):focus-visible { outline: 2px solid var(--app-dark-border, #346538); outline-offset: 4px; }\n@media(max-width: 640px) { .signup-page[_ngcontent-%COMP%] { padding: 20px 12px; } .signup-panel[_ngcontent-%COMP%] { padding: 24px; } .choices[_ngcontent-%COMP%], .signup-form[_ngcontent-%COMP%] { grid-template-columns: 1fr; } .choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { min-height: 0; } }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVEsY0FBYyxFQUFFLG9DQUFvQyxFQUFFLG9EQUFvRCxFQUFFO0FBQ3BILGVBQWUsaUJBQWlCLEVBQUUsK0NBQStDLEVBQUUsa0JBQWtCLEVBQUU7QUFDdkcsZ0JBQWdCLGdCQUFnQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUseUNBQXlDLEVBQUUsaURBQWlELEVBQUUsbUJBQW1CLEVBQUU7QUFDbEwsU0FBUyxvQ0FBb0MsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRTtBQUN4RixXQUFXLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxxQ0FBcUMsRUFBRTtBQUM1RyxLQUFLLDJCQUEyQixFQUFFLGlDQUFpQyxFQUFFLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRTtBQUNuSixLQUFLLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUN4QyxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZCLFNBQVMscUNBQXFDLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUU7QUFDdkYsV0FBVyxhQUFhLEVBQUUsOEJBQThCLEVBQUUsU0FBUyxFQUFFO0FBQ3JFLFVBQVUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxpREFBaUQsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUseUNBQXlDLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRTtBQUNwUCxnQkFBZ0IsNENBQTRDLEVBQUUsNkNBQTZDLEVBQUU7QUFDN0csWUFBWSxxQ0FBcUMsRUFBRSxpQkFBaUIsRUFBRTtBQUN0RSxPQUFPLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSwrQ0FBK0MsRUFBRSxvQ0FBb0MsRUFBRSxrQkFBa0IsRUFBRTtBQUNuTSxZQUFZLDRDQUE0QyxFQUFFLHNDQUFzQyxFQUFFO0FBQ2xHLGlCQUFpQixlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDcEQsUUFBUSxxREFBcUQsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRTtBQUNwRyxXQUFXLGVBQWUsRUFBRTtBQUM1QixJQUFJLGNBQWMsRUFBRSwwQkFBMEIsRUFBRTtBQUNoRCxlQUFlLGFBQWEsRUFBRSw4QkFBOEIsRUFBRSxTQUFTLEVBQUU7QUFDekUsUUFBUSxlQUFlLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTtBQUNsRCw2QkFBNkIsV0FBVyxFQUFFLGlEQUFpRCxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLHlDQUF5QyxFQUFFO0FBQzFNLFFBQVEscUNBQXFDLEVBQUU7QUFDL0MsUUFBUSxtQkFBbUIsRUFBRTtBQUM3QixTQUFTLGFBQWEsRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7QUFDOUUsZUFBZSxlQUFlLEVBQUU7QUFDaEMsV0FBVyxhQUFhLEVBQUUsOEJBQThCLEVBQUUsU0FBUyxFQUFFO0FBQ3JFLFdBQVcscUJBQXFCLEVBQUUsOENBQThDLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUU7QUFDaE4sYUFBYSxxQkFBcUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsMEJBQTBCLEVBQUUsZUFBZSxFQUFFO0FBQ3RLLGtCQUFrQixXQUFXLEVBQUUsZUFBZSxFQUFFO0FBQ2hELFNBQVMsYUFBYSxFQUFFLDhDQUE4QyxFQUFFLDJDQUEyQyxFQUFFLGtCQUFrQixFQUFFO0FBQ3pJLFNBQVMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUscURBQXFELEVBQUUsZUFBZSxFQUFFLHFDQUFxQyxFQUFFO0FBQzdKLG9DQUFvQyxrREFBa0QsRUFBRSxtQkFBbUIsRUFBRTtBQUM3RywyQkFBMkIsZUFBZSxrQkFBa0IsRUFBRSxFQUFFLGdCQUFnQixhQUFhLEVBQUUsRUFBRSx5QkFBeUIsMEJBQTBCLEVBQUUsRUFBRSxZQUFZLGFBQWEsRUFBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3QgeyBkaXNwbGF5OiBibG9jazsgY29sb3I6IHZhcigtLWFwcC1kYXJrLXRleHQsICMyZjM0MzcpOyBmb250LWZhbWlseTogJ0hlbHZldGljYSBOZXVlJywgc3lzdGVtLXVpLCBzYW5zLXNlcmlmOyB9XG4uc2lnbnVwLXBhZ2UgeyBtaW4taGVpZ2h0OiAxMDB2aDsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstd2FybmluZy1iZywgI2Y3ZjZmMyk7IHBhZGRpbmc6IDU2cHggMjRweDsgfVxuLnNpZ251cC1wYW5lbCB7IG1heC13aWR0aDogODQwcHg7IG1hcmdpbjogYXV0bzsgcGFkZGluZzogNDRweDsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstc3VyZmFjZSwgI2ZmZik7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2VhZWFlYSk7IGJvcmRlci1yYWRpdXM6IDEycHg7IH1cbi5icmFuZCB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay10ZXh0LCAjMmYzNDM3KTsgZm9udC13ZWlnaHQ6IDYwMDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XG4uZXllYnJvdyB7IG1hcmdpbi10b3A6IDQwcHg7IGZvbnQtc2l6ZTogMTFweDsgbGV0dGVyLXNwYWNpbmc6IC4xMmVtOyBjb2xvcjogdmFyKC0tYXBwLWRhcmstbXV0ZWQsICM3ODc3NzQpOyB9XG5oMSB7IGZvbnQtZmFtaWx5OiBHZW9yZ2lhLCBzZXJpZjsgZm9udC1zaXplOiBjbGFtcCgzMHB4LCA1dncsIDQycHgpOyBsaW5lLWhlaWdodDogMS4xNTsgbGV0dGVyLXNwYWNpbmc6IC0uMDI1ZW07IG1hcmdpbjogMTZweCAwOyBmb250LXdlaWdodDogNDAwOyB9XG5oMiB7IGZvbnQtc2l6ZTogMjBweDsgZm9udC13ZWlnaHQ6IDUwMDsgfVxucCB7IGxpbmUtaGVpZ2h0OiAxLjY1OyB9XG4uaW50cm8geyBjb2xvcjogdmFyKC0tYXBwLWRhcmstbXV0ZWQsICM3ODc3NzQpOyBtYXgtd2lkdGg6IDU4MHB4OyBtYXJnaW4tYm90dG9tOiAzMnB4OyB9XG4uY2hvaWNlcyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjsgZ2FwOiAxNnB4OyB9XG4uY2hvaWNlIHsgZGlzcGxheTogYmxvY2s7IHRleHQtYWxpZ246IGxlZnQ7IHBhZGRpbmc6IDI4cHg7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2VhZWFlYSk7IGJvcmRlci1yYWRpdXM6IDhweDsgY29sb3I6IGluaGVyaXQ7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmZmYpOyBmb250OiBpbmhlcml0OyB0ZXh0LWRlY29yYXRpb246IG5vbmU7IGN1cnNvcjogcG9pbnRlcjsgfVxuLmNob2ljZTpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmYmZiZmEpOyBib3JkZXItY29sb3I6IHZhcigtLWFwcC1kYXJrLWJvcmRlciwgIzc4Nzc3NCk7IH1cbi5jaG9pY2UgcCB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1tdXRlZCwgIzc4Nzc3NCk7IG1pbi1oZWlnaHQ6IDEyMHB4OyB9XG4udGFnIHsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiA1cHggOHB4OyBmb250LXNpemU6IDEwcHg7IGxldHRlci1zcGFjaW5nOiAuMDhlbTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstc3VjY2Vzcy1iZywgI2VkZjNlYyk7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay10ZXh0LCAjMzQ2NTM4KTsgYm9yZGVyLXJhZGl1czogNHB4OyB9XG4ucGVyc29uYWwgeyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZTFmM2ZlKTsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWFjY2VudCwgIzFmNmM5Zik7IH1cbi5jaG9pY2UtYWN0aW9uIHsgZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogNjAwOyB9XG5hc2lkZSB7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICNlYWVhZWEpOyBtYXJnaW4tdG9wOiAzMnB4OyBwYWRkaW5nLXRvcDogMjRweDsgfVxuYXNpZGUgaDIgeyBmb250LXNpemU6IDE2cHg7IH1cbmEgeyBjb2xvcjogaW5oZXJpdDsgdGV4dC11bmRlcmxpbmUtb2Zmc2V0OiAzcHg7IH1cbi5zaWdudXAtZm9ybSB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjsgZ2FwOiAyMHB4OyB9XG5sYWJlbCB7IGZvbnQtc2l6ZTogMTRweDsgZGlzcGxheTogZ3JpZDsgZ2FwOiA4cHg7IH1cbmlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pIHsgd2lkdGg6IDEwMCU7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2VhZWFlYSk7IHBhZGRpbmc6IDEycHg7IGJvcmRlci1yYWRpdXM6IDRweDsgY29sb3I6IGluaGVyaXQ7IGZvbnQ6IGluaGVyaXQ7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmZmYpOyB9XG5zbWFsbCB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1tdXRlZCwgIzc4Nzc3NCk7IH1cbi53aWRlIHsgZ3JpZC1jb2x1bW46IDEgLyAtMTsgfVxuLnRlcm1zIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IGdhcDogMTBweDsgbGluZS1oZWlnaHQ6IDEuNTsgfVxuLnRlcm1zIGlucHV0IHsgbWFyZ2luLXRvcDogNHB4OyB9XG4uYWN0aW9ucyB7IGRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgZ2FwOiAxMnB4OyB9XG4ucHJpbWFyeSB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBwLWRhcmstYm9yZGVyLCAjMTExKTsgYm9yZGVyLXJhZGl1czogNHB4OyBwYWRkaW5nOiAxMnB4IDIwcHg7IGJhY2tncm91bmQ6ICMxMTE7IGNvbG9yOiAjZmZmOyBmb250OiBpbmhlcml0OyB0ZXh0LWRlY29yYXRpb246IG5vbmU7IGN1cnNvcjogcG9pbnRlcjsgfVxuLnNlY29uZGFyeSB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYm9yZGVyOiBub25lOyBwYWRkaW5nOiAxMnB4OyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgY29sb3I6IGluaGVyaXQ7IGZvbnQ6IGluaGVyaXQ7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBjdXJzb3I6IHBvaW50ZXI7IH1cbmJ1dHRvbjpkaXNhYmxlZCB7IG9wYWNpdHk6IC41OyBjdXJzb3I6IGRlZmF1bHQ7IH1cbi5lcnJvciB7IHBhZGRpbmc6IDEycHg7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWRhbmdlci1iZywgI2ZkZWJlYyk7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1kYW5nZXItdGV4dCwgIzlmMmYyZCk7IGJvcmRlci1yYWRpdXM6IDRweDsgfVxuZm9vdGVyIHsgbWFyZ2luLXRvcDogMzJweDsgcGFkZGluZy10b3A6IDIwcHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICNlYWVhZWEpOyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1tdXRlZCwgIzc4Nzc3NCk7IH1cbjppcyhidXR0b24sYSxpbnB1dCk6Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICMzNDY1MzgpOyBvdXRsaW5lLW9mZnNldDogNHB4OyB9XG5AbWVkaWEobWF4LXdpZHRoOiA2NDBweCkgeyAuc2lnbnVwLXBhZ2UgeyBwYWRkaW5nOiAyMHB4IDEycHg7IH0gLnNpZ251cC1wYW5lbCB7IHBhZGRpbmc6IDI0cHg7IH0gLmNob2ljZXMsIC5zaWdudXAtZm9ybSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9IC5jaG9pY2UgcCB7IG1pbi1oZWlnaHQ6IDA7IH0gfVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_signup_signup_component_ts.js.map