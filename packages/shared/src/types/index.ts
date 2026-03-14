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
    | 'ged_manager'
    | 'services_manager'
    | 'validator'
    | 'internal_reader';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'publish';

export type PermissionModule =
    | 'content'
    | 'documents'
    | 'services'
    | 'requests'
    | 'users'
    | 'analytics'
    | 'audit'
    | 'settings';

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
        documents: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        services: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        requests: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        users: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        analytics: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        audit: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        settings: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
    },
    content_admin: {
        content: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        documents: ['view'],
        services: ['view'],
        requests: ['view'],
        users: [],
        analytics: ['view'],
        audit: ['view'],
        settings: [],
    },
    ged_manager: {
        content: ['view'],
        documents: ['view', 'create', 'edit', 'delete', 'approve', 'publish'],
        services: ['view'],
        requests: ['view'],
        users: [],
        analytics: ['view'],
        audit: ['view'],
        settings: [],
    },
    services_manager: {
        content: ['view'],
        documents: ['view'],
        services: ['view', 'create', 'edit', 'approve'],
        requests: ['view', 'create', 'edit', 'approve'],
        users: [],
        analytics: ['view'],
        audit: ['view'],
        settings: [],
    },
    validator: {
        content: ['view', 'approve', 'publish'],
        documents: ['view', 'approve', 'publish'],
        services: ['view', 'approve'],
        requests: ['view', 'approve'],
        users: [],
        analytics: ['view'],
        audit: ['view'],
        settings: [],
    },
    internal_reader: {
        content: ['view'],
        documents: ['view'],
        services: ['view'],
        requests: [],
        users: [],
        analytics: [],
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
    ged_manager: 'Gestionnaire GED',
    services_manager: 'Gestionnaire Services',
    validator: 'Validateur',
    internal_reader: 'Lecteur Interne',
};

// ─── Content (CMS: actualités, communiqués, événements, alertes) ──
export type ContentStatus = 'draft' | 'pending_approval' | 'published' | 'archived';
export type ContentCategory = 'actualite' | 'communique' | 'evenement' | 'alerte' | 'le-port' | 'infrastructure' | 'services' | 'procedures' | 'tariffs' | 'stopovers' | 'tenders' | 'documentation' | 'media' | 'contact';

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
    | 'upload_version'
    | 'download'
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
    entityType: 'content' | 'document' | 'service' | 'request' | 'user' | 'session';
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

// ─── Document GED ─────────────────────────────────────────
export type DocumentFileType = 'pdf' | 'doc' | 'docx' | 'xlsx' | 'xls' | 'ppt' | 'pptx' | 'jpg' | 'png' | 'other';
export type DocumentStatus = 'draft' | 'published' | 'archived';
export type DocumentAccessLevel = 'public' | 'restricted' | 'internal';

export type DocumentTheme =
    | 'reglementation'
    | 'tarification'
    | 'securite'
    | 'environnement'
    | 'infrastructure'
    | 'commerce'
    | 'rh'
    | 'finance'
    | 'autre';

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

export interface DocumentVersion {
    id: string;
    versionNumber: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: DocumentFileType;
    uploadedBy: string;
    uploadedByName: string;
    comment?: string;
    createdAt: string;
}

export interface GedDocument {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    reference?: string;             // internal reference code e.g. PAN-DOC-2025-001
    fileType: DocumentFileType;
    categories: string[];           // multi-category
    theme: DocumentTheme;
    direction: DocumentDirection;
    keywords: string[];
    language: 'fr' | 'ar' | 'fr_ar';  // document language
    accessLevel: DocumentAccessLevel;
    status: DocumentStatus;
    versions: DocumentVersion[];    // version history (latest first)
    currentVersion: number;
    authorId: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;             // soft-delete
}

// Legacy alias for backward compat
export interface Document {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    type: DocumentFileType;
    fileUrl: string;
    fileSize: number;
    category: string;
    isPublic: boolean;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentFilters {
    search?: string;
    theme?: DocumentTheme;
    direction?: DocumentDirection;
    category?: string;
    accessLevel?: DocumentAccessLevel;
    status?: DocumentStatus;
    fileType?: DocumentFileType;
    language?: string;
    page?: number;
    pageSize?: number;
}

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

export type RequestType = 'information' | 'reclamation' | 'document_request' | 'rendez_vous';
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
