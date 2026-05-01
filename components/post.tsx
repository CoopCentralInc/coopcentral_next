import React from "react";
import { Article } from "./craft";
import styles from "./post.module.scss";
import Image from "next/image";
import { CalendarIcon, UserIcon } from "./ui/icons";
import Link from "next/link";
import {
  getCategoryById,
  getFeaturedMediaById,
} from "@/lib/wordpress";

interface Props {
  post: any;
}

export default async function Post({ post }: Props) {
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media).catch(() => null)
    : null;

  const date = new Date(post.date).toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post.categories
    ? await getCategoryById(post.categories[0]).catch(() => null)
    : null;
  return (
    <article className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          {/* Look at the settings to see if we should include the featured image */}
          {featuredMedia && (
            <div className={styles.media}>
              <Image
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                width={1920}
                height={1080}
                style={{
                  borderRadius: "100rem",
                  overflow: "hidden",
                }}
              />

              <svg
                className={styles.leftLine}
                xmlns="http://www.w3.org/2000/svg"
                width="349.463"
                height="450.2"
                viewBox="0 0 349.463 450.2"
              >
                <path
                  id="Trazado_1"
                  data-name="Trazado 1"
                  d="M1370.966,665.735s-75.181,66.875-171.754,99.162c-96.821,28.163-190.3,16.151-214.672,4.673"
                  transform="translate(1388.068 -435.08) rotate(120)"
                  fill="none"
                  stroke="#ffe70e"
                  strokeLinecap="round"
                  strokeWidth="32"
                />
              </svg>

              <svg
                className={styles.rightLine}
                xmlns="http://www.w3.org/2000/svg"
                width="349.463"
                height="450.2"
                viewBox="0 0 349.463 450.2"
              >
                <path
                  id="Trazado_1"
                  data-name="Trazado 1"
                  d="M1370.966,665.735s-75.181,66.875-171.754,99.162c-96.821,28.163-190.3,16.151-214.672,4.673"
                  transform="translate(1388.068 -435.08) rotate(120)"
                  fill="none"
                  stroke="#ffe70e"
                  strokeLinecap="round"
                  strokeWidth="32"
                />
              </svg>
            </div>
          )}

          <div>
            {/* Only display author and date on posts */}
            {
              <div className={styles.meta}>
                {/* {author && (
                  <Link href={author.link}>
                    <p className={styles.author}>
                      <span className={styles.metaIcon}>
                        <UserIcon />
                      </span>
                      <span className={styles.metaText}>
                        <b> {author.name} </b>
                      </span>
                    </p>
                  </Link>
                )} */}
                <p className={styles.fecha}>
                  <span className={styles.metaIcon}>
                    <CalendarIcon />
                  </span>
                  <span className={styles.metaText}>
                    <b>{date}</b>
                  </span>
                </p>
              </div>
            }

            <h1
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>
        </header>
        <Article
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
}
