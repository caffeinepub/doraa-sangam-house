import type { backendInterface } from '../backend';

/**
 * Performs a lightweight preflight check to verify backend canister availability
 * @param actor - The backend actor instance
 * @returns Promise that resolves to true if canister is available, throws otherwise
 */
export async function checkCanisterAvailability(actor: backendInterface): Promise<boolean> {
  try {
    const response = await actor.healthCheck();
    return typeof response === 'string' && response.length > 0;
  } catch (error: any) {
    throw new Error(normalizeCanisterUnavailableMessage(error));
  }
}

/**
 * Normalizes canister unavailability errors into a user-friendly message
 * @param error - The error object from the failed preflight
 * @returns User-friendly English message indicating canister is unavailable
 */
function normalizeCanisterUnavailableMessage(error: any): string {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  // Check for common canister-stopped/unavailable patterns
  if (
    errorMessage.includes('canister') ||
    errorMessage.includes('replica') ||
    errorMessage.includes('network') ||
    errorMessage.includes('agent') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('unreachable') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout')
  ) {
    return 'Backend canister is unavailable or stopped. Please start or redeploy the canister using dfx commands. See ADMIN_CANISTER_AVAILABILITY_RUNBOOK.md for instructions.';
  }
  
  // Generic fallback
  return 'Backend canister is not responding. Please verify the canister is running and try again.';
}
