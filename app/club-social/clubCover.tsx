import React from "react";
import styles from "./clubCover.module.scss";
import Image from "next/image";
import { getFeaturedMediaById } from "@/lib/wordpress";

interface Props {
  page: any;
}

export default async function ClubCover({ page }: Props) {
  const featured_media = await getFeaturedMediaById(page.featured_media);
  const { title, meta_box } = page;

  const { social_club_cover_copy } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mediaWrapper}>
          <div className={styles.media}>
            <Image
              src={featured_media?.source_url ?? ""}
              alt={title}
              priority
              width={1920}
              height={1080}
            />
          </div>

          <svg
            className={styles.longLine}
            xmlns="http://www.w3.org/2000/svg"
            width="821.545"
            height="832.084"
            viewBox="0 0 821.545 832.084"
          >
            <path
              id="Trazado_3"
              data-name="Trazado 3"
              d="M1675.738,775.959s-243.2,363.859-571.382,532.326"
              transform="matrix(-0.559, -0.829, 0.829, -0.559, 324.572, 2151.278)"
              fill="none"
              stroke="#ffe70e"
              strokeLinecap="round"
              strokeWidth="32"
            />
          </svg>
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{title.rendered}</h1>
          <p className={styles.copy}>{social_club_cover_copy}</p>
        </div>
      </div>
    </section>
  );
}
