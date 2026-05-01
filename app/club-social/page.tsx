import React from "react";
import ClubCover from "./clubCover";
import { getPageBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import ClubCarousel from "./clubCarousel";
import ClubInfo from "./clubInfo";
import ClubRequirements from "./clubRequirements";
import ClubPartner from "./clubPartner";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("club-social");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png"; // Proporciona una imagen por defecto

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Club Social - Coopcentral",
    description:
      page.excerpt?.rendered ||
      "Descubre todos los beneficios y servicios exclusivos del Club Social de Coopcentral para nuestros asociados.",
    openGraph: {
      title: page.title?.rendered
        ? `${page.title.rendered} - Coopcentral`
        : "Club Social - Coopcentral",
      description:
        page.excerpt?.rendered ||
        "Descubre todos los beneficios y servicios exclusivos del Club Social de Coopcentral para nuestros asociados.",
      url: "https://www.coopcentral.do/club-social",
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
      "club social",
      "coopcentral",
      "beneficios",
      "asociados",
      "recreación",
      "eventos",
      "actividades sociales",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/club-social",
    },
  };
}

export default async function Page() {
  const page = await getPageBySlug("club-social");

  return (
    <main>
      <ClubCover page={page} />
      <ClubCarousel page={page} />
      <ClubInfo page={page} />
      <ClubRequirements page={page} />
      <ClubPartner page={page} />
    </main>
  );
}
