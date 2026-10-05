"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_login_login_module_ts"],{

/***/ 14528
/*!********************************************************************!*\
  !*** ./src/app/demo/components/auth/login/login-routing.module.ts ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginRoutingModule: () => (/* binding */ LoginRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.component */ 52126);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class LoginRoutingModule {
  static {
    this.ɵfac = function LoginRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoginRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: LoginRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _login_component__WEBPACK_IMPORTED_MODULE_1__.LoginComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](LoginRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 52126
/*!***************************************************************!*\
  !*** ./src/app/demo/components/auth/login/login.component.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginComponent: () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/demo/service/user.service */ 37612);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-cookie-service */ 39512);
/* harmony import */ var src_app_demo_service_global_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/demo/service/global.service */ 53796);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/layout/service/app.layout.service */ 12681);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/demo/service/i18n.service */ 41343);
/* harmony import */ var src_app_demo_service_access_context_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/demo/service/access-context.service */ 11371);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_checkbox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/checkbox */ 37468);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var primeng_avatar__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/avatar */ 14212);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/toast */ 20708);



















function LoginComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r2.t("auth.login.invalidEmail"), " ");
  }
}
function LoginComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r2.t("auth.login.requiredPassword"), " ");
  }
}
class LoginComponent {
  constructor(layoutService, _userService, _cookieService, _route, _messageService, _i18n, _accessContext) {
    this.layoutService = layoutService;
    this._userService = _userService;
    this._cookieService = _cookieService;
    this._route = _route;
    this._messageService = _messageService;
    this._i18n = _i18n;
    this._accessContext = _accessContext;
    this.loginInProgress = false;
    this.rememberMe = false;
    this.t = key => this._i18n.t(key);
    this.administrator = {
      email: '',
      password: ''
    };
    this.url = src_app_demo_service_global_service__WEBPACK_IMPORTED_MODULE_2__.global.url;
  }
  loginAdministrators(loginForm) {
    if (loginForm?.invalid || this.loginInProgress) {
      loginForm?.control.markAllAsTouched();
      return;
    }
    this.loginInProgress = true;
    const payload = {
      ...this.administrator,
      rememberMe: this.rememberMe
    };
    this._userService.login(payload, false).subscribe(login => {
      if (login?.success && login?.data?.token && login?.data?.user) {
        const identity = login.data.user;
        const token = login.data.token;
        const expiresAt = login?.data?.session?.expiresAt;
        const access = login?.data?.access ?? null;
        if (this.rememberMe && expiresAt) {
          const expiry = new Date(expiresAt);
          this._cookieService.set('identity', JSON.stringify(identity), {
            expires: expiry
          });
          this._cookieService.set('token', token, {
            expires: expiry
          });
        } else {
          this._cookieService.set('identity', JSON.stringify(identity));
          this._cookieService.set('token', token);
        }
        this._accessContext.set(access);
        const target = access?.onboardingRequired ? ['/onboarding'] : identity.role === 'OWNER' && !identity.organizationId ? ['/smart-home'] : ['/start', identity._id];
        this._route.navigate(target);
      } else {
        this.show();
      }
      this.loginInProgress = false;
    }, error => {
      this.loginInProgress = false;
      this.show();
    });
  }
  goToForgotPassword() {
    this._route.navigate(['/auth/forgot-password']);
  }
  goToOwnerRegistration() {
    this._route.navigate(['/auth/register']);
  }
  show() {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.t('auth.login.error')
    });
  }
  static {
    this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_6__.LayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_1__.CookieService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_3__.MessageService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_demo_service_i18n_service__WEBPACK_IMPORTED_MODULE_9__.I18nService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_demo_service_access_context_service__WEBPACK_IMPORTED_MODULE_10__.AccessContextService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: LoginComponent,
      selectors: [["app-login"]],
      standalone: false,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵProvidersFeature"]([src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService, ngx_cookie_service__WEBPACK_IMPORTED_MODULE_1__.CookieService, primeng_api__WEBPACK_IMPORTED_MODULE_3__.MessageService])],
      decls: 42,
      vars: 25,
      consts: [["loginForm", "ngForm"], ["email", "ngModel"], ["password", "ngModel"], [1, "login-shell", "surface-ground"], [1, "login-card-wrap"], ["alt", "CondApp logo", 1, "login-logo", 3, "src"], [1, "login-gradient-frame"], [1, "login-card", "surface-card"], [1, "text-center", "mb-5"], ["image", "assets/noimage.jpeg", "styleClass", "login-avatar", "size", "xlarge", "shape", "circle"], [1, "app-page-kicker", "justify-content-center", "mt-4"], [3, "ngSubmit"], ["for", "email", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "email", "name", "email", "type", "email", "aria-label", "Email address for login", "pInputText", "", "required", "", "email", "", 1, "login-input", "w-full", "mb-2", 3, "ngModelChange", "ngModel", "placeholder"], [1, "p-error", "block", "mb-4"], ["for", "password", 1, "block", "text-900", "font-medium", "mb-2"], ["inputId", "password", "name", "password", "styleClass", "login-password w-full mb-2", "inputStyleClass", "w-full p-3", "required", "", 3, "ngModelChange", "ngModel", "placeholder", "toggleMask", "feedback"], [1, "login-options"], [1, "flex", "align-items-center"], ["id", "rememberme1", "name", "rememberMe", "styleClass", "mr-2", 3, "ngModelChange", "ngModel", "binary"], ["for", "rememberme1"], [1, "forgot-link", 3, "click"], ["pButton", "", "pRipple", "", "type", "submit", "aria-label", "Login submit button", 1, "w-full", "p-3", "text-xl", 3, "label", "loading", "disabled"], [1, "register-option"], ["routerLink", "/", 1, "forgot-link"]],
      template: function LoginComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 3)(1, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "img", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 6)(4, "div", 7)(5, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "p-avatar", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "form", 11, 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_13_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            const loginForm_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](14);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.loginAdministrators(loginForm_r2));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "label", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 13, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayListener"]("ngModelChange", function LoginComponent_Template_input_ngModelChange_17_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayBindingSet"](ctx.administrator.email, $event) || (ctx.administrator.email = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](19, LoginComponent_Conditional_19_Template, 2, 1, "small", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "label", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "p-password", 16, 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayListener"]("ngModelChange", function LoginComponent_Template_p_password_ngModelChange_22_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayBindingSet"](ctx.administrator.password, $event) || (ctx.administrator.password = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](24, LoginComponent_Conditional_24_Template, 2, 1, "small", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "div", 17)(26, "div", 18)(27, "p-checkbox", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayListener"]("ngModelChange", function LoginComponent_Template_p_checkbox_ngModelChange_27_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayBindingSet"](ctx.rememberMe, $event) || (ctx.rememberMe = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "label", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "a", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LoginComponent_Template_a_click_30_listener() {
            return ctx.goToForgotPassword();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](32, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](33, "div", 23)(34, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](35, "\u00BFNo tienes cuenta?");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](36, "a", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LoginComponent_Template_a_click_36_listener() {
            return ctx.goToOwnerRegistration();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](37, "Crear cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](38, "div", 23)(39, "a", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](40, "Conocer CondominiosApp");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](41, "p-toast");
        }
        if (rf & 2) {
          const loginForm_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](14);
          const email_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](18);
          const password_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinterpolate1"]("assets/layout/images/", ctx.layoutService.config.colorScheme === "light" ? "logo-dark" : "logo-white", ".svg"), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsanitizeUrl"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.appName"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.title"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.subtitle"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.email"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinterpolate"](ctx.t("auth.login.emailPlaceholder")));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayProperty"]("ngModel", ctx.administrator.email);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](email_r4.invalid && email_r4.touched ? 19 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.password"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinterpolate"](ctx.t("auth.login.passwordPlaceholder")));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayProperty"]("ngModel", ctx.administrator.password);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("toggleMask", true)("feedback", false);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](password_r5.invalid && password_r5.touched ? 24 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtwoWayProperty"]("ngModel", ctx.rememberMe);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("binary", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.rememberMe"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx.t("auth.login.forgotPassword"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("label", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinterpolate"](ctx.t("auth.login.submit")))("loading", ctx.loginInProgress)("disabled", loginForm_r2.invalid || ctx.loginInProgress);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterLink, primeng_button__WEBPACK_IMPORTED_MODULE_11__.ButtonDirective, primeng_checkbox__WEBPACK_IMPORTED_MODULE_12__.Checkbox, primeng_inputtext__WEBPACK_IMPORTED_MODULE_13__.InputText, _angular_forms__WEBPACK_IMPORTED_MODULE_14__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_14__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgForm, primeng_password__WEBPACK_IMPORTED_MODULE_15__.Password, primeng_avatar__WEBPACK_IMPORTED_MODULE_16__.Avatar, primeng_toast__WEBPACK_IMPORTED_MODULE_17__.Toast],
      styles: ["[_nghost-%COMP%]     .pi-eye, \n[_nghost-%COMP%]     .pi-eye-slash {\n  transform: scale(1.35);\n  margin-right: 0.75rem;\n  color: var(--primary-color) !important;\n}\n\n.login-shell[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  min-height: 100dvh;\n  min-width: 100vw;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 2rem;\n  background: radial-gradient(circle at top left, color-mix(in srgb, var(--primary-color) 16%, transparent), transparent 28rem), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.14), transparent 30rem), var(--surface-ground);\n}\n\n.login-card-wrap[_ngcontent-%COMP%] {\n  width: min(100%, 30rem);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-block: auto;\n}\n\n.login-logo[_ngcontent-%COMP%] {\n  width: 6rem;\n  flex-shrink: 0;\n  margin-bottom: 2rem;\n}\n\n.login-gradient-frame[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.3rem;\n  border-radius: 2rem;\n  background: linear-gradient(180deg, var(--primary-color) 0%, rgba(33, 150, 243, 0) 42%);\n  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);\n}\n\n.login-card[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 1.75rem;\n  padding: clamp(2rem, 7vw, 3rem);\n}\n\n[_nghost-%COMP%]     .login-avatar {\n  box-shadow: 0 0 0 6px var(--surface-100);\n}\n\n.login-card[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0.35rem 0;\n  color: var(--text-color);\n  font-size: clamp(1.8rem, 5vw, 2.35rem);\n}\n\n.login-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-color-secondary);\n}\n\n.login-input[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n\n[_nghost-%COMP%]     .login-password .p-password, \n[_nghost-%COMP%]     .login-password .p-inputtext {\n  width: 100%;\n}\n\n.login-options[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin: 0.75rem 0 1.5rem;\n}\n\n.forgot-link[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  cursor: pointer;\n  font-weight: 600;\n  text-decoration: none;\n  white-space: nowrap;\n}\n\n.register-option[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 0.35rem 0.6rem;\n  margin-top: 1.25rem;\n  color: var(--text-color-secondary);\n  font-size: 0.82rem;\n  text-align: center;\n}\n\n@media (max-width: 480px) {\n  .login-shell[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .login-options[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n}\n@media (max-height: 680px) {\n  .login-card-wrap[_ngcontent-%COMP%] {\n    margin-block: 0;\n  }\n  .login-logo[_ngcontent-%COMP%] {\n    width: 4.75rem;\n    margin-bottom: 1rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvbG9naW4vbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNZOztFQUVJLHNCQUFBO0VBQ0EscUJBQUE7RUFDQSxzQ0FBQTtBQUFoQjs7QUFHWTtFQUNJLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSwwT0FBQTtBQUFoQjs7QUFpQlk7RUFDSSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUFkaEI7O0FBaUJZO0VBQ0ksV0FBQTtFQUNBLGNBQUE7RUFDQSxtQkFBQTtBQWRoQjs7QUFpQlk7RUFDSSxXQUFBO0VBQ0EsZUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUZBQUE7RUFLQSw4Q0FBQTtBQWxCaEI7O0FBcUJZO0VBQ0ksV0FBQTtFQUNBLHNCQUFBO0VBQ0EsK0JBQUE7QUFsQmhCOztBQXFCWTtFQUNJLHdDQUFBO0FBbEJoQjs7QUFxQlk7RUFDSSxpQkFBQTtFQUNBLHdCQUFBO0VBQ0Esc0NBQUE7QUFsQmhCOztBQXFCWTtFQUNJLFNBQUE7RUFDQSxrQ0FBQTtBQWxCaEI7O0FBcUJZO0VBQ0ksYUFBQTtBQWxCaEI7O0FBcUJZOztFQUVJLFdBQUE7QUFsQmhCOztBQXFCWTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsU0FBQTtFQUNBLHdCQUFBO0FBbEJoQjs7QUFxQlk7RUFDSSwyQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0VBQ0EsbUJBQUE7QUFsQmhCOztBQXFCWTtFQUNJLGFBQUE7RUFDQSxlQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0NBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0FBbEJoQjs7QUFxQlk7RUFDSTtJQUNJLGFBQUE7RUFsQmxCO0VBcUJjO0lBQ0ksdUJBQUE7SUFDQSxzQkFBQTtFQW5CbEI7QUFDRjtBQXNCWTtFQUNJO0lBQ0ksZUFBQTtFQXBCbEI7RUF1QmM7SUFDSSxjQUFBO0lBQ0EsbUJBQUE7RUFyQmxCO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAgICAgICAgIDpob3N0IDo6bmctZGVlcCAucGktZXllLFxuICAgICAgICAgICAgOmhvc3QgOjpuZy1kZWVwIC5waS1leWUtc2xhc2gge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4zNSk7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAwLjc1cmVtO1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubG9naW4tc2hlbGwge1xuICAgICAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICAgICAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMGR2aDtcbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDEwMHZ3O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICAgICAgcGFkZGluZzogMnJlbTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGUgYXQgdG9wIGxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvci1taXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gc3JnYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIoLS1wcmltYXJ5LWNvbG9yKSAxNiUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudCAyOHJlbVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGUgYXQgYm90dG9tIHJpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmdiYSgxNCwgMTY1LCAyMzMsIDAuMTQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQgMzByZW1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgdmFyKC0tc3VyZmFjZS1ncm91bmQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubG9naW4tY2FyZC13cmFwIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDMwcmVtKTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYmxvY2s6IGF1dG87XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5sb2dpbi1sb2dvIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNnJlbTtcbiAgICAgICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAycmVtO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubG9naW4tZ3JhZGllbnQtZnJhbWUge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAuM3JlbTtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAycmVtO1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudChcbiAgICAgICAgICAgICAgICAgICAgMTgwZGVnLFxuICAgICAgICAgICAgICAgICAgICB2YXIoLS1wcmltYXJ5LWNvbG9yKSAwJSxcbiAgICAgICAgICAgICAgICAgICAgcmdiYSgzMywgMTUwLCAyNDMsIDApIDQyJVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAyNHB4IDcwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjE0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxvZ2luLWNhcmQge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEuNzVyZW07XG4gICAgICAgICAgICAgICAgcGFkZGluZzogY2xhbXAoMnJlbSwgN3Z3LCAzcmVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgOmhvc3QgOjpuZy1kZWVwIC5sb2dpbi1hdmF0YXIge1xuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDZweCB2YXIoLS1zdXJmYWNlLTEwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5sb2dpbi1jYXJkIGgxIHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAuMzVyZW0gMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgxLjhyZW0sIDV2dywgMi4zNXJlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5sb2dpbi1jYXJkIHAge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvci1zZWNvbmRhcnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubG9naW4taW5wdXQge1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFyZW07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIDpob3N0IDo6bmctZGVlcCAubG9naW4tcGFzc3dvcmQgLnAtcGFzc3dvcmQsXG4gICAgICAgICAgICA6aG9zdCA6Om5nLWRlZXAgLmxvZ2luLXBhc3N3b3JkIC5wLWlucHV0dGV4dCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5sb2dpbi1vcHRpb25zIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgICAgIGdhcDogMXJlbTtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAuNzVyZW0gMCAxLjVyZW07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5mb3Jnb3QtbGluayB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAucmVnaXN0ZXItb3B0aW9uIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBnYXA6IDAuMzVyZW0gMC42cmVtO1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDEuMjVyZW07XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3Itc2Vjb25kYXJ5KTtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDAuODJyZW07XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDgwcHgpIHtcbiAgICAgICAgICAgICAgICAubG9naW4tc2hlbGwge1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxcmVtO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5sb2dpbi1vcHRpb25zIHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBAbWVkaWEgKG1heC1oZWlnaHQ6IDY4MHB4KSB7XG4gICAgICAgICAgICAgICAgLmxvZ2luLWNhcmQtd3JhcCB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1ibG9jazogMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAubG9naW4tbG9nbyB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0Ljc1cmVtO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ },

/***/ 30065
/*!************************************************************!*\
  !*** ./src/app/demo/components/auth/login/login.module.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginModule: () => (/* binding */ LoginModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _login_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login-routing.module */ 14528);
