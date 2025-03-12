/**
 * API Route for generating a dynamic sitemap
 * This will be accessible at https://wallstreetai.app/api/sitemap
 */
export async function GET(): Promise<Response> {
  const baseUrl = 'https://wallstreetai.app';
  const currentDate = new Date().toISOString();

  const staticRoutes = [
    { url: baseUrl, lastModified: currentDate },
    { url: `${baseUrl}#features`, lastModified: currentDate },
    { url: `${baseUrl}#success-stories`, lastModified: currentDate },
    { url: `${baseUrl}#exclusive-resources`, lastModified: currentDate },
    { url: `${baseUrl}#how-it-works`, lastModified: currentDate },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes
      .map(
        (route) => `
      <url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route.url === baseUrl ? '1.0' : '0.8'}</priority>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new Response(sitemapXml, {
    headers: { 'Content-Type': 'application/xml' },
  });
} 