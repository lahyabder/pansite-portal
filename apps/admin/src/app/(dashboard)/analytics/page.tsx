import { RequirePermission } from '@/lib/auth';

export default function AnalyticsPage() {
    const mockMetrics = [
        { label: 'Visites ce mois', value: '12,450', trend: '+18%', color: 'text-emerald-400' },
        { label: 'Pages vues', value: '45,230', trend: '+12%', color: 'text-emerald-400' },
        { label: 'Téléchargements', value: '1,890', trend: '+5%', color: 'text-emerald-400' },
        { label: 'Demandes reçues', value: '67', trend: '-3%', color: 'text-red-400' },
    ];

    return (
        <RequirePermission module="analytics">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-admin-text">Analytique</h2>
                    <p className="text-admin-text-muted text-sm mt-1">Statistiques et indicateurs de performance.</p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {mockMetrics.map((m) => (
                        <div key={m.label} className="bg-admin-surface rounded-xl p-5 border border-admin-border">
                            <div className="text-2xl font-bold text-admin-text">{m.value}</div>
                            <div className="text-admin-text-muted text-sm mt-1">{m.label}</div>
                            <div className={`text-xs font-medium mt-2 ${m.color}`}>{m.trend}</div>
                        </div>
                    ))}
                </div>

                {/* Chart placeholder */}
                <div className="bg-admin-surface rounded-xl border border-admin-border p-8">
                    <h3 className="text-admin-text font-semibold mb-6">Trafic mensuel</h3>
                    <div className="h-64 flex items-end justify-center gap-3">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-admin-primary/30 hover:bg-admin-primary/50 rounded-t-md transition-colors"
                                    style={{ height: `${h}%` }}
                                />
                                <span className="text-admin-text-muted text-[9px]">
                                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RequirePermission>
    );
}
