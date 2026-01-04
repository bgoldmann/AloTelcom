/**
 * Airalo Provider Adapter
 * Tier 2 Backup eSIM Provider / Alternative Option
 * Phase 1: Foundation
 * 
 * API Documentation: https://developers.partners.airalo.com/
 * Partner API Program: https://www.airalo.com/partner-with-us/api-partners
 * - Partner API for eSIM packages
 * - Authentication via API key
 * - 200+ countries and regions coverage
 * - SDK support (Python, PHP)
 * - eSIM Cloud sharing links
 */

import { BaseProvider } from './BaseProvider';
import type {
  ProviderConfig,
  HealthStatus,
  CountryCoverage,
  eSIMOrder,
  eSIMOrderResult,
  OrderStatus,
} from '../types';

export class AiraloProvider extends BaseProvider {
  name = 'airalo' as const;
  type = 'esim' as const;
  tier = 2 as const; // Tier 2 - Backup/Alternative provider

  // Airalo Partner API Base URL
  // Reference: https://developers.partners.airalo.com/
  private readonly defaultBaseUrl = 'https://api.partners.airalo.com/v1';

  /**
   * Validate Airalo specific configuration
   * Airalo Partner API uses API key for authentication
   * Reference: https://developers.partners.airalo.com/
   */
  protected async validateConfig(): Promise<void> {
    await super.validateConfig();
    
    if (!this.config.apiKey) {
      throw new Error('Airalo Partner API key is required. Apply at https://www.airalo.com/partner-with-us/api-partners');
    }
  }

