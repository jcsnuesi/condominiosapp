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
      styles: ["[_nghost-%COMP%] { display: block; color: #2f3437; font-family: 'Helvetica Neue', system-ui, sans-serif; }\n.signup-page[_ngcontent-%COMP%] { min-height: 100vh; background: #f7f6f3; padding: 56px 24px; }\n.signup-panel[_ngcontent-%COMP%] { max-width: 840px; margin: auto; padding: 44px; background: #fff; border: 1px solid #eaeaea; border-radius: 12px; }\n.brand[_ngcontent-%COMP%] { color: #2f3437; font-weight: 600; text-decoration: none; }\n.eyebrow[_ngcontent-%COMP%] { margin-top: 40px; font-size: 11px; letter-spacing: .12em; color: #787774; }\nh1[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: clamp(30px, 5vw, 42px); line-height: 1.15; letter-spacing: -.025em; margin: 16px 0; font-weight: 400; }\nh2[_ngcontent-%COMP%] { font-size: 20px; font-weight: 500; }\np[_ngcontent-%COMP%] { line-height: 1.65; }\n.intro[_ngcontent-%COMP%] { color: #787774; max-width: 580px; margin-bottom: 32px; }\n.choices[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n.choice[_ngcontent-%COMP%] { display: block; text-align: left; padding: 28px; border: 1px solid #eaeaea; border-radius: 8px; color: inherit; background: #fff; font: inherit; text-decoration: none; cursor: pointer; }\n.choice[_ngcontent-%COMP%]:hover { background: #fbfbfa; border-color: #787774; }\n.choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: #787774; min-height: 120px; }\n.tag[_ngcontent-%COMP%] { display: inline-block; padding: 5px 8px; font-size: 10px; letter-spacing: .08em; background: #edf3ec; color: #346538; border-radius: 4px; }\n.personal[_ngcontent-%COMP%] { background: #e1f3fe; color: #1f6c9f; }\n.choice-action[_ngcontent-%COMP%] { font-size: 13px; font-weight: 600; }\naside[_ngcontent-%COMP%] { border-top: 1px solid #eaeaea; margin-top: 32px; padding-top: 24px; }\naside[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { font-size: 16px; }\na[_ngcontent-%COMP%] { color: inherit; text-underline-offset: 3px; }\n.signup-form[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }\nlabel[_ngcontent-%COMP%] { font-size: 14px; display: grid; gap: 8px; }\ninput[_ngcontent-%COMP%]:not([type=checkbox]) { width: 100%; border: 1px solid #eaeaea; padding: 12px; border-radius: 4px; color: inherit; font: inherit; background: #fff; }\nsmall[_ngcontent-%COMP%] { color: #787774; }\n.wide[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n.terms[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }\n.terms[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { margin-top: 4px; }\n.actions[_ngcontent-%COMP%] { display: flex; justify-content: space-between; gap: 12px; }\n.primary[_ngcontent-%COMP%] { display: inline-block; border: 1px solid #111; border-radius: 4px; padding: 12px 20px; background: #111; color: #fff; font: inherit; text-decoration: none; cursor: pointer; }\n.secondary[_ngcontent-%COMP%] { display: inline-block; border: none; padding: 12px; background: transparent; color: inherit; font: inherit; text-decoration: underline; cursor: pointer; }\nbutton[_ngcontent-%COMP%]:disabled { opacity: .5; cursor: default; }\n.error[_ngcontent-%COMP%] { padding: 12px; background: #fdebec; color: #9f2f2d; border-radius: 4px; }\nfooter[_ngcontent-%COMP%] { margin-top: 32px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #787774; }\n[_ngcontent-%COMP%]:is(button,a,input):focus-visible { outline: 2px solid #346538; outline-offset: 4px; }\n@media(max-width: 640px) { .signup-page[_ngcontent-%COMP%] { padding: 20px 12px; } .signup-panel[_ngcontent-%COMP%] { padding: 24px; } .choices[_ngcontent-%COMP%], .signup-form[_ngcontent-%COMP%] { grid-template-columns: 1fr; } .choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { min-height: 0; } }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVEsY0FBYyxFQUFFLGNBQWMsRUFBRSxvREFBb0QsRUFBRTtBQUM5RixlQUFlLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFO0FBQzNFLGdCQUFnQixnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLHlCQUF5QixFQUFFLG1CQUFtQixFQUFFO0FBQ2pJLFNBQVMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFO0FBQ2xFLFdBQVcsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixFQUFFLGNBQWMsRUFBRTtBQUNyRixLQUFLLDJCQUEyQixFQUFFLGlDQUFpQyxFQUFFLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRTtBQUNuSixLQUFLLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUN4QyxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZCLFNBQVMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFO0FBQ2hFLFdBQVcsYUFBYSxFQUFFLDhCQUE4QixFQUFFLFNBQVMsRUFBRTtBQUNyRSxVQUFVLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUseUJBQXlCLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUU7QUFDbk0sZ0JBQWdCLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFO0FBQzVELFlBQVksY0FBYyxFQUFFLGlCQUFpQixFQUFFO0FBQy9DLE9BQU8scUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtBQUNqSixZQUFZLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUNqRCxpQkFBaUIsZUFBZSxFQUFFLGdCQUFnQixFQUFFO0FBQ3BELFFBQVEsNkJBQTZCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUU7QUFDNUUsV0FBVyxlQUFlLEVBQUU7QUFDNUIsSUFBSSxjQUFjLEVBQUUsMEJBQTBCLEVBQUU7QUFDaEQsZUFBZSxhQUFhLEVBQUUsOEJBQThCLEVBQUUsU0FBUyxFQUFFO0FBQ3pFLFFBQVEsZUFBZSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUU7QUFDbEQsNkJBQTZCLFdBQVcsRUFBRSx5QkFBeUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRTtBQUN6SixRQUFRLGNBQWMsRUFBRTtBQUN4QixRQUFRLG1CQUFtQixFQUFFO0FBQzdCLFNBQVMsYUFBYSxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtBQUM5RSxlQUFlLGVBQWUsRUFBRTtBQUNoQyxXQUFXLGFBQWEsRUFBRSw4QkFBOEIsRUFBRSxTQUFTLEVBQUU7QUFDckUsV0FBVyxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRTtBQUN4TCxhQUFhLHFCQUFxQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSwwQkFBMEIsRUFBRSxlQUFlLEVBQUU7QUFDdEssa0JBQWtCLFdBQVcsRUFBRSxlQUFlLEVBQUU7QUFDaEQsU0FBUyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0FBQ2pGLFNBQVMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsNkJBQTZCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRTtBQUM5RyxvQ0FBb0MsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUU7QUFDckYsMkJBQTJCLGVBQWUsa0JBQWtCLEVBQUUsRUFBRSxnQkFBZ0IsYUFBYSxFQUFFLEVBQUUseUJBQXlCLDBCQUEwQixFQUFFLEVBQUUsWUFBWSxhQUFhLEVBQUUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IGNvbG9yOiAjMmYzNDM3OyBmb250LWZhbWlseTogJ0hlbHZldGljYSBOZXVlJywgc3lzdGVtLXVpLCBzYW5zLXNlcmlmOyB9XG4uc2lnbnVwLXBhZ2UgeyBtaW4taGVpZ2h0OiAxMDB2aDsgYmFja2dyb3VuZDogI2Y3ZjZmMzsgcGFkZGluZzogNTZweCAyNHB4OyB9XG4uc2lnbnVwLXBhbmVsIHsgbWF4LXdpZHRoOiA4NDBweDsgbWFyZ2luOiBhdXRvOyBwYWRkaW5nOiA0NHB4OyBiYWNrZ3JvdW5kOiAjZmZmOyBib3JkZXI6IDFweCBzb2xpZCAjZWFlYWVhOyBib3JkZXItcmFkaXVzOiAxMnB4OyB9XG4uYnJhbmQgeyBjb2xvcjogIzJmMzQzNzsgZm9udC13ZWlnaHQ6IDYwMDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XG4uZXllYnJvdyB7IG1hcmdpbi10b3A6IDQwcHg7IGZvbnQtc2l6ZTogMTFweDsgbGV0dGVyLXNwYWNpbmc6IC4xMmVtOyBjb2xvcjogIzc4Nzc3NDsgfVxuaDEgeyBmb250LWZhbWlseTogR2VvcmdpYSwgc2VyaWY7IGZvbnQtc2l6ZTogY2xhbXAoMzBweCwgNXZ3LCA0MnB4KTsgbGluZS1oZWlnaHQ6IDEuMTU7IGxldHRlci1zcGFjaW5nOiAtLjAyNWVtOyBtYXJnaW46IDE2cHggMDsgZm9udC13ZWlnaHQ6IDQwMDsgfVxuaDIgeyBmb250LXNpemU6IDIwcHg7IGZvbnQtd2VpZ2h0OiA1MDA7IH1cbnAgeyBsaW5lLWhlaWdodDogMS42NTsgfVxuLmludHJvIHsgY29sb3I6ICM3ODc3NzQ7IG1heC13aWR0aDogNTgwcHg7IG1hcmdpbi1ib3R0b206IDMycHg7IH1cbi5jaG9pY2VzIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyOyBnYXA6IDE2cHg7IH1cbi5jaG9pY2UgeyBkaXNwbGF5OiBibG9jazsgdGV4dC1hbGlnbjogbGVmdDsgcGFkZGluZzogMjhweDsgYm9yZGVyOiAxcHggc29saWQgI2VhZWFlYTsgYm9yZGVyLXJhZGl1czogOHB4OyBjb2xvcjogaW5oZXJpdDsgYmFja2dyb3VuZDogI2ZmZjsgZm9udDogaW5oZXJpdDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5jaG9pY2U6aG92ZXIgeyBiYWNrZ3JvdW5kOiAjZmJmYmZhOyBib3JkZXItY29sb3I6ICM3ODc3NzQ7IH1cbi5jaG9pY2UgcCB7IGNvbG9yOiAjNzg3Nzc0OyBtaW4taGVpZ2h0OiAxMjBweDsgfVxuLnRhZyB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgcGFkZGluZzogNXB4IDhweDsgZm9udC1zaXplOiAxMHB4OyBsZXR0ZXItc3BhY2luZzogLjA4ZW07IGJhY2tncm91bmQ6ICNlZGYzZWM7IGNvbG9yOiAjMzQ2NTM4OyBib3JkZXItcmFkaXVzOiA0cHg7IH1cbi5wZXJzb25hbCB7IGJhY2tncm91bmQ6ICNlMWYzZmU7IGNvbG9yOiAjMWY2YzlmOyB9XG4uY2hvaWNlLWFjdGlvbiB7IGZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDYwMDsgfVxuYXNpZGUgeyBib3JkZXItdG9wOiAxcHggc29saWQgI2VhZWFlYTsgbWFyZ2luLXRvcDogMzJweDsgcGFkZGluZy10b3A6IDI0cHg7IH1cbmFzaWRlIGgyIHsgZm9udC1zaXplOiAxNnB4OyB9XG5hIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogM3B4OyB9XG4uc2lnbnVwLWZvcm0geyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7IGdhcDogMjBweDsgfVxubGFiZWwgeyBmb250LXNpemU6IDE0cHg7IGRpc3BsYXk6IGdyaWQ7IGdhcDogOHB4OyB9XG5pbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKSB7IHdpZHRoOiAxMDAlOyBib3JkZXI6IDFweCBzb2xpZCAjZWFlYWVhOyBwYWRkaW5nOiAxMnB4OyBib3JkZXItcmFkaXVzOiA0cHg7IGNvbG9yOiBpbmhlcml0OyBmb250OiBpbmhlcml0OyBiYWNrZ3JvdW5kOiAjZmZmOyB9XG5zbWFsbCB7IGNvbG9yOiAjNzg3Nzc0OyB9XG4ud2lkZSB7IGdyaWQtY29sdW1uOiAxIC8gLTE7IH1cbi50ZXJtcyB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0OyBnYXA6IDEwcHg7IGxpbmUtaGVpZ2h0OiAxLjU7IH1cbi50ZXJtcyBpbnB1dCB7IG1hcmdpbi10b3A6IDRweDsgfVxuLmFjdGlvbnMgeyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGdhcDogMTJweDsgfVxuLnByaW1hcnkgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJvcmRlcjogMXB4IHNvbGlkICMxMTE7IGJvcmRlci1yYWRpdXM6IDRweDsgcGFkZGluZzogMTJweCAyMHB4OyBiYWNrZ3JvdW5kOiAjMTExOyBjb2xvcjogI2ZmZjsgZm9udDogaW5oZXJpdDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5zZWNvbmRhcnkgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJvcmRlcjogbm9uZTsgcGFkZGluZzogMTJweDsgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGNvbG9yOiBpbmhlcml0OyBmb250OiBpbmhlcml0OyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgY3Vyc29yOiBwb2ludGVyOyB9XG5idXR0b246ZGlzYWJsZWQgeyBvcGFjaXR5OiAuNTsgY3Vyc29yOiBkZWZhdWx0OyB9XG4uZXJyb3IgeyBwYWRkaW5nOiAxMnB4OyBiYWNrZ3JvdW5kOiAjZmRlYmVjOyBjb2xvcjogIzlmMmYyZDsgYm9yZGVyLXJhZGl1czogNHB4OyB9XG5mb290ZXIgeyBtYXJnaW4tdG9wOiAzMnB4OyBwYWRkaW5nLXRvcDogMjBweDsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNlYWVhZWE7IGZvbnQtc2l6ZTogMTNweDsgY29sb3I6ICM3ODc3NzQ7IH1cbjppcyhidXR0b24sYSxpbnB1dCk6Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCAjMzQ2NTM4OyBvdXRsaW5lLW9mZnNldDogNHB4OyB9XG5AbWVkaWEobWF4LXdpZHRoOiA2NDBweCkgeyAuc2lnbnVwLXBhZ2UgeyBwYWRkaW5nOiAyMHB4IDEycHg7IH0gLnNpZ251cC1wYW5lbCB7IHBhZGRpbmc6IDI0cHg7IH0gLmNob2ljZXMsIC5zaWdudXAtZm9ybSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9IC5jaG9pY2UgcCB7IG1pbi1oZWlnaHQ6IDA7IH0gfVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_signup_verify-account_component_ts.js.map