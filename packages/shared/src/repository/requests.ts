import type { Request, RequestType, RequestStatus, RequestPriority, RequestFilters, RequestAttachment, PaginatedResult, DocumentDirection } from '../types';
import { mockRequests, mockServices, mockAuditLog } from '../mock';

// ─── In-memory store ──────────────────────────────────────
let requests = [...mockRequests];
let nextId = 7;

// ─── Helpers ──────────────────────────────────────────────
function now() { return new Date().toISOString(); }
function genRef() { return `PAN-REQ-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`; }

// ─── Read ─────────────────────────────────────────────────
export function getAllRequests(): Request[] {
    return [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getRequestById(id: string): Request | null {
    return requests.find((r) => r.id === id) || null;
}

export function getFilteredRequests(filters: RequestFilters): PaginatedResult<Request> {
    let result = [...requests];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((r) =>
            r.subject.toLowerCase().includes(q)
            || r.senderName.toLowerCase().includes(q)
            || r.senderEmail.toLowerCase().includes(q)
            || r.reference.toLowerCase().includes(q)
            || r.message.toLowerCase().includes(q)
        );
    }
    if (filters.type) result = result.filter((r) => r.type === filters.type);
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    if (filters.priority) result = result.filter((r) => r.priority === filters.priority);
    if (filters.department) result = result.filter((r) => r.assignedDepartment === filters.department);
    if (filters.serviceId) result = result.filter((r) => r.serviceId === filters.serviceId);

    // Sort by priority (urgent first), then by date
    const priorityOrder: Record<RequestPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
    result.sort((a, b) => {
        const pa = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (pa !== 0) return pa;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─── Create ───────────────────────────────────────────────
interface CreateRequestInput {
    type: RequestType;
    subject: string;
    message: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    senderCompany?: string;
    serviceId?: string;
    attachments?: Omit<RequestAttachment, 'id' | 'uploadedAt'>[];
}

export function createRequest(input: CreateRequestInput): Request {
    const id = `req-${String(nextId).padStart(3, '0')}`;
    const ref = genRef();
    nextId++;

    const service = input.serviceId ? mockServices.find((s) => s.id === input.serviceId) : null;

    const req: Request = {
        id,
        reference: ref,
        type: input.type,
        subject: input.subject,
        message: input.message,
        senderName: input.senderName,
        senderEmail: input.senderEmail,
        senderPhone: input.senderPhone,
        senderCompany: input.senderCompany,
        status: 'new',
        priority: 'normal',
        serviceId: input.serviceId,
        serviceName: service?.name.fr,
        attachments: (input.attachments || []).map((a, i) => ({
            ...a,
            id: `att-${id}-${i}`,
            uploadedAt: now(),
        })),
        statusHistory: [
            { id: `sh-${id}-0`, status: 'new', changedBy: 'system', changedByName: 'Système', createdAt: now() },
        ],
        createdAt: now(),
        updatedAt: now(),
    };

    requests.push(req);

    // Audit log
    mockAuditLog.unshift({
        id: `audit-req-${id}`,
        entityType: 'request',
        entityId: id,
        action: 'create',
        userId: 'system',
        userName: 'Système',
        details: `Nouvelle demande: ${req.subject}`,
        createdAt: now(),
    });

    // Trigger notification
    sendNotification({
        to: input.senderEmail,
        subject: `Votre demande ${ref} a été reçue`,
        body: `Bonjour ${input.senderName},\n\nVotre demande "${input.subject}" a bien été enregistrée sous la référence ${ref}.\n\nNous la traiterons dans les meilleurs délais.\n\nCordialement,\nPort Autonome de Nouadhibou`,
    });

    return req;
}

// ─── Status Workflow ──────────────────────────────────────
export function assignRequest(id: string, assignedTo: string, assignedToName: string, department: DocumentDirection, changedBy: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return null;

    const prev = req.status;
    req.status = 'assigned';
    req.assignedTo = assignedTo;
    req.assignedToName = assignedToName;
    req.assignedDepartment = department;
    req.updatedAt = now();
    req.statusHistory.push({
        id: `sh-${id}-${req.statusHistory.length}`,
        status: 'assigned',
        comment: `Affectée à ${assignedToName} (${departmentLabel(department)})`,
        changedBy,
        changedByName: assignedToName,
        createdAt: now(),
    });

    mockAuditLog.unshift({
        id: `audit-assign-${id}-${Date.now()}`,
        entityType: 'request',
        entityId: id,
        action: 'assign',
        userId: changedBy,
        userName: assignedToName,
        details: `Affectation à ${assignedToName}`,
        previousStatus: prev,
        newStatus: 'assigned',
        createdAt: now(),
    });

    sendNotification({
        to: req.senderEmail,
        subject: `Votre demande ${req.reference} a été prise en charge`,
        body: `Votre demande "${req.subject}" a été affectée au service ${departmentLabel(department)}.`,
    });

    return req;
}

export function changeRequestStatus(id: string, newStatus: RequestStatus, comment: string, changedBy: string, changedByName: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return null;

    const prev = req.status;
    req.status = newStatus;
    req.updatedAt = now();
    if (newStatus === 'closed') req.closedAt = now();

    req.statusHistory.push({
        id: `sh-${id}-${req.statusHistory.length}`,
        status: newStatus,
        comment: comment || undefined,
        changedBy,
        changedByName,
        createdAt: now(),
    });

    mockAuditLog.unshift({
        id: `audit-status-${id}-${Date.now()}`,
        entityType: 'request',
        entityId: id,
        action: 'status_change',
        userId: changedBy,
        userName: changedByName,
        details: comment || `Statut changé: ${prev} → ${newStatus}`,
        previousStatus: prev,
        newStatus,
        createdAt: now(),
    });

    const statusFrench: Record<RequestStatus, string> = {
        new: 'Nouvelle',
        assigned: 'Assignée',
        in_progress: 'En cours',
        waiting_more_info: 'En attente d\'informations',
        approved: 'Approuvée',
        rejected: 'Rejetée',
        closed: 'Clôturée',
    };

    sendNotification({
        to: req.senderEmail,
        subject: `Mise à jour de votre demande ${req.reference}`,
        body: `Votre demande "${req.subject}" est passée au statut: ${statusFrench[newStatus]}.\n${comment ? `\nCommentaire: ${comment}` : ''}`,
    });

    return req;
}

export function respondToRequest(id: string, response: string, changedBy: string, changedByName: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return null;

    req.responseMessage = response;
    req.updatedAt = now();

    mockAuditLog.unshift({
        id: `audit-respond-${id}-${Date.now()}`,
        entityType: 'request',
        entityId: id,
        action: 'respond',
        userId: changedBy,
        userName: changedByName,
        details: `Réponse envoyée au demandeur`,
        createdAt: now(),
    });

    sendNotification({
        to: req.senderEmail,
        subject: `Réponse à votre demande ${req.reference}`,
        body: `Bonjour ${req.senderName},\n\n${response}\n\nCordialement,\nPort Autonome de Nouadhibou`,
    });

    return req;
}

// ─── Stats ────────────────────────────────────────────────
export function getRequestStats() {
    const all = requests;
    const byStatus = {
        new: all.filter((r) => r.status === 'new').length,
        assigned: all.filter((r) => r.status === 'assigned').length,
        in_progress: all.filter((r) => r.status === 'in_progress').length,
        waiting_more_info: all.filter((r) => r.status === 'waiting_more_info').length,
        approved: all.filter((r) => r.status === 'approved').length,
        rejected: all.filter((r) => r.status === 'rejected').length,
        closed: all.filter((r) => r.status === 'closed').length,
    };
    const byType = {
        information: all.filter((r) => r.type === 'information').length,
        reclamation: all.filter((r) => r.type === 'reclamation').length,
        document_request: all.filter((r) => r.type === 'document_request').length,
        rendez_vous: all.filter((r) => r.type === 'rendez_vous').length,
    };

    // Mock avg processing time
    const closed = all.filter((r) => r.closedAt);
    const avgMs = closed.length > 0
        ? closed.reduce((sum, r) => sum + (new Date(r.closedAt!).getTime() - new Date(r.createdAt).getTime()), 0) / closed.length
        : 0;
    const avgHours = Math.round(avgMs / (1000 * 60 * 60));

    // Per-service breakdown
    const byService = mockServices.map((s) => ({
        serviceId: s.id,
        serviceName: s.name.fr,
        count: all.filter((r) => r.serviceId === s.id).length,
    })).filter((s) => s.count > 0);

    return { total: all.length, byStatus, byType, avgProcessingHours: avgHours, byService };
}

// ─── Department label helper ──────────────────────────────
function departmentLabel(d: DocumentDirection): string {
    const labels: Record<DocumentDirection, string> = {
        direction_generale: 'Direction Générale',
        direction_exploitation: 'Direction Exploitation',
        direction_commerciale: 'Direction Commerciale',
        direction_technique: 'Direction Technique',
        direction_financiere: 'Direction Financière',
        direction_rh: 'Direction RH',
        capitainerie: 'Capitainerie',
        securite: 'Service Sécurité',
        autre: 'Autre',
    };
    return labels[d] || d;
}

// ─── Notification Provider (Mock → swap to SMTP later) ───
interface EmailNotification {
    to: string;
    subject: string;
    body: string;
}

const notificationLog: EmailNotification[] = [];

function sendNotification(email: EmailNotification) {
    // Mock provider: log to console + in-memory store
    notificationLog.push(email);
    console.log(`\n📧 [NOTIFICATION] To: ${email.to}`);
    console.log(`   Subject: ${email.subject}`);
    console.log(`   Body: ${email.body.substring(0, 120)}...`);
    console.log('');
}

export function getNotificationLog(): EmailNotification[] {
    return [...notificationLog];
}

export function resetRequestRepository() {
    requests = [...mockRequests];
    nextId = 7;
}
