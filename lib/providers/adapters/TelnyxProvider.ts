/**
 * Telnyx Provider Adapter
 * Tier 1 Communication Services Provider
 * Phase 1: Foundation
 */

import { BaseProvider } from './BaseProvider';
import type {
  ProviderConfig,
  HealthStatus,
  SMSMessage,
  SMSResult,
  PhoneNumberConfig,
  PhoneNumber,
} from '../types';

export class TelnyxProvider extends BaseProvider {
  name = 'telnyx' as const;
  type = 'communication' as const;
  tier = 1 as const;

  private readonly defaultBaseUrl = 'https://api.telnyx.com/v2';

  /**
   * Validate Telnyx specific configuration
   */
  protected async validateConfig(): Promise<void> {
    await super.validateConfig();
    
    if (!this.config.apiKey) {
      throw new Error('Telnyx API key is required');
    }
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Test API connectivity with a simple request
      // Using account balance or profile endpoint
      const response = await this.apiRequest<{ data: any }>(
        `${this.getBaseUrl()}/balance`,
        {
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
        error: error.message,
      };
    }
  }

  /**
   * Send SMS message
   * TODO: Implement actual API call when credentials are available
   */
  async sendSMS(message: SMSMessage): Promise<SMSResult> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    try {
      // TODO: Replace with actual Telnyx API call
      // const response = await this.apiRequest<{
      //   data: { id: string; to: string; from: string; status: string };
      // }>(
      //   `${this.getBaseUrl()}/messages`,
      //   {
      //     method: 'POST',
      //     headers: this.getAuthHeaders(),
      //     body: JSON.stringify({
      //       to: message.to,
      //       from: message.from,
      //       text: message.message,
      //     }),
      //   }
      // );

      // Placeholder response (for testing)
      const messageId = `telnyx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        messageId,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to send SMS via Telnyx', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
        provider: this.name,
      };
    }
  }

  /**
   * Send MMS message
   */
  async sendMMS(message: SMSMessage): Promise<SMSResult> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    if (!message.mediaUrls || message.mediaUrls.length === 0) {
      return {
        success: false,
        error: 'MMS requires media URLs',
        provider: this.name,
      };
    }

    try {
      // TODO: Implement actual Telnyx MMS API call
      // Similar to SMS but with media URLs

      const messageId = `telnyx-mms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        messageId,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to send MMS via Telnyx', error);
      return {
        success: false,
        error: error.message || 'Failed to send MMS',
        provider: this.name,
      };
    }
  }

  /**
   * Create phone number
   */
  async createPhoneNumber(config: PhoneNumberConfig): Promise<PhoneNumber> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Implement actual Telnyx API call
      // 1. Search for available numbers
      // 2. Purchase number
      // 3. Configure features

      // Placeholder
      return {
        number: `+1${Math.floor(Math.random() * 10000000000)}`, // Placeholder
        countryCode: config.countryCode,
        provider: this.name,
        features: config.features || [],
      };
    } catch (error: any) {
      console.error('Failed to create phone number via Telnyx', error);
      throw error;
    }
  }

  /**
   * List available phone numbers
   */
  async listAvailableNumbers(countryCode: string): Promise<PhoneNumber[]> {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }

    try {
      // TODO: Implement actual Telnyx API call
      // const response = await this.apiRequest<{
      //   data: Array<{ phone_number: string; features: string[] }>;
      // }>(
      //   `${this.getBaseUrl()}/available_phone_numbers?filter[country_code]=${countryCode}`,
      //   { headers: this.getAuthHeaders() }
      // );
      // return response.data.map(n => ({
      //   number: n.phone_number,
      //   countryCode,
      //   provider: this.name,
      //   features: n.features,
      // }));

      // Placeholder
      return [];
    } catch (error: any) {
      console.error(`Failed to list available numbers for ${countryCode}`, error);
      return [];
    }
  }

  protected getBaseUrl(): string {
    return this.config.baseUrl || this.defaultBaseUrl;
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
}

