/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@happyhour/types", "@happyhour/ui", "@happyhour/api"],
};

module.exports = nextConfig;
