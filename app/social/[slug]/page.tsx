import {
  getSocialBySlug,
  getAllSocial,
  getFeaturedMediaById,
} from "@/lib/wordpress";

import { siteConfig } from "@/site.config";

import type { Metadata } from "next";
import Post from "@/components/post";

export async function generateStaticParams() {
  try {
    const { posts } = await getAllSocial();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSocialBySlug(slug);

  if (!post) {
    return {
      title: "Contenido no encontrado - Coopcentral",
      description: "El contenido social que buscas no se encuentra disponible.",
    };
  }

  // Obtener imagen destacada o usar imagen por defecto
  const featured_media_url = post.featured_media
    ? (await getFeaturedMediaById(post.featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  // Generar imagen OG dinámica o usar imagen destacada
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", post.title.rendered);

  // Strip HTML tags for description y limitar longitud
  const description = post.excerpt.rendered
    ? post.excerpt.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .substring(0, 160)
    : post.title.rendered;

  ogUrl.searchParams.append("description", description);

  // Extraer fecha de publicación
  const publishedDate = new Date(post.date).toISOString();
  const modifiedDate = new Date(post.modified).toISOString();

  return {
    title: `${post.title.rendered} - Coopcentral`,
    description: description,
    keywords: [
      "coopcentral",
      "social",
      "noticias",
      "cooperativa",
      "comunidad",
      "actualidad",
      ...post.title.rendered.toLowerCase().split(" ").slice(0, 5),
    ],
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/social/${post.slug}`,
      siteName: "Coopcentral",
      images: [
        {
          url: featured_media_url || ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ["Coopcentral"],
      section: "Social",
      locale: "es_DO",
    },
    alternates: {
      canonical: `${siteConfig.site_domain}/social/${post.slug}`,
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
      "article:published_time": publishedDate,
      "article:modified_time": modifiedDate,
      "article:author": "Coopcentral",
      "article:section": "Social",
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title.rendered,
        description: description,
        image: featured_media_url || ogUrl.toString(),
        author: {
          "@type": "Organization",
          name: "Coopcentral",
          url: siteConfig.site_domain,
        },
        publisher: {
          "@type": "Organization",
          name: "Coopcentral",
          url: siteConfig.site_domain,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.site_domain}/logo.png`,
          },
        },
        datePublished: publishedDate,
        dateModified: modifiedDate,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteConfig.site_domain}/social/${post.slug}`,
        },
      }),
    },
    category: "Social",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getSocialBySlug(slug);

  if (!post) {
    return <div>Contenido no encontrado</div>;
  }

  return (
    <main>
      <Post post={post} />
    </main>
  );
}
