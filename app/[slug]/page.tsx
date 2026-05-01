import {
  getPostBySlug,
  getAllPostsSimple,
  getPageBySlug,
  getAllPages,
} from "@/lib/wordpress";

import { siteConfig } from "@/site.config";

import type { Metadata } from "next";
import Post from "@/components/post";

export async function generateStaticParams() {
  try {
    const posts = await getAllPostsSimple();
    const pages = await getAllPages();
    return [...posts, ...pages].map((post) => ({ slug: post.slug }));
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
  const post = await getPostBySlug(slug);
  const page = await getPageBySlug(slug);

  const data = post || page;

  if (!data) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", data.title.rendered);
  // Strip HTML tags for description
  const description = data.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  ogUrl.searchParams.append("description", description);

  return {
    title: data.title.rendered,
    description: description,
    openGraph: {
      title: data.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${data.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: data.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const page = await getPageBySlug(slug);

  const data = post || page;

  return (
    <main>
      <Post post={data} />
    </main>
  );
}
