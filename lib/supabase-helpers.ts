import { supabase } from './supabase';
import type { User, Order, Plan, DropshipApiKey, AdminConfig } from '../types';
import type { Database } from './database.types';

type DbUser = Database['public']['Tables']['users']['Row'];
type DbOrder = Database['public']['Tables']['orders']['Row'];
type DbProduct = Database['public']['Tables']['products']['Row'];
type DbApiKey = Database['public']['Tables']['api_keys']['Row'];

// Convert database user to app user
export const mapDbUserToUser = async (dbUser: DbUser): Promise<User> => {
  // Fetch API keys for this user
  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', dbUser.id)
    .order('created_at', { ascending: false });

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    isAdmin: dbUser.role === 'admin',
    role: dbUser.role,
    status: dbUser.status,
    joinedDate: dbUser.created_at.split('T')[0],
    avatar: dbUser.avatar || undefined,
    phone: dbUser.phone || undefined,
    company: dbUser.company || undefined,
    address: dbUser.address || undefined,
    apiKeys: apiKeys?.map(k => ({
      id: k.id,
      name: k.name,
      key: k.key,
      createdAt: k.created_at.split('T')[0],
      lastUsed: k.last_used ? k.last_used.split('T')[0] : undefined
    })) || []
  };
};

// Convert database order to app order
export const mapDbOrderToOrder = async (dbOrder: DbOrder): Promise<Order> => {
  // Fetch user info
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', dbOrder.user_id)
    .single();

  // Fetch product info
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', dbOrder.plan_id)
    .single();

  const planData = dbOrder.plan_data as any;

  return {
    id: dbOrder.id,
    plan: product ? mapDbProductToPlan(product) : planData,
    date: dbOrder.created_at.split('T')[0],
    status: dbOrder.status,
    qrCodeUrl: dbOrder.qr_code_url || '',
    customerEmail: user?.email,
    customerName: user?.name
  };
};

// Convert database product to app plan
export const mapDbProductToPlan = (dbProduct: DbProduct): Plan => {
  return {
    id: dbProduct.id,
    type: dbProduct.type,
    country: dbProduct.country,
    region: dbProduct.region,
    data: dbProduct.data,
    validity: dbProduct.validity,
    price: Number(dbProduct.price),
    flag: dbProduct.flag,
    isPopular: dbProduct.is_popular,
    description: dbProduct.description || undefined,
    features: dbProduct.features as string[] | undefined,
    operators: dbProduct.operators as any,
    coveredCountries: dbProduct.covered_countries as string[] | undefined
  };
};

// User operations
export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return mapDbUserToUser(data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return Promise.all(data.map(mapDbUserToUser));
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.company !== undefined) updateData.company = updates.company;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
  if (updates.status) updateData.status = updates.status;
  if (updates.role) updateData.role = updates.role;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error || !data) return null;
  return mapDbUserToUser(data);
};

// Test Supabase connection - simpler approach
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if environment variables are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      const missing = [];
      if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
      if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
      return {
        success: false,
        error: `Missing environment variables: ${missing.join(', ')}. Please set these in your .env.local file (for local dev) or Vercel environment variables (for production).`
      };
    }
    
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : 'MISSING');
    
    // Skip health check - go straight to products query
    // The products query will fail fast if there's a connection issue
    
    // Now test the products query with timeout using Promise.race
    const queryPromise = supabase.from('products').select('id').limit(1);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Connection timeout: Products query timed out after 8 seconds.\n\nThis usually means:\n1. Supabase project is paused (check Dashboard → Settings → General)\n2. Products table doesn\'t exist (run schema.sql)\n3. RLS policies are blocking access (check Authentication → Policies)\n4. Network/firewall issues\n\nQuick fix: Check if your Supabase project is active in the Dashboard'));
      }, 8000);
    });
    
    const { data, error } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as { data: any; error: any };
    
    if (error) {
      console.error('Connection test failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide specific error messages
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'Products table not found. Please run schema.sql in Supabase SQL Editor to create the table.'
        };
      } else if (error.code === '42501') {
        return {
          success: false,
          error: 'Permission denied (RLS). Please check RLS policies in Supabase Dashboard:\n1. Go to Authentication → Policies\n2. Ensure products table has "Products are viewable by everyone" policy\n3. Policy should use: USING (true)'
        };
      } else if (error.message?.includes('JWT') || error.message?.includes('Invalid API key') || error.code === 'PGRST301') {
        return {
          success: false,
          error: 'Invalid Supabase API key. Please verify VITE_SUPABASE_ANON_KEY is correct in your environment variables.'
        };
      } else if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        return {
          success: false,
          error: `Network error: ${error.message}\n\nPossible causes:\n1. Supabase project is paused (check Supabase Dashboard)\n2. Incorrect Supabase URL\n3. Network/firewall blocking the connection\n4. CORS issues`
        };
      } else if (error.message?.includes('timeout')) {
        return {
          success: false,
          error: 'Connection timeout: Supabase is not responding. Check if your project is paused or if there are network issues.'
        };
      }
      
      return {
        success: false,
        error: `Connection failed: ${error.message || 'Unknown error'}\nError code: ${error.code || 'N/A'}`
      };
    }
    
    console.log('Connection test successful');
    return { success: true };
  } catch (err: any) {
    console.error('Connection test error:', err);
    
    // Handle timeout errors specifically
    if (err?.message?.includes('timeout')) {
      return {
        success: false,
        error: err.message || 'Connection timeout: Supabase is not responding. Please check if your project is paused or if there are network issues.'
      };
    }
    
    return {
      success: false,
      error: `Connection error: ${err?.message || 'Unknown error'}\n\nThis usually means:\n1. Supabase project is paused (check Dashboard)\n2. Network connectivity issues\n3. Incorrect Supabase URL or API key\n4. Firewall or CORS blocking the connection`
    };
  }
};

