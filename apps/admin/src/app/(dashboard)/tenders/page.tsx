import { RequirePermission } from '@/lib/auth';

export default function TendersPage() {
    const mockTenders = [
        { id: 'AO-2025-001', title: 'Fourniture de grues portuaires', deadline: '30 Mars 2025', status: 'open' },
        { id: 'AO-2025-002', title: 'Travaux d\'extension du quai 3', deadline: '15 Avril 2025', status: 'open' },
        { id: 'AO-2024-018', title: 'Maintenance des systèmes de sécurité', deadline: '10 Déc 2024', status: 'closed' },
    ];

    return (
        <RequirePermission module="content">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">Appels d&apos;Offres</h2>
                        <p className="text-admin-text-muted text-sm mt-1">Gestion des marchés publics et appels d&apos;offres.</p>
                    </div>
                    <button className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                        + Nouvel appel d&apos;offres
                    </button>
                </div>

                <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-admin-border">
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Référence</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Objet</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Date limite</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="text-end px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {mockTenders.map((tender) => (
                                <tr key={tender.id} className="hover:bg-admin-surface-alt/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="text-admin-primary-light text-sm font-mono">{tender.id}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-admin-text text-sm">{tender.title}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-admin-text-muted text-sm">{tender.deadline}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${tender.status === 'open' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'
                                            }`}>
                                            {tender.status === 'open' ? 'Ouvert' : 'Clôturé'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-end">
                                        <button className="text-admin-text-muted hover:text-admin-text text-sm">Voir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </RequirePermission>
    );
}
