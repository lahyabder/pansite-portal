'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, PermissionModule, PermissionAction } from '@pan/shared';
import { hasPermission, mockUsers, mockAuditLog, ROLE_LABELS } from '@pan/shared';

// ─── Session type ─────────────────────────────────────────
interface Session {
    user: User;
    loginAt: string;
    expiresAt: string;
    csrfToken: string;
}

interface AuthContextType {
    session: Session | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    can: (module: PermissionModule, action: PermissionAction) => boolean;
    canAny: (module: PermissionModule) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Rate limiting ────────────────────────────────────────
const LOGIN_RATE_LIMIT = 5;        // max attempts
const LOGIN_RATE_WINDOW = 300_000; // 5 minutes
const LOCKOUT_DURATION = 900_000;  // 15 minutes
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Mock credentials: email → password
const MOCK_CREDENTIALS: Record<string, string> = {
    'admin@pan.mr': 'admin',
    'fatima@pan.mr': 'editor',
    'ibrahim@pan.mr': 'ged',
    'aissata@pan.mr': 'services',
    'sidi@pan.mr': 'validator',
    'maryam@pan.mr': 'reader',
};

interface LoginAttempt {
    timestamp: number;
    success: boolean;
}

let loginAttempts: LoginAttempt[] = [];

function generateCsrfToken(): string {
    return Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

function isRateLimited(): { limited: boolean; retryAfterMs: number } {
    const now = Date.now();
    loginAttempts = loginAttempts.filter(a => now - a.timestamp < LOGIN_RATE_WINDOW);
    const failedRecent = loginAttempts.filter(a => !a.success);
    if (failedRecent.length >= LOGIN_RATE_LIMIT) {
        const oldestFail = failedRecent[0].timestamp;
        const retryAfterMs = LOGIN_RATE_WINDOW - (now - oldestFail);
        return { limited: true, retryAfterMs };
    }
    return { limited: false, retryAfterMs: 0 };
}

function isAccountLocked(user: User): boolean {
    if (user.lockedUntil) {
        return new Date(user.lockedUntil).getTime() > Date.now();
    }
    if (user.failedLoginAttempts >= LOGIN_RATE_LIMIT) {
        return true;
    }
    return false;
}

function logAudit(action: 'login' | 'logout' | 'failed_login' | 'permission_denied', userId: string, userName: string, details: string) {
    mockAuditLog.unshift({
        id: `audit-auth-${Date.now()}`,
        entityType: 'session',
        entityId: userId,
        action,
        userId,
        userName,
        details,
        ipAddress: '127.0.0.1',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'unknown',
        createdAt: new Date().toISOString(),
    });
}

// ─── File upload validation ───────────────────────────────
export const FILE_UPLOAD_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/webp',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.webp'],
    maxFilenameLength: 200,
    forbiddenPatterns: [/\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.sh$/i, /\.js$/i, /\.php$/i, /\.py$/i, /\.\./],
};

export function validateFileUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
    // Size check
    if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
        return { valid: false, error: `Fichier trop volumineux (max ${FILE_UPLOAD_CONFIG.maxFileSize / 1024 / 1024} Mo)` };
    }
    // Extension check
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
        return { valid: false, error: `Extension non autorisée: ${ext}` };
    }
    // Mime type check
    if (file.type && !FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
        return { valid: false, error: `Type de fichier non autorisé: ${file.type}` };
    }
    // Filename length
    if (file.name.length > FILE_UPLOAD_CONFIG.maxFilenameLength) {
        return { valid: false, error: 'Nom de fichier trop long' };
    }
    // Forbidden patterns
    for (const pattern of FILE_UPLOAD_CONFIG.forbiddenPatterns) {
        if (pattern.test(file.name)) {
            return { valid: false, error: 'Nom de fichier interdit (pattern dangereux)' };
        }
    }
    return { valid: true };
}

// ─── Public form rate limiting ────────────────────────────
const FORM_RATE_LIMIT = 3;
const FORM_RATE_WINDOW = 60_000; // 1 minute
let formSubmissions: number[] = [];

