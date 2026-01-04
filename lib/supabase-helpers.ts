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

// Product operations
export const getAllProducts = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('is_popular', { ascending: false })
    .order('price', { ascending: true });

  if (error || !data) return [];
  return data.map(mapDbProductToPlan);
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

