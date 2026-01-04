/**
 * Communication Services Helpers
 * Utilities for SMS, MMS, and 2FA services
 */

import { providerManager } from './ProviderManager';
import type {
  SMSMessage,
  SMSResult,
  VerifyRequest,
  VerifyResult,
  VerifyCheck,
  VerifyCheckResult,
} from './types';

/**
 * Send SMS message via Telnyx
 */
export async function sendSMS(message: SMSMessage): Promise<SMSResult> {
  const telnyx = providerManager.getProvider('telnyx');
  
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
      error: error.message || 'Failed to send SMS',
      provider: 'telnyx',
    };
  }
}

/**
 * Send MMS message via Telnyx
 */
export async function sendMMS(message: SMSMessage): Promise<SMSResult> {
  const telnyx = providerManager.getProvider('telnyx');
  
  if (!telnyx || !telnyx.sendMMS) {
    return {
      success: false,
      error: 'MMS service not available (Telnyx not configured)',
    };
  }

  if (!message.mediaUrls || message.mediaUrls.length === 0) {
    return {
      success: false,
      error: 'MMS requires at least one media URL',
      provider: 'telnyx',
    };
  }

  try {
    return await telnyx.sendMMS(message);
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send MMS',
      provider: 'telnyx',
    };
  }
}

/**
 * Send 2FA verification code via Telnyx Verify API
 * 
 * @param phoneNumber - Phone number to send code to (E.164 format: +1234567890)
 * @param channel - Verification channel: 'sms', 'voice', or 'flash_call' (default: 'sms')
 * @param verifyProfileId - Optional: Telnyx Verify Profile ID (uses config default if not provided)
 * @param timeout - Optional: Verification timeout in seconds (default: 300)
 * @param codeLength - Optional: Code length (default: 6)
 */
export async function send2FACode(
  phoneNumber: string,
  channel: 'sms' | 'voice' | 'flash_call' = 'sms',
  verifyProfileId?: string,
  timeout?: number,
  codeLength?: number
): Promise<VerifyResult> {
  const telnyx = providerManager.getProvider('telnyx');
  
  if (!telnyx || !telnyx.sendVerificationCode) {
    return {
      success: false,
      error: '2FA service not available (Telnyx not configured)',
      provider: 'telnyx',
    };
  }

  const request: VerifyRequest = {
    phoneNumber,
    channel,
    verifyProfileId,
    timeout,
    codeLength,
  };

  try {
    return await telnyx.sendVerificationCode(request);
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send verification code',
      provider: 'telnyx',
    };
  }
}

/**
 * Verify 2FA code via Telnyx Verify API
 * 
 * @param phoneNumber - Phone number that received the code (E.164 format: +1234567890)
 * @param code - Verification code entered by user
 * @param verifyProfileId - Optional: Telnyx Verify Profile ID (uses config default if not provided)
 */
export async function verify2FACode(
  phoneNumber: string,
  code: string,
  verifyProfileId?: string
): Promise<VerifyCheckResult> {
  const telnyx = providerManager.getProvider('telnyx');
  
  if (!telnyx || !telnyx.verifyCode) {
    return {
      success: false,
      verified: false,
      error: '2FA verification service not available (Telnyx not configured)',
      provider: 'telnyx',
    };
  }

  const check: VerifyCheck = {
    phoneNumber,
    code,
    verifyProfileId,
  };

  try {
    return await telnyx.verifyCode(check);
  } catch (error: any) {
    return {
      success: false,
      verified: false,
      error: error.message || 'Failed to verify code',
      provider: 'telnyx',
    };
  }
}

