/**
 * Provider Configuration
 * Loads and manages provider configurations from environment variables
 */

import { providerManager } from './ProviderManager';
import { RedteaMobileProvider } from './adapters/RedteaMobileProvider';
import { TelnyxProvider } from './adapters/TelnyxProvider';
import { AiraloProvider } from './adapters/AiraloProvider';
import { VPNProvider } from './adapters/VPNProvider';
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
    verifyProfileId?: string; // For 2FA Verify API
  };
  airalo?: {
    apiKey?: string;
    baseUrl?: string;
  };
  vpn?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    providerType?: 'hideme' | 'resellvpn' | 'fortisvpn' | 'purevpn' | 'worldvpn' | 'generic';
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
      verifyProfileId: import.meta.env.VITE_TELNYX_VERIFY_PROFILE_ID, // For 2FA Verify API
    },
    airalo: {
      apiKey: import.meta.env.VITE_AIRALO_API_KEY,
      baseUrl: import.meta.env.VITE_AIRALO_BASE_URL,
    },
    vpn: {
      apiKey: import.meta.env.VITE_VPN_API_KEY,
      apiSecret: import.meta.env.VITE_VPN_API_SECRET,
      baseUrl: import.meta.env.VITE_VPN_BASE_URL,
      providerType: import.meta.env.VITE_VPN_PROVIDER as 'hideme' | 'resellvpn' | 'fortisvpn' | 'purevpn' | 'worldvpn' | 'generic',
    },
    esimgo: {
      apiKey: import.meta.env.VITE_ESIMGO_API_KEY,
      apiSecret: import.meta.env.VITE_ESIMGO_API_SECRET,
      baseUrl: import.meta.env.VITE_ESIMGO_BASE_URL,
      tier: import.meta.env.VITE_ESIMGO_TIER,
    },
  };

  // Initialize Redtea Mobile / eSIMAccess (Tier 1 eSIM Provider / Backup Option)
  // Can function as both primary and backup depending on configuration
  // API Documentation: https://docs.esimaccess.com/
  if (config.redtea?.apiKey) {
    try {
      const redteaProvider = new RedteaMobileProvider();
      const redteaConfig: ProviderConfig = {
        apiKey: config.redtea.apiKey, // Access Code from eSIMAccess
        apiSecret: config.redtea.apiSecret, // Optional
        baseUrl: config.redtea.baseUrl || 'https://api.esimaccess.com/v1',
        timeout: 30000,
        retryAttempts: 3,
      };
      
      await redteaProvider.initialize(redteaConfig);
      providerManager.registerProvider(redteaProvider);
      console.log('✅ Redtea Mobile (eSIMAccess) provider initialized');
      console.log('   📚 API Docs: https://docs.esimaccess.com/');
    } catch (error) {
      console.error('❌ Failed to initialize Redtea Mobile provider', error);
    }
  } else {
    console.warn('⚠️ Redtea Mobile API key not configured (VITE_REDTEA_API_KEY)');
    console.warn('   Get your Access Code from: https://esimaccess.com/');
  }

  // Initialize Telnyx (Tier 1 Communication Provider)
  if (config.telnyx?.apiKey) {
    try {
      const telnyxProvider = new TelnyxProvider();
      const telnyxConfig: ProviderConfig = {
        apiKey: config.telnyx.apiKey,
        baseUrl: config.telnyx.baseUrl,
        verifyProfileId: config.telnyx.verifyProfileId, // Optional: for 2FA Verify API
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

  // Initialize Airalo (Tier 2 Backup eSIM Provider)
  // Partner API Program: https://www.airalo.com/partner-with-us/api-partners
  // API Documentation: https://developers.partners.airalo.com/
  if (config.airalo?.apiKey) {
    try {
      const airaloProvider = new AiraloProvider();
      const airaloConfig: ProviderConfig = {
        apiKey: config.airalo.apiKey, // Partner API key from Airalo
        baseUrl: config.airalo.baseUrl || 'https://api.partners.airalo.com/v1',
        timeout: 30000,
        retryAttempts: 3,
      };
      
      await airaloProvider.initialize(airaloConfig);
      providerManager.registerProvider(airaloProvider);
      console.log('✅ Airalo provider initialized (Tier 2 - Backup)');
      console.log('   📚 API Docs: https://developers.partners.airalo.com/');
    } catch (error) {
      console.error('❌ Failed to initialize Airalo provider', error);
    }
  } else {
    console.warn('⚠️ Airalo API key not configured (VITE_AIRALO_API_KEY)');
    console.warn('   Apply for Partner API: https://www.airalo.com/partner-with-us/api-partners');
  }

  // Initialize VPN Provider
  // Supports multiple VPN providers: hide.me, ResellVPN, FortisVPN, PureVPN, WorldVPN
  if (config.vpn?.apiKey) {
    try {
      const vpnProvider = new VPNProvider();
      const vpnConfig: ProviderConfig = {
        apiKey: config.vpn.apiKey,
        apiSecret: config.vpn.apiSecret,
        baseUrl: config.vpn.baseUrl,
        providerType: config.vpn.providerType || 'generic',
        timeout: 30000,
        retryAttempts: 3,
      };
      
      await vpnProvider.initialize(vpnConfig);
      providerManager.registerProvider(vpnProvider);
      console.log('✅ VPN provider initialized');
      console.log(`   Provider: ${config.vpn.providerType || 'generic'}`);
      console.log('   Supported providers: hide.me, ResellVPN, FortisVPN, PureVPN, WorldVPN');
    } catch (error) {
      console.error('❌ Failed to initialize VPN provider', error);
    }
  } else {
    console.warn('⚠️ VPN API key not configured (VITE_VPN_API_KEY)');
    console.warn('   Available providers: hide.me, ResellVPN, FortisVPN, PureVPN, WorldVPN');
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
  airalo: boolean;
  vpn: boolean;
  esimgo: boolean;
  total: number;
} {
  const providers = providerManager.getAllProviders();
  const status = {
    redtea: providers.some(p => p.name === 'redtea' && p.initialized),
    telnyx: providers.some(p => p.name === 'telnyx' && p.initialized),
    airalo: providers.some(p => p.name === 'airalo' && p.initialized),
    vpn: providers.some(p => p.name === 'vpn' && p.initialized),
    esimgo: providers.some(p => p.name === 'esimgo' && p.initialized),
    total: providers.length,
  };

  return status;
}

