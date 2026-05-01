import {
  PhoneIcon,
  LocationIcon,
  ClockIcon,
  MailIcon,
} from "@/components/ui/icons";
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import {
  getFeaturedMediaById,
  getSucursalBySlug,
  getAllSucursals,
} from "@/lib/wordpress";
import { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const sucursales = await getAllSucursals();
    return sucursales.map((sucursal) => ({ slug: sucursal.slug }));
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
  const sucursal = await getSucursalBySlug(slug);

  if (!sucursal) {
    return {
      title: "Sucursal no encontrada - Coopcentral",
      description: "La sucursal que buscas no se encuentra disponible.",
    };
  }

  const { title, featured_media, meta_box } = sucursal as any;
  const featured_media_url = featured_media
    ? (await getFeaturedMediaById(featured_media))?.source_url ?? "/default-og-image.png"
    : "/default-og-image.png";

  const {
    sucursal_direction = "",
    sucursal_tel = [],
    sucursal_mail = [],
    sucursal_schedule = "",
  } = meta_box || {};

  const sucursalTitle = title?.rendered || "Sucursal";
  const description = `Visita nuestra sucursal ${sucursalTitle} de Coopcentral. ${
    sucursal_direction ? `Dirección: ${sucursal_direction}.` : ""
  } ${
    sucursal_schedule ? `Horarios: ${sucursal_schedule}.` : ""
  } Contáctanos para todos tus servicios financieros.`;

  return {
    title: `${sucursalTitle} - Coopcentral`,
    description: description,
    keywords: [
      "sucursal",
      "coopcentral",
      sucursalTitle.toLowerCase(),
      "oficina",
      "ubicación",
      "dirección",
      "horarios",
      "servicios financieros",
      "cooperativa",
    ],
    openGraph: {
      title: `${sucursalTitle} - Coopcentral`,
      description: description,
      type: "website",
      url: `https://www.coopcentral.do/sucursal/${slug}`,
      siteName: "Coopcentral",
      images: [
        {
          url: featured_media_url,
          width: 1200,
          height: 630,
          alt: `Sucursal ${sucursalTitle} - Coopcentral`,
        },
      ],
      locale: "es_DO",
    },
    alternates: {
      canonical: `https://www.coopcentral.do/sucursal/${slug}`,
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
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `Coopcentral - ${sucursalTitle}`,
        description: description,
        image: featured_media_url,
        address: {
          "@type": "PostalAddress",
          streetAddress: sucursal_direction,
          addressCountry: "DO",
        },
        telephone: sucursal_tel.length ? sucursal_tel[0] : "",
        email: sucursal_mail.length ? sucursal_mail[0] : "",
        openingHours: sucursal_schedule,
        url: `https://www.coopcentral.do/sucursal/${slug}`,
        parentOrganization: {
          "@type": "Organization",
          name: "Coopcentral",
          url: "https://www.coopcentral.do",
        },
      }),
    },
    category: "Sucursales",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getSucursalBySlug(slug);

  if (!post) {
    return <div>Sucursal no encontrada</div>;
  }

  const { title, featured_media, meta_box } = post as any;
  const image = await getFeaturedMediaById(featured_media);

  const {
    sucursal_direction = "",
    sucursal_tel = [],
    sucursal_mail = [],
    sucursal_schedule = "",
    sucursal_url_map = "",
    sucursal_code_map = "",
  } = meta_box || {};

  return (
    <main>
      <section className={styles.section}>
        <div className={styles.media}>
          <Image
            src={image?.source_url ?? ""}
            alt={`Sucursal ${title.rendered} - Coopcentral`}
            width={1920}
            height={1080}
            priority
          />
          <div className={styles.bgSection}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.mapWrapper}>
              <div className={styles.map}>
                <iframe
                  className={styles.iframe}
                  src={sucursal_code_map}
                  width="800"
                  height="200"
                  loading="lazy"
                  title={`Mapa de ubicación - Sucursal ${title.rendered}`}
                ></iframe>
              </div>
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>{title.rendered}</h1>

              {sucursal_direction ? (
                <div className={styles.info}>
                  <span className={styles.icon}>
                    <LocationIcon />
                  </span>
                  <span className={styles.text}>{sucursal_direction}</span>
                </div>
              ) : null}
              {sucursal_tel.length ? (
                <div className={styles.info}>
                  <span className={styles.icon}>
                    <PhoneIcon />
                  </span>
                  <span>
                    {sucursal_tel.map((tel: string, index: number) => {
                      return (
                        <Link
                          className={styles.telLink}
                          key={index}
                          href={`tel:${tel}`}
                        >
                          <span className={styles.text}>{tel}</span>
                        </Link>
                      );
                    })}
                  </span>
                </div>
              ) : null}
              {sucursal_schedule ? (
                <div className={styles.info}>
                  <span className={styles.icon}>
                    <ClockIcon />
                  </span>
                  <span className={styles.text}>{sucursal_schedule}</span>
                </div>
              ) : null}

              {sucursal_mail.length ? (
                <div className={styles.info}>
                  <span className={styles.icon}>
                    <MailIcon />
                  </span>
                  {sucursal_mail.map((email: string, index: number) => {
                    return (
                      <Link
                        className={styles.telLink}
                        key={index}
                        href={`mailto:${email}`}
                      >
                        <span className={styles.text}>{email}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              {sucursal_url_map ? (
                <Link className={styles.link} href={sucursal_url_map}>
                  Ubicación en maps
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
