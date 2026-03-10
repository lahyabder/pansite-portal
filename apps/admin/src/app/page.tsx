'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, FileText, Newspaper, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PortalSelectorPage() {
    const { isAuthenticated, session, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !session) return null;

    return (
        <div className="min-h-screen bg-[#060914] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-pan-gold rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pan-blue rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-2xl">
                            <img src="/logo-pan.png" alt="PAN" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-start">
                            <h1 className="text-2xl font-bold tracking-tight">PAN Administration</h1>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Espace Professionnel</p>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Bienvenue, {session.user.name}</h2>
                    <p className="text-white/40 text-lg">Sélectionnez la zone de travail souhaitée</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* CMS Card */}
                    <Link
                        href="/cms"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pan-gold/20 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 bg-pan-gold/20 rounded-2xl flex items-center justify-center mb-6 text-pan-gold group-hover:scale-110 transition-transform shadow-lg shadow-pan-gold/10">
                            <Newspaper className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Dashboard Site Web</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 h-12">
                            Gestion du contenu public, actualités, services portuaires et médias.
                        </p>
                        <div className="w-full py-3 bg-pan-gold text-pan-navy font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-pan-gold-light transition-colors">
                            Accéder <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>

                    {/* GED Card */}
                    <Link
                        href="/ged"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pan-blue/20 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 bg-pan-blue/20 rounded-2xl flex items-center justify-center mb-6 text-pan-sky group-hover:scale-110 transition-transform shadow-lg shadow-pan-blue/10">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Portail GED</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 h-12">
                            Archivage sécurisé, demandes de documents et gestion électronique des données.
                        </p>
                        <div className="w-full py-3 bg-pan-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-pan-blue-light transition-colors shadow-lg shadow-pan-blue/20">
                            Accéder <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-8 mt-16">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </button>
                    <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                    <a href="http://localhost:3000" target="_blank" className="text-white/40 hover:text-white transition-colors text-sm">
                        Voir le site public
                    </a>
                </div>
            </div>
        </div>
    );
}
