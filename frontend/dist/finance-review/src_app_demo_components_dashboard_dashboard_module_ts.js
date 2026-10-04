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
/* harmony import */ var _service_condominios_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/condominios.service */ 30689);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/global.service */ 53796);
/* harmony import */ var _models_owner_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/owner.model */ 22899);
/* harmony import */ var _service_owner_service_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../service/owner-service.service */ 12132);
/* harmony import */ var _imports_primeng__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../imports_primeng */ 86309);
/* harmony import */ var src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/has-permissions.directive */ 25428);
/* harmony import */ var _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../booking-area/booking-area.component */ 20067);
/* harmony import */ var _staff_staff_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../staff/staff.component */ 81235);
/* harmony import */ var _service_invoice_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../service/invoice.service */ 74978);
/* harmony import */ var _invoice_history_invoice_history_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../invoice-history/invoice-history.component */ 37935);
/* harmony import */ var _service_inquiry_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../service/inquiry.service */ 44292);
/* harmony import */ var _inquiry_inquiry_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../inquiry/inquiry.component */ 65947);
/* harmony import */ var _docs_docs_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../docs/docs.component */ 86323);
/* harmony import */ var _service_docs_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../service/docs.service */ 91144);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/core */ 37800);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! src/app/layout/service/app.layout.service */ 12681);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _service_booking_service_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../service/booking-service.service */ 50624);
/* harmony import */ var _service_staff_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../service/staff.service */ 88211);
/* harmony import */ var primeng_breadcrumb__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! primeng/breadcrumb */ 34088);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! primeng/chart */ 95109);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! primeng/toast */ 20708);







































