import type { Locale } from '@pan/shared';
import { t, formatDate, getContentBySlug, getContentsByCategory } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default async function ContentDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale: localeParam, slug } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
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
            <div className="relative bg-pan-navy text-white overflow-hidden min-h-[400px] flex items-center">
                {/* Background Image */}
                {(content.images?.[0] || content.coverImage) && (
                    <div className="absolute inset-0 z-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={content.images?.[0] || content.coverImage}
                            alt={t(content.title, locale)}
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pan-navy via-pan-navy/60 to-transparent" />
                    </div>
                )}

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 w-full">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-pan-light/70 mb-6 font-medium">
                        <Link href={`/${locale}`} className="hover:text-pan-gold transition-colors">
                            {dict.nav.home}
                        </Link>
                        <span className="opacity-40">›</span>
                        <Link href={`/${locale}/${categoryRoute}`} className="hover:text-pan-gold transition-colors">
                            {categoryLabel}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-pan-gold text-pan-navy">
                            {categoryLabel}
                        </span>
                        {priorityBadge && (
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${priorityBadge}`}>
                                {content.priority === 'urgent' ? '🚨 Urgent' : '⚡ Important'}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-8">
                        {t(content.title, locale)}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-pan-light/80 font-medium">
                        {content.publishedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pan-gold" />
                                {dict.content.detail.publishedOn} {formatDate(content.publishedAt, locale)}
                            </div>
                        )}
                        {content.eventDate && (
                            <div className="flex items-center gap-2">
                                <span className="text-pan-gold">📅</span>
                                {dict.content.detail.eventDate}: {formatDate(content.eventDate, locale)}
                                {content.eventEndDate && ` — ${formatDate(content.eventEndDate, locale)}`}
                            </div>
                        )}
                        {content.eventLocation && (
                            <div className="flex items-center gap-2">
                                <span className="text-pan-gold">📍</span>
                                {content.eventLocation}
                            </div>
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
                    <div className="prose prose-lg max-w-none text-pan-gray-700 leading-relaxed mb-12">
                        {t(content.body, locale).split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {/* Media: External Link */}
                    {content.externalLink && (
                        <div className="mb-10">
                            <a
                                href={content.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-6 bg-pan-navy text-white rounded-2xl hover:bg-pan-blue transition-all group shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        🔗
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{['ar'].includes(locale) ? 'رابط خارجي / ملف' : 'Lien externe / Document'}</div>
                                        <div className="text-white/60 text-sm truncate max-w-sm">{content.externalLink}</div>
                                    </div>
                                </div>
                                <span className="text-pan-gold font-bold">Voir →</span>
                            </a>
                        </div>
                    )}

                    {/* Media: Video */}
                    {content.videoLink && (
                        <div className="mb-10 aspect-video rounded-3xl overflow-hidden border border-pan-gray-100 shadow-2xl">
                            {content.videoLink.includes('youtube.com') || content.videoLink.includes('youtu.be') ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${content.videoLink.split('v=')[1] || content.videoLink.split('/').pop()}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <a href={content.videoLink} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center bg-pan-gray-50 text-pan-sky font-bold">
                                    Regarder la vidéo ↗
                                </a>
                            )}
                        </div>
                    )}

                    {/* Media: Gallery */}
                    {content.images && content.images.length > 0 && (
                        <div className="mb-12 space-y-6">
                            <h3 className="text-xl font-bold text-pan-navy flex items-center gap-2">
                                📸 Galerie Photos
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {content.images.map((img, i) => (
                                    <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-pan-gray-50 border border-pan-gray-100 hover:shadow-xl transition-shadow group">
                                        <img
                                            src={img}
                                            alt={`Image ${i + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                            <span>{['ar'].includes(locale) ? '←' : '→'}</span>
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
