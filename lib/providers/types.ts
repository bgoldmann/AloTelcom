/**
 * Provider Integration Types
 * Multi-Provider Orchestration System
 * Phase 1: Foundation
 */

// Provider Types
export type ProviderName = 'redtea' | 'telnyx' | 'esimgo';
export type ProviderType = 'esim' | 'communication';
export type ProviderStatus = 'active' | 'inactive' | 'maintenance';
export type ProviderTier = 1 | 2; // 1 = primary, 2 = backup

// Order Status
export type OrderStatus = 'pending' | 'processing' | 'active' | 'failed' | 'cancelled' | 'expired';

// Provider Health Status
export interface HealthStatus {
  available: boolean;
  responseTime?: number; // milliseconds
  lastCheck: Date;
  error?: string;
}

// Provider Configuration
export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  [key: string]: any; // Allow provider-specific config
}

// Country Coverage
export interface CountryCoverage {
  countryCode: string;
  isActive: boolean;
  priority: number;
  costPerGB?: number;
  activationFee?: number;
  operators?: NetworkOperator[];
  supports5G?: boolean;
}

export interface NetworkOperator {
  name: string;
  type: '5G' | '4G' | 'LTE' | '3G';
  coverage?: string;
}

// eSIM Order Types
export interface eSIMOrder {
  countryCode: string;
  dataAmount: string; // e.g., "5GB"
  validity: string; // e.g., "30 days"
  planId: string;
  customerEmail: string;
  customerName?: string;
  imei?: string;
  deviceModel?: string;
}

export interface eSIMOrderResult {
  success: boolean;
  orderId?: string; // Our internal order ID
  providerOrderId?: string; // Provider's order ID
  qrCodeUrl?: string;
  activationCode?: string;
  error?: string;
  provider: ProviderName;
}

// Communication Service Types
export interface SMSMessage {
  to: string;
  from: string;
  message: string;
  mediaUrls?: string[]; // For MMS
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: ProviderName;
}

export interface PhoneNumberConfig {
  countryCode: string;
  features?: string[]; // e.g., ['sms', 'voice', 'mms']
  capabilities?: string[];
}

export interface PhoneNumber {
  number: string;
  countryCode: string;
  provider: ProviderName;
  features: string[];
}

// Provider Interface
export interface IProvider {
  name: ProviderName;
  type: ProviderType;
  tier: ProviderTier;
  
  // Common methods
  initialize(config: ProviderConfig): Promise<void>;
  isAvailable(): Promise<boolean>;
  getHealthStatus(): Promise<HealthStatus>;
  
  // eSIM methods (if type === 'esim')
  listCountries?(): Promise<string[]>;
  getCountryCoverage?(countryCode: string): Promise<CountryCoverage | null>;
  createOrder?(order: eSIMOrder): Promise<eSIMOrderResult>;
  getOrderStatus?(providerOrderId: string): Promise<OrderStatus>;
  cancelOrder?(providerOrderId: string): Promise<boolean>;
  
  // Communication methods (if type === 'communication')
  sendSMS?(message: SMSMessage): Promise<SMSResult>;
  sendMMS?(message: SMSMessage): Promise<SMSResult>;
  createPhoneNumber?(config: PhoneNumberConfig): Promise<PhoneNumber>;
  listAvailableNumbers?(countryCode: string): Promise<PhoneNumber[]>;
}

// Provider Selection Criteria
export interface ProviderSelectionCriteria {
  service: ProviderType;
  countryCode?: string;
  prioritizeCost?: boolean;
  prioritizePerformance?: boolean;
  requireBackup?: boolean;
}

// Provider Selection Result
export interface ProviderSelectionResult {
  provider: IProvider;
  reason: string;
  backupProvider?: IProvider;
}

// Provider Metrics
export interface ProviderMetrics {
  providerId: string;
  date: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  avgActivationTime: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  apiResponseTimeAvg: number;
  errorRate: number;
}

// Webhook Event Types
export type WebhookEventType = 
  | 'order.created'
  | 'order.activated'
  | 'order.failed'
  | 'order.cancelled'
  | 'sms.sent'
  | 'sms.failed'
  | 'number.provisioned';

export interface WebhookEvent {
  provider: ProviderName;
  eventType: WebhookEventType;
  orderId?: string;
  data: Record<string, any>;
  timestamp: Date;
}

