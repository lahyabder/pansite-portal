import Link from 'next/link';
import type { Locale } from '@pan/shared';

interface PageHeroProps {
    title: string;
    subtitle: string;
    locale?: Locale;
    breadcrumbs?: { label: string; href?: string }[];
}

export function PageHero({ title, subtitle, locale = 'fr', breadcrumbs }: PageHeroProps) {
    return (
        <section className="relative bg-gradient-to-br from-pan-navy via-pan-blue to-pan-sky text-white overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm text-pan-light/60">
                            {breadcrumbs.map((crumb, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    {i > 0 && (
                                        <span aria-hidden="true" className="text-pan-light/30">
                                            {locale === 'ar' ? '›' : '›'}
                                        </span>
                                    )}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="hover:text-white transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-pan-light/90">{crumb.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <div className="w-16 h-1 bg-pan-gold rounded-full mb-6" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                    {title}
                </h1>
                <p className="text-lg text-pan-light/80 max-w-2xl leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </section>
    );
}
