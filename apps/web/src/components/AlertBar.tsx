'use client';

import type { Locale } from '@pan/shared';
import { t, getActiveAlerts } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function AlertBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const [alerts, setAlerts] = useState<ReturnType<typeof getActiveAlerts>>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        setAlerts(getActiveAlerts());
    }, []);

    const visible = alerts.filter((a) => !dismissed.has(a.id));
    if (visible.length === 0) return null;

    const current = visible[currentIdx % visible.length];
    const isUrgent = current.priority === 'urgent';

    return (
        <div
            className={`relative overflow-hidden ${isUrgent
                    ? 'bg-gradient-to-r from-red-600 to-red-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400'
                } text-white`}
        >
            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-lg shrink-0 ${isUrgent ? 'animate-pulse' : ''}`}>
                        {isUrgent ? '🚨' : '⚠️'}
                    </span>
                    <Link
                        href={`/${locale}/alertes/${current.slug}`}
                        className="text-sm font-medium truncate hover:underline"
                    >
                        {t(current.title, locale).replace(/^⚠️\s*/, '')}
                    </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {visible.length > 1 && (
                        <button
                            onClick={() => setCurrentIdx((i) => (i + 1) % visible.length)}
                            className="text-white/70 hover:text-white text-xs px-2 py-1 rounded border border-white/20 hover:border-white/40 transition-colors"
                        >
                            {currentIdx % visible.length + 1}/{visible.length}
                        </button>
                    )}
                    <button
                        onClick={() => setDismissed((d) => new Set(d).add(current.id))}
                        className="text-white/70 hover:text-white transition-colors text-lg leading-none"
                        aria-label={dict.content.alertBar.close}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}
