# Provider Integration System

Multi-provider orchestration system for AloTelcom platform. This system manages integrations with Redtea Mobile, Telnyx, and eSIM Go providers.

## Architecture

```
ProviderManager (Orchestrator)
  ├─ RedteaMobileProvider (Tier 1 - Primary eSIM)
  ├─ TelnyxProvider (Tier 1 - Communication Services)
  └─ eSIMGoProvider (Tier 2 - Backup eSIM) [Phase 3]
```

## Setup

### 1. Environment Variables

Add to your `.env` file:

```env
# Redtea Mobile (eSIMAccess)
VITE_REDTEA_API_KEY=your_api_key_here
VITE_REDTEA_API_SECRET=your_api_secret_here (optional)
VITE_REDTEA_BASE_URL=https://api.esimaccess.com (optional)

# Telnyx
VITE_TELNYX_API_KEY=your_api_key_here
VITE_TELNYX_BASE_URL=https://api.telnyx.com/v2 (optional)

# eSIM Go (Phase 3)
VITE_ESIMGO_API_KEY=your_api_key_here (optional)
VITE_ESIMGO_API_SECRET=your_api_secret_here (optional)
VITE_ESIMGO_BASE_URL=https://api.esim-go.com (optional)
```

### 2. Initialize Providers

In your application startup (e.g., `App.tsx` or `index.tsx`):

```typescript
import { initializeProviders } from './lib/providers/config';

// Initialize providers on app start
initializeProviders().catch(console.error);
```

### 3. Database Migration

Run the provider schema migration:

```sql
-- Execute supabase/provider_schema.sql in your Supabase dashboard
-- or via Supabase CLI
```

## Usage

### Creating eSIM Orders

```typescript
import { createProviderOrder } from './lib/providers/helpers';
import type { Plan } from '../types';

const result = await createProviderOrder(
  userId,
  plan,
  customerEmail,
  customerName,
  imei,
  deviceModel
);

if (result.providerResult.success) {
  console.log('Order created:', result.order.id);
  console.log('QR Code:', result.providerResult.qrCodeUrl);
}
```

### Sending SMS (Telnyx)

```typescript
import { providerManager } from './lib/providers';

const result = await providerManager.sendSMS({
  to: '+1234567890',
  from: '+0987654321',
  message: 'Hello from AloTelcom!',
});

if (result.success) {
  console.log('SMS sent:', result.messageId);
}
```

### Getting Recommended Provider

```typescript
import { getRecommendedProvider } from './lib/providers/helpers';

const recommendation = await getRecommendedProvider('US');
console.log('Primary:', recommendation.primary);
console.log('Backup:', recommendation.backup);
console.log('Reason:', recommendation.reason);
```

## Provider Features

### Redtea Mobile (Primary eSIM Provider)

- **Coverage**: 200+ countries
- **Tier**: 1 (Primary)
- **Features**:
  - eSIM order creation
  - QR code generation
  - Multi-operator support
  - 5G connectivity
  - Travel partnerships

### Telnyx (Communication Services)

- **Coverage**: 190+ countries
- **Tier**: 1 (Primary)
- **Features**:
  - SMS/MMS messaging
  - Virtual phone numbers
  - VOIP/Voice API
  - 2FA verification
  - Video conferencing
  - Programmable Fax

### eSIM Go (Backup eSIM Provider)

- **Coverage**: 100+ countries
- **Tier**: 2 (Backup)
- **Features**: (Phase 3)
  - eSIM order creation
  - Redundancy and failover

## Provider Selection Logic

The ProviderManager automatically selects providers based on:

1. **Service Type**: eSIM vs Communication
2. **Tier Priority**: Tier 1 providers selected first
3. **Country Coverage**: Checks if provider supports country
4. **Availability**: Health check status
5. **Cost/Performance**: Optional optimization criteria

### Failover Logic

For eSIM orders:
1. Try Redtea Mobile (Tier 1 Primary)
2. If fails → Try eSIM Go (Tier 2 Backup)
3. If both fail → Manual provisioning fallback

For Communication services:
- Always use Telnyx (only provider)

## Provider Health Checks

Health checks run automatically every 60 seconds. Providers are checked for:
- API connectivity
- Response time
- Error rates

## Database Tables

### `providers`
Stores provider configuration and status.

### `provider_countries`
Maps countries to providers with pricing and priority.

### `provider_metrics`
Tracks daily performance metrics per provider.

### `provider_webhooks`
Logs webhook events from providers.

### `orders` (extended)
Orders now include:
- `primary_provider_id`
- `backup_provider_id`
- `actual_provider_id`
- `provider_order_id`
- `failover_count`
- `provider_selection_reason`
- `provider_metadata`

## Phase 1 Implementation Status

✅ **Completed:**
- Provider orchestration system architecture
- Base provider adapter class
- Redtea Mobile provider adapter
- Telnyx provider adapter
- Database schema migration
- Configuration system
- Provider initialization
- Health checks
- Failover logic

⏭️ **Phase 1 Remaining:**
- Actual API integration (requires credentials)
- Webhook handlers
- Metrics collection
- Admin dashboard integration

⏭️ **Phase 3:**
- eSIM Go provider adapter
- Backup provider integration

## Development

### Adding a New Provider

1. Create adapter class extending `BaseProvider`
2. Implement required methods from `IProvider` interface
3. Register provider in `config.ts`
4. Add environment variables

### Testing

Providers use placeholder responses until API credentials are configured. Once credentials are added, replace placeholder code with actual API calls (marked with `TODO` comments).

## API Integration Status

Currently using placeholder/mock implementations. Replace with actual API calls once credentials are obtained:

- Redtea Mobile: Replace TODOs in `RedteaMobileProvider.ts`
- Telnyx: Replace TODOs in `TelnyxProvider.ts`
- eSIM Go: Implement in Phase 3

## Support

For issues or questions, refer to:
- Integration Plan: `INTEGRATION_IMPLEMENTATION_PLAN.md`
- Provider Research: `REDTEA_MOBILE_INTEGRATION_RESEARCH.md`, `TELNYX_INTEGRATION_RESEARCH.md`

