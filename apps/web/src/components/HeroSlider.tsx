'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';

interface HeroSliderProps {
    dict: Dictionary;
    locale: Locale;
}

const images = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/hero/hero-3.jpg',
    '/images/hero/hero-4.jpg',
    '/images/hero/hero-5.jpg',
];

export function HeroSlider({ dict, locale }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            id="hero"
            className="relative bg-pan-navy text-white overflow-hidden min-h-[600px] flex items-center"
        >
            {/* Background Images */}
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                        index === current ? 'opacity-65' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url('${img}')` }}
                />
            ))}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pan-navy/70 to-pan-blue/50" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-32 sm:py-40 lg:py-48 w-full">
                <div className="max-w-3xl">
                    <div className="w-20 h-1.5 bg-pan-gold rounded-full mb-8" />
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                        {dict.hero.title}
                    </h1>
                    <p className="text-lg sm:text-2xl text-pan-light leading-relaxed mb-10 max-w-2xl font-light">
                        {dict.hero.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/${locale}/le-port`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-pan-gold text-pan-navy font-semibold rounded-lg hover:bg-pan-gold-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {dict.hero.cta}
                            <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                        </Link>
                        <Link
                            href={`/${locale}/services`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-pan-blue/80 backdrop-blur-sm border-2 border-transparent text-white font-semibold rounded-lg hover:bg-pan-blue transition-all duration-300"
                        >
                            {dict.hero.ctaSecondary}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === current ? 'bg-pan-gold w-8' : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
