/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disattiviamo temporaneamente per evitare doppi render durante i test
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.replit.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // In Next 14 non serve disabilitare turbo, Webpack è il default.
};

export default nextConfig;