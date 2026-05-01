import React from "react";
import styles from "./page.module.scss";
import ContactCover from "./contactCover";
import { getPageBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("contacto");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png"; // Proporciona una imagen por defecto

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Contacto - Coopcentral",
    description:
      page.excerpt?.rendered ||
      "Ponte en contacto con Coopcentral. Encuentra nuestras oficinas, horarios de atención, teléfonos y formulario de contacto.",
    openGraph: {
      title: page.title?.rendered
        ? `${page.title.rendered} - Coopcentral`
        : "Contacto - Coopcentral",
      description:
        page.excerpt?.rendered ||
        "Ponte en contacto con Coopcentral. Encuentra nuestras oficinas, horarios de atención, teléfonos y formulario de contacto.",
      url: "https://www.coopcentral.do/contacto",
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
      "contacto",
      "coopcentral",
      "oficinas",
      "teléfono",
      "atención al cliente",
      "horarios",
      "dirección",
      "servicio al cliente",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/contacto",
    },
  };
}

export default async function Page() {
  const page = await getPageBySlug("contacto");

  return (
    <main>
      <ContactCover page={page} />
    </main>
  );
}
