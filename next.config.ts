/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    allowedDevOrigins: ["http://192.168.100.75:3000"], // your local IP + port
  },
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
      // Add more domains as needed
      {
        protocol: "https",
        hostname: "**.nixova.com", // For subdomains
      },
    ],
    // Alternatively, you can use domains array (deprecated but still works)
    domains: ['nixova.com'],
  },
};

module.exports = nextConfig;