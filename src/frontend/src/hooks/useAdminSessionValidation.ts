import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAdminSessionFlag } from '@/utils/adminSessionFlag';

interface AdminSessionValidationResult {
  isLoading: boolean;
  isAllowed: boolean;
  isDenied: boolean;
}

/**
 * Hook that validates the admin session flag against the backend.
 * Returns loading/allowed/denied state for the /admin page.
 */
export function useAdminSessionValidation(): AdminSessionValidationResult {
  const { actor, isFetching: actorFetching } = useActor();
  const sessionToken = getAdminSessionFlag();

  const query = useQuery<boolean>({
    queryKey: ['adminSessionValidation', sessionToken],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionToken) throw new Error('No session token');

      // Get client context
      const clientIp = 'browser'; // Browser cannot reliably get real IP
      const userAgent = navigator.userAgent;

      try {
        const isValid = await actor.validateAdminSession(clientIp, userAgent);
        return isValid;
      } catch (error: any) {
        console.error('Session validation failed:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!sessionToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // No session token = denied
  if (!sessionToken) {
    return {
      isLoading: false,
      isAllowed: false,
      isDenied: true,
    };
  }

  // Still loading actor or query
  if (actorFetching || query.isLoading) {
    return {
      isLoading: true,
      isAllowed: false,
      isDenied: false,
    };
  }

  // Query error or false result = denied
  if (query.isError || query.data === false) {
    return {
      isLoading: false,
      isAllowed: false,
      isDenied: true,
    };
  }

  // Success and true = allowed
  return {
    isLoading: false,
    isAllowed: query.data === true,
    isDenied: false,
  };
}
