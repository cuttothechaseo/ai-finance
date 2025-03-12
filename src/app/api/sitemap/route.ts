/**
 * API Route for generating a dynamic sitemap
 * This will be accessible at https://wallstreetai.app/sitemap.xml
 */
export async function GET(): Promise<Response> {
  const baseUrl = 'https://wallstreetai.app';
  const currentDate = new Date().toISOString();

  // Define all routes with their priorities and change frequencies
  const routes = [
    { 
      url: baseUrl, 
      lastModified: currentDate, 
      changeFreq: 'weekly', 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}#features`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}#success-stories`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}#exclusive-resources`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}#how-it-works`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.9 
    },
    // Add additional pages here as they are created
    { 
      url: `${baseUrl}/interview-prep`, 
      lastModified: currentDate, 
      changeFreq: 'weekly', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/resume-analysis`, 
      lastModified: currentDate, 
      changeFreq: 'weekly', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/job-search`, 
      lastModified: currentDate, 
      changeFreq: 'weekly', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/pricing`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.7 
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: currentDate, 
      changeFreq: 'monthly', 
      priority: 0.7 
    },
    { 
      url: `${baseUrl}/terms`, 
      lastModified: currentDate, 
      changeFreq: 'yearly', 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/privacy`, 
      lastModified: currentDate, 
      changeFreq: 'yearly', 
      priority: 0.5 
    },
  ];

  // Generate the XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        (route) => `
      <url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastModified}</lastmod>
        <changefreq>${route.changeFreq}</changefreq>
        <priority>${route.priority}</priority>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new Response(sitemapXml, {
    headers: { 
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    },
  });
} 