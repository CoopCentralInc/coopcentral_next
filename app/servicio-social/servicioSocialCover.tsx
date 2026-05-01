import React from "react";
import Image from "next/image";
import styles from "./servicioSocialCover.module.scss";
import { getFeaturedMediaById } from "@/lib/wordpress";

interface Props {
  page: any;
}

export default async function ServicioSocialCover({ page }: Props) {
  const { meta_box, featured_media, title } = page;
  const image = await getFeaturedMediaById(featured_media);

  const { social_services_cover_copy } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cardImage}>
          <div className={styles.image}>
            <Image
              src={image?.source_url ?? ""}
              alt={title}
              width={1920}
              height={1080}
            />
          </div>
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{title.rendered}</h1>
          <p className={styles.copy}>{social_services_cover_copy}</p>
        </div>
      </div>
    </section>
  );
}
