"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_auth_auth_module_ts"],{

/***/ 36509
/*!*************************************************************!*\
  !*** ./src/app/demo/components/auth/auth-routing.module.ts ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthRoutingModule: () => (/* binding */ AuthRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 94975);



class AuthRoutingModule {
  static {
    this.ɵfac = function AuthRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AuthRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule.forChild([{
        path: 'error',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_demo_components_auth_error_error_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./error/error.module */ 84673)).then(m => m.ErrorModule)
      }, {
        path: 'access',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_demo_components_auth_access_access_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./access/access.module */ 91103)).then(m => m.AccessModule)
      }, {
        path: 'login',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_demo_components_auth_login_login_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./login/login.module */ 30065)).then(m => m.LoginModule)
      }, {
        path: 'iot-register',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_demo_components_auth_iot-owner-register_iot-owner-register_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./iot-owner-register/iot-owner-register.module */ 91931)).then(m => m.IoTOwnerRegisterModule)
      }, {
        path: 'forgot-password',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_demo_components_auth_forgot-password_forgot-password_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./forgot-password/forgot-password.module */ 32213)).then(m => m.ForgotPasswordModule)
      }, {
        path: 'reset-password',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_demo_components_auth_reset-password_reset-password_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./reset-password/reset-password.module */ 2365)).then(m => m.ResetPasswordModule)
      }, {
        path: '**',
        redirectTo: '/notfound'
      }]), _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AuthRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterModule]
  });
})();

/***/ },

/***/ 46084
/*!*****************************************************!*\
  !*** ./src/app/demo/components/auth/auth.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthModule: () => (/* binding */ AuthModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 20145);
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth-routing.module */ 36509);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 58440);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 94975);



class AuthModule {
  static {
    this.ɵfac = function AuthModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: AuthModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__.AuthRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AuthModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__.AuthRoutingModule]
  });
})();

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_auth_auth_module_ts.js.map