// Product operations - with fallback to direct fetch
export const getAllProducts = async (): Promise<Plan[]> => {
  console.log('getAllProducts: Starting query...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Try Supabase client first, with timeout fallback to direct fetch
  try {
    // Set up a promise race to detect timeouts
    const clientPromise = supabase
      .from('products')
      .select('*')
      .order('is_popular', { ascending: false })
      .order('price', { ascending: true });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT')), 6000); // 6 second timeout
    });
    
    const { data, error } = await Promise.race([
      clientPromise,
      timeoutPromise
    ]) as { data: any; error: any };

    if (error) {
      if (error.message === 'TIMEOUT') {
        throw new Error('TIMEOUT'); // Trigger fallback
      }
      console.error('getAllProducts: Supabase error:', error);
      throw error; // Will try fallback below
    }

    if (!data) {
      console.warn('getAllProducts: No data returned from query');
      return [];
    }

    console.log('getAllProducts: Successfully fetched', data.length, 'products using Supabase client');
    return data.map(mapDbProductToPlan);
  } catch (clientError: any) {
    // Fallback to direct fetch if client times out or fails
    if (clientError.message === 'TIMEOUT' || clientError.message?.includes('timeout') || !supabaseUrl || !supabaseAnonKey) {
      console.warn('getAllProducts: Supabase client timed out, trying direct fetch fallback...');
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables.');
      }
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*&order=is_popular.desc,price.asc`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
        }
        
        const data = await response.json();
        console.log('getAllProducts: Successfully fetched', data.length, 'products using direct fetch fallback');
        return data.map(mapDbProductToPlan);
      } catch (fetchError: any) {
        console.error('getAllProducts: Direct fetch also failed:', fetchError);
        throw new Error(`Failed to fetch products: ${fetchError.message || clientError.message || 'Unknown error'}`);
      }
    } else {
      // Re-throw non-timeout errors
      throw clientError;
    }
  }
};

export const getProductById = async (productId: string): Promise<Plan | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) return null;
  return mapDbProductToPlan(data);
};

// Order operations
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return Promise.all(data.map(mapDbOrderToOrder));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return Promise.all(data.map(mapDbOrderToOrder));
};

export const createOrder = async (
  userId: string,
  plan: Plan,
  imei?: string,
  deviceModel?: string
): Promise<Order | null> => {
  const orderId = `ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      user_id: userId,
      plan_id: plan.id,
      plan_data: plan as any,
      status: 'pending',
      total_amount: plan.price,
      imei: imei || null,
      device_model: deviceModel || null
    })
    .select()
    .single();

  if (error || !data) return null;
  return mapDbOrderToOrder(data);
};

export const updateOrderStatus = async (
  orderId: string,
  status: 'active' | 'expired' | 'pending',
  qrCodeUrl?: string
): Promise<Order | null> => {
  const updateData: any = { status };
  if (qrCodeUrl) updateData.qr_code_url = qrCodeUrl;

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error || !data) return null;
  return mapDbOrderToOrder(data);
};

// API Key operations
export const getUserApiKeys = async (userId: string): Promise<DropshipApiKey[]> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(k => ({
    id: k.id,
    name: k.name,
    key: k.key,
    createdAt: k.created_at.split('T')[0],
    lastUsed: k.last_used ? k.last_used.split('T')[0] : undefined
  }));
};

export const createApiKey = async (userId: string, name: string): Promise<DropshipApiKey | null> => {
  const key = `alo_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`;
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name,
      key
    })
    .select()
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    key: data.key,
    createdAt: data.created_at.split('T')[0]
  };
};

export const deleteApiKey = async (keyId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId);

  return !error;
};

// Admin config operations
export const getAdminConfig = async (): Promise<AdminConfig | null> => {
  const { data, error } = await supabase
    .from('admin_config')
    .select('config_data')
    .eq('id', 'main')
    .single();

  if (error || !data) return null;
  return data.config_data as AdminConfig;
};

export const updateAdminConfig = async (config: AdminConfig): Promise<boolean> => {
  const { error } = await supabase
    .from('admin_config')
    .update({ config_data: config as any })
    .eq('id', 'main');

  return !error;
};

