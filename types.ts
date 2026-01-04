export interface DropshipApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NetworkOperator {
  name: string;
  type: '4G' | '5G' | 'LTE';
}

export interface Plan {
  id: string;
  type: 'esim' | 'number' | 'vpn' | 'voip' | 'sms' | 'mms' | '2fa';
  country: string;
  region: string;
  data: string; // Usage allowance (GB, Minutes, Messages, Verifications, or "Unlimited")
  validity: string;
  price: number;
  flag: string;
  isPopular?: boolean;
  features?: string[]; // Optional list of features for VPN/VOIP/SMS/MMS/2FA
  // New detailed fields
  description?: string;
  operators?: NetworkOperator[];
  coveredCountries?: string[];
  reviews?: Review[];
  // Service-specific fields
  phoneNumber?: string; // For SMS/MMS/2FA: destination phone number
  fromNumber?: string; // For SMS/MMS: sender phone number
  channel?: 'sms' | 'voice' | 'flash_call'; // For 2FA: verification channel
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean; // Kept for backward compatibility, mapped to role
  role: 'admin' | 'customer' | 'support';
  status: 'active' | 'suspended';
  joinedDate: string;
  avatar?: string;
  // Profile fields
  phone?: string;
  company?: string;
  address?: string;
  apiKeys?: DropshipApiKey[];
}

export interface Order {
  id: string;
  plan: Plan;
  date: string;
  status: 'active' | 'expired' | 'pending';
  qrCodeUrl: string;
  // Admin fields
  customerEmail?: string;
  customerName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AdminConfig {
  general: {
    siteName: string;
    supportEmail: string;
  };
  apiKeys: {
    airaloClientId: string;
    airaloClientSecret: string;
    stripePublicKey: string;
    stripeSecretKey: string;
    googleAdsId: string;
    googleAnalyticsId: string;
    vpnApiKey: string;
    voiceApiKey: string;
    numberApiKey: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  theme: {
    primaryColor: string;
    ctaColor: string;
    accentColor: string;
  };
}