"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_finance_finance_component_ts"],{

/***/ 97947
/*!**************************************************************!*\
  !*** ./src/app/demo/components/finance/finance.component.ts ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FinanceComponent: () => (/* binding */ FinanceComponent)
/* harmony export */ });
/* harmony import */ var C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.29.2/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 24024);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_textarea__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/textarea */ 80397);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 21288);
/* harmony import */ var _service_finance_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../service/finance.service */ 44795);
/* harmony import */ var _service_bank_reconciliation_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../service/bank-reconciliation.service */ 61713);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 58440);



















const _forTrack0 = ($index, $item) => $item._id;
const _forTrack1 = ($index, $item) => $item.id;
const _forTrack2 = ($index, $item) => $item.currency;
const _forTrack3 = ($index, $item) => $item.ownerId + $item.unitNumber;
const _forTrack4 = ($index, $item) => $item.month + $item.kind + $item.category;
function FinanceComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.error());
  }
}
function FinanceComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.notice());
  }
}
function FinanceComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const condo_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", condo_r2._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](condo_r2.alias);
  }
}
function FinanceComponent_For_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_For_26_Template_button_click_0_listener() {
      const item_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.switchTab(item_r4.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵclassProp"]("active", ctx_r0.tab === item_r4.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵattribute"]("aria-current", ctx_r0.tab === item_r4.id ? "page" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", item_r4.label, " ");
  }
}
function FinanceComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "No condominiums are available within your scope.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Finance is not yet enabled for this condominium. An administrator can enable it after reviewing the data and balances. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_29_For_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "article")(1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](5, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](8, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](11, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](12, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](14, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](17, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](20, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const total_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](total_r6.currency);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](5, 7, total_r6.amountMinor / 100, total_r6.currency));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" Current: ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](8, 10, total_r6.buckets["current"] / 100, total_r6.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" 1\u201330 days: ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](11, 13, total_r6.buckets["1-30"] / 100, total_r6.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" 31\u201360 days: ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](14, 16, total_r6.buckets["31-60"] / 100, total_r6.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" 61\u201390 days: ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](17, 19, total_r6.buckets["61-90"] / 100, total_r6.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" Over 90 days: ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](20, 22, total_r6.buckets["90+"] / 100, total_r6.currency), " ");
  }
}
function FinanceComponent_Conditional_29_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Action");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_29_For_26_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "td")(1, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_29_For_26_Conditional_15_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const invoice_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.selectInvoice(invoice_r8));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, " Apply adjustment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_29_For_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](9, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](12, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](15, FinanceComponent_Conditional_29_For_26_Conditional_15_Template, 3, 1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const invoice_r8 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](invoice_r8.invoice_number);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](invoice_r8.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.chargeLabel(invoice_r8.chargeType));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind3"](9, 7, invoice_r8.dueDate, "dd/MM/yyyy", "UTC"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](12, 11, invoice_r8.balancePending, invoice_r8.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.bucketLabel(invoice_r8.bucket));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 15 : -1);
  }
}
function FinanceComponent_Conditional_29_ForEmpty_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, "No outstanding debt.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
}
function FinanceComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Accounts receivable");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](3, FinanceComponent_Conditional_29_For_4_Template, 21, 25, "article", null, _forTrack2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_29_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.export("receivables"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6, " Export CSV ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "div", 24)(8, "table")(9, "thead")(10, "tr")(11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, "Invoice");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Unit");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, "Due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, "Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](21, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](22, "Aging");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](23, FinanceComponent_Conditional_29_Conditional_23_Template, 2, 0, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](24, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](25, FinanceComponent_Conditional_29_For_26_Template, 16, 14, "tr", null, _forTrack0, false, FinanceComponent_Conditional_29_ForEmpty_27_Template, 3, 0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](28, "div", 25)(29, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_29_Template_button_click_29_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("receivables", -1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](30, " Previous");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](31, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_29_Template_button_click_33_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("receivables", 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](34, " Next ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.totals());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 23 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.invoices());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.receivablePage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("Page ", ctx_r0.receivablePage, " \u00B7 ", ctx_r0.receivableTotal, " invoices");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.receivablePage * 50 >= ctx_r0.receivableTotal);
  }
}
function FinanceComponent_Conditional_30_Conditional_0_For_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td")(2, "input", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_For_47_Template_input_ngModelChange_2_listener($event) {
      const unit_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10).$implicit;
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](unit_r11.selected, $event) || (unit_r11.selected = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td")(8, "input", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_For_47_Template_input_ngModelChange_8_listener($event) {
      const unit_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10).$implicit;
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](unit_r11.amount, $event) || (unit_r11.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const unit_r11 = ctx.$implicit;
    const $index_r12 = ctx.$index;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("name", "selected-" + $index_r12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", unit_r11.selected);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵattribute"]("aria-label", "Select unit " + unit_r11.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](unit_r11.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](unit_r11.ownerName);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("name", "amount-" + $index_r12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", unit_r11.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵattribute"]("aria-label", "Unit amount " + unit_r11.unitNumber);
  }
}
function FinanceComponent_Conditional_30_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Issue charges");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "form", 28, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_30_Conditional_0_Template_form_ngSubmit_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveCharges());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "fieldset", 29)(5, "div", 30)(6, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](8, "select", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_Template_select_ngModelChange_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.charge.chargeType, $event) || (ctx_r0.charge.chargeType = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "option", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, "Monthly fee");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, " Special assessment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Individual charge");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "option", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Fine");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, "Issue date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "input", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_Template_input_ngModelChange_19_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.charge.issueDate, $event) || (ctx_r0.charge.issueDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](20, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](21, "Due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_Template_input_ngModelChange_22_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.charge.dueDate, $event) || (ctx_r0.charge.dueDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](23, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](24, "Equal amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_Template_input_ngModelChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.charge.amount, $event) || (ctx_r0.charge.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](26, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_30_Conditional_0_Template_button_click_26_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.equalAmounts());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](27, " Copy amount to units ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](28, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](29, "Description or reason");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](30, "textarea", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_0_Template_textarea_ngModelChange_30_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.charge.description, $event) || (ctx_r0.charge.description = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](31, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](32, " Select units and adjust their amounts. Individual charges and fines allow only one unit. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "div", 24)(34, "table")(35, "thead")(36, "tr")(37, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](38, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](39, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](40, "Unit");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](41, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](42, "Owner");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](43, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](44, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](45, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](46, FinanceComponent_Conditional_30_Conditional_0_For_47_Template, 9, 8, "tr", null, _forTrack3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](48, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](49, " Record charges ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const chargeForm_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](3);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.charge.chargeType);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.charge.issueDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.charge.dueDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.charge.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.charge.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.units);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", chargeForm_r13.invalid);
  }
}
function FinanceComponent_Conditional_30_Conditional_1_For_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const invoice_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", invoice_r15._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", invoice_r15.invoice_number, " \u00B7 ", invoice_r15.unitNumber, " \u00B7 ", invoice_r15.balancePending, " ", invoice_r15.currency, " ");
  }
}
function FinanceComponent_Conditional_30_Conditional_1_For_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const credit_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", credit_r16._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate3"](" ", credit_r16.availableMinor / 100, " ", credit_r16.currency, " \u00B7 ", credit_r16.unitNumber, " ");
  }
}
function FinanceComponent_Conditional_30_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Discount, waiver or credit balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "form", 28, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_30_Conditional_1_Template_form_ngSubmit_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveAdjustment());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "fieldset", 29)(5, "div", 30)(6, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7, "Outstanding invoice");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](8, "select", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_1_Template_select_ngModelChange_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.adjustment.invoiceId, $event) || (ctx_r0.adjustment.invoiceId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](11, FinanceComponent_Conditional_30_Conditional_1_For_12_Template, 2, 5, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "select", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_1_Template_select_ngModelChange_15_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.adjustment.kind, $event) || (ctx_r0.adjustment.kind = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "option", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17, "Discount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "option", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](19, "Waiver");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](20, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](21, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "input", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_1_Template_input_ngModelChange_22_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.adjustment.amount, $event) || (ctx_r0.adjustment.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](23, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](24, "Reason");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "textarea", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_1_Template_textarea_ngModelChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.adjustment.reason, $event) || (ctx_r0.adjustment.reason = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](26, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](27, "Available credit balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](28, "select", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_30_Conditional_1_Template_select_ngModelChange_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.adjustment.creditId, $event) || (ctx_r0.adjustment.creditId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](29, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](30, "Select credit");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](31, FinanceComponent_Conditional_30_Conditional_1_For_32_Template, 2, 4, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "div", 52)(34, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](35, " Record adjustment");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](36, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_30_Conditional_1_Template_button_click_36_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveAdjustment(true));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](37, " Apply credit balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](38, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](39, " Adjustments and credits reduce debt; payments are recorded through the existing payment workflows. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](40, "div", 25)(41, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_30_Conditional_1_Template_button_click_41_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("receivables", -1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](42, " Previous invoices");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](43, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](44);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](45, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_30_Conditional_1_Template_button_click_45_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("receivables", 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](46, " More invoices ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const adjustmentForm_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](3);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.adjustment.invoiceId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.invoices());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.adjustment.kind);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.adjustment.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.adjustment.reason);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.adjustment.creditId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.usableCredits);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", adjustmentForm_r17.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", adjustmentForm_r17.invalid || !ctx_r0.adjustment.creditId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.receivablePage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.receivablePage);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.receivablePage * 50 >= ctx_r0.receivableTotal);
  }
}
function FinanceComponent_Conditional_30_For_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](2, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const credit_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" Unit ", credit_r18.unitNumber || "pending review", " \u00B7 Available ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](2, 2, credit_r18.availableMinor / 100, credit_r18.currency), " ");
  }
}
function FinanceComponent_Conditional_30_ForEmpty_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "No credits recorded.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](0, FinanceComponent_Conditional_30_Conditional_0_Template, 50, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](1, FinanceComponent_Conditional_30_Conditional_1_Template, 47, 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](3, "Credit balances");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](5, FinanceComponent_Conditional_30_For_6_Template, 3, 5, "li", null, _forTrack0, false, FinanceComponent_Conditional_30_ForEmpty_7_Template, 2, 0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canCreate ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 1 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.credits());
  }
}
function FinanceComponent_Conditional_31_For_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const unit_r20 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", unit_r20.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](unit_r20.unitNumber);
  }
}
function FinanceComponent_Conditional_31_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Historical unit");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "input", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_31_Conditional_10_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r21);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.unitNumber, $event) || (ctx_r0.unitNumber = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_31_Conditional_21_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Some historical payments have no verifiable date. Current debt uses the recorded balance; those payments need review for the selected range. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_31_Conditional_21_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Action");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_31_Conditional_21_For_34_Conditional_14_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_31_Conditional_21_For_34_Conditional_14_Conditional_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r23);
      const row_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.reverseApplication(row_r24.applicationId));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Reverse ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.reversalReason.trim().length < 3);
  }
}
function FinanceComponent_Conditional_31_Conditional_21_For_34_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](1, FinanceComponent_Conditional_31_Conditional_21_For_34_Conditional_14_Conditional_1_Template, 2, 1, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](row_r24.reversible && row_r24.applicationId ? 1 : -1);
  }
}
function FinanceComponent_Conditional_31_Conditional_21_For_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](7, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](10, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](13, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](14, FinanceComponent_Conditional_31_Conditional_21_For_34_Conditional_14_Template, 2, 1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r24 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](row_r24.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](row_r24.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](7, 6, row_r24.debitMinor / 100, ctx_r0.currency));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](10, 9, row_r24.creditMinor / 100, ctx_r0.currency));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](13, 12, row_r24.balanceMinor / 100, ctx_r0.currency));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 14 : -1);
  }
}
function FinanceComponent_Conditional_31_Conditional_21_ForEmpty_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, "No transactions in this range.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
}
function FinanceComponent_Conditional_31_Conditional_21_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Reason for reversing an application");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_31_Conditional_21_Conditional_36_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.reversalReason, $event) || (ctx_r0.reversalReason = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.reversalReason);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_31_Conditional_21_For_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](2, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const credit_r26 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](2, 1, credit_r26.availableMinor / 100, credit_r26.currency));
  }
}
function FinanceComponent_Conditional_31_Conditional_21_ForEmpty_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "No credit balances.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_31_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 23)(1, "article")(2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](3, "Opening balance for the range");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](5, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "article")(7, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Closing balance for the range");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](10, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "article")(12, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13, "Current debt");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](15, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](16, FinanceComponent_Conditional_31_Conditional_21_Conditional_16_Template, 2, 0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "div", 24)(18, "table")(19, "thead")(20, "tr")(21, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](22, "Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](23, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](24, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](26, "Charges");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](27, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](28, "Applications");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](29, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](30, "Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](31, FinanceComponent_Conditional_31_Conditional_21_Conditional_31_Template, 2, 0, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](32, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](33, FinanceComponent_Conditional_31_Conditional_21_For_34_Template, 15, 15, "tr", null, _forTrack1, false, FinanceComponent_Conditional_31_Conditional_21_ForEmpty_35_Template, 3, 0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](36, FinanceComponent_Conditional_31_Conditional_21_Conditional_36_Template, 3, 2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](37, "div", 25)(38, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_31_Conditional_21_Template_button_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("history", -1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](39, " Previous");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](40, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](42, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_31_Conditional_21_Template_button_click_42_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("history", 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](43, " Next ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](44, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](45, "Current available credits");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](46, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](47, FinanceComponent_Conditional_31_Conditional_21_For_48_Template, 3, 4, "li", null, _forTrack0, false, FinanceComponent_Conditional_31_Conditional_21_ForEmpty_49_Template, 2, 0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const statement_r27 = ctx;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](5, 12, statement_r27.openingMinor / 100, ctx_r0.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](10, 15, statement_r27.closingMinor / 100, ctx_r0.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](15, 18, statement_r27.currentPendingMinor / 100, ctx_r0.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](statement_r27.warnings.undatedLegacyPayments || statement_r27.warnings.undatedPayments ? 16 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 31 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](statement_r27.docs);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 36 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.historyPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("Page ", ctx_r0.historyPage, " \u00B7 ", statement_r27.total, " transactions");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.historyPage * 50 >= statement_r27.total);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](statement_r27.credits);
  }
}
function FinanceComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Unit statement");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "div", 13)(3, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4, "Unit");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "select", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_31_Template_select_ngModelChange_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.unitNumber, $event) || (ctx_r0.unitNumber = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("change", function FinanceComponent_Conditional_31_Template_select_change_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.changeHistoryFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](8, FinanceComponent_Conditional_31_For_9_Template, 2, 2, "option", 16, _forTrack3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](10, FinanceComponent_Conditional_31_Conditional_10_Template, 3, 2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, "From");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_31_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.from, $event) || (ctx_r0.from = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](14, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](15, "To");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_31_Template_input_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.to, $event) || (ctx_r0.to = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_31_Template_button_click_17_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.changeHistoryFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, " View");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_31_Template_button_click_19_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.export("history"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, " Export CSV ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](21, FinanceComponent_Conditional_31_Conditional_21_Template, 50, 21);
  }
  if (rf & 2) {
    let tmp_11_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.units);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!ctx_r0.ownerMode ? 10 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.from);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.to);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || !ctx_r0.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || !ctx_r0.unitNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"]((tmp_11_0 = ctx_r0.history()) ? 21 : -1, tmp_11_0);
  }
}
function FinanceComponent_Conditional_32_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Enable this stage in Settings.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_For_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r30 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", account_r30._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" ", account_r30.bank, " \u00B7 ", account_r30.accountLabel, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_29_For_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r32 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", account_r32._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" ", account_r32.bank, " \u00B7 ", account_r32.accountLabel, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Destination account");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "select", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_29_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r31);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.destinationAccountId, $event) || (ctx_r0.entry.destinationAccountId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](5, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_29_For_6_Template, 2, 3, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.destinationAccountId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.currencyAccounts);
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_For_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const movement_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", movement_r33._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", movement_r33.date, " \u00B7 ", movement_r33.amountMinor / 100, " ", movement_r33.currency, " \u00B7 ", movement_r33.reference || movement_r33.description, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_51_For_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const movement_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", movement_r35._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", movement_r35.date, " \u00B7 ", movement_r35.amountMinor / 100, " ", movement_r35.currency, " \u00B7 ", movement_r35.reference || movement_r35.description, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Destination transaction");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "select", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_51_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.destinationMovementId, $event) || (ctx_r0.entry.destinationMovementId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4, "Record without linking");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](5, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_51_For_6_Template, 2, 5, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.destinationMovementId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.movementOptions(true));
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "form", 28, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveEntry());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "fieldset", 29)(3, "div", 30)(4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "select", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_select_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.kind, $event) || (ctx_r0.entry.kind = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "option", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Paid expense");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, "Other income received");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "option", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, " Transfer between accounts ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "input", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_input_ngModelChange_15_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.date, $event) || (ctx_r0.entry.date = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "input", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.amount, $event) || (ctx_r0.entry.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](21, "input", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_input_ngModelChange_21_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.category, $event) || (ctx_r0.entry.category = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](23, "Bank account or cash");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](24, "select", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_select_ngModelChange_24_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.bankAccountId, $event) || (ctx_r0.entry.bankAccountId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](26, "Cash");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](27, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_For_28_Template, 2, 3, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](29, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_29_Template, 7, 1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](30, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](31, "Reference");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](32, "input", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_input_ngModelChange_32_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.reference, $event) || (ctx_r0.entry.reference = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](34, "Supporting document reference");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](35, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_input_ngModelChange_35_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.supportReference, $event) || (ctx_r0.entry.supportReference = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](36, "label", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](37, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](38, "textarea", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_textarea_ngModelChange_38_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.reason, $event) || (ctx_r0.entry.reason = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](39, "details")(40, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](41, "Link an imported bank transaction");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](42, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](43, " Select the confirmed transaction with the matching date and amount. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](44, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](45, "Source transaction");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](46, "select", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template_select_ngModelChange_46_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.entry.movementId, $event) || (ctx_r0.entry.movementId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](47, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](48, "Record without linking");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](49, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_For_50_Template, 2, 5, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](51, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Conditional_51_Template, 7, 1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](52, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](53, " Record transaction ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const entryForm_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](1);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.kind);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.bankAccountId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.currencyAccounts);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.entry.kind === "transfer" ? 29 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.reference);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.supportReference);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.reason);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.entry.movementId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.movementOptions());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.entry.kind === "transfer" ? 51 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", entryForm_r36.invalid);
  }
}
function FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Conditional_0_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r38);
      const item_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.selectEntry(item_r39));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Link bank transaction ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](0, FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Conditional_0_Template, 2, 1, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r37);
      const item_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.reverseEntry(item_r39._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, " Reverse ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](item_r39.bankAccountId && (!item_r39.movementId || item_r39.kind === "transfer" && !item_r39.destinationMovementId) ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.reversalReason.trim().length < 3);
  }
}
function FinanceComponent_Conditional_32_Conditional_3_For_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](9, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](12, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](13, FinanceComponent_Conditional_32_Conditional_3_For_19_Conditional_13_Template, 3, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r39 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](item_r39.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" ", ctx_r0.kindLabel(item_r39.kind), " ", item_r39.reversalOf ? "(reverso)" : "", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](item_r39.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](9, 7, item_r39.amountMinor / 100 * (item_r39.reversalOf ? -1 : 1), item_r39.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](item_r39.reason);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate && !item_r39.reversalOf && !item_r39.reversedById ? 13 : -1);
  }
}
function FinanceComponent_Conditional_32_Conditional_3_ForEmpty_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, " No manual transactions. Confirmed payments appear in Reports. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Reversal reason");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_21_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r40);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.reversalReason, $event) || (ctx_r0.reversalReason = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.reversalReason);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_For_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const movement_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", movement_r42._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", movement_r42.date, " \u00B7 ", movement_r42.amountMinor / 100, " ", movement_r42.currency, " \u00B7 ", movement_r42.reference || movement_r42.description, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_For_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const movement_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", movement_r43._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", movement_r43.date, " \u00B7 ", movement_r43.amountMinor / 100, " ", movement_r43.currency, " \u00B7 ", movement_r43.reference || movement_r43.description, " ");
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "form", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.linkEntry());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "fieldset", 29)(2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](3, "Link a transaction to an existing record");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "Source transaction");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "select", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_Template_select_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.link.movementId, $event) || (ctx_r0.link.movementId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "No change");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](9, FinanceComponent_Conditional_32_Conditional_3_Conditional_32_For_10_Template, 2, 5, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, "Transfer destination transaction");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "select", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_32_Conditional_3_Conditional_32_Template_select_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.link.destinationMovementId, $event) || (ctx_r0.link.destinationMovementId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](14, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](15, "No change");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](16, FinanceComponent_Conditional_32_Conditional_3_Conditional_32_For_17_Template, 2, 5, "option", 16, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](19, " Link ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.link.movementId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.movementOptions(false, true));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.link.destinationMovementId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.movementOptions(true, true));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", !ctx_r0.link.movementId && !ctx_r0.link.destinationMovementId);
  }
}
function FinanceComponent_Conditional_32_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](0, FinanceComponent_Conditional_32_Conditional_3_Conditional_0_Template, 54, 13, "form");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "div", 24)(2, "table")(3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6, "Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Action");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](18, FinanceComponent_Conditional_32_Conditional_3_For_19_Template, 14, 10, "tr", null, _forTrack0, false, FinanceComponent_Conditional_32_Conditional_3_ForEmpty_20_Template, 3, 0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](21, FinanceComponent_Conditional_32_Conditional_3_Conditional_21_Template, 3, 2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "details")(23, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "div", 25)(26, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_Template_button_click_26_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginateMovements(-1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](27, " Previous");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](28, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](30, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_Template_button_click_30_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginateMovements(1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](31, " Next ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](32, FinanceComponent_Conditional_32_Conditional_3_Conditional_32_Template, 20, 4, "form");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "div", 25)(34, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_Template_button_click_34_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("entries", -1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](35, " Previous");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](36, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](38, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_32_Conditional_3_Template_button_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.paginate("entries", 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](39, " Next ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canCreate ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.entries());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 21 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" Bank transactions to classify (", ctx_r0.movementTotal, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.movementPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"]("Page ", ctx_r0.movementPage);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.movementPage * 50 >= ctx_r0.movementTotal);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.link.entryId && ctx_r0.canUpdate ? 32 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.entryPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("Page ", ctx_r0.entryPage, " \u00B7 ", ctx_r0.entryTotal, " records");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || ctx_r0.entryPage * 50 >= ctx_r0.entryTotal);
  }
}
function FinanceComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Income and expenses");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](2, FinanceComponent_Conditional_32_Conditional_2_Template, 2, 0, "p")(3, FinanceComponent_Conditional_32_Conditional_3_Template, 40, 12);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!((tmp_1_0 = ctx_r0.settings()) == null ? null : tmp_1_0.cashbookEnabled) ? 2 : 3);
  }
}
function FinanceComponent_Conditional_33_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Enable reports and budget in Settings.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "form", 28, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.addBudgetLine());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "fieldset", 29)(3, "div", 30)(4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "Month");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "input", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.budgetDraft.month, $event) || (ctx_r0.budgetDraft.month = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "select", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template_select_ngModelChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.budgetDraft.kind, $event) || (ctx_r0.budgetDraft.kind = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "option", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11, "Expense");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](12, "option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13, "Income");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](14, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](15, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "input", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template_input_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.budgetDraft.category, $event) || (ctx_r0.budgetDraft.category = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "input", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template_input_ngModelChange_19_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.budgetDraft.amount, $event) || (ctx_r0.budgetDraft.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](20, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](21, " Add or update budget line ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const budgetForm_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](1);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.budgetDraft.month);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.budgetDraft.kind);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.budgetDraft.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.budgetDraft.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", budgetForm_r46.invalid);
  }
}
function FinanceComponent_Conditional_33_Conditional_3_For_23_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_33_Conditional_3_For_23_Conditional_11_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r47);
      const $index_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.removeBudgetLine($index_r48));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_33_Conditional_3_For_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](9, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](11, FinanceComponent_Conditional_33_Conditional_3_For_23_Conditional_11_Template, 2, 1, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const line_r49 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](line_r49.month);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.kindLabel(line_r49.kind));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](line_r49.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](9, 5, line_r49.amount, ctx_r0.currency));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 11 : -1);
  }
}
function FinanceComponent_Conditional_33_Conditional_3_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_33_Conditional_3_Conditional_24_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r50);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveBudget());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Save annual budget ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_33_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 13)(1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, "Year");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "input", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_33_Conditional_3_Template_input_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r44);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.year, $event) || (ctx_r0.year = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_33_Conditional_3_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r44);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, " Load budget ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](6, FinanceComponent_Conditional_33_Conditional_3_Conditional_6_Template, 22, 6, "form");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "div", 24)(8, "table")(9, "thead")(10, "tr")(11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, "Month");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, "Budget");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, "Action");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](21, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](22, FinanceComponent_Conditional_33_Conditional_3_For_23_Template, 12, 8, "tr", null, _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterTrackByIndex"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](24, FinanceComponent_Conditional_33_Conditional_3_Conditional_24_Template, 2, 1, "button", 75);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.year);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 6 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.budgetLines);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 24 : -1);
  }
}
function FinanceComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Budget");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](2, FinanceComponent_Conditional_33_Conditional_2_Template, 2, 0, "p")(3, FinanceComponent_Conditional_33_Conditional_3_Template, 25, 5);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!((tmp_1_0 = ctx_r0.settings()) == null ? null : tmp_1_0.reportsEnabled) ? 2 : 3);
  }
}
function FinanceComponent_Conditional_34_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Enable this stage in Settings.");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const data_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" Pending review: ", data_r52.warnings.legacyPaidWithoutTransactions, " historical invoices paid without a transaction and ", data_r52.warnings.undatedSuccessfulPayments, " payments without a confirmed date. They are excluded from payments for the period. ");
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](9, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](12, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](15, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const line_r53 = ctx.$implicit;
    const data_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](line_r53.month);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.kindLabel(line_r53.kind));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](line_r53.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](9, 7, line_r53.plannedMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](12, 10, line_r53.actualMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](15, 13, line_r53.varianceMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", line_r53.variancePercent === null ? "\u2014" : line_r53.variancePercent + "%", " ");
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "article")(1, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](5, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const account_r54 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("", account_r54.bank, " \u00B7 ", account_r54.accountLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", account_r54.calculatedBalanceMinor === null ? "No opening balance for this date" : _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](5, 4, (account_r54.calculatedBalanceMinor || 0) / 100, account_r54.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"]("", account_r54.unclassifiedCount, " transactions to classify");
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](2, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const total_r55 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](2, 1, total_r55.amountMinor / 100, total_r55.currency));
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_68_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](9, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const row_r56 = ctx.$implicit;
    const data_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](row_r56.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.kindLabel(row_r56.kind));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](row_r56.category);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](9, 5, row_r56.amountMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](row_r56.reference);
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 23)(1, "article")(2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](3, "Income");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](5, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "article")(7, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Expenses");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](10, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "article")(12, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13, "Net cash flow");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](15, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](16, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_Conditional_16_Template, 2, 2, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](18, "Budget versus actuals");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "div", 24)(20, "table")(21, "thead")(22, "tr")(23, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](24, "Month");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](25, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](26, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](27, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](28, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](29, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](30, "Budget");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](31, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](32, "Actual");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](34, "Variance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](35, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](36, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](37, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](38, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_39_Template, 18, 16, "tr", null, _forTrack4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](40, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](42, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](43, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_44_Template, 8, 7, "article", null, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](45, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](47, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](48, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_49_Template, 3, 4, "li", null, _forTrack2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](50, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](51, "Transactions for the period");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](52, "div", 24)(53, "table")(54, "thead")(55, "tr")(56, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](57, "Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](58, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](59, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](60, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](61, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](62, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](63, "Amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](64, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](65, "Reference");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](66, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](67, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_For_68_Template, 12, 8, "tr", null, _forTrack1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const data_r52 = ctx;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](5, 6, data_r52.incomeMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](10, 9, data_r52.expenseMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind2"](15, 12, data_r52.netMinor / 100, data_r52.currency), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](data_r52.warnings.legacyPaidWithoutTransactions || data_r52.warnings.undatedSuccessfulPayments ? 16 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](data_r52.budget);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"]("Bank accounts as of ", ctx_r0.to);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](data_r52.banks);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"]("Current accounts receivable \u00B7 ", data_r52.receivablesAsOf);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](data_r52.receivables);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](data_r52.rows);
  }
}
function FinanceComponent_Conditional_34_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 13)(1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2, "From");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_34_Conditional_3_Template_input_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.from, $event) || (ctx_r0.from = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "To");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_34_Conditional_3_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.to, $event) || (ctx_r0.to = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_34_Conditional_3_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.refresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "View");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_34_Conditional_3_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.export("report"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, " Export income and expenses CSV ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12, " Actuals reflect received payments and paid expenses. Budget comparisons cover full months within the selected range. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](13, FinanceComponent_Conditional_34_Conditional_3_Conditional_13_Template, 69, 15);
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.from);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.to);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"]((tmp_8_0 = ctx_r0.report()) ? 13 : -1, tmp_8_0);
  }
}
function FinanceComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Administrative reports");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](2, FinanceComponent_Conditional_34_Conditional_2_Template, 2, 0, "p")(3, FinanceComponent_Conditional_34_Conditional_3_Template, 14, 7);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!((tmp_1_0 = ctx_r0.settings()) == null ? null : tmp_1_0.reportsEnabled) ? 2 : 3);
  }
}
function FinanceComponent_Conditional_35_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Data and index review and migration are pending. Activation will be available once they are complete. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function FinanceComponent_Conditional_35_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r0.settingsValidationError);
  }
}
function FinanceComponent_Conditional_35_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "form", 28, 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_35_Conditional_3_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveSettings());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "fieldset", 29)(3, "label", 81)(4, "input", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.reviewed, $event) || (ctx_r0.reviewed = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "I reviewed the data and balances for this condominium");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "label", 81)(7, "input", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.changeFinanceEnabled($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Enable charges, adjustments, credits and history");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "label", 81)(10, "input", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.changeCashbookEnabled($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11, "Enable income and expenses");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](12, "label", 81)(13, "input", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.draftSettings.reportsEnabled, $event) || (ctx_r0.draftSettings.reportsEnabled = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "Enable budget and reports");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Automatic late fees");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](17, "label", 81)(18, "input", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.draftSettings.lateFee.enabled, $event) || (ctx_r0.draftSettings.lateFee.enabled = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](19, "Enable a one-time charge per overdue invoice");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](20, "div", 30)(21, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](22, "Mode");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](23, "select", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_select_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.draftSettings.lateFee.mode, $event) || (ctx_r0.draftSettings.lateFee.mode = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](24, "option", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](25, "Fixed amount");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](26, "option", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](27, " Percentage of overdue balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](28, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](29, "Amount or percentage");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](30, "input", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_30_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.draftSettings.lateFee.value, $event) || (ctx_r0.draftSettings.lateFee.value = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](31, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](32, "Grace days");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "input", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_3_Template_input_ngModelChange_33_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r57);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.draftSettings.lateFee.graceDays, $event) || (ctx_r0.draftSettings.lateFee.graceDays = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](34, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](35, " Evaluated daily at 10:00 AM, Santo Domingo time. Enabling or changing the rule applies to due dates from today onward. Late fees do not generate additional late fees. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](36, FinanceComponent_Conditional_35_Conditional_3_Conditional_36_Template, 2, 1, "p", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](37, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](38, " Save settings ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const settingsForm_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](1);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.reviewed);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngModel", ctx_r0.draftSettings.enabled)("disabled", !ctx_r0.migrationReady());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngModel", ctx_r0.draftSettings.cashbookEnabled)("disabled", !ctx_r0.draftSettings.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.draftSettings.reportsEnabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", !ctx_r0.draftSettings.enabled || !ctx_r0.draftSettings.cashbookEnabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.draftSettings.lateFee.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", !ctx_r0.draftSettings.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.draftSettings.lateFee.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.draftSettings.lateFee.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.draftSettings.lateFee.graceDays);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.settingsValidationError ? 36 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy() || settingsForm_r58.invalid || !!ctx_r0.settingsValidationError);
  }
}
function FinanceComponent_Conditional_35_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Conditional_35_Conditional_4_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r59);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.runLateFees());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, " Evaluate late fees now ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
  }
}
function FinanceComponent_Conditional_35_For_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r60 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate4"](" ", account_r60.bank, " \u00B7 ", account_r60.accountLabel, " \u00B7 ", account_r60.currency, " \u00B7 ", account_r60.openingDate ? "Opening balance since " + account_r60.openingDate : "No opening balance", " ");
  }
}
function FinanceComponent_Conditional_35_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "form", 28, 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_35_Conditional_10_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r61);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.createAccount());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "fieldset", 29)(3, "div", 30)(4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](5, "Bank");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "input", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_10_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r61);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.accountDraft.bank, $event) || (ctx_r0.accountDraft.bank = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Account label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "input", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_10_Template_input_ngModelChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r61);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.accountDraft.accountLabel, $event) || (ctx_r0.accountDraft.accountLabel = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const accountForm_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](1);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.accountDraft.bank);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.accountDraft.accountLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", accountForm_r62.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" Create account in ", ctx_r0.currency, " ");
  }
}
function FinanceComponent_Conditional_35_Conditional_11_For_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("value", account_r64._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"](" ", account_r64.bank, " \u00B7 ", account_r64.accountLabel, " ");
  }
}
function FinanceComponent_Conditional_35_Conditional_11_For_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](0, FinanceComponent_Conditional_35_Conditional_11_For_12_Conditional_0_Template, 2, 3, "option", 16);
  }
  if (rf & 2) {
    const account_r64 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!account_r64.openingDate ? 0 : -1);
  }
}
function FinanceComponent_Conditional_35_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r63 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Opening balance at the start of the day");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](2, "form", 28, 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function FinanceComponent_Conditional_35_Conditional_11_Template_form_ngSubmit_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r63);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.saveOpening());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "fieldset", 29)(5, "div", 30)(6, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7, "Account");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](8, "select", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_11_Template_select_ngModelChange_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r63);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.opening.accountId, $event) || (ctx_r0.opening.accountId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](9, "option", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](11, FinanceComponent_Conditional_35_Conditional_11_For_12_Template, 1, 1, null, null, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](14, "As-of date");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "input", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_11_Template_input_ngModelChange_15_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r63);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.opening.date, $event) || (ctx_r0.opening.date = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17, "Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "input", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Conditional_35_Conditional_11_Template_input_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r63);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx_r0.opening.amount, $event) || (ctx_r0.opening.amount = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, " Transactions will be added from this date. The opening balance is fixed once recorded. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](21, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](22, " Record opening balance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const openingForm_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](3);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r0.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.opening.accountId);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.currencyAccounts);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.opening.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.opening.amount);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", openingForm_r65.invalid);
  }
}
function FinanceComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Staged activation");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](2, FinanceComponent_Conditional_35_Conditional_2_Template, 2, 0, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](3, FinanceComponent_Conditional_35_Conditional_3_Template, 39, 15, "form");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](4, FinanceComponent_Conditional_35_Conditional_4_Template, 2, 1, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6, "Bank accounts");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](8, FinanceComponent_Conditional_35_For_9_Template, 2, 4, "li", null, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](10, FinanceComponent_Conditional_35_Conditional_10_Template, 12, 5, "form");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](11, FinanceComponent_Conditional_35_Conditional_11_Template, 23, 5);
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_6_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!ctx_r0.migrationReady() ? 2 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate ? 3 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canCreate && ((tmp_3_0 = ctx_r0.settings()) == null ? null : tmp_3_0.enabled) && ((tmp_3_0 = ctx_r0.settings()) == null ? null : tmp_3_0.lateFee == null ? null : tmp_3_0.lateFee.enabled) ? 4 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx_r0.accounts());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canCreate ? 10 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx_r0.canUpdate && ((tmp_6_0 = ctx_r0.settings()) == null ? null : tmp_6_0.cashbookEnabled) ? 11 : -1);
  }
}
class FinanceComponent {
  constructor() {
    this.api = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_finance_service__WEBPACK_IMPORTED_MODULE_9__.FinanceService);
    this.bankApi = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_bank_reconciliation_service__WEBPACK_IMPORTED_MODULE_10__.BankReconciliationService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_11__.AccessContextService);
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_12__.UserService);
    this.busy = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false, ...(ngDevMode ? [{
      debugName: "busy"
    }] : /* istanbul ignore next */[]));
    this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)('', ...(ngDevMode ? [{
      debugName: "error"
    }] : /* istanbul ignore next */[]));
    this.notice = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)('', ...(ngDevMode ? [{
      debugName: "notice"
    }] : /* istanbul ignore next */[]));
    this.condos = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "condos"
    }] : /* istanbul ignore next */[]));
    this.invoices = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "invoices"
    }] : /* istanbul ignore next */[]));
    this.totals = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "totals"
    }] : /* istanbul ignore next */[]));
    this.credits = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "credits"
    }] : /* istanbul ignore next */[]));
    this.accounts = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "accounts"
    }] : /* istanbul ignore next */[]));
    this.entries = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "entries"
    }] : /* istanbul ignore next */[]));
    this.movements = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)([], ...(ngDevMode ? [{
      debugName: "movements"
    }] : /* istanbul ignore next */[]));
    this.history = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(null, ...(ngDevMode ? [{
      debugName: "history"
    }] : /* istanbul ignore next */[]));
    this.report = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(null, ...(ngDevMode ? [{
      debugName: "report"
    }] : /* istanbul ignore next */[]));
    this.settings = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(null, ...(ngDevMode ? [{
      debugName: "settings"
    }] : /* istanbul ignore next */[]));
    this.migrationReady = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false, ...(ngDevMode ? [{
      debugName: "migrationReady"
    }] : /* istanbul ignore next */[]));
    this.ownerMode = this.user.getIdentity()?.role === 'OWNER';
    this.tabs = [{
      id: 'receivables',
      label: 'Accounts receivable'
    }, {
      id: 'charges',
      label: 'Charges and adjustments'
    }, {
      id: 'history',
      label: 'Unit statement'
    }, {
      id: 'cashbook',
      label: 'Income and expenses'
    }, {
      id: 'budget',
      label: 'Budget'
    }, {
      id: 'reports',
      label: 'Reports'
    }, {
      id: 'settings',
      label: 'Settings'
    }];
    this.condominiumId = '';
    this.currency = 'DOP';
    this.tab = this.ownerMode ? 'history' : 'receivables';
    this.units = [];
    this.unitNumber = '';
    this.year = new Date().getFullYear();
    this.from = `${this.year}-01-01`;
    this.to = `${this.year}-12-31`;
    this.receivablePage = 1;
    this.receivableTotal = 0;
    this.entryPage = 1;
    this.entryTotal = 0;
    this.movementPage = 1;
    this.movementTotal = 0;
    this.link = {
      entryId: '',
      movementId: '',
      destinationMovementId: ''
    };
    this.historyPage = 1;
    this.charge = {
      chargeType: 'extraordinary',
      amount: 0,
      issueDate: this.localToday(),
      dueDate: this.localToday(),
      description: ''
    };
    this.adjustment = {
      invoiceId: '',
      kind: 'discount',
      amount: 0,
      reason: '',
      creditId: ''
    };
    this.entry = {
      kind: 'expense',
      amount: 0,
      date: this.localToday(),
      category: '',
      reason: '',
      reference: '',
      supportReference: '',
      bankAccountId: '',
      destinationAccountId: '',
      movementId: '',
      destinationMovementId: ''
    };
    this.accountDraft = {
      bank: '',
      accountLabel: ''
    };
    this.opening = {
      accountId: '',
      amount: 0,
      date: this.localToday()
    };
    this.draftSettings = this.defaultSettings();
    this.reviewed = false;
    this.budgetLines = [];
    this.budgetRevision = 0;
    this.budgetDraft = {
      month: 1,
      kind: 'expense',
      category: '',
      amount: 0
    };
    this.reversalReason = '';
    this.operationKeys = new Map();
  }
  get canCreate() {
    return !this.ownerMode && (this.access.isOwnerAdmin() || this.access.hasPermission('finance.create'));
  }
  get canUpdate() {
    return !this.ownerMode && (this.access.isOwnerAdmin() || this.access.hasPermission('finance.update'));
  }
  get settingsValidationError() {
    const draft = this.draftSettings;
    if (draft.enabled && !this.migrationReady()) return 'Data and index migration must be completed before enabling finance.';
    if (draft.enabled && !this.settings()?.enabled && !this.reviewed) return 'Confirm that you reviewed the balances before enabling finance.';
    if (draft.cashbookEnabled && !draft.enabled || draft.reportsEnabled && !draft.cashbookEnabled) return 'Enable the previous stages first.';
    if (draft.lateFee.enabled && !draft.enabled) return 'Enable finance before enabling late fees.';
    const {
      value,
      graceDays,
      mode
    } = draft.lateFee;
    if (value === null || !Number.isFinite(value) || value < 0 || value > 9999999999.99 || Number(value.toFixed(2)) !== value || draft.lateFee.enabled && value === 0 || mode === 'percent' && value > 100) return 'Enter a valid late fee amount. Percentages cannot exceed 100%; enabled fees must be greater than zero.';
    if (graceDays === null || !Number.isInteger(graceDays) || graceDays < 0 || graceDays > 365) return 'Grace days must be a whole number between 0 and 365.';
    return '';
  }
  changeFinanceEnabled(enabled) {
    this.draftSettings.enabled = enabled;
    if (!enabled) {
      this.draftSettings.cashbookEnabled = false;
      this.draftSettings.reportsEnabled = false;
      this.draftSettings.lateFee.enabled = false;
    }
  }
  changeCashbookEnabled(enabled) {
    this.draftSettings.cashbookEnabled = enabled;
    if (!enabled) this.draftSettings.reportsEnabled = false;
  }
  get selectedInvoice() {
    return this.invoices().find(invoice => invoice._id === this.adjustment.invoiceId);
  }
  get usableCredits() {
    const invoice = this.selectedInvoice;
    return this.credits().filter(credit => invoice && credit.ownerId === invoice.ownerId && credit.unitNumber?.trim().toLowerCase() === invoice.unitNumber.trim().toLowerCase() && credit.currency === invoice.currency && credit.availableMinor > 0);
  }
  get currencyAccounts() {
    return this.accounts().filter(account => account.currency === this.currency);
  }
  kindLabel(kind) {
    return {
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer'
    }[kind] || kind;
  }
  chargeLabel(kind) {
    return {
      monthly: 'Monthly fee',
      extraordinary: 'Special assessment',
      individual: 'Individual charge',
      fine: 'Fine',
      late_fee: 'Late fee',
      legacy: 'Historical charge'
    }[kind || 'legacy'] || 'Historical charge';
  }
  bucketLabel(bucket) {
    return bucket === 'current' ? 'Current' : bucket === '90+' ? 'Over 90 days' : `${bucket} days`;
  }
  get availableTabs() {
    return this.tabs.filter(tab => !this.ownerMode || ['receivables', 'history'].includes(tab.id));
  }
  ngOnInit() {
    var _this = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.condos.set((yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this.api.get('options'))).docs);
      _this.condominiumId = _this.condos()[0]?._id || '';
      if (_this.condominiumId) yield _this.loadCondominium();
    }));
  }
  localToday() {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Santo_Domingo'
    }).format(new Date());
  }
  defaultSettings() {
    return {
      enabled: false,
      cashbookEnabled: false,
      reportsEnabled: false,
      lateFee: {
        enabled: false,
        mode: 'fixed',
        value: 0,
        graceDays: 0
      }
    };
  }
  query(extra = {}) {
    return {
      condominiumId: this.condominiumId,
      currency: this.currency,
      year: String(this.year),
      ...extra
    };
  }
  dates() {
    return this.query({
      from: this.from,
      to: this.to
    });
  }
  key(name) {
    if (!this.operationKeys.has(name)) this.operationKeys.set(name, crypto.randomUUID());
    return this.operationKeys.get(name);
  }
  perform(_x) {
    var _this2 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (action, notice = '') {
      if (_this2.busy()) return;
      _this2.busy.set(true);
      _this2.error.set('');
      _this2.notice.set('');
      try {
        yield action();
        if (notice) _this2.notice.set(notice);
      } catch (error) {
        const response = error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpErrorResponse ? error.error : null;
        const message = response?.error?.message || response?.message;
        const settingsMessages = {
          'Confirme que revisó los saldos antes de activar esta etapa': 'Confirm that you reviewed the balances before enabling finance.',
          'Ejecute la revisión y migración de índices antes de activar finanzas': 'Data and index migration must be completed before enabling finance.',
          'Active las etapas anteriores primero': 'Enable the previous stages first.',
          'Configuración inválida': 'Invalid settings.',
          'Política de mora inválida': 'Invalid late fee policy.',
          'Importe o porcentaje de mora inválido': 'Invalid late fee amount or percentage.',
          'No autorizado': 'You are not authorized to perform this operation.',
          'No tiene permiso financiero': 'You do not have permission to perform this financial operation.',
          'Condominio fuera de alcance': 'This condominium is outside your access scope.',
          'Condominio no encontrado': 'Condominium not found.',
          'Reporte fuera de alcance': 'The report is outside your access scope.',
          'Se requiere MongoDB con replica set; no se aplicó la operación': 'MongoDB must run as a replica set. The operation was not applied.',
          'La operación ya existe; vuelva a consultar antes de repetirla': 'This operation already exists. Refresh before trying again.'
        };
        _this2.error.set(error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpErrorResponse ? settingsMessages[message || ''] || (error.status === 0 ? 'Unable to reach the server. Check your connection and try again.' : error.status === 403 ? 'You do not have permission to perform this operation.' : 'The financial operation could not be completed. Check your entries and try again.') : error instanceof Error ? error.message : 'The operation could not be completed');
      } finally {
        _this2.busy.set(false);
      }
    }).apply(this, arguments);
  }
  changeCondominium() {
    void this.perform(() => this.loadCondominium());
  }
  loadCondominium() {
    var _this3 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this3.invoices.set([]);
      _this3.totals.set([]);
      _this3.entries.set([]);
      _this3.movements.set([]);
      _this3.credits.set([]);
      _this3.accounts.set([]);
      _this3.history.set(null);
      _this3.report.set(null);
      _this3.budgetLines = [];
      _this3.operationKeys.clear();
      _this3.link = {
        entryId: '',
        movementId: '',
        destinationMovementId: ''
      };
      _this3.movementPage = 1;
      _this3.adjustment.invoiceId = '';
      _this3.adjustment.creditId = '';
      _this3.reviewed = false;
      _this3.entry.bankAccountId = '';
      _this3.entry.destinationAccountId = '';
      _this3.entry.movementId = '';
      _this3.entry.destinationMovementId = '';
      _this3.opening.accountId = '';
      _this3.receivablePage = 1;
      _this3.entryPage = 1;
      _this3.historyPage = 1;
      const condo = _this3.condos().find(item => item._id === _this3.condominiumId);
      _this3.units = (condo?.units || []).map(unit => ({
        ...unit,
        selected: false,
        amount: condo?.mPayment || 0
      }));
      _this3.unitNumber = _this3.units[0]?.unitNumber || '';
      _this3.charge.amount = condo?.mPayment || 0;
      if (!condo) {
        _this3.settings.set(null);
        return;
      }
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this3.api.get(`condominiums/${_this3.condominiumId}/settings`));
      _this3.settings.set(response.settings);
      _this3.draftSettings = structuredClone(response.settings);
      _this3.migrationReady.set(response.migrationReady);
      if (!_this3.ownerMode) _this3.accounts.set((yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this3.api.get('accounts', _this3.query()))).docs);
      if (response.settings.enabled) yield _this3.loadActiveTab();
    })();
  }
  switchTab(tab) {
    this.tab = tab;
    void this.perform(() => this.loadActiveTab());
  }
  refresh() {
    void this.perform(() => this.tab === 'settings' ? this.loadCondominium() : this.loadActiveTab());
  }
  loadActiveTab() {
    var _this4 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.settings()?.enabled || !_this4.condominiumId) return;
      if (_this4.tab === 'receivables' || _this4.tab === 'charges') yield _this4.loadReceivables();
      if (_this4.tab === 'history' && _this4.unitNumber) yield _this4.loadHistory();
      if (_this4.tab === 'cashbook' && _this4.settings()?.cashbookEnabled) yield _this4.loadEntries();
      if (_this4.tab === 'budget' && _this4.settings()?.reportsEnabled) yield _this4.loadBudget();
      if (_this4.tab === 'reports' && _this4.settings()?.reportsEnabled) {
        _this4.report.set(null);
        _this4.report.set(yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this4.api.get('report', _this4.dates())));
      }
    })();
  }
  loadReceivables() {
    var _this5 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this5.api.get('receivables', _this5.query({
        page: String(_this5.receivablePage)
      })));
      _this5.invoices.set(response.docs);
      _this5.totals.set(response.totals);
      _this5.receivableTotal = response.total;
      _this5.credits.set((yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this5.api.get('credits', _this5.query()))).docs);
    })();
  }
  loadEntries() {
    var _this6 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this6.api.get('entries', _this6.query({
        page: String(_this6.entryPage)
      })));
      _this6.entries.set(response.docs);
      _this6.entryTotal = response.total;
      yield _this6.loadMovements();
    })();
  }
  loadMovements() {
    var _this7 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this7.api.get('movements', _this7.query({
        page: String(_this7.movementPage)
      })));
      _this7.movements.set(response.docs);
      _this7.movementTotal = response.total;
    })();
  }
  movementOptions(destination = false, linking = false) {
    const target = linking ? this.entries().find(item => item._id === this.link.entryId) : this.entry;
    if (!target) return [];
    const accountId = destination ? target.destinationAccountId : target.bankAccountId;
    const direction = destination || target.kind === 'income' ? 'credit' : 'debit';
    return this.movements().filter(movement => movement.bankAccountId === accountId && movement.currency === this.currency && movement.direction === direction);
  }
  selectEntry(item) {
    this.link = {
      entryId: item._id,
      movementId: '',
      destinationMovementId: ''
    };
  }
  linkEntry() {
    var _this8 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this8.api.post(`entries/${_this8.link.entryId}/link`, _this8.link));
      _this8.link = {
        entryId: '',
        movementId: '',
        destinationMovementId: ''
      };
      yield _this8.loadEntries();
    }), 'Bank transaction linked');
  }
  paginateMovements(delta) {
    this.movementPage += delta;
    void this.perform(() => this.loadMovements());
  }
  loadHistory() {
    var _this9 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this9.history.set(null);
      _this9.history.set(yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this9.api.get('history', {
        ..._this9.dates(),
        unitNumber: _this9.unitNumber,
        page: String(_this9.historyPage)
      })));
    })();
  }
  loadBudget() {
    var _this0 = this;
    return (0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this0.api.get('budget', _this0.query()));
      _this0.budgetRevision = response.revision || 0;
      _this0.budgetLines = response.lines.map(line => ({
        month: line.month,
        kind: line.kind,
        category: line.category,
        amount: line.amountMinor / 100
      }));
    })();
  }
  changeHistoryFilter() {
    this.historyPage = 1;
    this.refresh();
  }
  selectInvoice(invoice) {
    this.adjustment.invoiceId = invoice._id;
    this.adjustment.amount = invoice.balancePending;
    this.adjustment.creditId = '';
    this.tab = 'charges';
  }
  equalAmounts() {
    this.units = this.units.map(unit => ({
      ...unit,
      amount: this.charge.amount
    }));
  }
  saveCharges() {
    var _this1 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const units = _this1.units.filter(unit => unit.selected).map(unit => ({
        ownerId: unit.ownerId,
        unitNumber: unit.unitNumber,
        amount: unit.amount
      }));
      if (!units.length) throw new Error('Select at least one unit');
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this1.api.post('charges', {
        ..._this1.charge,
        condominiumId: _this1.condominiumId,
        currency: _this1.currency,
        units,
        idempotencyKey: _this1.key('charges')
      }));
      _this1.operationKeys.delete('charges');
      _this1.units = _this1.units.map(unit => ({
        ...unit,
        selected: false
      }));
      yield _this1.loadReceivables();
    }), 'Charges recorded');
  }
  saveAdjustment(useCredit = false) {
    var _this10 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this10.adjustment.invoiceId) throw new Error('Select an outstanding invoice');
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this10.api.post(`invoices/${_this10.adjustment.invoiceId}/${useCredit ? 'credits' : 'adjustments'}`, {
        ..._this10.adjustment,
        idempotencyKey: _this10.key(useCredit ? 'credit' : 'adjustment')
      }));
      _this10.operationKeys.delete(useCredit ? 'credit' : 'adjustment');
      _this10.adjustment.invoiceId = '';
      yield _this10.loadReceivables();
    }), useCredit ? 'Credit applied' : 'Adjustment recorded');
  }
  reverseApplication(id) {
    var _this11 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this11.api.post(`applications/${id}/reversal`, {
        reason: _this11.reversalReason,
        idempotencyKey: _this11.key(`reverse:${id}`)
      }));
      _this11.operationKeys.delete(`reverse:${id}`);
      yield _this11.loadHistory();
    }), 'Operation reversed');
  }
  saveEntry() {
    var _this12 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this12.api.post('entries', {
        ..._this12.entry,
        condominiumId: _this12.condominiumId,
        currency: _this12.currency,
        idempotencyKey: _this12.key('entry')
      }));
      _this12.operationKeys.delete('entry');
      yield _this12.loadEntries();
    }), 'Transaction recorded');
  }
  reverseEntry(id) {
    var _this13 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this13.api.post(`entries/${id}/reversal`, {
        reason: _this13.reversalReason,
        idempotencyKey: _this13.key(`entry-reverse:${id}`)
      }));
      _this13.operationKeys.delete(`entry-reverse:${id}`);
      yield _this13.loadEntries();
    }), 'Transaction reversed');
  }
  saveSettings() {
    var _this14 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this14.settingsValidationError) throw new Error(_this14.settingsValidationError);
      const settings = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this14.api.put(`condominiums/${_this14.condominiumId}/settings`, {
        ..._this14.draftSettings,
        reviewed: _this14.reviewed
      }));
      _this14.settings.set(settings);
      _this14.draftSettings = structuredClone(settings);
    }), 'Settings saved');
  }
  runLateFees() {
    var _this15 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this15.api.post('late-fees/run', {
        condominiumId: _this15.condominiumId
      }));
      _this15.notice.set(`${result.created} late fee charges created`);
      yield _this15.loadReceivables();
    }));
  }
  addBudgetLine() {
    if (!this.budgetDraft.category.trim() || this.budgetDraft.amount < 0) {
      this.error.set('Enter a valid category and amount');
      return;
    }
    const line = {
      ...this.budgetDraft,
      category: this.budgetDraft.category.trim()
    };
    const existing = this.budgetLines.findIndex(item => item.month === line.month && item.kind === line.kind && item.category === line.category);
    this.budgetLines = existing < 0 ? [...this.budgetLines, line] : this.budgetLines.map((item, index) => index === existing ? line : item);
  }
  removeBudgetLine(index) {
    this.budgetLines = this.budgetLines.filter((_, current) => index !== current);
  }
  saveBudget() {
    var _this16 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this16.api.put('budget', {
        condominiumId: _this16.condominiumId,
        currency: _this16.currency,
        year: _this16.year,
        lines: _this16.budgetLines,
        revision: _this16.budgetRevision
      }));
      yield _this16.loadBudget();
    }), 'Budget saved');
  }
  createAccount() {
    var _this17 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this17.bankApi.post('bank-accounts', {
        ..._this17.accountDraft,
        condominiumId: _this17.condominiumId,
        currency: _this17.currency
      }));
      _this17.accounts.set((yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this17.api.get('accounts', _this17.query()))).docs);
    }), 'Account created');
  }
  saveOpening() {
    var _this18 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this18.api.put(`accounts/${_this18.opening.accountId}/opening-balance`, _this18.opening));
      _this18.accounts.set((yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this18.api.get('accounts', _this18.query()))).docs);
    }), 'Opening balance recorded');
  }
  paginate(kind, delta) {
    if (kind === 'receivables') this.receivablePage += delta;else if (kind === 'history') this.historyPage += delta;else this.entryPage += delta;
    this.refresh();
  }
  export(path) {
    var _this19 = this;
    void this.perform(/*#__PURE__*/(0,C_Users_Jcsnu_Documents_condominiosapp_ai_hardening_clean_frontend_node_modules_pnpm_babel_runtime_7_29_2_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const blob = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this19.api.export(path, {
        ..._this19.dates(),
        ...(path === 'history' ? {
          unitNumber: _this19.unitNumber
        } : {})
      }));
      const url = URL.createObjectURL(blob),
        link = document.createElement('a');
      link.href = url;
      link.download = `${path}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }));
  }
  static {
    this.ɵfac = function FinanceComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FinanceComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineComponent"]({
      type: FinanceComponent,
      selectors: [["app-finance"]],
      decls: 36,
      vars: 17,
      consts: [["chargeForm", "ngForm"], ["adjustmentForm", "ngForm"], ["entryForm", "ngForm"], ["budgetForm", "ngForm"], ["settingsForm", "ngForm"], ["accountForm", "ngForm"], ["openingForm", "ngForm"], ["aria-labelledby", "finance-title", 1, "card", "app-page-card", "finance"], [1, "app-page-header"], [1, "app-page-kicker"], ["id", "finance-title"], ["role", "alert", 1, "message", "error"], ["role", "status", 1, "message", "success"], [1, "filters"], [3, "ngModelChange", "change", "ngModel", "disabled"], ["value", ""], [3, "value"], ["pInputText", "", "maxlength", "3", 3, "ngModelChange", "change", "ngModel", "disabled"], ["pButton", "", "type", "button", 1, "finance-action", "finance-action--outlined", 3, "click", "disabled"], ["aria-label", "Finance sections"], ["type", "button", 1, "finance-tab", 3, "active", "disabled"], [1, "message"], ["type", "button", 1, "finance-tab", 3, "click", "disabled"], [1, "summary"], [1, "table-wrap"], [1, "pagination"], ["pButton", "", 1, "finance-action", "finance-action--outlined", 3, "click", "disabled"], ["colspan", "7"], [3, "ngSubmit"], [3, "disabled"], [1, "form-grid"], ["name", "chargeType", 3, "ngModelChange", "ngModel"], ["value", "monthly"], ["value", "extraordinary"], ["value", "individual"], ["value", "fine"], ["pInputText", "", "name", "issueDate", "type", "date", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "dueDate", "type", "date", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "chargeAmount", "type", "number", "min", "0.01", "step", "0.01", 3, "ngModelChange", "ngModel"], ["pButton", "", "type", "button", 1, "finance-action", "finance-action--outlined", 3, "click"], [1, "wide"], ["pTextarea", "", "name", "description", "required", "", "minlength", "3", "maxlength", "500", 3, "ngModelChange", "ngModel"], ["pButton", "", "type", "submit", 1, "finance-action", 3, "disabled"], ["type", "checkbox", 3, "ngModelChange", "name", "ngModel"], ["pInputText", "", "type", "number", "min", "0.01", "step", "0.01", 3, "ngModelChange", "name", "ngModel"], ["name", "invoice", "required", "", 3, "ngModelChange", "ngModel"], ["name", "adjustmentKind", 3, "ngModelChange", "ngModel"], ["value", "discount"], ["value", "waiver"], ["pInputText", "", "name", "adjustmentAmount", "type", "number", "min", "0.01", "step", "0.01", "required", "", 3, "ngModelChange", "ngModel"], ["pTextarea", "", "name", "adjustmentReason", "required", "", "minlength", "3", "maxlength", "500", 3, "ngModelChange", "ngModel"], ["name", "credit", 3, "ngModelChange", "ngModel"], [1, "actions"], ["pInputText", "", "type", "date", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "maxlength", "80", "placeholder", "Identificador de unidad", 3, "ngModelChange", "ngModel", "disabled"], ["pButton", "", 1, "finance-action", "finance-action--outlined", 3, "disabled"], ["colspan", "6"], ["pInputText", "", "maxlength", "500", 3, "ngModelChange", "ngModel", "disabled"], ["name", "entryKind", 3, "ngModelChange", "ngModel"], ["value", "expense"], ["value", "income"], ["value", "transfer"], ["pInputText", "", "name", "entryDate", "type", "date", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "entryAmount", "type", "number", "min", "0.01", "step", "0.01", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "category", "required", "", "maxlength", "120", 3, "ngModelChange", "ngModel"], ["name", "entryAccount", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "reference", "maxlength", "120", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "support", "maxlength", "500", "placeholder", "Documento o comprobante", 3, "ngModelChange", "ngModel"], ["pTextarea", "", "name", "entryReason", "required", "", "minlength", "3", "maxlength", "500", 3, "ngModelChange", "ngModel"], ["name", "movementId", 3, "ngModelChange", "ngModel"], ["name", "destinationAccount", "required", "", 3, "ngModelChange", "ngModel"], ["name", "destinationMovementId", 3, "ngModelChange", "ngModel"], ["name", "linkMovement", 3, "ngModelChange", "ngModel"], ["name", "linkDestination", 3, "ngModelChange", "ngModel"], ["pInputText", "", "type", "number", "min", "2000", "max", "2200", 3, "ngModelChange", "ngModel", "disabled"], ["pButton", "", 1, "finance-action", 3, "disabled"], ["pInputText", "", "name", "budgetMonth", "type", "number", "min", "1", "max", "12", "required", "", 3, "ngModelChange", "ngModel"], ["name", "budgetKind", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "budgetCategory", "required", "", "maxlength", "120", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "budgetAmount", "type", "number", "min", "0", "step", "0.01", "required", "", 3, "ngModelChange", "ngModel"], ["pButton", "", 1, "finance-action", 3, "click", "disabled"], [1, "check"], ["name", "reviewed", "type", "checkbox", 3, "ngModelChange", "ngModel"], ["name", "enabled", "type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["name", "cashbookEnabled", "type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["name", "reportsEnabled", "type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["name", "lateFeeEnabled", "type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["name", "lateFeeMode", 3, "ngModelChange", "ngModel"], ["value", "fixed"], ["value", "percent"], ["pInputText", "", "name", "lateFeeValue", "type", "number", "min", "0", "step", "0.01", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "graceDays", "type", "number", "min", "0", "max", "365", "step", "1", "required", "", 3, "ngModelChange", "ngModel"], ["role", "status", 1, "message"], ["pInputText", "", "name", "bank", "required", "", "maxlength", "120", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "accountLabel", "required", "", "maxlength", "120", 3, "ngModelChange", "ngModel"], ["name", "openingAccount", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "openingDate", "type", "date", "required", "", 3, "ngModelChange", "ngModel"], ["pInputText", "", "name", "openingAmount", "type", "number", "step", "0.01", "required", "", 3, "ngModelChange", "ngModel"]],
      template: function FinanceComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "section", 7)(1, "header", 8)(2, "div")(3, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](4, "Finance");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](5, "h1", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](6, "Financial management");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Fees, payments and transactions for your condominium.");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](9, FinanceComponent_Conditional_9_Template, 2, 1, "p", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](10, FinanceComponent_Conditional_10_Template, 2, 1, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "div", 13)(12, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13, "Condominium");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](14, "select", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Template_select_ngModelChange_14_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx.condominiumId, $event) || (ctx.condominiumId = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("change", function FinanceComponent_Template_select_change_14_listener() {
            return ctx.changeCondominium();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](15, "option", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](16, "Select");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](17, FinanceComponent_For_18_Template, 2, 2, "option", 16, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](19, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20, "Currency");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](21, "input", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayListener"]("ngModelChange", function FinanceComponent_Template_input_ngModelChange_21_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayBindingSet"](ctx.currency, $event) || (ctx.currency = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("change", function FinanceComponent_Template_input_change_21_listener() {
            return ctx.refresh();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function FinanceComponent_Template_button_click_22_listener() {
            return ctx.refresh();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](23, " Refresh ");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](24, "nav", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeaterCreate"](25, FinanceComponent_For_26_Template, 2, 5, "button", 20, _forTrack1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](27, FinanceComponent_Conditional_27_Template, 2, 0, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](28, FinanceComponent_Conditional_28_Template, 2, 0, "p", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](29, FinanceComponent_Conditional_29_Template, 35, 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](30, FinanceComponent_Conditional_30_Template, 8, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](31, FinanceComponent_Conditional_31_Template, 22, 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](32, FinanceComponent_Conditional_32_Template, 4, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](33, FinanceComponent_Conditional_33_Template, 4, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](34, FinanceComponent_Conditional_34_Template, 4, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditionalCreate"](35, FinanceComponent_Conditional_35_Template, 12, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          let tmp_11_0;
          let tmp_12_0;
          let tmp_13_0;
          let tmp_14_0;
          let tmp_15_0;
          let tmp_16_0;
          let tmp_17_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵattribute"]("aria-busy", ctx.busy());
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx.error() ? 9 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx.notice() ? 10 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx.condominiumId);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx.busy());
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx.condos());
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtwoWayProperty"]("ngModel", ctx.currency);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx.busy());
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx.busy() || !ctx.condominiumId);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrepeater"](ctx.availableTabs);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](!ctx.condos().length && !ctx.busy() ? 27 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx.condominiumId && ctx.settings() && !((tmp_11_0 = ctx.settings()) == null ? null : tmp_11_0.enabled) && ctx.tab !== "settings" ? 28 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_12_0 = ctx.settings()) == null ? null : tmp_12_0.enabled) && ctx.tab === "receivables" ? 29 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_13_0 = ctx.settings()) == null ? null : tmp_13_0.enabled) && ctx.tab === "charges" && !ctx.ownerMode ? 30 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_14_0 = ctx.settings()) == null ? null : tmp_14_0.enabled) && ctx.tab === "history" ? 31 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_15_0 = ctx.settings()) == null ? null : tmp_15_0.enabled) && ctx.tab === "cashbook" ? 32 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_16_0 = ctx.settings()) == null ? null : tmp_16_0.enabled) && ctx.tab === "budget" ? 33 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](((tmp_17_0 = ctx.settings()) == null ? null : tmp_17_0.enabled) && ctx.tab === "reports" ? 34 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵconditional"](ctx.tab === "settings" && !ctx.ownerMode && ctx.condominiumId ? 35 : -1);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonModule, primeng_button__WEBPACK_IMPORTED_MODULE_4__.ButtonDirective, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputTextModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputText, primeng_textarea__WEBPACK_IMPORTED_MODULE_6__.TextareaModule, primeng_textarea__WEBPACK_IMPORTED_MODULE_6__.Textarea, _angular_common__WEBPACK_IMPORTED_MODULE_2__.CurrencyPipe, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DatePipe],
      styles: ["[_nghost-%COMP%] {\n    display: block;\n    min-width: 0;\n    --finance-ink: #183153;\n    --finance-muted: #66758d;\n    --finance-line: #dce5ee;\n    --finance-primary: #176b87;\n}\n\n.finance[_ngcontent-%COMP%] {\n    min-width: 0;\n    padding: 1.6rem;\n    border: 1px solid var(--finance-line);\n    border-radius: 18px;\n    background: #fff;\n    color: var(--finance-ink);\n    box-shadow: none;\n}\n\n.finance[_ngcontent-%COMP%]   .app-page-header[_ngcontent-%COMP%] { align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }\n.finance[_ngcontent-%COMP%]   .app-page-kicker[_ngcontent-%COMP%] {\n    color: var(--finance-primary);\n    font-size: .72rem;\n    font-weight: 800;\n    letter-spacing: .1em;\n    text-transform: uppercase;\n}\nh1[_ngcontent-%COMP%] {\n    margin: .3rem 0 .4rem;\n    color: var(--finance-ink);\n    font-size: clamp(1.65rem, 3vw, 2.35rem);\n    line-height: 1.1;\n    letter-spacing: -.035em;\n}\nh2[_ngcontent-%COMP%] { margin: 2rem 0 1rem; color: var(--finance-ink); font-size: 1.3rem; font-weight: 700; letter-spacing: -.02em; }\nh3[_ngcontent-%COMP%] { color: var(--finance-ink); font-size: 1.05rem; font-weight: 700; }\nh4[_ngcontent-%COMP%] { color: var(--finance-ink); font-size: .95rem; font-weight: 700; }\np[_ngcontent-%COMP%] { color: var(--finance-muted); line-height: 1.5; }\n.finance[_ngcontent-%COMP%]   .app-page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: var(--finance-muted); }\nnav[_ngcontent-%COMP%], .filters[_ngcontent-%COMP%], .actions[_ngcontent-%COMP%], .pagination[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: .75rem; align-items: end; }\nnav[_ngcontent-%COMP%] {\n    margin: 1.25rem 0 1.5rem;\n    padding: .25rem;\n    border: 1px solid var(--finance-line);\n    border-radius: 12px;\n    gap: .2rem;\n}\n.finance-tab[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    min-height: 44px;\n    padding: .6rem .85rem;\n    border: 0;\n    border-radius: 8px;\n    background: transparent;\n    color: var(--finance-muted);\n    font: inherit;\n    font-weight: 700;\n    cursor: pointer;\n}\n.finance-tab.active[_ngcontent-%COMP%] { background: #e8f2f5; color: #105d76; }\n.finance-tab[_ngcontent-%COMP%]:hover:not(:disabled) { background: #f1f5f8; }\n[_nghost-%COMP%]   .finance-action.p-button[_ngcontent-%COMP%] {\n    min-height: 44px;\n    padding: .65rem 1rem;\n    border: 1px solid var(--finance-primary);\n    border-radius: 10px;\n    background: var(--finance-primary);\n    color: #fff;\n    font: inherit;\n    font-weight: 700;\n    box-shadow: none;\n    cursor: pointer;\n}\n[_nghost-%COMP%]   .finance-action.p-button[_ngcontent-%COMP%]:hover:not(:disabled) { background: #125b73; border-color: #125b73; }\n[_nghost-%COMP%]   .finance-action--outlined.p-button[_ngcontent-%COMP%] {\n    background: #fff;\n    color: var(--finance-primary);\n    border-color: var(--finance-line);\n    font-weight: 650;\n}\n[_nghost-%COMP%]   .finance-action--outlined.p-button[_ngcontent-%COMP%]:hover:not(:disabled) { background: #e8f2f5; border-color: var(--finance-primary); color: #105d76; }\nbutton[_ngcontent-%COMP%]:disabled, [_nghost-%COMP%]   .finance-action.p-button[_ngcontent-%COMP%]:disabled { opacity: .55; cursor: default; }\nbutton[_ngcontent-%COMP%]:focus-visible, input[_ngcontent-%COMP%]:focus-visible, select[_ngcontent-%COMP%]:focus-visible, textarea[_ngcontent-%COMP%]:focus-visible, summary[_ngcontent-%COMP%]:focus-visible {\n    outline: 2px solid var(--finance-primary);\n    outline-offset: 2px;\n}\nlabel[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: .4rem; margin: .5rem 0; color: var(--finance-muted); font-size: .85rem; font-weight: 600; min-width: 0; }\n.filters[_ngcontent-%COMP%] { padding: .5rem 0; }\n.filters[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%], .form-grid[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%] { margin: 0; }\ninput[_ngcontent-%COMP%], select[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%] {\n    min-width: 0;\n    min-height: 44px;\n    max-width: 100%;\n    padding: .65rem .75rem;\n    border: 1px solid var(--finance-line);\n    border-radius: 10px;\n    background: #fff;\n    color: var(--finance-ink);\n    font: inherit;\n    font-weight: 400;\n    box-shadow: none;\n}\ninput[_ngcontent-%COMP%]:hover:not(:disabled), select[_ngcontent-%COMP%]:hover:not(:disabled), textarea[_ngcontent-%COMP%]:hover:not(:disabled) { border-color: var(--finance-primary); }\ninput[_ngcontent-%COMP%]:disabled, select[_ngcontent-%COMP%]:disabled, textarea[_ngcontent-%COMP%]:disabled { background: #f5f8fb; color: var(--finance-muted); }\ninput[type=\"checkbox\"][_ngcontent-%COMP%] { width: 1.1rem; height: 1.1rem; min-height: 0; flex-shrink: 0; accent-color: var(--finance-primary); }\ntextarea[_ngcontent-%COMP%] { min-height: 6rem; resize: vertical; }\n.check[_ngcontent-%COMP%] { flex-direction: row; align-items: center; gap: .65rem; color: var(--finance-ink); font-weight: 500; line-height: 1.5; }\nfieldset[_ngcontent-%COMP%] { border: 0; padding: 0; margin: 0; min-width: 0; }\nform[_ngcontent-%COMP%] { margin: 1rem 0; padding: 1.15rem; border: 1px solid var(--finance-line); border-radius: 16px; background: #fff; }\n.form-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .8rem; align-items: end; margin-bottom: 1rem; }\n.form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]    > input[_ngcontent-%COMP%], .form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]    > select[_ngcontent-%COMP%], .form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]    > textarea[_ngcontent-%COMP%] { width: 100%; }\n.wide[_ngcontent-%COMP%] { grid-column: 1 / -1; }\n.summary[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }\n.summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] { min-width: 0; padding: 1.15rem; border: 1px solid var(--finance-line); border-radius: 16px; color: var(--finance-ink); background: #fff; font-size: 1.2rem; font-weight: 700; overflow-wrap: anywhere; }\n.summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 .75rem; color: var(--finance-primary); font-size: .72rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }\n.summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 .75rem; }\n.summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { font-size: 1.65rem; line-height: 1.2; letter-spacing: -.035em; }\n.summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: .65rem 0 0; font-size: .85rem; font-weight: 400; }\n.table-wrap[_ngcontent-%COMP%] { overflow-x: auto; margin: 1rem 0; border: 1px solid var(--finance-line); border-radius: 12px; }\ntable[_ngcontent-%COMP%] { border-collapse: collapse; width: 100%; font-size: .9rem; }\nth[_ngcontent-%COMP%], td[_ngcontent-%COMP%] { text-align: left; padding: .85rem 1rem; border-bottom: 1px solid var(--finance-line); white-space: nowrap; }\nth[_ngcontent-%COMP%] { background: #f5f8fb; color: var(--finance-muted); font-size: .8rem; font-weight: 700; }\ntd[_ngcontent-%COMP%] { color: var(--finance-ink); }\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] { border-bottom: 0; }\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover { background: #f5f8fb; }\ntd[_ngcontent-%COMP%]   input[type=\"number\"][_ngcontent-%COMP%] { max-width: 140px; }\n.message[_ngcontent-%COMP%] { padding: 1rem; border: 1px solid var(--finance-line); border-left: 4px solid var(--finance-primary); border-radius: 10px; background: #e8f2f5; color: #105d76; font-size: .9rem; }\n.error[_ngcontent-%COMP%] { border-color: #f0d1cc; border-left-color: #c44732; background: #fff0ed; color: #b42318; }\n.success[_ngcontent-%COMP%] { border-color: #cceadd; border-left-color: #08785d; background: #e9f8f2; color: #08785d; }\n.pagination[_ngcontent-%COMP%] { align-items: center; margin: 1rem 0; padding-top: .5rem; color: var(--finance-muted); font-size: .85rem; }\ndetails[_ngcontent-%COMP%] { margin: 1rem 0; padding: 1rem; border: 1px solid var(--finance-line); border-radius: 12px; }\nsummary[_ngcontent-%COMP%] { color: var(--finance-primary); font-size: .9rem; font-weight: 700; cursor: pointer; }\ndetails[open][_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] { margin-bottom: 1rem; }\nul[_ngcontent-%COMP%] { padding-left: 1.25rem; color: var(--finance-muted); line-height: 1.8; overflow-wrap: anywhere; }\n\n@media (max-width: 680px) {\n    .finance[_ngcontent-%COMP%] { padding: 1rem; }\n    .finance[_ngcontent-%COMP%]   .app-page-header[_ngcontent-%COMP%] { flex-direction: column; align-items: stretch; }\n    .filters[_ngcontent-%COMP%] { align-items: stretch; }\n    .filters[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%], .filters[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] { width: 100%; }\n    nav[_ngcontent-%COMP%]   .finance-tab[_ngcontent-%COMP%] { flex: 1 1 10rem; }\n    .form-grid[_ngcontent-%COMP%], .summary[_ngcontent-%COMP%] { grid-template-columns: minmax(0, 1fr); }\n    form[_ngcontent-%COMP%], .summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] { padding: .9rem; }\n    .actions[_ngcontent-%COMP%] { flex-direction: column; align-items: stretch; }\n    .pagination[_ngcontent-%COMP%] { justify-content: center; }\n    .pagination[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] { order: -1; flex-basis: 100%; text-align: center; }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2ZpbmFuY2UvZmluYW5jZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksY0FBYztJQUNkLFlBQVk7SUFDWixzQkFBc0I7SUFDdEIsd0JBQXdCO0lBQ3hCLHVCQUF1QjtJQUN2QiwwQkFBMEI7QUFDOUI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osZUFBZTtJQUNmLHFDQUFxQztJQUNyQyxtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLHlCQUF5QjtJQUN6QixnQkFBZ0I7QUFDcEI7O0FBRUEsNEJBQTRCLG1CQUFtQixFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRTtBQUN0RjtJQUNJLDZCQUE2QjtJQUM3QixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQix5QkFBeUI7QUFDN0I7QUFDQTtJQUNJLHFCQUFxQjtJQUNyQix5QkFBeUI7SUFDekIsdUNBQXVDO0lBQ3ZDLGdCQUFnQjtJQUNoQix1QkFBdUI7QUFDM0I7QUFDQSxLQUFLLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFO0FBQ2xILEtBQUsseUJBQXlCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdEUsS0FBSyx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRTtBQUNyRSxJQUFJLDJCQUEyQixFQUFFLGdCQUFnQixFQUFFO0FBQ25ELDhCQUE4QixTQUFTLEVBQUUsMkJBQTJCLEVBQUU7QUFDdEUsdUNBQXVDLGFBQWEsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFO0FBQ3RHO0lBQ0ksd0JBQXdCO0lBQ3hCLGVBQWU7SUFDZixxQ0FBcUM7SUFDckMsbUJBQW1CO0lBQ25CLFVBQVU7QUFDZDtBQUNBO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsZ0JBQWdCO0lBQ2hCLHFCQUFxQjtJQUNyQixTQUFTO0lBQ1Qsa0JBQWtCO0lBQ2xCLHVCQUF1QjtJQUN2QiwyQkFBMkI7SUFDM0IsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQixlQUFlO0FBQ25CO0FBQ0Esc0JBQXNCLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUMzRCxvQ0FBb0MsbUJBQW1CLEVBQUU7QUFDekQ7SUFDSSxnQkFBZ0I7SUFDaEIsb0JBQW9CO0lBQ3BCLHdDQUF3QztJQUN4QyxtQkFBbUI7SUFDbkIsa0NBQWtDO0lBQ2xDLFdBQVc7SUFDWCxhQUFhO0lBQ2IsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixlQUFlO0FBQ25CO0FBQ0Esc0RBQXNELG1CQUFtQixFQUFFLHFCQUFxQixFQUFFO0FBQ2xHO0lBQ0ksZ0JBQWdCO0lBQ2hCLDZCQUE2QjtJQUM3QixpQ0FBaUM7SUFDakMsZ0JBQWdCO0FBQ3BCO0FBQ0EsZ0VBQWdFLG1CQUFtQixFQUFFLG9DQUFvQyxFQUFFLGNBQWMsRUFBRTtBQUMzSSwyREFBMkQsWUFBWSxFQUFFLGVBQWUsRUFBRTtBQUMxRjtJQUNJLHlDQUF5QztJQUN6QyxtQkFBbUI7QUFDdkI7QUFDQSxRQUFRLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLDJCQUEyQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRTtBQUM1SixXQUFXLGdCQUFnQixFQUFFO0FBQzdCLHVDQUF1QyxTQUFTLEVBQUU7QUFDbEQ7SUFDSSxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixzQkFBc0I7SUFDdEIscUNBQXFDO0lBQ3JDLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIseUJBQXlCO0lBQ3pCLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0FBQ3BCO0FBQ0EseUZBQXlGLG9DQUFvQyxFQUFFO0FBQy9ILHFEQUFxRCxtQkFBbUIsRUFBRSwyQkFBMkIsRUFBRTtBQUN2Ryx5QkFBeUIsYUFBYSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLG9DQUFvQyxFQUFFO0FBQzdILFdBQVcsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDL0MsU0FBUyxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUseUJBQXlCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUU7QUFDL0gsV0FBVyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7QUFDM0QsT0FBTyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUscUNBQXFDLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUU7QUFDdkgsYUFBYSxhQUFhLEVBQUUsMkRBQTJELEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFO0FBQzVJLG1GQUFtRixXQUFXLEVBQUU7QUFDaEcsUUFBUSxtQkFBbUIsRUFBRTtBQUM3QixXQUFXLGFBQWEsRUFBRSwyREFBMkQsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFO0FBQ2xILG1CQUFtQixZQUFZLEVBQUUsZ0JBQWdCLEVBQUUscUNBQXFDLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUU7QUFDMU4sc0JBQXNCLGtCQUFrQixFQUFFLDZCQUE2QixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLHlCQUF5QixFQUFFO0FBQy9KLHNCQUFzQixrQkFBa0IsRUFBRTtBQUMxQywwQkFBMEIsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUU7QUFDekYscUJBQXFCLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFO0FBQzlFLGNBQWMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLHFDQUFxQyxFQUFFLG1CQUFtQixFQUFFO0FBQzVHLFFBQVEseUJBQXlCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFO0FBQ2xFLFNBQVMsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsNENBQTRDLEVBQUUsbUJBQW1CLEVBQUU7QUFDcEgsS0FBSyxtQkFBbUIsRUFBRSwyQkFBMkIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRTtBQUMzRixLQUFLLHlCQUF5QixFQUFFO0FBQ2hDLHlCQUF5QixnQkFBZ0IsRUFBRTtBQUMzQyxpQkFBaUIsbUJBQW1CLEVBQUU7QUFDdEMsMEJBQTBCLGdCQUFnQixFQUFFO0FBQzVDLFdBQVcsYUFBYSxFQUFFLHFDQUFxQyxFQUFFLDZDQUE2QyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRTtBQUM1TCxTQUFTLHFCQUFxQixFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUNqRyxXQUFXLHFCQUFxQixFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUNuRyxjQUFjLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSwyQkFBMkIsRUFBRSxpQkFBaUIsRUFBRTtBQUN2SCxVQUFVLGNBQWMsRUFBRSxhQUFhLEVBQUUscUNBQXFDLEVBQUUsbUJBQW1CLEVBQUU7QUFDckcsVUFBVSw2QkFBNkIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUU7QUFDOUYsMEJBQTBCLG1CQUFtQixFQUFFO0FBQy9DLEtBQUsscUJBQXFCLEVBQUUsMkJBQTJCLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUU7O0FBRXBHO0lBQ0ksV0FBVyxhQUFhLEVBQUU7SUFDMUIsNEJBQTRCLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFO0lBQzFFLFdBQVcsb0JBQW9CLEVBQUU7SUFDakMsc0NBQXNDLFdBQVcsRUFBRTtJQUNuRCxtQkFBbUIsZUFBZSxFQUFFO0lBQ3BDLHVCQUF1QixxQ0FBcUMsRUFBRTtJQUM5RCx5QkFBeUIsY0FBYyxFQUFFO0lBQ3pDLFdBQVcsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQUU7SUFDekQsY0FBYyx1QkFBdUIsRUFBRTtJQUN2QyxxQkFBcUIsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFO0FBQzFFIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1pbi13aWR0aDogMDtcbiAgICAtLWZpbmFuY2UtaW5rOiAjMTgzMTUzO1xuICAgIC0tZmluYW5jZS1tdXRlZDogIzY2NzU4ZDtcbiAgICAtLWZpbmFuY2UtbGluZTogI2RjZTVlZTtcbiAgICAtLWZpbmFuY2UtcHJpbWFyeTogIzE3NmI4Nztcbn1cblxuLmZpbmFuY2Uge1xuICAgIG1pbi13aWR0aDogMDtcbiAgICBwYWRkaW5nOiAxLjZyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZmluYW5jZS1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgY29sb3I6IHZhcigtLWZpbmFuY2UtaW5rKTtcbiAgICBib3gtc2hhZG93OiBub25lO1xufVxuXG4uZmluYW5jZSAuYXBwLXBhZ2UtaGVhZGVyIHsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiAxLjI1cmVtOyBtYXJnaW4tYm90dG9tOiAxLjVyZW07IH1cbi5maW5hbmNlIC5hcHAtcGFnZS1raWNrZXIge1xuICAgIGNvbG9yOiB2YXIoLS1maW5hbmNlLXByaW1hcnkpO1xuICAgIGZvbnQtc2l6ZTogLjcycmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IC4xZW07XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbn1cbmgxIHtcbiAgICBtYXJnaW46IC4zcmVtIDAgLjRyZW07XG4gICAgY29sb3I6IHZhcigtLWZpbmFuY2UtaW5rKTtcbiAgICBmb250LXNpemU6IGNsYW1wKDEuNjVyZW0sIDN2dywgMi4zNXJlbSk7XG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcbiAgICBsZXR0ZXItc3BhY2luZzogLS4wMzVlbTtcbn1cbmgyIHsgbWFyZ2luOiAycmVtIDAgMXJlbTsgY29sb3I6IHZhcigtLWZpbmFuY2UtaW5rKTsgZm9udC1zaXplOiAxLjNyZW07IGZvbnQtd2VpZ2h0OiA3MDA7IGxldHRlci1zcGFjaW5nOiAtLjAyZW07IH1cbmgzIHsgY29sb3I6IHZhcigtLWZpbmFuY2UtaW5rKTsgZm9udC1zaXplOiAxLjA1cmVtOyBmb250LXdlaWdodDogNzAwOyB9XG5oNCB7IGNvbG9yOiB2YXIoLS1maW5hbmNlLWluayk7IGZvbnQtc2l6ZTogLjk1cmVtOyBmb250LXdlaWdodDogNzAwOyB9XG5wIHsgY29sb3I6IHZhcigtLWZpbmFuY2UtbXV0ZWQpOyBsaW5lLWhlaWdodDogMS41OyB9XG4uZmluYW5jZSAuYXBwLXBhZ2UtaGVhZGVyIHAgeyBtYXJnaW46IDA7IGNvbG9yOiB2YXIoLS1maW5hbmNlLW11dGVkKTsgfVxubmF2LCAuZmlsdGVycywgLmFjdGlvbnMsIC5wYWdpbmF0aW9uIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyBnYXA6IC43NXJlbTsgYWxpZ24taXRlbXM6IGVuZDsgfVxubmF2IHtcbiAgICBtYXJnaW46IDEuMjVyZW0gMCAxLjVyZW07XG4gICAgcGFkZGluZzogLjI1cmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWZpbmFuY2UtbGluZSk7XG4gICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICBnYXA6IC4ycmVtO1xufVxuLmZpbmFuY2UtdGFiIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDQ0cHg7XG4gICAgcGFkZGluZzogLjZyZW0gLjg1cmVtO1xuICAgIGJvcmRlcjogMDtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6IHZhcigtLWZpbmFuY2UtbXV0ZWQpO1xuICAgIGZvbnQ6IGluaGVyaXQ7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uZmluYW5jZS10YWIuYWN0aXZlIHsgYmFja2dyb3VuZDogI2U4ZjJmNTsgY29sb3I6ICMxMDVkNzY7IH1cbi5maW5hbmNlLXRhYjpob3Zlcjpub3QoOmRpc2FibGVkKSB7IGJhY2tncm91bmQ6ICNmMWY1Zjg7IH1cbjpob3N0IC5maW5hbmNlLWFjdGlvbi5wLWJ1dHRvbiB7XG4gICAgbWluLWhlaWdodDogNDRweDtcbiAgICBwYWRkaW5nOiAuNjVyZW0gMXJlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1maW5hbmNlLXByaW1hcnkpO1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tZmluYW5jZS1wcmltYXJ5KTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBmb250OiBpbmhlcml0O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG59XG46aG9zdCAuZmluYW5jZS1hY3Rpb24ucC1idXR0b246aG92ZXI6bm90KDpkaXNhYmxlZCkgeyBiYWNrZ3JvdW5kOiAjMTI1YjczOyBib3JkZXItY29sb3I6ICMxMjViNzM7IH1cbjpob3N0IC5maW5hbmNlLWFjdGlvbi0tb3V0bGluZWQucC1idXR0b24ge1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgY29sb3I6IHZhcigtLWZpbmFuY2UtcHJpbWFyeSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1maW5hbmNlLWxpbmUpO1xuICAgIGZvbnQtd2VpZ2h0OiA2NTA7XG59XG46aG9zdCAuZmluYW5jZS1hY3Rpb24tLW91dGxpbmVkLnAtYnV0dG9uOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsgYmFja2dyb3VuZDogI2U4ZjJmNTsgYm9yZGVyLWNvbG9yOiB2YXIoLS1maW5hbmNlLXByaW1hcnkpOyBjb2xvcjogIzEwNWQ3NjsgfVxuYnV0dG9uOmRpc2FibGVkLCA6aG9zdCAuZmluYW5jZS1hY3Rpb24ucC1idXR0b246ZGlzYWJsZWQgeyBvcGFjaXR5OiAuNTU7IGN1cnNvcjogZGVmYXVsdDsgfVxuYnV0dG9uOmZvY3VzLXZpc2libGUsIGlucHV0OmZvY3VzLXZpc2libGUsIHNlbGVjdDpmb2N1cy12aXNpYmxlLCB0ZXh0YXJlYTpmb2N1cy12aXNpYmxlLCBzdW1tYXJ5OmZvY3VzLXZpc2libGUge1xuICAgIG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1maW5hbmNlLXByaW1hcnkpO1xuICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XG59XG5sYWJlbCB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGdhcDogLjRyZW07IG1hcmdpbjogLjVyZW0gMDsgY29sb3I6IHZhcigtLWZpbmFuY2UtbXV0ZWQpOyBmb250LXNpemU6IC44NXJlbTsgZm9udC13ZWlnaHQ6IDYwMDsgbWluLXdpZHRoOiAwOyB9XG4uZmlsdGVycyB7IHBhZGRpbmc6IC41cmVtIDA7IH1cbi5maWx0ZXJzID4gbGFiZWwsIC5mb3JtLWdyaWQgPiBsYWJlbCB7IG1hcmdpbjogMDsgfVxuaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEge1xuICAgIG1pbi13aWR0aDogMDtcbiAgICBtaW4taGVpZ2h0OiA0NHB4O1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBwYWRkaW5nOiAuNjVyZW0gLjc1cmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWZpbmFuY2UtbGluZSk7XG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIGNvbG9yOiB2YXIoLS1maW5hbmNlLWluayk7XG4gICAgZm9udDogaW5oZXJpdDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG59XG5pbnB1dDpob3Zlcjpub3QoOmRpc2FibGVkKSwgc2VsZWN0OmhvdmVyOm5vdCg6ZGlzYWJsZWQpLCB0ZXh0YXJlYTpob3Zlcjpub3QoOmRpc2FibGVkKSB7IGJvcmRlci1jb2xvcjogdmFyKC0tZmluYW5jZS1wcmltYXJ5KTsgfVxuaW5wdXQ6ZGlzYWJsZWQsIHNlbGVjdDpkaXNhYmxlZCwgdGV4dGFyZWE6ZGlzYWJsZWQgeyBiYWNrZ3JvdW5kOiAjZjVmOGZiOyBjb2xvcjogdmFyKC0tZmluYW5jZS1tdXRlZCk7IH1cbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7IHdpZHRoOiAxLjFyZW07IGhlaWdodDogMS4xcmVtOyBtaW4taGVpZ2h0OiAwOyBmbGV4LXNocmluazogMDsgYWNjZW50LWNvbG9yOiB2YXIoLS1maW5hbmNlLXByaW1hcnkpOyB9XG50ZXh0YXJlYSB7IG1pbi1oZWlnaHQ6IDZyZW07IHJlc2l6ZTogdmVydGljYWw7IH1cbi5jaGVjayB7IGZsZXgtZGlyZWN0aW9uOiByb3c7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogLjY1cmVtOyBjb2xvcjogdmFyKC0tZmluYW5jZS1pbmspOyBmb250LXdlaWdodDogNTAwOyBsaW5lLWhlaWdodDogMS41OyB9XG5maWVsZHNldCB7IGJvcmRlcjogMDsgcGFkZGluZzogMDsgbWFyZ2luOiAwOyBtaW4td2lkdGg6IDA7IH1cbmZvcm0geyBtYXJnaW46IDFyZW0gMDsgcGFkZGluZzogMS4xNXJlbTsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZmluYW5jZS1saW5lKTsgYm9yZGVyLXJhZGl1czogMTZweDsgYmFja2dyb3VuZDogI2ZmZjsgfVxuLmZvcm0tZ3JpZCB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpOyBnYXA6IC44cmVtOyBhbGlnbi1pdGVtczogZW5kOyBtYXJnaW4tYm90dG9tOiAxcmVtOyB9XG4uZm9ybS1ncmlkIGxhYmVsID4gaW5wdXQsIC5mb3JtLWdyaWQgbGFiZWwgPiBzZWxlY3QsIC5mb3JtLWdyaWQgbGFiZWwgPiB0ZXh0YXJlYSB7IHdpZHRoOiAxMDAlOyB9XG4ud2lkZSB7IGdyaWQtY29sdW1uOiAxIC8gLTE7IH1cbi5zdW1tYXJ5IHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMDBweCwgMWZyKSk7IGdhcDogMXJlbTsgbWFyZ2luOiAxcmVtIDA7IH1cbi5zdW1tYXJ5IGFydGljbGUgeyBtaW4td2lkdGg6IDA7IHBhZGRpbmc6IDEuMTVyZW07IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWZpbmFuY2UtbGluZSk7IGJvcmRlci1yYWRpdXM6IDE2cHg7IGNvbG9yOiB2YXIoLS1maW5hbmNlLWluayk7IGJhY2tncm91bmQ6ICNmZmY7IGZvbnQtc2l6ZTogMS4ycmVtOyBmb250LXdlaWdodDogNzAwOyBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTsgfVxuLnN1bW1hcnkgYXJ0aWNsZSBoMyB7IG1hcmdpbjogMCAwIC43NXJlbTsgY29sb3I6IHZhcigtLWZpbmFuY2UtcHJpbWFyeSk7IGZvbnQtc2l6ZTogLjcycmVtOyBmb250LXdlaWdodDogODAwOyBsZXR0ZXItc3BhY2luZzogLjFlbTsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgfVxuLnN1bW1hcnkgYXJ0aWNsZSBoNCB7IG1hcmdpbjogMCAwIC43NXJlbTsgfVxuLnN1bW1hcnkgYXJ0aWNsZSBzdHJvbmcgeyBmb250LXNpemU6IDEuNjVyZW07IGxpbmUtaGVpZ2h0OiAxLjI7IGxldHRlci1zcGFjaW5nOiAtLjAzNWVtOyB9XG4uc3VtbWFyeSBhcnRpY2xlIHAgeyBtYXJnaW46IC42NXJlbSAwIDA7IGZvbnQtc2l6ZTogLjg1cmVtOyBmb250LXdlaWdodDogNDAwOyB9XG4udGFibGUtd3JhcCB7IG92ZXJmbG93LXg6IGF1dG87IG1hcmdpbjogMXJlbSAwOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1maW5hbmNlLWxpbmUpOyBib3JkZXItcmFkaXVzOiAxMnB4OyB9XG50YWJsZSB7IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7IHdpZHRoOiAxMDAlOyBmb250LXNpemU6IC45cmVtOyB9XG50aCwgdGQgeyB0ZXh0LWFsaWduOiBsZWZ0OyBwYWRkaW5nOiAuODVyZW0gMXJlbTsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWZpbmFuY2UtbGluZSk7IHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbnRoIHsgYmFja2dyb3VuZDogI2Y1ZjhmYjsgY29sb3I6IHZhcigtLWZpbmFuY2UtbXV0ZWQpOyBmb250LXNpemU6IC44cmVtOyBmb250LXdlaWdodDogNzAwOyB9XG50ZCB7IGNvbG9yOiB2YXIoLS1maW5hbmNlLWluayk7IH1cbnRib2R5IHRyOmxhc3QtY2hpbGQgdGQgeyBib3JkZXItYm90dG9tOiAwOyB9XG50Ym9keSB0cjpob3ZlciB7IGJhY2tncm91bmQ6ICNmNWY4ZmI7IH1cbnRkIGlucHV0W3R5cGU9XCJudW1iZXJcIl0geyBtYXgtd2lkdGg6IDE0MHB4OyB9XG4ubWVzc2FnZSB7IHBhZGRpbmc6IDFyZW07IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWZpbmFuY2UtbGluZSk7IGJvcmRlci1sZWZ0OiA0cHggc29saWQgdmFyKC0tZmluYW5jZS1wcmltYXJ5KTsgYm9yZGVyLXJhZGl1czogMTBweDsgYmFja2dyb3VuZDogI2U4ZjJmNTsgY29sb3I6ICMxMDVkNzY7IGZvbnQtc2l6ZTogLjlyZW07IH1cbi5lcnJvciB7IGJvcmRlci1jb2xvcjogI2YwZDFjYzsgYm9yZGVyLWxlZnQtY29sb3I6ICNjNDQ3MzI7IGJhY2tncm91bmQ6ICNmZmYwZWQ7IGNvbG9yOiAjYjQyMzE4OyB9XG4uc3VjY2VzcyB7IGJvcmRlci1jb2xvcjogI2NjZWFkZDsgYm9yZGVyLWxlZnQtY29sb3I6ICMwODc4NWQ7IGJhY2tncm91bmQ6ICNlOWY4ZjI7IGNvbG9yOiAjMDg3ODVkOyB9XG4ucGFnaW5hdGlvbiB7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IG1hcmdpbjogMXJlbSAwOyBwYWRkaW5nLXRvcDogLjVyZW07IGNvbG9yOiB2YXIoLS1maW5hbmNlLW11dGVkKTsgZm9udC1zaXplOiAuODVyZW07IH1cbmRldGFpbHMgeyBtYXJnaW46IDFyZW0gMDsgcGFkZGluZzogMXJlbTsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZmluYW5jZS1saW5lKTsgYm9yZGVyLXJhZGl1czogMTJweDsgfVxuc3VtbWFyeSB7IGNvbG9yOiB2YXIoLS1maW5hbmNlLXByaW1hcnkpOyBmb250LXNpemU6IC45cmVtOyBmb250LXdlaWdodDogNzAwOyBjdXJzb3I6IHBvaW50ZXI7IH1cbmRldGFpbHNbb3Blbl0gPiBzdW1tYXJ5IHsgbWFyZ2luLWJvdHRvbTogMXJlbTsgfVxudWwgeyBwYWRkaW5nLWxlZnQ6IDEuMjVyZW07IGNvbG9yOiB2YXIoLS1maW5hbmNlLW11dGVkKTsgbGluZS1oZWlnaHQ6IDEuODsgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7IH1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDY4MHB4KSB7XG4gICAgLmZpbmFuY2UgeyBwYWRkaW5nOiAxcmVtOyB9XG4gICAgLmZpbmFuY2UgLmFwcC1wYWdlLWhlYWRlciB7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGFsaWduLWl0ZW1zOiBzdHJldGNoOyB9XG4gICAgLmZpbHRlcnMgeyBhbGlnbi1pdGVtczogc3RyZXRjaDsgfVxuICAgIC5maWx0ZXJzID4gbGFiZWwsIC5maWx0ZXJzID4gYnV0dG9uIHsgd2lkdGg6IDEwMCU7IH1cbiAgICBuYXYgLmZpbmFuY2UtdGFiIHsgZmxleDogMSAxIDEwcmVtOyB9XG4gICAgLmZvcm0tZ3JpZCwgLnN1bW1hcnkgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1pbm1heCgwLCAxZnIpOyB9XG4gICAgZm9ybSwgLnN1bW1hcnkgYXJ0aWNsZSB7IHBhZGRpbmc6IC45cmVtOyB9XG4gICAgLmFjdGlvbnMgeyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogc3RyZXRjaDsgfVxuICAgIC5wYWdpbmF0aW9uIHsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cbiAgICAucGFnaW5hdGlvbiA+IHNwYW4geyBvcmRlcjogLTE7IGZsZXgtYmFzaXM6IDEwMCU7IHRleHQtYWxpZ246IGNlbnRlcjsgfVxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
      changeDetection: 0
    });
  }
}

/***/ },

/***/ 44795
/*!*************************************************!*\
  !*** ./src/app/demo/service/finance.service.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FinanceService: () => (/* binding */ FinanceService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 59315);
/* harmony import */ var _global_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./global.service */ 53796);
/* harmony import */ var _user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user.service */ 37612);






class FinanceService {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient);
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_user_service__WEBPACK_IMPORTED_MODULE_4__.UserService);
    this.base = `${_global_service__WEBPACK_IMPORTED_MODULE_3__.global.url}finance/`;
  }
  get headers() {
    return new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders().set('Authorization', this.user.getToken());
  }
  get(path, query = {}) {
    return this.http.get(this.base + path, {
      headers: this.headers,
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams({
        fromObject: query
      })
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data));
  }
  post(path, body) {
    return this.http.post(this.base + path, body, {
      headers: this.headers
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data));
  }
  put(path, body) {
    return this.http.put(this.base + path, body, {
      headers: this.headers
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data));
  }
  export(path, query) {
    return this.http.get(this.base + path, {
      headers: this.headers,
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams({
        fromObject: {
          ...query,
          format: 'csv'
        }
      }),
      responseType: 'blob'
    });
  }
  static {
    this.ɵfac = function FinanceService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FinanceService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: FinanceService,
      factory: FinanceService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_finance_finance_component_ts.js.map