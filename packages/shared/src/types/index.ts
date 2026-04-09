// ─── Locale ───────────────────────────────────────────────
export type Locale = 'fr' | 'ar' | 'en' | 'es';

export type LocalizedString = {
    fr: string;
    ar: string;
    en?: string;
    es?: string;
};

// ─── User & Roles (RBAC) ──────────────────────────────────
export type UserRole =
    | 'super_admin'
    | 'content_admin'
    | 'services_manager'
    | 'validator'
    | 'internal_reader';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'publish';

export type PermissionModule =
    | 'content'
    | 'services'
    | 'users'
    | 'analytics'
    | 'requests'
    | 'audit'
    | 'settings'
    | 'pages'
    | 'menus'
    | 'media';

export type PermissionMatrix = Record<PermissionModule, PermissionAction[]>;

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    department?: DocumentDirection;
    avatarUrl?: string;
    isActive: boolean;
    twoFactorEnabled: boolean;
    lastLoginAt?: string;
    failedLoginAttempts: number;
    lockedUntil?: string;
    passwordChangedAt?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Permissions matrix per role ──────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, PermissionMatrix> = {
    super_admin: {
        content: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        services: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        users: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        analytics: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        requests: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        audit: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        settings: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        pages: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        menus: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        media: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
    },
    content_admin: {
        content: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        services: ['view'],
        users: [],
        analytics: ['view'],
        requests: ['view'],
        audit: [],
        settings: [],
    },
    services_manager: {
        content: ['view'],
        services: ['view', 'create', 'edit', 'approve'],
        users: [],
        analytics: ['view'],
        requests: ['view', 'edit', 'approve'],
        audit: [],
        settings: [],
    },
    validator: {
        content: ['view', 'approve', 'publish'],
        services: ['view', 'approve'],
        users: [],
        analytics: ['view'],
        requests: ['view'],
        audit: [],
        settings: [],
    },
    internal_reader: {
        content: ['view'],
        services: ['view'],
        users: [],
        analytics: [],
        requests: [],
        audit: [],
        settings: [],
    },
};

// ─── Permission helpers ───────────────────────────────────
export function hasPermission(role: UserRole, module: PermissionModule, action: PermissionAction): boolean {
    return ROLE_PERMISSIONS[role]?.[module]?.includes(action) ?? false;
}

export function getModulePermissions(role: UserRole, module: PermissionModule): PermissionAction[] {
    return ROLE_PERMISSIONS[role]?.[module] ?? [];
}

export const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: 'Super Administrateur',
    content_admin: 'Admin Contenu',
    services_manager: 'Gestionnaire Services',
    validator: 'Validateur',
    internal_reader: 'Lecteur Interne',
};

// ─── Content (CMS: actualités, communiqués, événements, alertes) ──
export type ContentStatus = 'draft' | 'pending_approval' | 'published' | 'archived';
export type ContentCategory = 'actualite' | 'communique' | 'evenement' | 'alerte' | 'le-port' | 'infrastructure' | 'services' | 'procedures' | 'tariffs' | 'stopovers' | 'tenders' | 'media' | 'contact';

export interface Content {
    id: string;
    slug: string;
    title: LocalizedString;
    body: LocalizedString;
    excerpt: LocalizedString;
    coverImage?: string;
    category: ContentCategory;
    tags: string[];
    status: ContentStatus;
    priority?: 'normal' | 'important' | 'urgent';
    authorId: string;
    eventDate?: string;        // for events
    eventEndDate?: string;     // for multi-day events
    eventLocation?: string;    // for events
    images?: string[];         // optional gallery
    externalLink?: string;     // optional external URL
    videoLink?: string;        // optional video URL (Youtube, etc)
    expiresAt?: string;        // for alerts
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;        // soft delete
}

// ─── Audit Log ────────────────────────────────────────────
export type AuditAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'submit_for_review'
    | 'approve'
    | 'publish'
    | 'archive'
    | 'restore'
    | 'assign'
    | 'status_change'
    | 'respond'
    | 'login'
    | 'logout'
    | 'failed_login'
    | 'permission_denied'
    | 'role_change';

export interface AuditLogEntry {
    id: string;
    entityType: 'content' | 'service' | 'user' | 'session' | 'request' | 'page' | 'menu' | 'setting' | 'media';
    entityId: string;
    action: AuditAction;
    userId: string;
    userName: string;
    details?: string;
    previousStatus?: string;
    newStatus?: string;
    module?: PermissionModule;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}


export type DocumentDirection =
    | 'direction_generale'
    | 'direction_exploitation'
    | 'direction_commerciale'
    | 'direction_technique'
    | 'direction_financiere'
    | 'direction_rh'
    | 'capitainerie'
    | 'securite'
    | 'autre';

