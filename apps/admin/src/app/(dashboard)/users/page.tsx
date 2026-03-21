'use client';

import { useState } from 'react';
import { mockUsers } from '@pan/shared';
import { ROLE_LABELS } from '@pan/shared';
import type { User, UserRole } from '@pan/shared';
import { Users, Search, Shield, ShieldOff, Clock, Mail, Building, Plus } from 'lucide-react';

const roleColors: Record<UserRole, string> = {
    super_admin:       'bg-purple-100 text-purple-800 border border-purple-200',
    content_admin:     'bg-blue-100 text-blue-800 border border-blue-200',
    services_manager:  'bg-teal-100 text-teal-800 border border-teal-200',
    validator:         'bg-amber-100 text-amber-800 border border-amber-200',
    internal_reader:   'bg-gray-100 text-gray-700 border border-gray-200',
};

const departmentLabels: Record<string, string> = {
    direction_generale:    'Direction Générale',
    direction_exploitation:'Direction Exploitation',
    direction_commerciale: 'Direction Commerciale',
    direction_technique:   'Direction Technique',
    direction_financiere:  'Direction Financière',
    direction_rh:          'Direction RH',
    capitainerie:          'Capitainerie',
    securite:              'Sécurité',
    autre:                 'Autre',
};

function Avatar({ user }: { user: User }) {
    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-pan-gray-100" />
    ) : (
        <div className="w-10 h-10 rounded-full bg-pan-navy text-white flex items-center justify-center font-bold text-sm select-none flex-shrink-0">
            {initials}
        </div>
    );
}

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [users, setUsers] = useState<User[]>(mockUsers);

    const filtered = users.filter(u => {
        const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const toggleActive = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    };

    const activeCount = users.filter(u => u.isActive).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Utilisateurs</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">
                        {users.length} compte(s) · {activeCount} actif(s)
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-pan-navy text-white rounded-xl font-semibold text-sm hover:bg-pan-blue transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                    Nouvel utilisateur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
                    const count = users.filter(u => u.role === role).length;
                    return (
                        <div key={role} className="bg-white rounded-2xl border border-pan-gray-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-bold text-pan-navy">{count}</p>
                            <p className="text-xs text-pan-gray-400 mt-1 leading-tight">{ROLE_LABELS[role]}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky bg-white"
                >
                    <option value="">Tous les rôles</option>
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-pan-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Direction</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Dernière connexion</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pan-gray-50">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-pan-gray-400">
                                        <div className="text-3xl mb-2">👤</div>
                                        <p className="font-medium">Aucun utilisateur trouvé</p>
                                    </td>
                                </tr>
                            )}
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-pan-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar user={user} />
                                            <div>
                                                <p className="text-sm font-semibold text-pan-navy">{user.name}</p>
                                                <p className="text-xs text-pan-gray-400 mt-0.5 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />{user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                                            {ROLE_LABELS[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-pan-gray-500 flex items-center gap-1">
                                            <Building className="w-3 h-3 flex-shrink-0" />
                                            {user.department ? departmentLabels[user.department] || user.department : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-pan-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3 flex-shrink-0" />
                                            {user.lastLoginAt
                                                ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                : 'Jamais'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isActive ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                Inactif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleActive(user.id)}
                                                className={`p-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 ${
                                                    user.isActive
                                                        ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                                        : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={user.isActive ? 'Désactiver' : 'Activer'}
                                            >
                                                {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}