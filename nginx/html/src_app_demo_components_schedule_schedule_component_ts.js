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
/* harmony import */ var _fullcalendar_core_locales_es__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fullcalendar/core/locales/es */ 51366);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _schedule_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./schedule.service */ 71807);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 58440);



















const _c0 = () => ({
  width: "680px",
  maxWidth: "95vw"
});
const _c1 = () => ["SCHEDULED", "PENDING", "IN_PROGRESS", "OVERDUE", "COMPLETED", "CANCELLED", "SKIPPED"];
function ScheduleComponent_p_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p-button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("onClick", function ScheduleComponent_p_button_7_Template_p_button_onClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openSchedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_p_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p-button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("onClick", function ScheduleComponent_p_button_8_Template_p_button_onClick_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openVendor());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_p_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.message);
  }
}
function ScheduleComponent_p_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function ScheduleComponent_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_button_14_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("tasks"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Tareas");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-current", ctx_r1.tab === "tasks" ? "page" : null);
  }
}
function ScheduleComponent_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_button_15_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("history"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Historial");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-current", ctx_r1.tab === "history" ? "page" : null);
  }
}
function ScheduleComponent_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_button_16_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectTab("vendors"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Proveedores");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx_r1.tab === "vendors");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-current", ctx_r1.tab === "vendors" ? "page" : null);
  }
}
function ScheduleComponent_div_17_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const c_r8 = ctx.$implicit;
    const i_r9 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", i_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](c_r8.label);
  }
}
function ScheduleComponent_div_17_label_7_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r11 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", s_r11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.statusLabel(s_r11));
  }
}
function ScheduleComponent_div_17_label_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Estado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "select", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_label_7_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.statusFilter, $event) || (ctx_r1.statusFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_label_7_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4, "Todos");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](5, ScheduleComponent_div_17_label_7_option_5_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.statusFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](2, _c1));
  }
}
function ScheduleComponent_div_17_label_14_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const v_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", v_r13._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](v_r13.name);
  }
}
function ScheduleComponent_div_17_label_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "select", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_label_14_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.providerFilter, $event) || (ctx_r1.providerFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_label_14_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4, "Todos");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](5, ScheduleComponent_div_17_label_14_option_5_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.providerFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
  }
}
function ScheduleComponent_div_17_label_15_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const r_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", r_r15.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](r_r15.name);
  }
}
function ScheduleComponent_div_17_label_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Responsable");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "select", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_label_15_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.responsibleFilter, $event) || (ctx_r1.responsibleFilter = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_label_15_Template_select_change_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](5, ScheduleComponent_div_17_label_15_option_5_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.responsibleFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.selectedLocation === "");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.selectedLocation === "" ? "Selecciona una ubicaci\u00F3n" : "Todos");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.filterResponsibles);
  }
}
function ScheduleComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 27)(1, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Ubicaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "select", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_Template_select_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.selectedLocation, $event) || (ctx_r1.selectedLocation = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_Template_select_change_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.locationFilterChanged());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5, "Todas mis ubicaciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](6, ScheduleComponent_div_17_option_6_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](7, ScheduleComponent_div_17_label_7_Template, 6, 3, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9, "Desde");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_Template_input_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.from, $event) || (ctx_r1.from = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_Template_input_change_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Hasta");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_div_17_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.to, $event) || (ctx_r1.to = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_div_17_Template_input_change_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.resetFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](14, ScheduleComponent_div_17_label_14_Template, 6, 2, "label", 31)(15, ScheduleComponent_div_17_label_15_Template, 6, 4, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.selectedLocation);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.contexts);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.from);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.to);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks" || ctx_r1.tab === "schedules");
  }
}
function ScheduleComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 35)(1, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_18_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.setView("list"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Lista");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_18_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.setView("calendar"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4, "Calendario");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx_r1.view === "list");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx_r1.view === "calendar");
  }
}
function ScheduleComponent_p_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Cargando mantenimientos\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](1, "full-calendar", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("options", ctx_r1.calendar);
  }
}
function ScheduleComponent_div_21_table_1_tr_18_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "small", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"]("Revisa la ubicaci\u00F3n o reasigna al responsable: ", s_r17.notificationError);
  }
}
function ScheduleComponent_div_21_table_1_tr_18_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_1_tr_18_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18);
      const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openSchedule(s_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Editar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_21_table_1_tr_18_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_1_tr_18_button_20_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.toggle(s_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const s_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.isActive ? "Pausar" : "Reanudar");
  }
}
function ScheduleComponent_div_21_table_1_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](6, ScheduleComponent_div_21_table_1_tr_18_small_6_Template, 2, 1, "small", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](15, "td")(16, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](18, "td", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](19, ScheduleComponent_div_21_table_1_tr_18_button_19_Template, 2, 0, "button", 46)(20, ScheduleComponent_div_21_table_1_tr_18_button_20_Template, 2, 2, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const s_r17 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.equipmentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", s_r17.notificationError);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.locationLabel(s_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.frequencyType === "ONCE" ? "Una vez" : "Cada " + s_r17.frequencyValue + " " + ctx_r1.frequencyLabel(s_r17.frequencyType));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.nextRunAt ? ctx_r1.formatDate(s_r17.nextRunAt, s_r17.timezone) : "Finalizada");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.timezone);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](s_r17.isActive ? "Activa" : "Pausada / finalizada");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.has("schedules.update"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.has("schedules.update") && s_r17.nextRunAt);
  }
}
function ScheduleComponent_div_21_table_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "table")(1, "caption", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Programaci\u00F3n de mantenimientos");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Mantenimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8, "Ubicaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10, "Frecuencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Pr\u00F3ximo vencimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](14, "Estado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](15, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](16, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](17, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](18, ScheduleComponent_div_21_table_1_tr_18_Template, 21, 10, "tr", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.schedules);
  }
}
function ScheduleComponent_div_21_table_2_tr_16_td_11_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_2_tr_16_td_11_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r21);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "IN_PROGRESS"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Iniciar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving);
  }
}
function ScheduleComponent_div_21_table_2_tr_16_td_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "td", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](1, ScheduleComponent_div_21_table_2_tr_16_td_11_button_1_Template, 2, 1, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_2_tr_16_td_11_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openComplete(t_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3, "Completar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_2_tr_16_td_11_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openReschedule(t_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5, "Reprogramar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_2_tr_16_td_11_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "SKIPPED"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](7, "Omitir");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_2_tr_16_td_11_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.changeStatus(t_r22, "CANCELLED"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9, "Cancelar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", t_r22.status !== "IN_PROGRESS");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving);
  }
}
function ScheduleComponent_div_21_table_2_tr_16_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_21_table_2_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "td")(9, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](11, ScheduleComponent_div_21_table_2_tr_16_td_11_Template, 10, 3, "td", 50)(12, ScheduleComponent_div_21_table_2_tr_16_td_12_Template, 2, 0, "td", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r22 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](t_r22.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.locationLabel(t_r22));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.formatDate(t_r22.dueDate, t_r22.timezone));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("overdue", t_r22.status === "OVERDUE");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.statusLabel(t_r22.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", t_r22.isOpen && ctx_r1.has("maintenance.update"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !t_r22.isOpen || !ctx_r1.has("maintenance.update"));
  }
}
function ScheduleComponent_div_21_table_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "table")(1, "caption", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Tareas de mantenimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Tarea");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8, "Ubicaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10, "Vencimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Estado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](14, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](16, ScheduleComponent_div_21_table_2_tr_16_Template, 13, 8, "tr", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.tasks);
  }
}
function ScheduleComponent_div_21_table_3_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "td")(11, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_3_tr_16_Template_button_click_11_listener() {
      const h_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r23).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openHistory(h_r24));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Ver registro");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const h_r24 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](h_r24.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.formatDate(h_r24.performedAt, h_r24.timezone));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"]((h_r24.providerSnapshot == null ? null : h_r24.providerSnapshot.name) || "Sin proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate2"]("", ctx_r1.cost(h_r24), " ", h_r24.currency);
  }
}
function ScheduleComponent_div_21_table_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "table")(1, "caption", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Historial de mantenimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Mantenimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8, "Realizado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10, "Proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Costo");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](14, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](16, ScheduleComponent_div_21_table_3_tr_16_Template, 13, 5, "tr", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.history);
  }
}
function ScheduleComponent_div_21_table_4_tr_14_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_21_table_4_tr_14_button_9_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const v_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.openVendor(v_r26));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Editar");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_21_table_4_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr")(1, "td")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](9, ScheduleComponent_div_21_table_4_tr_14_button_9_Template, 2, 0, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const v_r26 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](v_r26.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](v_r26.contact);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](v_r26.isActive ? "Activo" : "Archivado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.has("vendors.update"));
  }
}
function ScheduleComponent_div_21_table_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "table")(1, "caption", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Cat\u00E1logo de proveedores");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "thead")(4, "tr")(5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8, "Contacto");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10, "Estado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](14, ScheduleComponent_div_21_table_4_tr_14_Template, 10, 4, "tr", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
  }
}
function ScheduleComponent_div_21_div_5_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Programa tu primer mantenimiento para comenzar.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
}
function ScheduleComponent_div_21_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](1, "i", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3, "No hay registros para esta selecci\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](4, ScheduleComponent_div_21_div_5_p_4_Template, 2, 0, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "schedules");
  }
}
function ScheduleComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](1, ScheduleComponent_div_21_table_1_Template, 19, 1, "table", 31)(2, ScheduleComponent_div_21_table_2_Template, 17, 1, "table", 31)(3, ScheduleComponent_div_21_table_3_Template, 17, 1, "table", 31)(4, ScheduleComponent_div_21_table_4_Template, 15, 1, "table", 31)(5, ScheduleComponent_div_21_div_5_Template, 5, 1, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-busy", ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "schedules");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "tasks");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "history");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.tab === "vendors");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !ctx_r1.loading && ctx_r1.total === 0);
  }
}
function ScheduleComponent_footer_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "footer", 53)(1, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_footer_22_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      ctx_r1.page = ctx_r1.page - 1;
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.load());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2, "Anterior");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_footer_22_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      ctx_r1.page = ctx_r1.page + 1;
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.load());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Siguiente");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.page <= 1 || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate2"]("P\u00E1gina ", ctx_r1.page, " \u00B7 ", ctx_r1.total, " registros");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.page * ctx_r1.limit >= ctx_r1.total || ctx_r1.loading);
  }
}
function ScheduleComponent_p_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function ScheduleComponent_form_25_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const c_r30 = ctx.$implicit;
    const i_r31 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", i_r31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](c_r30.label);
  }
}
function ScheduleComponent_form_25_label_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Primer vencimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "input", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_label_31_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.startDate, $event) || (ctx_r1.draft.startDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4, "La hora ingresada corresponde a la zona de tu navegador. La recurrencia utiliza la zona indicada abajo.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.startDate);
  }
}
function ScheduleComponent_form_25_option_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const r_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", r_r33.role + ":" + r_r33.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate2"]("", r_r33.name, " (", r_r33.role, ")");
  }
}
function ScheduleComponent_form_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "form", 54, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_25_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const scheduleForm_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](scheduleForm_r29.valid && ctx_r1.saveSchedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3, "Nombre");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "input", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.name, $event) || (ctx_r1.draft.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Ubicaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "select", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_select_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.location, $event) || (ctx_r1.draft.location = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_form_25_Template_select_change_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.loadResponsibles());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9, "Selecciona una ubicaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](10, ScheduleComponent_form_25_option_10_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Equipo o instalaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.equipmentName, $event) || (ctx_r1.draft.equipmentName = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](14, "div", 58)(15, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](16, "Frecuencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](17, "select", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_select_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.frequencyType, $event) || (ctx_r1.draft.frequencyType = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](18, "option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](19, "Una vez");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](20, "option", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](21, "D\u00EDas");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](22, "option", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](23, "Semanas");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](24, "option", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](25, "Meses");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](26, "option", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](27, "A\u00F1os");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](28, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](29, "Repetir cada");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](30, "input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_input_ngModelChange_30_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.frequencyValue, $event) || (ctx_r1.draft.frequencyValue = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](31, ScheduleComponent_form_25_label_31_Template, 5, 1, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](32, "div", 58)(33, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](34, "Zona horaria");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](35, "input", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_input_ngModelChange_35_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.timezone, $event) || (ctx_r1.draft.timezone = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](36, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](37, "Avisar d\u00EDas antes");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](38, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_input_ngModelChange_38_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.remindBeforeDays, $event) || (ctx_r1.draft.remindBeforeDays = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](39, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](40, "Responsable");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](41, "select", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_select_ngModelChange_41_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.responsible, $event) || (ctx_r1.draft.responsible = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](42, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](43, "Yo");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](44, ScheduleComponent_form_25_option_44_Template, 2, 3, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](45, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](46, "Descripci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](47, "textarea", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_25_Template_textarea_ngModelChange_47_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r28);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.draft.description, $event) || (ctx_r1.draft.description = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](48, "p", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](49, "El siguiente mantenimiento se calcula desde la fecha en que se realiza. Al editar, la frecuencia aplica a la siguiente ejecuci\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](50, "p-button", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const scheduleForm_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.location);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", !!ctx_r1.editingId);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.contexts);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.equipmentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.frequencyType);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.frequencyValue);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !ctx_r1.editingId);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.timezone);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.remindBeforeDays);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.responsible);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.responsibles);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.draft.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving || !scheduleForm_r29.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_26_ng_container_13_option_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const v_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", v_r36._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](v_r36.name);
  }
}
function ScheduleComponent_form_26_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](1, ScheduleComponent_form_26_ng_container_13_option_1_Template, 2, 2, "option", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const v_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", v_r36.isActive);
  }
}
function ScheduleComponent_form_26_label_35_option_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const d_r38 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("value", d_r38._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](d_r38.title);
  }
}
function ScheduleComponent_form_26_label_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1, "Documentos existentes (opcional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "select", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_label_35_Template_select_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r37);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.documentIds, $event) || (ctx_r1.documentIds = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](3, ScheduleComponent_form_26_label_35_option_3_Template, 2, 2, "option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5, "Selecciona hasta cinco documentos.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.documentIds);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.documents);
  }
}
function ScheduleComponent_form_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "form", 54, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_26_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const completeForm_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](completeForm_r35.valid && ctx_r1.complete());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "p")(3, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Fecha realizada");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "input", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.performedAt, $event) || (ctx_r1.completion.performedAt = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9, "Proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "select", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_select_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.providerId, $event) || (ctx_r1.completion.providerId = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12, "Sin proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](13, ScheduleComponent_form_26_ng_container_13_Template, 2, 1, "ng-container", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](14, "div", 58)(15, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](16, "Costo");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](17, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.cost, $event) || (ctx_r1.completion.cost = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](18, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](19, "Moneda");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](20, "input", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_input_ngModelChange_20_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.currency, $event) || (ctx_r1.completion.currency = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](21, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](22, "Trabajo realizado");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](23, "textarea", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_textarea_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.description, $event) || (ctx_r1.completion.description = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](24, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](25, "Notas");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](26, "textarea", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_textarea_ngModelChange_26_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.notes, $event) || (ctx_r1.completion.notes = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](27, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](28, "Pr\u00F3xima fecha manual (opcional)");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](29, "input", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_26_Template_input_ngModelChange_29_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.completion.nextRecommendedDate, $event) || (ctx_r1.completion.nextRecommendedDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](30, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](31, "Evidencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](32, "input", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("change", function ScheduleComponent_form_26_Template_input_change_32_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.selectFiles($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](33, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](35, ScheduleComponent_form_26_label_35_Template, 6, 2, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](36, "p", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](37, "Se guardar\u00E1 un registro permanente con fecha, costo y evidencia.");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](38, "p-button", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const completeForm_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.task == null ? null : ctx_r1.task.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.performedAt);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.providerId);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.vendors);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.cost);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.currency);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.completion.nextRecommendedDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"]("Hasta cinco archivos, 10 MB cada uno. ", ctx_r1.files.length, " seleccionado(s).");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.documents.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving || !completeForm_r35.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "form", 54, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_27_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r39);
      const rescheduleForm_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](rescheduleForm_r40.valid && ctx_r1.reschedule());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5, "Nuevo vencimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "input", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_27_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r39);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.rescheduleDate, $event) || (ctx_r1.rescheduleDate = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](7, "p-button", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const rescheduleForm_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.task == null ? null : ctx_r1.task.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.rescheduleDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving || !rescheduleForm_r40.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_form_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "form", 54, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("ngSubmit", function ScheduleComponent_form_28_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const vendorForm_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](vendorForm_r42.valid && ctx_r1.saveVendor());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3, "Nombre");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "input", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.name, $event) || (ctx_r1.vendorDraft.name = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Contacto");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "input", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.contact, $event) || (ctx_r1.vendorDraft.contact = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9, "Notas");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "textarea", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_textarea_ngModelChange_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.notes, $event) || (ctx_r1.vendorDraft.notes = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "label", 87)(12, "input", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("ngModelChange", function ScheduleComponent_form_28_Template_input_ngModelChange_12_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx_r1.vendorDraft.isActive, $event) || (ctx_r1.vendorDraft.isActive = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](13, "Proveedor activo");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](14, "p-button", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const vendorForm_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵreference"](1);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.contact);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("ngModel", ctx_r1.vendorDraft.isActive);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", ctx_r1.saving || !vendorForm_r42.valid)("loading", ctx_r1.saving);
  }
}
function ScheduleComponent_div_29_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"]("Pr\u00F3xima fecha: ", ctx_r1.formatDate(ctx_r1.selectedHistory.nextRecommendedDate, ctx_r1.selectedHistory.timezone));
  }
}
function ScheduleComponent_div_29_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_div_29_button_12_Template_button_click_0_listener() {
      const f_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r43).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r1.download(ctx_r1.selectedHistory, f_r44));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](1, "i", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const f_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"](" ", f_r44.filename);
  }
}
function ScheduleComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 90)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "p", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "p", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](11, ScheduleComponent_div_29_p_11_Template, 2, 1, "p", 31)(12, ScheduleComponent_div_29_button_12_Template, 3, 1, "button", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate3"]("", ctx_r1.formatDate(ctx_r1.selectedHistory.performedAt, ctx_r1.selectedHistory.timezone), " \u00B7 ", ctx_r1.cost(ctx_r1.selectedHistory), " ", ctx_r1.selectedHistory.currency);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"]("Proveedor: ", (ctx_r1.selectedHistory.providerSnapshot == null ? null : ctx_r1.selectedHistory.providerSnapshot.name) || "Sin proveedor");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](ctx_r1.selectedHistory.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r1.selectedHistory.nextRecommendedDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx_r1.selectedHistory.evidence);
  }
}
class ScheduleComponent {
  constructor() {
    this.api = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_schedule_service__WEBPACK_IMPORTED_MODULE_14__.ScheduleService);
    this.changeDetector = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_13__.AccessContextService);
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
      locale: _fullcalendar_core_locales_es__WEBPACK_IMPORTED_MODULE_12__["default"],
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
              this.message = 'Esta tarea ya está cerrada. Consulta el historial.';
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
      this.error = 'Selecciona una ubicación y escribe el nombre.';
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
      this.message = 'Consulta el detalle y el historial de esta tarea en la lista.';
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
      this.error = 'Máximo cinco archivos de 10 MB cada uno.';
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
        this.message = 'Cambios guardados.';
        this.load();
        this.changeDetector.markForCheck();
      },
      error: e => this.report(e)
    }));
  }
  report(error) {
    this.loading = false;
    this.saving = false;
    this.error = error.error?.error?.message || 'No se pudo completar la operación. Intenta de nuevo.';
    this.changeDetector.markForCheck();
  }
  localDate(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  formatDate(value, timezone = 'America/Santo_Domingo') {
    return new Intl.DateTimeFormat('es-DO', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone
    }).format(new Date(value));
  }
  cost(row) {
    return typeof row.cost === 'string' ? row.cost : row.cost?.$numberDecimal || '0';
  }
  locationLabel(row) {
    return this.contexts.find(c => ['condominiumId', 'unitId', 'residenceId'].every(k => String(c[k] || '') === String(row[k] || '')))?.label || 'Ubicación';
  }
  statusLabel(status) {
    const labels = {
      SCHEDULED: 'Programada',
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En ejecución',
      OVERDUE: 'Atrasada',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
      SKIPPED: 'Omitida'
    };
    return labels[status] || status;
  }
  frequencyLabel(type) {
    const labels = {
      ONCE: 'Una vez',
      DAY: 'día(s)',
      WEEK: 'semana(s)',
      MONTH: 'mes(es)',
      YEAR: 'año(s)'
    };
    return labels[type] || type;
  }
  static {
    this.ɵfac = function ScheduleComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ScheduleComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineComponent"]({
      type: ScheduleComponent,
      selectors: [["app-schedule"]],
      decls: 30,
      vars: 30,
      consts: [["scheduleForm", "ngForm"], ["completeForm", "ngForm"], ["rescheduleForm", "ngForm"], ["vendorForm", "ngForm"], [1, "schedule-page"], [1, "page-header"], ["label", "Programar mantenimiento", "ariaLabel", "Programar mantenimiento", "icon", "pi pi-plus", 3, "onClick", 4, "ngIf"], ["label", "Agregar proveedor", "ariaLabel", "Agregar proveedor", "icon", "pi pi-plus", 3, "onClick", 4, "ngIf"], ["role", "status", "class", "message", 4, "ngIf"], ["role", "alert", "class", "error", 4, "ngIf"], ["aria-label", "Secciones de mantenimiento", 1, "tabs"], [3, "click"], [3, "selected", "click", 4, "ngIf"], ["class", "filters", 4, "ngIf"], ["class", "view-toggle", 4, "ngIf"], ["role", "status", 4, "ngIf"], ["class", "calendar", 4, "ngIf"], ["class", "table-scroll", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], [3, "visibleChange", "visible", "modal", "closable", "closeOnEscape", "header"], ["class", "error", "role", "alert", 4, "ngIf"], ["class", "editor", 3, "ngSubmit", 4, "ngIf"], ["class", "editor", 4, "ngIf"], ["label", "Programar mantenimiento", "ariaLabel", "Programar mantenimiento", "icon", "pi pi-plus", 3, "onClick"], ["label", "Agregar proveedor", "ariaLabel", "Agregar proveedor", "icon", "pi pi-plus", 3, "onClick"], ["role", "status", 1, "message"], ["role", "alert", 1, "error"], [1, "filters"], [3, "ngModelChange", "change", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["type", "date", 3, "ngModelChange", "change", "ngModel"], [3, "value"], [3, "ngModelChange", "change", "ngModel", "disabled"], [1, "view-toggle"], ["role", "status"], [1, "calendar"], [3, "options"], [1, "table-scroll"], ["class", "empty", 4, "ngIf"], [1, "sr-only"], [4, "ngFor", "ngForOf"], ["class", "error", 4, "ngIf"], [1, "badge"], [1, "actions"], [3, "click", 4, "ngIf"], [3, "disabled", "click", 4, "ngIf"], [1, "error"], [3, "click", "disabled"], ["class", "actions", 4, "ngIf"], [1, "empty"], ["aria-hidden", "true", 1, "pi", "pi-calendar"], [1, "pagination"], [1, "editor", 3, "ngSubmit"], ["name", "name", "required", "", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["name", "location", "required", "", 3, "ngModelChange", "change", "ngModel", "disabled"], ["name", "equipment", "maxlength", "200", "placeholder", "Cisterna, generador, ascensor\u2026", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["name", "frequencyType", 3, "ngModelChange", "ngModel"], ["value", "ONCE"], ["value", "DAY"], ["value", "WEEK"], ["value", "MONTH"], ["value", "YEAR"], ["name", "frequencyValue", "type", "number", "required", "", "min", "1", "max", "10000", "step", "1", 3, "ngModelChange", "ngModel"], ["name", "timezone", "required", "", 3, "ngModelChange", "ngModel"], ["name", "remindBeforeDays", "type", "number", "min", "0", "max", "365", "step", "1", "required", "", 3, "ngModelChange", "ngModel"], ["name", "responsible", 3, "ngModelChange", "ngModel"], ["name", "description", "maxlength", "5000", "rows", "3", 3, "ngModelChange", "ngModel"], [1, "hint"], ["type", "submit", "label", "Guardar programaci\u00F3n", 3, "disabled", "loading"], ["name", "startDate", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["name", "performedAt", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["name", "providerId", 3, "ngModelChange", "ngModel"], ["name", "cost", "required", "", "pattern", "[0-9]{1,12}(\\.[0-9]{1,2})?", "inputmode", "decimal", 3, "ngModelChange", "ngModel"], ["name", "currency", "required", "", "pattern", "[A-Z]{3}", "maxlength", "3", 3, "ngModelChange", "ngModel"], ["name", "notes", "maxlength", "5000", "rows", "2", 3, "ngModelChange", "ngModel"], ["name", "nextRecommendedDate", "type", "datetime-local", 3, "ngModelChange", "ngModel"], ["type", "file", "multiple", "", "accept", "application/pdf,image/jpeg,image/png,image/webp", 3, "change"], ["type", "submit", "label", "Completar y guardar historial", 3, "disabled", "loading"], [3, "value", 4, "ngIf"], ["name", "documentIds", "multiple", "", 3, "ngModelChange", "ngModel"], ["name", "dueDate", "type", "datetime-local", "required", "", 3, "ngModelChange", "ngModel"], ["type", "submit", "label", "Reprogramar", 3, "disabled", "loading"], ["name", "contact", "maxlength", "300", 3, "ngModelChange", "ngModel"], ["name", "notes", "maxlength", "2000", "rows", "3", 3, "ngModelChange", "ngModel"], [1, "checkbox"], ["name", "isActive", "type", "checkbox", 3, "ngModelChange", "ngModel"], ["type", "submit", "label", "Guardar proveedor", 3, "disabled", "loading"], [1, "editor"], [1, "preserve"], [3, "click", 4, "ngFor", "ngForOf"], ["aria-hidden", "true", 1, "pi", "pi-download"]],
      template: function ScheduleComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "section", 4)(1, "header", 5)(2, "div")(3, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4, "Mantenimientos");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6, "Programa el trabajo, coordina su ejecuci\u00F3n y conserva cada detalle.");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](7, ScheduleComponent_p_button_7_Template, 1, 0, "p-button", 6)(8, ScheduleComponent_p_button_8_Template, 1, 0, "p-button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](9, ScheduleComponent_p_9_Template, 2, 1, "p", 8)(10, ScheduleComponent_p_10_Template, 2, 1, "p", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](11, "nav", 10)(12, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function ScheduleComponent_Template_button_click_12_listener() {
            return ctx.selectTab("schedules");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](13, "Programaci\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](14, ScheduleComponent_button_14_Template, 2, 3, "button", 12)(15, ScheduleComponent_button_15_Template, 2, 3, "button", 12)(16, ScheduleComponent_button_16_Template, 2, 3, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](17, ScheduleComponent_div_17_Template, 16, 7, "div", 13)(18, ScheduleComponent_div_18_Template, 5, 4, "div", 14)(19, ScheduleComponent_p_19_Template, 2, 0, "p", 15)(20, ScheduleComponent_div_20_Template, 2, 1, "div", 16)(21, ScheduleComponent_div_21_Template, 6, 6, "div", 17)(22, ScheduleComponent_footer_22_Template, 7, 4, "footer", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](23, "p-dialog", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayListener"]("visibleChange", function ScheduleComponent_Template_p_dialog_visibleChange_23_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayBindingSet"](ctx.dialog, $event) || (ctx.dialog = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](24, ScheduleComponent_p_24_Template, 2, 1, "p", 20)(25, ScheduleComponent_form_25_Template, 51, 15, "form", 21)(26, ScheduleComponent_form_26_Template, 39, 13, "form", 21)(27, ScheduleComponent_form_27_Template, 8, 4, "form", 21)(28, ScheduleComponent_form_28_Template, 15, 6, "form", 21)(29, ScheduleComponent_div_29_Template, 13, 9, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.tab === "schedules" && ctx.has("schedules.create"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.tab === "vendors" && ctx.has("vendors.create"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.message);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.error && !ctx.dialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("selected", ctx.tab === "schedules");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-current", ctx.tab === "schedules" ? "page" : null);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.has("maintenance.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.has("maintenance.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.has("vendors.read"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.tab !== "vendors");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.tab === "tasks");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.tab === "tasks" && ctx.view === "calendar");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.view === "list");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.view === "list");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](29, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtwoWayProperty"]("visible", ctx.dialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("modal", true)("closable", !ctx.saving)("closeOnEscape", !ctx.saving)("header", ctx.editor === "schedule" ? "Programar mantenimiento" : ctx.editor === "complete" ? "Completar mantenimiento" : ctx.editor === "reschedule" ? "Reprogramar tarea" : ctx.editor === "vendor" ? "Proveedor" : "Registro de mantenimiento");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.editor === "schedule");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.editor === "complete");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.editor === "reschedule");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.editor === "vendor");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.editor === "history" && ctx.selectedHistory);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectMultipleControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_7__.ButtonModule, primeng_button__WEBPACK_IMPORTED_MODULE_7__.Button, primeng_dialog__WEBPACK_IMPORTED_MODULE_8__.DialogModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_8__.Dialog, _fullcalendar_angular__WEBPACK_IMPORTED_MODULE_9__.FullCalendarModule, _fullcalendar_angular__WEBPACK_IMPORTED_MODULE_9__.FullCalendarComponent],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  color: var(--text-color);\n}\n\n.schedule-page[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  border: 1px solid var(--surface-border);\n  border-radius: 12px;\n  padding: 1.5rem;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.5rem;\n}\n\nh1[_ngcontent-%COMP%] {\n  margin: 0 0 0.4rem;\n  font-size: 1.8rem;\n}\n\nh2[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n}\n\np[_ngcontent-%COMP%] {\n  line-height: 1.5;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .hint[_ngcontent-%COMP%], small[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n\n.tabs[_ngcontent-%COMP%], .view-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.2rem;\n}\n\n.tabs[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--surface-border);\n  padding-bottom: 0.75rem;\n}\n\nbutton[_ngcontent-%COMP%] {\n  font: inherit;\n  color: var(--text-color);\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  padding: 0.5rem 0.8rem;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\nbutton[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\nbutton.selected[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  border-color: var(--primary-color);\n}\n\nbutton[_ngcontent-%COMP%]:focus-visible, input[_ngcontent-%COMP%]:focus-visible, select[_ngcontent-%COMP%]:focus-visible, textarea[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--primary-color);\n  outline-offset: 3px;\n}\n\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: end;\n  gap: 0.8rem;\n  margin-bottom: 1rem;\n}\n\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  font-weight: 500;\n}\n\ninput[_ngcontent-%COMP%], select[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%] {\n  font: inherit;\n  color: var(--text-color);\n  background: var(--surface-ground);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  padding: 0.65rem;\n  min-width: 0;\n  width: 100%;\n}\n\n.filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  flex: 1 1 145px;\n  max-width: 300px;\n}\n\n.table-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  min-width: 600px;\n}\n\nth[_ngcontent-%COMP%] {\n  text-align: left;\n  color: var(--text-color-secondary);\n  font-weight: 500;\n}\n\ntd[_ngcontent-%COMP%], th[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--surface-border);\n  padding: 0.9rem 0.65rem;\n  vertical-align: top;\n}\n\ntd[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], small[_ngcontent-%COMP%] {\n  display: block;\n}\n\nsmall[_ngcontent-%COMP%] {\n  margin-top: 0.3rem;\n  font-size: 0.85rem;\n  font-weight: 400;\n}\n\n.actions[_ngcontent-%COMP%] {\n  min-width: 170px;\n}\n\n.actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin: 0 0.35rem 0.35rem 0;\n  font-size: 0.9rem;\n}\n\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: var(--surface-ground);\n  border-radius: 4px;\n  padding: 0.3rem 0.5rem;\n  white-space: nowrap;\n}\n\n.overdue[_ngcontent-%COMP%], .error[_ngcontent-%COMP%] {\n  color: #b54738;\n}\n\n.error[_ngcontent-%COMP%] {\n  padding: 0.7rem;\n  border: 1px solid currentColor;\n  border-radius: 6px;\n  overflow-wrap: anywhere;\n}\n\n.message[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n\n.empty[_ngcontent-%COMP%] {\n  padding: 2rem;\n  text-align: center;\n  color: var(--text-color-secondary);\n}\n\n.empty[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2rem;\n}\n\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n\n.editor[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n\n.checkbox[_ngcontent-%COMP%] {\n  flex-direction: row;\n  align-items: center;\n}\n\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: auto;\n}\n\n.preserve[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n}\n\n.calendar[_ngcontent-%COMP%] {\n  --fc-border-color: var(--surface-border);\n  --fc-page-bg-color: var(--surface-card);\n  --fc-neutral-bg-color: var(--surface-ground);\n  --fc-today-bg-color: var(--surface-hover);\n}\n\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n}\n\n@media (max-width: 600px) {\n  .schedule-page[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .filters[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .pagination[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n  [_nghost-%COMP%]     .fc-header-toolbar {\n    flex-direction: column;\n    gap: 0.6rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQVEsY0FBQTtFQUFnQix3QkFBQTtBQUd4Qjs7QUFGQTtFQUFpQiwrQkFBQTtFQUFpQyx1Q0FBQTtFQUF5QyxtQkFBQTtFQUFxQixlQUFBO0FBU2hIOztBQVJBO0VBQWUsYUFBQTtFQUFlLG1CQUFBO0VBQXFCLDhCQUFBO0VBQWdDLFNBQUE7RUFBVyxlQUFBO0VBQWlCLHFCQUFBO0FBaUIvRzs7QUFoQkE7RUFBSyxrQkFBQTtFQUFtQixpQkFBQTtBQXFCeEI7O0FBckI2QztFQUFLLGlCQUFBO0FBeUJsRDs7QUF6QnVFO0VBQUksZ0JBQUE7QUE2QjNFOztBQTdCK0Y7RUFBK0Isa0NBQUE7QUFpQzlIOztBQWhDQTtFQUFzQixhQUFBO0VBQWUsV0FBQTtFQUFZLGVBQUE7RUFBaUIscUJBQUE7QUF1Q2xFOztBQXRDQTtFQUFRLDhDQUFBO0VBQWdELHVCQUFBO0FBMkN4RDs7QUExQ0E7RUFBUyxhQUFBO0VBQWUsd0JBQUE7RUFBMEIsaUNBQUE7RUFBbUMsdUNBQUE7RUFBeUMsc0JBQUE7RUFBc0Isa0JBQUE7RUFBb0IsZUFBQTtBQW9EeEs7O0FBbkRBO0VBQWUsZ0NBQUE7QUF1RGY7O0FBdkRtRDtFQUFrQixZQUFBO0VBQWEsZUFBQTtBQTREbEY7O0FBNURxRztFQUFrQiwyQkFBQTtFQUE2QixrQ0FBQTtBQWlFcEo7O0FBaEVBO0VBQTBGLHVDQUFBO0VBQXlDLG1CQUFBO0FBcUVuSTs7QUFwRUE7RUFBVyxhQUFBO0VBQWUsZUFBQTtFQUFpQixnQkFBQTtFQUFrQixXQUFBO0VBQVksbUJBQUE7QUE0RXpFOztBQTNFQTtFQUFRLGFBQUE7RUFBZSxzQkFBQTtFQUF3QixXQUFBO0VBQVksZ0JBQUE7QUFrRjNEOztBQWxGK0U7RUFBMEIsYUFBQTtFQUFlLHdCQUFBO0VBQTBCLGlDQUFBO0VBQW1DLHVDQUFBO0VBQXlDLGtCQUFBO0VBQW9CLGdCQUFBO0VBQWlCLFlBQUE7RUFBYyxXQUFBO0FBNkZqUjs7QUE1RkE7RUFBaUIsZUFBQTtFQUFpQixnQkFBQTtBQWlHbEM7O0FBakdzRDtFQUFnQixnQkFBQTtBQXFHdEU7O0FBckcwRjtFQUFRLFdBQUE7RUFBYSx5QkFBQTtFQUEyQixnQkFBQTtBQTJHMUk7O0FBM0c4SjtFQUFLLGdCQUFBO0VBQWtCLGtDQUFBO0VBQW9DLGdCQUFBO0FBaUh6Tjs7QUFqSDZPO0VBQVMsOENBQUE7RUFBZ0QsdUJBQUE7RUFBdUIsbUJBQUE7QUF1SDdUOztBQXZIb1Y7RUFBbUIsY0FBQTtBQTJIdlc7O0FBM0h5WDtFQUFRLGtCQUFBO0VBQW1CLGtCQUFBO0VBQW1CLGdCQUFBO0FBaUl2YTs7QUFoSUE7RUFBVyxnQkFBQTtBQW9JWDs7QUFwSStCO0VBQWtCLDJCQUFBO0VBQTJCLGlCQUFBO0FBeUk1RTs7QUF6SWdHO0VBQVMscUJBQUE7RUFBdUIsaUNBQUE7RUFBbUMsa0JBQUE7RUFBb0Isc0JBQUE7RUFBc0IsbUJBQUE7QUFpSjdNOztBQWpKb087RUFBbUIsY0FBQTtBQXFKdlA7O0FBckp5UTtFQUFTLGVBQUE7RUFBZ0IsOEJBQUE7RUFBZ0Msa0JBQUE7RUFBb0IsdUJBQUE7QUE0SnRWOztBQTVKaVg7RUFBVywyQkFBQTtBQWdLNVg7O0FBL0pBO0VBQVMsYUFBQTtFQUFlLGtCQUFBO0VBQW9CLGtDQUFBO0FBcUs1Qzs7QUFyS2tGO0VBQVcsZUFBQTtBQXlLN0Y7O0FBektnSDtFQUFjLGFBQUE7RUFBZSw4QkFBQTtFQUFnQyxtQkFBQTtFQUFxQixTQUFBO0VBQVcsZ0JBQUE7QUFpTDdNOztBQWpMaU87RUFBVSxhQUFBO0VBQWUsc0JBQUE7RUFBd0IsU0FBQTtBQXVMbFI7O0FBdkwrUjtFQUFhLGFBQUE7RUFBZSw4QkFBQTtFQUFnQyxTQUFBO0FBNkwzVjs7QUE3THdXO0VBQVksbUJBQUE7RUFBcUIsbUJBQUE7QUFrTXpZOztBQWxNZ2E7RUFBa0IsV0FBQTtBQXNNbGI7O0FBdE1pYztFQUFZLHFCQUFBO0FBME03Yzs7QUExTXNlO0VBQVksd0NBQUE7RUFBMEMsdUNBQUE7RUFBeUMsNENBQUE7RUFBOEMseUNBQUE7QUFpTm5uQjs7QUFoTkE7RUFBVyxrQkFBQTtFQUFvQixVQUFBO0VBQVksV0FBQTtFQUFhLGdCQUFBO0VBQWtCLHNCQUFBO0FBd04xRTs7QUF2TkE7RUFBNEI7SUFBaUIsYUFBQTtFQTROM0M7RUE1TjREO0lBQWEsMEJBQUE7RUErTnpFO0VBL051RztJQUFpQixlQUFBO0VBa094SDtFQWxPMkk7SUFBYyxlQUFBO0VBcU96SjtFQXJPNEs7SUFBcUMsc0JBQUE7SUFBd0IsV0FBQTtFQXlPek87QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTsgfVxuLnNjaGVkdWxlLXBhZ2UgeyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWNhcmQpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zdXJmYWNlLWJvcmRlcik7IGJvcmRlci1yYWRpdXM6IDEycHg7IHBhZGRpbmc6IDEuNXJlbTsgfVxuLnBhZ2UtaGVhZGVyIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBnYXA6IDFyZW07IGZsZXgtd3JhcDogd3JhcDsgbWFyZ2luLWJvdHRvbTogMS41cmVtOyB9XG5oMSB7IG1hcmdpbjogMCAwIC40cmVtOyBmb250LXNpemU6IDEuOHJlbTsgfSBoMiB7IGZvbnQtc2l6ZTogMS4zcmVtOyB9IHAgeyBsaW5lLWhlaWdodDogMS41OyB9IC5wYWdlLWhlYWRlciBwLCAuaGludCwgc21hbGwgeyBjb2xvcjogdmFyKC0tdGV4dC1jb2xvci1zZWNvbmRhcnkpOyB9XG4udGFicywgLnZpZXctdG9nZ2xlIHsgZGlzcGxheTogZmxleDsgZ2FwOiAuNXJlbTsgZmxleC13cmFwOiB3cmFwOyBtYXJnaW4tYm90dG9tOiAxLjJyZW07IH1cbi50YWJzIHsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLXN1cmZhY2UtYm9yZGVyKTsgcGFkZGluZy1ib3R0b206IC43NXJlbTsgfVxuYnV0dG9uIHsgZm9udDogaW5oZXJpdDsgY29sb3I6IHZhcigtLXRleHQtY29sb3IpOyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWdyb3VuZCk7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXN1cmZhY2UtYm9yZGVyKTsgcGFkZGluZzogLjVyZW0gLjhyZW07IGJvcmRlci1yYWRpdXM6IDZweDsgY3Vyc29yOiBwb2ludGVyOyB9XG5idXR0b246aG92ZXIgeyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWhvdmVyKTsgfSBidXR0b246ZGlzYWJsZWQgeyBvcGFjaXR5OiAuNTsgY3Vyc29yOiBkZWZhdWx0OyB9IGJ1dHRvbi5zZWxlY3RlZCB7IGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTsgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTsgfVxuYnV0dG9uOmZvY3VzLXZpc2libGUsIGlucHV0OmZvY3VzLXZpc2libGUsIHNlbGVjdDpmb2N1cy12aXNpYmxlLCB0ZXh0YXJlYTpmb2N1cy12aXNpYmxlIHsgb3V0bGluZTogMnB4IHNvbGlkIHZhcigtLXByaW1hcnktY29sb3IpOyBvdXRsaW5lLW9mZnNldDogM3B4OyB9XG4uZmlsdGVycyB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtd3JhcDogd3JhcDsgYWxpZ24taXRlbXM6IGVuZDsgZ2FwOiAuOHJlbTsgbWFyZ2luLWJvdHRvbTogMXJlbTsgfVxubGFiZWwgeyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBnYXA6IC40cmVtOyBmb250LXdlaWdodDogNTAwOyB9IGlucHV0LCBzZWxlY3QsIHRleHRhcmVhIHsgZm9udDogaW5oZXJpdDsgY29sb3I6IHZhcigtLXRleHQtY29sb3IpOyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLWdyb3VuZCk7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXN1cmZhY2UtYm9yZGVyKTsgYm9yZGVyLXJhZGl1czogNnB4OyBwYWRkaW5nOiAuNjVyZW07IG1pbi13aWR0aDogMDsgd2lkdGg6IDEwMCU7IH1cbi5maWx0ZXJzIGxhYmVsIHsgZmxleDogMSAxIDE0NXB4OyBtYXgtd2lkdGg6IDMwMHB4OyB9IC50YWJsZS1zY3JvbGwgeyBvdmVyZmxvdy14OiBhdXRvOyB9IHRhYmxlIHsgd2lkdGg6IDEwMCU7IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7IG1pbi13aWR0aDogNjAwcHg7IH0gdGggeyB0ZXh0LWFsaWduOiBsZWZ0OyBjb2xvcjogdmFyKC0tdGV4dC1jb2xvci1zZWNvbmRhcnkpOyBmb250LXdlaWdodDogNTAwOyB9IHRkLCB0aCB7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1zdXJmYWNlLWJvcmRlcik7IHBhZGRpbmc6IC45cmVtIC42NXJlbTsgdmVydGljYWwtYWxpZ246IHRvcDsgfSB0ZCBzdHJvbmcsIHNtYWxsIHsgZGlzcGxheTogYmxvY2s7IH0gc21hbGwgeyBtYXJnaW4tdG9wOiAuM3JlbTsgZm9udC1zaXplOiAuODVyZW07IGZvbnQtd2VpZ2h0OiA0MDA7IH1cbi5hY3Rpb25zIHsgbWluLXdpZHRoOiAxNzBweDsgfSAuYWN0aW9ucyBidXR0b24geyBtYXJnaW46IDAgLjM1cmVtIC4zNXJlbSAwOyBmb250LXNpemU6IC45cmVtOyB9IC5iYWRnZSB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ncm91bmQpOyBib3JkZXItcmFkaXVzOiA0cHg7IHBhZGRpbmc6IC4zcmVtIC41cmVtOyB3aGl0ZS1zcGFjZTogbm93cmFwOyB9IC5vdmVyZHVlLCAuZXJyb3IgeyBjb2xvcjogI2I1NDczODsgfSAuZXJyb3IgeyBwYWRkaW5nOiAuN3JlbTsgYm9yZGVyOiAxcHggc29saWQgY3VycmVudENvbG9yOyBib3JkZXItcmFkaXVzOiA2cHg7IG92ZXJmbG93LXdyYXA6IGFueXdoZXJlOyB9IC5tZXNzYWdlIHsgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpOyB9XG4uZW1wdHkgeyBwYWRkaW5nOiAycmVtOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLXNlY29uZGFyeSk7IH0gLmVtcHR5IGkgeyBmb250LXNpemU6IDJyZW07IH0gLnBhZ2luYXRpb24geyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMXJlbTsgbWFyZ2luLXRvcDogMXJlbTsgfSAuZWRpdG9yIHsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAxcmVtOyB9IC5mb3JtLWdyaWQgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7IGdhcDogMXJlbTsgfSAuY2hlY2tib3ggeyBmbGV4LWRpcmVjdGlvbjogcm93OyBhbGlnbi1pdGVtczogY2VudGVyOyB9IC5jaGVja2JveCBpbnB1dCB7IHdpZHRoOiBhdXRvOyB9IC5wcmVzZXJ2ZSB7IHdoaXRlLXNwYWNlOiBwcmUtd3JhcDsgfSAuY2FsZW5kYXIgeyAtLWZjLWJvcmRlci1jb2xvcjogdmFyKC0tc3VyZmFjZS1ib3JkZXIpOyAtLWZjLXBhZ2UtYmctY29sb3I6IHZhcigtLXN1cmZhY2UtY2FyZCk7IC0tZmMtbmV1dHJhbC1iZy1jb2xvcjogdmFyKC0tc3VyZmFjZS1ncm91bmQpOyAtLWZjLXRvZGF5LWJnLWNvbG9yOiB2YXIoLS1zdXJmYWNlLWhvdmVyKTsgfVxuLnNyLW9ubHkgeyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiAxcHg7IGhlaWdodDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyBjbGlwOiByZWN0KDAsMCwwLDApOyB9XG5AbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHsgLnNjaGVkdWxlLXBhZ2UgeyBwYWRkaW5nOiAxcmVtOyB9IC5mb3JtLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsgfSAuZmlsdGVycyBsYWJlbCB7IG1heC13aWR0aDogbm9uZTsgfSAucGFnaW5hdGlvbiB7IGZsZXgtd3JhcDogd3JhcDsgfSA6aG9zdCA6Om5nLWRlZXAgLmZjLWhlYWRlci10b29sYmFyIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAuNnJlbTsgfSB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
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

/***/ },

