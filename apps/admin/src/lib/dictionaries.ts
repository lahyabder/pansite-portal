import type { Locale } from '@pan/shared';

export type AdminDictionary = {
    sidebar: {
        principal: string;
        dashboard: string;
        content: string;
        contents: string;
        documents: string;
        media: string;
        operational: string;
        services: string;
        requests: string;
        tenders: string;
        administration: string;
        users: string;
        analytics: string;
        audit: string;
        settings: string;
        logout: string;
        twoFactorActive: string;
    };
    topbar: {
        portName: string;
        notifications: string;
        titles: {
            dashboard: string;
            contents: string;
            newContent: string;
            editContent: string;
            documents: string;
            newDocument: string;
            editDocument: string;
            versionHistory: string;
            media: string;
            services: string;
            requests: string;
            tenders: string;
            users: string;
            analytics: string;
            audit: string;
            settings: string;
        };
    };
    dashboard: {
        activeServices: string;
        publishedArticles: string;
        pendingRequests: string;
        trafficTons: string;
        lastRequests: string;
        lastContents: string;
        status: {
            new: string;
            closed: string;
            published: string;
            draft: string;
            archived: string;
        };
    };
    common: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        create: string;
        view: string;
        search: string;
        filter: string;
        actions: string;
        status: string;
        title: string;
        type: string;
        priority: string;
        date: string;
        author: string;
        loading: string;
        noResults: string;
    };
    contentManagement: {
        categories: {
            actualite: string;
            communique: string;
            evenement: string;
            alerte: string;
        };
        statuses: {
            draft: string;
            pending_approval: string;
            published: string;
            archived: string;
        };
        priorities: {
            urgent: string;
            important: string;
            normal: string;
        };
        workflow: {
            submit: string;
            publish: string;
            approve: string;
            archive: string;
            restore: string;
            delete: string;
        };
        messages: {
            submitted: string;
            published: string;
            archived: string;
            restored: string;
            deleted: string;
            confirmDelete: string;
        };
    };
    servicesManagement: {
        catalog: string;
        activeServicesCount: (count: number) => string;
        newService: string;
        editService: string;
        details: string;
        procedure: string;
        requiredDocs: string;
        deadline: string;
        costs: string;
        contactPoints: string;
        active: string;
        inactive: string;
        beneficiaries: string;
        description: string;
        highlights: string;
        steps: (count: number) => string;
    };
    requestsManagement: {
        queue: string;
        stats: (total: number, avg: number) => string;
        allTypes: string;
        searchPlaceholder: string;
        noRequests: string;
        sender: string;
        message: string;
        attachments: (count: number) => string;
        responseSent: string;
        actions: string;
        assign: string;
        respond: string;
        responsePlaceholder: string;
        commentPlaceholder: string;
        history: string;
        statuses: {
            new: string;
            assigned: string;
            in_progress: string;
            waiting_more_info: string;
            approved: string;
            rejected: string;
            closed: string;
        };
        types: {
            information: string;
            reclamation: string;
            document_request: string;
            rendez_vous: string;
        };
        priorities: {
            low: string;
            normal: string;
            high: string;
            urgent: string;
        };
    };
    directions: {
        direction_generale: string;
        direction_exploitation: string;
        direction_commerciale: string;
        direction_technique: string;
        direction_financiere: string;
        direction_rh: string;
        capitainerie: string;
        securite: string;
    };
    tendersManagement: {
        title: string;
        description: string;
        newTender: string;
        reference: string;
        deadline: string;
        status: {
            open: string;
            closed: string;
        };
    };
    usersManagement: {
        title: string;
        stats: (count: number) => string;
        list: string;
        matrix: string;
        newUser: string;
        twoFactor: string;
        active: string;
        inactive: string;
        details: string;
        failedAttempts: string;
        lastLogin: string;
        recommendation: string;
        recommendationText: string;
        none: string;
        twoFactorEnabled: string;
        twoFactorDisabled: string;
        modules: {
            content: string;
            documents: string;
            services: string;
            requests: string;
            users: string;
            analytics: string;
            audit: string;
            settings: string;
        };
        actions: {
            view: string;
            create: string;
            edit: string;
            delete: string;
            approve: string;
            publish: string;
        };
    };
    roles: {
        super_admin: string;
        content_admin: string;
        ged_manager: string;
        services_manager: string;
        validator: string;
        internal_reader: string;
    };
};

