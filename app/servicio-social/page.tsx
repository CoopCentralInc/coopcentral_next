import React from "react";
import ServicioSocialCover from "./servicioSocialCover";
import {
  getAllSocial,
  getFeaturedMediaById,
  getPageBySlug,
} from "@/lib/wordpress";
import ServicioSocialContent from "./servicioSocialContent";
import { Metadata } from "next";
import Pagination from "@/components/pagination";
import styles from "./page.module.scss";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("servicio-social");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Servicio Social - Coopcentral",
    description:
      page.excerpt?.rendered ||
      "Conoce los programas de servicio social de Coopcentral. Iniciativas comunitarias, responsabilidad social y proyectos de impacto para el bienestar de nuestros asociados y la comunidad.",
    openGraph: {
      title: page.title?.rendered || "Servicio Social - Coopcentral",
      description:
        page.excerpt?.rendered ||
        "Conoce los programas de servicio social de Coopcentral. Iniciativas comunitarias, responsabilidad social y proyectos de impacto para el bienestar de nuestros asociados y la comunidad.",
      url: "https://www.coopcentral.do/servicio-social",
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
      "servicio social",
      "coopcentral",
      "responsabilidad social",
      "programas comunitarios",
      "iniciativas sociales",
      "bienestar",
      "comunidad",
      "proyectos sociales",
      "cooperativa",
    ],
    alternates: {
      canonical: "https://www.coopcentral.do/servicio-social",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const [page, { posts: postsData, totalPages, currentPage: actualPage }] =
    await Promise.all([
      getPageBySlug("servicio-social"),
      getAllSocial({
        page: currentPage,
        per_page: 10, // Número de posts por página
      }),
    ]);

  const posts = await Promise.all(
    postsData.map(async (post) => {
      if (post.featured_media === 0) {
        return post;
      }
      // Si no hay featured_media, lo dejamos como n
      const featured_media = await getFeaturedMediaById(post.featured_media);
      return {
        ...post,
        featured_media: featured_media,
      };
    })
  );

  return (
    <main className={styles.main}>
      <ServicioSocialCover page={page} />
      <ServicioSocialContent page={page} posts={posts} />
      <Pagination
        currentPage={actualPage}
        totalPages={totalPages}
        basePath="/servicio-social"
        className={styles.pagination}
      />
      <div className={styles.greenDeco} />
    </main>
  );
}
