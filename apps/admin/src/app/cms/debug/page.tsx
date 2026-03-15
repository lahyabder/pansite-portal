'use client';

import { useState } from 'react';
import { testApiConnectionAction } from '../../actions';
import { Terminal, RefreshCw, Server, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugPage() {
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runTest = async () => {
        setLoading(true);
        try {
            const data = await testApiConnectionAction();
            setResults(data);
        } catch (err: any) {
            setResults({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-pan-gold" />
                        Diagnostics API
                    </h1>
                    <p className="text-admin-text-muted text-sm mt-1">
                        Outils de test pour la connexion entre l'Admin et le Web.
                    </p>
                </div>
                <button
                    onClick={runTest}
                    disabled={loading}
                    className="px-4 py-2 bg-pan-gold text-pan-navy font-bold rounded-xl hover:bg-pan-gold-light transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Test en cours...' : 'Lancer le diagnostic'}
                </button>
            </div>

            {results ? (
                <div className="space-y-6 animate-fade-in">
                    {/* Config Info */}
                    <div className="bg-admin-surface border border-admin-border rounded-2xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-admin-text-muted mb-4 flex items-center gap-2">
                            <Server className="w-4 h-4" /> Configuration Serveur
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(results.config || {}).map(([key, value]: [string, any]) => (
                                <div key={key} className="p-3 bg-admin-bg rounded-lg border border-admin-border">
                                    <div className="text-[10px] text-admin-text-muted font-mono uppercase">{key}</div>
                                    <div className="text-sm font-bold text-admin-text break-all">{String(value)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="space-y-4">
                        {(results.tests || []).map((test: any, i: number) => (
                            <div key={i} className={`bg-admin-surface border rounded-2xl p-6 ${test.error ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {test.error ? (
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        )}
                                        <h3 className="font-bold text-lg">{test.name}</h3>
                                    </div>
                                    {test.duration && (
                                        <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white/40">{test.duration}</span>
                                    )}
                                </div>

                                {test.url && (
                                    <div className="mb-4 p-2 bg-admin-bg rounded text-[11px] font-mono text-admin-text-muted break-all">
                                        URL: {test.url}
                                    </div>
                                )}

                                {test.error ? (
                                    <div className="space-y-3">
                                        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/20">
                                            Error: {test.error}
                                        </div>
                                        {test.code && (
                                            <div className="text-xs font-mono text-red-500/70">CODE: {test.code}</div>
                                        )}
                                        {test.stack && (
                                            <pre className="p-4 bg-black/40 rounded-xl text-[10px] text-white/40 overflow-x-auto font-mono">
                                                {test.stack}
                                            </pre>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                                            <div className="text-[10px] text-emerald-500/60 uppercase font-bold">Status</div>
                                            <div className="text-xl font-bold text-emerald-400">{test.status}</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl col-span-3">
                                            <div className="text-[10px] text-white/20 uppercase font-bold">Server Headers</div>
                                            <div className="text-[10px] font-mono mt-1 text-white/40 truncate">
                                                {JSON.stringify(test.headers)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-pan-gold/10 border border-pan-gold/20 rounded-xl">
                        <p className="text-sm text-pan-gold leading-relaxed">
                            <strong>Note:</strong> Si vous utilisez un sous-domaine custom (e.g. <code>admin.pan.mr</code>), assurez-vous que <code>WEB_API_BASE_URL</code> est correctement configuré pour pointer vers l'URL publique de l'application Web.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-admin-surface border border-admin-border border-dashed rounded-3xl text-admin-text-muted">
                    <Globe className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Cliquez sur le bouton pour lancer une vérification technique.</p>
                </div>
            )}
            
            <div className="flex justify-center">
                <Link href="/cms/contents" className="text-xs text-admin-text-muted hover:text-white transition-colors">
                    ← Retour à la gestion des contenus
                </Link>
            </div>
        </div>
    );
}
