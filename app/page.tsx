// Craft Imports
import HomeCover from "@/components/frontpage/homeCover";
import HomeInfo from "@/components/frontpage/homeInfo";
import {
  getAllSlides,
  getFeaturedMediaById,
  getPageById,
  getPageBySlug,
} from "@/lib/wordpress";
import styles from "./page.module.scss";
import HomeProducts from "@/components/frontpage/homeProducts";
import HomeNewsletter from "@/components/frontpage/homeNewsletter";
import HomeContact from "@/components/frontpage/homeContact";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos de la página
  const page = await getPageBySlug("coopcentral");
  const featured_media_url = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media)).source_url
    : "/default-og-image.png"; // Proporciona una imagen por defecto

  return {
    title: page.title?.rendered
      ? `${page.title.rendered} - Coopcentral`
      : "Coopcentral",
    description: page.excerpt?.rendered || "Bienvenido a Coopcentral",
    openGraph: {
      title: page.title?.rendered
        ? `${page.title.rendered} - Coopcentral`
        : "Coopcentral",
      description: page.excerpt?.rendered || "Bienvenido a Coopcentral",
      url: `https://www.coopcentral.do`,
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
  };
}

// This page is using the craft.tsx component and design system
export default async function Home() {
  const page = await getPageBySlug("coopcentral");
  const slides = await Promise.all(
    (
      await getAllSlides()
    ).map(async (slide) => {
      const featured_media = await getFeaturedMediaById(slide.featured_media);
      return {
        ...slide,
        featured_media: featured_media.source_url,
      };
    })
  );

  const featured_media = page.featured_media
    ? (await getFeaturedMediaById(page.featured_media)).source_url
    : "/default-og-image.png";
  const { title, content, meta_box } = page;

  return (
    <main className={styles.main}>
      <HomeCover
        {...{ slides, page, featured_media, title, content, meta_box }}
      />
      <HomeInfo data={meta_box} />
      <HomeProducts page={page} />
      <HomeNewsletter page={page} />
      <HomeContact page={page} />
    </main>
  );
}
