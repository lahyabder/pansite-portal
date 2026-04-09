import type { Locale, PageBlock } from '@pan/shared';
import { t } from '@pan/shared';
import Image from 'next/image';
import Link from 'next/link';

interface BlockRendererProps {
    blocks: PageBlock[];
    locale: Locale;
}

export function BlockRenderer({ blocks, locale }: BlockRendererProps) {
    if (!blocks) return null;

    return (
        <>
            {blocks.map((block, i) => (
                <Block key={block.id || i} block={block} locale={locale} />
            ))}
        </>
    );
}

function Block({ block, locale }: { block: PageBlock; locale: Locale }) {
    switch (block.type) {
        case 'hero':
            return <HeroBlock content={block.content} locale={locale} />;
        case 'text_image':
            return <TextImageBlock content={block.content} locale={locale} />;
        case 'features':
            return <FeaturesBlock content={block.content} locale={locale} />;
        case 'cta':
            return <CTABlock content={block.content} locale={locale} />;
        default:
            return null;
    }
}

function HeroBlock({ content, locale }: { content: any; locale: Locale }) {
    return (
        <section className="relative bg-pan-navy text-white py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl lg:text-7xl font-black mb-6">{t(content.title, locale)}</h1>
                <p className="text-xl text-pan-light/80 max-w-2xl mx-auto mb-10">{t(content.subtitle, locale)}</p>
                {content.cta && (
                    <Link href={content.href || '#'} className="inline-flex px-8 py-4 bg-pan-gold text-pan-navy font-bold rounded-xl hover:bg-white transition-colors">
                        {t(content.cta, locale)}
                    </Link>
                )}
            </div>
            {content.image && (
                <div className="absolute inset-0 opacity-40">
                    <Image src={content.image} alt="" fill className="object-cover" />
                </div>
            )}
        </section>
    );
}

function TextImageBlock({ content, locale }: { content: any; locale: Locale }) {
    const isReversed = content.imagePosition === 'right';
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`grid lg:grid-cols-2 gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={isReversed ? 'lg:order-last' : ''}>
                        <h2 className="text-3xl font-black text-pan-navy mb-6">{t(content.title, locale)}</h2>
                        <div className="prose prose-lg text-pan-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(content.text, locale) }} />
                    </div>
                    <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image src={content.image} alt="" fill className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesBlock({ content, locale }: { content: any; locale: Locale }) {
    return (
        <section className="py-24 bg-pan-pale">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-pan-navy">{t(content.title, locale)}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {content.items?.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-pan-gray-100">
                            <h3 className="text-xl font-bold text-pan-navy mb-4">{t(item.title, locale)}</h3>
                            <p className="text-pan-gray-600 text-sm">{t(item.description, locale)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTABlock({ content, locale }: { content: any; locale: Locale }) {
    return (
        <section className="py-16 bg-pan-navy">
            <div className="max-w-5xl mx-auto px-6 bg-pan-blue/20 rounded-[2.5rem] p-12 text-center border border-white/10 backdrop-blur-md">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-display">{t(content.title, locale)}</h2>
                <p className="text-pan-light/70 text-lg mb-10 max-w-xl mx-auto">{t(content.subtitle, locale)}</p>
                <Link href={content.href || '#'} className="inline-flex items-center gap-2 px-10 py-5 bg-pan-gold text-pan-navy font-black rounded-2xl hover:bg-white transition-all duration-300">
                    {t(content.cta, locale) || 'En savoir plus'}
                </Link>
            </div>
        </section>
    );
}
