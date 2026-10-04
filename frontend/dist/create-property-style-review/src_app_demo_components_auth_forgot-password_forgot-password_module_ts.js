"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_forgot-password_forgot-password_module_ts"],{

/***/ 29076
/*!****************************************************************************************!*\
  !*** ./src/app/demo/components/auth/forgot-password/forgot-password-routing.module.ts ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPasswordRoutingModule: () => (/* binding */ ForgotPasswordRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _forgot_password_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forgot-password.component */ 93522);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class ForgotPasswordRoutingModule {
  static {
    this.ɵfac = function ForgotPasswordRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ForgotPasswordRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: ForgotPasswordRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _forgot_password_component__WEBPACK_IMPORTED_MODULE_1__.ForgotPasswordComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ForgotPasswordRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 93522
/*!***********************************************************************************!*\
  !*** ./src/app/demo/components/auth/forgot-password/forgot-password.component.ts ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPasswordComponent: () => (/* binding */ ForgotPasswordComponent)
/* harmony export */ });
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/demo/service/user.service */ 37612);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/demo/service/i18n.service */ 41343);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/toast */ 20708);










class ForgotPasswordComponent {
  constructor(_userService, _messageService, _router, _i18n) {
    this._userService = _userService;
    this._messageService = _messageService;
    this._router = _router;
    this._i18n = _i18n;
    this.email = '';
    this.loading = false;
    this.t = key => this._i18n.t(key);
  }
  submit() {
    if (!this.email || this.loading) {
      return;
    }
    this.loading = true;
    this._userService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'OK',
          detail: this.t('auth.forgot.success')
        });
      },
      error: () => {
        this.loading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.t('auth.login.error')
        });
      }
    });
  }
  goToLogin() {
    this._router.navigate(['/auth/login']);
  }
  static {
    this.ɵfac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ForgotPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_2__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_0__.MessageService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_4__.I18nService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ForgotPasswordComponent,
      selectors: [["app-forgot-password"]],
      standalone: false,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵProvidersFeature"]([primeng_api__WEBPACK_IMPORTED_MODULE_0__.MessageService])],
      decls: 18,
      vars: 10,
      consts: [[1, "login-shell", "surface-ground"], [1, "login-card-wrap"], [1, "login-gradient-frame"], [1, "login-card", "surface-card"], [1, "text-center", "mb-5"], [1, "app-page-kicker", "justify-content-center", "mt-4"], [1, "mb-4"], ["for", "email", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "email", "name", "email", "type", "email", "pInputText", "", 1, "w-full", 3, "ngModelChange", "ngModel", "placeholder"], ["pButton", "", "pRipple", "", "type", "button", 1, "w-full", "p-3", "text-xl", 3, "click", "label", "loading", "disabled"], ["pButton", "", "pRipple", "", "type", "button", "severity", "secondary", "label", "Volver al login", 1, "w-full", "mt-3", 3, "click"]],
      template: function ForgotPasswordComponent_Template(rf, ctx) {
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
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "input", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ForgotPasswordComponent_Template_input_ngModelChange_14_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.email, $event) || (ctx.email = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ForgotPasswordComponent_Template_button_click_15_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ForgotPasswordComponent_Template_button_click_16_listener() {
            return ctx.goToLogin();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "p-toast");
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.appName"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.forgot.title"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.forgot.subtitle"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.t("auth.login.email"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinterpolate"](ctx.t("auth.login.emailPlaceholder")));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.email);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("label", ctx.t("auth.forgot.submit"))("loading", ctx.loading)("disabled", ctx.loading || !ctx.email);
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, primeng_inputtext__WEBPACK_IMPORTED_MODULE_6__.InputText, primeng_button__WEBPACK_IMPORTED_MODULE_7__.ButtonDirective, primeng_toast__WEBPACK_IMPORTED_MODULE_8__.Toast],
      encapsulation: 2
    });
  }
}

/***/ },

/***/ 32213
/*!********************************************************************************!*\
  !*** ./src/app/demo/components/auth/forgot-password/forgot-password.module.ts ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPasswordModule: () => (/* binding */ ForgotPasswordModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var _forgot_password_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./forgot-password-routing.module */ 29076);
/* harmony import */ var _forgot_password_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./forgot-password.component */ 93522);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 94975);








class ForgotPasswordModule {
  static {
    this.ɵfac = function ForgotPasswordModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ForgotPasswordModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
      type: ForgotPasswordModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_2__.InputTextModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule, primeng_toast__WEBPACK_IMPORTED_MODULE_4__.ToastModule, _forgot_password_routing_module__WEBPACK_IMPORTED_MODULE_5__.ForgotPasswordRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](ForgotPasswordModule, {
    declarations: [_forgot_password_component__WEBPACK_IMPORTED_MODULE_6__.ForgotPasswordComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_2__.InputTextModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule, primeng_toast__WEBPACK_IMPORTED_MODULE_4__.ToastModule, _forgot_password_routing_module__WEBPACK_IMPORTED_MODULE_5__.ForgotPasswordRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_forgot-password_forgot-password_module_ts.js.map