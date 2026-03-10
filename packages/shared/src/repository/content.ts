import type { Content, ContentCategory, ContentStatus, ContentFilters, PaginatedResult, AuditLogEntry, AuditAction } from '../types';
import { mockContents, mockAuditLog } from '../mock';
import * as path from 'path';

/**
 * In-memory content repository with JSON persistence for local dev sync.
 */

let _contents: Content[] = [];
let _auditLog: AuditLogEntry[] = [];
let _nextId = 100;

// Path to a shared JSON file in a stable location for local dev sync
const DB_PATH = typeof window === 'undefined' ? '/tmp/pansite_db.json' : '';

function loadDB() {
    if (typeof window !== 'undefined') {
        // In browser, we can't read files, so we just return the in-memory state
        return;
    }

    try {
        const fs = require('fs');
        if (fs.existsSync(DB_PATH)) {
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            _contents = data.contents || [];
            _auditLog = data.auditLog || [];
            _nextId = data.nextId || 100;
        } else {
            console.log('Seeding DB at:', DB_PATH);
            _contents = [...mockContents];
            _auditLog = [...mockAuditLog];
            saveDB();
        }
    } catch (e) {
        console.warn('Persistence failed, using memory:', e);
        _contents = [...mockContents];
        _auditLog = [...mockAuditLog];
    }
}

function saveDB() {
    if (typeof window !== 'undefined') return;
    try {
        const fs = require('fs');
        const data = JSON.stringify({ contents: _contents, auditLog: _auditLog, nextId: _nextId }, null, 2);
        fs.writeFileSync(DB_PATH, data);
    } catch (e) {
        console.error('Failed to save to DB:', e);
    }
}

// Initial load
loadDB();

function now() {
    return new Date().toISOString();
}

// ─── Read ─────────────────────────────────────────────────
export function getAllContents(): Content[] {
    loadDB();
    return _contents.filter((c) => !c.deletedAt);
}

export function getPublishedContents(filters?: ContentFilters): PaginatedResult<Content> {
    loadDB();
    let items = _contents.filter((c) => c.status === 'published' && !c.deletedAt);

    if (filters?.category) {
        items = items.filter((c) => c.category === filters.category);
    }
    if (filters?.tag) {
        items = items.filter((c) => c.tags.includes(filters.tag!));
    }
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
            (c) =>
                c.title.fr.toLowerCase().includes(q) ||
                c.title.ar.includes(q) ||
                (c.title.en && c.title.en.toLowerCase().includes(q)) ||
                (c.title.es && c.title.es.toLowerCase().includes(q)) ||
                c.excerpt.fr.toLowerCase().includes(q) ||
                (c.excerpt.en && c.excerpt.en.toLowerCase().includes(q)) ||
                (c.excerpt.es && c.excerpt.es.toLowerCase().includes(q)) ||
                c.tags.some((t) => t.toLowerCase().includes(q)),
        );
    }

    // Sort by publishedAt desc
    items.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 6;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total, page, pageSize, totalPages };
}

export function getContentBySlug(slug: string): Content | undefined {
    loadDB();
    return _contents.find((c) => c.slug === slug && !c.deletedAt);
}

export function getContentById(id: string): Content | undefined {
    loadDB();
    return _contents.find((c) => c.id === id);
}

export function getContentsByCategory(category: ContentCategory): Content[] {
    loadDB();
    return _contents
        .filter((c) => c.category === category && c.status === 'published' && !c.deletedAt)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}

export function getActiveAlerts(): Content[] {
    loadDB();
    const today = new Date();
    return _contents.filter(
        (c) =>
            c.category === 'alerte' &&
            c.status === 'published' &&
            !c.deletedAt &&
            (!c.expiresAt || new Date(c.expiresAt) > today),
    );
}

export function getLatestContents(limit: number = 4): Content[] {
    loadDB();
    return _contents
        .filter((c) => c.status === 'published' && !c.deletedAt)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
        .slice(0, limit);
}

export function getAdminContents(filters?: ContentFilters): PaginatedResult<Content> {
    loadDB();
    let items = _contents.filter((c) => !c.deletedAt);

    if (filters?.category) items = items.filter((c) => c.category === filters.category);
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((c) => c.title.fr.toLowerCase().includes(q) || c.slug.includes(q));
    }

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total, page, pageSize, totalPages };
}

