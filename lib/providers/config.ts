/**
 * Provider Configuration
 * Loads and manages provider configurations from environment variables
 */

import { providerManager } from './ProviderManager';
import { RedteaMobileProvider } from './adapters/RedteaMobileProvider';
import { TelnyxProvider } from './adapters/TelnyxProvider';
import type { ProviderConfig } from './types';

export interface ProviderEnvConfig {
  redtea?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
  };
  telnyx?: {
    apiKey?: string;
    baseUrl?: string;
  };
  esimgo?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    tier?: string;
  };
}

/**
 * Initialize all providers from environment variables
 */
export async function initializeProviders(): Promise<void> {
  // Load configuration from environment
  const config: ProviderEnvConfig = {
    redtea: {
      apiKey: import.meta.env.VITE_REDTEA_API_KEY,
      apiSecret: import.meta.env.VITE_REDTEA_API_SECRET,
      baseUrl: import.meta.env.VITE_REDTEA_BASE_URL,
    },
    telnyx: {
      apiKey: import.meta.env.VITE_TELNYX_API_KEY,
      baseUrl: import.meta.env.VITE_TELNYX_BASE_URL,
    },
    esimgo: {
      apiKey: import.meta.env.VITE_ESIMGO_API_KEY,
      apiSecret: import.meta.env.VITE_ESIMGO_API_SECRET,
      baseUrl: import.meta.env.VITE_ESIMGO_BASE_URL,
      tier: import.meta.env.VITE_ESIMGO_TIER,
    },
  };

  // Initialize Redtea Mobile (Tier 1 eSIM Provider)
  if (config.redtea?.apiKey) {
    try {
      const redteaProvider = new RedteaMobileProvider();
      const redteaConfig: ProviderConfig = {
        apiKey: config.redtea.apiKey,
        apiSecret: config.redtea.apiSecret,
        baseUrl: config.redtea.baseUrl,
        timeout: 30000,
        retryAttempts: 3,
      };
      
      await redteaProvider.initialize(redteaConfig);
      providerManager.registerProvider(redteaProvider);
      console.log('✅ Redtea Mobile provider initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Redtea Mobile provider', error);
    }
  } else {
    console.warn('⚠️ Redtea Mobile API key not configured (VITE_REDTEA_API_KEY)');
  }

  // Initialize Telnyx (Tier 1 Communication Provider)
  if (config.telnyx?.apiKey) {
    try {
      const telnyxProvider = new TelnyxProvider();
      const telnyxConfig: ProviderConfig = {
        apiKey: config.telnyx.apiKey,
        baseUrl: config.telnyx.baseUrl,
        timeout: 30000,
        retryAttempts: 3,
      };
      
      await telnyxProvider.initialize(telnyxConfig);
      providerManager.registerProvider(telnyxProvider);
      console.log('✅ Telnyx provider initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Telnyx provider', error);
    }
  } else {
    console.warn('⚠️ Telnyx API key not configured (VITE_TELNYX_API_KEY)');
  }

  // TODO: Initialize eSIM Go (Phase 3)
  // if (config.esimgo?.apiKey) {
  //   const esimgoProvider = new eSIMGoProvider();
  //   await esimgoProvider.initialize(config.esimgo);
  //   providerManager.registerProvider(esimgoProvider);
  // }

  // Start health checks
  providerManager.startHealthChecks(60000); // Check every minute
}

/**
 * Get provider status summary
 */
export function getProviderStatus(): {
  redtea: boolean;
  telnyx: boolean;
  esimgo: boolean;
  total: number;
} {
  const providers = providerManager.getAllProviders();
  const status = {
    redtea: providers.some(p => p.name === 'redtea' && p.initialized),
    telnyx: providers.some(p => p.name === 'telnyx' && p.initialized),
    esimgo: providers.some(p => p.name === 'esimgo' && p.initialized),
    total: providers.length,
  };

  return status;
}

