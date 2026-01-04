#!/usr/bin/env node

/**
 * Sitemap Generation Script
 * 
 * This script generates a sitemap.xml file at build time.
 * Run with: node scripts/generate-sitemap.js
 * 
 * For production, this should be run as part of the build process.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Import sitemap generator (we'll need to convert to JS or use a different approach)
// For now, we'll inline the logic or use a build step

const baseUrl = 'https://alotelcom.com';

// Static pages
const staticPages = [
  { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
  { loc: `${baseUrl}/marketplace`, changefreq: 'weekly', priority: 0.9 },
  { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${baseUrl}/partners`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${baseUrl}/help`, changefreq: 'weekly', priority: 0.8 },
  { loc: `${baseUrl}/support`, changefreq: 'monthly', priority: 0.6 },
  { loc: `${baseUrl}/legal`, changefreq: 'monthly', priority: 0.5 },
  { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.8 },
];

// Category pages
const categoryPages = [
  { loc: `${baseUrl}/esim-plans/local`, changefreq: 'weekly', priority: 0.9 },
  { loc: `${baseUrl}/esim-plans/regional`, changefreq: 'weekly', priority: 0.9 },
  { loc: `${baseUrl}/esim-plans/global`, changefreq: 'weekly', priority: 0.9 },
  { loc: `${baseUrl}/virtual-numbers`, changefreq: 'weekly', priority: 0.8 },
  { loc: `${baseUrl}/vpn-services`, changefreq: 'weekly', priority: 0.8 },
];

// Top countries
const topCountries = [
  'japan', 'united-states', 'turkey', 'europe', 'united-kingdom',
  'thailand', 'france', 'germany', 'spain', 'italy',
  'canada', 'australia', 'south-korea', 'singapore', 'uae',
  'india', 'brazil', 'mexico', 'argentina', 'south-africa',
];

const countryPages = topCountries.map((country) => ({
  loc: `${baseUrl}/esim/${country}`,
  changefreq: 'weekly',
  priority: 0.8,
}));

// Generate XML
const now = new Date().toISOString().split('T')[0];
const allUrls = [
  ...staticPages.map(url => ({ ...url, lastmod: now })),
  ...categoryPages.map(url => ({ ...url, lastmod: now })),
  ...countryPages.map(url => ({ ...url, lastmod: now })),
];

const urlsXML = allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;

// Write to public directory (for Vite) or dist directory (for build)
const publicDir = join(rootDir, 'public');
const distDir = join(rootDir, 'dist');

try {
  // Try public first (for development)
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated at public/sitemap.xml');
} catch (error) {
  // Fallback to dist (for production build)
  try {
    mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated at dist/sitemap.xml');
  } catch (distError) {
    console.error('❌ Error generating sitemap:', distError);
    process.exit(1);
  }
}

console.log(`📊 Generated sitemap with ${allUrls.length} URLs`);