const _c0 = () => ["admin", "staff_admin", "staff"];
const _c1 = () => ["owner"];
const _c2 = (a0, a1, a2) => ({
  "text-red-500": a0,
  "text-yellow-500": a1,
  "text-green-500": a2
});
const _c3 = (a0, a1, a2) => ({
  "status-high": a0,
  "status-medium": a1,
  "status-low": a2
});
function DashboardComponent_p_message_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "p-message", 24);
  }
  if (rf & 2) {
    const message_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("severity", message_r1.severity)("text", message_r1.detail || message_r1.summary)("closable", false);
  }
}
function DashboardComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Some dashboard data could not be loaded. Select Refresh to try again.");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.balance, " ");
  }
}
function DashboardComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpipe"](6, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](7, "small")(8, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](10, " pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpipeBind2"](6, 2, ctx_r1.invoiceCards.totalBalance, "USD"));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.invoiceCards.counts);
  }
}
function DashboardComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading total units");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.units, " ");
  }
}
function DashboardComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Total units");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](7, "registered units");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalUnits);
  }
}
function DashboardComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading bookings");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.bookings, " ");
  }
}
function DashboardComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Bookings");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](6, "small")(7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalBooked);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.bookingExpiring);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.bookingExpiryLabel);
  }
}
function DashboardComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading staff");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.staff, " ");
  }
}
function DashboardComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Staff");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](7, "active collaborators");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalStaff);
  }
}
function DashboardComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading inquiries");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.inquiries, " ");
  }
}
function DashboardComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Inquiries");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](6, "small")(7, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalInquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalRespondedInquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.totalRespondedInquiries === 1 ? "response" : "responses");
  }
}
function DashboardComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "p-progressSpinner", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Loading documents");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", ctx_r1.dashboardCardErrors.documents, " ");
  }
}
function DashboardComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](1, "i", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3, "Documents");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](7, "stored files");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.totalDocuments);
  }
}
function DashboardComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "section", 16)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2, "Current section");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](3, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.activeSectionLabel);
  }
}
function DashboardComponent_Conditional_46_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](1, "No inquiries found.");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
}
function DashboardComponent_Conditional_46_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "div", 44)(1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](2, "i", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](4, "div", 47)(5, "div", 48)(6, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](8, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpipe"](10, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](11, "p-button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Conditional_46_div_8_Template_p_button_click_11_listener() {
      const inquiry_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.showInquiryDialog(inquiry_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](12, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const inquiry_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpureFunction3"](11, _c2, inquiry_r4.status === "high" || inquiry_r4.status === "urgent", inquiry_r4.status === "medium", inquiry_r4.status === "low"));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", inquiry_r4.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate1"](" ", inquiry_r4.fullname, " has sent an inquiry. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpureFunction3"](15, _c3, inquiry_r4.status === "high", inquiry_r4.status === "medium", inquiry_r4.status === "low"));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpipeBind1"](10, 9, inquiry_r4.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ariaLabel", "View inquiry " + inquiry_r4.title + " from " + inquiry_r4.fullname)("rounded", true)("text", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("title", "View inquiry: " + inquiry_r4.title);
  }
}
function DashboardComponent_Conditional_46_p_chart_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "p-chart", 52);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("data", ctx_r1.data)("options", ctx_r1.options);
  }
}
function DashboardComponent_Conditional_46_p_chart_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "p-chart", 52);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("data", ctx_r1.dataOwner)("options", ctx_r1.options);
  }
}
function DashboardComponent_Conditional_46_Conditional_17_For_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "tr")(1, "th", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const label_r5 = ctx.$implicit;
    const ɵ$index_335_r6 = ctx.$index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](label_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[0].data[ɵ$index_335_r6]);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[1].data[ɵ$index_335_r6]);
  }
}
function DashboardComponent_Conditional_46_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "details", 43)(1, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2, "View payments as a table");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](3, "div", 53)(4, "table", 54)(5, "caption", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](6, " Monthly paid and unpaid invoice counts ");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](7, "thead")(8, "tr")(9, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](10, "Month");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](11, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](13, "th", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵrepeaterCreate"](16, DashboardComponent_Conditional_46_Conditional_17_For_17_Template, 7, 3, "tr", null, _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[0].label);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtextInterpolate"](ctx_r1.dataOwner.datasets[1].label);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵrepeater"](ctx_r1.dataOwner.labels);
  }
}
function DashboardComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "div", 17)(1, "div", 37)(2, "div", 38)(3, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](4, "Notifications");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](5, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](6, DashboardComponent_Conditional_46_Conditional_6_Template, 2, 0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](7, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtemplate"](8, DashboardComponent_Conditional_46_div_8_Template, 13, 19, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](9, "div", 37)(10, "div", 38)(11, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](12, "Monthly Payments Stats");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](13, "p", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](14, " Monthly comparison of paid and unpaid invoice counts. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtemplate"](15, DashboardComponent_Conditional_46_p_chart_15_Template, 1, 2, "p-chart", 42)(16, DashboardComponent_Conditional_46_p_chart_16_Template, 1, 2, "p-chart", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](17, DashboardComponent_Conditional_46_Conditional_17_Template, 18, 2, "details", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx_r1.dashboardCardLoading.inquiries && !ctx_r1.dashboardCardErrors.inquiries && !ctx_r1.areThereInquiries ? 6 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ngForOf", ctx_r1.inquiries);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("appHasPermissions", _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("appHasPermissions", _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵpureFunction0"](6, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"]((ctx_r1.dataOwner == null ? null : ctx_r1.dataOwner.labels == null ? null : ctx_r1.dataOwner.labels.length) && (ctx_r1.dataOwner == null ? null : ctx_r1.dataOwner.datasets == null ? null : ctx_r1.dataOwner.datasets.length) >= 2 ? 17 : -1);
  }
}
function DashboardComponent_ng_template_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "span", 57)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](2, "Authorized users");
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](3, "hr");
  }
}
function DashboardComponent_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "app-family-area");
  }
}
function DashboardComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "app-booking-area", 20);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("condoId", ctx_r1.units_ownerId);
  }
}
function DashboardComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "app-invoice-history", 21);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ownerId", ctx_r1.condoId);
  }
}
function DashboardComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "app-staff", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("staffCard", function DashboardComponent_Conditional_52_Template_app_staff_staffCard_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.totalStaff = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("condoId", ctx_r1.condoId);
  }
}
function DashboardComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](0, "app-inquiry", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("clearSelectedInquiryDialog", function DashboardComponent_Conditional_53_Template_app_inquiry_clearSelectedInquiryDialog_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.clearInquiryDialogSelection());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("condoId", ctx_r1.condoId)("isHome", false)("dataDialog", ctx_r1.inquiryDialogData);
  }
}
function DashboardComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "app-docs", 23);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("isDashboard", true)("dataDocs", ctx_r1.documentsData)("userId", ctx_r1.getId());
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
    });
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.currentIcon = 'pi-building';
    this.gbColor = 'blue-100';
    this.url = _service_global_service__WEBPACK_IMPORTED_MODULE_6__.global.url;
    this.ownerObj = new _models_owner_model__WEBPACK_IMPORTED_MODULE_7__.OwnerModel('noimage.jpeg', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
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
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        data: Object.values(data.paid)
      }, {
        label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--pink-500'),
        borderColor: documentStyle.getPropertyValue('--pink-500'),
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
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        data: Object.values(data.paid)
      }, {
        label: unpaid.charAt(0).toUpperCase() + unpaid.slice(1),
        backgroundColor: documentStyle.getPropertyValue('--pink-500'),
        borderColor: documentStyle.getPropertyValue('--pink-500'),
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
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              data: paidData
            }, {
              label: 'Unpaid',
              backgroundColor: documentStyle.getPropertyValue('--pink-500'),
              borderColor: documentStyle.getPropertyValue('--pink-500'),
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
    this.ownerObj = new _models_owner_model__WEBPACK_IMPORTED_MODULE_7__.OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    // return this.setModalContent('unit_detalis')
  }
  static {
    this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_condominios_service__WEBPACK_IMPORTED_MODULE_4__.CondominioService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_user_service__WEBPACK_IMPORTED_MODULE_5__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](src_app_layout_service_app_layout_service__WEBPACK_IMPORTED_MODULE_21__.LayoutService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_22__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_1__.MessageService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_1__.ConfirmationService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_booking_service_service__WEBPACK_IMPORTED_MODULE_23__.BookingServiceService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_staff_service__WEBPACK_IMPORTED_MODULE_24__.StaffService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_invoice_service__WEBPACK_IMPORTED_MODULE_13__.InvoiceService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_inquiry_service__WEBPACK_IMPORTED_MODULE_15__.InquiryService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_service_docs_service__WEBPACK_IMPORTED_MODULE_18__.DocsService), _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_19__.ChangeDetectorRef));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵdefineComponent"]({
      type: DashboardComponent,
      selectors: [["ng-component"]],
      outputs: {
        propertyInfoEvent: "propertyInfoEvent"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵProvidersFeature"]([_service_condominios_service__WEBPACK_IMPORTED_MODULE_4__.CondominioService, _service_user_service__WEBPACK_IMPORTED_MODULE_5__.UserService, primeng_api__WEBPACK_IMPORTED_MODULE_1__.MessageService, primeng_api__WEBPACK_IMPORTED_MODULE_1__.ConfirmationService, _service_owner_service_service__WEBPACK_IMPORTED_MODULE_8__.OwnerServiceService, _service_invoice_service__WEBPACK_IMPORTED_MODULE_13__.InvoiceService, _service_inquiry_service__WEBPACK_IMPORTED_MODULE_15__.InquiryService, _service_docs_service__WEBPACK_IMPORTED_MODULE_18__.DocsService])],
      decls: 55,
      vars: 56,
      consts: [[3, "severity", "text", "closable", 4, "ngFor", "ngForOf"], [1, "dashboard-hero", "card", "mb-4"], [1, "eyebrow"], ["icon", "pi pi-refresh", "label", "Refresh", "ariaLabel", "Refresh dashboard data", "severity", "secondary", 3, "onClick", "outlined"], ["role", "alert", 1, "dashboard-data-alert"], [1, "grid", "dashboard-stat-grid"], [1, "col-12", "sm:col-6", "xl:col-4", "2xl:col-2"], ["type", "button", 1, "stat-card", "stat-card-success", 3, "click", "disabled"], ["role", "status", "aria-live", "polite", 1, "stat-card-loader"], ["role", "alert", 1, "stat-card-error"], [1, "stat-card", "stat-card-info", "stat-card-static"], ["type", "button", 1, "stat-card", "stat-card-warning", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-cyan", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-purple", 3, "click", "disabled"], ["type", "button", 1, "stat-card", "stat-card-docs", 3, "click", "disabled"], [1, "max-w-full", "mb-4", 3, "model"], ["aria-live", "polite", "aria-atomic", "true", 1, "dashboard-active-context", "dashboard-section-status"], [1, "grid", "mt-2"], [3, "visibleChange", "visible", "modal", "maximizable"], ["pTemplate", "header"], [3, "condoId"], [3, "ownerId"], [3, "condoId", "isHome", "dataDialog"], [3, "isDashboard", "dataDocs", "userId"], [3, "severity", "text", "closable"], ["aria-hidden", "true", 1, "pi", "pi-exclamation-triangle"], ["styleClass", "dashboard-card-spinner", "aria-hidden", "true"], [1, "sr-only"], ["aria-hidden", "true", 1, "pi", "pi-exclamation-circle"], [1, "stat-icon"], [1, "pi", "pi-money-bill"], [1, "stat-label"], [1, "pi", "pi-home"], [1, "pi", "pi-calendar-minus"], [1, "pi", "pi-users"], [1, "pi", "pi-comment"], [1, "pi", "pi-folder"], [1, "col-12", "xl:col-6"], [1, "card"], [1, "notifications"], ["class", "notification-item", 4, "ngFor", "ngForOf"], ["id", "monthly-payments-description", 1, "chart-description"], ["type", "bar", "aria-hidden", "true", 3, "data", "options", 4, "appHasPermissions"], [1, "chart-data-summary", "dashboard-chart-summary"], [1, "notification-item"], [1, "notification-icon"], [1, "pi", "pi-comment", 3, "ngClass"], [1, "notification-content"], [1, "body-notification"], [1, "notification-text"], [1, "notification-status", 3, "ngClass"], ["icon", "pi pi-eye", 3, "click", "ariaLabel", "rounded", "text"], ["type", "bar", "aria-hidden", "true", 3, "data", "options"], [1, "chart-table-scroll"], ["aria-describedby", "monthly-payments-description"], ["scope", "col"], ["scope", "row"], [1, "font-semibold", "text-xl", "w-100"], [3, "staffCard", "condoId"], [3, "clearSelectedInquiryDialog", "condoId", "isHome", "dataDialog"]],
      template: function DashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](0, "p-toast")(1, "p-confirmDialog");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtemplate"](2, DashboardComponent_p_message_2_Template, 1, 3, "p-message", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](3, "section", 1)(4, "div")(5, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](6, "Condominium overview");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](7, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](8, "Dashboard");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](9, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtext"](10, " Monitor balances, units, bookings, staff, inquiries, and documents from one place. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](11, "p-button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("onClick", function DashboardComponent_Template_p_button_onClick_11_listener() {
            return ctx.refreshDashboard();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](12, DashboardComponent_Conditional_12_Template, 4, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](13, "div", 5)(14, "div", 6)(15, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_15_listener() {
            return ctx.showComponent("invoice");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](16, DashboardComponent_Conditional_16_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](17, DashboardComponent_Conditional_17_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](18, DashboardComponent_Conditional_18_Template, 11, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](19, "div", 6)(20, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](21, DashboardComponent_Conditional_21_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](22, DashboardComponent_Conditional_22_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](23, DashboardComponent_Conditional_23_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](24, "div", 6)(25, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_25_listener() {
            return ctx.showComponent("booking");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](26, DashboardComponent_Conditional_26_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](27, DashboardComponent_Conditional_27_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](28, DashboardComponent_Conditional_28_Template, 10, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](29, "div", 6)(30, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_30_listener() {
            return ctx.showComponent("staff");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](31, DashboardComponent_Conditional_31_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](32, DashboardComponent_Conditional_32_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](33, DashboardComponent_Conditional_33_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](34, "div", 6)(35, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_35_listener() {
            return ctx.showComponent("inquiry");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](36, DashboardComponent_Conditional_36_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](37, DashboardComponent_Conditional_37_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](38, DashboardComponent_Conditional_38_Template, 10, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](39, "div", 6)(40, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_40_listener() {
            return ctx.showComponent("documents");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](41, DashboardComponent_Conditional_41_Template, 4, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](42, DashboardComponent_Conditional_42_Template, 3, 1, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](43, DashboardComponent_Conditional_43_Template, 8, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelement"](44, "p-breadcrumb", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](45, DashboardComponent_Conditional_45_Template, 5, 1, "section", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](46, DashboardComponent_Conditional_46_Template, 18, 7, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementStart"](47, "p-dialog", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtwoWayListener"]("visibleChange", function DashboardComponent_Template_p_dialog_visibleChange_47_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtwoWayBindingSet"](ctx.visibleCreateOwnerUnit, $event) || (ctx.visibleCreateOwnerUnit = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtemplate"](48, DashboardComponent_ng_template_48_Template, 4, 0, "ng-template", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](49, DashboardComponent_Conditional_49_Template, 1, 0, "app-family-area");
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](50, DashboardComponent_Conditional_50_Template, 1, 1, "app-booking-area", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](51, DashboardComponent_Conditional_51_Template, 1, 1, "app-invoice-history", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](52, DashboardComponent_Conditional_52_Template, 1, 1, "app-staff", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](53, DashboardComponent_Conditional_53_Template, 1, 3, "app-inquiry", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditionalCreate"](54, DashboardComponent_Conditional_54_Template, 1, 3, "app-docs", 23);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("ngForOf", ctx.propertyInactive);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("outlined", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.hasDashboardCardErrors ? 12 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.balance);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.balance ? 16 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.balance && ctx.dashboardCardErrors.balance ? 17 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.balance && !ctx.dashboardCardErrors.balance ? 18 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.units);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.units);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.units ? 21 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.units && ctx.dashboardCardErrors.units ? 22 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.units && !ctx.dashboardCardErrors.units ? 23 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.bookings);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.bookings ? 26 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.bookings && ctx.dashboardCardErrors.bookings ? 27 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.bookings && !ctx.dashboardCardErrors.bookings ? 28 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.staff);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.staff ? 31 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.staff && ctx.dashboardCardErrors.staff ? 32 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.staff && !ctx.dashboardCardErrors.staff ? 33 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.inquiries);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.inquiries ? 36 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.inquiries && ctx.dashboardCardErrors.inquiries ? 37 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.inquiries && !ctx.dashboardCardErrors.inquiries ? 38 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵclassProp"]("stat-card-loading", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("disabled", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵattribute"]("aria-busy", ctx.dashboardCardLoading.documents);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.dashboardCardLoading.documents ? 41 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.documents && ctx.dashboardCardErrors.documents ? 42 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.dashboardCardLoading.documents && !ctx.dashboardCardErrors.documents ? 43 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("model", ctx.itemsx);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](!ctx.componentsToShow.main ? 45 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.main ? 46 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵtwoWayProperty"]("visible", ctx.visibleCreateOwnerUnit);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵproperty"]("modal", true)("maximizable", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.visibleCreateOwnerUnit ? 49 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.booking ? 50 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.invoice ? 51 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.staff ? 52 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.inquiry ? 53 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_20__["ɵɵconditional"](ctx.componentsToShow.documents ? 54 : -1);
        }
      },
      dependencies: [_docs_docs_component__WEBPACK_IMPORTED_MODULE_17__.DocsComponent, _imports_primeng__WEBPACK_IMPORTED_MODULE_9__.ImportsModule, primeng_api__WEBPACK_IMPORTED_MODULE_1__.PrimeTemplate, primeng_breadcrumb__WEBPACK_IMPORTED_MODULE_25__.Breadcrumb, primeng_button__WEBPACK_IMPORTED_MODULE_26__.Button, primeng_chart__WEBPACK_IMPORTED_MODULE_27__.UIChart, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_28__.ConfirmDialog, primeng_dialog__WEBPACK_IMPORTED_MODULE_29__.Dialog, _angular_common__WEBPACK_IMPORTED_MODULE_30__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_30__.NgForOf, primeng_message__WEBPACK_IMPORTED_MODULE_31__.Message, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_32__.ProgressSpinner, primeng_toast__WEBPACK_IMPORTED_MODULE_33__.Toast, src_app_has_permissions_directive__WEBPACK_IMPORTED_MODULE_10__.HasPermissionsDirective, _booking_area_booking_area_component__WEBPACK_IMPORTED_MODULE_11__.BookingAreaComponent, _staff_staff_component__WEBPACK_IMPORTED_MODULE_12__.StaffComponent, _invoice_history_invoice_history_component__WEBPACK_IMPORTED_MODULE_14__.InvoiceHistoryComponent, _inquiry_inquiry_component__WEBPACK_IMPORTED_MODULE_16__.InquiryComponent, _angular_common__WEBPACK_IMPORTED_MODULE_30__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_30__.CurrencyPipe],
      styles: [".add-unit .p-button:hover {\n    background-color: rgb(235, 235, 112);\n    border-color: rgb(210, 202, 202);\n}\n\n  .add-unit .p-button {\n    background-color: rgb(135, 192, 239);\n    border-color: rgb(135, 192, 239);\n}\n\n.input-success[_ngcontent-%COMP%] {\n    border-color: green;\n}\n\n.input-error[_ngcontent-%COMP%] {\n    border-color: red;\n}\n\n.p-card[_ngcontent-%COMP%]   .p-card-title[_ngcontent-%COMP%] {\n    background-color: rgb(30, 216, 145);\n}\n\n.minw[_ngcontent-%COMP%] {\n    min-width: 400px;\n}\n.change-icon[_ngcontent-%COMP%]:hover {\n    cursor: pointer;\n    border: rgb(249, 181, 57) 1px solid;\n}\n\n.icon-plus-changer[_ngcontent-%COMP%]:hover {\n    cursor: pointer;\n    border: rgb(198, 200, 203) 1px solid;\n}\n\n.notification-content[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n\n.uploaded-files-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n    width: 6px;\n}\n\n.uploaded-files-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n    background: var(--surface-100);\n    border-radius: 3px;\n}\n\n.uploaded-files-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n    background: var(--surface-400);\n    border-radius: 3px;\n}\n\n.uploaded-files-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n    background: var(--surface-500);\n}\n\n  .p-fileupload-content .p-progressbar {\n    display: none !important;\n}\n\n  .p-fileupload-content .p-messages {\n    display: none !important;\n}\n\n  .p-fileupload-content .p-fileupload-files {\n    display: none !important;\n}\n\n\n.dashboard-hero[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 1rem;\n    background: radial-gradient(\n            circle at top right,\n            color-mix(in srgb, var(--primary-color) 16%, transparent),\n            transparent 32rem\n        ),\n        var(--surface-card);\n}\n\n.dashboard-hero[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    gap: 0.35rem;\n    color: var(--primary-color);\n    font-size: 0.78rem;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n}\n\n.dashboard-hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    margin: 0.35rem 0;\n    color: var(--text-color);\n    font-size: clamp(1.5rem, 3vw, 2.25rem);\n}\n\n.dashboard-data-alert[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n    gap: 0.65rem;\n    margin-bottom: 1rem;\n    padding: 0.8rem 1rem;\n    border: 1px solid #fed7aa;\n    border-radius: 0.75rem;\n    background: #fff7ed;\n    color: #9a3412;\n}\n\n.sr-only[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border: 0;\n}\n\n.dashboard-hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    margin: 0;\n    color: var(--text-color-secondary);\n    max-width: 48rem;\n}\n\n.dashboard-stat-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n    position: relative;\n    width: 100%;\n    min-height: 11rem;\n    padding: 1.25rem;\n    border: 1px solid var(--surface-border);\n    border-radius: 1.25rem;\n    background: var(--surface-card);\n    color: var(--text-color);\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.55rem;\n    text-align: left;\n    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);\n    transition: transform 160ms ease, box-shadow 160ms ease,\n        border-color 160ms ease;\n}\n\nbutton.stat-card[_ngcontent-%COMP%] {\n    cursor: pointer;\n    font: inherit;\n}\n\nbutton.stat-card[_ngcontent-%COMP%]:hover, \nbutton.stat-card[_ngcontent-%COMP%]:focus-visible {\n    transform: translateY(-3px);\n    border-color: color-mix(\n        in srgb,\n        var(--primary-color) 35%,\n        var(--surface-border)\n    );\n    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);\n    outline: none;\n}\n\n.stat-card[_ngcontent-%COMP%]:disabled {\n    cursor: wait;\n    opacity: 1;\n    transform: none;\n}\n\n.stat-card-loading[_ngcontent-%COMP%] {\n    overflow: hidden;\n}\n\n.stat-card-loader[_ngcontent-%COMP%] {\n    position: absolute;\n    inset: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: inherit;\n    background: linear-gradient(\n            180deg,\n            rgba(255, 255, 255, 0.7),\n            rgba(255, 255, 255, 0.88)\n        ),\n        var(--surface-card);\n    z-index: 1;\n}\n\n.stat-card-error[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: flex-start;\n    gap: 0.5rem;\n    color: #b91c1c;\n    font-size: 0.875rem;\n    font-weight: 600;\n    line-height: 1.4;\n}\n\n.dashboard-card-spinner[_ngcontent-%COMP%] {\n    width: 2.25rem !important;\n    height: 2.25rem !important;\n}\n\n.stat-card[_ngcontent-%COMP%]:not(.stat-card-loading)    > *[_ngcontent-%COMP%] {\n    position: relative;\n    z-index: 2;\n}\n\n.stat-card-static[_ngcontent-%COMP%] {\n    display: flex;\n}\n\n.stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 2.75rem;\n    height: 2.75rem;\n    border-radius: 999px;\n    font-size: 1.2rem;\n    margin-bottom: 0.2rem;\n}\n\n.stat-card[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n    color: var(--text-color-secondary);\n    font-weight: 700;\n}\n\n.stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    font-size: clamp(1.55rem, 2.6vw, 2.1rem);\n    line-height: 1.1;\n}\n\n.stat-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    color: var(--text-color-secondary);\n}\n\n.stat-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n    color: var(--primary-color);\n}\n\n.stat-card-success[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #dcfce7;\n    color: #16a34a;\n}\n.stat-card-info[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #dbeafe;\n    color: #2563eb;\n}\n.stat-card-warning[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #ffedd5;\n    color: #f97316;\n}\n.stat-card-cyan[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #cffafe;\n    color: #0891b2;\n}\n.stat-card-purple[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #f3e8ff;\n    color: #9333ea;\n}\n.stat-card-docs[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n    background: #fef3c7;\n    color: #d97706;\n}\n\n.notification-item[_ngcontent-%COMP%] {\n    padding: 0.75rem 0;\n}\n\n.notification-content[_ngcontent-%COMP%] {\n    gap: 1rem;\n}\n\n.notification-status[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    border-radius: 999px;\n    padding: 0.2rem 0.6rem;\n    font-size: 0.75rem;\n    font-weight: 700;\n}\n\n.dashboard-active-context[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: baseline;\n    gap: 0.65rem;\n    margin: -0.5rem 0 1rem;\n    padding: 0.7rem 1rem;\n    border-inline-start: 3px solid var(--primary-color);\n    background: var(--surface-card);\n    color: var(--text-color-secondary);\n}\n\n.dashboard-active-context[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    color: var(--text-color);\n}\n\n.card[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n    margin-top: 0;\n    font-size: 1.25rem;\n}\n\n.chart-description[_ngcontent-%COMP%] {\n    margin: -0.4rem 0 1rem;\n    color: var(--text-color-secondary);\n    font-size: 0.875rem;\n}\n\n.chart-data-summary[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n    border-top: 1px solid var(--surface-border);\n    padding-top: 0.8rem;\n}\n\n.chart-data-summary[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] {\n    width: fit-content;\n    color: var(--primary-color);\n    font-weight: 700;\n    cursor: pointer;\n}\n\n.chart-data-summary[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]:focus-visible {\n    outline: 2px solid var(--primary-color);\n    outline-offset: 0.25rem;\n}\n\n.chart-table-scroll[_ngcontent-%COMP%] {\n    overflow-x: auto;\n    margin-top: 0.75rem;\n}\n\n.chart-data-summary[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n    width: 100%;\n    border-collapse: collapse;\n    font-variant-numeric: tabular-nums;\n}\n\n.chart-data-summary[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.chart-data-summary[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.55rem 0.65rem;\n    border-bottom: 1px solid var(--surface-border);\n    text-align: right;\n    white-space: nowrap;\n}\n\n.chart-data-summary[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child {\n    text-align: left;\n}\n\n@media (max-width: 768px) {\n    [_nghost-%COMP%] {\n        display: block;\n        padding-inline-end: 1rem;\n    }\n\n    .dashboard-hero[_ngcontent-%COMP%] {\n        align-items: flex-start;\n        flex-direction: column;\n    }\n\n    .dashboard-stat-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n        min-height: 9.5rem;\n        padding: 1rem;\n    }\n\n    .dashboard-stat-grid[_ngcontent-%COMP%]    > [class*=\"col-\"][_ngcontent-%COMP%] {\n        width: 50%;\n    }\n\n    .stat-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n        font-size: clamp(1.25rem, 6vw, 1.7rem);\n    }\n\n    .stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n        width: 2.35rem;\n        height: 2.35rem;\n    }\n\n    .notification-content[_ngcontent-%COMP%] {\n        align-items: flex-start;\n    }\n\n    .dashboard-active-context[_ngcontent-%COMP%] {\n        margin-top: 0;\n    }\n}\n\n@media (max-width: 359px) {\n    .dashboard-stat-grid[_ngcontent-%COMP%]    > [class*=\"col-\"][_ngcontent-%COMP%] {\n        width: 100%;\n    }\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksb0NBQW9DO0lBQ3BDLGdDQUFnQztBQUNwQzs7QUFFQTtJQUNJLG9DQUFvQztJQUNwQyxnQ0FBZ0M7QUFDcEM7O0FBRUE7SUFDSSxtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxtQ0FBbUM7QUFDdkM7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLGVBQWU7SUFDZixtQ0FBbUM7QUFDdkM7O0FBRUE7SUFDSSxlQUFlO0lBQ2Ysb0NBQW9DO0FBQ3hDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLDhCQUE4QjtJQUM5QixtQkFBbUI7QUFDdkI7O0FBRUEscUNBQXFDO0FBQ3JDO0lBQ0ksVUFBVTtBQUNkOztBQUVBO0lBQ0ksOEJBQThCO0lBQzlCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLDhCQUE4QjtJQUM5QixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSw4QkFBOEI7QUFDbEM7O0FBRUE7SUFDSSx3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSx3QkFBd0I7QUFDNUI7O0FBRUE7SUFDSSx3QkFBd0I7QUFDNUI7O0FBRUEsa0NBQWtDO0FBQ2xDO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw4QkFBOEI7SUFDOUIsU0FBUztJQUNUOzs7OzsyQkFLdUI7QUFDM0I7O0FBRUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWiwyQkFBMkI7SUFDM0Isa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksaUJBQWlCO0lBQ2pCLHdCQUF3QjtJQUN4QixzQ0FBc0M7QUFDMUM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixtQkFBbUI7SUFDbkIsb0JBQW9CO0lBQ3BCLHlCQUF5QjtJQUN6QixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLFNBQVM7QUFDYjs7QUFFQTtJQUNJLFNBQVM7SUFDVCxrQ0FBa0M7SUFDbEMsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLHVDQUF1QztJQUN2QyxzQkFBc0I7SUFDdEIsK0JBQStCO0lBQy9CLHdCQUF3QjtJQUN4QixhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLHVCQUF1QjtJQUN2QixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLDhDQUE4QztJQUM5QzsrQkFDMkI7QUFDL0I7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsYUFBYTtBQUNqQjs7QUFFQTs7SUFFSSwyQkFBMkI7SUFDM0I7Ozs7S0FJQztJQUNELDhDQUE4QztJQUM5QyxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLFVBQVU7SUFDVixlQUFlO0FBQ25COztBQUVBO0lBQ0ksZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixzQkFBc0I7SUFDdEI7Ozs7OzJCQUt1QjtJQUN2QixVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLFdBQVc7SUFDWCxjQUFjO0lBQ2QsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSx5QkFBeUI7SUFDekIsMEJBQTBCO0FBQzlCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixjQUFjO0lBQ2QsZUFBZTtJQUNmLG9CQUFvQjtJQUNwQixpQkFBaUI7SUFDakIscUJBQXFCO0FBQ3pCOztBQUVBO0lBQ0ksa0NBQWtDO0lBQ2xDLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLHdDQUF3QztJQUN4QyxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxrQ0FBa0M7QUFDdEM7O0FBRUE7SUFDSSwyQkFBMkI7QUFDL0I7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsY0FBYztBQUNsQjtBQUNBO0lBQ0ksbUJBQW1CO0lBQ25CLGNBQWM7QUFDbEI7QUFDQTtJQUNJLG1CQUFtQjtJQUNuQixjQUFjO0FBQ2xCO0FBQ0E7SUFDSSxtQkFBbUI7SUFDbkIsY0FBYztBQUNsQjtBQUNBO0lBQ0ksbUJBQW1CO0lBQ25CLGNBQWM7QUFDbEI7QUFDQTtJQUNJLG1CQUFtQjtJQUNuQixjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksU0FBUztBQUNiOztBQUVBO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixvQkFBb0I7SUFDcEIsc0JBQXNCO0lBQ3RCLGtCQUFrQjtJQUNsQixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2IscUJBQXFCO0lBQ3JCLFlBQVk7SUFDWixzQkFBc0I7SUFDdEIsb0JBQW9CO0lBQ3BCLG1EQUFtRDtJQUNuRCwrQkFBK0I7SUFDL0Isa0NBQWtDO0FBQ3RDOztBQUVBO0lBQ0ksd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLHNCQUFzQjtJQUN0QixrQ0FBa0M7SUFDbEMsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLDJDQUEyQztJQUMzQyxtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsMkJBQTJCO0lBQzNCLGdCQUFnQjtJQUNoQixlQUFlO0FBQ25COztBQUVBO0lBQ0ksdUNBQXVDO0lBQ3ZDLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gseUJBQXlCO0lBQ3pCLGtDQUFrQztBQUN0Qzs7QUFFQTs7SUFFSSx3QkFBd0I7SUFDeEIsOENBQThDO0lBQzlDLGlCQUFpQjtJQUNqQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSTtRQUNJLGNBQWM7UUFDZCx3QkFBd0I7SUFDNUI7O0lBRUE7UUFDSSx1QkFBdUI7UUFDdkIsc0JBQXNCO0lBQzFCOztJQUVBO1FBQ0ksa0JBQWtCO1FBQ2xCLGFBQWE7SUFDakI7O0lBRUE7UUFDSSxVQUFVO0lBQ2Q7O0lBRUE7UUFDSSxzQ0FBc0M7SUFDMUM7O0lBRUE7UUFDSSxjQUFjO1FBQ2QsZUFBZTtJQUNuQjs7SUFFQTtRQUNJLHVCQUF1QjtJQUMzQjs7SUFFQTtRQUNJLGFBQWE7SUFDakI7QUFDSjs7QUFFQTtJQUNJO1FBQ0ksV0FBVztJQUNmO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyI6Om5nLWRlZXAgLmFkZC11bml0IC5wLWJ1dHRvbjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzNSwgMjM1LCAxMTIpO1xuICAgIGJvcmRlci1jb2xvcjogcmdiKDIxMCwgMjAyLCAyMDIpO1xufVxuXG46Om5nLWRlZXAgLmFkZC11bml0IC5wLWJ1dHRvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDEzNSwgMTkyLCAyMzkpO1xuICAgIGJvcmRlci1jb2xvcjogcmdiKDEzNSwgMTkyLCAyMzkpO1xufVxuXG4uaW5wdXQtc3VjY2VzcyB7XG4gICAgYm9yZGVyLWNvbG9yOiBncmVlbjtcbn1cblxuLmlucHV0LWVycm9yIHtcbiAgICBib3JkZXItY29sb3I6IHJlZDtcbn1cblxuLnAtY2FyZCAucC1jYXJkLXRpdGxlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzAsIDIxNiwgMTQ1KTtcbn1cblxuLm1pbncge1xuICAgIG1pbi13aWR0aDogNDAwcHg7XG59XG4uY2hhbmdlLWljb246aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXI6IHJnYigyNDksIDE4MSwgNTcpIDFweCBzb2xpZDtcbn1cblxuLmljb24tcGx1cy1jaGFuZ2VyOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyOiByZ2IoMTk4LCAyMDAsIDIwMykgMXB4IHNvbGlkO1xufVxuXG4ubm90aWZpY2F0aW9uLWNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi8qIFNjcm9sbGJhciBwYXJhIGxpc3RhIGRlIGFyY2hpdm9zICovXG4udXBsb2FkZWQtZmlsZXMtbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA2cHg7XG59XG5cbi51cGxvYWRlZC1maWxlcy1saXN0Ojotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS0xMDApO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbn1cblxuLnVwbG9hZGVkLWZpbGVzLWxpc3Q6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLTQwMCk7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xufVxuXG4udXBsb2FkZWQtZmlsZXMtbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtNTAwKTtcbn1cblxuOjpuZy1kZWVwIC5wLWZpbGV1cGxvYWQtY29udGVudCAucC1wcm9ncmVzc2JhciB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuXG46Om5nLWRlZXAgLnAtZmlsZXVwbG9hZC1jb250ZW50IC5wLW1lc3NhZ2VzIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbjo6bmctZGVlcCAucC1maWxldXBsb2FkLWNvbnRlbnQgLnAtZmlsZXVwbG9hZC1maWxlcyB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuXG4vKiBVSSBwb2xpc2g6IGRhc2hib2FyZCBvdmVydmlldyAqL1xuLmRhc2hib2FyZC1oZXJvIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGdhcDogMXJlbTtcbiAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoXG4gICAgICAgICAgICBjaXJjbGUgYXQgdG9wIHJpZ2h0LFxuICAgICAgICAgICAgY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXByaW1hcnktY29sb3IpIDE2JSwgdHJhbnNwYXJlbnQpLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQgMzJyZW1cbiAgICAgICAgKSxcbiAgICAgICAgdmFyKC0tc3VyZmFjZS1jYXJkKTtcbn1cblxuLmRhc2hib2FyZC1oZXJvIC5leWVicm93IHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMC4zNXJlbTtcbiAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XG4gICAgZm9udC1zaXplOiAwLjc4cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMDhlbTtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4uZGFzaGJvYXJkLWhlcm8gaDEge1xuICAgIG1hcmdpbjogMC4zNXJlbSAwO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgICBmb250LXNpemU6IGNsYW1wKDEuNXJlbSwgM3Z3LCAyLjI1cmVtKTtcbn1cblxuLmRhc2hib2FyZC1kYXRhLWFsZXJ0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAwLjY1cmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgcGFkZGluZzogMC44cmVtIDFyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2ZlZDdhYTtcbiAgICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xuICAgIGJhY2tncm91bmQ6ICNmZmY3ZWQ7XG4gICAgY29sb3I6ICM5YTM0MTI7XG59XG5cbi5zci1vbmx5IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDFweDtcbiAgICBoZWlnaHQ6IDFweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogLTFweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGNsaXA6IHJlY3QoMCwgMCwgMCwgMCk7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBib3JkZXI6IDA7XG59XG5cbi5kYXNoYm9hcmQtaGVybyBwIHtcbiAgICBtYXJnaW46IDA7XG4gICAgY29sb3I6IHZhcigtLXRleHQtY29sb3Itc2Vjb25kYXJ5KTtcbiAgICBtYXgtd2lkdGg6IDQ4cmVtO1xufVxuXG4uZGFzaGJvYXJkLXN0YXQtZ3JpZCAuc3RhdC1jYXJkIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWluLWhlaWdodDogMTFyZW07XG4gICAgcGFkZGluZzogMS4yNXJlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zdXJmYWNlLWJvcmRlcik7XG4gICAgYm9yZGVyLXJhZGl1czogMS4yNXJlbTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWNhcmQpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgZ2FwOiAwLjU1cmVtO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMTYwbXMgZWFzZSwgYm94LXNoYWRvdyAxNjBtcyBlYXNlLFxuICAgICAgICBib3JkZXItY29sb3IgMTYwbXMgZWFzZTtcbn1cblxuYnV0dG9uLnN0YXQtY2FyZCB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGZvbnQ6IGluaGVyaXQ7XG59XG5cbmJ1dHRvbi5zdGF0LWNhcmQ6aG92ZXIsXG5idXR0b24uc3RhdC1jYXJkOmZvY3VzLXZpc2libGUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtM3B4KTtcbiAgICBib3JkZXItY29sb3I6IGNvbG9yLW1peChcbiAgICAgICAgaW4gc3JnYixcbiAgICAgICAgdmFyKC0tcHJpbWFyeS1jb2xvcikgMzUlLFxuICAgICAgICB2YXIoLS1zdXJmYWNlLWJvcmRlcilcbiAgICApO1xuICAgIGJveC1zaGFkb3c6IDAgMThweCA0NXB4IHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XG4gICAgb3V0bGluZTogbm9uZTtcbn1cblxuLnN0YXQtY2FyZDpkaXNhYmxlZCB7XG4gICAgY3Vyc29yOiB3YWl0O1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiBub25lO1xufVxuXG4uc3RhdC1jYXJkLWxvYWRpbmcge1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5zdGF0LWNhcmQtbG9hZGVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IGluaGVyaXQ7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgICAgICAgICAgMTgwZGVnLFxuICAgICAgICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpLFxuICAgICAgICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg4KVxuICAgICAgICApLFxuICAgICAgICB2YXIoLS1zdXJmYWNlLWNhcmQpO1xuICAgIHotaW5kZXg6IDE7XG59XG5cbi5zdGF0LWNhcmQtZXJyb3Ige1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgZ2FwOiAwLjVyZW07XG4gICAgY29sb3I6ICNiOTFjMWM7XG4gICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG59XG5cbi5kYXNoYm9hcmQtY2FyZC1zcGlubmVyIHtcbiAgICB3aWR0aDogMi4yNXJlbSAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogMi4yNXJlbSAhaW1wb3J0YW50O1xufVxuXG4uc3RhdC1jYXJkOm5vdCguc3RhdC1jYXJkLWxvYWRpbmcpID4gKiB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDI7XG59XG5cbi5zdGF0LWNhcmQtc3RhdGljIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uc3RhdC1jYXJkIC5zdGF0LWljb24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgd2lkdGg6IDIuNzVyZW07XG4gICAgaGVpZ2h0OiAyLjc1cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDAuMnJlbTtcbn1cblxuLnN0YXQtY2FyZCAuc3RhdC1sYWJlbCB7XG4gICAgY29sb3I6IHZhcigtLXRleHQtY29sb3Itc2Vjb25kYXJ5KTtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG4uc3RhdC1jYXJkIHN0cm9uZyB7XG4gICAgZm9udC1zaXplOiBjbGFtcCgxLjU1cmVtLCAyLjZ2dywgMi4xcmVtKTtcbiAgICBsaW5lLWhlaWdodDogMS4xO1xufVxuXG4uc3RhdC1jYXJkIHNtYWxsIHtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvci1zZWNvbmRhcnkpO1xufVxuXG4uc3RhdC1jYXJkIHNtYWxsIGIge1xuICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcbn1cblxuLnN0YXQtY2FyZC1zdWNjZXNzIC5zdGF0LWljb24ge1xuICAgIGJhY2tncm91bmQ6ICNkY2ZjZTc7XG4gICAgY29sb3I6ICMxNmEzNGE7XG59XG4uc3RhdC1jYXJkLWluZm8gLnN0YXQtaWNvbiB7XG4gICAgYmFja2dyb3VuZDogI2RiZWFmZTtcbiAgICBjb2xvcjogIzI1NjNlYjtcbn1cbi5zdGF0LWNhcmQtd2FybmluZyAuc3RhdC1pY29uIHtcbiAgICBiYWNrZ3JvdW5kOiAjZmZlZGQ1O1xuICAgIGNvbG9yOiAjZjk3MzE2O1xufVxuLnN0YXQtY2FyZC1jeWFuIC5zdGF0LWljb24ge1xuICAgIGJhY2tncm91bmQ6ICNjZmZhZmU7XG4gICAgY29sb3I6ICMwODkxYjI7XG59XG4uc3RhdC1jYXJkLXB1cnBsZSAuc3RhdC1pY29uIHtcbiAgICBiYWNrZ3JvdW5kOiAjZjNlOGZmO1xuICAgIGNvbG9yOiAjOTMzM2VhO1xufVxuLnN0YXQtY2FyZC1kb2NzIC5zdGF0LWljb24ge1xuICAgIGJhY2tncm91bmQ6ICNmZWYzYzc7XG4gICAgY29sb3I6ICNkOTc3MDY7XG59XG5cbi5ub3RpZmljYXRpb24taXRlbSB7XG4gICAgcGFkZGluZzogMC43NXJlbSAwO1xufVxuXG4ubm90aWZpY2F0aW9uLWNvbnRlbnQge1xuICAgIGdhcDogMXJlbTtcbn1cblxuLm5vdGlmaWNhdGlvbi1zdGF0dXMge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gICAgcGFkZGluZzogMC4ycmVtIDAuNnJlbTtcbiAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuLmRhc2hib2FyZC1hY3RpdmUtY29udGV4dCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogYmFzZWxpbmU7XG4gICAgZ2FwOiAwLjY1cmVtO1xuICAgIG1hcmdpbjogLTAuNXJlbSAwIDFyZW07XG4gICAgcGFkZGluZzogMC43cmVtIDFyZW07XG4gICAgYm9yZGVyLWlubGluZS1zdGFydDogM3B4IHNvbGlkIHZhcigtLXByaW1hcnktY29sb3IpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtY2FyZCk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtY29sb3Itc2Vjb25kYXJ5KTtcbn1cblxuLmRhc2hib2FyZC1hY3RpdmUtY29udGV4dCBzdHJvbmcge1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbn1cblxuLmNhcmQgPiBoMiB7XG4gICAgbWFyZ2luLXRvcDogMDtcbiAgICBmb250LXNpemU6IDEuMjVyZW07XG59XG5cbi5jaGFydC1kZXNjcmlwdGlvbiB7XG4gICAgbWFyZ2luOiAtMC40cmVtIDAgMXJlbTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvci1zZWNvbmRhcnkpO1xuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG59XG5cbi5jaGFydC1kYXRhLXN1bW1hcnkge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLXN1cmZhY2UtYm9yZGVyKTtcbiAgICBwYWRkaW5nLXRvcDogMC44cmVtO1xufVxuXG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHN1bW1hcnkge1xuICAgIHdpZHRoOiBmaXQtY29udGVudDtcbiAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5jaGFydC1kYXRhLXN1bW1hcnkgc3VtbWFyeTpmb2N1cy12aXNpYmxlIHtcbiAgICBvdXRsaW5lOiAycHggc29saWQgdmFyKC0tcHJpbWFyeS1jb2xvcik7XG4gICAgb3V0bGluZS1vZmZzZXQ6IDAuMjVyZW07XG59XG5cbi5jaGFydC10YWJsZS1zY3JvbGwge1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgbWFyZ2luLXRvcDogMC43NXJlbTtcbn1cblxuLmNoYXJ0LWRhdGEtc3VtbWFyeSB0YWJsZSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgICBmb250LXZhcmlhbnQtbnVtZXJpYzogdGFidWxhci1udW1zO1xufVxuXG4uY2hhcnQtZGF0YS1zdW1tYXJ5IHRoLFxuLmNoYXJ0LWRhdGEtc3VtbWFyeSB0ZCB7XG4gICAgcGFkZGluZzogMC41NXJlbSAwLjY1cmVtO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1zdXJmYWNlLWJvcmRlcik7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLmNoYXJ0LWRhdGEtc3VtbWFyeSB0aDpmaXJzdC1jaGlsZCB7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcGFkZGluZy1pbmxpbmUtZW5kOiAxcmVtO1xuICAgIH1cblxuICAgIC5kYXNoYm9hcmQtaGVybyB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cblxuICAgIC5kYXNoYm9hcmQtc3RhdC1ncmlkIC5zdGF0LWNhcmQge1xuICAgICAgICBtaW4taGVpZ2h0OiA5LjVyZW07XG4gICAgICAgIHBhZGRpbmc6IDFyZW07XG4gICAgfVxuXG4gICAgLmRhc2hib2FyZC1zdGF0LWdyaWQgPiBbY2xhc3MqPVwiY29sLVwiXSB7XG4gICAgICAgIHdpZHRoOiA1MCU7XG4gICAgfVxuXG4gICAgLnN0YXQtY2FyZCBzdHJvbmcge1xuICAgICAgICBmb250LXNpemU6IGNsYW1wKDEuMjVyZW0sIDZ2dywgMS43cmVtKTtcbiAgICB9XG5cbiAgICAuc3RhdC1jYXJkIC5zdGF0LWljb24ge1xuICAgICAgICB3aWR0aDogMi4zNXJlbTtcbiAgICAgICAgaGVpZ2h0OiAyLjM1cmVtO1xuICAgIH1cblxuICAgIC5ub3RpZmljYXRpb24tY29udGVudCB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgIC5kYXNoYm9hcmQtYWN0aXZlLWNvbnRleHQge1xuICAgICAgICBtYXJnaW4tdG9wOiAwO1xuICAgIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDM1OXB4KSB7XG4gICAgLmRhc2hib2FyZC1zdGF0LWdyaWQgPiBbY2xhc3MqPVwiY29sLVwiXSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
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