/***/ 51366
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@fullcalendar+core@6.1.21/node_modules/@fullcalendar/core/locales/es.js ***!
  \****************************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ l24)
/* harmony export */ });
var l24 = {
  code: 'es',
  week: {
    dow: 1,
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  },
  buttonText: {
    prev: 'Ant',
    next: 'Sig',
    today: 'Hoy',
    year: 'Año',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    list: 'Agenda'
  },
  buttonHints: {
    prev: '$0 antes',
    next: '$0 siguiente',
    today(buttonText) {
      return buttonText === 'Día' ? 'Hoy' : (buttonText === 'Semana' ? 'Esta' : 'Este') + ' ' + buttonText.toLocaleLowerCase();
    }
  },
  viewHint(buttonText) {
    return 'Vista ' + (buttonText === 'Semana' ? 'de la' : 'del') + ' ' + buttonText.toLocaleLowerCase();
  },
  weekText: 'Sm',
  weekTextLong: 'Semana',
  allDayText: 'Todo el día',
  moreLinkText: 'más',
  moreLinkHint(eventCnt) {
    return `Mostrar ${eventCnt} eventos más`;
  },
  noEventsText: 'No hay eventos para mostrar',
  navLinkHint: 'Ir al $0',
  closeHint: 'Cerrar',
  timeHint: 'La hora',
  eventHint: 'Evento'
};


/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_schedule_schedule_component_ts.js.map