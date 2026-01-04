export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'customer' | 'support'
          status: 'active' | 'suspended'
          phone: string | null
          company: string | null
          address: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'customer' | 'support'
          status?: 'active' | 'suspended'
          phone?: string | null
          company?: string | null
          address?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'customer' | 'support'
          status?: 'active' | 'suspended'
          phone?: string | null
          company?: string | null
          address?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          plan_data: Json
          status: 'active' | 'expired' | 'pending'
          qr_code_url: string | null
          imei: string | null
          device_model: string | null
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          plan_data: Json
          status?: 'active' | 'expired' | 'pending'
          qr_code_url?: string | null
          imei?: string | null
          device_model?: string | null
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          plan_data?: Json
          status?: 'active' | 'expired' | 'pending'
          qr_code_url?: string | null
          imei?: string | null
          device_model?: string | null
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          type: 'esim' | 'number' | 'vpn' | 'voip'
          country: string
          region: string
          data: string
          validity: string
          price: number
          flag: string
          is_popular: boolean
          description: string | null
          features: Json | null
          operators: Json | null
          covered_countries: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          type: 'esim' | 'number' | 'vpn' | 'voip'
          country: string
          region: string
          data: string
          validity: string
          price: number
          flag: string
          is_popular?: boolean
          description?: string | null
          features?: Json | null
          operators?: Json | null
          covered_countries?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'esim' | 'number' | 'vpn' | 'voip'
          country?: string
          region?: string
          data?: string
          validity?: string
          price?: number
          flag?: string
          is_popular?: boolean
          description?: string | null
          features?: Json | null
          operators?: Json | null
          covered_countries?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key: string
          last_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key: string
          last_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key?: string
          last_used?: string | null
          created_at?: string
        }
      }
      admin_config: {
        Row: {
          id: string
          config_data: Json
          updated_at: string
        }
        Insert: {
          id?: string
          config_data: Json
          updated_at?: string
        }
        Update: {
          id?: string
          config_data?: Json
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id: string | null
          author_name: string
          author_avatar: string | null
          published_at: string | null
          updated_at: string | null
          category: string
          tags: string[]
          image_url: string | null
          read_time: number
          featured: boolean
          published: boolean
          views: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id?: string | null
          author_name?: string
          author_avatar?: string | null
          published_at?: string | null
          updated_at?: string | null
          category?: string
          tags?: string[]
          image_url?: string | null
          read_time?: number
          featured?: boolean
          published?: boolean
          views?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          author_id?: string | null
          author_name?: string
          author_avatar?: string | null
          published_at?: string | null
          updated_at?: string | null
          category?: string
          tags?: string[]
          image_url?: string | null
          read_time?: number
          featured?: boolean
          published?: boolean
          views?: number
          created_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          name: string
          slug: string
          flag: string
          description: string
          network_operators: string[]
          coverage_areas: string[]
          popular_plans: Json | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          flag: string
          description: string
          network_operators?: string[]
          coverage_areas?: string[]
          popular_plans?: Json | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          flag?: string
          description?: string
          network_operators?: string[]
          coverage_areas?: string[]
          popular_plans?: Json | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_blog_post_views: {
        Args: {
          post_id: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'admin' | 'customer' | 'support'
      user_status: 'active' | 'suspended'
      order_status: 'active' | 'expired' | 'pending'
      product_type: 'esim' | 'number' | 'vpn' | 'voip'
    }
  }
}

