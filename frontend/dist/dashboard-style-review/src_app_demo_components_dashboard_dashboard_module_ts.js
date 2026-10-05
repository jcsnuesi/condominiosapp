"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_dashboard_dashboard_module_ts"],{

/***/ 55315
/*!**********************************************************!*\
  !*** ./src/app/demo/components/cards/cards.component.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardsComponent: () => (/* binding */ CardsComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var primeng_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/tabs */ 16643);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 58440);






class CardsComponent {
  static {
    this.ɵfac = function CardsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CardsComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: CardsComponent,
      selectors: [["app-cards"]],
      decls: 0,
      vars: 0,
      template: function CardsComponent_Template(rf, ctx) {},
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, primeng_tabs__WEBPACK_IMPORTED_MODULE_2__.TabsModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_1__.DialogModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormsModule],
      styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ },

/***/ 20728
/*!***********************************************************************!*\
  !*** ./src/app/demo/components/dashboard/dashboard-routing.module.ts ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardsRoutingModule: () => (/* binding */ DashboardsRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _dashboard_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.component */ 55915);
/* harmony import */ var _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../booking-area/booking-area.component */ 20067);
/* harmony import */ var _staff_staff_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../staff/staff.component */ 81235);
/* harmony import */ var _family_area_family_area_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../family-area/family-area.component */ 56431);
/* harmony import */ var _service_routing_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/routing.guard */ 42497);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 94975);








class DashboardsRoutingModule {
  static {
    this.ɵfac = function DashboardsRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DashboardsRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
      type: DashboardsRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _dashboard_component__WEBPACK_IMPORTED_MODULE_1__.DashboardComponent,
        canActivate: [_service_routing_guard__WEBPACK_IMPORTED_MODULE_5__.UserGuard],
        data: {
          permission: 'dashboard.read'
        }
      }, {
        path: 'start',
        component: _dashboard_component__WEBPACK_IMPORTED_MODULE_1__.DashboardComponent,
        canActivate: [_service_routing_guard__WEBPACK_IMPORTED_MODULE_5__.UserGuard],
        data: {
          permission: 'dashboard.read'
        }
      }, {
        path: 'start/:id',
        component: _dashboard_component__WEBPACK_IMPORTED_MODULE_1__.DashboardComponent,
        canActivate: [_service_routing_guard__WEBPACK_IMPORTED_MODULE_5__.UserGuard],
        data: {
          permission: 'dashboard.read'
        }
      }, {
        path: 'booking-area/:id',
        component: _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_2__.BookingAreaComponent,
        canActivate: [_service_routing_guard__WEBPACK_IMPORTED_MODULE_5__.UserGuard],
        data: {
          permission: 'bookings.read'
        }
      }, {
        path: 'staff-regular/:id',
        component: _staff_staff_component__WEBPACK_IMPORTED_MODULE_3__.StaffComponent,
        canActivate: [_service_routing_guard__WEBPACK_IMPORTED_MODULE_5__.UserGuard],
        data: {
          permission: 'staff.read'
        }
      }, {
        path: 'family-area/:id',
        component: _family_area_family_area_component__WEBPACK_IMPORTED_MODULE_4__.FamilyAreaComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](DashboardsRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 55915
/*!******************************************************************!*\
  !*** ./src/app/demo/components/dashboard/dashboard.component.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardComponent: () => (/* binding */ DashboardComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 40311);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 59374);
/* harmony import */ var src_app_layout_service_chart_theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/layout/service/chart-theme */ 9497);
/* harmony import */ var _service_condominios_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/condominios.service */ 30689);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../service/global.service */ 53796);
/* harmony import */ var _models_owner_model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/owner.model */ 22899);
/* harmony import */ var _service_owner_service_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../service/owner-service.service */ 12132);
/* harmony import */ var _imports_primeng__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../imports_primeng */ 86309);
/* harmony import */ var src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/has-permissions.directive */ 25428);
/* harmony import */ var _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../booking-area/booking-area.component */ 20067);
/* harmony import */ var _staff_staff_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../staff/staff.component */ 81235);
/* harmony import */ var _service_invoice_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../service/invoice.service */ 74978);
/* harmony import */ var _invoice_history_invoice_history_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../invoice-history/invoice-history.component */ 37935);
/* harmony import */ var _service_inquiry_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../service/inquiry.service */ 44292);
/* harmony import */ var _inquiry_inquiry_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../inquiry/inquiry.component */ 65947);
/* harmony import */ var _docs_docs_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../docs/docs.component */ 86323);
/* harmony import */ var _service_docs_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../service/docs.service */ 91144);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/core */ 37800);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! src/app/layout/service/app.layout.service */ 12681);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _service_booking_service_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../service/booking-service.service */ 50624);
/* harmony import */ var _service_staff_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../service/staff.service */ 88211);
/* harmony import */ var primeng_breadcrumb__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! primeng/breadcrumb */ 34088);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! primeng/chart */ 95109);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! primeng/toast */ 20708);








































