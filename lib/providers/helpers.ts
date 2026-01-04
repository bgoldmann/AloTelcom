/**
 * Provider Integration Helpers
 * Utilities for integrating providers with existing order system
 */

import { providerManager } from './ProviderManager';
import { createOrder as createDbOrder, updateOrderStatus } from '../supabase-helpers';
import { sendSMS, sendMMS, send2FACode, verify2FACode } from './helpers-communication';
import type { Plan } from '../../types';
import type { 
  eSIMOrder, 
  eSIMOrderResult, 
  SMSResult, 
  VerifyResult 
} from './types';
import type { VPNOrder, VPNOrderResult } from './adapters/VPNProvider';

/**
 * Create eSIM order through provider system
 */
export async function createProviderOrder(
  userId: string,
  plan: Plan,
  customerEmail: string,
  customerName?: string,
  imei?: string,
  deviceModel?: string
): Promise<{ order: any; providerResult: eSIMOrderResult }> {
  // Create order in database first
  const dbOrder = await createDbOrder(userId, plan, imei, deviceModel);
  
  if (!dbOrder) {
    throw new Error('Failed to create order in database');
  }

  // Prepare provider order
  const providerOrder: eSIMOrder = {
    countryCode: plan.country.toUpperCase(),
    dataAmount: plan.data,
    validity: plan.validity,
    planId: plan.id,
    customerEmail,
    customerName,
    imei,
    deviceModel,
  };

  // Route through provider manager
  const providerResult = await providerManager.createESIMOrder(providerOrder);

  // Update database order with provider information
  if (providerResult.success && providerResult.qrCodeUrl) {
    // Update order with QR code and provider info
    await updateOrderStatus(
      dbOrder.id,
      'active', // or 'pending' depending on activation status
      providerResult.qrCodeUrl
    );

    // TODO: Update order with provider metadata in database
    // This requires adding provider fields to orders table
  } else {
    // Mark order as failed
    await updateOrderStatus(dbOrder.id, 'pending'); // Keep as pending for manual review
  }

  return {
    order: dbOrder,
    providerResult,
  };
}

/**
 * Create VPN order through provider system
 */
export async function createVPNOrder(
  userId: string,
  plan: Plan,
  customerEmail: string,
  customerName?: string
): Promise<{ order: any; providerResult: VPNOrderResult }> {
  // Create order in database first
  const dbOrder = await createDbOrder(userId, plan);
  
  if (!dbOrder) {
    throw new Error('Failed to create order in database');
  }

  // Determine plan type from plan ID or features
  let planType: 'basic' | 'pro' | 'premium' = 'basic';
  if (plan.id.includes('pro') || plan.id.includes('premium')) {
    planType = plan.id.includes('premium') ? 'premium' : 'pro';
  }

  // Extract devices from features or plan description
  const devicesMatch = plan.features?.find(f => f.toLowerCase().includes('device'))?.match(/(\d+)/);
  const devices = devicesMatch ? parseInt(devicesMatch[1], 10) : 3; // Default to 3 devices

  // Prepare VPN provider order
  const vpnOrder: VPNOrder = {
    planId: plan.id,
    planType,
    validity: plan.validity,
    devices,
    customerEmail,
    customerName,
  };

  // Get VPN provider
  const vpnProvider = providerManager.getProvider('vpn');
  if (!vpnProvider || !('createVPNAccount' in vpnProvider)) {
    throw new Error('VPN provider not available');
  }

  // Create VPN account
  if (!vpnProvider.createVPNAccount) {
    throw new Error('VPN provider does not support account creation');
  }
  const providerResult = await vpnProvider.createVPNAccount(vpnOrder);

  // Update database order with provider information
  if (providerResult.success) {
    await updateOrderStatus(
      dbOrder.id,
      'active',
      providerResult.configUrl || providerResult.activationLink || undefined
    );

    // TODO: Store VPN account credentials securely
    // TODO: Update order with provider metadata
  } else {
    await updateOrderStatus(dbOrder.id, 'pending');
  }

  return {
    order: dbOrder,
    providerResult,
  };
}

/**
 * Create SMS order through provider system
 */
