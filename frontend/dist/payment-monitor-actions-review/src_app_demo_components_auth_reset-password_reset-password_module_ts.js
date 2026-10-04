"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_reset-password_reset-password_module_ts"],{

/***/ 35772
/*!**************************************************************************************!*\
  !*** ./src/app/demo/components/auth/reset-password/reset-password-routing.module.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResetPasswordRoutingModule: () => (/* binding */ ResetPasswordRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _reset_password_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reset-password.component */ 73194);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class ResetPasswordRoutingModule {
  static {
    this.ɵfac = function ResetPasswordRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResetPasswordRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: ResetPasswordRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: ':token',
        component: _reset_password_component__WEBPACK_IMPORTED_MODULE_1__.ResetPasswordComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ResetPasswordRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 73194
/*!*********************************************************************************!*\
  !*** ./src/app/demo/components/auth/reset-password/reset-password.component.ts ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResetPasswordComponent: () => (/* binding */ ResetPasswordComponent)
/* harmony export */ });
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/demo/service/user.service */ 37612);
/* harmony import */ var src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/demo/service/i18n.service */ 41343);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/toast */ 20708);










function ResetPasswordComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "small", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Minimo 8 caracteres. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class ResetPasswordComponent {
  constructor(_route, _router, _userService, _messageService, _i18n) {
    this._route = _route;
    this._router = _router;
    this._userService = _userService;
    this._messageService = _messageService;
    this._i18n = _i18n;
    this.password = '';
    this.loading = false;
    this.resetToken = '';
    this.t = key => this._i18n.t(key);
    this.resetToken = this._route.snapshot.paramMap.get('token') || '';
  }
  submit() {
    if (!this.password || this.password.length < 8 || this.loading) {
      return;
    }
    this.loading = true;
    this._userService.resetPassword(this.resetToken, this.password).subscribe({
      next: () => {
        this.loading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'OK',
          detail: this.t('auth.reset.success')
        });
        this._router.navigate(['/auth/login']);
      },
      error: err => {
        this.loading = false;
        const detail = err?.error?.code === 'AUTH_RESET_INVALID_TOKEN' ? this.t('auth.reset.invalidToken') : this.t('auth.login.error');
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail
        });
      }
    });
  }
  goToLogin() {
    this._router.navigate(['/auth/login']);
  }
  static {
    this.ɵfac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResetPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_3__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_0__.MessageService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_4__.I18nService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ResetPasswordComponent,
      selectors: [["app-reset-password"]],
      standalone: false,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵProvidersFeature"]([primeng_api__WEBPACK_IMPORTED_MODULE_0__.MessageService])],
      decls: 19,
      vars: 12,
      consts: [[1, "login-shell", "surface-ground"], [1, "login-card-wrap"], [1, "login-gradient-frame"], [1, "login-card", "surface-card"], [1, "text-center", "mb-5"], [1, "app-page-kicker", "justify-content-center", "mt-4"], [1, "mb-4"], ["for", "password", 1, "block", "text-900", "font-medium", "mb-2"], ["inputId", "password", "name", "password", "styleClass", "w-full", "inputStyleClass", "w-full p-3", 3, "ngModelChange", "ngModel", "toggleMask", "feedback", "placeholder"], [1, "p-error", "block", "mt-2"], ["pButton", "", "pRipple", "", "type", "button", 1, "w-full", "p-3", "text-xl", 3, "click", "label", "loading", "disabled"], ["pButton", "", "pRipple", "", "type", "button", "severity", "secondary", "label", "Volver al login", 1, "w-full", "mt-3", 3, "click"]],
      template: function ResetPasswordComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 6)(12, "label", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p-password", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ResetPasswordComponent_Template_p_password_ngModelChange_14_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.password, $event) || (ctx.password = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](15, ResetPasswordComponent_Conditional_15_Template, 2, 0, "small", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ResetPasswordComponent_Template_button_click_16_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ResetPasswordComponent_Template_button_click_17_listener() {
            return ctx.goToLogin();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "p-toast");
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.appName"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.reset.title"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.reset.subtitle"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.login.password"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.password);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("toggleMask", true)("feedback", false)("placeholder", ctx.t("auth.login.passwordPlaceholder"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](ctx.password && ctx.password.length < 8 ? 15 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("label", ctx.t("auth.reset.submit"))("loading", ctx.loading)("disabled", ctx.loading || ctx.password.length < 8);
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, primeng_password__WEBPACK_IMPORTED_MODULE_6__.Password, primeng_button__WEBPACK_IMPORTED_MODULE_7__.ButtonDirective, primeng_toast__WEBPACK_IMPORTED_MODULE_8__.Toast],
      encapsulation: 2
    });
  }
}

/***/ },

/***/ 2365
/*!******************************************************************************!*\
  !*** ./src/app/demo/components/auth/reset-password/reset-password.module.ts ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResetPasswordModule: () => (/* binding */ ResetPasswordModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var _reset_password_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reset-password.component */ 73194);
/* harmony import */ var _reset_password_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reset-password-routing.module */ 35772);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 94975);








class ResetPasswordModule {
  static {
    this.ɵfac = function ResetPasswordModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResetPasswordModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
      type: ResetPasswordModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_password__WEBPACK_IMPORTED_MODULE_2__.PasswordModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule, primeng_toast__WEBPACK_IMPORTED_MODULE_4__.ToastModule, _reset_password_routing_module__WEBPACK_IMPORTED_MODULE_6__.ResetPasswordRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](ResetPasswordModule, {
    declarations: [_reset_password_component__WEBPACK_IMPORTED_MODULE_5__.ResetPasswordComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_password__WEBPACK_IMPORTED_MODULE_2__.PasswordModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule, primeng_toast__WEBPACK_IMPORTED_MODULE_4__.ToastModule, _reset_password_routing_module__WEBPACK_IMPORTED_MODULE_6__.ResetPasswordRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_reset-password_reset-password_module_ts.js.map