const _c0 = () => ["admin", "staff_admin", "staff"];
const _c1 = () => ["owner"];
const _c2 = (a0, a1, a2) => ({
  "text-red-500": a0,
  "text-yellow-500": a1,
  "text-green-500": a2
});
const _c3 = (a0, a1, a2, a3) => ({
  "status-high": a0,
  "status-urgent": a1,
  "status-medium": a2,
  "status-low": a3
});
function DashboardComponent_p_message_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "p-message", 24);
  }
  if (rf & 2) {
    const message_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("severity", message_r1.severity)("text", message_r1.detail || message_r1.summary)("closable", false);
  }
}
function DashboardComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Some dashboard data could not be loaded. Select Refresh to try again.");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.balance, " ");
  }
}
function DashboardComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpipe"](6, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](7, "small")(8, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](10, " pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpipeBind2"](6, 2, ctx_r1.invoiceCards.totalBalance, "USD"));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.invoiceCards.counts);
  }
}
function DashboardComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading total units");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.units, " ");
  }
}
function DashboardComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Total units");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](7, "registered units");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalUnits);
  }
}
function DashboardComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading bookings");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.bookings, " ");
  }
}
function DashboardComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Bookings");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](6, "small")(7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalBooked);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.bookingExpiring);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.bookingExpiryLabel);
  }
}
function DashboardComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading staff");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.staff, " ");
  }
}
function DashboardComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Staff");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](7, "active collaborators");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalStaff);
  }
}
function DashboardComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading inquiries");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.inquiries, " ");
  }
}
function DashboardComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Inquiries");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](6, "small")(7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalInquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalRespondedInquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.totalRespondedInquiries === 1 ? "response" : "responses");
  }
}
function DashboardComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Loading documents");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.documents, " ");
  }
}
function DashboardComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](1, "i", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3, "Documents");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](7, "stored files");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.totalDocuments);
  }
}
function DashboardComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "section", 16)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2, "Current section");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](3, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.activeSectionLabel);
  }
}
function DashboardComponent_Conditional_46_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](1, "No inquiries found.");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
}
function DashboardComponent_Conditional_46_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "div", 44)(1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](2, "i", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](4, "div", 47)(5, "div", 48)(6, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](8, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpipe"](10, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](11, "p-button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Conditional_46_div_8_Template_p_button_click_11_listener() {
      const inquiry_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.showInquiryDialog(inquiry_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](12, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const inquiry_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpureFunction3"](11, _c2, inquiry_r4.status === "high" || inquiry_r4.status === "urgent", inquiry_r4.status === "medium", inquiry_r4.status === "low"));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", inquiry_r4.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate1"](" ", inquiry_r4.fullname, " has sent an inquiry. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpureFunction4"](15, _c3, inquiry_r4.status === "high", inquiry_r4.status === "urgent", inquiry_r4.status === "medium", inquiry_r4.status === "low"));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpipeBind1"](10, 9, inquiry_r4.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ariaLabel", "View inquiry " + inquiry_r4.title + " from " + inquiry_r4.fullname)("rounded", true)("text", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("title", "View inquiry: " + inquiry_r4.title);
  }
}
function DashboardComponent_Conditional_46_p_chart_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "p-chart", 52);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("data", ctx_r1.data)("options", ctx_r1.options);
  }
}
function DashboardComponent_Conditional_46_p_chart_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "p-chart", 52);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("data", ctx_r1.dataOwner)("options", ctx_r1.options);
  }
}
function DashboardComponent_Conditional_46_Conditional_17_For_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "tr")(1, "th", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const label_r5 = ctx.$implicit;
    const ɵ$index_335_r6 = ctx.$index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](label_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[0].data[ɵ$index_335_r6]);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[1].data[ɵ$index_335_r6]);
  }
}
function DashboardComponent_Conditional_46_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "details", 43)(1, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2, "View payments as a table");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](3, "div", 53)(4, "table", 54)(5, "caption", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](6, " Monthly paid and unpaid invoice counts ");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](7, "thead")(8, "tr")(9, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](10, "Month");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](11, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](13, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵrepeaterCreate"](16, DashboardComponent_Conditional_46_Conditional_17_For_17_Template, 7, 3, "tr", null, _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[0].label);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[1].label);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵrepeater"](ctx_r1.dataOwner.labels);
  }
}
function DashboardComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "div", 17)(1, "div", 37)(2, "div", 38)(3, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](4, "Notifications");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](5, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](6, DashboardComponent_Conditional_46_Conditional_6_Template, 2, 0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](7, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtemplate"](8, DashboardComponent_Conditional_46_div_8_Template, 13, 20, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](9, "div", 37)(10, "div", 38)(11, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](12, "Monthly Payments Stats");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](13, "p", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](14, " Monthly comparison of paid and unpaid invoice counts. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtemplate"](15, DashboardComponent_Conditional_46_p_chart_15_Template, 1, 2, "p-chart", 42)(16, DashboardComponent_Conditional_46_p_chart_16_Template, 1, 2, "p-chart", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](17, DashboardComponent_Conditional_46_Conditional_17_Template, 18, 2, "details", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx_r1.dashboardCardLoading.inquiries && !ctx_r1.dashboardCardErrors.inquiries && !ctx_r1.areThereInquiries ? 6 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ngForOf", ctx_r1.inquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("appHasPermissions", _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("appHasPermissions", _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵpureFunction0"](6, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"]((ctx_r1.dataOwner == null ? null : ctx_r1.dataOwner.labels == null ? null : ctx_r1.dataOwner.labels.length) && (ctx_r1.dataOwner == null ? null : ctx_r1.dataOwner.datasets == null ? null : ctx_r1.dataOwner.datasets.length) >= 2 ? 17 : -1);
  }
}
function DashboardComponent_ng_template_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "span", 57)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](2, "Authorized users");
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](3, "hr");
  }
}
function DashboardComponent_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "app-family-area");
  }
}
function DashboardComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "app-booking-area", 20);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("condoId", ctx_r1.units_ownerId);
  }
}
function DashboardComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "app-invoice-history", 21);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ownerId", ctx_r1.condoId);
  }
}
function DashboardComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "app-staff", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("staffCard", function DashboardComponent_Conditional_52_Template_app_staff_staffCard_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.totalStaff = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("condoId", ctx_r1.condoId);
  }
}
function DashboardComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](0, "app-inquiry", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("clearSelectedInquiryDialog", function DashboardComponent_Conditional_53_Template_app_inquiry_clearSelectedInquiryDialog_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.clearInquiryDialogSelection());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("condoId", ctx_r1.condoId)("isHome", false)("dataDialog", ctx_r1.inquiryDialogData);
  }
}
function DashboardComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "app-docs", 23);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("isDashboard", true)("dataDocs", ctx_r1.documentsData)("userId", ctx_r1.getId());
  }
}
class DashboardComponent {
  get hasDashboardCardErrors() {
    return Object.values(this.dashboardCardErrors).some(Boolean);
  }
  get bookingExpiryLabel() {
    return this.bookingExpiring === 1 ? 'reservation expires today' : 'reservations expire today';
  }
  isSuccessResponse(response) {
    return response?.success === true || response?.status === 'success';
  }
  toArray(value) {
    return Array.isArray(value) ? value : [];
  }
  settleCardLoading(key) {
    this.dashboardCardLoading[key] = false;
    this._changeDetectorRef.detectChanges();
  }
  setCardError(key, message) {
    this.dashboardCardErrors[key] = message;
  }
  clearCardError(key) {
    this.dashboardCardErrors[key] = null;
  }
  constructor(_condominioService, _userService, layoutService, _activatedRoute, _messageService, _confirmationService, _bookingService, _staffService, _invoiceService, _inquiryService, _docsService, _changeDetectorRef) {
    this._condominioService = _condominioService;
    this._userService = _userService;
    this.layoutService = layoutService;
    this._activatedRoute = _activatedRoute;
    this._messageService = _messageService;
    this._confirmationService = _confirmationService;
    this._bookingService = _bookingService;
    this._staffService = _staffService;
    this._invoiceService = _invoiceService;
    this._inquiryService = _inquiryService;
    this._docsService = _docsService;
    this._changeDetectorRef = _changeDetectorRef;
    this.files = [];
    this.totalInquiries = 0;
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.property_typeOptions = [];
    this.totalBooked = 0;
    this.first_password = false;
    this.changePasswordDialog = false;
    this.visibleCreateOwnerUnit = false;
    this.totalDocuments = 0;
    this.bookingExpiring = 0;
    this.totalRespondedInquiries = 0;
    this.activeSectionLabel = 'Overview';
    this.dashboardCardLoading = {
      balance: true,
      units: true,
      bookings: true,
      staff: true,
      inquiries: true,
      documents: true
    };
    this.dashboardCardErrors = {
      balance: null,
      units: null,
      bookings: null,
      staff: null,
      inquiries: null,
      documents: null
    };
    this.propertyInfoEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.areThereInquiries = false;
    this.totalStaff = 0;
    this.indexStepper = 0;
    this.documentsData = [{
      value: '*',
      label: 'All'
    }];
    this.visible = false;
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
      if (this.options) this.options = (0,src_app_layout_service_chart_theme__WEBPACK_IMPORTED_MODULE_4__.withChartTheme)(this.options);
    });
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.currentIcon = 'pi-building';
    this.gbColor = 'blue-100';
    this.url = _service_global_service__WEBPACK_IMPORTED_MODULE_7__.global.url;
    this.ownerObj = new _models_owner_model__WEBPACK_IMPORTED_MODULE_8__.OwnerModel('noimage.jpeg', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.componentsToShow = {
      invoice: false,
      booking: false,
      staff: false,
      main: true,
      inquiry: false,
      documents: false
    };
    this.formValidation = this.ownerObj.apartmentsUnit != '' && this.ownerObj.parkingsQty != '' && this.ownerObj.isRenting != '' ? false : true;
    this.image = '../../assets/noimage2.jpeg';
    this.idroute = this.identity._id;
    this.condoOptions = [];
    this.apiUnitResponse = false;
    this.messageApiResponse = {
      message: '',
      severity: ''
    };
    this.visible_owner = false;
    this.areaSocial = false;
    this.first_password = this.identity.first_password_changed == false ? true : false;
    this.propertyInactive = [];
    this.itemsx = [{
      label: 'Home',
      command: () => {
        this.showComponent('main');
      },
      styleClass: 'cursor-pointer',
      icon: 'pi pi-home'
    }];
    this.invoiceCards = {
      totalBalance: 0,
      counts: 0
    };
    this.invoiceDataForCharts = [];
  }
  showInquiryDialog(inquiry) {
    this.inquiryDialogData = {
      _id: inquiry.id,
      visible: true,
      identity: this.identity,
      inquiry: inquiry.detail
    };
    this.showComponent('inquiry');
  }
  clearInquiryDialogSelection() {
    this.inquiryDialogData = {
      identity: this.identity,
      visible: false
    };
  }
  ngOnInit() {
    this.onInitInfo();
    this.inquiryDialogData = {
      identity: this.identity
    };
    this.genderOption = [{
      name: 'Male',
      gender: 'm'
    }, {
      name: 'Female',
      gender: 'f'
    }];
    this.parkingOptions = [];
    for (let index = 1; index < 5; index++) {
      this.parkingOptions.push(index);
    }
    this.isRentOptions = [{
      name: 'Yes',
      code: true
    }, {
      name: 'No',
      code: false
    }];
    this.property_typeOptions = [{
      name: 'House',
      code: 'house'
    }, {
      name: 'Apartment',
      code: 'apartment'
    }, {
      name: 'Condo',
      code: 'condo'
    }, {
      name: 'Townhouse',
      code: 'townhouse'
    }, {
      name: 'Villa',
      code: 'villa'
    }, {
      name: 'Penthouse',
      code: 'penthouse'
    }];
    this.items = [{
      label: 'Add New',
      icon: 'pi pi-fw pi-plus'
    }, {
      label: 'Remove',
      icon: 'pi pi-fw pi-minus'
    }];
    this.condoId = this.getId();
    this.refreshDashboard();
  }
  refreshDashboard() {
    this.dashboardCardLoading = {
      balance: true,
      units: true,
      bookings: true,
      staff: true,
      inquiries: true,
      documents: true
    };
    this.dashboardCardErrors = {
      balance: null,
      units: null,
      bookings: null,
      staff: null,
      inquiries: null,
      documents: null
    };
    this.loadBookingCard();
    this.getStaffQty();
    this.loadUnitsCard();
    this.getAllInvoices();
    this.inquiriesCard();
    this.documentsCard();
  }
  ownerChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    let data = {
      unpaid: {},
      paid: {}
    };
    this.invoiceDataForCharts.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const monthName = date.toLocaleString('es-ES', {
        month: 'long'
      }).replace(/^\w/, c => c.toUpperCase());
      if (invoice.paymentStatus === 'pending' || invoice.paymentStatus === 'failed') {
        if (!Object.keys(data.unpaid).includes(monthName)) {
          data.unpaid[monthName] = 1;
        } else {
          data.unpaid[monthName] += 1;
        }
      } else {
        if (!Object.keys(data.paid).includes(monthName)) {
          data.paid[monthName] = 1;
        } else {
          data.paid[monthName] += 1;
        }
      }
    });
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    let monthLabels = new Set();
    Object.keys(data.paid).forEach(month => monthLabels.add(month));
    Object.keys(data.unpaid).forEach(month => monthLabels.add(month));
    let [unpaid, paid] = Object.keys(data);
    this.dataOwner = {
      labels: Array.from(monthLabels),
      datasets: [{
        label: paid.charAt(0).toUpperCase() + paid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
        borderColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
        data: Object.values(data.paid)
      }, {
        label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
        borderColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
        data: Object.values(data.unpaid)
      }]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  documentsCard() {
    this._docsService.docCard(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('documents');
    })).subscribe({
      next: response => {
        if (this.isSuccessResponse(response)) {
          this.totalDocuments = Number(response.data?.message ?? response.data ?? 0) || 0;
          this.clearCardError('documents');
        } else {
          this.totalDocuments = 0;
          this.setCardError('documents', 'Documents could not be loaded.');
        }
      },
      error: error => {
        console.log(error);
        this.totalDocuments = 0;
        this.setCardError('documents', 'Documents could not be loaded.');
      }
    });
  }
  AdminsChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    let data = {
      unpaid: {},
      paid: {}
    };
    this.invoiceDataForCharts.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const monthName = date.toLocaleString('es-ES', {
        month: 'long'
      }).replace(/^\w/, c => c.toUpperCase());
      if (invoice.paymentStatus === 'pending' || invoice.paymentStatus === 'failed') {
        if (!Object.keys(data.unpaid).includes(monthName)) {
          data.unpaid[monthName] = 1;
        } else {
          data.unpaid[monthName] += 1;
        }
      } else {
        if (!Object.keys(data.paid).includes(monthName)) {
          data.paid[monthName] = 1;
        } else {
          data.paid[monthName] += 1;
        }
      }
    });
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    let monthLabels = new Set();
    Object.keys(data.paid).forEach(month => monthLabels.add(month));
    Object.keys(data.unpaid).forEach(month => monthLabels.add(month));
    let [unpaid, paid] = Object.keys(data);
    this.data = {
      labels: Array.from(monthLabels),
      datasets: [{
        label: paid.charAt(0).toUpperCase() + paid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
        borderColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
        data: Object.values(data.paid)
      }, {
        label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
        borderColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
        data: Object.values(data.unpaid)
      }]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  inquiriesCard() {
    this._inquiryService.getOwnerInquiries(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('inquiries');
    })).subscribe({
      next: response => {
        const isSuccess = response?.success === true || response?.status === 'success';
        const docs = response?.data?.docs || [];
        if (isSuccess) {
          this.totalInquiries = Number(response?.data?.totalDocs ?? docs.length) || 0;
          this.totalRespondedInquiries = Number(response?.data?.responded ?? 0) || 0;
          this.inquiries = docs.map(inquiry => ({
            id: inquiry._id,
            fullname: (inquiry?.createdBy?.name ?? '') + ' ' + (inquiry?.createdBy?.lastname ?? ''),
            title: inquiry?.title ?? '',
            status: inquiry?.priority ?? 'low',
            detail: inquiry
          }));
          this.areThereInquiries = this.inquiries.length > 0 ? true : false;
          this.clearCardError('inquiries');
        } else {
          this.totalInquiries = 0;
          this.totalRespondedInquiries = 0;
          this.inquiries = [];
          this.areThereInquiries = false;
          this.setCardError('inquiries', 'Inquiries could not be loaded.');
        }
      },
      error: error => {
        console.log(error);
        this.totalInquiries = 0;
        this.totalRespondedInquiries = 0;
        this.inquiries = [];
        this.areThereInquiries = false;
        this.setCardError('inquiries', 'Inquiries could not be loaded.');
      }
    });
  }
  showComponent(show) {
    this.componentsToShow = {
      invoice: false,
      booking: false,
      staff: false,
      main: false,
      inquiry: false,
      documents: false
    };
    this.componentsToShow[show] = true;
    const sectionLabels = {
      main: 'Overview',
      invoice: 'Balance',
      booking: 'Bookings',
      staff: 'Staff',
      inquiry: 'Inquiries',
      documents: 'Documents'
    };
    this.activeSectionLabel = sectionLabels[show] ?? 'Overview';
  }
  getId() {
    if (!this.identity || !this.identity.role) {
      return undefined;
    }
    const role = this.identity.role.toLowerCase();
    if (role === 'owner' || role === 'admin') {
      return this.identity._id;
    } else if (role === 'family') {
      return this.identity.ownerId;
    } else {
      return this.identity.createdBy;
    }
  }
  getAllInvoices() {
    this._invoiceService.getInvoiceSummary(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('balance');
    })).subscribe({
      next: response => {
        if (this.isSuccessResponse(response)) {
          const monthly = this.toArray(response.data?.monthly);
          const summary = response.data?.summary ?? {};
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const labels = monthly.map(x => monthNames[x?.month] ?? '');
          const paidData = monthly.map(x => Number(x?.paid) || 0);
          const unpaidData = monthly.map(x => Number(x?.unpaid) || 0);
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');
          const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
          const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
          const chartData = {
            labels,
            datasets: [{
              label: 'Paid',
              backgroundColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
              borderColor: documentStyle.getPropertyValue('--app-dark-accent').trim() || '#176b87',
              data: paidData
            }, {
              label: 'Unpaid',
              backgroundColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
              borderColor: documentStyle.getPropertyValue('--app-dark-danger-text').trim() || '#c44732',
              data: unpaidData
            }]
          };
          this.dataOwner = chartData;
          this.data = chartData;
          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: {
                  color: textColor
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                  font: {
                    weight: 500
                  }
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false
                }
              },
              y: {
                ticks: {
                  color: textColorSecondary
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false
                }
              }
            }
          };
          this.invoiceCards.totalBalance = Number(summary?.totalAmountDue) || 0;
          this.invoiceCards.counts = Number(summary?.pending) || 0;
          this.clearCardError('balance');
        } else {
          this.invoiceCards.totalBalance = 0;
          this.invoiceCards.counts = 0;
          this.setCardError('balance', 'Balance could not be loaded.');
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load invoices',
            life: 3000
          });
        }
      },
      error: error => {
        console.log(error);
        this.invoiceCards.totalBalance = 0;
        this.invoiceCards.counts = 0;
        this.setCardError('balance', 'Balance could not be loaded.');
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load invoices',
          life: 3000
        });
      }
    });
  }
  loadUnitsCard() {
    this._condominioService.getUnits(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('units');
    })).subscribe({
      next: response => {
        if (this.isSuccessResponse(response)) {
          this.totalUnits = this.toArray(response.data?.units).length;
          this.clearCardError('units');
        } else {
          this.totalUnits = 0;
          this.setCardError('units', 'Units could not be loaded.');
        }
      },
      error: error => {
        console.log(error);
        this.totalUnits = 0;
        this.setCardError('units', 'Units could not be loaded.');
      }
    });
  }
  hideFamilyDialogfunc(visible) {
    if (typeof visible === 'boolean') {
      this.visibleCreateOwnerUnit = visible;
      this._messageService.add({
        severity: 'success',
        summary: 'Member submited',
        detail: 'Member Created Successfully!',
        life: 8000
      });
    } else {
      this._messageService.add({
        severity: 'error',
        summary: 'Member was not created',
        detail: `${visible.msg}`,
        life: 8000
      });
    }
  }
  passwordChanged(event) {
    if (event) {
      this.first_password = false;
      this._messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'Password Changed successfully!',
        life: 3000
      });
    } else {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password was not Changed',
        life: 3000
      });
    }
  }
  getStaffQty() {
    this._staffService.getStaffCard(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('staff');
    })).subscribe({
      next: response => {
        if (this.isSuccessResponse(response)) {
          this.totalStaff = Number(response?.data?.message ?? response?.message ?? response?.data ?? 0) || 0;
          this.clearCardError('staff');
        } else {
          this.totalStaff = 0;
          this.setCardError('staff', 'Staff could not be loaded.');
        }
      },
      error: error => {
        console.log(error);
        this.totalStaff = 0;
        this.setCardError('staff', 'Staff could not be loaded.');
      }
    });
  }
  propertyData(data) {
    // emit data to parent component
    this.propertyInfoEvent.emit(data);
  }
  loadBookingCard() {
    this._bookingService.getBookingCount(this.getId()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.timeout)(15000), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => {
      this.settleCardLoading('bookings');
    })).subscribe({
      next: response => {
        if (this.isSuccessResponse(response)) {
          const counts = response?.data ?? response;
          this.totalBooked = Number(counts?.total ?? 0);
          this.bookingExpiring = Number(counts?.expiringToday ?? 0);
          this.clearCardError('bookings');
        } else {
          this.totalBooked = 0;
          this.bookingExpiring = 0;
          this.setCardError('bookings', 'Bookings could not be loaded.');
        }
      },
      error: error => {
        console.log(error);
        this.totalBooked = 0;
        this.bookingExpiring = 0;
        this.setCardError('bookings', 'Bookings could not be loaded.');
      }
    });
  }
  onMouseOver() {
    this.currentIcon = 'pi-plus';
    this.gbColor = 'yellow-200';
  }
  onMouseOut() {
    this.currentIcon = 'pi-building';
    this.gbColor = 'blue-100';
  }
  onSelect(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      this.image = base64Data;
    };
    reader.readAsDataURL(file.files[0]);
    this.ownerObj.avatar = file.files[0];
  }
  onTemplatedUpload() {
    this._messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000
    });
  }
  onInitInfo() {
    this._activatedRoute.params.subscribe(() => {
      const id = this.getId();
      this._condominioService.getPropertyByIdentifier(id).subscribe({
        next: response => {
          const condominiums = this.toArray(response?.condominiums ?? response?.data?.condominiums);
          this.documentsData = [{
            value: '*',
            label: 'All'
          }, ...condominiums.map(doc => ({
            value: doc._id,
            label: doc.alias
          }))];
          if (this.isSuccessResponse(response)) {
            this.units_ownerId = id;
            this.units = condominiums.length;
          } else {
            this.units = 0;
            console.log('Error--->', response);
          }
        },
        error: error => {
          this.units = 0;
          this.documentsData = [{
            value: '*',
            label: 'All'
          }];
          console.log(error);
        }
      });
    });
  }
  unitFormatOnInit(unit) {
    var unitList = [];
    for (let index = 0; index < unit.length; index++) {
      unitList.push(unit[index].condominium_unit);
    }
    return unitList.join(', ');
  }
  btnSecondStepper() {
    if (this.ownerObj.name != '' && this.ownerObj.lastname != '' && this.ownerObj.phone != '' && this.ownerObj.gender != '') {
      return false;
    }
    return true;
  }
  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
        borderColor: documentStyle.getPropertyValue('--bluegray-700'),
        tension: 0.4
      }, {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: documentStyle.getPropertyValue('--green-600'),
        borderColor: documentStyle.getPropertyValue('--green-600'),
        tension: 0.4
      }]
    };
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  showOwnerDialog(events) {
    this.ownerObj = events;
    this.propertyDetailsUser = events;
    this.propertyDetailsUser.units = events.propertyDetails.condominium_unit;
    this.propertyDetailsUser.fullname = events.name + ' ' + events.lastname;
    this.propertyDetailsUser.isRent = events.isRenting;
    this.propertyDetailsUser.emergecyPhoneNumber = '809-555-5555';
    this.propertyDetailsUser.paymentMehtod = 'Deposit: Bank of America';
    // this.propertyDetailsUser.condominium_unit = events.propertyDetails.condominium_unit
    // this.propertyDetailsUser.isRenting = events.propertyDetails.isRenting
    // this.propertyDetailsUser.parkingsQty = events.propertyDetails.parkingsQty
    // this.propertyDetailsUser.payment = this.propertyObj.mPayment
    this.visible_owner = true;
    if (this.identity._id == events._id) {
      this.passwordOwner = true;
    } else {
      this.passwordOwner = false;
    }
  }
  editProduct(details) {
    this.propertyDetailsUser = {
      ...details
    };
    this.updateUnitDetails = true;
  }
  getSeverity(severity) {
    return severity == 'active' ? 'success' : 'danger';
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  confirmUpdate(event) {
    this._confirmationService.confirm({
      target: event.target,
      message: 'Please confirm to proceed moving forward.',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        this._messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
          life: 3000
        });
        this.onUpdate();
      },
      reject: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000
        });
      }
    });
  }
  onUpdate() {
    this.formData.append('avatar', this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg');
    for (const key in this.ownerObj) {
      if (key == 'avatar' || key == 'propertyDetails' || key == 'familyAccount') {
        continue;
      } else {
        this.formData.append(key, this.ownerObj[key]);
      }
    }
  }
  hideDialog() {}
  // Crear table de manera dinamica para el modal
  setModalContent(modalKey) {
    let template = {
      headers: {
        unit_detalis: {
          title: 'Create unit',
          thead: ['Image', 'Unit Number', 'Owner', 'Email', 'Phone', 'Status', 'Actions'],
          tdata: this.propertyObj
        }
      }
    };
    return template.headers[modalKey];
  }
  getModalContent() {
    this.ownerObj = new _models_owner_model__WEBPACK_IMPORTED_MODULE_8__.OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    // return this.setModalContent('unit_detalis')
  }
  static {
    this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_condominios_service__WEBPACK_IMPORTED_MODULE_5__.CondominioService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_user_service__WEBPACK_IMPORTED_MODULE_6__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_22__.LayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_23__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_1__.MessageService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_1__.ConfirmationService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_booking_service_service__WEBPACK_IMPORTED_MODULE_24__.BookingServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_staff_service__WEBPACK_IMPORTED_MODULE_25__.StaffService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_invoice_service__WEBPACK_IMPORTED_MODULE_14__.InvoiceService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_inquiry_service__WEBPACK_IMPORTED_MODULE_16__.InquiryService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_service_docs_service__WEBPACK_IMPORTED_MODULE_19__.DocsService), _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_20__.ChangeDetectorRef));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineComponent"]({
      type: DashboardComponent,
      selectors: [["ng-component"]],
      outputs: {
        propertyInfoEvent: "propertyInfoEvent"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵProvidersFeature"]([_service_condominios_service__WEBPACK_IMPORTED_MODULE_5__.CondominioService, _service_user_service__WEBPACK_IMPORTED_MODULE_6__.UserService, primeng_api__WEBPACK_IMPORTED_MODULE_1__.MessageService, primeng_api__WEBPACK_IMPORTED_MODULE_1__.ConfirmationService, _service_owner_service_service__WEBPACK_IMPORTED_MODULE_9__.OwnerServiceService, _service_invoice_service__WEBPACK_IMPORTED_MODULE_14__.InvoiceService, _service_inquiry_service__WEBPACK_IMPORTED_MODULE_16__.InquiryService, _service_docs_service__WEBPACK_IMPORTED_MODULE_19__.DocsService])],
      decls: 55,
      vars: 56,
      consts: [[3, "severity", "text", "closable", 4, "ngFor", "ngForOf"], [1, "dashboard-hero", "card", "mb-4"], [1, "eyebrow"], ["styleClass", "dashboard-refresh-action", "icon", "pi pi-refresh", "label", "Refresh", "ariaLabel", "Refresh dashboard data", "severity", "secondary", 3, "onClick", "outlined"], ["role", "alert", 1, "dashboard-data-alert"], [1, "grid", "dashboard-stat-grid"], [1, "col-12", "sm:col-6", "xl:col-4", "2xl:col-2"], ["type", "button", 1, "stat-card", "stat-card-success", 3, "click", "disabled"], ["role", "status", "aria-live", "polite", 1, "stat-card-loader"], ["role", "alert", 1, "stat-card-error"], [1, "stat-card", "stat-card-info", "stat-card-static"], ["type", "button", 1, "stat-card", "stat-card-warning", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-cyan", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-purple", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-docs", 3, "click", "disabled"], [1, "max-w-full", "mb-4", "dashboard-breadcrumb", 3, "model"], ["aria-live", "polite", "aria-atomic", "true", 1, "dashboard-active-context", "dashboard-section-status"], [1, "grid", "mt-2"], [3, "visibleChange", "visible", "modal", "maximizable"], ["pTemplate", "header"], [3, "condoId"], [3, "ownerId"], [3, "condoId", "isHome", "dataDialog"], [3, "isDashboard", "dataDocs", "userId"], [3, "severity", "text", "closable"], ["aria-hidden", "true", 1, "pi", "pi-exclamation-triangle"], ["styleClass", "dashboard-card-spinner", "aria-hidden", "true"], [1, "sr-only"], ["aria-hidden", "true", 1, "pi", "pi-exclamation-circle"], [1, "stat-icon"], [1, "pi", "pi-money-bill"], [1, "stat-label"], [1, "pi", "pi-home"], [1, "pi", "pi-calendar-minus"], [1, "pi", "pi-users"], [1, "pi", "pi-comment"], [1, "pi", "pi-folder"], [1, "col-12", "xl:col-6"], [1, "card", "dashboard-panel"], [1, "notifications"], ["class", "notification-item", 4, "ngFor", "ngForOf"], ["id", "monthly-payments-description", 1, "chart-description"], ["type", "bar", "aria-hidden", "true", 3, "data", "options", 4, "appHasPermissions"], [1, "chart-data-summary", "dashboard-chart-summary"], [1, "notification-item"], [1, "notification-icon"], [1, "pi", "pi-comment", 3, "ngClass"], [1, "notification-content"], [1, "body-notification"], [1, "notification-text"], [1, "notification-status", 3, "ngClass"], ["icon", "pi pi-eye", 3, "click", "ariaLabel", "rounded", "text"], ["type", "bar", "aria-hidden", "true", 3, "data", "options"], [1, "chart-table-scroll"], ["aria-describedby", "monthly-payments-description"], ["scope", "col"], ["scope", "row"], [1, "font-semibold", "text-xl", "w-100"], [3, "staffCard", "condoId"], [3, "clearSelectedInquiryDialog", "condoId", "isHome", "dataDialog"]],
      template: function DashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](0, "p-toast")(1, "p-confirmDialog");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtemplate"](2, DashboardComponent_p_message_2_Template, 1, 3, "p-message", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](3, "section", 1)(4, "div")(5, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](6, "Condominium overview");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](7, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](8, "Dashboard");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](9, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtext"](10, " Monitor balances, units, bookings, staff, inquiries, and documents from one place. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](11, "p-button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("onClick", function DashboardComponent_Template_p_button_onClick_11_listener() {
            return ctx.refreshDashboard();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](12, DashboardComponent_Conditional_12_Template, 4, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](13, "div", 5)(14, "div", 6)(15, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_15_listener() {
            return ctx.showComponent("invoice");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](16, DashboardComponent_Conditional_16_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](17, DashboardComponent_Conditional_17_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](18, DashboardComponent_Conditional_18_Template, 11, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](19, "div", 6)(20, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](21, DashboardComponent_Conditional_21_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](22, DashboardComponent_Conditional_22_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](23, DashboardComponent_Conditional_23_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](24, "div", 6)(25, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_25_listener() {
            return ctx.showComponent("booking");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](26, DashboardComponent_Conditional_26_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](27, DashboardComponent_Conditional_27_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](28, DashboardComponent_Conditional_28_Template, 10, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](29, "div", 6)(30, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_30_listener() {
            return ctx.showComponent("staff");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](31, DashboardComponent_Conditional_31_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](32, DashboardComponent_Conditional_32_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](33, DashboardComponent_Conditional_33_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](34, "div", 6)(35, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_35_listener() {
            return ctx.showComponent("inquiry");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](36, DashboardComponent_Conditional_36_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](37, DashboardComponent_Conditional_37_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](38, DashboardComponent_Conditional_38_Template, 10, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](39, "div", 6)(40, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_40_listener() {
            return ctx.showComponent("documents");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](41, DashboardComponent_Conditional_41_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](42, DashboardComponent_Conditional_42_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](43, DashboardComponent_Conditional_43_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelement"](44, "p-breadcrumb", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](45, DashboardComponent_Conditional_45_Template, 5, 1, "section", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](46, DashboardComponent_Conditional_46_Template, 18, 7, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementStart"](47, "p-dialog", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtwoWayListener"]("visibleChange", function DashboardComponent_Template_p_dialog_visibleChange_47_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtwoWayBindingSet"](ctx.visibleCreateOwnerUnit, $event) || (ctx.visibleCreateOwnerUnit = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtemplate"](48, DashboardComponent_ng_template_48_Template, 4, 0, "ng-template", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](49, DashboardComponent_Conditional_49_Template, 1, 0, "app-family-area");
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](50, DashboardComponent_Conditional_50_Template, 1, 1, "app-booking-area", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](51, DashboardComponent_Conditional_51_Template, 1, 1, "app-invoice-history", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](52, DashboardComponent_Conditional_52_Template, 1, 1, "app-staff", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](53, DashboardComponent_Conditional_53_Template, 1, 3, "app-inquiry", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditionalCreate"](54, DashboardComponent_Conditional_54_Template, 1, 3, "app-docs", 23);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("ngForOf", ctx.propertyInactive);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("outlined", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.hasDashboardCardErrors ? 12 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.balance ? 16 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.balance && ctx.dashboardCardErrors.balance ? 17 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.balance && !ctx.dashboardCardErrors.balance ? 18 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.units);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.units);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.units ? 21 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.units && ctx.dashboardCardErrors.units ? 22 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.units && !ctx.dashboardCardErrors.units ? 23 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.bookings ? 26 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.bookings && ctx.dashboardCardErrors.bookings ? 27 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.bookings && !ctx.dashboardCardErrors.bookings ? 28 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.staff ? 31 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.staff && ctx.dashboardCardErrors.staff ? 32 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.staff && !ctx.dashboardCardErrors.staff ? 33 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.inquiries ? 36 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.inquiries && ctx.dashboardCardErrors.inquiries ? 37 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.inquiries && !ctx.dashboardCardErrors.inquiries ? 38 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.dashboardCardLoading.documents ? 41 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.documents && ctx.dashboardCardErrors.documents ? 42 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.dashboardCardLoading.documents && !ctx.dashboardCardErrors.documents ? 43 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("model", ctx.itemsx);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](!ctx.componentsToShow.main ? 45 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.main ? 46 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵtwoWayProperty"]("visible", ctx.visibleCreateOwnerUnit);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵproperty"]("modal", true)("maximizable", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.visibleCreateOwnerUnit ? 49 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.booking ? 50 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.invoice ? 51 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.staff ? 52 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.inquiry ? 53 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵconditional"](ctx.componentsToShow.documents ? 54 : -1);
        }
      },
      dependencies: [_docs_docs_component__WEBPACK_IMPORTED_MODULE_18__.DocsComponent, _imports_primeng__WEBPACK_IMPORTED_MODULE_10__.ImportsModule, primeng_api__WEBPACK_IMPORTED_MODULE_1__.PrimeTemplate, primeng_breadcrumb__WEBPACK_IMPORTED_MODULE_26__.Breadcrumb, primeng_button__WEBPACK_IMPORTED_MODULE_27__.Button, primeng_chart__WEBPACK_IMPORTED_MODULE_28__.UIChart, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_29__.ConfirmDialog, primeng_dialog__WEBPACK_IMPORTED_MODULE_30__.Dialog, _angular_common__WEBPACK_IMPORTED_MODULE_31__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_31__.NgForOf, primeng_message__WEBPACK_IMPORTED_MODULE_32__.Message, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_33__.ProgressSpinner, primeng_toast__WEBPACK_IMPORTED_MODULE_34__.Toast, src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_11__.HasPermissionsDirective, _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_12__.BookingAreaComponent, _staff_staff_component__WEBPACK_IMPORTED_MODULE_13__.StaffComponent, _invoice_history_invoice_history_component__WEBPACK_IMPORTED_MODULE_15__.InvoiceHistoryComponent, _inquiry_inquiry_component__WEBPACK_IMPORTED_MODULE_17__.InquiryComponent, _angular_common__WEBPACK_IMPORTED_MODULE_31__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_31__.CurrencyPipe],
      styles: ["\n[_nghost-%COMP%] {\n    display: block;\n    min-width: 0;\n    color: var(--dashboard-ink);\n    --dashboard-ink: var(--app-dark-text, #183153);\n    --dashboard-muted: var(--app-dark-muted, #66758d);\n    --dashboard-line: var(--app-dark-border, #dce5ee);\n    --dashboard-primary: var(--app-dark-accent, #176b87);\n    --dashboard-surface: var(--app-dark-surface, #fff);\n    --dashboard-soft: var(--app-dark-info-bg, #e8f2f5);\n}\n\n.dashboard-hero[_ngcontent-%COMP%], \n.dashboard-panel[_ngcontent-%COMP%] {\n    padding: 1.6rem;\n    border: 1px solid var(--dashboard-line);\n    border-radius: 18px;\n    color: var(--dashboard-ink);\n    background: var(--dashboard-surface);\n    box-shadow: none;\n}\n.dashboard-hero[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 1.25rem;\n}\n.dashboard-hero[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%] {\n    color: var(--dashboard-primary);\n    font-size: .72rem;\n    font-weight: 800;\n    letter-spacing: .1em;\n    text-transform: uppercase;\n}\n.dashboard-hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    margin: .3rem 0 .4rem;\n    color: var(--dashboard-ink);\n    font-size: clamp(1.65rem, 3vw, 2.35rem);\n    line-height: 1.1;\n    letter-spacing: -.035em;\n}\n.dashboard-hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: var(--dashboard-muted); }\n[_nghost-%COMP%]     .dashboard-refresh-action {\n    min-height: 44px;\n    border-radius: 10px;\n    color: var(--dashboard-primary);\n    border-color: var(--dashboard-line);\n    background: var(--dashboard-surface);\n    font-weight: 650;\n    white-space: nowrap;\n    box-shadow: none;\n}\n[_nghost-%COMP%]     .dashboard-refresh-action:hover { background: var(--dashboard-soft); }\n\n.dashboard-stat-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: .55rem;\n    width: 100%;\n    min-height: 11rem;\n    padding: 1.15rem;\n    border: 1px solid var(--dashboard-line);\n    border-radius: 16px;\n    color: var(--dashboard-ink);\n    background: var(--dashboard-surface);\n    text-align: left;\n    box-shadow: none;\n    transition: border-color 160ms ease;\n}\nbutton.stat-card[_ngcontent-%COMP%] { cursor: pointer; font: inherit; }\nbutton.stat-card[_ngcontent-%COMP%]:not(:disabled):hover { border-color: var(--dashboard-primary); }\nbutton.stat-card[_ngcontent-%COMP%]:focus-visible { outline: 2px solid var(--dashboard-primary); outline-offset: 2px; }\n.stat-card[_ngcontent-%COMP%]:disabled { cursor: wait; opacity: 1; }\n.stat-card-loading[_ngcontent-%COMP%] { overflow: hidden; }\n.stat-card-loader[_ngcontent-%COMP%] {\n    position: absolute;\n    inset: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: inherit;\n    background: var(--dashboard-surface);\n}\n[_nghost-%COMP%]     .dashboard-card-spinner { width: 2.25rem; height: 2.25rem; }\n.stat-card-error[_ngcontent-%COMP%] { display: flex; align-items: flex-start; gap: .5rem; color: var(--app-dark-danger-text, #c44732); font-size: .85rem; font-weight: 600; line-height: 1.4; }\n.stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 2.75rem;\n    height: 2.75rem;\n    margin-bottom: .2rem;\n    border: 1px solid var(--dashboard-line);\n    border-radius: 10px;\n    color: var(--dashboard-primary);\n    background: var(--dashboard-soft);\n    font-size: 1.2rem;\n}\n.stat-card-success[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] { color: var(--app-dark-success-text, #08785d); background: var(--app-dark-success-bg, #e9f8f2); }\n.stat-card-warning[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] { color: var(--app-dark-warning-text, #91620d); background: var(--app-dark-warning-bg, #fff6df); }\n.stat-card[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] { color: var(--dashboard-muted); font-size: .8rem; font-weight: 650; }\n.stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { color: var(--dashboard-ink); font-size: clamp(1.55rem, 2.6vw, 2.1rem); font-weight: 700; line-height: 1.1; letter-spacing: -.035em; overflow-wrap: anywhere; }\n.stat-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] { color: var(--dashboard-muted); font-size: .76rem; }\n.stat-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] { color: var(--dashboard-primary); }\n\n.dashboard-data-alert[_ngcontent-%COMP%] { display: flex; align-items: center; gap: .65rem; margin-bottom: 1rem; padding: .8rem 1rem; border: 1px solid var(--dashboard-line); border-radius: 10px; background: var(--app-dark-warning-bg, #fff6df); color: var(--app-dark-warning-text, #91620d); }\n[_nghost-%COMP%]     .dashboard-breadcrumb .p-breadcrumb { padding: .85rem 1rem; border: 1px solid var(--dashboard-line); border-radius: 12px; background: var(--dashboard-surface); }\n[_nghost-%COMP%]     .dashboard-breadcrumb .p-breadcrumb-item-link { color: var(--dashboard-primary); }\n.dashboard-active-context[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; align-items: baseline; gap: .65rem; margin: 0 0 1rem; padding: .85rem 1rem; border: 1px solid var(--dashboard-line); border-radius: 12px; background: var(--dashboard-surface); color: var(--dashboard-muted); font-size: .85rem; }\n.dashboard-active-context[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { color: var(--dashboard-ink); font-weight: 650; }\n\n.dashboard-panel[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] { margin: 0 0 1rem; color: var(--dashboard-ink); font-size: 1.15rem; font-weight: 700; }\n.dashboard-panel[_ngcontent-%COMP%]   hr[_ngcontent-%COMP%] { border-color: var(--dashboard-line); }\n.dashboard-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: var(--dashboard-muted); }\n.notification-item[_ngcontent-%COMP%] { padding: .75rem 0; }\n.notification-icon[_ngcontent-%COMP%] { display: flex; align-items: baseline; gap: .5rem; color: var(--dashboard-ink); font-size: .9rem; font-weight: 650; overflow-wrap: anywhere; }\n.notification-content[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: .75rem; }\n.body-notification[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; align-items: center; gap: .65rem; padding-top: .4rem; }\n.notification-text[_ngcontent-%COMP%] { color: var(--dashboard-muted); font-size: .85rem; overflow-wrap: anywhere; }\n.notification-status[_ngcontent-%COMP%] { display: inline-flex; align-items: center; border-radius: 999px; padding: .3rem .6rem; font-size: .75rem; font-weight: 750; }\n.status-high[_ngcontent-%COMP%], .status-urgent[_ngcontent-%COMP%] { color: var(--app-dark-danger-text, #c44732); background: var(--app-dark-danger-bg, #fff0ed); }\n.status-medium[_ngcontent-%COMP%] { color: var(--app-dark-warning-text, #91620d); background: var(--app-dark-warning-bg, #fff6df); }\n.status-low[_ngcontent-%COMP%] { color: var(--app-dark-success-text, #08785d); background: var(--app-dark-success-bg, #e9f8f2); }\n[_nghost-%COMP%]     .notification-content .p-button { flex-shrink: 0; width: 44px; height: 44px; border-radius: 9px; color: var(--dashboard-primary); }\n[_nghost-%COMP%]     .notification-content .p-button:hover { background: var(--dashboard-soft); }\n\n.chart-description[_ngcontent-%COMP%] { margin: -.4rem 0 1rem; color: var(--dashboard-muted); font-size: .85rem; }\n.chart-data-summary[_ngcontent-%COMP%] { margin-top: 1rem; border-top: 1px solid var(--dashboard-line); padding-top: .85rem; }\n.chart-data-summary[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] { width: fit-content; color: var(--dashboard-primary); font-size: .85rem; font-weight: 700; cursor: pointer; }\n.chart-data-summary[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]:focus-visible { outline: 2px solid var(--dashboard-primary); outline-offset: .25rem; }\n.chart-table-scroll[_ngcontent-%COMP%] { overflow-x: auto; margin-top: .75rem; }\n.chart-data-summary[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }\n.chart-data-summary[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .chart-data-summary[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] { padding: .65rem; border-bottom: 1px solid var(--dashboard-line); text-align: right; white-space: nowrap; font-size: .85rem; }\n.chart-data-summary[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { background: var(--app-dark-info-bg, #f5f8fb); color: var(--dashboard-muted); font-size: .8rem; }\n.chart-data-summary[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child { text-align: left; }\n.sr-only[_ngcontent-%COMP%] { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }\n\n@media (max-width: 680px) {\n    .dashboard-hero[_ngcontent-%COMP%], .dashboard-panel[_ngcontent-%COMP%] { padding: 1rem; }\n    .dashboard-hero[_ngcontent-%COMP%] { flex-direction: column; align-items: stretch; }\n    [_nghost-%COMP%]     .dashboard-refresh-action { width: 100%; }\n    .dashboard-stat-grid[_ngcontent-%COMP%]    > [class*=\"col-\"][_ngcontent-%COMP%] { width: 50%; }\n    .dashboard-stat-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] { min-height: 9.5rem; padding: .9rem; }\n    .stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { font-size: clamp(1.25rem, 6vw, 1.7rem); }\n    .notification-content[_ngcontent-%COMP%] { align-items: flex-start; }\n}\n@media (max-width: 359px) { .dashboard-stat-grid[_ngcontent-%COMP%]    > [class*=\"col-\"][_ngcontent-%COMP%] { width: 100%; } }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFFQUFxRTtBQUNyRTtJQUNJLGNBQWM7SUFDZCxZQUFZO0lBQ1osMkJBQTJCO0lBQzNCLDhDQUE4QztJQUM5QyxpREFBaUQ7SUFDakQsaURBQWlEO0lBQ2pELG9EQUFvRDtJQUNwRCxrREFBa0Q7SUFDbEQsa0RBQWtEO0FBQ3REOztBQUVBOztJQUVJLGVBQWU7SUFDZix1Q0FBdUM7SUFDdkMsbUJBQW1CO0lBQ25CLDJCQUEyQjtJQUMzQixvQ0FBb0M7SUFDcEMsZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLDhCQUE4QjtJQUM5QixZQUFZO0FBQ2hCO0FBQ0E7SUFDSSwrQkFBK0I7SUFDL0IsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixvQkFBb0I7SUFDcEIseUJBQXlCO0FBQzdCO0FBQ0E7SUFDSSxxQkFBcUI7SUFDckIsMkJBQTJCO0lBQzNCLHVDQUF1QztJQUN2QyxnQkFBZ0I7SUFDaEIsdUJBQXVCO0FBQzNCO0FBQ0Esb0JBQW9CLFNBQVMsRUFBRSw2QkFBNkIsRUFBRTtBQUM5RDtJQUNJLGdCQUFnQjtJQUNoQixtQkFBbUI7SUFDbkIsK0JBQStCO0lBQy9CLG1DQUFtQztJQUNuQyxvQ0FBb0M7SUFDcEMsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixnQkFBZ0I7QUFDcEI7QUFDQSxrREFBa0QsaUNBQWlDLEVBQUU7O0FBRXJGO0lBQ0ksa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsdUJBQXVCO0lBQ3ZCLFdBQVc7SUFDWCxXQUFXO0lBQ1gsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQix1Q0FBdUM7SUFDdkMsbUJBQW1CO0lBQ25CLDJCQUEyQjtJQUMzQixvQ0FBb0M7SUFDcEMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixtQ0FBbUM7QUFDdkM7QUFDQSxtQkFBbUIsZUFBZSxFQUFFLGFBQWEsRUFBRTtBQUNuRCx3Q0FBd0Msc0NBQXNDLEVBQUU7QUFDaEYsaUNBQWlDLDJDQUEyQyxFQUFFLG1CQUFtQixFQUFFO0FBQ25HLHNCQUFzQixZQUFZLEVBQUUsVUFBVSxFQUFFO0FBQ2hELHFCQUFxQixnQkFBZ0IsRUFBRTtBQUN2QztJQUNJLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsc0JBQXNCO0lBQ3RCLG9DQUFvQztBQUN4QztBQUNBLDBDQUEwQyxjQUFjLEVBQUUsZUFBZSxFQUFFO0FBQzNFLG1CQUFtQixhQUFhLEVBQUUsdUJBQXVCLEVBQUUsVUFBVSxFQUFFLDJDQUEyQyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQzNLO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsY0FBYztJQUNkLGVBQWU7SUFDZixvQkFBb0I7SUFDcEIsdUNBQXVDO0lBQ3ZDLG1CQUFtQjtJQUNuQiwrQkFBK0I7SUFDL0IsaUNBQWlDO0lBQ2pDLGlCQUFpQjtBQUNyQjtBQUNBLGdDQUFnQyw0Q0FBNEMsRUFBRSwrQ0FBK0MsRUFBRTtBQUMvSCxnQ0FBZ0MsNENBQTRDLEVBQUUsK0NBQStDLEVBQUU7QUFDL0gseUJBQXlCLDZCQUE2QixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO0FBQzVGLG9CQUFvQiwyQkFBMkIsRUFBRSx3Q0FBd0MsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBRTtBQUNqTCxtQkFBbUIsNkJBQTZCLEVBQUUsaUJBQWlCLEVBQUU7QUFDckUscUJBQXFCLCtCQUErQixFQUFFOztBQUV0RCx3QkFBd0IsYUFBYSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSx1Q0FBdUMsRUFBRSxtQkFBbUIsRUFBRSwrQ0FBK0MsRUFBRSw0Q0FBNEMsRUFBRTtBQUNoUixzREFBc0Qsb0JBQW9CLEVBQUUsdUNBQXVDLEVBQUUsbUJBQW1CLEVBQUUsb0NBQW9DLEVBQUU7QUFDaEwsZ0VBQWdFLCtCQUErQixFQUFFO0FBQ2pHLDRCQUE0QixhQUFhLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSx1Q0FBdUMsRUFBRSxtQkFBbUIsRUFBRSxvQ0FBb0MsRUFBRSw2QkFBNkIsRUFBRSxpQkFBaUIsRUFBRTtBQUM5UixtQ0FBbUMsMkJBQTJCLEVBQUUsZ0JBQWdCLEVBQUU7O0FBRWxGLHdCQUF3QixnQkFBZ0IsRUFBRSwyQkFBMkIsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRTtBQUM3RyxzQkFBc0IsbUNBQW1DLEVBQUU7QUFDM0QscUJBQXFCLDZCQUE2QixFQUFFO0FBQ3BELHFCQUFxQixpQkFBaUIsRUFBRTtBQUN4QyxxQkFBcUIsYUFBYSxFQUFFLHFCQUFxQixFQUFFLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSx1QkFBdUIsRUFBRTtBQUNqSyx3QkFBd0IsYUFBYSxFQUFFLDhCQUE4QixFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRTtBQUN6RyxxQkFBcUIsYUFBYSxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUU7QUFDM0cscUJBQXFCLDZCQUE2QixFQUFFLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFO0FBQ2hHLHVCQUF1QixvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRTtBQUNuSiwrQkFBK0IsMkNBQTJDLEVBQUUsOENBQThDLEVBQUU7QUFDNUgsaUJBQWlCLDRDQUE0QyxFQUFFLCtDQUErQyxFQUFFO0FBQ2hILGNBQWMsNENBQTRDLEVBQUUsK0NBQStDLEVBQUU7QUFDN0csa0RBQWtELGNBQWMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLCtCQUErQixFQUFFO0FBQ2xKLHdEQUF3RCxpQ0FBaUMsRUFBRTs7QUFFM0YscUJBQXFCLHFCQUFxQixFQUFFLDZCQUE2QixFQUFFLGlCQUFpQixFQUFFO0FBQzlGLHNCQUFzQixnQkFBZ0IsRUFBRSwyQ0FBMkMsRUFBRSxtQkFBbUIsRUFBRTtBQUMxRyw4QkFBOEIsa0JBQWtCLEVBQUUsK0JBQStCLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFO0FBQ3pJLDRDQUE0QywyQ0FBMkMsRUFBRSxzQkFBc0IsRUFBRTtBQUNqSCxzQkFBc0IsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUU7QUFDNUQsNEJBQTRCLFdBQVcsRUFBRSx5QkFBeUIsRUFBRSxrQ0FBa0MsRUFBRTtBQUN4RyxpREFBaUQsZUFBZSxFQUFFLDhDQUE4QyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFFO0FBQzdLLCtCQUErQiw0Q0FBNEMsRUFBRSw2QkFBNkIsRUFBRSxnQkFBZ0IsRUFBRTtBQUM5SCxxQ0FBcUMsZ0JBQWdCLEVBQUU7QUFDdkQsV0FBVyxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFOztBQUU1SjtJQUNJLG9DQUFvQyxhQUFhLEVBQUU7SUFDbkQsa0JBQWtCLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFO0lBQ2hFLDRDQUE0QyxXQUFXLEVBQUU7SUFDekQseUNBQXlDLFVBQVUsRUFBRTtJQUNyRCxrQ0FBa0Msa0JBQWtCLEVBQUUsY0FBYyxFQUFFO0lBQ3RFLG9CQUFvQixzQ0FBc0MsRUFBRTtJQUM1RCx3QkFBd0IsdUJBQXVCLEVBQUU7QUFDckQ7QUFDQSw0QkFBNEIseUNBQXlDLFdBQVcsRUFBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLyogVXNlIHRoZSBzYW1lIHBhbGV0dGUgYW5kIHR5cGUgaGllcmFyY2h5IGFzIFNlZVByb3BlcnR5Q29tcG9uZW50LiAqL1xuOmhvc3Qge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1pbi13aWR0aDogMDtcbiAgICBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLWluayk7XG4gICAgLS1kYXNoYm9hcmQtaW5rOiB2YXIoLS1hcHAtZGFyay10ZXh0LCAjMTgzMTUzKTtcbiAgICAtLWRhc2hib2FyZC1tdXRlZDogdmFyKC0tYXBwLWRhcmstbXV0ZWQsICM2Njc1OGQpO1xuICAgIC0tZGFzaGJvYXJkLWxpbmU6IHZhcigtLWFwcC1kYXJrLWJvcmRlciwgI2RjZTVlZSk7XG4gICAgLS1kYXNoYm9hcmQtcHJpbWFyeTogdmFyKC0tYXBwLWRhcmstYWNjZW50LCAjMTc2Yjg3KTtcbiAgICAtLWRhc2hib2FyZC1zdXJmYWNlOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLCAjZmZmKTtcbiAgICAtLWRhc2hib2FyZC1zb2Z0OiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZThmMmY1KTtcbn1cblxuLmRhc2hib2FyZC1oZXJvLFxuLmRhc2hib2FyZC1wYW5lbCB7XG4gICAgcGFkZGluZzogMS42cmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhc2hib2FyZC1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgIGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtaW5rKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kYXNoYm9hcmQtc3VyZmFjZSk7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbn1cbi5kYXNoYm9hcmQtaGVybyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBnYXA6IDEuMjVyZW07XG59XG4uZGFzaGJvYXJkLWhlcm8gLmV5ZWJyb3cge1xuICAgIGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtcHJpbWFyeSk7XG4gICAgZm9udC1zaXplOiAuNzJyZW07XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogLjFlbTtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuLmRhc2hib2FyZC1oZXJvIGgxIHtcbiAgICBtYXJnaW46IC4zcmVtIDAgLjRyZW07XG4gICAgY29sb3I6IHZhcigtLWRhc2hib2FyZC1pbmspO1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS42NXJlbSwgM3Z3LCAyLjM1cmVtKTtcbiAgICBsaW5lLWhlaWdodDogMS4xO1xuICAgIGxldHRlci1zcGFjaW5nOiAtLjAzNWVtO1xufVxuLmRhc2hib2FyZC1oZXJvIHAgeyBtYXJnaW46IDA7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtbXV0ZWQpOyB9XG46aG9zdCA6Om5nLWRlZXAgLmRhc2hib2FyZC1yZWZyZXNoLWFjdGlvbiB7XG4gICAgbWluLWhlaWdodDogNDRweDtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtcHJpbWFyeSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtbGluZSk7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tZGFzaGJvYXJkLXN1cmZhY2UpO1xuICAgIGZvbnQtd2VpZ2h0OiA2NTA7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBib3gtc2hhZG93OiBub25lO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5kYXNoYm9hcmQtcmVmcmVzaC1hY3Rpb246aG92ZXIgeyBiYWNrZ3JvdW5kOiB2YXIoLS1kYXNoYm9hcmQtc29mdCk7IH1cblxuLmRhc2hib2FyZC1zdGF0LWdyaWQgLnN0YXQtY2FyZCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICBnYXA6IC41NXJlbTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtaW4taGVpZ2h0OiAxMXJlbTtcbiAgICBwYWRkaW5nOiAxLjE1cmVtO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhc2hib2FyZC1saW5lKTtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtaW5rKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kYXNoYm9hcmQtc3VyZmFjZSk7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAxNjBtcyBlYXNlO1xufVxuYnV0dG9uLnN0YXQtY2FyZCB7IGN1cnNvcjogcG9pbnRlcjsgZm9udDogaW5oZXJpdDsgfVxuYnV0dG9uLnN0YXQtY2FyZDpub3QoOmRpc2FibGVkKTpob3ZlciB7IGJvcmRlci1jb2xvcjogdmFyKC0tZGFzaGJvYXJkLXByaW1hcnkpOyB9XG5idXR0b24uc3RhdC1jYXJkOmZvY3VzLXZpc2libGUgeyBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tZGFzaGJvYXJkLXByaW1hcnkpOyBvdXRsaW5lLW9mZnNldDogMnB4OyB9XG4uc3RhdC1jYXJkOmRpc2FibGVkIHsgY3Vyc29yOiB3YWl0OyBvcGFjaXR5OiAxOyB9XG4uc3RhdC1jYXJkLWxvYWRpbmcgeyBvdmVyZmxvdzogaGlkZGVuOyB9XG4uc3RhdC1jYXJkLWxvYWRlciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGluc2V0OiAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiBpbmhlcml0O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWRhc2hib2FyZC1zdXJmYWNlKTtcbn1cbjpob3N0IDo6bmctZGVlcCAuZGFzaGJvYXJkLWNhcmQtc3Bpbm5lciB7IHdpZHRoOiAyLjI1cmVtOyBoZWlnaHQ6IDIuMjVyZW07IH1cbi5zdGF0LWNhcmQtZXJyb3IgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogZmxleC1zdGFydDsgZ2FwOiAuNXJlbTsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYzQ0NzMyKTsgZm9udC1zaXplOiAuODVyZW07IGZvbnQtd2VpZ2h0OiA2MDA7IGxpbmUtaGVpZ2h0OiAxLjQ7IH1cbi5zdGF0LWNhcmQgLnN0YXQtaWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB3aWR0aDogMi43NXJlbTtcbiAgICBoZWlnaHQ6IDIuNzVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogLjJyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZGFzaGJvYXJkLWxpbmUpO1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgY29sb3I6IHZhcigtLWRhc2hib2FyZC1wcmltYXJ5KTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kYXNoYm9hcmQtc29mdCk7XG4gICAgZm9udC1zaXplOiAxLjJyZW07XG59XG4uc3RhdC1jYXJkLXN1Y2Nlc3MgLnN0YXQtaWNvbiB7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1zdWNjZXNzLXRleHQsICMwODc4NWQpOyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdWNjZXNzLWJnLCAjZTlmOGYyKTsgfVxuLnN0YXQtY2FyZC13YXJuaW5nIC5zdGF0LWljb24geyBjb2xvcjogdmFyKC0tYXBwLWRhcmstd2FybmluZy10ZXh0LCAjOTE2MjBkKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstd2FybmluZy1iZywgI2ZmZjZkZik7IH1cbi5zdGF0LWNhcmQgLnN0YXQtbGFiZWwgeyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLW11dGVkKTsgZm9udC1zaXplOiAuOHJlbTsgZm9udC13ZWlnaHQ6IDY1MDsgfVxuLnN0YXQtY2FyZCBzdHJvbmcgeyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLWluayk7IGZvbnQtc2l6ZTogY2xhbXAoMS41NXJlbSwgMi42dncsIDIuMXJlbSk7IGZvbnQtd2VpZ2h0OiA3MDA7IGxpbmUtaGVpZ2h0OiAxLjE7IGxldHRlci1zcGFjaW5nOiAtLjAzNWVtOyBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTsgfVxuLnN0YXQtY2FyZCBzbWFsbCB7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtbXV0ZWQpOyBmb250LXNpemU6IC43NnJlbTsgfVxuLnN0YXQtY2FyZCBzbWFsbCBiIHsgY29sb3I6IHZhcigtLWRhc2hib2FyZC1wcmltYXJ5KTsgfVxuXG4uZGFzaGJvYXJkLWRhdGEtYWxlcnQgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IC42NXJlbTsgbWFyZ2luLWJvdHRvbTogMXJlbTsgcGFkZGluZzogLjhyZW0gMXJlbTsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZGFzaGJvYXJkLWxpbmUpOyBib3JkZXItcmFkaXVzOiAxMHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay13YXJuaW5nLWJnLCAjZmZmNmRmKTsgY29sb3I6IHZhcigtLWFwcC1kYXJrLXdhcm5pbmctdGV4dCwgIzkxNjIwZCk7IH1cbjpob3N0IDo6bmctZGVlcCAuZGFzaGJvYXJkLWJyZWFkY3J1bWIgLnAtYnJlYWRjcnVtYiB7IHBhZGRpbmc6IC44NXJlbSAxcmVtOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1kYXNoYm9hcmQtbGluZSk7IGJvcmRlci1yYWRpdXM6IDEycHg7IGJhY2tncm91bmQ6IHZhcigtLWRhc2hib2FyZC1zdXJmYWNlKTsgfVxuOmhvc3QgOjpuZy1kZWVwIC5kYXNoYm9hcmQtYnJlYWRjcnVtYiAucC1icmVhZGNydW1iLWl0ZW0tbGluayB7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtcHJpbWFyeSk7IH1cbi5kYXNoYm9hcmQtYWN0aXZlLWNvbnRleHQgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LXdyYXA6IHdyYXA7IGFsaWduLWl0ZW1zOiBiYXNlbGluZTsgZ2FwOiAuNjVyZW07IG1hcmdpbjogMCAwIDFyZW07IHBhZGRpbmc6IC44NXJlbSAxcmVtOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1kYXNoYm9hcmQtbGluZSk7IGJvcmRlci1yYWRpdXM6IDEycHg7IGJhY2tncm91bmQ6IHZhcigtLWRhc2hib2FyZC1zdXJmYWNlKTsgY29sb3I6IHZhcigtLWRhc2hib2FyZC1tdXRlZCk7IGZvbnQtc2l6ZTogLjg1cmVtOyB9XG4uZGFzaGJvYXJkLWFjdGl2ZS1jb250ZXh0IHN0cm9uZyB7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtaW5rKTsgZm9udC13ZWlnaHQ6IDY1MDsgfVxuXG4uZGFzaGJvYXJkLXBhbmVsID4gaDIgeyBtYXJnaW46IDAgMCAxcmVtOyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLWluayk7IGZvbnQtc2l6ZTogMS4xNXJlbTsgZm9udC13ZWlnaHQ6IDcwMDsgfVxuLmRhc2hib2FyZC1wYW5lbCBociB7IGJvcmRlci1jb2xvcjogdmFyKC0tZGFzaGJvYXJkLWxpbmUpOyB9XG4uZGFzaGJvYXJkLXBhbmVsIHAgeyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLW11dGVkKTsgfVxuLm5vdGlmaWNhdGlvbi1pdGVtIHsgcGFkZGluZzogLjc1cmVtIDA7IH1cbi5ub3RpZmljYXRpb24taWNvbiB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBiYXNlbGluZTsgZ2FwOiAuNXJlbTsgY29sb3I6IHZhcigtLWRhc2hib2FyZC1pbmspOyBmb250LXNpemU6IC45cmVtOyBmb250LXdlaWdodDogNjUwOyBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTsgfVxuLm5vdGlmaWNhdGlvbi1jb250ZW50IHsgZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IC43NXJlbTsgfVxuLmJvZHktbm90aWZpY2F0aW9uIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IC42NXJlbTsgcGFkZGluZy10b3A6IC40cmVtOyB9XG4ubm90aWZpY2F0aW9uLXRleHQgeyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLW11dGVkKTsgZm9udC1zaXplOiAuODVyZW07IG92ZXJmbG93LXdyYXA6IGFueXdoZXJlOyB9XG4ubm90aWZpY2F0aW9uLXN0YXR1cyB7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBib3JkZXItcmFkaXVzOiA5OTlweDsgcGFkZGluZzogLjNyZW0gLjZyZW07IGZvbnQtc2l6ZTogLjc1cmVtOyBmb250LXdlaWdodDogNzUwOyB9XG4uc3RhdHVzLWhpZ2gsIC5zdGF0dXMtdXJnZW50IHsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYzQ0NzMyKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLWJnLCAjZmZmMGVkKTsgfVxuLnN0YXR1cy1tZWRpdW0geyBjb2xvcjogdmFyKC0tYXBwLWRhcmstd2FybmluZy10ZXh0LCAjOTE2MjBkKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstd2FybmluZy1iZywgI2ZmZjZkZik7IH1cbi5zdGF0dXMtbG93IHsgY29sb3I6IHZhcigtLWFwcC1kYXJrLXN1Y2Nlc3MtdGV4dCwgIzA4Nzg1ZCk7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLXN1Y2Nlc3MtYmcsICNlOWY4ZjIpOyB9XG46aG9zdCA6Om5nLWRlZXAgLm5vdGlmaWNhdGlvbi1jb250ZW50IC5wLWJ1dHRvbiB7IGZsZXgtc2hyaW5rOiAwOyB3aWR0aDogNDRweDsgaGVpZ2h0OiA0NHB4OyBib3JkZXItcmFkaXVzOiA5cHg7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtcHJpbWFyeSk7IH1cbjpob3N0IDo6bmctZGVlcCAubm90aWZpY2F0aW9uLWNvbnRlbnQgLnAtYnV0dG9uOmhvdmVyIHsgYmFja2dyb3VuZDogdmFyKC0tZGFzaGJvYXJkLXNvZnQpOyB9XG5cbi5jaGFydC1kZXNjcmlwdGlvbiB7IG1hcmdpbjogLS40cmVtIDAgMXJlbTsgY29sb3I6IHZhcigtLWRhc2hib2FyZC1tdXRlZCk7IGZvbnQtc2l6ZTogLjg1cmVtOyB9XG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHsgbWFyZ2luLXRvcDogMXJlbTsgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWRhc2hib2FyZC1saW5lKTsgcGFkZGluZy10b3A6IC44NXJlbTsgfVxuLmNoYXJ0LWRhdGEtc3VtbWFyeSBzdW1tYXJ5IHsgd2lkdGg6IGZpdC1jb250ZW50OyBjb2xvcjogdmFyKC0tZGFzaGJvYXJkLXByaW1hcnkpOyBmb250LXNpemU6IC44NXJlbTsgZm9udC13ZWlnaHQ6IDcwMDsgY3Vyc29yOiBwb2ludGVyOyB9XG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHN1bW1hcnk6Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1kYXNoYm9hcmQtcHJpbWFyeSk7IG91dGxpbmUtb2Zmc2V0OiAuMjVyZW07IH1cbi5jaGFydC10YWJsZS1zY3JvbGwgeyBvdmVyZmxvdy14OiBhdXRvOyBtYXJnaW4tdG9wOiAuNzVyZW07IH1cbi5jaGFydC1kYXRhLXN1bW1hcnkgdGFibGUgeyB3aWR0aDogMTAwJTsgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsgZm9udC12YXJpYW50LW51bWVyaWM6IHRhYnVsYXItbnVtczsgfVxuLmNoYXJ0LWRhdGEtc3VtbWFyeSB0aCwgLmNoYXJ0LWRhdGEtc3VtbWFyeSB0ZCB7IHBhZGRpbmc6IC42NXJlbTsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWRhc2hib2FyZC1saW5lKTsgdGV4dC1hbGlnbjogcmlnaHQ7IHdoaXRlLXNwYWNlOiBub3dyYXA7IGZvbnQtc2l6ZTogLjg1cmVtOyB9XG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHRoZWFkIHRoIHsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2Y1ZjhmYik7IGNvbG9yOiB2YXIoLS1kYXNoYm9hcmQtbXV0ZWQpOyBmb250LXNpemU6IC44cmVtOyB9XG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHRoOmZpcnN0LWNoaWxkIHsgdGV4dC1hbGlnbjogbGVmdDsgfVxuLnNyLW9ubHkgeyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiAxcHg7IGhlaWdodDogMXB4OyBwYWRkaW5nOiAwOyBtYXJnaW46IC0xcHg7IG92ZXJmbG93OiBoaWRkZW47IGNsaXA6IHJlY3QoMCwgMCwgMCwgMCk7IHdoaXRlLXNwYWNlOiBub3dyYXA7IGJvcmRlcjogMDsgfVxuXG5AbWVkaWEgKG1heC13aWR0aDogNjgwcHgpIHtcbiAgICAuZGFzaGJvYXJkLWhlcm8sIC5kYXNoYm9hcmQtcGFuZWwgeyBwYWRkaW5nOiAxcmVtOyB9XG4gICAgLmRhc2hib2FyZC1oZXJvIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6IHN0cmV0Y2g7IH1cbiAgICA6aG9zdCA6Om5nLWRlZXAgLmRhc2hib2FyZC1yZWZyZXNoLWFjdGlvbiB7IHdpZHRoOiAxMDAlOyB9XG4gICAgLmRhc2hib2FyZC1zdGF0LWdyaWQgPiBbY2xhc3MqPVwiY29sLVwiXSB7IHdpZHRoOiA1MCU7IH1cbiAgICAuZGFzaGJvYXJkLXN0YXQtZ3JpZCAuc3RhdC1jYXJkIHsgbWluLWhlaWdodDogOS41cmVtOyBwYWRkaW5nOiAuOXJlbTsgfVxuICAgIC5zdGF0LWNhcmQgc3Ryb25nIHsgZm9udC1zaXplOiBjbGFtcCgxLjI1cmVtLCA2dncsIDEuN3JlbSk7IH1cbiAgICAubm90aWZpY2F0aW9uLWNvbnRlbnQgeyBhbGlnbi1pdGVtczogZmxleC1zdGFydDsgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDM1OXB4KSB7IC5kYXNoYm9hcmQtc3RhdC1ncmlkID4gW2NsYXNzKj1cImNvbC1cIl0geyB3aWR0aDogMTAwJTsgfSB9XHJcbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ },

/***/ 25450
/*!***************************************************************!*\
  !*** ./src/app/demo/components/dashboard/dashboard.module.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardModule: () => (/* binding */ DashboardModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/chart */ 95109);
/* harmony import */ var primeng_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/menu */ 93350);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/table */ 64301);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_styleclass__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/styleclass */ 76510);
/* harmony import */ var primeng_panelmenu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/panelmenu */ 42046);
/* harmony import */ var _dashboard_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dashboard-routing.module */ 20728);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var primeng_tabs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/tabs */ 16643);
/* harmony import */ var primeng_fileupload__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/fileupload */ 71374);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var primeng_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/select */ 16419);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_card__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/card */ 58677);
/* harmony import */ var primeng_inputgroupaddon__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/inputgroupaddon */ 71488);
/* harmony import */ var primeng_inputgroup__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! primeng/inputgroup */ 87186);
/* harmony import */ var primeng_inputicon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/inputicon */ 58558);
/* harmony import */ var primeng_iconfield__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! primeng/iconfield */ 33840);
/* harmony import */ var primeng_fieldset__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! primeng/fieldset */ 5259);
/* harmony import */ var primeng_stepper__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! primeng/stepper */ 84794);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_drawer__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! primeng/drawer */ 71724);
/* harmony import */ var primeng_confirmpopup__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! primeng/confirmpopup */ 96373);
/* harmony import */ var primeng_toolbar__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! primeng/toolbar */ 90292);
/* harmony import */ var primeng_tag__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! primeng/tag */ 60905);
/* harmony import */ var _owner_registration_owner_registration_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../owner-registration/owner-registration.component */ 79507);
/* harmony import */ var _cards_cards_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../cards/cards.component */ 55315);
/* harmony import */ var _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../booking-area/booking-area.component */ 20067);
/* harmony import */ var src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! src/app/has-permissions.directive */ 25428);
/* harmony import */ var _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../change-password/change-password.component */ 27455);
/* harmony import */ var _dynamic_table_dynamic_table_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../dynamic-table/dynamic-table.component */ 54071);
/* harmony import */ var _family_area_family_area_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../family-area/family-area.component */ 56431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @angular/core */ 94975);




































