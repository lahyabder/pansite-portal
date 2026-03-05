import type { Locale } from '@pan/shared';

export type Dictionary = {
    nav: {
        home: string;
        port: string;
        infrastructure: string;
        services: string;
        procedures: string;
        tariffs: string;
        stopovers: string;
        tenders: string;
        documentation: string;
        media: string;
        contact: string;
        search: string;
        searchPlaceholder: string;
    };
    hero: {
        title: string;
        subtitle: string;
        cta: string;
        ctaSecondary: string;
    };
    stats: {
        title: string;
    };
    services: {
        title: string;
        subtitle: string;
        viewAll: string;
        description: string;
        features: string;
        procedure: string;
        requiredDocuments: string;
        beneficiaries: string;
        prerequisites: string;
        deadline: string;
        costs: string;
        contact: string;
        backToList: string;
        submitRequest: string;
        requestTypes: {
            information: string;
            reclamation: string;
            document_request: string;
            rendez_vous: string;
        };
        formLabels: {
            type: string;
            name: string;
            namePlaceholder: string;
            email: string;
            emailPlaceholder: string;
            phone: string;
            company: string;
            companyPlaceholder: string;
            subject: string;
            message: string;
            messagePlaceholder: string;
            attachments: string;
            submit: string;
        };
        formErrors: {
            required: string;
        };
        formSuccess: {
            title: string;
            message: string;
            reference: string;
        };
    };
    news: {
        title: string;
        subtitle: string;
        readMore: string;
        viewAll: string;
    };
    content: {
        categories: {
            actualite: string;
            communique: string;
            evenement: string;
            alerte: string;
            all: string;
        };
        filters: {
            category: string;
            tag: string;
            all: string;
        };
        pagination: {
            showing: string;
            of: string;
            results: string;
        };
        detail: {
            publishedOn: string;
            by: string;
            tags: string;
            share: string;
            backToList: string;
            relatedContent: string;
            eventDate: string;
            eventLocation: string;
            expiresOn: string;
        };
        alertBar: {
            close: string;
        };
        empty: {
            title: string;
            description: string;
        };
    };
    pages: {
        port: {
            title: string;
            subtitle: string;
            role: {
                title: string;
                description: string;
                points: string[];
            };
            geography: {
                title: string;
                description: string;
            };
            history: {
                title: string;
                milestones: { year: string; event: string }[];
            };
            evolution: {
                title: string;
                description: string;
            };
            equipment: {
                title: string;
                list: string[];
            };
            impact: {
                title: string;
                description: string;
            };
            services: {
                title: string;
                list: string[];
            };
        };
        infrastructure: { title: string; subtitle: string };
        services: { title: string; subtitle: string };
        procedures: { title: string; subtitle: string };
        tariffs: { title: string; subtitle: string };
        stopovers: { title: string; subtitle: string };
        tenders: { title: string; subtitle: string };
        documentation: { title: string; subtitle: string };
        media: { title: string; subtitle: string };
        contact: { title: string; subtitle: string };
        search: { title: string; subtitle: string; noResults: string; resultsFor: string };
    };
    footer: {
        description: string;
        quickLinks: string;
        services: string;
        legal: string;
        contact: string;
        address: string;
        phone: string;
        fax: string;
        email: string;
        rights: string;
        legalNotice: string;
        privacyPolicy: string;
        termsOfUse: string;
        sitemap: string;
        accessibility: string;
    };
    common: {
        learnMore: string;
        backToHome: string;
        loading: string;
        comingSoon: string;
        comingSoonDesc: string;
        viewDetails: string;
        download: string;
        share: string;
        print: string;
        previous: string;
        next: string;
        page: string;
        of: string;
    };
    ged: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        filters: {
            theme: string;
            direction: string;
            accessLevel: string;
            fileType: string;
            allThemes: string;
            allDirections: string;
            allAccess: string;
            allTypes: string;
        };
        themes: Record<string, string>;
        directions: Record<string, string>;
        accessLevels: Record<string, string>;
        fileTypes: Record<string, string>;
        labels: {
            reference: string;
            version: string;
            versions: string;
            currentVersion: string;
            versionHistory: string;
            uploadedBy: string;
            uploadedOn: string;
            keywords: string;
            categories: string;
            language: string;
            accessLevel: string;
            direction: string;
            theme: string;
            downloadFile: string;
            noDocuments: string;
            noDocumentsDesc: string;
            restrictedAccess: string;
            restrictedDesc: string;
            internalAccess: string;
            internalDesc: string;
            loginRequired: string;
        };
        languages: Record<string, string>;
    };
};

