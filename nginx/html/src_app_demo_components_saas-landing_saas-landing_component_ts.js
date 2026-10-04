"use strict";
(self["webpackChunksakai_ng"] = self["webpackChunksakai_ng"] || []).push([["src_app_demo_components_saas-landing_saas-landing_component_ts"],{

/***/ 90982
/*!*********************************************************************!*\
  !*** ./src/app/demo/components/saas-landing/account-destination.ts ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   accountDestination: () => (/* binding */ accountDestination)
/* harmony export */ });
/** Navigation hint only. Protected routes and the API still validate the session. */
function accountDestination(identity, token, access, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!identity || typeof identity !== 'object') return null;
  const user = identity;
  if (typeof user['_id'] !== 'string' || !user['_id'] || typeof user['role'] !== 'string') return null;
  const role = user['role'].toUpperCase();
  if (!['ADMIN', 'STAFF_ADMIN', 'STAFF', 'OWNER', 'FAMILY'].includes(role)) return null;
  try {
    const parts = token.replace(/^Bearer\s+/i, '').replace(/['"]+/g, '').split('.');
    if (parts.length !== 3 || !parts[2]) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const payload = JSON.parse(decoded);
    if (typeof payload['exp'] !== 'number' || payload['exp'] <= nowSeconds || payload['sub'] !== user['_id'] || typeof payload['role'] !== 'string' || payload['role'].toUpperCase() !== role) return null;
    if (role === 'ADMIN' && access?.onboardingRequired) return ['/onboarding'];
    if (role === 'OWNER' && !user['organizationId']) return ['/smart-home'];
    return ['/start', user['_id']];
  } catch {
    return null;
  }
}

/***/ },

/***/ 28197
/*!************************************************************************!*\
  !*** ./src/app/demo/components/saas-landing/saas-landing.component.ts ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SaasLandingComponent: () => (/* binding */ SaasLandingComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 94975);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 86808);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ 25735);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _account_destination__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./account-destination */ 90982);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 58440);








