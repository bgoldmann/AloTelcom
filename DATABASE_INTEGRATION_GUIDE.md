# Database Integration Guide

## Overview

This guide documents the database integration for Blog Posts, Country Pages, and Products. The integration moves from mock data to Supabase database queries.

---

## ✅ Completed

### 1. Database Schema
- ✅ Created `supabase/blog_schema.sql` - Blog posts and countries tables
- ✅ Created `supabase/blog_seed.sql` - Sample blog posts
- ✅ Created `supabase/countries_seed.sql` - Country data

### 2. Helper Functions
- ✅ Created `lib/blog-helpers.ts` - Functions to fetch blog posts from Supabase
- ✅ Created `lib/country-helpers.ts` - Functions to fetch country data from Supabase

### 3. Database Tables

#### `blog_posts` Table
- Stores blog articles with full content
- Fields: id, title, slug, excerpt, content, author info, published_at, category, tags, image_url, read_time, featured, views
- RLS: Public can view published posts, admins can manage all

#### `countries` Table
- Stores country-specific information for landing pages
- Fields: id, name, slug, flag, description, network_operators, coverage_areas, seo fields
- RLS: Public read access, admin write access

---

## 📋 Setup Instructions

### Step 1: Run Database Schema

In your Supabase SQL Editor, run:

```sql
-- First, run the main schema if not already done
-- (supabase/schema.sql)

-- Then run the blog schema
-- (supabase/blog_schema.sql)
```

### Step 2: Seed Data

```sql
-- Seed blog posts
-- (supabase/blog_seed.sql)

-- Seed countries
-- (supabase/countries_seed.sql)
```

### Step 3: Update Components

The following components need to be updated to use database helpers:

1. **Blog.tsx** - ✅ Partially updated (imports added)
2. **BlogPost.tsx** - ⏳ Needs update
3. **CountryPage.tsx** - ⏳ Needs update

---

## 🔧 Implementation Details

### Blog Helpers (`lib/blog-helpers.ts`)

**Functions:**
- `fetchBlogPosts()` - Get all published posts
- `fetchBlogPostBySlug(slug)` - Get single post by slug
- `fetchBlogPostsByCategory(category)` - Get posts by category
- `searchBlogPosts(query)` - Search posts by query

**Usage:**
```typescript
import { fetchBlogPosts, fetchBlogPostBySlug } from '../lib/blog-helpers';

// Fetch all posts
const posts = await fetchBlogPosts();

// Fetch single post
const post = await fetchBlogPostBySlug('how-to-install-esim-iphone-2025');
```

### Country Helpers (`lib/country-helpers.ts`)

**Functions:**
- `fetchCountries()` - Get all countries
- `fetchCountryBySlug(slug)` - Get single country by slug

**Usage:**
```typescript
import { fetchCountryBySlug } from '../lib/country-helpers';

// Fetch country data
const country = await fetchCountryBySlug('japan');
```

---

## 📝 Remaining Tasks

### High Priority
1. **Update BlogPost.tsx**
   - Replace mock data with `fetchBlogPostBySlug()`
   - Handle loading and error states
   - Update SEO with database content

2. **Update CountryPage.tsx**
   - Replace mock data with `fetchCountryBySlug()`
   - Fetch products for country from database
   - Update SEO with database content

3. **Update Blog.tsx** (Complete)
   - Fix filtering logic to work with async functions
   - Ensure proper error handling

### Medium Priority
4. **Product Data Migration**
   - Update `Marketplace.tsx` to fetch from Supabase
   - Create product helper functions
   - Populate products table with comprehensive data

5. **Database Types Update**
   - Add blog_posts and countries to `database.types.ts`
   - Generate types from Supabase schema

---

## 🚀 Next Steps

1. Complete Blog.tsx integration (fix async filtering)
2. Update BlogPost.tsx to use database
3. Update CountryPage.tsx to use database
4. Test all database queries
5. Update database types
6. Migrate product data

---

## 📊 Database Schema Summary

### blog_posts
```sql
- id (UUID, PK)
- title (TEXT)
- slug (TEXT, UNIQUE)
- excerpt (TEXT)
- content (TEXT)
- author_id (UUID, FK to users)
- author_name (TEXT)
- author_avatar (TEXT)
- published_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- category (TEXT)
- tags (TEXT[])
- image_url (TEXT)
- read_time (INTEGER)
- featured (BOOLEAN)
- published (BOOLEAN)
- views (INTEGER)
- created_at (TIMESTAMPTZ)
```

### countries
```sql
- id (UUID, PK)
- name (TEXT, UNIQUE)
- slug (TEXT, UNIQUE)
- flag (TEXT)
- description (TEXT)
- network_operators (TEXT[])
- coverage_areas (TEXT[])
- popular_plans (JSONB)
- seo_title (TEXT)
- seo_description (TEXT)
- seo_keywords (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

---

## 🔗 Related Files

- `supabase/blog_schema.sql` - Database schema
- `supabase/blog_seed.sql` - Sample blog posts
- `supabase/countries_seed.sql` - Country data
- `lib/blog-helpers.ts` - Blog helper functions
- `lib/country-helpers.ts` - Country helper functions
- `pages/Blog.tsx` - Blog listing page
- `pages/BlogPost.tsx` - Blog post detail page
- `pages/CountryPage.tsx` - Country landing page

---

## ✅ Checklist

- [x] Create database schema
- [x] Create seed data
- [x] Create helper functions
- [ ] Update Blog.tsx (in progress)
- [ ] Update BlogPost.tsx
- [ ] Update CountryPage.tsx
- [ ] Update database types
- [ ] Test all integrations
- [ ] Update documentation

