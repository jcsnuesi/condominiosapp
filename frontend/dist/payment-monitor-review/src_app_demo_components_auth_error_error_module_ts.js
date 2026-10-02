"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_error_error_module_ts"],{

/***/ 57680
/*!********************************************************************!*\
  !*** ./src/app/demo/components/auth/error/error-routing.module.ts ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorRoutingModule: () => (/* binding */ ErrorRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _error_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.component */ 71022);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class ErrorRoutingModule {
  static {
    this.ɵfac = function ErrorRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ErrorRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: ErrorRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _error_component__WEBPACK_IMPORTED_MODULE_1__.ErrorComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ErrorRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 71022
/*!***************************************************************!*\
  !*** ./src/app/demo/components/auth/error/error.component.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorComponent: () => (/* binding */ ErrorComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/button */ 851);



const _c0 = () => ["/"];
class ErrorComponent {
  static {
    this.ɵfac = function ErrorComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ErrorComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ErrorComponent,
      selectors: [["app-error"]],
      standalone: false,
      decls: 14,
      vars: 2,
      consts: [[1, "surface-ground", "flex", "align-items-center", "justify-content-center", "min-h-screen", "min-w-screen", "overflow-hidden"], [1, "flex", "flex-column", "align-items-center", "justify-content-center"], ["src", "assets/demo/images/error/logo-error.svg", "alt", "CondominiosApp", 1, "mb-5", "w-6rem", "flex-shrink-0"], [2, "border-radius", "56px", "padding", "0.3rem", "background", "linear-gradient(\n                    180deg,\n                    rgba(233, 30, 99, 0.4) 10%,\n                    rgba(33, 150, 243, 0) 30%\n                )"], [1, "w-full", "surface-card", "py-8", "px-5", "sm:px-8", "flex", "flex-column", "align-items-center", 2, "border-radius", "53px"], [1, "grid", "flex", "flex-column", "align-items-center"], [1, "flex", "justify-content-center", "align-items-center", "bg-pink-500", "border-circle", 2, "height", "3.2rem", "width", "3.2rem"], [1, "pi", "pi-fw", "pi-exclamation-circle", "text-2xl", "text-white"], [1, "text-900", "font-bold", "text-5xl", "mb-2"], [1, "text-600", "mb-5"], ["src", "assets/demo/images/error/asset-error.svg", "alt", "Error", "width", "80%", 1, "mb-5"], ["pButton", "", "pRipple", "", "icon", "pi pi-arrow-left", "label", "Volver al inicio", 1, "p-button-text", 3, "routerLink"]],
      template: function ErrorComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h1", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Ocurrio un error ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "El recurso solicitado no esta disponible.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 10)(13, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, primeng_button__WEBPACK_IMPORTED_MODULE_2__.ButtonDirective],
      encapsulation: 2
    });
  }
}

/***/ },

/***/ 84673
/*!************************************************************!*\
  !*** ./src/app/demo/components/auth/error/error.module.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorModule: () => (/* binding */ ErrorModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _error_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error-routing.module */ 57680);
/* harmony import */ var _error_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error.component */ 71022);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 94975);





class ErrorModule {
  static {
    this.ɵfac = function ErrorModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ErrorModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({
      type: ErrorModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _error_routing_module__WEBPACK_IMPORTED_MODULE_1__.ErrorRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](ErrorModule, {
    declarations: [_error_component__WEBPACK_IMPORTED_MODULE_2__.ErrorComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _error_routing_module__WEBPACK_IMPORTED_MODULE_1__.ErrorRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_3__.ButtonModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_error_error_module_ts.js.map