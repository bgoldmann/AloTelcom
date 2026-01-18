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
  VerifyRequest,
  VerifyResult,
  VerifyCheck,
  VerifyCheckResult,
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
   * Send SMS message via Telnyx Messaging API
   * Reference: https://developers.telnyx.com/docs/api/v2/messaging
   * 
   * Endpoint: POST /v2/messages
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
      // API credentials are configured - using actual Telnyx Messaging API
      const response = await this.apiRequest<{
        data?: {
          id: string;
          to: Array<{ phone_number: string }>;
          from: { phone_number: string };
          text: string;
          direction: string;
          status: string;
        };
        errors?: Array<{ title: string; detail: string }>;
      }>(
        `${this.getBaseUrl()}/messages`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            to: message.to,
            from: message.from,
            text: message.message,
            // Optional: messaging_profile_id for specific messaging profile
          }),
        }
      );

      if (response.errors && response.errors.length > 0) {
        return {
          success: false,
          error: response.errors[0].detail || response.errors[0].title || 'Failed to send SMS',
          provider: this.name,
        };
      }

      const messageId = response.data?.id || `telnyx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        messageId,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to send SMS via Telnyx', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS via Telnyx API',
        provider: this.name,
      };
    }
  }

  /**
   * Send MMS message via Telnyx Messaging API
   * Reference: https://developers.telnyx.com/docs/api/v2/messaging
   * https://support.telnyx.com/en/articles/3102823-mms-sending-and-receiving
   * 
   * Endpoint: POST /v2/messages (same as SMS, but with media_urls)
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
      // API credentials are configured - using actual Telnyx Messaging API
      const response = await this.apiRequest<{
        data?: {
          id: string;
          to: Array<{ phone_number: string }>;
          from: { phone_number: string };
          text: string;
          media_urls?: string[];
          direction: string;
          status: string;
        };
        errors?: Array<{ title: string; detail: string }>;
      }>(
        `${this.getBaseUrl()}/messages`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            to: message.to,
            from: message.from,
            text: message.message,
            media_urls: message.mediaUrls,
            // Optional: messaging_profile_id for specific messaging profile
          }),
        }
      );

      if (response.errors && response.errors.length > 0) {
        return {
          success: false,
          error: response.errors[0].detail || response.errors[0].title || 'Failed to send MMS',
          provider: this.name,
        };
      }

      const messageId = response.data?.id || `telnyx-mms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        messageId,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to send MMS via Telnyx', error);
      return {
        success: false,
        error: error.message || 'Failed to send MMS via Telnyx API',
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
      // TODO: Implement actual Telnyx Phone Numbers API call
      // API credentials are configured - implement using:
      // 1. POST /v2/available_phone_numbers to search
      // 2. POST /v2/phone_numbers to purchase
      // 3. PATCH /v2/phone_numbers/{id} to configure features
      // Reference: https://developers.telnyx.com/docs/api/v2/telephony
      
      // Temporary: Return error until implementation is complete
      throw new Error('Phone number creation not yet implemented. Please implement using Telnyx Phone Numbers API.');
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
      // TODO: Implement actual Telnyx Phone Numbers API call
      // API credentials are configured - implement using:
      // GET /v2/available_phone_numbers?filter[country_code]={countryCode}
      // Reference: https://developers.telnyx.com/docs/api/v2/telephony
      
      // Temporary: Return empty array until implementation is complete
      console.warn('listAvailableNumbers not yet implemented - returning empty array');
      return [];
    } catch (error: any) {
      console.error(`Failed to list available numbers for ${countryCode}`, error);
      return [];
    }
  }

  protected getBaseUrl(): string {
    return this.config.baseUrl || this.defaultBaseUrl;
  }

  /**
   * Send 2FA verification code via Telnyx Verify API
   * Reference: https://developers.telnyx.com/docs/identity/verify/quickstart
   * 
   * Endpoint: POST /v2/verifications/sms or /v2/verifications/voice
   */
  async sendVerificationCode(request: VerifyRequest): Promise<VerifyResult> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    try {
      // Determine channel endpoint
      const channel = request.channel || 'sms';
      const endpoint = channel === 'voice' 
        ? `${this.getBaseUrl()}/verifications/voice`
        : `${this.getBaseUrl()}/verifications/sms`;

      // API credentials are configured - using actual Telnyx Messaging API
      const response = await this.apiRequest<{
        data?: {
          id: string;
          phone_number: string;
          verify_profile_id: string;
          status: string;
          expires_at: string;
          code_length?: number;
        };
        errors?: Array<{ title: string; detail: string }>;
      }>(
        endpoint,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            phone_number: request.phoneNumber,
            verify_profile_id: request.verifyProfileId || this.config.verifyProfileId,
            timeout_secs: request.timeout || 300, // Default 5 minutes
            ...(request.codeLength && { code_length: request.codeLength }),
          }),
        }
      );

      if (response.errors && response.errors.length > 0) {
        return {
          success: false,
          error: response.errors[0].detail || response.errors[0].title || 'Failed to send verification code',
          provider: this.name,
        };
      }

      const verificationId = response.data?.id || `verify-${Date.now()}`;
      const expiresAt = response.data?.expires_at ? new Date(response.data.expires_at) : undefined;

      return {
        success: true,
        verificationId,
        expiresAt,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to send verification code via Telnyx', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification code via Telnyx Verify API',
        provider: this.name,
      };
    }
  }

  /**
   * Verify 2FA code via Telnyx Verify API
   * Reference: https://developers.telnyx.com/docs/identity/verify/quickstart
   * 
   * Endpoint: POST /v2/verifications/by_phone_number/{phone_number}/actions/verify
   */
  async verifyCode(check: VerifyCheck): Promise<VerifyCheckResult> {
    if (!this.initialized) {
      return {
        success: false,
        verified: false,
        error: 'Provider not initialized',
        provider: this.name,
      };
    }

    try {
      // API credentials are configured - using actual Telnyx Messaging API
      const response = await this.apiRequest<{
        data?: {
          phone_number: string;
          verified: boolean;
          response_code: string;
          status: string;
        };
        errors?: Array<{ title: string; detail: string }>;
      }>(
        `${this.getBaseUrl()}/verifications/by_phone_number/${encodeURIComponent(check.phoneNumber)}/actions/verify`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            code: check.code,
            verify_profile_id: check.verifyProfileId || this.config.verifyProfileId,
          }),
        }
      );

      if (response.errors && response.errors.length > 0) {
        return {
          success: false,
          verified: false,
          error: response.errors[0].detail || response.errors[0].title || 'Verification failed',
          provider: this.name,
        };
      }

      const verified = response.data?.verified === true || response.data?.status === 'accepted';

      return {
        success: true,
        verified,
        provider: this.name,
      };
    } catch (error: any) {
      console.error('Failed to verify code via Telnyx', error);
      return {
        success: false,
        verified: false,
        error: error.message || 'Failed to verify code via Telnyx Verify API',
        provider: this.name,
      };
    }
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}

