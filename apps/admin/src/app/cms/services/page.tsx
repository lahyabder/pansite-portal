'use client';

import { useState } from 'react';
import { mockServices } from '@pan/shared';
import type { Service, LocalizedString } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

export default function AdminServicesPage() {
    const { t, locale } = useI18n();
    const [selected, setSelected] = useState<string | null>(null);
    const service = selected ? mockServices.find(s => s.id === selected) : null;
    const { can } = useAuth();

    const getT = (text: LocalizedString) => text[locale] || text.fr || '';

    return (
        <RequirePermission module="services">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">{t.servicesManagement.catalog}</h2>
                        <p className="text-admin-text-muted text-sm mt-1">
                            {t.servicesManagement.activeServicesCount(mockServices.length)}
                        </p>
                    </div>
                    {can('services', 'create') && (
                        <button className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                            + {t.servicesManagement.newService}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-5 gap-4">
                    {/* Service list */}
                    <div className={`${service ? 'col-span-2' : 'col-span-5'} bg-admin-surface rounded-xl border border-admin-border overflow-hidden`}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-admin-border">
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">#</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.title}</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.type}</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.status}</th>
                                    <th className="text-end px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {mockServices.map((svc) => (
                                    <tr
                                        key={svc.id}
                                        className={`transition-colors cursor-pointer ${selected === svc.id ? 'bg-admin-surface-alt/70' : 'hover:bg-admin-surface-alt/50'}`}
                                        onClick={() => setSelected(svc.id)}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="text-admin-text-muted text-sm">#{svc.order}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-admin-text text-sm font-medium">{getT(svc.name)}</div>
                                            <div className="text-admin-text-muted text-xs mt-0.5">{svc.slug}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-admin-text-muted text-xs">
                                                {svc.direction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${svc.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {svc.isActive ? t.servicesManagement.active : t.servicesManagement.inactive}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-end">
                                            <button className="text-admin-text-muted hover:text-admin-text text-sm" onClick={(e) => { e.stopPropagation(); setSelected(svc.id); }}>{t.common.view}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detail panel */}
                    {service && (
                        <div className="col-span-3 bg-admin-surface rounded-xl border border-admin-border overflow-auto max-h-[75vh]">
                            <div className="p-6 space-y-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-admin-text">{getT(service.name)}</h3>
                                        <p className="text-admin-text-muted text-sm mt-0.5">{service.name.ar}</p>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-admin-text-muted hover:text-admin-text text-sm">✕</button>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.description}</h4>
                                    <p className="text-admin-text text-sm">{getT(service.description)}</p>
                                    {service.longDescription && <p className="text-admin-text-muted text-sm mt-2">{getT(service.longDescription)}</p>}
                                </div>

                                {/* Features */}
                                <div>
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.highlights} ({service.features.length})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {service.features.map((f, i) => (
                                            <span key={i} className="px-3 py-1 bg-admin-surface-alt rounded-lg text-admin-text text-xs">{getT(f)}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Beneficiaries */}
                                {service.beneficiaries && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.beneficiaries}</h4>
                                        <ul className="space-y-1">
                                            {service.beneficiaries.map((b, i) => (
                                                <li key={i} className="text-admin-text text-sm flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-admin-primary rounded-full" /> {getT(b)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Steps */}
                                {service.steps && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.procedure} ({t.servicesManagement.steps(service.steps.length)})</h4>
                                        <div className="space-y-2">
                                            {service.steps.map((step, i) => (
                                                <div key={i} className="flex gap-3 bg-admin-surface-alt rounded-lg p-3">
                                                    <div className="w-7 h-7 bg-admin-primary text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                                    <div>
                                                        <div className="text-admin-text text-sm font-medium">{getT(step.title)}</div>
                                                        <div className="text-admin-text-muted text-xs mt-0.5">{getT(step.description)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Required docs */}
                                {service.requiredDocuments && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.requiredDocs}</h4>
                                        <ul className="space-y-1">
                                            {service.requiredDocuments.map((d, i) => (
                                                <li key={i} className="text-admin-text text-sm flex items-center gap-2">📄 {getT(d)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Deadline + Costs */}
                                <div className="grid grid-cols-2 gap-4">
                                    {service.deadline && (
                                        <div className="bg-admin-surface-alt rounded-lg p-3">
                                            <div className="text-admin-text-muted text-xs uppercase tracking-wider mb-1">{t.servicesManagement.deadline}</div>
                                            <div className="text-admin-text text-sm">{getT(service.deadline)}</div>
                                        </div>
                                    )}
                                    {service.costs && (
                                        <div className="bg-admin-surface-alt rounded-lg p-3">
                                            <div className="text-admin-text-muted text-xs uppercase tracking-wider mb-1">{t.servicesManagement.costs}</div>
                                            <div className="text-admin-text text-sm">{getT(service.costs)}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Contact points */}
                                {service.contactPoints && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.servicesManagement.contactPoints}</h4>
                                        {service.contactPoints.map((cp, i) => (
                                            <div key={i} className="bg-admin-surface-alt rounded-lg p-3 text-sm space-y-1">
                                                <div className="text-admin-text font-medium">{getT(cp.name)}</div>
                                                {cp.phone && <div className="text-admin-text-muted">📞 {cp.phone}</div>}
                                                {cp.email && <div className="text-admin-primary">✉️ {cp.email}</div>}
                                                {cp.hours && <div className="text-admin-text-muted">🕐 {getT(cp.hours)}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Edit button */}
                                {can('services', 'edit') && (
                                    <div className="border-t border-admin-border pt-4 flex gap-2">
                                        <button className="px-4 py-2 bg-admin-primary text-white text-sm font-medium rounded-lg hover:bg-admin-primary/80 transition-colors">
                                            ✏️ {t.servicesManagement.editService}
                                        </button>
                                        <button className="px-4 py-2 bg-admin-surface-alt text-admin-text text-sm font-medium rounded-lg hover:bg-admin-border transition-colors">
                                            {service.isActive ? `⏸ ${t.servicesManagement.inactive}` : `▶ ${t.servicesManagement.active}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RequirePermission>
    );
}
