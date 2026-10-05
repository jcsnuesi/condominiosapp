const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const file = path.resolve('tmp/aside-preview.cjs');
let source = fs.readFileSync(file, 'utf8').replace("'aside-build'", "'topbar-review'").replace("name: 'Mantenimientos'", "name: 'Maintenance'");
const check = `
    const theme = page.getByRole('button', { name: 'Activar modo oscuro', exact: true });
    const bell = page.getByRole('button', { name: 'Abrir avisos', exact: true });
    const themeBox = await theme.boundingBox();
    const bellBox = await bell.boundingBox();
    assert(themeBox && bellBox && themeBox.x + themeBox.width <= bellBox.x && bellBox.x - themeBox.x - themeBox.width < 15);
    assert(Math.abs(themeBox.y - bellBox.y) < 2);
    await page.locator('.layout-topbar').screenshot({path: path.join(__dirname, 'topbar-mobile.png')});
`;
source = source.replace("    await page.getByRole('button', { name: 'Activar modo oscuro', exact: true }).click();", check + "    await page.getByRole('button', { name: 'Activar modo oscuro', exact: true }).click();");
const runtime = new Module(file, module);
runtime.filename = file;
runtime.paths = Module._nodeModulePaths(path.dirname(file));
runtime._compile(source, file);