export function checkFormRateLimit(): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    formSubmissions = formSubmissions.filter(t => now - t < FORM_RATE_WINDOW);
    if (formSubmissions.length >= FORM_RATE_LIMIT) {
        return { allowed: false, retryAfterMs: FORM_RATE_WINDOW - (now - formSubmissions[0]) };
    }
    formSubmissions.push(now);
    return { allowed: true, retryAfterMs: 0 };
}

// ─── Provider ─────────────────────────────────────────────
const SESSION_KEY = 'pan_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);

    // Restore session from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as Session;
                if (new Date(parsed.expiresAt).getTime() > Date.now()) {
                    setSession(parsed);
                } else {
                    localStorage.removeItem(SESSION_KEY);
                }
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Rate limit check
        const rateCheck = isRateLimited();
        if (rateCheck.limited) {
            console.warn('[Auth] Login rate limited', rateCheck);
            const secs = Math.ceil(rateCheck.retryAfterMs / 1000);
            return { success: false, error: `Trop de tentatives. Réessayez dans ${secs}s.` };
        }

        console.log(`[Auth] Attempting login for: ${email}`);
        
        // Simulate network delay
        try {
            await new Promise((resolve, reject) => {
                const timer = setTimeout(resolve, 600);
                // Optional: add a way to force fail for testing
            });
        } catch (err) {
            console.error('[Auth] Simulation delay failed', err);
            return { success: false, error: 'Erreur technique lors de la simulation.' };
        }

        const user = mockUsers.find(u => u.email === email);

        // Check user exists
        if (!user || MOCK_CREDENTIALS[email] !== password) {
            console.warn(`[Auth] Invalid credentials for: ${email}`);
            loginAttempts.push({ timestamp: Date.now(), success: false });
            logAudit('failed_login', email, email, `Tentative échouée pour: ${email}`);
            return { success: false, error: 'Email ou mot de passe incorrect.' };
        }

        // Check if account is active
        if (!user.isActive) {
            logAudit('failed_login', user.id, user.name, 'Compte désactivé');
            return { success: false, error: 'Compte désactivé. Contactez l\'administrateur.' };
        }

        // Check account lock
        if (isAccountLocked(user)) {
            logAudit('failed_login', user.id, user.name, 'Compte verrouillé');
            return { success: false, error: 'Compte verrouillé temporairement.' };
        }

        // Success
        console.log(`[Auth] Login successful for: ${user.name} (${user.role})`);
        loginAttempts.push({ timestamp: Date.now(), success: true });
        const now = new Date();
        const sess: Session = {
            user,
            loginAt: now.toISOString(),
            expiresAt: new Date(now.getTime() + SESSION_DURATION).toISOString(),
            csrfToken: generateCsrfToken(),
        };
        
        try {
            setSession(sess);
            localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
            console.log('[Auth] Session saved to localStorage');
        } catch (lsErr) {
            console.error('[Auth] Failed to save session to localStorage', lsErr);
            // We can still proceed if state is set, but session won't persist
        }

        logAudit('login', user.id, user.name, `Connexion réussie (${ROLE_LABELS[user.role]})`);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        if (session) {
            logAudit('logout', session.user.id, session.user.name, 'Déconnexion');
        }
        setSession(null);
        localStorage.removeItem(SESSION_KEY);
    }, [session]);

    const can = useCallback((module: PermissionModule, action: PermissionAction): boolean => {
        if (!session) return false;
        return hasPermission(session.user.role, module, action);
    }, [session]);

    const canAny = useCallback((module: PermissionModule): boolean => {
        if (!session) return false;
        return hasPermission(session.user.role, module, 'view');
    }, [session]);

    return (
        <AuthContext.Provider value={{
            session,
            isAuthenticated: !!session,
            login,
            logout,
            can,
            canAny,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

// ─── Route guard component ────────────────────────────────
export function RequirePermission({
    module,
    action = 'view',
    children,
    fallback,
}: {
    module: PermissionModule;
    action?: PermissionAction;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { can } = useAuth();
    if (!can(module, action)) {
        return fallback ?? (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="text-lg font-bold text-admin-text mb-1">Accès refusé</h3>
                    <p className="text-admin-text-muted text-sm">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette section.</p>
                </div>
            </div>
        );
    }
    return <>{children}</>;
}
