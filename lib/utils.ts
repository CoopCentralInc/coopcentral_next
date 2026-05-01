import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const WP_HOSTNAMES = [
  process.env.NEXT_PUBLIC_WORDPRESS_HOSTNAME,
  "app.coopcentral.do",
  "coopcentral.do",
  "www.coopcentral.do",
  "coopcentral-d7hfezdhekd3ejgq.westus2-01.azurewebsites.net",
].filter(Boolean) as string[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getURL(path = "") {
  if (!path.includes("http")) return path || "/";

  try {
    const url = new URL(path);
    if (WP_HOSTNAMES.includes(url.hostname)) {
      return url.pathname;
    }
  } catch {
    // URL inválida, devolver tal cual
  }

  return path;
}
