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
// ─── Mock Services ────────────────────────────────────────
export const mockServices: Service[] = [
    {
        id: 'ser-001',
        slug: 'manutention',
        name: { fr: 'Manutention', ar: 'المناولة', en: 'Stevedoring', es: 'Manutención' },
        description: { 
            fr: 'Services de chargement et déchargement optimisés pour tous types de marchandises.',
            ar: 'خدمات شحن وتفريغ محسنة لجميع أنواع البضائع مع معدات متخصصة.',
            en: 'Optimized loading and unloading services for all types of goods.',
            es: 'Servicios de carga y descarga optimizados para todo tipo de mercancías.'
        },
        icon: 'crane',
        features: [
            { fr: 'Chargement et déchargement optimisés', ar: 'شحن وتفريغ محسن', en: 'Optimized loading/unloading', es: 'Carga y descarga optimizada' },
            { fr: 'Matériel spécialisé', ar: 'معدات متخصصة', en: 'Specialized equipment', es: 'Equipo especializado' }
        ],
        direction: 'direction_exploitation',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ser-002',
        slug: 'transbordements',
        name: { fr: 'Transbordements', ar: 'المسافنة', en: 'Transshipment', es: 'Transbordo' },
        description: { 
            fr: 'Opérations rapides sans stockage intermédiaire.',
            ar: 'عمليات سريعة بدون تخزين وسيط تسمح بخفض التكاليف.',
            en: 'Fast operations without intermediate storage.',
            es: 'Operaciones rápidas sin almacenamiento intermedio.'
        },
        icon: 'refresh-cw',
        features: [
            { fr: 'Opérations rapides', ar: 'عمليات سريعة', en: 'Fast operations', es: 'Operaciones rápidas' },
            { fr: 'Réduction des coûts', ar: 'خفض التكاليف', en: 'Cost reduction', es: 'Reducción de costos' }
        ],
        direction: 'direction_exploitation',
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ser-003',
        slug: 'entreposage',
        name: { fr: 'Entreposage', ar: 'التخزين', en: 'Warehousing', es: 'Almacenamiento' },
        description: { 
            fr: 'Espaces de stockage diversifiés et sécurisés.',
            ar: 'مساحات تخزين متنوعة تشمل مناطق مستودعات جمركية.',
            en: 'Diverse and secure storage spaces.',
            es: 'Espacios de almacenamiento diversos y seguros.'
        },
        icon: 'box',
        features: [
            { fr: 'Espaces sous douane', ar: 'مناطق مستودعات جمركية', en: 'Bonded areas', es: 'Áreas bajo aduana' },
            { fr: 'Accès 24/7', ar: 'وصول 24/7', en: '24/7 access', es: 'Acceso 24/7' }
        ],
        direction: 'direction_commerciale',
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ser-004',
        slug: 'transit-logistique',
        name: { fr: 'Transit & Logistique', ar: 'العبور والخدمات اللوجستية', en: 'Transit & Logistics', es: 'Tránsito y Logística' },
        description: { 
            fr: 'Coordination entre transport maritime et terrestre.',
            ar: 'خدمات تنسيق كاملة بين النقل البحري والبري مع إدارة جمركية مبسطة.',
            en: 'Coordination between sea and land transport.',
            es: 'Coordinación entre transporte marítimo y terrestre.'
        },
        icon: 'truck',
        features: [
            { fr: 'Gestion douanière', ar: 'إدارة جمركية', en: 'Customs management', es: 'Gestión aduanera' },
            { fr: 'Suivi logistique', ar: 'متابعة لوجستية', en: 'Logistics tracking', es: 'Seguimiento logístico' }
        ],
        direction: 'direction_commerciale',
        order: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ser-005',
        slug: 'services-navires',
        name: { fr: 'Services aux Navires', ar: 'خدمات السفن', en: 'Vessel Services', es: 'Servicios a Buques' },
        description: { 
            fr: 'Assistance complète (pilotage, remorquage, avitaillement).',
            ar: 'مساعدة كاملة للسفن تشمل الإرشاد، القطر، التزويد بالوقود.',
            en: 'Complete assistance (pilotage, towing, supply).',
            es: 'Asistencia completa (practicaje, remolque, abastecimiento).'
        },
        icon: 'anchor',
        features: [
            { fr: 'Pilotage', ar: 'إرشاد', en: 'Pilotage', es: 'Practicaje' },
            { fr: 'Remorquage', ar: 'قطر', en: 'Towing', es: 'Remolque' }
        ],
        direction: 'capitainerie',
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ser-006',
        slug: 'gestion-terminaux',
        name: { fr: 'Gestion des Terminaux', ar: 'تسيير المحطات', en: 'Terminal Management', es: 'Gestión de Terminales' },
        description: { 
            fr: 'Exploitation efficace des terminaux spécialisés.',
            ar: 'استغلال فعال للمحطات المتخصصة للحاويات والصب.',
            en: 'Efficient exploitation of specialized terminals.',
            es: 'Explotación eficiente de terminales especializadas.'
        },
        icon: 'layout',
        features: [
            { fr: 'Terminal conteneurs', ar: 'محطة الحاويات', en: 'Container terminal', es: 'Terminal de contenedores' },
            { fr: 'Terminal vracs', ar: 'محطة الصب', en: 'Bulk terminal', es: 'Terminal de graneles' }
        ],
        direction: 'direction_exploitation',
        order: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

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
