'use client';

import { useState } from 'react';
import { mockUsers } from '@pan/shared';
import type { User, UserRole, PermissionModule, PermissionAction } from '@pan/shared';
import { ROLE_PERMISSIONS } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

const roleColors: Record<UserRole, string> = {
    super_admin: 'bg-red-500/15 text-red-400',
    content_admin: 'bg-blue-500/15 text-blue-400',
    ged_manager: 'bg-cyan-500/15 text-cyan-400',
    services_manager: 'bg-purple-500/15 text-purple-400',
    validator: 'bg-amber-500/15 text-amber-400',
    internal_reader: 'bg-gray-500/15 text-gray-400',
};

export default function UsersPage() {
    const { t, locale } = useI18n();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showMatrix, setShowMatrix] = useState(false);
    const { can } = useAuth();

    const departmentLabels: Record<string, string> = {
        direction_generale: t.directions.direction_generale,
        direction_exploitation: t.directions.direction_exploitation,
        direction_commerciale: t.directions.direction_commerciale,
        direction_technique: t.directions.direction_technique,
        direction_financiere: t.directions.direction_financiere,
        direction_rh: t.directions.direction_rh,
        capitainerie: t.directions.capitainerie,
        securite: t.directions.securite,
        autre: 'Autre',
    };

    const moduleLabels: Record<PermissionModule, string> = {
        content: t.usersManagement.modules.content,
        documents: t.usersManagement.modules.documents,
        services: t.usersManagement.modules.services,
        requests: t.usersManagement.modules.requests,
        users: t.usersManagement.modules.users,
        analytics: t.usersManagement.modules.analytics,
        audit: t.usersManagement.modules.audit,
        settings: t.usersManagement.modules.settings,
    };

    const actionLabels: Record<PermissionAction, string> = {
        view: t.usersManagement.actions.view,
        create: t.usersManagement.actions.create,
        edit: t.usersManagement.actions.edit,
        delete: t.usersManagement.actions.delete,
        approve: t.usersManagement.actions.approve,
        publish: t.usersManagement.actions.publish,
    };

    return (
        <RequirePermission module="users">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">{t.usersManagement.title}</h2>
                        <p className="text-admin-text-muted text-sm mt-1">
                            {t.usersManagement.stats(mockUsers.length)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMatrix(!showMatrix)}
                            className="px-4 py-2.5 bg-admin-surface border border-admin-border text-admin-text text-sm font-medium rounded-xl hover:bg-admin-surface-alt transition-colors"
                        >
                            {showMatrix ? `← ${t.usersManagement.list}` : `📊 ${t.usersManagement.matrix}`}
                        </button>
                        {can('users', 'create') && (
                            <button className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                                + {t.usersManagement.newUser}
                            </button>
                        )}
                    </div>
                </div>

                {showMatrix ? (
                    <PermissionMatrixView />
                ) : (
                    <div className="flex gap-6">
                        {/* Users table */}
                        <div className={`${selectedUser ? 'w-1/2' : 'w-full'} transition-all`}>
                            <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-admin-border">
                                            <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.author}</th>
                                            <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.sidebar.administration}</th>
                                            <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.status}</th>
                                            <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.usersManagement.twoFactor}</th>
                                            <th className="text-end px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-admin-border">
                                        {mockUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className={`hover:bg-admin-surface-alt/50 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-admin-primary/5' : ''}`}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-admin-primary/20 rounded-full flex items-center justify-center relative">
                                                            <span className="text-admin-primary-light text-xs font-bold">
                                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </span>
                                                            {!user.isActive && (
                                                                <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-admin-surface" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-admin-text text-sm font-medium">{user.name}</div>
                                                            <div className="text-admin-text-muted text-[10px]">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${roleColors[user.role]}`}>
                                                        {t.roles[user.role]}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                                        {user.isActive ? t.usersManagement.active : t.usersManagement.inactive}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {user.twoFactorEnabled ? (
                                                        <span className="text-emerald-400 text-xs" title={t.sidebar.twoFactorActive}>🔒</span>
                                                    ) : (
                                                        <span className="text-amber-400 text-xs" title={t.usersManagement.twoFactorDisabled}>⚠️</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-end">
                                                    {can('users', 'edit') && (
                                                        <button className="text-admin-text-muted hover:text-admin-text text-sm">{t.common.edit}</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Detail panel */}
                        {selectedUser && (
                            <div className="w-1/2">
                                <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} t={t} locale={locale} departmentLabels={departmentLabels} moduleLabels={moduleLabels} roleColors={roleColors} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </RequirePermission>
    );
}

function UserDetailPanel({
    user,
    onClose,
    t,
    locale,
    departmentLabels,
    moduleLabels,
    roleColors,
}: {
    user: User;
    onClose: () => void;
    t: any;
    locale: string;
    departmentLabels: Record<string, string>;
    moduleLabels: Record<string, string>;
    roleColors: Record<UserRole, string>;
}) {
    const perms = ROLE_PERMISSIONS[user.role];

    return (
        <div className="bg-admin-surface rounded-xl border border-admin-border p-5 sticky top-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-admin-text">{t.usersManagement.details}</h3>
                <button onClick={onClose} className="text-admin-text-muted hover:text-admin-text">✕</button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-admin-border">
                <div className="w-14 h-14 bg-admin-primary/20 rounded-2xl flex items-center justify-center">
                    <span className="text-admin-primary-light text-lg font-bold">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                </div>
                <div>
                    <div className="text-admin-text font-bold">{user.name}</div>
                    <div className="text-admin-text-muted text-sm">{user.email}</div>
                    <div className="flex gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleColors[user.role]}`}>
                            {t.roles[user.role]}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                            {user.isActive ? t.usersManagement.active : t.usersManagement.inactive}
                        </span>
                    </div>
                </div>
            </div>

            {/* Security info */}
            <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-admin-border">
                <div className="bg-admin-bg rounded-lg p-3">
                    <div className="text-admin-text-muted text-[10px] uppercase tracking-wider">{t.usersManagement.twoFactor}</div>
                    <div className={`text-sm font-medium mt-1 ${user.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {user.twoFactorEnabled ? t.usersManagement.twoFactorEnabled : t.usersManagement.twoFactorDisabled}
                    </div>
                </div>
                <div className="bg-admin-bg rounded-lg p-3">
                    <div className="text-admin-text-muted text-[10px] uppercase tracking-wider">{t.usersManagement.failedAttempts}</div>
                    <div className={`text-sm font-medium mt-1 ${user.failedLoginAttempts > 0 ? 'text-amber-400' : 'text-admin-text'}`}>
                        {user.failedLoginAttempts}
                    </div>
                </div>
                <div className="bg-admin-bg rounded-lg p-3">
                    <div className="text-admin-text-muted text-[10px] uppercase tracking-wider">{t.sidebar.operational}</div>
                    <div className="text-admin-text text-sm font-medium mt-1">
                        {user.department ? departmentLabels[user.department] : '—'}
                    </div>
                </div>
                <div className="bg-admin-bg rounded-lg p-3">
                    <div className="text-admin-text-muted text-[10px] uppercase tracking-wider">{t.usersManagement.lastLogin}</div>
                    <div className="text-admin-text text-sm font-medium mt-1">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString(locale) : '—'}
                    </div>
                </div>
            </div>

            {/* Permissions breakdown */}
            <div>
                <h4 className="text-admin-text font-semibold text-sm mb-3">{t.sidebar.administration}</h4>
                <div className="space-y-2">
                    {(Object.entries(perms) as [PermissionModule, PermissionAction[]][]).map(([mod, actions]) => (
                        <div key={mod} className="flex items-center gap-2">
                            <span className="text-admin-text text-xs w-24 shrink-0">{moduleLabels[mod]}</span>
                            <div className="flex flex-wrap gap-1">
                                {actions.length > 0 ? actions.map(a => (
                                    <span key={a} className="text-[9px] px-1.5 py-0.5 bg-admin-primary/10 text-admin-primary-light rounded font-medium">
                                        {a}
                                    </span>
                                )) : (
                                    <span className="text-[9px] text-admin-text-muted italic">{t.usersManagement.none}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2FA Recommendation */}
            {!user.twoFactorEnabled && (
                <div className="mt-5 bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
                    <span className="text-amber-300 text-xs font-semibold">⚠️ {t.usersManagement.recommendation}</span>
                    <p className="text-admin-text-muted text-[10px] mt-1">
                        {t.usersManagement.recommendationText}
                    </p>
                </div>
            )}
        </div>
    );
}

function PermissionMatrixView() {
    const { t } = useI18n();
    const roles = Object.keys(ROLE_PERMISSIONS) as UserRole[];
    const modules = Object.keys(ROLE_PERMISSIONS.super_admin) as PermissionModule[];
    const allActions: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve', 'publish'];

    return (
        <div className="bg-admin-surface rounded-xl border border-admin-border overflow-x-auto">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-admin-border">
                        <th className="text-start px-4 py-3 text-admin-text-muted font-semibold uppercase tracking-wider sticky start-0 bg-admin-surface z-10">
                            Module / Action
                        </th>
                        {roles.map(role => (
                            <th key={role} className="px-3 py-3 text-center">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${roleColors[role]}`}>
                                    {t.roles[role]}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {modules.map(mod =>
                        allActions.map((action, ai) => (
                            <tr
                                key={`${mod}-${action}`}
                                className={`border-b border-admin-border/50 ${ai === 0 ? 'border-t border-admin-border' : ''}`}
                            >
                                <td className="px-4 py-2 sticky start-0 bg-admin-surface z-10">
                                    <div className="flex items-center gap-2">
                                        {ai === 0 && (
                                            <span className="text-admin-text font-semibold">{t.usersManagement.modules[mod]}</span>
                                        )}
                                        {ai > 0 && <span className="w-20" />}
                                        <span className="text-admin-text-muted">{t.usersManagement.actions[action]}</span>
                                    </div>
                                </td>
                                {roles.map(role => {
                                    const has = ROLE_PERMISSIONS[role][mod].includes(action);
                                    return (
                                        <td key={role} className="px-3 py-2 text-center">
                                            {has ? (
                                                <span className="text-emerald-400">✓</span>
                                            ) : (
                                                <span className="text-admin-text-muted/30">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