  /**
   * Get authentication headers for Airalo Partner API
   * Reference: https://developers.partners.airalo.com/
   */
  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Version': 'v1', // Airalo API version
    };
  }

  /**
   * Get health status by testing API connectivity
   * Tests Airalo Partner API availability
   * Reference: https://developers.partners.airalo.com/
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
      // Test API with a lightweight endpoint (e.g., packages or account)
      const response = await this.apiRequest<{ success?: boolean; data?: any }>(
        `${this.getBaseUrl()}/packages`, // Adjust endpoint based on actual API
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        },
        1 // Only 1 retry for health check
      ).catch(() => null);

      const responseTime = Date.now() - startTime;

      return {
        available: response !== null,
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
   * List available countries
   * Fetches countries from Airalo Partner API
   * Reference: https://developers.partners.airalo.com/
   * 
   * Note: Airalo covers 200+ countries and regions
   */
  async listCountries(): Promise<string[]> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Update endpoint based on actual Airalo Partner API documentation
      // Example structure - adjust based on actual API response format
      const response = await this.apiRequest<{ 
        countries?: Array<{ code: string; name: string }>;
        data?: Array<{ country_code: string }>;
        packages?: Array<{ country: string }>;
      }>(
        `${this.getBaseUrl()}/packages`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      // Handle different possible response formats
      if (response.data && Array.isArray(response.data)) {
        // Extract unique country codes
        const countryCodes = new Set<string>();
        response.data.forEach((item: any) => {
          if (item.country_code) countryCodes.add(item.country_code.toUpperCase());
          if (item.country) countryCodes.add(item.country.toUpperCase());
        });
        return Array.from(countryCodes);
      }

      if (response.countries && Array.isArray(response.countries)) {
        return response.countries.map((c: any) => (c.code || c.country_code || c).toUpperCase());
      }

      if (response.packages && Array.isArray(response.packages)) {
        const countryCodes = new Set<string>();
        response.packages.forEach((pkg: any) => {
          if (pkg.country) countryCodes.add(pkg.country.toUpperCase());
        });
        return Array.from(countryCodes);
      }

      // Fallback: Return common countries if API structure differs
      console.warn('Airalo API response format differs from expected, using fallback');
      return ['US', 'GB', 'FR', 'DE', 'JP', 'AU', 'SG', 'TH', 'ES', 'IT'];
    } catch (error: any) {
      console.error('Failed to list countries from Airalo', error);
      // Return fallback countries on error to maintain functionality
      return ['US', 'GB', 'FR', 'DE', 'JP', 'AU', 'SG', 'TH', 'ES', 'IT'];
    }
  }

  /**
   * Create eSIM order via Airalo Partner API
   * Reference: https://developers.partners.airalo.com/
   * 
   * Orders eSIM packages through Airalo's Partner API
   */
  async createOrder(order: eSIMOrder): Promise<eSIMOrderResult> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    try {
      // TODO: Update based on actual Airalo Partner API documentation
      // Adjust endpoint and request body format per API spec
      const response = await this.apiRequest<{
        orderId?: string;
        id?: string;
        packageId?: string;
        qrCodeUrl?: string;
        qr_code?: string;
        qr?: string;
        activationCode?: string;
        activation_code?: string;
        esim_data?: string;
        cloud_link?: string; // Airalo Cloud sharing link
        status?: string;
        success?: boolean;
        error?: string;
        message?: string;
      }>(
        `${this.getBaseUrl()}/orders`, // Adjust endpoint per API docs
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            // Map order fields to Airalo Partner API format
            // Adjust field names based on actual API specification
            country: order.countryCode,
            country_code: order.countryCode.toUpperCase(),
            data: order.dataAmount,
            data_amount: order.dataAmount,
            validity: order.validity,
            validity_days: this.extractDays(order.validity),
            package_id: order.planId,
            customer_email: order.customerEmail,
            customer_name: order.customerName,
            imei: order.imei,
            device_model: order.deviceModel,
            // Additional Airalo-specific fields if required
          }),
        }
      );

      // Handle different possible response formats
      const providerOrderId = response.orderId || response.id || response.packageId || `AIR-${Date.now()}`;
      const qrCodeUrl = response.qrCodeUrl || response.qr_code || response.qr || response.esim_data || response.cloud_link;
      const activationCode = response.activationCode || response.activation_code;

      if (!qrCodeUrl && !activationCode) {
        return {
          success: false,
          error: response.error || response.message || 'No QR code, activation code, or cloud link received',
          provider: this.name,
        };
      }

      return {
        success: true,
        providerOrderId,
        qrCodeUrl: qrCodeUrl || undefined,
        activationCode: activationCode || undefined,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to create order with Airalo', error);
      return {
        success: false,
        error: error.message || 'Failed to create order via Airalo Partner API',
        provider: this.name,
      };
    }
  }

  /**
   * Extract number of days from validity string (e.g., "30 days" -> 30)
   */
  private extractDays(validity: string): number {
    const match = validity.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 30; // Default to 30 days
  }

  /**
   * Get order status from Airalo Partner API
   * Reference: https://developers.partners.airalo.com/
   * 
   * Airalo package statuses: pending, active, expired, cancelled, etc.
   */
  async getOrderStatus(providerOrderId: string): Promise<OrderStatus> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Update endpoint based on actual Airalo Partner API documentation
      const response = await this.apiRequest<{ 
        status?: string;
        state?: string;
        package_status?: string;
        order_status?: string;
      }>(
        `${this.getBaseUrl()}/orders/${providerOrderId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      // Map Airalo status to our OrderStatus type
      // Reference: https://airalopartners.zendesk.com/hc/en-us/articles/21067484155421-What-are-the-different-statuses-of-eSIM-packages
      const status = response.status || response.state || response.package_status || response.order_status || 'pending';
      
      // Normalize status values based on Airalo package statuses
      const statusMap: Record<string, OrderStatus> = {
        'pending': 'pending',
        'processing': 'processing',
        'active': 'active',
        'activated': 'active',
        'expired': 'expired',
        'failed': 'failed',
        'cancelled': 'cancelled',
        'canceled': 'cancelled',
        'refunded': 'cancelled',
      };

      return statusMap[status.toLowerCase()] || 'pending';
    } catch (error: any) {
      console.error(`Failed to get order status from Airalo`, error);
      // Return pending on error rather than throwing
      return 'pending';
    }
  }

  /**
   * Cancel order via Airalo Partner API
   * Reference: https://developers.partners.airalo.com/
   */
  async cancelOrder(providerOrderId: string): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Update endpoint based on actual Airalo Partner API documentation
      await this.apiRequest<{ success?: boolean }>(
        `${this.getBaseUrl()}/orders/${providerOrderId}/cancel`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );
      return true;
    } catch (error: any) {
      console.error(`Failed to cancel order with Airalo`, error);
      return false;
    }
  }

  /**
   * Get country coverage details from Airalo
   * Reference: https://developers.partners.airalo.com/
   */
  async getCountryCoverage(countryCode: string): Promise<CountryCoverage | null> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Update endpoint based on actual Airalo Partner API documentation
      const response = await this.apiRequest<{
        country_code?: string;
        active?: boolean;
        operators?: Array<{ name: string; type: string }>;
        supports_5g?: boolean;
        packages?: Array<{ data: string; validity: string }>;
        data?: CountryCoverage;
      }>(
        `${this.getBaseUrl()}/packages?country=${countryCode.toUpperCase()}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      // Handle different response formats
      if (response.data) {
        return response.data;
      }

      return {
        countryCode: response.country_code || countryCode.toUpperCase(),
        isActive: response.active !== false,
        priority: 2, // Tier 2 provider
        supports5G: response.supports_5g || false,
        operators: response.operators?.map(op => ({
          name: op.name,
          type: op.type as '5G' | '4G' | 'LTE',
        })) || [],
      };
    } catch (error: any) {
      console.error(`Failed to get coverage for ${countryCode} from Airalo`, error);
      // Return default coverage on error
      return {
        countryCode: countryCode.toUpperCase(),
        isActive: true,
        priority: 2,
        supports5G: false,
        operators: [],
      };
    }
  }

  protected getBaseUrl(): string {
    return this.config.baseUrl || this.defaultBaseUrl;
  }
}

