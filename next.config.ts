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
        hostname: `certificaciones.uaf.gob.do`,
        port: "",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
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