const dictionaries: Record<Locale, Dictionary> = {
    fr: {
        nav: {
            home: 'Accueil',
            port: 'Le Port',
            infrastructure: 'Infrastructures',
            services: 'Services',
            procedures: 'Procédures',
            tariffs: 'Tarifs',
            stopovers: 'Escales',
            tenders: 'Appels d\'Offres',
            documentation: 'Documentation',
            media: 'Médias',
            contact: 'Contact',
            search: 'Rechercher',
            searchPlaceholder: 'Rechercher sur le site...',
        },
        hero: {
            title: 'Port Autonome de Nouadhibou',
            subtitle:
                "Porte d'entrée stratégique de la Mauritanie sur l'Atlantique. Hub commercial majeur pour l'Afrique de l'Ouest.",
            cta: 'Découvrir nos services',
            ctaSecondary: 'Nous contacter',
        },
        stats: {
            title: 'Le PAN en chiffres',
        },
        services: {
            title: 'Nos Services',
            subtitle: 'Des solutions portuaires complètes pour répondre à tous vos besoins logistiques.',
            viewAll: 'Voir tous les services',
            description: 'Description détaillée',
            features: 'Points forts',
            procedure: 'Procédure à suivre',
            requiredDocuments: 'Documents requis',
            beneficiaries: 'Bénéficiaires',
            prerequisites: 'Prérequis',
            deadline: 'Délai de traitement',
            costs: 'Coûts et tarifs',
            contact: 'Contact',
            backToList: 'Retour aux services',
            submitRequest: 'Soumettre une demande',
            requestTypes: {
                information: "Demande d'information",
                reclamation: 'Réclamation',
                document_request: 'Demande de document',
                rendez_vous: 'Demande de rendez-vous',
            },
            formLabels: {
                type: 'Type de demande',
                name: 'Nom complet',
                namePlaceholder: 'Votre nom',
                email: 'Email',
                emailPlaceholder: 'votre@email.com',
                phone: 'Téléphone',
                company: 'Entreprise',
                companyPlaceholder: 'Nom de votre entreprise',
                subject: 'Objet',
                message: 'Message',
                messagePlaceholder: 'Décrivez votre demande en détail...',
                attachments: 'Glissez vos pièces jointes ici (PDF, Word, images)',
                submit: 'Envoyer la demande',
            },
            formErrors: {
                required: 'Veuillez remplir tous les champs obligatoires.',
            },
            formSuccess: {
                title: 'Demande envoyée avec succès !',
                message: 'Nous avons bien reçu votre demande. Vous recevrez une confirmation par email.',
                reference: 'Votre référence :',
            },
        },
        news: {
            title: 'Actualités',
            subtitle: 'Les dernières nouvelles du Port Autonome de Nouadhibou.',
            readMore: 'Lire la suite',
            viewAll: 'Toutes les actualités',
        },
        content: {
            categories: {
                actualite: 'Actualités',
                communique: 'Communiqués',
                evenement: 'Événements',
                alerte: 'Alertes & Avis',
                all: 'Tout',
            },
            filters: {
                category: 'Catégorie',
                tag: 'Thème',
                all: 'Tous',
            },
            pagination: {
                showing: 'Affichage',
                of: 'sur',
                results: 'résultats',
            },
            detail: {
                publishedOn: 'Publié le',
                by: 'par',
                tags: 'Mots-clés',
                share: 'Partager',
                backToList: 'Retour à la liste',
                relatedContent: 'Contenus similaires',
                eventDate: 'Date de l\'événement',
                eventLocation: 'Lieu',
                expiresOn: 'Valable jusqu\'au',
            },
            alertBar: {
                close: 'Fermer',
            },
            empty: {
                title: 'Aucun contenu',
                description: 'Aucun contenu ne correspond à votre recherche.',
            },
        },
        pages: {
            port: {
                title: 'Le Port',
                subtitle: 'Découvrez l\'histoire, les infrastructures et la vision du Port Autonome de Nouadhibou.',
                role: {
                    title: 'Rôle Stratégique',
                    description: 'Le Port Autonome de Nouadhibou (PAN) se situe dans une baie naturellement protégée. C\'est le pivot de toutes les activités de pêche et le moteur du développement de Nouadhibou.',
                    points: [
                        'Porte d\'entrée et de sortie de la capitale économique du pays.',
                        'Centre de services pour le transport, l\'industrie et le commerce international.',
                        'Passerelle stratégique pour l\'industrie halieutique nationale.',
                    ],
                },
                geography: {
                    title: 'Situation Géographique',
                    description: 'Situé à 20°54 N et 17°03 O, le port bénéficie d\'un abri naturel exceptionnel contre les houles de l\'Atlantique, au carrefour des grandes routes maritimes.',
                },
                history: {
                    title: 'Historique & Jalons',
                    milestones: [
                        { year: '1955', event: 'Premier petit quai construit par SIGP.' },
                        { year: '1960', event: 'Construction d\'un quai commercial de 60m et 3 quais de pêche.' },
                        { year: '1968', event: 'Extension du quai de pêche à 300m (FED).' },
                        { year: '1976', event: 'Expansion commerciale et nouveaux bâtiments administratifs (Fonds Koweïtien).' },
                        { year: '1998', event: 'Décret officiel d\'extension du domaine portuaire.' },
                        { year: '2014', event: 'Nouveau quai de 660m, rampe RO-RO et plateforme de 12 hectares.' },
                        { year: '2025', event: 'Modernisation globale et transformation digitale.' },
                    ],
                },
                evolution: {
                    title: 'Évolution du Site',
                    description: 'D\'un modeste quai de pêche, le site est devenu un complexe industriel et commercial intégré disposant d\'usines de transformation, de chambres froides, de zones de stockage et de systèmes de gestion modernes.',
                },
                equipment: {
                    title: 'Équipements & Sécurité',
                    list: [
                        'Système de guidage dans le chenal d\'accès et phares terrestres',
                        'Éclairage complet des quais et du périmètre portuaire',
                        'Vidéosurveillance (CCTV) aux entrées et à l\'intérieur du port',
                        'Système de surveillance des navires par AIS',
                        'Points d\'avitaillement en eau et carburant sur les quais de pêche',
                    ],
                },
                impact: {
                    title: 'Impact Économique & Social',
                    description: 'Poumon économique de la région et plus grand employeur de la ville, le port favorise l\'intégration du secteur privé et assure une stabilité sociale à travers des partenariats durables.',
                },
                services: {
                    title: 'Services Portuaires',
                    list: [
                        'Accostage pour tous types de navires',
                        'Aide à la navigation et guidage',
                        'Manutention et stockage de marchandises',
                        'Logistique intégrée et transport multimodal',
                        'Espaces d\'entreposage modernes et sécurisés',
                        'Services de pilotage professionnel',
                        'Remorquage et assistance en mer',
                        'Terminal à conteneurs de dernière génération',
                    ],
                },
            },
            infrastructure: {
                title: 'Infrastructures',
                subtitle: 'Découvrez nos installations portuaires modernes et nos équipements de pointe.',
            },
            services: {
                title: 'Services Portuaires',
                subtitle: 'Une gamme complète de services pour répondre à tous vos besoins logistiques et maritimes.',
            },
            procedures: {
                title: 'Procédures',
                subtitle: 'Guide des procédures administratives et opérationnelles du port.',
            },
            tariffs: {
                title: 'Tarifs',
                subtitle: 'Consultez la grille tarifaire des services portuaires.',
            },
            stopovers: {
                title: 'Escales',
                subtitle: 'Informations sur les escales de navires et le planning portuaire.',
            },
            tenders: {
                title: 'Appels d\'Offres',
                subtitle: 'Consultez les appels d\'offres et marchés publics en cours.',
            },
            documentation: {
                title: 'Documentation',
                subtitle: 'Documents officiels, rapports et formulaires téléchargeables.',
            },
            media: {
                title: 'Médias',
                subtitle: 'Actualités, communiqués de presse et galerie photos du PAN.',
            },
            contact: {
                title: 'Contact',
                subtitle: 'Contactez-nous pour toute information ou demande de service.',
            },
            search: {
                title: 'Recherche',
                subtitle: 'Trouvez rapidement ce que vous cherchez sur notre site.',
                noResults: 'Aucun résultat trouvé.',
                resultsFor: 'Résultats pour',
            },
        },
        footer: {
            description:
                "Le Port Autonome de Nouadhibou est un acteur majeur du développement économique de la Mauritanie, offrant des services portuaires de qualité internationale.",
            quickLinks: 'Liens rapides',
            services: 'Services',
            legal: 'Informations légales',
            contact: 'Contact',
            address: 'BP 236, Nouadhibou, Mauritanie',
            phone: '+222 45 74 51 06',
            fax: '+222 45 74 51 07',
            email: 'contact@pan.mr',
            rights: '© 2025 Port Autonome de Nouadhibou. Tous droits réservés.',
            legalNotice: 'Mentions légales',
            privacyPolicy: 'Politique de confidentialité',
            termsOfUse: 'Conditions d\'utilisation',
            sitemap: 'Plan du site',
            accessibility: 'Accessibilité',
        },
        common: {
            learnMore: 'En savoir plus',
            backToHome: 'Retour à l\'accueil',
            loading: 'Chargement...',
            comingSoon: 'Bientôt disponible',
            comingSoonDesc: 'Cette section est en cours de développement. Revenez bientôt pour découvrir son contenu.',
            viewDetails: 'Voir les détails',
            download: 'Télécharger',
            share: 'Partager',
            print: 'Imprimer',
            previous: 'Précédent',
            next: 'Suivant',
            page: 'Page',
            of: 'sur',
        },
        ged: {
            title: 'Documentation',
            subtitle: 'Bibliothèque de documents officiels, rapports, formulaires et réglementation du Port Autonome de Nouadhibou.',
            searchPlaceholder: 'Rechercher un document...',
            filters: {
                theme: 'Thème',
                direction: 'Direction',
                accessLevel: 'Accès',
                fileType: 'Type de fichier',
                allThemes: 'Tous les thèmes',
                allDirections: 'Toutes les directions',
                allAccess: 'Tous les niveaux',
                allTypes: 'Tous les types',
            },
            themes: {
                reglementation: 'Réglementation',
                tarification: 'Tarification',
                securite: 'Sécurité',
                environnement: 'Environnement',
                infrastructure: 'Infrastructure',
                commerce: 'Commerce',
                rh: 'Ressources Humaines',
                finance: 'Finance',
                autre: 'Autre',
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
                autre: 'Autre',
            },
            accessLevels: {
                public: 'Public',
                restricted: 'Restreint',
                internal: 'Interne',
            },
            fileTypes: {
                pdf: 'PDF',
                doc: 'Word',
                docx: 'Word',
                xlsx: 'Excel',
                xls: 'Excel',
                ppt: 'PowerPoint',
                pptx: 'PowerPoint',
                jpg: 'Image',
                png: 'Image',
                other: 'Autre',
            },
            labels: {
                reference: 'Référence',
                version: 'Version',
                versions: 'versions',
                currentVersion: 'Version actuelle',
                versionHistory: 'Historique des versions',
                uploadedBy: 'Ajouté par',
                uploadedOn: 'Ajouté le',
                keywords: 'Mots-clés',
                categories: 'Catégories',
                language: 'Langue',
                accessLevel: 'Niveau d\'accès',
                direction: 'Direction',
                theme: 'Thème',
                downloadFile: 'Télécharger le fichier',
                noDocuments: 'Aucun document',
                noDocumentsDesc: 'Aucun document ne correspond à votre recherche.',
                restrictedAccess: 'Accès restreint',
                restrictedDesc: 'Ce document nécessite une autorisation pour être téléchargé.',
                internalAccess: 'Document interne',
                internalDesc: 'Ce document est réservé au personnel du PAN.',
                loginRequired: 'Connexion requise',
            },
            languages: {
                fr: 'Français',
                ar: 'Arabe',
                fr_ar: 'Bilingue (FR/AR)',
            },
        },
    },
    ar: {
        nav: {
            home: 'الرئيسية',
            port: 'الميناء',
            infrastructure: 'البنية التحتية',
            services: 'الخدمات',
            procedures: 'الإجراءات',
            tariffs: 'التعريفات',
            stopovers: 'الرسو',
            tenders: 'المناقصات',
            documentation: 'الوثائق',
            media: 'الإعلام',
            contact: 'اتصل بنا',
            search: 'بحث',
            searchPlaceholder: 'ابحث في الموقع...',
        },
        hero: {
            title: 'الميناء المستقل لنواذيبو',
            subtitle: 'البوابة الاستراتيجية لموريتانيا على المحيط الأطلسي. مركز تجاري رئيسي لغرب أفريقيا.',
            cta: 'اكتشف خدماتنا',
            ctaSecondary: 'اتصل بنا',
        },
        stats: {
            title: 'الميناء بالأرقام',
        },
        services: {
            title: 'خدماتنا',
            subtitle: 'حلول مينائية شاملة لتلبية جميع احتياجاتكم اللوجستية.',
            viewAll: 'عرض جميع الخدمات',
            description: 'وصف مفصل',
            features: 'المميزات',
            procedure: 'الإجراءات',
            requiredDocuments: 'الوثائق المطلوبة',
            beneficiaries: 'المستفيدون',
            prerequisites: 'المتطلبات المسبقة',
            deadline: 'مدة المعالجة',
            costs: 'التكاليف والأسعار',
            contact: 'الاتصال',
            backToList: 'العودة إلى الخدمات',
            submitRequest: 'تقديم طلب',
            requestTypes: {
                information: 'طلب معلومات',
                reclamation: 'شكوى',
                document_request: 'طلب وثيقة',
                rendez_vous: 'طلب موعد',
            },
            formLabels: {
                type: 'نوع الطلب',
                name: 'الاسم الكامل',
                namePlaceholder: 'اسمك',
                email: 'البريد الإلكتروني',
                emailPlaceholder: 'email@example.com',
                phone: 'الهاتف',
                company: 'الشركة',
                companyPlaceholder: 'اسم شركتك',
                subject: 'الموضوع',
                message: 'الرسالة',
                messagePlaceholder: 'صف طلبك بالتفصيل...',
                attachments: 'اسحب مرفقاتك هنا (PDF، Word، صور)',
                submit: 'إرسال الطلب',
            },
            formErrors: {
                required: 'يرجى ملء جميع الحقول الإلزامية.',
            },
            formSuccess: {
                title: 'تم إرسال الطلب بنجاح!',
                message: 'لقد تلقينا طلبك. ستتلقى تأكيداً عبر البريد الإلكتروني.',
                reference: 'مرجعك:',
            },
        },
        news: {
            title: 'الأخبار',
            subtitle: 'آخر أخبار الميناء المستقل لنواذيبو.',
            readMore: 'اقرأ المزيد',
            viewAll: 'جميع الأخبار',
        },
        content: {
            categories: {
                actualite: 'الأخبار',
                communique: 'البيانات',
                evenement: 'الفعاليات',
                alerte: 'التنبيهات والإشعارات',
                all: 'الكل',
            },
            filters: {
                category: 'التصنيف',
                tag: 'الموضوع',
                all: 'الجميع',
            },
            pagination: {
                showing: 'عرض',
                of: 'من',
                results: 'نتيجة',
            },
            detail: {
                publishedOn: 'نُشر في',
                by: 'بواسطة',
                tags: 'الكلمات المفتاحية',
                share: 'مشاركة',
                backToList: 'العودة للقائمة',
                relatedContent: 'محتوى مشابه',
                eventDate: 'تاريخ الفعالية',
                eventLocation: 'المكان',
                expiresOn: 'صالح حتى',
            },
            alertBar: {
                close: 'إغلاق',
            },
            empty: {
                title: 'لا يوجد محتوى',
                description: 'لا يوجد محتوى مطابق لبحثك.',
            },
        },
        pages: {
            port: {
                title: 'الميناء',
                subtitle: 'تعرف على تاريخ، منشآت ورؤية ميناء نواذيبو المستقل.',
                role: {
                    title: 'الدور الاستراتيجي',
                    description: 'يقع ميناء نواذيبو المستقل (PAN) في خليج محمي طبيعياً، وهو مركز لجميع الأنشطة المتعلقة بالصيد، والمحرك الأساسي لتنمية مدينة نواذيبو.',
                    points: [
                        'بوابة الدخول والخروج للعاصمة الاقتصادية للبلاد.',
                        'مركز خدمات في مجالات النقل، الصناعة، والاستيراد والتصدير.',
                        'بوابة استراتيجية لتزويد شمال موريتانيا بالمنتجات والأسماك.',
                    ],
                },
                geography: {
                    title: 'الموقع الجغرافي',
                    description: 'يقع الميناء عند خط عرض 20°54 شمالاً وخط طول 17°03 غرباً، ويتميز بحماية طبيعية من أمواج المحيط الأطلسي عند ملتقى الطرق البحرية.',
                },
                history: {
                    title: 'تاريخ الإنشاءات',
                    milestones: [
                        { year: '1955', event: 'إنشاء أول رصيف صغير من طرف شركة SIGP.' },
                        { year: '1960', event: 'بناء رصيف تجاري بطول 60م و3 أرصفة صيد.' },
                        { year: '1968', event: 'توسعة رصيف الصيد ليصل إلى 300م بتمويل أوروبي.' },
                        { year: '1976', event: 'توسعة الرصيف التجاري وبناء مبان إدارية بتمويل كويتي ودولي.' },
                        { year: '1998', event: 'قرار رسمي بتوسعة المجال البري للميناء.' },
                        { year: '2014', event: 'رصيف جديد بطول 660م، منحدرات RO-RO ومنصة بمساحة 12 هكتاراً.' },
                        { year: '2025', event: 'مشروع تحديث شامل وإدخال أدوات التسيير الرقمي.' },
                    ],
                },
                evolution: {
                    title: 'تطور الموقع',
                    description: 'انتقل الميناء من مجرد رصيف لتفريغ الأسماك إلى مجمع صناعي وتجاري متكامل يضم مصانع تحويل، مجمعات تبريد، ساحات تخزين وأنظمة تسيير حديثة.',
                },
                equipment: {
                    title: 'التجهيزات والأمان',
                    list: [
                        'نظام إرشاد في قناة الدخول ومنارات برية',
                        'نظام إنارة على الأرصفة وفي محيط الميناء',
                        'نظام مراقبة بالكاميرات عند المداخل وداخل الميناء',
                        'نظام مراقبة للسفن عبر AIS',
                        'منافذ للتزود بالمياه والوقود عند رصيف الصيد',
                    ],
                },
                impact: {
                    title: 'الاندماج الاجتماعي والاقتصادي',
                    description: 'يُعتبر الميناء الرئة الاقتصادية لنواذيبو وأكبر مشغل في المدينة، حيث يفتح المجال للقطاع الخاص ويضمن الاستقرار الاجتماعي عبر شراكات قوية.',
                },
                services: {
                    title: 'الخدمات المينائية',
                    list: [
                        'الرسو لجميع أنواع السفن',
                        'مساعدة الملاحة والإرشاد',
                        'مناولة وتخزين البضائع',
                        'حلول لوجستية متكاملة ونقل متعدد الوسائط',
                        'مساحات تخزين حديثة وآمنة',
                        'خدمات إرشاد احترافية',
                        'القطر والمساعدة البحرية',
                        'محطة حاويات بإدارة حديثة',
                    ],
                },
            },
            infrastructure: {
                title: 'البنية التحتية',
                subtitle: 'اكتشف منشآتنا المينائية الحديثة ومعداتنا المتطورة.',
            },
            services: {
                title: 'الخدمات المينائية',
                subtitle: 'مجموعة كاملة من الخدمات لتلبية جميع احتياجاتكم اللوجستية والبحرية.',
            },
            procedures: {
                title: 'الإجراءات',
                subtitle: 'دليل الإجراءات الإدارية والتشغيلية للميناء.',
            },
            tariffs: {
                title: 'التعريفات',
                subtitle: 'اطلع على جدول تعريفات الخدمات المينائية.',
            },
            stopovers: {
                title: 'الرسو',
                subtitle: 'معلومات حول رسو السفن وجدول الميناء.',
            },
            tenders: {
                title: 'المناقصات',
                subtitle: 'اطلع على المناقصات والصفقات العمومية الجارية.',
            },
            documentation: {
                title: 'الوثائق',
                subtitle: 'الوثائق الرسمية والتقارير والنماذج القابلة للتحميل.',
            },
            media: {
                title: 'الإعلام',
                subtitle: 'الأخبار والبيانات الصحفية ومعرض صور الميناء.',
            },
            contact: {
                title: 'اتصل بنا',
                subtitle: 'تواصل معنا للحصول على أي معلومات أو طلب خدمة.',
            },
            search: {
                title: 'البحث',
                subtitle: 'ابحث بسرعة عما تريده في موقعنا.',
                noResults: 'لا توجد نتائج.',
                resultsFor: 'نتائج البحث عن',
            },
        },
        footer: {
            description: 'الميناء المستقل لنواذيبو فاعل رئيسي في التنمية الاقتصادية لموريتانيا، يقدم خدمات مينائية بجودة دولية.',
            quickLinks: 'روابط سريعة',
            services: 'الخدمات',
            legal: 'معلومات قانونية',
            contact: 'اتصل بنا',
            address: 'ص.ب 236، نواذيبو، موريتانيا',
            phone: '+222 45 74 51 06',
            fax: '+222 45 74 51 07',
            email: 'contact@pan.mr',
            rights: '© 2025 الميناء المستقل لنواذيبو. جميع الحقوق محفوظة.',
            legalNotice: 'الإشعار القانوني',
            privacyPolicy: 'سياسة الخصوصية',
            termsOfUse: 'شروط الاستخدام',
            sitemap: 'خريطة الموقع',
            accessibility: 'إمكانية الوصول',
        },
        common: {
            learnMore: 'اعرف المزيد',
            backToHome: 'العودة للرئيسية',
            loading: 'جاري التحميل...',
            comingSoon: 'قريباً',
            comingSoonDesc: 'هذا القسم قيد التطوير. عد قريباً لاكتشاف محتواه.',
            viewDetails: 'عرض التفاصيل',
            download: 'تحميل',
            share: 'مشاركة',
            print: 'طباعة',
            previous: 'السابق',
            next: 'التالي',
            page: 'صفحة',
            of: 'من',
        },
        ged: {
            title: 'الوثائق',
            subtitle: 'مكتبة الوثائق الرسمية والتقارير والنماذج واللوائح للميناء المستقل لنواذيبو.',
            searchPlaceholder: 'البحث عن وثيقة...',
            filters: {
                theme: 'الموضوع',
                direction: 'الإدارة',
                accessLevel: 'الوصول',
                fileType: 'نوع الملف',
                allThemes: 'جميع المواضيع',
                allDirections: 'جميع الإدارات',
                allAccess: 'جميع المستويات',
                allTypes: 'جميع الأنواع',
            },
            themes: {
                reglementation: 'اللوائح',
                tarification: 'التعريفات',
                securite: 'الأمن',
                environnement: 'البيئة',
                infrastructure: 'البنية التحتية',
                commerce: 'التجارة',
                rh: 'الموارد البشرية',
                finance: 'المالية',
                autre: 'أخرى',
            },
            directions: {
                direction_generale: 'الإدارة العامة',
                direction_exploitation: 'إدارة الاستغلال',
                direction_commerciale: 'الإدارة التجارية',
                direction_technique: 'الإدارة التقنية',
                direction_financiere: 'الإدارة المالية',
                direction_rh: 'إدارة الموارد البشرية',
                capitainerie: 'إدارة الميناء',
                securite: 'مصلحة الأمن',
                autre: 'أخرى',
            },
            accessLevels: {
                public: 'عام',
                restricted: 'مقيد',
                internal: 'داخلي',
            },
            fileTypes: {
                pdf: 'PDF',
                doc: 'Word',
                docx: 'Word',
                xlsx: 'Excel',
                xls: 'Excel',
                ppt: 'PowerPoint',
                pptx: 'PowerPoint',
                jpg: 'صورة',
                png: 'صورة',
                other: 'أخرى',
            },
            labels: {
                reference: 'المرجع',
                version: 'النسخة',
                versions: 'نسخ',
                currentVersion: 'النسخة الحالية',
                versionHistory: 'سجل النسخ',
                uploadedBy: 'أضافه',
                uploadedOn: 'أضيف في',
                keywords: 'الكلمات المفتاحية',
                categories: 'التصنيفات',
                language: 'اللغة',
                accessLevel: 'مستوى الوصول',
                direction: 'الإدارة',
                theme: 'الموضوع',
                downloadFile: 'تحميل الملف',
                noDocuments: 'لا توجد وثائق',
                noDocumentsDesc: 'لا توجد وثائق مطابقة لبحثك.',
                restrictedAccess: 'وصول مقيد',
                restrictedDesc: 'يتطلب هذا المستند إذناً للتحميل.',
                internalAccess: 'وثيقة داخلية',
                internalDesc: 'هذه الوثيقة مخصصة لموظفي الميناء.',
                loginRequired: 'يتطلب تسجيل الدخول',
            },
            languages: {
                fr: 'الفرنسية',
                ar: 'العربية',
                fr_ar: 'ثنائي اللغة',
            },
        },
    },
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale] || dictionaries.fr;
}
