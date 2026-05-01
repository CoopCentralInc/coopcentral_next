import React from "react";
import styles from "./contactCover.module.scss";
import Image from "next/image";
import Form from "@/components/formulario";
import {
  ClockIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import Link from "next/link";
import { getFeaturedMediaById } from "@/lib/wordpress";

interface Props {
  page: any;
}

export default async function contactCover({ page }: Props) {
  const { title: pageTitle, meta_box, sucursals = [] } = page;
  const featured_media = await getFeaturedMediaById(page.featured_media);

  const { form_id } = meta_box;

  return (
    <section className={styles.section}>
      <div className={styles.mediaLogo}>
        <Image
          src={featured_media?.source_url ?? ""}
          alt="Contacto Coopcentral"
          width={1920}
          height={1080}
          priority
        />
      </div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {sucursals.map((sucursal: any, index: number) => {
            const { title, meta_box } = sucursal;

            const {
              sucursal_direction,
              sucursal_tel,
              sucursal_mail,
              sucursal_schedule,
              sucursal_url_map,
            } = meta_box;

            return index == 0 ? (
              <div className={styles.content} key={index}>
                <h1 className={styles.title}>{pageTitle.rendered}</h1>

                <h2 className={styles.subtitle}>{title.rendered}</h2>

                {sucursal_direction ? (
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <LocationIcon />
                    </div>
                    <span className={styles.text}>{sucursal_direction}</span>
                  </div>
                ) : null}
                {sucursal_tel.length ? (
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <PhoneIcon />
                    </div>
                    {sucursal_tel.map((tel: any, index: number) => {
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
                  </div>
                ) : null}
                {sucursal_schedule ? (
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <ClockIcon />
                    </div>
                    <span className={styles.text}>{sucursal_schedule}</span>
                  </div>
                ) : null}

                {sucursal_mail.length ? (
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <MailIcon />
                    </div>
                    {sucursal_mail.map((email: any, index: number) => {
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
            ) : null;
          })}
          <div className={styles.formWrapper}>
            <Form formId={form_id} />
          </div>

          <svg
            className={styles.decoLines}
            xmlns="http://www.w3.org/2000/svg"
            width="382.491"
            height="298.293"
            viewBox="0 0 382.491 298.293"
          >
            <g
              id="Grupo_1194"
              data-name="Grupo 1194"
              transform="translate(-92.509 -1030.612)"
            >
              <path
                id="Trazado_2471"
                data-name="Trazado 2471"
                d="M1261.33,665.735s-42.185,53.611-108.394,75.746c-66.379,19.308-113.955-.9-130.663-8.774"
                transform="translate(79.691 -154.206) rotate(52)"
                fill="none"
                stroke="#ffe70e"
                strokeLinecap="round"
                strokeWidth="32"
              />
              <rect
                id="Rectángulo_370"
                data-name="Rectángulo 370"
                width="84"
                height="33"
                rx="16.5"
                transform="translate(391 1237)"
                fill="#ffe70e"
              />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
