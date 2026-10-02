"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_iot-dashboard_iot-dashboard_module_ts"],{

/***/ 69631
/*!*******************************************************************************!*\
  !*** ./src/app/demo/components/iot-dashboard/iot-dashboard-routing.module.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTDashboardRoutingModule: () => (/* binding */ IoTDashboardRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _iot_dashboard_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iot-dashboard.component */ 42959);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class IoTDashboardRoutingModule {
  static {
    this.ɵfac = function IoTDashboardRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTDashboardRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: IoTDashboardRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _iot_dashboard_component__WEBPACK_IMPORTED_MODULE_1__.IoTDashboardComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](IoTDashboardRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 42959
/*!**************************************************************************!*\
  !*** ./src/app/demo/components/iot-dashboard/iot-dashboard.component.ts ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTDashboardComponent: () => (/* binding */ IoTDashboardComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 86808);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/api */ 57561);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 40311);
/* harmony import */ var src_app_demo_service_iot_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/demo/service/iot.service */ 52589);
/* harmony import */ var src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/demo/service/user.service */ 37612);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/select */ 16419);
/* harmony import */ var primeng_tag__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/tag */ 60905);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/common */ 20145);

















const _c0 = () => ({
  width: "min(92vw, 30rem)"
});
const _c1 = () => ({
  width: "min(92vw, 34rem)"
});
const _c2 = () => ({});
const arrowFn0 = (ctx, view) => context => ({
  label: context.label,
  value: ctx.contextKey(context)
});
const _forTrack0 = ($index, $item) => $item.id;
function IoTDashboardComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_13_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.openNewDevice());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const context_r3 = ctx;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", context_r3.remainingDevices <= 0 || context_r3.status !== "ACTIVE");
  }
}
function IoTDashboardComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_14_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.openNewResidence());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function IoTDashboardComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "p-message", 10);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("text", ctx_r1.errorMessage());
  }
}
function IoTDashboardComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "p-progressSpinner", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Connecting to your home");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function IoTDashboardComponent_Conditional_17_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Add a residence to keep its devices separate from condominium-managed units. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_17_Conditional_4_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.openNewResidence());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function IoTDashboardComponent_Conditional_17_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "No Smart Home contexts are available for this account.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function IoTDashboardComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "section", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Start with a place");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](4, IoTDashboardComponent_Conditional_17_Conditional_4_Template, 3, 0)(5, IoTDashboardComponent_Conditional_17_Conditional_5_Template, 2, 0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx_r1.canAddResidence ? 4 : 5);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "i", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "No Smart Home plan is active for this place. Devices already linked remain visible.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_32_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 54)(1, "span")(2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](6, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_32_For_8_Template_button_click_7_listener() {
      const alert_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.acknowledgeAlert(alert_r7.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const alert_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("alert-row--critical", alert_r7.severity === "CRITICAL");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](alert_r7.eventType.replaceAll(".", " "));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate2"]("", alert_r7.deviceName, " \u00B7 ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](6, 6, alert_r7.occurredAt, "short"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-label", "Acknowledge alert for " + alert_r7.deviceName);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "section", 40)(1, "div", 42)(2, "div")(3, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "NEEDS ATTENTION");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "h2", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Alerts");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeaterCreate"](7, IoTDashboardComponent_Conditional_18_Conditional_32_For_8_Template, 8, 9, "div", 53, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const summary_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeater"](summary_r8.recentAlerts);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "span", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "No devices here yet");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, " When you add a device, its connection and latest state will appear here. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_42_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.openNewDevice());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ((tmp_3_0 = ctx_r1.selectedContext()) == null ? null : tmp_3_0.remainingDevices) === 0);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Water sensor");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"]((device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["waterDetected"]) === true ? "Water detected" : "No water detected");
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, " W");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Current consumption");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"]((device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["powerConsumption"]) ?? "\u2014");
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, " \u00B0C");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Room temperature");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"]((device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["temperature"]) ?? "\u2014");
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Lock state");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"]((device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["lock"]) ?? "\u2014");
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Power state");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"]((device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["power"]) ?? "\u2014");
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r12);
      const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.setPower(device_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("icon", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["power"]) === "ON" ? "pi pi-power-off" : "pi pi-bolt")("title", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["power"]) === "ON" ? "Turn off" : "Turn on")("disabled", device_r11.status !== "ACTIVE" || !device_r11.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-label", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["power"]) === "ON" ? "Turn off " + device_r11.displayName : "Turn on " + device_r11.displayName);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_20_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);
      const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.setPower(device_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_20_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);
      const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.setTemperature(device_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("icon", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["power"]) === "ON" ? "pi pi-power-off" : "pi pi-bolt")("disabled", device_r11.status !== "ACTIVE" || !device_r11.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-label", "Toggle " + device_r11.displayName);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", device_r11.status !== "ACTIVE" || !device_r11.enabled);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_21_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r14);
      const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.setLock(device_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("icon", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["lock"]) === "LOCKED" ? "pi pi-lock-open" : "pi pi-lock")("title", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["lock"]) === "LOCKED" ? "Unlock" : "Lock")("disabled", device_r11.status !== "ACTIVE" || !device_r11.enabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-label", (device_r11.shadow == null ? null : device_r11.shadow.reported == null ? null : device_r11.shadow.reported["lock"]) === "LOCKED" ? "Unlock " + device_r11.displayName : "Lock " + device_r11.displayName);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "article", 59)(1, "div", 60)(2, "span", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "i", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](4, "p-tag", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 64)(6, "p", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "p", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](13, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_13_Template, 4, 1)(14, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_14_Template, 6, 1)(15, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_15_Template, 6, 1)(16, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_16_Template, 4, 1)(17, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_17_Template, 4, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](19, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_19_Template, 1, 4, "button", 69)(20, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_20_Template, 2, 4)(21, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Conditional_21_Template, 1, 4, "button", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "button", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Template_button_click_22_listener() {
      const device_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.showDetails(device_r11));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const device_r11 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("device-tile--alert", device_r11.status === "ERROR");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("device-tile__icon--alert", device_r11.alerts > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassMap"](ctx_r1.deviceIcon(device_r11.deviceType));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", ctx_r1.statusText(device_r11))("severity", device_r11.connectivity === "ONLINE" && device_r11.status === "ACTIVE" ? "success" : device_r11.status === "ERROR" ? "danger" : "secondary");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", device_r11.location || "No room assigned", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](device_r11.displayName);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", device_r11.deviceType.replaceAll("_", " "), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](device_r11.deviceType === "WATER_SENSOR" ? 13 : device_r11.deviceType === "ENERGY_METER" ? 14 : device_r11.deviceType === "AIR_CONDITIONER" ? 15 : device_r11.deviceType === "SMART_LOCK" ? 16 : 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](device_r11.deviceType === "LIGHT" || device_r11.deviceType === "WATER_PUMP" ? 19 : device_r11.deviceType === "AIR_CONDITIONER" ? 20 : device_r11.deviceType === "SMART_LOCK" ? 21 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-label", "Details for " + device_r11.displayName);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeaterCreate"](1, IoTDashboardComponent_Conditional_18_Conditional_43_For_2_Template, 23, 14, "article", 58, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const summary_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeater"](summary_r8.devices);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_51_For_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "time");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](6, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const event_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("activity-list__marker--error", !event_r15.success);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](event_r15.action.replaceAll("_", " "));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("datetime", event_r15.createdAt);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](6, 5, event_r15.createdAt, "short"));
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ol", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeaterCreate"](1, IoTDashboardComponent_Conditional_18_Conditional_51_For_2_Template, 7, 8, "li", null, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const summary_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrepeater"](summary_r8.recentActivity);
  }
}
function IoTDashboardComponent_Conditional_18_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "p", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "No device activity yet.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function IoTDashboardComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "section", 35)(1, "div", 36)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "DEVICES");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "div", 37)(11, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "ONLINE");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](16, "Connected now");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "div", 37)(18, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, "OFFLINE");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "div", 38)(25, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26, "ALERTS");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](30, "Need attention");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](31, IoTDashboardComponent_Conditional_18_Conditional_31_Template, 4, 0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](32, IoTDashboardComponent_Conditional_18_Conditional_32_Template, 9, 0, "section", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](33, "section", 41)(34, "div", 42)(35, "div")(36, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](37, "AT A GLANCE");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](38, "h2", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](39, "Devices");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](42, IoTDashboardComponent_Conditional_18_Conditional_42_Template, 7, 1, "div", 45)(43, IoTDashboardComponent_Conditional_18_Conditional_43_Template, 3, 0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "section", 47)(45, "div", 42)(46, "div")(47, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](48, "RECENT");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](49, "h2", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](50, "Activity");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](51, IoTDashboardComponent_Conditional_18_Conditional_51_Template, 3, 0, "ol", 49)(52, IoTDashboardComponent_Conditional_18_Conditional_52_Template, 2, 0, "p", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_9_0;
    const summary_r8 = ctx;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](summary_r8.deviceUsage);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" / ", summary_r8.deviceLimit);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", summary_r8.remainingDevices, " remaining");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](summary_r8.online);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](summary_r8.offline);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", summary_r8.unknown, " awaiting signal");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](summary_r8.alerts);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](((tmp_9_0 = ctx_r1.selectedContext()) == null ? null : tmp_9_0.status) === "NOT_SUBSCRIBED" ? 31 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](summary_r8.recentAlerts.length ? 32 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", summary_r8.total, " total");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](summary_r8.devices.length === 0 ? 42 : 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](summary_r8.recentActivity.length ? 51 : 52);
  }
}
function IoTDashboardComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 29)(1, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "dl")(8, "dt");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "dd");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "dt");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "Last seen");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "dd");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](16, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "dt");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18, "AWS Thing");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "dd");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "dt");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](22, "Shadow version");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "dd");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "dt");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26, "Reported state");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "dd")(28, "pre");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](30, "json");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](31, "button", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Conditional_44_Template_button_click_31_listener() {
      const device_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.confirmDelete(device_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_9_0;
    const device_r17 = ctx;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", device_r17.deviceType.replaceAll("_", " "), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](device_r17.displayName);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](device_r17.location || "No room assigned");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r1.statusText(device_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", device_r17.lastSeen ? _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](16, 8, device_r17.lastSeen, "medium") : "No report received", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](device_r17.awsThingName || "Restricted");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ((tmp_8_0 = ctx_r1.latestState()) == null ? null : tmp_8_0["version"]) ?? (device_r17.shadow == null ? null : device_r17.shadow.version) ?? "\u2014", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](30, 11, ((tmp_9_0 = ctx_r1.latestState()) == null ? null : tmp_9_0["reported"]) ?? (device_r17.shadow == null ? null : device_r17.shadow.reported) ?? _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](13, _c2)));
  }
}
function payloadOf(response) {
  return response.data ?? response;
}
class IoTDashboardComponent {
  constructor() {
    this.iot = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(src_app_demo_service_iot_service__WEBPACK_IMPORTED_MODULE_4__.IoTService);
    this.messages = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(primeng_api__WEBPACK_IMPORTED_MODULE_2__.MessageService);
    this.confirmation = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(primeng_api__WEBPACK_IMPORTED_MODULE_2__.ConfirmationService);
    this.userService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(src_app_demo_service_user_service__WEBPACK_IMPORTED_MODULE_5__.UserService);
    this.canAddResidence = String(this.userService.getIdentity()?.role || '').toUpperCase() === 'OWNER';
    this.contexts = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)([], ...(ngDevMode ? [{
      debugName: "contexts"
    }] : /* istanbul ignore next */[]));
    this.selectedContextId = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "selectedContextId"
    }] : /* istanbul ignore next */[]));
    this.dashboard = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(null, ...(ngDevMode ? [{
      debugName: "dashboard"
    }] : /* istanbul ignore next */[]));
    this.loading = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(true, ...(ngDevMode ? [{
      debugName: "loading"
    }] : /* istanbul ignore next */[]));
    this.saving = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "saving"
    }] : /* istanbul ignore next */[]));
    this.errorMessage = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "errorMessage"
    }] : /* istanbul ignore next */[]));
    this.deviceDialogOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "deviceDialogOpen"
    }] : /* istanbul ignore next */[]));
    this.residenceDialogOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "residenceDialogOpen"
    }] : /* istanbul ignore next */[]));
    this.detailsDialogOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "detailsDialogOpen"
    }] : /* istanbul ignore next */[]));
    this.selectedDevice = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(null, ...(ngDevMode ? [{
      debugName: "selectedDevice"
    }] : /* istanbul ignore next */[]));
    this.latestState = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(null, ...(ngDevMode ? [{
      debugName: "latestState"
    }] : /* istanbul ignore next */[]));
    this.deviceName = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "deviceName"
    }] : /* istanbul ignore next */[]));
    this.deviceLocation = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "deviceLocation"
    }] : /* istanbul ignore next */[]));
    this.selectedDeviceType = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('LIGHT', ...(ngDevMode ? [{
      debugName: "selectedDeviceType"
    }] : /* istanbul ignore next */[]));
    this.temperature = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(22, ...(ngDevMode ? [{
      debugName: "temperature"
    }] : /* istanbul ignore next */[]));
    this.residenceLabel = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', ...(ngDevMode ? [{
      debugName: "residenceLabel"
    }] : /* istanbul ignore next */[]));
    this.selectedContext = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.computed)(() => this.contexts().find(context => this.contextKey(context) === this.selectedContextId()) ?? null, ...(ngDevMode ? [{
      debugName: "selectedContext"
    }] : /* istanbul ignore next */[]));
    this.deviceTypes = [{
      label: 'Light',
      value: 'LIGHT'
    }, {
      label: 'Air conditioner',
      value: 'AIR_CONDITIONER'
    }, {
      label: 'Smart lock',
      value: 'SMART_LOCK'
    }, {
      label: 'Water sensor',
      value: 'WATER_SENSOR'
    }, {
      label: 'Energy meter',
      value: 'ENERGY_METER'
    }, {
      label: 'Water pump',
      value: 'WATER_PUMP'
    }];
    this.loadContexts();
  }
  contextKey(context) {
    return [context.scopeType, context.condominiumId ?? '', context.unitId ?? '', context.residenceId ?? ''].join(':');
  }
  loadContexts() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.iot.getContexts().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.loading.set(false))).subscribe({
      next: response => {
        const result = payloadOf(response);
        const contexts = result.contexts ?? [];
        this.contexts.set(contexts);
        const current = this.selectedContextId();
        const selected = contexts.find(context => this.contextKey(context) === current) ?? contexts[0] ?? null;
        this.selectedContextId.set(selected ? this.contextKey(selected) : '');
        if (selected) this.loadDashboard(selected);else this.dashboard.set(null);
      },
      error: error => {
        this.errorMessage.set(error.error?.message || 'Smart Home could not load. Try again.');
      }
    });
  }
  onContextChange(key) {
    this.selectedContextId.set(key);
    const context = this.selectedContext();
    if (context) this.loadDashboard(context);
  }
  loadDashboard(context = this.selectedContext()) {
    if (!context) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.iot.getDashboard(context).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.loading.set(false))).subscribe({
      next: response => this.dashboard.set(payloadOf(response)),
      error: error => {
        this.errorMessage.set(error.error?.message || 'Devices could not load. Try again.');
      }
    });
  }
  openNewDevice() {
    this.deviceName.set('');
    this.deviceLocation.set('');
    this.selectedDeviceType.set('LIGHT');
    this.deviceDialogOpen.set(true);
  }
  saveDevice() {
    const context = this.selectedContext();
    const displayName = this.deviceName().trim();
    if (!context || !displayName || this.saving()) return;
    this.saving.set(true);
    this.iot.createDevice(context, {
      displayName,
      deviceType: this.selectedDeviceType(),
      location: this.deviceLocation().trim(),
      idempotencyKey: this.createIdempotencyKey()
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.saving.set(false))).subscribe({
      next: () => {
        this.deviceDialogOpen.set(false);
        this.messages.add({
          severity: 'success',
          summary: 'Device added',
          detail: displayName
        });
        this.loadContexts();
      },
      error: error => {
        this.messages.add({
          severity: 'error',
          summary: 'Device not added',
          detail: error.error?.message || 'Check the subscription and try again.'
        });
      }
    });
  }
  openNewResidence() {
    this.residenceLabel.set('');
    this.residenceDialogOpen.set(true);
  }
  saveResidence() {
    const label = this.residenceLabel().trim();
    if (!label || this.saving()) return;
    this.saving.set(true);
    this.iot.createResidence(label).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.saving.set(false))).subscribe({
      next: () => {
        this.residenceDialogOpen.set(false);
        this.messages.add({
          severity: 'success',
          summary: 'Residence added',
          detail: label
        });
        this.loadContexts();
      },
      error: error => {
        this.messages.add({
          severity: 'error',
          summary: 'Residence not added',
          detail: error.error?.message || 'Try again.'
        });
      }
    });
  }
  powerValue(device) {
    return String(device.shadow?.reported?.['power'] ?? '');
  }
  setPower(device) {
    const value = this.powerValue(device) === 'ON' ? 'OFF' : 'ON';
    this.sendCommand(device, {
      power: value
    });
  }
  setLock(device) {
    const value = device.shadow?.reported?.['lock'] === 'LOCKED' ? 'UNLOCK' : 'LOCK';
    this.sendCommand(device, {
      lock: value
    });
  }
  setTemperature(device) {
    this.sendCommand(device, {
      temperature: this.temperature()
    });
  }
  sendCommand(device, command) {
    this.iot.controlDevice(device.id, command).subscribe({
      next: () => {
        this.messages.add({
          severity: 'success',
          summary: 'Command sent',
          detail: device.displayName
        });
        const context = this.selectedContext();
        if (context) this.loadDashboard(context);
      },
      error: error => {
        this.messages.add({
          severity: 'error',
          summary: 'Command not sent',
          detail: error.error?.message || 'The device did not accept the command.'
        });
      }
    });
  }
  showDetails(device) {
    this.selectedDevice.set(device);
    this.latestState.set(null);
    this.detailsDialogOpen.set(true);
    this.iot.getDeviceState(device.id).subscribe({
      next: response => {
        const result = payloadOf(response);
        this.latestState.set(result.state ?? {});
      },
      error: () => this.latestState.set(device.shadow ?? {})
    });
  }
  confirmDelete(device) {
    this.confirmation.confirm({
      header: 'Remove device',
      message: `Remove ${device.displayName} from this residence?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remove',
      rejectLabel: 'Keep device',
      accept: () => this.removeDevice(device)
    });
  }
  removeDevice(device) {
    this.iot.deleteDevice(device.id).subscribe({
      next: () => {
        this.messages.add({
          severity: 'success',
          summary: 'Device removed',
          detail: device.displayName
        });
        this.detailsDialogOpen.set(false);
        this.loadContexts();
      },
      error: error => {
        this.messages.add({
          severity: 'error',
          summary: 'Device removal pending',
          detail: error.error?.message || 'Try again later.'
        });
      }
    });
  }
  acknowledgeAlert(eventId) {
    this.iot.acknowledgeAlert(eventId).subscribe({
      next: () => {
        const context = this.selectedContext();
        if (context) this.loadDashboard(context);
      },
      error: error => {
        this.messages.add({
          severity: 'error',
          summary: 'Alert not acknowledged',
          detail: error.error?.message || 'Try again.'
        });
      }
    });
  }
  deviceIcon(type) {
    const icons = {
      LIGHT: 'pi pi-sun',
      AIR_CONDITIONER: 'pi pi-sliders-h',
      SMART_LOCK: 'pi pi-lock',
      WATER_SENSOR: 'pi pi-exclamation-circle',
      ENERGY_METER: 'pi pi-chart-line',
      WATER_PUMP: 'pi pi-sync'
    };
    return icons[type];
  }
  statusText(device) {
    if (device.status === 'ERROR') return 'Needs attention';
    if (device.status !== 'ACTIVE') return 'Setting up';
    if (device.connectivity === 'ONLINE') return 'Online';
    if (device.connectivity === 'OFFLINE') return 'Offline';
    return 'Awaiting signal';
  }
  createIdempotencyKey() {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  static {
    this.ɵfac = function IoTDashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTDashboardComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: IoTDashboardComponent,
      selectors: [["app-iot-dashboard"]],
      standalone: false,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵProvidersFeature"]([primeng_api__WEBPACK_IMPORTED_MODULE_2__.MessageService, primeng_api__WEBPACK_IMPORTED_MODULE_2__.ConfirmationService])],
      decls: 45,
      vars: 33,
      consts: [["aria-labelledby", "smart-home-title", 1, "smart-home"], [1, "smart-home__header"], [1, "smart-home__eyebrow"], ["id", "smart-home-title"], [1, "smart-home__subtitle"], [1, "smart-home__context"], ["for", "context-select"], ["inputId", "context-select", "optionLabel", "label", "optionValue", "value", "placeholder", "Choose a place", "appendTo", "body", 3, "ngModelChange", "options", "ngModel", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-plus", "label", "Add device", "title", "Add a device to this place", 1, "smart-home__add", 3, "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-home", "label", "Add residence", 1, "p-button-text", "smart-home__residence"], ["severity", "error", 3, "text"], ["role", "status", 1, "smart-home__loading"], ["aria-live", "polite", 1, "smart-home__empty"], ["header", "Add a device", "styleClass", "iot-dialog", 3, "visibleChange", "visible", "modal"], [1, "device-form", 3, "ngSubmit"], ["for", "device-name"], ["pInputText", "", "id", "device-name", "name", "deviceName", "maxlength", "120", "required", "", 3, "ngModelChange", "ngModel"], ["for", "device-type"], ["inputId", "device-type", "name", "deviceType", "optionLabel", "label", "optionValue", "value", "appendTo", "body", 3, "ngModelChange", "options", "ngModel"], ["for", "device-location"], ["pInputText", "", "id", "device-location", "name", "location", "maxlength", "120", 3, "ngModelChange", "ngModel"], [1, "device-form__actions"], ["pButton", "", "type", "button", "label", "Cancel", 1, "p-button-text", 3, "click"], ["pButton", "", "type", "submit", "icon", "pi pi-plus", "label", "Add device", 3, "loading", "disabled"], ["header", "Add a residence", "styleClass", "iot-dialog", 3, "visibleChange", "visible", "modal"], ["for", "residence-label"], ["pInputText", "", "id", "residence-label", "name", "residenceLabel", "maxlength", "100", "required", "", 3, "ngModelChange", "ngModel"], ["pButton", "", "type", "submit", "icon", "pi pi-plus", "label", "Add residence", 3, "loading", "disabled"], ["header", "Device details", "styleClass", "iot-dialog", 3, "visibleChange", "visible", "modal"], [1, "device-detail"], ["pButton", "", "type", "button", "icon", "pi pi-plus", "label", "Add device", "title", "Add a device to this place", 1, "smart-home__add", 3, "click", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-home", "label", "Add residence", 1, "p-button-text", "smart-home__residence", 3, "click"], ["strokeWidth", "4"], ["aria-hidden", "true", 1, "smart-home__empty-icon", "pi", "pi-home"], ["pButton", "", "type", "button", "icon", "pi pi-plus", "label", "Add a residence", 3, "click"], ["aria-label", "Device summary", 1, "smart-home__metrics"], [1, "metric", "metric--primary"], [1, "metric"], [1, "metric", "metric--alert"], [1, "smart-home__notice"], ["aria-labelledby", "alerts-title", 1, "smart-home__alerts"], ["aria-labelledby", "devices-title", 1, "smart-home__devices"], [1, "section-heading"], ["id", "devices-title"], [1, "section-heading__count"], [1, "smart-home__empty", "smart-home__empty--compact"], [1, "device-grid"], ["aria-labelledby", "activity-title", 1, "smart-home__activity"], ["id", "activity-title"], [1, "activity-list"], [1, "activity-empty"], ["aria-hidden", "true", 1, "pi", "pi-info-circle"], ["id", "alerts-title"], [1, "alert-row", 3, "alert-row--critical"], [1, "alert-row"], ["pButton", "", "type", "button", "icon", "pi pi-check", "label", "Acknowledge", 1, "p-button-text", "p-button-sm", 3, "click"], ["aria-hidden", "true", 1, "smart-home__empty-icon", "pi", "pi-bolt"], ["pButton", "", "type", "button", "icon", "pi pi-plus", "label", "Add device", 3, "click", "disabled"], [1, "device-tile", 3, "device-tile--alert"], [1, "device-tile"], [1, "device-tile__top"], [1, "device-tile__icon"], ["aria-hidden", "true"], [3, "value", "severity"], [1, "device-tile__identity"], [1, "device-tile__location"], [1, "device-tile__type"], [1, "device-tile__state"], [1, "device-tile__actions"], ["pButton", "", "type", "button", 1, "p-button-rounded", "p-button-text", 3, "icon", "title", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-ellipsis-h", "title", "Device details", 1, "p-button-rounded", "p-button-text", 3, "click"], ["pButton", "", "type", "button", 1, "p-button-rounded", "p-button-text", 3, "click", "icon", "title", "disabled"], ["pButton", "", "type", "button", "title", "Toggle air conditioner", 1, "p-button-rounded", "p-button-text", 3, "click", "icon", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-snowflake", "title", "Set temperature", "aria-label", "Set temperature", 1, "p-button-rounded", "p-button-text", 3, "click", "disabled"], [1, "activity-list__marker"], ["pButton", "", "type", "button", "icon", "pi pi-trash", "label", "Remove device", 1, "p-button-danger", "p-button-outlined", 3, "click"]],
      template: function IoTDashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "main", 0)(1, "header", 1)(2, "div")(3, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "SMART HOME");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Your home, in sync.");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](8, " Devices and status for the place you selected. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "div", 5)(10, "label", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Home or unit");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "p-select", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function IoTDashboardComponent_Template_p_select_ngModelChange_12_listener($event) {
            return ctx.onContextChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](13, IoTDashboardComponent_Conditional_13_Template, 1, 1, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](14, IoTDashboardComponent_Conditional_14_Template, 1, 0, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](15, IoTDashboardComponent_Conditional_15_Template, 1, 1, "p-message", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](16, IoTDashboardComponent_Conditional_16_Template, 4, 0, "div", 11)(17, IoTDashboardComponent_Conditional_17_Template, 6, 1, "section", 12)(18, IoTDashboardComponent_Conditional_18_Template, 53, 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](19, "p-toast")(20, "p-confirmDialog");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "p-dialog", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("visibleChange", function IoTDashboardComponent_Template_p_dialog_visibleChange_21_listener($event) {
            return ctx.deviceDialogOpen.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "form", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function IoTDashboardComponent_Template_form_ngSubmit_22_listener() {
            return ctx.saveDevice();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "label", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24, "Device name");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "input", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function IoTDashboardComponent_Template_input_ngModelChange_25_listener($event) {
            return ctx.deviceName.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](26, "label", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](27, "Device type");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](28, "p-select", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function IoTDashboardComponent_Template_p_select_ngModelChange_28_listener($event) {
            return ctx.selectedDeviceType.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "label", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](30, "Room or location");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](31, "input", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function IoTDashboardComponent_Template_input_ngModelChange_31_listener($event) {
            return ctx.deviceLocation.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "div", 21)(33, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Template_button_click_33_listener() {
            return ctx.deviceDialogOpen.set(false);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](34, "button", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](35, "p-dialog", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("visibleChange", function IoTDashboardComponent_Template_p_dialog_visibleChange_35_listener($event) {
            return ctx.residenceDialogOpen.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](36, "form", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function IoTDashboardComponent_Template_form_ngSubmit_36_listener() {
            return ctx.saveResidence();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](37, "label", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](38, "Residence name");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](39, "input", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function IoTDashboardComponent_Template_input_ngModelChange_39_listener($event) {
            return ctx.residenceLabel.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "div", 21)(41, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function IoTDashboardComponent_Template_button_click_41_listener() {
            return ctx.residenceDialogOpen.set(false);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](42, "button", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](43, "p-dialog", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("visibleChange", function IoTDashboardComponent_Template_p_dialog_visibleChange_43_listener($event) {
            return ctx.detailsDialogOpen.set($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditionalCreate"](44, IoTDashboardComponent_Conditional_44_Template, 32, 14, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          let tmp_3_0;
          let tmp_6_0;
          let tmp_25_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("options", ctx.contexts().map(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵarrowFunction"](29, arrowFn0, ctx)))("ngModel", ctx.selectedContextId())("disabled", ctx.loading() || ctx.contexts().length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"]((tmp_3_0 = ctx.selectedContext()) ? 13 : -1, tmp_3_0);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.canAddResidence ? 14 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.errorMessage() ? 15 : -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"](ctx.loading() && !ctx.dashboard() ? 16 : !ctx.selectedContext() ? 17 : (tmp_6_0 = ctx.dashboard()) ? 18 : -1, tmp_6_0);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](30, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("visible", ctx.deviceDialogOpen())("modal", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.deviceName());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("options", ctx.deviceTypes)("ngModel", ctx.selectedDeviceType());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.deviceLocation());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("loading", ctx.saving())("disabled", !ctx.deviceName().trim() || ctx.saving());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](31, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("visible", ctx.residenceDialogOpen())("modal", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.residenceLabel());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("loading", ctx.saving())("disabled", !ctx.residenceLabel().trim() || ctx.saving());
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](32, _c1));
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("visible", ctx.detailsDialogOpen())("modal", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵconditional"]((tmp_25_0 = ctx.selectedDevice()) ? 44 : -1, tmp_25_0);
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgForm, primeng_button__WEBPACK_IMPORTED_MODULE_8__.ButtonDirective, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_9__.ConfirmDialog, primeng_dialog__WEBPACK_IMPORTED_MODULE_10__.Dialog, primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__.InputText, primeng_message__WEBPACK_IMPORTED_MODULE_12__.Message, primeng_select__WEBPACK_IMPORTED_MODULE_13__.Select, primeng_tag__WEBPACK_IMPORTED_MODULE_14__.Tag, primeng_toast__WEBPACK_IMPORTED_MODULE_15__.Toast, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_16__.ProgressSpinner, _angular_common__WEBPACK_IMPORTED_MODULE_17__.JsonPipe, _angular_common__WEBPACK_IMPORTED_MODULE_17__.DatePipe],
      styles: ["[_nghost-%COMP%] {\n  --iot-paper: #f5f8f5;\n  --iot-surface: #ffffff;\n  --iot-ink: #18372f;\n  --iot-muted: #6f817b;\n  --iot-line: #dce7e1;\n  --iot-green: #147454;\n  --iot-green-pale: #e4f2eb;\n  --iot-orange: #b95838;\n  --iot-orange-pale: #fbede6;\n  display: block;\n  min-height: 100%;\n  color: var(--iot-ink);\n}\n\n.smart-home[_ngcontent-%COMP%] {\n  min-height: 100%;\n  padding: 2rem clamp(1rem, 3vw, 2.5rem) 3rem;\n  background: var(--iot-paper);\n  animation: _ngcontent-%COMP%_reveal-in 360ms ease-out both;\n}\n\n.smart-home__header[_ngcontent-%COMP%], \n.section-heading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 1.5rem;\n}\n\n.smart-home__header[_ngcontent-%COMP%] {\n  margin: 0 auto 2rem;\n  max-width: 90rem;\n}\n\n.smart-home__eyebrow[_ngcontent-%COMP%] {\n  margin: 0 0 0.45rem;\n  color: var(--iot-green);\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n\n.smart-home[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.smart-home[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.smart-home[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.device-detail[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--iot-ink);\n}\n\n.smart-home[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  line-height: 1.15;\n}\n\n.smart-home__subtitle[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0;\n  color: var(--iot-muted);\n  font-size: 0.95rem;\n}\n\n.smart-home__context[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(12rem, 18rem) auto;\n  align-items: end;\n  gap: 0.6rem 0.75rem;\n  min-width: min(100%, 25rem);\n}\n\n.smart-home__context[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  color: var(--iot-muted);\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n\n.smart-home__context[_ngcontent-%COMP%]   p-select[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n\n.smart-home__residence[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  justify-self: start;\n  padding-inline: 0;\n}\n\n.smart-home__metrics[_ngcontent-%COMP%], \n.smart-home__devices[_ngcontent-%COMP%], \n.smart-home__activity[_ngcontent-%COMP%] {\n  max-width: 90rem;\n  margin-inline: auto;\n}\n\n.smart-home__metrics[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  border-block: 1px solid var(--iot-line);\n  margin-bottom: 2.25rem;\n}\n\n.metric[_ngcontent-%COMP%] {\n  min-height: 8rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  padding: 1rem 1.4rem;\n  border-right: 1px solid var(--iot-line);\n}\n\n.metric[_ngcontent-%COMP%]:first-child {\n  padding-left: 0.35rem;\n}\n\n.metric[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n\n.metric[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n\n.metric[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  margin-top: 0.35rem;\n  font-size: 2rem;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.metric[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 1rem;\n  font-weight: 500;\n}\n\n.metric[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  margin-top: 0.45rem;\n  color: var(--iot-muted);\n  font-size: 0.76rem;\n  font-style: normal;\n}\n\n.metric--primary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--iot-green);\n}\n\n.metric--alert[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--iot-orange);\n}\n\n.smart-home__notice[_ngcontent-%COMP%] {\n  max-width: 90rem;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  margin: 0 auto 2rem;\n  padding: 0.85rem 1rem;\n  border-left: 3px solid #cf8a3f;\n  background: #fff8e9;\n  color: #67451d;\n  font-size: 0.88rem;\n}\n\n.smart-home__alerts[_ngcontent-%COMP%] {\n  max-width: 90rem;\n  margin: 0 auto 2rem;\n  padding: 1rem;\n  border: 1px solid #e7c7b9;\n  border-radius: 8px;\n  background: #fff9f5;\n}\n\n.alert-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  min-height: 3.5rem;\n  border-top: 1px solid #f0ddd4;\n}\n\n.alert-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n}\n\n.alert-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #8d482f;\n  font-size: 0.9rem;\n  text-transform: capitalize;\n}\n\n.alert-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n}\n\n.alert-row--critical[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #a52d24;\n}\n\n.smart-home__devices[_ngcontent-%COMP%] {\n  margin-bottom: 2.5rem;\n}\n\n.section-heading[_ngcontent-%COMP%] {\n  align-items: center;\n  margin-bottom: 1rem;\n}\n\n.section-heading[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n}\n\n.section-heading__count[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 0.8rem;\n}\n\n.device-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.85rem;\n}\n\n.device-tile[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 16.5rem;\n  display: flex;\n  flex-direction: column;\n  padding: 1.15rem;\n  border: 1px solid var(--iot-line);\n  border-radius: 8px;\n  background: var(--iot-surface);\n  transition: border-color 160ms ease, transform 160ms ease;\n}\n\n.device-tile[_ngcontent-%COMP%]:hover {\n  border-color: #9fc9b5;\n  transform: translateY(-2px);\n}\n\n.device-tile--alert[_ngcontent-%COMP%] {\n  border-color: #e8b4a1;\n}\n\n.device-tile__top[_ngcontent-%COMP%], \n.device-tile__actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n\n.device-tile__icon[_ngcontent-%COMP%] {\n  width: 2.5rem;\n  height: 2.5rem;\n  display: grid;\n  place-items: center;\n  border-radius: 8px;\n  background: var(--iot-green-pale);\n  color: var(--iot-green);\n  font-size: 1.05rem;\n}\n\n.device-tile__icon--alert[_ngcontent-%COMP%] {\n  background: var(--iot-orange-pale);\n  color: var(--iot-orange);\n}\n\n.device-tile__identity[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.device-tile__location[_ngcontent-%COMP%], \n.device-tile__type[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--iot-muted);\n  font-size: 0.74rem;\n}\n\n.device-tile__identity[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0.2rem 0;\n  overflow-wrap: anywhere;\n  font-size: 1.05rem;\n}\n\n.device-tile__type[_ngcontent-%COMP%] {\n  text-transform: capitalize;\n}\n\n.device-tile__state[_ngcontent-%COMP%] {\n  min-height: 3.7rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-top: 0.65rem;\n  border-top: 1px solid var(--iot-line);\n}\n\n.device-tile__state[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  font-size: 1.15rem;\n}\n\n.device-tile__state[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n\n.device-tile__state[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-top: 0.15rem;\n  color: var(--iot-muted);\n  font-size: 0.72rem;\n}\n\n.device-tile__actions[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  margin-top: auto;\n}\n\n.smart-home__activity[_ngcontent-%COMP%] {\n  padding-top: 1.25rem;\n  border-top: 1px solid var(--iot-line);\n}\n\n.activity-list[_ngcontent-%COMP%] {\n  max-width: 54rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.activity-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  min-height: 2.75rem;\n  display: grid;\n  grid-template-columns: 0.5rem minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  border-bottom: 1px solid var(--iot-line);\n  color: var(--iot-ink);\n  font-size: 0.84rem;\n}\n\n.activity-list[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 0.74rem;\n}\n\n.activity-list__marker[_ngcontent-%COMP%] {\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 50%;\n  background: var(--iot-green);\n}\n\n.activity-list__marker--error[_ngcontent-%COMP%] {\n  background: var(--iot-orange);\n}\n\n.activity-empty[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n  font-size: 0.85rem;\n}\n\n.smart-home__empty[_ngcontent-%COMP%] {\n  max-width: 36rem;\n  display: grid;\n  justify-items: center;\n  gap: 0.8rem;\n  margin: 6vh auto;\n  padding: 2.5rem 1.5rem;\n  text-align: center;\n}\n\n.smart-home__empty--compact[_ngcontent-%COMP%] {\n  margin: 1rem auto;\n  padding: 2rem;\n  border: 1px dashed #b8cdc2;\n  border-radius: 8px;\n}\n\n.smart-home__empty-icon[_ngcontent-%COMP%] {\n  color: var(--iot-green);\n  font-size: 2rem;\n}\n\n.smart-home__empty[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.smart-home__empty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n\n.smart-home__empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 28rem;\n  margin: 0;\n  color: var(--iot-muted);\n  line-height: 1.5;\n}\n\n.smart-home__loading[_ngcontent-%COMP%] {\n  min-height: 16rem;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 1rem;\n  color: var(--iot-muted);\n}\n\n.device-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.6rem;\n}\n\n.device-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  margin-top: 0.55rem;\n  color: var(--iot-ink);\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n\n.device-form[_ngcontent-%COMP%]   p-select[_ngcontent-%COMP%], \n.device-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.device-form__actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n\n.device-detail[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n  font-size: 1.4rem;\n}\n\n.device-detail[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:not(.smart-home__eyebrow) {\n  color: var(--iot-muted);\n}\n\n.device-detail[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(7rem, 0.7fr) minmax(0, 1.3fr);\n  gap: 0.6rem;\n  padding-block: 1rem;\n  border-block: 1px solid var(--iot-line);\n  font-size: 0.84rem;\n}\n\n.device-detail[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--iot-muted);\n}\n\n.device-detail[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  overflow-wrap: anywhere;\n}\n\n.device-detail[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n  max-width: 100%;\n  margin: 0;\n  overflow: auto;\n  color: var(--iot-green);\n  font-size: 0.78rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n\n@keyframes _ngcontent-%COMP%_reveal-in {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 1050px) {\n  .device-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 720px) {\n  .smart-home[_ngcontent-%COMP%] {\n    padding: 1.25rem 1rem 2rem;\n  }\n  .smart-home__header[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 1.25rem;\n  }\n  .smart-home__context[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    min-width: 0;\n  }\n  .smart-home__metrics[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .metric[_ngcontent-%COMP%] {\n    min-height: 6.5rem;\n    padding: 0.85rem;\n    border-bottom: 1px solid var(--iot-line);\n  }\n  .metric[_ngcontent-%COMP%]:nth-child(2) {\n    border-right: 0;\n  }\n  .metric[_ngcontent-%COMP%]:nth-child(3) {\n    border-bottom: 0;\n  }\n  .metric[_ngcontent-%COMP%]:last-child {\n    border-bottom: 0;\n  }\n  .device-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .device-tile[_ngcontent-%COMP%] {\n    min-height: 15.5rem;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .smart-home[_ngcontent-%COMP%] {\n    animation: none;\n  }\n  .device-tile[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL2lvdC1kYXNoYm9hcmQvaW90LWRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSxvQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7RUFDQSwwQkFBQTtFQUNBLGNBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0FBQ0o7O0FBRUE7RUFDSSxnQkFBQTtFQUNBLDJDQUFBO0VBQ0EsNEJBQUE7RUFDQSx3Q0FBQTtBQUNKOztBQUVBOztFQUVJLGFBQUE7RUFDQSxxQkFBQTtFQUNBLDhCQUFBO0VBQ0EsV0FBQTtBQUNKOztBQUVBO0VBQ0ksbUJBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUVBO0VBQ0ksbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUFDSjs7QUFFQTs7OztFQUlJLFNBQUE7RUFDQSxxQkFBQTtBQUNKOztBQUVBO0VBQ0ksZUFBQTtFQUNBLGlCQUFBO0FBQ0o7O0FBRUE7RUFDSSxrQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLGFBQUE7RUFDQSxnREFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSwyQkFBQTtBQUNKOztBQUVBO0VBQ0ksaUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7QUFDSjs7QUFFQTtFQUNJLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtBQUNKOztBQUVBOzs7RUFHSSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0o7O0FBRUE7RUFDSSxhQUFBO0VBQ0EsZ0RBQUE7RUFDQSx1Q0FBQTtFQUNBLHNCQUFBO0FBQ0o7O0FBRUE7RUFDSSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHVCQUFBO0VBQ0Esb0JBQUE7RUFDQSx1Q0FBQTtBQUNKOztBQUVBO0VBQ0kscUJBQUE7QUFDSjs7QUFFQTtFQUNJLGVBQUE7QUFDSjs7QUFFQTtFQUNJLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUVBO0VBQ0ksbUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FBQ0o7O0FBRUE7RUFDSSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUVBO0VBQ0ksbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLHVCQUFBO0FBQ0o7O0FBRUE7RUFDSSx3QkFBQTtBQUNKOztBQUVBO0VBQ0ksZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBQ0o7O0FBRUE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtFQUNBLDZCQUFBO0FBQ0o7O0FBRUE7RUFDSSxhQUFBO0VBQ0EsV0FBQTtBQUNKOztBQUNBO0VBQ0ksY0FBQTtFQUNBLGlCQUFBO0VBQ0EsMEJBQUE7QUFFSjs7QUFBQTtFQUNJLHVCQUFBO0FBR0o7O0FBREE7RUFDSSxjQUFBO0FBSUo7O0FBREE7RUFDSSxxQkFBQTtBQUlKOztBQURBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtBQUlKOztBQURBO0VBQ0ksaUJBQUE7QUFJSjs7QUFEQTtFQUNJLHVCQUFBO0VBQ0EsaUJBQUE7QUFJSjs7QUFEQTtFQUNJLGFBQUE7RUFDQSxnREFBQTtFQUNBLFlBQUE7QUFJSjs7QUFEQTtFQUNJLFlBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUNBQUE7RUFDQSxrQkFBQTtFQUNBLDhCQUFBO0VBQ0EseURBQUE7QUFJSjs7QUFEQTtFQUNJLHFCQUFBO0VBQ0EsMkJBQUE7QUFJSjs7QUFEQTtFQUNJLHFCQUFBO0FBSUo7O0FBREE7O0VBRUksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7RUFDQSxXQUFBO0FBSUo7O0FBREE7RUFDSSxhQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUNBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0FBSUo7O0FBREE7RUFDSSxrQ0FBQTtFQUNBLHdCQUFBO0FBSUo7O0FBREE7RUFDSSxnQkFBQTtBQUlKOztBQURBOztFQUVJLFNBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0FBSUo7O0FBREE7RUFDSSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLDBCQUFBO0FBSUo7O0FBREE7RUFDSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0FBQTtBQUlKOztBQURBO0VBQ0ksdUJBQUE7RUFDQSxrQkFBQTtBQUlKOztBQURBO0VBQ0ksdUJBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0FBSUo7O0FBREE7RUFDSSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLHlCQUFBO0VBQ0EsZ0JBQUE7QUFJSjs7QUFEQTtFQUNJLG9CQUFBO0VBQ0EscUNBQUE7QUFJSjs7QUFEQTtFQUNJLGdCQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTtBQUlKOztBQURBO0VBQ0ksbUJBQUE7RUFDQSxhQUFBO0VBQ0EsaURBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7RUFDQSx3Q0FBQTtFQUNBLHFCQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLHVCQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLGNBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSw0QkFBQTtBQUlKOztBQURBO0VBQ0ksNkJBQUE7QUFJSjs7QUFEQTtFQUNJLHVCQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLHFCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtBQUlKOztBQURBO0VBQ0ksaUJBQUE7RUFDQSxhQUFBO0VBQ0EsMEJBQUE7RUFDQSxrQkFBQTtBQUlKOztBQURBO0VBQ0ksdUJBQUE7RUFDQSxlQUFBO0FBSUo7O0FBREE7O0VBRUksa0JBQUE7QUFJSjs7QUFEQTtFQUNJLGdCQUFBO0VBQ0EsU0FBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUFJSjs7QUFEQTtFQUNJLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLHFCQUFBO0VBQ0EscUJBQUE7RUFDQSxTQUFBO0VBQ0EsdUJBQUE7QUFJSjs7QUFEQTtFQUNJLGFBQUE7RUFDQSxXQUFBO0FBSUo7O0FBREE7RUFDSSxtQkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQUlKOztBQURBOztFQUVJLFdBQUE7QUFJSjs7QUFEQTtFQUNJLGFBQUE7RUFDQSx5QkFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtBQUlKOztBQURBO0VBQ0ksbUJBQUE7RUFDQSxpQkFBQTtBQUlKOztBQURBO0VBQ0ksdUJBQUE7QUFJSjs7QUFEQTtFQUNJLGFBQUE7RUFDQSwyREFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtFQUNBLHVDQUFBO0VBQ0Esa0JBQUE7QUFJSjs7QUFEQTtFQUNJLHVCQUFBO0FBSUo7O0FBREE7RUFDSSxTQUFBO0VBQ0EsdUJBQUE7QUFJSjs7QUFEQTtFQUNJLGVBQUE7RUFDQSxTQUFBO0VBQ0EsY0FBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxxQkFBQTtFQUNBLHVCQUFBO0FBSUo7O0FBREE7RUFDSTtJQUNJLFVBQUE7SUFDQSwwQkFBQTtFQUlOO0VBRkU7SUFDSSxVQUFBO0lBQ0Esd0JBQUE7RUFJTjtBQUNGO0FBREE7RUFDSTtJQUNJLGdEQUFBO0VBR047QUFDRjtBQUFBO0VBQ0k7SUFDSSwwQkFBQTtFQUVOO0VBQUU7SUFDSSxvQkFBQTtJQUNBLHNCQUFBO0lBQ0EsWUFBQTtFQUVOO0VBQUU7SUFDSSwwQ0FBQTtJQUNBLFlBQUE7RUFFTjtFQUFFO0lBQ0ksZ0RBQUE7RUFFTjtFQUFFO0lBQ0ksa0JBQUE7SUFDQSxnQkFBQTtJQUNBLHdDQUFBO0VBRU47RUFBRTtJQUNJLGVBQUE7RUFFTjtFQUFFO0lBQ0ksZ0JBQUE7RUFFTjtFQUFFO0lBQ0ksZ0JBQUE7RUFFTjtFQUFFO0lBQ0kscUNBQUE7RUFFTjtFQUFFO0lBQ0ksbUJBQUE7RUFFTjtBQUNGO0FBQ0E7RUFDSTtJQUNJLGVBQUE7RUFDTjtFQUNFO0lBQ0ksZ0JBQUE7RUFDTjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xyXG4gICAgLS1pb3QtcGFwZXI6ICNmNWY4ZjU7XHJcbiAgICAtLWlvdC1zdXJmYWNlOiAjZmZmZmZmO1xyXG4gICAgLS1pb3QtaW5rOiAjMTgzNzJmO1xyXG4gICAgLS1pb3QtbXV0ZWQ6ICM2ZjgxN2I7XHJcbiAgICAtLWlvdC1saW5lOiAjZGNlN2UxO1xyXG4gICAgLS1pb3QtZ3JlZW46ICMxNDc0NTQ7XHJcbiAgICAtLWlvdC1ncmVlbi1wYWxlOiAjZTRmMmViO1xyXG4gICAgLS1pb3Qtb3JhbmdlOiAjYjk1ODM4O1xyXG4gICAgLS1pb3Qtb3JhbmdlLXBhbGU6ICNmYmVkZTY7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LWluayk7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lIHtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICBwYWRkaW5nOiAycmVtIGNsYW1wKDFyZW0sIDN2dywgMi41cmVtKSAzcmVtO1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0taW90LXBhcGVyKTtcclxuICAgIGFuaW1hdGlvbjogcmV2ZWFsLWluIDM2MG1zIGVhc2Utb3V0IGJvdGg7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19oZWFkZXIsXHJcbi5zZWN0aW9uLWhlYWRpbmcge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMS41cmVtO1xyXG59XHJcblxyXG4uc21hcnQtaG9tZV9faGVhZGVyIHtcclxuICAgIG1hcmdpbjogMCBhdXRvIDJyZW07XHJcbiAgICBtYXgtd2lkdGg6IDkwcmVtO1xyXG59XHJcblxyXG4uc21hcnQtaG9tZV9fZXllYnJvdyB7XHJcbiAgICBtYXJnaW46IDAgMCAwLjQ1cmVtO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1ncmVlbik7XHJcbiAgICBmb250LXNpemU6IDAuN3JlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lIGgxLFxyXG4uc21hcnQtaG9tZSBoMixcclxuLnNtYXJ0LWhvbWUgaDMsXHJcbi5kZXZpY2UtZGV0YWlsIGgyIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtaW5rKTtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWUgaDEge1xyXG4gICAgZm9udC1zaXplOiAycmVtO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMTU7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19zdWJ0aXRsZSB7XHJcbiAgICBtYXJnaW46IDAuNXJlbSAwIDA7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LW11dGVkKTtcclxuICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2NvbnRleHQge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDEycmVtLCAxOHJlbSkgYXV0bztcclxuICAgIGFsaWduLWl0ZW1zOiBlbmQ7XHJcbiAgICBnYXA6IDAuNnJlbSAwLjc1cmVtO1xyXG4gICAgbWluLXdpZHRoOiBtaW4oMTAwJSwgMjVyZW0pO1xyXG59XHJcblxyXG4uc21hcnQtaG9tZV9fY29udGV4dCBsYWJlbCB7XHJcbiAgICBncmlkLWNvbHVtbjogMSAvIC0xO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1tdXRlZCk7XHJcbiAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG59XHJcblxyXG4uc21hcnQtaG9tZV9fY29udGV4dCBwLXNlbGVjdCB7XHJcbiAgICBtaW4td2lkdGg6IDA7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19yZXNpZGVuY2Uge1xyXG4gICAgZ3JpZC1jb2x1bW46IDEgLyAtMTtcclxuICAgIGp1c3RpZnktc2VsZjogc3RhcnQ7XHJcbiAgICBwYWRkaW5nLWlubGluZTogMDtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX21ldHJpY3MsXHJcbi5zbWFydC1ob21lX19kZXZpY2VzLFxyXG4uc21hcnQtaG9tZV9fYWN0aXZpdHkge1xyXG4gICAgbWF4LXdpZHRoOiA5MHJlbTtcclxuICAgIG1hcmdpbi1pbmxpbmU6IGF1dG87XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19tZXRyaWNzIHtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg0LCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICBib3JkZXItYmxvY2s6IDFweCBzb2xpZCB2YXIoLS1pb3QtbGluZSk7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyLjI1cmVtO1xyXG59XHJcblxyXG4ubWV0cmljIHtcclxuICAgIG1pbi1oZWlnaHQ6IDhyZW07XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgcGFkZGluZzogMXJlbSAxLjRyZW07XHJcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCB2YXIoLS1pb3QtbGluZSk7XHJcbn1cclxuXHJcbi5tZXRyaWM6Zmlyc3QtY2hpbGQge1xyXG4gICAgcGFkZGluZy1sZWZ0OiAwLjM1cmVtO1xyXG59XHJcblxyXG4ubWV0cmljOmxhc3QtY2hpbGQge1xyXG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xyXG59XHJcblxyXG4ubWV0cmljID4gc3BhbiB7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LW11dGVkKTtcclxuICAgIGZvbnQtc2l6ZTogMC42OHJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbn1cclxuXHJcbi5tZXRyaWMgc3Ryb25nIHtcclxuICAgIG1hcmdpbi10b3A6IDAuMzVyZW07XHJcbiAgICBmb250LXNpemU6IDJyZW07XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbn1cclxuXHJcbi5tZXRyaWMgc3Ryb25nIHNtYWxsIHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG4gICAgZm9udC1zaXplOiAxcmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxufVxyXG5cclxuLm1ldHJpYyBlbSB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjQ1cmVtO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1tdXRlZCk7XHJcbiAgICBmb250LXNpemU6IDAuNzZyZW07XHJcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XHJcbn1cclxuXHJcbi5tZXRyaWMtLXByaW1hcnkgc3Ryb25nIHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtZ3JlZW4pO1xyXG59XHJcblxyXG4ubWV0cmljLS1hbGVydCBzdHJvbmcge1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1vcmFuZ2UpO1xyXG59XHJcblxyXG4uc21hcnQtaG9tZV9fbm90aWNlIHtcclxuICAgIG1heC13aWR0aDogOTByZW07XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogMC43cmVtO1xyXG4gICAgbWFyZ2luOiAwIGF1dG8gMnJlbTtcclxuICAgIHBhZGRpbmc6IDAuODVyZW0gMXJlbTtcclxuICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgI2NmOGEzZjtcclxuICAgIGJhY2tncm91bmQ6ICNmZmY4ZTk7XHJcbiAgICBjb2xvcjogIzY3NDUxZDtcclxuICAgIGZvbnQtc2l6ZTogMC44OHJlbTtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2FsZXJ0cyB7XHJcbiAgICBtYXgtd2lkdGg6IDkwcmVtO1xyXG4gICAgbWFyZ2luOiAwIGF1dG8gMnJlbTtcclxuICAgIHBhZGRpbmc6IDFyZW07XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTdjN2I5O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZjlmNTtcclxufVxyXG5cclxuLmFsZXJ0LXJvdyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMXJlbTtcclxuICAgIG1pbi1oZWlnaHQ6IDMuNXJlbTtcclxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZjBkZGQ0O1xyXG59XHJcblxyXG4uYWxlcnQtcm93IHNwYW4ge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdhcDogMC4ycmVtO1xyXG59XHJcbi5hbGVydC1yb3cgc3Ryb25nIHtcclxuICAgIGNvbG9yOiAjOGQ0ODJmO1xyXG4gICAgZm9udC1zaXplOiAwLjlyZW07XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxufVxyXG4uYWxlcnQtcm93IHNtYWxsIHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG59XHJcbi5hbGVydC1yb3ctLWNyaXRpY2FsIHN0cm9uZyB7XHJcbiAgICBjb2xvcjogI2E1MmQyNDtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2RldmljZXMge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xyXG59XHJcblxyXG4uc2VjdGlvbi1oZWFkaW5nIHtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG59XHJcblxyXG4uc2VjdGlvbi1oZWFkaW5nIGgyIHtcclxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xyXG59XHJcblxyXG4uc2VjdGlvbi1oZWFkaW5nX19jb3VudCB7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LW11dGVkKTtcclxuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xyXG59XHJcblxyXG4uZGV2aWNlLWdyaWQge1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsIG1pbm1heCgwLCAxZnIpKTtcclxuICAgIGdhcDogMC44NXJlbTtcclxufVxyXG5cclxuLmRldmljZS10aWxlIHtcclxuICAgIG1pbi13aWR0aDogMDtcclxuICAgIG1pbi1oZWlnaHQ6IDE2LjVyZW07XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIHBhZGRpbmc6IDEuMTVyZW07XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb3QtbGluZSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1pb3Qtc3VyZmFjZSk7XHJcbiAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMTYwbXMgZWFzZSwgdHJhbnNmb3JtIDE2MG1zIGVhc2U7XHJcbn1cclxuXHJcbi5kZXZpY2UtdGlsZTpob3ZlciB7XHJcbiAgICBib3JkZXItY29sb3I6ICM5ZmM5YjU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbn1cclxuXHJcbi5kZXZpY2UtdGlsZS0tYWxlcnQge1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjZThiNGExO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX3RvcCxcclxuLmRldmljZS10aWxlX19hY3Rpb25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZ2FwOiAwLjVyZW07XHJcbn1cclxuXHJcbi5kZXZpY2UtdGlsZV9faWNvbiB7XHJcbiAgICB3aWR0aDogMi41cmVtO1xyXG4gICAgaGVpZ2h0OiAyLjVyZW07XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWlvdC1ncmVlbi1wYWxlKTtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtZ3JlZW4pO1xyXG4gICAgZm9udC1zaXplOiAxLjA1cmVtO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX2ljb24tLWFsZXJ0IHtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWlvdC1vcmFuZ2UtcGFsZSk7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LW9yYW5nZSk7XHJcbn1cclxuXHJcbi5kZXZpY2UtdGlsZV9faWRlbnRpdHkge1xyXG4gICAgbWFyZ2luLXRvcDogMXJlbTtcclxufVxyXG5cclxuLmRldmljZS10aWxlX19sb2NhdGlvbixcclxuLmRldmljZS10aWxlX190eXBlIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG4gICAgZm9udC1zaXplOiAwLjc0cmVtO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX2lkZW50aXR5IGgzIHtcclxuICAgIG1hcmdpbjogMC4ycmVtIDA7XHJcbiAgICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcclxuICAgIGZvbnQtc2l6ZTogMS4wNXJlbTtcclxufVxyXG5cclxuLmRldmljZS10aWxlX190eXBlIHtcclxuICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX3N0YXRlIHtcclxuICAgIG1pbi1oZWlnaHQ6IDMuN3JlbTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjY1cmVtO1xyXG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWlvdC1saW5lKTtcclxufVxyXG5cclxuLmRldmljZS10aWxlX19zdGF0ZSBzdHJvbmcge1xyXG4gICAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XHJcbiAgICBmb250LXNpemU6IDEuMTVyZW07XHJcbn1cclxuXHJcbi5kZXZpY2UtdGlsZV9fc3RhdGUgc3Ryb25nIHNtYWxsIHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG4gICAgZm9udC1zaXplOiAwLjhyZW07XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX3N0YXRlIHNwYW4ge1xyXG4gICAgbWFyZ2luLXRvcDogMC4xNXJlbTtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG4gICAgZm9udC1zaXplOiAwLjcycmVtO1xyXG59XHJcblxyXG4uZGV2aWNlLXRpbGVfX2FjdGlvbnMge1xyXG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuICAgIG1hcmdpbi10b3A6IGF1dG87XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19hY3Rpdml0eSB7XHJcbiAgICBwYWRkaW5nLXRvcDogMS4yNXJlbTtcclxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1pb3QtbGluZSk7XHJcbn1cclxuXHJcbi5hY3Rpdml0eS1saXN0IHtcclxuICAgIG1heC13aWR0aDogNTRyZW07XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgbGlzdC1zdHlsZTogbm9uZTtcclxufVxyXG5cclxuLmFjdGl2aXR5LWxpc3QgbGkge1xyXG4gICAgbWluLWhlaWdodDogMi43NXJlbTtcclxuICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDAuNXJlbSBtaW5tYXgoMCwgMWZyKSBhdXRvO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogMC44cmVtO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWlvdC1saW5lKTtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtaW5rKTtcclxuICAgIGZvbnQtc2l6ZTogMC44NHJlbTtcclxufVxyXG5cclxuLmFjdGl2aXR5LWxpc3QgdGltZSB7XHJcbiAgICBjb2xvcjogdmFyKC0taW90LW11dGVkKTtcclxuICAgIGZvbnQtc2l6ZTogMC43NHJlbTtcclxufVxyXG5cclxuLmFjdGl2aXR5LWxpc3RfX21hcmtlciB7XHJcbiAgICB3aWR0aDogMC40NXJlbTtcclxuICAgIGhlaWdodDogMC40NXJlbTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWlvdC1ncmVlbik7XHJcbn1cclxuXHJcbi5hY3Rpdml0eS1saXN0X19tYXJrZXItLWVycm9yIHtcclxuICAgIGJhY2tncm91bmQ6IHZhcigtLWlvdC1vcmFuZ2UpO1xyXG59XHJcblxyXG4uYWN0aXZpdHktZW1wdHkge1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1tdXRlZCk7XHJcbiAgICBmb250LXNpemU6IDAuODVyZW07XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19lbXB0eSB7XHJcbiAgICBtYXgtd2lkdGg6IDM2cmVtO1xyXG4gICAgZGlzcGxheTogZ3JpZDtcclxuICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuICAgIGdhcDogMC44cmVtO1xyXG4gICAgbWFyZ2luOiA2dmggYXV0bztcclxuICAgIHBhZGRpbmc6IDIuNXJlbSAxLjVyZW07XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19lbXB0eS0tY29tcGFjdCB7XHJcbiAgICBtYXJnaW46IDFyZW0gYXV0bztcclxuICAgIHBhZGRpbmc6IDJyZW07XHJcbiAgICBib3JkZXI6IDFweCBkYXNoZWQgI2I4Y2RjMjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2VtcHR5LWljb24ge1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1ncmVlbik7XHJcbiAgICBmb250LXNpemU6IDJyZW07XHJcbn1cclxuXHJcbi5zbWFydC1ob21lX19lbXB0eSBoMixcclxuLnNtYXJ0LWhvbWVfX2VtcHR5IGgzIHtcclxuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2VtcHR5IHAge1xyXG4gICAgbWF4LXdpZHRoOiAyOHJlbTtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuNTtcclxufVxyXG5cclxuLnNtYXJ0LWhvbWVfX2xvYWRpbmcge1xyXG4gICAgbWluLWhlaWdodDogMTZyZW07XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgcGxhY2UtY29udGVudDogY2VudGVyO1xyXG4gICAganVzdGlmeS1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxcmVtO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1tdXRlZCk7XHJcbn1cclxuXHJcbi5kZXZpY2UtZm9ybSB7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgZ2FwOiAwLjZyZW07XHJcbn1cclxuXHJcbi5kZXZpY2UtZm9ybSBsYWJlbCB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjU1cmVtO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1pbmspO1xyXG4gICAgZm9udC1zaXplOiAwLjhyZW07XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG59XHJcblxyXG4uZGV2aWNlLWZvcm0gcC1zZWxlY3QsXHJcbi5kZXZpY2UtZm9ybSBpbnB1dCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLmRldmljZS1mb3JtX19hY3Rpb25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gICAgZ2FwOiAwLjVyZW07XHJcbiAgICBtYXJnaW4tdG9wOiAxLjI1cmVtO1xyXG59XHJcblxyXG4uZGV2aWNlLWRldGFpbCBoMiB7XHJcbiAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xyXG4gICAgZm9udC1zaXplOiAxLjRyZW07XHJcbn1cclxuXHJcbi5kZXZpY2UtZGV0YWlsID4gcDpub3QoLnNtYXJ0LWhvbWVfX2V5ZWJyb3cpIHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG59XHJcblxyXG4uZGV2aWNlLWRldGFpbCBkbCB7XHJcbiAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtaW5tYXgoN3JlbSwgMC43ZnIpIG1pbm1heCgwLCAxLjNmcik7XHJcbiAgICBnYXA6IDAuNnJlbTtcclxuICAgIHBhZGRpbmctYmxvY2s6IDFyZW07XHJcbiAgICBib3JkZXItYmxvY2s6IDFweCBzb2xpZCB2YXIoLS1pb3QtbGluZSk7XHJcbiAgICBmb250LXNpemU6IDAuODRyZW07XHJcbn1cclxuXHJcbi5kZXZpY2UtZGV0YWlsIGR0IHtcclxuICAgIGNvbG9yOiB2YXIoLS1pb3QtbXV0ZWQpO1xyXG59XHJcblxyXG4uZGV2aWNlLWRldGFpbCBkZCB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcclxufVxyXG5cclxuLmRldmljZS1kZXRhaWwgcHJlIHtcclxuICAgIG1heC13aWR0aDogMTAwJTtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgY29sb3I6IHZhcigtLWlvdC1ncmVlbik7XHJcbiAgICBmb250LXNpemU6IDAuNzhyZW07XHJcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbiAgICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcclxufVxyXG5cclxuQGtleWZyYW1lcyByZXZlYWwtaW4ge1xyXG4gICAgZnJvbSB7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgIH1cclxuICAgIHRvIHtcclxuICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgIH1cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDEwNTBweCkge1xyXG4gICAgLmRldmljZS1ncmlkIHtcclxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgLnNtYXJ0LWhvbWUge1xyXG4gICAgICAgIHBhZGRpbmc6IDEuMjVyZW0gMXJlbSAycmVtO1xyXG4gICAgfVxyXG4gICAgLnNtYXJ0LWhvbWVfX2hlYWRlciB7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBnYXA6IDEuMjVyZW07XHJcbiAgICB9XHJcbiAgICAuc21hcnQtaG9tZV9fY29udGV4dCB7XHJcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtaW5tYXgoMCwgMWZyKSBhdXRvO1xyXG4gICAgICAgIG1pbi13aWR0aDogMDtcclxuICAgIH1cclxuICAgIC5zbWFydC1ob21lX19tZXRyaWNzIHtcclxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICB9XHJcbiAgICAubWV0cmljIHtcclxuICAgICAgICBtaW4taGVpZ2h0OiA2LjVyZW07XHJcbiAgICAgICAgcGFkZGluZzogMC44NXJlbTtcclxuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0taW90LWxpbmUpO1xyXG4gICAgfVxyXG4gICAgLm1ldHJpYzpudGgtY2hpbGQoMikge1xyXG4gICAgICAgIGJvcmRlci1yaWdodDogMDtcclxuICAgIH1cclxuICAgIC5tZXRyaWM6bnRoLWNoaWxkKDMpIHtcclxuICAgICAgICBib3JkZXItYm90dG9tOiAwO1xyXG4gICAgfVxyXG4gICAgLm1ldHJpYzpsYXN0LWNoaWxkIHtcclxuICAgICAgICBib3JkZXItYm90dG9tOiAwO1xyXG4gICAgfVxyXG4gICAgLmRldmljZS1ncmlkIHtcclxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1pbm1heCgwLCAxZnIpO1xyXG4gICAgfVxyXG4gICAgLmRldmljZS10aWxlIHtcclxuICAgICAgICBtaW4taGVpZ2h0OiAxNS41cmVtO1xyXG4gICAgfVxyXG59XHJcblxyXG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkge1xyXG4gICAgLnNtYXJ0LWhvbWUge1xyXG4gICAgICAgIGFuaW1hdGlvbjogbm9uZTtcclxuICAgIH1cclxuICAgIC5kZXZpY2UtdGlsZSB7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogbm9uZTtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ },

/***/ 30318
/*!***********************************************************************!*\
  !*** ./src/app/demo/components/iot-dashboard/iot-dashboard.module.ts ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IoTDashboardModule: () => (/* binding */ IoTDashboardModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 41716);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/confirmdialog */ 72737);
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/dialog */ 91623);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/inputtext */ 54132);
/* harmony import */ var primeng_message__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/message */ 80508);
/* harmony import */ var primeng_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/select */ 16419);
/* harmony import */ var primeng_tag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/tag */ 60905);
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/toast */ 20708);
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/progressspinner */ 62809);
/* harmony import */ var primeng_inputnumber__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/inputnumber */ 29294);
/* harmony import */ var _iot_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./iot-dashboard-routing.module */ 69631);
/* harmony import */ var _iot_dashboard_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./iot-dashboard.component */ 42959);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 94975);















class IoTDashboardModule {
  static {
    this.ɵfac = function IoTDashboardModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IoTDashboardModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineNgModule"]({
      type: IoTDashboardModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_2__.ButtonModule, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_3__.ConfirmDialogModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_4__.DialogModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputTextModule, primeng_inputnumber__WEBPACK_IMPORTED_MODULE_11__.InputNumberModule, primeng_message__WEBPACK_IMPORTED_MODULE_6__.MessageModule, primeng_select__WEBPACK_IMPORTED_MODULE_7__.SelectModule, primeng_tag__WEBPACK_IMPORTED_MODULE_8__.TagModule, primeng_toast__WEBPACK_IMPORTED_MODULE_9__.ToastModule, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_10__.ProgressSpinnerModule, _iot_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_12__.IoTDashboardRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵsetNgModuleScope"](IoTDashboardModule, {
    declarations: [_iot_dashboard_component__WEBPACK_IMPORTED_MODULE_13__.IoTDashboardComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, primeng_button__WEBPACK_IMPORTED_MODULE_2__.ButtonModule, primeng_confirmdialog__WEBPACK_IMPORTED_MODULE_3__.ConfirmDialogModule, primeng_dialog__WEBPACK_IMPORTED_MODULE_4__.DialogModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputTextModule, primeng_inputnumber__WEBPACK_IMPORTED_MODULE_11__.InputNumberModule, primeng_message__WEBPACK_IMPORTED_MODULE_6__.MessageModule, primeng_select__WEBPACK_IMPORTED_MODULE_7__.SelectModule, primeng_tag__WEBPACK_IMPORTED_MODULE_8__.TagModule, primeng_toast__WEBPACK_IMPORTED_MODULE_9__.ToastModule, primeng_progressspinner__WEBPACK_IMPORTED_MODULE_10__.ProgressSpinnerModule, _iot_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_12__.IoTDashboardRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_iot-dashboard_iot-dashboard_module_ts.js.map