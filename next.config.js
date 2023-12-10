/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "bcrypt",
      "@react-email/components",
      "@react-email/render",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    S3ENDPOINT: process.env.NEXT_PUBLIC_S3ENDPOINT,
  },
};

module.exports = nextConfig;
