import React from "react";
import AboutCover from "./aboutCover";
import { getPageBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import AboutObjetive from "./aboutObjetive";
import AboutHistory from "./aboutHistory";
import AboutTeam from "./aboutTeam";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("nosotros");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png"; // Proporciona una imagen por defecto

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Nosotros - Coopcentral",
    description:
      page.excerpt?.rendered ||
      "Conoce la historia, misión, visión y equipo de Coopcentral. Descubre quiénes somos y cómo trabajamos para brindar los mejores servicios cooperativos.",
    openGraph: {
      title: page.title?.rendered
        ? `${page.title.rendered} - Coopcentral`
        : "Nosotros - Coopcentral",
      description:
        page.excerpt?.rendered ||
        "Conoce la historia, misión, visión y equipo de Coopcentral. Descubre quiénes somos y cómo trabajamos para brindar los mejores servicios cooperativos.",
      url: "https://www.coopcentral.do/nosotros",
      siteName: "Coopcentral",
      images: [
        {
          url: featured_media_url,
          width: 1200,
          height: 630,
        },
      ],
      locale: "es_DO",
      type: "website",
    },
    keywords: [
      "nosotros",
      "coopcentral",
      "historia",
      "misión",
      "visión",
      "equipo",
      "cooperativa",
      "quiénes somos",
      "sobre nosotros",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/nosotros",
    },
  };
}

export default async function Page() {
  const page = await getPageBySlug("nosotros");
  return (
    <main>
      <AboutCover page={page} />
      <AboutObjetive page={page} />
      <AboutHistory page={page} />
      <AboutTeam page={page} />
    </main>
  );
}
