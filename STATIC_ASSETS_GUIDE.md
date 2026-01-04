# Static Assets Guide

## Required Static Assets

This guide outlines the static assets needed for optimal branding, SEO, and user experience.

---

## 🎯 High Priority Assets

### 1. Favicon (`public/favicon.ico`)
**Purpose**: Browser tab icon  
**Size**: 32x32px or 16x16px (multi-size recommended)  
**Format**: ICO or PNG  
**Location**: `public/favicon.ico`

**HTML Reference** (add to `index.html`):
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

### 2. Logo (`public/logo.png` or `public/logo.svg`)
**Purpose**: Company logo for headers, emails, and branding  
**Size**: 
- SVG (recommended for scalability)
- PNG: 200x50px minimum, 400x100px preferred
**Format**: SVG or PNG (transparent background)  
**Location**: `public/logo.png` or `public/logo.svg`

**Usage**: Referenced in:
- `lib/schema.tsx` (OrganizationSchemaScript)
- Email templates
- Admin panel

### 3. Open Graph Image (`public/og-image.jpg`)
**Purpose**: Default image for social media sharing (Facebook, Twitter, LinkedIn)  
**Size**: 1200x630px (recommended)  
**Format**: JPG or PNG  
**Location**: `public/og-image.jpg`

**Current Reference**: 
- `pages/Home.tsx` line 43: `image="/og-image.jpg"`
- Update this path once the file is added

**HTML Reference** (already handled by SEO component):
```html
<meta property="og:image" content="https://alotelcom.com/og-image.jpg">
```

---

## 📱 Medium Priority Assets

### 4. Apple Touch Icon (`public/apple-touch-icon.png`)
**Purpose**: iOS home screen icon when users add to home screen  
**Size**: 180x180px  
**Format**: PNG  
**Location**: `public/apple-touch-icon.png`

**HTML Reference** (add to `index.html`):
```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

### 5. Manifest Icon (`public/icon-192.png`, `public/icon-512.png`)
**Purpose**: PWA/web app icons  
**Sizes**: 
- 192x192px (`icon-192.png`)
- 512x512px (`icon-512.png`)
**Format**: PNG  
**Location**: `public/icon-192.png`, `public/icon-512.png`

---

## 🎨 Design Guidelines

### Color Scheme
Based on your Tailwind config:
- **Primary**: `#1C1917` (Stone 900)
- **CTA/Accent**: `#EA580C` (Orange 600)
- **Accent**: `#FDBA74` (Orange 300)
- **Background**: `#FFF7ED` (Orange 50)

### Logo Design Tips
- Use orange (#EA580C) as primary brand color
- Ensure logo works on both light and dark backgrounds
- Keep text readable at small sizes
- Consider a wordmark + icon combination

### Favicon Design Tips
- Simple, recognizable icon
- Works at 16x16px size
- High contrast for visibility
- Can be simplified version of logo

---

## 📝 Implementation Steps

1. **Create/Obtain Assets**
   - Design logo in brand colors
   - Create favicon from logo
   - Design OG image with brand colors and tagline
   - Export at recommended sizes

2. **Add to Public Folder**
   ```
   public/
   ├── favicon.ico
   ├── logo.png (or logo.svg)
   ├── og-image.jpg
   ├── apple-touch-icon.png
   ├── icon-192.png
   └── icon-512.png
   ```

3. **Update HTML** (if needed)
   - Add favicon link to `index.html`
   - Add apple-touch-icon link
   - Verify OG image path in SEO components

4. **Test**
   - Verify favicon appears in browser tab
   - Test OG image with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Test Twitter Card with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Verify logo displays correctly in all contexts

---

## 🔗 Current References

### Files That Reference Static Assets:
- `pages/Home.tsx` - OG image reference
- `lib/schema.tsx` - Organization logo reference
- `lib/email-templates.tsx` - Logo in email templates
- `index.html` - Favicon (needs to be added)

### Update These After Adding Assets:
1. `pages/Home.tsx` line 43: Update OG image path if different
2. `lib/schema.tsx` line 50: Update logo URL in OrganizationSchemaScript
3. `index.html`: Add favicon and apple-touch-icon links

---

## 📦 Quick Start (Placeholder Assets)

If you need placeholder assets immediately:

1. **Favicon**: Use a simple orange circle or "A" letter
2. **Logo**: Text-based logo with "AloTelcom" in brand font
3. **OG Image**: Create a 1200x630px image with:
   - Brand colors (orange gradient background)
   - "AloTelcom" text
   - Tagline: "Global eSIM Marketplace"
   - Subtle globe or connectivity icon

---

## ✅ Checklist

- [ ] Create favicon.ico
- [ ] Create logo.png/svg
- [ ] Create og-image.jpg
- [ ] Create apple-touch-icon.png
- [ ] Create icon-192.png
- [ ] Create icon-512.png
- [ ] Add favicon link to index.html
- [ ] Add apple-touch-icon link to index.html
- [ ] Verify OG image path in Home.tsx
- [ ] Verify logo path in schema.tsx
- [ ] Test social media sharing
- [ ] Test favicon in browser

---

## 🛠️ Tools & Resources

- **Favicon Generator**: [favicon.io](https://favicon.io/)
- **OG Image Generator**: [og-image.vercel.app](https://og-image.vercel.app/)
- **Image Optimization**: [Squoosh](https://squoosh.app/)
- **SVG Optimization**: [SVGOMG](https://jakearchibald.github.io/svgomg/)

