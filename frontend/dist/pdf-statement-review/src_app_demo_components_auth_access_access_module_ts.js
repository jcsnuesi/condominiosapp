"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_access_access_module_ts"],{

/***/ 98550
/*!**********************************************************************!*\
  !*** ./src/app/demo/components/auth/access/access-routing.module.ts ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessRoutingModule: () => (/* binding */ AccessRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _access_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./access.component */ 15088);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);




class AccessRoutingModule {
  static {
    this.ɵfac = function AccessRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AccessRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: AccessRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: '',
        component: _access_component__WEBPACK_IMPORTED_MODULE_1__.AccessComponent
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AccessRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 15088
/*!*****************************************************************!*\
  !*** ./src/app/demo/components/auth/access/access.component.ts ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessComponent: () => (/* binding */ AccessComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/button */ 851);



const _c0 = () => ["/"];
class AccessComponent {
  static {
    this.ɵfac = function AccessComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AccessComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AccessComponent,
      selectors: [["app-access"]],
      standalone: false,
      decls: 14,
      vars: 2,
      consts: [[1, "surface-ground", "flex", "align-items-center", "justify-content-center", "min-h-screen", "min-w-screen", "overflow-hidden"], [1, "flex", "flex-column", "align-items-center", "justify-content-center"], ["src", "assets/demo/images/access/logo-orange.svg", "alt", "CondominiosApp", 1, "mb-5", "w-6rem", "flex-shrink-0"], [2, "border-radius", "56px", "padding", "0.3rem", "background", "linear-gradient(\n                    180deg,\n                    rgba(247, 149, 48, 0.4) 10%,\n                    rgba(247, 149, 48, 0) 30%\n                )"], [1, "w-full", "surface-card", "py-8", "px-5", "sm:px-8", "flex", "flex-column", "align-items-center", 2, "border-radius", "53px"], [1, "grid", "flex", "flex-column", "align-items-center"], [1, "flex", "justify-content-center", "align-items-center", "bg-orange-500", "border-circle", 2, "width", "3.2rem", "height", "3.2rem"], [1, "text-50", "pi", "pi-fw", "pi-lock", "text-2xl"], [1, "text-900", "font-bold", "text-4xl", "lg:text-5xl", "mb-2"], [1, "text-600", "mb-5"], ["src", "assets/demo/images/access/asset-access.svg", "alt", "Access denied", "width", "80%", 1, "mb-5"], ["pButton", "", "pRipple", "", "icon", "pi pi-arrow-left", "label", "Volver al inicio", 1, "p-button-text", 3, "routerLink"]],
      template: function AccessComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h1", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Acceso denegado ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "No tienes permisos para acceder a este recurso.");
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

/***/ 91103
/*!**************************************************************!*\
  !*** ./src/app/demo/components/auth/access/access.module.ts ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessModule: () => (/* binding */ AccessModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primeng/button */ 851);
/* harmony import */ var _access_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./access-routing.module */ 98550);
/* harmony import */ var _access_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./access.component */ 15088);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 94975);





class AccessModule {
  static {
    this.ɵfac = function AccessModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AccessModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({
      type: AccessModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _access_routing_module__WEBPACK_IMPORTED_MODULE_2__.AccessRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_1__.ButtonModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AccessModule, {
    declarations: [_access_component__WEBPACK_IMPORTED_MODULE_3__.AccessComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _access_routing_module__WEBPACK_IMPORTED_MODULE_2__.AccessRoutingModule, primeng_button__WEBPACK_IMPORTED_MODULE_1__.ButtonModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_access_access_module_ts.js.map