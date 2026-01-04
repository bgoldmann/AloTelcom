/**
 * Provider Integration Module
 * Main entry point for multi-provider orchestration
 * Phase 1: Foundation
 */

export { providerManager, ProviderManager } from './ProviderManager';
export { BaseProvider } from './adapters/BaseProvider';
export { RedteaMobileProvider } from './adapters/RedteaMobileProvider';
export { TelnyxProvider } from './adapters/TelnyxProvider';
export { AiraloProvider } from './adapters/AiraloProvider';
export { VPNProvider } from './adapters/VPNProvider';

export type * from './types';

// Communication service helpers
export {
  sendSMS,
  sendMMS,
  send2FACode,
  verify2FACode,
} from './helpers-communication';

// Order creation helpers
export {
  createProviderOrder,
  createVPNOrder,
  createSMSOrder,
  createMMSOrder,
  create2FAOrder,
  getRecommendedProvider,
} from './helpers';

// Export for future eSIM Go provider
// export { eSIMGoProvider } from './adapters/eSIMGoProvider';

