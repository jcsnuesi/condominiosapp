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
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/global.service */ 53796);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 58440);








const _c0 = a0 => ["/home", a0];
const _c1 = () => ["/see-property"];
function OrganizationOnboardingComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r0.error());
  }
}
function OrganizationOnboardingComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Cargando\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function OrganizationOnboardingComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ol")(1, "li")(2, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3, "01");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div")(5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, "Crea tu primer condominio");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8, "Registra su direcci\u00F3n y los datos de administraci\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "a", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12, "Crear condominio \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "li")(14, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15, "02");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div")(17, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18, "Registra sus unidades");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, "Configura los apartamentos o viviendas que pertenecen al condominio.");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "a", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24, "Gestionar unidades \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](25, "li")(26, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](27, "03");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "div")(29, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30, "Crea el acceso de tus propietarios");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](32, "Asigna el condominio y la unidad a cada propietario. Recibir\u00E1 sus credenciales por correo.");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](35, "a", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](36, "Gestionar propietarios \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](37, "div", 10)(38, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function OrganizationOnboardingComponent_Conditional_9_Template_button_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](39, "Actualizar progreso");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function OrganizationOnboardingComponent_Conditional_9_Template_button_click_40_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.finish());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](42, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](43, "Puedes retomar esta gu\u00EDa desde \u201CPrimeros pasos\u201D en el men\u00FA. Tu progreso se guarda al crear cada registro.");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const setup_r3 = ctx;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](setup_r3.condominiumCount ? setup_r3.condominiumCount + " registrados" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](setup_r3.unitCount ? setup_r3.unitCount + " registradas" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](8, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](10, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](setup_r3.ownerCount ? setup_r3.ownerCount + " registrados" : "Pendiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](11, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](13, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r0.loading());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r0.loading());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](setup_r3.condominiumCount && setup_r3.unitCount && setup_r3.ownerCount ? "Finalizar configuraci\u00F3n" : "Continuar y configurar despu\u00E9s");
  }
}
function OrganizationOnboardingComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function OrganizationOnboardingComponent_Conditional_10_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Reintentar");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
class OrganizationOnboardingComponent {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_7__.UserService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_8__.AccessContextService);
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
    this.http.get(`${_service_global_service__WEBPACK_IMPORTED_MODULE_6__.global.url}organization/onboarding`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.loading.set(false))).subscribe({
      next: response => this.status.set(response.data.message),
      error: () => this.error.set('No pudimos cargar tu progreso. Intenta nuevamente.')
    });
  }
  finish() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_6__.global.url}organization/onboarding/complete`, {}).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.switchMap)(() => this.access.refresh()), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.loading.set(false))).subscribe({
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
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: OrganizationOnboardingComponent,
      selectors: [["app-organization-onboarding"]],
      decls: 11,
      vars: 4,
      consts: [["aria-labelledby", "setup-title", 1, "onboarding"], [1, "eyebrow"], ["id", "setup-title"], ["role", "alert", 1, "error"], ["role", "status"], ["type", "button"], [1, "number"], [1, "status"], ["routerLink", "/create-property"], [3, "routerLink"], [1, "actions"], ["type", "button", 3, "click", "disabled"], ["type", "button", 1, "primary", 3, "click", "disabled"], [1, "hint"], ["type", "button", 3, "click"]],
      template: function OrganizationOnboardingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "section", 0)(1, "p", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "PRIMEROS PASOS \u00B7 ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, "Tu cuenta est\u00E1 lista. Sigue estos pasos para comenzar a administrar tus condominios.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](7, OrganizationOnboardingComponent_Conditional_7_Template, 2, 1, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](8, OrganizationOnboardingComponent_Conditional_8_Template, 2, 0, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](9, OrganizationOnboardingComponent_Conditional_9_Template, 44, 14)(10, OrganizationOnboardingComponent_Conditional_10_Template, 2, 0, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          let tmp_0_0;
          let tmp_3_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("Configura ", ((tmp_0_0 = ctx.status()) == null ? null : tmp_0_0.name) || "tu organizaci\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](ctx.error() ? 7 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](ctx.loading() ? 8 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"]((tmp_3_0 = ctx.status()) ? 9 : !ctx.loading() ? 10 : -1, tmp_3_0);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink],
      styles: ["[_nghost-%COMP%] { display: block; color: #2f3437; }\n.onboarding[_ngcontent-%COMP%] { max-width: 960px; margin: 32px auto; padding: 40px; background: #fff; border: 1px solid #eaeaea; border-radius: 12px; }\n.eyebrow[_ngcontent-%COMP%] { color: #787774; font-size: 11px; letter-spacing: .1em; }\nh1[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 40px); font-weight: 400; letter-spacing: -.02em; }\nh2[_ngcontent-%COMP%] { font-size: 18px; font-weight: 500; margin-top: 0; }\np[_ngcontent-%COMP%] { line-height: 1.6; color: #787774; }\nol[_ngcontent-%COMP%] { list-style: none; padding: 0; margin: 32px 0; }\nli[_ngcontent-%COMP%] { border-top: 1px solid #eaeaea; padding: 24px 0; display: grid; grid-template-columns: 40px 1fr auto; gap: 20px; align-items: start; }\n.number[_ngcontent-%COMP%] { font-family: monospace; color: #787774; }\n.status[_ngcontent-%COMP%] { font-size: 12px; color: #346538; background: #edf3ec; padding: 4px 8px; border-radius: 4px; }\na[_ngcontent-%COMP%] { color: inherit; text-underline-offset: 4px; }\n.actions[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; }\nbutton[_ngcontent-%COMP%] { border: 1px solid #eaeaea; padding: 12px 20px; border-radius: 4px; background: #fff; color: inherit; cursor: pointer; font: inherit; }\n.primary[_ngcontent-%COMP%] { background: #111; border-color: #111; color: #fff; }\nbutton[_ngcontent-%COMP%]:disabled { opacity: .5; cursor: default; }\n.hint[_ngcontent-%COMP%] { font-size: 13px; }\n.error[_ngcontent-%COMP%] { color: #9f2f2d; background: #fdebec; padding: 12px; }\n@media(max-width: 700px) { .onboarding[_ngcontent-%COMP%] { padding: 24px; margin: 16px 0; } li[_ngcontent-%COMP%] { grid-template-columns: 28px 1fr; gap: 12px; } li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { grid-column: 2; } }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUSxjQUFjLEVBQUUsY0FBYyxFQUFFO0FBQ3hDLGNBQWMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLHlCQUF5QixFQUFFLG1CQUFtQixFQUFFO0FBQ3BJLFdBQVcsY0FBYyxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRTtBQUNsRSxLQUFLLDJCQUEyQixFQUFFLGlDQUFpQyxFQUFFLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFO0FBQy9HLEtBQUssZUFBZSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRTtBQUN2RCxJQUFJLGdCQUFnQixFQUFFLGNBQWMsRUFBRTtBQUN0QyxLQUFLLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUU7QUFDbkQsS0FBSyw2QkFBNkIsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLG9DQUFvQyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRTtBQUN6SSxVQUFVLHNCQUFzQixFQUFFLGNBQWMsRUFBRTtBQUNsRCxVQUFVLGVBQWUsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUU7QUFDdEcsSUFBSSxjQUFjLEVBQUUsMEJBQTBCLEVBQUU7QUFDaEQsV0FBVyxhQUFhLEVBQUUsZUFBZSxFQUFFLDhCQUE4QixFQUFFLFNBQVMsRUFBRTtBQUN0RixTQUFTLHlCQUF5QixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFO0FBQzlJLFdBQVcsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFO0FBQzlELGtCQUFrQixXQUFXLEVBQUUsZUFBZSxFQUFFO0FBQ2hELFFBQVEsZUFBZSxFQUFFO0FBQ3pCLFNBQVMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRTtBQUM3RCwyQkFBMkIsY0FBYyxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSywrQkFBK0IsRUFBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLGNBQWMsRUFBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3QgeyBkaXNwbGF5OiBibG9jazsgY29sb3I6ICMyZjM0Mzc7IH1cbi5vbmJvYXJkaW5nIHsgbWF4LXdpZHRoOiA5NjBweDsgbWFyZ2luOiAzMnB4IGF1dG87IHBhZGRpbmc6IDQwcHg7IGJhY2tncm91bmQ6ICNmZmY7IGJvcmRlcjogMXB4IHNvbGlkICNlYWVhZWE7IGJvcmRlci1yYWRpdXM6IDEycHg7IH1cbi5leWVicm93IHsgY29sb3I6ICM3ODc3NzQ7IGZvbnQtc2l6ZTogMTFweDsgbGV0dGVyLXNwYWNpbmc6IC4xZW07IH1cbmgxIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNlcmlmOyBmb250LXNpemU6IGNsYW1wKDI4cHgsIDR2dywgNDBweCk7IGZvbnQtd2VpZ2h0OiA0MDA7IGxldHRlci1zcGFjaW5nOiAtLjAyZW07IH1cbmgyIHsgZm9udC1zaXplOiAxOHB4OyBmb250LXdlaWdodDogNTAwOyBtYXJnaW4tdG9wOiAwOyB9XG5wIHsgbGluZS1oZWlnaHQ6IDEuNjsgY29sb3I6ICM3ODc3NzQ7IH1cbm9sIHsgbGlzdC1zdHlsZTogbm9uZTsgcGFkZGluZzogMDsgbWFyZ2luOiAzMnB4IDA7IH1cbmxpIHsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNlYWVhZWE7IHBhZGRpbmc6IDI0cHggMDsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA0MHB4IDFmciBhdXRvOyBnYXA6IDIwcHg7IGFsaWduLWl0ZW1zOiBzdGFydDsgfVxuLm51bWJlciB7IGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7IGNvbG9yOiAjNzg3Nzc0OyB9XG4uc3RhdHVzIHsgZm9udC1zaXplOiAxMnB4OyBjb2xvcjogIzM0NjUzODsgYmFja2dyb3VuZDogI2VkZjNlYzsgcGFkZGluZzogNHB4IDhweDsgYm9yZGVyLXJhZGl1czogNHB4OyB9XG5hIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogNHB4OyB9XG4uYWN0aW9ucyB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBnYXA6IDE2cHg7IH1cbmJ1dHRvbiB7IGJvcmRlcjogMXB4IHNvbGlkICNlYWVhZWE7IHBhZGRpbmc6IDEycHggMjBweDsgYm9yZGVyLXJhZGl1czogNHB4OyBiYWNrZ3JvdW5kOiAjZmZmOyBjb2xvcjogaW5oZXJpdDsgY3Vyc29yOiBwb2ludGVyOyBmb250OiBpbmhlcml0OyB9XG4ucHJpbWFyeSB7IGJhY2tncm91bmQ6ICMxMTE7IGJvcmRlci1jb2xvcjogIzExMTsgY29sb3I6ICNmZmY7IH1cbmJ1dHRvbjpkaXNhYmxlZCB7IG9wYWNpdHk6IC41OyBjdXJzb3I6IGRlZmF1bHQ7IH1cbi5oaW50IHsgZm9udC1zaXplOiAxM3B4OyB9XG4uZXJyb3IgeyBjb2xvcjogIzlmMmYyZDsgYmFja2dyb3VuZDogI2ZkZWJlYzsgcGFkZGluZzogMTJweDsgfVxuQG1lZGlhKG1heC13aWR0aDogNzAwcHgpIHsgLm9uYm9hcmRpbmcgeyBwYWRkaW5nOiAyNHB4OyBtYXJnaW46IDE2cHggMDsgfSBsaSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjhweCAxZnI7IGdhcDogMTJweDsgfSBsaSBhIHsgZ3JpZC1jb2x1bW46IDI7IH0gfVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_organization-onboarding_organization-onboarding_component_ts.js.map