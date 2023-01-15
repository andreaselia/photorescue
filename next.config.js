/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['replicate.delivery'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
}

module.exports = nextConfig
