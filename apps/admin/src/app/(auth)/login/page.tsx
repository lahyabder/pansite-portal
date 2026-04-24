'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Ship, Lock, Mail, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    // Set a session cookie so the middleware can detect authentication
    document.cookie = 'pan-admin-session=1; path=/; max-age=86400; SameSite=Lax';
    window.location.href = '/admin/';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
           <div className="w-20 h-20 bg-sky-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-sky-500/20">
              <Ship className="text-white w-10 h-10" />
           </div>
           <h1 className="font-outfit text-3xl font-black text-white px-10">PAN COMMAND CENTER</h1>
           <p className="text-slate-500 font-medium">Port Autonome de Nouadhibou</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Administrateur</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pan.mr"
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Mot de Passe</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                    />
                 </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                   <AlertCircle className="w-4 h-4 shrink-0" />
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                {loading ? 'Authentification...' : 'Accéder au Hub'}
              </button>
           </form>
        </div>

        <p className="text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Accès Autorisé Seulement • Système v4.0</p>
      </div>
    </div>
  );
}
