import Image from "next/image";
import styles from "./serviciosCover.module.scss";
import { getFeaturedMediaById } from "@/lib/wordpress";

interface Props {
  page: any;
}

export default async function ServiceCover({ page }: Props) {
  const { meta_box, title } = page;
  const media = await getFeaturedMediaById(page.featured_media);

  const { service_cover_copy, service_cover_title } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.mediaLogo}>
            <Image
              src={media?.source_url ?? ""}
              alt={service_cover_title}
              width={1920}
              height={1080}
              priority
            />
          </div>
          <svg
            className={styles.longLine}
            xmlns="http://www.w3.org/2000/svg"
            width="380.902"
            height="471.239"
            viewBox="0 0 380.902 471.239"
          >
            <path
              id="Trazado_1"
              data-name="Trazado 1"
              d="M1371.554,632.674s-73.2,110.626-169.774,142.913c-96.821,28.163-197.7-32.519-222.07-44"
              transform="translate(1388.82 -430.512) rotate(120)"
              fill="none"
              stroke="#ffe70e"
              strokeLinecap="round"
              strokeWidth="32"
            />
          </svg>

          <svg
            className={styles.shortLine}
            xmlns="http://www.w3.org/2000/svg"
            width="110.106"
            height="143.149"
            viewBox="0 0 110.106 143.149"
          >
            <path
              id="Trazado_656"
              data-name="Trazado 656"
              d="M1190.185,775.959s-36.532,20.877-85.829,30.543"
              transform="translate(404.222 -1278.036) rotate(70)"
              fill="none"
              stroke="#ffe70e"
              strokeLinecap="round"
              strokeWidth="32"
            />
          </svg>

          <div className={styles.smallCircle} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{service_cover_title}</h2>
          <p className={styles.copy}>{service_cover_copy}</p>
        </div>
      </div>
    </section>
  );
}
