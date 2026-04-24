'use client';

import { useState, useEffect, useTransition } from 'react';
import { Users, Plus, Trash2, Shield, Newspaper, RefreshCw, X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import {
    listUsersAction,
    createEditorUserAction,
    deleteUserAction,
    updateUserRoleAction,
} from '@/app/actions';

type AdminUser = {
    id: string;
    email: string;
    role: string;
    name: string;
    createdAt: string;
    lastSignIn?: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const data = await listUsersAction();
            setUsers(data);
        } catch (e: any) {
            showToast('error', e.message);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleCreate = () => {
        if (!form.email || !form.password || !form.name) return showToast('error', 'Tous les champs sont obligatoires');
        startTransition(async () => {
            try {
                await createEditorUserAction(form.email, form.password, form.name);
                setForm({ name: '', email: '', password: '' });
                setShowForm(false);
                showToast('success', `Éditeur "${form.name}" créé avec succès`);
                await load();
            } catch (e: any) {
                showToast('error', e.message);
            }
        });
    };

    const handleDelete = (id: string, email: string) => {
        if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;
        startTransition(async () => {
            try {
                await deleteUserAction(id);
                showToast('success', 'Utilisateur supprimé');
                await load();
            } catch (e: any) {
                showToast('error', e.message);
            }
        });
    };

    const handleToggleRole = (id: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'editor' : 'admin';
        startTransition(async () => {
            try {
                await updateUserRoleAction(id, newRole);
                showToast('success', `Rôle changé en ${newRole}`);
                await load();
            } catch (e: any) {
                showToast('error', e.message);
            }
        });
    };

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="space-y-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold animate-fade-in ${
                    toast.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-outfit text-4xl font-black text-white flex items-center gap-3">
                        <Users className="w-9 h-9 text-sky-400" />
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Créez et gérez les comptes éditeurs spécialisés en actualités</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-sm hover:bg-sky-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Nouvel Éditeur
                </button>
            </div>

            {/* Role Legend */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm">Super Admin</div>
                        <div className="text-slate-400 text-xs mt-0.5">Accès complet à toute la plateforme</div>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm">Éditeur Actualités</div>
                        <div className="text-slate-400 text-xs mt-0.5">Accès limité: Actualités & Contenus uniquement</div>
                    </div>
                </div>
            </div>

            {/* Create Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-3xl p-8 w-full max-w-md space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white">Créer un Éditeur Actualités</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400 text-xs font-bold flex items-center gap-2">
                            <Newspaper className="w-4 h-4 shrink-0" />
                            Cet utilisateur aura accès uniquement à la section "Actualités & Contenus"
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nom complet</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Mohamed Ould Ahmed"
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="editeur@pan.mr"
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Mot de passe temporaire</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        placeholder="Min. 8 caractères"
                                        className="w-full px-4 py-3 pr-12 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isPending}
                                className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-black text-sm hover:bg-sky-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Créer le compte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        {users.length} utilisateur{users.length > 1 ? 's' : ''}
                    </h2>
                    <button onClick={load} disabled={loading} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-16 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-medium">Aucun utilisateur trouvé</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {users.map(user => (
                            <div key={user.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/2 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        user.role === 'admin'
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : 'bg-sky-500/10 text-sky-400'
                                    }`}>
                                        {user.role === 'admin' ? <Shield className="w-5 h-5" /> : <Newspaper className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{user.name || '—'}</div>
                                        <div className="text-slate-400 text-xs mt-0.5">{user.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-xs text-slate-500">
                                    <div className="hidden md:block">
                                        <div>Créé le</div>
                                        <div className="text-slate-400 font-medium">{formatDate(user.createdAt)}</div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div>Dernière connexion</div>
                                        <div className="text-slate-400 font-medium">{formatDate(user.lastSignIn)}</div>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        user.role === 'admin'
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                    }`}>
                                        {user.role === 'admin' ? 'Super Admin' : 'Éditeur'}
                                    </span>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleRole(user.id, user.role)}
                                            disabled={isPending}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                                            title="Changer le rôle"
                                        >
                                            Changer rôle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.email)}
                                            disabled={isPending}
                                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
