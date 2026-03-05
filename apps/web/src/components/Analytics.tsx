'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        // Simple check for consent
        const checkConsent = () => {
            setHasConsent(localStorage.getItem('pan_cookie_consent') === 'accepted');
        };
        checkConsent();
        // Listen for storage changes in case they click accept
        window.addEventListener('storage', checkConsent);
        // Custom event for consent change without reload
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key, value) {
            const event = new Event('itemInserted');
            originalSetItem.apply(this, [key, value]);
            window.dispatchEvent(event);
        };
        window.addEventListener('itemInserted', checkConsent);

        return () => {
            window.removeEventListener('storage', checkConsent);
            window.removeEventListener('itemInserted', checkConsent);
            localStorage.setItem = originalSetItem;
        };
    }, []);

    // Both Matomo and GA variables from .env
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
    const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

    // GA PageView manual tracking for app router
    useEffect(() => {
        if (hasConsent && gaId && window.gtag) {
            window.gtag('config', gaId, {
                page_path: pathname + searchParams.toString(),
            });
        }
    }, [pathname, searchParams, hasConsent, gaId]);

    if (!hasConsent) return null;

    return (
        <>
            {/* Google Analytics */}
            {gaId && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${gaId}', {
                              page_path: window.location.pathname,
                          });
                        `}
                    </Script>
                </>
            )}

            {/* Matomo Analytics */}
            {matomoUrl && matomoSiteId && (
                <Script id="matomo-analytics" strategy="afterInteractive">
                    {`
                      var _paq = window._paq = window._paq || [];
                      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                      _paq.push(['trackPageView']);
                      _paq.push(['enableLinkTracking']);
                      (function() {
                        var u="${matomoUrl}";
                        _paq.push(['setTrackerUrl', u+'matomo.php']);
                        _paq.push(['setSiteId', '${matomoSiteId}']);
                        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                        g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                      })();
                    `}
                </Script>
            )}
        </>
    );
}