class DashboardModule {
  static {
    this.ɵfac = function DashboardModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DashboardModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_35__["ɵɵdefineNgModule"]({
      type: DashboardModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_36__["ɵɵdefineInjector"]({
      imports: [_family_area_family_area_component__WEBPACK_IMPORTED_MODULE_34__.FamilyAreaComponent, _dynamic_table_dynamic_table_component__WEBPACK_IMPORTED_MODULE_33__.DynamicTableComponent, _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_32__.ChangePasswordComponent, _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_30__.BookingAreaComponent, _angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, primeng_tag__WEBPACK_IMPORTED_MODULE_27__.TagModule, primeng_toolbar__WEBPACK_IMPORTED_MODULE_26__.ToolbarModule, primeng_confirmpopup__WEBPACK_IMPORTED_MODULE_25__.ConfirmPopupModule, primeng_drawer__WEBPACK_IMPORTED_MODULE_24__.DrawerModule, primeng_message__WEBPACK_IMPORTED_MODULE_23__.MessageModule, primeng_fieldset__WEBPACK_IMPORTED_MODULE_20__.FieldsetModule, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_22__.ConfirmDialogModule, primeng_stepper__WEBPACK_IMPORTED_MODULE_21__.StepperModule, primeng_card__WEBPACK_IMPORTED_MODULE_15__.CardModule, primeng_inputicon__WEBPACK_IMPORTED_MODULE_18__.InputIconModule, primeng_iconfield__WEBPACK_IMPORTED_MODULE_19__.IconFieldModule, primeng_inputgroupaddon__WEBPACK_IMPORTED_MODULE_16__.InputGroupAddonModule, primeng_inputgroup__WEBPACK_IMPORTED_MODULE_17__.InputGroupModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_14__.InputTextModule, primeng_select__WEBPACK_IMPORTED_MODULE_13__.SelectModule, primeng_toast__WEBPACK_IMPORTED_MODULE_12__.ToastModule, primeng_fileupload__WEBPACK_IMPORTED_MODULE_11__.FileUploadModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_chart__WEBPACK_IMPORTED_MODULE_2__.ChartModule, primeng_menu__WEBPACK_IMPORTED_MODULE_3__.MenuModule, primeng_tabs__WEBPACK_IMPORTED_MODULE_10__.TabsModule, primeng_table__WEBPACK_IMPORTED_MODULE_4__.TableModule, primeng_styleclass__WEBPACK_IMPORTED_MODULE_6__.StyleClassModule, primeng_panelmenu__WEBPACK_IMPORTED_MODULE_7__.PanelMenuModule, primeng_button__WEBPACK_IMPORTED_MODULE_5__.ButtonModule, _dashboard_routing_module__WEBPACK_IMPORTED_MODULE_8__.DashboardsRoutingModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_9__.DialogModule, _owner_registration_owner_registration_component__WEBPACK_IMPORTED_MODULE_28__.OwnerRegistrationComponent, _cards_cards_component__WEBPACK_IMPORTED_MODULE_29__.CardsComponent, primeng_stepper__WEBPACK_IMPORTED_MODULE_21__.StepperModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_35__["ɵɵsetNgModuleScope"](DashboardModule, {
    imports: [_family_area_family_area_component__WEBPACK_IMPORTED_MODULE_34__.FamilyAreaComponent, _dynamic_table_dynamic_table_component__WEBPACK_IMPORTED_MODULE_33__.DynamicTableComponent, src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_31__.HasPermissionsDirective, _change_password_change_password_component__WEBPACK_IMPORTED_MODULE_32__.ChangePasswordComponent, _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_30__.BookingAreaComponent, _angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, primeng_tag__WEBPACK_IMPORTED_MODULE_27__.TagModule, primeng_toolbar__WEBPACK_IMPORTED_MODULE_26__.ToolbarModule, primeng_confirmpopup__WEBPACK_IMPORTED_MODULE_25__.ConfirmPopupModule, primeng_drawer__WEBPACK_IMPORTED_MODULE_24__.DrawerModule, primeng_message__WEBPACK_IMPORTED_MODULE_23__.MessageModule, primeng_fieldset__WEBPACK_IMPORTED_MODULE_20__.FieldsetModule, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_22__.ConfirmDialogModule, primeng_stepper__WEBPACK_IMPORTED_MODULE_21__.StepperModule, primeng_card__WEBPACK_IMPORTED_MODULE_15__.CardModule, primeng_inputicon__WEBPACK_IMPORTED_MODULE_18__.InputIconModule, primeng_iconfield__WEBPACK_IMPORTED_MODULE_19__.IconFieldModule, primeng_inputgroupaddon__WEBPACK_IMPORTED_MODULE_16__.InputGroupAddonModule, primeng_inputgroup__WEBPACK_IMPORTED_MODULE_17__.InputGroupModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_14__.InputTextModule, primeng_select__WEBPACK_IMPORTED_MODULE_13__.SelectModule, primeng_toast__WEBPACK_IMPORTED_MODULE_12__.ToastModule, primeng_fileupload__WEBPACK_IMPORTED_MODULE_11__.FileUploadModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_chart__WEBPACK_IMPORTED_MODULE_2__.ChartModule, primeng_menu__WEBPACK_IMPORTED_MODULE_3__.MenuModule, primeng_tabs__WEBPACK_IMPORTED_MODULE_10__.TabsModule, primeng_table__WEBPACK_IMPORTED_MODULE_4__.TableModule, primeng_styleclass__WEBPACK_IMPORTED_MODULE_6__.StyleClassModule, primeng_panelmenu__WEBPACK_IMPORTED_MODULE_7__.PanelMenuModule, primeng_button__WEBPACK_IMPORTED_MODULE_5__.ButtonModule, _dashboard_routing_module__WEBPACK_IMPORTED_MODULE_8__.DashboardsRoutingModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_9__.DialogModule, _owner_registration_owner_registration_component__WEBPACK_IMPORTED_MODULE_28__.OwnerRegistrationComponent, _cards_cards_component__WEBPACK_IMPORTED_MODULE_29__.CardsComponent],
    exports: [primeng_stepper__WEBPACK_IMPORTED_MODULE_21__.StepperModule]
  });
})();

/***/ },

/***/ 54071
/*!**************************************************************************!*\
  !*** ./src/app/demo/components/dynamic-table/dynamic-table.component.ts ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynamicTableComponent: () => (/* binding */ DynamicTableComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primeng/table */ 64301);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/card */ 58677);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var ng2_pdf_viewer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ng2-pdf-viewer */ 30769);
/* harmony import */ var src_app_pipes_pipes_module_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/pipes/pipes-module.module */ 26146);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var _pipes_perservedOrder__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../pipes/perservedOrder */ 88512);













