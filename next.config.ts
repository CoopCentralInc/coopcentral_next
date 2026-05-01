import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.WORDPRESS_HOSTNAME}`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `coopcentral.do`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `app.coopcentral.do`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `coopcentral-d7hfezdhekd3ejgq.westus2-01.azurewebsites.net`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `certificaciones.uaf.gob.do`,
        port: "",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async rewrites() {
    const wpBase = (process.env.WORDPRESS_URL || "https://app.coopcentral.do").replace(/\/$/, "");
    return [
      {
        source: "/wp-content/:path*",
        destination: `${wpBase}/wp-content/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.WORDPRESS_URL}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