/* harmony import */ var _login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login.component */ 52126);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/checkbox */ 37468);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_avatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/avatar */ 14212);
/* harmony import */ var primeng_avatargroup__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/avatargroup */ 693);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 94975);













class LoginModule {
  static {
    this.ɵfac = function LoginModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoginModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineNgModule"]({
      type: LoginModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _login_routing_module__WEBPACK_IMPORTED_MODULE_2__.LoginRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonModule, primeng_checkbox__WEBPACK_IMPORTED_MODULE_5__.CheckboxModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_8__.InputTextModule, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule, primeng_password__WEBPACK_IMPORTED_MODULE_7__.PasswordModule, primeng_avatar__WEBPACK_IMPORTED_MODULE_9__.AvatarModule, primeng_avatargroup__WEBPACK_IMPORTED_MODULE_10__.AvatarGroupModule, primeng_toast__WEBPACK_IMPORTED_MODULE_11__.ToastModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsetNgModuleScope"](LoginModule, {
    declarations: [_login_component__WEBPACK_IMPORTED_MODULE_3__.LoginComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, _login_routing_module__WEBPACK_IMPORTED_MODULE_2__.LoginRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonModule, primeng_checkbox__WEBPACK_IMPORTED_MODULE_5__.CheckboxModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_8__.InputTextModule, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule, primeng_password__WEBPACK_IMPORTED_MODULE_7__.PasswordModule, primeng_avatar__WEBPACK_IMPORTED_MODULE_9__.AvatarModule, primeng_avatargroup__WEBPACK_IMPORTED_MODULE_10__.AvatarGroupModule, primeng_toast__WEBPACK_IMPORTED_MODULE_11__.ToastModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_login_login_module_ts.js.map