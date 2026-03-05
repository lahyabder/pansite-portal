'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const demoAccounts = [
    { email: 'admin@pan.mr', pass: 'admin', role: 'Super Admin' },
    { email: 'fatima@pan.mr', pass: 'editor', role: 'Admin Contenu' },
    { email: 'ibrahim@pan.mr', pass: 'ged', role: 'Gestionnaire GED' },
    { email: 'aissata@pan.mr', pass: 'services', role: 'Gestionnaire Services' },
    { email: 'sidi@pan.mr', pass: 'validator', role: 'Validateur' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) router.replace('/');
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Erreur de connexion');
            setLoading(false);
        }
    };

    function quickLogin(em: string, pw: string) {
        setEmail(em);
        setPassword(pw);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{
            background: 'linear-gradient(135deg, #0c2340 0%, #1a5276 50%, #2e86c1 100%)',
        }}>
            {/* Subtle pattern */}
            <div className="fixed inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
            }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d4a843] rounded-2xl shadow-xl mb-4">
                        <span className="text-[#0c2340] font-bold text-3xl">P</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">PAN Admin</h1>
                    <p className="text-[#aed6f1] text-sm mt-1">Port Autonome de Nouadhibou</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <h2 className="text-lg font-semibold text-white mb-6">Connexion</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[#94a3b8] text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                required
                                className="w-full px-4 py-3 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2e86c1]/50 focus:border-[#2e86c1] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[#94a3b8] text-sm font-medium mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2e86c1]/50 focus:border-[#2e86c1] transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#2e86c1] text-white font-semibold rounded-xl hover:bg-[#1a5276] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Connexion...
                                </span>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    {/* 2FA recommendation */}
                    <div className="mt-5 bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-amber-400 text-sm">🔐</span>
                            <span className="text-amber-300 text-xs font-semibold">Recommandation sécurité</span>
                        </div>
                        <p className="text-[#64748b] text-[10px] leading-relaxed">
                            Activez l&apos;authentification à deux facteurs (2FA/TOTP) dans vos paramètres pour renforcer la sécurité de votre compte.
                        </p>
                    </div>

                    {/* Demo accounts */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <button
                            onClick={() => setShowAccounts(!showAccounts)}
                            className="text-[#475569] text-[10px] text-center w-full hover:text-[#64748b] transition-colors"
                        >
                            {showAccounts ? '▲ Masquer' : '▼ Comptes démo'}
                        </button>
                        {showAccounts && (
                            <div className="mt-3 space-y-1.5">
                                {demoAccounts.map((acc) => (
                                    <button
                                        key={acc.email}
                                        onClick={() => quickLogin(acc.email, acc.pass)}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-[#0f172a]/50 rounded-lg text-[10px] hover:bg-[#0f172a] transition-colors group"
                                    >
                                        <span className="text-[#94a3b8] group-hover:text-white transition-colors">{acc.email}</span>
                                        <span className="text-[#475569]">{acc.role}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Security footer */}
                <p className="text-[#475569] text-[10px] text-center mt-4">
                    🔒 Connexion sécurisée · Session 8h · Tentatives limitées
                </p>
            </div>
        </div>
    );
}
