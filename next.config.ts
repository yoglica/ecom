/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "nixova.com",
      },
      {
        protocol: "https",
        hostname: "*.nixova.com", // Correct way to handle subdomains
      },
    ],
  },
};

module.exports = nextConfig;
