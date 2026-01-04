/**
 * Provider Integration Module
 * Main entry point for multi-provider orchestration
 * Phase 1: Foundation
 */

export { providerManager, ProviderManager } from './ProviderManager';
export { BaseProvider } from './adapters/BaseProvider';
export { RedteaMobileProvider } from './adapters/RedteaMobileProvider';
export { TelnyxProvider } from './adapters/TelnyxProvider';

export type * from './types';

// Export for future eSIM Go provider
// export { eSIMGoProvider } from './adapters/eSIMGoProvider';

