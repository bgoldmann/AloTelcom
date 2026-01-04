// Sitemap generator utility
// This generates XML sitemap data structure
// In production, this would be a server-side endpoint or build-time generation

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapData {
  urls: SitemapUrl[];
}

const baseUrl = 'https://alotelcom.com';

// Static pages
const staticPages: SitemapUrl[] = [
  {
    loc: `${baseUrl}/`,
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    loc: `${baseUrl}/marketplace`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${baseUrl}/about`,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${baseUrl}/partners`,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${baseUrl}/help`,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${baseUrl}/support`,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: `${baseUrl}/legal`,
    changefreq: 'monthly',
    priority: 0.5,
  },
];

// Category pages
const categoryPages: SitemapUrl[] = [
  {
    loc: `${baseUrl}/esim-plans/local`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${baseUrl}/esim-plans/regional`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${baseUrl}/esim-plans/global`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${baseUrl}/virtual-numbers`,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${baseUrl}/vpn-services`,
    changefreq: 'weekly',
    priority: 0.8,
  },
];

// Top 20 countries for country-specific pages
const topCountries = [
  'japan', 'united-states', 'turkey', 'europe', 'united-kingdom',
  'thailand', 'france', 'germany', 'spain', 'italy',
  'canada', 'australia', 'south-korea', 'singapore', 'uae',
  'india', 'brazil', 'mexico', 'argentina', 'south-africa',
];

const countryPages: SitemapUrl[] = topCountries.map((country) => ({
  loc: `${baseUrl}/esim/${country}`,
  changefreq: 'weekly',
  priority: 0.8,
}));

// Generate XML sitemap string
export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const urlsXML = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
};

// Get all sitemap URLs
export const getAllSitemapUrls = (): SitemapUrl[] => {
  const now = new Date().toISOString().split('T')[0];
  
  return [
    ...staticPages.map(url => ({ ...url, lastmod: now })),
    ...categoryPages.map(url => ({ ...url, lastmod: now })),
    ...countryPages.map(url => ({ ...url, lastmod: now })),
  ];
};

// Generate complete sitemap
export const generateSitemap = (): string => {
  const urls = getAllSitemapUrls();
  return generateSitemapXML(urls);
};

// For dynamic product pages (would be fetched from database)
export const generateProductSitemap = (products: Array<{ id: string; country: string; updatedAt?: string }>): SitemapUrl[] => {
  return products.map((product) => ({
    loc: `${baseUrl}/esim-plans/${product.country.toLowerCase().replace(/\s+/g, '-')}/${product.id}`,
    lastmod: product.updatedAt || new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  }));
};