export async function createSMSOrder(
  userId: string,
  plan: Plan,
  customerEmail: string,
  customerName?: string,
  toPhoneNumber?: string,
  fromPhoneNumber?: string
): Promise<{ order: any; providerResult: SMSResult }> {
  // Create order in database first
  const dbOrder = await createDbOrder(userId, plan);
  
  if (!dbOrder) {
    throw new Error('Failed to create order in database');
  }

  // Validate phone numbers
  const toNumber = toPhoneNumber || plan.phoneNumber;
  const fromNumber = fromPhoneNumber || plan.fromNumber;

  if (!toNumber || !fromNumber) {
    throw new Error('SMS requires both destination and sender phone numbers');
  }

  // Prepare SMS message
  const message = plan.data || 'Hello from AloTelcom!'; // Use plan.data as message text

  // Send SMS via provider
  const providerResult = await sendSMS({
    to: toNumber,
    from: fromNumber,
    message,
  });

  // Update database order with provider information
  if (providerResult.success) {
    await updateOrderStatus(
      dbOrder.id,
      'active',
      undefined // SMS doesn't have QR code, but we could store message ID
    );
  } else {
    await updateOrderStatus(dbOrder.id, 'pending');
  }

  return {
    order: dbOrder,
    providerResult,
  };
}

/**
 * Create MMS order through provider system
 */
export async function createMMSOrder(
  userId: string,
  plan: Plan,
  customerEmail: string,
  customerName?: string,
  toPhoneNumber?: string,
  fromPhoneNumber?: string,
  mediaUrls?: string[]
): Promise<{ order: any; providerResult: SMSResult }> {
  // Create order in database first
  const dbOrder = await createDbOrder(userId, plan);
  
  if (!dbOrder) {
    throw new Error('Failed to create order in database');
  }

  // Validate phone numbers
  const toNumber = toPhoneNumber || plan.phoneNumber;
  const fromNumber = fromPhoneNumber || plan.fromNumber;

  if (!toNumber || !fromNumber) {
    throw new Error('MMS requires both destination and sender phone numbers');
  }

  if (!mediaUrls || mediaUrls.length === 0) {
    throw new Error('MMS requires at least one media URL');
  }

  // Prepare MMS message
  const message = plan.data || 'Check this out!'; // Use plan.data as message text

  // Send MMS via provider
  const providerResult = await sendMMS({
    to: toNumber,
    from: fromNumber,
    message,
    mediaUrls,
  });

  // Update database order with provider information
  if (providerResult.success) {
    await updateOrderStatus(
      dbOrder.id,
      'active',
      undefined // MMS doesn't have QR code, but we could store message ID
    );
  } else {
    await updateOrderStatus(dbOrder.id, 'pending');
  }

  return {
    order: dbOrder,
    providerResult,
  };
}

/**
 * Create 2FA verification order through provider system
 */
export async function create2FAOrder(
  userId: string,
  plan: Plan,
  customerEmail: string,
  customerName?: string,
  phoneNumber?: string,
  channel?: 'sms' | 'voice' | 'flash_call'
): Promise<{ order: any; providerResult: VerifyResult }> {
  // Create order in database first
  const dbOrder = await createDbOrder(userId, plan);
  
  if (!dbOrder) {
    throw new Error('Failed to create order in database');
  }

  // Validate phone number
  const toNumber = phoneNumber || plan.phoneNumber;
  if (!toNumber) {
    throw new Error('2FA requires a phone number');
  }

  // Determine channel from plan or parameter
  const verificationChannel = channel || plan.channel || 'sms';

  // Extract code length from plan features or use default
  const codeLengthMatch = plan.features?.find(f => f.toLowerCase().includes('code'))?.match(/(\d+)/);
  const codeLength = codeLengthMatch ? parseInt(codeLengthMatch[1], 10) : 6;

  // Extract timeout from plan validity or use default (300 seconds = 5 minutes)
  const timeout = 300; // Default 5 minutes

  // Send verification code via provider
  const providerResult = await send2FACode(
    toNumber,
    verificationChannel,
    undefined, // Verify Profile ID from config
    timeout,
    codeLength
  );

  // Update database order with provider information
  if (providerResult.success) {
    await updateOrderStatus(
      dbOrder.id,
      'active',
      undefined // 2FA doesn't have QR code, but we could store verification ID
    );
  } else {
    await updateOrderStatus(dbOrder.id, 'pending');
  }

  return {
    order: dbOrder,
    providerResult,
  };
}

/**
 * Get provider selection for a given country
 */
export async function getRecommendedProvider(countryCode: string): Promise<{
  primary: string;
  backup?: string;
  reason: string;
}> {
  try {
    const selection = await providerManager.selectProvider({
      service: 'esim',
      countryCode: countryCode.toUpperCase(),
      requireBackup: true,
    });

    return {
      primary: selection.provider.name,
      backup: selection.backupProvider?.name,
      reason: selection.reason,
    };
  } catch (error: any) {
    return {
      primary: 'none',
      reason: error.message || 'No providers available',
    };
  }
}
