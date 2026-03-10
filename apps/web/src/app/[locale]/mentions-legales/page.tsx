import type { Locale } from '@pan/shared';
import { PageHero } from '@/components/PageHero';

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;

    const metadata = {
        fr: {
            title: 'Mentions Légales',
            subtitle: 'Informations juridiques et conditions d\'utilisation.',
            breadcrumbs: [{ label: 'Accueil', href: '/fr' }, { label: 'Mentions Légales' }]
        },
        ar: {
            title: 'المعلومات القانونية',
            subtitle: 'المعلومات القانونية وشروط الاستخدام.',
            breadcrumbs: [{ label: 'الرئيسية', href: '/ar' }, { label: 'المعلومات القانونية' }]
        },
        en: {
            title: 'Legal Notice',
            subtitle: 'Legal information and terms of use.',
            breadcrumbs: [{ label: 'Home', href: '/en' }, { label: 'Legal Notice' }]
        },
        es: {
            title: 'Aviso Legal',
            subtitle: 'Información legal y condiciones de uso.',
            breadcrumbs: [{ label: 'Inicio', href: '/es' }, { label: 'Aviso Legal' }]
        }
    };

    const current = metadata[locale];

    const content = {
        fr: (
            <>
                <h2>Éditeur du site</h2>
                <p>
                    <strong>Port Autonome de Nouadhibou (PAN)</strong><br />
                    Établissement Public à Caractère Industriel et Commercial (EPIC)<br />
                    BP 236, Nouadhibou, Mauritanie<br />
                    Téléphone : +222 45 74 51 06<br />
                    Email : contact@pan.mr
                </p>

                <h2>Hébergement et Réalisation</h2>
                <p>
                    Le présent site web a été développé pour le compte de l&apos;Autorité de la Zone Franche de Nouadhibou et est hébergé sur les infrastructures locales ou désignées par l&apos;institution.
                </p>

                <h2>Propriété Intellectuelle</h2>
                <p>
                    Tous les éléments graphiques, textuels, logos, photos et vidéos figurant sur le site <strong>pan.mr</strong> sont la propriété exclusive du Port Autonome de Nouadhibou, à l&apos;exception des marques, logos ou contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.
                </p>
                <p>
                    Toute reproduction, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
                </p>

                <h2>Limitation de Responsabilité</h2>
                <p>
                    Les informations contenues sur ce site sont aussi précises que possibles et le site est périodiquement remis à jour. Toutefois, d&apos;éventuelles inexactitudes ou omissions peuvent survenir. Le Port Autonome de Nouadhibou ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l&apos;utilisateur lors de l&apos;accès au site.
                </p>
            </>
        ),
        ar: (
            <div dir="rtl">
                <h2>الجهة الناشرة للموقع</h2>
                <p>
                    <strong>ميناء نواذيبو المستقل (PAN)</strong><br />
                    مؤسسة عمومية ذات طابع صناعي وتجاري (EPIC)<br />
                    ص.ب 236، نواذيبو، موريتانيا<br />
                    الهاتف: +222 45 74 51 06<br />
                    البريد الإلكتروني: contact@pan.mr
                </p>

                <h2>الاستضافة والتطوير</h2>
                <p>
                    تم تطوير هذا الموقع لصالح سلطة منطقة نواذيبو الحرة ويتم استضافته على البنية التحتية المحلية أو المخصصة من قبل المؤسسة.
                </p>

                <h2>الملكية الفكرية</h2>
                <p>
                    جميع العناصر الرسومية والنصية والشعارات والصور ومقاطع الفيديو الظاهرة على موقع <strong>pan.mr</strong> هي ملكية حصرية لميناء نواذيبو المستقل، باستثناء العلامات أو الشعارات أو المحتويات التي تعود ملكيتها لشركات شريكة أو مؤلفين آخرين.
                </p>
                <p>
                    يُحظر أي استنساخ أو تعديل أو نشر أو تكييف لكل أو جزء من عناصر الموقع، مهما كان الوسيلة أو العملية المستخدمة، دون إذن كتابي مسبق.
                </p>

                <h2>حدود المسؤولية</h2>
                <p>
                    المعلومات الواردة في هذا الموقع دقيقة قدر الإمكان ويتم تحديث الموقع بشكل دوري. ومع ذلك، قد تحدث أخطاء أو إغفالات. لا يمكن تحميل ميناء نواذيبو المستقل المسؤولية عن الأضرار المباشرة وغير المباشرة التي قد تلحق بمعدات المستخدم أثناء الوصول إلى الموقع.
                </p>
            </div>
        ),
        en: (
            <>
                <h2>Site Publisher</h2>
                <p>
                    <strong>Nouadhibou Autonomous Port (PAN)</strong><br />
                    Public Industrial and Commercial Establishment (EPIC)<br />
                    BP 236, Nouadhibou, Mauritania<br />
                    Phone: +222 45 74 51 06<br />
                    Email: contact@pan.mr
                </p>

                <h2>Hosting and Development</h2>
                <p>
                    This website was developed for the Nouadhibou Free Zone Authority and is hosted on local or designated infrastructure.
                </p>

                <h2>Intellectual Property</h2>
                <p>
                    All graphic, textual elements, logos, photos, and videos appearing on the <strong>pan.mr</strong> site are the exclusive property of the Nouadhibou Autonomous Port, except for brands, logos, or content belonging to other partner companies or authors.
                </p>
                <p>
                    Any reproduction, modification, publication, adaptation of all or part of the site elements, regardless of the medium or process used, is prohibited without prior written authorization.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                    The information contained on this site is as accurate as possible and the site is periodically updated. However, inaccuracies or omissions may occur. The Nouadhibou Autonomous Port cannot be held responsible for direct or indirect damage caused to the user&apos;s equipment when accessing the site.
                </p>
            </>
        ),
        es: (
            <>
                <h2>Editor del sitio</h2>
                <p>
                    <strong>Puerto Autónomo de Nouadhibou (PAN)</strong><br />
                    Establecimiento Público de Carácter Industrial y Comercial (EPIC)<br />
                    BP 236, Nouadhibou, Mauritania<br />
                    Teléfono: +222 45 74 51 06<br />
                    Correo electrónico: contact@pan.mr
                </p>

                <h2>Alojamiento y Realización</h2>
                <p>
                    Este sitio web ha sido desarrollado por cuenta de la Autoridad de la Zona Franca de Nouadhibou y está alojado en infraestructuras locales o designadas por la institución.
                </p>

                <h2>Propiedad Intelectual</h2>
                <p>
                    Todos los elementos gráficos, textuales, logotipos, fotos y videos que aparecen en el sitio <strong>pan.mr</strong> son propiedad exclusiva del Puerto Autónomo de Nouadhibou, a excepción de las marcas, logotipos o contenidos pertenecientes a otras empresas asociadas o autores.
                </p>
                <p>
                    Cualquier reproducción, modificación, publicación, adaptación de todo o parte de los elementos del sitio, independientemente del medio o proceso utilizado, está prohibida sin autorización previa por escrito.
                </p>

                <h2>Limitación de Responsabilidad</h2>
                <p>
                    La información contenida en este sitio es lo más precisa posible y el sitio se actualiza periódicamente. Sin embargo, pueden ocurrir inexactitudes u omisiones. El Puerto Autónomo de Nouadhibou no se hace responsable de los daños directos e indirectos causados al equipo del usuario al acceder al sitio.
                </p>
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
