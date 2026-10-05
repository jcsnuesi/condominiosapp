"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_organization-onboarding_organization-onboarding_component_ts"],{

/***/ 13771
/*!**********************************************************************************************!*\
  !*** ./src/app/demo/components/organization-onboarding/organization-onboarding.component.ts ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrganizationOnboardingComponent: () => (/* binding */ OrganizationOnboardingComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 40311);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 98299);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_tag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/tag */ 60905);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../service/global.service */ 53796);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 58440);














const _c0 = a0 => ["/home", a0];
const _c1 = () => ["/see-property"];
function OrganizationOnboardingComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "p", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r0.error());
  }
}
function OrganizationOnboardingComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "p-progressSpinner", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "Cargando\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
}
function OrganizationOnboardingComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "ol")(1, "li")(2, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "01");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "div", 9)(5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6, "Crea tu primer condominio");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, "Registra su direcci\u00F3n y los datos de administraci\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](9, "p-tag", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](10, "p-button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "li")(12, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](13, "02");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "div", 9)(15, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](16, "Registra sus unidades");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](17, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](18, " Configura los apartamentos o viviendas que pertenecen al condominio. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](19, "p-tag", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](20, "p-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](21, "li")(22, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](23, "03");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](24, "div", 9)(25, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](26, "Crea el acceso de tus propietarios");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](27, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](28, " Asigna el condominio y la unidad a cada propietario. Recibir\u00E1 sus credenciales por correo. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](29, "p-tag", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](30, "p-button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](31, "div", 14)(32, "p-button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("onClick", function OrganizationOnboardingComponent_Conditional_11_Template_p_button_onClick_32_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](33, "p-button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("onClick", function OrganizationOnboardingComponent_Conditional_11_Template_p_button_onClick_33_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.finish());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](34, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](35, " Puedes retomar esta gu\u00EDa desde \u201CPrimeros pasos\u201D en el men\u00FA. Tu progreso se guarda al crear cada registro. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const setup_r3 = ctx;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.condominiumCount ? "success" : "secondary")("value", setup_r3.condominiumCount ? setup_r3.condominiumCount + " registrados" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.unitCount ? "success" : "secondary")("value", setup_r3.unitCount ? setup_r3.unitCount + " registradas" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](14, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](16, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.ownerCount ? "success" : "secondary")("value", setup_r3.ownerCount ? setup_r3.ownerCount + " registrados" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](17, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](19, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("disabled", ctx_r0.loading());
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r0.loading())("label", setup_r3.condominiumCount && setup_r3.unitCount && setup_r3.ownerCount ? "Finalizar configuraci\u00F3n" : "Continuar y configurar despu\u00E9s");
  }
}
function OrganizationOnboardingComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "p-button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("onClick", function OrganizationOnboardingComponent_Conditional_12_Template_p_button_onClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
class OrganizationOnboardingComponent {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_10__.UserService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_11__.AccessContextService);
    this.status = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(null, ...(ngDevMode ? [{
      debugName: "status"
    }] : /* istanbul ignore next */[]));
    this.loading = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "loading"
    }] : /* istanbul ignore next */[]));
    this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "error"
    }] : /* istanbul ignore next */[]));
    this.refresh();
  }
  refresh() {
    this.loading.set(true);
    this.error.set('');
    this.http.get(`${_service_global_service__WEBPACK_IMPORTED_MODULE_9__.global.url}organization/onboarding`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.loading.set(false))).subscribe({
      next: response => this.status.set(response.data.message),
      error: () => this.error.set('No pudimos cargar tu progreso. Intenta nuevamente.')
    });
  }
  finish() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_9__.global.url}organization/onboarding/complete`, {}).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.switchMap)(() => this.access.refresh()), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.loading.set(false))).subscribe({
      next: () => this.router.navigate(['/start', this.user.getIdentity()._id]),
      error: _error => this.error.set('No pudimos guardar tu progreso. Intenta nuevamente.')
    });
  }
  static {
    this.ɵfac = function OrganizationOnboardingComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OrganizationOnboardingComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({
      type: OrganizationOnboardingComponent,
      selectors: [["app-organization-onboarding"]],
      decls: 13,
      vars: 5,
      consts: [["aria-labelledby", "setup-title", 1, "card", "app-page-card", "onboarding"], [1, "app-page-header"], [1, "app-page-kicker"], ["id", "setup-title"], ["role", "alert", 1, "error"], ["role", "status", 1, "onboarding-loading"], ["label", "Reintentar", "icon", "pi pi-refresh", "styleClass", "onboarding-primary-action"], ["strokeWidth", "5", "ariaLabel", "Cargando progreso"], [1, "number"], [1, "step-content"], [3, "severity", "value"], ["routerLink", "/create-property", "label", "Crear condominio", "icon", "pi pi-plus", "styleClass", "onboarding-primary-action"], ["label", "Gestionar unidades", "icon", "pi pi-arrow-right", "iconPos", "right", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "outlined", "routerLink"], ["label", "Gestionar propietarios", "icon", "pi pi-arrow-right", "iconPos", "right", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "outlined", "routerLink"], [1, "actions"], ["label", "Actualizar progreso", "icon", "pi pi-refresh", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "onClick", "outlined", "disabled"], ["styleClass", "onboarding-primary-action", "icon", "pi pi-check", 3, "onClick", "disabled", "label"], [1, "hint"], ["label", "Reintentar", "icon", "pi pi-refresh", "styleClass", "onboarding-primary-action", 3, "onClick"]],
      template: function OrganizationOnboardingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "section", 0)(1, "div", 1)(2, "div")(3, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4, "PRIMEROS PASOS \u00B7 ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, " Tu cuenta est\u00E1 lista. Sigue estos pasos para comenzar a administrar tus condominios. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditionalCreate"](9, OrganizationOnboardingComponent_Conditional_9_Template, 2, 1, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditionalCreate"](10, OrganizationOnboardingComponent_Conditional_10_Template, 4, 0, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditionalCreate"](11, OrganizationOnboardingComponent_Conditional_11_Template, 36, 20)(12, OrganizationOnboardingComponent_Conditional_12_Template, 1, 0, "p-button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          let tmp_1_0;
          let tmp_4_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵattribute"]("aria-busy", ctx.loading());
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" Configura ", ((tmp_1_0 = ctx.status()) == null ? null : tmp_1_0.name) || "tu organizaci\u00F3n", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"](ctx.error() ? 9 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"](ctx.loading() ? 10 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"]((tmp_4_0 = ctx.status()) ? 11 : !ctx.loading() ? 12 : -1, tmp_4_0);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, primeng_button__WEBPACK_IMPORTED_MODULE_6__.ButtonModule, primeng_button__WEBPACK_IMPORTED_MODULE_6__.Button, primeng_tag__WEBPACK_IMPORTED_MODULE_7__.TagModule, primeng_tag__WEBPACK_IMPORTED_MODULE_7__.Tag, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_8__.ProgressSpinnerModule, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_8__.ProgressSpinner],
      styles: ["[_nghost-%COMP%] {\n    display: block;\n    min-width: 0;\n    --onboarding-ink: #183153;\n    --onboarding-muted: #66758d;\n    --onboarding-line: #dce5ee;\n    --onboarding-primary: #176b87;\n}\n\n.onboarding[_ngcontent-%COMP%] {\n    color: var(--onboarding-ink);\n    border: 1px solid var(--onboarding-line);\n    border-radius: 18px;\n    background: #fff;\n    padding: 1.6rem;\n    box-shadow: none;\n}\n\n.app-page-header[_ngcontent-%COMP%] { align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }\n.app-page-kicker[_ngcontent-%COMP%] {\n    color: var(--onboarding-primary);\n    font-size: .72rem;\n    font-weight: 800;\n    letter-spacing: .1em;\n    text-transform: uppercase;\n}\nh1[_ngcontent-%COMP%] {\n    margin: .3rem 0 .4rem;\n    color: var(--onboarding-ink);\n    font-size: clamp(1.65rem, 3vw, 2.35rem);\n    line-height: 1.1;\n    letter-spacing: -.035em;\n    overflow-wrap: anywhere;\n}\nh2[_ngcontent-%COMP%] {\n    margin: 0;\n    color: var(--onboarding-ink);\n    font-size: 1.15rem;\n    font-weight: 700;\n    overflow-wrap: anywhere;\n}\np[_ngcontent-%COMP%] { color: var(--onboarding-muted); line-height: 1.5; }\n.app-page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; }\nol[_ngcontent-%COMP%] { display: grid; gap: 1rem; list-style: none; padding: 0; margin: 0 0 1.5rem; }\nli[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 3rem minmax(0, 1fr) auto;\n    align-items: center;\n    gap: .75rem;\n    padding: 1.15rem;\n    border: 1px solid var(--onboarding-line);\n    border-radius: 16px;\n    background: #fff;\n}\n.number[_ngcontent-%COMP%] {\n    display: grid;\n    place-items: center;\n    width: 3rem;\n    height: 3rem;\n    border: 1px solid #cddae6;\n    border-radius: 50%;\n    color: #105d76;\n    background: #e8f2f5;\n    font-size: .9rem;\n    font-weight: 700;\n}\n.step-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: .5rem 0 .75rem; font-size: .85rem; }\n[_nghost-%COMP%]     .onboarding .p-tag {\n    border-radius: 999px;\n    padding: .3rem .6rem;\n    font-size: .75rem;\n    font-weight: 750;\n}\n[_nghost-%COMP%]     .onboarding .p-tag-success { background: #e9f8f2; color: #08785d; }\n[_nghost-%COMP%]     .onboarding .p-tag-secondary { background: #f5f8fb; color: var(--onboarding-muted); }\n[_nghost-%COMP%]     .onboarding-primary-action, \n[_nghost-%COMP%]     .onboarding-secondary-action {\n    min-height: 44px;\n    border-radius: 10px;\n    box-shadow: none;\n}\n[_nghost-%COMP%]     .onboarding-primary-action {\n    background: var(--onboarding-primary);\n    border-color: var(--onboarding-primary);\n    color: #fff;\n    font-weight: 700;\n}\n[_nghost-%COMP%]     .onboarding-primary-action:not(:disabled):hover { background: #125b73; border-color: #125b73; }\n[_nghost-%COMP%]     .onboarding-secondary-action {\n    color: var(--onboarding-primary);\n    border-color: var(--onboarding-line);\n    background: #fff;\n    font-weight: 650;\n}\n[_nghost-%COMP%]     .onboarding-secondary-action:not(:disabled):hover { background: #f1f5f8; }\n[_nghost-%COMP%]     .onboarding .p-button:focus-visible { outline: 2px solid var(--onboarding-primary); outline-offset: 2px; }\n.actions[_ngcontent-%COMP%] {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: space-between;\n    gap: 1rem;\n    padding-top: 1rem;\n    border-top: 1px solid #edf1f5;\n}\n.hint[_ngcontent-%COMP%] { margin: 1rem 0 0; font-size: .8rem; }\n.error[_ngcontent-%COMP%] {\n    color: #b42318;\n    background: #fff8f7;\n    border: 1px solid #f0d1cc;\n    border-radius: 10px;\n    padding: .9rem 1rem;\n}\n.onboarding-loading[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: .75rem;\n    margin-bottom: 1rem;\n    color: var(--onboarding-muted);\n    font-size: .85rem;\n}\n[_nghost-%COMP%]     .onboarding-loading .p-progressspinner { width: 2rem; height: 2rem; }\n@media (max-width: 900px) {\n    li[_ngcontent-%COMP%] { grid-template-columns: 3rem minmax(0, 1fr); }\n    li[_ngcontent-%COMP%]    > p-button[_ngcontent-%COMP%] { grid-column: 2; }\n}\n@media (max-width: 680px) {\n    .onboarding[_ngcontent-%COMP%] { padding: 1rem; }\n    li[_ngcontent-%COMP%] { padding: .9rem; align-items: start; }\n    .actions[_ngcontent-%COMP%] { flex-direction: column; }\n    [_nghost-%COMP%]     .onboarding p-button, \n   [_nghost-%COMP%]     .onboarding .p-button { width: 100%; justify-content: center; }\n    [_nghost-%COMP%]     .onboarding .p-button-label { white-space: normal; }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxjQUFjO0lBQ2QsWUFBWTtJQUNaLHlCQUF5QjtJQUN6QiwyQkFBMkI7SUFDM0IsMEJBQTBCO0lBQzFCLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLDRCQUE0QjtJQUM1Qix3Q0FBd0M7SUFDeEMsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCOztBQUVBLG1CQUFtQixtQkFBbUIsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUU7QUFDN0U7SUFDSSxnQ0FBZ0M7SUFDaEMsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixvQkFBb0I7SUFDcEIseUJBQXlCO0FBQzdCO0FBQ0E7SUFDSSxxQkFBcUI7SUFDckIsNEJBQTRCO0lBQzVCLHVDQUF1QztJQUN2QyxnQkFBZ0I7SUFDaEIsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtBQUMzQjtBQUNBO0lBQ0ksU0FBUztJQUNULDRCQUE0QjtJQUM1QixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtBQUMzQjtBQUNBLElBQUksOEJBQThCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdEQscUJBQXFCLFNBQVMsRUFBRTtBQUNoQyxLQUFLLGFBQWEsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFO0FBQ2pGO0lBQ0ksYUFBYTtJQUNiLCtDQUErQztJQUMvQyxtQkFBbUI7SUFDbkIsV0FBVztJQUNYLGdCQUFnQjtJQUNoQix3Q0FBd0M7SUFDeEMsbUJBQW1CO0lBQ25CLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsWUFBWTtJQUNaLHlCQUF5QjtJQUN6QixrQkFBa0I7SUFDbEIsY0FBYztJQUNkLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0FBQ3BCO0FBQ0Esa0JBQWtCLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFO0FBQzdEO0lBQ0ksb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixpQkFBaUI7SUFDakIsZ0JBQWdCO0FBQ3BCO0FBQ0EsNkNBQTZDLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUNsRiwrQ0FBK0MsbUJBQW1CLEVBQUUsOEJBQThCLEVBQUU7QUFDcEc7O0lBRUksZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLHFDQUFxQztJQUNyQyx1Q0FBdUM7SUFDdkMsV0FBVztJQUNYLGdCQUFnQjtBQUNwQjtBQUNBLGtFQUFrRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRTtBQUM5RztJQUNJLGdDQUFnQztJQUNoQyxvQ0FBb0M7SUFDcEMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtBQUNwQjtBQUNBLG9FQUFvRSxtQkFBbUIsRUFBRTtBQUN6RixzREFBc0QsNENBQTRDLEVBQUUsbUJBQW1CLEVBQUU7QUFDekg7SUFDSSxhQUFhO0lBQ2IsZUFBZTtJQUNmLDhCQUE4QjtJQUM5QixTQUFTO0lBQ1QsaUJBQWlCO0lBQ2pCLDZCQUE2QjtBQUNqQztBQUNBLFFBQVEsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDNUM7SUFDSSxjQUFjO0lBQ2QsbUJBQW1CO0lBQ25CLHlCQUF5QjtJQUN6QixtQkFBbUI7SUFDbkIsbUJBQW1CO0FBQ3ZCO0FBQ0E7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxtQkFBbUI7SUFDbkIsOEJBQThCO0lBQzlCLGlCQUFpQjtBQUNyQjtBQUNBLHlEQUF5RCxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ3BGO0lBQ0ksS0FBSywwQ0FBMEMsRUFBRTtJQUNqRCxnQkFBZ0IsY0FBYyxFQUFFO0FBQ3BDO0FBQ0E7SUFDSSxjQUFjLGFBQWEsRUFBRTtJQUM3QixLQUFLLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtJQUN6QyxXQUFXLHNCQUFzQixFQUFFO0lBQ25DOzRDQUN3QyxXQUFXLEVBQUUsdUJBQXVCLEVBQUU7SUFDOUUsOENBQThDLG1CQUFtQixFQUFFO0FBQ3ZFIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1pbi13aWR0aDogMDtcbiAgICAtLW9uYm9hcmRpbmctaW5rOiAjMTgzMTUzO1xuICAgIC0tb25ib2FyZGluZy1tdXRlZDogIzY2NzU4ZDtcbiAgICAtLW9uYm9hcmRpbmctbGluZTogI2RjZTVlZTtcbiAgICAtLW9uYm9hcmRpbmctcHJpbWFyeTogIzE3NmI4Nztcbn1cblxuLm9uYm9hcmRpbmcge1xuICAgIGNvbG9yOiB2YXIoLS1vbmJvYXJkaW5nLWluayk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tb25ib2FyZGluZy1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgcGFkZGluZzogMS42cmVtO1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG59XG5cbi5hcHAtcGFnZS1oZWFkZXIgeyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEuMjVyZW07IG1hcmdpbi1ib3R0b206IDEuNXJlbTsgfVxuLmFwcC1wYWdlLWtpY2tlciB7XG4gICAgY29sb3I6IHZhcigtLW9uYm9hcmRpbmctcHJpbWFyeSk7XG4gICAgZm9udC1zaXplOiAuNzJyZW07XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLjFlbTtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuaDEge1xuICAgIG1hcmdpbjogLjNyZW0gMCAuNHJlbTtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1pbmspO1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS42NXJlbSwgM3Z3LCAyLjM1cmVtKTtcbiAgICBsaW5lLWhlaWdodDogMS4xO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAzNWVtO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxuaDIge1xuICAgIG1hcmdpbjogMDtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1pbmspO1xuICAgIGZvbnQtc2l6ZTogMS4xNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxucCB7IGNvbG9yOiB2YXIoLS1vbmJvYXJkaW5nLW11dGVkKTsgbGluZS1oZWlnaHQ6IDEuNTsgfVxuLmFwcC1wYWdlLWhlYWRlciBwIHsgbWFyZ2luOiAwOyB9XG5vbCB7IGRpc3BsYXk6IGdyaWQ7IGdhcDogMXJlbTsgbGlzdC1zdHlsZTogbm9uZTsgcGFkZGluZzogMDsgbWFyZ2luOiAwIDAgMS41cmVtOyB9XG5saSB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDNyZW0gbWlubWF4KDAsIDFmcikgYXV0bztcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogLjc1cmVtO1xuICAgIHBhZGRpbmc6IDEuMTVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tb25ib2FyZGluZy1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG59XG4ubnVtYmVyIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gICAgd2lkdGg6IDNyZW07XG4gICAgaGVpZ2h0OiAzcmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNjZGRhZTY7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGNvbG9yOiAjMTA1ZDc2O1xuICAgIGJhY2tncm91bmQ6ICNlOGYyZjU7XG4gICAgZm9udC1zaXplOiAuOXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuLnN0ZXAtY29udGVudCBwIHsgbWFyZ2luOiAuNXJlbSAwIC43NXJlbTsgZm9udC1zaXplOiAuODVyZW07IH1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyAucC10YWcge1xuICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgIHBhZGRpbmc6IC4zcmVtIC42cmVtO1xuICAgIGZvbnQtc2l6ZTogLjc1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA3NTA7XG59XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmcgLnAtdGFnLXN1Y2Nlc3MgeyBiYWNrZ3JvdW5kOiAjZTlmOGYyOyBjb2xvcjogIzA4Nzg1ZDsgfVxuOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nIC5wLXRhZy1zZWNvbmRhcnkgeyBiYWNrZ3JvdW5kOiAjZjVmOGZiOyBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1tdXRlZCk7IH1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1wcmltYXJ5LWFjdGlvbixcbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1zZWNvbmRhcnktYWN0aW9uIHtcbiAgICBtaW4taGVpZ2h0OiA0NHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbn1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1wcmltYXJ5LWFjdGlvbiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tb25ib2FyZGluZy1wcmltYXJ5KTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLW9uYm9hcmRpbmctcHJpbWFyeSk7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1wcmltYXJ5LWFjdGlvbjpub3QoOmRpc2FibGVkKTpob3ZlciB7IGJhY2tncm91bmQ6ICMxMjViNzM7IGJvcmRlci1jb2xvcjogIzEyNWI3MzsgfVxuOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nLXNlY29uZGFyeS1hY3Rpb24ge1xuICAgIGNvbG9yOiB2YXIoLS1vbmJvYXJkaW5nLXByaW1hcnkpO1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tb25ib2FyZGluZy1saW5lKTtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIGZvbnQtd2VpZ2h0OiA2NTA7XG59XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctc2Vjb25kYXJ5LWFjdGlvbjpub3QoOmRpc2FibGVkKTpob3ZlciB7IGJhY2tncm91bmQ6ICNmMWY1Zjg7IH1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyAucC1idXR0b246Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1vbmJvYXJkaW5nLXByaW1hcnkpOyBvdXRsaW5lLW9mZnNldDogMnB4OyB9XG4uYWN0aW9ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGdhcDogMXJlbTtcbiAgICBwYWRkaW5nLXRvcDogMXJlbTtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2VkZjFmNTtcbn1cbi5oaW50IHsgbWFyZ2luOiAxcmVtIDAgMDsgZm9udC1zaXplOiAuOHJlbTsgfVxuLmVycm9yIHtcbiAgICBjb2xvcjogI2I0MjMxODtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmOGY3O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNmMGQxY2M7XG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICBwYWRkaW5nOiAuOXJlbSAxcmVtO1xufVxuLm9uYm9hcmRpbmctbG9hZGluZyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogLjc1cmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgY29sb3I6IHZhcigtLW9uYm9hcmRpbmctbXV0ZWQpO1xuICAgIGZvbnQtc2l6ZTogLjg1cmVtO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nLWxvYWRpbmcgLnAtcHJvZ3Jlc3NzcGlubmVyIHsgd2lkdGg6IDJyZW07IGhlaWdodDogMnJlbTsgfVxuQG1lZGlhIChtYXgtd2lkdGg6IDkwMHB4KSB7XG4gICAgbGkgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDNyZW0gbWlubWF4KDAsIDFmcik7IH1cbiAgICBsaSA+IHAtYnV0dG9uIHsgZ3JpZC1jb2x1bW46IDI7IH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA2ODBweCkge1xuICAgIC5vbmJvYXJkaW5nIHsgcGFkZGluZzogMXJlbTsgfVxuICAgIGxpIHsgcGFkZGluZzogLjlyZW07IGFsaWduLWl0ZW1zOiBzdGFydDsgfVxuICAgIC5hY3Rpb25zIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxuICAgIDpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyBwLWJ1dHRvbixcbiAgICA6aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmcgLnAtYnV0dG9uIHsgd2lkdGg6IDEwMCU7IGp1c3RpZnktY29udGVudDogY2VudGVyOyB9XG4gICAgOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nIC5wLWJ1dHRvbi1sYWJlbCB7IHdoaXRlLXNwYWNlOiBub3JtYWw7IH1cbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_organization-onboarding_organization-onboarding_component_ts.js.map