const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.question;
const _forTrack2 = ($index, $item) => $item.name;
function SaasLandingComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "a", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_41_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Ir a mi cuenta");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", ctx);
  }
}
function SaasLandingComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "a", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_42_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function SaasLandingComponent_For_95_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_For_95_Template_button_click_0_listener() {
      const item_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.selectedPreview.set(item_r5.key));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("id", "tab-" + item_r5.key)("tabIndex", ctx_r1.selectedPreview() === item_r5.key ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-controls", "panel-" + item_r5.key)("aria-selected", ctx_r1.selectedPreview() === item_r5.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r5.label);
  }
}
function SaasLandingComponent_For_97_For_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](column_r6);
  }
}
function SaasLandingComponent_For_97_For_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "tr")(1, "th", 118);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "td")(6, "span", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const row_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](row_r7.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](row_r7.detail);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](row_r7.status);
  }
}
function SaasLandingComponent_For_97_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 58)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "table")(6, "caption", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "thead")(9, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](10, SaasLandingComponent_For_97_For_11_Template, 2, 1, "th", 116, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](13, SaasLandingComponent_For_97_For_14_Template, 8, 3, "tr", null, _forTrack2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "div", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](16, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("id", "panel-" + item_r8.key)("hidden", ctx_r1.selectedPreview() !== item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-labelledby", "tab-" + item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("id", ctx_r1.selectedPreview() === item_r8.key ? "preview-heading" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r8.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r8.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", item_r8.label, ": datos de ejemplo");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](item_r8.columns);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](item_r8.rows);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r8.note);
  }
}
function SaasLandingComponent_For_111_For_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tag_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](tag_r9);
  }
}
function SaasLandingComponent_For_111_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "article", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "svg", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "use");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p", 121);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "ul", 122);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](10, SaasLandingComponent_For_111_For_11_Template, 2, 1, "li", null, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const service_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("href", "#saas-" + (service_r10.key === "management" ? "building" : service_r10.key));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](service_r10.subtitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](service_r10.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](service_r10.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](service_r10.tags);
  }
}
function SaasLandingComponent_For_278_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "details")(1, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](3, "span", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r11.question);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](item_r11.answer);
  }
}
class SaasLandingComponent {
  constructor() {
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_5__.UserService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_4__.AccessContextService);
    this.title = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Title);
    this.meta = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Meta);
    this.document = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT);
    this.previousTitle = this.title.getTitle();
    this.previousDescription = this.meta.getTag('name="description"')?.content;
    this.session = this.readSession();
    this.menuOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "menuOpen"
    }] : /* istanbul ignore next */[]));
    this.selectedPreview = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('finance', ...(ngDevMode ? [{
      debugName: "selectedPreview"
    }] : /* istanbul ignore next */[]));
    this.accountLink = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.computed)(() => (0,_account_destination__WEBPACK_IMPORTED_MODULE_6__.accountDestination)(this.session.identity, this.session.token, this.access.access()), ...(ngDevMode ? [{
      debugName: "accountLink"
    }] : /* istanbul ignore next */[]));
    this.previews = [{
      key: 'finance',
      label: 'Finanzas',
      title: 'Cada movimiento, en su lugar.',
      description: 'Consulta cuotas, cargos y pagos. Mantén a mano el estado de cuenta de cada unidad.',
      columns: ['Unidad', 'Concepto', 'Estado'],
      rows: [{
        name: 'A-101',
        detail: 'Cuota de mantenimiento',
        status: 'Registrada'
      }, {
        name: 'A-102',
        detail: 'Pago de cuota',
        status: 'Aplicado'
      }, {
        name: 'B-201',
        detail: 'Estado de cuenta',
        status: 'Disponible'
      }],
      note: 'Cuotas · Comprobantes · Conciliación · Reportes'
    }, {
      key: 'bookings',
      label: 'Reservas',
      title: 'Espacios compartidos, bien coordinados.',
      description: 'Organiza las reservas de áreas comunes y consulta las visitas asociadas a cada unidad.',
      columns: ['Espacio', 'Reserva', 'Estado'],
      rows: [{
        name: 'Salón social',
        detail: 'Unidad A-101 · Sábado',
        status: 'Reservado'
      }, {
        name: 'Área de BBQ',
        detail: 'Unidad B-201 · Domingo',
        status: 'Reservado'
      }, {
        name: 'Visitas',
        detail: 'Consulta de invitados',
        status: 'Disponible'
      }],
      note: 'Áreas comunes · Calendario · Invitados'
    }, {
      key: 'documents',
      label: 'Documentos',
      title: 'La información que todos necesitan.',
      description: 'Reúne documentos, atiende consultas y organiza la comunicación con los propietarios.',
      columns: ['Documento', 'Categoría', 'Estado'],
      rows: [{
        name: 'Reglamento',
        detail: 'Convivencia',
        status: 'Disponible'
      }, {
        name: 'Aviso de mantenimiento',
        detail: 'Comunicación',
        status: 'Publicado'
      }, {
        name: 'Consulta de propietario',
        detail: 'Solicitud',
        status: 'Recibida'
      }],
      note: 'Documentos · Consultas · Comunicaciones'
    }, {
      key: 'home',
      label: 'Smart Home',
      title: 'Tu vivienda también tiene su espacio.',
      description: 'Consulta y controla tus dispositivos compatibles desde una cuenta personal o un contexto del condominio.',
      columns: ['Dispositivo', 'Ubicación', 'Estado'],
      rows: [{
        name: 'Luz de entrada',
        detail: 'Casa principal',
        status: 'Encendida'
      }, {
        name: 'Sensor de puerta',
        detail: 'Entrada',
        status: 'Cerrada'
      }, {
        name: 'Historial de eventos',
        detail: 'Actividad de dispositivos',
        status: 'Disponible'
      }],
      note: 'Requiere dispositivos compatibles y suscripción habilitada'
    }];
    this.services = [{
      key: 'management',
      name: 'Una administración organizada',
      subtitle: 'Condominios y personas',
      description: 'Gestiona condominios, unidades, propietarios y personal dentro de tu organización.',
      tags: ['Unidades', 'Propietarios', 'Personal']
    }, {
      key: 'finance',
      name: 'Las cuentas, claras',
      subtitle: 'Finanzas y cobranza',
      description: 'Registra cuotas, cargos y pagos. Consulta estados de cuenta, conciliación y reportes financieros.',
      tags: ['Cuotas y pagos', 'Conciliación', 'Reportes']
    }, {
      key: 'bookings',
      name: 'Un espacio para cada reserva',
      subtitle: 'Reservas y visitas',
      description: 'Coordina las áreas comunes y mantén organizada la información de reservas e invitados.',
      tags: ['Calendario', 'Áreas comunes', 'Visitas']
    }, {
      key: 'documents',
      name: 'La información, a mano',
      subtitle: 'Documentos y comunicación',
      description: 'Comparte documentos y avisos, recibe consultas y da seguimiento a las solicitudes de los propietarios.',
      tags: ['Documentos', 'Avisos', 'Consultas']
    }, {
      key: 'rentals',
      name: 'Estancias mejor coordinadas',
      subtitle: 'Alquileres temporales',
      description: 'Consulta reservas de alquiler temporal y sincroniza calendarios mediante las integraciones disponibles.',
      tags: ['Estancias', 'Calendarios', 'Integraciones']
    }, {
      key: 'home',
      name: 'Una vivienda más conectada',
      subtitle: 'Smart Home',
      description: 'Gestiona dispositivos compatibles, consulta su estado y revisa su actividad en viviendas o condominios.',
      tags: ['Dispositivos', 'Control', 'Historial']
    }];
    this.questions = [{
      question: '¿Qué tipo de cuenta necesito?',
      answer: 'Elige ADMIN si vas a administrar condominios y sus propietarios. Elige OWNER personal si quieres gestionar tu vivienda y sus dispositivos Smart Home. El registro te ayuda a elegir antes de crear tu cuenta.'
    }, {
      question: '¿Cómo entro si mi condominio ya usa CondominiosApp?',
      answer: 'Tu administración crea tu cuenta, te asigna el condominio y la unidad, y te envía las credenciales por correo. Con esas credenciales puedes iniciar sesión. Si ya tienes cuenta y olvidaste tu contraseña, puedes recuperarla desde el acceso.'
    }, {
      question: '¿Puedo administrar varios condominios?',
      answer: 'Sí. La cuenta ADMIN permite registrar y gestionar varios condominios dentro de tu propia organización, con sus unidades y propietarios.'
    }, {
      question: '¿Qué sucede después de crear mi cuenta?',
      answer: 'Recibirás un enlace para verificar tu correo. Después podrás iniciar sesión y configurar tu organización o vivienda. Los enlaces vencen en 24 horas y puedes solicitar un nuevo envío desde el registro.'
    }, {
      question: '¿Qué necesito para usar Smart Home?',
      answer: 'Necesitas dispositivos compatibles y una suscripción IoT habilitada para tu vivienda o contexto del condominio. La disponibilidad de las funciones depende de los dispositivos y de la configuración de tu cuenta.'
    }];
    this.title.setTitle('Gestión de condominios y Smart Home | CondominiosApp');
    this.meta.updateTag({
      name: 'description',
      content: 'Organiza condominios, propietarios, finanzas, reservas y documentos con CondominiosApp. Crea tu cuenta de administración o gestiona tu vivienda personal.'
    });
  }
  closeMenu() {
    this.menuOpen.set(false);
  }
  focusContent() {
    this.document.getElementById('main-content')?.focus();
  }
  moveTab(event) {
    const index = this.previews.findIndex(item => item.key === this.selectedPreview());
    const next = event.key === 'ArrowRight' ? (index + 1) % this.previews.length : event.key === 'ArrowLeft' ? (index + this.previews.length - 1) % this.previews.length : event.key === 'Home' ? 0 : event.key === 'End' ? this.previews.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    this.selectedPreview.set(this.previews[next].key);
    const tablist = event.target.closest('[role="tablist"]');
    tablist?.querySelectorAll('[role="tab"]')[next]?.focus();
  }
  ngOnDestroy() {
    this.title.setTitle(this.previousTitle);
    if (this.previousDescription === undefined) this.meta.removeTag('name="description"');else this.meta.updateTag({
      name: 'description',
      content: this.previousDescription
    });
  }
  readSession() {
    try {
      return {
        identity: this.user.getIdentity(),
        token: this.user.getToken() || ''
      };
    } catch {
      return {
        identity: null,
        token: ''
      };
    }
  }
  static {
    this.ɵfac = function SaasLandingComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SaasLandingComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: SaasLandingComponent,
      selectors: [["app-saas-landing"]],
      decls: 313,
      vars: 7,
      consts: [["lang", "es", 1, "saas-page"], ["routerLink", "/", "fragment", "main-content", 1, "skip-link", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "aria-hidden", "true", 1, "symbol-library"], ["id", "saas-building", "viewBox", "0 0 32 32"], ["d", "M5 28V7l12-3v24M17 12h10v16M2 28h28M9 10h3m-3 5h3m-3 5h3m9-4h2m-2 5h2M9 28v-4h4v4"], ["id", "saas-finance", "viewBox", "0 0 32 32"], ["d", "M5 5h22v23H5zM10 11h12M10 16h4m4 0h4M10 21h4m4 0h4"], ["id", "saas-bookings", "viewBox", "0 0 32 32"], ["d", "M5 7h22v21H5zM10 3v8m12-8v8M5 13h22m-17 5h4m4 0h4m-12 5h4"], ["id", "saas-documents", "viewBox", "0 0 32 32"], ["d", "M7 3h12l6 6v20H7zM19 3v7h6M12 16h8m-8 5h8"], ["id", "saas-rentals", "viewBox", "0 0 32 32"], ["d", "m3 15 13-11 13 11M7 12v16h18V12M13 28v-9h6v9"], ["id", "saas-home", "viewBox", "0 0 32 32"], ["d", "m3 16 13-12 13 12M7 13v15h18V13M12 14a6 6 0 0 1 8 0m-6 4a3 3 0 0 1 4 0"], ["cx", "16", "cy", "22", "r", "1"], [1, "site-header", 3, "keydown.escape"], [1, "header-inner"], ["routerLink", "/", "aria-label", "CondominiosApp, inicio", 1, "brand", 3, "click"], ["aria-hidden", "true", 1, "brand-mark"], ["href", "#saas-building"], [1, "brand-accent"], ["type", "button", "aria-controls", "public-navigation", 1, "menu-toggle", 3, "click"], ["aria-hidden", "true", 1, "menu-lines"], ["id", "public-navigation", "aria-label", "Navegaci\u00F3n principal"], [1, "section-links"], ["routerLink", "/", "fragment", "servicios", 3, "click"], ["routerLink", "/", "fragment", "como-comenzar", 3, "click"], ["routerLink", "/", "fragment", "preguntas", 3, "click"], [1, "header-actions"], [1, "sign-in", 3, "routerLink"], ["routerLink", "/auth/login", 1, "sign-in"], ["routerLink", "/auth/register", 1, "button", "button-small", 3, "click"], ["aria-hidden", "true"], ["id", "main-content", "tabindex", "-1"], ["aria-labelledby", "hero-title", 1, "hero", "container"], [1, "hero-copy"], [1, "eyebrow"], ["aria-hidden", "true", 1, "small-square"], ["id", "hero-title"], [1, "hero-description"], [1, "hero-actions"], ["routerLink", "/auth/register", 1, "button"], ["routerLink", "/", "fragment", "servicios", 1, "text-link"], [1, "hero-caption"], ["aria-labelledby", "preview-heading", 1, "product-preview"], [1, "preview-top"], [1, "preview-brand"], [1, "illustration-label"], ["aria-hidden", "true", 1, "community-drawing"], ["viewBox", "0 0 460 134", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 117h435", 1, "drawing-ground"], ["d", "M158 117V26l78-16v107Z", 1, "drawing-fill"], ["d", "M158 117V26l78-16v107M236 43h68v74M135 117V60h23M304 74h32v43M143 34l15-8"], ["d", "M174 37h12v13h-12zM202 31h12v13h-12zM174 64h12v13h-12zM202 59h12v13h-12zM174 91h12v13h-12zM202 86h12v13h-12zM254 58h12v12h-12zM281 58h10v12h-10zM254 86h12v12h-12zM281 86h10v12h-10z"], ["d", "M71 116V91m0 11c-32-5-21-37 0-39 21 2 32 34 0 39M383 116V95m0 8c-24-4-17-28 0-30 17 2 24 26 0 30M111 117h15m224 0h15"], ["role", "tablist", "aria-label", "Explorar funciones del producto", 1, "preview-tabs", 3, "keydown"], ["type", "button", "role", "tab", 3, "id", "tabIndex"], ["role", "tabpanel", "tabindex", "0", 1, "preview-body", 3, "id", "hidden"], ["id", "servicios", "aria-labelledby", "services-title", 1, "services-section", "section-padding"], [1, "container"], [1, "section-intro"], ["id", "services-title"], [1, "services-grid"], [1, "service-card"], [1, "availability-note"], ["id", "para-quien", "aria-labelledby", "audience-title", 1, "audience-section", "container", "section-padding"], ["id", "audience-title"], [1, "audience-grid"], [1, "audience-card"], [1, "account-label"], ["routerLink", "/auth/register", 1, "text-link"], [1, "sr-only"], [1, "audience-card", "personal-card"], [1, "account-label", "personal-label"], [1, "resident-note"], ["routerLink", "/auth/login"], ["id", "como-comenzar", "aria-labelledby", "steps-title", 1, "getting-started", "section-padding"], [1, "container", "journey-layout"], [1, "journey-intro", "section-intro"], ["id", "steps-title"], [1, "journey-resident"], ["aria-label", "Recorrido desde el registro hasta tu espacio", 1, "account-journey"], [1, "journey-choice"], [1, "journey-branches"], [1, "journey-branch"], [1, "journey-role"], ["href", "#saas-home"], ["viewBox", "0 0 600 64", "preserveAspectRatio", "none", "aria-hidden", "true", 1, "journey-connector"], ["d", "M150 0v14q0 12 12 12h126q12 0 12 12v26M450 0v14q0 12-12 12H312q-12 0-12 12"], ["d", "m295 57 5 6 5-6", 1, "journey-arrow"], [1, "journey-verification"], ["aria-hidden", "true", 1, "mail-stamp"], ["viewBox", "0 0 32 32"], ["d", "M4 8h24v17H4zM4 8l12 10L28 8"], ["d", "M300 0v14q0 12-12 12H162q-12 0-12 12v26M300 14q0 12 12 12h126q12 0 12 12v26"], ["d", "m145 57 5 6 5-6m290 0 5 6 5-6", 1, "journey-arrow"], [1, "journey-arrival"], [1, "journey-end"], ["id", "preguntas", "aria-labelledby", "faq-title", 1, "faq-section", "container", "section-padding"], [1, "faq-intro"], ["id", "faq-title"], [1, "faq-list"], ["aria-labelledby", "closing-title", 1, "closing-section"], [1, "container", "closing-inner"], ["id", "closing-title"], [1, "site-footer", "container"], ["routerLink", "/", 1, "brand"], ["aria-label", "Navegaci\u00F3n del pie de p\u00E1gina"], ["routerLink", "/", "fragment", "servicios"], ["routerLink", "/", "fragment", "preguntas"], ["routerLink", "/auth/register"], [1, "footer-detail"], [1, "sign-in", 3, "click", "routerLink"], ["routerLink", "/auth/login", 1, "sign-in", 3, "click"], ["type", "button", "role", "tab", 3, "click", "id", "tabIndex"], ["scope", "col"], [1, "preview-note"], ["scope", "row"], [1, "row-status"], ["aria-hidden", "true", 1, "service-icon"], [1, "service-category"], ["aria-label", "Funciones incluidas", 1, "service-tags"], ["aria-hidden", "true", 1, "faq-toggle"]],
      template: function SaasLandingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "a", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_1_listener() {
            return ctx.focusContent();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "Saltar al contenido");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "svg", 2)(4, "defs")(5, "symbol", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](6, "path", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "symbol", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "path", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "symbol", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](10, "path", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "symbol", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](12, "path", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "symbol", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](14, "path", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "symbol", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](16, "path", 14)(17, "circle", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "header", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("keydown.escape", function SaasLandingComponent_Template_header_keydown_escape_18_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "div", 17)(20, "a", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_20_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "svg", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](22, "use", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "span", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](26, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](27, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_button_click_27_listener() {
            return ctx.menuOpen.set(!ctx.menuOpen());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](29, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](30, "span")(31, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "nav", 24)(33, "div", 25)(34, "a", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_34_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](35, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](36, "a", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_36_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](37, "C\u00F3mo funciona");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](38, "a", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_38_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](39, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](40, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditionalCreate"](41, SaasLandingComponent_Conditional_41_Template, 2, 1, "a", 30)(42, SaasLandingComponent_Conditional_42_Template, 2, 0, "a", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](43, "a", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_43_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](44, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](45, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](46, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](47, "main", 34)(48, "section", 35)(49, "div", 36)(50, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](51, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](52, " ADMINISTRACI\u00D3N Y VIDA EN COMUNIDAD");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](53, "h1", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](54, "Tu condominio,");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](55, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](56, "organizado en");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](57, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](58, "em");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](59, "un solo lugar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](60, "p", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](61, "De las cuotas a las reservas, de los documentos a tu vivienda. Un espacio para gestionar lo que hace funcionar tu comunidad.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](62, "div", 41)(63, "a", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](64, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](65, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](66, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](67, "a", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](68, "Explorar servicios ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](69, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](70, "\u2193");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](71, "div", 44)(72, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](73, "Para administrar condominios.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](74, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](75, "Para gestionar tu vivienda.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](76, "section", 45)(77, "div", 46)(78, "span", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](79, "svg", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](80, "use", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](81, "Tu comunidad");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](82, "span", 48);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](83, "VISTA ILUSTRATIVA");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](84, "div", 49);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](85, "svg", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](86, "path", 51)(87, "path", 52)(88, "path", 53)(89, "path", 54)(90, "path", 55);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](91, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](92, "Residencial Jardines \u00B7 Ejemplo");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](93, "div", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("keydown", function SaasLandingComponent_Template_div_keydown_93_listener($event) {
            return ctx.moveTab($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](94, SaasLandingComponent_For_95_Template, 2, 5, "button", 57, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](96, SaasLandingComponent_For_97_Template, 18, 8, "div", 58, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](98, "section", 59)(99, "div", 60)(100, "div", 61)(101, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](102, "LO QUE PUEDES GESTIONAR");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](103, "h2", 62);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](104, "Menos tareas dispersas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](105, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](106, "M\u00E1s espacio para administrar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](107, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](108, "Re\u00FAne la operaci\u00F3n de tu condominio en herramientas que trabajan dentro de tu organizaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](109, "div", 63);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](110, SaasLandingComponent_For_111_Template, 12, 4, "article", 64, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](112, "p", 65);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](113, "La disponibilidad de los m\u00F3dulos depende de la configuraci\u00F3n de tu cuenta. Smart Home requiere dispositivos compatibles y una suscripci\u00F3n habilitada.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](114, "section", 66)(115, "div", 61)(116, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](117, "UN LUGAR PARA CADA NECESIDAD");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](118, "h2", 67);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](119, "Elige c\u00F3mo quieres comenzar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](120, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](121, "Dos tipos de cuenta. Un registro que te gu\u00EDa hacia el que necesitas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](122, "div", 68)(123, "article", 69)(124, "span", 70);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](125, "ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](126, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](127, "Para quienes administran");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](128, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](129, "una comunidad.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](130, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](131, "Crea tu organizaci\u00F3n y gestiona uno o varios condominios, sus unidades y propietarios. Puede ser una empresa administradora o la administraci\u00F3n de tu propio condominio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](132, "ul")(133, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](134, "Condominios y unidades en una organizaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](135, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](136, "Propietarios con acceso a su informaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](137, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](138, "Finanzas, reservas y comunicaci\u00F3n centralizadas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](139, "a", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](140, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](141, "span", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](142, "para administrar condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](143, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](144, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](145, "article", 73)(146, "span", 74);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](147, "OWNER PERSONAL");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](148, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](149, "Para quienes gestionan");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](150, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](151, "su propia vivienda.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](152, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](153, "Registra tu vivienda personal y re\u00FAne sus dispositivos Smart Home en tu propia cuenta, sin depender de una administraci\u00F3n de condominio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](154, "ul")(155, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](156, "Tu vivienda bajo tu propia cuenta.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](157, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](158, "Estado y control de dispositivos compatibles.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](159, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](160, "Historial de actividad de tu hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](161, "a", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](162, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](163, "span", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](164, "para mi vivienda personal");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](165, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](166, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](167, "aside", 75);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](168, "svg", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](169, "use", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](170, "div")(171, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](172, "\u00BFTu condominio ya utiliza CondominiosApp?");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](173, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](174, "Tu administraci\u00F3n crea tu acceso, te asigna el condominio y la unidad, y te env\u00EDa las credenciales por correo.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](175, "a", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](176, "Iniciar sesi\u00F3n ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](177, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](178, "\u2192");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](179, "section", 77)(180, "div", 78)(181, "div", 79)(182, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](183, "AS\u00CD EMPIEZA TU CUENTA");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](184, "h2", 80);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](185, "Un punto de partida.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](186, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](187, "Tu propio camino.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](188, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](189, "Empieza por lo que necesitas gestionar. El registro te acompa\u00F1a hasta entrar a tu organizaci\u00F3n o a tu vivienda.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](190, "a", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](191, "Crear cuenta y comenzar ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](192, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](193, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](194, "p", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](195, "\u00BFYa formas parte de un condominio?");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](196, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](197, "Tu administraci\u00F3n te env\u00EDa el acceso. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](198, "a", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](199, "Inicia sesi\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](200, ".");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](201, "ol", 82)(202, "li", 83)(203, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](204, "\u00BFQu\u00E9 quieres gestionar?");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](205, "div", 84)(206, "div", 85);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](207, "svg", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](208, "use", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](209, "span", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](210, "ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](211, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](212, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](213, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](214, "Tu organizaci\u00F3n, sus unidades ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](215, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](216, "y sus propietarios.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](217, "div", 85);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](218, "svg", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](219, "use", 87);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](220, "span", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](221, "OWNER PERSONAL");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](222, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](223, "Mi vivienda");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](224, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](225, "Tu hogar y sus dispositivos ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](226, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](227, "Smart Home.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](228, "svg", 88);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](229, "path", 89)(230, "path", 90);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](231, "li", 91)(232, "span", 92);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](233, "svg", 93);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](234, "path", 94);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](235, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](236, "Verifica tu correo");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](237, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](238, "Completa el registro y abre el enlace que recibir\u00E1s.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](239, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](240, "Ese es el paso que activa tu cuenta.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](241, "svg", 88);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](242, "path", 95)(243, "path", 96);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](244, "li", 97)(245, "h3", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](246, "Inicia sesi\u00F3n y configura tu espacio");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](247, "div", 84)(248, "div", 85)(249, "span", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](250, "EN TU ORGANIZACI\u00D3N");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](251, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](252, "Tu primer condominio");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](253, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](254, "Inicia sesi\u00F3n y sigue la gu\u00EDa para a\u00F1adir condominios, unidades y propietarios.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](255, "span", 98);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](256, "Tu administraci\u00F3n empieza aqu\u00ED");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](257, "div", 85)(258, "span", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](259, "EN TU VIVIENDA");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](260, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](261, "Tu espacio personal");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](262, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](263, "Inicia sesi\u00F3n y configura tu vivienda y los dispositivos compatibles que quieras conectar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](264, "span", 98);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](265, "Tu hogar empieza aqu\u00ED");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](266, "section", 99)(267, "div", 100)(268, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](269, "ANTES DE COMENZAR");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](270, "h2", 101);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](271, "Algunas preguntas,");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](272, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](273, "respuestas claras.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](274, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](275, "Lo que necesitas saber para dar el primer paso.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](276, "div", 102);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeaterCreate"](277, SaasLandingComponent_For_278_Template, 6, 2, "details", null, _forTrack1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](279, "section", 103)(280, "div", 104)(281, "div")(282, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](283, "TU PR\u00D3XIMO PASO");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](284, "h2", 105);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](285, "Comienza con la cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](286, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](287, "que necesitas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](288, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](289, "Tu organizaci\u00F3n o tu vivienda. El registro te ayuda a elegir.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](290, "a", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](291, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](292, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](293, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](294, "footer", 106)(295, "div")(296, "a", 107);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](297, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](298, "span", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](299, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](300, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](301, "Gesti\u00F3n de condominios y vivienda personal.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](302, "nav", 108)(303, "a", 109);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](304, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](305, "a", 110);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](306, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](307, "a", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](308, "Iniciar sesi\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](309, "a", 111);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](310, "Crear cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](311, "span", 112);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](312, "La comunidad empieza con un espacio bien organizado.");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_4_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-expanded", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx.menuOpen() ? "Cerrar men\u00FA" : "Men\u00FA", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵconditional"]((tmp_4_0 = ctx.accountLink()) ? 41 : 42, tmp_4_0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](53);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](ctx.services);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](167);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrepeater"](ctx.questions);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink],
      styles: ["[_nghost-%COMP%] { display: block; }\n.saas-page[_ngcontent-%COMP%] { --canvas: #f7f6f3; --surface: #fff; --ink: #2f3437; --muted: #626960; --line: #eaeaea; --green: #346538; --pastel: #edf3ec; color: var(--ink); background: var(--canvas); font-family: 'Helvetica Neue', system-ui, sans-serif; font-size: 15px; line-height: 1.6; }\n.saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] { box-sizing: border-box; }\n.container[_ngcontent-%COMP%] { width: min(1200px, calc(100% - 96px)); margin-inline: auto; }\n.saas-page[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { color: inherit; text-decoration: none; }\n.saas-page[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { font: inherit; cursor: pointer; }\n.saas-page[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(a,button,summary,[tabindex]):focus-visible { outline: 2px solid var(--green); outline-offset: 5px; }\n.saas-page[_ngcontent-%COMP%]   :is(section[id][_ngcontent-%COMP%], main[id][_ngcontent-%COMP%]) { scroll-margin-top: 104px; }\n.symbol-library[_ngcontent-%COMP%] { position: absolute; width: 0; height: 0; overflow: hidden; }\nsvg[_ngcontent-%COMP%] { fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }\n.sr-only[_ngcontent-%COMP%] { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }\n.skip-link[_ngcontent-%COMP%] { position: fixed; top: 12px; left: 12px; z-index: 100; padding: 12px 20px; background: var(--surface); border: 1px solid var(--ink); transform: translateY(-200%); }\n.skip-link[_ngcontent-%COMP%]:focus { transform: translateY(0); }\n.site-header[_ngcontent-%COMP%] { position: sticky; top: 0; z-index: 20; background: var(--canvas); border-bottom: 1px solid var(--line); }\n.header-inner[_ngcontent-%COMP%] { max-width: 1360px; margin: auto; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; gap: 28px; }\n.brand[_ngcontent-%COMP%] { display: inline-flex; align-items: center; font-size: 20px; font-weight: 650; letter-spacing: -.055em; white-space: nowrap; }\n.brand-mark[_ngcontent-%COMP%] { width: 30px; height: 30px; margin-right: 10px; color: var(--green); }\n.brand-accent[_ngcontent-%COMP%] { color: var(--green); }\n#public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 26px; }\n#public-navigation[_ngcontent-%COMP%] { flex: 1; justify-content: flex-end; }\n.section-links[_ngcontent-%COMP%] { font-size: 13px; }\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { text-underline-offset: 5px; }\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .sign-in[_ngcontent-%COMP%]:hover { text-decoration: underline; }\n.header-actions[_ngcontent-%COMP%] { gap: 20px; margin-left: 14px; }\n.sign-in[_ngcontent-%COMP%] { font-size: 13px; }\n.button[_ngcontent-%COMP%] { display: inline-flex; align-items: center; justify-content: center; gap: 30px; min-height: 48px; padding: 14px 22px; background: #111; color: #fff !important; border: 1px solid #111; border-radius: 5px; font-size: 14px; font-weight: 500; transition: background .18s, transform .18s; }\n.button[_ngcontent-%COMP%]:hover { background: #333; }\n.button[_ngcontent-%COMP%]:active { transform: scale(.98); }\n.button-small[_ngcontent-%COMP%] { min-height: 40px; padding: 9px 16px; gap: 20px; font-size: 13px; }\n.menu-toggle[_ngcontent-%COMP%] { display: none; }\n.hero[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1.04fr; align-items: center; gap: 64px; padding-block: 72px 86px; }\n.eyebrow[_ngcontent-%COMP%] { font-size: 10px; font-weight: 600; letter-spacing: .13em; line-height: 1.8; margin: 0 0 24px; color: var(--muted); }\n.hero[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 10px; }\n.small-square[_ngcontent-%COMP%] { display: inline-block; width: 6px; height: 6px; flex-shrink: 0; background: var(--green); }\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], p[_ngcontent-%COMP%] { margin-top: 0; }\nh1[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: clamp(40px, 4.7vw, 64px); font-weight: 400; line-height: 1.06; letter-spacing: -.055em; margin-bottom: 28px; }\nh1[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] { color: var(--green); font-style: italic; }\n.hero-description[_ngcontent-%COMP%] { font-size: 16px; line-height: 1.8; max-width: 390px; color: var(--muted); margin-bottom: 28px; }\n.hero-actions[_ngcontent-%COMP%] { display: flex; align-items: center; flex-wrap: wrap; gap: 24px; }\n.text-link[_ngcontent-%COMP%] { display: inline-flex; align-items: center; gap: 14px; font-size: 13px; font-weight: 550; text-underline-offset: 5px; }\n.text-link[_ngcontent-%COMP%]:hover { text-decoration: underline; }\n.hero-caption[_ngcontent-%COMP%] { border-top: 1px solid #deded8; margin-top: 34px; padding-top: 16px; display: flex; flex-direction: column; color: var(--muted); font-size: 11px; line-height: 1.8; }\n.product-preview[_ngcontent-%COMP%] { min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }\n.preview-top[_ngcontent-%COMP%] { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 24px; border-bottom: 1px solid var(--line); }\n.preview-brand[_ngcontent-%COMP%] { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; }\n.preview-brand[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] { width: 21px; height: 21px; color: var(--green); }\n.illustration-label[_ngcontent-%COMP%] { color: var(--muted); font-size: 8px; letter-spacing: .1em; }\n.community-drawing[_ngcontent-%COMP%] { position: relative; background: #f9faf8; padding: 0 20px 12px; text-align: center; }\n.community-drawing[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] { width: 100%; height: 124px; stroke-width: 1.1; color: #5a725b; display: block; }\n.community-drawing[_ngcontent-%COMP%]   .drawing-fill[_ngcontent-%COMP%] { fill: #edf3ec; }\n.community-drawing[_ngcontent-%COMP%]   .drawing-ground[_ngcontent-%COMP%] { stroke: #cdd5cb; }\n.community-drawing[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 9px; color: var(--muted); letter-spacing: .03em; }\n.preview-tabs[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4,1fr); padding: 0 16px; border-bottom: 1px solid var(--line); }\n.preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { background: transparent; border: 0; border-bottom: 2px solid transparent; padding: 15px 0 12px; color: var(--muted); font-size: 11px; white-space: nowrap; }\n.preview-tabs[_ngcontent-%COMP%]   button[aria-selected=true][_ngcontent-%COMP%] { border-bottom-color: var(--green); color: var(--green); font-weight: 650; }\n.preview-body[_ngcontent-%COMP%] { padding: 24px; }\n.preview-body[hidden][_ngcontent-%COMP%] { display: none; }\n.preview-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { font-size: 16px; font-weight: 550; line-height: 1.4; margin-bottom: 8px; }\n.preview-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 11px; color: var(--muted); line-height: 1.7; min-height: 38px; margin-bottom: 20px; }\n.preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] { width: 100%; border-collapse: collapse; text-align: left; font-size: 10px; table-layout: fixed; }\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { font-weight: 500; }\n.preview-body[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { font-size: 9px; padding-bottom: 10px; color: var(--muted); }\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child { width: 31%; }\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child { width: 25%; }\n.preview-body[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   :is(th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]) { border-top: 1px solid var(--line); padding: 12px 8px 12px 0; overflow-wrap: anywhere; }\n.row-status[_ngcontent-%COMP%] { display: inline-block; padding: 3px 6px; background: var(--pastel); color: var(--green); font-size: 9px; border-radius: 3px; }\n.preview-note[_ngcontent-%COMP%] { display: flex; align-items: baseline; gap: 7px; border-top: 1px solid var(--line); padding-top: 15px; margin-top: 4px; font-size: 9px; color: var(--muted); min-height: 32px; }\n.preview-note[_ngcontent-%COMP%]   .small-square[_ngcontent-%COMP%] { width: 4px; height: 4px; }\n.section-padding[_ngcontent-%COMP%] { padding-block: 88px; }\n.section-intro[_ngcontent-%COMP%] { max-width: 650px; margin-bottom: 40px; }\n.section-intro[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%], .faq-intro[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%], .closing-inner[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%] { margin-bottom: 16px; }\n.section-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .faq-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .closing-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: clamp(30px, 3.4vw, 43px); font-weight: 400; line-height: 1.15; letter-spacing: -.04em; margin-bottom: 18px; }\n.section-intro[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]:last-child { max-width: 510px; color: var(--muted); font-size: 14px; line-height: 1.8; }\n.services-section[_ngcontent-%COMP%] { background: var(--surface); border-block: 1px solid var(--line); }\n.services-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }\n.service-card[_ngcontent-%COMP%] { padding: 28px; border: 1px solid var(--line); border-radius: 8px; display: flex; flex-direction: column; align-items: flex-start; }\n.service-icon[_ngcontent-%COMP%] { width: 32px; height: 32px; color: var(--green); margin-bottom: 26px; }\n.service-category[_ngcontent-%COMP%] { font-size: 10px; color: var(--muted); margin-bottom: 8px; }\n.service-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { font-size: 19px; font-weight: 500; letter-spacing: -.02em; line-height: 1.3; margin-bottom: 14px; }\n.service-card[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]:not(.service-category) { font-size: 13px; color: var(--muted); line-height: 1.8; margin-bottom: 24px; }\n.service-tags[_ngcontent-%COMP%] { padding: 0; margin: auto 0 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }\n.service-tags[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { font-size: 9px; padding: 4px 7px; background: #f5f6f3; border-radius: 3px; color: #565e54; }\n.availability-note[_ngcontent-%COMP%] { font-size: 11px; color: var(--muted); max-width: 750px; margin: 24px 0 0; }\n.audience-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }\n.audience-card[_ngcontent-%COMP%] { padding: 36px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); display: flex; flex-direction: column; align-items: flex-start; }\n.personal-card[_ngcontent-%COMP%] { background: #f1f4ef; }\n.account-label[_ngcontent-%COMP%] { display: inline-block; background: var(--pastel); color: var(--green); font-size: 10px; letter-spacing: .08em; padding: 5px 9px; border-radius: 3px; margin-bottom: 28px; }\n.personal-label[_ngcontent-%COMP%] { background: #e2e9de; }\n.audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { font-family: Georgia, serif; font-weight: 400; font-size: 30px; line-height: 1.2; letter-spacing: -.03em; margin-bottom: 18px; }\n.audience-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { font-size: 13px; color: var(--muted); line-height: 1.8; }\n.audience-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] { padding-left: 16px; margin: 8px 0 28px; }\n.audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { padding-left: 4px; margin-bottom: 6px; }\n.audience-card[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%] { margin-top: auto; border-top: 1px solid var(--line); padding-top: 24px; width: 100%; justify-content: space-between; }\n.resident-note[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 22px; margin-top: 28px; padding: 24px 28px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }\n.resident-note[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] { width: 30px; height: 30px; flex-shrink: 0; color: var(--green); }\n.resident-note[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { font-size: 14px; font-weight: 550; margin-bottom: 4px; }\n.resident-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 12px; color: var(--muted); margin-bottom: 0; }\n.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { font-size: 12px; white-space: nowrap; text-decoration: underline; text-underline-offset: 4px; margin-left: auto; }\n.getting-started[_ngcontent-%COMP%] { background: var(--surface); border-block: 1px solid var(--line); }\n.journey-layout[_ngcontent-%COMP%] { display: grid; grid-template-columns: .85fr 1.15fr; gap: 80px; align-items: center; }\n.journey-intro[_ngcontent-%COMP%] { margin-bottom: 0; }\n.journey-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { max-width: 420px; }\n.journey-intro[_ngcontent-%COMP%] > p[_ngcontent-%COMP%] { color: var(--muted); font-size: 14px; line-height: 1.8; max-width: 350px; }\n.journey-intro[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%] { margin-top: 16px; }\n.journey-intro[_ngcontent-%COMP%]   .journey-resident[_ngcontent-%COMP%] { font-size: 12px; margin: 40px 0 0; }\n.journey-resident[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { text-decoration: underline; text-underline-offset: 3px; }\n.account-journey[_ngcontent-%COMP%] { list-style: none; margin: 0; padding: 0; text-align: center; }\n.account-journey[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { font-size: 16px; font-weight: 500; margin: 0 0 24px; }\n.journey-branches[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }\n.journey-branch[_ngcontent-%COMP%] { min-width: 0; }\n.journey-branch[_ngcontent-%COMP%] > svg[_ngcontent-%COMP%] { display: block; width: 34px; height: 34px; margin: 0 auto 12px; color: var(--green); }\n.journey-role[_ngcontent-%COMP%] { display: block; font-size: 9px; letter-spacing: .09em; color: var(--green); margin-bottom: 8px; }\n.journey-branch[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { font-family: Georgia, serif; font-size: 23px; font-weight: 400; letter-spacing: -.025em; line-height: 1.2; margin: 0 0 10px; }\n.account-journey[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 12px; color: var(--muted); line-height: 1.75; margin: 0 auto; max-width: 230px; }\n.journey-connector[_ngcontent-%COMP%] { display: block; width: 100%; height: 56px; margin: 20px 0; stroke: #b5c7b2; stroke-width: 1; }\n.journey-arrow[_ngcontent-%COMP%] { stroke: var(--green); }\n.mail-stamp[_ngcontent-%COMP%] { display: inline-flex; color: var(--green); margin-bottom: 8px; }\n.mail-stamp[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] { width: 26px; height: 26px; }\n.journey-verification[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin-bottom: 8px; }\n.journey-verification[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { max-width: 360px; }\n.journey-end[_ngcontent-%COMP%] { display: inline-block; color: var(--green); font-size: 10px; border-top: 1px solid var(--line); margin-top: 18px; padding-top: 12px; }\n@media (max-width: 960px) { .journey-layout[_ngcontent-%COMP%] { gap: 32px; grid-template-columns: .8fr 1.2fr; } .journey-branches[_ngcontent-%COMP%] { gap: 16px; } .journey-branch[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { font-size: 20px; } }\n@media (max-width: 700px) { .journey-layout[_ngcontent-%COMP%] { grid-template-columns: 1fr; gap: 44px; } .journey-intro[_ngcontent-%COMP%]   .journey-resident[_ngcontent-%COMP%] { margin-top: 24px; } .journey-connector[_ngcontent-%COMP%] { height: 44px; } .journey-branch[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { font-size: 21px; } .journey-role[_ngcontent-%COMP%] { font-size: 8px; } .account-journey[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 11px; } .journey-end[_ngcontent-%COMP%] { font-size: 9px; } .journey-branch[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   br[_ngcontent-%COMP%] { display: none; } }\n.faq-section[_ngcontent-%COMP%] { display: grid; grid-template-columns: .85fr 1.15fr; gap: 64px; }\n.faq-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 13px; color: var(--muted); }\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%] { border-bottom: 1px solid #deded8; }\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]:first-child { border-top: 1px solid #deded8; }\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] { list-style: none; cursor: pointer; padding: 22px 0; display: flex; align-items: center; justify-content: space-between; gap: 24px; font-size: 14px; font-weight: 500; }\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::-webkit-details-marker { display: none; }\n.faq-toggle[_ngcontent-%COMP%]::after { content: '+'; display: block; font-size: 20px; font-weight: 400; color: var(--green); }\ndetails[open][_ngcontent-%COMP%]   .faq-toggle[_ngcontent-%COMP%]::after { content: '\u2212'; }\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 13px; color: var(--muted); line-height: 1.8; margin-bottom: 24px; padding-right: 26px; }\n.closing-section[_ngcontent-%COMP%] { background: var(--pastel); border-block: 1px solid var(--line); padding-block: 64px; }\n.closing-inner[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 40px; }\n.closing-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin-bottom: 16px; }\n.closing-inner[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child { font-size: 13px; color: var(--muted); margin-bottom: 0; }\n.site-footer[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr auto; gap: 30px; padding-block: 40px; }\n.site-footer[_ngcontent-%COMP%]   .brand[_ngcontent-%COMP%] { font-size: 19px; }\n.site-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { font-size: 11px; color: var(--muted); margin: 8px 0 0; }\n.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%] { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 24px; font-size: 12px; padding-top: 4px; }\n.footer-detail[_ngcontent-%COMP%] { grid-column: 1/-1; border-top: 1px solid #deded8; padding-top: 20px; font-size: 10px; color: var(--muted); }\n@media (min-width: 961px) and (prefers-reduced-motion: no-preference) { .hero-copy[_ngcontent-%COMP%], .product-preview[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_arrive .6s ease-out both; } .product-preview[_ngcontent-%COMP%] { animation-delay: .1s; } }\n@keyframes _ngcontent-%COMP%_arrive { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n@media (max-width: 1100px) { .header-inner[_ngcontent-%COMP%] { padding-inline: 32px; gap: 20px; } #public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%] { gap: 16px; } .header-actions[_ngcontent-%COMP%] { margin-left: 0; gap: 14px; } .hero[_ngcontent-%COMP%] { gap: 32px; } .service-card[_ngcontent-%COMP%] { padding: 24px; } }\n@media (max-width: 960px) { .container[_ngcontent-%COMP%] { width: calc(100% - 64px); } .header-inner[_ngcontent-%COMP%] { flex-wrap: wrap; padding-block: 16px; } .menu-toggle[_ngcontent-%COMP%] { display: inline-flex; align-items: center; gap: 12px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); padding: 8px 12px; font-size: 12px; color: var(--ink); } .menu-lines[_ngcontent-%COMP%] { display: grid; gap: 4px; width: 14px; } .menu-lines[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { width: 14px; height: 1px; background: currentColor; } #public-navigation[_ngcontent-%COMP%] { display: none; flex-basis: 100%; flex-direction: column; align-items: stretch; padding-top: 20px; border-top: 1px solid var(--line); gap: 24px; } #public-navigation.is-open[_ngcontent-%COMP%] { display: flex; } .section-links[_ngcontent-%COMP%] { flex-wrap: wrap; } .header-actions[_ngcontent-%COMP%] { justify-content: space-between; } .hero[_ngcontent-%COMP%] { gap: 28px; padding-block: 56px 64px; } h1[_ngcontent-%COMP%] { font-size: 43px; } .hero[_ngcontent-%COMP%]   .eyebrow[_ngcontent-%COMP%] { font-size: 9px; } .hero-description[_ngcontent-%COMP%] { font-size: 14px; } .hero-actions[_ngcontent-%COMP%] { gap: 18px; } .preview-top[_ngcontent-%COMP%], .preview-body[_ngcontent-%COMP%] { padding-inline: 18px; } .preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] { font-size: 9px; } .preview-tabs[_ngcontent-%COMP%] { padding-inline: 10px; } .preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { font-size: 10px; } .section-padding[_ngcontent-%COMP%] { padding-block: 64px; } .services-grid[_ngcontent-%COMP%] { grid-template-columns: repeat(2,1fr); } .audience-card[_ngcontent-%COMP%] { padding: 28px; } .audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { font-size: 27px; } .steps-grid[_ngcontent-%COMP%] { gap: 28px; } .faq-section[_ngcontent-%COMP%] { gap: 36px; } .site-footer[_ngcontent-%COMP%] { grid-template-columns: 1fr; } }\n@media (max-width: 700px) { .container[_ngcontent-%COMP%] { width: calc(100% - 40px); } .header-inner[_ngcontent-%COMP%] { padding-inline: 20px; } .brand[_ngcontent-%COMP%] { font-size: 19px; } .brand-mark[_ngcontent-%COMP%] { width: 25px; height: 25px; margin-right: 6px; } .section-links[_ngcontent-%COMP%] { flex-direction: column; align-items: flex-start; gap: 18px; } .hero[_ngcontent-%COMP%] { grid-template-columns: 1fr; gap: 40px; padding-block: 44px 52px; } h1[_ngcontent-%COMP%] { font-size: clamp(39px,10vw,58px); max-width: 500px; } .hero-description[_ngcontent-%COMP%] { max-width: 450px; } .hero-caption[_ngcontent-%COMP%] { flex-direction: row; flex-wrap: wrap; gap: 4px 16px; margin-top: 28px; } .hero-actions[_ngcontent-%COMP%] { gap: 22px; } .product-preview[_ngcontent-%COMP%] { width: 100%; max-width: 520px; justify-self: center; } .preview-body[_ngcontent-%COMP%] { padding: 22px; } .preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] { font-size: 10px; } .preview-top[_ngcontent-%COMP%] { padding-inline: 22px; } .preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { font-size: 11px; } .services-grid[_ngcontent-%COMP%], .audience-grid[_ngcontent-%COMP%], .steps-grid[_ngcontent-%COMP%], .faq-section[_ngcontent-%COMP%] { grid-template-columns: 1fr; } .section-padding[_ngcontent-%COMP%] { padding-block: 56px; } .section-intro[_ngcontent-%COMP%] { margin-bottom: 28px; } .section-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .faq-intro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .closing-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { font-size: 33px; } .service-card[_ngcontent-%COMP%] { padding: 26px; } .service-icon[_ngcontent-%COMP%] { margin-bottom: 20px; } .audience-card[_ngcontent-%COMP%] { padding: 28px; } .resident-note[_ngcontent-%COMP%] { display: grid; grid-template-columns: 26px 1fr; padding: 22px; gap: 14px; } .resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { grid-column: 2; margin-left: 0; } .steps-grid[_ngcontent-%COMP%] { gap: 12px; } .steps-grid[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] { padding-top: 20px; } .step-number[_ngcontent-%COMP%] { margin-bottom: 16px; } .faq-section[_ngcontent-%COMP%] { gap: 20px; } .closing-inner[_ngcontent-%COMP%] { align-items: flex-start; flex-direction: column; gap: 24px; } .closing-section[_ngcontent-%COMP%] { padding-block: 48px; } .site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%] { gap: 16px 22px; } }\n@media (prefers-reduced-motion: reduce) { .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::before, .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmcuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFRLGNBQWMsRUFBRTtBQUN4QixhQUFhLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLHlCQUF5QixFQUFFLG9EQUFvRCxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNoUixlQUFlLHNCQUFzQixFQUFFO0FBQ3ZDLGFBQWEscUNBQXFDLEVBQUUsbUJBQW1CLEVBQUU7QUFDekUsZUFBZSxjQUFjLEVBQUUscUJBQXFCLEVBQUU7QUFDdEQsb0JBQW9CLGFBQWEsRUFBRSxlQUFlLEVBQUU7QUFDcEQsNERBQTRELCtCQUErQixFQUFFLG1CQUFtQixFQUFFO0FBQ2xILHVDQUF1Qyx3QkFBd0IsRUFBRTtBQUNqRSxrQkFBa0Isa0JBQWtCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtBQUM3RSxNQUFNLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRTtBQUMxRyxXQUFXLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRTtBQUM3SSxhQUFhLGVBQWUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSwwQkFBMEIsRUFBRSw0QkFBNEIsRUFBRSw0QkFBNEIsRUFBRTtBQUMvSyxtQkFBbUIsd0JBQXdCLEVBQUU7QUFDN0MsZUFBZSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLHlCQUF5QixFQUFFLG9DQUFvQyxFQUFFO0FBQ3ZI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QyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsb0JBQW9CLGdCQUFnQixFQUFFLEVBQUUsZ0JBQWdCLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxnQkFBZ0IsU0FBUyxFQUFFLEVBQUUsbUJBQW1CLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLGdCQUFnQixhQUFhLEVBQUUsRUFBRSxzQkFBc0IsZUFBZSxFQUFFLEVBQUUsZUFBZSxvQkFBb0IsRUFBRSxFQUFFLHVCQUF1QixlQUFlLEVBQUUsRUFBRSx5REFBeUQsMEJBQTBCLEVBQUUsRUFBRSxtQkFBbUIsbUJBQW1CLEVBQUUsRUFBRSxpQkFBaUIsbUJBQW1CLEVBQUUsRUFBRSxvREFBb0QsZUFBZSxFQUFFLEVBQUUsZ0JBQWdCLGFBQWEsRUFBRSxFQUFFLGdCQUFnQixtQkFBbUIsRUFBRSxFQUFFLGlCQUFpQixhQUFhLEVBQUUsRUFBRSxpQkFBaUIsYUFBYSxFQUFFLCtCQUErQixFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsRUFBRSxtQkFBbUIsY0FBYyxFQUFFLGNBQWMsRUFBRSxFQUFFLGNBQWMsU0FBUyxFQUFFLEVBQUUsaUJBQWlCLGlCQUFpQixFQUFFLEVBQUUsZUFBZSxtQkFBbUIsRUFBRSxFQUFFLGVBQWUsU0FBUyxFQUFFLEVBQUUsaUJBQWlCLHVCQUF1QixFQUFFLHNCQUFzQixFQUFFLFNBQVMsRUFBRSxFQUFFLG1CQUFtQixtQkFBbUIsRUFBRSxFQUFFLG1CQUFtQixjQUFjLEVBQUUsRUFBRTtBQUM1aUQsMENBQTBDLHlEQUF5RCwwQkFBMEIsRUFBRSwyQkFBMkIsRUFBRSxnQ0FBZ0MsRUFBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3QgeyBkaXNwbGF5OiBibG9jazsgfVxuLnNhYXMtcGFnZSB7IC0tY2FudmFzOiAjZjdmNmYzOyAtLXN1cmZhY2U6ICNmZmY7IC0taW5rOiAjMmYzNDM3OyAtLW11dGVkOiAjNjI2OTYwOyAtLWxpbmU6ICNlYWVhZWE7IC0tZ3JlZW46ICMzNDY1Mzg7IC0tcGFzdGVsOiAjZWRmM2VjOyBjb2xvcjogdmFyKC0taW5rKTsgYmFja2dyb3VuZDogdmFyKC0tY2FudmFzKTsgZm9udC1mYW1pbHk6ICdIZWx2ZXRpY2EgTmV1ZScsIHN5c3RlbS11aSwgc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxNXB4OyBsaW5lLWhlaWdodDogMS42OyB9XG4uc2Fhcy1wYWdlICogeyBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4uY29udGFpbmVyIHsgd2lkdGg6IG1pbigxMjAwcHgsIGNhbGMoMTAwJSAtIDk2cHgpKTsgbWFyZ2luLWlubGluZTogYXV0bzsgfVxuLnNhYXMtcGFnZSBhIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgfVxuLnNhYXMtcGFnZSBidXR0b24geyBmb250OiBpbmhlcml0OyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5zYWFzLXBhZ2UgOmlzKGEsYnV0dG9uLHN1bW1hcnksW3RhYmluZGV4XSk6Zm9jdXMtdmlzaWJsZSB7IG91dGxpbmU6IDJweCBzb2xpZCB2YXIoLS1ncmVlbik7IG91dGxpbmUtb2Zmc2V0OiA1cHg7IH1cbi5zYWFzLXBhZ2UgOmlzKHNlY3Rpb25baWRdLG1haW5baWRdKSB7IHNjcm9sbC1tYXJnaW4tdG9wOiAxMDRweDsgfVxuLnN5bWJvbC1saWJyYXJ5IHsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogMDsgaGVpZ2h0OiAwOyBvdmVyZmxvdzogaGlkZGVuOyB9XG5zdmcgeyBmaWxsOiBub25lOyBzdHJva2U6IGN1cnJlbnRDb2xvcjsgc3Ryb2tlLXdpZHRoOiAxLjc7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsgfVxuLnNyLW9ubHkgeyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiAxcHg7IGhlaWdodDogMXB4OyBwYWRkaW5nOiAwOyBvdmVyZmxvdzogaGlkZGVuOyBjbGlwLXBhdGg6IGluc2V0KDUwJSk7IHdoaXRlLXNwYWNlOiBub3dyYXA7IGJvcmRlcjogMDsgfVxuLnNraXAtbGluayB7IHBvc2l0aW9uOiBmaXhlZDsgdG9wOiAxMnB4OyBsZWZ0OiAxMnB4OyB6LWluZGV4OiAxMDA7IHBhZGRpbmc6IDEycHggMjBweDsgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZSk7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWluayk7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjAwJSk7IH1cbi5za2lwLWxpbms6Zm9jdXMgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbi5zaXRlLWhlYWRlciB7IHBvc2l0aW9uOiBzdGlja3k7IHRvcDogMDsgei1pbmRleDogMjA7IGJhY2tncm91bmQ6IHZhcigtLWNhbnZhcyk7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgfVxuLmhlYWRlci1pbm5lciB7IG1heC13aWR0aDogMTM2MHB4OyBtYXJnaW46IGF1dG87IHBhZGRpbmc6IDIwcHggNDhweDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBnYXA6IDI4cHg7IH1cbi5icmFuZCB7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBmb250LXNpemU6IDIwcHg7IGZvbnQtd2VpZ2h0OiA2NTA7IGxldHRlci1zcGFjaW5nOiAtLjA1NWVtOyB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XG4uYnJhbmQtbWFyayB7IHdpZHRoOiAzMHB4OyBoZWlnaHQ6IDMwcHg7IG1hcmdpbi1yaWdodDogMTBweDsgY29sb3I6IHZhcigtLWdyZWVuKTsgfVxuLmJyYW5kLWFjY2VudCB7IGNvbG9yOiB2YXIoLS1ncmVlbik7IH1cbiNwdWJsaWMtbmF2aWdhdGlvbiwuc2VjdGlvbi1saW5rcywuaGVhZGVyLWFjdGlvbnMgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDI2cHg7IH1cbiNwdWJsaWMtbmF2aWdhdGlvbiB7IGZsZXg6IDE7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7IH1cbi5zZWN0aW9uLWxpbmtzIHsgZm9udC1zaXplOiAxM3B4OyB9XG4uc2VjdGlvbi1saW5rcyBhLC5zaXRlLWZvb3RlciBuYXYgYSB7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogNXB4OyB9XG4uc2VjdGlvbi1saW5rcyBhOmhvdmVyLC5zaXRlLWZvb3RlciBuYXYgYTpob3Zlciwuc2lnbi1pbjpob3ZlciB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB9XG4uaGVhZGVyLWFjdGlvbnMgeyBnYXA6IDIwcHg7IG1hcmdpbi1sZWZ0OiAxNHB4OyB9XG4uc2lnbi1pbiB7IGZvbnQtc2l6ZTogMTNweDsgfVxuLmJ1dHRvbiB7IGRpc3BsYXk6IGlubGluZS1mbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgZ2FwOiAzMHB4OyBtaW4taGVpZ2h0OiA0OHB4OyBwYWRkaW5nOiAxNHB4IDIycHg7IGJhY2tncm91bmQ6ICMxMTE7IGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7IGJvcmRlcjogMXB4IHNvbGlkICMxMTE7IGJvcmRlci1yYWRpdXM6IDVweDsgZm9udC1zaXplOiAxNHB4OyBmb250LXdlaWdodDogNTAwOyB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIC4xOHMsIHRyYW5zZm9ybSAuMThzOyB9XG4uYnV0dG9uOmhvdmVyIHsgYmFja2dyb3VuZDogIzMzMzsgfVxuLmJ1dHRvbjphY3RpdmUgeyB0cmFuc2Zvcm06IHNjYWxlKC45OCk7IH1cbi5idXR0b24tc21hbGwgeyBtaW4taGVpZ2h0OiA0MHB4OyBwYWRkaW5nOiA5cHggMTZweDsgZ2FwOiAyMHB4OyBmb250LXNpemU6IDEzcHg7IH1cbi5tZW51LXRvZ2dsZSB7IGRpc3BsYXk6IG5vbmU7IH1cbi5oZXJvIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMS4wNGZyOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDY0cHg7IHBhZGRpbmctYmxvY2s6IDcycHggODZweDsgfVxuLmV5ZWJyb3cgeyBmb250LXNpemU6IDEwcHg7IGZvbnQtd2VpZ2h0OiA2MDA7IGxldHRlci1zcGFjaW5nOiAuMTNlbTsgbGluZS1oZWlnaHQ6IDEuODsgbWFyZ2luOiAwIDAgMjRweDsgY29sb3I6IHZhcigtLW11dGVkKTsgfVxuLmhlcm8gLmV5ZWJyb3cgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEwcHg7IH1cbi5zbWFsbC1zcXVhcmUgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHdpZHRoOiA2cHg7IGhlaWdodDogNnB4OyBmbGV4LXNocmluazogMDsgYmFja2dyb3VuZDogdmFyKC0tZ3JlZW4pOyB9XG5oMSxoMixoMyxwIHsgbWFyZ2luLXRvcDogMDsgfVxuaDEgeyBmb250LWZhbWlseTogR2VvcmdpYSwgc2VyaWY7IGZvbnQtc2l6ZTogY2xhbXAoNDBweCwgNC43dncsIDY0cHgpOyBmb250LXdlaWdodDogNDAwOyBsaW5lLWhlaWdodDogMS4wNjsgbGV0dGVyLXNwYWNpbmc6IC0uMDU1ZW07IG1hcmdpbi1ib3R0b206IDI4cHg7IH1cbmgxIGVtIHsgY29sb3I6IHZhcigtLWdyZWVuKTsgZm9udC1zdHlsZTogaXRhbGljOyB9XG4uaGVyby1kZXNjcmlwdGlvbiB7IGZvbnQtc2l6ZTogMTZweDsgbGluZS1oZWlnaHQ6IDEuODsgbWF4LXdpZHRoOiAzOTBweDsgY29sb3I6IHZhcigtLW11dGVkKTsgbWFyZ2luLWJvdHRvbTogMjhweDsgfVxuLmhlcm8tYWN0aW9ucyB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGZsZXgtd3JhcDogd3JhcDsgZ2FwOiAyNHB4OyB9XG4udGV4dC1saW5rIHsgZGlzcGxheTogaW5saW5lLWZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTRweDsgZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogNTUwOyB0ZXh0LXVuZGVybGluZS1vZmZzZXQ6IDVweDsgfVxuLnRleHQtbGluazpob3ZlciB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB9XG4uaGVyby1jYXB0aW9uIHsgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkZWRlZDg7IG1hcmdpbi10b3A6IDM0cHg7IHBhZGRpbmctdG9wOiAxNnB4OyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBjb2xvcjogdmFyKC0tbXV0ZWQpOyBmb250LXNpemU6IDExcHg7IGxpbmUtaGVpZ2h0OiAxLjg7IH1cbi5wcm9kdWN0LXByZXZpZXcgeyBtaW4td2lkdGg6IDA7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgYm9yZGVyLXJhZGl1czogMTJweDsgb3ZlcmZsb3c6IGhpZGRlbjsgfVxuLnByZXZpZXctdG9wIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBnYXA6IDEycHg7IHBhZGRpbmc6IDE4cHggMjRweDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpbmUpOyB9XG4ucHJldmlldy1icmFuZCB7IGZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDYwMDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiA4cHg7IH1cbi5wcmV2aWV3LWJyYW5kIHN2ZyB7IHdpZHRoOiAyMXB4OyBoZWlnaHQ6IDIxcHg7IGNvbG9yOiB2YXIoLS1ncmVlbik7IH1cbi5pbGx1c3RyYXRpb24tbGFiZWwgeyBjb2xvcjogdmFyKC0tbXV0ZWQpOyBmb250LXNpemU6IDhweDsgbGV0dGVyLXNwYWNpbmc6IC4xZW07IH1cbi5jb21tdW5pdHktZHJhd2luZyB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgYmFja2dyb3VuZDogI2Y5ZmFmODsgcGFkZGluZzogMCAyMHB4IDEycHg7IHRleHQtYWxpZ246IGNlbnRlcjsgfVxuLmNvbW11bml0eS1kcmF3aW5nIHN2ZyB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEyNHB4OyBzdHJva2Utd2lkdGg6IDEuMTsgY29sb3I6ICM1YTcyNWI7IGRpc3BsYXk6IGJsb2NrOyB9XG4uY29tbXVuaXR5LWRyYXdpbmcgLmRyYXdpbmctZmlsbCB7IGZpbGw6ICNlZGYzZWM7IH1cbi5jb21tdW5pdHktZHJhd2luZyAuZHJhd2luZy1ncm91bmQgeyBzdHJva2U6ICNjZGQ1Y2I7IH1cbi5jb21tdW5pdHktZHJhd2luZyBzcGFuIHsgZm9udC1zaXplOiA5cHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGxldHRlci1zcGFjaW5nOiAuMDNlbTsgfVxuLnByZXZpZXctdGFicyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsMWZyKTsgcGFkZGluZzogMCAxNnB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbGluZSk7IH1cbi5wcmV2aWV3LXRhYnMgYnV0dG9uIHsgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGJvcmRlcjogMDsgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkIHRyYW5zcGFyZW50OyBwYWRkaW5nOiAxNXB4IDAgMTJweDsgY29sb3I6IHZhcigtLW11dGVkKTsgZm9udC1zaXplOiAxMXB4OyB3aGl0ZS1zcGFjZTogbm93cmFwOyB9XG4ucHJldmlldy10YWJzIGJ1dHRvblthcmlhLXNlbGVjdGVkPXRydWVdIHsgYm9yZGVyLWJvdHRvbS1jb2xvcjogdmFyKC0tZ3JlZW4pOyBjb2xvcjogdmFyKC0tZ3JlZW4pOyBmb250LXdlaWdodDogNjUwOyB9XG4ucHJldmlldy1ib2R5IHsgcGFkZGluZzogMjRweDsgfVxuLnByZXZpZXctYm9keVtoaWRkZW5dIHsgZGlzcGxheTogbm9uZTsgfVxuLnByZXZpZXctYm9keSBoMiB7IGZvbnQtc2l6ZTogMTZweDsgZm9udC13ZWlnaHQ6IDU1MDsgbGluZS1oZWlnaHQ6IDEuNDsgbWFyZ2luLWJvdHRvbTogOHB4OyB9XG4ucHJldmlldy1ib2R5IHAgeyBmb250LXNpemU6IDExcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGxpbmUtaGVpZ2h0OiAxLjc7IG1pbi1oZWlnaHQ6IDM4cHg7IG1hcmdpbi1ib3R0b206IDIwcHg7IH1cbi5wcmV2aWV3LWJvZHkgdGFibGUgeyB3aWR0aDogMTAwJTsgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsgdGV4dC1hbGlnbjogbGVmdDsgZm9udC1zaXplOiAxMHB4OyB0YWJsZS1sYXlvdXQ6IGZpeGVkOyB9XG4ucHJldmlldy1ib2R5IHRoIHsgZm9udC13ZWlnaHQ6IDUwMDsgfVxuLnByZXZpZXctYm9keSB0aGVhZCB0aCB7IGZvbnQtc2l6ZTogOXB4OyBwYWRkaW5nLWJvdHRvbTogMTBweDsgY29sb3I6IHZhcigtLW11dGVkKTsgfVxuLnByZXZpZXctYm9keSB0aDpmaXJzdC1jaGlsZCB7IHdpZHRoOiAzMSU7IH1cbi5wcmV2aWV3LWJvZHkgdGg6bGFzdC1jaGlsZCB7IHdpZHRoOiAyNSU7IH1cbi5wcmV2aWV3LWJvZHkgdGJvZHkgOmlzKHRoLHRkKSB7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgcGFkZGluZzogMTJweCA4cHggMTJweCAwOyBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTsgfVxuLnJvdy1zdGF0dXMgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBhZGRpbmc6IDNweCA2cHg7IGJhY2tncm91bmQ6IHZhcigtLXBhc3RlbCk7IGNvbG9yOiB2YXIoLS1ncmVlbik7IGZvbnQtc2l6ZTogOXB4OyBib3JkZXItcmFkaXVzOiAzcHg7IH1cbi5wcmV2aWV3LW5vdGUgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogYmFzZWxpbmU7IGdhcDogN3B4OyBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tbGluZSk7IHBhZGRpbmctdG9wOiAxNXB4OyBtYXJnaW4tdG9wOiA0cHg7IGZvbnQtc2l6ZTogOXB4OyBjb2xvcjogdmFyKC0tbXV0ZWQpOyBtaW4taGVpZ2h0OiAzMnB4OyB9XG4ucHJldmlldy1ub3RlIC5zbWFsbC1zcXVhcmUgeyB3aWR0aDogNHB4OyBoZWlnaHQ6IDRweDsgfVxuLnNlY3Rpb24tcGFkZGluZyB7IHBhZGRpbmctYmxvY2s6IDg4cHg7IH1cbi5zZWN0aW9uLWludHJvIHsgbWF4LXdpZHRoOiA2NTBweDsgbWFyZ2luLWJvdHRvbTogNDBweDsgfVxuLnNlY3Rpb24taW50cm8gLmV5ZWJyb3csLmZhcS1pbnRybyAuZXllYnJvdywuY2xvc2luZy1pbm5lciAuZXllYnJvdyB7IG1hcmdpbi1ib3R0b206IDE2cHg7IH1cbi5zZWN0aW9uLWludHJvIGgyLC5mYXEtaW50cm8gaDIsLmNsb3NpbmctaW5uZXIgaDIgeyBmb250LWZhbWlseTogR2VvcmdpYSwgc2VyaWY7IGZvbnQtc2l6ZTogY2xhbXAoMzBweCwgMy40dncsIDQzcHgpOyBmb250LXdlaWdodDogNDAwOyBsaW5lLWhlaWdodDogMS4xNTsgbGV0dGVyLXNwYWNpbmc6IC0uMDRlbTsgbWFyZ2luLWJvdHRvbTogMThweDsgfVxuLnNlY3Rpb24taW50cm8+cDpsYXN0LWNoaWxkIHsgbWF4LXdpZHRoOiA1MTBweDsgY29sb3I6IHZhcigtLW11dGVkKTsgZm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogMS44OyB9XG4uc2VydmljZXMtc2VjdGlvbiB7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpOyBib3JkZXItYmxvY2s6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgfVxuLnNlcnZpY2VzLWdyaWQgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLDFmcik7IGdhcDogMThweDsgfVxuLnNlcnZpY2UtY2FyZCB7IHBhZGRpbmc6IDI4cHg7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpOyBib3JkZXItcmFkaXVzOiA4cHg7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0OyB9XG4uc2VydmljZS1pY29uIHsgd2lkdGg6IDMycHg7IGhlaWdodDogMzJweDsgY29sb3I6IHZhcigtLWdyZWVuKTsgbWFyZ2luLWJvdHRvbTogMjZweDsgfVxuLnNlcnZpY2UtY2F0ZWdvcnkgeyBmb250LXNpemU6IDEwcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IG1hcmdpbi1ib3R0b206IDhweDsgfVxuLnNlcnZpY2UtY2FyZCBoMyB7IGZvbnQtc2l6ZTogMTlweDsgZm9udC13ZWlnaHQ6IDUwMDsgbGV0dGVyLXNwYWNpbmc6IC0uMDJlbTsgbGluZS1oZWlnaHQ6IDEuMzsgbWFyZ2luLWJvdHRvbTogMTRweDsgfVxuLnNlcnZpY2UtY2FyZD5wOm5vdCguc2VydmljZS1jYXRlZ29yeSkgeyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGxpbmUtaGVpZ2h0OiAxLjg7IG1hcmdpbi1ib3R0b206IDI0cHg7IH1cbi5zZXJ2aWNlLXRhZ3MgeyBwYWRkaW5nOiAwOyBtYXJnaW46IGF1dG8gMCAwOyBsaXN0LXN0eWxlOiBub25lOyBkaXNwbGF5OiBmbGV4OyBmbGV4LXdyYXA6IHdyYXA7IGdhcDogNnB4OyB9XG4uc2VydmljZS10YWdzIGxpIHsgZm9udC1zaXplOiA5cHg7IHBhZGRpbmc6IDRweCA3cHg7IGJhY2tncm91bmQ6ICNmNWY2ZjM7IGJvcmRlci1yYWRpdXM6IDNweDsgY29sb3I6ICM1NjVlNTQ7IH1cbi5hdmFpbGFiaWxpdHktbm90ZSB7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHZhcigtLW11dGVkKTsgbWF4LXdpZHRoOiA3NTBweDsgbWFyZ2luOiAyNHB4IDAgMDsgfVxuLmF1ZGllbmNlLWdyaWQgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7IGdhcDogMjRweDsgfVxuLmF1ZGllbmNlLWNhcmQgeyBwYWRkaW5nOiAzNnB4OyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgYm9yZGVyLXJhZGl1czogOHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlKTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IH1cbi5wZXJzb25hbC1jYXJkIHsgYmFja2dyb3VuZDogI2YxZjRlZjsgfVxuLmFjY291bnQtbGFiZWwgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGJhY2tncm91bmQ6IHZhcigtLXBhc3RlbCk7IGNvbG9yOiB2YXIoLS1ncmVlbik7IGZvbnQtc2l6ZTogMTBweDsgbGV0dGVyLXNwYWNpbmc6IC4wOGVtOyBwYWRkaW5nOiA1cHggOXB4OyBib3JkZXItcmFkaXVzOiAzcHg7IG1hcmdpbi1ib3R0b206IDI4cHg7IH1cbi5wZXJzb25hbC1sYWJlbCB7IGJhY2tncm91bmQ6ICNlMmU5ZGU7IH1cbi5hdWRpZW5jZS1jYXJkIGgzIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNlcmlmOyBmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IDMwcHg7IGxpbmUtaGVpZ2h0OiAxLjI7IGxldHRlci1zcGFjaW5nOiAtLjAzZW07IG1hcmdpbi1ib3R0b206IDE4cHg7IH1cbi5hdWRpZW5jZS1jYXJkIHAsLmF1ZGllbmNlLWNhcmQgbGkgeyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGxpbmUtaGVpZ2h0OiAxLjg7IH1cbi5hdWRpZW5jZS1jYXJkIHVsIHsgcGFkZGluZy1sZWZ0OiAxNnB4OyBtYXJnaW46IDhweCAwIDI4cHg7IH1cbi5hdWRpZW5jZS1jYXJkIGxpIHsgcGFkZGluZy1sZWZ0OiA0cHg7IG1hcmdpbi1ib3R0b206IDZweDsgfVxuLmF1ZGllbmNlLWNhcmQgLnRleHQtbGluayB7IG1hcmdpbi10b3A6IGF1dG87IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgcGFkZGluZy10b3A6IDI0cHg7IHdpZHRoOiAxMDAlOyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IH1cbi5yZXNpZGVudC1ub3RlIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiAyMnB4OyBtYXJnaW4tdG9wOiAyOHB4OyBwYWRkaW5nOiAyNHB4IDI4cHg7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpOyBib3JkZXItcmFkaXVzOiA4cHg7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpOyB9XG4ucmVzaWRlbnQtbm90ZSBzdmcgeyB3aWR0aDogMzBweDsgaGVpZ2h0OiAzMHB4OyBmbGV4LXNocmluazogMDsgY29sb3I6IHZhcigtLWdyZWVuKTsgfVxuLnJlc2lkZW50LW5vdGUgaDMgeyBmb250LXNpemU6IDE0cHg7IGZvbnQtd2VpZ2h0OiA1NTA7IG1hcmdpbi1ib3R0b206IDRweDsgfVxuLnJlc2lkZW50LW5vdGUgcCB7IGZvbnQtc2l6ZTogMTJweDsgY29sb3I6IHZhcigtLW11dGVkKTsgbWFyZ2luLWJvdHRvbTogMDsgfVxuLnJlc2lkZW50LW5vdGUgYSB7IGZvbnQtc2l6ZTogMTJweDsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IHRleHQtdW5kZXJsaW5lLW9mZnNldDogNHB4OyBtYXJnaW4tbGVmdDogYXV0bzsgfVxuLmdldHRpbmctc3RhcnRlZCB7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpOyBib3JkZXItYmxvY2s6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgfVxuLmpvdXJuZXktbGF5b3V0IHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAuODVmciAxLjE1ZnI7IGdhcDogODBweDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuLmpvdXJuZXktaW50cm8geyBtYXJnaW4tYm90dG9tOiAwOyB9XG4uam91cm5leS1pbnRybyBoMiB7IG1heC13aWR0aDogNDIwcHg7IH1cbi5qb3VybmV5LWludHJvPnAgeyBjb2xvcjogdmFyKC0tbXV0ZWQpOyBmb250LXNpemU6IDE0cHg7IGxpbmUtaGVpZ2h0OiAxLjg7IG1heC13aWR0aDogMzUwcHg7IH1cbi5qb3VybmV5LWludHJvIC50ZXh0LWxpbmsgeyBtYXJnaW4tdG9wOiAxNnB4OyB9XG4uam91cm5leS1pbnRybyAuam91cm5leS1yZXNpZGVudCB7IGZvbnQtc2l6ZTogMTJweDsgbWFyZ2luOiA0MHB4IDAgMDsgfVxuLmpvdXJuZXktcmVzaWRlbnQgYSB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB0ZXh0LXVuZGVybGluZS1vZmZzZXQ6IDNweDsgfVxuLmFjY291bnQtam91cm5leSB7IGxpc3Qtc3R5bGU6IG5vbmU7IG1hcmdpbjogMDsgcGFkZGluZzogMDsgdGV4dC1hbGlnbjogY2VudGVyOyB9XG4uYWNjb3VudC1qb3VybmV5IGgzIHsgZm9udC1zaXplOiAxNnB4OyBmb250LXdlaWdodDogNTAwOyBtYXJnaW46IDAgMCAyNHB4OyB9XG4uam91cm5leS1icmFuY2hlcyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjsgZ2FwOiAyNHB4OyB9XG4uam91cm5leS1icmFuY2ggeyBtaW4td2lkdGg6IDA7IH1cbi5qb3VybmV5LWJyYW5jaD5zdmcgeyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDM0cHg7IGhlaWdodDogMzRweDsgbWFyZ2luOiAwIGF1dG8gMTJweDsgY29sb3I6IHZhcigtLWdyZWVuKTsgfVxuLmpvdXJuZXktcm9sZSB7IGRpc3BsYXk6IGJsb2NrOyBmb250LXNpemU6IDlweDsgbGV0dGVyLXNwYWNpbmc6IC4wOWVtOyBjb2xvcjogdmFyKC0tZ3JlZW4pOyBtYXJnaW4tYm90dG9tOiA4cHg7IH1cbi5qb3VybmV5LWJyYW5jaCBoNCB7IGZvbnQtZmFtaWx5OiBHZW9yZ2lhLCBzZXJpZjsgZm9udC1zaXplOiAyM3B4OyBmb250LXdlaWdodDogNDAwOyBsZXR0ZXItc3BhY2luZzogLS4wMjVlbTsgbGluZS1oZWlnaHQ6IDEuMjsgbWFyZ2luOiAwIDAgMTBweDsgfVxuLmFjY291bnQtam91cm5leSBwIHsgZm9udC1zaXplOiAxMnB4OyBjb2xvcjogdmFyKC0tbXV0ZWQpOyBsaW5lLWhlaWdodDogMS43NTsgbWFyZ2luOiAwIGF1dG87IG1heC13aWR0aDogMjMwcHg7IH1cbi5qb3VybmV5LWNvbm5lY3RvciB7IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiA1NnB4OyBtYXJnaW46IDIwcHggMDsgc3Ryb2tlOiAjYjVjN2IyOyBzdHJva2Utd2lkdGg6IDE7IH1cbi5qb3VybmV5LWFycm93IHsgc3Ryb2tlOiB2YXIoLS1ncmVlbik7IH1cbi5tYWlsLXN0YW1wIHsgZGlzcGxheTogaW5saW5lLWZsZXg7IGNvbG9yOiB2YXIoLS1ncmVlbik7IG1hcmdpbi1ib3R0b206IDhweDsgfVxuLm1haWwtc3RhbXAgc3ZnIHsgd2lkdGg6IDI2cHg7IGhlaWdodDogMjZweDsgfVxuLmpvdXJuZXktdmVyaWZpY2F0aW9uIGgzIHsgbWFyZ2luLWJvdHRvbTogOHB4OyB9XG4uam91cm5leS12ZXJpZmljYXRpb24gcCB7IG1heC13aWR0aDogMzYwcHg7IH1cbi5qb3VybmV5LWVuZCB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgY29sb3I6IHZhcigtLWdyZWVuKTsgZm9udC1zaXplOiAxMHB4OyBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tbGluZSk7IG1hcmdpbi10b3A6IDE4cHg7IHBhZGRpbmctdG9wOiAxMnB4OyB9XG5AbWVkaWEgKG1heC13aWR0aDogOTYwcHgpIHsgLmpvdXJuZXktbGF5b3V0IHsgZ2FwOiAzMnB4OyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IC44ZnIgMS4yZnI7IH0gLmpvdXJuZXktYnJhbmNoZXMgeyBnYXA6IDE2cHg7IH0gLmpvdXJuZXktYnJhbmNoIGg0IHsgZm9udC1zaXplOiAyMHB4OyB9IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA3MDBweCkgeyAuam91cm5leS1sYXlvdXQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsgZ2FwOiA0NHB4OyB9IC5qb3VybmV5LWludHJvIC5qb3VybmV5LXJlc2lkZW50IHsgbWFyZ2luLXRvcDogMjRweDsgfSAuam91cm5leS1jb25uZWN0b3IgeyBoZWlnaHQ6IDQ0cHg7IH0gLmpvdXJuZXktYnJhbmNoIGg0IHsgZm9udC1zaXplOiAyMXB4OyB9IC5qb3VybmV5LXJvbGUgeyBmb250LXNpemU6IDhweDsgfSAuYWNjb3VudC1qb3VybmV5IHAgeyBmb250LXNpemU6IDExcHg7IH0gLmpvdXJuZXktZW5kIHsgZm9udC1zaXplOiA5cHg7IH0gLmpvdXJuZXktYnJhbmNoIHAgYnIgeyBkaXNwbGF5OiBub25lOyB9IH1cbi5mYXEtc2VjdGlvbiB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogLjg1ZnIgMS4xNWZyOyBnYXA6IDY0cHg7IH1cbi5mYXEtaW50cm8gcCB7IGZvbnQtc2l6ZTogMTNweDsgY29sb3I6IHZhcigtLW11dGVkKTsgfVxuLmZhcS1saXN0IGRldGFpbHMgeyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RlZGVkODsgfVxuLmZhcS1saXN0IGRldGFpbHM6Zmlyc3QtY2hpbGQgeyBib3JkZXItdG9wOiAxcHggc29saWQgI2RlZGVkODsgfVxuLmZhcS1saXN0IHN1bW1hcnkgeyBsaXN0LXN0eWxlOiBub25lOyBjdXJzb3I6IHBvaW50ZXI7IHBhZGRpbmc6IDIycHggMDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOyBnYXA6IDI0cHg7IGZvbnQtc2l6ZTogMTRweDsgZm9udC13ZWlnaHQ6IDUwMDsgfVxuLmZhcS1saXN0IHN1bW1hcnk6Oi13ZWJraXQtZGV0YWlscy1tYXJrZXIgeyBkaXNwbGF5OiBub25lOyB9XG4uZmFxLXRvZ2dsZTo6YWZ0ZXIgeyBjb250ZW50OiAnKyc7IGRpc3BsYXk6IGJsb2NrOyBmb250LXNpemU6IDIwcHg7IGZvbnQtd2VpZ2h0OiA0MDA7IGNvbG9yOiB2YXIoLS1ncmVlbik7IH1cbmRldGFpbHNbb3Blbl0gLmZhcS10b2dnbGU6OmFmdGVyIHsgY29udGVudDogJ8OiwojCkic7IH1cbi5mYXEtbGlzdCBkZXRhaWxzIHAgeyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IGxpbmUtaGVpZ2h0OiAxLjg7IG1hcmdpbi1ib3R0b206IDI0cHg7IHBhZGRpbmctcmlnaHQ6IDI2cHg7IH1cbi5jbG9zaW5nLXNlY3Rpb24geyBiYWNrZ3JvdW5kOiB2YXIoLS1wYXN0ZWwpOyBib3JkZXItYmxvY2s6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgcGFkZGluZy1ibG9jazogNjRweDsgfVxuLmNsb3NpbmctaW5uZXIgeyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogNDBweDsgfVxuLmNsb3NpbmctaW5uZXIgaDIgeyBtYXJnaW4tYm90dG9tOiAxNnB4OyB9XG4uY2xvc2luZy1pbm5lciBwOmxhc3QtY2hpbGQgeyBmb250LXNpemU6IDEzcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IG1hcmdpbi1ib3R0b206IDA7IH1cbi5zaXRlLWZvb3RlciB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIGF1dG87IGdhcDogMzBweDsgcGFkZGluZy1ibG9jazogNDBweDsgfVxuLnNpdGUtZm9vdGVyIC5icmFuZCB7IGZvbnQtc2l6ZTogMTlweDsgfVxuLnNpdGUtZm9vdGVyIHAgeyBmb250LXNpemU6IDExcHg7IGNvbG9yOiB2YXIoLS1tdXRlZCk7IG1hcmdpbjogOHB4IDAgMDsgfVxuLnNpdGUtZm9vdGVyIG5hdiB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0OyBmbGV4LXdyYXA6IHdyYXA7IGdhcDogMjRweDsgZm9udC1zaXplOiAxMnB4OyBwYWRkaW5nLXRvcDogNHB4OyB9XG4uZm9vdGVyLWRldGFpbCB7IGdyaWQtY29sdW1uOiAxLy0xOyBib3JkZXItdG9wOiAxcHggc29saWQgI2RlZGVkODsgcGFkZGluZy10b3A6IDIwcHg7IGZvbnQtc2l6ZTogMTBweDsgY29sb3I6IHZhcigtLW11dGVkKTsgfVxuQG1lZGlhIChtaW4td2lkdGg6IDk2MXB4KSBhbmQgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IG5vLXByZWZlcmVuY2UpIHsgLmhlcm8tY29weSwucHJvZHVjdC1wcmV2aWV3IHsgYW5pbWF0aW9uOiBhcnJpdmUgLjZzIGVhc2Utb3V0IGJvdGg7IH0gLnByb2R1Y3QtcHJldmlldyB7IGFuaW1hdGlvbi1kZWxheTogLjFzOyB9IH1cbkBrZXlmcmFtZXMgYXJyaXZlIHsgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMHB4KTsgfSB0byB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfSB9XG5AbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7IC5oZWFkZXItaW5uZXIgeyBwYWRkaW5nLWlubGluZTogMzJweDsgZ2FwOiAyMHB4OyB9ICNwdWJsaWMtbmF2aWdhdGlvbiwuc2VjdGlvbi1saW5rcyB7IGdhcDogMTZweDsgfSAuaGVhZGVyLWFjdGlvbnMgeyBtYXJnaW4tbGVmdDogMDsgZ2FwOiAxNHB4OyB9IC5oZXJvIHsgZ2FwOiAzMnB4OyB9IC5zZXJ2aWNlLWNhcmQgeyBwYWRkaW5nOiAyNHB4OyB9IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA5NjBweCkgeyAuY29udGFpbmVyIHsgd2lkdGg6IGNhbGMoMTAwJSAtIDY0cHgpOyB9IC5oZWFkZXItaW5uZXIgeyBmbGV4LXdyYXA6IHdyYXA7IHBhZGRpbmctYmxvY2s6IDE2cHg7IH0gLm1lbnUtdG9nZ2xlIHsgZGlzcGxheTogaW5saW5lLWZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTJweDsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7IGJvcmRlci1yYWRpdXM6IDRweDsgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZSk7IHBhZGRpbmc6IDhweCAxMnB4OyBmb250LXNpemU6IDEycHg7IGNvbG9yOiB2YXIoLS1pbmspOyB9IC5tZW51LWxpbmVzIHsgZGlzcGxheTogZ3JpZDsgZ2FwOiA0cHg7IHdpZHRoOiAxNHB4OyB9IC5tZW51LWxpbmVzIHNwYW4geyB3aWR0aDogMTRweDsgaGVpZ2h0OiAxcHg7IGJhY2tncm91bmQ6IGN1cnJlbnRDb2xvcjsgfSAjcHVibGljLW5hdmlnYXRpb24geyBkaXNwbGF5OiBub25lOyBmbGV4LWJhc2lzOiAxMDAlOyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogc3RyZXRjaDsgcGFkZGluZy10b3A6IDIwcHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsgZ2FwOiAyNHB4OyB9ICNwdWJsaWMtbmF2aWdhdGlvbi5pcy1vcGVuIHsgZGlzcGxheTogZmxleDsgfSAuc2VjdGlvbi1saW5rcyB7IGZsZXgtd3JhcDogd3JhcDsgfSAuaGVhZGVyLWFjdGlvbnMgeyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IH0gLmhlcm8geyBnYXA6IDI4cHg7IHBhZGRpbmctYmxvY2s6IDU2cHggNjRweDsgfSBoMSB7IGZvbnQtc2l6ZTogNDNweDsgfSAuaGVybyAuZXllYnJvdyB7IGZvbnQtc2l6ZTogOXB4OyB9IC5oZXJvLWRlc2NyaXB0aW9uIHsgZm9udC1zaXplOiAxNHB4OyB9IC5oZXJvLWFjdGlvbnMgeyBnYXA6IDE4cHg7IH0gLnByZXZpZXctdG9wLC5wcmV2aWV3LWJvZHkgeyBwYWRkaW5nLWlubGluZTogMThweDsgfSAucHJldmlldy1ib2R5IHRhYmxlIHsgZm9udC1zaXplOiA5cHg7IH0gLnByZXZpZXctdGFicyB7IHBhZGRpbmctaW5saW5lOiAxMHB4OyB9IC5wcmV2aWV3LXRhYnMgYnV0dG9uIHsgZm9udC1zaXplOiAxMHB4OyB9IC5zZWN0aW9uLXBhZGRpbmcgeyBwYWRkaW5nLWJsb2NrOiA2NHB4OyB9IC5zZXJ2aWNlcy1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwxZnIpOyB9IC5hdWRpZW5jZS1jYXJkIHsgcGFkZGluZzogMjhweDsgfSAuYXVkaWVuY2UtY2FyZCBoMyB7IGZvbnQtc2l6ZTogMjdweDsgfSAuc3RlcHMtZ3JpZCB7IGdhcDogMjhweDsgfSAuZmFxLXNlY3Rpb24geyBnYXA6IDM2cHg7IH0gLnNpdGUtZm9vdGVyIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH0gfVxuQG1lZGlhIChtYXgtd2lkdGg6IDcwMHB4KSB7IC5jb250YWluZXIgeyB3aWR0aDogY2FsYygxMDAlIC0gNDBweCk7IH0gLmhlYWRlci1pbm5lciB7IHBhZGRpbmctaW5saW5lOiAyMHB4OyB9IC5icmFuZCB7IGZvbnQtc2l6ZTogMTlweDsgfSAuYnJhbmQtbWFyayB7IHdpZHRoOiAyNXB4OyBoZWlnaHQ6IDI1cHg7IG1hcmdpbi1yaWdodDogNnB4OyB9IC5zZWN0aW9uLWxpbmtzIHsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IGdhcDogMThweDsgfSAuaGVybyB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyBnYXA6IDQwcHg7IHBhZGRpbmctYmxvY2s6IDQ0cHggNTJweDsgfSBoMSB7IGZvbnQtc2l6ZTogY2xhbXAoMzlweCwxMHZ3LDU4cHgpOyBtYXgtd2lkdGg6IDUwMHB4OyB9IC5oZXJvLWRlc2NyaXB0aW9uIHsgbWF4LXdpZHRoOiA0NTBweDsgfSAuaGVyby1jYXB0aW9uIHsgZmxleC1kaXJlY3Rpb246IHJvdzsgZmxleC13cmFwOiB3cmFwOyBnYXA6IDRweCAxNnB4OyBtYXJnaW4tdG9wOiAyOHB4OyB9IC5oZXJvLWFjdGlvbnMgeyBnYXA6IDIycHg7IH0gLnByb2R1Y3QtcHJldmlldyB7IHdpZHRoOiAxMDAlOyBtYXgtd2lkdGg6IDUyMHB4OyBqdXN0aWZ5LXNlbGY6IGNlbnRlcjsgfSAucHJldmlldy1ib2R5IHsgcGFkZGluZzogMjJweDsgfSAucHJldmlldy1ib2R5IHRhYmxlIHsgZm9udC1zaXplOiAxMHB4OyB9IC5wcmV2aWV3LXRvcCB7IHBhZGRpbmctaW5saW5lOiAyMnB4OyB9IC5wcmV2aWV3LXRhYnMgYnV0dG9uIHsgZm9udC1zaXplOiAxMXB4OyB9IC5zZXJ2aWNlcy1ncmlkLC5hdWRpZW5jZS1ncmlkLC5zdGVwcy1ncmlkLC5mYXEtc2VjdGlvbiB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9IC5zZWN0aW9uLXBhZGRpbmcgeyBwYWRkaW5nLWJsb2NrOiA1NnB4OyB9IC5zZWN0aW9uLWludHJvIHsgbWFyZ2luLWJvdHRvbTogMjhweDsgfSAuc2VjdGlvbi1pbnRybyBoMiwuZmFxLWludHJvIGgyLC5jbG9zaW5nLWlubmVyIGgyIHsgZm9udC1zaXplOiAzM3B4OyB9IC5zZXJ2aWNlLWNhcmQgeyBwYWRkaW5nOiAyNnB4OyB9IC5zZXJ2aWNlLWljb24geyBtYXJnaW4tYm90dG9tOiAyMHB4OyB9IC5hdWRpZW5jZS1jYXJkIHsgcGFkZGluZzogMjhweDsgfSAucmVzaWRlbnQtbm90ZSB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjZweCAxZnI7IHBhZGRpbmc6IDIycHg7IGdhcDogMTRweDsgfSAucmVzaWRlbnQtbm90ZSBhIHsgZ3JpZC1jb2x1bW46IDI7IG1hcmdpbi1sZWZ0OiAwOyB9IC5zdGVwcy1ncmlkIHsgZ2FwOiAxMnB4OyB9IC5zdGVwcy1ncmlkIGxpIHsgcGFkZGluZy10b3A6IDIwcHg7IH0gLnN0ZXAtbnVtYmVyIHsgbWFyZ2luLWJvdHRvbTogMTZweDsgfSAuZmFxLXNlY3Rpb24geyBnYXA6IDIwcHg7IH0gLmNsb3NpbmctaW5uZXIgeyBhbGlnbi1pdGVtczogZmxleC1zdGFydDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAyNHB4OyB9IC5jbG9zaW5nLXNlY3Rpb24geyBwYWRkaW5nLWJsb2NrOiA0OHB4OyB9IC5zaXRlLWZvb3RlciBuYXYgeyBnYXA6IDE2cHggMjJweDsgfSB9XG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkgeyAuc2Fhcy1wYWdlICosIC5zYWFzLXBhZ2UgKjo6YmVmb3JlLC5zYWFzLXBhZ2UgKjo6YWZ0ZXIgeyBhbmltYXRpb246IG5vbmUgIWltcG9ydGFudDsgdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50OyBzY3JvbGwtYmVoYXZpb3I6IGF1dG8gIWltcG9ydGFudDsgfSB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
      changeDetection: 0
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_saas-landing_saas-landing_component_ts.js.map