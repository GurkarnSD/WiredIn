/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
  images: {
    domains: ["wiredinimages.s3.amazonaws.com"],
  },
  env: {
    S3ENDPOINT: process.env.NEXT_PUBLIC_S3ENDPOINT,
  },
};

module.exports = nextConfig;
