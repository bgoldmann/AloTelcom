import React, { useEffect } from 'react';

export interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  logo?: string;
  contactPoint?: {
    email: string;
    contactType: string;
  };
  sameAs?: string[];
}

export interface ProductSchema {
  name: string;
  description: string;
  brand: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  image?: string;
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export interface FAQSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified?: string;
}

// Organization Schema Component
export const OrganizationSchemaScript: React.FC<{ data: OrganizationSchema }> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'organization-schema';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      description: data.description,
      url: data.url,
      ...(data.logo && { logo: data.logo }),
      ...(data.contactPoint && {
        contactPoint: {
          '@type': 'ContactPoint',
          email: data.contactPoint.email,
          contactType: data.contactPoint.contactType,
        },
      }),
      ...(data.sameAs && { sameAs: data.sameAs }),
    };

    script.textContent = JSON.stringify(schema);
  }, [data]);

  return null;
};

// Product Schema Component
export const ProductSchemaScript: React.FC<{ data: ProductSchema }> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'product-schema';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      brand: {
        '@type': 'Brand',
        name: data.brand,
      },
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
        availability: data.offers.availability,
        url: data.offers.url,
      },
      ...(data.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          reviewCount: data.aggregateRating.reviewCount,
        },
      }),
      ...(data.image && { image: data.image }),
    };

    script.textContent = JSON.stringify(schema);
  }, [data]);

  return null;
};

// Breadcrumb Schema Component
export const BreadcrumbSchemaScript: React.FC<{ data: BreadcrumbSchema }> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'breadcrumb-schema';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    script.textContent = JSON.stringify(schema);
  }, [data]);

  return null;
};

// FAQ Schema Component
export const FAQSchemaScript: React.FC<{ data: FAQSchema }> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'faq-schema';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.questions.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    };

    script.textContent = JSON.stringify(schema);
  }, [data]);

  return null;
};

// Article Schema Component
export const ArticleSchemaScript: React.FC<{ data: ArticleSchema }> = ({ data }) => {
  useEffect(() => {
    const scriptId = 'article-schema';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      author: {
        '@type': 'Person',
        name: data.author.name,
        ...(data.author.url && { url: data.author.url }),
      },
      datePublished: data.datePublished,
      ...(data.dateModified && { dateModified: data.dateModified }),
      ...(data.image && { image: data.image }),
    };

    script.textContent = JSON.stringify(schema);
  }, [data]);

  return null;
};

