import type { Request, RequestType, RequestStatus, RequestPriority, RequestFilters, RequestAttachment, PaginatedResult, DocumentDirection, AuditAction } from '../types';
import { getSupabase, getSupabaseAdmin } from '../supabase';


/**
 * Supabase-backed request repository.
 */

function now() { return new Date().toISOString(); }

// ─── Helpers ──────────────────────────────────────────────
function mapToRequest(row: any): Request {
    return {
        id: row.id,
        reference: row.reference,
        type: row.type as RequestType,
        subject: row.subject,
        message: row.message,
        senderName: row.sender_name,
        senderEmail: row.sender_email,
        senderPhone: row.sender_phone,
        senderCompany: row.sender_company,
        status: row.status as RequestStatus,
        priority: row.priority as RequestPriority,
        assignedTo: row.assigned_to,
        assignedToName: row.assigned_to_name,
        assignedDepartment: row.assigned_department as DocumentDirection,
        responseMessage: row.response_message,
        serviceId: row.service_id,
        serviceName: row.service_name,
        attachments: row.attachments || [],
        statusHistory: row.status_history || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        closedAt: row.closed_at,
    };
}

function mapToRow(req: Partial<Request>) {
    const row: any = {};
    if (req.reference !== undefined) row.reference = req.reference;
    if (req.type !== undefined) row.type = req.type;
    if (req.subject !== undefined) row.subject = req.subject;
    if (req.message !== undefined) row.message = req.message;
    if (req.senderName !== undefined) row.sender_name = req.senderName;
    if (req.senderEmail !== undefined) row.sender_email = req.senderEmail;
    if (req.senderPhone !== undefined) row.sender_phone = req.senderPhone;
    if (req.senderCompany !== undefined) row.sender_company = req.senderCompany;
    if (req.status !== undefined) row.status = req.status;
    if (req.priority !== undefined) row.priority = req.priority;
    if (req.assignedTo !== undefined) row.assigned_to = req.assignedTo;
    if (req.assignedToName !== undefined) row.assigned_to_name = req.assignedToName;
    if (req.assignedDepartment !== undefined) row.assigned_department = req.assignedDepartment;
    if (req.responseMessage !== undefined) row.response_message = req.responseMessage;
    if (req.serviceId !== undefined) row.service_id = req.serviceId;
    if (req.serviceName !== undefined) row.service_name = req.serviceName;
    if (req.attachments !== undefined) row.attachments = req.attachments;
    if (req.statusHistory !== undefined) row.status_history = req.statusHistory;
    if (req.updatedAt !== undefined) row.updated_at = req.updatedAt;
    if (req.closedAt !== undefined) row.closed_at = req.closedAt;
    return row;
}

// ─── Read ─────────────────────────────────────────────────
export async function getAllRequests(): Promise<Request[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToRequest);
}

export async function getRequestById(id: string): Promise<Request | null> {
    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return mapToRequest(data);
}

export async function getFilteredRequests(filters: RequestFilters): Promise<PaginatedResult<Request>> {
    let query = getSupabaseAdmin()
        .from('requests')
        .select('*', { count: 'exact' });

    if (filters.search) {
        const q = `%${filters.search.toLowerCase()}%`;
        query = query.or(`subject.ilike.${q},sender_name.ilike.${q},sender_email.ilike.${q},reference.ilike.${q},message.ilike.${q}`);
    }
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.department) query = query.eq('assigned_department', filters.department);
    if (filters.serviceId) query = query.eq('service_id', filters.serviceId);

    // Sort by priority (urgent first), then by date
    // Note: Complex multi-column sorting with custom logic might need order() calls per priority or post-processing
    // For now, simpler order by created_at desc
    query = query.order('created_at', { ascending: false });

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const items = (data || []).map(mapToRequest);
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
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
    serviceName?: string;
    attachments?: Omit<RequestAttachment, 'id' | 'uploadedAt'>[];
}

