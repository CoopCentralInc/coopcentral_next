import React from "react";
import styles from "./page.module.scss";
import { getProductBySlug, getFeaturedMediaById } from "@/lib/wordpress";
import Cover from "./cover";
import Info from "./info";
import Requirements from "./requirements";
import Guide from "./guide";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Obtener datos del producto
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado - Coopcentral",
      description: "El producto que buscas no se encuentra disponible.",
    };
  }

  const featured_media_url = product.featured_media
    ? (await getFeaturedMediaById(product.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  const productTitle = product.title?.rendered || "Producto";
  const productDescription =
    product.excerpt?.rendered ||
    `Conoce más sobre ${productTitle} en Coopcentral. Descubre beneficios, requisitos y guía de uso.`;

  return {
    title: `${productTitle} - Coopcentral`,
    description: productDescription,
    openGraph: {
      title: `${productTitle} - Coopcentral`,
      description: productDescription,
      url: `https://www.coopcentral.do/product/${slug}`,
      siteName: "Coopcentral",
      images: [
        {
          url: featured_media_url,
          width: 1200,
          height: 630,
        },
      ],
      locale: "es_DO",
      type: "article",
    },
    keywords: [
      "producto",
      "coopcentral",
      productTitle.toLowerCase(),
      "servicios financieros",
      "cooperativa",
      "beneficios",
      "requisitos",
    ],
    alternates: {
      canonical: `https://www.coopcentral.do/product/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Get information about the current URL.
  const page = await getProductBySlug(slug);

  // Load the post, but only if the data is ready.
  return (
    <main className={styles.container}>
      <Cover page={page} />
      <Info page={page} />
      <Requirements page={page} />
      <Guide page={page} />
    </main>
  );
}
