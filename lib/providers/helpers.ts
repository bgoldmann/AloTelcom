/**
 * Provider Integration Helpers
 * Utilities for integrating providers with existing order system
 */

import { providerManager } from './ProviderManager';
import { createOrder as createDbOrder, updateOrderStatus } from '../supabase-helpers';
import type { Plan } from '../../types';
import type { eSIMOrder, eSIMOrderResult } from './types';

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