export async function createRequest(input: CreateRequestInput): Promise<Request> {
    // Generate a reference (ideally this should be done in DB trigger or a separate counter table)
    // For simplicity, we'll use a random slug-like reference or count first
    const { count } = await getSupabaseAdmin().from('requests').select('*', { count: 'exact', head: true });
    const ref = `PAN-REQ-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(3, '0')}`;

    const newReq: any = {
        reference: ref,
        type: input.type,
        subject: input.subject,
        message: input.message,
        sender_name: input.senderName,
        sender_email: input.senderEmail,
        sender_phone: input.senderPhone,
        sender_company: input.senderCompany,
        status: 'new',
        priority: 'normal',
        service_id: input.serviceId,
        service_name: input.serviceName,
        attachments: (input.attachments || []).map((a, i) => ({
            ...a,
            id: `att-${Date.now()}-${i}`,
            uploadedAt: now(),
        })),
        status_history: [
            { id: `sh-${Date.now()}-0`, status: 'new', changedBy: 'system', changedByName: 'Système', createdAt: now() },
        ],
    };

    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .insert([newReq])
        .select()
        .single();

    if (error) throw error;

    const req = mapToRequest(data);

    // Audit log
    await addAuditEntry('request', req.id, 'create', 'system', 'Système', `Nouvelle demande: ${req.subject}`);

    // Trigger notification (mock for now)
    console.log(`📧 [NOTIFICATION] To: ${req.senderEmail} - Your request ${req.reference} has been received.`);

    return req;
}

// ─── Status Workflow ──────────────────────────────────────
export async function assignRequest(id: string, assignedTo: string, assignedToName: string, department: DocumentDirection, changedBy: string) {
    const current = await getRequestById(id);
    if (!current) return null;

    const prev = current.status;
    const newStatusHistory = [...current.statusHistory, {
        id: `sh-${id}-${current.statusHistory.length}-${Date.now()}`,
        status: 'assigned' as RequestStatus,
        comment: `Affectée à ${assignedToName} (${departmentLabel(department)})`,
        changedBy,
        changedByName: assignedToName,
        createdAt: now(),
    }];

    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .update({
            status: 'assigned',
            assigned_to: assignedTo,
            assigned_to_name: assignedToName,
            assigned_department: department,
            status_history: newStatusHistory,
            updated_at: now(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    const updated = mapToRequest(data);

    await addAuditEntry('request', id, 'assign', changedBy, assignedToName, `Affectation à ${assignedToName}`, prev, 'assigned');

    return updated;
}

export async function changeRequestStatus(id: string, newStatus: RequestStatus, comment: string, changedBy: string, changedByName: string) {
    const current = await getRequestById(id);
    if (!current) return null;

    const prev = current.status;
    const newStatusHistory = [...current.statusHistory, {
        id: `sh-${id}-${current.statusHistory.length}-${Date.now()}`,
        status: newStatus,
        comment: comment || undefined,
        changedBy,
        changedByName,
        createdAt: now(),
    }];

    const updates: any = {
        status: newStatus,
        status_history: newStatusHistory,
        updated_at: now(),
    };
    if (newStatus === 'closed') updates.closed_at = now();

    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    const updated = mapToRequest(data);

    await addAuditEntry('request', id, 'status_change', changedBy, changedByName, comment || `Statut changé: ${prev} → ${newStatus}`, prev, newStatus);

    return updated;
}

export async function respondToRequest(id: string, response: string, changedBy: string, changedByName: string) {
    const { data, error } = await getSupabaseAdmin()
        .from('requests')
        .update({
            response_message: response,
            updated_at: now(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    await addAuditEntry('request', id, 'respond', changedBy, changedByName, `Réponse envoyée au demandeur`);

    return mapToRequest(data);
}

// ─── Stats ────────────────────────────────────────────────
export async function getRequestStats() {
    const { data: all, error } = await getSupabaseAdmin().from('requests').select('status, type, created_at, closed_at');
    if (error) throw error;

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
        rendez_vous: all.filter((r) => r.type === 'rendez_vous').length,
    };

    const closed = all.filter((r) => r.closed_at);
    const avgMs = closed.length > 0
        ? closed.reduce((sum, r) => sum + (new Date(r.closed_at!).getTime() - new Date(r.created_at).getTime()), 0) / closed.length
        : 0;
    const avgHours = Math.round(avgMs / (1000 * 60 * 60));

    return { total: all.length, byStatus, byType, avgProcessingHours: avgHours };
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

// ─── Audit log helper ─────────────────────────────────────
async function addAuditEntry(
    entityType: 'content' | 'service' | 'user' | 'session' | 'request',
    entityId: string,
    action: AuditAction,
    userId: string,
    userName: string,
    details?: string,
    previousStatus?: string,
    newStatus?: string,
) {
    await getSupabaseAdmin().from('audit_log').insert([{
        entity_type: entityType,
        entity_id: entityId,
        action,
        user_id: userId,
        user_name: userName,
        details,
        previous_status: previousStatus,
        new_status: newStatus,
    }]);
}
