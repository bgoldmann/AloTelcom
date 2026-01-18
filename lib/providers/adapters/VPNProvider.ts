/**
 * VPN Provider Adapter
 * Generic VPN service provider for VPN marketplace
 * Phase 1: Foundation
 * 
 * Supports multiple VPN providers with API access:
 * - hide.me (https://hide.me/en/reseller)
 * - ResellVPN (https://resellvpn.com/)
 * - FortisVPN (https://fortisvpn.com/reseller-program/)
 * - PureVPN (https://www.purevpn.com/vpn-reseller)
 * - WorldVPN (https://worldvpn.net/become-a-vpn-reseller)
 * 
 * Note: Configure provider type via VITE_VPN_PROVIDER environment variable
 */

import { BaseProvider } from './BaseProvider';
import type {
  ProviderConfig,
  HealthStatus,
} from '../types';

// VPN-specific types
export type VPNProviderType = 'hideme' | 'resellvpn' | 'fortisvpn' | 'purevpn' | 'worldvpn' | 'generic';

export interface VPNOrder {
  planId: string;
  planType: 'basic' | 'pro' | 'premium';
  validity: string; // e.g., "1 Month", "1 Year"
  devices: number; // Number of simultaneous devices
  customerEmail: string;
  customerName?: string;
}

export interface VPNOrderResult {
  success: boolean;
  orderId?: string;
  providerOrderId?: string;
  accountId?: string;
  username?: string;
  password?: string;
  configUrl?: string; // URL to download VPN config
  activationLink?: string; // Link to activate account
  error?: string;
  provider: 'vpn';
}

export interface VPNAccountStatus {
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  expiryDate?: Date;
  devicesUsed?: number;
  dataUsed?: number;
}

export class VPNProvider extends BaseProvider {
  name = 'vpn' as const;
  type = 'vpn' as const;
  tier = 1 as const; // VPN is a standalone service

  private vpnProviderType: VPNProviderType = 'generic';
  private readonly defaultBaseUrl = 'https://api.vpn-provider.com/v1'; // Configure per provider (hide.me, ResellVPN, etc.)

  /**
   * Validate VPN provider specific configuration
   */
  protected async validateConfig(): Promise<void> {
    await super.validateConfig();
    
    if (!this.config.apiKey) {
      throw new Error('VPN provider API key is required');
    }

    // Determine provider type from config
    this.vpnProviderType = (this.config.providerType as VPNProviderType) || 'generic';
  }

