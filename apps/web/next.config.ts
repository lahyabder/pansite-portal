import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
  {
    "source": "/fr/actualites/2",
    "destination": "/fr/actualites/le-president-de-la-republique-visite-le-port-autonome-de-nouadhibou-5l6v",
    "permanent": true
  },
  {
    "source": "/ar/actualites/2",
    "destination": "/ar/actualites/le-president-de-la-republique-visite-le-port-autonome-de-nouadhibou-5l6v",
    "permanent": true
  },
  {
    "source": "/en/actualites/2",
    "destination": "/en/actualites/le-president-de-la-republique-visite-le-port-autonome-de-nouadhibou-5l6v",
    "permanent": true
  },
  {
    "source": "/es/actualites/2",
    "destination": "/es/actualites/le-president-de-la-republique-visite-le-port-autonome-de-nouadhibou-5l6v",
    "permanent": true
  },
  {
    "source": "/fr/actualites/1",
    "destination": "/fr/actualites/visite-du-directeur-de-lecole-militaire-et-de-ses-eleves-au-port-autonome-de-nouadhibou-11qq",
    "permanent": true
  },
  {
    "source": "/ar/actualites/1",
    "destination": "/ar/actualites/visite-du-directeur-de-lecole-militaire-et-de-ses-eleves-au-port-autonome-de-nouadhibou-11qq",
    "permanent": true
  },
  {
    "source": "/en/actualites/1",
    "destination": "/en/actualites/visite-du-directeur-de-lecole-militaire-et-de-ses-eleves-au-port-autonome-de-nouadhibou-11qq",
    "permanent": true
  },
  {
    "source": "/es/actualites/1",
    "destination": "/es/actualites/visite-du-directeur-de-lecole-militaire-et-de-ses-eleves-au-port-autonome-de-nouadhibou-11qq",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-7qrlmgs6n",
    "destination": "/fr/actualites/actualite-experimentale-2-q09q",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-7qrlmgs6n",
    "destination": "/ar/actualites/actualite-experimentale-2-q09q",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-7qrlmgs6n",
    "destination": "/en/actualites/actualite-experimentale-2-q09q",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-7qrlmgs6n",
    "destination": "/es/actualites/actualite-experimentale-2-q09q",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-57wdthbwr",
    "destination": "/fr/actualites/4-y70t",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-57wdthbwr",
    "destination": "/ar/actualites/4-y70t",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-57wdthbwr",
    "destination": "/en/actualites/4-y70t",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-57wdthbwr",
    "destination": "/es/actualites/4-y70t",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-p45eqayt4",
    "destination": "/fr/actualites/-38ee",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-p45eqayt4",
    "destination": "/ar/actualites/-38ee",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-p45eqayt4",
    "destination": "/en/actualites/-38ee",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-p45eqayt4",
    "destination": "/es/actualites/-38ee",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-yzo0s0nas",
    "destination": "/fr/actualites/actualite-experimentale-4-88rk",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-yzo0s0nas",
    "destination": "/ar/actualites/actualite-experimentale-4-88rk",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-yzo0s0nas",
    "destination": "/en/actualites/actualite-experimentale-4-88rk",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-yzo0s0nas",
    "destination": "/es/actualites/actualite-experimentale-4-88rk",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-nwpr94vuq",
    "destination": "/fr/actualites/-bbh4",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-nwpr94vuq",
    "destination": "/ar/actualites/-bbh4",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-nwpr94vuq",
    "destination": "/en/actualites/-bbh4",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-nwpr94vuq",
    "destination": "/es/actualites/-bbh4",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-aikteqm30",
    "destination": "/fr/actualites/actualite-experimentale-numero-6-11z4",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-aikteqm30",
    "destination": "/ar/actualites/actualite-experimentale-numero-6-11z4",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-aikteqm30",
    "destination": "/en/actualites/actualite-experimentale-numero-6-11z4",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-aikteqm30",
    "destination": "/es/actualites/actualite-experimentale-numero-6-11z4",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-7mij9i955",
    "destination": "/fr/actualites/5-zrgj",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-7mij9i955",
    "destination": "/ar/actualites/5-zrgj",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-7mij9i955",
    "destination": "/en/actualites/5-zrgj",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-7mij9i955",
    "destination": "/es/actualites/5-zrgj",
    "permanent": true
  },
  {
    "source": "/fr/actualites/3",
    "destination": "/fr/actualites/participation-du-port-a-lexposition-des-produits-de-la-mer-de-nouadhibou-comy",
    "permanent": true
  },
  {
    "source": "/ar/actualites/3",
    "destination": "/ar/actualites/participation-du-port-a-lexposition-des-produits-de-la-mer-de-nouadhibou-comy",
    "permanent": true
  },
  {
    "source": "/en/actualites/3",
    "destination": "/en/actualites/participation-du-port-a-lexposition-des-produits-de-la-mer-de-nouadhibou-comy",
    "permanent": true
  },
  {
    "source": "/es/actualites/3",
    "destination": "/es/actualites/participation-du-port-a-lexposition-des-produits-de-la-mer-de-nouadhibou-comy",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-yeqxgsiy1",
    "destination": "/fr/actualites/lkjlgfhkmldfhmld-yvge",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-yeqxgsiy1",
    "destination": "/ar/actualites/lkjlgfhkmldfhmld-yvge",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-yeqxgsiy1",
    "destination": "/en/actualites/lkjlgfhkmldfhmld-yvge",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-yeqxgsiy1",
    "destination": "/es/actualites/lkjlgfhkmldfhmld-yvge",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-hwha5n09k",
    "destination": "/fr/actualites/lancement-du-site-du-port-gpxd",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-hwha5n09k",
    "destination": "/ar/actualites/lancement-du-site-du-port-gpxd",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-hwha5n09k",
    "destination": "/en/actualites/lancement-du-site-du-port-gpxd",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-hwha5n09k",
    "destination": "/es/actualites/lancement-du-site-du-port-gpxd",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-d6bgmny08",
    "destination": "/fr/actualites/le-port-autonome-de-nouadhibou-accueille-la-ceremonie-de-remise-des-certificats-de-formation-professionnelle-pour-ses-employes-l6vo",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-d6bgmny08",
    "destination": "/ar/actualites/le-port-autonome-de-nouadhibou-accueille-la-ceremonie-de-remise-des-certificats-de-formation-professionnelle-pour-ses-employes-l6vo",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-d6bgmny08",
    "destination": "/en/actualites/le-port-autonome-de-nouadhibou-accueille-la-ceremonie-de-remise-des-certificats-de-formation-professionnelle-pour-ses-employes-l6vo",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-d6bgmny08",
    "destination": "/es/actualites/le-port-autonome-de-nouadhibou-accueille-la-ceremonie-de-remise-des-certificats-de-formation-professionnelle-pour-ses-employes-l6vo",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-wi8ww2oyq",
    "destination": "/fr/actualites/le-directeur-general-du-port-autonome-de-nouadhibou-inspecte-lavancement-des-travaux-de-rehabilitation-du-quai-de-commerce-zca1",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-wi8ww2oyq",
    "destination": "/ar/actualites/le-directeur-general-du-port-autonome-de-nouadhibou-inspecte-lavancement-des-travaux-de-rehabilitation-du-quai-de-commerce-zca1",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-wi8ww2oyq",
    "destination": "/en/actualites/le-directeur-general-du-port-autonome-de-nouadhibou-inspecte-lavancement-des-travaux-de-rehabilitation-du-quai-de-commerce-zca1",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-wi8ww2oyq",
    "destination": "/es/actualites/le-directeur-general-du-port-autonome-de-nouadhibou-inspecte-lavancement-des-travaux-de-rehabilitation-du-quai-de-commerce-zca1",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-s75e5tgxa",
    "destination": "/fr/actualites/atelier-de-formation-pour-les-cadres-du-port-autonome-de-nouadhibou-53ye",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-s75e5tgxa",
    "destination": "/ar/actualites/atelier-de-formation-pour-les-cadres-du-port-autonome-de-nouadhibou-53ye",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-s75e5tgxa",
    "destination": "/en/actualites/atelier-de-formation-pour-les-cadres-du-port-autonome-de-nouadhibou-53ye",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-s75e5tgxa",
    "destination": "/es/actualites/atelier-de-formation-pour-les-cadres-du-port-autonome-de-nouadhibou-53ye",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-z48tzepcc",
    "destination": "/fr/actualites/le-conseil-dadministration-du-port-autonome-de-nouadhibou-inspecte-les-installations-portuaires-gyem",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-z48tzepcc",
    "destination": "/ar/actualites/le-conseil-dadministration-du-port-autonome-de-nouadhibou-inspecte-les-installations-portuaires-gyem",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-z48tzepcc",
    "destination": "/en/actualites/le-conseil-dadministration-du-port-autonome-de-nouadhibou-inspecte-les-installations-portuaires-gyem",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-z48tzepcc",
    "destination": "/es/actualites/le-conseil-dadministration-du-port-autonome-de-nouadhibou-inspecte-les-installations-portuaires-gyem",
    "permanent": true
  },
  {
    "source": "/fr/actualites/art-q4w4uvvw4",
    "destination": "/fr/actualites/le-port-autonome-de-nouadhibou-accueille-des-eleves-du-lycee-militaire-24k5",
    "permanent": true
  },
  {
    "source": "/ar/actualites/art-q4w4uvvw4",
    "destination": "/ar/actualites/le-port-autonome-de-nouadhibou-accueille-des-eleves-du-lycee-militaire-24k5",
    "permanent": true
  },
  {
    "source": "/en/actualites/art-q4w4uvvw4",
    "destination": "/en/actualites/le-port-autonome-de-nouadhibou-accueille-des-eleves-du-lycee-militaire-24k5",
    "permanent": true
  },
  {
    "source": "/es/actualites/art-q4w4uvvw4",
    "destination": "/es/actualites/le-port-autonome-de-nouadhibou-accueille-des-eleves-du-lycee-militaire-24k5",
    "permanent": true
  }
];
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL || 'https://pansite-portal-admin-fkeb.vercel.app'}/admin`,
      },
      {
        source: "/admin/:path*",
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL || 'https://pansite-portal-admin-fkeb.vercel.app'}/admin/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        // Allow Admin panel (localhost:3001) to call Content API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_ADMIN_URL || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuild: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
