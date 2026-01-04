# Sitemap Optimization Guide

## Current Implementation

The sitemap is currently generated client-side via `pages/Sitemap.tsx`. This works for development but should be optimized for production.

---

## 🎯 Production Optimization Options

### Option 1: Build-Time Generation (Recommended for Static Sites)

Generate sitemap during build process and serve as static file.

#### Implementation Steps:

1. **Create Build Script** (`scripts/generate-sitemap.js`):
```javascript
import { writeFileSync } from 'fs';
import { generateSitemap } from './lib/sitemap.js';

const sitemap = generateSitemap();
writeFileSync('dist/sitemap.xml', sitemap);
console.log('✅ Sitemap generated at dist/sitemap.xml');
```

2. **Update package.json**:
```json
{
  "scripts": {
    "build": "vite build && node scripts/generate-sitemap.js",
    "generate-sitemap": "node scripts/generate-sitemap.js"
  }
}
```

3. **Update vercel.json** to serve static sitemap:
```json
{
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/sitemap.xml" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 2: Server-Side API Route (Vercel)

Create a serverless function to generate sitemap on-demand.

#### Implementation Steps:

1. **Create API Route** (`api/sitemap.ts` or `api/sitemap.js`):
```typescript
import { generateSitemap } from '../../lib/sitemap';

export default function handler(req, res) {
  const sitemap = generateSitemap();
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
```

2. **Update vercel.json**:
```json
{
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 3: Dynamic Generation with Database (Future)

For dynamic content from Supabase:

```typescript
// lib/sitemap.ts - Enhanced version
export const generateSitemapWithProducts = async (): Promise<string> => {
  // Fetch products from Supabase
  const { data: products } = await supabase
    .from('products')
    .select('id, country, updated_at');
  
  // Fetch blog posts from Supabase
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at');
  
  // Generate product URLs
  const productUrls = generateProductSitemap(products || []);
  
  // Generate blog URLs
  const blogUrls = blogPosts?.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updated_at.split('T')[0],
    changefreq: 'monthly' as const,
    priority: 0.7,
  })) || [];
  
  const allUrls = [
    ...staticPages,
    ...categoryPages,
    ...countryPages,
    ...productUrls,
    ...blogUrls,
  ];
  
  return generateSitemapXML(allUrls.map(url => ({ ...url, lastmod: new Date().toISOString().split('T')[0] })));
};
```

---

## 📋 Current Sitemap Structure

The sitemap includes:
- ✅ Static pages (Home, Marketplace, About, etc.)
- ✅ Category pages (Local, Regional, Global eSIM)
- ✅ Top 20 country pages
- ⏳ Product pages (ready for database integration)
- ⏳ Blog posts (ready for database integration)

---

## 🔧 Recommended Implementation

For Vercel deployment, **Option 1 (Build-Time)** is recommended:

1. **Advantages**:
   - Fast (served as static file)
   - No serverless function costs
   - Better for SEO (always available)
   - Works with CDN caching

2. **Implementation**:
   - Generate during build
   - Commit to repository or generate in CI/CD
   - Serve from `public/sitemap.xml` or `dist/sitemap.xml`

---

## ✅ Next Steps

1. Choose optimization option (recommend Option 1)
2. Create build script
3. Update package.json
4. Test sitemap generation
5. Verify sitemap.xml is accessible at `/sitemap.xml`
6. Submit to Google Search Console

---

## 📝 Notes

- Current `pages/Sitemap.tsx` can remain for development/testing
- Production should use static file or API route
- Update `robots.txt` to reference correct sitemap URL
- Consider sitemap index if sitemap exceeds 50,000 URLs

