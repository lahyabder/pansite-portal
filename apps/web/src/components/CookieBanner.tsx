'use client';

import { useEffect, useState } from 'react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('pan_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('pan_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem('pan_cookie_consent', 'declined');
        // If they decline, we shouldn't run analytics 
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-pan-gray-200 shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm text-pan-gray-600 leading-relaxed">
                        Pour vous offrir la meilleure expérience possible sur notre site, le Port Autonome de Nouadhibou utilise des cookies. Ces cookies nous aident à comprendre comment vous utilisez notre site (analytique) et à en améliorer les performances. En cliquant sur &quot;Accepter&quot;, vous consentez à l&apos;utilisation de tous les cookies de notre site web.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={declineCookies}
                        className="px-5 py-2.5 text-sm font-medium text-pan-gray-600 hover:text-pan-gray-900 bg-pan-gray-100 hover:bg-pan-gray-200 rounded-lg transition-colors"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-pan-blue hover:bg-pan-navy rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}
