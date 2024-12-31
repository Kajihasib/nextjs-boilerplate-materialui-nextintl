const withNextIntl = require("next-intl/plugin")();

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    domains: ["localhost", "127.0.0.1"],
  },
};

// Merge the Next.js configuration with the next-intl plugin
module.exports = withNextIntl(nextConfig);