export const dictionaries: Record<Locale, AdminDictionary> = {
    fr: {
        sidebar: {
            principal: 'Principal',
            dashboard: 'Tableau de bord',
            content: 'Contenu',
            contents: 'Contenus',
            documents: 'Documents GED',
            media: 'Médias',
            operational: 'Opérationnel',
            services: 'Services',
            requests: 'Demandes',
            tenders: "Appels d'offres",
            administration: 'Administration',
            users: 'Utilisateurs',
            analytics: 'Analytique',
            audit: "Journal d'audit",
            settings: 'Paramètres',
            logout: 'Déconnexion',
            twoFactorActive: '2FA activé',
        },
        topbar: {
            portName: 'Port Autonome de Nouadhibou',
            notifications: 'Notifications',
            titles: {
                dashboard: 'Tableau de bord',
                contents: 'Gestion des Contenus',
                newContent: 'Nouveau Contenu',
                editContent: 'Modifier le Contenu',
                documents: 'Documents GED',
                newDocument: 'Nouveau Document',
                editDocument: 'Modifier le document',
                versionHistory: 'Historique des versions',
                media: 'Gestion des Médias',
                services: 'Catalogue des Services',
                requests: 'File des demandes',
                tenders: "Appels d'Offres",
                users: 'Utilisateurs & Rôles',
                analytics: 'Analytique',
                audit: "Journal d'audit",
                settings: 'Paramètres',
            },
        },
        dashboard: {
            activeServices: 'Services actifs',
            publishedArticles: 'Articles publiés',
            pendingRequests: 'Demandes en attente',
            trafficTons: 'Trafic (tonnes)',
            lastRequests: 'Dernières demandes',
            lastContents: 'Derniers contenus',
            status: {
                new: 'Nouveau',
                closed: 'Clôturée',
                published: 'Publié',
                draft: 'Brouillon',
                archived: 'Archivé',
            },
        },
        common: {
            save: 'Enregistrer',
            cancel: 'Annuler',
            delete: 'Supprimer',
            edit: 'Modifier',
            create: 'Ajouter',
            view: 'Voir',
            search: 'Rechercher',
            filter: 'Filtrer',
            actions: 'Actions',
            status: 'Statut',
            title: 'Titre',
            type: 'Type',
            priority: 'Priorité',
            date: 'Date',
            author: 'Auteur',
            loading: 'Chargement...',
            noResults: 'Aucun résultat trouvé',
        },
        contentManagement: {
            categories: {
                actualite: 'Actualité',
                communique: 'Communiqué',
                evenement: 'Événement',
                alerte: 'Alerte',
            },
            statuses: {
                draft: 'Brouillon',
                pending_approval: 'En révision',
                published: 'Publié',
                archived: 'Archivé',
            },
            priorities: {
                urgent: 'Urgent',
                important: 'Important',
                normal: 'Normal',
            },
            workflow: {
                submit: 'Soumettre',
                publish: 'Publier',
                approve: 'Approuver',
                archive: 'Archiver',
                restore: 'Restaurer',
                delete: 'Supprimer',
            },
            messages: {
                submitted: 'Soumis pour révision',
                published: 'Publié avec succès',
                archived: 'Archivé',
                restored: 'Restauré en brouillon',
                deleted: 'Supprimé',
                confirmDelete: 'Supprimer ce contenu ?',
            },
        },
        servicesManagement: {
            catalog: 'Catalogue des services',
            activeServicesCount: (count: number) => `${count} service(s) actif(s)`,
            newService: 'Nouveau service',
            editService: 'Modifier le service',
            details: 'Détails',
            procedure: 'Procédure',
            requiredDocs: 'Documents requis',
            deadline: 'Délai',
            costs: 'Coûts',
            contactPoints: 'Points de contact',
            active: 'Actif',
            inactive: 'Inactif',
            beneficiaries: 'Bénéficiaires',
            description: 'Description',
            highlights: 'Points forts',
            steps: (count: number) => `${count} étape(s)`,
        },
        requestsManagement: {
            queue: 'File des demandes',
            stats: (total, avg) => `${total} demande(s) · Temps moyen : ${avg}h`,
            allTypes: 'Tous les types',
            searchPlaceholder: 'Rechercher (sujet, nom, référence)...',
            noRequests: 'Aucune demande trouvée.',
            sender: 'Demandeur',
            message: 'Message',
            attachments: (count) => `Pièces jointes (${count})`,
            responseSent: 'Réponse envoyée',
            actions: 'Actions',
            assign: 'Assigner',
            respond: 'Répondre',
            responsePlaceholder: 'Rédiger une réponse au demandeur...',
            commentPlaceholder: 'Commentaire de changement de statut (optionnel)...',
            history: 'Historique',
            statuses: {
                new: 'Nouvelle',
                assigned: 'Assignée',
                in_progress: 'En cours',
                waiting_more_info: 'En attente info',
                approved: 'Approuvée',
                rejected: 'Rejetée',
                closed: 'Clôturée',
            },
            types: {
                information: "Demande d'info",
                reclamation: 'Réclamation',
                document_request: 'Demande doc.',
                rendez_vous: 'Rendez-vous',
            },
            priorities: {
                low: 'Basse',
                normal: 'Normale',
                high: 'Haute',
                urgent: 'Urgente',
            },
        },
        directions: {
            direction_generale: 'Direction Générale',
            direction_exploitation: 'Direction Exploitation',
            direction_commerciale: 'Direction Commerciale',
            direction_technique: 'Direction Technique',
            direction_financiere: 'Direction Financière',
            direction_rh: 'Direction RH',
            capitainerie: 'Capitainerie',
            securite: 'Service Sécurité',
        },
        tendersManagement: {
            title: "Appels d'Offres",
            description: "Gestion des marchés publics et appels d'offres.",
            newTender: "Nouvel appel d'offres",
            reference: 'Référence',
            deadline: 'Date limite',
            status: {
                open: 'Ouvert',
                closed: 'Clôturé',
            },
        },
        usersManagement: {
            title: 'Utilisateurs & RBAC',
            stats: (count) => `Gestion des accès avec contrôle par rôle · ${count} utilisateur(s)`,
            list: 'Liste',
            matrix: 'Matrice permissions',
            newUser: 'Ajouter un utilisateur',
            twoFactor: '2FA',
            active: 'Actif',
            inactive: 'Inactif',
            details: 'Détail utilisateur',
            failedAttempts: 'Tentatives échouées',
            lastLogin: 'Dernière connexion',
            recommendation: 'Recommandation',
            recommendationText: "Cet utilisateur devrait activer l'authentification à deux facteurs (TOTP) pour renforcer la sécurité.",
            none: '—aucun—',
            twoFactorEnabled: '🔒 Activé',
            twoFactorDisabled: '⚠️ Désactivé',
            modules: {
                content: 'Contenus',
                documents: 'Documents GED',
                services: 'Services',
                requests: 'Demandes',
                users: 'Utilisateurs',
                analytics: 'Analytique',
                audit: 'Audit',
                settings: 'Paramètres',
            },
            actions: {
                view: '👁️ Voir',
                create: '➕ Créer',
                edit: '✏️ Modifier',
                delete: '🗑️ Supprimer',
                approve: '✅ Approuver',
                publish: '🚀 Publier',
            },
        },
        roles: {
            super_admin: 'Super Administrateur',
            content_admin: 'Admin Contenu',
            ged_manager: 'Gestionnaire GED',
            services_manager: 'Gestionnaire Services',
            validator: 'Validateur',
            internal_reader: 'Lecteur Interne',
        },
    },
    ar: {
        sidebar: {
            principal: 'الرئيسية',
            dashboard: 'لوحة القيادة',
            content: 'المحتوى',
            contents: 'المحتويات',
            documents: 'الوثائق',
            media: 'الوسائط',
            operational: 'العمليات',
            services: 'الخدمات',
            requests: 'الطلبات',
            tenders: 'المناقصات',
            administration: 'الإدارة',
            users: 'المستخدمون',
            analytics: 'التحليلات',
            audit: 'سجل العمليات',
            settings: 'الإعدادات',
            logout: 'تسجيل الخروج',
            twoFactorActive: 'التحقق بخطوتين مفعل',
        },
        topbar: {
            portName: 'الميناء المستقل لنواذيبو',
            notifications: 'التنبيهات',
            titles: {
                dashboard: 'لوحة القيادة',
                contents: 'إدارة المحتويات',
                newContent: 'محتوى جديد',
                editContent: 'تعديل المحتوى',
                documents: 'إدارة الوثائق',
                newDocument: 'وثيقة جديدة',
                editDocument: 'تعديل الوثيقة',
                versionHistory: 'سجل النسخ',
                media: 'إدارة الوسائط',
                services: 'دليل الخدمات',
                requests: 'قائمة الطلبات',
                tenders: 'المناقصات',
                users: 'المستخدمون والأدوار',
                analytics: 'التحليلات',
                audit: 'سجل العمليات',
                settings: 'الإعدادات',
            },
        },
        dashboard: {
            activeServices: 'خدمات مفعلة',
            publishedArticles: 'مقالات منشورة',
            pendingRequests: 'طلبات قيد الانتظار',
            trafficTons: 'حركة المرور (طن)',
            lastRequests: 'آخر الطلبات',
            lastContents: 'آخر المحتويات',
            status: {
                new: 'جديد',
                closed: 'مغلق',
                published: 'منشور',
                draft: 'مسودة',
                archived: 'مؤرشف',
            },
        },
        common: {
            save: 'حفظ',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            create: 'إضافة',
            view: 'عرض',
            search: 'بحث',
            filter: 'تصفية',
            actions: 'إجراءات',
            status: 'الحالة',
            title: 'العنوان',
            type: 'النوع',
            priority: 'الأولوية',
            date: 'التاريخ',
            author: 'الكاتب',
            loading: 'جاري التحميل...',
            noResults: 'لا توجد نتائج',
        },
        contentManagement: {
            categories: {
                actualite: 'خبر',
                communique: 'بيان',
                evenement: 'فعالية',
                alerte: 'تنبيه',
            },
            statuses: {
                draft: 'مسودة',
                pending_approval: 'قيد المراجعة',
                published: 'منشور',
                archived: 'مؤرشف',
            },
            priorities: {
                urgent: 'عاجل',
                important: 'هام',
                normal: 'عادي',
            },
            workflow: {
                submit: 'إرسال للمراجعة',
                publish: 'نشر',
                approve: 'اعتماد',
                archive: 'أرشفة',
                restore: 'استعادة',
                delete: 'حذف',
            },
            messages: {
                submitted: 'تم الإرسال للمراجعة',
                published: 'تم النشر بنجاح',
                archived: 'تمت الأرشفة',
                restored: 'تمت الاستعادة لمسودة',
                deleted: 'تم الحذف',
                confirmDelete: 'هل أنت متأكد من حذف هذا المحتوى؟',
            },
        },
        servicesManagement: {
            catalog: 'دليل الخدمات',
            activeServicesCount: (count: number) => `${count} خدمة مفعلة`,
            newService: 'خدمة جديدة',
            editService: 'تعديل الخدمة',
            details: 'تفاصيل',
            procedure: 'الإجراءات',
            requiredDocs: 'المستندات المطلوبة',
            deadline: 'المهلة',
            costs: 'التكاليف',
            contactPoints: 'نقاط الاتصال',
            active: 'مفعل',
            inactive: 'غير مفعل',
            beneficiaries: 'المستفيدون',
            description: 'الوصف',
            highlights: 'النقاط القوية',
            steps: (count: number) => `${count} مراحل`,
        },
        requestsManagement: {
            queue: 'قائمة الطلبات',
            stats: (total, avg) => `${total} طلبات · متوسط الوقت: ${avg} ساعة`,
            allTypes: 'كل الأنواع',
            searchPlaceholder: 'بحث (الموضوع، الاسم، المرجع)...',
            noRequests: 'لم يتم العثور على طلبات.',
            sender: 'المرسل',
            message: 'الرسالة',
            attachments: (count) => `المرفقات (${count})`,
            responseSent: 'تم إرسال الرد',
            actions: 'إجراءات',
            assign: 'تعيين',
            respond: 'رد',
            responsePlaceholder: 'اكتب رداً للمرسل...',
            commentPlaceholder: 'تعليق على تغيير الحالة (اختياري)...',
            history: 'السجل',
            statuses: {
                new: 'جديد',
                assigned: 'تم التعيين',
                in_progress: 'قيد التنفيذ',
                waiting_more_info: 'في انتظار معلومات',
                approved: 'مقبول',
                rejected: 'مرفوض',
                closed: 'مغلق',
            },
            types: {
                information: 'طلب معلومات',
                reclamation: 'شكوى',
                document_request: 'طلب وثيقة',
                rendez_vous: 'موعد',
            },
            priorities: {
                low: 'منخفضة',
                normal: 'عادية',
                high: 'عالية',
                urgent: 'عاجلة',
            },
        },
        directions: {
            direction_generale: 'الإدارة العامة',
            direction_exploitation: 'إدارة الاستغلال',
            direction_commerciale: 'الإدارة التجارية',
            direction_technique: 'الإدارة الفنية',
            direction_financiere: 'الإدارة المالية',
            direction_rh: 'إدارة الموارد البشرية',
            capitainerie: 'قبطانية الميناء',
            securite: 'مصلحة الأمن',
        },
        tendersManagement: {
            title: 'المناقصات',
            description: 'تسيير الصفقات العمومية و طلبات العروض.',
            newTender: 'مناقصة جديدة',
            reference: 'المرجع',
            deadline: 'آخر أجل',
            status: {
                open: 'مفتوح',
                closed: 'مغلق',
            },
        },
        usersManagement: {
            title: 'المستخدمون و الصلاحيات',
            stats: (count) => `تسيير الوصول عبر الأدوار · ${count} مستخدم(ين)`,
            list: 'القائمة',
            matrix: 'مصفوفة الصلاحيات',
            newUser: 'إضافة مستخدم',
            twoFactor: 'المصادقة الثنائية',
            active: 'نشط',
            inactive: 'غير نشط',
            details: 'تفاصيل المستخدم',
            failedAttempts: 'محاولات فاشلة',
            lastLogin: 'آخر دخول',
            recommendation: 'توصية',
            recommendationText: 'يجب على هذا المستخدم تفعيل المصادقة الثنائية (TOTP) لتعزيز الأمان.',
            none: '—لا شيء—',
            twoFactorEnabled: '🔒 مفعل',
            twoFactorDisabled: '⚠️ غير مفعل',
            modules: {
                content: 'المحتويات',
                documents: 'المستندات',
                services: 'الخدمات',
                requests: 'الطلبات',
                users: 'المستخدمون',
                analytics: 'التحليلات',
                audit: 'التدقيق',
                settings: 'الإعدادات',
            },
            actions: {
                view: '👁️ عرض',
                create: '➕ إنشاء',
                edit: '✏️ تعديل',
                delete: '🗑️ حذف',
                approve: '✅ موافقة',
                publish: '🚀 نشر',
            },
        },
        roles: {
            super_admin: 'مسؤول نظام',
            content_admin: 'مسؤول محتوى',
            ged_manager: 'مسؤول وثائق',
            services_manager: 'مسؤول خدمات',
            validator: 'مراجع',
            internal_reader: 'قارئ داخلي',
        },
    },
    en: {
        sidebar: {
            principal: 'Principal',
            dashboard: 'Dashboard',
            content: 'Content',
            contents: 'Contents',
            documents: 'GED Documents',
            media: 'Media',
            operational: 'Operational',
            services: 'Services',
            requests: 'Requests',
            tenders: 'Tenders',
            administration: 'Administration',
            users: 'Users',
            analytics: 'Analytics',
            audit: 'Audit Log',
            settings: 'Settings',
            logout: 'Logout',
            twoFactorActive: '2FA active',
        },
        topbar: {
            portName: 'Nouadhibou Autonomous Port',
            notifications: 'Notifications',
            titles: {
                dashboard: 'Dashboard',
                contents: 'Content Management',
                newContent: 'New Content',
                editContent: 'Edit Content',
                documents: 'GED Documents',
                newDocument: 'New Document',
                editDocument: 'Edit Document',
                versionHistory: 'Version History',
                media: 'Media Management',
                services: 'Service Catalog',
                requests: 'Request Queue',
                tenders: 'Tenders',
                users: 'Users & Roles',
                analytics: 'Analytics',
                audit: 'Audit Log',
                settings: 'Settings',
            },
        },
        dashboard: {
            activeServices: 'Active Services',
            publishedArticles: 'Published Articles',
            pendingRequests: 'Pending Requests',
            trafficTons: 'Traffic (tons)',
            lastRequests: 'Last Requests',
            lastContents: 'Last Contents',
            status: {
                new: 'New',
                closed: 'Closed',
                published: 'Published',
                draft: 'Draft',
                archived: 'Archived',
            },
        },
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            create: 'Add',
            view: 'View',
            search: 'Search',
            filter: 'Filter',
            actions: 'Actions',
            status: 'Status',
            title: 'Title',
            type: 'Type',
            priority: 'Priority',
            date: 'Date',
            author: 'Author',
            loading: 'Loading...',
            noResults: 'No results found',
        },
        contentManagement: {
            categories: {
                actualite: 'News',
                communique: 'Press Release',
                evenement: 'Event',
                alerte: 'Alert',
            },
            statuses: {
                draft: 'Draft',
                pending_approval: 'Pending Approval',
                published: 'Published',
                archived: 'Archived',
            },
            priorities: {
                urgent: 'Urgent',
                important: 'Important',
                normal: 'Normal',
            },
            workflow: {
                submit: 'Submit',
                publish: 'Publish',
                approve: 'Approve',
                archive: 'Archive',
                restore: 'Restore',
                delete: 'Delete',
            },
            messages: {
                submitted: 'Submitted for review',
                published: 'Published successfully',
                archived: 'Archived',
                restored: 'Restored to draft',
                deleted: 'Deleted',
                confirmDelete: 'Delete this content?',
            },
        },
        servicesManagement: {
            catalog: 'Service Catalog',
            activeServicesCount: (count: number) => `${count} active service(s)`,
            newService: 'New Service',
            editService: 'Edit Service',
            details: 'Details',
            procedure: 'Procedure',
            requiredDocs: 'Required Documents',
            deadline: 'Deadline',
            costs: 'Costs',
            contactPoints: 'Contact Points',
            active: 'Active',
            inactive: 'Inactive',
            beneficiaries: 'Beneficiaries',
            description: 'Description',
            highlights: 'Highlights',
            steps: (count: number) => `${count} step(s)`,
        },
        requestsManagement: {
            queue: 'Request Queue',
            stats: (total, avg) => `${total} request(s) · Avg processing time: ${avg}h`,
            allTypes: 'All types',
            searchPlaceholder: 'Search (subject, name, reference)...',
            noRequests: 'No requests found.',
            sender: 'Requester',
            message: 'Message',
            attachments: (count) => `Attachments (${count})`,
            responseSent: 'Response sent',
            actions: 'Actions',
            assign: 'Assign',
            respond: 'Respond',
            responsePlaceholder: 'Write a response to the requester...',
            commentPlaceholder: 'Status change comment (optional)...',
            history: 'History',
            statuses: {
                new: 'New',
                assigned: 'Assigned',
                in_progress: 'In Progress',
                waiting_more_info: 'Awaiting Info',
                approved: 'Approved',
                rejected: 'Rejected',
                closed: 'Closed',
            },
            types: {
                information: 'Information request',
                reclamation: 'Complaint',
                document_request: 'Document request',
                rendez_vous: 'Appointment',
            },
            priorities: {
                low: 'Low',
                normal: 'Normal',
                high: 'High',
                urgent: 'Urgent',
            },
        },
        directions: {
            direction_generale: 'General Director',
            direction_exploitation: 'Operations Directorate',
            direction_commerciale: 'Commercial Directorate',
            direction_technique: 'Technical Directorate',
            direction_financiere: 'Financial Directorate',
            direction_rh: 'HR Directorate',
            capitainerie: 'Port Authority',
            securite: 'Security Service',
        },
        tendersManagement: {
            title: 'Tenders',
            description: 'Public procurement and tenders management.',
            newTender: 'New Tender',
            reference: 'Reference',
            deadline: 'Deadline',
            status: {
                open: 'Open',
                closed: 'Closed',
            },
        },
        usersManagement: {
            title: 'Users & RBAC',
            stats: (count) => `Access management with role control · ${count} user(s)`,
            list: 'List',
            matrix: 'Permission matrix',
            newUser: 'Add user',
            twoFactor: '2FA',
            active: 'Active',
            inactive: 'Inactive',
            details: 'User details',
            failedAttempts: 'Failed attempts',
            lastLogin: 'Last login',
            recommendation: 'Recommendation',
            recommendationText: 'This user should enable two-factor authentication (TOTP) to enhance security.',
            none: '—none—',
            twoFactorEnabled: '🔒 Enabled',
            twoFactorDisabled: '⚠️ Disabled',
            modules: {
                content: 'Content',
                documents: 'Documents',
                services: 'Services',
                requests: 'Requests',
                users: 'Users',
                analytics: 'Analytics',
                audit: 'Audit',
                settings: 'Settings',
            },
            actions: {
                view: '👁️ View',
                create: '➕ Create',
                edit: '✏️ Edit',
                delete: '🗑️ Delete',
                approve: '✅ Approve',
                publish: '🚀 Publish',
            },
        },
        roles: {
            super_admin: 'Super Admin',
            content_admin: 'Content Admin',
            ged_manager: 'GED Manager',
            services_manager: 'Services Manager',
            validator: 'Validator',
            internal_reader: 'Internal Reader',
        },
    },
    es: {
        sidebar: {
            principal: 'Principal',
            dashboard: 'Tablero',
            content: 'Contenido',
            contents: 'Contenidos',
            documents: 'Documentos GED',
            media: 'Medios',
            operational: 'Operativo',
            services: 'Servicios',
            requests: 'Solicitudes',
            tenders: 'Licitaciones',
            administration: 'Administración',
            users: 'Usuarios',
            analytics: 'Analítica',
            audit: 'Registro de Auditoría',
            settings: 'Configuración',
            logout: 'Cerrar Sesión',
            twoFactorActive: '2FA activado',
        },
        topbar: {
            portName: 'Puerto Autónomo de Nouadhibou',
            notifications: 'Notificaciones',
            titles: {
                dashboard: 'Tablero',
                contents: 'Gestión de Contenidos',
                newContent: 'Nuevo Contenido',
                editContent: 'Editar Contenido',
                documents: 'Documentos GED',
                newDocument: 'Nuevo Documento',
                editDocument: 'Editar Documento',
                versionHistory: 'Historial de Versiones',
                media: 'Gestión de Medios',
                services: 'Catálogo de Servicios',
                requests: 'Cola de Solicitudes',
                tenders: 'Licitaciones',
                users: 'Usuarios y Roles',
                analytics: 'Analítica',
                audit: 'Registro de Auditoría',
                settings: 'Configuración',
            },
        },
        dashboard: {
            activeServices: 'Servicios activos',
            publishedArticles: 'Artículos publicados',
            pendingRequests: 'Solicitudes pendientes',
            trafficTons: 'Tráfico (toneladas)',
            lastRequests: 'Últimas solicitudes',
            lastContents: 'Últimos contenidos',
            status: {
                new: 'Nuevo',
                closed: 'Cerrado',
                published: 'Publicado',
                draft: 'Borrador',
                archived: 'Archivado',
            },
        },
        common: {
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            edit: 'Editar',
            create: 'Añadir',
            view: 'Ver',
            search: 'Buscar',
            filter: 'Filtrar',
            actions: 'Acciones',
            status: 'Estado',
            title: 'Título',
            type: 'Tipo',
            priority: 'Prioridad',
            date: 'Fecha',
            author: 'Autor',
            loading: 'Cargando...',
            noResults: 'No se encontraron resultados',
        },
        contentManagement: {
            categories: {
                actualite: 'Noticia',
                communique: 'Comunicado',
                evenement: 'Evento',
                alerte: 'Alerta',
            },
            statuses: {
                draft: 'Borrador',
                pending_approval: 'En revisión',
                published: 'Publicado',
                archived: 'Archivado',
            },
            priorities: {
                urgent: 'Urgente',
                important: 'Importante',
                normal: 'Normal',
            },
            workflow: {
                submit: 'Enviar',
                publish: 'Publicar',
                approve: 'Aprobar',
                archive: 'Archivar',
                restore: 'Restaurar',
                delete: 'Eliminar',
            },
            messages: {
                submitted: 'Enviado para revisión',
                published: 'Publicado con éxito',
                archived: 'Archivado',
                restored: 'Restaurado a borrador',
                deleted: 'Eliminado',
                confirmDelete: '¿Eliminar este contenido?',
            },
        },
        servicesManagement: {
            catalog: 'Catálogo de servicios',
            activeServicesCount: (count: number) => `${count} servicio(s) activo(s)`,
            newService: 'Nuevo servicio',
            editService: 'Editar servicio',
            details: 'Detalles',
            procedure: 'Procedimiento',
            requiredDocs: 'Documentos requeridos',
            deadline: 'Plazo',
            costs: 'Costes',
            contactPoints: 'Puntos de contacto',
            active: 'Activo',
            inactive: 'Inactivo',
            beneficiaries: 'Beneficiarios',
            description: 'Descripción',
            highlights: 'Puntos destacados',
            steps: (count: number) => `${count} etapa(s)`,
        },
        requestsManagement: {
            queue: 'Cola de solicitudes',
            stats: (total, avg) => `${total} solicitud(es) · Tiempo promedio: ${avg}h`,
            allTypes: 'Todos los tipos',
            searchPlaceholder: 'Buscar (asunto, nombre, referencia)...',
            noRequests: 'No se encontraron solicitudes.',
            sender: 'Solicitante',
            message: 'Mensaje',
            attachments: (count) => `Adjuntos (${count})`,
            responseSent: 'Respuesta enviada',
            actions: 'Acciones',
            assign: 'Asignar',
            respond: 'Responder',
            responsePlaceholder: 'Escribir una respuesta al solicitante...',
            commentPlaceholder: 'Comentario de cambio de estado (opcional)...',
            history: 'Historial',
            statuses: {
                new: 'Nueva',
                assigned: 'Asignada',
                in_progress: 'En curso',
                waiting_more_info: 'Esperando info',
                approved: 'Aprobada',
                rejected: 'Rechazada',
                closed: 'Cerrada',
            },
            types: {
                information: 'Solicitud de info',
                reclamation: 'Reclamación',
                document_request: 'Solicitud de doc.',
                rendez_vous: 'Cita',
            },
            priorities: {
                low: 'Baja',
                normal: 'Normal',
                high: 'Alta',
                urgent: 'Urgente',
            },
        },
        directions: {
            direction_generale: 'Dirección General',
            direction_exploitation: 'Dirección de Explotación',
            direction_commerciale: 'Dirección Comercial',
            direction_technique: 'Dirección Técnica',
            direction_financiere: 'Dirección Financiera',
            direction_rh: 'Dirección de RRHH',
            capitainerie: 'Capitanía',
            securite: 'Servicio de Seguridad',
        },
        tendersManagement: {
            title: 'Licitaciones',
            description: 'Gestión de contratación pública y licitaciones.',
            newTender: 'Nueva licitación',
            reference: 'Referencia',
            deadline: 'Plazo',
            status: {
                open: 'Abierto',
                closed: 'Cerrado',
            },
        },
        usersManagement: {
            title: 'Usuarios y RBAC',
            stats: (count) => `Gestión de acceso con control de roles · ${count} usuario(s)`,
            list: 'Lista',
            matrix: 'Matriz de permisos',
            newUser: 'Añadir usuario',
            twoFactor: '2FA',
            active: 'Activo',
            inactive: 'Inactivo',
            details: 'Detalle de usuario',
            failedAttempts: 'Intentos fallidos',
            lastLogin: 'Último acceso',
            recommendation: 'Recomendación',
            recommendationText: 'Este usuario debería activar la autenticación de dos factores (TOTP) para reforzar la seguridad.',
            none: '—ninguno—',
            twoFactorEnabled: '🔒 Activado',
            twoFactorDisabled: '⚠️ Desactivado',
            modules: {
                content: 'Contenidos',
                documents: 'Documentos',
                services: 'Servicios',
                requests: 'Solicitudes',
                users: 'Usuarios',
                analytics: 'Analítica',
                audit: 'Auditoría',
                settings: 'Ajustes',
            },
            actions: {
                view: '👁️ Ver',
                create: '➕ Crear',
                edit: '✏️ Editar',
                delete: 'Eliminar',
                approve: '✅ Aprobar',
                publish: '🚀 Publicar',
            },
        },
        roles: {
            super_admin: 'Superadministrador',
            content_admin: 'Administrador de Contenido',
            ged_manager: 'Gestor GED',
            services_manager: 'Gestor de Servicios',
            validator: 'Validador',
            internal_reader: 'Lector Interno',
        },
    },
};
