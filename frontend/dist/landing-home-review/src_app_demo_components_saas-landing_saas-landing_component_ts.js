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
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 21752);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 20667);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 21478);
/* harmony import */ var _service_access_context_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/access-context.service */ 11371);
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../service/user.service */ 37612);
/* harmony import */ var _account_destination__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./account-destination */ 90982);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 58440);









const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.question;
const _forTrack2 = ($index, $item) => $item.name;
function SaasLandingComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "a", 133);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_43_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Ir a mi cuenta");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", ctx);
  }
}
function SaasLandingComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "a", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Conditional_44_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "Iniciar sesi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function SaasLandingComponent_For_95_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_For_95_Template_button_click_0_listener() {
      const item_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.selectPreview(item_r5.key));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("id", "tab-" + item_r5.key)("tabIndex", ctx_r1.selectedPreview() === item_r5.key ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-controls", "panel-" + item_r5.key)("aria-selected", ctx_r1.selectedPreview() === item_r5.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r5.label);
  }
}
function SaasLandingComponent_For_97_For_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "th", 136);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](column_r6);
  }
}
function SaasLandingComponent_For_97_For_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr")(1, "th", 139);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "td")(6, "span", 140);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const row_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](row_r7.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](row_r7.detail);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](row_r7.status);
  }
}
function SaasLandingComponent_For_97_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 59)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "table")(6, "caption", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "thead")(9, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](10, SaasLandingComponent_For_97_For_11_Template, 2, 1, "th", 136, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterTrackByIdentity"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](13, SaasLandingComponent_For_97_For_14_Template, 8, 3, "tr", null, _forTrack2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "div", 137);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](16, "span", 138);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("id", "panel-" + item_r8.key)("hidden", ctx_r1.selectedPreview() !== item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-labelledby", "tab-" + item_r8.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("id", ctx_r1.selectedPreview() === item_r8.key ? "preview-heading" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", item_r8.label, ": datos de ejemplo");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](item_r8.columns);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](item_r8.rows);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.note);
  }
}
function SaasLandingComponent_For_400_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "details")(1, "summary");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "span", 141);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r9.question);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r9.answer);
  }
}
class SaasLandingComponent {
  constructor() {
    this.user = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_user_service__WEBPACK_IMPORTED_MODULE_7__.UserService);
    this.access = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_service_access_context_service__WEBPACK_IMPORTED_MODULE_6__.AccessContextService);
    this.title = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Title);
    this.meta = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.Meta);
    this.document = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router);
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute);
    this.previousTitle = this.title.getTitle();
    this.previousDescription = this.meta.getTag('name="description"')?.content;
    this.session = this.readSession();
    this.menuOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, ...(ngDevMode ? [{
      debugName: "menuOpen"
    }] : /* istanbul ignore next */[]));
    this.selectedPreview = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('finance', ...(ngDevMode ? [{
      debugName: "selectedPreview"
    }] : /* istanbul ignore next */[]));
    this.accountLink = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.computed)(() => (0,_account_destination__WEBPACK_IMPORTED_MODULE_8__.accountDestination)(this.session.identity, this.session.token, this.access.access()), ...(ngDevMode ? [{
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
    this.route.queryParamMap.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_5__.takeUntilDestroyed)()).subscribe(params => {
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
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        vista: key === 'finance' ? null : key
      },
      queryParamsHandling: 'merge',
      preserveFragment: true,
      replaceUrl: true
    });
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
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: SaasLandingComponent,
      selectors: [["app-saas-landing"]],
      decls: 435,
      vars: 7,
      consts: [["lang", "es", 1, "saas-page"], ["rel", "preload", "href", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtrustConstantResourceUrl"]`assets/landing/manrope-700.ttf`, "as", "font", "type", "font/ttf", "crossorigin", ""], ["rel", "preload", "href", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtrustConstantResourceUrl"]`assets/layout/styles/theme/tailwind-light/fonts/Inter-Regular.woff2`, "as", "font", "type", "font/woff2", "crossorigin", ""], ["routerLink", "/", "fragment", "main-content", 1, "skip-link", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "aria-hidden", "true", 1, "symbol-library"], ["id", "saas-building", "viewBox", "0 0 32 32"], ["d", "M5 28V7l12-3v24M17 12h10v16M2 28h28M9 10h3m-3 5h3m-3 5h3m9-4h2m-2 5h2M9 28v-4h4v4"], ["id", "saas-finance", "viewBox", "0 0 32 32"], ["d", "M5 5h22v23H5zM10 11h12M10 16h4m4 0h4M10 21h4m4 0h4"], ["id", "saas-bookings", "viewBox", "0 0 32 32"], ["d", "M5 7h22v21H5zM10 3v8m12-8v8M5 13h22m-17 5h4m4 0h4m-12 5h4"], ["id", "saas-documents", "viewBox", "0 0 32 32"], ["d", "M7 3h12l6 6v20H7zM19 3v7h6M12 16h8m-8 5h8"], ["id", "saas-rentals", "viewBox", "0 0 32 32"], ["d", "m3 15 13-11 13 11M7 12v16h18V12M13 28v-9h6v9"], ["id", "saas-home", "viewBox", "0 0 32 32"], ["d", "m3 16 13-12 13 12M7 13v15h18V13M12 14a6 6 0 0 1 8 0m-6 4a3 3 0 0 1 4 0"], ["cx", "16", "cy", "22", "r", "1"], [1, "site-header", 3, "keydown.escape"], [1, "header-inner"], ["routerLink", "/", "aria-label", "CondominiosApp, inicio", 1, "brand", 3, "click"], ["aria-hidden", "true", 1, "brand-mark"], ["href", "#saas-building"], ["translate", "no"], [1, "brand-accent"], ["type", "button", "aria-controls", "public-navigation", 1, "menu-toggle", 3, "click"], ["aria-hidden", "true", 1, "menu-lines"], ["id", "public-navigation", "aria-label", "Navegaci\u00F3n principal"], [1, "section-links"], ["routerLink", "/", "fragment", "servicios", 3, "click"], ["routerLink", "/", "fragment", "como-comenzar", 3, "click"], ["routerLink", "/", "fragment", "preguntas", 3, "click"], [1, "header-actions"], [1, "sign-in", 3, "routerLink"], ["routerLink", "/auth/login", 1, "sign-in"], ["routerLink", "/auth/register", 1, "button", "button-small", 3, "click"], ["aria-hidden", "true"], ["id", "main-content", "tabindex", "-1"], ["aria-labelledby", "hero-title", 1, "hero", "container"], [1, "hero-copy"], [1, "hero-kicker"], ["href", "#saas-home"], ["id", "hero-title"], [1, "hero-description"], [1, "hero-actions"], ["routerLink", "/auth/register", 1, "button"], ["routerLink", "/", "fragment", "servicios", 1, "text-link"], [1, "hero-caption"], [1, "hero-visual"], [1, "hero-photo"], ["srcset", "assets/landing/residencial-720.webp 720w, assets/landing/residencial-1280.webp 1280w", "sizes", "(max-width: 960px) 92vw, 48vw", "type", "image/webp"], ["src", "assets/landing/residencial-1280.webp", "width", "1536", "height", "1024", "fetchpriority", "high", "alt", "Edificios contempor\u00E1neos con balcones, jardines tropicales y un camino entre \u00E1reas comunes"], [1, "photo-caption"], ["aria-labelledby", "preview-heading", 1, "product-preview"], [1, "preview-top"], [1, "preview-brand"], [1, "illustration-label"], ["role", "tablist", "aria-label", "Explorar funciones del producto", 1, "preview-tabs", 3, "keydown"], ["type", "button", "role", "tab", 3, "id", "tabIndex"], ["role", "tabpanel", "tabindex", "0", 1, "preview-body", 3, "id", "hidden"], ["aria-labelledby", "benefits-title", 1, "benefits-section"], [1, "container", "benefits-inner"], ["id", "benefits-title"], [1, "benefits-list"], ["href", "#saas-finance"], ["href", "#saas-bookings"], ["href", "#saas-documents"], ["id", "servicios", "aria-labelledby", "services-title", 1, "services-section", "section-padding"], [1, "container"], [1, "section-intro", "service-heading"], ["id", "services-title"], [1, "community-feature"], ["src", "assets/landing/comunidad-960.webp", "srcset", "assets/landing/comunidad-640.webp 640w, assets/landing/comunidad-960.webp 960w", "sizes", "(max-width: 700px) 92vw, 48vw", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Tres vecinos conversan y coordinan una actividad en una terraza rodeada de vegetaci\u00F3n"], [1, "feature-copy"], [1, "feature-list"], [1, "shared-services"], ["aria-hidden", "true", 1, "service-icon"], ["href", "#saas-rentals"], ["aria-labelledby", "connected-title", 1, "connected-section"], [1, "container", "connected-layout"], [1, "connected-copy"], [1, "feature-label"], ["id", "connected-title"], ["routerLink", "/", "fragment", "para-quien", 1, "text-link"], [1, "availability-note"], [1, "connected-visual"], ["src", "assets/landing/hogar-960.webp", "srcset", "assets/landing/hogar-640.webp 640w, assets/landing/hogar-960.webp 960w", "sizes", "(max-width: 700px) 92vw, 48vw", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Sala acogedora con plantas, l\u00E1mpara encendida y un sensor junto a la entrada"], [1, "device-example"], ["aria-hidden", "true", 1, "device-dot"], ["aria-labelledby", "everyday-title", 1, "everyday-section", "container", "section-padding"], [1, "section-intro"], ["id", "everyday-title"], [1, "everyday-grid"], [1, "everyday-scene"], ["aria-label", "Ejemplo de consulta de una cuota", 1, "scene-art", "finance-art"], [1, "scene-label"], [1, "mini-statement"], ["aria-label", "Ejemplo de reserva de un \u00E1rea com\u00FAn", 1, "scene-art", "booking-art"], [1, "mini-calendar"], ["aria-hidden", "true", 1, "calendar-days"], [1, "calendar-status"], ["aria-label", "Ejemplo de consulta de un dispositivo", 1, "scene-art", "home-art"], [1, "mini-device"], ["id", "para-quien", "aria-labelledby", "audience-title", 1, "audience-section", "container", "section-padding"], ["id", "audience-title"], [1, "audience-grid"], [1, "audience-card"], [1, "account-label"], ["routerLink", "/auth/register", 1, "text-link"], [1, "sr-only"], [1, "audience-card", "personal-card"], [1, "account-label", "personal-label"], [1, "resident-note"], ["routerLink", "/auth/login"], ["id", "como-comenzar", "aria-labelledby", "steps-title", 1, "getting-started", "section-padding"], [1, "container", "steps-layout"], ["id", "steps-title"], [1, "steps-list"], ["id", "preguntas", "aria-labelledby", "faq-title", 1, "faq-section", "container", "section-padding"], [1, "faq-intro"], ["id", "faq-title"], [1, "faq-list"], ["aria-labelledby", "closing-title", 1, "closing-section", "container"], [1, "closing-copy"], ["id", "closing-title"], ["src", "assets/landing/residencial-720.webp", "width", "1536", "height", "1024", "loading", "lazy", "alt", "Jardines y balcones de un residencial en la luz c\u00E1lida de la tarde"], [1, "site-footer", "container"], ["routerLink", "/", 1, "brand"], ["aria-label", "Navegaci\u00F3n del pie de p\u00E1gina"], ["routerLink", "/", "fragment", "servicios"], ["routerLink", "/", "fragment", "preguntas"], ["routerLink", "/auth/register"], [1, "footer-detail"], [1, "sign-in", 3, "click", "routerLink"], ["routerLink", "/auth/login", 1, "sign-in", 3, "click"], ["type", "button", "role", "tab", 3, "click", "id", "tabIndex"], ["scope", "col"], [1, "preview-note"], ["aria-hidden", "true", 1, "small-square"], ["scope", "row"], [1, "row-status"], ["aria-hidden", "true", 1, "faq-toggle"]],
      template: function SaasLandingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "link", 1)(2, "link", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_3_listener() {
            return ctx.focusContent();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Saltar al contenido");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "svg", 4)(6, "defs")(7, "symbol", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](8, "path", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "symbol", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](10, "path", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "symbol", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](12, "path", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "symbol", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](14, "path", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "symbol", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](16, "path", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "symbol", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](18, "path", 16)(19, "circle", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "header", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("keydown.escape", function SaasLandingComponent_Template_header_keydown_escape_20_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "div", 19)(22, "a", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_22_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "svg", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](24, "use", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](25, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](26, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "span", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](28, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "button", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_button_click_29_listener() {
            return ctx.menuOpen.set(!ctx.menuOpen());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "span", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](32, "span")(33, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](34, "nav", 27)(35, "div", 28)(36, "a", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_36_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](37, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "a", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_38_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](39, "C\u00F3mo funciona");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "a", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_40_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](41, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](42, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](43, SaasLandingComponent_Conditional_43_Template, 2, 1, "a", 33)(44, SaasLandingComponent_Conditional_44_Template, 2, 0, "a", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](45, "a", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SaasLandingComponent_Template_a_click_45_listener() {
            return ctx.closeMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](47, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](48, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](49, "main", 37)(50, "section", 38)(51, "div", 39)(52, "p", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](53, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](54, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](55, " Una comunidad que se siente como hogar");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](56, "h1", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](57, "M\u00E1s orden para tu comunidad. M\u00E1s tranquilidad para tu hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](58, "p", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](59, "Gestiona cuotas, reservas y comunicaci\u00F3n de tu condominio, o re\u00FAne los dispositivos compatibles de tu vivienda, desde un mismo lugar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](60, "div", 44)(61, "a", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](62, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](63, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](64, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](65, "a", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](66, "Explorar servicios ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](67, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](68, "\u2193");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](69, "p", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](70, "Para quienes cuidan una comunidad.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](71, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](72, "Para quienes cuidan su propio hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](73, "div", 48)(74, "picture", 49);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](75, "source", 50)(76, "img", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](77, "div", 52);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](78, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](79, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](80, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](81, "La vida en comunidad,");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](82, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](83, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](84, "con todo en su lugar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](85, "section", 53)(86, "div", 54)(87, "span", 55);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](88, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](89, "use", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](90, "Residencial Jardines");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](91, "span", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](92, "Datos de ejemplo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](93, "div", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("keydown", function SaasLandingComponent_Template_div_keydown_93_listener($event) {
            return ctx.moveTab($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](94, SaasLandingComponent_For_95_Template, 2, 5, "button", 58, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](96, SaasLandingComponent_For_97_Template, 18, 8, "div", 59, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](98, "section", 60)(99, "div", 61)(100, "h2", 62);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](101, "Lo cotidiano,");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](102, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](103, "m\u00E1s sencillo.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](104, "ul", 63)(105, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](106, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](107, "use", 64);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](108, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](109, "Consulta cuotas y pagos");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](110, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](111, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](112, "de cada unidad");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](113, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](114, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](115, "use", 65);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](116, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](117, "Coordina reservas");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](118, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](119, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](120, "de \u00E1reas comunes");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](121, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](122, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](123, "use", 66);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](124, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](125, "Encuentra documentos");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](126, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](127, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](128, "y avisos");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](129, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](130, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](131, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](132, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](133, "Consulta dispositivos");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](134, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](135, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](136, "compatibles");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](137, "section", 67)(138, "div", 68)(139, "div", 69)(140, "h2", 70);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](141, "Todo lo que hace");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](142, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](143, "funcionar tu comunidad.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](144, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](145, "Del cuidado de las cuentas a los espacios que compartimos. Herramientas para mantener cada cosa en su lugar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](146, "div", 71)(147, "figure");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](148, "img", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](149, "figcaption");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](150, "M\u00E1s espacio para compartir.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](151, "div", 73)(152, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](153, "Las cuentas claras.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](154, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](155, "La comunidad conectada.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](156, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](157, "Administra tus condominios, unidades y propietarios en tu organizaci\u00F3n. Consulta estados de cuenta y re\u00FAne documentos, avisos y solicitudes sin perder el hilo.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](158, "ul", 74)(159, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](160, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](161, "use", 64);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](162, "div")(163, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](164, "Finanzas que puedes consultar");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](165, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](166, "Cuotas, cargos, pagos, conciliaci\u00F3n y reportes.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](167, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](168, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](169, "use", 66);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](170, "div")(171, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](172, "Informaci\u00F3n para convivir mejor");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](173, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](174, "Documentos, avisos y seguimiento a consultas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](175, "div", 75)(176, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](177, "svg", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](178, "use", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](179, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](180, "Personas y propiedades");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](181, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](182, "Organiza condominios, unidades, propietarios y personal dentro de tu organizaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](183, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](184, "svg", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](185, "use", 65);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](186, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](187, "Espacios para compartir");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](188, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](189, "Coordina reservas de \u00E1reas comunes y consulta las visitas asociadas a cada unidad.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](190, "article");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](191, "svg", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](192, "use", 77);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](193, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](194, "Estancias bien coordinadas");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](195, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](196, "Consulta alquileres temporales y sincroniza calendarios con las integraciones iCal disponibles.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](197, "section", 78)(198, "div", 79)(199, "div", 80)(200, "span", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](201, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](202, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](203, " Smart Home");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](204, "h2", 82);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](205, "Tu hogar tambi\u00E9n");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](206, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](207, "tiene su espacio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](208, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](209, "Re\u00FAne tus dispositivos compatibles, consulta su estado y revisa su actividad desde tu vivienda personal o el contexto de tu condominio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](210, "a", 83);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](211, "Conocer los tipos de cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](212, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](213, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](214, "p", 84);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](215, "Requiere dispositivos compatibles y una suscripci\u00F3n IoT habilitada. Las funciones disponibles dependen de tu cuenta y configuraci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](216, "div", 85);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](217, "img", 86);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](218, "div", 87);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](219, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](220, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](221, "div")(222, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](223, "Luz de entrada");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](224, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](225, "Encendida \u00B7 Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](226, "span", 88);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](227, "section", 89)(228, "div", 90)(229, "h2", 91);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](230, "As\u00ED se vive con CondominiosApp.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](231, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](232, "Peque\u00F1as situaciones del d\u00EDa a d\u00EDa. Un lugar para resolverlas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](233, "div", 92)(234, "article", 93)(235, "div", 94)(236, "span", 95);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](237, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](238, "div", 96);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](239, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](240, "use", 64);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](241, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](242, "Unidad A-101");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](243, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](244, "Cuota de mantenimiento");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](245, "div")(246, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](247, "Estado de cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](248, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](249, "Disponible");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](250, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](251, "Revisa tu cuota, sin buscar de m\u00E1s.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](252, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](253, "Consulta los cargos y pagos de tu unidad y encuentra tu estado de cuenta cuando lo necesitas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](254, "article", 93)(255, "div", 97)(256, "span", 95);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](257, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](258, "div", 98);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](259, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](260, "use", 65);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](261, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](262, "Un s\u00E1bado para compartir");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](263, "div", 99)(264, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](265, "L");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](266, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](267, "M");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](268, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](269, "M");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](270, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](271, "J");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](272, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](273, "V");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](274, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](275, "S");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](276, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](277, "D");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](278, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](279, "Sal\u00F3n social \u00B7 Unidad A-101");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](280, "b", 100);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](281, "Reservado");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](282, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](283, "Haz espacio para tus planes.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](284, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](285, "Coordina una reserva de un \u00E1rea com\u00FAn y consulta el calendario para organizar tu encuentro.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](286, "article", 93)(287, "div", 101)(288, "span", 95);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](289, "Ejemplo ilustrativo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](290, "div", 102);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](291, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](292, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](293, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](294, "Sensor de puerta");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](295, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](296, "Entrada de tu vivienda");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](297, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](298, "span", 88);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](299, " Cerrada");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](300, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](301, "Consulta c\u00F3mo est\u00E1 tu hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](302, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](303, "Revisa el estado de un dispositivo compatible y su actividad, seg\u00FAn las funciones habilitadas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](304, "section", 103)(305, "div", 90)(306, "h2", 104);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](307, "Cada hogar tiene su forma de organizarse.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](308, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](309, "Elige la cuenta que corresponde a lo que quieres gestionar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](310, "div", 105)(311, "article", 106)(312, "span", 107);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](313, "ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](314, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](315, "Administro condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](316, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](317, "Crea tu organizaci\u00F3n y gestiona uno o varios condominios, sus unidades y propietarios. Puede ser una empresa administradora o la administraci\u00F3n de tu propio condominio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](318, "ul")(319, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](320, "Condominios y unidades en una organizaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](321, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](322, "Propietarios con acceso a su informaci\u00F3n.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](323, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](324, "Finanzas, reservas y comunicaci\u00F3n centralizadas.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](325, "a", 108);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](326, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](327, "span", 109);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](328, "para administrar condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](329, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](330, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](331, "article", 110)(332, "span", 111);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](333, "OWNER PERSONAL");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](334, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](335, "Gestiono mi vivienda");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](336, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](337, "Registra tu vivienda personal y re\u00FAne sus dispositivos Smart Home en tu propia cuenta, sin depender de una administraci\u00F3n de condominio.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](338, "ul")(339, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](340, "Tu vivienda bajo tu propia cuenta.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](341, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](342, "Estado y control de dispositivos compatibles.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](343, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](344, "Historial de actividad de tu hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](345, "a", 108);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](346, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](347, "span", 109);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](348, "para mi vivienda personal");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](349, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](350, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](351, "aside", 112);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](352, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](353, "use", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](354, "div")(355, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](356, "\u00BFTu condominio ya utiliza CondominiosApp?");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](357, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](358, "Tu administraci\u00F3n crea tu acceso, te asigna el condominio y la unidad, y te env\u00EDa las credenciales por correo.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](359, "a", 113);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](360, "Iniciar sesi\u00F3n ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](361, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](362, "\u2192");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](363, "section", 114)(364, "div", 115)(365, "div", 90)(366, "h2", 116);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](367, "Tu espacio empieza");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](368, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](369, "con un primer paso.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](370, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](371, "El registro te gu\u00EDa desde la elecci\u00F3n de tu cuenta hasta la configuraci\u00F3n de tu organizaci\u00F3n o vivienda.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](372, "a", 108);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](373, "Crear cuenta y comenzar ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](374, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](375, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](376, "ol", 117)(377, "li")(378, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](379, "Elige qu\u00E9 quieres gestionar");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](380, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](381, "Crea una cuenta ADMIN para tu organizaci\u00F3n o una cuenta OWNER PERSONAL para tu vivienda.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](382, "li")(383, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](384, "Verifica tu correo");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](385, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](386, "Completa el registro y abre el enlace que recibir\u00E1s por correo para activar tu cuenta.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](387, "li")(388, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](389, "Configura tu espacio");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](390, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](391, "Inicia sesi\u00F3n. Si administras, a\u00F1ade condominios, unidades y propietarios; si gestionas tu vivienda, configura los dispositivos compatibles.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](392, "section", 118)(393, "div", 119)(394, "h2", 120);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](395, "Antes de dar el primer paso.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](396, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](397, "Lo que necesitas saber para dar el primer paso.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](398, "div", 121);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](399, SaasLandingComponent_For_400_Template, 6, 2, "details", null, _forTrack1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](401, "section", 122)(402, "div", 123);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](403, "svg", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](404, "use", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](405, "h2", 124);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](406, "M\u00E1s tiempo para");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](407, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](408, "sentirte en casa.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](409, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](410, "Empieza a organizar tu comunidad o tu vivienda desde un mismo lugar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](411, "a", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](412, "Crear cuenta ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](413, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](414, "\u2197");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](415, "img", 125);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](416, "footer", 126)(417, "div")(418, "a", 127);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](419, "Condominios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](420, "span", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](421, "App");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](422, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](423, "Gesti\u00F3n de condominios y vivienda personal.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](424, "nav", 128)(425, "a", 129);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](426, "Servicios");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](427, "a", 130);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](428, "Preguntas frecuentes");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](429, "a", 113);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](430, "Iniciar sesi\u00F3n");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](431, "a", 131);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](432, "Crear cuenta");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](433, "span", 132);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](434, "Una comunidad que se siente como hogar.");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_4_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-expanded", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx.menuOpen() ? "Cerrar men\u00FA" : "Men\u00FA", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("is-open", ctx.menuOpen());
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"]((tmp_4_0 = ctx.accountLink()) ? 43 : 44, tmp_4_0);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](51);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](ctx.previews);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](303);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](ctx.questions);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink],
      styles: ["@font-face{font-family:'Landing Manrope';src:url('/assets/landing/manrope-600.ttf') format('truetype');font-weight:600;font-display:swap}\n@font-face{font-family:'Landing Manrope';src:url('/assets/landing/manrope-700.ttf') format('truetype');font-weight:700;font-display:swap}\n@font-face{font-family:'Landing Inter';src:url('/assets/layout/styles/theme/tailwind-light/fonts/Inter-Regular.woff2') format('woff2');font-weight:400;font-display:swap}\n@font-face{font-family:'Landing Inter';src:url('/assets/layout/styles/theme/tailwind-light/fonts/Inter-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}\n[_nghost-%COMP%]{display:block}\n.saas-page[_ngcontent-%COMP%]{--canvas:#fbf9f1;--ink:#183e32;--muted:#52635b;--line:#d8e2d8;--green:#176644;--mint:#e2f1de;--coral:#f6a088;color:var(--ink);background:var(--canvas);font-family:'Landing Inter',sans-serif;font-size:15px;line-height:1.65;color-scheme:light}\n.saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{box-sizing:border-box}\n.container[_ngcontent-%COMP%]{width:min(1280px,calc(100% - 96px));margin-inline:auto}\n.saas-page[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:inherit;text-decoration:none}\n.saas-page[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font:inherit;cursor:pointer}\n.saas-page[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:is(a,button,summary,[tabindex]):focus-visible{outline:3px solid #ab452c;outline-offset:5px}\n.saas-page[_ngcontent-%COMP%]   :is(section[id][_ngcontent-%COMP%], main[id][_ngcontent-%COMP%]){scroll-margin-top:110px}\n.saas-page[_ngcontent-%COMP%]   :is(a[_ngcontent-%COMP%], button[_ngcontent-%COMP%], summary[_ngcontent-%COMP%]){touch-action:manipulation;-webkit-tap-highlight-color:#c4ddc5}\n.symbol-library[_ngcontent-%COMP%]{position:absolute;width:0;height:0;overflow:hidden}\nsvg[_ngcontent-%COMP%]{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;width:32px;height:32px;flex-shrink:0}\n.sr-only[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}\n.skip-link[_ngcontent-%COMP%]{position:fixed;top:12px;left:12px;z-index:100;padding:12px 20px;background:#fff;border:1px solid var(--ink);transform:translateY(-200%);border-radius:8px}\n.skip-link[_ngcontent-%COMP%]:focus{transform:translateY(0)}\n.site-header[_ngcontent-%COMP%]{position:sticky;top:0;z-index:20;background:var(--canvas);border-bottom:1px solid var(--line)}\n.header-inner[_ngcontent-%COMP%]{max-width:1440px;margin:auto;padding:18px 48px;display:flex;align-items:center;justify-content:space-between;gap:24px}\n.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;font-family:'Landing Manrope',sans-serif;font-size:21px;font-weight:700;letter-spacing:-.06em;white-space:nowrap}\n.brand-mark[_ngcontent-%COMP%]{width:34px;height:34px;padding:5px;margin-right:8px;background:var(--green);color:white;border-radius:10px}\n.brand-accent[_ngcontent-%COMP%]{color:var(--green)}\n#public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:24px}\n#public-navigation[_ngcontent-%COMP%]{flex:1;justify-content:flex-end}\n.section-links[_ngcontent-%COMP%], .sign-in[_ngcontent-%COMP%]{font-size:12px}\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .sign-in[_ngcontent-%COMP%]{padding-block:10px}\n.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .sign-in[_ngcontent-%COMP%]:hover{color:var(--green);text-decoration:underline;text-underline-offset:5px}\n.header-actions[_ngcontent-%COMP%]{gap:22px}\n.button[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;gap:28px;min-height:52px;padding:14px 24px;background:var(--green);color:#fff!important;border:1px solid var(--green);border-radius:14px;font-size:14px;font-weight:600;box-shadow:0 4px 0 #0e482f;transition:background .18s,transform .18s,box-shadow .18s}\n.button[_ngcontent-%COMP%]:hover{background:#104e33;transform:translateY(-2px);box-shadow:0 6px 0 #0e482f}\n.button[_ngcontent-%COMP%]:active{transform:translateY(2px);box-shadow:0 1px 0 #0e482f}\n.button-small[_ngcontent-%COMP%]{min-height:42px;padding:9px 17px;gap:16px;font-size:12px;border-radius:11px}\n.menu-toggle[_ngcontent-%COMP%]{display:none}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], p[_ngcontent-%COMP%], figure[_ngcontent-%COMP%]{margin:0}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%]{font-family:'Landing Manrope',sans-serif;font-weight:700;text-wrap:balance;color:inherit}\nh1[_ngcontent-%COMP%]{font-size:clamp(40px,4.3vw,62px);line-height:1.08;letter-spacing:-.055em;margin-block:22px}\nh2[_ngcontent-%COMP%]{font-size:clamp(30px,3.1vw,44px);line-height:1.14;letter-spacing:-.045em}\nh3[_ngcontent-%COMP%]{font-size:23px;line-height:1.3;letter-spacing:-.035em}\nh4[_ngcontent-%COMP%]{font-size:16px;line-height:1.4}\np[_ngcontent-%COMP%]{text-wrap:pretty}\n.hero[_ngcontent-%COMP%]{display:grid;grid-template-columns:.95fr 1.05fr;align-items:center;gap:56px;padding-block:52px 74px}\n.hero-copy[_ngcontent-%COMP%]{padding-block:20px}\n.hero-kicker[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--green);font-weight:600}\n.hero-kicker[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:23px;height:23px}\n.hero-description[_ngcontent-%COMP%]{font-size:16px;max-width:450px;color:var(--muted);margin-bottom:27px}\n.hero-actions[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:24px}\n.text-link[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:14px;min-height:44px;font-size:13px;font-weight:600;text-underline-offset:5px}\n.text-link[_ngcontent-%COMP%]:hover{text-decoration:underline}\n.hero-caption[_ngcontent-%COMP%]{margin-top:29px;padding-left:16px;border-left:3px solid var(--coral);color:var(--muted);font-size:12px}\n.hero-visual[_ngcontent-%COMP%]{position:relative;padding-bottom:200px;min-width:0}\n.hero-photo[_ngcontent-%COMP%]{display:block}\n.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:block;width:100%;height:400px;object-fit:cover;border-radius:80px 24px 24px 24px}\n.photo-caption[_ngcontent-%COMP%]{position:absolute;top:23px;right:20px;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;background:var(--canvas);font-size:11px;line-height:1.5}\n.photo-caption[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:26px;height:26px;color:var(--green)}\n.product-preview[_ngcontent-%COMP%]{position:absolute;bottom:0;left:-22px;width:calc(100% - 20px);background:white;border:1px solid var(--line);border-radius:18px;box-shadow:0 14px 32px #183e3217}\n.preview-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 20px 10px}\n.preview-brand[_ngcontent-%COMP%]{font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px}\n.preview-brand[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:22px;height:22px;color:var(--green)}\n.illustration-label[_ngcontent-%COMP%]{color:var(--muted);font-size:10px}\n.preview-tabs[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);padding:0 14px;border-bottom:1px solid var(--line)}\n.preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:transparent;border:0;border-bottom:3px solid transparent;padding:12px 0;color:var(--muted);font-size:11px;min-height:44px}\n.preview-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{color:var(--green);background:#f1f7ef}\n.preview-tabs[_ngcontent-%COMP%]   button[aria-selected=true][_ngcontent-%COMP%]{border-bottom-color:var(--green);color:var(--green);font-weight:600}\n.preview-body[_ngcontent-%COMP%]{padding:16px 20px;min-height:258px}\n.preview-body[hidden][_ngcontent-%COMP%]{display:none}\n.preview-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:18px;letter-spacing:-.025em;margin-bottom:6px}\n.preview-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:11px;color:var(--muted);margin-bottom:12px}\n.preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:10px;table-layout:fixed;font-variant-numeric:tabular-nums}\n.preview-body[_ngcontent-%COMP%]   :is(th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]){text-align:left;padding:7px 5px;border-bottom:1px solid #e7ece7;overflow-wrap:anywhere}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child{width:26%}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(2){width:46%}\n.preview-body[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{font-weight:600}\n.preview-body[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]{color:var(--muted)}\n.row-status[_ngcontent-%COMP%]{background:var(--mint);color:#27543c;padding:3px 5px;border-radius:5px;display:inline-block}\n.preview-note[_ngcontent-%COMP%]{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:9px;margin-top:12px}\n.small-square[_ngcontent-%COMP%]{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmcuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLDZCQUE2QixDQUFDLDZEQUE2RCxDQUFDLGVBQWUsQ0FBQyxpQkFBaUI7QUFDeEksV0FBVyw2QkFBNkIsQ0FBQyw2REFBNkQsQ0FBQyxlQUFlLENBQUMsaUJBQWlCO0FBQ3hJLFdBQVcsMkJBQTJCLENBQUMsK0ZBQStGLENBQUMsZUFBZSxDQUFDLGlCQUFpQjtBQUN4SyxXQUFXLDJCQUEyQixDQUFDLGdHQUFnRyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUI7QUFDekssTUFBTSxhQUFhO0FBQ25CLFdBQVcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsc0NBQXNDLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQjtBQUMzUCxhQUFhLHFCQUFxQjtBQUNsQyxXQUFXLG1DQUFtQyxDQUFDLGtCQUFrQjtBQUNqRSxhQUFhLGFBQWEsQ0FBQyxvQkFBb0I7QUFDL0Msa0JBQWtCLFlBQVksQ0FBQyxjQUFjO0FBQzdDLDBEQUEwRCx5QkFBeUIsQ0FBQyxrQkFBa0I7QUFDdEcscUNBQXFDLHVCQUF1QjtBQUM1RCxpQ0FBaUMseUJBQXlCLENBQUMsbUNBQW1DO0FBQzlGLGdCQUFnQixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWU7QUFDbEUsSUFBSSxTQUFTLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxhQUFhO0FBQ2xJLFNBQVMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsa0JBQWtC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LGlCQUFpQixlQUFlO0FBQ2hDLG9CQUFvQixrQkFBa0I7QUFDdEMsWUFBWSxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQjtBQUN2RyxjQUFjLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLGVBQWU7QUFDdEcsY0FBYyxTQUFTLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJAZm9udC1mYWNle2ZvbnQtZmFtaWx5OidMYW5kaW5nIE1hbnJvcGUnO3NyYzp1cmwoJy9hc3NldHMvbGFuZGluZy9tYW5yb3BlLTYwMC50dGYnKSBmb3JtYXQoJ3RydWV0eXBlJyk7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtZGlzcGxheTpzd2FwfVxyXG5AZm9udC1mYWNle2ZvbnQtZmFtaWx5OidMYW5kaW5nIE1hbnJvcGUnO3NyYzp1cmwoJy9hc3NldHMvbGFuZGluZy9tYW5yb3BlLTcwMC50dGYnKSBmb3JtYXQoJ3RydWV0eXBlJyk7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtZGlzcGxheTpzd2FwfVxyXG5AZm9udC1mYWNle2ZvbnQtZmFtaWx5OidMYW5kaW5nIEludGVyJztzcmM6dXJsKCcvYXNzZXRzL2xheW91dC9zdHlsZXMvdGhlbWUvdGFpbHdpbmQtbGlnaHQvZm9udHMvSW50ZXItUmVndWxhci53b2ZmMicpIGZvcm1hdCgnd29mZjInKTtmb250LXdlaWdodDo0MDA7Zm9udC1kaXNwbGF5OnN3YXB9XHJcbkBmb250LWZhY2V7Zm9udC1mYW1pbHk6J0xhbmRpbmcgSW50ZXInO3NyYzp1cmwoJy9hc3NldHMvbGF5b3V0L3N0eWxlcy90aGVtZS90YWlsd2luZC1saWdodC9mb250cy9JbnRlci1TZW1pQm9sZC53b2ZmMicpIGZvcm1hdCgnd29mZjInKTtmb250LXdlaWdodDo2MDA7Zm9udC1kaXNwbGF5OnN3YXB9XHJcbjpob3N0e2Rpc3BsYXk6YmxvY2t9XHJcbi5zYWFzLXBhZ2V7LS1jYW52YXM6I2ZiZjlmMTstLWluazojMTgzZTMyOy0tbXV0ZWQ6IzUyNjM1YjstLWxpbmU6I2Q4ZTJkODstLWdyZWVuOiMxNzY2NDQ7LS1taW50OiNlMmYxZGU7LS1jb3JhbDojZjZhMDg4O2NvbG9yOnZhcigtLWluayk7YmFja2dyb3VuZDp2YXIoLS1jYW52YXMpO2ZvbnQtZmFtaWx5OidMYW5kaW5nIEludGVyJyxzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxNXB4O2xpbmUtaGVpZ2h0OjEuNjU7Y29sb3Itc2NoZW1lOmxpZ2h0fVxyXG4uc2Fhcy1wYWdlICp7Ym94LXNpemluZzpib3JkZXItYm94fVxyXG4uY29udGFpbmVye3dpZHRoOm1pbigxMjgwcHgsY2FsYygxMDAlIC0gOTZweCkpO21hcmdpbi1pbmxpbmU6YXV0b31cclxuLnNhYXMtcGFnZSBhe2NvbG9yOmluaGVyaXQ7dGV4dC1kZWNvcmF0aW9uOm5vbmV9XHJcbi5zYWFzLXBhZ2UgYnV0dG9ue2ZvbnQ6aW5oZXJpdDtjdXJzb3I6cG9pbnRlcn1cclxuLnNhYXMtcGFnZSA6aXMoYSxidXR0b24sc3VtbWFyeSxbdGFiaW5kZXhdKTpmb2N1cy12aXNpYmxle291dGxpbmU6M3B4IHNvbGlkICNhYjQ1MmM7b3V0bGluZS1vZmZzZXQ6NXB4fVxyXG4uc2Fhcy1wYWdlIDppcyhzZWN0aW9uW2lkXSxtYWluW2lkXSl7c2Nyb2xsLW1hcmdpbi10b3A6MTEwcHh9XHJcbi5zYWFzLXBhZ2UgOmlzKGEsYnV0dG9uLHN1bW1hcnkpe3RvdWNoLWFjdGlvbjptYW5pcHVsYXRpb247LXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiNjNGRkYzV9XHJcbi5zeW1ib2wtbGlicmFyeXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDowO2hlaWdodDowO292ZXJmbG93OmhpZGRlbn1cclxuc3Zne2ZpbGw6bm9uZTtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoxLjc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3dpZHRoOjMycHg7aGVpZ2h0OjMycHg7ZmxleC1zaHJpbms6MH1cclxuLnNyLW9ubHl7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MXB4O2hlaWdodDoxcHg7b3ZlcmZsb3c6aGlkZGVuO2NsaXAtcGF0aDppbnNldCg1MCUpO3doaXRlLXNwYWNlOm5vd3JhcH1cclxuLnNraXAtbGlua3twb3NpdGlvbjpmaXhlZDt0b3A6MTJweDtsZWZ0OjEycHg7ei1pbmRleDoxMDA7cGFkZGluZzoxMnB4IDIwcHg7YmFja2dyb3VuZDojZmZmO2JvcmRlcjoxcHggc29saWQgdmFyKC0taW5rKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMjAwJSk7Ym9yZGVyLXJhZGl1czo4cHh9XHJcbi5za2lwLWxpbms6Zm9jdXN7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9XHJcbi5zaXRlLWhlYWRlcntwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDoyMDtiYWNrZ3JvdW5kOnZhcigtLWNhbnZhcyk7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5oZWFkZXItaW5uZXJ7bWF4LXdpZHRoOjE0NDBweDttYXJnaW46YXV0bztwYWRkaW5nOjE4cHggNDhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoyNHB4fVxyXG4uYnJhbmR7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1mYW1pbHk6J0xhbmRpbmcgTWFucm9wZScsc2Fucy1zZXJpZjtmb250LXNpemU6MjFweDtmb250LXdlaWdodDo3MDA7bGV0dGVyLXNwYWNpbmc6LS4wNmVtO3doaXRlLXNwYWNlOm5vd3JhcH1cclxuLmJyYW5kLW1hcmt7d2lkdGg6MzRweDtoZWlnaHQ6MzRweDtwYWRkaW5nOjVweDttYXJnaW4tcmlnaHQ6OHB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2NvbG9yOndoaXRlO2JvcmRlci1yYWRpdXM6MTBweH1cclxuLmJyYW5kLWFjY2VudHtjb2xvcjp2YXIoLS1ncmVlbil9XHJcbiNwdWJsaWMtbmF2aWdhdGlvbiwuc2VjdGlvbi1saW5rcywuaGVhZGVyLWFjdGlvbnN7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MjRweH1cclxuI3B1YmxpYy1uYXZpZ2F0aW9ue2ZsZXg6MTtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmR9XHJcbi5zZWN0aW9uLWxpbmtzLC5zaWduLWlue2ZvbnQtc2l6ZToxMnB4fVxyXG4uc2VjdGlvbi1saW5rcyBhLC5zaWduLWlue3BhZGRpbmctYmxvY2s6MTBweH1cclxuLnNlY3Rpb24tbGlua3MgYTpob3Zlciwuc2l0ZS1mb290ZXIgbmF2IGE6aG92ZXIsLnNpZ24taW46aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pO3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7dGV4dC11bmRlcmxpbmUtb2Zmc2V0OjVweH1cclxuLmhlYWRlci1hY3Rpb25ze2dhcDoyMnB4fVxyXG4uYnV0dG9ue2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Z2FwOjI4cHg7bWluLWhlaWdodDo1MnB4O3BhZGRpbmc6MTRweCAyNHB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2NvbG9yOiNmZmYhaW1wb3J0YW50O2JvcmRlcjoxcHggc29saWQgdmFyKC0tZ3JlZW4pO2JvcmRlci1yYWRpdXM6MTRweDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDA7Ym94LXNoYWRvdzowIDRweCAwICMwZTQ4MmY7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4xOHMsdHJhbnNmb3JtIC4xOHMsYm94LXNoYWRvdyAuMThzfVxyXG4uYnV0dG9uOmhvdmVye2JhY2tncm91bmQ6IzEwNGUzMzt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93OjAgNnB4IDAgIzBlNDgyZn1cclxuLmJ1dHRvbjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMnB4KTtib3gtc2hhZG93OjAgMXB4IDAgIzBlNDgyZn1cclxuLmJ1dHRvbi1zbWFsbHttaW4taGVpZ2h0OjQycHg7cGFkZGluZzo5cHggMTdweDtnYXA6MTZweDtmb250LXNpemU6MTJweDtib3JkZXItcmFkaXVzOjExcHh9XHJcbi5tZW51LXRvZ2dsZXtkaXNwbGF5Om5vbmV9XHJcbmgxLGgyLGgzLGg0LHAsZmlndXJle21hcmdpbjowfVxyXG5oMSxoMixoMyxoNHtmb250LWZhbWlseTonTGFuZGluZyBNYW5yb3BlJyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjcwMDt0ZXh0LXdyYXA6YmFsYW5jZTtjb2xvcjppbmhlcml0fVxyXG5oMXtmb250LXNpemU6Y2xhbXAoNDBweCw0LjN2dyw2MnB4KTtsaW5lLWhlaWdodDoxLjA4O2xldHRlci1zcGFjaW5nOi0uMDU1ZW07bWFyZ2luLWJsb2NrOjIycHh9XHJcbmgye2ZvbnQtc2l6ZTpjbGFtcCgzMHB4LDMuMXZ3LDQ0cHgpO2xpbmUtaGVpZ2h0OjEuMTQ7bGV0dGVyLXNwYWNpbmc6LS4wNDVlbX1cclxuaDN7Zm9udC1zaXplOjIzcHg7bGluZS1oZWlnaHQ6MS4zO2xldHRlci1zcGFjaW5nOi0uMDM1ZW19XHJcbmg0e2ZvbnQtc2l6ZToxNnB4O2xpbmUtaGVpZ2h0OjEuNH1cclxucHt0ZXh0LXdyYXA6cHJldHR5fVxyXG4uaGVyb3tkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOi45NWZyIDEuMDVmcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjU2cHg7cGFkZGluZy1ibG9jazo1MnB4IDc0cHh9XHJcbi5oZXJvLWNvcHl7cGFkZGluZy1ibG9jazoyMHB4fVxyXG4uaGVyby1raWNrZXJ7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtmb250LXNpemU6MTJweDtjb2xvcjp2YXIoLS1ncmVlbik7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uaGVyby1raWNrZXIgc3Zne3dpZHRoOjIzcHg7aGVpZ2h0OjIzcHh9XHJcbi5oZXJvLWRlc2NyaXB0aW9ue2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDo0NTBweDtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLWJvdHRvbToyN3B4fVxyXG4uaGVyby1hY3Rpb25ze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7ZmxleC13cmFwOndyYXA7Z2FwOjI0cHh9XHJcbi50ZXh0LWxpbmt7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjE0cHg7bWluLWhlaWdodDo0NHB4O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LXVuZGVybGluZS1vZmZzZXQ6NXB4fVxyXG4udGV4dC1saW5rOmhvdmVye3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9XHJcbi5oZXJvLWNhcHRpb257bWFyZ2luLXRvcDoyOXB4O3BhZGRpbmctbGVmdDoxNnB4O2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1jb3JhbCk7Y29sb3I6dmFyKC0tbXV0ZWQpO2ZvbnQtc2l6ZToxMnB4fVxyXG4uaGVyby12aXN1YWx7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1ib3R0b206MjAwcHg7bWluLXdpZHRoOjB9XHJcbi5oZXJvLXBob3Rve2Rpc3BsYXk6YmxvY2t9XHJcbi5oZXJvLXBob3RvIGltZ3tkaXNwbGF5OmJsb2NrO3dpZHRoOjEwMCU7aGVpZ2h0OjQwMHB4O29iamVjdC1maXQ6Y292ZXI7Ym9yZGVyLXJhZGl1czo4MHB4IDI0cHggMjRweCAyNHB4fVxyXG4ucGhvdG8tY2FwdGlvbntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjNweDtyaWdodDoyMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzoxMnB4IDE2cHg7Ym9yZGVyLXJhZGl1czoxNHB4O2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjV9XHJcbi5waG90by1jYXB0aW9uIHN2Z3t3aWR0aDoyNnB4O2hlaWdodDoyNnB4O2NvbG9yOnZhcigtLWdyZWVuKX1cclxuLnByb2R1Y3QtcHJldmlld3twb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MDtsZWZ0Oi0yMnB4O3dpZHRoOmNhbGMoMTAwJSAtIDIwcHgpO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1saW5lKTtib3JkZXItcmFkaXVzOjE4cHg7Ym94LXNoYWRvdzowIDE0cHggMzJweCAjMTgzZTMyMTd9XHJcbi5wcmV2aWV3LXRvcHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDo4cHg7cGFkZGluZzoxNHB4IDIwcHggMTBweH1cclxuLnByZXZpZXctYnJhbmR7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NjAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweH1cclxuLnByZXZpZXctYnJhbmQgc3Zne3dpZHRoOjIycHg7aGVpZ2h0OjIycHg7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uaWxsdXN0cmF0aW9uLWxhYmVse2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6MTBweH1cclxuLnByZXZpZXctdGFic3tkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCg0LDFmcik7cGFkZGluZzowIDE0cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5wcmV2aWV3LXRhYnMgYnV0dG9ue2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Ym9yZGVyOjA7Ym9yZGVyLWJvdHRvbTozcHggc29saWQgdHJhbnNwYXJlbnQ7cGFkZGluZzoxMnB4IDA7Y29sb3I6dmFyKC0tbXV0ZWQpO2ZvbnQtc2l6ZToxMXB4O21pbi1oZWlnaHQ6NDRweH1cclxuLnByZXZpZXctdGFicyBidXR0b246aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pO2JhY2tncm91bmQ6I2YxZjdlZn1cclxuLnByZXZpZXctdGFicyBidXR0b25bYXJpYS1zZWxlY3RlZD10cnVlXXtib3JkZXItYm90dG9tLWNvbG9yOnZhcigtLWdyZWVuKTtjb2xvcjp2YXIoLS1ncmVlbik7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ucHJldmlldy1ib2R5e3BhZGRpbmc6MTZweCAyMHB4O21pbi1oZWlnaHQ6MjU4cHh9XHJcbi5wcmV2aWV3LWJvZHlbaGlkZGVuXXtkaXNwbGF5Om5vbmV9XHJcbi5wcmV2aWV3LWJvZHkgaDJ7Zm9udC1zaXplOjE4cHg7bGV0dGVyLXNwYWNpbmc6LS4wMjVlbTttYXJnaW4tYm90dG9tOjZweH1cclxuLnByZXZpZXctYm9keSBwe2ZvbnQtc2l6ZToxMXB4O2NvbG9yOnZhcigtLW11dGVkKTttYXJnaW4tYm90dG9tOjEycHh9XHJcbi5wcmV2aWV3LWJvZHkgdGFibGV7d2lkdGg6MTAwJTtib3JkZXItY29sbGFwc2U6Y29sbGFwc2U7Zm9udC1zaXplOjEwcHg7dGFibGUtbGF5b3V0OmZpeGVkO2ZvbnQtdmFyaWFudC1udW1lcmljOnRhYnVsYXItbnVtc31cclxuLnByZXZpZXctYm9keSA6aXModGgsdGQpe3RleHQtYWxpZ246bGVmdDtwYWRkaW5nOjdweCA1cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2U3ZWNlNztvdmVyZmxvdy13cmFwOmFueXdoZXJlfVxyXG4ucHJldmlldy1ib2R5IHRoOmZpcnN0LWNoaWxke3dpZHRoOjI2JX1cclxuLnByZXZpZXctYm9keSB0aDpudGgtY2hpbGQoMil7d2lkdGg6NDYlfVxyXG4ucHJldmlldy1ib2R5IHRoe2ZvbnQtd2VpZ2h0OjYwMH1cclxuLnByZXZpZXctYm9keSB0aGVhZHtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5yb3ctc3RhdHVze2JhY2tncm91bmQ6dmFyKC0tbWludCk7Y29sb3I6IzI3NTQzYztwYWRkaW5nOjNweCA1cHg7Ym9yZGVyLXJhZGl1czo1cHg7ZGlzcGxheTppbmxpbmUtYmxvY2t9XHJcbi5wcmV2aWV3LW5vdGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6N3B4O2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6OXB4O21hcmdpbi10b3A6MTJweH1cclxuLnNtYWxsLXNxdWFyZXt3aWR0aDo1cHg7aGVpZ2h0OjVweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnZhcigtLWdyZWVuKTtmbGV4LXNocmluazowfVxyXG4iXSwic291cmNlUm9vdCI6IiJ9 */", ".benefits-section[_ngcontent-%COMP%]{background:var(--mint);padding-block:32px}\n.benefits-inner[_ngcontent-%COMP%]{display:flex;align-items:center;gap:46px}\n.benefits-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:22px;flex-shrink:0}\n.benefits-list[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);list-style:none;padding:0;margin:0;width:100%;gap:20px}\n.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;font-size:12px}\n.benefits-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:29px;height:29px;color:var(--green)}\n.section-padding[_ngcontent-%COMP%]{padding-block:88px}\n.section-intro[_ngcontent-%COMP%]{max-width:720px;margin-bottom:40px}\n.section-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);margin-top:18px;max-width:500px}\n.service-heading[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-end;gap:60px;max-width:none}\n.service-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:380px}\n.community-feature[_ngcontent-%COMP%]{display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center}\n.community-feature[_ngcontent-%COMP%]   figure[_ngcontent-%COMP%]{position:relative}\n.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:400px;object-fit:cover;display:block;border-radius:22px}\n.community-feature[_ngcontent-%COMP%]   figcaption[_ngcontent-%COMP%]{position:absolute;bottom:20px;left:20px;background:var(--canvas);border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600}\n.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:30px;margin-bottom:18px}\n.feature-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{color:var(--muted)}\n.feature-list[_ngcontent-%COMP%]{list-style:none;padding:0;margin:26px 0 0}\n.feature-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;gap:16px;margin-top:22px}\n.feature-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green)}\n.feature-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:13px;color:var(--muted);margin-top:4px}\n.shared-services[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:38px;margin-top:44px}\n.shared-services[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]{border-top:1px solid var(--line);padding-top:24px}\n.service-icon[_ngcontent-%COMP%]{color:var(--green);margin-bottom:14px}\n.shared-services[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px;margin-bottom:10px}\n.shared-services[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.connected-section[_ngcontent-%COMP%]{background:var(--ink);color:var(--canvas);padding-block:64px}\n.connected-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1.1fr;align-items:center;gap:80px}\n.feature-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;color:#cef0bf;font-weight:600;margin-bottom:20px}\n.connected-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{color:#d5e2d7;margin-top:22px}\n.connected-copy[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:22px}\n.connected-copy[_ngcontent-%COMP%]   .availability-note[_ngcontent-%COMP%]{font-size:11px;max-width:400px;margin-top:24px}\n.connected-visual[_ngcontent-%COMP%]{position:relative;padding-bottom:22px}\n.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:390px;object-fit:cover;border-radius:22px 70px 22px 22px;display:block}\n.device-example[_ngcontent-%COMP%]{display:flex;gap:14px;align-items:center;position:absolute;bottom:0;left:22px;right:22px;padding:16px 22px;background:var(--canvas);color:var(--ink);border-radius:16px;box-shadow:0 8px 18px #0002}\n.device-example[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1}\n.device-example[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .device-example[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;font-size:13px}\n.device-example[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:11px;color:var(--muted)}\n.device-dot[_ngcontent-%COMP%]{display:inline-block;width:9px;height:9px;background:var(--green);border-radius:50%;flex-shrink:0}\n.everyday-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}\n.scene-art[_ngcontent-%COMP%]{height:250px;display:flex;align-items:center;justify-content:center;position:relative;border-radius:18px;padding:24px}\n.finance-art[_ngcontent-%COMP%]{background:var(--mint)}\n.booking-art[_ngcontent-%COMP%]{background:#fbe2d7}\n.home-art[_ngcontent-%COMP%]{background:#e9e9dc}\n.scene-label[_ngcontent-%COMP%]{position:absolute;top:14px;left:18px;font-size:10px;color:var(--muted)}\n.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{background:white;border:1px solid #d8e2d8;border-radius:12px;width:100%;max-width:270px;padding:20px;display:flex;flex-direction:column;gap:8px;box-shadow:0 8px 18px #183e320b;font-size:11px}\n.mini-statement[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:14px}\n.mini-statement[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green);width:25px;height:25px}\n.mini-statement[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-between;border-top:1px solid var(--line);padding-top:12px;margin-top:6px;gap:8px}\n.calendar-days[_ngcontent-%COMP%]{display:flex;justify-content:space-between;border-block:1px solid var(--line);padding-block:10px;align-items:center}\n.calendar-days[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{padding:4px 8px;background:var(--green);color:white;border-radius:50%}\n.calendar-status[_ngcontent-%COMP%]{color:var(--green)}\n.mini-device[_ngcontent-%COMP%]{align-items:center;padding-block:26px}\n.mini-device[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{background:var(--mint);padding:7px 14px;border-radius:8px;margin-top:8px}\n.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-block:22px 12px;font-size:21px}\n.everyday-scene[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);font-size:14px}\n.audience-section[_ngcontent-%COMP%]{padding-top:16px}\n.audience-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:24px}\n.audience-card[_ngcontent-%COMP%]{border:1px solid #c8d9ca;border-radius:22px;background:var(--mint);padding:38px;display:flex;flex-direction:column;align-items:flex-start}\n.personal-card[_ngcontent-%COMP%]{background:#f3e9dc;border-color:#e1d3c3}\n.account-label[_ngcontent-%COMP%]{display:inline-block;font-size:10px;font-weight:600;border:1px solid #bdcebf;padding:5px 10px;border-radius:7px;margin-bottom:22px}\n.personal-label[_ngcontent-%COMP%]{border-color:#d8c6b3}\n.audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:30px;margin-bottom:18px}\n.audience-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.audience-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding-left:20px;margin-block:20px 24px}\n.audience-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding-block:5px}\n.audience-card[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:auto;border-bottom:1px solid var(--green)}\n.resident-note[_ngcontent-%COMP%]{display:flex;align-items:center;gap:22px;margin-top:28px;padding:26px 0;border-block:1px solid var(--line)}\n.resident-note[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1}\n.resident-note[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:18px;margin-bottom:6px}\n.resident-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);font-size:13px;max-width:760px}\n.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:13px;font-weight:600;min-height:44px;display:inline-flex;align-items:center;gap:10px;text-decoration:underline;text-underline-offset:5px}\n.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:var(--green)}\n.getting-started[_ngcontent-%COMP%]{background:#f0f2e7}\n.steps-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1.1fr;gap:90px}\n.steps-layout[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]{margin:0}\n.steps-layout[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{margin-top:22px}\n.steps-list[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;counter-reset:steps}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{position:relative;padding:0 0 30px 66px;counter-increment:steps}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::before{content:counter(steps);position:absolute;left:0;top:0;background:var(--green);color:white;font-family:'Landing Manrope',sans-serif;font-weight:600;width:40px;height:40px;display:grid;place-items:center;border-radius:50%}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child)::after{content:'';position:absolute;left:19px;top:48px;bottom:8px;width:1px;background:#a9c6a9}\n.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{padding-bottom:0}\n.steps-list[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px;margin-bottom:10px}\n.steps-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:var(--muted)}\n.faq-section[_ngcontent-%COMP%]{display:grid;grid-template-columns:.85fr 1.15fr;gap:90px}\n.faq-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);margin-top:20px}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]{border-bottom:1px solid var(--line)}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]:first-child{border-top:1px solid var(--line)}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 0;cursor:pointer;font-weight:600;font-size:14px;list-style:none}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::-webkit-details-marker{display:none}\n.faq-list[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]:hover{color:var(--green)}\n.faq-toggle[_ngcontent-%COMP%]{width:16px;height:16px;position:relative;flex-shrink:0}\n.faq-toggle[_ngcontent-%COMP%]::before, .faq-toggle[_ngcontent-%COMP%]::after{content:'';position:absolute;background:currentColor;width:14px;height:1px;top:7px;left:1px}\n.faq-toggle[_ngcontent-%COMP%]::after{transform:rotate(90deg);transition:transform .18s}\ndetails[open][_ngcontent-%COMP%]   .faq-toggle[_ngcontent-%COMP%]::after{transform:rotate(0)}\n.faq-list[_ngcontent-%COMP%]   details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:0 28px 22px 0;font-size:13px;color:var(--muted)}\n.closing-section[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;background:var(--mint);border-radius:26px;overflow:hidden}\n.closing-copy[_ngcontent-%COMP%]{padding:48px}\n.closing-copy[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{color:var(--green);margin-bottom:22px;width:40px;height:40px}\n.closing-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--muted);max-width:350px;margin-block:18px 24px}\n.closing-section[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{width:100%;height:100%;min-height:390px;object-fit:cover}\n.site-footer[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding-block:44px 28px}\n.site-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:12px;color:var(--muted);margin-top:8px}\n.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;flex-wrap:wrap;align-content:center;gap:12px 22px;font-size:12px}\n.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{min-height:44px;display:inline-flex;align-items:center}\n.footer-detail[_ngcontent-%COMP%]{grid-column:1/-1;font-size:11px;color:var(--muted);border-top:1px solid var(--line);padding-top:20px}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmctc2VjdGlvbnMuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtCQUFrQixzQkFBc0IsQ0FBQyxrQkFBa0I7QUFDM0QsZ0JBQWdCLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRO0FBQ3hELG1CQUFtQixjQUFjLENBQUMsYUFBYTtBQUMvQyxlQUFlLFlBQVksQ0FBQyxtQ0FBbUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUTtBQUN0SCxrQkFBa0IsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxjQUFjO0FBQ3pFLG1CQUFtQixVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtBQUM1RCxpQkFBaUIsa0JBQWtCO0FBQ25DLGVBQWUsZUFBZSxDQUFDLGtCQUFrQjtBQUNqRCxpQkFBaUIsa0JBQWtCLENBQUMsZUFBZSxDQUFDLGVBQWU7QUFDbkUsaUJBQWlCLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsY0FBYztBQUN4RyxtQkFBbUIsZUFBZTtBQUNsQyxtQkFBbUIsWUFBWSxDQUFDLCtCQUErQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0I7QUFDM0YsMEJBQTBCLGlCQUFpQjtBQUMzQyx1QkFBdUIsVUFBVSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsa0JBQWtCO0FBQ2hHLDhCQUE4QixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxlQUFlO0FBQ2xLLGlCQUFpQixjQUFjLENBQUMsa0JBQWtCO0FBQ2xELGdCQUFnQixrQkFBa0I7QUFDbEMsY0FBYyxlQUFlLENBQUMsU0FBUyxDQUFDLGVBQWU7QUFDdkQsaUJBQWlCLFlBQVksQ0FBQyxR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Q3hGLGVBQWUsY0FBYyxDQUFDLGtCQUFrQixDQUFDLGNBQWM7QUFDL0QsaUJBQWlCLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLGNBQWM7QUFDdkgsbUJBQW1CLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0I7QUFDekUsZUFBZSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLENBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLmJlbmVmaXRzLXNlY3Rpb257YmFja2dyb3VuZDp2YXIoLS1taW50KTtwYWRkaW5nLWJsb2NrOjMycHh9XHJcbi5iZW5lZml0cy1pbm5lcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0NnB4fVxyXG4uYmVuZWZpdHMtaW5uZXIgaDJ7Zm9udC1zaXplOjIycHg7ZmxleC1zaHJpbms6MH1cclxuLmJlbmVmaXRzLWxpc3R7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoNCwxZnIpO2xpc3Qtc3R5bGU6bm9uZTtwYWRkaW5nOjA7bWFyZ2luOjA7d2lkdGg6MTAwJTtnYXA6MjBweH1cclxuLmJlbmVmaXRzLWxpc3QgbGl7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDtmb250LXNpemU6MTJweH1cclxuLmJlbmVmaXRzLWxpc3Qgc3Zne3dpZHRoOjI5cHg7aGVpZ2h0OjI5cHg7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6ODhweH1cclxuLnNlY3Rpb24taW50cm97bWF4LXdpZHRoOjcyMHB4O21hcmdpbi1ib3R0b206NDBweH1cclxuLnNlY3Rpb24taW50cm8gcHtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLXRvcDoxOHB4O21heC13aWR0aDo1MDBweH1cclxuLnNlcnZpY2UtaGVhZGluZ3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjYwcHg7bWF4LXdpZHRoOm5vbmV9XHJcbi5zZXJ2aWNlLWhlYWRpbmcgcHttYXgtd2lkdGg6MzgwcHh9XHJcbi5jb21tdW5pdHktZmVhdHVyZXtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjEuMWZyIDFmcjtnYXA6NjBweDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5jb21tdW5pdHktZmVhdHVyZSBmaWd1cmV7cG9zaXRpb246cmVsYXRpdmV9XHJcbi5jb21tdW5pdHktZmVhdHVyZSBpbWd7d2lkdGg6MTAwJTtoZWlnaHQ6NDAwcHg7b2JqZWN0LWZpdDpjb3ZlcjtkaXNwbGF5OmJsb2NrO2JvcmRlci1yYWRpdXM6MjJweH1cclxuLmNvbW11bml0eS1mZWF0dXJlIGZpZ2NhcHRpb257cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjIwcHg7bGVmdDoyMHB4O2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtib3JkZXItcmFkaXVzOjEwcHg7cGFkZGluZzoxMHB4IDE2cHg7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZmVhdHVyZS1jb3B5IGgze2ZvbnQtc2l6ZTozMHB4O21hcmdpbi1ib3R0b206MThweH1cclxuLmZlYXR1cmUtY29weT5we2NvbG9yOnZhcigtLW11dGVkKX1cclxuLmZlYXR1cmUtbGlzdHtsaXN0LXN0eWxlOm5vbmU7cGFkZGluZzowO21hcmdpbjoyNnB4IDAgMH1cclxuLmZlYXR1cmUtbGlzdCBsaXtkaXNwbGF5OmZsZXg7Z2FwOjE2cHg7bWFyZ2luLXRvcDoyMnB4fVxyXG4uZmVhdHVyZS1saXN0IHN2Z3tjb2xvcjp2YXIoLS1ncmVlbil9XHJcbi5mZWF0dXJlLWxpc3QgcHtmb250LXNpemU6MTNweDtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLXRvcDo0cHh9XHJcbi5zaGFyZWQtc2VydmljZXN7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMywxZnIpO2dhcDozOHB4O21hcmdpbi10b3A6NDRweH1cclxuLnNoYXJlZC1zZXJ2aWNlcyBhcnRpY2xle2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctdG9wOjI0cHh9XHJcbi5zZXJ2aWNlLWljb257Y29sb3I6dmFyKC0tZ3JlZW4pO21hcmdpbi1ib3R0b206MTRweH1cclxuLnNoYXJlZC1zZXJ2aWNlcyBoM3tmb250LXNpemU6MjBweDttYXJnaW4tYm90dG9tOjEwcHh9XHJcbi5zaGFyZWQtc2VydmljZXMgcHtmb250LXNpemU6MTRweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5jb25uZWN0ZWQtc2VjdGlvbntiYWNrZ3JvdW5kOnZhcigtLWluayk7Y29sb3I6dmFyKC0tY2FudmFzKTtwYWRkaW5nLWJsb2NrOjY0cHh9XHJcbi5jb25uZWN0ZWQtbGF5b3V0e2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDEuMWZyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6ODBweH1cclxuLmZlYXR1cmUtbGFiZWx7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtjb2xvcjojY2VmMGJmO2ZvbnQtd2VpZ2h0OjYwMDttYXJnaW4tYm90dG9tOjIwcHh9XHJcbi5jb25uZWN0ZWQtY29weT5we2NvbG9yOiNkNWUyZDc7bWFyZ2luLXRvcDoyMnB4fVxyXG4uY29ubmVjdGVkLWNvcHkgLnRleHQtbGlua3ttYXJnaW4tdG9wOjIycHh9XHJcbi5jb25uZWN0ZWQtY29weSAuYXZhaWxhYmlsaXR5LW5vdGV7Zm9udC1zaXplOjExcHg7bWF4LXdpZHRoOjQwMHB4O21hcmdpbi10b3A6MjRweH1cclxuLmNvbm5lY3RlZC12aXN1YWx7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1ib3R0b206MjJweH1cclxuLmNvbm5lY3RlZC12aXN1YWwgaW1ne3dpZHRoOjEwMCU7aGVpZ2h0OjM5MHB4O29iamVjdC1maXQ6Y292ZXI7Ym9yZGVyLXJhZGl1czoyMnB4IDcwcHggMjJweCAyMnB4O2Rpc3BsYXk6YmxvY2t9XHJcbi5kZXZpY2UtZXhhbXBsZXtkaXNwbGF5OmZsZXg7Z2FwOjE0cHg7YWxpZ24taXRlbXM6Y2VudGVyO3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTowO2xlZnQ6MjJweDtyaWdodDoyMnB4O3BhZGRpbmc6MTZweCAyMnB4O2JhY2tncm91bmQ6dmFyKC0tY2FudmFzKTtjb2xvcjp2YXIoLS1pbmspO2JvcmRlci1yYWRpdXM6MTZweDtib3gtc2hhZG93OjAgOHB4IDE4cHggIzAwMDJ9XHJcbi5kZXZpY2UtZXhhbXBsZSBkaXZ7ZmxleDoxfVxyXG4uZGV2aWNlLWV4YW1wbGUgc3Ryb25nLC5kZXZpY2UtZXhhbXBsZSBzcGFue2Rpc3BsYXk6YmxvY2s7Zm9udC1zaXplOjEzcHh9XHJcbi5kZXZpY2UtZXhhbXBsZSBkaXYgc3Bhbntmb250LXNpemU6MTFweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5kZXZpY2UtZG90e2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjlweDtoZWlnaHQ6OXB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2JvcmRlci1yYWRpdXM6NTAlO2ZsZXgtc2hyaW5rOjB9XHJcbi5ldmVyeWRheS1ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MjhweH1cclxuLnNjZW5lLWFydHtoZWlnaHQ6MjUwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MThweDtwYWRkaW5nOjI0cHh9XHJcbi5maW5hbmNlLWFydHtiYWNrZ3JvdW5kOnZhcigtLW1pbnQpfVxyXG4uYm9va2luZy1hcnR7YmFja2dyb3VuZDojZmJlMmQ3fVxyXG4uaG9tZS1hcnR7YmFja2dyb3VuZDojZTllOWRjfVxyXG4uc2NlbmUtbGFiZWx7cG9zaXRpb246YWJzb2x1dGU7dG9wOjE0cHg7bGVmdDoxOHB4O2ZvbnQtc2l6ZToxMHB4O2NvbG9yOnZhcigtLW11dGVkKX1cclxuLm1pbmktc3RhdGVtZW50LC5taW5pLWNhbGVuZGFyLC5taW5pLWRldmljZXtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2Q4ZTJkODtib3JkZXItcmFkaXVzOjEycHg7d2lkdGg6MTAwJTttYXgtd2lkdGg6MjcwcHg7cGFkZGluZzoyMHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtib3gtc2hhZG93OjAgOHB4IDE4cHggIzE4M2UzMjBiO2ZvbnQtc2l6ZToxMXB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgc3Ryb25nLC5taW5pLWNhbGVuZGFyIHN0cm9uZywubWluaS1kZXZpY2Ugc3Ryb25ne2ZvbnQtc2l6ZToxNHB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgc3ZnLC5taW5pLWNhbGVuZGFyIHN2ZywubWluaS1kZXZpY2Ugc3Zne2NvbG9yOnZhcigtLWdyZWVuKTt3aWR0aDoyNXB4O2hlaWdodDoyNXB4fVxyXG4ubWluaS1zdGF0ZW1lbnQgZGl2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1saW5lKTtwYWRkaW5nLXRvcDoxMnB4O21hcmdpbi10b3A6NnB4O2dhcDo4cHh9XHJcbi5jYWxlbmRhci1kYXlze2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtib3JkZXItYmxvY2s6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctYmxvY2s6MTBweDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5jYWxlbmRhci1kYXlzIGJ7cGFkZGluZzo0cHggOHB4O2JhY2tncm91bmQ6dmFyKC0tZ3JlZW4pO2NvbG9yOndoaXRlO2JvcmRlci1yYWRpdXM6NTAlfVxyXG4uY2FsZW5kYXItc3RhdHVze2NvbG9yOnZhcigtLWdyZWVuKX1cclxuLm1pbmktZGV2aWNle2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nLWJsb2NrOjI2cHh9XHJcbi5taW5pLWRldmljZSBie2JhY2tncm91bmQ6dmFyKC0tbWludCk7cGFkZGluZzo3cHggMTRweDtib3JkZXItcmFkaXVzOjhweDttYXJnaW4tdG9wOjhweH1cclxuLmV2ZXJ5ZGF5LXNjZW5lIGgze21hcmdpbi1ibG9jazoyMnB4IDEycHg7Zm9udC1zaXplOjIxcHh9XHJcbi5ldmVyeWRheS1zY2VuZSBwe2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6MTRweH1cclxuLmF1ZGllbmNlLXNlY3Rpb257cGFkZGluZy10b3A6MTZweH1cclxuLmF1ZGllbmNlLWdyaWR7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDoyNHB4fVxyXG4uYXVkaWVuY2UtY2FyZHtib3JkZXI6MXB4IHNvbGlkICNjOGQ5Y2E7Ym9yZGVyLXJhZGl1czoyMnB4O2JhY2tncm91bmQ6dmFyKC0tbWludCk7cGFkZGluZzozOHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydH1cclxuLnBlcnNvbmFsLWNhcmR7YmFja2dyb3VuZDojZjNlOWRjO2JvcmRlci1jb2xvcjojZTFkM2MzfVxyXG4uYWNjb3VudC1sYWJlbHtkaXNwbGF5OmlubGluZS1ibG9jaztmb250LXNpemU6MTBweDtmb250LXdlaWdodDo2MDA7Ym9yZGVyOjFweCBzb2xpZCAjYmRjZWJmO3BhZGRpbmc6NXB4IDEwcHg7Ym9yZGVyLXJhZGl1czo3cHg7bWFyZ2luLWJvdHRvbToyMnB4fVxyXG4ucGVyc29uYWwtbGFiZWx7Ym9yZGVyLWNvbG9yOiNkOGM2YjN9XHJcbi5hdWRpZW5jZS1jYXJkIGgze2ZvbnQtc2l6ZTozMHB4O21hcmdpbi1ib3R0b206MThweH1cclxuLmF1ZGllbmNlLWNhcmQgcCwuYXVkaWVuY2UtY2FyZCBsaXtmb250LXNpemU6MTRweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5hdWRpZW5jZS1jYXJkIHVse3BhZGRpbmctbGVmdDoyMHB4O21hcmdpbi1ibG9jazoyMHB4IDI0cHh9XHJcbi5hdWRpZW5jZS1jYXJkIGxpe3BhZGRpbmctYmxvY2s6NXB4fVxyXG4uYXVkaWVuY2UtY2FyZCAudGV4dC1saW5re21hcmdpbi10b3A6YXV0bztib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1ncmVlbil9XHJcbi5yZXNpZGVudC1ub3Rle2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjIycHg7bWFyZ2luLXRvcDoyOHB4O3BhZGRpbmc6MjZweCAwO2JvcmRlci1ibG9jazoxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5yZXNpZGVudC1ub3RlIGRpdntmbGV4OjF9XHJcbi5yZXNpZGVudC1ub3RlIGgze2ZvbnQtc2l6ZToxOHB4O21hcmdpbi1ib3R0b206NnB4fVxyXG4ucmVzaWRlbnQtbm90ZSBwe2NvbG9yOnZhcigtLW11dGVkKTtmb250LXNpemU6MTNweDttYXgtd2lkdGg6NzYwcHh9XHJcbi5yZXNpZGVudC1ub3RlIGF7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6NjAwO21pbi1oZWlnaHQ6NDRweDtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO3RleHQtdW5kZXJsaW5lLW9mZnNldDo1cHh9XHJcbi5yZXNpZGVudC1ub3RlIGE6aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uZ2V0dGluZy1zdGFydGVke2JhY2tncm91bmQ6I2YwZjJlN31cclxuLnN0ZXBzLWxheW91dHtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxLjFmcjtnYXA6OTBweH1cclxuLnN0ZXBzLWxheW91dCAuc2VjdGlvbi1pbnRyb3ttYXJnaW46MH1cclxuLnN0ZXBzLWxheW91dCAudGV4dC1saW5re21hcmdpbi10b3A6MjJweH1cclxuLnN0ZXBzLWxpc3R7bGlzdC1zdHlsZTpub25lO21hcmdpbjowO3BhZGRpbmc6MDtjb3VudGVyLXJlc2V0OnN0ZXBzfVxyXG4uc3RlcHMtbGlzdCBsaXtwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjAgMCAzMHB4IDY2cHg7Y291bnRlci1pbmNyZW1lbnQ6c3RlcHN9XHJcbi5zdGVwcy1saXN0IGxpOjpiZWZvcmV7Y29udGVudDpjb3VudGVyKHN0ZXBzKTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7YmFja2dyb3VuZDp2YXIoLS1ncmVlbik7Y29sb3I6d2hpdGU7Zm9udC1mYW1pbHk6J0xhbmRpbmcgTWFucm9wZScsc2Fucy1zZXJpZjtmb250LXdlaWdodDo2MDA7d2lkdGg6NDBweDtoZWlnaHQ6NDBweDtkaXNwbGF5OmdyaWQ7cGxhY2UtaXRlbXM6Y2VudGVyO2JvcmRlci1yYWRpdXM6NTAlfVxyXG4uc3RlcHMtbGlzdCBsaTpub3QoOmxhc3QtY2hpbGQpOjphZnRlcntjb250ZW50OicnO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MTlweDt0b3A6NDhweDtib3R0b206OHB4O3dpZHRoOjFweDtiYWNrZ3JvdW5kOiNhOWM2YTl9XHJcbi5zdGVwcy1saXN0IGxpOmxhc3QtY2hpbGR7cGFkZGluZy1ib3R0b206MH1cclxuLnN0ZXBzLWxpc3QgaDN7Zm9udC1zaXplOjIwcHg7bWFyZ2luLWJvdHRvbToxMHB4fVxyXG4uc3RlcHMtbGlzdCBwe2ZvbnQtc2l6ZToxNHB4O2NvbG9yOnZhcigtLW11dGVkKX1cclxuLmZhcS1zZWN0aW9ue2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6Ljg1ZnIgMS4xNWZyO2dhcDo5MHB4fVxyXG4uZmFxLWludHJvIHB7Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi10b3A6MjBweH1cclxuLmZhcS1saXN0IGRldGFpbHN7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSl9XHJcbi5mYXEtbGlzdCBkZXRhaWxzOmZpcnN0LWNoaWxke2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpfVxyXG4uZmFxLWxpc3Qgc3VtbWFyeXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoyNHB4O3BhZGRpbmc6MjJweCAwO2N1cnNvcjpwb2ludGVyO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6MTRweDtsaXN0LXN0eWxlOm5vbmV9XHJcbi5mYXEtbGlzdCBzdW1tYXJ5Ojotd2Via2l0LWRldGFpbHMtbWFya2Vye2Rpc3BsYXk6bm9uZX1cclxuLmZhcS1saXN0IHN1bW1hcnk6aG92ZXJ7Y29sb3I6dmFyKC0tZ3JlZW4pfVxyXG4uZmFxLXRvZ2dsZXt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtc2hyaW5rOjB9XHJcbi5mYXEtdG9nZ2xlOjpiZWZvcmUsLmZhcS10b2dnbGU6OmFmdGVye2NvbnRlbnQ6Jyc7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZDpjdXJyZW50Q29sb3I7d2lkdGg6MTRweDtoZWlnaHQ6MXB4O3RvcDo3cHg7bGVmdDoxcHh9XHJcbi5mYXEtdG9nZ2xlOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKDkwZGVnKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMThzfVxyXG5kZXRhaWxzW29wZW5dIC5mYXEtdG9nZ2xlOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKDApfVxyXG4uZmFxLWxpc3QgZGV0YWlscyBwe3BhZGRpbmc6MCAyOHB4IDIycHggMDtmb250LXNpemU6MTNweDtjb2xvcjp2YXIoLS1tdXRlZCl9XHJcbi5jbG9zaW5nLXNlY3Rpb257ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2JhY2tncm91bmQ6dmFyKC0tbWludCk7Ym9yZGVyLXJhZGl1czoyNnB4O292ZXJmbG93OmhpZGRlbn1cclxuLmNsb3NpbmctY29weXtwYWRkaW5nOjQ4cHh9XHJcbi5jbG9zaW5nLWNvcHkgc3Zne2NvbG9yOnZhcigtLWdyZWVuKTttYXJnaW4tYm90dG9tOjIycHg7d2lkdGg6NDBweDtoZWlnaHQ6NDBweH1cclxuLmNsb3NpbmctY29weSBwe2NvbG9yOnZhcigtLW11dGVkKTttYXgtd2lkdGg6MzUwcHg7bWFyZ2luLWJsb2NrOjE4cHggMjRweH1cclxuLmNsb3Npbmctc2VjdGlvbj5pbWd7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjM5MHB4O29iamVjdC1maXQ6Y292ZXJ9XHJcbi5zaXRlLWZvb3RlcntkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjIycHg7cGFkZGluZy1ibG9jazo0NHB4IDI4cHh9XHJcbi5zaXRlLWZvb3RlciBwe2ZvbnQtc2l6ZToxMnB4O2NvbG9yOnZhcigtLW11dGVkKTttYXJnaW4tdG9wOjhweH1cclxuLnNpdGUtZm9vdGVyIG5hdntkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kO2ZsZXgtd3JhcDp3cmFwO2FsaWduLWNvbnRlbnQ6Y2VudGVyO2dhcDoxMnB4IDIycHg7Zm9udC1zaXplOjEycHh9XHJcbi5zaXRlLWZvb3RlciBuYXYgYXttaW4taGVpZ2h0OjQ0cHg7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5mb290ZXItZGV0YWlse2dyaWQtY29sdW1uOjEvLTE7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tbXV0ZWQpO2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLWxpbmUpO3BhZGRpbmctdG9wOjIwcHh9XHJcbiJdLCJzb3VyY2VSb290IjoiIn0= */", "@media(max-width:1150px){\n  .container[_ngcontent-%COMP%]{width:calc(100% - 64px)}.header-inner[_ngcontent-%COMP%]{padding-inline:32px;gap:18px}#public-navigation[_ngcontent-%COMP%], .section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{gap:16px}.hero[_ngcontent-%COMP%]{gap:32px}.hero-visual[_ngcontent-%COMP%]{padding-bottom:230px}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:370px}.benefits-inner[_ngcontent-%COMP%]{gap:28px}.benefits-list[_ngcontent-%COMP%]{gap:16px}.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-start;gap:8px}.connected-layout[_ngcontent-%COMP%], .community-feature[_ngcontent-%COMP%]{gap:40px}\n}\n@media(max-width:960px){\n  .header-inner[_ngcontent-%COMP%]{padding-block:14px}.menu-toggle[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;min-height:44px;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:12px}.menu-toggle[_ngcontent-%COMP%]:hover{background:var(--mint)}.menu-lines[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:5px}.menu-lines[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:15px;height:1px;background:currentColor}\n  #public-navigation[_ngcontent-%COMP%]{display:none;position:absolute;top:100%;left:0;right:0;background:var(--canvas);padding:20px 32px 28px;border-bottom:1px solid var(--line);max-height:calc(100dvh - 74px);overflow-y:auto}#public-navigation.is-open[_ngcontent-%COMP%]{display:flex;align-items:stretch;flex-direction:column}.section-links[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column;gap:6px}.section-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%]   .sign-in[_ngcontent-%COMP%]{padding:12px 0;font-size:14px}.header-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{align-self:flex-start;margin-top:10px}\n  .hero[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:36px;padding-block:30px 48px}.hero-copy[_ngcontent-%COMP%]{max-width:640px;padding:0}h1[_ngcontent-%COMP%]{font-size:56px}.hero-visual[_ngcontent-%COMP%]{max-width:680px;width:100%;justify-self:center;padding-bottom:150px}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:420px}.product-preview[_ngcontent-%COMP%]{width:82%;left:18px}.benefits-inner[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column;gap:24px}.benefits-inner[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   br[_ngcontent-%COMP%]{display:none}.section-padding[_ngcontent-%COMP%]{padding-block:64px}.service-heading[_ngcontent-%COMP%]{gap:28px}.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:400px}.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:26px}.connected-layout[_ngcontent-%COMP%]{gap:32px}.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:410px}.scene-art[_ngcontent-%COMP%]{padding:14px;height:235px}.everyday-grid[_ngcontent-%COMP%]{gap:18px}.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{padding:14px}.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:19px}.audience-card[_ngcontent-%COMP%]{padding:28px}.audience-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:26px}.resident-note[_ngcontent-%COMP%]{flex-wrap:wrap}.steps-layout[_ngcontent-%COMP%], .faq-section[_ngcontent-%COMP%]{gap:42px}.closing-copy[_ngcontent-%COMP%]{padding:36px}\n}\n\n@media(max-width:768px){[_nghost-%COMP%]{margin:-.5rem}}\n@media(max-width:700px){\n  .container[_ngcontent-%COMP%]{width:calc(100% - 40px)}.header-inner[_ngcontent-%COMP%]{padding-inline:max(20px,env(safe-area-inset-left))}.brand[_ngcontent-%COMP%]{font-size:19px}.brand-mark[_ngcontent-%COMP%]{width:30px;height:30px}#public-navigation[_ngcontent-%COMP%]{padding-inline:20px}h1[_ngcontent-%COMP%]{font-size:clamp(39px,8.4vw,54px);margin-block:20px}.hero-kicker[_ngcontent-%COMP%]{font-size:10px;gap:7px}.hero-kicker[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:20px;height:20px}.hero-description[_ngcontent-%COMP%]{font-size:14px;line-height:1.75;margin-bottom:24px}.hero-actions[_ngcontent-%COMP%]{gap:18px}.hero-actions[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{padding-inline:20px;gap:18px}.hero-actions[_ngcontent-%COMP%]   .text-link[_ngcontent-%COMP%]{font-size:12px;gap:8px}.hero-caption[_ngcontent-%COMP%]{font-size:11px;margin-top:26px}.hero-visual[_ngcontent-%COMP%]{padding-bottom:0}.hero-photo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:320px;border-radius:60px 18px 18px 18px}.photo-caption[_ngcontent-%COMP%]{top:16px;right:14px;font-size:10px;padding:10px 12px}.product-preview[_ngcontent-%COMP%]{width:calc(100% - 16px);margin:-52px auto 0;position:relative;left:auto}.preview-top[_ngcontent-%COMP%]{padding-inline:14px}.preview-brand[_ngcontent-%COMP%]{font-size:11px;gap:5px}.illustration-label[_ngcontent-%COMP%]{font-size:9px}.preview-body[_ngcontent-%COMP%]{padding:16px 14px;min-height:265px}.preview-body[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:17px}.preview-body[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]{font-size:9px}\n  .benefits-list[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr;gap:26px 20px}.benefits-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{flex-direction:row;font-size:11px;gap:10px}.benefits-list[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:26px;height:26px}.section-padding[_ngcontent-%COMP%]{padding-block:52px}.section-intro[_ngcontent-%COMP%]{margin-bottom:30px}.section-intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}.service-heading[_ngcontent-%COMP%]{display:block}.community-feature[_ngcontent-%COMP%], .connected-layout[_ngcontent-%COMP%], .steps-layout[_ngcontent-%COMP%], .faq-section[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:32px}.community-feature[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:300px}.community-feature[_ngcontent-%COMP%]   figcaption[_ngcontent-%COMP%]{bottom:16px;left:16px;font-size:12px}.feature-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:28px}.feature-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{font-size:14px}.shared-services[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:24px;margin-top:32px}.shared-services[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]{display:grid;grid-template-columns:36px 1fr;gap:6px 16px;padding-top:22px}.shared-services[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{grid-row:1/3}.shared-services[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0}.shared-services[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{grid-column:2}\n  .connected-section[_ngcontent-%COMP%]{padding-block:48px}.connected-copy[_ngcontent-%COMP%] > p[_ngcontent-%COMP%]{font-size:14px}.connected-visual[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:320px}.device-example[_ngcontent-%COMP%]{left:12px;right:12px;padding:14px 16px}.everyday-grid[_ngcontent-%COMP%], .audience-grid[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:32px}.scene-art[_ngcontent-%COMP%]{height:250px;padding:24px}.mini-statement[_ngcontent-%COMP%], .mini-calendar[_ngcontent-%COMP%], .mini-device[_ngcontent-%COMP%]{padding:20px}.everyday-scene[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:23px;margin-top:20px}.audience-section[_ngcontent-%COMP%]{padding-top:12px}.audience-card[_ngcontent-%COMP%]{padding:28px}.resident-note[_ngcontent-%COMP%]{gap:14px;align-items:flex-start}.resident-note[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-basis:calc(100% - 46px)}.resident-note[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:46px}.steps-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding-left:56px}.closing-section[_ngcontent-%COMP%]{grid-template-columns:1fr}.closing-copy[_ngcontent-%COMP%]{padding:32px}.closing-section[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{height:230px;min-height:0}.site-footer[_ngcontent-%COMP%]{grid-template-columns:1fr;padding-top:36px}.site-footer[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{justify-content:flex-start;gap:4px 22px}.footer-detail[_ngcontent-%COMP%]{padding-bottom:env(safe-area-inset-bottom)}\n}\n@media(prefers-reduced-motion:reduce){.saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::before, .saas-page[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}.button[_ngcontent-%COMP%]:hover, .button[_ngcontent-%COMP%]:active{transform:none}}\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGVtby9jb21wb25lbnRzL3NhYXMtbGFuZGluZy9zYWFzLWxhbmRpbmctcmVzcG9uc2l2ZS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFXLHVCQUF1QixDQUFDLGNBQWMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLGtEQUFrRCxRQUFRLENBQUMsTUFBTSxRQUFRLENBQUMsYUFBYSxvQkFBb0IsQ0FBQyxnQkFBZ0IsWUFBWSxDQUFDLGdCQUFnQixRQUFRLENBQUMsZUFBZSxRQUFRLENBQUMsa0JBQWtCLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsUUFBUTtBQUM5WDtBQUNBO0VBQ0UsY0FBYyxrQkFBa0IsQ0FBQyxhQUFhLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsc0JBQXNCLENBQUMsWUFBWSxZQUFZLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixVQUFVLENBQUMsVUFBVSxDQUFDLHVCQUF1QjtFQUM5WCxtQkFBbUIsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLG1DQUFtQyxDQUFDLDhCQUE4QixDQUFDLGVBQWUsQ0FBQywyQkFBMkIsWUFBWSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLCtCQUErQixtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsMENBQTBDLGNBQWMsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLHFCQUFxQixDQUFDLGVBQWU7RUFDcmYsTUFBTSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsV0FBVyxlQUFlLENBQUMsU0FBUyxDQUFDLEdB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QUMsY0FBYyxZQUFZLENBQUMscUJBQXFCLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSx5QkFBeUIsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsMEJBQTBCLENBQUMsWUFBWSxDQUFDLGVBQWUsMENBQTBDO0FBQ3AzQjtBQUNBLHNDQUFzQyxzREFBc0QseUJBQXlCLENBQUMsd0JBQXdCLENBQUMsOEJBQThCLENBQUMsNkJBQTZCLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIkBtZWRpYShtYXgtd2lkdGg6MTE1MHB4KXtcclxuICAuY29udGFpbmVye3dpZHRoOmNhbGMoMTAwJSAtIDY0cHgpfS5oZWFkZXItaW5uZXJ7cGFkZGluZy1pbmxpbmU6MzJweDtnYXA6MThweH0jcHVibGljLW5hdmlnYXRpb24sLnNlY3Rpb24tbGlua3MsLmhlYWRlci1hY3Rpb25ze2dhcDoxNnB4fS5oZXJve2dhcDozMnB4fS5oZXJvLXZpc3VhbHtwYWRkaW5nLWJvdHRvbToyMzBweH0uaGVyby1waG90byBpbWd7aGVpZ2h0OjM3MHB4fS5iZW5lZml0cy1pbm5lcntnYXA6MjhweH0uYmVuZWZpdHMtbGlzdHtnYXA6MTZweH0uYmVuZWZpdHMtbGlzdCBsaXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtnYXA6OHB4fS5jb25uZWN0ZWQtbGF5b3V0LC5jb21tdW5pdHktZmVhdHVyZXtnYXA6NDBweH1cclxufVxyXG5AbWVkaWEobWF4LXdpZHRoOjk2MHB4KXtcclxuICAuaGVhZGVyLWlubmVye3BhZGRpbmctYmxvY2s6MTRweH0ubWVudS10b2dnbGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDttaW4taGVpZ2h0OjQ0cHg7YmFja2dyb3VuZDp0cmFuc3BhcmVudDtjb2xvcjp2YXIoLS1pbmspO2JvcmRlcjoxcHggc29saWQgdmFyKC0tbGluZSk7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEycHh9Lm1lbnUtdG9nZ2xlOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tbWludCl9Lm1lbnUtbGluZXN7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NXB4fS5tZW51LWxpbmVzIHNwYW57d2lkdGg6MTVweDtoZWlnaHQ6MXB4O2JhY2tncm91bmQ6Y3VycmVudENvbG9yfVxyXG4gICNwdWJsaWMtbmF2aWdhdGlvbntkaXNwbGF5Om5vbmU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjEwMCU7bGVmdDowO3JpZ2h0OjA7YmFja2dyb3VuZDp2YXIoLS1jYW52YXMpO3BhZGRpbmc6MjBweCAzMnB4IDI4cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tbGluZSk7bWF4LWhlaWdodDpjYWxjKDEwMGR2aCAtIDc0cHgpO292ZXJmbG93LXk6YXV0b30jcHVibGljLW5hdmlnYXRpb24uaXMtb3BlbntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6c3RyZXRjaDtmbGV4LWRpcmVjdGlvbjpjb2x1bW59LnNlY3Rpb24tbGlua3MsLmhlYWRlci1hY3Rpb25ze2FsaWduLWl0ZW1zOnN0cmV0Y2g7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHh9LnNlY3Rpb24tbGlua3MgYSwuaGVhZGVyLWFjdGlvbnMgLnNpZ24taW57cGFkZGluZzoxMnB4IDA7Zm9udC1zaXplOjE0cHh9LmhlYWRlci1hY3Rpb25zIC5idXR0b257YWxpZ24tc2VsZjpmbGV4LXN0YXJ0O21hcmdpbi10b3A6MTBweH1cclxuICAuaGVyb3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDozNnB4O3BhZGRpbmctYmxvY2s6MzBweCA0OHB4fS5oZXJvLWNvcHl7bWF4LXdpZHRoOjY0MHB4O3BhZGRpbmc6MH1oMXtmb250LXNpemU6NTZweH0uaGVyby12aXN1YWx7bWF4LXdpZHRoOjY4MHB4O3dpZHRoOjEwMCU7anVzdGlmeS1zZWxmOmNlbnRlcjtwYWRkaW5nLWJvdHRvbToxNTBweH0uaGVyby1waG90byBpbWd7aGVpZ2h0OjQyMHB4fS5wcm9kdWN0LXByZXZpZXd7d2lkdGg6ODIlO2xlZnQ6MThweH0uYmVuZWZpdHMtaW5uZXJ7YWxpZ24taXRlbXM6ZmxleC1zdGFydDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjI0cHh9LmJlbmVmaXRzLWlubmVyIGgyIGJye2Rpc3BsYXk6bm9uZX0uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6NjRweH0uc2VydmljZS1oZWFkaW5ne2dhcDoyOHB4fS5jb21tdW5pdHktZmVhdHVyZSBpbWd7aGVpZ2h0OjQwMHB4fS5mZWF0dXJlLWNvcHkgaDN7Zm9udC1zaXplOjI2cHh9LmNvbm5lY3RlZC1sYXlvdXR7Z2FwOjMycHh9LmNvbm5lY3RlZC12aXN1YWwgaW1ne2hlaWdodDo0MTBweH0uc2NlbmUtYXJ0e3BhZGRpbmc6MTRweDtoZWlnaHQ6MjM1cHh9LmV2ZXJ5ZGF5LWdyaWR7Z2FwOjE4cHh9Lm1pbmktc3RhdGVtZW50LC5taW5pLWNhbGVuZGFyLC5taW5pLWRldmljZXtwYWRkaW5nOjE0cHh9LmV2ZXJ5ZGF5LXNjZW5lIGgze2ZvbnQtc2l6ZToxOXB4fS5hdWRpZW5jZS1jYXJke3BhZGRpbmc6MjhweH0uYXVkaWVuY2UtY2FyZCBoM3tmb250LXNpemU6MjZweH0ucmVzaWRlbnQtbm90ZXtmbGV4LXdyYXA6d3JhcH0uc3RlcHMtbGF5b3V0LC5mYXEtc2VjdGlvbntnYXA6NDJweH0uY2xvc2luZy1jb3B5e3BhZGRpbmc6MzZweH1cclxufVxyXG4vKiBDb21wZW5zYSBlbCBwYWRkaW5nIG3Dg8KzdmlsIGdsb2JhbCBzb2xvIGRlbnRybyBkZSBsYSBydXRhIHDDg8K6YmxpY2EuICovXHJcbkBtZWRpYShtYXgtd2lkdGg6NzY4cHgpezpob3N0e21hcmdpbjotLjVyZW19fVxyXG5AbWVkaWEobWF4LXdpZHRoOjcwMHB4KXtcclxuICAuY29udGFpbmVye3dpZHRoOmNhbGMoMTAwJSAtIDQwcHgpfS5oZWFkZXItaW5uZXJ7cGFkZGluZy1pbmxpbmU6bWF4KDIwcHgsZW52KHNhZmUtYXJlYS1pbnNldC1sZWZ0KSl9LmJyYW5ke2ZvbnQtc2l6ZToxOXB4fS5icmFuZC1tYXJre3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHh9I3B1YmxpYy1uYXZpZ2F0aW9ue3BhZGRpbmctaW5saW5lOjIwcHh9aDF7Zm9udC1zaXplOmNsYW1wKDM5cHgsOC40dncsNTRweCk7bWFyZ2luLWJsb2NrOjIwcHh9Lmhlcm8ta2lja2Vye2ZvbnQtc2l6ZToxMHB4O2dhcDo3cHh9Lmhlcm8ta2lja2VyIHN2Z3t3aWR0aDoyMHB4O2hlaWdodDoyMHB4fS5oZXJvLWRlc2NyaXB0aW9ue2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNzU7bWFyZ2luLWJvdHRvbToyNHB4fS5oZXJvLWFjdGlvbnN7Z2FwOjE4cHh9Lmhlcm8tYWN0aW9ucyAuYnV0dG9ue3BhZGRpbmctaW5saW5lOjIwcHg7Z2FwOjE4cHh9Lmhlcm8tYWN0aW9ucyAudGV4dC1saW5re2ZvbnQtc2l6ZToxMnB4O2dhcDo4cHh9Lmhlcm8tY2FwdGlvbntmb250LXNpemU6MTFweDttYXJnaW4tdG9wOjI2cHh9Lmhlcm8tdmlzdWFse3BhZGRpbmctYm90dG9tOjB9Lmhlcm8tcGhvdG8gaW1ne2hlaWdodDozMjBweDtib3JkZXItcmFkaXVzOjYwcHggMThweCAxOHB4IDE4cHh9LnBob3RvLWNhcHRpb257dG9wOjE2cHg7cmlnaHQ6MTRweDtmb250LXNpemU6MTBweDtwYWRkaW5nOjEwcHggMTJweH0ucHJvZHVjdC1wcmV2aWV3e3dpZHRoOmNhbGMoMTAwJSAtIDE2cHgpO21hcmdpbjotNTJweCBhdXRvIDA7cG9zaXRpb246cmVsYXRpdmU7bGVmdDphdXRvfS5wcmV2aWV3LXRvcHtwYWRkaW5nLWlubGluZToxNHB4fS5wcmV2aWV3LWJyYW5ke2ZvbnQtc2l6ZToxMXB4O2dhcDo1cHh9LmlsbHVzdHJhdGlvbi1sYWJlbHtmb250LXNpemU6OXB4fS5wcmV2aWV3LWJvZHl7cGFkZGluZzoxNnB4IDE0cHg7bWluLWhlaWdodDoyNjVweH0ucHJldmlldy1ib2R5IGgye2ZvbnQtc2l6ZToxN3B4fS5wcmV2aWV3LWJvZHkgdGFibGV7Zm9udC1zaXplOjlweH1cclxuICAuYmVuZWZpdHMtbGlzdHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6MjZweCAyMHB4fS5iZW5lZml0cy1saXN0IGxpe2ZsZXgtZGlyZWN0aW9uOnJvdztmb250LXNpemU6MTFweDtnYXA6MTBweH0uYmVuZWZpdHMtbGlzdCBzdmd7d2lkdGg6MjZweDtoZWlnaHQ6MjZweH0uc2VjdGlvbi1wYWRkaW5ne3BhZGRpbmctYmxvY2s6NTJweH0uc2VjdGlvbi1pbnRyb3ttYXJnaW4tYm90dG9tOjMwcHh9LnNlY3Rpb24taW50cm8gcHtmb250LXNpemU6MTRweH0uc2VydmljZS1oZWFkaW5ne2Rpc3BsYXk6YmxvY2t9LmNvbW11bml0eS1mZWF0dXJlLC5jb25uZWN0ZWQtbGF5b3V0LC5zdGVwcy1sYXlvdXQsLmZhcS1zZWN0aW9ue2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjMycHh9LmNvbW11bml0eS1mZWF0dXJlIGltZ3toZWlnaHQ6MzAwcHh9LmNvbW11bml0eS1mZWF0dXJlIGZpZ2NhcHRpb257Ym90dG9tOjE2cHg7bGVmdDoxNnB4O2ZvbnQtc2l6ZToxMnB4fS5mZWF0dXJlLWNvcHkgaDN7Zm9udC1zaXplOjI4cHh9LmZlYXR1cmUtY29weT5we2ZvbnQtc2l6ZToxNHB4fS5zaGFyZWQtc2VydmljZXN7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcjtnYXA6MjRweDttYXJnaW4tdG9wOjMycHh9LnNoYXJlZC1zZXJ2aWNlcyBhcnRpY2xle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MzZweCAxZnI7Z2FwOjZweCAxNnB4O3BhZGRpbmctdG9wOjIycHh9LnNoYXJlZC1zZXJ2aWNlcyBzdmd7Z3JpZC1yb3c6MS8zfS5zaGFyZWQtc2VydmljZXMgaDN7bWFyZ2luOjB9LnNoYXJlZC1zZXJ2aWNlcyBwe2dyaWQtY29sdW1uOjJ9XHJcbiAgLmNvbm5lY3RlZC1zZWN0aW9ue3BhZGRpbmctYmxvY2s6NDhweH0uY29ubmVjdGVkLWNvcHk+cHtmb250LXNpemU6MTRweH0uY29ubmVjdGVkLXZpc3VhbCBpbWd7aGVpZ2h0OjMyMHB4fS5kZXZpY2UtZXhhbXBsZXtsZWZ0OjEycHg7cmlnaHQ6MTJweDtwYWRkaW5nOjE0cHggMTZweH0uZXZlcnlkYXktZ3JpZCwuYXVkaWVuY2UtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDozMnB4fS5zY2VuZS1hcnR7aGVpZ2h0OjI1MHB4O3BhZGRpbmc6MjRweH0ubWluaS1zdGF0ZW1lbnQsLm1pbmktY2FsZW5kYXIsLm1pbmktZGV2aWNle3BhZGRpbmc6MjBweH0uZXZlcnlkYXktc2NlbmUgaDN7Zm9udC1zaXplOjIzcHg7bWFyZ2luLXRvcDoyMHB4fS5hdWRpZW5jZS1zZWN0aW9ue3BhZGRpbmctdG9wOjEycHh9LmF1ZGllbmNlLWNhcmR7cGFkZGluZzoyOHB4fS5yZXNpZGVudC1ub3Rle2dhcDoxNHB4O2FsaWduLWl0ZW1zOmZsZXgtc3RhcnR9LnJlc2lkZW50LW5vdGUgZGl2e2ZsZXgtYmFzaXM6Y2FsYygxMDAlIC0gNDZweCl9LnJlc2lkZW50LW5vdGUgYXttYXJnaW4tbGVmdDo0NnB4fS5zdGVwcy1saXN0IGxpe3BhZGRpbmctbGVmdDo1NnB4fS5jbG9zaW5nLXNlY3Rpb257Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn0uY2xvc2luZy1jb3B5e3BhZGRpbmc6MzJweH0uY2xvc2luZy1zZWN0aW9uPmltZ3toZWlnaHQ6MjMwcHg7bWluLWhlaWdodDowfS5zaXRlLWZvb3RlcntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO3BhZGRpbmctdG9wOjM2cHh9LnNpdGUtZm9vdGVyIG5hdntqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDtnYXA6NHB4IDIycHh9LmZvb3Rlci1kZXRhaWx7cGFkZGluZy1ib3R0b206ZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pfVxyXG59XHJcbkBtZWRpYShwcmVmZXJzLXJlZHVjZWQtbW90aW9uOnJlZHVjZSl7LnNhYXMtcGFnZSAqLC5zYWFzLXBhZ2UgKjo6YmVmb3JlLC5zYWFzLXBhZ2UgKjo6YWZ0ZXJ7dHJhbnNpdGlvbjpub25lIWltcG9ydGFudDthbmltYXRpb246bm9uZSFpbXBvcnRhbnQ7c2Nyb2xsLWJlaGF2aW9yOmF1dG8haW1wb3J0YW50fS5idXR0b246aG92ZXIsLmJ1dHRvbjphY3RpdmV7dHJhbnNmb3JtOm5vbmV9fVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"],
      changeDetection: 0
    });
  }
}

/***/ }

}]);
//# sourceMappingURL=src_app_demo_components_saas-landing_saas-landing_component_ts.js.map