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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/password */ 41188);










function IoTOwnerRegisterComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "SMART HOME");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "h1", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Check your email");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 5)(5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " If the address can be registered, we sent a verification link. Open it to activate your account, then sign in. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IoTOwnerRegisterComponent_Conditional_2_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.goToLogin());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IoTOwnerRegisterComponent_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "p-message", 7);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("text", ctx_r1.errorMessage());
  }
}
function IoTOwnerRegisterComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "SMART HOME \u00B7 PERSONAL ACCOUNT");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "h1", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Create your home account");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, " Your residence stays under your account. No condominium administrator is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](6, IoTOwnerRegisterComponent_Conditional_3_Conditional_6_Template, 1, 1, "p-message", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "form", 8, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function IoTOwnerRegisterComponent_Conditional_3_Template_form_ngSubmit_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.submit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "label", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, "First name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "input", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("name", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "label", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Last name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("lastname", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("email", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19, "Phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_20_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("phone", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "p-password", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_p_password_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("password", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "label", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](25, "Residence name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IoTOwnerRegisterComponent_Conditional_3_Template_input_ngModelChange_26_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.update("residenceLabel", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](27, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const registerForm_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](8);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx_r1.errorMessage() ? 6 : -1);
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
function payloadOf(response) {
  return response.data ?? response;
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
      next: () => this.submitted.set(true),
      error: error => this.errorMessage.set(error.error?.message || 'Registration is unavailable. Try again later.')
    });
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
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
      consts: [["registerForm", "ngForm"], [1, "register-page"], ["aria-labelledby", "register-title", 1, "register-panel"], [1, "register-eyebrow"], ["id", "register-title"], ["role", "status", 1, "register-success"], ["pButton", "", "type", "button", "label", "Back to sign in", "icon", "pi pi-arrow-left", 3, "click"], ["severity", "error", 3, "text"], [1, "register-form", 3, "ngSubmit"], ["for", "owner-name", 1, "half"], ["pInputText", "", "id", "owner-name", "name", "name", "required", "", "maxlength", "100", 1, "half", 3, "ngModelChange", "ngModel"], ["for", "owner-lastname", 1, "half"], ["pInputText", "", "id", "owner-lastname", "name", "lastname", "required", "", "maxlength", "100", 1, "half", 3, "ngModelChange", "ngModel"], ["for", "owner-email"], ["pInputText", "", "id", "owner-email", "name", "email", "type", "email", "required", "", "email", "", "autocomplete", "email", 3, "ngModelChange", "ngModel"], ["for", "owner-phone"], ["pInputText", "", "id", "owner-phone", "name", "phone", "type", "tel", "required", "", "pattern", "^\\+?[0-9]{8,16}$", "autocomplete", "tel", 3, "ngModelChange", "ngModel"], ["for", "owner-password"], ["inputId", "owner-password", "name", "password", "required", "", "minlength", "12", "autocomplete", "new-password", 3, "ngModelChange", "toggleMask", "feedback", "ngModel"], ["for", "residence-label"], ["pInputText", "", "id", "residence-label", "name", "residenceLabel", "required", "", "maxlength", "100", "placeholder", "Home, beach apartment\u2026", 3, "ngModelChange", "ngModel"], ["pButton", "", "type", "submit", "icon", "pi pi-arrow-right", "iconPos", "right", "label", "Create account", 3, "loading", "disabled"]],
      template: function IoTOwnerRegisterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "main", 1)(1, "section", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditionalCreate"](2, IoTOwnerRegisterComponent_Conditional_2_Template, 8, 0)(3, IoTOwnerRegisterComponent_Conditional_3_Template, 28, 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵconditional"](ctx.submitted() ? 2 : 3);
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_6__.ButtonDirective, primeng_inputtext__WEBPACK_IMPORTED_MODULE_7__.InputText, primeng_message__WEBPACK_IMPORTED_MODULE_8__.Message, primeng_password__WEBPACK_IMPORTED_MODULE_9__.Password],
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/password */ 41188);
/* harmony import */ var _iot_owner_register_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./iot-owner-register.component */ 78572);
/* harmony import */ var _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./iot-owner-register-routing.module */ 91986);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 94975);









class IoTOwnerRegisterModule {
  static {
    this.ɵfac = function IoTOwnerRegisterModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTOwnerRegisterModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: IoTOwnerRegisterModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_2__.ButtonModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_3__.InputTextModule, primeng_message__WEBPACK_IMPORTED_MODULE_4__.MessageModule, primeng_password__WEBPACK_IMPORTED_MODULE_5__.PasswordModule, _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_7__.IoTOwnerRegisterRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](IoTOwnerRegisterModule, {
    declarations: [_iot_owner_register_component__WEBPACK_IMPORTED_MODULE_6__.IoTOwnerRegisterComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_2__.ButtonModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_3__.InputTextModule, primeng_message__WEBPACK_IMPORTED_MODULE_4__.MessageModule, primeng_password__WEBPACK_IMPORTED_MODULE_5__.PasswordModule, _iot_owner_register_routing_module__WEBPACK_IMPORTED_MODULE_7__.IoTOwnerRegisterRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_iot-owner-register_iot-owner-register_module_ts.js.map