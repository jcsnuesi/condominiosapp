"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_signup_verify-account_component_ts"],{

/***/ 11503
/*!*************************************************************************!*\
  !*** ./src/app/demo/components/auth/signup/verify-account.component.ts ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VerifyAccountComponent: () => (/* binding */ VerifyAccountComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 40311);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../service/global.service */ 53796);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 58440);






function VerifyAccountComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r0.error());
  }
}
function VerifyAccountComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "a", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("Inicia sesi\u00F3n para comenzar a configurar ", ctx_r0.type === "admin" ? "tu organizaci\u00F3n" : "tu vivienda", ".");
  }
}
function VerifyAccountComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function VerifyAccountComponent_Conditional_10_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.verify());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("Confirma que deseas activar tu cuenta ", ctx_r0.type === "admin" ? "ADMIN" : "OWNER personal", ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r0.busy() ? "Verificando\u2026" : "Verificar mi cuenta");
  }
}
class VerifyAccountComponent {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient);
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_1__.ActivatedRoute);
    this.type = this.route.snapshot.paramMap.get('type');
    this.verified = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "verified"
    }] : /* istanbul ignore next */[]));
    this.busy = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "busy"
    }] : /* istanbul ignore next */[]));
    this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "error"
    }] : /* istanbul ignore next */[]));
  }
  verify() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token || !/^[a-f0-9]{64}$/i.test(token) || !['admin', 'owner'].includes(this.type || '')) {
      this.error.set('El enlace no es válido. Vuelve al registro para solicitar uno nuevo.');
      return;
    }
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    const request = this.type === 'admin' ? this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_5__.global.url}auth/admin/verify/${token}`, {}) : this.http.get(`${_service_global_service__WEBPACK_IMPORTED_MODULE_5__.global.url}iot/owners/verify/${token}`);
    request.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.busy.set(false))).subscribe({
      next: () => this.verified.set(true),
      error: err => this.error.set(err.error?.error?.message || err.error?.message || 'No pudimos verificar tu cuenta. Intenta nuevamente.')
    });
  }
  static {
    this.ɵfac = function VerifyAccountComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || VerifyAccountComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: VerifyAccountComponent,
      selectors: [["app-verify-account"]],
      decls: 14,
      vars: 3,
      consts: [[1, "signup-page"], ["aria-labelledby", "verify-title", 1, "signup-panel"], ["routerLink", "/auth/login", 1, "brand"], [1, "eyebrow"], ["id", "verify-title"], ["role", "alert", 1, "error"], ["routerLink", "/auth/register"], ["role", "status"], ["routerLink", "/auth/login", 1, "primary"], [1, "primary", 3, "click", "disabled"]],
      template: function VerifyAccountComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "main", 0)(1, "section", 1)(2, "a", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Condominios App");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "VERIFICAR CUENTA");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "h1", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](8, VerifyAccountComponent_Conditional_8_Template, 2, 1, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](9, VerifyAccountComponent_Conditional_9_Template, 4, 1)(10, VerifyAccountComponent_Conditional_10_Template, 4, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "footer")(12, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "Volver al registro");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.verified() ? "Tu cuenta est\u00E1 lista" : "Confirma tu correo");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.error() ? 8 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.verified() ? 9 : 10);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  --signup-ink: var(--app-dark-text, #183153);\n  --signup-muted: var(--app-dark-muted, #66758d);\n  --signup-line: var(--app-dark-border, #dce5ee);\n  --signup-accent: var(--app-dark-accent, #176b87);\n  color: var(--signup-ink);\n  font-family: var(--font-family, 'Helvetica Neue', 'Segoe UI', sans-serif);\n}\n*[_ngcontent-%COMP%] { box-sizing: border-box; }\n.signup-page[_ngcontent-%COMP%] { min-height: 100vh; padding: 48px 24px; background: var(--surface-ground, #f5f8fb); }\n.signup-panel[_ngcontent-%COMP%] { max-width: 840px; margin: auto; padding: 40px; border: 1px solid var(--signup-line); border-radius: 22px; background: var(--app-dark-surface, #fff); }\n.brand[_ngcontent-%COMP%] { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; text-decoration: none; }\n.brand[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { color: var(--signup-accent); font-size: 1.25rem; }\nh1[_ngcontent-%COMP%] { margin: 32px 0 12px; color: var(--signup-ink); font-size: clamp(27px, 4vw, 36px); font-weight: 700; line-height: 1.2; letter-spacing: -.025em; }\nh2[_ngcontent-%COMP%] { margin: 24px 0 12px; color: var(--signup-ink); font-size: 24px; font-weight: 650; line-height: 1.25; letter-spacing: -.02em; }\np[_ngcontent-%COMP%] { line-height: 1.65; }\n.intro[_ngcontent-%COMP%] { max-width: 580px; margin: 0 0 28px; color: var(--signup-muted); }\n.eyebrow[_ngcontent-%COMP%] { margin: 32px 0 -20px; color: var(--signup-accent); font-size: 13px; font-weight: 650; }\n.account-switch[_ngcontent-%COMP%] { display: flex; max-width: 316px; margin: 0 auto 24px; padding: 4px; border-radius: 999px; background: var(--app-dark-surface-muted, #edf1f5); }\n.account-switch[_ngcontent-%COMP%]   :is(a[_ngcontent-%COMP%], button[_ngcontent-%COMP%]) { flex: 1; min-height: 36px; border: 0; border-radius: 999px; background: transparent; color: var(--signup-muted); font: inherit; font-size: 13px; font-weight: 600; text-align: center; text-decoration: none; display: grid; place-items: center; cursor: pointer; }\n.account-switch[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(a, button):hover { background: var(--app-dark-surface, #fff); color: var(--signup-ink); }\n.choices[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }\n.choice[_ngcontent-%COMP%] { display: flex; flex-direction: column; min-width: 0; padding: 24px 20px; border: 1px solid var(--signup-line); border-radius: 20px; background: var(--app-dark-surface, #fff); }\n.business[_ngcontent-%COMP%] { border-color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.tag[_ngcontent-%COMP%] { font-size: 14px; font-weight: 700; }\n.choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { flex: 1; margin: 0 0 24px; color: var(--signup-muted); font-size: 14px; }\n.features[_ngcontent-%COMP%] { display: grid; gap: 18px; margin: 28px 0 4px; padding: 0; list-style: none; }\n.features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; line-height: 1.5; }\n.features[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { margin-top: 3px; color: var(--signup-accent); }\naside[_ngcontent-%COMP%] { margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--signup-line); }\naside[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; font-size: 16px; letter-spacing: normal; }\naside[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: var(--signup-muted); font-size: 14px; }\na[_ngcontent-%COMP%] { color: inherit; text-underline-offset: 3px; }\n.help-links[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: 20px; color: var(--signup-accent); font-size: 14px; }\n.signup-form[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }\nlabel[_ngcontent-%COMP%], .password-field[_ngcontent-%COMP%] { display: grid; min-width: 0; gap: 8px; font-size: 14px; font-weight: 600; }\ninput[_ngcontent-%COMP%]:not([type=checkbox]) { width: 100%; min-height: 46px; padding: 12px 14px; border: 1px solid var(--signup-line); border-radius: 10px; background: var(--app-dark-surface, #fff); color: inherit; font: inherit; font-weight: 400; }\ninput[aria-invalid=true][_ngcontent-%COMP%] { border-color: var(--app-dark-danger-text, #b42318); }\nsmall[_ngcontent-%COMP%] { color: var(--signup-muted); font-size: 12px; font-weight: 400; line-height: 1.5; }\n.wide[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n.password-input[_ngcontent-%COMP%] { position: relative; }\n.password-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { padding-right: 52px; }\n.password-toggle[_ngcontent-%COMP%] { position: absolute; top: 1px; right: 2px; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 9px; background: transparent; color: var(--signup-muted); cursor: pointer; }\n.password-toggle[_ngcontent-%COMP%]:hover { color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.terms[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; font-weight: 400; }\n.terms[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { flex: 0 0 auto; width: 18px; height: 18px; margin: 2px 0 0; accent-color: var(--signup-accent); }\n.form-note[_ngcontent-%COMP%] { margin: 0; color: var(--signup-muted); font-size: 13px; }\n.actions[_ngcontent-%COMP%] { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }\n.primary[_ngcontent-%COMP%], .secondary[_ngcontent-%COMP%] { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 11px 22px; border: 1px solid var(--signup-line); border-radius: 999px; font: inherit; font-size: 14px; font-weight: 650; line-height: 1.4; text-align: center; text-decoration: none; cursor: pointer; }\n.primary[_ngcontent-%COMP%] { border-color: var(--signup-accent); background: var(--signup-accent); color: var(--app-dark-on-accent, #fff); }\n.primary[_ngcontent-%COMP%]:hover { border-color: var(--app-dark-accent-hover, #125b73); background: var(--app-dark-accent-hover, #125b73); }\n.secondary[_ngcontent-%COMP%] { background: transparent; color: var(--signup-ink); }\n.secondary[_ngcontent-%COMP%]:hover { border-color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.choice-action[_ngcontent-%COMP%] { width: 100%; font-size: 13px; padding-inline: 10px; }\nbutton[_ngcontent-%COMP%]:disabled { opacity: .5; cursor: default; }\n.field-error[_ngcontent-%COMP%] { color: var(--app-dark-danger-text, #b42318); }\n.error[_ngcontent-%COMP%], .notice[_ngcontent-%COMP%] { padding: 12px 16px; border-radius: 10px; }\n.error[_ngcontent-%COMP%] { background: var(--app-dark-danger-bg, #fff0ed); color: var(--app-dark-danger-text, #b42318); }\n.notice[_ngcontent-%COMP%] { background: var(--app-dark-info-bg, #eef6fa); }\n.sent-actions[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; }\n.text-link[_ngcontent-%COMP%] { padding: 12px; color: var(--signup-accent); }\nfooter[_ngcontent-%COMP%] { margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--signup-line); color: var(--signup-muted); font-size: 13px; }\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { color: var(--signup-accent); font-weight: 600; }\n[_ngcontent-%COMP%]:is(button, a, input):focus-visible { outline: 2px solid var(--signup-accent); outline-offset: 3px; }\n@media (max-width: 640px) {\n  .signup-page[_ngcontent-%COMP%] { padding: 20px 12px; }\n  .signup-panel[_ngcontent-%COMP%] { padding: 24px 18px; }\n  .choices[_ngcontent-%COMP%], .signup-form[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n  .actions[_ngcontent-%COMP%] { flex-wrap: wrap; }\n  .actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%] { flex: 1; }\n  .sent-actions[_ngcontent-%COMP%] { flex-direction: column; align-items: stretch; }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBYztFQUNkLDJDQUEyQztFQUMzQyw4Q0FBOEM7RUFDOUMsOENBQThDO0VBQzlDLGdEQUFnRDtFQUNoRCx3QkFBd0I7RUFDeEIseUVBQXlFO0FBQzNFO0FBQ0EsSUFBSSxzQkFBc0IsRUFBRTtBQUM1QixlQUFlLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLDBDQUEwQyxFQUFFO0FBQ2xHLGdCQUFnQixnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFO0FBQ3JLLFNBQVMsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFO0FBQ3hHLFdBQVcsMkJBQTJCLEVBQUUsa0JBQWtCLEVBQUU7QUFDNUQsS0FBSyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUMsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSx1QkFBdUIsRUFBRTtBQUNwSixLQUFLLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRTtBQUNsSSxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZCLFNBQVMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUU7QUFDekUsV0FBVyxvQkFBb0IsRUFBRSwyQkFBMkIsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDakcsa0JBQWtCLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsa0RBQWtELEVBQUU7QUFDaEssaUNBQWlDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsMEJBQTBCLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFO0FBQ3BTLHVDQUF1Qyx5Q0FBeUMsRUFBRSx3QkFBd0IsRUFBRTtBQUM1RyxXQUFXLGFBQWEsRUFBRSxnREFBZ0QsRUFBRSxTQUFTLEVBQUU7QUFDdkYsVUFBVSxhQUFhLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFO0FBQ3pMLFlBQVksa0NBQWtDLEVBQUUsNENBQTRDLEVBQUU7QUFDOUYsT0FBTyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDMUMsWUFBWSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUUsZUFBZSxFQUFFO0FBQ3BGLFlBQVksYUFBYSxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUU7QUFDeEYsZUFBZSxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNyRyxjQUFjLGVBQWUsRUFBRSwyQkFBMkIsRUFBRTtBQUM1RCxRQUFRLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdDQUF3QyxFQUFFO0FBQ3ZGLFdBQVcsU0FBUyxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsRUFBRTtBQUMvRCxVQUFVLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUN2RCxJQUFJLGNBQWMsRUFBRSwwQkFBMEIsRUFBRTtBQUNoRCxjQUFjLGFBQWEsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLDJCQUEyQixFQUFFLGVBQWUsRUFBRTtBQUN2RyxlQUFlLGFBQWEsRUFBRSxnREFBZ0QsRUFBRSxTQUFTLEVBQUU7QUFDM0YseUJBQXlCLGFBQWEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNuRyw2QkFBNkIsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdk8sMkJBQTJCLGtEQUFrRCxFQUFFO0FBQy9FLFFBQVEsMEJBQTBCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQ3pGLFFBQVEsbUJBQW1CLEVBQUU7QUFDN0Isa0JBQWtCLGtCQUFrQixFQUFFO0FBQ3RDLHdCQUF3QixtQkFBbUIsRUFBRTtBQUM3QyxtQkFBbUIsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUM3Tyx5QkFBeUIsMkJBQTJCLEVBQUUsNENBQTRDLEVBQUU7QUFDcEcsU0FBUyxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQ2hHLGVBQWUsY0FBYyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGtDQUFrQyxFQUFFO0FBQy9HLGFBQWEsU0FBUyxFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUNyRSxXQUFXLGFBQWEsRUFBRSw4QkFBOEIsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFO0FBQ3RGLHVCQUF1QixvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsb0NBQW9DLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUU7QUFDdlUsV0FBVyxrQ0FBa0MsRUFBRSxnQ0FBZ0MsRUFBRSxzQ0FBc0MsRUFBRTtBQUN6SCxpQkFBaUIsbURBQW1ELEVBQUUsaURBQWlELEVBQUU7QUFDekgsYUFBYSx1QkFBdUIsRUFBRSx3QkFBd0IsRUFBRTtBQUNoRSxtQkFBbUIsa0NBQWtDLEVBQUUsNENBQTRDLEVBQUU7QUFDckcsaUJBQWlCLFdBQVcsRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUU7QUFDckUsa0JBQWtCLFdBQVcsRUFBRSxlQUFlLEVBQUU7QUFDaEQsZUFBZSwyQ0FBMkMsRUFBRTtBQUM1RCxrQkFBa0Isa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUU7QUFDM0QsU0FBUyw4Q0FBOEMsRUFBRSwyQ0FBMkMsRUFBRTtBQUN0RyxVQUFVLDRDQUE0QyxFQUFFO0FBQ3hELGdCQUFnQixhQUFhLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtBQUNsRyxhQUFhLGFBQWEsRUFBRSwyQkFBMkIsRUFBRTtBQUN6RCxTQUFTLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdDQUF3QyxFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUNySSxXQUFXLDJCQUEyQixFQUFFLGdCQUFnQixFQUFFO0FBQzFELHNDQUFzQyx1Q0FBdUMsRUFBRSxtQkFBbUIsRUFBRTtBQUNwRztFQUNFLGVBQWUsa0JBQWtCLEVBQUU7RUFDbkMsZ0JBQWdCLGtCQUFrQixFQUFFO0VBQ3BDLHlCQUF5QiwwQkFBMEIsRUFBRTtFQUNyRCxXQUFXLGVBQWUsRUFBRTtFQUM1QixvQkFBb0IsT0FBTyxFQUFFO0VBQzdCLGdCQUFnQixzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRTtBQUNoRSIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIC0tc2lnbnVwLWluazogdmFyKC0tYXBwLWRhcmstdGV4dCwgIzE4MzE1Myk7XG4gIC0tc2lnbnVwLW11dGVkOiB2YXIoLS1hcHAtZGFyay1tdXRlZCwgIzY2NzU4ZCk7XG4gIC0tc2lnbnVwLWxpbmU6IHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2RjZTVlZSk7XG4gIC0tc2lnbnVwLWFjY2VudDogdmFyKC0tYXBwLWRhcmstYWNjZW50LCAjMTc2Yjg3KTtcbiAgY29sb3I6IHZhcigtLXNpZ251cC1pbmspO1xuICBmb250LWZhbWlseTogdmFyKC0tZm9udC1mYW1pbHksICdIZWx2ZXRpY2EgTmV1ZScsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYpO1xufVxuKiB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cbi5zaWdudXAtcGFnZSB7IG1pbi1oZWlnaHQ6IDEwMHZoOyBwYWRkaW5nOiA0OHB4IDI0cHg7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtZ3JvdW5kLCAjZjVmOGZiKTsgfVxuLnNpZ251cC1wYW5lbCB7IG1heC13aWR0aDogODQwcHg7IG1hcmdpbjogYXV0bzsgcGFkZGluZzogNDBweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAyMnB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgfVxuLmJyYW5kIHsgZGlzcGxheTogaW5saW5lLWZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTBweDsgZm9udC13ZWlnaHQ6IDcwMDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XG4uYnJhbmQgaSB7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC1zaXplOiAxLjI1cmVtOyB9XG5oMSB7IG1hcmdpbjogMzJweCAwIDEycHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtaW5rKTsgZm9udC1zaXplOiBjbGFtcCgyN3B4LCA0dncsIDM2cHgpOyBmb250LXdlaWdodDogNzAwOyBsaW5lLWhlaWdodDogMS4yOyBsZXR0ZXItc3BhY2luZzogLS4wMjVlbTsgfVxuaDIgeyBtYXJnaW46IDI0cHggMCAxMnB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWluayk7IGZvbnQtc2l6ZTogMjRweDsgZm9udC13ZWlnaHQ6IDY1MDsgbGluZS1oZWlnaHQ6IDEuMjU7IGxldHRlci1zcGFjaW5nOiAtLjAyZW07IH1cbnAgeyBsaW5lLWhlaWdodDogMS42NTsgfVxuLmludHJvIHsgbWF4LXdpZHRoOiA1ODBweDsgbWFyZ2luOiAwIDAgMjhweDsgY29sb3I6IHZhcigtLXNpZ251cC1tdXRlZCk7IH1cbi5leWVicm93IHsgbWFyZ2luOiAzMnB4IDAgLTIwcHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogNjUwOyB9XG4uYWNjb3VudC1zd2l0Y2ggeyBkaXNwbGF5OiBmbGV4OyBtYXgtd2lkdGg6IDMxNnB4OyBtYXJnaW46IDAgYXV0byAyNHB4OyBwYWRkaW5nOiA0cHg7IGJvcmRlci1yYWRpdXM6IDk5OXB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLW11dGVkLCAjZWRmMWY1KTsgfVxuLmFjY291bnQtc3dpdGNoIDppcyhhLCBidXR0b24pIHsgZmxleDogMTsgbWluLWhlaWdodDogMzZweDsgYm9yZGVyOiAwOyBib3JkZXItcmFkaXVzOiA5OTlweDsgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250OiBpbmhlcml0OyBmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiA2MDA7IHRleHQtYWxpZ246IGNlbnRlcjsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBkaXNwbGF5OiBncmlkOyBwbGFjZS1pdGVtczogY2VudGVyOyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5hY2NvdW50LXN3aXRjaCA6aXMoYSwgYnV0dG9uKTpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmZmYpOyBjb2xvcjogdmFyKC0tc2lnbnVwLWluayk7IH1cbi5jaG9pY2VzIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpOyBnYXA6IDIycHg7IH1cbi5jaG9pY2UgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBtaW4td2lkdGg6IDA7IHBhZGRpbmc6IDI0cHggMjBweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAyMHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgfVxuLmJ1c2luZXNzIHsgYm9yZGVyLWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2VlZjZmYSk7IH1cbi50YWcgeyBmb250LXNpemU6IDE0cHg7IGZvbnQtd2VpZ2h0OiA3MDA7IH1cbi5jaG9pY2UgcCB7IGZsZXg6IDE7IG1hcmdpbjogMCAwIDI0cHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250LXNpemU6IDE0cHg7IH1cbi5mZWF0dXJlcyB7IGRpc3BsYXk6IGdyaWQ7IGdhcDogMThweDsgbWFyZ2luOiAyOHB4IDAgNHB4OyBwYWRkaW5nOiAwOyBsaXN0LXN0eWxlOiBub25lOyB9XG4uZmVhdHVyZXMgbGkgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogZmxleC1zdGFydDsgZ2FwOiAxMnB4OyBmb250LXNpemU6IDEzcHg7IGxpbmUtaGVpZ2h0OiAxLjU7IH1cbi5mZWF0dXJlcyBpIHsgbWFyZ2luLXRvcDogM3B4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IH1cbmFzaWRlIHsgbWFyZ2luLXRvcDogMjhweDsgcGFkZGluZy10b3A6IDI0cHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1zaWdudXAtbGluZSk7IH1cbmFzaWRlIGgyIHsgbWFyZ2luOiAwOyBmb250LXNpemU6IDE2cHg7IGxldHRlci1zcGFjaW5nOiBub3JtYWw7IH1cbmFzaWRlIHAgeyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgZm9udC1zaXplOiAxNHB4OyB9XG5hIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogM3B4OyB9XG4uaGVscC1saW5rcyB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsgZ2FwOiAyMHB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IGZvbnQtc2l6ZTogMTRweDsgfVxuLnNpZ251cC1mb3JtIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpOyBnYXA6IDIwcHg7IH1cbmxhYmVsLCAucGFzc3dvcmQtZmllbGQgeyBkaXNwbGF5OiBncmlkOyBtaW4td2lkdGg6IDA7IGdhcDogOHB4OyBmb250LXNpemU6IDE0cHg7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cbmlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pIHsgd2lkdGg6IDEwMCU7IG1pbi1oZWlnaHQ6IDQ2cHg7IHBhZGRpbmc6IDEycHggMTRweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAxMHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgY29sb3I6IGluaGVyaXQ7IGZvbnQ6IGluaGVyaXQ7IGZvbnQtd2VpZ2h0OiA0MDA7IH1cbmlucHV0W2FyaWEtaW52YWxpZD10cnVlXSB7IGJvcmRlci1jb2xvcjogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLXRleHQsICNiNDIzMTgpOyB9XG5zbWFsbCB7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiA0MDA7IGxpbmUtaGVpZ2h0OiAxLjU7IH1cbi53aWRlIHsgZ3JpZC1jb2x1bW46IDEgLyAtMTsgfVxuLnBhc3N3b3JkLWlucHV0IHsgcG9zaXRpb246IHJlbGF0aXZlOyB9XG4ucGFzc3dvcmQtaW5wdXQgaW5wdXQgeyBwYWRkaW5nLXJpZ2h0OiA1MnB4OyB9XG4ucGFzc3dvcmQtdG9nZ2xlIHsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDFweDsgcmlnaHQ6IDJweDsgZGlzcGxheTogZ3JpZDsgcGxhY2UtaXRlbXM6IGNlbnRlcjsgd2lkdGg6IDQ0cHg7IGhlaWdodDogNDRweDsgcGFkZGluZzogMDsgYm9yZGVyOiAwOyBib3JkZXItcmFkaXVzOiA5cHg7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgY3Vyc29yOiBwb2ludGVyOyB9XG4ucGFzc3dvcmQtdG9nZ2xlOmhvdmVyIHsgY29sb3I6IHZhcigtLXNpZ251cC1hY2NlbnQpOyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZWVmNmZhKTsgfVxuLnRlcm1zIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IGdhcDogMTBweDsgbGluZS1oZWlnaHQ6IDEuNTsgZm9udC13ZWlnaHQ6IDQwMDsgfVxuLnRlcm1zIGlucHV0IHsgZmxleDogMCAwIGF1dG87IHdpZHRoOiAxOHB4OyBoZWlnaHQ6IDE4cHg7IG1hcmdpbjogMnB4IDAgMDsgYWNjZW50LWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgfVxuLmZvcm0tbm90ZSB7IG1hcmdpbjogMDsgY29sb3I6IHZhcigtLXNpZ251cC1tdXRlZCk7IGZvbnQtc2l6ZTogMTNweDsgfVxuLmFjdGlvbnMgeyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGdhcDogMTJweDsgbWFyZ2luLXRvcDogOHB4OyB9XG4ucHJpbWFyeSwgLnNlY29uZGFyeSB7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgZ2FwOiA4cHg7IG1pbi1oZWlnaHQ6IDQ0cHg7IHBhZGRpbmc6IDExcHggMjJweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiA5OTlweDsgZm9udDogaW5oZXJpdDsgZm9udC1zaXplOiAxNHB4OyBmb250LXdlaWdodDogNjUwOyBsaW5lLWhlaWdodDogMS40OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY3Vyc29yOiBwb2ludGVyOyB9XG4ucHJpbWFyeSB7IGJvcmRlci1jb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IGJhY2tncm91bmQ6IHZhcigtLXNpZ251cC1hY2NlbnQpOyBjb2xvcjogdmFyKC0tYXBwLWRhcmstb24tYWNjZW50LCAjZmZmKTsgfVxuLnByaW1hcnk6aG92ZXIgeyBib3JkZXItY29sb3I6IHZhcigtLWFwcC1kYXJrLWFjY2VudC1ob3ZlciwgIzEyNWI3Myk7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWFjY2VudC1ob3ZlciwgIzEyNWI3Myk7IH1cbi5zZWNvbmRhcnkgeyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgY29sb3I6IHZhcigtLXNpZ251cC1pbmspOyB9XG4uc2Vjb25kYXJ5OmhvdmVyIHsgYm9yZGVyLWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2VlZjZmYSk7IH1cbi5jaG9pY2UtYWN0aW9uIHsgd2lkdGg6IDEwMCU7IGZvbnQtc2l6ZTogMTNweDsgcGFkZGluZy1pbmxpbmU6IDEwcHg7IH1cbmJ1dHRvbjpkaXNhYmxlZCB7IG9wYWNpdHk6IC41OyBjdXJzb3I6IGRlZmF1bHQ7IH1cbi5maWVsZC1lcnJvciB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1kYW5nZXItdGV4dCwgI2I0MjMxOCk7IH1cbi5lcnJvciwgLm5vdGljZSB7IHBhZGRpbmc6IDEycHggMTZweDsgYm9yZGVyLXJhZGl1czogMTBweDsgfVxuLmVycm9yIHsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLWJnLCAjZmZmMGVkKTsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYjQyMzE4KTsgfVxuLm5vdGljZSB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNlZWY2ZmEpOyB9XG4uc2VudC1hY3Rpb25zIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEycHg7IG1hcmdpbi10b3A6IDI0cHg7IH1cbi50ZXh0LWxpbmsgeyBwYWRkaW5nOiAxMnB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IH1cbmZvb3RlciB7IG1hcmdpbi10b3A6IDMycHg7IHBhZGRpbmctdG9wOiAyMHB4OyBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgZm9udC1zaXplOiAxM3B4OyB9XG5mb290ZXIgYSB7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC13ZWlnaHQ6IDYwMDsgfVxuOmlzKGJ1dHRvbiwgYSwgaW5wdXQpOmZvY3VzLXZpc2libGUgeyBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tc2lnbnVwLWFjY2VudCk7IG91dGxpbmUtb2Zmc2V0OiAzcHg7IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xuICAuc2lnbnVwLXBhZ2UgeyBwYWRkaW5nOiAyMHB4IDEycHg7IH1cbiAgLnNpZ251cC1wYW5lbCB7IHBhZGRpbmc6IDI0cHggMThweDsgfVxuICAuY2hvaWNlcywgLnNpZ251cC1mb3JtIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cbiAgLmFjdGlvbnMgeyBmbGV4LXdyYXA6IHdyYXA7IH1cbiAgLmFjdGlvbnMgLnByaW1hcnkgeyBmbGV4OiAxOyB9XG4gIC5zZW50LWFjdGlvbnMgeyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogc3RyZXRjaDsgfVxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_signup_verify-account_component_ts.js.map