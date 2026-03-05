import type { Locale } from '@pan/shared';
import { PageHero } from '@/components/PageHero';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: localeParam } = await params;
    const locale = (localeParam === 'ar' ? 'ar' : 'fr') as Locale;

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
        }
    };

    const current = metadata[locale];

    return (
        <>
            <PageHero
                title={current.title}
                subtitle={current.subtitle}
                breadcrumbs={current.breadcrumbs}
            />
            <section className="py-16 bg-white min-h-[50vh]">
                <div className="max-w-4xl mx-auto px-6 prose prose-pan">
                    {locale === 'fr' ? (
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
                    ) : (
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
                    )}
                </div>
            </section>
        </>
    );
}
