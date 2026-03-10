import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { Shield, FileArchive, LayoutDashboard, Lock } from 'lucide-react';

export default async function AccessPortalPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <div className="min-h-screen bg-pan-navy flex items-center justify-center p-6 relative overflow-hidden text-white font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-pan-gold rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pan-blue rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 border border-white/20 shadow-2xl">
                        <Lock className="w-10 h-10 text-pan-gold" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Accès Réservé - PAN</h1>
                    <p className="text-pan-light/60 text-lg">Choisissez le portail de gestion à accéder</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* CMS Portal Card */}
                    <a
                        href="http://localhost:3001/cms"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pan-gold/20"
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-pan-gold rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-pan-navy" />
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-pan-gold/20 rounded-2xl flex items-center justify-center mb-6 text-pan-gold group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Dashboard Site Web</h2>
                        <p className="text-white/60 leading-relaxed mb-6">
                            Gestion du contenu dynamique, actualités, services portuaires et contrôle général de la plateforme publique.
                        </p>
                        <div className="flex items-center text-pan-gold font-bold gap-2">
                            Entrer <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </a>

                    {/* GED Portal Card */}
                    <a
                        href="http://localhost:3001/ged"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pan-blue/20"
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-pan-blue rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="w-16 h-16 bg-pan-blue/20 rounded-2xl flex items-center justify-center mb-6 text-pan-sky group-hover:scale-110 transition-transform">
                            <FileArchive className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Portail GED</h2>
                        <p className="text-white/60 leading-relaxed mb-6">
                            Gestion Électronique des Documents. Archive centrale, gestion des dossiers, accès sécurisé et audit documentaire.
                        </p>
                        <div className="flex items-center text-pan-sky font-bold gap-2">
                            Entrer <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </a>
                </div>

                <div className="text-center mt-12">
                    <Link href={`/${locale}`} className="text-white/40 hover:text-white transition-colors text-sm">
                        Retour au site public
                    </Link>
                </div>
            </div>
        </div>
    );
}
