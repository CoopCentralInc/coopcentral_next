import Image from "next/image";
import CTA from "@/components/CTA";
import { getFeaturedMediaById } from "@/lib/wordpress";
import styles from "./cover.module.scss";

interface Props {
  page: any;
}

export default async function Cover({ page }: Props) {
  const { meta_box } = page;
  const featured_media = await getFeaturedMediaById(page.featured_media);

  const { product_copy, product_cover_title } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.logo}>
            <Image
              src={featured_media?.source_url ?? ""}
              alt={product_cover_title}
              width={1920}
              height={1080}
              priority
            />
          </div>
          <svg
            className={styles.longLine}
            xmlns="http://www.w3.org/2000/svg"
            width="797.411"
            height="813.56"
            viewBox="0 0 797.411 813.56"
          >
            <path
              id="Trazado_674"
              data-name="Trazado 674"
              d="M1675.738,775.959s-243.2,363.859-571.382,532.326"
              transform="translate(665.816 -1309.94) rotate(62)"
              fill="none"
              stroke="#ffe70e"
              strokeLinecap="round"
              strokeWidth="32"
            />
          </svg>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{product_cover_title}</h2>
          <p className={styles.copy}>{product_copy}</p>
          <CTA data={meta_box} prefix="product_" />
        </div>
      </div>
    </section>
  );
}
