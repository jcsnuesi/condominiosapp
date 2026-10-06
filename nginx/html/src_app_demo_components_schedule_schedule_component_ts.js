"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_schedule_schedule_component_ts"],{

/***/ 48775
/*!****************************************************************!*\
  !*** ./src/app/demo/components/schedule/schedule.component.ts ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleComponent: () => (/* binding */ ScheduleComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37800);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 15322);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 39285);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var _fullcalendar_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fullcalendar/angular */ 13671);
/* harmony import */ var _fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fullcalendar/daygrid */ 53950);
/* harmony import */ var _fullcalendar_timegrid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fullcalendar/timegrid */ 60412);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _schedule_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./schedule.service */ 71807);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 58440);


















const _c0 = () => ({
  width: "680px",
  maxWidth: "95vw"
});
const _c1 = () => ["SCHEDULED", "PENDING", "IN_PROGRESS", "OVERDUE", "COMPLETED", "CANCELLED", "SKIPPED"];
function ScheduleComponent_p_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p-button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("onClick", function ScheduleComponent_p_button_9_Template_p_button_onClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openSchedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_p_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("onClick", function ScheduleComponent_p_button_10_Template_p_button_onClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openVendor());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.message);
  }
}
function ScheduleComponent_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function ScheduleComponent_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_button_16_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("tasks"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵattribute"]("aria-current", ctx_r1.tab === "tasks" ? "page" : null);
  }
}
function ScheduleComponent_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_button_17_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("history"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "History");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵattribute"]("aria-current", ctx_r1.tab === "history" ? "page" : null);
  }
}
function ScheduleComponent_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_button_18_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("vendors"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Vendors");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx_r1.tab === "vendors");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵattribute"]("aria-current", ctx_r1.tab === "vendors" ? "page" : null);
  }
}
function ScheduleComponent_div_19_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const c_r8 = ctx.$implicit;
    const i_r9 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", i_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](c_r8.label);
  }
}
function ScheduleComponent_div_19_label_7_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r11 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", s_r11);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.statusLabel(s_r11));
  }
}
function ScheduleComponent_div_19_label_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "select", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_label_7_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.statusFilter, $event) || (ctx_r1.statusFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_label_7_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4, "All");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](5, ScheduleComponent_div_19_label_7_option_5_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.statusFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](2, _c1));
  }
}
function ScheduleComponent_div_19_label_14_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const v_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", v_r13._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](v_r13.name);
  }
}
function ScheduleComponent_div_19_label_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "select", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_label_14_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.providerFilter, $event) || (ctx_r1.providerFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_label_14_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4, "All");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](5, ScheduleComponent_div_19_label_14_option_5_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.providerFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
  }
}
function ScheduleComponent_div_19_label_15_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const r_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", r_r15.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](r_r15.name);
  }
}
function ScheduleComponent_div_19_label_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Assignee");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "select", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_label_15_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.responsibleFilter, $event) || (ctx_r1.responsibleFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_label_15_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](5, ScheduleComponent_div_19_label_15_option_5_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.responsibleFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.selectedLocation === "");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.selectedLocation === "" ? "Select a location" : "All");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.filterResponsibles);
  }
}
function ScheduleComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 28)(1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "select", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_Template_select_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.selectedLocation, $event) || (ctx_r1.selectedLocation = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_Template_select_change_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.locationFilterChanged());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5, "All my locations");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](6, ScheduleComponent_div_19_option_6_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](7, ScheduleComponent_div_19_label_7_Template, 6, 3, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9, "From");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.from, $event) || (ctx_r1.from = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_Template_input_change_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "To");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_19_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.to, $event) || (ctx_r1.to = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_div_19_Template_input_change_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](14, ScheduleComponent_div_19_label_14_Template, 6, 2, "label", 32)(15, ScheduleComponent_div_19_label_15_Template, 6, 4, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.selectedLocation);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.contexts);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.from);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.to);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks" || ctx_r1.tab === "schedules");
  }
}
function ScheduleComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 36)(1, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_20_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.setView("list"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "List");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_20_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.setView("calendar"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4, "Calendar");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx_r1.view === "list");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx_r1.view === "calendar");
  }
}
function ScheduleComponent_p_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Loading maintenance\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](1, "full-calendar", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("options", ctx_r1.calendar);
  }
}
function ScheduleComponent_div_23_table_1_tr_18_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"]("Check the location or reassign the task: ", s_r17.notificationError);
  }
}
function ScheduleComponent_div_23_table_1_tr_18_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_1_tr_18_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openSchedule(s_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_23_table_1_tr_18_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_1_tr_18_button_20_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.toggle(s_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.isActive ? "Pause" : "Resume");
  }
}
function ScheduleComponent_div_23_table_1_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](6, ScheduleComponent_div_23_table_1_tr_18_small_6_Template, 2, 1, "small", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](15, "td")(16, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](18, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](19, ScheduleComponent_div_23_table_1_tr_18_button_19_Template, 2, 0, "button", 47)(20, ScheduleComponent_div_23_table_1_tr_18_button_20_Template, 2, 2, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const s_r17 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.equipmentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", s_r17.notificationError);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.locationLabel(s_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.frequencyType === "ONCE" ? "Once" : "Every " + s_r17.frequencyValue + " " + ctx_r1.frequencyLabel(s_r17.frequencyType));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.nextRunAt ? ctx_r1.formatDate(s_r17.nextRunAt, s_r17.timezone) : "Finished");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.timezone);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("active", s_r17.isActive);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](s_r17.isActive ? "Active" : "Paused / finished");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.has("schedules.update"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.has("schedules.update") && s_r17.nextRunAt);
  }
}
function ScheduleComponent_div_23_table_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "table")(1, "caption", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Maintenance schedules");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Maintenance");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8, "Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10, "Frequency");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "Next due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](14, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](15, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](16, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](17, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](18, ScheduleComponent_div_23_table_1_tr_18_Template, 21, 12, "tr", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.schedules);
  }
}
function ScheduleComponent_div_23_table_2_tr_16_td_11_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_2_tr_16_td_11_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r21);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "IN_PROGRESS"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Start");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving);
  }
}
function ScheduleComponent_div_23_table_2_tr_16_td_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "td", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](1, ScheduleComponent_div_23_table_2_tr_16_td_11_button_1_Template, 2, 1, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_2_tr_16_td_11_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openComplete(t_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3, "Complete");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_2_tr_16_td_11_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openReschedule(t_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5, "Reschedule");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_2_tr_16_td_11_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "SKIPPED"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](7, "Skip");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_2_tr_16_td_11_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "CANCELLED"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", t_r22.status !== "IN_PROGRESS");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving);
  }
}
function ScheduleComponent_div_23_table_2_tr_16_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_23_table_2_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "td")(9, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](11, ScheduleComponent_div_23_table_2_tr_16_td_11_Template, 10, 3, "td", 51)(12, ScheduleComponent_div_23_table_2_tr_16_td_12_Template, 2, 0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r22 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](t_r22.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.locationLabel(t_r22));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.formatDate(t_r22.dueDate, t_r22.timezone));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("overdue", t_r22.status === "OVERDUE");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.statusLabel(t_r22.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", t_r22.isOpen && ctx_r1.has("maintenance.update"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !t_r22.isOpen || !ctx_r1.has("maintenance.update"));
  }
}
function ScheduleComponent_div_23_table_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "table")(1, "caption", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Maintenance tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Task");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8, "Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10, "Due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](14, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](16, ScheduleComponent_div_23_table_2_tr_16_Template, 13, 8, "tr", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.tasks);
  }
}
function ScheduleComponent_div_23_table_3_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "td")(11, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_3_tr_16_Template_button_click_11_listener() {
      const h_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r23).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openHistory(h_r24));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "View record");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const h_r24 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](h_r24.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.formatDate(h_r24.performedAt, h_r24.timezone));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"]((h_r24.providerSnapshot == null ? null : h_r24.providerSnapshot.name) || "No vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate2"]("", ctx_r1.cost(h_r24), " ", h_r24.currency);
  }
}
function ScheduleComponent_div_23_table_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "table")(1, "caption", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Maintenance history");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Maintenance");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8, "Completed on");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10, "Vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "Cost");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](14, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](16, ScheduleComponent_div_23_table_3_tr_16_Template, 13, 5, "tr", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.history);
  }
}
function ScheduleComponent_div_23_table_4_tr_14_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_23_table_4_tr_14_button_9_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const v_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openVendor(v_r26));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_23_table_4_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](9, ScheduleComponent_div_23_table_4_tr_14_button_9_Template, 2, 0, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const v_r26 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](v_r26.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](v_r26.contact);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](v_r26.isActive ? "Active" : "Archived");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.has("vendors.update"));
  }
}
function ScheduleComponent_div_23_table_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "table")(1, "caption", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Vendor directory");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8, "Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](14, ScheduleComponent_div_23_table_4_tr_14_Template, 10, 4, "tr", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
  }
}
function ScheduleComponent_div_23_div_5_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Schedule your first maintenance to get started.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_23_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](1, "i", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3, "No records match this selection.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](4, ScheduleComponent_div_23_div_5_p_4_Template, 2, 0, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "schedules");
  }
}
function ScheduleComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](1, ScheduleComponent_div_23_table_1_Template, 19, 1, "table", 32)(2, ScheduleComponent_div_23_table_2_Template, 17, 1, "table", 32)(3, ScheduleComponent_div_23_table_3_Template, 17, 1, "table", 32)(4, ScheduleComponent_div_23_table_4_Template, 15, 1, "table", 32)(5, ScheduleComponent_div_23_div_5_Template, 5, 1, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵattribute"]("aria-busy", ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "schedules");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.tab === "vendors");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !ctx_r1.loading && ctx_r1.total === 0);
  }
}
function ScheduleComponent_footer_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "footer", 54)(1, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_footer_24_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      ctx_r1.page = ctx_r1.page - 1;
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.load());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2, "Previous");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_footer_24_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      ctx_r1.page = ctx_r1.page + 1;
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.load());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Next");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.page <= 1 || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate2"]("Page ", ctx_r1.page, " \u00B7 ", ctx_r1.total, " records");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.page * ctx_r1.limit >= ctx_r1.total || ctx_r1.loading);
  }
}
function ScheduleComponent_p_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function ScheduleComponent_form_27_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const c_r30 = ctx.$implicit;
    const i_r31 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", i_r31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](c_r30.label);
  }
}
function ScheduleComponent_form_27_label_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "First due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "input", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_label_31_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.startDate, $event) || (ctx_r1.draft.startDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4, "The entered time uses your browser time zone. Recurrence uses the time zone below.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.startDate);
  }
}
function ScheduleComponent_form_27_option_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const r_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", r_r33.role + ":" + r_r33.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate2"]("", r_r33.name, " (", r_r33.role, ")");
  }
}
function ScheduleComponent_form_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "form", 55, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_27_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const scheduleForm_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](scheduleForm_r29.valid && ctx_r1.saveSchedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.name, $event) || (ctx_r1.draft.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "select", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_select_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.location, $event) || (ctx_r1.draft.location = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_form_27_Template_select_change_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.loadResponsibles());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9, "Select a location");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](10, ScheduleComponent_form_27_option_10_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "Equipment or facility");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "input", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.equipmentName, $event) || (ctx_r1.draft.equipmentName = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](14, "div", 59)(15, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](16, "Frequency");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](17, "select", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_select_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.frequencyType, $event) || (ctx_r1.draft.frequencyType = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](18, "option", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](19, "Once");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](20, "option", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](21, "Days");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](22, "option", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](23, "Weeks");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](24, "option", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](25, "Months");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](26, "option", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](27, "Years");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](28, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](29, "Repeat every");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](30, "input", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_30_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.frequencyValue, $event) || (ctx_r1.draft.frequencyValue = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](31, ScheduleComponent_form_27_label_31_Template, 5, 1, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](32, "div", 59)(33, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](34, "Time zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](35, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_35_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.timezone, $event) || (ctx_r1.draft.timezone = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](36, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](37, "Reminder lead time (days)");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](38, "input", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_38_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.remindBeforeDays, $event) || (ctx_r1.draft.remindBeforeDays = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](39, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](40, "Assignee");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](41, "select", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_select_ngModelChange_41_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.responsible, $event) || (ctx_r1.draft.responsible = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](42, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](43, "Me");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](44, ScheduleComponent_form_27_option_44_Template, 2, 3, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](45, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](46, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](47, "textarea", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_textarea_ngModelChange_47_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.draft.description, $event) || (ctx_r1.draft.description = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](48, "p", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](49, "The next maintenance date is calculated from the completion date. Frequency changes apply to the next occurrence.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](50, "p-button", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const scheduleForm_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.location);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", !!ctx_r1.editingId);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.contexts);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.equipmentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.frequencyType);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.frequencyValue);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !ctx_r1.editingId);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.timezone);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.remindBeforeDays);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.responsible);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.responsibles);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving || !scheduleForm_r29.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_28_ng_container_13_option_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const v_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", v_r36._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](v_r36.name);
  }
}
function ScheduleComponent_form_28_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](1, ScheduleComponent_form_28_ng_container_13_option_1_Template, 2, 2, "option", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const v_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", v_r36.isActive);
  }
}
function ScheduleComponent_form_28_label_35_option_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const d_r38 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("value", d_r38._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](d_r38.title);
  }
}
function ScheduleComponent_form_28_label_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1, "Existing documents (optional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "select", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_label_35_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r37);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.documentIds, $event) || (ctx_r1.documentIds = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](3, ScheduleComponent_form_28_label_35_option_3_Template, 2, 2, "option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5, "Select up to five documents.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.documentIds);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.documents);
  }
}
function ScheduleComponent_form_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "form", 55, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_28_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const completeForm_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](completeForm_r35.valid && ctx_r1.complete());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "p")(3, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Completion date");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "input", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.performedAt, $event) || (ctx_r1.completion.performedAt = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9, "Vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "select", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_select_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.providerId, $event) || (ctx_r1.completion.providerId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12, "No vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](13, ScheduleComponent_form_28_ng_container_13_Template, 2, 1, "ng-container", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](14, "div", 59)(15, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](16, "Cost");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](17, "input", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.cost, $event) || (ctx_r1.completion.cost = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](18, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](19, "Currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](20, "input", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_20_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.currency, $event) || (ctx_r1.completion.currency = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](21, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](22, "Work performed");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](23, "textarea", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_textarea_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.description, $event) || (ctx_r1.completion.description = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](24, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](25, "Notes");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](26, "textarea", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_textarea_ngModelChange_26_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.notes, $event) || (ctx_r1.completion.notes = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](27, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](28, "Next date override (optional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](29, "input", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_29_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.completion.nextRecommendedDate, $event) || (ctx_r1.completion.nextRecommendedDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](30, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](31, "Evidence");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](32, "input", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("change", function ScheduleComponent_form_28_Template_input_change_32_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectFiles($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](33, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](35, ScheduleComponent_form_28_label_35_Template, 6, 2, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](36, "p", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](37, "A permanent record will be saved with the date, cost, and evidence.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](38, "p-button", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const completeForm_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.task == null ? null : ctx_r1.task.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.performedAt);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.providerId);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.cost);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.currency);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.nextRecommendedDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"]("Up to five files, 10 MB each. ", ctx_r1.files.length, " selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.documents.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving || !completeForm_r35.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "form", 55, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_29_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r39);
      const rescheduleForm_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](rescheduleForm_r40.valid && ctx_r1.reschedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5, "New due date");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "input", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_29_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r39);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.rescheduleDate, $event) || (ctx_r1.rescheduleDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](7, "p-button", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const rescheduleForm_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.task == null ? null : ctx_r1.task.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.rescheduleDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving || !rescheduleForm_r40.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "form", 55, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_30_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const vendorForm_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](vendorForm_r42.valid && ctx_r1.saveVendor());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_30_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.name, $event) || (ctx_r1.vendorDraft.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "input", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_30_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.contact, $event) || (ctx_r1.vendorDraft.contact = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9, "Notes");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "textarea", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_30_Template_textarea_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.notes, $event) || (ctx_r1.vendorDraft.notes = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](11, "label", 88)(12, "input", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_30_Template_input_ngModelChange_12_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.isActive, $event) || (ctx_r1.vendorDraft.isActive = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](13, "Active vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](14, "p-button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const vendorForm_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.contact);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.isActive);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", ctx_r1.saving || !vendorForm_r42.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_div_31_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"]("Next date: ", ctx_r1.formatDate(ctx_r1.selectedHistory.nextRecommendedDate, ctx_r1.selectedHistory.timezone));
  }
}
function ScheduleComponent_div_31_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_div_31_button_12_Template_button_click_0_listener() {
      const f_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r43).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.download(ctx_r1.selectedHistory, f_r44));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](1, "i", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const f_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"](" ", f_r44.filename);
  }
}
function ScheduleComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 91)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "p", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "p", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](11, ScheduleComponent_div_31_p_11_Template, 2, 1, "p", 32)(12, ScheduleComponent_div_31_button_12_Template, 3, 1, "button", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate3"]("", ctx_r1.formatDate(ctx_r1.selectedHistory.performedAt, ctx_r1.selectedHistory.timezone), " \u00B7 ", ctx_r1.cost(ctx_r1.selectedHistory), " ", ctx_r1.selectedHistory.currency);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"]("Vendor: ", (ctx_r1.selectedHistory.providerSnapshot == null ? null : ctx_r1.selectedHistory.providerSnapshot.name) || "No vendor");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r1.selectedHistory.nextRecommendedDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx_r1.selectedHistory.evidence);
  }
}
class ScheduleComponent {
  constructor() {
    this.api = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_schedule_service__WEBPACK_IMPORTED_MODULE_13__.ScheduleService);
    this.changeDetector = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_12__.AccessContextService);
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute);
    this.subscriptions = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subscription();
    this.tab = 'schedules';
    this.view = 'list';
    this.contexts = [];
    this.responsibles = [];
    this.filterResponsibles = [];
    this.documents = [];
    this.documentIds = [];
    this.schedules = [];
    this.tasks = [];
    this.history = [];
    this.vendors = [];
    this.total = 0;
    this.page = 1;
    this.limit = 20;
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.message = '';
    this.selectedLocation = '';
    this.statusFilter = '';
    this.from = '';
    this.to = '';
    this.responsibleFilter = '';
    this.providerFilter = '';
    this.editor = 'schedule';
    this.dialog = false;
    this.editingId = '';
    this.task = null;
    this.selectedHistory = null;
    this.draft = this.emptyDraft();
    this.vendorDraft = {
      name: '',
      contact: '',
      notes: '',
      isActive: true
    };
    this.completion = {
      performedAt: this.localDate(new Date()),
      providerId: '',
      cost: '0',
      currency: 'DOP',
      description: '',
      notes: '',
      nextRecommendedDate: '',
      documentIds: ''
    };
    this.rescheduleDate = '';
    this.files = [];
    this.calendar = {
      plugins: [_fullcalendar_daygrid__WEBPACK_IMPORTED_MODULE_10__["default"], _fullcalendar_timegrid__WEBPACK_IMPORTED_MODULE_11__["default"]],
      initialView: 'dayGridMonth',
      locale: 'en',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      datesSet: info => {
        this.calendarFrom = info.startStr;
        this.calendarTo = info.endStr;
        if (this.view === 'calendar') this.loadCalendar();
      },
      eventClick: info => {
        const row = this.calendarTasks.find(t => t._id === info.event.id);
        if (row) this.openComplete(row);
      }
    };
    this.calendarFrom = '';
    this.calendarTo = '';
    this.calendarTasks = [];
    this.listRequest = null;
    this.responsibleRequest = null;
  }
  ngOnInit() {
    this.subscriptions.add(this.api.get('schedules/contexts').subscribe({
      next: contexts => {
        this.contexts = contexts;
        this.load();
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    }));
    this.loadVendors();
    this.subscriptions.add(this.route.queryParams.subscribe(params => {
      if (params['taskId']) {
        this.tab = 'tasks';
        this.subscriptions.add(this.api.get(`tasks/${params['taskId']}`).subscribe({
          next: t => {
            if (t.isOpen) this.openComplete(t);else {
              this.message = 'This task is already closed. Check the history.';
              this.tab = 'history';
            }
            this.load();
          },
          error: e => this.report(e)
        }));
      }
    }));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.listRequest?.unsubscribe();
    this.responsibleRequest?.unsubscribe();
  }
  has(permission) {
    return this.access.hasPermission(permission);
  }
  selectTab(tab) {
    this.tab = tab;
    this.page = 1;
    this.view = 'list';
    this.load();
  }
  resetFilters() {
    this.page = 1;
    this.load();
  }
  locationFilterChanged() {
    this.responsibleFilter = '';
    this.filterResponsibles = [];
    this.resetFilters();
    const context = this.contexts[Number(this.selectedLocation)];
    if (this.selectedLocation === '' || !context) return;
    const query = {};
    for (const key of ['condominiumId', 'unitId', 'residenceId']) if (context[key]) query[key] = context[key];
    this.subscriptions.add(this.api.get('schedules/responsibles', query).subscribe({
      next: r => {
        this.filterResponsibles = r;
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    }));
  }
  query() {
    const query = {
      page: String(this.page),
      limit: String(this.limit)
    };
    const context = this.contexts[Number(this.selectedLocation)];
    if (this.selectedLocation !== '' && context) for (const key of ['condominiumId', 'unitId', 'residenceId']) if (context[key]) query[key] = context[key];
    if (this.tab === 'tasks') {
      query['source'] = 'schedule';
      if (this.statusFilter) query['status'] = this.statusFilter;
    }
    if (this.tab !== 'vendors') {
      if (this.from) query['from'] = new Date(`${this.from}T00:00`).toISOString();
      if (this.to) query['to'] = new Date(`${this.to}T23:59:59`).toISOString();
      if (this.responsibleFilter && this.tab !== 'history') query['assignedUserId'] = this.responsibleFilter;
      if (this.providerFilter && this.tab === 'history') query['providerId'] = this.providerFilter;
    }
    return query;
  }
  load() {
    if (this.view === 'calendar') {
      this.loadCalendar();
      return;
    }
    this.listRequest?.unsubscribe();
    this.loading = true;
    this.error = '';
    const path = {
      schedules: 'schedules',
      tasks: 'tasks',
      history: 'maintenance/history',
      vendors: 'maintenance/vendors'
    }[this.tab];
    this.listRequest = this.api.get(path, this.query()).subscribe({
      next: r => {
        this.total = r.total;
        if (this.tab === 'schedules') this.schedules = r.docs;else if (this.tab === 'tasks') this.tasks = r.docs;else if (this.tab === 'history') this.history = r.docs;else this.vendors = r.docs;
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    });
  }
  setView(view) {
    this.view = view;
    if (view === 'list') this.load();
  }
  loadCalendar() {
    if (!this.calendarFrom) return;
    this.listRequest?.unsubscribe();
    this.loading = true;
    const query = {
      ...this.query(),
      source: 'schedule',
      page: '1',
      limit: '100',
      from: this.calendarFrom,
      to: this.calendarTo
    };
    this.listRequest = this.api.get('tasks', query).subscribe({
      next: r => {
        if (r.total > 100) {
          const requests = Array.from({
            length: Math.ceil(r.total / 100) - 1
          }, (_, i) => this.api.get('tasks', {
            ...query,
            page: String(i + 2)
          }));
          this.subscriptions.add((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.forkJoin)(requests).subscribe({
            next: pages => this.setCalendar([...r.docs, ...pages.flatMap(p => p.docs)]),
            error: e => this.report(e)
          }));
        } else this.setCalendar(r.docs);
      },
      error: e => this.report(e)
    });
  }
  setCalendar(tasks) {
    this.calendarTasks = tasks;
    this.loading = false;
    this.calendar = {
      ...this.calendar,
      events: tasks.map(t => ({
        id: t._id,
        title: `${t.name} · ${this.statusLabel(t.status)}`,
        start: t.dueDate,
        backgroundColor: t.status === 'OVERDUE' ? '#b54738' : t.status === 'COMPLETED' ? '#287a56' : '#326c9b'
      }))
    };
    this.changeDetector.markForCheck();
  }
  loadVendors() {
    if (!this.has('vendors.read')) return;
    this.subscriptions.add(this.api.get('maintenance/vendors', {
      limit: '100'
    }).subscribe({
      next: r => {
        this.vendors = r.docs;
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    }));
  }
  emptyDraft() {
    return {
      name: '',
      description: '',
      equipmentName: '',
      frequencyType: 'MONTH',
      frequencyValue: 4,
      startDate: this.localDate(new Date()),
      timezone: 'America/Santo_Domingo',
      remindBeforeDays: 7,
      location: '',
      responsible: ''
    };
  }
  openSchedule(row) {
    this.error = '';
    this.editingId = row?._id || '';
    this.editor = 'schedule';
    this.draft = this.emptyDraft();
    if (row) this.draft = {
      name: row.name,
      description: row.description,
      equipmentName: row.equipmentName,
      frequencyType: row.frequencyType,
      frequencyValue: row.frequencyValue,
      startDate: this.localDate(new Date(row.startDate)),
      timezone: row.timezone,
      remindBeforeDays: row.remindBeforeDays,
      location: String(this.contexts.findIndex(c => ['condominiumId', 'unitId', 'residenceId'].every(k => String(c[k] || '') === String(row[k] || '')))),
      responsible: `${row.assignedRole}:${row.assignedUserId}`
    };else if (this.contexts.length === 1) this.draft.location = '0';
    this.dialog = true;
    if (this.draft.location !== '') this.loadResponsibles();
  }
  loadResponsibles() {
    const context = this.contexts[Number(this.draft.location)];
    if (!context) return;
    this.responsibles = [];
    this.responsibleRequest?.unsubscribe();
    const query = {};
    for (const key of ['condominiumId', 'unitId', 'residenceId']) if (context[key]) query[key] = context[key];
    this.responsibleRequest = this.api.get('schedules/responsibles', query).subscribe({
      next: r => {
        this.responsibles = r;
        if (!this.editingId) this.draft.responsible = '';
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    });
  }
  saveSchedule() {
    if (!this.draft.name.trim() || this.draft.location === '') {
      this.error = 'Select a location and enter a name.';
      return;
    }
    const {
      location,
      responsible,
      startDate,
      ...fields
    } = this.draft;
    const [assignedRole, assignedUserId] = responsible.split(':');
    const body = {
      ...fields,
      ...(responsible ? {
        assignedRole,
        assignedUserId
      } : {
        assignedRole: null,
        assignedUserId: null
      }),
      ...(!this.editingId ? {
        ...this.contexts[Number(location)],
        startDate: new Date(startDate).toISOString()
      } : {})
    };
    this.save(this.editingId ? this.api.patch(`schedules/${this.editingId}`, body) : this.api.post('schedules', body));
  }
  toggle(row) {
    this.save(this.api.post(`schedules/${row._id}/${row.isActive ? 'pause' : 'resume'}`, {}));
  }
  openComplete(task) {
    if (!task.isOpen || !this.has('maintenance.update')) {
      this.message = 'View this task and its history in the list.';
      return;
    }
    this.task = task;
    this.editor = 'complete';
    this.files = [];
    this.error = '';
    this.documentIds = [];
    this.documents = [];
    if (this.has('documents.read') && task.condominiumId) {
      const query = {
        condominiumId: task.condominiumId
      };
      if (task.unitId) query['unitId'] = task.unitId;
      this.subscriptions.add(this.api.get('schedules/documents', query).subscribe({
        next: r => {
          this.documents = r;
          this.changeDetector.markForCheck();
        },
        error: e => this.report(e)
      }));
    }
    this.completion = {
      performedAt: this.localDate(new Date()),
      providerId: '',
      cost: '0',
      currency: 'DOP',
      description: '',
      notes: '',
      nextRecommendedDate: '',
      documentIds: ''
    };
    this.loadVendors();
    this.dialog = true;
  }
  selectFiles(event) {
    const input = event.target;
    const files = Array.from(input.files || []);
    if (files.length > 5 || files.some(f => f.size > 10 * 1024 * 1024)) {
      this.error = 'Up to five files, 10 MB each.';
      input.value = '';
      this.files = [];
    } else this.files = files;
  }
  complete() {
    if (!this.task) return;
    const body = new FormData();
    for (const [key, value] of Object.entries(this.completion)) {
      if (!value && ['providerId', 'nextRecommendedDate'].includes(key)) continue;
      const field = key === 'performedAt' || key === 'nextRecommendedDate' ? new Date(value).toISOString() : key === 'documentIds' ? JSON.stringify(this.documentIds) : value;
      body.append(key, field);
    }
    for (const file of this.files) body.append('evidence', file);
    this.save(this.api.post(`tasks/${this.task._id}/complete`, body));
  }
  changeStatus(task, status) {
    this.save(this.api.patch(`tasks/${task._id}/status`, {
      status
    }));
  }
  openReschedule(task) {
    this.task = task;
    this.editor = 'reschedule';
    this.rescheduleDate = this.localDate(new Date(task.dueDate));
    this.error = '';
    this.dialog = true;
  }
  reschedule() {
    if (this.task) this.save(this.api.post(`tasks/${this.task._id}/reschedule`, {
      dueDate: new Date(this.rescheduleDate).toISOString()
    }));
  }
  openVendor(row) {
    this.editingId = row?._id || '';
    this.vendorDraft = row ? {
      name: row.name,
      contact: row.contact,
      notes: row.notes,
      isActive: row.isActive
    } : {
      name: '',
      contact: '',
      notes: '',
      isActive: true
    };
    this.editor = 'vendor';
    this.error = '';
    this.dialog = true;
  }
  saveVendor() {
    this.save(this.editingId ? this.api.patch(`maintenance/vendors/${this.editingId}`, this.vendorDraft) : this.api.post('maintenance/vendors', this.vendorDraft));
  }
  openHistory(row) {
    this.selectedHistory = row;
    this.editor = 'history';
    this.error = '';
    this.dialog = true;
  }
  download(record, file) {
    this.subscriptions.add(this.api.download(record._id, file).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: e => this.report(e)
    }));
  }
  save(request) {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this.message = '';
    this.subscriptions.add(request.subscribe({
      next: () => {
        this.saving = false;
        this.dialog = false;
        this.message = 'Changes saved.';
        this.load();
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    }));
  }
  report(error) {
    this.loading = false;
    this.saving = false;
    this.error = error.error?.error?.message || 'Unable to complete the operation. Please try again.';
    this.changeDetector.markForCheck();
  }
  localDate(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  formatDate(value, timezone = 'America/Santo_Domingo') {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone
    }).format(new Date(value));
  }
  cost(row) {
    return typeof row.cost === 'string' ? row.cost : row.cost?.$numberDecimal || '0';
  }
  locationLabel(row) {
    return this.contexts.find(c => ['condominiumId', 'unitId', 'residenceId'].every(k => String(c[k] || '') === String(row[k] || '')))?.label || 'Location';
  }
  statusLabel(status) {
    const labels = {
      SCHEDULED: 'Scheduled',
      PENDING: 'Pending',
      IN_PROGRESS: 'In progress',
      OVERDUE: 'Overdue',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      SKIPPED: 'Skipped'
    };
    return labels[status] || status;
  }
  frequencyLabel(type) {
    const labels = {
      ONCE: 'Once',
      DAY: 'day(s)',
      WEEK: 'week(s)',
      MONTH: 'month(s)',
      YEAR: 'year(s)'
    };
    return labels[type] || type;
  }
  static {
    this.ɵfac = function ScheduleComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ScheduleComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineComponent"]({
      type: ScheduleComponent,
      selectors: [["app-schedule"]],
      decls: 32,
      vars: 30,
      consts: [["scheduleForm", "ngForm"], ["completeForm", "ngForm"], ["rescheduleForm", "ngForm"], ["vendorForm", "ngForm"], [1, "schedule-page"], [1, "page-header"], [1, "page-kicker"], ["styleClass", "schedule-primary-action", "label", "Schedule maintenance", "ariaLabel", "Schedule maintenance", "icon", "pi pi-plus", 3, "onClick", 4, "ngIf"], ["styleClass", "schedule-primary-action", "label", "Add vendor", "ariaLabel", "Add vendor", "icon", "pi pi-plus", 3, "onClick", 4, "ngIf"], ["role", "status", "class", "message", 4, "ngIf"], ["role", "alert", "class", "error", 4, "ngIf"], ["aria-label", "Maintenance sections", 1, "tabs"], [3, "click"], [3, "selected", "click", 4, "ngIf"], ["class", "filters", 4, "ngIf"], ["class", "view-toggle", 4, "ngIf"], ["role", "status", 4, "ngIf"], ["class", "calendar", 4, "ngIf"], ["class", "table-scroll", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], [3, "visibleChange", "visible", "modal", "closable", "closeOnEscape", "header"], ["class", "error", "role", "alert", 4, "ngIf"], ["class", "editor", 3, "ngSubmit", 4, "ngIf"], ["class", "editor", 4, "ngIf"], ["styleClass", "schedule-primary-action", "label", "Schedule maintenance", "ariaLabel", "Schedule maintenance", "icon", "pi pi-plus", 3, "onClick"], ["styleClass", "schedule-primary-action", "label", "Add vendor", "ariaLabel", "Add vendor", "icon", "pi pi-plus", 3, "onClick"], ["role", "status", 1, "message"], ["role", "alert", 1, "error"], [1, "filters"], [3, "ngModelChange", "change", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["type", "date", 3, "ngModelChange", "change", "ngModel"], [3, "value"], [3, "ngModelChange", "change", "ngModel", "disabled"], [1, "view-toggle"], ["role", "status"], [1, "calendar"], [3, "options"], [1, "table-scroll"], ["class", "empty", 4, "ngIf"], [1, "sr-only"], [4, "ngFor", "ngForOf"], ["class", "error", 4, "ngIf"], [1, "badge"], [1, "actions"], [3, "click", 4, "ngIf"], [3, "disabled", "click", 4, "ngIf"], [1, "error"], [3, "click", "disabled"], ["class", "actions", 4, "ngIf"], [1, "empty"], ["aria-hidden", "true", 1, "pi", "pi-calendar"], [1, "pagination"], [1, "editor", 3, "ngSubmit"], ["name", "name", "required", "", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["name", "location", "required", "", 3, "ngModelChange", "change", "ngModel", "disabled"], ["name", "equipment", "maxlength", "200", "placeholder", "Water tank, generator, elevator\u2026", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["name", "frequencyType", 3, "ngModelChange", "ngModel"], ["value", "ONCE"], ["value", "DAY"], ["value", "WEEK"], ["value", "MONTH"], ["value", "YEAR"], ["name", "frequencyValue", "type", "number", "required", "", "min", "1", "max", "10000", "step", "1", 3, "ngModelChange", "ngModel"], ["name", "timezone", "required", "", 3, "ngModelChange", "ngModel"], ["name", "remindBeforeDays", "type", "number", "min", "0", "max", "365", "step", "1", "required", "", 3, "ngModelChange", "ngModel"], ["name", "responsible", 3, "ngModelChange", "ngModel"], ["name", "description", "maxlength", "5000", "rows", "3", 3, "ngModelChange", "ngModel"], [1, "hint"], ["styleClass", "schedule-primary-action", "type", "submit", "label", "Save schedule", 3, "disabled", "loading"], ["name", "startDate", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["name", "performedAt", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["name", "providerId", 3, "ngModelChange", "ngModel"], ["name", "cost", "required", "", "pattern", "[0-9]{1,12}(\\.[0-9]{1,2})?", "inputmode", "decimal", 3, "ngModelChange", "ngModel"], ["name", "currency", "required", "", "pattern", "[A-Z]{3}", "maxlength", "3", 3, "ngModelChange", "ngModel"], ["name", "notes", "maxlength", "5000", "rows", "2", 3, "ngModelChange", "ngModel"], ["name", "nextRecommendedDate", "type", "datetime-local", 3, "ngModelChange", "ngModel"], ["type", "file", "multiple", "", "accept", "application/pdf,image/jpeg,image/png,image/webp", 3, "change"], ["styleClass", "schedule-primary-action", "type", "submit", "label", "Complete and save record", 3, "disabled", "loading"], [3, "value", 4, "ngIf"], ["name", "documentIds", "multiple", "", 3, "ngModelChange", "ngModel"], ["name", "dueDate", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["styleClass", "schedule-primary-action", "type", "submit", "label", "Reschedule", 3, "disabled", "loading"], ["name", "contact", "maxlength", "300", 3, "ngModelChange", "ngModel"], ["name", "notes", "maxlength", "2000", "rows", "3", 3, "ngModelChange", "ngModel"], [1, "checkbox"], ["name", "isActive", "type", "checkbox", 3, "ngModelChange", "ngModel"], ["styleClass", "schedule-primary-action", "type", "submit", "label", "Save vendor", 3, "disabled", "loading"], [1, "editor"], [1, "preserve"], [3, "click", 4, "ngFor", "ngForOf"], ["aria-hidden", "true", 1, "pi", "pi-download"]],
      template: function ScheduleComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "section", 4)(1, "header", 5)(2, "div")(3, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4, "Schedules");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6, "Maintenance");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8, "Schedule work, coordinate its completion, and keep every detail.");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](9, ScheduleComponent_p_button_9_Template, 1, 0, "p-button", 7)(10, ScheduleComponent_p_button_10_Template, 1, 0, "p-button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](11, ScheduleComponent_p_11_Template, 2, 1, "p", 9)(12, ScheduleComponent_p_12_Template, 2, 1, "p", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "nav", 11)(14, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function ScheduleComponent_Template_button_click_14_listener() {
            return ctx.selectTab("schedules");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](15, "Schedules");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](16, ScheduleComponent_button_16_Template, 2, 3, "button", 13)(17, ScheduleComponent_button_17_Template, 2, 3, "button", 13)(18, ScheduleComponent_button_18_Template, 2, 3, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](19, ScheduleComponent_div_19_Template, 16, 7, "div", 14)(20, ScheduleComponent_div_20_Template, 5, 4, "div", 15)(21, ScheduleComponent_p_21_Template, 2, 0, "p", 16)(22, ScheduleComponent_div_22_Template, 2, 1, "div", 17)(23, ScheduleComponent_div_23_Template, 6, 6, "div", 18)(24, ScheduleComponent_footer_24_Template, 7, 4, "footer", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](25, "p-dialog", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayListener"]("visibleChange", function ScheduleComponent_Template_p_dialog_visibleChange_25_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayBindingSet"](ctx.dialog, $event) || (ctx.dialog = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](26, ScheduleComponent_p_26_Template, 2, 1, "p", 21)(27, ScheduleComponent_form_27_Template, 51, 15, "form", 22)(28, ScheduleComponent_form_28_Template, 39, 13, "form", 22)(29, ScheduleComponent_form_29_Template, 8, 4, "form", 22)(30, ScheduleComponent_form_30_Template, 15, 6, "form", 22)(31, ScheduleComponent_div_31_Template, 13, 9, "div", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.tab === "schedules" && ctx.has("schedules.create"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.tab === "vendors" && ctx.has("vendors.create"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.message);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.error && !ctx.dialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("selected", ctx.tab === "schedules");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵattribute"]("aria-current", ctx.tab === "schedules" ? "page" : null);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.has("maintenance.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.has("maintenance.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.has("vendors.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.tab !== "vendors");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.tab === "tasks");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.tab === "tasks" && ctx.view === "calendar");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.view === "list");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.view === "list");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](29, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtwoWayProperty"]("visible", ctx.dialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("modal", true)("closable", !ctx.saving)("closeOnEscape", !ctx.saving)("header", ctx.editor === "schedule" ? "Schedule maintenance" : ctx.editor === "complete" ? "Complete maintenance" : ctx.editor === "reschedule" ? "Reschedule task" : ctx.editor === "vendor" ? "Vendor" : "Maintenance record");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.editor === "schedule");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.editor === "complete");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.editor === "reschedule");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.editor === "vendor");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.editor === "history" && ctx.selectedHistory);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectMultipleControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_7__.ButtonModule, primeng_button__WEBPACK_IMPORTED_MODULE_7__.Button, primeng_dialog__WEBPACK_IMPORTED_MODULE_8__.DialogModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_8__.Dialog, _fullcalendar_angular__WEBPACK_IMPORTED_MODULE_9__.FullCalendarModule, _fullcalendar_angular__WEBPACK_IMPORTED_MODULE_9__.FullCalendarComponent],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  color: var(--app-dark-text, #183153);\n  --schedule-ink: var(--app-dark-text, #183153);\n  --schedule-muted: var(--app-dark-muted, #66758d);\n  --schedule-line: var(--app-dark-border, #dce5ee);\n  --schedule-primary: var(--app-dark-accent, #176b87);\n  --schedule-surface: var(--app-dark-surface, #fff);\n}\n\n.schedule-page[_ngcontent-%COMP%] {\n  background: var(--schedule-surface);\n  border: 1px solid var(--schedule-line);\n  border-radius: 18px;\n  padding: 1.6rem;\n  box-shadow: none;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1.25rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.5rem;\n}\n\n.page-kicker[_ngcontent-%COMP%] {\n  color: var(--schedule-primary);\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\nh1[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 0.4rem;\n  color: var(--schedule-ink);\n  font-size: clamp(1.65rem, 3vw, 2.35rem);\n  line-height: 1.1;\n  letter-spacing: -0.035em;\n}\n\nh2[_ngcontent-%COMP%] {\n  color: var(--schedule-ink);\n  font-size: 1.3rem;\n}\n\np[_ngcontent-%COMP%] {\n  line-height: 1.5;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .hint[_ngcontent-%COMP%], small[_ngcontent-%COMP%] {\n  color: var(--schedule-muted);\n}\n\n[_nghost-%COMP%]     .schedule-primary-action {\n  min-height: 44px;\n  border-radius: 10px;\n  background: var(--schedule-primary);\n  border-color: var(--schedule-primary);\n  color: var(--app-dark-on-accent, #fff);\n  font-weight: 700;\n  box-shadow: none;\n}\n\n[_nghost-%COMP%]     .schedule-primary-action:not(:disabled):hover {\n  background: var(--app-dark-accent-hover, #125b73);\n  border-color: var(--app-dark-accent-hover, #125b73);\n}\n\n.tabs[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.2rem;\n  flex-wrap: wrap;\n  padding: 0.25rem;\n  margin-bottom: 1.2rem;\n  border: 1px solid var(--schedule-line);\n  border-radius: 12px;\n  width: fit-content;\n  max-width: 100%;\n}\n\nbutton[_ngcontent-%COMP%] {\n  font: inherit;\n  font-weight: 650;\n  color: var(--schedule-primary);\n  background: var(--schedule-surface);\n  border: 1px solid var(--schedule-line);\n  min-height: 44px;\n  padding: 0.6rem 0.85rem;\n  border-radius: 10px;\n  cursor: pointer;\n}\n\nbutton[_ngcontent-%COMP%]:hover {\n  background: var(--app-dark-info-bg, #f1f5f8);\n}\n\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  border: 0;\n  border-radius: 8px;\n  font-weight: 700;\n  color: var(--schedule-muted);\n  background: transparent;\n}\n\n.tabs[_ngcontent-%COMP%]   button.selected[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%]   button.selected[_ngcontent-%COMP%] {\n  color: var(--app-dark-accent, #105d76);\n  background: var(--app-dark-info-bg, #e8f2f5);\n}\n\n.tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, .view-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: var(--app-dark-info-bg, #f1f5f8);\n}\n\nbutton[_ngcontent-%COMP%]:focus-visible, input[_ngcontent-%COMP%]:focus-visible, select[_ngcontent-%COMP%]:focus-visible, textarea[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--schedule-primary);\n  outline-offset: 2px;\n}\n\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: end;\n  gap: 0.75rem;\n  margin-bottom: 1.2rem;\n}\n\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  color: var(--schedule-ink);\n  font-size: 0.84rem;\n  font-weight: 650;\n}\n\ninput[_ngcontent-%COMP%], select[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%] {\n  font: inherit;\n  font-weight: 400;\n  color: var(--schedule-ink);\n  background: var(--schedule-surface);\n  border: 1px solid var(--schedule-line);\n  border-radius: 10px;\n  padding: 0.65rem;\n  min-height: 44px;\n  min-width: 0;\n  width: 100%;\n}\n\ninput[_ngcontent-%COMP%]::placeholder, textarea[_ngcontent-%COMP%]::placeholder {\n  color: var(--schedule-muted);\n  opacity: 1;\n}\n\ninput[_ngcontent-%COMP%]:disabled, select[_ngcontent-%COMP%]:disabled {\n  background: var(--app-dark-surface-muted, #f5f8fb);\n  color: var(--schedule-muted);\n}\n\n.filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  flex: 1 1 145px;\n  max-width: 300px;\n  color: var(--schedule-muted);\n  font-size: 0.76rem;\n  font-weight: 500;\n}\n\n.table-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--schedule-line);\n  border-radius: 16px;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 600px;\n  font-size: 0.9rem;\n}\n\nth[_ngcontent-%COMP%] {\n  text-align: left;\n  color: var(--schedule-muted);\n  background: var(--app-dark-info-bg, #f5f8fb);\n  font-size: 0.8rem;\n  font-weight: 650;\n}\n\ntd[_ngcontent-%COMP%], th[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--schedule-line);\n  padding: 0.9rem 1rem;\n  vertical-align: middle;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: 0;\n}\n\ntd[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], small[_ngcontent-%COMP%] {\n  display: block;\n}\n\ntd[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 650;\n}\n\nsmall[_ngcontent-%COMP%] {\n  margin-top: 0.3rem;\n  font-size: 0.76rem;\n  font-weight: 400;\n  line-height: 1.45;\n}\n\n.actions[_ngcontent-%COMP%] {\n  min-width: 170px;\n}\n\n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin: 0 0.35rem 0.35rem 0;\n  font-size: 0.8rem;\n}\n\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  color: var(--schedule-muted);\n  background: var(--app-dark-info-bg, #e8f2f5);\n  border-radius: 999px;\n  padding: 0.3rem 0.6rem;\n  font-size: 0.75rem;\n  font-weight: 750;\n  white-space: nowrap;\n}\n\n.badge.active[_ngcontent-%COMP%] {\n  color: var(--app-dark-success-text, #08785d);\n  background: var(--app-dark-success-bg, #e9f8f2);\n}\n\n.badge.overdue[_ngcontent-%COMP%] {\n  color: var(--app-dark-danger-text, #c44732);\n  background: var(--app-dark-danger-bg, #fff0ed);\n}\n\n.error[_ngcontent-%COMP%] {\n  color: var(--app-dark-danger-text, #b42318);\n  background: var(--app-dark-danger-bg, #fff5f4);\n  padding: 0.7rem;\n  border: 1px solid currentColor;\n  border-radius: 10px;\n  overflow-wrap: anywhere;\n}\n\n.message[_ngcontent-%COMP%] {\n  color: var(--schedule-primary);\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 2rem;\n  text-align: center;\n  color: var(--schedule-muted);\n}\n\n.empty[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  color: var(--schedule-primary);\n}\n\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  padding-top: 1rem;\n  color: var(--schedule-muted);\n  font-size: 0.85rem;\n}\n\n.pagination[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n}\n\n.pagination[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-dark-info-bg, #e8f2f5);\n}\n\n.editor[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  color: var(--schedule-ink);\n}\n\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n\n.checkbox[_ngcontent-%COMP%] {\n  flex-direction: row;\n  align-items: center;\n}\n\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: auto;\n  min-height: auto;\n  accent-color: var(--schedule-primary);\n}\n\n.preserve[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n}\n\n.calendar[_ngcontent-%COMP%] {\n  --fc-border-color: var(--schedule-line);\n  --fc-page-bg-color: var(--schedule-surface);\n  --fc-neutral-bg-color: var(--app-dark-info-bg, #f5f8fb);\n  --fc-today-bg-color: var(--app-dark-info-bg, #e8f2f5);\n  --fc-button-bg-color: var(--schedule-primary);\n  --fc-button-border-color: var(--schedule-primary);\n  --fc-button-text-color: var(--app-dark-on-accent, #fff);\n  --fc-button-hover-bg-color: var(--app-dark-accent-hover, #125b73);\n  --fc-button-hover-border-color: var(--app-dark-accent-hover, #125b73);\n  --fc-button-active-bg-color: var(--app-dark-accent-hover, #125b73);\n  --fc-button-active-border-color: var(--app-dark-accent-hover, #125b73);\n  --fc-event-bg-color: var(--schedule-primary);\n  --fc-event-border-color: var(--schedule-primary);\n  --fc-event-text-color: var(--app-dark-on-accent, #fff);\n}\n\n[_nghost-%COMP%]     .calendar .fc-toolbar-title {\n  color: var(--schedule-ink);\n  font-size: 1.3rem;\n}\n\n[_nghost-%COMP%]     .calendar .fc-button {\n  border-radius: 10px;\n  min-height: 44px;\n}\n\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n}\n\n@media (max-width: 680px) {\n  .schedule-page[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  [_nghost-%COMP%]     .page-header .schedule-primary-action {\n    width: 100%;\n  }\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .tabs[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  .pagination[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  [_nghost-%COMP%]     .calendar .fc-header-toolbar {\n    flex-direction: column;\n    gap: 0.6rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0UsY0FBQTtFQUFnQixZQUFBO0VBQWMsb0NBQUE7RUFDOUIsNkNBQUE7RUFDQSxnREFBQTtFQUNBLGdEQUFBO0VBQ0EsbURBQUE7RUFDQSxpREFBQTtBQUVGOztBQUFBO0VBQWlCLG1DQUFBO0VBQXFDLHNDQUFBO0VBQXdDLG1CQUFBO0VBQXFCLGVBQUE7RUFBaUIsZ0JBQUE7QUFRcEk7O0FBUEE7RUFBZSxhQUFBO0VBQWUsbUJBQUE7RUFBcUIsOEJBQUE7RUFBZ0MsWUFBQTtFQUFjLGVBQUE7RUFBaUIscUJBQUE7QUFnQmxIOztBQWZBO0VBQWUsOEJBQUE7RUFBZ0Msa0JBQUE7RUFBbUIsZ0JBQUE7RUFBa0IscUJBQUE7RUFBc0IseUJBQUE7QUF1QjFHOztBQXRCQTtFQUFLLHVCQUFBO0VBQXVCLDBCQUFBO0VBQTRCLHVDQUFBO0VBQXlDLGdCQUFBO0VBQWtCLHdCQUFBO0FBOEJuSDs7QUE3QkE7RUFBSywwQkFBQTtFQUE0QixpQkFBQTtBQWtDakM7O0FBakNBO0VBQUksZ0JBQUE7QUFxQ0o7O0FBcENBO0VBQWlCLFNBQUE7QUF3Q2pCOztBQXZDQTtFQUErQiw0QkFBQTtBQTJDL0I7O0FBMUNBO0VBQTJDLGdCQUFBO0VBQWtCLG1CQUFBO0VBQXFCLG1DQUFBO0VBQXFDLHFDQUFBO0VBQXVDLHNDQUFBO0VBQXdDLGdCQUFBO0VBQWtCLGdCQUFBO0FBb0R4Tjs7QUFuREE7RUFBZ0UsaURBQUE7RUFBbUQsbURBQUE7QUF3RG5IOztBQXZEQTtFQUFzQixhQUFBO0VBQWUsV0FBQTtFQUFZLGVBQUE7RUFBaUIsZ0JBQUE7RUFBaUIscUJBQUE7RUFBdUIsc0NBQUE7RUFBd0MsbUJBQUE7RUFBcUIsa0JBQUE7RUFBb0IsZUFBQTtBQW1FM0w7O0FBbEVBO0VBQVMsYUFBQTtFQUFlLGdCQUFBO0VBQWtCLDhCQUFBO0VBQWdDLG1DQUFBO0VBQXFDLHNDQUFBO0VBQXdDLGdCQUFBO0VBQWtCLHVCQUFBO0VBQXVCLG1CQUFBO0VBQXFCLGVBQUE7QUE4RXJOOztBQTdFQTtFQUFlLDRDQUFBO0FBaUZmOztBQWhGQTtFQUFrQixZQUFBO0VBQWEsZUFBQTtBQXFGL0I7O0FBcEZBO0VBQW9DLG9CQUFBO0VBQXNCLG1CQUFBO0VBQXFCLHVCQUFBO0VBQXlCLFdBQUE7RUFBWSxTQUFBO0VBQVcsa0JBQUE7RUFBb0IsZ0JBQUE7RUFBa0IsNEJBQUE7RUFBOEIsdUJBQUE7QUFnR25NOztBQS9GQTtFQUFzRCxzQ0FBQTtFQUF3Qyw0Q0FBQTtBQW9HOUY7O0FBbkdBO0VBQWdELDRDQUFBO0FBdUdoRDs7QUF0R0E7RUFBMEYsMENBQUE7RUFBNEMsbUJBQUE7QUEyR3RJOztBQTFHQTtFQUFXLGFBQUE7RUFBZSxlQUFBO0VBQWlCLGdCQUFBO0VBQWtCLFlBQUE7RUFBYSxxQkFBQTtBQWtIMUU7O0FBakhBO0VBQVEsYUFBQTtFQUFlLHNCQUFBO0VBQXdCLFdBQUE7RUFBWSwwQkFBQTtFQUE0QixrQkFBQTtFQUFtQixnQkFBQTtBQTBIMUc7O0FBekhBO0VBQTBCLGFBQUE7RUFBZSxnQkFBQTtFQUFrQiwwQkFBQTtFQUE0QixtQ0FBQTtFQUFxQyxzQ0FBQTtFQUF3QyxtQkFBQTtFQUFxQixnQkFBQTtFQUFpQixnQkFBQTtFQUFrQixZQUFBO0VBQWMsV0FBQTtBQXNJMU87O0FBcklBO0VBQTRDLDRCQUFBO0VBQThCLFVBQUE7QUEwSTFFOztBQXpJQTtFQUFrQyxrREFBQTtFQUFvRCw0QkFBQTtBQThJdEY7O0FBN0lBO0VBQWlCLGVBQUE7RUFBaUIsZ0JBQUE7RUFBa0IsNEJBQUE7RUFBOEIsa0JBQUE7RUFBbUIsZ0JBQUE7QUFxSnJHOztBQXBKQTtFQUFnQixnQkFBQTtFQUFrQixzQ0FBQTtFQUF3QyxtQkFBQTtBQTBKMUU7O0FBekpBO0VBQVEsV0FBQTtFQUFhLHlCQUFBO0VBQTJCLGdCQUFBO0VBQWtCLGlCQUFBO0FBZ0tsRTs7QUEvSkE7RUFBSyxnQkFBQTtFQUFrQiw0QkFBQTtFQUE4Qiw0Q0FBQTtFQUE4QyxpQkFBQTtFQUFrQixnQkFBQTtBQXVLckg7O0FBdEtBO0VBQVMsNkNBQUE7RUFBK0Msb0JBQUE7RUFBcUIsc0JBQUE7QUE0SzdFOztBQTNLQTtFQUF5QixnQkFBQTtBQStLekI7O0FBOUtBO0VBQW1CLGNBQUE7QUFrTG5COztBQWpMQTtFQUFZLGdCQUFBO0FBcUxaOztBQXBMQTtFQUFRLGtCQUFBO0VBQW1CLGtCQUFBO0VBQW1CLGdCQUFBO0VBQWtCLGlCQUFBO0FBMkxoRTs7QUExTEE7RUFBVyxnQkFBQTtBQThMWDs7QUE3TEE7RUFBa0IsMkJBQUE7RUFBMkIsaUJBQUE7QUFrTTdDOztBQWpNQTtFQUFTLHFCQUFBO0VBQXVCLDRCQUFBO0VBQThCLDRDQUFBO0VBQThDLG9CQUFBO0VBQXNCLHNCQUFBO0VBQXNCLGtCQUFBO0VBQW1CLGdCQUFBO0VBQWtCLG1CQUFBO0FBNE03TDs7QUEzTUE7RUFBZ0IsNENBQUE7RUFBOEMsK0NBQUE7QUFnTjlEOztBQS9NQTtFQUFpQiwyQ0FBQTtFQUE2Qyw4Q0FBQTtBQW9OOUQ7O0FBbk5BO0VBQVMsMkNBQUE7RUFBNkMsOENBQUE7RUFBZ0QsZUFBQTtFQUFnQiw4QkFBQTtFQUFnQyxtQkFBQTtFQUFxQix1QkFBQTtBQTROM0s7O0FBM05BO0VBQVcsOEJBQUE7QUErTlg7O0FBOU5BO0VBQVMsYUFBQTtFQUFlLGtCQUFBO0VBQW9CLDRCQUFBO0FBb081Qzs7QUFuT0E7RUFBVyxlQUFBO0VBQWlCLDhCQUFBO0FBd081Qjs7QUF2T0E7RUFBYyxhQUFBO0VBQWUsdUJBQUE7RUFBeUIsbUJBQUE7RUFBcUIsZUFBQTtFQUFpQixTQUFBO0VBQVcsaUJBQUE7RUFBbUIsNEJBQUE7RUFBOEIsa0JBQUE7QUFrUHhKOztBQWpQQTtFQUFxQixTQUFBO0VBQVcsdUJBQUE7QUFzUGhDOztBQXJQQTtFQUEwQyw0Q0FBQTtBQXlQMUM7O0FBeFBBO0VBQVUsYUFBQTtFQUFlLHNCQUFBO0VBQXdCLFNBQUE7RUFBVywwQkFBQTtBQStQNUQ7O0FBOVBBO0VBQWEsYUFBQTtFQUFlLDhCQUFBO0VBQWdDLFNBQUE7QUFvUTVEOztBQW5RQTtFQUFZLG1CQUFBO0VBQXFCLG1CQUFBO0FBd1FqQzs7QUF2UUE7RUFBa0IsV0FBQTtFQUFhLGdCQUFBO0VBQWtCLHFDQUFBO0FBNlFqRDs7QUE1UUE7RUFBWSxxQkFBQTtBQWdSWjs7QUEvUUE7RUFBWSx1Q0FBQTtFQUF5QywyQ0FBQTtFQUE2Qyx1REFBQTtFQUF5RCxxREFBQTtFQUF1RCw2Q0FBQTtFQUErQyxpREFBQTtFQUFtRCx1REFBQTtFQUF5RCxpRUFBQTtFQUFtRSxxRUFBQTtFQUF1RSxrRUFBQTtFQUFvRSxzRUFBQTtFQUF3RSw0Q0FBQTtFQUE4QyxnREFBQTtFQUFrRCxzREFBQTtBQWdTbnVCOztBQS9SQTtFQUE4QywwQkFBQTtFQUE0QixpQkFBQTtBQW9TMUU7O0FBblNBO0VBQXVDLG1CQUFBO0VBQXFCLGdCQUFBO0FBd1M1RDs7QUF2U0E7RUFBVyxrQkFBQTtFQUFvQixVQUFBO0VBQVksV0FBQTtFQUFhLGdCQUFBO0VBQWtCLHNCQUFBO0FBK1MxRTs7QUE5U0E7RUFDRTtJQUFpQixhQUFBO0VBa1RqQjtFQWpUQTtJQUFlLHNCQUFBO0lBQXdCLG9CQUFBO0VBcVR2QztFQXBUQTtJQUF3RCxXQUFBO0VBdVR4RDtFQXRUQTtJQUFhLDBCQUFBO0VBeVRiO0VBeFRBO0lBQWlCLGVBQUE7RUEyVGpCO0VBMVRBO0lBQXNCLFdBQUE7RUE2VHRCO0VBNVRBO0lBQW9DLE9BQUE7RUErVHBDO0VBOVRBO0lBQWMsV0FBQTtFQWlVZDtFQWhVQTtJQUErQyxzQkFBQTtJQUF3QixXQUFBO0VBb1V2RTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU2FtZSBzZW1hbnRpYyBwYWxldHRlIGFuZCB0eXBlIGhpZXJhcmNoeSBhcyBTZWVQcm9wZXJ0eUNvbXBvbmVudC5cbjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7IG1pbi13aWR0aDogMDsgY29sb3I6IHZhcigtLWFwcC1kYXJrLXRleHQsICMxODMxNTMpO1xuICAtLXNjaGVkdWxlLWluazogdmFyKC0tYXBwLWRhcmstdGV4dCwgIzE4MzE1Myk7XG4gIC0tc2NoZWR1bGUtbXV0ZWQ6IHZhcigtLWFwcC1kYXJrLW11dGVkLCAjNjY3NThkKTtcbiAgLS1zY2hlZHVsZS1saW5lOiB2YXIoLS1hcHAtZGFyay1ib3JkZXIsICNkY2U1ZWUpO1xuICAtLXNjaGVkdWxlLXByaW1hcnk6IHZhcigtLWFwcC1kYXJrLWFjY2VudCwgIzE3NmI4Nyk7XG4gIC0tc2NoZWR1bGUtc3VyZmFjZTogdmFyKC0tYXBwLWRhcmstc3VyZmFjZSwgI2ZmZik7XG59XG4uc2NoZWR1bGUtcGFnZSB7IGJhY2tncm91bmQ6IHZhcigtLXNjaGVkdWxlLXN1cmZhY2UpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zY2hlZHVsZS1saW5lKTsgYm9yZGVyLXJhZGl1czogMThweDsgcGFkZGluZzogMS42cmVtOyBib3gtc2hhZG93OiBub25lOyB9XG4ucGFnZS1oZWFkZXIgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGdhcDogMS4yNXJlbTsgZmxleC13cmFwOiB3cmFwOyBtYXJnaW4tYm90dG9tOiAxLjVyZW07IH1cbi5wYWdlLWtpY2tlciB7IGNvbG9yOiB2YXIoLS1zY2hlZHVsZS1wcmltYXJ5KTsgZm9udC1zaXplOiAuNzJyZW07IGZvbnQtd2VpZ2h0OiA4MDA7IGxldHRlci1zcGFjaW5nOiAuMWVtOyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9XG5oMSB7IG1hcmdpbjogLjNyZW0gMCAuNHJlbTsgY29sb3I6IHZhcigtLXNjaGVkdWxlLWluayk7IGZvbnQtc2l6ZTogY2xhbXAoMS42NXJlbSwgM3Z3LCAyLjM1cmVtKTsgbGluZS1oZWlnaHQ6IDEuMTsgbGV0dGVyLXNwYWNpbmc6IC0uMDM1ZW07IH1cbmgyIHsgY29sb3I6IHZhcigtLXNjaGVkdWxlLWluayk7IGZvbnQtc2l6ZTogMS4zcmVtOyB9XG5wIHsgbGluZS1oZWlnaHQ6IDEuNTsgfVxuLnBhZ2UtaGVhZGVyIHAgeyBtYXJnaW46IDA7IH1cbi5wYWdlLWhlYWRlciBwLCAuaGludCwgc21hbGwgeyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtbXV0ZWQpOyB9XG46aG9zdCA6Om5nLWRlZXAgLnNjaGVkdWxlLXByaW1hcnktYWN0aW9uIHsgbWluLWhlaWdodDogNDRweDsgYm9yZGVyLXJhZGl1czogMTBweDsgYmFja2dyb3VuZDogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IGJvcmRlci1jb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IGNvbG9yOiB2YXIoLS1hcHAtZGFyay1vbi1hY2NlbnQsICNmZmYpOyBmb250LXdlaWdodDogNzAwOyBib3gtc2hhZG93OiBub25lOyB9XG46aG9zdCA6Om5nLWRlZXAgLnNjaGVkdWxlLXByaW1hcnktYWN0aW9uOm5vdCg6ZGlzYWJsZWQpOmhvdmVyIHsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstYWNjZW50LWhvdmVyLCAjMTI1YjczKTsgYm9yZGVyLWNvbG9yOiB2YXIoLS1hcHAtZGFyay1hY2NlbnQtaG92ZXIsICMxMjViNzMpOyB9XG4udGFicywgLnZpZXctdG9nZ2xlIHsgZGlzcGxheTogZmxleDsgZ2FwOiAuMnJlbTsgZmxleC13cmFwOiB3cmFwOyBwYWRkaW5nOiAuMjVyZW07IG1hcmdpbi1ib3R0b206IDEuMnJlbTsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2NoZWR1bGUtbGluZSk7IGJvcmRlci1yYWRpdXM6IDEycHg7IHdpZHRoOiBmaXQtY29udGVudDsgbWF4LXdpZHRoOiAxMDAlOyB9XG5idXR0b24geyBmb250OiBpbmhlcml0OyBmb250LXdlaWdodDogNjUwOyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IGJhY2tncm91bmQ6IHZhcigtLXNjaGVkdWxlLXN1cmZhY2UpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zY2hlZHVsZS1saW5lKTsgbWluLWhlaWdodDogNDRweDsgcGFkZGluZzogLjZyZW0gLjg1cmVtOyBib3JkZXItcmFkaXVzOiAxMHB4OyBjdXJzb3I6IHBvaW50ZXI7IH1cbmJ1dHRvbjpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNmMWY1ZjgpOyB9XG5idXR0b246ZGlzYWJsZWQgeyBvcGFjaXR5OiAuNTsgY3Vyc29yOiBkZWZhdWx0OyB9XG4udGFicyBidXR0b24sIC52aWV3LXRvZ2dsZSBidXR0b24geyBkaXNwbGF5OiBpbmxpbmUtZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGdhcDogLjVyZW07IGJvcmRlcjogMDsgYm9yZGVyLXJhZGl1czogOHB4OyBmb250LXdlaWdodDogNzAwOyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtbXV0ZWQpOyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgfVxuLnRhYnMgYnV0dG9uLnNlbGVjdGVkLCAudmlldy10b2dnbGUgYnV0dG9uLnNlbGVjdGVkIHsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWFjY2VudCwgIzEwNWQ3Nik7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNlOGYyZjUpOyB9XG4udGFicyBidXR0b246aG92ZXIsIC52aWV3LXRvZ2dsZSBidXR0b246aG92ZXIgeyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1pbmZvLWJnLCAjZjFmNWY4KTsgfVxuYnV0dG9uOmZvY3VzLXZpc2libGUsIGlucHV0OmZvY3VzLXZpc2libGUsIHNlbGVjdDpmb2N1cy12aXNpYmxlLCB0ZXh0YXJlYTpmb2N1cy12aXNpYmxlIHsgb3V0bGluZTogMnB4IHNvbGlkIHZhcigtLXNjaGVkdWxlLXByaW1hcnkpOyBvdXRsaW5lLW9mZnNldDogMnB4OyB9XG4uZmlsdGVycyB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsgYWxpZ24taXRlbXM6IGVuZDsgZ2FwOiAuNzVyZW07IG1hcmdpbi1ib3R0b206IDEuMnJlbTsgfVxubGFiZWwgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBnYXA6IC40cmVtOyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtaW5rKTsgZm9udC1zaXplOiAuODRyZW07IGZvbnQtd2VpZ2h0OiA2NTA7IH1cbmlucHV0LCBzZWxlY3QsIHRleHRhcmVhIHsgZm9udDogaW5oZXJpdDsgZm9udC13ZWlnaHQ6IDQwMDsgY29sb3I6IHZhcigtLXNjaGVkdWxlLWluayk7IGJhY2tncm91bmQ6IHZhcigtLXNjaGVkdWxlLXN1cmZhY2UpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zY2hlZHVsZS1saW5lKTsgYm9yZGVyLXJhZGl1czogMTBweDsgcGFkZGluZzogLjY1cmVtOyBtaW4taGVpZ2h0OiA0NHB4OyBtaW4td2lkdGg6IDA7IHdpZHRoOiAxMDAlOyB9XG5pbnB1dDo6cGxhY2Vob2xkZXIsIHRleHRhcmVhOjpwbGFjZWhvbGRlciB7IGNvbG9yOiB2YXIoLS1zY2hlZHVsZS1tdXRlZCk7IG9wYWNpdHk6IDE7IH1cbmlucHV0OmRpc2FibGVkLCBzZWxlY3Q6ZGlzYWJsZWQgeyBiYWNrZ3JvdW5kOiB2YXIoLS1hcHAtZGFyay1zdXJmYWNlLW11dGVkLCAjZjVmOGZiKTsgY29sb3I6IHZhcigtLXNjaGVkdWxlLW11dGVkKTsgfVxuLmZpbHRlcnMgbGFiZWwgeyBmbGV4OiAxIDEgMTQ1cHg7IG1heC13aWR0aDogMzAwcHg7IGNvbG9yOiB2YXIoLS1zY2hlZHVsZS1tdXRlZCk7IGZvbnQtc2l6ZTogLjc2cmVtOyBmb250LXdlaWdodDogNTAwOyB9XG4udGFibGUtc2Nyb2xsIHsgb3ZlcmZsb3cteDogYXV0bzsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2NoZWR1bGUtbGluZSk7IGJvcmRlci1yYWRpdXM6IDE2cHg7IH1cbnRhYmxlIHsgd2lkdGg6IDEwMCU7IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7IG1pbi13aWR0aDogNjAwcHg7IGZvbnQtc2l6ZTogLjlyZW07IH1cbnRoIHsgdGV4dC1hbGlnbjogbGVmdDsgY29sb3I6IHZhcigtLXNjaGVkdWxlLW11dGVkKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2Y1ZjhmYik7IGZvbnQtc2l6ZTogLjhyZW07IGZvbnQtd2VpZ2h0OiA2NTA7IH1cbnRkLCB0aCB7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1zY2hlZHVsZS1saW5lKTsgcGFkZGluZzogLjlyZW0gMXJlbTsgdmVydGljYWwtYWxpZ246IG1pZGRsZTsgfVxudGJvZHkgdHI6bGFzdC1jaGlsZCB0ZCB7IGJvcmRlci1ib3R0b206IDA7IH1cbnRkIHN0cm9uZywgc21hbGwgeyBkaXNwbGF5OiBibG9jazsgfVxudGQgc3Ryb25nIHsgZm9udC13ZWlnaHQ6IDY1MDsgfVxuc21hbGwgeyBtYXJnaW4tdG9wOiAuM3JlbTsgZm9udC1zaXplOiAuNzZyZW07IGZvbnQtd2VpZ2h0OiA0MDA7IGxpbmUtaGVpZ2h0OiAxLjQ1OyB9XG4uYWN0aW9ucyB7IG1pbi13aWR0aDogMTcwcHg7IH1cbi5hY3Rpb25zIGJ1dHRvbiB7IG1hcmdpbjogMCAuMzVyZW0gLjM1cmVtIDA7IGZvbnQtc2l6ZTogLjhyZW07IH1cbi5iYWRnZSB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgY29sb3I6IHZhcigtLXNjaGVkdWxlLW11dGVkKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2U4ZjJmNSk7IGJvcmRlci1yYWRpdXM6IDk5OXB4OyBwYWRkaW5nOiAuM3JlbSAuNnJlbTsgZm9udC1zaXplOiAuNzVyZW07IGZvbnQtd2VpZ2h0OiA3NTA7IHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbi5iYWRnZS5hY3RpdmUgeyBjb2xvcjogdmFyKC0tYXBwLWRhcmstc3VjY2Vzcy10ZXh0LCAjMDg3ODVkKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstc3VjY2Vzcy1iZywgI2U5ZjhmMik7IH1cbi5iYWRnZS5vdmVyZHVlIHsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYzQ0NzMyKTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLWJnLCAjZmZmMGVkKTsgfVxuLmVycm9yIHsgY29sb3I6IHZhcigtLWFwcC1kYXJrLWRhbmdlci10ZXh0LCAjYjQyMzE4KTsgYmFja2dyb3VuZDogdmFyKC0tYXBwLWRhcmstZGFuZ2VyLWJnLCAjZmZmNWY0KTsgcGFkZGluZzogLjdyZW07IGJvcmRlcjogMXB4IHNvbGlkIGN1cnJlbnRDb2xvcjsgYm9yZGVyLXJhZGl1czogMTBweDsgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7IH1cbi5tZXNzYWdlIHsgY29sb3I6IHZhcigtLXNjaGVkdWxlLXByaW1hcnkpOyB9XG4uZW1wdHkgeyBwYWRkaW5nOiAycmVtOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiB2YXIoLS1zY2hlZHVsZS1tdXRlZCk7IH1cbi5lbXB0eSBpIHsgZm9udC1zaXplOiAycmVtOyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IH1cbi5wYWdpbmF0aW9uIHsgZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGZsZXgtd3JhcDogd3JhcDsgZ2FwOiAxcmVtOyBwYWRkaW5nLXRvcDogMXJlbTsgY29sb3I6IHZhcigtLXNjaGVkdWxlLW11dGVkKTsgZm9udC1zaXplOiAuODVyZW07IH1cbi5wYWdpbmF0aW9uIGJ1dHRvbiB7IGJvcmRlcjogMDsgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IH1cbi5wYWdpbmF0aW9uIGJ1dHRvbjpub3QoOmRpc2FibGVkKTpob3ZlciB7IGJhY2tncm91bmQ6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNlOGYyZjUpOyB9XG4uZWRpdG9yIHsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAxcmVtOyBjb2xvcjogdmFyKC0tc2NoZWR1bGUtaW5rKTsgfVxuLmZvcm0tZ3JpZCB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjsgZ2FwOiAxcmVtOyB9XG4uY2hlY2tib3ggeyBmbGV4LWRpcmVjdGlvbjogcm93OyBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4uY2hlY2tib3ggaW5wdXQgeyB3aWR0aDogYXV0bzsgbWluLWhlaWdodDogYXV0bzsgYWNjZW50LWNvbG9yOiB2YXIoLS1zY2hlZHVsZS1wcmltYXJ5KTsgfVxuLnByZXNlcnZlIHsgd2hpdGUtc3BhY2U6IHByZS13cmFwOyB9XG4uY2FsZW5kYXIgeyAtLWZjLWJvcmRlci1jb2xvcjogdmFyKC0tc2NoZWR1bGUtbGluZSk7IC0tZmMtcGFnZS1iZy1jb2xvcjogdmFyKC0tc2NoZWR1bGUtc3VyZmFjZSk7IC0tZmMtbmV1dHJhbC1iZy1jb2xvcjogdmFyKC0tYXBwLWRhcmstaW5mby1iZywgI2Y1ZjhmYik7IC0tZmMtdG9kYXktYmctY29sb3I6IHZhcigtLWFwcC1kYXJrLWluZm8tYmcsICNlOGYyZjUpOyAtLWZjLWJ1dHRvbi1iZy1jb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IC0tZmMtYnV0dG9uLWJvcmRlci1jb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IC0tZmMtYnV0dG9uLXRleHQtY29sb3I6IHZhcigtLWFwcC1kYXJrLW9uLWFjY2VudCwgI2ZmZik7IC0tZmMtYnV0dG9uLWhvdmVyLWJnLWNvbG9yOiB2YXIoLS1hcHAtZGFyay1hY2NlbnQtaG92ZXIsICMxMjViNzMpOyAtLWZjLWJ1dHRvbi1ob3Zlci1ib3JkZXItY29sb3I6IHZhcigtLWFwcC1kYXJrLWFjY2VudC1ob3ZlciwgIzEyNWI3Myk7IC0tZmMtYnV0dG9uLWFjdGl2ZS1iZy1jb2xvcjogdmFyKC0tYXBwLWRhcmstYWNjZW50LWhvdmVyLCAjMTI1YjczKTsgLS1mYy1idXR0b24tYWN0aXZlLWJvcmRlci1jb2xvcjogdmFyKC0tYXBwLWRhcmstYWNjZW50LWhvdmVyLCAjMTI1YjczKTsgLS1mYy1ldmVudC1iZy1jb2xvcjogdmFyKC0tc2NoZWR1bGUtcHJpbWFyeSk7IC0tZmMtZXZlbnQtYm9yZGVyLWNvbG9yOiB2YXIoLS1zY2hlZHVsZS1wcmltYXJ5KTsgLS1mYy1ldmVudC10ZXh0LWNvbG9yOiB2YXIoLS1hcHAtZGFyay1vbi1hY2NlbnQsICNmZmYpOyB9XG46aG9zdCA6Om5nLWRlZXAgLmNhbGVuZGFyIC5mYy10b29sYmFyLXRpdGxlIHsgY29sb3I6IHZhcigtLXNjaGVkdWxlLWluayk7IGZvbnQtc2l6ZTogMS4zcmVtOyB9XG46aG9zdCA6Om5nLWRlZXAgLmNhbGVuZGFyIC5mYy1idXR0b24geyBib3JkZXItcmFkaXVzOiAxMHB4OyBtaW4taGVpZ2h0OiA0NHB4OyB9XG4uc3Itb25seSB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IDFweDsgaGVpZ2h0OiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IGNsaXA6IHJlY3QoMCwwLDAsMCk7IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA2ODBweCkge1xuICAuc2NoZWR1bGUtcGFnZSB7IHBhZGRpbmc6IDFyZW07IH1cbiAgLnBhZ2UtaGVhZGVyIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6IHN0cmV0Y2g7IH1cbiAgOmhvc3QgOjpuZy1kZWVwIC5wYWdlLWhlYWRlciAuc2NoZWR1bGUtcHJpbWFyeS1hY3Rpb24geyB3aWR0aDogMTAwJTsgfVxuICAuZm9ybS1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cbiAgLmZpbHRlcnMgbGFiZWwgeyBtYXgtd2lkdGg6IG5vbmU7IH1cbiAgLnRhYnMsIC52aWV3LXRvZ2dsZSB7IHdpZHRoOiAxMDAlOyB9XG4gIC50YWJzIGJ1dHRvbiwgLnZpZXctdG9nZ2xlIGJ1dHRvbiB7IGZsZXg6IDE7IH1cbiAgLnBhZ2luYXRpb24geyBnYXA6IC41cmVtOyB9XG4gIDpob3N0IDo6bmctZGVlcCAuY2FsZW5kYXIgLmZjLWhlYWRlci10b29sYmFyIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAuNnJlbTsgfVxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ },

/***/ 71807
/*!**************************************************************!*\
  !*** ./src/app/demo/components/schedule/schedule.service.ts ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleService: () => (/* binding */ ScheduleService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 74733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 59315);
/* harmony import */ var _service_global_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../service/global.service */ 53796);





class ScheduleService {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient);
    this.url = _service_global_service__WEBPACK_IMPORTED_MODULE_3__.global.url;
  }
  get(path, query = {}) {
    return this.http.get(`${this.url}${path}`, {
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams({
        fromObject: query
      })
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(r => r.data));
  }
  post(path, body) {
    return this.http.post(`${this.url}${path}`, body).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(r => r.data));
  }
  patch(path, body) {
    return this.http.patch(`${this.url}${path}`, body).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(r => r.data));
  }
  download(record, file) {
    return this.http.get(`${this.url}maintenance/history/${record}/evidence/${file._id}`, {
      responseType: 'blob'
    });
  }
  static {
    this.ɵfac = function ScheduleService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ScheduleService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: ScheduleService,
      factory: ScheduleService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_schedule_schedule_component_ts.js.map