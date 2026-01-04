/**
 * Provider Manager Service
 * Orchestrates multi-provider selection, routing, and failover
 * Phase 1: Foundation
 */

import type {
  IProvider,
  ProviderName,
  ProviderType,
  ProviderSelectionCriteria,
  ProviderSelectionResult,
  eSIMOrder,
  eSIMOrderResult,
  SMSMessage,
  SMSResult,
  OrderStatus,
} from './types';

export class ProviderManager {
  private providers: Map<ProviderName, IProvider> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  /**
   * Register a provider
   */
  registerProvider(provider: IProvider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Get provider by name
   */
  getProvider(name: ProviderName): IProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Select the best provider for a given criteria
   */
  async selectProvider(criteria: ProviderSelectionCriteria): Promise<ProviderSelectionResult> {
    const { service, countryCode, prioritizeCost, prioritizePerformance, requireBackup } = criteria;

    // Filter providers by service type
    const candidateProviders = Array.from(this.providers.values()).filter(
      p => p.type === service && (await p.isAvailable())
    );

    if (candidateProviders.length === 0) {
      throw new Error(`No available providers for service: ${service}`);
    }

    // Sort by tier (Tier 1 first), then by criteria
    const sortedProviders = candidateProviders.sort((a, b) => {
      // Tier priority first
      if (a.tier !== b.tier) {
        return a.tier - b.tier;
      }

      // If country specified, check coverage priority
      if (countryCode) {
        // TODO: Implement async coverage check properly
      // For now, prioritize by tier
      }

      return 0;
    });

    const primaryProvider = sortedProviders[0];
    let backupProvider: IProvider | undefined;

    // Select backup if required or if primary is tier 1
    if (requireBackup || primaryProvider.tier === 1) {
      backupProvider = sortedProviders.find(p => p.tier === 2) || sortedProviders[1];
    }

    let reason = `Selected ${primaryProvider.name} as ${primaryProvider.tier === 1 ? 'primary' : 'backup'} provider`;
    if (countryCode) {
      reason += ` for ${countryCode}`;
    }
    if (prioritizeCost) {
      reason += ' (cost-optimized)';
    }
    if (prioritizePerformance) {
      reason += ' (performance-optimized)';
    }

    return {
      provider: primaryProvider,
      reason,
      backupProvider,
    };
  }

  /**
   * Create eSIM order with automatic failover
   */
  async createESIMOrder(order: eSIMOrder): Promise<eSIMOrderResult> {
    try {
      // Select primary provider
      const selection = await this.selectProvider({
        service: 'esim',
        countryCode: order.countryCode,
        requireBackup: true,
      });

      const primaryProvider = selection.provider;
      const backupProvider = selection.backupProvider;

      // Try primary provider
      try {
        if (!primaryProvider.createOrder) {
          throw new Error(`${primaryProvider.name} does not support eSIM orders`);
        }

        const result = await primaryProvider.createOrder(order);
        if (result.success) {
          return result;
        }

        // If unsuccessful, try backup
        throw new Error(result.error || 'Order creation failed');
      } catch (error: any) {
        // Failover to backup provider
        if (backupProvider && backupProvider.createOrder) {
          console.warn(`Primary provider ${primaryProvider.name} failed, trying backup ${backupProvider.name}`, error);
          
          try {
            const backupResult = await backupProvider.createOrder(order);
            if (backupResult.success) {
              // Track failover
              backupResult.provider = backupProvider.name;
              return backupResult;
            }
          } catch (backupError: any) {
            console.error(`Backup provider ${backupProvider.name} also failed`, backupError);
          }
        }

        // Both failed
        return {
          success: false,
          error: error?.message || 'All providers failed',
          provider: primaryProvider.name,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to select provider',
      };
    }
  }

  /**
   * Send SMS message (Telnyx only for now)
   */
  async sendSMS(message: SMSMessage): Promise<SMSResult> {
    const telnyx = this.getProvider('telnyx');
    
    if (!telnyx || !telnyx.sendSMS) {
      return {
        success: false,
        error: 'SMS service not available (Telnyx not configured)',
      };
    }

    try {
      return await telnyx.sendSMS(message);
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to send SMS',
        provider: 'telnyx',
      };
    }
  }

  /**
   * Get order status from provider
   */
  async getOrderStatus(providerName: ProviderName, providerOrderId: string): Promise<OrderStatus | null> {
    const provider = this.getProvider(providerName);
    
    if (!provider || !provider.getOrderStatus) {
      return null;
    }

    try {
      return await provider.getOrderStatus(providerOrderId);
    } catch (error) {
      console.error(`Failed to get order status from ${providerName}`, error);
      return null;
    }
  }

  /**
   * Start health checks for all providers
   */
  startHealthChecks(intervalMs: number = 60000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      for (const provider of this.providers.values()) {
        try {
          await provider.getHealthStatus();
        } catch (error) {
          console.error(`Health check failed for ${provider.name}`, error);
        }
      }
    }, intervalMs);
  }

  /**
   * Stop health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Get all registered providers
   */
  getAllProviders(): IProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get providers by type
   */
  getProvidersByType(type: ProviderType): IProvider[] {
    return Array.from(this.providers.values()).filter(p => p.type === type);
  }

  /**
   * Get active providers
   */
  async getActiveProviders(): Promise<IProvider[]> {
    const active: IProvider[] = [];
    
    for (const provider of this.providers.values()) {
      if (await provider.isAvailable()) {
        active.push(provider);
      }
    }
    
    return active;
  }
}

// Singleton instance
export const providerManager = new ProviderManager();

