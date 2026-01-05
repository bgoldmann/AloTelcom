import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { SEO } from '../lib/seo';
import { ArticleSchemaScript, BreadcrumbSchemaScript } from '../lib/schema';
import LoadingSpinner from '../components/LoadingSpinner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  image?: string;
  readTime: number;
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock post data - In production, fetch from Supabase
  const mockPost: BlogPost = {
    id: '1',
    title: 'How to Install eSIM on iPhone: Complete Guide 2025',
    slug: 'how-to-install-esim-iphone-2025',
    excerpt: 'Step-by-step instructions for installing an eSIM on your iPhone. Works for iPhone XS and later models.',
    content: `
# How to Install eSIM on iPhone: Complete Guide 2025

Installing an eSIM on your iPhone is quick and easy. This guide will walk you through the entire process step by step.

## What You'll Need

- An iPhone XS or later (iPhone XS, XS Max, XR, 11, 12, 13, 14, 15, or newer)
- A stable Wi-Fi or cellular connection
- The QR code from your eSIM purchase email

## Step-by-Step Installation

### Step 1: Open Settings
1. Open the **Settings** app on your iPhone
2. Tap **Cellular** (or **Mobile Data** in some regions)

### Step 2: Add Cellular Plan
1. Tap **Add Cellular Plan**
2. You'll see options to scan a QR code or enter details manually

### Step 3: Scan QR Code
1. Open the email with your eSIM QR code
2. Tap **Scan QR Code** in Settings
3. Point your camera at the QR code
4. Wait for the eSIM to download

### Step 4: Configure Your eSIM
1. Label your eSIM (e.g., "Travel Data" or "Japan eSIM")
2. Choose your default line for:
   - **Cellular Data**: Which line to use for data
   - **Default Voice Line**: Which line to use for calls
   - **iMessage & FaceTime**: Which number to use

### Step 5: Activate
1. Tap **Done**
2. Your eSIM is now active and ready to use!

## Tips for Using eSIM

- **Dual SIM**: You can use both your physical SIM and eSIM simultaneously
- **Switching**: Go to Settings > Cellular to switch between lines
- **Data Roaming**: Make sure data roaming is enabled for your eSIM line
- **Labeling**: Use clear labels to identify which line is which

## Troubleshooting

If you encounter issues:

1. **QR Code Not Scanning**: Try entering the activation code manually
2. **eSIM Not Activating**: Ensure you have a stable internet connection
3. **Can't Find Add Cellular Plan**: Make sure your iPhone supports eSIM
4. **Download Failed**: Check your internet connection and try again

## Need Help?

If you're still having trouble, contact our support team at support@alotelcom.com or visit our Help Center.
    `,
    author: {
      name: 'AloTelcom Team',
      bio: 'Expert team helping travelers stay connected worldwide',
    },
    publishedAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    category: 'Installation Guides',
    tags: ['iphone', 'esim', 'installation', 'tutorial'],
    readTime: 5,
    relatedPosts: [
      { id: '2', title: 'How to Install eSIM on Android', slug: 'how-to-install-esim-android' },
      { id: '3', title: 'eSIM Troubleshooting Guide', slug: 'esim-troubleshooting-guide' },
    ],
  };

  useEffect(() => {
    // Simulate loading and fetch post
    setTimeout(() => {
      setPost(mockPost);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pars-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-pars-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pars-primary mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-pars-cta hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://alotelcom.com/' },
      { name: 'Blog', url: 'https://alotelcom.com/blog' },
      { name: post.title, url: `https://alotelcom.com/blog/${post.slug}` },
    ],
  };

  const articleSchemaData = {
    headline: post.title,
    description: post.excerpt,
    author: {
      name: post.author.name,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: post.image,
  };

  return (
    <>
      <SEO
        title={`${post.title} | AloTelcom Blog`}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        type="article"
        author={post.author.name}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        image={post.image}
      />
      <ArticleSchemaScript data={articleSchemaData} />
      <BreadcrumbSchemaScript data={breadcrumbData} />

      <div className="min-h-screen bg-pars-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-pars-cta hover:text-orange-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-stone-800 rounded-2xl border border-pars-light overflow-hidden shadow-sm">
            {post.image && (
              <div className="h-64 md:h-96 bg-gradient-to-br from-pars-cta to-amber-500 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-pars-gray mb-6">
                <span className="px-3 py-1 bg-pars-cta/10 text-pars-cta rounded-full font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-pars-primary mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-pars-text mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-pars-light">
                <Tag className="w-4 h-4 text-pars-gray" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-pars-bg text-pars-text rounded-full text-sm hover:bg-pars-cta hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:text-pars-primary
                  prose-p:text-pars-text
                  prose-a:text-pars-cta
                  prose-strong:text-pars-primary
                  prose-code:text-pars-cta
                  prose-pre:bg-stone-900
                  prose-img:rounded-xl
                  prose-blockquote:border-pars-cta
                  prose-blockquote:bg-pars-bg
                  prose-blockquote:py-2
                  prose-blockquote:px-4
                  prose-ul:list-disc
                  prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-pars-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pars-cta/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-pars-cta" />
                    </div>
                    <div>
                      <p className="font-semibold text-pars-primary">{post.author.name}</p>
                      {post.author.bio && (
                        <p className="text-sm text-pars-text">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-pars-bg hover:bg-pars-cta hover:text-white rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-pars-primary mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {post.relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="p-6 bg-white dark:bg-stone-800 rounded-xl border border-pars-light hover:border-pars-cta hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-pars-primary mb-2 hover:text-pars-cta transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-sm text-pars-cta">Read article →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPost;