  /**
   * Get authentication headers for VPN API
   * Different providers may use different auth methods
   */
  protected getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Provider-specific authentication
    switch (this.vpnProviderType) {
      case 'hideme':
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        break;
      case 'resellvpn':
        headers['X-API-Key'] = this.config.apiKey || '';
        if (this.config.apiSecret) {
          headers['X-API-Secret'] = this.config.apiSecret;
        }
        break;
      case 'fortisvpn':
        headers['Authorization'] = `Basic ${btoa(`${this.config.apiKey}:${this.config.apiSecret || ''}`)}`;
        break;
      default:
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  /**
   * Get health status by testing API connectivity
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = Date.now();

    if (!this.initialized) {
      return {
        available: false,
        responseTime: 0,
        lastCheck: new Date(),
        error: 'Provider not initialized',
      };
    }

    try {
      // Test API with a lightweight endpoint (account status or server list)
      const response = await this.apiRequest<{ success?: boolean; status?: string }>(
        `${this.getBaseUrl()}/status` || `${this.getBaseUrl()}/servers`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        },
        1 // Only 1 retry for health check
      ).catch(() => null);

      const responseTime = Date.now() - startTime;

      return {
        available: response !== null && this.initialized,
        responseTime,
        lastCheck: new Date(),
      };
    } catch (error: any) {
      return {
        available: false,
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        error: error.message || 'Health check failed',
      };
    }
  }

  /**
   * Create VPN account/order
   * Creates a new VPN account for the customer
   */
  async createVPNAccount(order: VPNOrder): Promise<VPNOrderResult> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    try {
      // TODO: Update based on actual VPN provider API documentation
      // Different providers may have different endpoints and request formats
      const response = await this.apiRequest<{
        accountId?: string;
        orderId?: string;
        username?: string;
        password?: string;
        configUrl?: string;
        activationLink?: string;
        downloadUrl?: string;
        status?: string;
        success?: boolean;
        error?: string;
        message?: string;
      }>(
        `${this.getBaseUrl()}/accounts` || `${this.getBaseUrl()}/create`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            // Map order fields to VPN provider API format
            plan: order.planType,
            plan_id: order.planId,
            validity: order.validity,
            validity_days: this.extractDays(order.validity),
            devices: order.devices,
            customer_email: order.customerEmail,
            customer_name: order.customerName,
            // Additional provider-specific fields
          }),
        }
      );

      // Handle different possible response formats
      const providerOrderId = response.orderId || response.accountId || `VPN-${Date.now()}`;
      const accountId = response.accountId || response.orderId;
      const username = response.username;
      const configUrl = response.configUrl || response.downloadUrl;
      const activationLink = response.activationLink;

      if (!accountId && !username) {
        return {
          success: false,
          error: response.error || response.message || 'No account ID or username received',
          provider: this.name,
        };
      }

      return {
        success: true,
        providerOrderId,
        orderId: providerOrderId,
        accountId: accountId || undefined,
        username: response.username || undefined,
        password: response.password || undefined,
        configUrl: configUrl || undefined,
        activationLink: activationLink || undefined,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to create VPN account', error);
      return {
        success: false,
        error: error.message || 'Failed to create VPN account',
        provider: this.name,
      };
    }
  }

  /**
   * Get VPN account status
   */
  async getAccountStatus(accountId: string): Promise<VPNAccountStatus | null> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // API credentials are configured - verify endpoint matches VPN provider API documentation
      const response = await this.apiRequest<{
        status?: string;
        expiry_date?: string;
        expiryDate?: string;
        devices_used?: number;
        data_used?: number;
      }>(
        `${this.getBaseUrl()}/accounts/${accountId}/status`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      const statusMap: Record<string, 'active' | 'expired' | 'suspended' | 'cancelled'> = {
        'active': 'active',
        'expired': 'expired',
        'expire': 'expired',
        'suspended': 'suspended',
        'canceled': 'cancelled',
        'cancelled': 'cancelled',
      };

      return {
        status: statusMap[response.status?.toLowerCase() || 'active'] || 'active',
        expiryDate: response.expiry_date || response.expiryDate ? new Date(response.expiry_date || response.expiryDate!) : undefined,
        devicesUsed: response.devices_used,
        dataUsed: response.data_used,
      };
    } catch (error: any) {
      console.error(`Failed to get VPN account status`, error);
      return null;
    }
  }

  /**
   * Suspend VPN account
   */
  async suspendAccount(accountId: string): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // API credentials are configured - verify endpoint matches VPN provider API documentation
      await this.apiRequest<{ success?: boolean }>(
        `${this.getBaseUrl()}/accounts/${accountId}/suspend`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );
      return true;
    } catch (error: any) {
      console.error(`Failed to suspend VPN account`, error);
      return false;
    }
  }

  /**
   * Reactivate VPN account
   */
  async reactivateAccount(accountId: string): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // API credentials are configured - verify endpoint matches VPN provider API documentation
      await this.apiRequest<{ success?: boolean }>(
        `${this.getBaseUrl()}/accounts/${accountId}/reactivate`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );
      return true;
    } catch (error: any) {
      console.error(`Failed to reactivate VPN account`, error);
      return false;
    }
  }

  /**
   * List available server locations
   */
  async listServerLocations(): Promise<string[]> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // API credentials are configured - verify endpoint matches VPN provider API documentation
      const response = await this.apiRequest<{
        servers?: Array<{ location: string; country: string }>;
        locations?: string[];
        countries?: string[];
      }>(
        `${this.getBaseUrl()}/servers`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      // Handle different response formats
      if (response.locations && Array.isArray(response.locations)) {
        return response.locations;
      }
      if (response.countries && Array.isArray(response.countries)) {
        return response.countries;
      }
      if (response.servers && Array.isArray(response.servers)) {
        return response.servers.map((s: any) => s.location || s.country);
      }

      // Fallback: Return common locations
      return ['United States', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Switzerland', 'Singapore', 'Japan'];
    } catch (error: any) {
      console.error('Failed to list VPN server locations', error);
      return ['United States', 'United Kingdom', 'Germany', 'France', 'Netherlands'];
    }
  }

  /**
   * Extract number of days from validity string (e.g., "1 Month" -> 30, "1 Year" -> 365)
   */
  private extractDays(validity: string): number {
    const lower = validity.toLowerCase();
    if (lower.includes('year')) {
      const match = validity.match(/(\d+)/);
      return (match ? parseInt(match[1], 10) : 1) * 365;
    }
    if (lower.includes('month')) {
      const match = validity.match(/(\d+)/);
      return (match ? parseInt(match[1], 10) : 1) * 30;
    }
    if (lower.includes('week')) {
      const match = validity.match(/(\d+)/);
      return (match ? parseInt(match[1], 10) : 1) * 7;
    }
    const match = validity.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 30; // Default to 30 days
  }

  protected getBaseUrl(): string {
    // Provider-specific base URLs
    const providerUrls: Record<VPNProviderType, string> = {
      hideme: 'https://api.hide.me/v1',
      resellvpn: 'https://api.resellvpn.com/v1',
      fortisvpn: 'https://api.fortisvpn.com/v1',
      purevpn: 'https://api.purevpn.com/v1',
      worldvpn: 'https://api.worldvpn.net/v1',
      generic: this.config.baseUrl || 'https://api.vpn-provider.com/v1',
    };

    return this.config.baseUrl || providerUrls[this.vpnProviderType] || this.defaultBaseUrl;
  }
}

