import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for the Next.js app
 * This will be accessible at https://wallstreetai.app/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://wallstreetai.app/sitemap.xml',
  };
} 