/**
 * Base Provider Adapter
 * Abstract base class for all provider implementations
 */

import type {
  IProvider,
  ProviderName,
  ProviderType,
  ProviderTier,
  ProviderConfig,
  HealthStatus,
} from '../types';

export abstract class BaseProvider implements IProvider {
  abstract name: ProviderName;
  abstract type: ProviderType;
  abstract tier: ProviderTier;

  protected config: ProviderConfig = {};
  public initialized: boolean = false;
  private healthStatus: HealthStatus = {
    available: false,
    lastCheck: new Date(),
  };

  /**
   * Initialize provider with configuration
   */
  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;
    this.initialized = true;
    await this.validateConfig();
  }

  /**
   * Validate provider configuration
   * Override in subclasses for provider-specific validation
   */
  protected async validateConfig(): Promise<void> {
    // Base validation - can be overridden
    if (!this.config.apiKey && this.config.apiKey !== '') {
      throw new Error(`API key required for ${this.name}`);
    }
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.initialized) {
      return false;
    }

    const health = await this.getHealthStatus();
    return health.available;
  }

  /**
   * Get health status
   * Override in subclasses for provider-specific health checks
   */
  async getHealthStatus(): Promise<HealthStatus> {
    // Default implementation - check initialization
    this.healthStatus = {
      available: this.initialized,
      lastCheck: new Date(),
    };

    return this.healthStatus;
  }

  /**
   * Make API request with retry logic
   */
  protected async apiRequest<T>(
    url: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<T> {
    const timeout = this.config.timeout || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && retries > 0) {
          // Retry on server errors
          await this.delay(1000 * (4 - retries)); // Exponential backoff
          return this.apiRequest<T>(url, options, retries - 1);
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      if (retries > 0 && !error.message?.includes('4')) {
        // Retry on network errors (but not 4xx client errors)
        await this.delay(1000 * (4 - retries));
        return this.apiRequest<T>(url, options, retries - 1);
      }

      throw error;
    }
  }

  /**
   * Delay helper
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get configured API base URL
   */
  protected getBaseUrl(): string {
    return this.config.baseUrl || '';
  }

  /**
   * Get API authentication headers
   * Override in subclasses for provider-specific auth
   */
  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
}

