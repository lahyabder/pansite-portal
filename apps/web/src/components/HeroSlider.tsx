"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale, SiteSettings, LocalizedString } from '@/shared_lib';
import { t } from '@/shared_lib';
import type { Dictionary } from '@/lib/dictionaries';

interface HeroSliderProps {
    dict: Dictionary;
    locale: Locale;
    slides?: { image: string; title: LocalizedString; subtitle: LocalizedString; cta?: string; href?: string }[];
    settings: SiteSettings | null;
}

const defaultImages = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/port/container-yard.png',
    '/images/hero/hero-4.jpg',
    '/images/hero/hero-5.jpg',
    '/images/hero/hero-6.jpg',
];

export function HeroSlider({ dict, locale, slides, settings }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    const items: NonNullable<HeroSliderProps['slides']> = slides?.length ? slides : defaultImages.map(img => ({
        image: img,
        title: { fr: dict.hero.title, ar: dict.hero.title, en: dict.hero.title, es: dict.hero.title },
        subtitle: { fr: dict.hero.subtitle, ar: dict.hero.subtitle, en: dict.hero.subtitle, es: dict.hero.subtitle },
        cta: undefined,
        href: undefined
    }));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <section id="hero" className="relative bg-pan-navy text-white overflow-hidden min-h-[500px] md:min-h-[650px] lg:min-h-[800px] flex items-center">
            {/* Background Images */}
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                        index === current ? 'opacity-60' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={item.image}
                        alt=""
                        fill
                        priority={index === 0}
                        className="object-cover scale-105"
                    />
                </div>
            ))}
            
            <div className="absolute inset-0 bg-gradient-to-t from-pan-navy via-pan-navy/20 to-transparent lg:bg-gradient-to-r lg:from-pan-navy lg:to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24 lg:py-32 w-full z-10">
                <div className="max-w-4xl">
                    <div className="w-16 h-1 bg-pan-gold rounded-full mb-8 animate-in slide-in-from-left duration-700" />
                    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-6 md:mb-8 animate-in slide-in-from-bottom duration-700">
                        {t(items[current].title, locale)}
                    </h2>
                    <p className="text-base sm:text-xl md:text-2xl text-pan-light/80 leading-relaxed mb-8 md:mb-12 max-w-2xl font-medium animate-in slide-in-from-bottom delay-150 duration-700">
                        {t(items[current].subtitle, locale)}
                    </p>
                    <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom delay-300 duration-700">
                        <Link
                            href={items[current].href || `/${locale}/le-port`}
                            className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 md:py-4 bg-pan-gold text-pan-navy font-bold rounded-2xl hover:bg-white transition-all duration-300 shadow-2xl shadow-pan-gold/20 hover:-translate-y-1"
                        >
                            {items[current].cta || dict.hero.cta}
                            <span aria-hidden="true" className="text-lg">{locale === 'ar' ? '←' : '→'}</span>
                        </Link>
                        <Link
                            href={`/${locale}/services`}
                            className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300"
                        >
                            {dict.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 md:bottom-12 left-4 md:left-6 lg:left-12 flex gap-3 md:gap-4 z-20">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`group relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${
                            index === current ? 'w-24 bg-white/20' : 'w-8 bg-white/10 hover:bg-white/30'
                        }`}
                        aria-label={`Slide ${index + 1}`}
                    >
                        {index === current && (
                            <div className="absolute inset-0 bg-pan-gold animate-progress-bar origin-left" />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
