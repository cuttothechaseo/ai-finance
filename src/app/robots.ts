import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for the Next.js app
 * This will be accessible at https://wallstreetai.app/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wallstreetai.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/', 
          '/admin/',
          '/api/',
          '/*.json$',
          '/*.xml$',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 