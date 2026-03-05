import type {
    GedDocument,
    DocumentFilters,
    DocumentStatus,
    DocumentVersion,
    DocumentFileType,
    PaginatedResult,
    AuditLogEntry,
    AuditAction,
} from '../types';
import { mockGedDocuments, mockAuditLog } from '../mock';

/**
 * In-memory GED document repository — designed to be swapped with a real DB later.
 */

let _documents: GedDocument[] = [...mockGedDocuments];
let _auditLog: AuditLogEntry[] = mockAuditLog; // shared with content repo
let _nextId = 100;
let _nextVerId = 1000;

function now() {
    return new Date().toISOString();
}

// ─── Read ─────────────────────────────────────────────────
export function getAllGedDocuments(): GedDocument[] {
    return _documents.filter((d) => !d.deletedAt);
}

export function getPublishedGedDocuments(filters?: DocumentFilters): PaginatedResult<GedDocument> {
    let items = _documents.filter((d) => d.status === 'published' && !d.deletedAt);

    if (filters?.theme) {
        items = items.filter((d) => d.theme === filters.theme);
    }
    if (filters?.direction) {
        items = items.filter((d) => d.direction === filters.direction);
    }
    if (filters?.category) {
        items = items.filter((d) => d.categories.includes(filters.category!));
    }
    if (filters?.accessLevel) {
        items = items.filter((d) => d.accessLevel === filters.accessLevel);
    }
    if (filters?.fileType) {
        items = items.filter((d) => d.fileType === filters.fileType);
    }
    if (filters?.language) {
        items = items.filter((d) => d.language === filters.language);
    }
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
            (d) =>
                d.title.fr.toLowerCase().includes(q) ||
                d.title.ar.includes(q) ||
                d.description.fr.toLowerCase().includes(q) ||
                d.keywords.some((k) => k.toLowerCase().includes(q)) ||
                (d.reference && d.reference.toLowerCase().includes(q)),
        );
    }

    // Sort by updatedAt desc
    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 9;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total, page, pageSize, totalPages };
}

/**
 * Get published documents accessible to the public (accessLevel = 'public')
 */
export function getPublicDocuments(filters?: DocumentFilters): PaginatedResult<GedDocument> {
    const enrichedFilters = { ...filters, accessLevel: 'public' as const };
    return getPublishedGedDocuments(enrichedFilters);
}

export function getGedDocumentById(id: string): GedDocument | undefined {
    return _documents.find((d) => d.id === id && !d.deletedAt);
}

export function getAdminGedDocuments(filters?: DocumentFilters): PaginatedResult<GedDocument> {
    let items = _documents.filter((d) => !d.deletedAt);

    if (filters?.theme) items = items.filter((d) => d.theme === filters.theme);
    if (filters?.direction) items = items.filter((d) => d.direction === filters.direction);
    if (filters?.category) items = items.filter((d) => d.categories.includes(filters.category!));
    if (filters?.accessLevel) items = items.filter((d) => d.accessLevel === filters.accessLevel);
    if (filters?.status) items = items.filter((d) => d.status === filters.status);
    if (filters?.fileType) items = items.filter((d) => d.fileType === filters.fileType);
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
            (d) =>
                d.title.fr.toLowerCase().includes(q) ||
                d.description.fr.toLowerCase().includes(q) ||
                d.keywords.some((k) => k.toLowerCase().includes(q)) ||
                (d.reference && d.reference.toLowerCase().includes(q)),
        );
    }

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total, page, pageSize, totalPages };
}

/**
 * Get all unique categories across all GED documents
 */
