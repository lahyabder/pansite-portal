import type { Locale } from '@pan/shared';
import { PageHero } from '@/components/PageHero';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;

    const metadata = {
        fr: {
            title: 'Politique de Confidentialité',
            subtitle: 'Comment nous protégeons vos données.',
            breadcrumbs: [{ label: 'Accueil', href: '/fr' }, { label: 'Confidentialité' }]
        },
        ar: {
            title: 'سياسة الخصوصية',
            subtitle: 'كيف نحمي بياناتك.',
            breadcrumbs: [{ label: 'الرئيسية', href: '/ar' }, { label: 'الخصوصية' }]
        },
        en: {
            title: 'Privacy Policy',
            subtitle: 'How we protect your data.',
            breadcrumbs: [{ label: 'Home', href: '/en' }, { label: 'Privacy' }]
        },
        es: {
            title: 'Política de Privacidad',
            subtitle: 'Cómo protegemos sus datos.',
            breadcrumbs: [{ label: 'Inicio', href: '/es' }, { label: 'Privacidad' }]
        }
    };

    const current = metadata[locale];

    const content = {
        fr: (
            <>
                <h2>1. Collecte des données</h2>
                <p>Le Port Autonome de Nouadhibou collecte des données à caractère personnel via des formulaires de contact, des requêtes de services et l&apos;utilisation de cookies à des fins d&apos;analyse de trafic (Matomo/Google Analytics).</p>

                <h2>2. Utilisation des données</h2>
                <p>Les données sont utilisées exclusivement pour :</p>
                <ul>
                    <li>Traiter vos demandes et réclamations.</li>
                    <li>Améliorer l&apos;expérience utilisateur sur notre site web.</li>
                    <li>Analyser l&apos;audience du site de manière anonymisée.</li>
                </ul>

                <h2>3. Consentement (Cookies)</h2>
                <p>Vous avez le contrôle sur l&apos;utilisation des cookies via notre bannière de préférences. Les cookies fonctionnels sont nécessaires au bon fonctionnement du site, tandis que les cookies analytiques requièrent votre consentement.</p>

                <h2>4. Droits des utilisateurs</h2>
                <p>Vous avez le droit de demander l&apos;accès, la rectification ou la suppression de vos données en nous contactant à <strong>contact@pan.mr</strong>.</p>
            </>
        ),
        ar: (
            <div dir="rtl">
                <h2>1. جمع البيانات</h2>
                <p>يقوم ميناء نواذيبو المستقل بجمع البيانات الشخصية من خلال نماذج الاتصال وطلبات الخدمات واستخدام ملفات تعريف الارتباط لأغراض تحليل حركة المرور (Matomo/Google Analytics).</p>

                <h2>2. استخدام البيانات</h2>
                <p>يتم استخدام البيانات حصريًا من أجل:</p>
                <ul>
                    <li>معالجة طلباتك وشكاويك.</li>
                    <li>تحسين تجربة المستخدم على موقعنا.</li>
                    <li>تحليل جمهور زوار الموقع بصفة مجهولة.</li>
                </ul>

                <h2>3. الموافقة (ملفات تعريف الارتباط)</h2>
                <p>لديك السيطرة على استخدام ملفات تعريف الارتباط (الكوكيز) عبر لافتة التفضيلات الخاصة بنا. ملفات الارتباط الوظيفية ضرورية لعمل الموقع، بينما تتطلب ملفات التحليلات موافقتك.</p>

                <h2>4. حقوق المستخدمين</h2>
                <p>لديك الحق في طلب الوصول إلى بياناتك أو تصحيحها أو حذفها عبر الاتصال بنا على <strong>contact@pan.mr</strong>.</p>
            </div>
        ),
        en: (
            <>
                <h2>1. Data Collection</h2>
                <p>The Nouadhibou Autonomous Port collects personal data via contact forms, service requests, and the use of cookies for traffic analysis purposes (Matomo/Google Analytics).</p>

                <h2>2. Use of Data</h2>
                <p>The data is used exclusively for:</p>
                <ul>
                    <li>Processing your requests and complaints.</li>
                    <li>Improving the user experience on our website.</li>
                    <li>Analyzing the site audience anonymously.</li>
                </ul>

                <h2>3. Consent (Cookies)</h2>
                <p>You have control over the use of cookies via our preference banner. Functional cookies are necessary for the proper functioning of the site, while analytical cookies require your consent.</p>

                <h2>4. User Rights</h2>
                <p>You have the right to request access, rectification, or deletion of your data by contacting us at <strong>contact@pan.mr</strong>.</p>
            </>
        ),
        es: (
            <>
                <h2>1. Recopilación de datos</h2>
                <p>El Puerto Autónomo de Nouadhibou recopila datos personales a través de formularios de contacto, solicitudes de servicios y el uso de cookies con fines de análisis de tráfico (Matomo/Google Analytics).</p>

                <h2>2. Uso de los datos</h2>
                <p>Los datos se utilizan exclusivamente para:</p>
                <ul>
                    <li>Procesar sus solicitudes y reclamaciones.</li>
                    <li>Mejorar la experiencia del usuario en nuestro sitio web.</li>
                    <li>Analizar la audiencia del sitio de forma anónima.</li>
                </ul>

                <h2>3. Consentimiento (Cookies)</h2>
                <p>Usted tiene el control sobre el uso de cookies a través de nuestro banner de preferencias. Las cookies funcionales son necesarias para el buen funcionamiento del sitio, mientras que las cookies analíticas requieren su consentimiento.</p>

                <h2>4. Derechos de los usuarios</h2>
                <p>Usted tiene derecho a solicitar el acceso, la rectificación o la eliminación de sus datos contactándonos en <strong>contact@pan.mr</strong>.</p>
            </>
        )
    }[locale];

    return (
        <>
            <PageHero
                title={current.title}
                subtitle={current.subtitle}
                breadcrumbs={current.breadcrumbs}
            />
            <section className="py-16 bg-white min-h-[50vh]">
                <div className="max-w-4xl mx-auto px-6 prose prose-pan">
                    {content}
                </div>
            </section>
        </>
    );
}
