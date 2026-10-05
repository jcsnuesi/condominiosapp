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
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3, "Loading\u2026");
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
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6, "Create your first condominium");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, "Register its address and management details.");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](9, "p-tag", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](10, "p-button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "li")(12, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](13, "02");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "div", 9)(15, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](16, "Register its units");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](17, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](18, " Set up the apartments or homes that belong to the condominium. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](19, "p-tag", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](20, "p-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](21, "li")(22, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](23, "03");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](24, "div", 9)(25, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](26, "Create access for your owners");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](27, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](28, " Assign a condominium and unit to each owner. They will receive their login credentials by email. ");
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
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](35, " You can return to this guide from \u201CGetting started\u201D in the menu until you finish setup. Your progress is saved as you create each record. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const setup_r3 = ctx;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.condominiumCount ? "success" : "secondary")("value", setup_r3.condominiumCount ? setup_r3.condominiumCount + " registered" : "Pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.unitCount ? "success" : "secondary")("value", setup_r3.unitCount ? setup_r3.unitCount + " registered" : "Pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](14, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](16, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("severity", setup_r3.ownerCount ? "success" : "secondary")("value", setup_r3.ownerCount ? setup_r3.ownerCount + " registered" : "Pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("routerLink", setup_r3.firstCondominiumId ? _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](17, _c0, setup_r3.firstCondominiumId) : _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction0"](19, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("outlined", true)("disabled", ctx_r0.loading());
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r0.loading())("label", setup_r3.condominiumCount && setup_r3.unitCount && setup_r3.ownerCount ? "Finish setup" : "Continue and set up later");
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
      error: () => this.error.set('We could not load your progress. Please try again.')
    });
  }
  finish() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.http.post(`${_service_global_service__WEBPACK_IMPORTED_MODULE_9__.global.url}organization/onboarding/complete`, {}).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.switchMap)(() => this.access.refresh()), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.finalize)(() => this.loading.set(false))).subscribe({
      next: () => this.router.navigate(['/start', this.user.getIdentity()._id]),
      error: _error => this.error.set('We could not save your progress. Please try again.')
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
      consts: [["aria-labelledby", "setup-title", 1, "card", "app-page-card", "onboarding"], [1, "app-page-header"], [1, "app-page-kicker"], ["id", "setup-title"], ["role", "alert", 1, "error"], ["role", "status", 1, "onboarding-loading"], ["label", "Try again", "icon", "pi pi-refresh", "styleClass", "onboarding-primary-action"], ["strokeWidth", "5", "ariaLabel", "Loading progress"], [1, "number"], [1, "step-content"], [3, "severity", "value"], ["routerLink", "/create-property", "label", "Create condominium", "icon", "pi pi-plus", "styleClass", "onboarding-primary-action"], ["label", "Manage units", "icon", "pi pi-arrow-right", "iconPos", "right", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "outlined", "routerLink"], ["label", "Manage owners", "icon", "pi pi-arrow-right", "iconPos", "right", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "outlined", "routerLink"], [1, "actions"], ["label", "Refresh progress", "icon", "pi pi-refresh", "severity", "secondary", "styleClass", "onboarding-secondary-action", 3, "onClick", "outlined", "disabled"], ["styleClass", "onboarding-primary-action", "icon", "pi pi-check", 3, "onClick", "disabled", "label"], [1, "hint"], ["label", "Try again", "icon", "pi pi-refresh", "styleClass", "onboarding-primary-action", 3, "onClick"]],
      template: function OrganizationOnboardingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "section", 0)(1, "div", 1)(2, "div")(3, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4, "GETTING STARTED \u00B7 ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8, " Your account is ready. Follow these steps to start managing your condominiums. ");
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
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" Set up ", ((tmp_1_0 = ctx.status()) == null ? null : tmp_1_0.name) || "your organization", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"](ctx.error() ? 9 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"](ctx.loading() ? 10 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵconditional"]((tmp_4_0 = ctx.status()) ? 11 : !ctx.loading() ? 12 : -1, tmp_4_0);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, primeng_button__WEBPACK_IMPORTED_MODULE_6__.ButtonModule, primeng_button__WEBPACK_IMPORTED_MODULE_6__.Button, primeng_tag__WEBPACK_IMPORTED_MODULE_7__.TagModule, primeng_tag__WEBPACK_IMPORTED_MODULE_7__.Tag, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_8__.ProgressSpinnerModule, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_8__.ProgressSpinner],
      styles: ["[_nghost-%COMP%] {\n    display: block;\n    min-width: 0;\n    --onboarding-ink: var(--app-dark-text, #183153);\n    --onboarding-muted: var(--app-dark-muted, #66758d);\n    --onboarding-line: var(--app-dark-border, #dce5ee);\n    --onboarding-primary: var(--app-dark-accent, #176b87);\n}\n\n.onboarding[_ngcontent-%COMP%] {\n    color: var(--onboarding-ink);\n    border: 1px solid var(--onboarding-line);\n    border-radius: 18px;\n    background: var(--app-dark-surface, #fff);\n    padding: 1.6rem;\n    box-shadow: none;\n}\n\n.app-page-header[_ngcontent-%COMP%] { align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }\n.app-page-kicker[_ngcontent-%COMP%] {\n    color: var(--onboarding-primary);\n    font-size: .72rem;\n    font-weight: 800;\n    letter-spacing: .1em;\n    text-transform: uppercase;\n}\nh1[_ngcontent-%COMP%] {\n    margin: .3rem 0 .4rem;\n    color: var(--onboarding-ink);\n    font-size: clamp(1.65rem, 3vw, 2.35rem);\n    line-height: 1.1;\n    letter-spacing: -.035em;\n    overflow-wrap: anywhere;\n}\nh2[_ngcontent-%COMP%] {\n    margin: 0;\n    color: var(--onboarding-ink);\n    font-size: 1.15rem;\n    font-weight: 700;\n    overflow-wrap: anywhere;\n}\np[_ngcontent-%COMP%] { color: var(--onboarding-muted); line-height: 1.5; }\n.app-page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; }\nol[_ngcontent-%COMP%] { display: grid; gap: 1rem; list-style: none; padding: 0; margin: 0 0 1.5rem; }\nli[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 3rem minmax(0, 1fr) auto;\n    align-items: center;\n    gap: .75rem;\n    padding: 1.15rem;\n    border: 1px solid var(--onboarding-line);\n    border-radius: 16px;\n    background: var(--app-dark-surface, #fff);\n}\n.number[_ngcontent-%COMP%] {\n    display: grid;\n    place-items: center;\n    width: 3rem;\n    height: 3rem;\n    border: 1px solid var(--app-dark-border, #cddae6);\n    border-radius: 50%;\n    color: var(--app-dark-accent, #105d76);\n    background: var(--app-dark-info-bg, #e8f2f5);\n    font-size: .9rem;\n    font-weight: 700;\n}\n.step-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: .5rem 0 .75rem; font-size: .85rem; }\n[_nghost-%COMP%]     .onboarding .p-tag {\n    border-radius: 999px;\n    padding: .3rem .6rem;\n    font-size: .75rem;\n    font-weight: 750;\n}\n[_nghost-%COMP%]     .onboarding .p-tag-success { background: var(--app-dark-success-bg, #e9f8f2); color: var(--app-dark-success-text, #08785d); }\n[_nghost-%COMP%]     .onboarding .p-tag-secondary { background: var(--app-dark-info-bg, #f5f8fb); color: var(--onboarding-muted); }\n[_nghost-%COMP%]     .onboarding-primary-action, \n[_nghost-%COMP%]     .onboarding-secondary-action {\n    min-height: 44px;\n    border-radius: 10px;\n    box-shadow: none;\n}\n[_nghost-%COMP%]     .onboarding-primary-action {\n    background: var(--onboarding-primary);\n    border-color: var(--onboarding-primary);\n    color: var(--app-dark-on-accent, #fff);\n    font-weight: 700;\n}\n[_nghost-%COMP%]     .onboarding-primary-action:not(:disabled):hover { background: var(--app-dark-accent-hover, #125b73); border-color: var(--app-dark-border, #125b73); }\n[_nghost-%COMP%]     .onboarding-secondary-action {\n    color: var(--onboarding-primary);\n    border-color: var(--onboarding-line);\n    background: var(--app-dark-surface, #fff);\n    font-weight: 650;\n}\n[_nghost-%COMP%]     .onboarding-secondary-action:not(:disabled):hover { background: var(--app-dark-info-bg, #f1f5f8); }\n[_nghost-%COMP%]     .onboarding .p-button:focus-visible { outline: 2px solid var(--onboarding-primary); outline-offset: 2px; }\n.actions[_ngcontent-%COMP%] {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: space-between;\n    gap: 1rem;\n    padding-top: 1rem;\n    border-top: 1px solid var(--app-dark-border, #edf1f5);\n}\n.hint[_ngcontent-%COMP%] { margin: 1rem 0 0; font-size: .8rem; }\n.error[_ngcontent-%COMP%] {\n    color: var(--app-dark-danger-text, #b42318);\n    background: var(--app-dark-danger-bg, #fff8f7);\n    border: 1px solid var(--app-dark-border, #f0d1cc);\n    border-radius: 10px;\n    padding: .9rem 1rem;\n}\n.onboarding-loading[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: .75rem;\n    margin-bottom: 1rem;\n    color: var(--onboarding-muted);\n    font-size: .85rem;\n}\n[_nghost-%COMP%]     .onboarding-loading .p-progressspinner { width: 2rem; height: 2rem; }\n@media (max-width: 900px) {\n    li[_ngcontent-%COMP%] { grid-template-columns: 3rem minmax(0, 1fr); }\n    li[_ngcontent-%COMP%]    > p-button[_ngcontent-%COMP%] { grid-column: 2; }\n}\n@media (max-width: 680px) {\n    .onboarding[_ngcontent-%COMP%] { padding: 1rem; }\n    li[_ngcontent-%COMP%] { padding: .9rem; align-items: start; }\n    .actions[_ngcontent-%COMP%] { flex-direction: column; }\n    [_nghost-%COMP%]     .onboarding p-button, \n   [_nghost-%COMP%]     .onboarding .p-button { width: 100%; justify-content: center; }\n    [_nghost-%COMP%]     .onboarding .p-button-label { white-space: normal; }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nL29yZ2FuaXphdGlvbi1vbmJvYXJkaW5nLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxjQUFjO0lBQ2QsWUFBWTtJQUNaLCtDQUErQztJQUMvQyxrREFBa0Q7SUFDbEQsa0RBQWtEO0lBQ2xELHFEQUFxRDtBQUN6RDs7QUFFQTtJQUNJLDRCQUE0QjtJQUM1Qix3Q0FBd0M7SUFDeEMsbUJBQW1CO0lBQ25CLHlDQUF5QztJQUN6QyxlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCOztBQUVBLG1CQUFtQixtQkFBbUIsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUU7QUFDN0U7SUFDSSxnQ0FBZ0M7SUFDaEMsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixvQkFBb0I7SUFDcEIseUJBQXlCO0FBQzdCO0FBQ0E7SUFDSSxxQkFBcUI7SUFDckIsNEJBQTRCO0lBQzVCLHVDQUF1QztJQUN2QyxnQkFBZ0I7SUFDaEIsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtBQUMzQjtBQUNBO0lBQ0ksU0FBUztJQUNULDRCQUE0QjtJQUM1QixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtBQUMzQjtBQUNBLElBQUksOEJBQThCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdEQscUJBQXFCLFNBQVMsRUFBRTtBQUNoQyxLQUFLLGFBQWEsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFO0FBQ2pGO0lBQ0ksYUFBYTtJQUNiLCtDQUErQztJQUMvQyxtQkFBbUI7SUFDbkIsV0FBVztJQUNYLGdCQUFnQjtJQUNoQix3Q0FBd0M7SUFDeEMsbUJBQW1CO0lBQ25CLHlDQUF5QztBQUM3QztBQUNBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsWUFBWTtJQUNaLGlEQUFpRDtJQUNqRCxrQkFBa0I7SUFDbEIsc0NBQXNDO0lBQ3RDLDRDQUE0QztJQUM1QyxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0FBQ3BCO0FBQ0Esa0JBQWtCLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFO0FBQzdEO0lBQ0ksb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixpQkFBaUI7SUFDakIsZ0JBQWdCO0FBQ3BCO0FBQ0EsNkNBQTZDLCtDQUErQyxFQUFFLDRDQUE0QyxFQUFFO0FBQzVJLCtDQUErQyw0Q0FBNEMsRUFBRSw4QkFBOEIsRUFBRTtBQUM3SDs7SUFFSSxnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0kscUNBQXFDO0lBQ3JDLHVDQUF1QztJQUN2QyxzQ0FBc0M7SUFDdEMsZ0JBQWdCO0FBQ3BCO0FBQ0Esa0VBQWtFLGlEQUFpRCxFQUFFLDZDQUE2QyxFQUFFO0FBQ3BLO0lBQ0ksZ0NBQWdDO0lBQ2hDLG9DQUFvQztJQUNwQyx5Q0FBeUM7SUFDekMsZ0JBQWdCO0FBQ3BCO0FBQ0Esb0VBQW9FLDRDQUE0QyxFQUFFO0FBQ2xILHNEQUFzRCw0Q0FBNEMsRUFBRSxtQkFBbUIsRUFBRTtBQUN6SDtJQUNJLGFBQWE7SUFDYixlQUFlO0lBQ2YsOEJBQThCO0lBQzlCLFNBQVM7SUFDVCxpQkFBaUI7SUFDakIscURBQXFEO0FBQ3pEO0FBQ0EsUUFBUSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRTtBQUM1QztJQUNJLDJDQUEyQztJQUMzQyw4Q0FBOEM7SUFDOUMsaURBQWlEO0lBQ2pELG1CQUFtQjtJQUNuQixtQkFBbUI7QUFDdkI7QUFDQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsV0FBVztJQUNYLG1CQUFtQjtJQUNuQiw4QkFBOEI7SUFDOUIsaUJBQWlCO0FBQ3JCO0FBQ0EseURBQXlELFdBQVcsRUFBRSxZQUFZLEVBQUU7QUFDcEY7SUFDSSxLQUFLLDBDQUEwQyxFQUFFO0lBQ2pELGdCQUFnQixjQUFjLEVBQUU7QUFDcEM7QUFDQTtJQUNJLGNBQWMsYUFBYSxFQUFFO0lBQzdCLEtBQUssY0FBYyxFQUFFLGtCQUFrQixFQUFFO0lBQ3pDLFdBQVcsc0JBQXNCLEVBQUU7SUFDbkM7NENBQ3dDLFdBQVcsRUFBRSx1QkFBdUIsRUFBRTtJQUM5RSw4Q0FBOEMsbUJBQW1CLEVBQUU7QUFDdkUiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWluLXdpZHRoOiAwO1xuICAgIC0tb25ib2FyZGluZy1pbms6IHZhcigtLWFwcC1kYXJrLXRleHQsICMxODMxNTMpO1xuICAgIC0tb25ib2FyZGluZy1tdXRlZDogdmFyKC0tYXBwLWRhcmstbXV0ZWQsICM2Njc1OGQpO1xuICAgIC0tb25ib2FyZGluZy1saW5lOiB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICNkY2U1ZWUpO1xuICAgIC0tb25ib2FyZGluZy1wcmltYXJ5OiB2YXIoLS1hcHAtZGFyay1hY2NlbnQsICMxNzZiODcpO1xufVxuXG4ub25ib2FyZGluZyB7XG4gICAgY29sb3I6IHZhcigtLW9uYm9hcmRpbmctaW5rKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1vbmJvYXJkaW5nLWxpbmUpO1xuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstc3VyZmFjZSwgI2ZmZik7XG4gICAgcGFkZGluZzogMS42cmVtO1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG59XG5cbi5hcHAtcGFnZS1oZWFkZXIgeyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEuMjVyZW07IG1hcmdpbi1ib3R0b206IDEuNXJlbTsgfVxuLmFwcC1wYWdlLWtpY2tlciB7XG4gICAgY29sb3I6IHZhcigtLW9uYm9hcmRpbmctcHJpbWFyeSk7XG4gICAgZm9udC1zaXplOiAuNzJyZW07XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLjFlbTtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuaDEge1xuICAgIG1hcmdpbjogLjNyZW0gMCAuNHJlbTtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1pbmspO1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS42NXJlbSwgM3Z3LCAyLjM1cmVtKTtcbiAgICBsaW5lLWhlaWdodDogMS4xO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAzNWVtO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxuaDIge1xuICAgIG1hcmdpbjogMDtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1pbmspO1xuICAgIGZvbnQtc2l6ZTogMS4xNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xufVxucCB7IGNvbG9yOiB2YXIoLS1vbmJvYXJkaW5nLW11dGVkKTsgbGluZS1oZWlnaHQ6IDEuNTsgfVxuLmFwcC1wYWdlLWhlYWRlciBwIHsgbWFyZ2luOiAwOyB9XG5vbCB7IGRpc3BsYXk6IGdyaWQ7IGdhcDogMXJlbTsgbGlzdC1zdHlsZTogbm9uZTsgcGFkZGluZzogMDsgbWFyZ2luOiAwIDAgMS41cmVtOyB9XG5saSB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDNyZW0gbWlubWF4KDAsIDFmcikgYXV0bztcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogLjc1cmVtO1xuICAgIHBhZGRpbmc6IDEuMTVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tb25ib2FyZGluZy1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1cmZhY2UsICNmZmYpO1xufVxuLm51bWJlciB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAzcmVtO1xuICAgIGhlaWdodDogM3JlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICNjZGRhZTYpO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBjb2xvcjogdmFyKC0tYXBwLWRhcmstYWNjZW50LCAjMTA1ZDc2KTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZThmMmY1KTtcbiAgICBmb250LXNpemU6IC45cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG4uc3RlcC1jb250ZW50IHAgeyBtYXJnaW46IC41cmVtIDAgLjc1cmVtOyBmb250LXNpemU6IC44NXJlbTsgfVxuOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nIC5wLXRhZyB7XG4gICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gICAgcGFkZGluZzogLjNyZW0gLjZyZW07XG4gICAgZm9udC1zaXplOiAuNzVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDc1MDtcbn1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyAucC10YWctc3VjY2VzcyB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1Y2Nlc3MtYmcsICNlOWY4ZjIpOyBjb2xvcjogdmFyKC0tYXBwLWRhcmstc3VjY2Vzcy10ZXh0LCAjMDg3ODVkKTsgfVxuOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nIC5wLXRhZy1zZWNvbmRhcnkgeyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZjVmOGZiKTsgY29sb3I6IHZhcigtLW9uYm9hcmRpbmctbXV0ZWQpOyB9XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctcHJpbWFyeS1hY3Rpb24sXG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctc2Vjb25kYXJ5LWFjdGlvbiB7XG4gICAgbWluLWhlaWdodDogNDRweDtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG59XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctcHJpbWFyeS1hY3Rpb24ge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLW9uYm9hcmRpbmctcHJpbWFyeSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1vbmJvYXJkaW5nLXByaW1hcnkpO1xuICAgIGNvbG9yOiB2YXIoLS1hcHAtZGFyay1vbi1hY2NlbnQsICNmZmYpO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctcHJpbWFyeS1hY3Rpb246bm90KDpkaXNhYmxlZCk6aG92ZXIgeyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1hY2NlbnQtaG92ZXIsICMxMjViNzMpOyBib3JkZXItY29sb3I6IHZhcigtLWFwcC1kYXJrLWJvcmRlciwgIzEyNWI3Myk7IH1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1zZWNvbmRhcnktYWN0aW9uIHtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1wcmltYXJ5KTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLW9uYm9hcmRpbmctbGluZSk7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstc3VyZmFjZSwgI2ZmZik7XG4gICAgZm9udC13ZWlnaHQ6IDY1MDtcbn1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZy1zZWNvbmRhcnktYWN0aW9uOm5vdCg6ZGlzYWJsZWQpOmhvdmVyIHsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2YxZjVmOCk7IH1cbjpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyAucC1idXR0b246Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1vbmJvYXJkaW5nLXByaW1hcnkpOyBvdXRsaW5lLW9mZnNldDogMnB4OyB9XG4uYWN0aW9ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGdhcDogMXJlbTtcbiAgICBwYWRkaW5nLXRvcDogMXJlbTtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tYXBwLWRhcmstYm9yZGVyLCAjZWRmMWY1KTtcbn1cbi5oaW50IHsgbWFyZ2luOiAxcmVtIDAgMDsgZm9udC1zaXplOiAuOHJlbTsgfVxuLmVycm9yIHtcbiAgICBjb2xvcjogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLXRleHQsICNiNDIzMTgpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWRhbmdlci1iZywgI2ZmZjhmNyk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBwLWRhcmstYm9yZGVyLCAjZjBkMWNjKTtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIHBhZGRpbmc6IC45cmVtIDFyZW07XG59XG4ub25ib2FyZGluZy1sb2FkaW5nIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAuNzVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICBjb2xvcjogdmFyKC0tb25ib2FyZGluZy1tdXRlZCk7XG4gICAgZm9udC1zaXplOiAuODVyZW07XG59XG46aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmctbG9hZGluZyAucC1wcm9ncmVzc3NwaW5uZXIgeyB3aWR0aDogMnJlbTsgaGVpZ2h0OiAycmVtOyB9XG5AbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcbiAgICBsaSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogM3JlbSBtaW5tYXgoMCwgMWZyKTsgfVxuICAgIGxpID4gcC1idXR0b24geyBncmlkLWNvbHVtbjogMjsgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDY4MHB4KSB7XG4gICAgLm9uYm9hcmRpbmcgeyBwYWRkaW5nOiAxcmVtOyB9XG4gICAgbGkgeyBwYWRkaW5nOiAuOXJlbTsgYWxpZ24taXRlbXM6IHN0YXJ0OyB9XG4gICAgLmFjdGlvbnMgeyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9XG4gICAgOmhvc3QgOjpuZy1kZWVwIC5vbmJvYXJkaW5nIHAtYnV0dG9uLFxuICAgIDpob3N0IDo6bmctZGVlcCAub25ib2FyZGluZyAucC1idXR0b24geyB3aWR0aDogMTAwJTsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cbiAgICA6aG9zdCA6Om5nLWRlZXAgLm9uYm9hcmRpbmcgLnAtYnV0dG9uLWxhYmVsIHsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_organization-onboarding_organization-onboarding_component_ts.js.map