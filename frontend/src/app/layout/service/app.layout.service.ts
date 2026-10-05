import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: 'light' | 'dark';
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    private readonly document = inject(DOCUMENT);
    private readonly themeChangingState = signal(false);
    private readonly themeErrorState = signal('');

    get themeChanging(): boolean { return this.themeChangingState(); }
    set themeChanging(value: boolean) { this.themeChangingState.set(value); }
    get themeError(): string { return this.themeErrorState(); }
    set themeError(value: string) { this.themeErrorState.set(value); }

    private readonly configState = signal<AppConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-blue',
        scale: 14,
    });

    get config(): AppConfig { return this.configState(); }

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor() {
        // theme-init.js restores the preference before the first page is painted.
        if (this.document.documentElement.classList.contains('app-dark')) {
            this.config.colorScheme = 'dark';
            this.config.theme = 'lara-dark-blue';
        }
    }

    toggleDarkMode(): void {
        const colorScheme = this.config.colorScheme === 'dark' ? 'light' : 'dark';
        const counterpart = this.config.theme.replace(/-(light|dark)-/, `-${colorScheme}-`);
        const hasCounterpart = /^(lara|bootstrap4|md|mdc)-(light|dark)-/.test(counterpart);
        this.changeTheme(hasCounterpart ? counterpart : `lara-${colorScheme}-blue`, colorScheme);
    }

    changeTheme(theme: string, colorScheme: AppConfig['colorScheme']): void {
        if (this.themeChanging) return;
        const current = this.document.getElementById('theme-css') as HTMLLinkElement | null;
        if (!current) return;
        this.themeChanging = true;
        this.themeError = '';
        const next = current.cloneNode(true) as HTMLLinkElement;
        next.id = 'theme-css-pending';
        next.href = `assets/layout/styles/theme/${theme}/theme.css`;
        next.addEventListener('load', () => {
            current.replaceWith(next);
            next.id = 'theme-css';
            this.config.theme = theme;
            this.config.colorScheme = colorScheme;
            this.themeChanging = false;
            this.onConfigUpdate();
            try {
                this.document.defaultView?.localStorage.setItem('condapp-color-scheme', colorScheme);
            } catch {
                // Theme switching also works when browser storage is unavailable.
            }
        }, { once: true });
        next.addEventListener('error', () => {
            next.remove();
            this.themeChanging = false;
            this.themeError = 'No se pudo cargar el tema. Intenta de nuevo.';
        }, { once: true });
        current.after(next);
    }

    onMenuToggle() {
        this.state.profileSidebarVisible = false;

        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        }
        else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.state.overlayMenuActive = false;
            this.state.staticMenuMobileActive = false;
            this.state.menuHoverActive = false;
            document.body.classList.remove('blocked-scroll');
        }
    }

    hideProfileSidebar() {
        this.state.profileSidebarVisible = false;
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    isMenuExpanded(): boolean {
        return this.isDesktop()
            ? !this.state.staticMenuDesktopInactive
            : this.state.staticMenuMobileActive;
    }

    onConfigUpdate() {
        // Native stylesheet load events must also notify zoneless Angular views.
        this.configState.set({ ...this.config });
        this.document.documentElement.classList.toggle(
            'app-dark',
            this.config.colorScheme === 'dark'
        );
        this.configUpdate.next(this.config);
    }

}
