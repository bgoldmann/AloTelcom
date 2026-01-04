import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Search, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { SEO } from '../lib/seo';
import { BreadcrumbSchemaScript } from '../lib/schema';
import { fetchBlogPosts, searchBlogPosts, fetchBlogPostsByCategory } from '../lib/blog-helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  image?: string;
  readTime: number;
  featured?: boolean;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Getting Started',
    'Installation Guides',
    'Travel Tips',
    'Product Comparisons',
    'Troubleshooting',
    'Destination Guides',
  ];

  // Mock blog posts - In production, fetch from Supabase
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Install eSIM on iPhone: Complete Guide 2025',
      slug: 'how-to-install-esim-iphone-2025',
      excerpt: 'Step-by-step instructions for installing an eSIM on your iPhone. Works for iPhone XS and later models.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-15',
      category: 'Installation Guides',
      tags: ['iphone', 'esim', 'installation', 'tutorial'],
      readTime: 5,
      featured: true,
    },
    {
      id: '2',
      title: 'Best eSIM Plans for Japan: Complete 2025 Guide',
      slug: 'best-esim-plans-japan-2025',
      excerpt: 'Everything you need to know about getting connected in Japan. Compare plans, prices, and coverage.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-12',
      category: 'Destination Guides',
      tags: ['japan', 'travel', 'esim', 'destination'],
      readTime: 8,
      featured: true,
    },
    {
      id: '3',
      title: 'eSIM vs Physical SIM: Which is Better for Travel?',
      slug: 'esim-vs-physical-sim-travel',
      excerpt: 'Compare eSIM and physical SIM cards to decide which is best for your travel needs.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-10',
      category: 'Product Comparisons',
      tags: ['comparison', 'esim', 'sim-card', 'travel'],
      readTime: 6,
    },
    {
      id: '4',
      title: 'How to Avoid Roaming Charges: Complete Guide',
      slug: 'how-to-avoid-roaming-charges',
      excerpt: 'Learn how to stay connected abroad without paying expensive roaming fees from your home carrier.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-08',
      category: 'Travel Tips',
      tags: ['roaming', 'travel', 'money-saving', 'tips'],
      readTime: 7,
    },
    {
      id: '5',
      title: 'Digital Nomad Internet Guide: eSIM + VPN Setup',
      slug: 'digital-nomad-internet-guide',
      excerpt: 'Complete guide to staying connected and secure while working remotely from anywhere in the world.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-05',
      category: 'Travel Tips',
      tags: ['digital-nomad', 'remote-work', 'vpn', 'esim'],
      readTime: 10,
    },
    {
      id: '6',
      title: 'eSIM Troubleshooting: Common Issues and Solutions',
      slug: 'esim-troubleshooting-guide',
      excerpt: 'Fix common eSIM activation and connectivity issues with our comprehensive troubleshooting guide.',
      content: '',
      author: { name: 'AloTelcom Team' },
      publishedAt: '2025-01-03',
      category: 'Troubleshooting',
      tags: ['troubleshooting', 'esim', 'help', 'support'],
      readTime: 6,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const featuredPosts = posts.filter(post => post.featured);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <SEO
        title="Blog - eSIM Guides, Travel Tips & Tutorials | AloTelcom"
        description="Learn everything about eSIMs, travel connectivity, and staying connected abroad. Guides, tutorials, comparisons, and travel tips."
        keywords="esim blog, travel connectivity blog, esim guides, travel tips, esim tutorials, digital nomad guides"
        type="website"
      />

      <div className="min-h-screen bg-pars-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pars-cta/10 text-pars-cta mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold">Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-pars-primary mb-4">
              Learn & Explore
            </h1>
            <p className="text-lg text-pars-text max-w-2xl mx-auto">
              Guides, tutorials, and tips to help you stay connected while traveling
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pars-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-pars-light bg-white dark:bg-stone-800 focus:ring-2 focus:ring-pars-cta focus:border-transparent outline-none text-pars-text"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  (selectedCategory === category) || (!selectedCategory && category === 'All')
                    ? 'bg-pars-cta text-white'
                    : 'bg-white dark:bg-stone-800 text-pars-text border border-pars-light hover:border-pars-cta'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          {!searchQuery && !selectedCategory && featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-pars-primary mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-stone-800 rounded-xl border border-pars-light hover:border-pars-cta hover:shadow-lg transition-all overflow-hidden"
                  >
                    {post.image && (
                      <div className="h-48 bg-gradient-to-br from-pars-cta to-amber-500 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-pars-gray mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-pars-primary mb-2 group-hover:text-pars-cta transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-pars-text mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-pars-gray">
                          <User className="w-4 h-4" />
                          {post.author.name}
                        </div>
                        <span className="text-pars-cta group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read more <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-pars-primary mb-6">
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </h2>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-stone-800 rounded-xl border border-pars-light hover:border-pars-cta hover:shadow-lg transition-all overflow-hidden"
                  >
                    {post.image && (
                      <div className="h-40 bg-gradient-to-br from-pars-cta to-amber-500 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-pars-gray mb-3">
                        <span className="px-2 py-1 bg-pars-bg rounded text-pars-cta font-medium">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime} min
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-pars-primary mb-2 group-hover:text-pars-cta transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-pars-text mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-pars-gray">{formatDate(post.publishedAt)}</span>
                        <ArrowRight className="w-4 h-4 text-pars-cta group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-xl border border-pars-light">
                <p className="text-pars-text">No articles found. Try a different search term or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;