// ─── Service (port services offered by PAN) ───────────────
export interface ServiceStep {
    title: LocalizedString;
    description: LocalizedString;
}

export interface ServiceContact {
    name: LocalizedString;
    phone?: string;
    email?: string;
    hours?: LocalizedString;
}

export interface Service {
    id: string;
    slug: string;
    name: LocalizedString;
    description: LocalizedString;
    longDescription?: LocalizedString;
    icon: string;
    coverImage?: string;
    features: LocalizedString[];
    beneficiaries?: LocalizedString[];       // who can use this service
    prerequisites?: LocalizedString[];       // what's needed before applying
    requiredDocuments?: LocalizedString[];   // documents to provide
    steps?: ServiceStep[];                   // step-by-step procedure
    deadline?: LocalizedString;              // processing time
    costs?: LocalizedString;                 // tariff/cost info
    contactPoints?: ServiceContact[];        // department contacts
    direction: DocumentDirection;            // owning department
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Request (public service requests / contact forms) ────
export type RequestStatus =
    | 'new'
    | 'assigned'
    | 'in_progress'
    | 'waiting_more_info'
    | 'approved'
    | 'rejected'
    | 'closed';

export type RequestType = 'information' | 'reclamation' | 'rendez_vous';
export type RequestPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface RequestStatusEntry {
    id: string;
    status: RequestStatus;
    comment?: string;
    changedBy: string;
    changedByName: string;
    createdAt: string;
}

export interface RequestAttachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
}

export interface Request {
    id: string;
    reference: string;              // auto-generated PAN-REQ-YYYY-XXX
    type: RequestType;
    subject: string;
    message: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    senderCompany?: string;
    status: RequestStatus;
    priority: RequestPriority;
    assignedTo?: string;            // user ID
    assignedToName?: string;
    assignedDepartment?: DocumentDirection;
    responseMessage?: string;
    serviceId?: string;
    serviceName?: string;
    attachments: RequestAttachment[];
    statusHistory: RequestStatusEntry[];
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

export interface RequestFilters {
    search?: string;
    type?: RequestType;
    status?: RequestStatus;
    priority?: RequestPriority;
    department?: DocumentDirection;
    serviceId?: string;
    page?: number;
    pageSize?: number;
}

// ─── Navigation ───────────────────────────────────────────
export interface NavItem {
    label: LocalizedString;
    href: string;
    children?: NavItem[];
}

// ─── Statistics (for dashboard) ───────────────────────────
export interface PortStatistic {
    id: string;
    label: LocalizedString;
    value: number;
    unit: string;
    icon: string;
    trend?: number;
}

// ─── Repository types ─────────────────────────────────────
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ContentFilters {
    category?: ContentCategory;
    status?: ContentStatus;
    tag?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}

// ─── CMS: Specialized Interfaces ──────────────────────────────

export interface PageBlock {
    id: string;
    type: 'hero' | 'stats' | 'intro' | 'services_grid' | 'news_strip' | 'map' | 'form' | 'rich_text' | 'gallery' | 'timeline' | 'cta' | 'partners';
    content: any; // Block specific content
    settings?: any; // Visual settings (bg, padding, etc)
    order: number;
    isActive: boolean;
}

export interface Page {
    id: string;
    slug: string;
    title: LocalizedString;
    description?: LocalizedString;
    hero?: {
        title: LocalizedString;
        subtitle?: LocalizedString;
        backgroundImage?: string;
        videoUrl?: string;
        ctaLabel?: LocalizedString;
        ctaHref?: string;
    };
    blocks: PageBlock[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
        noIndex?: boolean;
    };
    status: ContentStatus;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Menu {
    id: string;
    name: string;
    location: 'main' | 'footer' | 'header_top';
    items: NavItem[];
    createdAt: string;
    updatedAt: string;
}

export interface SiteSettings {
    id: string;
    siteName: LocalizedString;
    logo?: string;
    logoFooter?: string;
    favicon?: string;
    slogan?: LocalizedString;
    contactEmails: string[];
    contactPhones: string[];
    address: LocalizedString;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        instagram?: string;
    };
    coordinates?: {
        lat: number;
        lng: number;
    };
    copyright: LocalizedString;
    seoGlobal?: {
        titleTemplate: string;
        defaultDescription: string;
        defaultOgImage?: string;
    };
    updatedAt: string;
}

export interface MediaAsset {
    id: string;
    filename: string;
    url: string;
    type: 'image' | 'video' | 'document' | 'other';
    mimeType: string;
    size: number;
    metadata?: {
        alt?: string;
        caption?: LocalizedString;
        width?: number;
        height?: number;
    };
    folder?: string;
    createdAt: string;
    updatedAt: string;
}