// ─── Write ────────────────────────────────────────────────
export function createContent(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Content {
    loadDB();
    const content: Content = {
        ...data,
        id: `cnt-${String(++_nextId).padStart(3, '0')}`,
        createdAt: now(),
        updatedAt: now(),
    };
    _contents.unshift(content);
    addAuditEntry('content', content.id, 'create', data.authorId, getUserName(data.authorId));
    saveDB();
    return content;
}

export function updateContent(id: string, data: Partial<Content>, userId: string): Content | null {
    loadDB();
    const idx = _contents.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    _contents[idx] = { ..._contents[idx], ...data, updatedAt: now() };
    addAuditEntry('content', id, 'update', userId, getUserName(userId));
    saveDB();
    return _contents[idx];
}

export function deleteContent(id: string, userId: string): boolean {
    loadDB();
    const idx = _contents.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    _contents[idx] = { ..._contents[idx], deletedAt: now(), updatedAt: now() };
    addAuditEntry('content', id, 'delete', userId, getUserName(userId));
    saveDB();
    return true;
}

// ─── Workflow actions ─────────────────────────────────────
export function submitForReview(id: string, userId: string): Content | null {
    const content = getContentById(id);
    if (!content || content.status !== 'draft') return null;
    return updateStatusWithAudit(id, 'pending_approval', 'submit_for_review', userId);
}

export function approveContent(id: string, userId: string): Content | null {
    const content = getContentById(id);
    if (!content || content.status !== 'pending_approval') return null;
    return updateStatusWithAudit(id, 'published', 'approve', userId);
}

export function publishContent(id: string, userId: string): Content | null {
    const content = getContentById(id);
    if (!content || (content.status !== 'draft' && content.status !== 'pending_approval')) return null;
    return updateStatusWithAudit(id, 'published', 'publish', userId);
}

export function archiveContent(id: string, userId: string): Content | null {
    const content = getContentById(id);
    if (!content || content.status !== 'published') return null;
    return updateStatusWithAudit(id, 'archived', 'archive', userId);
}

export function restoreContent(id: string, userId: string): Content | null {
    const content = getContentById(id);
    if (!content || content.status !== 'archived') return null;
    return updateStatusWithAudit(id, 'draft', 'restore', userId);
}

function updateStatusWithAudit(
    id: string,
    newStatus: ContentStatus,
    action: AuditAction,
    userId: string,
): Content | null {
    loadDB();
    const idx = _contents.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const prev = _contents[idx].status;
    _contents[idx] = {
        ..._contents[idx],
        status: newStatus,
        publishedAt: newStatus === 'published' ? now() : _contents[idx].publishedAt,
        updatedAt: now(),
    };
    addAuditEntry('content', id, action, userId, getUserName(userId), undefined, prev, newStatus);
    saveDB();
    return _contents[idx];
}

// ─── Audit log ────────────────────────────────────────────
function addAuditEntry(
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    action: AuditAction,
    userId: string,
    userName: string,
    details?: string,
    previousStatus?: string,
    newStatus?: string,
) {
    _auditLog.unshift({
        id: `log-${String(_auditLog.length + 1).padStart(3, '0')}`,
        entityType,
        entityId,
        action,
        userId,
        userName,
        details,
        previousStatus,
        newStatus,
        createdAt: now(),
    });
}

export function getAuditLog(entityId?: string): AuditLogEntry[] {
    if (entityId) return _auditLog.filter((l) => l.entityId === entityId);
    return _auditLog;
}

// ─── Reset (for tests) ───────────────────────────────────
export function resetRepository() {
    _contents = [...mockContents];
    _auditLog = [...mockAuditLog];
    _nextId = 100;
}

// ─── Helpers ──────────────────────────────────────────────
function getUserName(userId: string): string {
    const names: Record<string, string> = {
        'usr-001': 'Ahmed Ould Mohamed',
        'usr-002': 'Fatima Mint Cheikh',
        'usr-003': 'Mohamed Salem',
    };
    return names[userId] || 'Système';
}
