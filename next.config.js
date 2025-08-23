/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'nebachiv.com',
      'images.unsplash.com', // для прикладів
      'tailwindui.com',      // для Tailwind UI
    ],
    unoptimized: true, // Для static export
  },
  // Для мобільного доступу дозволяємо всі хости
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
        ],
      },
    ]
  },
  // Для Capacitor потрібен static export - відключено тимчасово
  // output: 'export',
  // trailingSlash: true,
  // Disable server-only features for mobile app
  experimental: {
    // serverActions: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig