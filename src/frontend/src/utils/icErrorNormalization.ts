/**
 * Normalizes Internet Computer canister errors into user-friendly messages
 * Detects canister-unavailable patterns while preserving explicit backend trap messages
 */

export interface NormalizedError {
  message: string;
  isCanisterUnavailable: boolean;
}

/**
 * Normalizes an error from a canister call
 * @param error - The error object from the failed canister call
 * @returns Normalized error with user-friendly message
 */
export function normalizeIcError(error: any): NormalizedError {
  const errorMessage = error?.message || '';
  const errorMessageLower = errorMessage.toLowerCase();
  
  // Check if this is an explicit backend trap message (authorization, validation, etc.)
  // These should be shown as-is to the user
  if (
    errorMessage.includes('Not authorized:') ||
    errorMessage.includes('Unauthorized:') ||
    errorMessage.includes('Invalid OTP') ||
    errorMessage.includes('OTP has expired') ||
    errorMessage.includes('No OTP found') ||
    errorMessage.includes('not in the admin allowlist')
  ) {
    return {
      message: errorMessage,
      isCanisterUnavailable: false,
    };
  }
  
  // Check for canister-unavailable patterns
  if (
    errorMessageLower.includes('canister') ||
    errorMessageLower.includes('replica') ||
    errorMessageLower.includes('network') ||
    errorMessageLower.includes('agent') ||
    errorMessageLower.includes('unavailable') ||
    errorMessageLower.includes('unreachable') ||
    errorMessageLower.includes('connection') ||
    errorMessageLower.includes('timeout') ||
    errorMessageLower.includes('fetch') ||
    errorMessageLower.includes('rejected') ||
    errorMessageLower.includes('stopped')
  ) {
    return {
      message: 'Backend canister is unavailable or stopped. Please start or redeploy the canister using dfx commands. See ADMIN_CANISTER_AVAILABILITY_RUNBOOK.md for instructions.',
      isCanisterUnavailable: true,
    };
  }
  
  // Generic error - preserve original message
  return {
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    isCanisterUnavailable: false,
  };
}
