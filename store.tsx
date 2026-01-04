import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plan, User, Order, AdminConfig, DropshipApiKey } from './types';
import { supabase } from './lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import {
  getUserById,
  getAllUsers,
  updateUserProfile as updateUserProfileDb,
  getUserOrders,
  getAllOrders,
  createOrder as createOrderDb,
  getUserApiKeys,
  createApiKey as createApiKeyDb,
  deleteApiKey as deleteApiKeyDb,
  getAdminConfig,
  updateAdminConfig as updateAdminConfigDb
} from './lib/supabase-helpers';

interface AppContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  cart: Plan | null;
  addToCart: (plan: Plan) => void;
  removeFromCart: () => void;
  orders: Order[];
  addOrder: (plan: Plan, imei?: string, deviceModel?: string) => Promise<void>;
  adminConfig: AdminConfig;
  updateAdminConfig: (newConfig: AdminConfig) => Promise<void>;
  // Admin Features
  users: User[];
  allOrders: Order[];
  updateUserStatus: (userId: string, status: User['status']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  // Theme
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  // Profile & API Keys
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  generateApiKey: (name: string) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [cart, setCart] = useState<Plan | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    general: {
      siteName: 'AloTelcom',
      supportEmail: 'support@alotelcom.com'
    },
    apiKeys: {
      airaloClientId: '',
      airaloClientSecret: '',
      stripePublicKey: '',
      stripeSecretKey: '',
      googleAdsId: '',
      googleAnalyticsId: '',
      vpnApiKey: '',
      voiceApiKey: '',
      numberApiKey: ''
    },
    seo: {
      metaTitle: 'AloTelcom - Global eSIM Marketplace',
      metaDescription: 'Instant connectivity for travelers worldwide. No roaming fees.',
      keywords: 'esim, travel, data, internet, roaming'
    },
    theme: {
      primaryColor: '#1C1917',
      ctaColor: '#EA580C',
      accentColor: '#F97316'
    }
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [loading, setLoading] = useState(true);

  // Initialize session and load data
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setUser(null);
        setOrders([]);
        setLoading(false);
      }
    });

    // Load admin config
    loadAdminConfig();

    return () => subscription.unsubscribe();
  }, []);

  // Load admin data if user is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [allUsersData, allOrdersData] = await Promise.all([
        getAllUsers(),
        getAllOrders()
      ]);
      setUsers(allUsersData);
      setAllOrders(allOrdersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadAdminConfig = async () => {
    try {
      const config = await getAdminConfig();
      if (config) {
        setAdminConfig(config);
      }
    } catch (error) {
      console.error('Error loading admin config:', error);
    }
  };

  const refreshData = async () => {
    if (user) {
      await loadUserData(user.id);
      if (user.role === 'admin') {
        await loadAdminData();
      }
    }
  };

  const toggleTheme = () => {
    setThemeMode(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (data.user) {
      await loadUserData(data.user.id);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;
    if (data.user) {
      await loadUserData(data.user.id);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setOrders([]);
    setCart(null);
  };

  const addToCart = (plan: Plan) => {
    setCart(plan);
  };

  const removeFromCart = () => {
    setCart(null);
  };

  const addOrder = async (plan: Plan, imei?: string, deviceModel?: string) => {
    if (!user) return;
    
    try {
      const newOrder = await createOrderDb(user.id, plan, imei, deviceModel);
      if (newOrder) {
        setOrders(prev => [newOrder, ...prev]);
        if (user.role === 'admin') {
          setAllOrders(prev => [newOrder, ...prev]);
        }
        setCart(null);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateAdminConfig = async (newConfig: AdminConfig) => {
    try {
      const success = await updateAdminConfigDb(newConfig);
      if (success) {
        setAdminConfig(newConfig);
      }
    } catch (error) {
      console.error('Error updating admin config:', error);
      throw error;
    }
  };

  const updateUserStatus = async (userId: string, status: User['status']) => {
    try {
      const updated = await updateUserProfileDb(userId, { status });
      if (updated) {
        setUsers(prev => prev.map(u => u.id === userId ? updated : u));
        if (user?.id === userId) {
          setUser(updated);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Note: Full user deletion requires server-side admin function
      // For now, we suspend the user (can be fully deleted via Supabase dashboard)
      const updated = await updateUserProfileDb(userId, { status: 'suspended' });
      if (updated) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updated = await updateUserProfileDb(user.id, data);
      if (updated) {
        setUser(updated);
        setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const generateApiKey = async (name: string) => {
    if (!user) return;
    
    try {
      const newKey = await createApiKeyDb(user.id, name);
      if (newKey) {
        await refreshData(); // Reload user to get updated API keys
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const success = await deleteApiKeyDb(id);
      if (success) {
        await refreshData(); // Reload user to get updated API keys
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, session, login, signup, logout, 
      cart, addToCart, removeFromCart, 
      orders, addOrder, 
      adminConfig, updateAdminConfig,
      users, allOrders, updateUserStatus, deleteUser,
      themeMode, toggleTheme,
      updateUserProfile, generateApiKey, deleteApiKey,
      loading, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
