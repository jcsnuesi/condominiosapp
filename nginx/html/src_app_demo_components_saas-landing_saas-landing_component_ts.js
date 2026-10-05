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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 33880);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 21478);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _account_destination__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./account-destination */ 90982);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 58440);









const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.question;
const _forTrack2 = ($index, $item) => $item.name;
function SaasLandingComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "a", 162);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_52_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "Ir a mi cuenta");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("routerLink", ctx);
  }
}
function SaasLandingComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "a", 163);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_53_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "Iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SaasLandingComponent_For_174_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 164);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_For_174_Template_button_click_0_listener() {
      const item_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.selectPreview(item_r5.key));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("id", "tab-" + item_r5.key)("tabIndex", ctx_r1.selectedPreview() === item_r5.key ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵattribute"]("aria-controls", "panel-" + item_r5.key)("aria-selected", ctx_r1.selectedPreview() === item_r5.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", item_r5.label, " ");
  }
}
function SaasLandingComponent_For_176_For_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "th", 165);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](column_r6);
  }
}
function SaasLandingComponent_For_176_For_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr")(1, "th", 168);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "td")(6, "span", 169);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const row_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](row_r7.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](row_r7.detail);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](row_r7.status);
  }
}
function SaasLandingComponent_For_176_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 92)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "table")(6, "caption", 138);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "thead")(9, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterCreate"](10, SaasLandingComponent_For_176_For_11_Template, 2, 1, "th", 165, _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](12, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterCreate"](13, SaasLandingComponent_For_176_For_14_Template, 8, 3, "tr", null, _forTrack2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](15, "div", 166);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](16, "span", 167);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("id", "panel-" + item_r8.key)("hidden", ctx_r1.selectedPreview() !== item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵattribute"]("aria-labelledby", "tab-" + item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵattribute"]("id", ctx_r1.selectedPreview() === item_r8.key ? "preview-heading" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", item_r8.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](item_r8.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", item_r8.label, ": datos de ejemplo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeater"](item_r8.columns);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeater"](item_r8.rows);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", item_r8.note, " ");
  }
}
function SaasLandingComponent_For_479_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "details")(1, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](3, "span", 170);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", item_r9.question);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](item_r9.answer);
  }
}
class SaasLandingComponent {
  constructor() {
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_8__.UserService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_7__.AccessContextService);
    this.title = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Title);
    this.meta = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Meta);
    this.document = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router);
    this.location = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_common__WEBPACK_IMPORTED_MODULE_3__.Location);
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute);
    this.previousTitle = this.title.getTitle();
    this.previousDescription = this.meta.getTag('name="description"')?.content;
    this.session = this.readSession();
    this.menuOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "menuOpen"
    }] : /* istanbul ignore next */[]));
    this.selectedPreview = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('finance', ...(ngDevMode ? [{
      debugName: "selectedPreview"
    }] : /* istanbul ignore next */[]));
    this.accountLink = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.computed)(() => (0,_account_destination__WEBPACK_IMPORTED_MODULE_9__.accountDestination)(this.session.identity, this.session.token, this.access.access()), ...(ngDevMode ? [{
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
    this.route.queryParamMap.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_6__.takeUntilDestroyed)()).subscribe(params => {
      const key = params.get('vista');
      this.selectedPreview.set(this.previews.find(item => item.key === key)?.key ?? 'finance');
    });
    this.title.setTitle('Gestión de condominios y Smart Home | CondominiosApp');
    this.meta.updateTag({
      name: 'description',
      content: 'Organiza condominios, propietarios, finanzas, reservas y documentos con CondominiosApp. Crea tu cuenta de administración o gestiona tu vivienda personal.'
    });
  }
  closeMenu() {
    const navigation = this.document.getElementById('public-navigation');
    if (this.menuOpen() && navigation?.contains(this.document.activeElement)) {
      this.document.querySelector('.menu-toggle')?.focus();
    }
    this.menuOpen.set(false);
  }
  selectPreview(key) {
    this.selectedPreview.set(key);
    // Tabs update local state, not routes: navigation would reset the page scroll.
    const url = this.router.parseUrl(this.location.path(true));
    if (key === 'finance') delete url.queryParams['vista'];else url.queryParams['vista'] = key;
    this.location.replaceState(this.router.serializeUrl(url), '', this.location.getState());
  }
  focusContent() {
    this.document.getElementById('main-content')?.focus();
  }
  moveTab(event) {
    const index = this.previews.findIndex(item => item.key === this.selectedPreview());
    const next = event.key === 'ArrowRight' ? (index + 1) % this.previews.length : event.key === 'ArrowLeft' ? (index + this.previews.length - 1) % this.previews.length : event.key === 'Home' ? 0 : event.key === 'End' ? this.previews.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    this.selectPreview(this.previews[next].key);
    const tablist = event.target.closest('[role="tablist"]');
    tablist?.querySelectorAll('[role="tab"]')[next]?.focus({
      preventScroll: true
    });
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
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({
      type: SaasLandingComponent,
      selectors: [["app-saas-landing"]],
      decls: 514,
      vars: 7,
      consts: [["lang", "es", 1, "saas-page"], ["rel", "preload", "href", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtrustConstantResourceUrl"]`assets/landing/manrope-700.ttf`, "as", "font", "type", "font/ttf", "crossorigin", ""], ["rel", "preload", "href", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtrustConstantResourceUrl"]`assets/layout/styles/theme/tailwind-light/fonts/Inter-Regular.woff2`, "as", "font", "type", "font/woff2", "crossorigin", ""], ["routerLink", "/", "fragment", "main-content", 1, "skip-link", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "aria-hidden", "true", 1, "symbol-library"], ["id", "saas-building", "viewBox", "0 0 32 32"], ["d", "M5 28V7l12-3v24M17 12h10v16M2 28h28M9 10h3m-3 5h3m-3 5h3m9-4h2m-2 5h2M9 28v-4h4v4"], ["id", "saas-finance", "viewBox", "0 0 32 32"], ["d", "M5 5h22v23H5zM10 11h12M10 16h4m4 0h4M10 21h4m4 0h4"], ["id", "saas-bookings", "viewBox", "0 0 32 32"], ["d", "M5 7h22v21H5zM10 3v8m12-8v8M5 13h22m-17 5h4m4 0h4m-12 5h4"], ["id", "saas-documents", "viewBox", "0 0 32 32"], ["d", "M7 3h12l6 6v20H7zM19 3v7h6M12 16h8m-8 5h8"], ["id", "saas-rentals", "viewBox", "0 0 32 32"], ["d", "m3 15 13-11 13 11M7 12v16h18V12M13 28v-9h6v9"], ["id", "saas-home", "viewBox", "0 0 32 32"], ["d", "m3 16 13-12 13 12M7 13v15h18V13M12 14a6 6 0 0 1 8 0m-6 4a3 3 0 0 1 4 0"], ["cx", "16", "cy", "22", "r", "1"], ["id", "saas-camera", "viewBox", "0 0 32 32"], ["x", "4", "y", "8", "width", "24", "height", "18", "rx", "4"], ["d", "m11 8 2-4h6l2 4"], ["cx", "16", "cy", "17", "r", "5"], ["id", "saas-message", "viewBox", "0 0 32 32"], ["d", "M5 5h22v17H13l-8 6zM10 11h12m-12 5h8"], ["id", "saas-device", "viewBox", "0 0 32 32"], ["x", "10", "y", "4", "width", "12", "height", "24", "rx", "3"], ["d", "M14 23h4M5 11a12 12 0 0 0 0 10m22-10a12 12 0 0 1 0 10"], [1, "site-header", 3, "keydown.escape"], [1, "header-inner"], ["routerLink", "/", "aria-label", "CondominiosApp, inicio", 1, "brand", 3, "click"], ["aria-hidden", "true", 1, "brand-mark"], ["href", "#saas-building"], ["translate", "no"], [1, "brand-accent"], ["type", "button", "aria-controls", "public-navigation", 1, "menu-toggle", 3, "click"], ["aria-hidden", "true", 1, "menu-lines"], ["id", "public-navigation", "aria-label", "Navegaci\u00F3n principal"], [1, "section-links"], ["routerLink", "/", "fragment", "servicios", 3, "click"], ["routerLink", "/", "fragment", "como-comenzar", 3, "click"], ["routerLink", "/", "fragment", "preguntas", 3, "click"], [1, "header-actions"], [1, "sign-in", 3, "routerLink"], ["routerLink", "/auth/login", 1, "sign-in"], ["routerLink", "/auth/register", 1, "button", "button-small", 3, "click"], ["aria-hidden", "true"], ["id", "main-content", "tabindex", "-1"], ["aria-labelledby", "hero-title", 1, "hero"], [1, "hero-photo"], ["media", "(max-width: 700px)", "srcset", "\n                        assets/landing/residencial-azul-movil-480.webp 480w,\n                        assets/landing/residencial-azul-movil-780.webp 780w\n                    ", "sizes", "100vw", "type", "image/webp"], ["srcset", "\n                        assets/landing/residencial-azul-720.webp   720w,\n                        assets/landing/residencial-azul-1536.webp 1536w\n                    ", "sizes", "100vw", "type", "image/webp"], ["src", "assets/landing/residencial-azul-1536.webp", "width", "1536", "height", "1024", "fetchpriority", "high", "alt", "Edificios con balcones y jardines tropicales en una comunidad residencial"], [1, "hero-inner", "container"], [1, "hero-copy"], ["id", "hero-title"], [1, "hero-title-accent"], [1, "hero-description"], [1, "hero-actions"], ["routerLink", "/auth/register", 1, "button"], ["routerLink", "/", "fragment", "servicios", 1, "text-link"], [1, "hero-visual"], ["role", "img", "aria-label", "Ejemplo de la aplicaci\u00F3n m\u00F3vil: cuota del mes, reservas, mensajes, c\u00E1maras y dispositivos", 1, "phone-mockup"], ["aria-hidden", "true", 1, "phone-screen"], [1, "phone-status"], [1, "phone-notch"], [1, "phone-greeting"], [1, "resident-avatar"], [1, "phone-menu"], [1, "phone-balance"], [1, "balance-chart"], [1, "phone-tiles"], [1, "phone-tile"], ["href", "#saas-bookings"], ["href", "#saas-message"], [1, "tile-blue"], ["href", "#saas-camera"], [1, "tile-green"], ["href", "#saas-device"], [1, "phone-bottom-nav"], [1, "current"], ["href", "#saas-rentals"], ["href", "#saas-finance"], ["href", "#saas-documents"], [1, "phone-home-bar"], ["aria-labelledby", "demo-title", 1, "demo-section", "container"], [1, "section-intro"], ["id", "demo-title"], ["aria-labelledby", "preview-heading", 1, "product-preview"], [1, "preview-top"], [1, "preview-brand"], ["role", "tablist", "aria-label", "Explorar funciones del producto", 1, "preview-tabs", 3, "keydown"], ["type", "button", "role", "tab", 3, "id", "tabIndex"], ["role", "tabpanel", "tabindex", "0", 1, "preview-body", 3, "id", "hidden"], ["aria-labelledby", "benefits-title", 1, "benefits-section"], [1, "container", "benefits-inner"], ["id", "benefits-title"], [1, "benefits-list"], ["href", "#saas-home"], ["id", "servicios", "aria-labelledby", "services-title", 1, "services-section", "section-padding"], [1, "container"], [1, "section-intro", "service-heading"], ["id", "services-title"], [1, "community-feature"], ["src", "assets/landing/comunidad-960.webp", "srcset", "\n                                assets/landing/comunidad-640.webp 640w,\n                                assets/landing/comunidad-960.webp 960w\n                            ", "sizes", "(max-width: 700px) 92vw, 48vw", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Tres vecinos conversan y coordinan una actividad en una terraza rodeada de vegetaci\u00F3n"], [1, "feature-copy"], [1, "feature-list"], [1, "shared-services"], ["aria-hidden", "true", 1, "service-icon"], ["aria-labelledby", "connected-title", 1, "connected-section"], [1, "container", "connected-layout"], [1, "connected-copy"], [1, "feature-label"], ["id", "connected-title"], ["routerLink", "/", "fragment", "para-quien", 1, "text-link"], [1, "availability-note"], [1, "connected-visual"], ["src", "assets/landing/hogar-960.webp", "srcset", "\n                            assets/landing/hogar-640.webp 640w,\n                            assets/landing/hogar-960.webp 960w\n                        ", "sizes", "(max-width: 700px) 92vw, 48vw", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Sala acogedora con plantas, l\u00E1mpara encendida y un sensor junto a la entrada"], [1, "device-example"], ["aria-hidden", "true", 1, "device-dot"], ["aria-labelledby", "everyday-title", 1, "everyday-section", "container", "section-padding"], ["id", "everyday-title"], [1, "everyday-grid"], [1, "everyday-scene"], ["aria-label", "Ejemplo de consulta de una cuota", 1, "scene-art", "finance-art"], [1, "scene-label"], [1, "mini-statement"], ["aria-label", "Ejemplo de reserva de un \u00E1rea com\u00FAn", 1, "scene-art", "booking-art"], [1, "mini-calendar"], ["aria-hidden", "true", 1, "calendar-days"], [1, "calendar-status"], ["aria-label", "Ejemplo de consulta de un dispositivo", 1, "scene-art", "home-art"], [1, "mini-device"], ["id", "para-quien", "aria-labelledby", "audience-title", 1, "audience-section", "container", "section-padding"], ["id", "audience-title"], [1, "audience-grid"], [1, "audience-card"], [1, "account-label"], ["routerLink", "/auth/register", 1, "text-link"], [1, "sr-only"], [1, "audience-card", "personal-card"], [1, "account-label", "personal-label"], [1, "resident-note"], ["routerLink", "/auth/login"], ["id", "como-comenzar", "aria-labelledby", "steps-title", 1, "getting-started", "section-padding"], [1, "container", "steps-layout"], ["id", "steps-title"], [1, "steps-list"], ["id", "preguntas", "aria-labelledby", "faq-title", 1, "faq-section", "container", "section-padding"], [1, "faq-intro"], ["id", "faq-title"], [1, "faq-list"], ["aria-labelledby", "closing-title", 1, "closing-section", "container"], [1, "closing-copy"], ["id", "closing-title"], ["src", "assets/landing/residencial-720.webp", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Jardines y balcones de un residencial en la luz c\u00E1lida de la tarde"], [1, "site-footer", "container"], ["routerLink", "/", 1, "brand"], ["aria-label", "Navegaci\u00F3n del pie de p\u00E1gina"], ["routerLink", "/", "fragment", "servicios"], ["routerLink", "/", "fragment", "preguntas"], ["routerLink", "/auth/register"], [1, "footer-detail"], [1, "sign-in", 3, "click", "routerLink"], ["routerLink", "/auth/login", 1, "sign-in", 3, "click"], ["type", "button", "role", "tab", 3, "click", "id", "tabIndex"], ["scope", "col"], [1, "preview-note"], ["aria-hidden", "true", 1, "small-square"], ["scope", "row"], [1, "row-status"], ["aria-hidden", "true", 1, "faq-toggle"]],
      template: function SaasLandingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](1, "link", 1)(2, "link", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_3_listener() {
            return ctx.focusContent();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4, "Saltar al contenido");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "svg", 4)(6, "defs")(7, "symbol", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](8, "path", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](9, "symbol", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](10, "path", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "symbol", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](12, "path", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "symbol", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](14, "path", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](15, "symbol", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](16, "path", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](17, "symbol", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](18, "path", 16)(19, "circle", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](20, "symbol", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](21, "rect", 19)(22, "path", 20)(23, "circle", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](24, "symbol", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](25, "path", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](26, "symbol", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](27, "rect", 25)(28, "path", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](29, "header", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("keydown.escape", function SaasLandingComponent_Template_header_keydown_escape_29_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](30, "div", 28)(31, "a", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_31_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](32, "svg", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](33, "use", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](34, "span", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](35, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](36, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](37, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](38, "button", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_button_click_38_listener() {
            return ctx.menuOpen.set(!ctx.menuOpen());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](39);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](40, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](41, "span")(42, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](43, "nav", 36)(44, "div", 37)(45, "a", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_45_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](46, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](47, "a", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_47_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](48, "C\u00F3mo funciona");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](49, "a", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_49_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](50, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](51, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵconditionalCreate"](52, SaasLandingComponent_Conditional_52_Template, 2, 1, "a", 42)(53, SaasLandingComponent_Conditional_53_Template, 2, 0, "a", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](54, "a", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_54_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](55, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](56, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](57, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](58, "main", 46)(59, "section", 47)(60, "picture", 48);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](61, "source", 49)(62, "source", 50)(63, "img", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](64, "div", 52)(65, "div", 53)(66, "h1", 54)(67, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](68, "M\u00E1s orden para");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](69, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](70, "tu comunidad");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](71, "span", 55);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](72, "M\u00E1s tranquilidad");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](73, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](74, "para tu hogar");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](75, "p", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](76, " Gestiona cuotas, reservas y comunicaci\u00F3n de tu condominio, o re\u00FAne los dispositivos compatibles de tu vivienda, desde un mismo lugar. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](77, "div", 57)(78, "a", 58);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](79, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](80, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](81, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](82, "a", 59);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](83, "Explorar servicios ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](84, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](85, "\u2192");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](86, "div", 60)(87, "div", 61)(88, "div", 62)(89, "div", 63)(90, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](91, "9:41");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](92, "span", 64);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](93, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](94, "\u25B4 \u25B0 \u25AC");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](95, "div", 65)(96, "span", 66);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](97, "CT");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](98, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](99, "Buenos d\u00EDas,");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](100, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](101, "Carlos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](102, "span", 67);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](103, "\u2630");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](104, "div", 68)(105, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](106, "Cuota del mes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](107, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](108, "RD$ 4,500");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](109, "div", 69);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](110, "i")(111, "i")(112, "i");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](113, "div", 70)(114, "div", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](115, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](116, "use", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](117, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](118, "Reservas");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](119, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](120, "\u00C1reas comunes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](121, "div", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](122, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](123, "use", 73);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](124, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](125, "Mensajes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](126, "span", 74);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](127, "3 nuevos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](128, "div", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](129, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](130, "use", 75);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](131, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](132, "C\u00E1maras");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](133, "span", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](134, "En l\u00EDnea");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](135, "div", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](136, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](137, "use", 77);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](138, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](139, "Dispositivos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](140, "span", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](141, "4 activos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](142, "div", 78)(143, "span", 79);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](144, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](145, "use", 80);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](146, "Inicio");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](147, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](148, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](149, "use", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](150, "Reservas");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](151, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](152, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](153, "use", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](154, "Pagos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](155, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](156, "svg");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](157, "use", 82);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](158, "M\u00E1s");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](159, "span", 83);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](160, "section", 84)(161, "div", 85)(162, "h2", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](163, "Tu comunidad, a mano");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](164, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](165, " Explora c\u00F3mo se organizan las cuentas, las reservas y la informaci\u00F3n en un mismo lugar. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](166, "section", 87)(167, "div", 88)(168, "span", 89);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](169, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](170, "use", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](171, "Residencial Jardines");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](172, "div", 90);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("keydown", function SaasLandingComponent_Template_div_keydown_172_listener($event) {
            return ctx.moveTab($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterCreate"](173, SaasLandingComponent_For_174_Template, 2, 5, "button", 91, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterCreate"](175, SaasLandingComponent_For_176_Template, 18, 8, "div", 92, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](177, "section", 93)(178, "div", 94)(179, "h2", 95);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](180, "Lo cotidiano,");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](181, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](182, "m\u00E1s sencillo.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](183, "ul", 96)(184, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](185, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](186, "use", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](187, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](188, "Consulta cuotas y pagos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](189, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](190, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](191, "de cada unidad");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](192, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](193, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](194, "use", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](195, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](196, "Coordina reservas");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](197, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](198, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](199, "de \u00E1reas comunes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](200, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](201, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](202, "use", 82);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](203, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](204, "Encuentra documentos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](205, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](206, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](207, "y avisos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](208, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](209, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](210, "use", 97);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](211, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](212, "Consulta dispositivos");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](213, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](214, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](215, "compatibles");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](216, "section", 98)(217, "div", 99)(218, "div", 100)(219, "h2", 101);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](220, " Todo lo que hace");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](221, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](222, "funcionar tu comunidad ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](223, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](224, " Del cuidado de las cuentas a los espacios que compartimos. Herramientas para mantener cada cosa en su lugar ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](225, "div", 102)(226, "figure");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](227, "img", 103);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](228, "figcaption");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](229, "M\u00E1s espacio para compartir");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](230, "div", 104)(231, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](232, "Las cuentas claras");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](233, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](234, "La comunidad conectada");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](235, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](236, " Administra tus condominios, unidades y propietarios en tu organizaci\u00F3n. Consulta estados de cuenta y re\u00FAne documentos, avisos y solicitudes sin perder el hilo. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](237, "ul", 105)(238, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](239, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](240, "use", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](241, "div")(242, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](243, "Finanzas que puedes consultar");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](244, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](245, " Cuotas, cargos, pagos, conciliaci\u00F3n y reportes. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](246, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](247, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](248, "use", 82);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](249, "div")(250, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](251, "Informaci\u00F3n para convivir mejor");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](252, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](253, " Documentos, avisos y seguimiento a consultas. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](254, "div", 106)(255, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](256, "svg", 107);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](257, "use", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](258, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](259, "Personas y propiedades");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](260, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](261, " Organiza condominios, unidades, propietarios y personal dentro de tu organizaci\u00F3n. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](262, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](263, "svg", 107);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](264, "use", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](265, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](266, "Espacios para compartir");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](267, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](268, " Coordina reservas de \u00E1reas comunes y consulta las visitas asociadas a cada unidad. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](269, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](270, "svg", 107);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](271, "use", 80);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](272, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](273, "Estancias bien coordinadas");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](274, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](275, " Consulta alquileres temporales y sincroniza calendarios con las integraciones iCal disponibles. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](276, "section", 108)(277, "div", 109)(278, "div", 110)(279, "span", 111);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](280, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](281, "use", 97);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](282, " Smart Home");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](283, "h2", 112);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](284, " Tu hogar tambi\u00E9n");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](285, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](286, "tiene su espacio. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](287, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](288, " Re\u00FAne tus dispositivos compatibles, consulta su estado y revisa su actividad desde tu vivienda personal o el contexto de tu condominio. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](289, "a", 113);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](290, "Conocer los tipos de cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](291, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](292, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](293, "p", 114);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](294, " Requiere dispositivos compatibles y una suscripci\u00F3n IoT habilitada. Las funciones disponibles dependen de tu cuenta y configuraci\u00F3n. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](295, "div", 115);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](296, "img", 116);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](297, "div", 117);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](298, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](299, "use", 97);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](300, "div")(301, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](302, "Luz de entrada");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](303, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](304, "Encendida \u00B7 Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](305, "span", 118);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](306, "section", 119)(307, "div", 85)(308, "h2", 120);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](309, "As\u00ED se vive con CondominiosApp");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](310, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](311, " Peque\u00F1as situaciones del d\u00EDa a d\u00EDa. Un lugar para resolverlas. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](312, "div", 121)(313, "article", 122)(314, "div", 123)(315, "span", 124);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](316, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](317, "div", 125);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](318, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](319, "use", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](320, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](321, "Unidad A-101");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](322, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](323, "Cuota de mantenimiento");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](324, "div")(325, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](326, "Estado de cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](327, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](328, "Disponible");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](329, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](330, "Revisa tu cuota, sin buscar de m\u00E1s");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](331, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](332, " Consulta los cargos y pagos de tu unidad y encuentra tu estado de cuenta cuando lo necesitas. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](333, "article", 122)(334, "div", 126)(335, "span", 124);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](336, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](337, "div", 127);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](338, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](339, "use", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](340, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](341, "Un s\u00E1bado para compartir");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](342, "div", 128)(343, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](344, "L");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](345, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](346, "M");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](347, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](348, "M");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](349, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](350, "J");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](351, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](352, "V");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](353, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](354, "S");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](355, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](356, "D");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](357, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](358, "Sal\u00F3n social \u00B7 Unidad A-101");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](359, "b", 129);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](360, "Reservado");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](361, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](362, "Haz espacio para tus planes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](363, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](364, " Coordina una reserva de un \u00E1rea com\u00FAn y consulta el calendario para organizar tu encuentro. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](365, "article", 122)(366, "div", 130)(367, "span", 124);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](368, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](369, "div", 131);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](370, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](371, "use", 97);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](372, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](373, "Sensor de puerta");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](374, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](375, "Entrada de tu vivienda");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](376, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](377, "span", 118);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](378, " Cerrada");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](379, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](380, "Consulta c\u00F3mo est\u00E1 tu hogar");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](381, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](382, " Revisa el estado de un dispositivo compatible y su actividad, seg\u00FAn las funciones habilitadas. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](383, "section", 132)(384, "div", 85)(385, "h2", 133);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](386, " Cada hogar tiene su forma de organizarse ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](387, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](388, " Elige la cuenta que corresponde a lo que quieres gestionar. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](389, "div", 134)(390, "article", 135)(391, "span", 136);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](392, "ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](393, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](394, "Administro condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](395, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](396, " Crea tu organizaci\u00F3n y gestiona uno o varios condominios, sus unidades y propietarios. Puede ser una empresa administradora o la administraci\u00F3n de tu propio condominio. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](397, "ul")(398, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](399, "Condominios y unidades en una organizaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](400, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](401, "Propietarios con acceso a su informaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](402, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](403, " Finanzas, reservas y comunicaci\u00F3n centralizadas. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](404, "a", 137);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](405, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](406, "span", 138);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](407, "para administrar condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](408, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](409, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](410, "article", 139)(411, "span", 140);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](412, "OWNER PERSONAL");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](413, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](414, "Gestiono mi vivienda");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](415, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](416, " Registra tu vivienda personal y re\u00FAne sus dispositivos Smart Home en tu propia cuenta, sin depender de una administraci\u00F3n de condominio. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](417, "ul")(418, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](419, "Tu vivienda bajo tu propia cuenta.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](420, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](421, "Estado y control de dispositivos compatibles.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](422, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](423, "Historial de actividad de tu hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](424, "a", 137);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](425, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](426, "span", 138);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](427, "para mi vivienda personal");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](428, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](429, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](430, "aside", 141);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](431, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](432, "use", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](433, "div")(434, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](435, "\u00BFTu condominio ya utiliza CondominiosApp?");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](436, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](437, " Tu administraci\u00F3n crea tu acceso, te asigna el condominio y la unidad, y te env\u00EDa las credenciales por correo. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](438, "a", 142);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](439, "Iniciar sesi\u00F3n ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](440, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](441, "\u2192");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](442, "section", 143)(443, "div", 144)(444, "div", 85)(445, "h2", 145);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](446, " Tu espacio empieza");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](447, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](448, "con un primer paso ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](449, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](450, " El registro te gu\u00EDa desde la elecci\u00F3n de tu cuenta hasta la configuraci\u00F3n de tu organizaci\u00F3n o vivienda. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](451, "a", 137);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](452, "Crear cuenta y comenzar ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](453, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](454, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](455, "ol", 146)(456, "li")(457, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](458, "Elige qu\u00E9 quieres gestionar");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](459, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](460, " Crea una cuenta ADMIN para tu organizaci\u00F3n o una cuenta OWNER PERSONAL para tu vivienda. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](461, "li")(462, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](463, "Verifica tu correo");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](464, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](465, " Completa el registro y abre el enlace que recibir\u00E1s por correo para activar tu cuenta. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](466, "li")(467, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](468, "Configura tu espacio");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](469, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](470, " Inicia sesi\u00F3n. Si administras, a\u00F1ade condominios, unidades y propietarios; si gestionas tu vivienda, configura los dispositivos compatibles. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](471, "section", 147)(472, "div", 148)(473, "h2", 149);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](474, "Antes de dar el primer paso");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](475, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](476, "Lo que necesitas saber para dar el primer paso.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](477, "div", 150);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeaterCreate"](478, SaasLandingComponent_For_479_Template, 6, 2, "details", null, _forTrack1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](480, "section", 151)(481, "div", 152);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](482, "svg", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](483, "use", 97);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](484, "h2", 153);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](485, " M\u00E1s tiempo para");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](486, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](487, "sentirte en casa ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](488, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](489, " Empieza a organizar tu comunidad o tu vivienda desde un mismo lugar. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](490, "a", 58);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](491, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](492, "span", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](493, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](494, "img", 154);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](495, "footer", 155)(496, "div")(497, "a", 156);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](498, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](499, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](500, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](501, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](502, "Gesti\u00F3n de condominios y vivienda personal.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](503, "nav", 157)(504, "a", 158);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](505, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](506, "a", 159);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](507, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](508, "a", 142);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](509, "Iniciar sesi\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](510, "a", 160);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](511, "Crear cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](512, "span", 161);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](513, "Una comunidad que se siente como hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_4_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](38);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵattribute"]("aria-expanded", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ctx.menuOpen() ? "Cerrar men\u00FA" : "Men\u00FA", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵconditional"]((tmp_4_0 = ctx.accountLink()) ? 52 : 53, tmp_4_0);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](121);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](303);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrepeater"](ctx.questions);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink],
      styles: ["@font-face{font-family:'Landing Manrope';src:url('/assets/landing/manrope-600.ttf') format('truetype');font-weight:600;font-display:swap}\n@font-face{font-family:'Landing Manrope';src:url('/assets/landing/manrope-700.ttf') format('truetype');font-weight:700;font-display:swap}\n@font-face{font-family:'Landing Inter';src:url('/assets/layout/styles/theme/tailwind-light/fonts/Inter-Regular.woff2') format('woff2');font-weight:400;font-display:swap}\n@font-face{font-family:'Landing Inter';src:url('/assets/layout/styles/theme/tailwind-light/fonts/Inter-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}\n[_nghost-%COMP%]{display:block}\n.saas-page[_ngcontent-%COMP%]{--canvas:#f7fafc;--ink:#102b3d;--muted:#53616c;--line:#d2e0eb;--green:#073b58;--mint:#e8f2f9;--coral:#6a9cbc;color:var(--ink);background:var(--canvas);font-family:'Landing Inter',sans-serif;font-size:15px;line-height:1.65;color-scheme:light}\n.saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{box-sizing:border-box}\n.container[_ngcontent-%COMP%]{width:min(1280px,calc(100% - 96px));margin-inline:auto}\n.saas-page[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:inherit;text-decoration:none}\n.saas-page[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font:inherit;cursor:pointer}\n.saas-page[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(a,button,summary,[tabindex]):focus-visible{outline:3px solid #247bab;outline-offset:5px}\n.saas-page[_ngcontent-%COMP%]   :is(section[id][_ngcontent-%COMP%], main[id][_ngcontent-%COMP%]){scroll-margin-top:110px}\n.saas-page[_ngcontent-%COMP%]   :is(a[_ngcontent-%COMP%], button[_ngcontent-%COMP%], summary[_ngcontent-%COMP%]){touch-action:manipulation;-webkit-tap-highlight-color:#cce4f2}\n.symbol-library[_ngcontent-%COMP%]{position:absolute;width:0;height:0;overflow:hidden}\nsvg[_ngcontent-%COMP%]{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;width:32px;height:32px;flex-shrink:0}\n.sr-only[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}\n.skip-link[_ngcontent-%COMP%]{position:fixed;top:12px;left:12px;z-index:100;padding:12px 20px;background:#fff;border:1px solid var(--ink);transform:translateY(-200%);border-radius:8px}\n.skip-link[_ngcontent-%COMP%]:focus{transform:translateY(0)}\n.site-header[_ngcontent-%COMP%]{position:sticky;top:0;z-index:20;background:var(--canvas);border-bottom:1px solid var(--line)}\n.header-inner[_ngcontent-%COMP%]{max-width:1440px;margin:auto;padding:18px 48px;display:flex;align-items:center;justify-content:space-between;gap:24px}\n.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;font-family:'Landing Manrope',sans-serif;font-size:21px;font-weight:700;letter-spacing:-.06em;white-space:nowrap}\n.brand-mark[_ngcontent-%COMP%]{width:34px;height:34px;padding:5px;margin-right:8px;background:var(--green);color:white;border-radius:10px}\n.brand-accent[_ngcontent-%COMP%]{color:var(--green)}\n#public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:24px}\n#public-navigation[_ngcontent-%COMP%]{flex:1;justify-content:flex-end}\n.section-links[_ngcontent-%COMP%], .sign-in[_ngcontent-%COMP%]{font-size:12px}\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .sign-in[_ngcontent-%COMP%]{padding-block:10px}\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .sign-in[_ngcontent-%COMP%]:hover{color:var(--green);text-decoration:underline;text-underline-offset:5px}\n.header-actions[_ngcontent-%COMP%]{gap:22px}\n.button[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;gap:28px;min-height:52px;padding:14px 24px;background:var(--green);color:#fff!important;border:1px solid var(--green);border-radius:14px;font-size:14px;font-weight:600;box-shadow:0 4px 12px #073b5814;transition:background .18s,transform .18s,box-shadow .18s}\n.button[_ngcontent-%COMP%]:hover{background:#0c5074;transform:translateY(-2px);box-shadow:0 6px 16px #073b5825}\n.button[_ngcontent-%COMP%]:active{transform:translateY(2px);box-shadow:0 1px 4px #073b5814}\n.button-small[_ngcontent-%COMP%]{min-height:42px;padding:9px 17px;gap:16px;font-size:12px;border-radius:11px}\n.menu-toggle[_ngcontent-%COMP%]{display:none}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], p[_ngcontent-%COMP%], figure[_ngcontent-%COMP%]{margin:0}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%]{font-family:'Landing Manrope',sans-serif;font-weight:700;text-wrap:balance;color:inherit}\nh1[_ngcontent-%COMP%]{font-size:clamp(40px,4.3vw,62px);line-height:1.08;letter-spacing:-.055em;margin-block:22px}\nh2[_ngcontent-%COMP%]{font-size:clamp(30px,3.1vw,44px);line-height:1.14;letter-spacing:-.045em}\nh3[_ngcontent-%COMP%]{font-size:23px;line-height:1.3;letter-spacing:-.035em}\nh4[_ngcontent-%COMP%]{font-size:16px;line-height:1.4}\np[_ngcontent-%COMP%]{text-wrap:pretty}\n.text-link[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-size:13px;font-weight:600;text-underline-offset:5px}\n.text-link[_ngcontent-%COMP%]:hover{text-decoration:underline}\n.product-preview[_ngcontent-%COMP%]{position:absolute;bottom:0;left:-22px;width:calc(100% - 20px);background:white;border:1px solid var(--line);border-radius:18px;box-shadow:0 14px 32px #183e3217}\n.preview-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 20px 10px}\n.preview-brand[_ngcontent-%COMP%]{font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px}\n.preview-brand[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:22px;height:22px;color:var(--green)}\n.illustration-label[_ngcontent-%COMP%]{color:var(--muted);font-size:10px}\n.preview-tabs[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);padding:0 14px;border-bottom:1px solid var(--line)}\n.preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:transparent;border:0;border-bottom:3px solid transparent;padding:12px 0;color:var(--muted);font-size:11px;min-height:44px}\n.preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{color:var(--green);background:#edf5fb}\n.preview-tabs[_ngcontent-%COMP%]   button[aria-selected=true][_ngcontent-%COMP%]{border-bottom-color:var(--green);color:var(--green);font-weight:600}\n.preview-body[_ngcontent-%COMP%]{padding:16px 20px;min-height:258px}\n.preview-body[hidden][_ngcontent-%COMP%]{display:none}\n.preview-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:18px;letter-spacing:-.025em;margin-bottom:6px}\n.preview-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:11px;color:var(--muted);margin-bottom:12px}\n.preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:10px;table-layout:fixed;font-variant-numeric:tabular-nums}\n.preview-body[_ngcontent-%COMP%]   :is(th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]){text-align:left;padding:7px 5px;border-bottom:1px solid #e7ece7;overflow-wrap:anywhere}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child{width:26%}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(2){width:46%}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{font-weight:600}\n.preview-body[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]{color:var(--muted)}\n.row-status[_ngcontent-%COMP%]{background:var(--mint);color:#175477;padding:3px 5px;border-radius:5px;display:inline-block}\n.preview-note[_ngcontent-%COMP%]{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:9px;margin-top:12px}\n.small-square[_ngcontent-%COMP%]{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmcuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLDZCQUE2QixDQUFDLDZEQUE2RCxDQUFDLGVBQWUsQ0FBQyxpQkFBaUI7QUFDeEksV0FBVyw2QkFBNkIsQ0FBQyw2REFBNkQsQ0FBQyxlQUFlLENBQUMsaUJBQWlCO0FBQ3hJLFdBQVcsMkJBQTJCLENBQUMsK0ZBQStGLENBQUMsZUFBZSxDQUFDLGlCQUFpQjtBQUN4SyxXQUFXLDJCQUEyQixDQUFDLGdHQUFnRyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUI7QUFDekssTUFBTSxhQUFhO0FBQ25CLFdBQVcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsc0NBQXNDLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQjtBQUMzUCxhQUFhLHFCQUFxQjtBQUNsQyxXQUFXLG1DQUFtQyxDQUFDLGtCQUFrQjtBQUNqRSxhQUFhLGFBQWEsQ0FBQyxvQkFBb0I7QUFDL0Msa0JBQWtCLFlBQVksQ0FBQyxjQUFjO0FBQzdDLDBEQUEwRCx5QkFBeUIsQ0FBQyxrQkFBa0I7QUFDdEcscUNBQXFDLHVCQUF1QjtBQUM1RCxpQ0FBaUMseUJBQXlCLENBQUMsbUNBQW1DO0FBQzlGLGdCQUFnQixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWU7QUFDbEUsSUFBSSxTQUFTLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxhQUFhO0FBQ2xJLFNBQVMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsa0JBQWtC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aUIsQ0FBQyxnQkFBZ0I7QUFDaEQsc0JBQXNCLFlBQVk7QUFDbEMsaUJBQWlCLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUI7QUFDeEUsZ0JBQWdCLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0I7QUFDcEUsb0JBQW9CLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsaUNBQWlDO0FBQzNILHlCQUF5QixlQUFlLENBQUMsZUFBZSxDQUFDLCtCQUErQixDQUFDLHNCQUFzQjtBQUMvRyw2QkFBNkIsU0FBUztBQUN0Qyw4QkFBOEIsU0FBUztBQUN2QyxpQkFBaUIsZUFBZTtBQUNoQyxvQkFBb0Isa0JBQWtCO0FBQ3RDLFlBQVksc0JBQXNCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0I7QUFDdkcsY0FBYyxZQUFZLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxlQUFlO0FBQ3RHLGNBQWMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiQGZvbnQtZmFjZXtmb250LWZhbWlseTonTGFuZGluZyBNYW5yb3BlJztzcmM6dXJsKCcvYXNzZXRzL2xhbmRpbmcvbWFucm9wZS02MDAudHRmJykgZm9ybWF0KCd0cnVldHlwZScpO2ZvbnQtd2VpZ2h0OjYwMDtmb250LWRpc3BsYXk6c3dhcH1cclxuQGZvbnQtZmFjZXtmb250LWZhbWlseTonTGFuZGluZyBNYW5yb3BlJztzcmM6dXJsKCcvYXNzZXRzL2xhbmRpbmcvbWFucm9wZS03MDAudHRmJykgZm9ybWF0KCd0cnVldHlwZScpO2ZvbnQtd2VpZ2h0OjcwMDtmb250LWRpc3BsYXk6c3dhcH1cclxuQGZvbnQtZmFjZXtmb250LWZhbWlseTonTGFuZGluZyBJbnRlcic7c3JjOnVybCgnL2Fzc2V0cy9sYXlvdXQvc3R5bGVzL3RoZW1lL3RhaWx3aW5kLWxpZ2h0L2ZvbnRzL0ludGVyLVJlZ3VsYXIud29mZjInKSBmb3JtYXQoJ3dvZmYyJyk7Zm9udC13ZWlnaHQ6NDAwO2ZvbnQtZGlzcGxheTpzd2FwfVxyXG5AZm9udC1mYWNle2ZvbnQtZmFtaWx5OidMYW5kaW5nIEludGVyJztzcmM6dXJsKCcvYXNzZXRzL2xheW91dC9zdHlsZXMvdGhlbWUvdGFpbHdpbmQtbGlnaHQvZm9udHMvSW50ZXItU2VtaUJvbGQud29mZjInKSBmb3JtYXQoJ3dvZmYyJyk7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtZGlzcGxheTpzd2FwfVxyXG46aG9zdHtkaXNwbGF5OmJsb2NrfVxyXG4uc2Fhcy1wYWdley0tY2FudmFzOiNmN2ZhZmM7LS1pbms6IzEwMmIzZDstLW11dGVkOiM1MzYxNmM7LS1saW5lOiNkMmUwZWI7LS1ncmVlbjojMDczYjU4Oy0tbWludDojZThmMmY5Oy0tY29yYWw6IzZhOWNiYztjb2xvcjp2YXIoLS1pbmspO2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtmb250LWZhbWlseTonTGFuZGluZyBJbnRlcicsc2Fucy1zZXJpZjtmb250LXNpemU6MTVweDtsaW5lLWhlaWdodDoxLjY1O2NvbG9yLXNjaGVtZTpsaWdodH1cclxuLnNhYXMtcGFnZSAqe2JveC1zaXppbmc6Ym9yZGVyLWJveH1cclxuLmNvbnRhaW5lcnt3aWR0aDptaW4oMTI4MHB4LGNhbGMoMTAwJSAtIDk2cHgpKTttYXJnaW4taW5saW5lOmF1dG99XHJcbi5zYWFzLXBhZ2UgYXtjb2xvcjppbmhlcml0O3RleHQtZGVjb3JhdGlvbjpub25lfVxyXG4uc2Fhcy1wYWdlIGJ1dHRvbntmb250OmluaGVyaXQ7Y3Vyc29yOnBvaW50ZXJ9XHJcbi5zYWFzLXBhZ2UgOmlzKGEsYnV0dG9uLHN1bW1hcnksW3RhYmluZGV4XSk6Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjMjQ3YmFiO291dGxpbmUtb2Zmc2V0OjVweH1cclxuLnNhYXMtcGFnZSA6aXMoc2VjdGlvbltpZF0sbWFpbltpZF0pe3Njcm9sbC1tYXJnaW4tdG9wOjExMHB4fVxyXG4uc2Fhcy1wYWdlIDppcyhhLGJ1dHRvbixzdW1tYXJ5KXt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9uOy13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjojY2NlNGYyfVxyXG4uc3ltYm9sLWxpYnJhcnl7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MDtoZWlnaHQ6MDtvdmVyZmxvdzpoaWRkZW59XHJcbnN2Z3tmaWxsOm5vbmU7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MS43O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt3aWR0aDozMnB4O2hlaWdodDozMnB4O2ZsZXgtc2hyaW5rOjB9XHJcbi5zci1vbmx5e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjFweDtoZWlnaHQ6MXB4O292ZXJmbG93OmhpZGRlbjtjbGlwLXBhdGg6aW5zZXQoNTAlKTt3aGl0ZS1zcGFjZTpub3dyYXB9XHJcbi5za2lwLWxpbmt7cG9zaXRpb246Zml4ZWQ7dG9wOjEycHg7bGVmdDoxMnB4O3otaW5kZXg6MTAwO3BhZGRpbmc6MTJweCAyMHB4O2JhY2tncm91bmQ6I2ZmZjtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWluayk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTIwMCUpO2JvcmRlci1yYWRpdXM6OHB4fVxyXG4uc2tpcC1saW5rOmZvY3Vze3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfVxyXG4uc2l0ZS1oZWFkZXJ7cG9zaXRpb246c3RpY2t5O3RvcDowO3otaW5kZXg6MjA7YmFja2dyb3VuZDp2YXIoLS1jYW52YXMpO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWxpbmUpfVxyXG4uaGVhZGVyLWlubmVye21heC13aWR0aDoxNDQwcHg7bWFyZ2luOmF1dG87cGFkZGluZzoxOHB4IDQ4cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtnYXA6MjRweH1cclxuLmJyYW5ke2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtZmFtaWx5OidMYW5kaW5nIE1hbnJvcGUnLHNhbnMtc2VyaWY7Zm9udC1zaXplOjIxcHg7Zm9udC13ZWlnaHQ6NzAwO2xldHRlci1zcGFjaW5nOi0uMDZlbTt3aGl0ZS1zcGFjZTpub3dyYXB9XHJcbi5icmFuZC1tYXJre3dpZHRoOjM0cHg7aGVpZ2h0OjM0cHg7cGFkZGluZzo1cHg7bWFyZ2luLXJpZ2h0OjhweDtiYWNrZ3JvdW5kOnZhcigtLWdyZWVuKTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjEwcHh9XHJcbi5icmFuZC1hY2NlbnR7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4jcHVibGljLW5hdmlnYXRpb24sLnNlY3Rpb24tbGlua3MsLmhlYWRlci1hY3Rpb25ze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjI0cHh9XHJcbiNwdWJsaWMtbmF2aWdhdGlvbntmbGV4OjE7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kfVxyXG4uc2VjdGlvbi1saW5rcywuc2lnbi1pbntmb250LXNpemU6MTJweH1cclxuLnNlY3Rpb24tbGlua3MgYSwuc2lnbi1pbntwYWRkaW5nLWJsb2NrOjEwcHh9XHJcbi5zZWN0aW9uLWxpbmtzIGE6aG92ZXIsLnNpdGUtZm9vdGVyIG5hdiBhOmhvdmVyLC5zaWduLWluOmhvdmVye2NvbG9yOnZhcigtLWdyZWVuKTt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO3RleHQtdW5kZXJsaW5lLW9mZnNldDo1cHh9XHJcbi5oZWFkZXItYWN0aW9uc3tnYXA6MjJweH1cclxuLmJ1dHRvbntkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2dhcDoyOHB4O21pbi1oZWlnaHQ6NTJweDtwYWRkaW5nOjE0cHggMjRweDtiYWNrZ3JvdW5kOnZhcigtLWdyZWVuKTtjb2xvcjojZmZmIWltcG9ydGFudDtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWdyZWVuKTtib3JkZXItcmFkaXVzOjE0cHg7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NjAwO2JveC1zaGFkb3c6MCA0cHggMTJweCAjMDczYjU4MTQ7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4xOHMsdHJhbnNmb3JtIC4xOHMsYm94LXNoYWRvdyAuMThzfVxyXG4uYnV0dG9uOmhvdmVye2JhY2tncm91bmQ6IzBjNTA3NDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93OjAgNnB4IDE2cHggIzA3M2I1ODI1fVxyXG4uYnV0dG9uOmFjdGl2ZXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgycHgpO2JveC1zaGFkb3c6MCAxcHggNHB4ICMwNzNiNTgxNH1cclxuLmJ1dHRvbi1zbWFsbHttaW4taGVpZ2h0OjQycHg7cGFkZGluZzo5cHggMTdweDtnYXA6MTZweDtmb250LXNpemU6MTJweDtib3JkZXItcmFkaXVzOjExcHh9XHJcbi5tZW51LXRvZ2dsZXtkaXNwbGF5Om5vbmV9XHJcbmgxLGgyLGgzLGg0LHAsZmlndXJle21hcmdpbjowfVxyXG5oMSxoMixoMyxoNHtmb250LWZhbWlseTonTGFuZGluZyBNYW5yb3BlJyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjcwMDt0ZXh0LXdyYXA6YmFsYW5jZTtjb2xvcjppbmhlcml0fVxyXG5oMXtmb250LXNpemU6Y2xhbXAoNDBweCw0LjN2dyw2MnB4KTtsaW5lLWhlaWdodDoxLjA4O2xldHRlci1zcGFjaW5nOi0uMDU1ZW07bWFyZ2luLWJsb2NrOjIycHh9XHJcbmgye2ZvbnQtc2l6ZTpjbGFtcCgzMHB4LDMuMXZ3LDQ0cHgpO2xpbmUtaGVpZ2h0OjEuMTQ7bGV0dGVyLXNwYWNpbmc6LS4wNDVlbX1cclxuaDN7Zm9udC1zaXplOjIzcHg7bGluZS1oZWlnaHQ6MS4zO2xldHRlci1zcGFjaW5nOi0uMDM1ZW19XHJcbmg0e2ZvbnQtc2l6ZToxNnB4O2xpbmUtaGVpZ2h0OjEuNH1cclxucHt0ZXh0LXdyYXA6cHJldHR5fVxyXG4udGV4dC1saW5re2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxNHB4O21pbi1oZWlnaHQ6NDRweDtmb250LXNpemU6MTNweDtmb250LXdlaWdodDo2MDA7dGV4dC11bmRlcmxpbmUtb2Zmc2V0OjVweH1cclxuLnRleHQtbGluazpob3Zlcnt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lfVxyXG4ucHJvZHVjdC1wcmV2aWV3e3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTowO2xlZnQ6LTIycHg7d2lkdGg6Y2FsYygxMDAlIC0gMjBweCk7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWxpbmUpO2JvcmRlci1yYWRpdXM6MThweDtib3gtc2hhZG93OjAgMTRweCAzMnB4ICMxODNlMzIxN31cclxuLnByZXZpZXctdG9we2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjhweDtwYWRkaW5nOjE0cHggMjBweCAxMHB4fVxyXG4ucHJldmlldy1icmFuZHtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo2MDA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4fVxyXG4ucHJldmlldy1icmFuZCBzdmd7d2lkdGg6MjJweDtoZWlnaHQ6MjJweDtjb2xvcjp2YXIoLS1ncmVlbil9XHJcbi5pbGx1c3RyYXRpb24tbGFiZWx7Y29sb3I6dmFyKC0tbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fVxyXG4ucHJldmlldy10YWJze2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDQsMWZyKTtwYWRkaW5nOjAgMTRweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1saW5lKX1cclxuLnByZXZpZXctdGFicyBidXR0b257YmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6MDtib3JkZXItYm90dG9tOjNweCBzb2xpZCB0cmFuc3BhcmVudDtwYWRkaW5nOjEycHggMDtjb2xvcjp2YXIoLS1tdXRlZCk7Zm9udC1zaXplOjExcHg7bWluLWhlaWdodDo0NHB4fVxyXG4ucHJldmlldy10YWJzIGJ1dHRvbjpob3Zlcntjb2xvcjp2YXIoLS1ncmVlbik7YmFja2dyb3VuZDojZWRmNWZifVxyXG4ucHJldmlldy10YWJzIGJ1dHRvblthcmlhLXNlbGVjdGVkPXRydWVde2JvcmRlci1ib3R0b20tY29sb3I6dmFyKC0tZ3JlZW4pO2NvbG9yOnZhcigtLWdyZWVuKTtmb250LXdlaWdodDo2MDB9XHJcbi5wcmV2aWV3LWJvZHl7cGFkZGluZzoxNnB4IDIwcHg7bWluLWhlaWdodDoyNThweH1cclxuLnByZXZpZXctYm9keVtoaWRkZW5de2Rpc3BsYXk6bm9uZX1cclxuLnByZXZpZXctYm9keSBoMntmb250LXNpemU6MThweDtsZXR0ZXItc3BhY2luZzotLjAyNWVtO21hcmdpbi1ib3R0b206NnB4fVxyXG4ucHJldmlldy1ib2R5IHB7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi1ib3R0b206MTJweH1cclxuLnByZXZpZXctYm9keSB0YWJsZXt3aWR0aDoxMDAlO2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZTtmb250LXNpemU6MTBweDt0YWJsZS1sYXlvdXQ6Zml4ZWQ7Zm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zfVxyXG4ucHJldmlldy1ib2R5IDppcyh0aCx0ZCl7dGV4dC1hbGlnbjpsZWZ0O3BhZGRpbmc6N3B4IDVweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTdlY2U3O292ZXJmbG93LXdyYXA6YW55d2hlcmV9XHJcbi5wcmV2aWV3LWJvZHkgdGg6Zmlyc3QtY2hpbGR7d2lkdGg6MjYlfVxyXG4ucHJldmlldy1ib2R5IHRoOm50aC1jaGlsZCgyKXt3aWR0aDo0NiV9XHJcbi5wcmV2aWV3LWJvZHkgdGh7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ucHJldmlldy1ib2R5IHRoZWFke2NvbG9yOnZhcigtLW11dGVkKX1cclxuLnJvdy1zdGF0dXN7YmFja2dyb3VuZDp2YXIoLS1taW50KTtjb2xvcjojMTc1NDc3O3BhZGRpbmc6M3B4IDVweDtib3JkZXItcmFkaXVzOjVweDtkaXNwbGF5OmlubGluZS1ibG9ja31cclxuLnByZXZpZXctbm90ZXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo3cHg7Y29sb3I6dmFyKC0tbXV0ZWQpO2ZvbnQtc2l6ZTo5cHg7bWFyZ2luLXRvcDoxMnB4fVxyXG4uc21hbGwtc3F1YXJle3dpZHRoOjVweDtoZWlnaHQ6NXB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2ZsZXgtc2hyaW5rOjB9XHJcbiJdLCJzb3VyY2VSb290IjoiIn0= */", ".benefits-section[_ngcontent-%COMP%]{background:var(--mint);padding-block:32px}\n.benefits-inner[_ngcontent-%COMP%]{display:flex;align-items:center;gap:46px}\n.benefits-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:22px;flex-shrink:0}\n.benefits-list[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);list-style:none;padding:0;margin:0;width:100%;gap:20px}\n.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;font-size:12px}\n.benefits-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:29px;height:29px;color:var(--green)}\n.section-padding[_ngcontent-%COMP%]{padding-block:88px}\n.section-intro[_ngcontent-%COMP%]{max-width:720px;margin-bottom:40px}\n.section-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);margin-top:18px;max-width:500px}\n.service-heading[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-end;gap:60px;max-width:none}\n.service-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:380px}\n.community-feature[_ngcontent-%COMP%]{display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center}\n.community-feature[_ngcontent-%COMP%]   figure[_ngcontent-%COMP%]{position:relative}\n.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:400px;object-fit:cover;display:block;border-radius:22px}\n.community-feature[_ngcontent-%COMP%]   figcaption[_ngcontent-%COMP%]{position:absolute;bottom:20px;left:20px;background:var(--canvas);border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600}\n.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:30px;margin-bottom:18px}\n.feature-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{color:var(--muted)}\n.feature-list[_ngcontent-%COMP%]{list-style:none;padding:0;margin:26px 0 0}\n.feature-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;gap:16px;margin-top:22px}\n.feature-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green)}\n.feature-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:13px;color:var(--muted);margin-top:4px}\n.shared-services[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:38px;margin-top:44px}\n.shared-services[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]{border-top:1px solid var(--line);padding-top:24px}\n.service-icon[_ngcontent-%COMP%]{color:var(--green);margin-bottom:14px}\n.shared-services[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px;margin-bottom:10px}\n.shared-services[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.connected-section[_ngcontent-%COMP%]{background:var(--ink);color:var(--canvas);padding-block:64px}\n.connected-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1.1fr;align-items:center;gap:80px}\n.feature-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;color:#cce5f5;font-weight:600;margin-bottom:20px}\n.connected-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{color:#d2e2ee;margin-top:22px}\n.connected-copy[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:22px}\n.connected-copy[_ngcontent-%COMP%]   .availability-note[_ngcontent-%COMP%]{font-size:11px;max-width:400px;margin-top:24px}\n.connected-visual[_ngcontent-%COMP%]{position:relative;padding-bottom:22px}\n.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:390px;object-fit:cover;border-radius:22px 70px 22px 22px;display:block}\n.device-example[_ngcontent-%COMP%]{display:flex;gap:14px;align-items:center;position:absolute;bottom:0;left:22px;right:22px;padding:16px 22px;background:var(--canvas);color:var(--ink);border-radius:16px;box-shadow:0 8px 18px #0002}\n.device-example[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1}\n.device-example[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .device-example[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;font-size:13px}\n.device-example[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:11px;color:var(--muted)}\n.device-dot[_ngcontent-%COMP%]{display:inline-block;width:9px;height:9px;background:var(--green);border-radius:50%;flex-shrink:0}\n.everyday-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}\n.scene-art[_ngcontent-%COMP%]{height:250px;display:flex;align-items:center;justify-content:center;position:relative;border-radius:18px;padding:24px}\n.finance-art[_ngcontent-%COMP%]{background:var(--mint)}\n.booking-art[_ngcontent-%COMP%]{background:#edf2fa}\n.home-art[_ngcontent-%COMP%]{background:#e4eef4}\n.scene-label[_ngcontent-%COMP%]{position:absolute;top:14px;left:18px;font-size:10px;color:var(--muted)}\n.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{background:white;border:1px solid #d8e2d8;border-radius:12px;width:100%;max-width:270px;padding:20px;display:flex;flex-direction:column;gap:8px;box-shadow:0 8px 18px #183e320b;font-size:11px}\n.mini-statement[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:14px}\n.mini-statement[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green);width:25px;height:25px}\n.mini-statement[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-between;border-top:1px solid var(--line);padding-top:12px;margin-top:6px;gap:8px}\n.calendar-days[_ngcontent-%COMP%]{display:flex;justify-content:space-between;border-block:1px solid var(--line);padding-block:10px;align-items:center}\n.calendar-days[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{padding:4px 8px;background:var(--green);color:white;border-radius:50%}\n.calendar-status[_ngcontent-%COMP%]{color:var(--green)}\n.mini-device[_ngcontent-%COMP%]{align-items:center;padding-block:26px}\n.mini-device[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{background:var(--mint);padding:7px 14px;border-radius:8px;margin-top:8px}\n.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-block:22px 12px;font-size:21px}\n.everyday-scene[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);font-size:14px}\n.audience-section[_ngcontent-%COMP%]{padding-top:16px}\n.audience-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:24px}\n.audience-card[_ngcontent-%COMP%]{border:1px solid #c9dce9;border-radius:22px;background:var(--mint);padding:38px;display:flex;flex-direction:column;align-items:flex-start}\n.personal-card[_ngcontent-%COMP%]{background:#eef4f8;border-color:#d4e2ec}\n.account-label[_ngcontent-%COMP%]{display:inline-block;font-size:10px;font-weight:600;border:1px solid #bacfdf;padding:5px 10px;border-radius:7px;margin-bottom:22px}\n.personal-label[_ngcontent-%COMP%]{border-color:#c5d9e7}\n.audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:30px;margin-bottom:18px}\n.audience-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.audience-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding-left:20px;margin-block:20px 24px}\n.audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding-block:5px}\n.audience-card[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:auto;border-bottom:1px solid var(--green)}\n.resident-note[_ngcontent-%COMP%]{display:flex;align-items:center;gap:22px;margin-top:28px;padding:26px 0;border-block:1px solid var(--line)}\n.resident-note[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1}\n.resident-note[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:18px;margin-bottom:6px}\n.resident-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);font-size:13px;max-width:760px}\n.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:13px;font-weight:600;min-height:44px;display:inline-flex;align-items:center;gap:10px;text-decoration:underline;text-underline-offset:5px}\n.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:var(--green)}\n.getting-started[_ngcontent-%COMP%]{background:#edf4f9}\n.steps-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1.1fr;gap:90px}\n.steps-layout[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]{margin:0}\n.steps-layout[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:22px}\n.steps-list[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;counter-reset:steps}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{position:relative;padding:0 0 30px 66px;counter-increment:steps}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::before{content:counter(steps);position:absolute;left:0;top:0;background:var(--green);color:white;font-family:'Landing Manrope',sans-serif;font-weight:600;width:40px;height:40px;display:grid;place-items:center;border-radius:50%}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child)::after{content:'';position:absolute;left:19px;top:48px;bottom:8px;width:1px;background:#afcada}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{padding-bottom:0}\n.steps-list[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px;margin-bottom:10px}\n.steps-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.faq-section[_ngcontent-%COMP%]{display:grid;grid-template-columns:.85fr 1.15fr;gap:90px}\n.faq-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);margin-top:20px}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]{border-bottom:1px solid var(--line)}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]:first-child{border-top:1px solid var(--line)}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 0;cursor:pointer;font-weight:600;font-size:14px;list-style:none}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::-webkit-details-marker{display:none}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]:hover{color:var(--green)}\n.faq-toggle[_ngcontent-%COMP%]{width:16px;height:16px;position:relative;flex-shrink:0}\n.faq-toggle[_ngcontent-%COMP%]::before, .faq-toggle[_ngcontent-%COMP%]::after{content:'';position:absolute;background:currentColor;width:14px;height:1px;top:7px;left:1px}\n.faq-toggle[_ngcontent-%COMP%]::after{transform:rotate(90deg);transition:transform .18s}\ndetails[open][_ngcontent-%COMP%]   .faq-toggle[_ngcontent-%COMP%]::after{transform:rotate(0)}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:0 28px 22px 0;font-size:13px;color:var(--muted)}\n.closing-section[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;background:var(--mint);border-radius:26px;overflow:hidden}\n.closing-copy[_ngcontent-%COMP%]{padding:48px}\n.closing-copy[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green);margin-bottom:22px;width:40px;height:40px}\n.closing-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);max-width:350px;margin-block:18px 24px}\n.closing-section[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{width:100%;height:100%;min-height:390px;object-fit:cover}\n.site-footer[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding-block:44px 28px}\n.site-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:12px;color:var(--muted);margin-top:8px}\n.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;flex-wrap:wrap;align-content:center;gap:12px 22px;font-size:12px}\n.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{min-height:44px;display:inline-flex;align-items:center}\n.footer-detail[_ngcontent-%COMP%]{grid-column:1/-1;font-size:11px;color:var(--muted);border-top:1px solid var(--line);padding-top:20px}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmctc2VjdGlvbnMuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtCQUFrQixzQkFBc0IsQ0FBQyxrQkFBa0I7QUFDM0QsZ0JBQWdCLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRO0FBQ3hELG1CQUFtQixjQUFjLENBQUMsYUFBYTtBQUMvQyxlQUFlLFlBQVksQ0FBQyxtQ0FBbUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUTtBQUN0SCxrQkFBa0IsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxjQUFjO0FBQ3pFLG1CQUFtQixVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtBQUM1RCxpQkFBaUIsa0JBQWtCO0FBQ25DLGVBQWUsZUFBZSxDQUFDLGtCQUFrQjtBQUNqRCxpQkFBaUIsa0JBQWtCLENBQUMsZUFBZSxDQUFDLGVBQWU7QUFDbkUsaUJBQWlCLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsY0FBYztBQUN4RyxtQkFBbUIsZUFBZTtBQUNsQyxtQkFBbUIsWUFBWSxDQUFDLCtCQUErQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0I7QUFDM0YsMEJBQTBCLGlCQUFpQjtBQUMzQyx1QkFBdUIsVUFBVSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsa0JBQWtCO0FBQ2hHLDhCQUE4QixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxlQUFlO0FBQ2xLLGlCQUFpQixjQUFjLENBQUMsa0JBQWtCO0FBQ2xELGdCQUFnQixrQkFBa0I7QUFDbEMsY0FBYyxlQUFlLENBQUMsU0FBUyxDQUFDLGVBQWU7QUFDdkQsaUJBQWlCLFlBQVksQ0FBQyxR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Q3hGLGVBQWUsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGNBQWM7QUFDL0QsaUJBQWlCLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLGNBQWM7QUFDdkgsbUJBQW1CLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0I7QUFDekUsZUFBZSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLENBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLmJlbmVmaXRzLXNlY3Rpb257YmFja2dyb3VuZDp2YXIoLS1taW50KTtwYWRkaW5nLWJsb2NrOjMycHh9XHJcbi5iZW5lZml0cy1pbm5lcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0NnB4fVxyXG4uYmVuZWZpdHMtaW5uZXIgaDJ7Zm9udC1zaXplOjIycHg7ZmxleC1zaHJpbms6MH1cclxuLmJlbmVmaXRzLWxpc3R7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoNCwxZnIpO2xpc3Qtc3R5bGU6bm9uZTtwYWRkaW5nOjA7bWFyZ2luOjA7d2lkdGg6MTAwJTtnYXA6MjBweH1cclxuLmJlbmVmaXRzLWxpc3QgbGl7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDtmb250LXNpemU6MTJweH1cclxuLmJlbmVmaXRzLWxpc3Qgc3Zne3dpZHRoOjI5cHg7aGVpZ2h0OjI5cHg7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6ODhweH1cclxuLnNlY3Rpb24taW50cm97bWF4LXdpZHRoOjcyMHB4O21hcmdpbi1ib3R0b206NDBweH1cclxuLnNlY3Rpb24taW50cm8gcHtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLXRvcDoxOHB4O21heC13aWR0aDo1MDBweH1cclxuLnNlcnZpY2UtaGVhZGluZ3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjYwcHg7bWF4LXdpZHRoOm5vbmV9XHJcbi5zZXJ2aWNlLWhlYWRpbmcgcHttYXgtd2lkdGg6MzgwcHh9XHJcbi5jb21tdW5pdHktZmVhdHVyZXtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjEuMWZyIDFmcjtnYXA6NjBweDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5jb21tdW5pdHktZmVhdHVyZSBmaWd1cmV7cG9zaXRpb246cmVsYXRpdmV9XHJcbi5jb21tdW5pdHktZmVhdHVyZSBpbWd7d2lkdGg6MTAwJTtoZWlnaHQ6NDAwcHg7b2JqZWN0LWZpdDpjb3ZlcjtkaXNwbGF5OmJsb2NrO2JvcmRlci1yYWRpdXM6MjJweH1cclxuLmNvbW11bml0eS1mZWF0dXJlIGZpZ2NhcHRpb257cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjIwcHg7bGVmdDoyMHB4O2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtib3JkZXItcmFkaXVzOjEwcHg7cGFkZGluZzoxMHB4IDE2cHg7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZmVhdHVyZS1jb3B5IGgze2ZvbnQtc2l6ZTozMHB4O21hcmdpbi1ib3R0b206MThweH1cclxuLmZlYXR1cmUtY29weT5we2NvbG9yOnZhcigtLW11dGVkKX1cclxuLmZlYXR1cmUtbGlzdHtsaXN0LXN0eWxlOm5vbmU7cGFkZGluZzowO21hcmdpbjoyNnB4IDAgMH1cclxuLmZlYXR1cmUtbGlzdCBsaXtkaXNwbGF5OmZsZXg7Z2FwOjE2cHg7bWFyZ2luLXRvcDoyMnB4fVxyXG4uZmVhdHVyZS1saXN0IHN2Z3tjb2xvcjp2YXIoLS1ncmVlbil9XHJcbi5mZWF0dXJlLWxpc3QgcHtmb250LXNpemU6MTNweDtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLXRvcDo0cHh9XHJcbi5zaGFyZWQtc2VydmljZXN7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMywxZnIpO2dhcDozOHB4O21hcmdpbi10b3A6NDRweH1cclxuLnNoYXJlZC1zZXJ2aWNlcyBhcnRpY2xle2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctdG9wOjI0cHh9XHJcbi5zZXJ2aWNlLWljb257Y29sb3I6dmFyKC0tZ3JlZW4pO21hcmdpbi1ib3R0b206MTRweH1cclxuLnNoYXJlZC1zZXJ2aWNlcyBoM3tmb250LXNpemU6MjBweDttYXJnaW4tYm90dG9tOjEwcHh9XHJcbi5zaGFyZWQtc2VydmljZXMgcHtmb250LXNpemU6MTRweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5jb25uZWN0ZWQtc2VjdGlvbntiYWNrZ3JvdW5kOnZhcigtLWluayk7Y29sb3I6dmFyKC0tY2FudmFzKTtwYWRkaW5nLWJsb2NrOjY0cHh9XHJcbi5jb25uZWN0ZWQtbGF5b3V0e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDEuMWZyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6ODBweH1cclxuLmZlYXR1cmUtbGFiZWx7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtjb2xvcjojY2NlNWY1O2ZvbnQtd2VpZ2h0OjYwMDttYXJnaW4tYm90dG9tOjIwcHh9XHJcbi5jb25uZWN0ZWQtY29weT5we2NvbG9yOiNkMmUyZWU7bWFyZ2luLXRvcDoyMnB4fVxyXG4uY29ubmVjdGVkLWNvcHkgLnRleHQtbGlua3ttYXJnaW4tdG9wOjIycHh9XHJcbi5jb25uZWN0ZWQtY29weSAuYXZhaWxhYmlsaXR5LW5vdGV7Zm9udC1zaXplOjExcHg7bWF4LXdpZHRoOjQwMHB4O21hcmdpbi10b3A6MjRweH1cclxuLmNvbm5lY3RlZC12aXN1YWx7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1ib3R0b206MjJweH1cclxuLmNvbm5lY3RlZC12aXN1YWwgaW1ne3dpZHRoOjEwMCU7aGVpZ2h0OjM5MHB4O29iamVjdC1maXQ6Y292ZXI7Ym9yZGVyLXJhZGl1czoyMnB4IDcwcHggMjJweCAyMnB4O2Rpc3BsYXk6YmxvY2t9XHJcbi5kZXZpY2UtZXhhbXBsZXtkaXNwbGF5OmZsZXg7Z2FwOjE0cHg7YWxpZ24taXRlbXM6Y2VudGVyO3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTowO2xlZnQ6MjJweDtyaWdodDoyMnB4O3BhZGRpbmc6MTZweCAyMnB4O2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtjb2xvcjp2YXIoLS1pbmspO2JvcmRlci1yYWRpdXM6MTZweDtib3gtc2hhZG93OjAgOHB4IDE4cHggIzAwMDJ9XHJcbi5kZXZpY2UtZXhhbXBsZSBkaXZ7ZmxleDoxfVxyXG4uZGV2aWNlLWV4YW1wbGUgc3Ryb25nLC5kZXZpY2UtZXhhbXBsZSBzcGFue2Rpc3BsYXk6YmxvY2s7Zm9udC1zaXplOjEzcHh9XHJcbi5kZXZpY2UtZXhhbXBsZSBkaXYgc3Bhbntmb250LXNpemU6MTFweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5kZXZpY2UtZG90e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjlweDtoZWlnaHQ6OXB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2JvcmRlci1yYWRpdXM6NTAlO2ZsZXgtc2hyaW5rOjB9XHJcbi5ldmVyeWRheS1ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjhweH1cclxuLnNjZW5lLWFydHtoZWlnaHQ6MjUwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MThweDtwYWRkaW5nOjI0cHh9XHJcbi5maW5hbmNlLWFydHtiYWNrZ3JvdW5kOnZhcigtLW1pbnQpfVxyXG4uYm9va2luZy1hcnR7YmFja2dyb3VuZDojZWRmMmZhfVxyXG4uaG9tZS1hcnR7YmFja2dyb3VuZDojZTRlZWY0fVxyXG4uc2NlbmUtbGFiZWx7cG9zaXRpb246YWJzb2x1dGU7dG9wOjE0cHg7bGVmdDoxOHB4O2ZvbnQtc2l6ZToxMHB4O2NvbG9yOnZhcigtLW11dGVkKX1cclxuLm1pbmktc3RhdGVtZW50LC5taW5pLWNhbGVuZGFyLC5taW5pLWRldmljZXtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2Q4ZTJkODtib3JkZXItcmFkaXVzOjEycHg7d2lkdGg6MTAwJTttYXgtd2lkdGg6MjcwcHg7cGFkZGluZzoyMHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtib3gtc2hhZG93OjAgOHB4IDE4cHggIzE4M2UzMjBiO2ZvbnQtc2l6ZToxMXB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgc3Ryb25nLC5taW5pLWNhbGVuZGFyIHN0cm9uZywubWluaS1kZXZpY2Ugc3Ryb25ne2ZvbnQtc2l6ZToxNHB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgc3ZnLC5taW5pLWNhbGVuZGFyIHN2ZywubWluaS1kZXZpY2Ugc3Zne2NvbG9yOnZhcigtLWdyZWVuKTt3aWR0aDoyNXB4O2hlaWdodDoyNXB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgZGl2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1saW5lKTtwYWRkaW5nLXRvcDoxMnB4O21hcmdpbi10b3A6NnB4O2dhcDo4cHh9XHJcbi5jYWxlbmRhci1kYXlze2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtib3JkZXItYmxvY2s6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctYmxvY2s6MTBweDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5jYWxlbmRhci1kYXlzIGJ7cGFkZGluZzo0cHggOHB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2NvbG9yOndoaXRlO2JvcmRlci1yYWRpdXM6NTAlfVxyXG4uY2FsZW5kYXItc3RhdHVze2NvbG9yOnZhcigtLWdyZWVuKX1cclxuLm1pbmktZGV2aWNle2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nLWJsb2NrOjI2cHh9XHJcbi5taW5pLWRldmljZSBie2JhY2tncm91bmQ6dmFyKC0tbWludCk7cGFkZGluZzo3cHggMTRweDtib3JkZXItcmFkaXVzOjhweDttYXJnaW4tdG9wOjhweH1cclxuLmV2ZXJ5ZGF5LXNjZW5lIGgze21hcmdpbi1ibG9jazoyMnB4IDEycHg7Zm9udC1zaXplOjIxcHh9XHJcbi5ldmVyeWRheS1zY2VuZSBwe2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6MTRweH1cclxuLmF1ZGllbmNlLXNlY3Rpb257cGFkZGluZy10b3A6MTZweH1cclxuLmF1ZGllbmNlLWdyaWR7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDoyNHB4fVxyXG4uYXVkaWVuY2UtY2FyZHtib3JkZXI6MXB4IHNvbGlkICNjOWRjZTk7Ym9yZGVyLXJhZGl1czoyMnB4O2JhY2tncm91bmQ6dmFyKC0tbWludCk7cGFkZGluZzozOHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydH1cclxuLnBlcnNvbmFsLWNhcmR7YmFja2dyb3VuZDojZWVmNGY4O2JvcmRlci1jb2xvcjojZDRlMmVjfVxyXG4uYWNjb3VudC1sYWJlbHtkaXNwbGF5OmlubGluZS1ibG9jaztmb250LXNpemU6MTBweDtmb250LXdlaWdodDo2MDA7Ym9yZGVyOjFweCBzb2xpZCAjYmFjZmRmO3BhZGRpbmc6NXB4IDEwcHg7Ym9yZGVyLXJhZGl1czo3cHg7bWFyZ2luLWJvdHRvbToyMnB4fVxyXG4ucGVyc29uYWwtbGFiZWx7Ym9yZGVyLWNvbG9yOiNjNWQ5ZTd9XHJcbi5hdWRpZW5jZS1jYXJkIGgze2ZvbnQtc2l6ZTozMHB4O21hcmdpbi1ib3R0b206MThweH1cclxuLmF1ZGllbmNlLWNhcmQgcCwuYXVkaWVuY2UtY2FyZCBsaXtmb250LXNpemU6MTRweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5hdWRpZW5jZS1jYXJkIHVse3BhZGRpbmctbGVmdDoyMHB4O21hcmdpbi1ibG9jazoyMHB4IDI0cHh9XHJcbi5hdWRpZW5jZS1jYXJkIGxpe3BhZGRpbmctYmxvY2s6NXB4fVxyXG4uYXVkaWVuY2UtY2FyZCAudGV4dC1saW5re21hcmdpbi10b3A6YXV0bztib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ncmVlbil9XHJcbi5yZXNpZGVudC1ub3Rle2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjIycHg7bWFyZ2luLXRvcDoyOHB4O3BhZGRpbmc6MjZweCAwO2JvcmRlci1ibG9jazoxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5yZXNpZGVudC1ub3RlIGRpdntmbGV4OjF9XHJcbi5yZXNpZGVudC1ub3RlIGgze2ZvbnQtc2l6ZToxOHB4O21hcmdpbi1ib3R0b206NnB4fVxyXG4ucmVzaWRlbnQtbm90ZSBwe2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6MTNweDttYXgtd2lkdGg6NzYwcHh9XHJcbi5yZXNpZGVudC1ub3RlIGF7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6NjAwO21pbi1oZWlnaHQ6NDRweDtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO3RleHQtdW5kZXJsaW5lLW9mZnNldDo1cHh9XHJcbi5yZXNpZGVudC1ub3RlIGE6aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uZ2V0dGluZy1zdGFydGVke2JhY2tncm91bmQ6I2VkZjRmOX1cclxuLnN0ZXBzLWxheW91dHtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxLjFmcjtnYXA6OTBweH1cclxuLnN0ZXBzLWxheW91dCAuc2VjdGlvbi1pbnRyb3ttYXJnaW46MH1cclxuLnN0ZXBzLWxheW91dCAudGV4dC1saW5re21hcmdpbi10b3A6MjJweH1cclxuLnN0ZXBzLWxpc3R7bGlzdC1zdHlsZTpub25lO21hcmdpbjowO3BhZGRpbmc6MDtjb3VudGVyLXJlc2V0OnN0ZXBzfVxyXG4uc3RlcHMtbGlzdCBsaXtwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjAgMCAzMHB4IDY2cHg7Y291bnRlci1pbmNyZW1lbnQ6c3RlcHN9XHJcbi5zdGVwcy1saXN0IGxpOjpiZWZvcmV7Y29udGVudDpjb3VudGVyKHN0ZXBzKTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7YmFja2dyb3VuZDp2YXIoLS1ncmVlbik7Y29sb3I6d2hpdGU7Zm9udC1mYW1pbHk6J0xhbmRpbmcgTWFucm9wZScsc2Fucy1zZXJpZjtmb250LXdlaWdodDo2MDA7d2lkdGg6NDBweDtoZWlnaHQ6NDBweDtkaXNwbGF5OmdyaWQ7cGxhY2UtaXRlbXM6Y2VudGVyO2JvcmRlci1yYWRpdXM6NTAlfVxyXG4uc3RlcHMtbGlzdCBsaTpub3QoOmxhc3QtY2hpbGQpOjphZnRlcntjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MTlweDt0b3A6NDhweDtib3R0b206OHB4O3dpZHRoOjFweDtiYWNrZ3JvdW5kOiNhZmNhZGF9XHJcbi5zdGVwcy1saXN0IGxpOmxhc3QtY2hpbGR7cGFkZGluZy1ib3R0b206MH1cclxuLnN0ZXBzLWxpc3QgaDN7Zm9udC1zaXplOjIwcHg7bWFyZ2luLWJvdHRvbToxMHB4fVxyXG4uc3RlcHMtbGlzdCBwe2ZvbnQtc2l6ZToxNHB4O2NvbG9yOnZhcigtLW11dGVkKX1cclxuLmZhcS1zZWN0aW9ue2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6Ljg1ZnIgMS4xNWZyO2dhcDo5MHB4fVxyXG4uZmFxLWludHJvIHB7Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi10b3A6MjBweH1cclxuLmZhcS1saXN0IGRldGFpbHN7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5mYXEtbGlzdCBkZXRhaWxzOmZpcnN0LWNoaWxke2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpfVxyXG4uZmFxLWxpc3Qgc3VtbWFyeXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoyNHB4O3BhZGRpbmc6MjJweCAwO2N1cnNvcjpwb2ludGVyO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6MTRweDtsaXN0LXN0eWxlOm5vbmV9XHJcbi5mYXEtbGlzdCBzdW1tYXJ5Ojotd2Via2l0LWRldGFpbHMtbWFya2Vye2Rpc3BsYXk6bm9uZX1cclxuLmZhcS1saXN0IHN1bW1hcnk6aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uZmFxLXRvZ2dsZXt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtc2hyaW5rOjB9XHJcbi5mYXEtdG9nZ2xlOjpiZWZvcmUsLmZhcS10b2dnbGU6OmFmdGVye2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZDpjdXJyZW50Q29sb3I7d2lkdGg6MTRweDtoZWlnaHQ6MXB4O3RvcDo3cHg7bGVmdDoxcHh9XHJcbi5mYXEtdG9nZ2xlOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKDkwZGVnKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMThzfVxyXG5kZXRhaWxzW29wZW5dIC5mYXEtdG9nZ2xlOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKDApfVxyXG4uZmFxLWxpc3QgZGV0YWlscyBwe3BhZGRpbmc6MCAyOHB4IDIycHggMDtmb250LXNpemU6MTNweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5jbG9zaW5nLXNlY3Rpb257ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2JhY2tncm91bmQ6dmFyKC0tbWludCk7Ym9yZGVyLXJhZGl1czoyNnB4O292ZXJmbG93OmhpZGRlbn1cclxuLmNsb3NpbmctY29weXtwYWRkaW5nOjQ4cHh9XHJcbi5jbG9zaW5nLWNvcHkgc3Zne2NvbG9yOnZhcigtLWdyZWVuKTttYXJnaW4tYm90dG9tOjIycHg7d2lkdGg6NDBweDtoZWlnaHQ6NDBweH1cclxuLmNsb3NpbmctY29weSBwe2NvbG9yOnZhcigtLW11dGVkKTttYXgtd2lkdGg6MzUwcHg7bWFyZ2luLWJsb2NrOjE4cHggMjRweH1cclxuLmNsb3Npbmctc2VjdGlvbj5pbWd7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjM5MHB4O29iamVjdC1maXQ6Y292ZXJ9XHJcbi5zaXRlLWZvb3RlcntkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjIycHg7cGFkZGluZy1ibG9jazo0NHB4IDI4cHh9XHJcbi5zaXRlLWZvb3RlciBwe2ZvbnQtc2l6ZToxMnB4O2NvbG9yOnZhcigtLW11dGVkKTttYXJnaW4tdG9wOjhweH1cclxuLnNpdGUtZm9vdGVyIG5hdntkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kO2ZsZXgtd3JhcDp3cmFwO2FsaWduLWNvbnRlbnQ6Y2VudGVyO2dhcDoxMnB4IDIycHg7Zm9udC1zaXplOjEycHh9XHJcbi5zaXRlLWZvb3RlciBuYXYgYXttaW4taGVpZ2h0OjQ0cHg7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5mb290ZXItZGV0YWlse2dyaWQtY29sdW1uOjEvLTE7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tbXV0ZWQpO2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctdG9wOjIwcHh9XHJcbiJdLCJzb3VyY2VSb290IjoiIn0= */", "@media(max-width:1150px){\n  .container[_ngcontent-%COMP%]{width:calc(100% - 64px)}.header-inner[_ngcontent-%COMP%]{padding-inline:32px;gap:18px}#public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{gap:16px}.hero[_ngcontent-%COMP%]{gap:32px}.hero-visual[_ngcontent-%COMP%]{padding-bottom:230px}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:370px}.benefits-inner[_ngcontent-%COMP%]{gap:28px}.benefits-list[_ngcontent-%COMP%]{gap:16px}.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-start;gap:8px}.connected-layout[_ngcontent-%COMP%], .community-feature[_ngcontent-%COMP%]{gap:40px}\n}\n@media(max-width:960px){\n  .header-inner[_ngcontent-%COMP%]{padding-block:14px}.menu-toggle[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;min-height:44px;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:12px}.menu-toggle[_ngcontent-%COMP%]:hover{background:var(--mint)}.menu-lines[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.menu-lines[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:15px;height:1px;background:currentColor}\n  #public-navigation[_ngcontent-%COMP%]{display:none;position:absolute;top:100%;left:0;right:0;background:var(--canvas);padding:20px 32px 28px;border-bottom:1px solid var(--line);max-height:calc(100dvh - 74px);overflow-y:auto}#public-navigation.is-open[_ngcontent-%COMP%]{display:flex;align-items:stretch;flex-direction:column}.section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column;gap:6px}.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]{padding:12px 0;font-size:14px}.header-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{align-self:flex-start;margin-top:10px}\n  .hero[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:36px;padding-block:30px 48px}.hero-copy[_ngcontent-%COMP%]{max-width:640px;padding:0}h1[_ngcontent-%COMP%]{font-size:56px}.hero-visual[_ngcontent-%COMP%]{max-width:680px;width:100%;justify-self:center;padding-bottom:150px}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:420px}.product-preview[_ngcontent-%COMP%]{width:82%;left:18px}.benefits-inner[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column;gap:24px}.benefits-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   br[_ngcontent-%COMP%]{display:none}.section-padding[_ngcontent-%COMP%]{padding-block:64px}.service-heading[_ngcontent-%COMP%]{gap:28px}.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:400px}.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:26px}.connected-layout[_ngcontent-%COMP%]{gap:32px}.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:410px}.scene-art[_ngcontent-%COMP%]{padding:14px;height:235px}.everyday-grid[_ngcontent-%COMP%]{gap:18px}.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{padding:14px}.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:19px}.audience-card[_ngcontent-%COMP%]{padding:28px}.audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:26px}.resident-note[_ngcontent-%COMP%]{flex-wrap:wrap}.steps-layout[_ngcontent-%COMP%], .faq-section[_ngcontent-%COMP%]{gap:42px}.closing-copy[_ngcontent-%COMP%]{padding:36px}\n}\n\n@media(max-width:768px){[_nghost-%COMP%]{margin:-.5rem}}\n@media(max-width:700px){\n  .container[_ngcontent-%COMP%]{width:calc(100% - 40px)}.header-inner[_ngcontent-%COMP%]{padding-inline:max(20px,env(safe-area-inset-left))}.brand[_ngcontent-%COMP%]{font-size:19px}.brand-mark[_ngcontent-%COMP%]{width:30px;height:30px}#public-navigation[_ngcontent-%COMP%]{padding-inline:20px}h1[_ngcontent-%COMP%]{font-size:clamp(39px,8.4vw,54px);margin-block:20px}.hero-kicker[_ngcontent-%COMP%]{font-size:10px;gap:7px}.hero-kicker[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:20px;height:20px}.hero-description[_ngcontent-%COMP%]{font-size:14px;line-height:1.75;margin-bottom:24px}.hero-actions[_ngcontent-%COMP%]{gap:18px}.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{padding-inline:20px;gap:18px}.hero-actions[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{font-size:12px;gap:8px}.hero-caption[_ngcontent-%COMP%]{font-size:11px;margin-top:26px}.hero-visual[_ngcontent-%COMP%]{padding-bottom:0}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:320px;border-radius:60px 18px 18px 18px}.photo-caption[_ngcontent-%COMP%]{top:16px;right:14px;font-size:10px;padding:10px 12px}.product-preview[_ngcontent-%COMP%]{width:calc(100% - 16px);margin:-52px auto 0;position:relative;left:auto}.preview-top[_ngcontent-%COMP%]{padding-inline:14px}.preview-brand[_ngcontent-%COMP%]{font-size:11px;gap:5px}.illustration-label[_ngcontent-%COMP%]{font-size:9px}.preview-body[_ngcontent-%COMP%]{padding:16px 14px;min-height:265px}.preview-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:17px}.preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]{font-size:9px}\n  .benefits-list[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr;gap:26px 20px}.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{flex-direction:row;font-size:11px;gap:10px}.benefits-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:26px;height:26px}.section-padding[_ngcontent-%COMP%]{padding-block:52px}.section-intro[_ngcontent-%COMP%]{margin-bottom:30px}.section-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}.service-heading[_ngcontent-%COMP%]{display:block}.community-feature[_ngcontent-%COMP%], .connected-layout[_ngcontent-%COMP%], .steps-layout[_ngcontent-%COMP%], .faq-section[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:32px}.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:300px}.community-feature[_ngcontent-%COMP%]   figcaption[_ngcontent-%COMP%]{bottom:16px;left:16px;font-size:12px}.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:28px}.feature-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{font-size:14px}.shared-services[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:24px;margin-top:32px}.shared-services[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]{display:grid;grid-template-columns:36px 1fr;gap:6px 16px;padding-top:22px}.shared-services[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{grid-row:1/3}.shared-services[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0}.shared-services[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{grid-column:2}\n  .connected-section[_ngcontent-%COMP%]{padding-block:48px}.connected-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{font-size:14px}.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:320px}.device-example[_ngcontent-%COMP%]{left:12px;right:12px;padding:14px 16px}.everyday-grid[_ngcontent-%COMP%], .audience-grid[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:32px}.scene-art[_ngcontent-%COMP%]{height:250px;padding:24px}.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{padding:20px}.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:23px;margin-top:20px}.audience-section[_ngcontent-%COMP%]{padding-top:12px}.audience-card[_ngcontent-%COMP%]{padding:28px}.resident-note[_ngcontent-%COMP%]{gap:14px;align-items:flex-start}.resident-note[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-basis:calc(100% - 46px)}.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:46px}.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding-left:56px}.closing-section[_ngcontent-%COMP%]{grid-template-columns:1fr}.closing-copy[_ngcontent-%COMP%]{padding:32px}.closing-section[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{height:230px;min-height:0}.site-footer[_ngcontent-%COMP%]{grid-template-columns:1fr;padding-top:36px}.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{justify-content:flex-start;gap:4px 22px}.footer-detail[_ngcontent-%COMP%]{padding-bottom:env(safe-area-inset-bottom)}\n}\n@media(prefers-reduced-motion:reduce){.saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::before, .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}.button[_ngcontent-%COMP%]:hover, .button[_ngcontent-%COMP%]:active{transform:none}}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmctcmVzcG9uc2l2ZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFXLHVCQUF1QixDQUFDLGNBQWMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLGtEQUFrRCxRQUFRLENBQUMsTUFBTSxRQUFRLENBQUMsYUFBYSxvQkFBb0IsQ0FBQyxnQkFBZ0IsWUFBWSxDQUFDLGdCQUFnQixRQUFRLENBQUMsZUFBZSxRQUFRLENBQUMsa0JBQWtCLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsUUFBUTtBQUM5WDtBQUNBO0VBQ0UsY0FBYyxrQkFBa0IsQ0FBQyxhQUFhLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsc0JBQXNCLENBQUMsWUFBWSxZQUFZLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixVQUFVLENBQUMsVUFBVSxDQUFDLHVCQUF1QjtFQUM5WCxtQkFBbUIsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLG1DQUFtQyxDQUFDLDhCQUE4QixDQUFDLGVBQWUsQ0FBQywyQkFBMkIsWUFBWSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLCtCQUErQixtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsMENBQTBDLGNBQWMsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLHFCQUFxQixDQUFDLGVBQWU7RUFDcmYsTUFBTSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsV0FBVyxlQUFlLENBQUMsU0FBUyxDQUFDLEdB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QUMsY0FBYyxZQUFZLENBQUMscUJBQXFCLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSx5QkFBeUIsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsMEJBQTBCLENBQUMsWUFBWSxDQUFDLGVBQWUsMENBQTBDO0FBQ3AzQjtBQUNBLHNDQUFzQyxzREFBc0QseUJBQXlCLENBQUMsd0JBQXdCLENBQUMsOEJBQThCLENBQUMsNkJBQTZCLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIkBtZWRpYShtYXgtd2lkdGg6MTE1MHB4KXtcclxuICAuY29udGFpbmVye3dpZHRoOmNhbGMoMTAwJSAtIDY0cHgpfS5oZWFkZXItaW5uZXJ7cGFkZGluZy1pbmxpbmU6MzJweDtnYXA6MThweH0jcHVibGljLW5hdmlnYXRpb24sLnNlY3Rpb24tbGlua3MsLmhlYWRlci1hY3Rpb25ze2dhcDoxNnB4fS5oZXJve2dhcDozMnB4fS5oZXJvLXZpc3VhbHtwYWRkaW5nLWJvdHRvbToyMzBweH0uaGVyby1waG90byBpbWd7aGVpZ2h0OjM3MHB4fS5iZW5lZml0cy1pbm5lcntnYXA6MjhweH0uYmVuZWZpdHMtbGlzdHtnYXA6MTZweH0uYmVuZWZpdHMtbGlzdCBsaXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtnYXA6OHB4fS5jb25uZWN0ZWQtbGF5b3V0LC5jb21tdW5pdHktZmVhdHVyZXtnYXA6NDBweH1cclxufVxyXG5AbWVkaWEobWF4LXdpZHRoOjk2MHB4KXtcclxuICAuaGVhZGVyLWlubmVye3BhZGRpbmctYmxvY2s6MTRweH0ubWVudS10b2dnbGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDttaW4taGVpZ2h0OjQ0cHg7YmFja2dyb3VuZDp0cmFuc3BhcmVudDtjb2xvcjp2YXIoLS1pbmspO2JvcmRlcjoxcHggc29saWQgdmFyKC0tbGluZSk7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEycHh9Lm1lbnUtdG9nZ2xlOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tbWludCl9Lm1lbnUtbGluZXN7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NXB4fS5tZW51LWxpbmVzIHNwYW57d2lkdGg6MTVweDtoZWlnaHQ6MXB4O2JhY2tncm91bmQ6Y3VycmVudENvbG9yfVxyXG4gICNwdWJsaWMtbmF2aWdhdGlvbntkaXNwbGF5Om5vbmU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjEwMCU7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZDp2YXIoLS1jYW52YXMpO3BhZGRpbmc6MjBweCAzMnB4IDI4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSk7bWF4LWhlaWdodDpjYWxjKDEwMGR2aCAtIDc0cHgpO292ZXJmbG93LXk6YXV0b30jcHVibGljLW5hdmlnYXRpb24uaXMtb3BlbntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6c3RyZXRjaDtmbGV4LWRpcmVjdGlvbjpjb2x1bW59LnNlY3Rpb24tbGlua3MsLmhlYWRlci1hY3Rpb25ze2FsaWduLWl0ZW1zOnN0cmV0Y2g7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHh9LnNlY3Rpb24tbGlua3MgYSwuaGVhZGVyLWFjdGlvbnMgLnNpZ24taW57cGFkZGluZzoxMnB4IDA7Zm9udC1zaXplOjE0cHh9LmhlYWRlci1hY3Rpb25zIC5idXR0b257YWxpZ24tc2VsZjpmbGV4LXN0YXJ0O21hcmdpbi10b3A6MTBweH1cclxuICAuaGVyb3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDozNnB4O3BhZGRpbmctYmxvY2s6MzBweCA0OHB4fS5oZXJvLWNvcHl7bWF4LXdpZHRoOjY0MHB4O3BhZGRpbmc6MH1oMXtmb250LXNpemU6NTZweH0uaGVyby12aXN1YWx7bWF4LXdpZHRoOjY4MHB4O3dpZHRoOjEwMCU7anVzdGlmeS1zZWxmOmNlbnRlcjtwYWRkaW5nLWJvdHRvbToxNTBweH0uaGVyby1waG90byBpbWd7aGVpZ2h0OjQyMHB4fS5wcm9kdWN0LXByZXZpZXd7d2lkdGg6ODIlO2xlZnQ6MThweH0uYmVuZWZpdHMtaW5uZXJ7YWxpZ24taXRlbXM6ZmxleC1zdGFydDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjI0cHh9LmJlbmVmaXRzLWlubmVyIGgyIGJye2Rpc3BsYXk6bm9uZX0uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6NjRweH0uc2VydmljZS1oZWFkaW5ne2dhcDoyOHB4fS5jb21tdW5pdHktZmVhdHVyZSBpbWd7aGVpZ2h0OjQwMHB4fS5mZWF0dXJlLWNvcHkgaDN7Zm9udC1zaXplOjI2cHh9LmNvbm5lY3RlZC1sYXlvdXR7Z2FwOjMycHh9LmNvbm5lY3RlZC12aXN1YWwgaW1ne2hlaWdodDo0MTBweH0uc2NlbmUtYXJ0e3BhZGRpbmc6MTRweDtoZWlnaHQ6MjM1cHh9LmV2ZXJ5ZGF5LWdyaWR7Z2FwOjE4cHh9Lm1pbmktc3RhdGVtZW50LC5taW5pLWNhbGVuZGFyLC5taW5pLWRldmljZXtwYWRkaW5nOjE0cHh9LmV2ZXJ5ZGF5LXNjZW5lIGgze2ZvbnQtc2l6ZToxOXB4fS5hdWRpZW5jZS1jYXJke3BhZGRpbmc6MjhweH0uYXVkaWVuY2UtY2FyZCBoM3tmb250LXNpemU6MjZweH0ucmVzaWRlbnQtbm90ZXtmbGV4LXdyYXA6d3JhcH0uc3RlcHMtbGF5b3V0LC5mYXEtc2VjdGlvbntnYXA6NDJweH0uY2xvc2luZy1jb3B5e3BhZGRpbmc6MzZweH1cclxufVxyXG4vKiBDb21wZW5zYSBlbCBwYWRkaW5nIG3Dg8KzdmlsIGdsb2JhbCBzb2xvIGRlbnRybyBkZSBsYSBydXRhIHDDg8K6YmxpY2EuICovXHJcbkBtZWRpYShtYXgtd2lkdGg6NzY4cHgpezpob3N0e21hcmdpbjotLjVyZW19fVxyXG5AbWVkaWEobWF4LXdpZHRoOjcwMHB4KXtcclxuICAuY29udGFpbmVye3dpZHRoOmNhbGMoMTAwJSAtIDQwcHgpfS5oZWFkZXItaW5uZXJ7cGFkZGluZy1pbmxpbmU6bWF4KDIwcHgsZW52KHNhZmUtYXJlYS1pbnNldC1sZWZ0KSl9LmJyYW5ke2ZvbnQtc2l6ZToxOXB4fS5icmFuZC1tYXJre3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHh9I3B1YmxpYy1uYXZpZ2F0aW9ue3BhZGRpbmctaW5saW5lOjIwcHh9aDF7Zm9udC1zaXplOmNsYW1wKDM5cHgsOC40dncsNTRweCk7bWFyZ2luLWJsb2NrOjIwcHh9Lmhlcm8ta2lja2Vye2ZvbnQtc2l6ZToxMHB4O2dhcDo3cHh9Lmhlcm8ta2lja2VyIHN2Z3t3aWR0aDoyMHB4O2hlaWdodDoyMHB4fS5oZXJvLWRlc2NyaXB0aW9ue2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNzU7bWFyZ2luLWJvdHRvbToyNHB4fS5oZXJvLWFjdGlvbnN7Z2FwOjE4cHh9Lmhlcm8tYWN0aW9ucyAuYnV0dG9ue3BhZGRpbmctaW5saW5lOjIwcHg7Z2FwOjE4cHh9Lmhlcm8tYWN0aW9ucyAudGV4dC1saW5re2ZvbnQtc2l6ZToxMnB4O2dhcDo4cHh9Lmhlcm8tY2FwdGlvbntmb250LXNpemU6MTFweDttYXJnaW4tdG9wOjI2cHh9Lmhlcm8tdmlzdWFse3BhZGRpbmctYm90dG9tOjB9Lmhlcm8tcGhvdG8gaW1ne2hlaWdodDozMjBweDtib3JkZXItcmFkaXVzOjYwcHggMThweCAxOHB4IDE4cHh9LnBob3RvLWNhcHRpb257dG9wOjE2cHg7cmlnaHQ6MTRweDtmb250LXNpemU6MTBweDtwYWRkaW5nOjEwcHggMTJweH0ucHJvZHVjdC1wcmV2aWV3e3dpZHRoOmNhbGMoMTAwJSAtIDE2cHgpO21hcmdpbjotNTJweCBhdXRvIDA7cG9zaXRpb246cmVsYXRpdmU7bGVmdDphdXRvfS5wcmV2aWV3LXRvcHtwYWRkaW5nLWlubGluZToxNHB4fS5wcmV2aWV3LWJyYW5ke2ZvbnQtc2l6ZToxMXB4O2dhcDo1cHh9LmlsbHVzdHJhdGlvbi1sYWJlbHtmb250LXNpemU6OXB4fS5wcmV2aWV3LWJvZHl7cGFkZGluZzoxNnB4IDE0cHg7bWluLWhlaWdodDoyNjVweH0ucHJldmlldy1ib2R5IGgye2ZvbnQtc2l6ZToxN3B4fS5wcmV2aWV3LWJvZHkgdGFibGV7Zm9udC1zaXplOjlweH1cclxuICAuYmVuZWZpdHMtbGlzdHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6MjZweCAyMHB4fS5iZW5lZml0cy1saXN0IGxpe2ZsZXgtZGlyZWN0aW9uOnJvdztmb250LXNpemU6MTFweDtnYXA6MTBweH0uYmVuZWZpdHMtbGlzdCBzdmd7d2lkdGg6MjZweDtoZWlnaHQ6MjZweH0uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6NTJweH0uc2VjdGlvbi1pbnRyb3ttYXJnaW4tYm90dG9tOjMwcHh9LnNlY3Rpb24taW50cm8gcHtmb250LXNpemU6MTRweH0uc2VydmljZS1oZWFkaW5ne2Rpc3BsYXk6YmxvY2t9LmNvbW11bml0eS1mZWF0dXJlLC5jb25uZWN0ZWQtbGF5b3V0LC5zdGVwcy1sYXlvdXQsLmZhcS1zZWN0aW9ue2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjMycHh9LmNvbW11bml0eS1mZWF0dXJlIGltZ3toZWlnaHQ6MzAwcHh9LmNvbW11bml0eS1mZWF0dXJlIGZpZ2NhcHRpb257Ym90dG9tOjE2cHg7bGVmdDoxNnB4O2ZvbnQtc2l6ZToxMnB4fS5mZWF0dXJlLWNvcHkgaDN7Zm9udC1zaXplOjI4cHh9LmZlYXR1cmUtY29weT5we2ZvbnQtc2l6ZToxNHB4fS5zaGFyZWQtc2VydmljZXN7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcjtnYXA6MjRweDttYXJnaW4tdG9wOjMycHh9LnNoYXJlZC1zZXJ2aWNlcyBhcnRpY2xle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MzZweCAxZnI7Z2FwOjZweCAxNnB4O3BhZGRpbmctdG9wOjIycHh9LnNoYXJlZC1zZXJ2aWNlcyBzdmd7Z3JpZC1yb3c6MS8zfS5zaGFyZWQtc2VydmljZXMgaDN7bWFyZ2luOjB9LnNoYXJlZC1zZXJ2aWNlcyBwe2dyaWQtY29sdW1uOjJ9XHJcbiAgLmNvbm5lY3RlZC1zZWN0aW9ue3BhZGRpbmctYmxvY2s6NDhweH0uY29ubmVjdGVkLWNvcHk+cHtmb250LXNpemU6MTRweH0uY29ubmVjdGVkLXZpc3VhbCBpbWd7aGVpZ2h0OjMyMHB4fS5kZXZpY2UtZXhhbXBsZXtsZWZ0OjEycHg7cmlnaHQ6MTJweDtwYWRkaW5nOjE0cHggMTZweH0uZXZlcnlkYXktZ3JpZCwuYXVkaWVuY2UtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDozMnB4fS5zY2VuZS1hcnR7aGVpZ2h0OjI1MHB4O3BhZGRpbmc6MjRweH0ubWluaS1zdGF0ZW1lbnQsLm1pbmktY2FsZW5kYXIsLm1pbmktZGV2aWNle3BhZGRpbmc6MjBweH0uZXZlcnlkYXktc2NlbmUgaDN7Zm9udC1zaXplOjIzcHg7bWFyZ2luLXRvcDoyMHB4fS5hdWRpZW5jZS1zZWN0aW9ue3BhZGRpbmctdG9wOjEycHh9LmF1ZGllbmNlLWNhcmR7cGFkZGluZzoyOHB4fS5yZXNpZGVudC1ub3Rle2dhcDoxNHB4O2FsaWduLWl0ZW1zOmZsZXgtc3RhcnR9LnJlc2lkZW50LW5vdGUgZGl2e2ZsZXgtYmFzaXM6Y2FsYygxMDAlIC0gNDZweCl9LnJlc2lkZW50LW5vdGUgYXttYXJnaW4tbGVmdDo0NnB4fS5zdGVwcy1saXN0IGxpe3BhZGRpbmctbGVmdDo1NnB4fS5jbG9zaW5nLXNlY3Rpb257Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn0uY2xvc2luZy1jb3B5e3BhZGRpbmc6MzJweH0uY2xvc2luZy1zZWN0aW9uPmltZ3toZWlnaHQ6MjMwcHg7bWluLWhlaWdodDowfS5zaXRlLWZvb3RlcntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO3BhZGRpbmctdG9wOjM2cHh9LnNpdGUtZm9vdGVyIG5hdntqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDtnYXA6NHB4IDIycHh9LmZvb3Rlci1kZXRhaWx7cGFkZGluZy1ib3R0b206ZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pfVxyXG59XHJcbkBtZWRpYShwcmVmZXJzLXJlZHVjZWQtbW90aW9uOnJlZHVjZSl7LnNhYXMtcGFnZSAqLC5zYWFzLXBhZ2UgKjo6YmVmb3JlLC5zYWFzLXBhZ2UgKjo6YWZ0ZXJ7dHJhbnNpdGlvbjpub25lIWltcG9ydGFudDthbmltYXRpb246bm9uZSFpbXBvcnRhbnQ7c2Nyb2xsLWJlaGF2aW9yOmF1dG8haW1wb3J0YW50fS5idXR0b246aG92ZXIsLmJ1dHRvbjphY3RpdmV7dHJhbnNmb3JtOm5vbmV9fVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */", "\n.site-header[_ngcontent-%COMP%]{background:#eef5fbed;border-bottom:0}\n.brand[_ngcontent-%COMP%]{color:#163b60;letter-spacing:-.045em}\n.brand-mark[_ngcontent-%COMP%]{border-radius:50%;background:#084568}\n.brand-accent[_ngcontent-%COMP%]{color:inherit}\n.hero[_ngcontent-%COMP%]{position:relative;display:block;padding:0;isolation:isolate;background:#edf4fa;overflow:hidden}\n.hero-photo[_ngcontent-%COMP%]{position:absolute;inset:0;z-index:-2}\n.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover;object-position:center 48%;border-radius:0;filter:saturate(.8)}\n.hero[_ngcontent-%COMP%]::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#edf4fa 0%,#edf4faf5 30%,#edf4fa8c 54%,#edf4fa00 80%),linear-gradient(180deg,#edf4fa9c,transparent 55%)}\n.hero-inner[_ngcontent-%COMP%]{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:60px;min-height:780px;padding-block:60px 78px}\n.hero-copy[_ngcontent-%COMP%]{max-width:630px;padding:0;align-self:center}\n.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:clamp(46px,4.4vw,66px);line-height:1.08;letter-spacing:-.055em;margin:0 0 26px;text-wrap:initial}\n.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]{display:block}\n.hero-title-accent[_ngcontent-%COMP%]{color:#326d93}\n.hero-description[_ngcontent-%COMP%]{max-width:430px;line-height:1.55;font-size:17px;margin-bottom:28px;color:#4b5965}\n.hero-actions[_ngcontent-%COMP%]{display:flex;gap:20px;align-items:flex-start;flex-direction:column}\n.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{min-height:60px;min-width:220px;justify-content:space-between;border-radius:10px;padding-inline:28px;font-size:16px}\n.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:23px;font-weight:400}\n.hero-actions[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{font-size:15px;gap:18px}\n.hero-visual[_ngcontent-%COMP%]{padding:26px 0 0;justify-self:center;position:relative;width:320px;max-width:100%}\n.phone-mockup[_ngcontent-%COMP%]{position:relative;background:#142029;border:3px solid #647178;border-radius:48px;padding:8px;width:300px;height:582px;transform:rotate(8deg);box-shadow:12px 24px 36px #102b3d4d,2px 2px 0 #c4cbd0 inset}\n.phone-mockup[_ngcontent-%COMP%]::before{content:'';position:absolute;width:3px;height:48px;left:-5px;top:112px;border-radius:3px;background:#77848b}\n.phone-mockup[_ngcontent-%COMP%]::after{content:'';position:absolute;width:3px;height:64px;right:-5px;top:145px;border-radius:3px;background:#77848b}\n.phone-screen[_ngcontent-%COMP%]{position:relative;width:100%;height:100%;border-radius:37px;background:#fafcfd;overflow:hidden;padding:0 18px;color:#173242;font-family:'Landing Inter',sans-serif}\n.phone-status[_ngcontent-%COMP%]{height:38px;display:flex;justify-content:space-between;align-items:center;font-size:9px;font-weight:600;padding-inline:8px;color:#17252f}\n.phone-notch[_ngcontent-%COMP%]{position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:132px;height:23px;border-radius:0 0 18px 18px;background:#142029}\n.phone-greeting[_ngcontent-%COMP%]{display:flex;align-items:center;gap:9px;margin:12px 0 28px;font-size:11px;line-height:1.4}\n.phone-greeting[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;font-size:14px}\n.resident-avatar[_ngcontent-%COMP%]{width:31px;height:31px;display:grid;place-items:center;border-radius:50%;background:#d9e5ec;color:#325471;font-size:10px;font-weight:600;border:3px solid white}\n.phone-menu[_ngcontent-%COMP%]{margin-left:auto;color:#3a6f90;font-size:17px}\n.phone-balance[_ngcontent-%COMP%]{background:linear-gradient(110deg,#e6f2fc,#f1f7fc);border:1px solid #dceaf4;border-radius:13px;padding:20px 14px;position:relative;min-height:96px}\n.phone-balance[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]{display:block;font-size:10px;margin-bottom:6px}\n.phone-balance[_ngcontent-%COMP%] > strong[_ngcontent-%COMP%]{font-size:20px;font-variant-numeric:tabular-nums;letter-spacing:-.04em}\n.balance-chart[_ngcontent-%COMP%]{position:absolute;right:17px;bottom:24px;display:flex;align-items:flex-end;gap:4px;height:28px}\n.balance-chart[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{display:block;width:6px;background:#248bd0;transform:skew(-10deg);height:12px}\n.balance-chart[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(2){height:21px}.balance-chart[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(3){height:28px}\n.phone-tiles[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}\n.phone-tile[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-start;background:#f1f5f8;border:1px solid #e7edf2;border-radius:12px;padding:15px 12px;min-height:106px}\n.phone-tile[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:27px;height:27px;color:#2189c8;background:#e2f0fb;border-radius:7px;padding:4px;margin-bottom:9px}\n.phone-tile[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:11px;font-weight:600;margin-bottom:4px}\n.phone-tile[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]{font-size:8px;color:#5d7180}\n.phone-tile[_ngcontent-%COMP%]   .tile-blue[_ngcontent-%COMP%]{color:#267bac}.phone-tile[_ngcontent-%COMP%]   .tile-green[_ngcontent-%COMP%]{color:#397464}\n.phone-bottom-nav[_ngcontent-%COMP%]{position:absolute;bottom:26px;left:12px;right:12px;display:flex;justify-content:space-around;border-top:1px solid #e8eef3;padding-top:14px;color:#647782}\n.phone-bottom-nav[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;font-size:8px;gap:5px}\n.phone-bottom-nav[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:19px;height:19px}.phone-bottom-nav[_ngcontent-%COMP%]   .current[_ngcontent-%COMP%]{color:#1685c9}\n.phone-home-bar[_ngcontent-%COMP%]{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:84px;height:4px;background:#17252f;border-radius:3px}\n.phone-example[_ngcontent-%COMP%]{display:block;position:relative;margin-top:32px;text-align:center;font-size:10px;color:#102b3d;background:#edf4fad9;padding:5px 10px;border-radius:5px;width:max-content;margin-inline:auto}\n.demo-section[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1.15fr;align-items:center;gap:70px;padding-block:70px}\n.demo-section[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]{margin:0}\n.demo-section[_ngcontent-%COMP%]   .product-preview[_ngcontent-%COMP%]{position:relative;bottom:auto;left:auto;margin:0;width:100%;max-width:640px;border-radius:18px;box-shadow:0 10px 30px #163b6010}\n@media(max-width:1150px){.hero-inner[_ngcontent-%COMP%]{gap:30px;min-height:730px}.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:50px}.hero-visual[_ngcontent-%COMP%]{width:290px}.phone-mockup[_ngcontent-%COMP%]{width:280px;height:552px}.phone-tiles[_ngcontent-%COMP%]{gap:10px}.phone-tile[_ngcontent-%COMP%]{min-height:98px}.demo-section[_ngcontent-%COMP%]{gap:35px}}\n@media(max-width:960px) and (min-width:701px){.hero-inner[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr;gap:20px;min-height:690px}.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:clamp(38px,5.1vw,48px)}.hero-description[_ngcontent-%COMP%]{font-size:15px}.hero[_ngcontent-%COMP%]::before{background:linear-gradient(90deg,#edf4fa,#edf4fae6 38%,#edf4fa20 90%)}.hero-visual[_ngcontent-%COMP%]{width:260px}.phone-mockup[_ngcontent-%COMP%]{width:250px;height:512px}.phone-screen[_ngcontent-%COMP%]{padding-inline:14px}.phone-tile[_ngcontent-%COMP%]{min-height:90px;padding:12px 10px}.phone-greeting[_ngcontent-%COMP%]{margin-bottom:20px}.phone-balance[_ngcontent-%COMP%] > strong[_ngcontent-%COMP%]{font-size:18px}}\n@media(max-width:700px){\n  .header-inner[_ngcontent-%COMP%]{padding-block:14px;padding-inline:max(20px,env(safe-area-inset-left));gap:12px}\n  .brand[_ngcontent-%COMP%]{font-size:20px}.brand-mark[_ngcontent-%COMP%]{width:36px;height:36px;margin-right:9px}\n  .menu-toggle[_ngcontent-%COMP%]{min-height:44px;padding:8px 14px;border-color:#c6d8e6;border-radius:10px;font-size:14px;gap:12px}\n  .menu-lines[_ngcontent-%COMP%]{gap:4px}.menu-lines[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:14px}\n  .hero-inner[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:stretch;min-height:1060px;gap:0;padding-block:46px 42px;width:calc(100% - 40px)}\n  .hero-copy[_ngcontent-%COMP%]{max-width:440px;align-self:stretch;position:relative;z-index:1}\n  .hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:clamp(36px,8.2vw + 12px,54px);margin:0 0 22px;line-height:1.08;letter-spacing:-.055em}\n  .hero-description[_ngcontent-%COMP%]{font-size:clamp(15px,3.8vw,18px);max-width:345px;line-height:1.45;margin-bottom:26px}\n  .hero-actions[_ngcontent-%COMP%]{gap:10px}.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{min-height:64px;min-width:222px;padding-inline:30px;font-size:17px}.hero-actions[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{font-size:16px;gap:16px;min-height:44px}\n  .hero-photo[_ngcontent-%COMP%]{top:0}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{object-position:75% bottom;filter:saturate(.9)}\n  .hero[_ngcontent-%COMP%]::before{background:linear-gradient(180deg,#edf4fa 0%,#edf4fa 28%,#edf4fadb 39%,#edf4fa25 60%,transparent 74%)}\n  .hero-visual[_ngcontent-%COMP%]{align-self:center;width:280px;margin:90px 0 0;padding:0;max-width:calc(100% - 36px)}\n  .phone-mockup[_ngcontent-%COMP%]{width:100%;height:552px;transform:rotate(8deg);border-radius:44px;box-shadow:10px 16px 26px #102b3d66}\n  .phone-screen[_ngcontent-%COMP%]{border-radius:33px}.phone-greeting[_ngcontent-%COMP%]{margin-top:10px;margin-bottom:24px}.phone-tiles[_ngcontent-%COMP%]{gap:10px}.phone-tile[_ngcontent-%COMP%]{min-height:99px}\n  .phone-example[_ngcontent-%COMP%]{margin-top:28px;font-size:9px}\n  .demo-section[_ngcontent-%COMP%]{grid-template-columns:1fr;padding-block:48px;gap:28px}\n  .demo-section[_ngcontent-%COMP%]   .product-preview[_ngcontent-%COMP%]{width:100%;margin:0}\n}\n@media(max-width:360px){.brand[_ngcontent-%COMP%]{font-size:17px}.brand-mark[_ngcontent-%COMP%]{width:30px;height:30px;margin-right:6px}.menu-toggle[_ngcontent-%COMP%]{padding-inline:10px;font-size:12px}.hero-inner[_ngcontent-%COMP%]{padding-top:36px;min-height:995px}.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:39px}.hero-description[_ngcontent-%COMP%]{font-size:15px}.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{min-height:58px;min-width:206px;font-size:16px}.hero-visual[_ngcontent-%COMP%]{margin-top:66px;width:252px}.phone-mockup[_ngcontent-%COMP%]{height:512px}.phone-screen[_ngcontent-%COMP%]{padding-inline:14px}.phone-tile[_ngcontent-%COMP%]{padding:12px 10px;min-height:90px}.phone-balance[_ngcontent-%COMP%] > strong[_ngcontent-%COMP%]{font-size:18px}}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmctaGVyby5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEVBQTRFO0FBQzVFLGFBQWEsb0JBQW9CLENBQUMsZUFBZTtBQUNqRCxPQUFPLGFBQWEsQ0FBQyxzQkFBc0I7QUFDM0MsWUFBWSxpQkFBaUIsQ0FBQyxrQkFBa0I7QUFDaEQsY0FBYyxhQUFhO0FBQzNCLE1BQU0saUJBQWlCLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlO0FBQ3BHLFlBQVksaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVU7QUFDaEQsZ0JBQWdCLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsZUFBZSxDQUFDLG1CQUFtQjtBQUN0SCxjQUFjLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLHdJQUF3STtBQUN0TSxZQUFZLFlBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCO0FBQzlILFdBQVcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUI7QUFDdEQsU0FBUyxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsaUJBQWlCO0FBQ25ILGNBQWMsYUFBYTtBQUMzQixtQkFBbUIsYUFBYTtBQUNoQyxrQkFBa0IsZUFBZSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhO0FBQ2xHLGNBQWMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxxQkFBcUI7QUFDaEYsc0JBQXNCLGVBQWUsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsY0FBYztBQUN6SSwyQkFBMkIsY0FBYyxDQUFDLGVBQWU7QUFDekQseUJBQXlCLGNBQWMsQ0FBQyxRQUFRO0FBQ2hELGFBQWEsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGNBQWM7QUFDOUYsY0FBYyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQywyREFBMkQ7QUFDdE4sc0JBQXNCLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCO0FBQ2pJLHFCQUFxQixVQUFVLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQjtBQUNqSSxjQUFjLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsc0NBQXNDO0FBQ2hMLGNBQWMsV0FBVyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLGFBQWE7QUFDdEosYUFBYSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCO0FBQ2xKLGdCQUFnQixZQUFZLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxlQUFlO0FBQ3pHLHVCQUF1QixhQUFhLENBQUMsY0FBYztBQUNuRCxpQkFBaUIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsc0JBQXNCO0FBQ2hMLFlBQVksZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGNBQWM7QUFDekQsZUFBZSxrREFBa0QsQ0FBQyx3QkFBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlO0FBQ2pLLG9CQUFvQixhQUFhLENBQUMsY0FBYyxDQUFDLGlCQUFpQjtBQUNsRSxzQkFBc0IsY0FBYyxDQUFDLGlDQUFpQyxDQUFDLHFCQUFxQjtBQUM1RixlQUFlLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQzdHLGlCQUFpQixhQUFhLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLFdBQVc7QUFDOUYsOEJBQThCLFdBQVcsQ0FBQyw4QkFBOEIsV0FBVztBQUNuRixhQUFhLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsZUFBZTtBQUNoRixZQUFZLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0I7QUFDdkssZ0JBQWdCLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxpQkFBaUI7QUFDdkgsbUJBQW1CLGNBQWMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCO0FBQ25FLGlCQUFpQixhQUFhLENBQUMsYUFBYTtBQUM1Qyx1QkFBdUIsYUFBYSxDQUFDLHdCQUF3QixhQUFhO0FBQzFFLGtCQUFrQixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsNEJBQTRCLENBQUMsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsYUFBYTtBQUMxSyx1QkFBdUIsWUFBWSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxPQUFPO0FBQ2xHLHNCQUFzQixVQUFVLENBQUMsV0FBVyxDQUFDLDJCQUEyQixhQUFhO0FBQ3JGLGdCQUFnQixpQkFBaUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCO0FBQzNJLGVBQWUsYUFBYSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLGtCQUFrQjtBQUMxTSxjQUFjLFlBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsa0JBQWtCO0FBQzFHLDZCQUE2QixRQUFRO0FBQ3JDLCtCQUErQixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLGdDQUFnQztBQUM5Six5QkFBeUIsWUFBWSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxjQUFjLENBQUMsYUFBYSxXQUFXLENBQUMsY0FBYyxXQUFXLENBQUMsWUFBWSxDQUFDLGFBQWEsUUFBUSxDQUFDLFlBQVksZUFBZSxDQUFDLGNBQWMsUUFBUSxDQUFDO0FBQ2hPLDhDQUE4QyxZQUFZLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLGdDQUFnQyxDQUFDLGtCQUFrQixjQUFjLENBQUMsY0FBYyxxRUFBcUUsQ0FBQyxhQUFhLFdBQVcsQ0FBQyxjQUFjLFdBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYyxtQkFBbUIsQ0FBQyxZQUFZLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0Isa0JBQWtCLENBQUMsc0JBQXNCLGNBQWMsQ0FBQztBQUN6ZTtFQUNFLGNBQWMsa0JBQWtCLENBQUMsa0RBQWtELENBQUMsUUFBUTtFQUM1RixPQUFPLGNBQWMsQ0FBQyxZQUFZLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCO0VBQ3pFLGFBQWEsZUFBZSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxRQUFRO0VBQzdHLFlBQVksT0FBTyxDQUFDLGlCQUFpQixVQUFVO0VBQy9DLFlBQVksWUFBWSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyx1QkFBdUI7RUFDMUksV0FBVyxlQUFlLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsU0FBUztFQUN6RSxTQUFTLHVDQUF1QyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0I7RUFDeEcsa0JBQWtCLGdDQUFnQyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0I7RUFDdEcsY0FBYyxRQUFRLENBQUMsc0JBQXNCLGVBQWUsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLHlCQUF5QixjQUFjLENBQUMsUUFBUSxDQUFDLGVBQWU7RUFDaEwsWUFBWSxLQUFLLENBQUMsZ0JBQWdCLDBCQUEwQixDQUFDLG1CQUFtQjtFQUNoRixjQUFjLHFHQUFxRztFQUNuSCxhQUFhLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLDJCQUEyQjtFQUNoRyxjQUFjLFVBQVUsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsbUNBQW1DO0VBQ25ILGNBQWMsa0JBQWtCLENBQUMsZ0JBQWdCLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLFFBQVEsQ0FBQyxZQUFZLGVBQWU7RUFDckksZUFBZSxlQUFlLENBQUMsYUFBYTtFQUM1QyxjQUFjLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLFFBQVE7RUFDbkUsK0JBQStCLFVBQVUsQ0FBQyxRQUFRO0FBQ3BEO0FBQ0Esd0JBQXdCLE9BQU8sY0FBYyxDQUFDLFlBQVksVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxZQUFZLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsY0FBYyxDQUFDLGtCQUFrQixjQUFjLENBQUMsc0JBQXNCLGVBQWUsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLGFBQWEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxjQUFjLFlBQVksQ0FBQyxjQUFjLG1CQUFtQixDQUFDLFlBQVksaUJBQWlCLENBQUMsZUFBZSxDQUFDLHNCQUFzQixjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGUgcmVzaWRlbnRpYWwgc2NlbmUgYW5kIHRoZSBwaG9uZSBmb3JtIG9uZSBjb21wb3NpdGlvbiBhdCBldmVyeSBzaXplLiAqL1xuLnNpdGUtaGVhZGVye2JhY2tncm91bmQ6I2VlZjVmYmVkO2JvcmRlci1ib3R0b206MH1cbi5icmFuZHtjb2xvcjojMTYzYjYwO2xldHRlci1zcGFjaW5nOi0uMDQ1ZW19XG4uYnJhbmQtbWFya3tib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOiMwODQ1Njh9XG4uYnJhbmQtYWNjZW50e2NvbG9yOmluaGVyaXR9XG4uaGVyb3twb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmJsb2NrO3BhZGRpbmc6MDtpc29sYXRpb246aXNvbGF0ZTtiYWNrZ3JvdW5kOiNlZGY0ZmE7b3ZlcmZsb3c6aGlkZGVufVxuLmhlcm8tcGhvdG97cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDt6LWluZGV4Oi0yfVxuLmhlcm8tcGhvdG8gaW1ne3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7b2JqZWN0LWZpdDpjb3ZlcjtvYmplY3QtcG9zaXRpb246Y2VudGVyIDQ4JTtib3JkZXItcmFkaXVzOjA7ZmlsdGVyOnNhdHVyYXRlKC44KX1cbi5oZXJvOjpiZWZvcmV7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3otaW5kZXg6LTE7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsI2VkZjRmYSAwJSwjZWRmNGZhZjUgMzAlLCNlZGY0ZmE4YyA1NCUsI2VkZjRmYTAwIDgwJSksbGluZWFyLWdyYWRpZW50KDE4MGRlZywjZWRmNGZhOWMsdHJhbnNwYXJlbnQgNTUlKX1cbi5oZXJvLWlubmVye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MS4xZnIgLjlmcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjYwcHg7bWluLWhlaWdodDo3ODBweDtwYWRkaW5nLWJsb2NrOjYwcHggNzhweH1cbi5oZXJvLWNvcHl7bWF4LXdpZHRoOjYzMHB4O3BhZGRpbmc6MDthbGlnbi1zZWxmOmNlbnRlcn1cbi5oZXJvIGgxe2ZvbnQtc2l6ZTpjbGFtcCg0NnB4LDQuNHZ3LDY2cHgpO2xpbmUtaGVpZ2h0OjEuMDg7bGV0dGVyLXNwYWNpbmc6LS4wNTVlbTttYXJnaW46MCAwIDI2cHg7dGV4dC13cmFwOmluaXRpYWx9XG4uaGVybyBoMT5zcGFue2Rpc3BsYXk6YmxvY2t9XG4uaGVyby10aXRsZS1hY2NlbnR7Y29sb3I6IzMyNmQ5M31cbi5oZXJvLWRlc2NyaXB0aW9ue21heC13aWR0aDo0MzBweDtsaW5lLWhlaWdodDoxLjU1O2ZvbnQtc2l6ZToxN3B4O21hcmdpbi1ib3R0b206MjhweDtjb2xvcjojNGI1OTY1fVxuLmhlcm8tYWN0aW9uc3tkaXNwbGF5OmZsZXg7Z2FwOjIwcHg7YWxpZ24taXRlbXM6ZmxleC1zdGFydDtmbGV4LWRpcmVjdGlvbjpjb2x1bW59XG4uaGVyby1hY3Rpb25zIC5idXR0b257bWluLWhlaWdodDo2MHB4O21pbi13aWR0aDoyMjBweDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtib3JkZXItcmFkaXVzOjEwcHg7cGFkZGluZy1pbmxpbmU6MjhweDtmb250LXNpemU6MTZweH1cbi5oZXJvLWFjdGlvbnMgLmJ1dHRvbiBzcGFue2ZvbnQtc2l6ZToyM3B4O2ZvbnQtd2VpZ2h0OjQwMH1cbi5oZXJvLWFjdGlvbnMgLnRleHQtbGlua3tmb250LXNpemU6MTVweDtnYXA6MThweH1cbi5oZXJvLXZpc3VhbHtwYWRkaW5nOjI2cHggMCAwO2p1c3RpZnktc2VsZjpjZW50ZXI7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6MzIwcHg7bWF4LXdpZHRoOjEwMCV9XG4ucGhvbmUtbW9ja3Vwe3Bvc2l0aW9uOnJlbGF0aXZlO2JhY2tncm91bmQ6IzE0MjAyOTtib3JkZXI6M3B4IHNvbGlkICM2NDcxNzg7Ym9yZGVyLXJhZGl1czo0OHB4O3BhZGRpbmc6OHB4O3dpZHRoOjMwMHB4O2hlaWdodDo1ODJweDt0cmFuc2Zvcm06cm90YXRlKDhkZWcpO2JveC1zaGFkb3c6MTJweCAyNHB4IDM2cHggIzEwMmIzZDRkLDJweCAycHggMCAjYzRjYmQwIGluc2V0fVxuLnBob25lLW1vY2t1cDo6YmVmb3Jle2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6M3B4O2hlaWdodDo0OHB4O2xlZnQ6LTVweDt0b3A6MTEycHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZDojNzc4NDhifVxuLnBob25lLW1vY2t1cDo6YWZ0ZXJ7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDozcHg7aGVpZ2h0OjY0cHg7cmlnaHQ6LTVweDt0b3A6MTQ1cHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZDojNzc4NDhifVxuLnBob25lLXNjcmVlbntwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JvcmRlci1yYWRpdXM6MzdweDtiYWNrZ3JvdW5kOiNmYWZjZmQ7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MCAxOHB4O2NvbG9yOiMxNzMyNDI7Zm9udC1mYW1pbHk6J0xhbmRpbmcgSW50ZXInLHNhbnMtc2VyaWZ9XG4ucGhvbmUtc3RhdHVze2hlaWdodDozOHB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDo2MDA7cGFkZGluZy1pbmxpbmU6OHB4O2NvbG9yOiMxNzI1MmZ9XG4ucGhvbmUtbm90Y2h7cG9zaXRpb246YWJzb2x1dGU7dG9wOi0xcHg7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSk7d2lkdGg6MTMycHg7aGVpZ2h0OjIzcHg7Ym9yZGVyLXJhZGl1czowIDAgMThweCAxOHB4O2JhY2tncm91bmQ6IzE0MjAyOX1cbi5waG9uZS1ncmVldGluZ3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo5cHg7bWFyZ2luOjEycHggMCAyOHB4O2ZvbnQtc2l6ZToxMXB4O2xpbmUtaGVpZ2h0OjEuNH1cbi5waG9uZS1ncmVldGluZyBzdHJvbmd7ZGlzcGxheTpibG9jaztmb250LXNpemU6MTRweH1cbi5yZXNpZGVudC1hdmF0YXJ7d2lkdGg6MzFweDtoZWlnaHQ6MzFweDtkaXNwbGF5OmdyaWQ7cGxhY2UtaXRlbXM6Y2VudGVyO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6I2Q5ZTVlYztjb2xvcjojMzI1NDcxO2ZvbnQtc2l6ZToxMHB4O2ZvbnQtd2VpZ2h0OjYwMDtib3JkZXI6M3B4IHNvbGlkIHdoaXRlfVxuLnBob25lLW1lbnV7bWFyZ2luLWxlZnQ6YXV0bztjb2xvcjojM2E2ZjkwO2ZvbnQtc2l6ZToxN3B4fVxuLnBob25lLWJhbGFuY2V7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTEwZGVnLCNlNmYyZmMsI2YxZjdmYyk7Ym9yZGVyOjFweCBzb2xpZCAjZGNlYWY0O2JvcmRlci1yYWRpdXM6MTNweDtwYWRkaW5nOjIwcHggMTRweDtwb3NpdGlvbjpyZWxhdGl2ZTttaW4taGVpZ2h0Ojk2cHh9XG4ucGhvbmUtYmFsYW5jZT5zcGFue2Rpc3BsYXk6YmxvY2s7Zm9udC1zaXplOjEwcHg7bWFyZ2luLWJvdHRvbTo2cHh9XG4ucGhvbmUtYmFsYW5jZT5zdHJvbmd7Zm9udC1zaXplOjIwcHg7Zm9udC12YXJpYW50LW51bWVyaWM6dGFidWxhci1udW1zO2xldHRlci1zcGFjaW5nOi0uMDRlbX1cbi5iYWxhbmNlLWNoYXJ0e3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjE3cHg7Ym90dG9tOjI0cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDo0cHg7aGVpZ2h0OjI4cHh9XG4uYmFsYW5jZS1jaGFydCBpe2Rpc3BsYXk6YmxvY2s7d2lkdGg6NnB4O2JhY2tncm91bmQ6IzI0OGJkMDt0cmFuc2Zvcm06c2tldygtMTBkZWcpO2hlaWdodDoxMnB4fVxuLmJhbGFuY2UtY2hhcnQgaTpudGgtY2hpbGQoMil7aGVpZ2h0OjIxcHh9LmJhbGFuY2UtY2hhcnQgaTpudGgtY2hpbGQoMyl7aGVpZ2h0OjI4cHh9XG4ucGhvbmUtdGlsZXN7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDoxMnB4O21hcmdpbi10b3A6MjBweH1cbi5waG9uZS10aWxle2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtiYWNrZ3JvdW5kOiNmMWY1Zjg7Ym9yZGVyOjFweCBzb2xpZCAjZTdlZGYyO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjE1cHggMTJweDttaW4taGVpZ2h0OjEwNnB4fVxuLnBob25lLXRpbGUgc3Zne3dpZHRoOjI3cHg7aGVpZ2h0OjI3cHg7Y29sb3I6IzIxODljODtiYWNrZ3JvdW5kOiNlMmYwZmI7Ym9yZGVyLXJhZGl1czo3cHg7cGFkZGluZzo0cHg7bWFyZ2luLWJvdHRvbTo5cHh9XG4ucGhvbmUtdGlsZSBzdHJvbmd7Zm9udC1zaXplOjExcHg7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbi1ib3R0b206NHB4fVxuLnBob25lLXRpbGU+c3Bhbntmb250LXNpemU6OHB4O2NvbG9yOiM1ZDcxODB9XG4ucGhvbmUtdGlsZSAudGlsZS1ibHVle2NvbG9yOiMyNjdiYWN9LnBob25lLXRpbGUgLnRpbGUtZ3JlZW57Y29sb3I6IzM5NzQ2NH1cbi5waG9uZS1ib3R0b20tbmF2e3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbToyNnB4O2xlZnQ6MTJweDtyaWdodDoxMnB4O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYXJvdW5kO2JvcmRlci10b3A6MXB4IHNvbGlkICNlOGVlZjM7cGFkZGluZy10b3A6MTRweDtjb2xvcjojNjQ3NzgyfVxuLnBob25lLWJvdHRvbS1uYXY+c3BhbntkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtmb250LXNpemU6OHB4O2dhcDo1cHh9XG4ucGhvbmUtYm90dG9tLW5hdiBzdmd7d2lkdGg6MTlweDtoZWlnaHQ6MTlweH0ucGhvbmUtYm90dG9tLW5hdiAuY3VycmVudHtjb2xvcjojMTY4NWM5fVxuLnBob25lLWhvbWUtYmFye3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTo4cHg7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSk7d2lkdGg6ODRweDtoZWlnaHQ6NHB4O2JhY2tncm91bmQ6IzE3MjUyZjtib3JkZXItcmFkaXVzOjNweH1cbi5waG9uZS1leGFtcGxle2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDozMnB4O3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiMxMDJiM2Q7YmFja2dyb3VuZDojZWRmNGZhZDk7cGFkZGluZzo1cHggMTBweDtib3JkZXItcmFkaXVzOjVweDt3aWR0aDptYXgtY29udGVudDttYXJnaW4taW5saW5lOmF1dG99XG4uZGVtby1zZWN0aW9ue2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDEuMTVmcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjcwcHg7cGFkZGluZy1ibG9jazo3MHB4fVxuLmRlbW8tc2VjdGlvbiAuc2VjdGlvbi1pbnRyb3ttYXJnaW46MH1cbi5kZW1vLXNlY3Rpb24gLnByb2R1Y3QtcHJldmlld3twb3NpdGlvbjpyZWxhdGl2ZTtib3R0b206YXV0bztsZWZ0OmF1dG87bWFyZ2luOjA7d2lkdGg6MTAwJTttYXgtd2lkdGg6NjQwcHg7Ym9yZGVyLXJhZGl1czoxOHB4O2JveC1zaGFkb3c6MCAxMHB4IDMwcHggIzE2M2I2MDEwfVxuQG1lZGlhKG1heC13aWR0aDoxMTUwcHgpey5oZXJvLWlubmVye2dhcDozMHB4O21pbi1oZWlnaHQ6NzMwcHh9Lmhlcm8gaDF7Zm9udC1zaXplOjUwcHh9Lmhlcm8tdmlzdWFse3dpZHRoOjI5MHB4fS5waG9uZS1tb2NrdXB7d2lkdGg6MjgwcHg7aGVpZ2h0OjU1MnB4fS5waG9uZS10aWxlc3tnYXA6MTBweH0ucGhvbmUtdGlsZXttaW4taGVpZ2h0Ojk4cHh9LmRlbW8tc2VjdGlvbntnYXA6MzVweH19XG5AbWVkaWEobWF4LXdpZHRoOjk2MHB4KSBhbmQgKG1pbi13aWR0aDo3MDFweCl7Lmhlcm8taW5uZXJ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjIwcHg7bWluLWhlaWdodDo2OTBweH0uaGVybyBoMXtmb250LXNpemU6Y2xhbXAoMzhweCw1LjF2dyw0OHB4KX0uaGVyby1kZXNjcmlwdGlvbntmb250LXNpemU6MTVweH0uaGVybzo6YmVmb3Jle2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLCNlZGY0ZmEsI2VkZjRmYWU2IDM4JSwjZWRmNGZhMjAgOTAlKX0uaGVyby12aXN1YWx7d2lkdGg6MjYwcHh9LnBob25lLW1vY2t1cHt3aWR0aDoyNTBweDtoZWlnaHQ6NTEycHh9LnBob25lLXNjcmVlbntwYWRkaW5nLWlubGluZToxNHB4fS5waG9uZS10aWxle21pbi1oZWlnaHQ6OTBweDtwYWRkaW5nOjEycHggMTBweH0ucGhvbmUtZ3JlZXRpbmd7bWFyZ2luLWJvdHRvbToyMHB4fS5waG9uZS1iYWxhbmNlPnN0cm9uZ3tmb250LXNpemU6MThweH19XG5AbWVkaWEobWF4LXdpZHRoOjcwMHB4KXtcbiAgLmhlYWRlci1pbm5lcntwYWRkaW5nLWJsb2NrOjE0cHg7cGFkZGluZy1pbmxpbmU6bWF4KDIwcHgsZW52KHNhZmUtYXJlYS1pbnNldC1sZWZ0KSk7Z2FwOjEycHh9XG4gIC5icmFuZHtmb250LXNpemU6MjBweH0uYnJhbmQtbWFya3t3aWR0aDozNnB4O2hlaWdodDozNnB4O21hcmdpbi1yaWdodDo5cHh9XG4gIC5tZW51LXRvZ2dsZXttaW4taGVpZ2h0OjQ0cHg7cGFkZGluZzo4cHggMTRweDtib3JkZXItY29sb3I6I2M2ZDhlNjtib3JkZXItcmFkaXVzOjEwcHg7Zm9udC1zaXplOjE0cHg7Z2FwOjEycHh9XG4gIC5tZW51LWxpbmVze2dhcDo0cHh9Lm1lbnUtbGluZXMgc3Bhbnt3aWR0aDoxNHB4fVxuICAuaGVyby1pbm5lcntkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOnN0cmV0Y2g7bWluLWhlaWdodDoxMDYwcHg7Z2FwOjA7cGFkZGluZy1ibG9jazo0NnB4IDQycHg7d2lkdGg6Y2FsYygxMDAlIC0gNDBweCl9XG4gIC5oZXJvLWNvcHl7bWF4LXdpZHRoOjQ0MHB4O2FsaWduLXNlbGY6c3RyZXRjaDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjF9XG4gIC5oZXJvIGgxe2ZvbnQtc2l6ZTpjbGFtcCgzNnB4LDguMnZ3ICsgMTJweCw1NHB4KTttYXJnaW46MCAwIDIycHg7bGluZS1oZWlnaHQ6MS4wODtsZXR0ZXItc3BhY2luZzotLjA1NWVtfVxuICAuaGVyby1kZXNjcmlwdGlvbntmb250LXNpemU6Y2xhbXAoMTVweCwzLjh2dywxOHB4KTttYXgtd2lkdGg6MzQ1cHg7bGluZS1oZWlnaHQ6MS40NTttYXJnaW4tYm90dG9tOjI2cHh9XG4gIC5oZXJvLWFjdGlvbnN7Z2FwOjEwcHh9Lmhlcm8tYWN0aW9ucyAuYnV0dG9ue21pbi1oZWlnaHQ6NjRweDttaW4td2lkdGg6MjIycHg7cGFkZGluZy1pbmxpbmU6MzBweDtmb250LXNpemU6MTdweH0uaGVyby1hY3Rpb25zIC50ZXh0LWxpbmt7Zm9udC1zaXplOjE2cHg7Z2FwOjE2cHg7bWluLWhlaWdodDo0NHB4fVxuICAuaGVyby1waG90b3t0b3A6MH0uaGVyby1waG90byBpbWd7b2JqZWN0LXBvc2l0aW9uOjc1JSBib3R0b207ZmlsdGVyOnNhdHVyYXRlKC45KX1cbiAgLmhlcm86OmJlZm9yZXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcsI2VkZjRmYSAwJSwjZWRmNGZhIDI4JSwjZWRmNGZhZGIgMzklLCNlZGY0ZmEyNSA2MCUsdHJhbnNwYXJlbnQgNzQlKX1cbiAgLmhlcm8tdmlzdWFse2FsaWduLXNlbGY6Y2VudGVyO3dpZHRoOjI4MHB4O21hcmdpbjo5MHB4IDAgMDtwYWRkaW5nOjA7bWF4LXdpZHRoOmNhbGMoMTAwJSAtIDM2cHgpfVxuICAucGhvbmUtbW9ja3Vwe3dpZHRoOjEwMCU7aGVpZ2h0OjU1MnB4O3RyYW5zZm9ybTpyb3RhdGUoOGRlZyk7Ym9yZGVyLXJhZGl1czo0NHB4O2JveC1zaGFkb3c6MTBweCAxNnB4IDI2cHggIzEwMmIzZDY2fVxuICAucGhvbmUtc2NyZWVue2JvcmRlci1yYWRpdXM6MzNweH0ucGhvbmUtZ3JlZXRpbmd7bWFyZ2luLXRvcDoxMHB4O21hcmdpbi1ib3R0b206MjRweH0ucGhvbmUtdGlsZXN7Z2FwOjEwcHh9LnBob25lLXRpbGV7bWluLWhlaWdodDo5OXB4fVxuICAucGhvbmUtZXhhbXBsZXttYXJnaW4tdG9wOjI4cHg7Zm9udC1zaXplOjlweH1cbiAgLmRlbW8tc2VjdGlvbntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO3BhZGRpbmctYmxvY2s6NDhweDtnYXA6MjhweH1cbiAgLmRlbW8tc2VjdGlvbiAucHJvZHVjdC1wcmV2aWV3e3dpZHRoOjEwMCU7bWFyZ2luOjB9XG59XG5AbWVkaWEobWF4LXdpZHRoOjM2MHB4KXsuYnJhbmR7Zm9udC1zaXplOjE3cHh9LmJyYW5kLW1hcmt7d2lkdGg6MzBweDtoZWlnaHQ6MzBweDttYXJnaW4tcmlnaHQ6NnB4fS5tZW51LXRvZ2dsZXtwYWRkaW5nLWlubGluZToxMHB4O2ZvbnQtc2l6ZToxMnB4fS5oZXJvLWlubmVye3BhZGRpbmctdG9wOjM2cHg7bWluLWhlaWdodDo5OTVweH0uaGVybyBoMXtmb250LXNpemU6MzlweH0uaGVyby1kZXNjcmlwdGlvbntmb250LXNpemU6MTVweH0uaGVyby1hY3Rpb25zIC5idXR0b257bWluLWhlaWdodDo1OHB4O21pbi13aWR0aDoyMDZweDtmb250LXNpemU6MTZweH0uaGVyby12aXN1YWx7bWFyZ2luLXRvcDo2NnB4O3dpZHRoOjI1MnB4fS5waG9uZS1tb2NrdXB7aGVpZ2h0OjUxMnB4fS5waG9uZS1zY3JlZW57cGFkZGluZy1pbmxpbmU6MTRweH0ucGhvbmUtdGlsZXtwYWRkaW5nOjEycHggMTBweDttaW4taGVpZ2h0OjkwcHh9LnBob25lLWJhbGFuY2U+c3Ryb25ne2ZvbnQtc2l6ZToxOHB4fX1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
      changeDetection: 0
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_saas-landing_saas-landing_component_ts.js.map