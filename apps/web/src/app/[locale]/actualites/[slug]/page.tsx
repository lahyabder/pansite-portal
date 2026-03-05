import type { Locale } from '@pan/shared';
import { t, formatDate, getContentBySlug, getContentsByCategory } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ContentDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale: localeParam, slug } = await params;
    const locale = (localeParam === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    const content = getContentBySlug(slug);
    if (!content || content.status !== 'published') return notFound();

    const categoryLabel = dict.content.categories[content.category] || content.category;
    const categoryRoute = {
        actualite: 'actualites',
        communique: 'communiques',
        evenement: 'evenements',
        alerte: 'alertes',
    }[content.category] || 'actualites';

    // Get related content (same category, different slug)
    const related = getContentsByCategory(content.category)
        .filter((c) => c.slug !== slug)
        .slice(0, 3);

    const priorityBadge = content.priority === 'urgent'
        ? 'bg-red-100 text-red-700'
        : content.priority === 'important'
            ? 'bg-amber-100 text-amber-700'
            : '';

    return (
        <>
            {/* Hero / Header */}
            <div className="bg-gradient-to-br from-pan-navy via-pan-blue to-pan-sky text-white">
                <div className="max-w-4xl mx-auto px-6 py-20">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-pan-light/70 mb-6">
                        <Link href={`/${locale}`} className="hover:text-white transition-colors">
                            {locale === 'ar' ? 'الرئيسية' : 'Accueil'}
                        </Link>
                        <span>›</span>
                        <Link href={`/${locale}/${categoryRoute}`} className="hover:text-white transition-colors">
                            {categoryLabel}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                            {categoryLabel}
                        </span>
                        {priorityBadge && (
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityBadge}`}>
                                {content.priority === 'urgent' ? '🚨 Urgent' : '⚡ Important'}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                        {t(content.title, locale)}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-pan-light/80">
                        {content.publishedAt && (
                            <span>
                                {dict.content.detail.publishedOn} {formatDate(content.publishedAt, locale)}
                            </span>
                        )}
                        {content.eventDate && (
                            <span className="flex items-center gap-1">
                                📅 {dict.content.detail.eventDate}: {formatDate(content.eventDate, locale)}
                                {content.eventEndDate && ` — ${formatDate(content.eventEndDate, locale)}`}
                            </span>
                        )}
                        {content.eventLocation && (
                            <span className="flex items-center gap-1">
                                📍 {content.eventLocation}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    {/* Alert expiry notice */}
                    {content.category === 'alerte' && content.expiresAt && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center gap-3">
                            <span className="text-amber-500 text-xl">⏰</span>
                            <span className="text-amber-700 text-sm font-medium">
                                {dict.content.detail.expiresOn} {formatDate(content.expiresAt, locale)}
                            </span>
                        </div>
                    )}

                    {/* Main content */}
                    <div className="prose prose-lg max-w-none text-pan-gray-700 leading-relaxed">
                        {t(content.body, locale).split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {/* Tags */}
                    {content.tags.length > 0 && (
                        <div className="mt-10 pt-8 border-t border-pan-gray-100">
                            <h3 className="text-sm font-semibold text-pan-gray-400 uppercase tracking-wider mb-3">
                                {dict.content.detail.tags}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {content.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-pan-gray-50 text-pan-gray-500 text-sm rounded-full border border-pan-gray-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back link */}
                    <div className="mt-10">
                        <Link
                            href={`/${locale}/${categoryRoute}`}
                            className="inline-flex items-center gap-2 text-pan-sky font-medium hover:text-pan-blue transition-colors"
                        >
                            <span>{locale === 'ar' ? '→' : '←'}</span>
                            {dict.content.detail.backToList}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related content */}
            {related.length > 0 && (
                <section className="bg-pan-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-bold text-pan-navy mb-8">
                            {dict.content.detail.relatedContent}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/${locale}/${categoryRoute}/${item.slug}`}
                                    className="group bg-white rounded-xl p-5 border border-pan-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <span className="text-xs text-pan-gray-400 mb-2 block">
                                        {item.publishedAt && formatDate(item.publishedAt, locale)}
                                    </span>
                                    <h3 className="text-pan-navy font-semibold text-sm line-clamp-2 group-hover:text-pan-sky transition-colors mb-2">
                                        {t(item.title, locale)}
                                    </h3>
                                    <p className="text-pan-gray-500 text-xs line-clamp-2">
                                        {t(item.excerpt, locale)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
