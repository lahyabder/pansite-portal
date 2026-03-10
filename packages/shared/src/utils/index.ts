import type { Locale, LocalizedString } from '../types';

/**
 * Get localized value from a LocalizedString
 */
export function t(localized: LocalizedString, locale: Locale): string {
    return localized[locale] || localized.fr;
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string, locale: Locale): string {
    const date = new Date(dateStr);
    const dateLocales: Record<Locale, string> = {
        ar: 'ar-MR',
        fr: 'fr-FR',
        en: 'en-US',
        es: 'es-ES'
    };
    return date.toLocaleDateString(dateLocales[locale] || 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Get direction for a locale
 */
export function getDir(locale: Locale): 'ltr' | 'rtl' {
    return locale === 'ar' ? 'rtl' : 'ltr';
}
