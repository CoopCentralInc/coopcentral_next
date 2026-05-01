import React from "react";
import ProductsCover from "./productCover";
import styles from "./page.module.scss";
import { getPageBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import ProductsInfo from "./productInfo";
import ProductsBeneficts from "./productBeneficts";
import ProductsCalcultor from "./productCalculator";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("productos");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Productos y Servicios - Coopcentral",
    description:
      page.excerpt?.rendered ||
      "Descubre todos los productos y servicios financieros que Coopcentral tiene para ti. Créditos, ahorros, seguros y más beneficios para nuestros asociados.",
    openGraph: {
      title: page.title?.rendered
        ? `${page.title.rendered} - Coopcentral`
        : "Productos y Servicios - Coopcentral",
      description:
        page.excerpt?.rendered ||
        "Descubre todos los productos y servicios financieros que Coopcentral tiene para ti. Créditos, ahorros, seguros y más beneficios para nuestros asociados.",
      url: "https://www.coopcentral.do/productos",
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
      "productos",
      "servicios",
      "coopcentral",
      "créditos",
      "ahorros",
      "seguros",
      "cooperativa",
      "servicios financieros",
      "beneficios",
      "calculadora",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/productos",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductsPage() {
  const page = await getPageBySlug("productos");
  return (
    <main className={styles.container}>
      <ProductsCover page={page} />
      <ProductsInfo page={page} />
      <ProductsBeneficts page={page} />
      <ProductsCalcultor page={page} />
    </main>
  );
}
