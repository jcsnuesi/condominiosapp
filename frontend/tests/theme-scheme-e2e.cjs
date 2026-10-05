// Build first, from frontend:
// node node_modules/@angular/cli/bin/ng.js build --configuration development --output-path dist/theme-scheme-check
// Then run from the repository root: node frontend/tests/theme-scheme-e2e.cjs
// Uses a local build and mocked APIs; no backend credentials or writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

function loadPlaywright() {
    if (process.env.PLAYWRIGHT_MODULE) return require(process.env.PLAYWRIGHT_MODULE);
    try { return require('playwright'); } catch (error) {
        if (error.code !== 'MODULE_NOT_FOUND') throw error;
        const cache = path.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx');
        const installed = fs.readdirSync(cache).map(dir => path.join(cache, dir, 'node_modules', 'playwright'))
            .find(dir => fs.existsSync(path.join(dir, 'package.json')));
        if (!installed) throw error;
        return require(installed);
    }
}

const { chromium } = loadPlaywright();
const root = path.resolve(process.env.THEME_TEST_BUILD || 'frontend/dist/theme-scheme-check');
const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    let file = path.resolve(root, '.' + decodeURIComponent(pathname));
    if (!file.startsWith(root + path.sep) && file !== root) {
        response.writeHead(403).end();
        return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
    const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml' };
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(fs.readFileSync(file));
});

let applicationScheme = 'light';

function luminance(color) {
    const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
        const channel = value / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

async function snapshot(page, selectors) {
    const result = {};
    for (const selector of selectors) {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible' });
        // Read the current node atomically; an API response can replace a table row.
        const styleResult = await page.waitForFunction(selector => {
            const node = document.querySelector(selector);
            if (!node) return false;
            const dialog = node.closest('.p-dialog');
            if (dialog && getComputedStyle(dialog).opacity !== '1') return false;
            const style = getComputedStyle(node);
            if (!style.backgroundColor || !style.color) return false;
            let backgroundNode = node;
            let background = style.backgroundColor;
            while (backgroundNode.parentElement && (background === 'rgba(0, 0, 0, 0)' || background === 'transparent')) {
                backgroundNode = backgroundNode.parentElement;
                background = getComputedStyle(backgroundNode).backgroundColor;
            }
            return { background, color: style.color, scheme: style.colorScheme };
        }, selector);
        result[selector] = await styleResult.jsonValue();
        await styleResult.dispose();
        if (applicationScheme === 'dark') {
            const colors = result[selector];
            const background = luminance(colors.background);
            const foreground = luminance(colors.color);
            const contrast = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
            assert.ok(contrast >= 4.5, `${selector}: dark text contrast ${contrast.toFixed(2)} is below 4.5 (${colors.color} on ${colors.background})`);
            // Filled action buttons may use a bright accent with dark, readable text.
            if (!selector.includes('primary-action') && !selector.includes('.p-button')) assert.ok(background < .2, `${selector}: unexpected light surface in dark mode`);
        }
    }
    assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).colorScheme), applicationScheme);
    return result;
}

