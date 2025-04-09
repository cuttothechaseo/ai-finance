/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Enable Fast Refresh by not modifying the webpack config
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ensure Fast Refresh is enabled and preserved
      const entries = config.entry;
      config.entry = async () => {
        const entryObj = await entries();
        return entryObj;
      };
    }
    return config;
  },
  
  // Adjust server settings
  onDemandEntries: {
    // Keep unused pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  experimental: {
    // Disable all experimental features to avoid HMR issues
    optimizeCss: false,
    scrollRestoration: false,
    optimizePackageImports: [],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  poweredByHeader: false,
  
  // Add rewrite rule for sitemap.xml
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  
  // Add headers for better security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/:path*(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Reduced caching time for JS and CSS
        source: '/:path*(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 