import CTA from "@/components/CTA";
import styles from "./productCover.module.scss";
import Image from "next/image";
import { getFeaturedMediaById } from "@/lib/wordpress";

interface Props {
  page: any;
}

export default async function ProductsCover({ page }: Props) {
  const { featured_media, meta_box } = page;
  const media = await getFeaturedMediaById(featured_media);

  const { products_cover_title, products_cover_copy } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mediaWrapper}>
          <div className={styles.media}>
            <div className={styles.mediaLogo}>
              <Image
                src={media?.source_url ?? ""}
                alt="Logo productos"
                width={800}
                height={800}
                priority
              />
            </div>
            <svg
              className={styles.shortLine}
              xmlns="http://www.w3.org/2000/svg"
              width="144.384"
              height="130.807"
              viewBox="0 0 144.384 130.807"
            >
              <path
                id="Trazado_1"
                data-name="Trazado 1"
                d="M1190.185,775.959s-36.532,20.877-85.829,30.543"
                transform="matrix(0.819, -0.574, 0.574, 0.819, -1321.803, 77.438)"
                fill="none"
                stroke="#ffe70e"
                strokeLinecap="round"
                strokeWidth="32"
              />
            </svg>

            <svg
              className={styles.longLine}
              xmlns="http://www.w3.org/2000/svg"
              width="743.252"
              height="715.636"
              viewBox="0 0 743.252 715.636"
            >
              <path
                id="Trazado_3"
                data-name="Trazado 3"
                d="M1675.738,775.959s-243.2,363.859-571.382,532.326"
                transform="matrix(0.966, 0.259, -0.259, 0.966, -701.735, -1008.335)"
                fill="none"
                stroke="#ffe70e"
                strokeLinecap="round"
                strokeWidth="32"
              />
            </svg>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h2 className={styles.title}> {products_cover_title} </h2>
            <p className={styles.copy}>{products_cover_copy}</p>
            <CTA data={meta_box} prefix="products_cover_" />
          </div>
        </div>
      </div>
    </section>
  );
}
