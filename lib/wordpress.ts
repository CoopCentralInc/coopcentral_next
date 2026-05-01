// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  process.env.WORDPRESS_URL ||
  "https://coopcentral.do";

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;
  const base = API_URL.replace(/\/$/, "");
  return `${base}${path}${params ? `?${params}` : ""}`;
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

async function wordpressFetch<T>(url: string): Promise<T> {
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const res = response.json();

  return res;
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<{ posts: Post[]; totalPages: number; currentPage: number }> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: filterParams?.per_page || 10,
    page: filterParams?.page || 1,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/posts", query);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Next.js WordPress Client",
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const posts = await response.json();
  const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0");
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");

  return {
    posts,
    totalPages,
    currentPage: query.page,
  };
}

// Mantener la función original para compatibilidad
export async function getAllPostsSimple(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/posts", query);
  return wordpressFetch<Post[]>(url);
}

export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  return wordpressFetch<Post>(url);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories");
  return wordpressFetch<Category[]>(url);
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  return wordpressFetch<Category>(url);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await wordpressFetch<Category[]>(url);
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { categories: categoryId });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
  return wordpressFetch<Post[]>(url);
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", { post: postId });
  return wordpressFetch<Tag[]>(url);
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags");
  return wordpressFetch<Tag[]>(url);
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  return wordpressFetch<Tag>(url);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await wordpressFetch<Tag[]>(url);
  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/wp-json/wp/v2/pages");
  return wordpressFetch<Page[]>(url);
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  return wordpressFetch<Page>(url);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await wordpressFetch<Page[]>(url);
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users");
  return wordpressFetch<Author[]>(url);
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  return wordpressFetch<Author>(url);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await wordpressFetch<Author[]>(url);
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });
  return wordpressFetch<Post[]>(url);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia | null> {
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  return wordpressFetch<FeaturedMedia>(url).catch(() => null);
}

export async function searchCategories(query: string): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Category[]>(url);
}

export async function searchTags(query: string): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Tag[]>(url);
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Author[]>(url);
}

export { WordPressAPIError };

// FUNCIONES NUEVAS

export async function getAllSlides(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/slide", query);
  return wordpressFetch<Post[]>(url);
}

export async function getAllSucursals(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/sucursal", query);
  return wordpressFetch<Post[]>(url);
}

export async function getProductBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/product", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getSucursalBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/sucursal", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getSettings() {
  const url = getUrl("/wp-json/site/v1/settings/");
  return wordpressFetch<Post[]>(url);
}

export async function getMenu(name: string) {
  const url = getUrl(`/wp-json/menus/v1/menus/${name}`);
  return wordpressFetch<Post[]>(url);
}

export async function getSocialBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/social", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getAllSocial(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<{ posts: Post[]; totalPages: number; currentPage: number }> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: filterParams?.per_page || 10,
    page: filterParams?.page || 1,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/social", query);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Next.js WordPress Client",
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const posts = await response.json();
  const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0");
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");

  return {
    posts,
    totalPages,
    currentPage: query.page,
  };
  //return wordpressFetch<Post[]>(url);
}

export async function getAllSucursal(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/sucursal", query);
  return wordpressFetch<Post[]>(url);
}

export interface SearchResult {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  link: string;
  date: string;
  type: string;
  slug: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  totalPages: number;
}

export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<SearchResponse> {
  if (!query.trim()) {
    return {
      results: [],
      total: 0,
      totalPages: 0,
    };
  }

  const searchParams = new URLSearchParams({
    search: query,
    page: page.toString(),
    per_page: perPage.toString(),
    _embed: "true",
  });

  try {
    const endpoints = [
      { endpoint: "posts", type: "post" },
      { endpoint: "pages", type: "page" },
      { endpoint: "product", type: "product" },
      { endpoint: "social", type: "social" },
      { endpoint: "sucursal", type: "sucursal" },
    ];

    const requests = endpoints.map(async ({ endpoint, type }) => {
      try {
        const url = `${API_URL}/wp-json/wp/v2/${endpoint}?${searchParams}`;
        // console.log(`Fetching: ${url}`); // Debug log

        const response = await fetch(url, {
          next: { revalidate: 300 },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn(`Failed to fetch ${endpoint}:`, response.status);
          return [];
        }

        const data = await response.json();
        return Array.isArray(data)
          ? data.map((item: any) => ({ ...item, type }))
          : [];
      } catch (error) {
        console.warn(`Error fetching ${endpoint}:`, error);
        return [];
      }
    });

    const results = await Promise.all(requests);
    const allResults = results.flat();

    // Ordenar por relevancia
    const sortedResults = allResults.sort((a, b) => {
      const aTitle = a.title?.rendered?.toLowerCase() || "";
      const bTitle = b.title?.rendered?.toLowerCase() || "";
      const searchLower = query.toLowerCase();

      const aTitleMatch = aTitle.includes(searchLower);
      const bTitleMatch = bTitle.includes(searchLower);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    // Paginación
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    return {
      results: paginatedResults,
      total: sortedResults.length,
      totalPages: Math.ceil(sortedResults.length / perPage),
    };
  } catch (error) {
    console.error("Error in searchPosts:", error);
    return {
      results: [],
      total: 0,
      totalPages: 0,
    };
  }
}
