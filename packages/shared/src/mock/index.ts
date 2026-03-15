import type { Content, Document, Service, Request, NavItem, PortStatistic, User, AuditLogEntry, GedDocument } from '../types';

// ─── Mock Users ───────────────────────────────────────────
export const mockUsers: User[] = [
    {
        id: 'usr-001',
        email: 'admin@pan.mr',
        name: 'Ahmed Ould Mohamed',
        role: 'super_admin',
        department: 'direction_generale',
        isActive: true,
        twoFactorEnabled: true,
        lastLoginAt: '2025-03-05T08:30:00Z',
        failedLoginAttempts: 0,
        passwordChangedAt: '2025-01-10T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2025-03-05T08:30:00Z',
    },
    {
        id: 'usr-002',
        email: 'fatima@pan.mr',
        name: 'Fatima Mint Cheikh',
        role: 'content_admin',
        department: 'direction_generale',
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: '2025-03-04T14:20:00Z',
        failedLoginAttempts: 0,
        passwordChangedAt: '2025-02-01T10:00:00Z',
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2025-03-04T14:20:00Z',
    },
    {
        id: 'usr-003',
        email: 'ibrahim@pan.mr',
        name: 'Ibrahim Ould Abdallah',
        role: 'ged_manager',
        department: 'direction_technique',
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: '2025-03-03T09:15:00Z',
        failedLoginAttempts: 0,
        passwordChangedAt: '2025-01-20T10:00:00Z',
        createdAt: '2024-03-10T10:00:00Z',
        updatedAt: '2025-03-03T09:15:00Z',
    },
    {
        id: 'usr-004',
        email: 'aissata@pan.mr',
        name: 'Aïssata Bâ',
        role: 'services_manager',
        department: 'direction_commerciale',
        isActive: true,
        twoFactorEnabled: true,
        lastLoginAt: '2025-03-05T07:45:00Z',
        failedLoginAttempts: 0,
        passwordChangedAt: '2025-02-15T10:00:00Z',
        createdAt: '2024-04-05T10:00:00Z',
        updatedAt: '2025-03-05T07:45:00Z',
    },
    {
        id: 'usr-005',
        email: 'sidi@pan.mr',
        name: 'Sidi Mohamed Lemine',
        role: 'validator',
        department: 'direction_generale',
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: '2025-03-02T16:00:00Z',
        failedLoginAttempts: 1,
        passwordChangedAt: '2025-01-05T10:00:00Z',
        createdAt: '2024-05-12T10:00:00Z',
        updatedAt: '2025-03-02T16:00:00Z',
    },
    {
        id: 'usr-006',
        email: 'maryam@pan.mr',
        name: 'Maryam Mint Said',
        role: 'internal_reader',
        department: 'direction_financiere',
        isActive: false,
        twoFactorEnabled: false,
        lastLoginAt: '2025-01-15T11:00:00Z',
        failedLoginAttempts: 0,
        lockedUntil: '2025-04-01T00:00:00Z',
        passwordChangedAt: '2024-12-01T10:00:00Z',
        createdAt: '2024-06-01T10:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z',
    },
];

// ─── Mock Services ────────────────────────────────────────
export const mockServices: Service[] = [];

// ─── Mock Contents (actualités, communiqués, événements, alertes) ──
export const mockContents: Content[] = [];

// ─── Mock Audit Log ───────────────────────────────────────
export const mockAuditLog: AuditLogEntry[] = [];

// ─── Mock GED Documents ───────────────────────────────────
export const mockGedDocuments: GedDocument[] = [];

// ─── Mock Documents ───────────────────────────────────────
export const mockDocuments: Document[] = [];

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
    { label: { fr: 'Documents', ar: 'الوثائق', en: 'Documents', es: 'Documentos' }, href: '/documents' },
    { label: { fr: 'Contact', ar: 'اتصل بنا', en: 'Contact', es: 'Contacto' }, href: '/contact' },
];

// ─── Mock Statistics ──────────────────────────────────────
export const mockStatistics: PortStatistic[] = [];
