import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
}

export const useSEO = (props: SEOProps) => {
  useEffect(() => {
    const {
      title = 'AloTelcom - Global eSIM Marketplace | No Roaming Fees | 190+ Countries',
      description = 'Buy eSIM plans for 190+ countries. Instant activation, no roaming fees. Perfect for travelers, digital nomads, and business trips. Get connected in minutes.',
      keywords = 'esim, travel, data, internet, roaming, esim marketplace, global esim',
      image = '/og-image.jpg',
      url = window.location.href,
      type = 'website',
      author,
      publishedTime,
      modifiedTime,
      canonical
    } = props;

    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author || 'AloTelcom');

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'AloTelcom', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Article-specific tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author, 'property');
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, 'property');
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, 'property');
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || url);
  }, [props]);
};

// SEO Component for easy use in pages
export const SEO: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null;
};

