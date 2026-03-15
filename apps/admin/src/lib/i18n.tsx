'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '@pan/shared';
import { dictionaries, type AdminDictionary } from './dictionaries';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: AdminDictionary;
    isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('fr');
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        // Simple detection or stored preference
        const stored = localStorage.getItem('pan-admin-locale') as Locale;
        if (stored && ['ar', 'fr', 'en', 'es'].includes(stored)) {
            setLocale(stored);
            setIsRTL(stored === 'ar');
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        setIsRTL(locale === 'ar');
        localStorage.setItem('pan-admin-locale', locale);
    }, [locale]);

    const value = {
        locale,
        setLocale,
        t: dictionaries[locale] || dictionaries.fr,
        isRTL
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
