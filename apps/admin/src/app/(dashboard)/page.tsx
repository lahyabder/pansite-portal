'use client';

import { mockStatistics, mockContents, mockRequests, mockServices, type LocalizedString } from '@pan/shared';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { Ship, FileText, Mail, BarChart3, Clock, CheckCircle, Archive } from 'lucide-react';

export default function DashboardPage() {
  const { canAny } = useAuth();
  const { t, locale } = useI18n();

  // Helper to get translated text from LocalizedString
  const getT = (text: LocalizedString) => {
    return text[locale] || text.fr || '';
  };

  const pendingRequestsCount = mockRequests.filter((r) => r.status === 'new' || r.status === 'in_progress').length;
  const publishedContentsCount = mockContents.filter((c) => c.status === 'published').length;

  const stats = [
    {
      label: t.dashboard.activeServices,
      value: mockServices.filter((s) => s.isActive).length,
      icon: <Ship className="w-6 h-6" />,
      color: 'bg-admin-primary/15 text-admin-primary-light',
    },
    {
      label: t.dashboard.publishedArticles,
      value: publishedContentsCount,
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-admin-success/15 text-admin-success',
    },
    {
      label: t.dashboard.pendingRequests,
      value: pendingRequestsCount,
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-admin-warning/15 text-admin-warning',
    },
    {
      label: t.dashboard.trafficTons,
      value: mockStatistics[0]?.value.toLocaleString(locale) || '—',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-admin-accent/15 text-admin-accent',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-admin-surface rounded-xl p-5 border border-admin-border hover:border-admin-primary/30 transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-admin-text">{stat.value}</div>
            <div className="text-admin-text-muted text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        {canAny('requests') && (
          <div className="bg-admin-surface rounded-xl border border-admin-border">
            <div className="px-5 py-4 border-b border-admin-border">
              <h2 className="text-admin-text font-semibold">{t.dashboard.lastRequests}</h2>
            </div>
            <div className="divide-y divide-admin-border">
              {mockRequests.slice(0, 5).map((req) => (
                <div key={req.id} className="px-5 py-4 hover:bg-admin-surface-alt/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-admin-text text-sm font-medium">{req.subject}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${req.status === 'new'
                        ? 'bg-amber-500/15 text-amber-400'
                        : req.status === 'closed'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-blue-500/15 text-blue-400'
                        }`}
                    >
                      {req.status === 'new'
                        ? t.dashboard.status.new
                        : req.status === 'closed'
                          ? t.dashboard.status.closed
                          : req.status}
                    </span>
                  </div>
                  <div className="text-admin-text-muted text-xs">
                    {req.senderName} — {req.senderEmail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent content */}
        {canAny('content') && (
          <div className="bg-admin-surface rounded-xl border border-admin-border">
            <div className="px-5 py-4 border-b border-admin-border">
              <h2 className="text-admin-text font-semibold">{t.dashboard.lastContents}</h2>
            </div>
            <div className="divide-y divide-admin-border">
              {mockContents.slice(0, 5).map((content) => (
                <div key={content.id} className="px-5 py-4 hover:bg-admin-surface-alt/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-admin-text text-sm font-medium">{getT(content.title)}</span>
                    <span
                      className={`text-[10px] px-2.5 py-1 flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${content.status === 'published'
                        ? 'bg-admin-success/15 text-admin-success'
                        : content.status === 'draft'
                          ? 'bg-gray-500/15 text-gray-400'
                          : 'bg-admin-danger/15 text-admin-danger'
                        }`}
                    >
                      {content.status === 'published'
                        ? <><CheckCircle className="w-3 h-3" /> {t.dashboard.status.published}</>
                        : content.status === 'draft'
                          ? <><Clock className="w-3 h-3" /> {t.dashboard.status.draft}</>
                          : <><Archive className="w-3 h-3" /> {t.dashboard.status.archived}</>}
                    </span>
                  </div>
                  <div className="text-admin-text-muted text-xs">{content.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