export function getGedCategories(): string[] {
    const cats = new Set<string>();
    _documents.forEach((d) => d.categories.forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
}

// ─── Write ────────────────────────────────────────────────
export function createGedDocument(
    data: Omit<GedDocument, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'currentVersion'> & {
        initialVersion: Omit<DocumentVersion, 'id' | 'versionNumber' | 'createdAt'>;
    },
): GedDocument {
    const id = `ged-${String(++_nextId).padStart(3, '0')}`;
    const version: DocumentVersion = {
        ...data.initialVersion,
        id: `ver-${String(++_nextVerId).padStart(3, '0')}-1`,
        versionNumber: 1,
        createdAt: now(),
    };

    const { initialVersion: _, ...rest } = data;
    const doc: GedDocument = {
        ...rest,
        id,
        currentVersion: 1,
        versions: [version],
        createdAt: now(),
        updatedAt: now(),
    };
    _documents.unshift(doc);
    addDocAudit(id, 'create', data.authorId, `Ajout: ${data.title.fr}`);
    return doc;
}

export function updateGedDocument(id: string, data: Partial<GedDocument>, userId: string): GedDocument | null {
    const idx = _documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    _documents[idx] = { ..._documents[idx], ...data, updatedAt: now() };
    addDocAudit(id, 'update', userId, `Modification: ${_documents[idx].title.fr}`);
    return _documents[idx];
}

export function deleteGedDocument(id: string, userId: string): boolean {
    const idx = _documents.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    _documents[idx] = { ..._documents[idx], deletedAt: now(), updatedAt: now() };
    addDocAudit(id, 'delete', userId, `Suppression: ${_documents[idx].title.fr}`);
    return true;
}

// ─── Versioning ───────────────────────────────────────────
export function uploadNewVersion(
    docId: string,
    versionData: Omit<DocumentVersion, 'id' | 'versionNumber' | 'createdAt'>,
    userId: string,
): GedDocument | null {
    const idx = _documents.findIndex((d) => d.id === docId);
    if (idx === -1) return null;

    const doc = _documents[idx];
    const newVersionNumber = doc.currentVersion + 1;
    const newVersion: DocumentVersion = {
        ...versionData,
        id: `ver-${String(++_nextVerId).padStart(3, '0')}-${newVersionNumber}`,
        versionNumber: newVersionNumber,
        createdAt: now(),
    };

    _documents[idx] = {
        ...doc,
        versions: [newVersion, ...doc.versions],
        currentVersion: newVersionNumber,
        fileType: versionData.fileType,
        updatedAt: now(),
    };

    addDocAudit(docId, 'upload_version', userId, `Version ${newVersionNumber} — ${versionData.comment || versionData.fileName}`);
    return _documents[idx];
}

// ─── Status workflow ──────────────────────────────────────
export function publishGedDocument(id: string, userId: string): GedDocument | null {
    const doc = getGedDocumentById(id);
    if (!doc || doc.status === 'published') return null;
    return updateStatusWithAudit(id, 'published', 'publish', userId);
}

export function archiveGedDocument(id: string, userId: string): GedDocument | null {
    const doc = getGedDocumentById(id);
    if (!doc || doc.status !== 'published') return null;
    return updateStatusWithAudit(id, 'archived', 'archive', userId);
}

export function restoreGedDocument(id: string, userId: string): GedDocument | null {
    const doc = getGedDocumentById(id);
    if (!doc || doc.status !== 'archived') return null;
    return updateStatusWithAudit(id, 'draft', 'restore', userId);
}

function updateStatusWithAudit(
    id: string,
    newStatus: DocumentStatus,
    action: AuditAction,
    userId: string,
): GedDocument | null {
    const idx = _documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    const prev = _documents[idx].status;
    _documents[idx] = {
        ..._documents[idx],
        status: newStatus,
        publishedAt: newStatus === 'published' ? now() : _documents[idx].publishedAt,
        updatedAt: now(),
    };
    addDocAudit(id, action, userId, undefined, prev, newStatus);
    return _documents[idx];
}

// ─── Audit helpers ────────────────────────────────────────
function addDocAudit(
    entityId: string,
    action: AuditAction,
    userId: string,
    details?: string,
    previousStatus?: string,
    newStatus?: string,
) {
    _auditLog.unshift({
        id: `log-${String(_auditLog.length + 1).padStart(3, '0')}`,
        entityType: 'document',
        entityId,
        action,
        userId,
        userName: getUserName(userId),
        details,
        previousStatus,
        newStatus,
        createdAt: now(),
    });
}

export function getDocumentAuditLog(entityId?: string): AuditLogEntry[] {
    const docLogs = _auditLog.filter((l) => l.entityType === 'document');
    if (entityId) return docLogs.filter((l) => l.entityId === entityId);
    return docLogs;
}

function getUserName(userId: string): string {
    const names: Record<string, string> = {
        'usr-001': 'Ahmed Ould Mohamed',
        'usr-002': 'Fatima Mint Cheikh',
        'usr-003': 'Mohamed Salem',
    };
    return names[userId] || 'Système';
}

// ─── Reset (for tests) ───────────────────────────────────
export function resetDocumentRepository() {
    _documents = [...mockGedDocuments];
    _nextId = 100;
    _nextVerId = 1000;
}
