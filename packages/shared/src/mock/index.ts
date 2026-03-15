import type { Content, Service, Request, NavItem, PortStatistic, User, AuditLogEntry } from '../types';

// ─── Mock Users ───────────────────────────────────────────
export const mockUsers: User[] = [
    {
        id: 'usr-001',
        email: 'admin@pan.mr',
        name: 'Administrateur PAN',
        role: 'super_admin',
        department: 'direction_generale',
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        passwordChangedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// ─── Mock Services ────────────────────────────────────────
export const mockServices: Service[] = [];

// ─── Mock Contents (actualités, communiqués, événements, alertes) ──
export const mockContents: Content[] = [];

// ─── Mock Audit Log ───────────────────────────────────────
export const mockAuditLog: AuditLogEntry[] = [];



// ─── Mock Requests ────────────────────────────────────────
export const mockRequests: Request[] = [];


// ─── Mock Navigation ──────────────────────────────────────
export const mockNavigation: NavItem[] = [
    { label: { fr: 'Accueil', ar: 'الرئيسية', en: 'Home', es: 'Inicio' }, href: '/' },
    {
        label: { fr: 'Le Port', ar: 'الميناء', en: 'The Port', es: 'El Puerto' },
        href: '/port',
        children: [
            { label: { fr: 'Présentation', ar: 'تقديم', en: 'Presentation', es: 'Presentación' }, href: '/port/presentation' },
            { label: { fr: 'Historique', ar: 'التاريخ', en: 'History', es: 'Historia' }, href: '/port/historique' },
            { label: { fr: 'Infrastructure', ar: 'البنية التحتية', en: 'Infrastructure', es: 'Infraestructura' }, href: '/port/infrastructure' },
        ],
    },
    { label: { fr: 'Services', ar: 'الخدمات', en: 'Services', es: 'Servicios' }, href: '/services' },
    { label: { fr: 'Actualités', ar: 'الأخبار', en: 'News', es: 'Noticias' }, href: '/actualites' },
    { label: { fr: 'Contact', ar: 'اتصل بنا', en: 'Contact', es: 'Contacto' }, href: '/contact' },
];

// ─── Mock Statistics ──────────────────────────────────────
export const mockStatistics: PortStatistic[] = [];
