import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ q?: string }>;
}) {
    const { locale: lp } = await params;
    const { q: query } = await searchParams;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.search.title}
                subtitle={dict.pages.search.subtitle}
                locale={locale}
            />

            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Search input */}
                    <form className="mb-10">
                        <div className="relative">
                            <svg className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pan-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="search"
                                name="q"
                                defaultValue={query}
                                placeholder={dict.nav.searchPlaceholder}
                                className="w-full ps-12 pe-4 py-4 bg-white border border-pan-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky shadow-sm transition-all"
                            />
                        </div>
                    </form>

                    {/* Results */}
                    {query ? (
                        <div>
                            <p className="text-pan-gray-500 mb-6">
                                {dict.pages.search.resultsFor} &quot;<span className="text-pan-navy font-medium">{query}</span>&quot;
                            </p>
                            <div className="bg-white rounded-xl p-10 border border-pan-gray-100 text-center">
                                <p className="text-pan-gray-400">{dict.pages.search.noResults}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-10 border border-pan-gray-100 text-center">
                            <svg className="w-12 h-12 text-pan-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <p className="text-pan-gray-400">{dict.nav.searchPlaceholder}</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
