import { ROLE_PERMISSIONS, ROLE_LABELS } from '@pan/shared';
import type { UserRole, PermissionModule, PermissionAction } from '@pan/shared';

const MODULES: { key: PermissionModule; label: string; icon: string }[] = [
    { key: 'content',   label: 'Contenu CMS',       icon: '📄' },
    { key: 'services',  label: 'Services',           icon: '⚙️' },
    { key: 'users',     label: 'Utilisateurs',       icon: '👤' },
    { key: 'analytics', label: 'Analytiques',        icon: '📊' },
    { key: 'requests',  label: 'Messages / Dem.',   icon: '✉️' },
    { key: 'audit',     label: 'Journal activité',   icon: '🔍' },
    { key: 'settings',  label: 'Paramètres',         icon: '🔧' },
];

const ACTIONS: { key: PermissionAction; label: string; color: string }[] = [
    { key: 'view',    label: 'Voir',      color: 'bg-blue-100 text-blue-700' },
    { key: 'create',  label: 'Créer',     color: 'bg-green-100 text-green-700' },
    { key: 'edit',    label: 'Modifier',  color: 'bg-amber-100 text-amber-700' },
    { key: 'delete',  label: 'Supprimer', color: 'bg-red-100 text-red-700' },
    { key: 'approve', label: 'Valider',   color: 'bg-purple-100 text-purple-700' },
    { key: 'publish', label: 'Publier',   color: 'bg-emerald-100 text-emerald-700' },
];

const ROLES = Object.keys(ROLE_LABELS) as UserRole[];

const roleColors: Record<UserRole, string> = {
    super_admin:       'bg-purple-600 text-white',
    content_admin:     'bg-blue-600   text-white',
    services_manager:  'bg-teal-600   text-white',
    validator:         'bg-amber-600  text-white',
    internal_reader:   'bg-gray-500   text-white',
};

const roleDescriptions: Record<UserRole, string> = {
    super_admin:      'Accès total à toutes les fonctionnalités du système.',
    content_admin:    'Gestion complète du contenu éditorial du site.',
    services_manager: 'Gestion des services portuaires et des demandes.',
    validator:        'Révision et validation des contenus soumis.',
    internal_reader:  'Consultation en lecture seule des contenus publics.',
};

function CheckIcon({ checked }: { checked: boolean }) {
    if (checked) {
        return (
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        );
    }
    return (
        <div className="w-6 h-6 rounded-full bg-pan-gray-100 flex items-center justify-center mx-auto">
            <svg className="w-3 h-3 text-pan-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </div>
    );
}

export default function RolesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-pan-navy">Rôles & Permissions</h1>
                <p className="text-sm text-pan-gray-400 mt-1">
                    Matrice des permissions par rôle — lecture seule (configuration système)
                </p>
            </div>

            {/* Role cards summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {ROLES.map(role => {
                    const totalPerms = Object.values(ROLE_PERMISSIONS[role]).flat().length;
                    return (
                        <div key={role} className="bg-white rounded-2xl border border-pan-gray-100 shadow-sm p-5">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3 ${roleColors[role]}`}>
                                {ROLE_LABELS[role]}
                            </div>
                            <p className="text-xs text-pan-gray-500 leading-relaxed mb-3">{roleDescriptions[role]}</p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-pan-gray-400">Permissions</span>
                                <span className="font-bold text-pan-navy">{totalPerms}</span>
                            </div>
                            <div className="mt-2 h-1.5 rounded-full bg-pan-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-pan-sky transition-all"
                                    style={{ width: `${(totalPerms / 42) * 100}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main permissions matrix */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-pan-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-pan-navy text-sm">Matrice des permissions</h3>
                    <p className="text-xs text-pan-gray-400">✅ Autorisé · ❌ Non autorisé</p>
                </div>
                <div className="overflow-x-auto">
                    {MODULES.map((mod, modIdx) => (
                        <div key={mod.key} className={modIdx > 0 ? 'border-t border-pan-gray-100' : ''}>
                            {/* Module header */}
                            <div className="bg-pan-gray-50/50 px-6 py-3 flex items-center gap-2">
                                <span className="text-lg">{mod.icon}</span>
                                <span className="font-bold text-sm text-pan-navy">{mod.label}</span>
                            </div>
                            {/* Action rows */}
                            {ACTIONS.map((action, actionIdx) => (
                                <div
                                    key={action.key}
                                    className={`grid items-center gap-0 ${actionIdx % 2 === 1 ? 'bg-pan-gray-50/30' : ''}`}
                                    style={{ gridTemplateColumns: '160px repeat(5, 1fr)' }}
                                >
                                    {/* Action label */}
                                    <div className="px-6 py-2.5 flex items-center">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${action.color}`}>
                                            {action.label}
                                        </span>
                                    </div>
                                    {/* Role columns */}
                                    {ROLES.map(role => {
                                        const allowed = ROLE_PERMISSIONS[role][mod.key]?.includes(action.key) ?? false;
                                        return (
                                            <div key={role} className="py-2.5 text-center">
                                                <CheckIcon checked={allowed} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Column headers (sticky would be ideal but tricky) */}
                <div className="border-t border-pan-gray-200 px-6 py-3 bg-pan-gray-50">
                    <div
                        className="grid gap-0 items-center"
                        style={{ gridTemplateColumns: '160px repeat(5, 1fr)' }}
                    >
                        <div />
                        {ROLES.map(role => (
                            <div key={role} className="text-center">
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColors[role]}`}>
                                    {ROLE_LABELS[role]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-xl mt-0.5">💡</span>
                <div className="text-sm text-amber-800">
                    <strong>Note :</strong> Cette matrice est gérée au niveau du code source.
                    Pour modifier les permissions, contactez l&apos;équipe technique afin de mettre à jour le fichier de configuration RBAC.
                </div>
            </div>
        </div>
    );
}