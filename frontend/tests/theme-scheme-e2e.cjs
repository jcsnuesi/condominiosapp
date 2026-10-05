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

async function snapshot(page, selectors) {
    const result = {};
    for (const selector of selectors) {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'visible' });
        // Read the current node atomically; an API response can replace a table row.
        const styleResult = await page.waitForFunction(selector => {
            const node = document.querySelector(selector);
            if (!node) return false;
            const style = getComputedStyle(node);
            if (!style.backgroundColor || !style.color) return false;
            return { background: style.backgroundColor, color: style.color, scheme: style.colorScheme };
        }, selector);
        result[selector] = await styleResult.jsonValue();
        await styleResult.dispose();
    }
    assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).colorScheme), 'light');
    return result;
}

async function main() {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        const results = {};
        for (const colorScheme of ['light', 'dark']) {
            const context = await browser.newContext({ colorScheme, viewport: { width: 1440, height: 1000 } });
            const identity = { _id: 'theme-admin', role: 'ADMIN', name: 'Theme', lastname: 'Admin', first_password_changed: true };
            const access = { isOwnerAdmin: true, permissions: ['users.read', 'staff.read', 'bookings.read', 'condominiums.read'], scope: { mode: 'ALL', condominiumIds: [] } };
            const user = { _id: 'theme-staff', subjectModel: 'Staff', name: 'Test', lastname: 'Staff', email: 'theme@example.test', position: 'Staff', status: 'active', accessGrant: null };
            const booking = { _id: 'theme-booking', condoId: { _id: 'theme-condo', alias: 'Test condo' }, apartmentUnit: '1', areaToReserve: 'Park', bookingName: 'Test staff', checkIn: '2026-10-05T12:00:00Z', checkOut: '2026-10-05T13:00:00Z', status: 'Reserved' };
            const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
            await context.addCookies(Object.entries({ identity, access_context: access, token }).map(([name, value]) => ({ name, value: typeof value === 'string' ? value : JSON.stringify(value), url: origin })));
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.route('**/*', route => {
                const url = new URL(route.request().url());
                if (url.origin === origin && !url.pathname.startsWith('/api')) return route.continue();
                let message = [];
                if (url.pathname.endsWith('/auth/me')) return route.fulfill({ json: { success: true, data: { user: identity, access } } });
                if (url.pathname.endsWith('/organization-users')) message = [user];
                if (url.pathname.endsWith('/access/catalog')) message = { modules: {}, permissions: [] };
                if (url.pathname.includes('/get-bookings/')) message = [booking];
                return route.fulfill({ json: { status: 'success', message } });
            });
            results[colorScheme] = {};
            await page.goto(origin + '/#/usermanagement');
            results[colorScheme].users = await snapshot(page, ['.create-user-search input', '.create-user-table .p-datatable-tbody > tr', '.p-paginator', '.p-tablist-tab-list', '.p-tabpanels']);
            await page.getByRole('button', { name: 'Actions for Test Staff' }).click();
            results[colorScheme].menu = await snapshot(page, ['.create-user-row-menu', '.create-user-row-menu .p-menu-item-content']);
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: 'Create user', exact: true }).click();
            const dialog = page.getByRole('dialog', { name: 'Create User', exact: true });
            await dialog.waitFor();
            results[colorScheme].dialog = await snapshot(page, ['.create-user-dialog', '.create-user-dialog .p-inputtext', '.create-user-dialog .p-select']);
            await dialog.locator('.p-select').first().click();
            results[colorScheme].select = await snapshot(page, ['.p-select-overlay', '.p-select-option']);
            await page.goto(origin + '/#/staff/theme-admin');
            results[colorScheme].staff = await snapshot(page, ['app-staff .p-datatable-tbody > tr', 'app-staff .p-paginator', 'app-staff input.p-inputtext']);
            await page.goto(origin + '/#/bookings/theme-admin');
            results[colorScheme].bookings = await snapshot(page, ['.booking-history-table .p-datatable-tbody > tr', '.booking-history-table .p-paginator', 'input[placeholder="Search bookings..."]']);
            await page.getByRole('button', { name: 'View booking settings' }).click();
            results[colorScheme].settings = await snapshot(page, ['.booking-settings-dialog', '.booking-settings-dialog .p-select', '.booking-settings-dialog .p-datepicker input', '.booking-settings-dialog textarea']);
            await page.goto(origin + '/#/usermanagement');
            await page.locator('.layout-config-button').click();
            await page.getByAltText('Lara Dark Blue', { exact: true }).click();
            await page.waitForFunction(() => document.documentElement.classList.contains('app-dark'));
            assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).colorScheme), 'dark');
            await page.getByAltText('Lara Light Blue', { exact: true }).click();
            await page.waitForFunction(() => !document.documentElement.classList.contains('app-dark'));
            assert.equal(await page.locator('#theme-css').getAttribute('href'), 'assets/layout/styles/theme/lara-light-blue/theme.css');
            assert.deepEqual(errors, [], 'Unexpected browser errors');
            await context.close();
        }
        assert.deepEqual(results.dark, results.light, 'OS dark preference changed the application component colors');
        console.log('PASS: identical light/dark OS colors for users, staff, bookings, tabs, menu, dialog, select overlay and date/textarea fields; explicit theme switches work.');
    } finally {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}

main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