const _c0 = () => ["alias", "status"];
const _c1 = () => ({
  "min-width": "75rem"
});
function DynamicTableComponent_ng_template_6_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1, " # ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function DynamicTableComponent_ng_template_6_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "p-sortIcon", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tdhead_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 2, tdhead_r1.value), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("field", tdhead_r1.value);
  }
}
function DynamicTableComponent_ng_template_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "th", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](1, DynamicTableComponent_ng_template_6_For_2_Conditional_1_Template, 2, 0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](2, DynamicTableComponent_ng_template_6_For_2_Conditional_2_Template, 4, 4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tdhead_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](tdhead_r1.value.includes("id") ? 1 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](!tdhead_r1.value.includes("id") ? 2 : -1);
  }
}
function DynamicTableComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeaterCreate"](1, DynamicTableComponent_ng_template_6_For_2_Template, 3, 2, "th", 7, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](3, "PreserveOrder");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeater"](_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](3, 0, ctx_r1.dynamicHeaders));
  }
}
function DynamicTableComponent_ng_template_7_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const rowIndex_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).rowIndex;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", rowIndex_r3 + 1, " ");
  }
}
function DynamicTableComponent_ng_template_7_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tdhead_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const rowData_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", rowData_r5[tdhead_r4.key], " ");
  }
}
function DynamicTableComponent_ng_template_7_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "p-tag", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tdhead_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const rowData_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", rowData_r5[tdhead_r4.key])("severity", ctx_r1._stringFormating.getSeverity(rowData_r5[tdhead_r4.key]));
  }
}
function DynamicTableComponent_ng_template_7_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span")(1, "p-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("onClick", function DynamicTableComponent_ng_template_7_For_2_Conditional_4_Template_p_button_onClick_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r6);
      const rowData_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.editItem(rowData_r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("rounded", true)("outlined", true);
  }
}
function DynamicTableComponent_ng_template_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](1, DynamicTableComponent_ng_template_7_For_2_Conditional_1_Template, 2, 1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](2, DynamicTableComponent_ng_template_7_For_2_Conditional_2_Template, 2, 1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](3, DynamicTableComponent_ng_template_7_For_2_Conditional_3_Template, 2, 2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditionalCreate"](4, DynamicTableComponent_ng_template_7_For_2_Conditional_4_Template, 2, 2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tdhead_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](tdhead_r4.key.includes("id") ? 1 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](!tdhead_r4.key.includes("status") && !tdhead_r4.key.includes("actions") && !tdhead_r4.key.includes("id") && !tdhead_r4.key.includes("details") ? 2 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](tdhead_r4.key.includes("status") ? 3 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵconditional"](tdhead_r4.key.includes("actions") ? 4 : -1);
  }
}
function DynamicTableComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeaterCreate"](1, DynamicTableComponent_ng_template_7_For_2_Template, 5, 4, "td", null, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](3, "PreserveOrder");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrepeater"](_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](3, 0, ctx_r1.dynamicHeaders));
  }
}
class DynamicTableComponent {
  constructor(confirmationService) {
    this.confirmationService = confirmationService;
    this.nodata = false;
  }
  ngOnInit() {
    console.log('Data recieved', this.inputData);
  }
  static {
    this.ɵfac = function DynamicTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DynamicTableComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_10__.ConfirmationService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
      type: DynamicTableComponent,
      selectors: [["app-dynamic-table"]],
      inputs: {
        inputData: "inputData"
      },
      decls: 8,
      vars: 9,
      consts: [["dt", ""], [1, "card"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-lg", "text-surface-900", "dark:text-surface-0"], ["dataKey", "id", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "rows", "paginator", "globalFilterFields", "tableStyle", "rowHover", "showCurrentPageReport"], ["pTemplate", "header"], ["pTemplate", "body"], ["ng-reflect-field", "id", 2, "min-width", "15rem"], [3, "field"], [3, "value", "severity"], ["icon", "pi pi-file-pdf", "severity", "danger", 1, "mr-2", 3, "onClick", "rounded", "outlined"]],
      template: function DynamicTableComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3, " Payments History ");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "p-table", 4, 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](6, DynamicTableComponent_ng_template_6_Template, 4, 2, "ng-template", 5)(7, DynamicTableComponent_ng_template_7_Template, 4, 2, "ng-template", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("value", ctx.bodyTableInfo)("rows", 10)("paginator", true)("globalFilterFields", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](7, _c0))("tableStyle", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction0"](8, _c1))("rowHover", true)("showCurrentPageReport", true);
        }
      },
      dependencies: [src_app_pipes_pipes_module_module__WEBPACK_IMPORTED_MODULE_7__.PipesModuleModule, ng2_pdf_viewer__WEBPACK_IMPORTED_MODULE_6__.PdfViewerModule, primeng_table__WEBPACK_IMPORTED_MODULE_1__.TableModule, primeng_table__WEBPACK_IMPORTED_MODULE_1__.Table, primeng_api__WEBPACK_IMPORTED_MODULE_10__.PrimeTemplate, primeng_table__WEBPACK_IMPORTED_MODULE_1__.SortIcon, _angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_2__.ConfirmDialogModule, primeng_card__WEBPACK_IMPORTED_MODULE_3__.CardModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_4__.DialogModule, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_5__.ProgressSpinnerModule, _pipes_perservedOrder__WEBPACK_IMPORTED_MODULE_11__.PreserveOrderPipe, _angular_common__WEBPACK_IMPORTED_MODULE_0__.UpperCasePipe],
      styles: ["\nth[ng-reflect-field=\"id\"][_ngcontent-%COMP%] {\n    \n    min-width: 0 !important;\n    \n    \n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2R5bmFtaWMtdGFibGUvZHluYW1pYy10YWJsZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdFQUFnRTtBQUNoRTtJQUNJLGtEQUFrRDtJQUNsRCx1QkFBdUI7SUFDdkIsb0NBQW9DO0lBQ3BDLHFDQUFxQztBQUN6QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFNvYnJlc2NyaWJpciBlc3RpbG9zIHBhcmEgZWwgPHRoPiBjb24gbmctcmVmbGVjdC1maWVsZD1cImlkXCIgKi9cbnRoW25nLXJlZmxlY3QtZmllbGQ9XCJpZFwiXSB7XG4gICAgLyogU29icmVzY3JpYmlyIGN1YWxxdWllciBlc3RpbG8gZXNwZWPDg8KtZmljbyBhcXXDg8KtICovXG4gICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gICAgLyogRWplbXBsbzogc29icmVzY3JpYmlyIG1pbi13aWR0aCAqL1xuICAgIC8qIE90cm9zIGVzdGlsb3MgcXVlIGRlc2VlcyBhcGxpY2FyICovXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_dashboard_dashboard_module_ts.js.map