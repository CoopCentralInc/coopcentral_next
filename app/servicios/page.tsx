import React from "react";
import styles from "./page.module.scss";
import ServiceCover from "./serviciosCover";
import { getPageBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import ServiceInfo from "./serviciosInfo";
import ServiceGuide from "./serviciosGuide";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("servicios");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  const title = page.title?.rendered
    ? `${page.title.rendered} - Coopcentral`
    : "Servicios - Coopcentral";
  const description =
    page.excerpt?.rendered ||
    "Descubre todos los servicios que Coopcentral ofrece a sus asociados. Servicios bancarios, financieros, digitales y de atención personalizada para tu bienestar económico.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.coopcentral.do/servicios",
      siteName: "Coopcentral",
      images: [
        {
          url: featured_media_url,
          width: 1200,
          height: 630,
          alt: `${title} - Imagen destacada`,
        },
      ],
      locale: "es_DO",
      type: "website",
    },
    keywords: [
      "servicios",
      "coopcentral",
      "servicios bancarios",
      "servicios financieros",
      "cooperativa",
      "atención al cliente",
      "servicios digitales",
      "banca en línea",
      "transferencias",
      "pagos",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/servicios",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description: description,
        provider: {
          "@type": "Organization",
          name: "Coopcentral",
          url: "https://www.coopcentral.do",
        },
        serviceType: "Servicios Financieros",
        areaServed: {
          "@type": "Country",
          name: "República Dominicana",
        },
      }),
    },
    category: "Servicios Financieros",
  };
}

export default async function ServicePage() {
  const page = await getPageBySlug("servicios");

  return (
    <main className={styles.container}>
      <ServiceCover page={page} />
      <ServiceInfo page={page} />
      <ServiceGuide page={page} />
    </main>
  );
}
