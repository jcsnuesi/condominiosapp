import { ChartOptions } from 'chart.js';

/** Canvas colors must be refreshed explicitly; they do not inherit CSS changes. */
export function withChartTheme(options: ChartOptions): ChartOptions {
    const style = getComputedStyle(document.documentElement);
    const text = style.getPropertyValue('--text-color').trim();
    const muted = style.getPropertyValue('--text-color-secondary').trim();
    const border = style.getPropertyValue('--surface-border').trim();
    const scales = Object.fromEntries(
        Object.entries(options.scales ?? {}).map(([axis, settings]) => [axis, {
            ...settings,
            ticks: { ...settings?.ticks, color: muted },
            grid: { ...settings?.grid, color: border },
        }])
    );
    return {
        ...options,
        plugins: {
            ...options.plugins,
            legend: {
                ...options.plugins?.legend,
                labels: { ...options.plugins?.legend?.labels, color: text },
            },
        },
        scales,
    };
}
