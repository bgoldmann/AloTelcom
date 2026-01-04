import { supabase } from './supabase';

export interface BlogPost {
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
  views?: number;
}

// Fetch all published blog posts
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: {
      name: post.author_name,
      avatar: post.author_avatar || undefined,
    },
    publishedAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    category: post.category,
    tags: post.tags || [],
    image: post.image_url || undefined,
    readTime: post.read_time || 5,
    featured: post.featured || false,
    views: post.views || 0,
  }));
};

// Fetch a single blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  if (!data) return null;

  // Increment views
  await supabase.rpc('increment_blog_post_views', { post_id: data.id });

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    author: {
      name: data.author_name,
      avatar: data.author_avatar || undefined,
    },
    publishedAt: data.published_at || data.created_at,
    updatedAt: data.updated_at,
    category: data.category,
    tags: data.tags || [],
    image: data.image_url || undefined,
    readTime: data.read_time || 5,
    featured: data.featured || false,
    views: (data.views || 0) + 1,
  };
};

// Fetch blog posts by category
export const fetchBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: {
      name: post.author_name,
      avatar: post.author_avatar || undefined,
    },
    publishedAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    category: post.category,
    tags: post.tags || [],
    image: post.image_url || undefined,
    readTime: post.read_time || 5,
    featured: post.featured || false,
    views: post.views || 0,
  }));
};

// Search blog posts
export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }

  return (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: {
      name: post.author_name,
      avatar: post.author_avatar || undefined,
    },
    publishedAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    category: post.category,
    tags: post.tags || [],
    image: post.image_url || undefined,
    readTime: post.read_time || 5,
    featured: post.featured || false,
    views: post.views || 0,
  }));
};

