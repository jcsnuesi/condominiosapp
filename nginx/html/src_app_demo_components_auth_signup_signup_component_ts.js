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
/* harmony import */ var src_app_phone_format_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/phone-format.directive */ 26707);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 40311);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../service/global.service */ 53796);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 58440);









function SignupComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "h1", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Choose your account");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, " Manage your home or bring your condominium organization together. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "nav", 13)(5, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "Personal");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_5_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.step.set("account"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, " Business ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "div", 16)(10, "article", 17)(11, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, "Personal");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14, "Your home, connected");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, " Manage your own home and Smart Home devices from one personal account. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18, "Create personal account");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "ul", 20)(20, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](21, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](22, "Register your personal home ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](24, "i", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25, "Connect your Smart Home devices ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](26, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](27, "i", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28, "Manage your personal access ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](29, "article", 24)(30, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](31, "Business");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](33, "Your organization");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](34, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](35, " Create an organization to manage condominiums, residents, and day-to-day operations. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](36, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_5_Template_button_click_36_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.step.set("account"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](37, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](38, "Create business account ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](39, "ul", 20)(40, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](41, "i", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](42, "Organize condominiums and units ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](43, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](44, "i", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](45, "Manage owners and residents ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](46, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](47, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](48, "Handle billing and communications ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
  }
}
function SignupComponent_Conditional_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function SignupComponent_Conditional_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.notice());
  }
}
function SignupComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Business account \u00B7 Email verification");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "h1", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Check your email");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " If this email can be registered, you will receive a link to activate your account and organization. The link expires in 24 hours. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, "Already have an account? Sign in or reset your password.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](8, SignupComponent_Conditional_6_Conditional_8_Template, 2, 1, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](9, SignupComponent_Conditional_6_Conditional_9_Template, 2, 1, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "div", 33)(11, "a", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, "Go to sign in");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_6_Template_button_click_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resend());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "a", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, "Reset password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](ctx_r1.error() ? 8 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](ctx_r1.notice() ? 9 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r1.busy() ? "Sending\u2026" : "Resend verification link", " ");
  }
}
function SignupComponent_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function SignupComponent_Conditional_7_Conditional_7_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "small", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Enter a valid email address.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function SignupComponent_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "form", 38, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngSubmit", function SignupComponent_Conditional_7_Conditional_7_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const accountForm_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.next(accountForm_r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "label", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "First name");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "input", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.name, $event) || (ctx_r1.form.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "label", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "Last name");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "input", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.lastname, $event) || (ctx_r1.form.lastname = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "label", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, "Email address");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "input", 44, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.email, $event) || (ctx_r1.form.email = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](12, SignupComponent_Conditional_7_Conditional_7_Conditional_12_Template, 2, 0, "small", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "label", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14, "Phone number");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "input", 47, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_15_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.phone, $event) || (ctx_r1.form.phone = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "small", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18, "Use 8\u201316 digits, with an optional + prefix.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "div", 49)(20, "label", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](21, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "div", 51)(23, "input", 52, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.password, $event) || (ctx_r1.form.password = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_7_Conditional_7_Template_button_click_25_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.showPassword.set(!ctx_r1.showPassword()));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](26, "i", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](27, "small", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28, "Use 12\u2013128 characters.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](29, "div", 49)(30, "label", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](31, "Confirm password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "div", 51)(33, "input", 57, 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_7_Template_input_ngModelChange_33_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.confirmPassword, $event) || (ctx_r1.confirmPassword = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](35, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_7_Conditional_7_Template_button_click_35_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.showConfirmPassword.set(!ctx_r1.showConfirmPassword()));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](36, "i", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](37, "small", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](39, "div", 60)(40, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_7_Conditional_7_Template_button_click_40_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.step.set("choice"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](41, " Back");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](42, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](43, " Continue");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](44, "i", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const accountForm_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1);
    const email_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](11);
    const phone_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](16);
    const password_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](24);
    const confirmation_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](34);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.lastname);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-invalid", email_r6.touched && email_r6.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](email_r6.touched && email_r6.invalid ? 12 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-invalid", phone_r7.touched && phone_r7.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("field-error", phone_r7.touched && phone_r7.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("type", ctx_r1.showPassword() ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-invalid", password_r8.touched && password_r8.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", ctx_r1.showPassword() ? "Hide password" : "Show password")("aria-pressed", ctx_r1.showPassword());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r1.showPassword() ? "pi pi-eye-slash" : "pi pi-eye");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("field-error", password_r8.touched && password_r8.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("type", ctx_r1.showConfirmPassword() ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.confirmPassword);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-invalid", confirmation_r9.touched && !ctx_r1.passwordsMatch);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", ctx_r1.showConfirmPassword() ? "Hide confirmation password" : "Show confirmation password")("aria-pressed", ctx_r1.showConfirmPassword());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r1.showConfirmPassword() ? "pi pi-eye-slash" : "pi pi-eye");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("field-error", confirmation_r9.touched && !ctx_r1.passwordsMatch);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](confirmation_r9.touched && !ctx_r1.passwordsMatch ? "Passwords must match." : "Enter your password again.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", accountForm_r5.invalid || !ctx_r1.passwordsMatch);
  }
}
function SignupComponent_Conditional_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "form", 38, 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngSubmit", function SignupComponent_Conditional_7_Conditional_8_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const organizationForm_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.submit(organizationForm_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Organization name");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.company, $event) || (ctx_r1.form.company = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "label", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "Street address");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.street_1, $event) || (ctx_r1.form.street_1 = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "label", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, "City");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "input", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.city, $event) || (ctx_r1.form.city = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "label", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, "State or province");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "input", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.state, $event) || (ctx_r1.form.state = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "label", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](15, "Country");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "input", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.country, $event) || (ctx_r1.form.country = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "label", 74)(18, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayListener"]("ngModelChange", function SignupComponent_Conditional_7_Conditional_8_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayBindingSet"](ctx_r1.form.terms, $event) || (ctx_r1.form.terms = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19, "I agree to the platform's terms and conditions.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](20, "p", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](21, " Once you verify your email, we will create your organization with you as its primary administrator. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "div", 60)(23, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SignupComponent_Conditional_7_Conditional_8_Template_button_click_23_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      ctx_r1.step.set("account");
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.error.set(""));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24, " Back");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const organizationForm_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.company);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.street_1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.city);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.state);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.country);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.form.terms);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", organizationForm_r11.invalid || !ctx_r1.form.terms || !ctx_r1.passwordsMatch || ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r1.busy() ? "Creating account\u2026" : "Create business account", " ");
  }
}
function SignupComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "h1", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](6, SignupComponent_Conditional_7_Conditional_6_Template, 2, 1, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](7, SignupComponent_Conditional_7_Conditional_7_Template, 45, 29, "form", 37)(8, SignupComponent_Conditional_7_Conditional_8_Template, 27, 9, "form", 37);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" Business account \u00B7 Step ", ctx_r1.step() === "account" ? "1" : "2", " of 2 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r1.step() === "account" ? "Create your account" : "Set up your organization", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r1.step() === "account" ? "Your account gives you access to manage condominiums within your organization." : "Use the details of your management company or condominium administration.", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](ctx_r1.error() ? 6 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](ctx_r1.step() === "account" ? 7 : 8);
  }
}
class SignupComponent {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient);
    this.step = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)('choice', ...(ngDevMode ? [{
      debugName: "step"
    }] : /* istanbul ignore next */[]));
    this.busy = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false, ...(ngDevMode ? [{
      debugName: "busy"
    }] : /* istanbul ignore next */[]));
    this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)('', ...(ngDevMode ? [{
      debugName: "error"
    }] : /* istanbul ignore next */[]));
    this.notice = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)('', ...(ngDevMode ? [{
      debugName: "notice"
    }] : /* istanbul ignore next */[]));
    this.showPassword = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false, ...(ngDevMode ? [{
      debugName: "showPassword"
    }] : /* istanbul ignore next */[]));
    this.showConfirmPassword = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false, ...(ngDevMode ? [{
      debugName: "showConfirmPassword"
    }] : /* istanbul ignore next */[]));
    this.confirmPassword = '';
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
      country: 'Dominican Republic',
      terms: false
    };
  }
  get passwordsMatch() {
    return this.form.password.length > 0 && this.form.password === this.confirmPassword;
  }
  next(form) {
    if (form.invalid || !this.passwordsMatch) {
      form.control.markAllAsTouched();
      return;
    }
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
    this.error.set('');
    this.step.set('organization');
  }
  resend() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_6__.global.url}auth/admin/resend-verification`, {
      email: this.form.email
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.finalize)(() => this.busy.set(false))).subscribe({
      next: () => this.notice.set('If your account is still pending, you will receive a new link. Check your spam folder too.'),
      error: () => this.error.set('We could not resend the link. Please try again.')
    });
  }
  submit(form) {
    if (this.busy()) return;
    if (form.invalid || !this.form.terms || !this.passwordsMatch) {
      form.control.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_6__.global.url}auth/admin/register`, this.form).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.finalize)(() => this.busy.set(false))).subscribe({
      next: () => {
        this.form.password = '';
        this.confirmPassword = '';
        this.step.set('sent');
      },
      error: err => this.error.set(err.error?.error?.message || err.error?.message || 'We could not create your account. Please try again.')
    });
  }
  static {
    this.ɵfac = function SignupComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SignupComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: SignupComponent,
      selectors: [["app-signup"]],
      decls: 12,
      vars: 1,
      consts: [["accountForm", "ngForm"], ["email", "ngModel"], ["phone", "ngModel"], ["password", "ngModel"], ["confirmation", "ngModel"], ["organizationForm", "ngForm"], ["lang", "en", 1, "signup-page"], ["aria-labelledby", "signup-title", 1, "signup-panel"], ["routerLink", "/auth/login", 1, "brand"], ["aria-hidden", "true", 1, "pi", "pi-building"], ["routerLink", "/auth/login"], ["id", "signup-title"], [1, "intro"], ["aria-label", "Account type", 1, "account-switch"], ["routerLink", "/auth/iot-register"], ["type", "button", 3, "click"], [1, "choices"], [1, "choice"], [1, "tag"], ["routerLink", "/auth/iot-register", 1, "secondary", "choice-action"], [1, "features"], ["aria-hidden", "true", 1, "pi", "pi-home"], ["aria-hidden", "true", 1, "pi", "pi-wifi"], ["aria-hidden", "true", 1, "pi", "pi-user"], [1, "choice", "business"], ["type", "button", 1, "primary", "choice-action", 3, "click"], ["aria-hidden", "true", 1, "pi", "pi-plus"], ["aria-hidden", "true", 1, "pi", "pi-users"], ["aria-hidden", "true", 1, "pi", "pi-wallet"], [1, "eyebrow"], ["role", "status"], ["role", "alert", 1, "error"], ["role", "status", 1, "notice"], [1, "sent-actions"], ["routerLink", "/auth/login", 1, "primary"], ["type", "button", 1, "secondary", 3, "click", "disabled"], ["routerLink", "/auth/forgot-password", 1, "text-link"], [1, "signup-form"], [1, "signup-form", 3, "ngSubmit"], ["for", "name"], ["id", "name", "name", "name", "required", "", "maxlength", "100", "autocomplete", "given-name", 3, "ngModelChange", "ngModel"], ["for", "lastname"], ["id", "lastname", "name", "lastname", "required", "", "maxlength", "100", "autocomplete", "family-name", 3, "ngModelChange", "ngModel"], ["for", "email", 1, "wide"], ["id", "email", "type", "email", "name", "email", "email", "", "required", "", "maxlength", "254", "autocomplete", "email", 3, "ngModelChange", "ngModel"], [1, "field-error"], ["for", "phone", 1, "wide"], ["appPhoneFormat", "", "id", "phone", "type", "tel", "name", "phone", "required", "", "pattern", "^\\+?[0-9]{8,16}$", "autocomplete", "tel", "aria-describedby", "phone-help", 3, "ngModelChange", "ngModel"], ["id", "phone-help"], [1, "password-field", "wide"], ["for", "password"], [1, "password-input"], ["id", "password", "name", "password", "required", "", "minlength", "12", "maxlength", "128", "autocomplete", "new-password", "aria-describedby", "password-help", 3, "ngModelChange", "type", "ngModel"], ["type", "button", "aria-controls", "password", 1, "password-toggle", 3, "click"], ["aria-hidden", "true"], ["id", "password-help"], ["for", "confirm-password"], ["id", "confirm-password", "name", "confirmPassword", "required", "", "maxlength", "128", "autocomplete", "new-password", "aria-describedby", "confirm-password-help", 3, "ngModelChange", "type", "ngModel"], ["type", "button", "aria-controls", "confirm-password", 1, "password-toggle", 3, "click"], ["id", "confirm-password-help", "aria-live", "polite"], [1, "actions", "wide"], ["type", "button", 1, "secondary", 3, "click"], ["type", "submit", 1, "primary", 3, "disabled"], ["aria-hidden", "true", 1, "pi", "pi-arrow-right"], ["for", "company", 1, "wide"], ["id", "company", "name", "company", "required", "", "maxlength", "160", "autocomplete", "organization", 3, "ngModelChange", "ngModel"], ["for", "street", 1, "wide"], ["id", "street", "name", "street", "required", "", "maxlength", "200", "autocomplete", "street-address", 3, "ngModelChange", "ngModel"], ["for", "city"], ["id", "city", "name", "city", "required", "", "maxlength", "100", "autocomplete", "address-level2", 3, "ngModelChange", "ngModel"], ["for", "state"], ["id", "state", "name", "state", "required", "", "maxlength", "100", "autocomplete", "address-level1", 3, "ngModelChange", "ngModel"], ["for", "country", 1, "wide"], ["id", "country", "name", "country", "required", "", "maxlength", "100", "autocomplete", "country-name", 3, "ngModelChange", "ngModel"], ["for", "terms", 1, "terms", "wide"], ["id", "terms", "type", "checkbox", "name", "terms", "required", "", 3, "ngModelChange", "ngModel"], [1, "wide", "form-note"]],
      template: function SignupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "main", 6)(1, "section", 7)(2, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](3, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Condominios App");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](5, SignupComponent_Conditional_5_Template, 49, 0)(6, SignupComponent_Conditional_6_Template, 17, 4)(7, SignupComponent_Conditional_7_Template, 9, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, " Already have an account? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "a", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11, "Sign in");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"](ctx.step() === "choice" ? 5 : ctx.step() === "sent" ? 6 : 7);
        }
      },
      dependencies: [src_app_phone_format_directive__WEBPACK_IMPORTED_MODULE_0__.PhoneFormatDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.CheckboxRequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgForm, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  --signup-ink: var(--app-dark-text, #183153);\n  --signup-muted: var(--app-dark-muted, #66758d);\n  --signup-line: var(--app-dark-border, #dce5ee);\n  --signup-accent: var(--app-dark-accent, #176b87);\n  color: var(--signup-ink);\n  font-family: var(--font-family, 'Helvetica Neue', 'Segoe UI', sans-serif);\n}\n*[_ngcontent-%COMP%] { box-sizing: border-box; }\n.signup-page[_ngcontent-%COMP%] { min-height: 100vh; padding: 48px 24px; background: var(--surface-ground, #f5f8fb); }\n.signup-panel[_ngcontent-%COMP%] { max-width: 840px; margin: auto; padding: 40px; border: 1px solid var(--signup-line); border-radius: 22px; background: var(--app-dark-surface, #fff); }\n.brand[_ngcontent-%COMP%] { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; text-decoration: none; }\n.brand[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { color: var(--signup-accent); font-size: 1.25rem; }\nh1[_ngcontent-%COMP%] { margin: 32px 0 12px; color: var(--signup-ink); font-size: clamp(27px, 4vw, 36px); font-weight: 700; line-height: 1.2; letter-spacing: -.025em; }\nh2[_ngcontent-%COMP%] { margin: 24px 0 12px; color: var(--signup-ink); font-size: 24px; font-weight: 650; line-height: 1.25; letter-spacing: -.02em; }\np[_ngcontent-%COMP%] { line-height: 1.65; }\n.intro[_ngcontent-%COMP%] { max-width: 580px; margin: 0 0 28px; color: var(--signup-muted); }\n.eyebrow[_ngcontent-%COMP%] { margin: 32px 0 -20px; color: var(--signup-accent); font-size: 13px; font-weight: 650; }\n.account-switch[_ngcontent-%COMP%] { display: flex; max-width: 316px; margin: 0 auto 24px; padding: 4px; border-radius: 999px; background: var(--app-dark-surface-muted, #edf1f5); }\n.account-switch[_ngcontent-%COMP%]   :is(a[_ngcontent-%COMP%], button[_ngcontent-%COMP%]) { flex: 1; min-height: 36px; border: 0; border-radius: 999px; background: transparent; color: var(--signup-muted); font: inherit; font-size: 13px; font-weight: 600; text-align: center; text-decoration: none; display: grid; place-items: center; cursor: pointer; }\n.account-switch[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(a, button):hover { background: var(--app-dark-surface, #fff); color: var(--signup-ink); }\n.choices[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }\n.choice[_ngcontent-%COMP%] { display: flex; flex-direction: column; min-width: 0; padding: 24px 20px; border: 1px solid var(--signup-line); border-radius: 20px; background: var(--app-dark-surface, #fff); }\n.business[_ngcontent-%COMP%] { border-color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.tag[_ngcontent-%COMP%] { font-size: 14px; font-weight: 700; }\n.choice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { flex: 1; margin: 0 0 24px; color: var(--signup-muted); font-size: 14px; }\n.features[_ngcontent-%COMP%] { display: grid; gap: 18px; margin: 28px 0 4px; padding: 0; list-style: none; }\n.features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; line-height: 1.5; }\n.features[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { margin-top: 3px; color: var(--signup-accent); }\naside[_ngcontent-%COMP%] { margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--signup-line); }\naside[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; font-size: 16px; letter-spacing: normal; }\naside[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: var(--signup-muted); font-size: 14px; }\na[_ngcontent-%COMP%] { color: inherit; text-underline-offset: 3px; }\n.help-links[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: 20px; color: var(--signup-accent); font-size: 14px; }\n.signup-form[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }\nlabel[_ngcontent-%COMP%], .password-field[_ngcontent-%COMP%] { display: grid; min-width: 0; gap: 8px; font-size: 14px; font-weight: 600; }\ninput[_ngcontent-%COMP%]:not([type=checkbox]) { width: 100%; min-height: 46px; padding: 12px 14px; border: 1px solid var(--signup-line); border-radius: 10px; background: var(--app-dark-surface, #fff); color: inherit; font: inherit; font-weight: 400; }\ninput[aria-invalid=true][_ngcontent-%COMP%] { border-color: var(--app-dark-danger-text, #b42318); }\nsmall[_ngcontent-%COMP%] { color: var(--signup-muted); font-size: 12px; font-weight: 400; line-height: 1.5; }\n.wide[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n.password-input[_ngcontent-%COMP%] { position: relative; }\n.password-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { padding-right: 52px; }\n.password-toggle[_ngcontent-%COMP%] { position: absolute; top: 1px; right: 2px; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 9px; background: transparent; color: var(--signup-muted); cursor: pointer; }\n.password-toggle[_ngcontent-%COMP%]:hover { color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.terms[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; font-weight: 400; }\n.terms[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { flex: 0 0 auto; width: 18px; height: 18px; margin: 2px 0 0; accent-color: var(--signup-accent); }\n.form-note[_ngcontent-%COMP%] { margin: 0; color: var(--signup-muted); font-size: 13px; }\n.actions[_ngcontent-%COMP%] { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }\n.primary[_ngcontent-%COMP%], .secondary[_ngcontent-%COMP%] { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 11px 22px; border: 1px solid var(--signup-line); border-radius: 999px; font: inherit; font-size: 14px; font-weight: 650; line-height: 1.4; text-align: center; text-decoration: none; cursor: pointer; }\n.primary[_ngcontent-%COMP%] { border-color: var(--signup-accent); background: var(--signup-accent); color: var(--app-dark-on-accent, #fff); }\n.primary[_ngcontent-%COMP%]:hover { border-color: var(--app-dark-accent-hover, #125b73); background: var(--app-dark-accent-hover, #125b73); }\n.secondary[_ngcontent-%COMP%] { background: transparent; color: var(--signup-ink); }\n.secondary[_ngcontent-%COMP%]:hover { border-color: var(--signup-accent); background: var(--app-dark-info-bg, #eef6fa); }\n.choice-action[_ngcontent-%COMP%] { width: 100%; font-size: 13px; padding-inline: 10px; }\nbutton[_ngcontent-%COMP%]:disabled { opacity: .5; cursor: default; }\n.field-error[_ngcontent-%COMP%] { color: var(--app-dark-danger-text, #b42318); }\n.error[_ngcontent-%COMP%], .notice[_ngcontent-%COMP%] { padding: 12px 16px; border-radius: 10px; }\n.error[_ngcontent-%COMP%] { background: var(--app-dark-danger-bg, #fff0ed); color: var(--app-dark-danger-text, #b42318); }\n.notice[_ngcontent-%COMP%] { background: var(--app-dark-info-bg, #eef6fa); }\n.sent-actions[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; }\n.text-link[_ngcontent-%COMP%] { padding: 12px; color: var(--signup-accent); }\nfooter[_ngcontent-%COMP%] { margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--signup-line); color: var(--signup-muted); font-size: 13px; }\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { color: var(--signup-accent); font-weight: 600; }\n[_ngcontent-%COMP%]:is(button, a, input):focus-visible { outline: 2px solid var(--signup-accent); outline-offset: 3px; }\n@media (max-width: 640px) {\n  .signup-page[_ngcontent-%COMP%] { padding: 20px 12px; }\n  .signup-panel[_ngcontent-%COMP%] { padding: 24px 18px; }\n  .choices[_ngcontent-%COMP%], .signup-form[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n  .actions[_ngcontent-%COMP%] { flex-wrap: wrap; }\n  .actions[_ngcontent-%COMP%]   .primary[_ngcontent-%COMP%] { flex: 1; }\n  .sent-actions[_ngcontent-%COMP%] { flex-direction: column; align-items: stretch; }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBYztFQUNkLDJDQUEyQztFQUMzQyw4Q0FBOEM7RUFDOUMsOENBQThDO0VBQzlDLGdEQUFnRDtFQUNoRCx3QkFBd0I7RUFDeEIseUVBQXlFO0FBQzNFO0FBQ0EsSUFBSSxzQkFBc0IsRUFBRTtBQUM1QixlQUFlLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLDBDQUEwQyxFQUFFO0FBQ2xHLGdCQUFnQixnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFO0FBQ3JLLFNBQVMsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFO0FBQ3hHLFdBQVcsMkJBQTJCLEVBQUUsa0JBQWtCLEVBQUU7QUFDNUQsS0FBSyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUMsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSx1QkFBdUIsRUFBRTtBQUNwSixLQUFLLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRTtBQUNsSSxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZCLFNBQVMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUU7QUFDekUsV0FBVyxvQkFBb0IsRUFBRSwyQkFBMkIsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDakcsa0JBQWtCLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsa0RBQWtELEVBQUU7QUFDaEssaUNBQWlDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsMEJBQTBCLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFO0FBQ3BTLHVDQUF1Qyx5Q0FBeUMsRUFBRSx3QkFBd0IsRUFBRTtBQUM1RyxXQUFXLGFBQWEsRUFBRSxnREFBZ0QsRUFBRSxTQUFTLEVBQUU7QUFDdkYsVUFBVSxhQUFhLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFO0FBQ3pMLFlBQVksa0NBQWtDLEVBQUUsNENBQTRDLEVBQUU7QUFDOUYsT0FBTyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDMUMsWUFBWSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUUsZUFBZSxFQUFFO0FBQ3BGLFlBQVksYUFBYSxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUU7QUFDeEYsZUFBZSxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNyRyxjQUFjLGVBQWUsRUFBRSwyQkFBMkIsRUFBRTtBQUM1RCxRQUFRLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdDQUF3QyxFQUFFO0FBQ3ZGLFdBQVcsU0FBUyxFQUFFLGVBQWUsRUFBRSxzQkFBc0IsRUFBRTtBQUMvRCxVQUFVLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUN2RCxJQUFJLGNBQWMsRUFBRSwwQkFBMEIsRUFBRTtBQUNoRCxjQUFjLGFBQWEsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLDJCQUEyQixFQUFFLGVBQWUsRUFBRTtBQUN2RyxlQUFlLGFBQWEsRUFBRSxnREFBZ0QsRUFBRSxTQUFTLEVBQUU7QUFDM0YseUJBQXlCLGFBQWEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNuRyw2QkFBNkIsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLG9DQUFvQyxFQUFFLG1CQUFtQixFQUFFLHlDQUF5QyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdk8sMkJBQTJCLGtEQUFrRCxFQUFFO0FBQy9FLFFBQVEsMEJBQTBCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQ3pGLFFBQVEsbUJBQW1CLEVBQUU7QUFDN0Isa0JBQWtCLGtCQUFrQixFQUFFO0FBQ3RDLHdCQUF3QixtQkFBbUIsRUFBRTtBQUM3QyxtQkFBbUIsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUM3Tyx5QkFBeUIsMkJBQTJCLEVBQUUsNENBQTRDLEVBQUU7QUFDcEcsU0FBUyxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQ2hHLGVBQWUsY0FBYyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGtDQUFrQyxFQUFFO0FBQy9HLGFBQWEsU0FBUyxFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUNyRSxXQUFXLGFBQWEsRUFBRSw4QkFBOEIsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFO0FBQ3RGLHVCQUF1QixvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsb0NBQW9DLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUU7QUFDdlUsV0FBVyxrQ0FBa0MsRUFBRSxnQ0FBZ0MsRUFBRSxzQ0FBc0MsRUFBRTtBQUN6SCxpQkFBaUIsbURBQW1ELEVBQUUsaURBQWlELEVBQUU7QUFDekgsYUFBYSx1QkFBdUIsRUFBRSx3QkFBd0IsRUFBRTtBQUNoRSxtQkFBbUIsa0NBQWtDLEVBQUUsNENBQTRDLEVBQUU7QUFDckcsaUJBQWlCLFdBQVcsRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUU7QUFDckUsa0JBQWtCLFdBQVcsRUFBRSxlQUFlLEVBQUU7QUFDaEQsZUFBZSwyQ0FBMkMsRUFBRTtBQUM1RCxrQkFBa0Isa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUU7QUFDM0QsU0FBUyw4Q0FBOEMsRUFBRSwyQ0FBMkMsRUFBRTtBQUN0RyxVQUFVLDRDQUE0QyxFQUFFO0FBQ3hELGdCQUFnQixhQUFhLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtBQUNsRyxhQUFhLGFBQWEsRUFBRSwyQkFBMkIsRUFBRTtBQUN6RCxTQUFTLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdDQUF3QyxFQUFFLDBCQUEwQixFQUFFLGVBQWUsRUFBRTtBQUNySSxXQUFXLDJCQUEyQixFQUFFLGdCQUFnQixFQUFFO0FBQzFELHNDQUFzQyx1Q0FBdUMsRUFBRSxtQkFBbUIsRUFBRTtBQUNwRztFQUNFLGVBQWUsa0JBQWtCLEVBQUU7RUFDbkMsZ0JBQWdCLGtCQUFrQixFQUFFO0VBQ3BDLHlCQUF5QiwwQkFBMEIsRUFBRTtFQUNyRCxXQUFXLGVBQWUsRUFBRTtFQUM1QixvQkFBb0IsT0FBTyxFQUFFO0VBQzdCLGdCQUFnQixzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRTtBQUNoRSIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIC0tc2lnbnVwLWluazogdmFyKC0tYXBwLWRhcmstdGV4dCwgIzE4MzE1Myk7XG4gIC0tc2lnbnVwLW11dGVkOiB2YXIoLS1hcHAtZGFyay1tdXRlZCwgIzY2NzU4ZCk7XG4gIC0tc2lnbnVwLWxpbmU6IHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2RjZTVlZSk7XG4gIC0tc2lnbnVwLWFjY2VudDogdmFyKC0tYXBwLWRhcmstYWNjZW50LCAjMTc2Yjg3KTtcbiAgY29sb3I6IHZhcigtLXNpZ251cC1pbmspO1xuICBmb250LWZhbWlseTogdmFyKC0tZm9udC1mYW1pbHksICdIZWx2ZXRpY2EgTmV1ZScsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYpO1xufVxuKiB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cbi5zaWdudXAtcGFnZSB7IG1pbi1oZWlnaHQ6IDEwMHZoOyBwYWRkaW5nOiA0OHB4IDI0cHg7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtZ3JvdW5kLCAjZjVmOGZiKTsgfVxuLnNpZ251cC1wYW5lbCB7IG1heC13aWR0aDogODQwcHg7IG1hcmdpbjogYXV0bzsgcGFkZGluZzogNDBweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAyMnB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgfVxuLmJyYW5kIHsgZGlzcGxheTogaW5saW5lLWZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTBweDsgZm9udC13ZWlnaHQ6IDcwMDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XG4uYnJhbmQgaSB7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC1zaXplOiAxLjI1cmVtOyB9XG5oMSB7IG1hcmdpbjogMzJweCAwIDEycHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtaW5rKTsgZm9udC1zaXplOiBjbGFtcCgyN3B4LCA0dncsIDM2cHgpOyBmb250LXdlaWdodDogNzAwOyBsaW5lLWhlaWdodDogMS4yOyBsZXR0ZXItc3BhY2luZzogLS4wMjVlbTsgfVxuaDIgeyBtYXJnaW46IDI0cHggMCAxMnB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWluayk7IGZvbnQtc2l6ZTogMjRweDsgZm9udC13ZWlnaHQ6IDY1MDsgbGluZS1oZWlnaHQ6IDEuMjU7IGxldHRlci1zcGFjaW5nOiAtLjAyZW07IH1cbnAgeyBsaW5lLWhlaWdodDogMS42NTsgfVxuLmludHJvIHsgbWF4LXdpZHRoOiA1ODBweDsgbWFyZ2luOiAwIDAgMjhweDsgY29sb3I6IHZhcigtLXNpZ251cC1tdXRlZCk7IH1cbi5leWVicm93IHsgbWFyZ2luOiAzMnB4IDAgLTIwcHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogNjUwOyB9XG4uYWNjb3VudC1zd2l0Y2ggeyBkaXNwbGF5OiBmbGV4OyBtYXgtd2lkdGg6IDMxNnB4OyBtYXJnaW46IDAgYXV0byAyNHB4OyBwYWRkaW5nOiA0cHg7IGJvcmRlci1yYWRpdXM6IDk5OXB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLW11dGVkLCAjZWRmMWY1KTsgfVxuLmFjY291bnQtc3dpdGNoIDppcyhhLCBidXR0b24pIHsgZmxleDogMTsgbWluLWhlaWdodDogMzZweDsgYm9yZGVyOiAwOyBib3JkZXItcmFkaXVzOiA5OTlweDsgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250OiBpbmhlcml0OyBmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiA2MDA7IHRleHQtYWxpZ246IGNlbnRlcjsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBkaXNwbGF5OiBncmlkOyBwbGFjZS1pdGVtczogY2VudGVyOyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5hY2NvdW50LXN3aXRjaCA6aXMoYSwgYnV0dG9uKTpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmZmYpOyBjb2xvcjogdmFyKC0tc2lnbnVwLWluayk7IH1cbi5jaG9pY2VzIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpOyBnYXA6IDIycHg7IH1cbi5jaG9pY2UgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBtaW4td2lkdGg6IDA7IHBhZGRpbmc6IDI0cHggMjBweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAyMHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgfVxuLmJ1c2luZXNzIHsgYm9yZGVyLWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2VlZjZmYSk7IH1cbi50YWcgeyBmb250LXNpemU6IDE0cHg7IGZvbnQtd2VpZ2h0OiA3MDA7IH1cbi5jaG9pY2UgcCB7IGZsZXg6IDE7IG1hcmdpbjogMCAwIDI0cHg7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250LXNpemU6IDE0cHg7IH1cbi5mZWF0dXJlcyB7IGRpc3BsYXk6IGdyaWQ7IGdhcDogMThweDsgbWFyZ2luOiAyOHB4IDAgNHB4OyBwYWRkaW5nOiAwOyBsaXN0LXN0eWxlOiBub25lOyB9XG4uZmVhdHVyZXMgbGkgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogZmxleC1zdGFydDsgZ2FwOiAxMnB4OyBmb250LXNpemU6IDEzcHg7IGxpbmUtaGVpZ2h0OiAxLjU7IH1cbi5mZWF0dXJlcyBpIHsgbWFyZ2luLXRvcDogM3B4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IH1cbmFzaWRlIHsgbWFyZ2luLXRvcDogMjhweDsgcGFkZGluZy10b3A6IDI0cHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1zaWdudXAtbGluZSk7IH1cbmFzaWRlIGgyIHsgbWFyZ2luOiAwOyBmb250LXNpemU6IDE2cHg7IGxldHRlci1zcGFjaW5nOiBub3JtYWw7IH1cbmFzaWRlIHAgeyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgZm9udC1zaXplOiAxNHB4OyB9XG5hIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogM3B4OyB9XG4uaGVscC1saW5rcyB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsgZ2FwOiAyMHB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IGZvbnQtc2l6ZTogMTRweDsgfVxuLnNpZ251cC1mb3JtIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpOyBnYXA6IDIwcHg7IH1cbmxhYmVsLCAucGFzc3dvcmQtZmllbGQgeyBkaXNwbGF5OiBncmlkOyBtaW4td2lkdGg6IDA7IGdhcDogOHB4OyBmb250LXNpemU6IDE0cHg7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cbmlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pIHsgd2lkdGg6IDEwMCU7IG1pbi1oZWlnaHQ6IDQ2cHg7IHBhZGRpbmc6IDEycHggMTRweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiAxMHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTsgY29sb3I6IGluaGVyaXQ7IGZvbnQ6IGluaGVyaXQ7IGZvbnQtd2VpZ2h0OiA0MDA7IH1cbmlucHV0W2FyaWEtaW52YWxpZD10cnVlXSB7IGJvcmRlci1jb2xvcjogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLXRleHQsICNiNDIzMTgpOyB9XG5zbWFsbCB7IGNvbG9yOiB2YXIoLS1zaWdudXAtbXV0ZWQpOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiA0MDA7IGxpbmUtaGVpZ2h0OiAxLjU7IH1cbi53aWRlIHsgZ3JpZC1jb2x1bW46IDEgLyAtMTsgfVxuLnBhc3N3b3JkLWlucHV0IHsgcG9zaXRpb246IHJlbGF0aXZlOyB9XG4ucGFzc3dvcmQtaW5wdXQgaW5wdXQgeyBwYWRkaW5nLXJpZ2h0OiA1MnB4OyB9XG4ucGFzc3dvcmQtdG9nZ2xlIHsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDFweDsgcmlnaHQ6IDJweDsgZGlzcGxheTogZ3JpZDsgcGxhY2UtaXRlbXM6IGNlbnRlcjsgd2lkdGg6IDQ0cHg7IGhlaWdodDogNDRweDsgcGFkZGluZzogMDsgYm9yZGVyOiAwOyBib3JkZXItcmFkaXVzOiA5cHg7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgY3Vyc29yOiBwb2ludGVyOyB9XG4ucGFzc3dvcmQtdG9nZ2xlOmhvdmVyIHsgY29sb3I6IHZhcigtLXNpZ251cC1hY2NlbnQpOyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZWVmNmZhKTsgfVxuLnRlcm1zIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IGdhcDogMTBweDsgbGluZS1oZWlnaHQ6IDEuNTsgZm9udC13ZWlnaHQ6IDQwMDsgfVxuLnRlcm1zIGlucHV0IHsgZmxleDogMCAwIGF1dG87IHdpZHRoOiAxOHB4OyBoZWlnaHQ6IDE4cHg7IG1hcmdpbjogMnB4IDAgMDsgYWNjZW50LWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgfVxuLmZvcm0tbm90ZSB7IG1hcmdpbjogMDsgY29sb3I6IHZhcigtLXNpZ251cC1tdXRlZCk7IGZvbnQtc2l6ZTogMTNweDsgfVxuLmFjdGlvbnMgeyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGdhcDogMTJweDsgbWFyZ2luLXRvcDogOHB4OyB9XG4ucHJpbWFyeSwgLnNlY29uZGFyeSB7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgZ2FwOiA4cHg7IG1pbi1oZWlnaHQ6IDQ0cHg7IHBhZGRpbmc6IDExcHggMjJweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBib3JkZXItcmFkaXVzOiA5OTlweDsgZm9udDogaW5oZXJpdDsgZm9udC1zaXplOiAxNHB4OyBmb250LXdlaWdodDogNjUwOyBsaW5lLWhlaWdodDogMS40OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY3Vyc29yOiBwb2ludGVyOyB9XG4ucHJpbWFyeSB7IGJvcmRlci1jb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IGJhY2tncm91bmQ6IHZhcigtLXNpZ251cC1hY2NlbnQpOyBjb2xvcjogdmFyKC0tYXBwLWRhcmstb24tYWNjZW50LCAjZmZmKTsgfVxuLnByaW1hcnk6aG92ZXIgeyBib3JkZXItY29sb3I6IHZhcigtLWFwcC1kYXJrLWFjY2VudC1ob3ZlciwgIzEyNWI3Myk7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWFjY2VudC1ob3ZlciwgIzEyNWI3Myk7IH1cbi5zZWNvbmRhcnkgeyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgY29sb3I6IHZhcigtLXNpZ251cC1pbmspOyB9XG4uc2Vjb25kYXJ5OmhvdmVyIHsgYm9yZGVyLWNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2VlZjZmYSk7IH1cbi5jaG9pY2UtYWN0aW9uIHsgd2lkdGg6IDEwMCU7IGZvbnQtc2l6ZTogMTNweDsgcGFkZGluZy1pbmxpbmU6IDEwcHg7IH1cbmJ1dHRvbjpkaXNhYmxlZCB7IG9wYWNpdHk6IC41OyBjdXJzb3I6IGRlZmF1bHQ7IH1cbi5maWVsZC1lcnJvciB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1kYW5nZXItdGV4dCwgI2I0MjMxOCk7IH1cbi5lcnJvciwgLm5vdGljZSB7IHBhZGRpbmc6IDEycHggMTZweDsgYm9yZGVyLXJhZGl1czogMTBweDsgfVxuLmVycm9yIHsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLWJnLCAjZmZmMGVkKTsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYjQyMzE4KTsgfVxuLm5vdGljZSB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNlZWY2ZmEpOyB9XG4uc2VudC1hY3Rpb25zIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEycHg7IG1hcmdpbi10b3A6IDI0cHg7IH1cbi50ZXh0LWxpbmsgeyBwYWRkaW5nOiAxMnB4OyBjb2xvcjogdmFyKC0tc2lnbnVwLWFjY2VudCk7IH1cbmZvb3RlciB7IG1hcmdpbi10b3A6IDMycHg7IHBhZGRpbmctdG9wOiAyMHB4OyBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tc2lnbnVwLWxpbmUpOyBjb2xvcjogdmFyKC0tc2lnbnVwLW11dGVkKTsgZm9udC1zaXplOiAxM3B4OyB9XG5mb290ZXIgYSB7IGNvbG9yOiB2YXIoLS1zaWdudXAtYWNjZW50KTsgZm9udC13ZWlnaHQ6IDYwMDsgfVxuOmlzKGJ1dHRvbiwgYSwgaW5wdXQpOmZvY3VzLXZpc2libGUgeyBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tc2lnbnVwLWFjY2VudCk7IG91dGxpbmUtb2Zmc2V0OiAzcHg7IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xuICAuc2lnbnVwLXBhZ2UgeyBwYWRkaW5nOiAyMHB4IDEycHg7IH1cbiAgLnNpZ251cC1wYW5lbCB7IHBhZGRpbmc6IDI0cHggMThweDsgfVxuICAuY2hvaWNlcywgLnNpZ251cC1mb3JtIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cbiAgLmFjdGlvbnMgeyBmbGV4LXdyYXA6IHdyYXA7IH1cbiAgLmFjdGlvbnMgLnByaW1hcnkgeyBmbGV4OiAxOyB9XG4gIC5zZW50LWFjdGlvbnMgeyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogc3RyZXRjaDsgfVxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_signup_signup_component_ts.js.map