async function main() {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        const results = {};
        for (const colorScheme of ['light', 'dark']) {
          for (applicationScheme of ['light', 'dark']) {
            const key = `${colorScheme}-${applicationScheme}`;
            const context = await browser.newContext({ colorScheme, viewport: { width: 1440, height: 1000 } });
            const identity = { _id: 'theme-admin', role: 'ADMIN', name: 'Theme', lastname: 'Admin', first_password_changed: true };
            const access = { isOwnerAdmin: true, permissions: ['users.read', 'staff.read', 'bookings.read', 'condominiums.read', 'condominiums.create', 'finance.read', 'documents.read', 'str.read', 'iot.read'], scope: { mode: 'ALL', condominiumIds: [] } };
            const user = { _id: 'theme-staff', subjectModel: 'Staff', name: 'Test', lastname: 'Staff', email: 'theme@example.test', position: 'Staff', status: 'active', accessGrant: null };
            const booking = { _id: 'theme-booking', condoId: { _id: 'theme-condo', alias: 'Test condo' }, apartmentUnit: '1', areaToReserve: 'Park', bookingName: 'Test staff', checkIn: '2026-10-05T12:00:00Z', checkOut: '2026-10-05T13:00:00Z', status: 'Reserved' };
            const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
            await context.addCookies(Object.entries({ identity, access_context: access, token }).map(([name, value]) => ({ name, value: typeof value === 'string' ? value : JSON.stringify(value), url: origin })));
            const page = await context.newPage();
            page.setDefaultTimeout(10000);
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.route('**/*', route => {
                const url = new URL(route.request().url());
                if (url.origin === origin && !url.pathname.startsWith('/api')) return route.continue();
                let message = [];
                if (url.pathname.endsWith('/auth/me')) return route.fulfill({ json: { success: true, data: { user: identity, access } } });
                if (url.pathname.endsWith('/finance/options')) return route.fulfill({ json: { success: true, data: { docs: [] } } });
                if (url.pathname.endsWith('/iot/my/contexts')) return route.fulfill({ json: { success: true, data: { contexts: [] } } });
                if (url.pathname.endsWith('/organization/onboarding')) return route.fulfill({ json: { success: true, data: { message: { name: 'Test organization', condominiumCount: 0, unitCount: 0, ownerCount: 0, firstCondominiumId: null, completed: false } } } });
                if (url.pathname.endsWith('/organization-users')) message = [user];
                if (url.pathname.endsWith('/access/catalog')) message = { modules: {}, permissions: [] };
                if (url.pathname.includes('/get-bookings/')) message = [booking];
                return route.fulfill({ json: { status: 'success', message } });
            });
            results[key] = {};
            await page.goto(origin + '/#/usermanagement');
            if (applicationScheme === 'dark') {
                await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
                await page.getByRole('button', { name: 'Activar modo claro' }).waitFor();
                assert.equal(await page.getByRole('button', { name: 'Activar modo claro' }).getAttribute('aria-pressed'), 'true');
                await page.reload();
                await page.getByRole('button', { name: 'Activar modo claro' }).waitFor();
            }
            results[key].users = await snapshot(page, ['.user-hero', '.user-hero h1', '.user-panel', '.create-user-search input', '.create-user-name', '.create-user-table .p-datatable-tbody > tr', '.create-user-table .p-datatable-tbody td:nth-child(3)', '.p-paginator', '.p-tablist-tab-list', '.p-tabpanels', '.primary-action']);
            if (process.env.THEME_SCREENSHOTS && key === 'dark-dark') {
                fs.mkdirSync('frontend/.tmp/dark-mode-evidence', { recursive: true });
                await page.screenshot({ path: 'frontend/.tmp/dark-mode-evidence/users.png', fullPage: true, animations: 'disabled' });
            }
            await page.locator('.primary-action').hover();
            results[key].hover = await snapshot(page, ['.primary-action']);
            await page.getByRole('button', { name: 'Actions for Test Staff' }).click();
            results[key].menu = await snapshot(page, ['.create-user-row-menu', '.create-user-row-menu .p-menu-item-content']);
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: 'Create user', exact: true }).click();
            const dialog = page.getByRole('dialog', { name: 'Create User', exact: true });
            await dialog.waitFor();
            results[key].dialog = await snapshot(page, ['.create-user-dialog', '.create-user-dialog label', '.create-user-dialog .p-inputtext', '.create-user-dialog .p-select']);
            await dialog.locator('.p-select').first().click();
            results[key].select = await snapshot(page, ['.p-select-overlay', '.p-select-option']);
            await page.reload();
            await page.locator('.avatar-button').click();
            await page.getByRole('button', { name: /Mi perfil/ }).click();
            results[key].profile = await snapshot(page, ['.profile-shell', '.profile-section', '.profile-field input', '.profile-section-actions .p-button']);
            await page.locator('.authenticated-profile-dialog .p-dialog-close-button').click();
            await page.locator('.authenticated-profile-dialog').waitFor({ state: 'hidden' });
            await page.goto(origin + '/#/staff/theme-admin');
            results[key].staff = await snapshot(page, ['app-staff .p-datatable-tbody > tr', 'app-staff .p-paginator', 'app-staff input.p-inputtext']);
            await page.goto(origin + '/#/bookings/theme-admin');
            results[key].bookings = await snapshot(page, ['.booking-history-card', '.booking-history-table .p-datatable-tbody > tr', '.booking-history-table .p-datatable-tbody td:nth-child(2)', '.booking-history-table .p-datatable-tbody td:nth-child(6)', '.booking-history-table .p-paginator', 'input[placeholder="Search bookings..."]']);
            await page.getByRole('button', { name: 'View booking settings' }).click();
            results[key].settings = await snapshot(page, ['.booking-settings-dialog', '.booking-settings-dialog label', '.booking-settings-dialog .p-select', '.booking-settings-dialog .p-datepicker input', '.booking-settings-dialog textarea']);
            if (process.env.THEME_SCREENSHOTS && key === 'dark-dark') await page.screenshot({ path: 'frontend/.tmp/dark-mode-evidence/booking-settings.png', fullPage: true, animations: 'disabled' });
            await page.reload();
            await page.getByRole('button', { name: 'Calendar', exact: true }).click();
            results[key].calendar = await snapshot(page, ['.booking-calendar .fc-toolbar-title', '.booking-calendar .fc-col-header-cell', '.booking-calendar .fc-today-button']);
            for (const [route, selectors] of [
                ['see-property', ['.properties-page', '.properties-page h2']],
                ['create-property', ['.create-property-page', '.create-property-page input.p-inputtext']],
                ['docs/theme-condo', ['.docs-hero', '.docs-hero h1', '.docs-panel']],
                ['finance', ['.finance', '.finance h1', '.finance select']],
                ['payment-monitor', ['.monitor-hero', '.monitor-hero h1', '.monitor-panel']],
                ['str-integration', ['.str-hero', '.str-hero h1', '.str-panel']],
                ['onboarding', ['.onboarding', '.onboarding h1']],
                ['smart-home', ['.smart-home', '.smart-home h1']],
            ]) {
                await page.goto(origin + '/#/' + route);
                results[key][route] = await snapshot(page, selectors);
                if (process.env.THEME_SCREENSHOTS && key === 'dark-dark' && route === 'finance') await page.screenshot({ path: 'frontend/.tmp/dark-mode-evidence/finance.png', fullPage: true, animations: 'disabled' });
            }
            await page.goto(origin + '/#/usermanagement');
            await page.locator('.layout-config-button').click();
            await page.getByAltText('Lara Dark Blue', { exact: true }).click();
            await page.waitForFunction(() => document.documentElement.classList.contains('app-dark'));
            assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).colorScheme), 'dark');
            await page.getByAltText('Lara Light Blue', { exact: true }).click();
            await page.waitForFunction(() => !document.documentElement.classList.contains('app-dark'));
            assert.equal(await page.locator('#theme-css').getAttribute('href'), 'assets/layout/styles/theme/lara-light-blue/theme.css');
            await page.locator('.layout-config-sidebar .p-drawer-close-button').click();
            await page.setViewportSize({ width: 390, height: 844 });
            await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
            await page.getByRole('button', { name: 'Activar modo claro' }).waitFor();
            await page.getByRole('button', { name: 'Activar modo claro' }).click();
            await page.getByRole('button', { name: 'Activar modo oscuro' }).waitFor();
            console.log(`PASS: OS ${colorScheme}, app ${applicationScheme}: component colors, contrast, persistence, desktop/mobile toggle.`);
            assert.deepEqual(errors, [], 'Unexpected browser errors');
            await context.close();
          }
        }
        assert.deepEqual(results['dark-light'], results['light-light'], 'OS preference changed the light component colors');
        assert.deepEqual(results['dark-dark'], results['light-dark'], 'OS preference changed the dark component colors');
        assert.notDeepEqual(results['light-dark'], results['light-light'], 'The dark button did not change the component palette');
        console.log('PASS: both themes ignore OS preference; checked contrast on users, staff, bookings/calendar, profile, properties, documents, finance, payments, STR, onboarding and smart home.');
    } finally {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}

main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
