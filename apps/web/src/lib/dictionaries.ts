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
            dg_word: {
                title: string;
                content: string;
            };
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
                items: { title: string; description: string }[];
            };
            governance: {
                title: string;
                description: string;
                board: {
                    title: string;
                    headerRole: string;
                    headerAttribution: string;
                    members: { role: string; attribution: string }[];
                };
            };
            services: {
                title: string;
                list: string[];
            };
        };
        infrastructure: {
            title: string;
            subtitle: string;
            gallery: {
                title: string;
                items: { title: string; description: string }[];
            };
            quais: {
                title: string;
                items: { name: string; info: string; length: string; draft: string }[];
            };
            zones: {
                title: string;
                items: { name: string; area: string; purpose: string }[];
            };
        };
        services: {
            title: string;
            subtitle: string;
            list: { title: string; desc: string; icon: string; points: string[] }[];
        };
        procedures: {
            title: string;
            subtitle: string;
            steps: { title: string; desc: string }[];
        };
        tariffs: {
            title: string;
            subtitle: string;
            categories: { title: string; details: string[] }[];
        };
        stopovers: {
            title: string;
            subtitle: string;
            recent: {
                title: string;
                items: { name: string; type: string; date: string; time: string; status: string }[];
            };
            planning: {
                title: string;
                desc: string;
            };
        };
        tenders: { title: string; subtitle: string };
        documentation: { title: string; subtitle: string };
        media: {
            title: string;
            subtitle: string;
            news: {
                title: string;
                items: { title: string; date: string; category: string; excerpt: string }[];
            };
            gallery: {
                title: string;
                desc: string;
            };
        };
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
                'Le Port Autonome de Nouadhibou est la principale infrastructure portuaire de Mauritanie, offrant des services maritimes et logistiques de qualité pour soutenir le commerce international et le développement économique de la région.',
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
                subtitle: 'Découvrez l\'histoire et l\'évolution du Port Autonome de Nouadhibou, ainsi que son impact socio-économique sur la région.',
                dg_word: {
                    title: 'Mot du Directeur Général',
                    content: 'Cher visiteur, bienvenue au Port Autonome de Nouadhibou. Notre mission est de garantir une connectivité maritime optimale tout en favorisant la croissance économique régionale.',
                },
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
                        { year: '1955', event: 'Développement des infrastructures de pêche. Extension des installations pour soutenir l\'industrie de la pêche.' },
                        { year: '1968', event: 'Développement des infrastructures de pêche. Extension des installations pour soutenir l\'industrie de la pêche.' },
                        { year: '2014', event: 'Extension du port avec nouvelles plateformes RO-RO. Modernisation majeure des infrastructures pour accueillir plus de navires.' },
                        { year: '2025', event: 'Modernisation et digitalisation en cours. Projet de transformation numérique et d\'optimisation des opérations portuaires.' },
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
                    title: 'Intégration Socio-Économique',
                    items: [
                        { title: 'Premier employeur de Nouadhibou', description: 'Le Port Autonome de Nouadhibou est le plus grand employeur de la région, offrant des milliers d\'emplois directs et indirects.' },
                        { title: '80% des exportations liées à la pêche', description: 'Le port joue un rôle crucial dans l\'économie nationale en facilitant la majorité des exportations de produits de la pêche.' },
                        { title: '+50 partenaires privés', description: 'Un réseau étendu de partenaires commerciaux et industriels contribue au dynamisme économique du port.' },
                    ],
                },
                governance: {
                    title: 'Gouvernance',
                    description: 'Découvrez la structure organisationnelle et les instances dirigeantes du Port Autonome de Nouadhibou.',
                    board: {
                        title: 'Conseil d’Administration',
                        headerRole: 'Rôle',
                        headerAttribution: 'Attributions',
                        members: [
                            { role: 'Président', attribution: 'Direction stratégique et supervision des activités du port' },
                            { role: 'Membres', attribution: 'Représentants des ministères et des acteurs économiques' },
                        ],
                    },
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
                subtitle: 'Découvrez nos installations modernes et nos équipements de pointe qui garantissent des opérations portuaires efficaces et sécurisées.',
                gallery: {
                    title: 'Une galerie photo expressive',
                    items: [
                        { title: 'Terminal conteneurs', description: 'Terminal moderne équipé pour la gestion efficace des conteneurs avec des équipements de pointe.' },
                        { title: 'Zone de pesage 100 tonnes', description: 'Capacité de pesage haute précision pour tous types de cargaisons.' },
                        { title: 'Stockage frigorifique', description: 'Installations modernes pour la conservation des produits périssables.' },
                        { title: 'Remorquage en action', description: 'Assistance dynamique et sécurisée pour les manœuvres des navires.' },
                    ],
                },
                quais: {
                    title: 'Quais & Terminaux',
                    items: [
                        { name: 'Quai de Commerce', info: 'Quai principal dédié aux activités commerciales et au transport de marchandises diverses.', length: '350m', draft: '9.0m' },
                        { name: 'Quai de Pêche Industrielle', info: 'Infrastructure spécialisée pour les navires de pêche hauturière avec installations de déchargement.', length: '280m', draft: '7.0m' },
                        { name: 'Terminal Pétrolier', info: 'Terminal spécialisé pour le déchargement des produits pétroliers avec systèmes de sécurité avancés.', length: '200m', draft: '12.0m' },
                    ],
                },
                zones: {
                    title: 'Zones Dédiées',
                    items: [
                        { name: 'Zone sous douane', area: '12 Hectares', purpose: 'Stockage temporaire et logistique.' },
                        { name: 'Zone Industrielle', area: '15 Hectares', purpose: 'Unités de transformation de poisson.' },
                        { name: 'Zone Franche', area: 'Extension en cours', purpose: 'Incitations fiscales et export.' },
                    ],
                },
            },
            services: {
                title: 'Nos Services',
                subtitle: 'Le Port Autonome de Nouadhibou propose une gamme complète de services portuaires et logistiques pour répondre à tous vos besoins.',
                list: [
                    {
                        title: 'Manutention',
                        desc: 'Services de chargement et déchargement optimisés pour tous types de marchandises avec un matériel spécialisé garantissant une manutention sécurisée et efficace.',
                        icon: 'crane',
                        points: ['Chargement et déchargement optimisés', 'Matériel spécialisé pour manutention sécurisée', 'Personnel qualifié et expérimenté', 'Opérations 24/7'],
                    },
                    {
                        title: 'Transbordements',
                        desc: 'Opérations rapides sans stockage intermédiaire permettant une réduction significative des coûts logistiques et une optimisation de la chaîne d\'approvisionnement.',
                        icon: 'refresh-cw',
                        points: ['Opérations rapides sans stockage', 'Réduction des coûts logistiques', 'Coordination optimisée', 'Suivi en temps réel'],
                    },
                    {
                        title: 'Entreposage',
                        desc: 'Espaces de stockage diversifiés incluant des zones sous douane, des installations frigorifiques et des entrepôts sécurisés accessibles 24h/24 et 7j/7.',
                        icon: 'box',
                        points: ['Espaces sous douane', 'Zones frigorifiques', 'Stockage sécurisé', 'Accès 24/7'],
                    },
                    {
                        title: 'Transit & Logistique',
                        desc: 'Services complets de coordination entre transport maritime et terrestre avec une gestion douanière simplifiée pour fluidifier vos opérations logistiques.',
                        icon: 'truck',
                        points: ['Coordination transport maritime/terrestre', 'Gestion douanière simplifiée', 'Solutions logistiques intégrées', 'Suivi administratif complet'],
                    },
                    {
                        title: 'Services aux Navires',
                        desc: 'Assistance complète pour les navires incluant le pilotage, le remorquage, l\'avitaillement et la fourniture d\'eau douce pour garantir des escales optimales.',
                        icon: 'anchor',
                        points: ['Pilotage professionnel', 'Services de remorquage', 'Avitaillement', 'Fourniture d\'eau douce'],
                    },
                    {
                        title: 'Gestion des Terminaux',
                        desc: 'Exploitation efficace des terminaux spécialisés pour conteneurs, vracs et marchandises diverses avec des équipements modernes et un personnel qualifié.',
                        icon: 'layout',
                        points: ['Terminal conteneurs', 'Terminal vracs', 'Terminal pêche', 'Equipements modernes'],
                    },
                ],
            },
            procedures: {
                title: 'Procédures',
                subtitle: 'Guide des formalités administratives et opérationnelles.',
                steps: [
                    { title: 'Déclaration Arrivée', desc: 'Soumission des documents via le guichet unique 24h avant.' },
                    { title: 'Contrôle Sanitaire', desc: 'Inspection obligatoire pour les navires de pêche.' },
                    { title: 'Dédouanement', desc: 'Traitement électronique des déclarations de marchandises.' },
                ],
            },
            tariffs: {
                title: 'Tarifs',
                subtitle: 'Consultez les barèmes des redevances portuaires.',
                categories: [
                    { title: 'Redevances Navires', details: ['Pilotage', 'Remorquage', 'Amarrage'] },
                    { title: 'Redevances Marchandises', details: ['Passage portuaire', 'Stationnement', 'Pesage'] },
                    { title: 'Services Annexes', details: ['Eau potable', 'Électricité', 'Évacuation déchets'] },
                ],
            },
            stopovers: {
                title: 'Escales',
                subtitle: 'Informations en temps réel sur les mouvements des navires au port.',
                recent: {
                    title: 'Dernières Escales',
                    items: [
                        { name: 'MSC JOANNA', type: 'Porte-conteneurs', date: '2024-03-05', time: '08:30', status: 'À quai' },
                        { name: 'SEA LADY', type: 'Pétrolier', date: '2024-03-05', time: '14:15', status: 'En attente' },
                        { name: 'ATLANTIC STAR', type: 'Navire de pêche', date: '2024-03-04', time: '22:00', status: 'Parti' },
                    ],
                },
                planning: {
                    title: 'Planning Hebdomadaire',
                    desc: 'Accédez au planning complet des arrivées prévues pour les 7 prochains jours.',
                },
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
                subtitle: 'Restez informé de l\'actualité portuaire et des événements majeurs.',
                news: {
                    title: 'Actualités Récentes',
                    items: [
                        { title: 'Inauguration du nouveau terminal', date: '2024-02-28', category: 'Infrastructure', excerpt: 'Le PAN franchit une nouvelle étape avec l\'ouverture d\'un terminal moderne...' },
                        { title: 'Signature d\'un partenariat logistique', date: '2024-02-15', category: 'Partenariat', excerpt: 'Un accord stratégique a été signé pour renforcer les capacités de stockage...' },
                    ],
                },
                gallery: {
                    title: 'Galerie Photos',
                    desc: 'Découvrez en images la vie quotidienne au port et nos installations.',
                },
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
                subtitle: 'اكتشف تاريخ وتطور الميناء المستقل لنواذيبو، بالإضافة إلى تأثيره الاجتماعي والاقتصادي على المنطقة.',
                dg_word: {
                    title: 'كلمة المدير العام',
                    content: 'عزيزي الزائر، مرحباً بكم في الميناء المستقل لنواذيبو. مهمتنا هي ضمان ربط بحري أمثل مع تعزيز النمو الاقتصادي الإقليمي.',
                },
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
                        { year: '1955', event: 'تطوير البنية التحتية للصيد. توسعة المنشآت لدعم صناعة الصيد.' },
                        { year: '1968', event: 'تطوير البنية التحتية للصيد. توسعة المنشآت لدعم صناعة الصيد.' },
                        { year: '2014', event: 'توسعة الميناء مع منصات RO-RO جديدة. تحديث رئيسي للبنية التحتية لاستقبال المزيد من السفن.' },
                        { year: '2025', event: 'التحديث والرقمنة جارية. مشروع تحول رقمي وتحسين العمليات المينائية.' },
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
                    items: [
                        { title: 'أكبر مشغل في نواذيبو', description: 'الميناء المستقل لنواذيبو هو أكبر مشغل في المنطقة، حيث يوفر آلاف الوظائف المباشرة وغير المباشرة.' },
                        { title: '80% من الصادرات مرتبطة بالصيد', description: 'يلعب الميناء دوراً حاسماً في الاقتصاد الوطني من خلال تسهيل غالبية صادرات منتجات الصيد.' },
                        { title: '+50 شريك من القطاع الخاص', description: 'تساهم شبكة واسعة من الشركاء التجاريين والصناعيين في الديناميكية الاقتصادية للميناء.' },
                    ],
                },
                governance: {
                    title: 'الحكامة',
                    description: 'اكتشف الهيكل التنظيمي والهيئات الإدارية للميناء المستقل لنواذيبو.',
                    board: {
                        title: 'مجلس الإدارة',
                        headerRole: 'الدور',
                        headerAttribution: 'الاختصاصات',
                        members: [
                            { role: 'الرئيس', attribution: 'التوجه الاستراتيجي والإشراف على أنشطة الميناء' },
                            { role: 'الأعضاء', attribution: 'ممثلون عن الوزارات والفاعلين الاقتصاديين' },
                        ],
                    },
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
                subtitle: 'اكتشف منشآتنا الحديثة ومعداتنا المتطورة التي تضمن عمليات مينائية فعالة وآمنة.',
                gallery: {
                    title: 'معرض صور تعبيري',
                    items: [
                        { title: 'محطة الحاويات', description: 'محطة حديثة مجهزة لتسيير فعال للحاويات بأحدث المعدات.' },
                        { title: 'منطقة وزن 100 طن', description: 'قدرة وزن عالية الدقة لجميع أنواع الشحنات.' },
                        { title: 'التخزين المبرد', description: 'منشآت حديثة للحفاظ على المنتجات سريعة التلف.' },
                        { title: 'القطر أثناء العمل', description: 'مساعدة ديناميكية وآمنة لمناورات السفن.' },
                    ],
                },
                quais: {
                    title: 'الأرصفة والمحطات',
                    items: [
                        { name: 'رصيف الصيد', info: 'مخصص لسفن الصيد بأعالي البحار والصيد التقليدي.', length: '300م', draft: '6.0م' },
                        { name: 'الرصيف التجاري', info: 'متعدد الاختصاصات للبضائع العامة والحاويات.', length: '660م', draft: '10.5م' },
                        { name: 'محطة النفط', info: 'منشآت آمنة لتفريغ المحروقات والمواد البترولية.', length: '200م', draft: '12.0م' },
                    ],
                },
                zones: {
                    title: 'المناطق المتخصصة',
                    items: [
                        { name: 'المنطقة الجمركية', area: '12 هكتاراً', purpose: 'التخزين المؤقت والخدمات اللوجستية.' },
                        { name: 'المنطقة الصناعية', area: '15 هكتاراً', purpose: 'وحدات معالجة وتصنيع الأسماك.' },
                        { name: 'المنطقة الحرة', area: 'قيد التوسعة', purpose: 'حوافز ضريبية ودعم التصدير.' },
                    ],
                },
            },
            services: {
                title: 'خدماتنا',
                subtitle: 'يقدم الميناء المستقل لنواذيبو مجموعة كاملة من الخدمات المينائية واللوجستية لتلبية جميع احتياجاتكم.',
                list: [
                    {
                        title: 'المناولة',
                        desc: 'خدمات شحن وتفريغ محسنة لجميع أنواع البضائع مع معدات متخصصة تضمن مناولة آمنة وفعالة.',
                        icon: 'crane',
                        points: ['شحن وتفريغ محسن', 'معدات متخصصة لمناولة آمنة', 'طاقم مؤهل وذو خبرة', 'عمليات على مدار الساعة'],
                    },
                    {
                        title: 'المسافنة',
                        desc: 'عمليات سريعة بدون تخزين وسيط تسمح بخفض كبير في التكاليف اللوجستية وتحسين سلسلة التوريد.',
                        icon: 'refresh-cw',
                        points: ['عمليات سريعة بدون تخزين', 'خفض التكاليف اللوجستية', 'تنسيق محسن', 'تتبع في الوقت الفعلي'],
                    },
                    {
                        title: 'التخزين',
                        desc: 'مساحات تخزين متنوعة تشمل مناطق مستودعات جمركية، منشآت تبريد ومستودعات آمنة متاحة على مدار الساعة.',
                        icon: 'box',
                        points: ['مناطق مستودعات جمركية', 'مناطق تبريد', 'تخزين آمن', 'وصول 24/7'],
                    },
                    {
                        title: 'العبور والخدمات اللوجستية',
                        desc: 'خدمات تنسيق كاملة بين النقل البحري والبري مع إدارة جمركية مبسطة لتسهيل عملياتكم اللوجستية.',
                        icon: 'truck',
                        points: ['تنسيق النقل البحري/البري', 'إدارة جمركية مبسطة', 'حلول لوجستية متكاملة', 'متابعة إدارية كاملة'],
                    },
                    {
                        title: 'خدمات السفن',
                        desc: 'مساعدة كاملة للسفن تشمل الإرشاد، القطر، التزويد بالوقود وتوفير المياه العذبة لضمان رسو مثالي.',
                        icon: 'anchor',
                        points: ['إرشاد مهني', 'خدمات القطر', 'التزويد بالوقود', 'توفير المياه العذبة'],
                    },
                    {
                        title: 'تسيير المحطات',
                        desc: 'استغلال فعال للمحطات المتخصصة للحاويات، الصب والبضائع المتنوعة مع معدات حديثة وطاقم مؤهل.',
                        icon: 'layout',
                        points: ['محطة الحاويات', 'محطة الصب', 'محطة الصيد', 'معدات حديثة'],
                    },
                ],
            },
            procedures: {
                title: 'الإجراءات',
                subtitle: 'دليل الإجراءات الإدارية والتشغيلية للميناء.',
                steps: [
                    { title: 'إعلان الوصول', desc: 'تقديم المستندات عبر الشباك الموحد قبل 24 ساعة.' },
                    { title: 'الرقابة الصحية', desc: 'تفتيش إلزامي لسفن الصيد والمنتجات البحرية.' },
                    { title: 'التخليص الجمركي', desc: 'المعالجة الإلكترونية لتصاريح البضائع.' },
                ],
            },
            tariffs: {
                title: 'التعريفات',
                subtitle: 'اطلع على جدول تعريفات الخدمات المينائية.',
                categories: [
                    { title: 'رسوم السفن', details: ['الإرشاد', 'القطر', 'الرسو'] },
                    { title: 'رسوم البضائع', details: ['العبور المينائي', 'التخزين', 'الوزن'] },
                    { title: 'خدمات ملحقة', details: ['المياه الصالحة للشرب', 'الكهرباء', 'إخلاء النفايات'] },
                ],
            },
            stopovers: {
                title: 'الرسو',
                subtitle: 'معلومات مباشرة حول حركة السفن داخل الميناء.',
                recent: {
                    title: 'آخر عمليات الرسو',
                    items: [
                        { name: 'MSC JOANNA', type: 'حاملة حاويات', date: '2024-03-05', time: '08:30', status: 'في الرصيف' },
                        { name: 'SEA LADY', type: 'ناقلة نفط', date: '2024-03-05', time: '14:15', status: 'في الانتظار' },
                        { name: 'ATLANTIC STAR', type: 'سفينة صيد', date: '2024-03-04', time: '22:00', status: 'مغادر' },
                    ],
                },
                planning: {
                    title: 'التخطيط الأسبوعي',
                    desc: 'اطلع على الجدول الكامل للوصول المتوقع خلال الأيام الـ 7 القادمة.',
                },
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
                subtitle: 'ابق على اطلاع بآخر أخبار الميناء والفعاليات الكبرى.',
                news: {
                    title: 'أهم الأخبار',
                    items: [
                        { title: 'تدشين المحطة الجديدة للحاويات', date: '2024-02-28', category: 'البنية التحتية', excerpt: 'يخطو ميناء نواذيبو خطوة جديدة نحو العصرنة عبر تدشين مجمع مجهز...' },
                        { title: 'توقيع شراكة لوجستية استراتيجية', date: '2024-02-15', category: 'شراكات', excerpt: 'تم توقيع اتفاقية لتعزيز القدرات الاستيعابية والتخزينية للميناء...' },
                    ],
                },
                gallery: {
                    title: 'معرض الصور',
                    desc: 'اكتشف بالصور الحياة اليومية ومنشآت ميناء نواذيبو المستقل.',
                },
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
    en: {
        nav: {
            home: 'Home',
            port: 'The Port',
            infrastructure: 'Infrastructures',
            services: 'Services',
            procedures: 'Procedures',
            tariffs: 'Tariffs',
            stopovers: 'Stopovers',
            tenders: 'Tenders',
            documentation: 'Documentation',
            media: 'Media',
            contact: 'Contact',
            search: 'Search',
            searchPlaceholder: 'Search the site...',
        },
        hero: {
            title: 'Nouadhibou Autonomous Port',
            subtitle:
                'The Nouadhibou Autonomous Port is the main port infrastructure of Mauritania, offering quality maritime and logistics services to support international trade and regional economic development.',
            cta: 'Discover our services',
            ctaSecondary: 'Contact us',
        },
        stats: {
            title: 'PAN in figures',
        },
        services: {
            title: 'Our Services',
            subtitle: 'Comprehensive port solutions to meet all your logistical needs.',
            viewAll: 'View all services',
            description: 'Detailed description',
            features: 'Highlights',
            procedure: 'Procedure',
            requiredDocuments: 'Required documents',
            beneficiaries: 'Beneficiaries',
            prerequisites: 'Prerequisites',
            deadline: 'Processing time',
            costs: 'Costs and tariffs',
            contact: 'Contact',
            backToList: 'Back to services',
            submitRequest: 'Submit a request',
            requestTypes: {
                information: 'Information request',
                reclamation: 'Complaint',
                document_request: 'Document request',
                rendez_vous: 'Appointment request',
            },
            formLabels: {
                type: 'Request type',
                name: 'Full name',
                namePlaceholder: 'Your name',
                email: 'Email',
                emailPlaceholder: 'your@email.com',
                phone: 'Phone',
                company: 'Company',
                companyPlaceholder: 'Your company name',
                subject: 'Subject',
                message: 'Message',
                messagePlaceholder: 'Describe your request in detail...',
                attachments: 'Drag your attachments here (PDF, Word, images)',
                submit: 'Send request',
            },
            formErrors: {
                required: 'Please fill in all required fields.',
            },
            formSuccess: {
                title: 'Request sent successfully!',
                message: 'We have received your request. You will receive a confirmation by email.',
                reference: 'Your reference:',
            },
        },
        news: {
            title: 'News',
            subtitle: 'Latest news from the Nouadhibou Autonomous Port.',
            readMore: 'Read more',
            viewAll: 'View all news',
        },
        content: {
            categories: {
                actualite: 'News',
                communique: 'Press Releases',
                evenement: 'Events',
                alerte: 'Alerts & Notices',
                all: 'All',
            },
            filters: {
                category: 'Category',
                tag: 'Theme',
                all: 'All',
            },
            pagination: {
                showing: 'Showing',
                of: 'of',
                results: 'results',
            },
            detail: {
                publishedOn: 'Published on',
                by: 'by',
                tags: 'Keywords',
                share: 'Share',
                backToList: 'Back to list',
                relatedContent: 'Similar content',
                eventDate: 'Event date',
                eventLocation: 'Location',
                expiresOn: 'Valid until',
            },
            alertBar: {
                close: 'Close',
            },
            empty: {
                title: 'No content',
                description: 'No content matches your search.',
            },
        },
        pages: {
            port: {
                title: 'The Port',
                subtitle: 'Discover the history and evolution of the Nouadhibou Autonomous Port, as well as its socio-economic impact on the region.',
                dg_word: {
                    title: 'Message from the Director General',
                    content: 'Dear visitor, welcome to the Nouadhibou Autonomous Port. Our mission is to guarantee optimal maritime connectivity while promoting regional economic growth.',
                },
                role: {
                    title: 'Strategic Role',
                    description: 'The Nouadhibou Autonomous Port (PAN) is located in a naturally protected bay. It is the pivot for all fishing activities and the engine of development for Nouadhibou.',
                    points: [
                        "Gateway for the country's economic capital.",
                        'Service center for transport, industry, and international trade.',
                        'Strategic bridge for the national fishing industry.',
                    ],
                },
                geography: {
                    title: 'Geographical Situation',
                    description: 'Located at 20°54 N and 17°03 W, the port benefits from an exceptional natural shelter against Atlantic swells, at the crossroads of major maritime routes.',
                },
                history: {
                    title: 'History & Milestones',
                    milestones: [
                        { year: '1955', event: 'Development of fishing infrastructure. Extension of facilities to support the fishing industry.' },
                        { year: '1968', event: 'Development of fishing infrastructure. Extension of facilities to support the fishing industry.' },
                        { year: '2014', event: 'Port extension with new RO-RO platforms. Major infrastructure modernization to accommodate more vessels.' },
                        { year: '2025', event: 'Modernization and digitalization in progress. Digital transformation and port operations optimization project.' },
                    ],
                },
                evolution: {
                    title: 'Site Evolution',
                    description: 'From a modest fishing quay, the site has become an integrated industrial and commercial complex with processing plants, cold rooms, storage areas, and modern management systems.',
                },
                equipment: {
                    title: 'Equipment & Security',
                    list: [
                        'Guidage system in the access channel and land lighthouses',
                        'Full lighting of quays and port perimeter',
                        'Video surveillance (CCTV) at entrances and inside the port',
                        'Vessel monitoring system by AIS',
                        'Water and fuel refueling points on fishing quays',
                    ],
                },
                impact: {
                    title: 'Socio-Economic Integration',
                    items: [
                        { title: 'First employer of Nouadhibou', description: 'The Nouadhibou Autonomous Port is the region\'s largest employer, offering thousands of direct and indirect jobs.' },
                        { title: '80% of exports related to fishing', description: 'The port plays a crucial role in the national economy by facilitating the majority of fishing product exports.' },
                        { title: '+50 private partners', description: 'An extensive network of commercial and industrial partners contributes to the port\'s economic dynamism.' },
                    ],
                },
                governance: {
                    title: 'Governance',
                    description: 'Discover the organizational structure and governing bodies of the Nouadhibou Autonomous Port.',
                    board: {
                        title: 'Board of Directors',
                        headerRole: 'Role',
                        headerAttribution: 'Attributes',
                        members: [
                            { role: 'Chairman', attribution: 'Strategic direction and supervision of port activities' },
                            { role: 'Members', attribution: 'Representatives of ministries and economic actors' },
                        ],
                    },
                },
                services: {
                    title: 'Port Services',
                    list: [
                        'Docking for all types of vessels',
                        'Navigation aid and guidance',
                        'Cargo handling and storage',
                        'Integrated logistics and multimodal transport',
                        'Modern and secure storage spaces',
                        'Professional pilotage services',
                        'Towing and sea assistance',
                        'Latest generation container terminal',
                    ],
                },
            },
            infrastructure: {
                title: 'Infrastructure',
                subtitle: 'Discover our modern facilities and state-of-the-art equipment that define efficient and secure port operations.',
                gallery: {
                    title: 'Expressive photo gallery',
                    items: [
                        { title: 'Container Terminal', description: 'Modern terminal equipped for efficient container management with state-of-the-art equipment.' },
                        { title: '100-ton weighing zone', description: 'High-precision weighing capacity for all types of cargo.' },
                        { title: 'Cold Storage', description: 'Modern facilities for the conservation of perishable products.' },
                        { title: 'Towing in action', description: 'Dynamic and secure assistance for vessel maneuvers.' },
                    ],
                },
                quais: {
                    title: 'Quays & Terminals',
                    items: [
                        { name: 'Commercial Quay', info: 'Main quay dedicated to commercial activities and transport of various goods.', length: '350m', draft: '9.0m' },
                        { name: 'Industrial Fishing Quay', info: 'Specialized infrastructure for deep-sea fishing vessels with unloading facilities.', length: '280m', draft: '7.0m' },
                        { name: 'Oil Terminal', info: 'Specialized terminal for unloading petroleum products with advanced safety systems.', length: '200m', draft: '12.0m' },
                    ],
                },
                zones: {
                    title: 'Dedicated Zones',
                    items: [
                        { name: 'Customs Zone', area: '12 Hectares', purpose: 'Temporary storage and logistics.' },
                        { name: 'Industrial Zone', area: '15 Hectares', purpose: 'Fish processing units.' },
                        { name: 'Free Zone', area: 'Extension in progress', purpose: 'Tax incentives and export.' },
                    ],
                },
            },
            services: {
                title: 'Our Services',
                subtitle: 'The Nouadhibou Autonomous Port offers a full range of port and logistical services to meet all your needs.',
                list: [
                    {
                        title: 'Handling',
                        desc: 'Optimized loading and unloading services for all types of cargo with specialized equipment guaranteeing secure and efficient handling.',
                        icon: 'crane',
                        points: ['Optimized loading/unloading', 'Specialized secure equipment', 'Qualified personnel', '24/7 operations'],
                    },
                    {
                        title: 'Transshipments',
                        desc: 'Rapid operations without intermediate storage allowing significant reduction in logistical costs and supply chain optimization.',
                        icon: 'refresh-cw',
                        points: ['Rapid operations', 'Logistical cost reduction', 'Optimized coordination', 'Real-time tracking'],
                    },
                    {
                        title: 'Warehousing',
                        desc: 'Diversified storage spaces including bonded areas, cold storage facilities, and secure warehouses accessible 24/7.',
                        icon: 'box',
                        points: ['Bonded areas', 'Cold storage', 'Secure warehousing', '24/7 access'],
                    },
                    {
                        title: 'Transit & Logistics',
                        desc: 'Comprehensive coordination services between maritime and land transport with simplified customs management to fluidize your logistical operations.',
                        icon: 'truck',
                        points: ['Maritime/land coordination', 'Simplified customs', 'Integrated solutions', 'Full admin follow-up'],
                    },
                    {
                        title: 'Vessel Services',
                        desc: 'Complete assistance for vessels including pilotage, towing, bunkering, and fresh water supply to guarantee optimal stopovers.',
                        icon: 'anchor',
                        points: ['Professional pilotage', 'Towing services', 'Bunkering', 'Fresh water supply'],
                    },
                    {
                        title: 'Terminal Management',
                        desc: 'Efficient exploitation of specialized terminals for containers, bulk, and general cargo with modern equipment and qualified personnel.',
                        icon: 'layout',
                        points: ['Container terminal', 'Bulk terminal', 'Fishing terminal', 'Modern equipment'],
                    },
                ],
            },
            procedures: {
                title: 'Procedures',
                subtitle: 'Guide to administrative and operational formalities.',
                steps: [
                    { title: 'Arrival Declaration', desc: 'Submission of documents via the single window 24h before.' },
                    { title: 'Health Control', desc: 'Mandatory inspection for fishing vessels.' },
                    { title: 'Customs Clearance', desc: 'Electronic processing of cargo declarations.' },
                ],
            },
            tariffs: {
                title: 'Tariffs',
                subtitle: 'Consult the scales of port fees.',
                categories: [
                    { title: 'Vessel Fees', details: ['Pilotage', 'Towing', 'Mooring'] },
                    { title: 'Cargo Fees', details: ['Port passage', 'Parking', 'Weighing'] },
                    { title: 'Ancillary Services', details: ['Drinking water', 'Electricity', 'Waste disposal'] },
                ],
            },
            stopovers: {
                title: 'Stopovers',
                subtitle: 'Real-time information on vessel movements at the port.',
                recent: {
                    title: 'Latest Stopovers',
                    items: [
                        { name: 'MSC JOANNA', type: 'Container ship', date: '2024-03-05', time: '08:30', status: 'At quay' },
                        { name: 'SEA LADY', type: 'Oil tanker', date: '2024-03-05', time: '14:15', status: 'Waiting' },
                        { name: 'ATLANTIC STAR', type: 'Fishing vessel', date: '2024-03-04', time: '22:00', status: 'Departed' },
                    ],
                },
                planning: {
                    title: 'Weekly Planning',
                    desc: 'Access the full planning of scheduled arrivals for the next 7 days.',
                },
            },
            tenders: {
                title: 'Tenders',
                subtitle: 'Consult current tenders and public contracts.',
            },
            documentation: {
                title: 'Documentation',
                subtitle: 'Official documents, reports, and downloadable forms.',
            },
            media: {
                title: 'Media',
                subtitle: 'Stay informed about port news and major events.',
                news: {
                    title: 'Recent News',
                    items: [
                        { title: 'Inauguration of the new terminal', date: '2024-02-28', category: 'Infrastructure', excerpt: 'PAN takes a new step with the opening of a modern terminal...' },
                        { title: 'Signing of a logistical partnership', date: '2024-02-15', category: 'Partnership', excerpt: 'A strategic agreement was signed to strengthen storage capacities...' },
                    ],
                },
                gallery: {
                    title: 'Photo Gallery',
                    desc: 'Discover in images the daily life at the port and our facilities.',
                },
            },
            contact: {
                title: 'Contact',
                subtitle: 'Contact us for any information or service request.',
            },
            search: {
                title: 'Search',
                subtitle: 'Quickly find what you are looking for on our site.',
                noResults: 'No results found.',
                resultsFor: 'Results for',
            },
        },
        footer: {
            description:
                "The Nouadhibou Autonomous Port is a major player in Mauritania's economic development, offering world-class port services.",
            quickLinks: 'Quick Links',
            services: 'Services',
            legal: 'Legal Information',
            contact: 'Contact',
            address: 'BP 236, Nouadhibou, Mauritania',
            phone: '+222 45 74 51 06',
            fax: '+222 45 74 51 07',
            email: 'contact@pan.mr',
            rights: '© 2025 Nouadhibou Autonomous Port. All rights reserved.',
            legalNotice: 'Legal Notice',
            privacyPolicy: 'Privacy Policy',
            termsOfUse: 'Terms of Use',
            sitemap: 'Sitemap',
            accessibility: 'Accessibility',
        },
        common: {
            learnMore: 'Learn more',
            backToHome: 'Back to home',
            loading: 'Loading...',
            comingSoon: 'Coming soon',
            comingSoonDesc: 'This section is under development. Come back soon to discover its content.',
            viewDetails: 'View details',
            download: 'Download',
            share: 'Share',
            print: 'Print',
            previous: 'Previous',
            next: 'Next',
            page: 'Page',
            of: 'of',
        },
        ged: {
            title: 'Documentation',
            subtitle: 'Library of official documents, reports, forms, and regulations of the Nouadhibou Autonomous Port.',
            searchPlaceholder: 'Search for a document...',
            filters: {
                theme: 'Theme',
                direction: 'Department',
                accessLevel: 'Access',
                fileType: 'File type',
                allThemes: 'All themes',
                allDirections: 'All departments',
                allAccess: 'All levels',
                allTypes: 'All types',
            },
            themes: {
                reglementation: 'Regulation',
                tarification: 'Tariffing',
                securite: 'Security',
                environnement: 'Environment',
                infrastructure: 'Infrastructure',
                commerce: 'Trade',
                rh: 'Human Resources',
                finance: 'Finance',
                autre: 'Other',
            },
            directions: {
                direction_generale: 'General Direction',
                direction_exploitation: 'Operation Direction',
                direction_commerciale: 'Commercial Direction',
                direction_technique: 'Technical Direction',
                direction_financiere: 'Finance Direction',
                direction_rh: 'HR Direction',
                capitainerie: 'Port Authority',
                securite: 'Security Service',
                autre: 'Other',
            },
            accessLevels: {
                public: 'Public',
                restricted: 'Restricted',
                internal: 'Internal',
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
                other: 'Other',
            },
            labels: {
                reference: 'Reference',
                version: 'Version',
                versions: 'versions',
                currentVersion: 'Current version',
                versionHistory: 'Version history',
                uploadedBy: 'Uploaded by',
                uploadedOn: 'Uploaded on',
                keywords: 'Keywords',
                categories: 'Categories',
                language: 'Language',
                accessLevel: 'Access level',
                direction: 'Department',
                theme: 'Theme',
                downloadFile: 'Download file',
                noDocuments: 'No documents',
                noDocumentsDesc: 'No documents match your search.',
                restrictedAccess: 'Restricted access',
                restrictedDesc: 'This document requires authorization to be downloaded.',
                internalAccess: 'Internal document',
                internalDesc: 'This document is reserved for PAN personnel.',
                loginRequired: 'Login required',
            },
            languages: {
                fr: 'French',
                ar: 'Arabic',
                en: 'English',
                es: 'Spanish',
                fr_ar: 'Bilingual (FR/AR)',
            },
        },
    },
    es: {
        nav: {
            home: 'Inicio',
            port: 'El Puerto',
            infrastructure: 'Infraestructuras',
            services: 'Servicios',
            procedures: 'Procedimientos',
            tariffs: 'Tarifas',
            stopovers: 'Escalas',
            tenders: 'Licitaciones',
            documentation: 'Documentación',
            media: 'Medios',
            contact: 'Contacto',
            search: 'Buscar',
            searchPlaceholder: 'Buscar en el sitio...',
        },
        hero: {
            title: 'Puerto Autónomo de Nouadhibou',
            subtitle:
                'Puerta estratégica de Mauritania en el Atlántico. Centro comercial principal para el África Occidental.',
            cta: 'Descubra nuestros servicios',
            ctaSecondary: 'Contáctenos',
        },
        stats: {
            title: 'El PAN en cifras',
        },
        services: {
            title: 'Nuestros Servicios',
            subtitle: 'Soluciones portuarias integrales para satisfacer todas sus necesidades logísticas.',
            viewAll: 'Ver todos los servicios',
            description: 'Descripción detallada',
            features: 'Puntos destacados',
            procedure: 'Procedimiento a seguir',
            requiredDocuments: 'Documentos requeridos',
            beneficiaries: 'Beneficiarios',
            prerequisites: 'Prerrequisitos',
            deadline: 'Plazo de tratamiento',
            costs: 'Costes y tarifas',
            contact: 'Contacto',
            backToList: 'Volver a los servicios',
            submitRequest: 'Enviar una solicitud',
            requestTypes: {
                information: 'Solicitud de información',
                reclamation: 'Reclamación',
                document_request: 'Solicitud de documento',
                rendez_vous: 'Solicitud de cita',
            },
            formLabels: {
                type: 'Tipo de solicitud',
                name: 'Nombre completo',
                namePlaceholder: 'Su nombre',
                email: 'Correo electrónico',
                emailPlaceholder: 'su@email.com',
                phone: 'Teléfono',
                company: 'Empresa',
                companyPlaceholder: 'Nombre de su empresa',
                subject: 'Asunto',
                message: 'Mensaje',
                messagePlaceholder: 'Describa su solicitud en detalle...',
                attachments: 'Arrastre sus archivos adjuntos aquí (PDF, Word, imágenes)',
                submit: 'Enviar solicitud',
            },
            formErrors: {
                required: 'Por favor, rellene todos los campos obligatorios.',
            },
            formSuccess: {
                title: '¡Solicitud enviada con éxito!',
                message: 'Hemos recibido su solicitud. Recibirá una confirmación por correo electrónico.',
                reference: 'Su referencia:',
            },
        },
        news: {
            title: 'Noticias',
            subtitle: 'Últimas noticias del Puerto Autónomo de Nouadhibou.',
            readMore: 'Leer más',
            viewAll: 'Todas las noticias',
        },
        content: {
            categories: {
                actualite: 'Noticias',
                communique: 'Comunicados',
                evenement: 'Eventos',
                alerte: 'Alertas y Avisos',
                all: 'Todo',
            },
            filters: {
                category: 'Categoría',
                tag: 'Tema',
                all: 'Todos',
            },
            pagination: {
                showing: 'Mostrando',
                of: 'de',
                results: 'resultados',
            },
            detail: {
                publishedOn: 'Publicado el',
                by: 'por',
                tags: 'Palabras clave',
                share: 'Compartir',
                backToList: 'Volver a la lista',
                relatedContent: 'Contenidos similares',
                eventDate: 'Fecha del evento',
                eventLocation: 'Lugar',
                expiresOn: 'Válido hasta',
            },
            alertBar: {
                close: 'Cerrar',
            },
            empty: {
                title: 'Sin contenido',
                description: 'Ningún contenido coincide con su búsqueda.',
            },
        },
        pages: {
            port: {
                title: 'El Puerto',
                subtitle: 'Descubra la historia y la evolución del Puerto Autónomo de Nouadhibou, así como su impacto socioeconómico en la región.',
                dg_word: {
                    title: 'Mensaje del Director General',
                    content: 'Estimado visitante, bienvenido al Puerto Autónomo de Nouadhibou. Nuestra misión es garantizar una conectividad marítima óptima fomentando al mismo tiempo el crecimiento económico regional.',
                },
                role: {
                    title: 'Papel Estratégico',
                    description: 'El Puerto Autónomo de Nouadhibou (PAN) se encuentra en una bahía protegida naturalmente. Es el eje de todas las actividades pesqueras y el motor del desarrollo de Nouadhibou.',
                    points: [
                        'Puerta de entrada y salida de la capital económica del país.',
                        'Centro de servicios para el transporte, la industria y el comercio internacional.',
                        'Pasarela estratégica para la industria pesquera nacional.',
                    ],
                },
                geography: {
                    title: 'Situación Geográfica',
                    description: 'Situado a 20°54 N and 17°03 O, el puerto se beneficia de un refugio natural excepcional contra el oleaje del Atlántico, en el cruce de las grandes rutas marítimas.',
                },
                history: {
                    title: 'Historia e Hitos',
                    milestones: [
                        { year: '1955', event: 'Desarrollo de infraestructuras pesqueras. Ampliación de las instalaciones para apoyar la industria pesquera.' },
                        { year: '1968', event: 'Desarrollo de infraestructuras pesqueras. Ampliación de las instalaciones para apoyar la industria pesquera.' },
                        { year: '2014', event: 'Ampliación del puerto con nuevas plataformas RO-RO. Modernización importante de las infraestructuras para acoger más buques.' },
                        { year: '2025', event: 'Modernización y digitalización en curso. Proyecto de transformación digital y optimización de las operaciones portuarias.' },
                    ],
                },
                evolution: {
                    title: 'Evolución del Sitio',
                    description: 'De un modesto muelle de pesca, el sitio se ha convertido en un complejo industrial y comercial integrado con plantas de procesamiento, cámaras frigoríficas, zonas de almacenamiento y sistemas de gestión modernos.',
                },
                equipment: {
                    title: 'Equipamiento y Seguridad',
                    list: [
                        'Sistema de guía en el canal de acceso y faros terrestres',
                        'Iluminación completa de los muelles y del perímetro portuario',
                        'Videovigilancia (CCTV) en las entradas y en el interior del puerto',
                        'Sistema de monitoreo de buques por AIS',
                        'Puntos de abastecimiento de agua y combustible en los muelles de pesca',
                    ],
                },
                impact: {
                    title: 'Integración Socioeconómica',
                    items: [
                        { title: 'Primer empleador de Nouadhibou', description: 'El Puerto Autónomo de Nouadhibou es el mayor empleador de la región, ofreciendo miles de empleos directos e indirectos.' },
                        { title: '80% de las exportaciones vinculadas a la pesca', description: 'El puerto desempeña un papel crucial en la economía nacional al facilitar la mayoría de las exportaciones de productos pesqueros.' },
                        { title: '+50 socios privados', description: 'Una extensa red de socios comerciales e industriales contribuye al dinamismo económico del puerto.' },
                    ],
                },
                governance: {
                    title: 'Gobernanza',
                    description: 'Descubra la estructura organizativa y los órganos rectores del Puerto Autónomo de Nouadhibou.',
                    board: {
                        title: 'Consejo de Administración',
                        headerRole: 'Papel',
                        headerAttribution: 'Atribuciones',
                        members: [
                            { role: 'Presidente', attribution: 'Dirección estratégica y supervisión de las actividades del puerto' },
                            { role: 'Miembros', attribution: 'Representantes de ministerios y agentes económicos' },
                        ],
                    },
                },
                services: {
                    title: 'Servicios Portuarios',
                    list: [
                        'Atraque para todo tipo de buques',
                        'Ayuda a la navegación y guía',
                        'Manipulación y almacenamiento de mercancías',
                        'Logística integrada y transporte multimodal',
                        'Espacios de almacenamiento modernos y seguros',
                        'Servicios de practicaje profesional',
                        'Remolque y asistencia en el mar',
                        'Terminal de contenedores de última generación',
                    ],
                },
            },
            infrastructure: {
                title: 'Infraestructuras',
                subtitle: 'Descubra nuestras instalaciones portuarias modernas y equipos de última generación que garantizan operaciones portuarias eficientes y seguras.',
                gallery: {
                    title: 'Galería de fotos expresiva',
                    items: [
                        { title: 'Terminal de contenedores', description: 'Terminal moderno equipado para la gestión eficiente de contenedores con equipos de vanguardia.' },
                        { title: 'Zona de pesaje de 100 toneladas', description: 'Capacidad de pesaje de alta precisión para todo tipo de carga.' },
                        { title: 'Almacenamiento en frío', description: 'Instalaciones modernas para la conservación de productos perecederos.' },
                        { title: 'Remolque en acción', description: 'Asistencia dinámica y segura para las maniobras de los buques.' },
                    ],
                },
                quais: {
                    title: 'Muelles y Terminales',
                    items: [
                        { name: 'Muelle de Comercio', info: 'Muelle principal dedicado a actividades comerciales y transporte de mercancías diversas.', length: '350m', draft: '9.0m' },
                        { name: 'Muelle de Pesca Industrial', info: 'Infraestructura especializada para buques de pesca de altura con instalaciones de descarga.', length: '280m', draft: '7.0m' },
                        { name: 'Terminal Petrolera', info: 'Terminal especializada para la descarga de productos petrolíferos con sistemas de seguridad avanzados.', length: '200m', draft: '12.0m' },
                    ],
                },
                zones: {
                    title: 'Zonas Dedicadas',
                    items: [
                        { name: 'Zona bajo aduana', area: '12 Hectáreas', purpose: 'Almacenamiento temporal y logística.' },
                        { name: 'Zona Industrial', area: '15 Hectares', purpose: 'Unidades de procesamiento de pescado.' },
                        { name: 'Zona Franca', area: 'Extensión en curso', purpose: 'Incentivos fiscales y exportación.' },
                    ],
                },
            },
            services: {
                title: 'Nuestros Servicios',
                subtitle: 'El Puerto Autónomo de Nouadhibou ofrece una gama completa de servicios portuarios y logísticos para satisfacer todas sus necesidades.',
                list: [
                    {
                        title: 'Manipulación',
                        desc: 'Servicios de carga y descarga optimizados para todo tipo de mercancías con equipos especializados que garantizan una manipulación segura y eficiente.',
                        icon: 'crane',
                        points: ['Carga/descarga optimizada', 'Equipos seguros especializados', 'Personal cualificado', 'Operaciones 24/7'],
                    },
                    {
                        title: 'Transbordos',
                        desc: 'Operaciones rápidas sin almacenamiento intermedio que permiten una reducción significativa de los costes logísticos y la optimización de la cadena de suministro.',
                        icon: 'refresh-cw',
                        points: ['Operaciones rápidas', 'Reducción de costes logísticos', 'Coordinación optimizada', 'Seguimiento en tiempo real'],
                    },
                    {
                        title: 'Almacenamiento',
                        desc: 'Espacios de almacenamiento diversificados que incluyen zonas francas, instalaciones de almacenamiento en frío y almacenes seguros accesibles las 24 horas, los 7 días de la semana.',
                        icon: 'box',
                        points: ['Zonas francas', 'Almacenamiento en frío', 'Almacenes seguros', 'Acceso 24/7'],
                    },
                    {
                        title: 'Tránsito y Logística',
                        desc: 'Servicios de coordinación integral entre el transporte marítimo y terrestre con una gestión aduanera simplificada para agilizar sus operaciones logísticas.',
                        icon: 'truck',
                        points: ['Coordinación mar/tierra', 'Aduana simplificada', 'Soluciones integradas', 'Seguimiento administrativo'],
                    },
                    {
                        title: 'Servicios a Buques',
                        desc: 'Asistencia completa para buques que incluye practicaje, remolque, abastecimiento de combustible y suministro de agua dulce para garantizar escalas óptimas.',
                        icon: 'anchor',
                        points: ['Practicaje profesional', 'Remolque especializado', 'Abastecimiento de combustible', 'Suministro de agua dulce'],
                    },
                    {
                        title: 'Gestión de Terminales',
                        desc: 'Explotación eficiente de terminales especializadas para contenedores, graneles y mercancías diversas con equipos modernos y personal cualificado.',
                        icon: 'layout',
                        points: ['Terminal contenedores', 'Terminal graneles', 'Terminal pesca', 'Equipos modernos'],
                    },
                ],
            },
            procedures: {
                title: 'Procedimientos',
                subtitle: 'Guía de trámites administrativos y operativos.',
                steps: [
                    { title: 'Declaración de Llegada', desc: 'Presentación de documentos a través de la ventanilla única 24h antes.' },
                    { title: 'Control Sanitario', desc: 'Inspección obligatoria para buques de pesca.' },
                    { title: 'Despacho de Aduanas', desc: 'Tratamiento electrónico de las declaraciones de mercancías.' },
                ],
            },
            tariffs: {
                title: 'Tarifas',
                subtitle: 'Consulte las escalas de tasas portuarias.',
                categories: [
                    { title: 'Tasas de Buques', details: ['Practicaje', 'Remolque', 'Amarre'] },
                    { title: 'Tasas de Mercancías', details: ['Paso portuario', 'Estacionamiento', 'Pesaje'] },
                    { title: 'Servicios Anexos', details: ['Agua potable', 'Electricidad', 'Evacuación de residuos'] },
                ],
            },
            stopovers: {
                title: 'Escalas',
                subtitle: 'Información en tiempo real sobre los movimientos de buques en el puerto.',
                recent: {
                    title: 'Últimas Escalas',
                    items: [
                        { name: 'MSC JOANNA', type: 'Portacontenedores', date: '2024-03-05', time: '08:30', status: 'En muelle' },
                        { name: 'SEA LADY', type: 'Petrolero', date: '2024-03-05', time: '14:15', status: 'En espera' },
                        { name: 'ATLANTIC STAR', type: 'Buque de pesca', date: '2024-03-04', time: '22:00', status: 'Salido' },
                    ],
                },
                planning: {
                    title: 'Planificación Semanal',
                    desc: 'Acceda a la planificación completa de llegadas previstas para los próximos 7 días.',
                },
            },
            tenders: {
                title: 'Licitaciones',
                subtitle: 'Consulte las licitaciones y contratos públicos en curso.',
            },
            documentation: {
                title: 'Documentación',
                subtitle: 'Documentos oficiales, informes y formularios descargables.',
            },
            media: {
                title: 'Medios',
                subtitle: 'Manténgase informado sobre la actualidad portuaria y eventos principales.',
                news: {
                    title: 'Noticias Recientes',
                    items: [
                        { title: 'Inauguración de la nueva terminal', date: '2024-02-28', category: 'Infraestructura', excerpt: 'El PAN da un nuevo paso con la apertura de una terminal moderna...' },
                        { title: 'Firma de una alianza logística', date: '2024-02-15', category: 'Alianza', excerpt: 'Se firmó un acuerdo estratégico para fortalecer las capacidades de almacenamiento...' },
                    ],
                },
                gallery: {
                    title: 'Galería de Fotos',
                    desc: 'Descubra en imágenes la vida cotidiana en el puerto y nuestras instalaciones.',
                },
            },
            contact: {
                title: 'Contacto',
                subtitle: 'Contáctenos para cualquier información o solicitud de servicio.',
            },
            search: {
                title: 'Búsqueda',
                subtitle: 'Encuentre rápidamente lo que busca en nuestro sitio.',
                noResults: 'No se encontraron resultados.',
                resultsFor: 'Resultados para',
            },
        },
        footer: {
            description:
                'El Puerto Autónomo de Nouadhibou es un actor principal en el desarrollo económico de Mauritania, ofreciendo servicios portuarios de clase mundial.',
            quickLinks: 'Enlaces rápidos',
            services: 'Servicios',
            legal: 'Información legal',
            contact: 'Contacto',
            address: 'BP 236, Nouadhibou, Mauritania',
            phone: '+222 45 74 51 06',
            fax: '+222 45 74 51 07',
            email: 'contact@pan.mr',
            rights: '© 2025 Puerto Autónomo de Nouadhibou. Todos los derechos reservados.',
            legalNotice: 'Aviso legal',
            privacyPolicy: 'Política de privacidad',
            termsOfUse: 'Condiciones de uso',
            sitemap: 'Mapa del sitio',
            accessibility: 'Accesibilidad',
        },
        common: {
            learnMore: 'Saber más',
            backToHome: 'Volver al inicio',
            loading: 'Cargando...',
            comingSoon: 'Próximamente',
            comingSoonDesc: 'Esta sección está en desarrollo. Vuelva pronto para descubrir su contenido.',
            viewDetails: 'Ver detalles',
            download: 'Descargar',
            share: 'Compartir',
            print: 'Imprimir',
            previous: 'Anterior',
            next: 'Siguiente',
            page: 'Página',
            of: 'de',
        },
        ged: {
            title: 'Documentación',
            subtitle: 'Biblioteca de documentos oficiales, informes, formularios y reglamentos del Puerto Autónomo de Nouadhibou.',
            searchPlaceholder: 'Buscar un documento...',
            filters: {
                theme: 'Tema',
                direction: 'Dirección',
                accessLevel: 'Acceso',
                fileType: 'Tipo de archivo',
                allThemes: 'Todos los temas',
                allDirections: 'Todas las direcciones',
                allAccess: 'Todos los niveles',
                allTypes: 'Todos los tipos',
            },
            themes: {
                reglementation: 'Reglamentación',
                tarification: 'Tarificación',
                securite: 'Seguridad',
                environnement: 'Medio Ambiente',
                infrastructure: 'Infraestructura',
                commerce: 'Comercio',
                rh: 'Recursos Humanos',
                finance: 'Finanzas',
                autre: 'Otro',
            },
            directions: {
                direction_generale: 'Dirección General',
                direction_exploitation: 'Dirección de Explotación',
                direction_commerciale: 'Dirección Comercial',
                direction_technique: 'Dirección Técnica',
                direction_financiere: 'Dirección Financiera',
                direction_rh: 'Dirección de RR.HH.',
                capitainerie: 'Capitanía',
                securite: 'Servicio de Seguridad',
                autre: 'Otro',
            },
            accessLevels: {
                public: 'Público',
                restricted: 'Restringido',
                internal: 'Interno',
            },
            fileTypes: {
                pdf: 'PDF',
                doc: 'Word',
                docx: 'Word',
                xlsx: 'Excel',
                xls: 'Excel',
                ppt: 'PowerPoint',
                pptx: 'PowerPoint',
                jpg: 'Imagen',
                png: 'Imagen',
                other: 'Otro',
            },
            labels: {
                reference: 'Referencia',
                version: 'Versión',
                versions: 'versiones',
                currentVersion: 'Versión actual',
                versionHistory: 'Historial de versiones',
                uploadedBy: 'Subido por',
                uploadedOn: 'Subido el',
                keywords: 'Palabras clave',
                categories: 'Categorías',
                language: 'Idioma',
                accessLevel: 'Nivel de acceso',
                direction: 'Dirección',
                theme: 'Tema',
                downloadFile: 'Descargar archivo',
                noDocuments: 'Sin documentos',
                noDocumentsDesc: 'Ningún documento coincide con su búsqueda.',
                restrictedAccess: 'Acceso restringido',
                restrictedDesc: 'Este documento requiere autorización para ser descargado.',
                internalAccess: 'Documento interno',
                internalDesc: 'Este documento está reservado para el personal del PAN.',
                loginRequired: 'Inicio de sesión requerido',
            },
            languages: {
                fr: 'Francés',
                ar: 'Árabe',
                en: 'Inglés',
                es: 'Español',
                fr_ar: 'Bilingüe (FR/AR)',
            },
        },
    },
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale] || dictionaries.fr;
}
