import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plan, User, Order, AdminConfig, DropshipApiKey } from './types';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  cart: Plan | null;
  addToCart: (plan: Plan) => void;
  removeFromCart: () => void;
  orders: Order[]; // Current user's orders
  addOrder: (plan: Plan) => void;
  adminConfig: AdminConfig;
  updateAdminConfig: (newConfig: AdminConfig) => void;
  // Admin Features
  users: User[];
  allOrders: Order[]; // Global orders for admin
  updateUserStatus: (userId: string, status: User['status']) => void;
  deleteUser: (userId: string) => void;
  // Theme
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  // Profile & API Keys
  updateUserProfile: (data: Partial<User>) => void;
  generateApiKey: (name: string) => void;
  deleteApiKey: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- MOCK DATA INITIALIZATION ---

  const initialUsers: User[] = [
    { 
      id: 'usr_1',
      name: 'Admin User', 
      email: 'admin@alotelcom.com',
      isAdmin: true,
      role: 'admin',
      status: 'active',
      joinedDate: '2023-01-15',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      company: 'AloTelcom HQ',
      apiKeys: []
    },
    { 
      id: 'usr_2',
      name: 'Sarah Jenkins', 
      email: 'sarah.j@example.com',
      isAdmin: false,
      role: 'customer',
      status: 'active',
      joinedDate: '2023-06-22',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      phone: '+1 (555) 123-4567',
      apiKeys: []
    },
    { 
      id: 'usr_3',
      name: 'Michael Chen', 
      email: 'm.chen@example.com',
      isAdmin: false,
      role: 'customer',
      status: 'active',
      joinedDate: '2023-08-10',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      apiKeys: []
    },
    { 
      id: 'usr_4',
      name: 'Emma Wilson', 
      email: 'emma.w@example.com',
      isAdmin: false,
      role: 'customer',
      status: 'suspended',
      joinedDate: '2023-09-05',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      apiKeys: []
    },
    { 
      id: 'usr_5',
      name: 'David Miller', 
      email: 'david.m@example.com',
      isAdmin: false,
      role: 'customer',
      status: 'active',
      joinedDate: '2023-11-30',
      avatar: 'https://i.pravatar.cc/150?u=david',
      apiKeys: []
    }
  ];

  const initialGlobalOrders: Order[] = [
    {
      id: 'ORD-12345',
      plan: { id: 'tr-3gb', type: 'esim', country: 'Turkey', region: 'Middle East', data: '3GB', validity: '30 Days', price: 12.00, flag: '🇹🇷' },
      date: '2023-10-15',
      status: 'active',
      qrCodeUrl: '',
      customerEmail: 'admin@alotelcom.com',
      customerName: 'Admin User'
    },
    {
      id: 'ORD-89231',
      plan: { id: 'jp-10gb', type: 'esim', country: 'Japan', region: 'Asia', data: '10GB', validity: '30 Days', price: 18.00, flag: '🇯🇵' },
      date: '2023-11-20',
      status: 'expired',
      qrCodeUrl: '',
      customerEmail: 'sarah.j@example.com',
      customerName: 'Sarah Jenkins'
    },
    {
      id: 'ORD-55102',
      plan: { id: 'vpn-pro', type: 'vpn', country: 'Global Servers', region: 'Global', data: 'High Speed', validity: '1 Month', price: 7.99, flag: '🛡️' },
      date: '2023-12-01',
      status: 'active',
      qrCodeUrl: '',
      customerEmail: 'm.chen@example.com',
      customerName: 'Michael Chen'
    },
    {
      id: 'ORD-67299',
      plan: { id: 'num-us', type: 'number', country: 'United States', region: 'Americas', data: '+1 (Voice/SMS)', validity: '30 Days', price: 5.00, flag: '🇺🇸' },
      date: '2023-12-05',
      status: 'active',
      qrCodeUrl: '',
      customerEmail: 'david.m@example.com',
      customerName: 'David Miller'
    }
  ];

  // --- STATE ---

  const [user, setUser] = useState<User | null>(initialUsers[0]); // Default login as admin
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [cart, setCart] = useState<Plan | null>(null);
  const [orders, setOrders] = useState<Order[]>(initialGlobalOrders.filter(o => o.customerEmail === initialUsers[0].email)); // User's personal orders
  const [allOrders, setAllOrders] = useState<Order[]>(initialGlobalOrders); // Admin view of all orders
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Default Admin Configuration
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
      primaryColor: '#1C1917', // Stone 900
      ctaColor: '#EA580C',     // Orange 600
      accentColor: '#F97316'   // Orange 500
    }
  });

  // --- ACTIONS ---

  const toggleTheme = () => {
    setThemeMode(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const login = (email: string) => {
    // Simple mock login logic - tries to find user in list, or creates temporary one
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setUser(existingUser);
      setOrders(allOrders.filter(o => o.customerEmail === email));
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        isAdmin: false,
        role: 'customer',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        apiKeys: []
      };
      setUser(newUser);
      setOrders([]);
      // Optionally add to users list in a real app
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (plan: Plan) => {
    setCart(plan);
  };

  const removeFromCart = () => {
    setCart(null);
  };

  const addOrder = (plan: Plan) => {
    if (!user) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      plan,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      qrCodeUrl: 'https://picsum.photos/200/200',
      customerEmail: user.email,
      customerName: user.name
    };
    
    setOrders((prev) => [newOrder, ...prev]); // Update local user orders
    setAllOrders((prev) => [newOrder, ...prev]); // Update admin global orders
    setCart(null);
  };

  const updateAdminConfig = (newConfig: AdminConfig) => {
    setAdminConfig(newConfig);
    console.log("Admin Config Updated:", newConfig);
  };

  // Admin Actions
  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Profile Actions
  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    // Update in users array as well
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const generateApiKey = (name: string) => {
    if (!user) return;
    const newKey: DropshipApiKey = {
      id: `key_${Date.now()}`,
      name,
      key: `alo_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedUser = { 
      ...user, 
      apiKeys: [...(user.apiKeys || []), newKey] 
    };
    
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const deleteApiKey = (id: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      apiKeys: user.apiKeys?.filter(k => k.id !== id) || []
    };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, 
      cart, addToCart, removeFromCart, 
      orders, addOrder, 
      adminConfig, updateAdminConfig,
      users, allOrders, updateUserStatus, deleteUser,
      themeMode, toggleTheme,
      updateUserProfile, generateApiKey, deleteApiKey
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