/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: { turbo: { /* keep defaults */ } },
  // Pin Turbopack root explicitly:
  turbopack: { root: __dirname }
};
module.exports = nextConfig;