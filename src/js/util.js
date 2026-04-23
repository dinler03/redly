// util.js — shared helpers

import { t } from '/js/i18n.js';

/**
 * Format a UNIX timestamp (seconds) as a relative "time ago" string using i18n.
 * Uses keys: ago_minutes, ago_hours, ago_days, ago_weeks, ago_months, ago_years
 * Each key contains "{n}" which is substituted with the amount.
 */
export function format_relative_time(created_seconds) {
    const dt = new Date(created_seconds * 1000);
    const now = new Date();
    const diff = now - dt;

    if (diff < 1000 * 60 * 60) {
        const n = Math.max(0, Math.floor(diff / (1000 * 60)));
        return t('ago_minutes').replace('{n}', n);
    }
    if (diff < 1000 * 60 * 60 * 24) {
        const n = Math.floor(diff / (1000 * 60 * 60));
        return t('ago_hours').replace('{n}', n);
    }
    if (diff < 1000 * 60 * 60 * 24 * 7) {
        const n = Math.floor(diff / (1000 * 60 * 60 * 24));
        return t('ago_days').replace('{n}', n);
    }
    if (diff < 1000 * 60 * 60 * 24 * 30) {
        const n = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        return t('ago_weeks').replace('{n}', n);
    }
    if (diff < 1000 * 60 * 60 * 24 * 365) {
        const n = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        return t('ago_months').replace('{n}', n);
    }
    const n = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return t('ago_years').replace('{n}', n);
}

/**
 * Create a handler that distinguishes single-click from double-click.
 * - First click within `delay_ms` of a second click → invokes `on_double`
 * - A single click (no second click within delay) → invokes `on_single`
 */
export function create_click_debouncer(on_single, on_double, delay_ms = 250) {
    let timer = null;
    return function handle(event) {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
            if (on_double) on_double(event);
            return;
        }
        timer = setTimeout(() => {
            timer = null;
            if (on_single) on_single(event);
        }, delay_ms);
    };
}

/**
 * Request Capacitor Filesystem publicStorage permission.
 * Returns true if granted (or not required), false otherwise.
 * Shows a localised toast on denial (caller may add additional handling).
 */
export async function ensure_storage_permission(Filesystem, Toast) {
    try {
        const perm = await Filesystem.checkPermissions();
        if (perm.publicStorage === 'granted') return true;
        const req = await Filesystem.requestPermissions();
        if (req.publicStorage === 'granted') return true;
        if (Toast) {
            await Toast.show({ text: t('permission_denied'), duration: 'short' });
        }
        return false;
    } catch (e) {
        // Plugin method unavailable (e.g. web) — treat as granted
        return true;
    }
}
