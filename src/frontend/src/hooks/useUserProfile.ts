import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'doraa_user_profile_local';

/**
 * Hook for managing user profile data with Internet Identity backend integration
 * and localStorage fallback for resilient persistence.
 */
export function useUserProfile(): UseUserProfileReturn {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Load profile from backend or localStorage
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && actor && !actorFetching) {
        // Try backend first
        try {
          const backendProfile = await actor.getCallerUserProfile();
          setProfile(backendProfile);
          // Sync to localStorage as backup
          if (backendProfile) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backendProfile));
          }
        } catch (backendError) {
          console.warn('Backend profile load failed, falling back to localStorage:', backendError);
          // Fallback to localStorage
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            const parsed = JSON.parse(localData) as UserProfile;
            setProfile(parsed);
          } else {
            setProfile(null);
          }
        }
      } else {
        // Load from localStorage for unauthenticated users
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          const parsed = JSON.parse(localData) as UserProfile;
          setProfile(parsed);
        } else {
          setProfile(null);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [actor, actorFetching, isAuthenticated]);

  // Save profile to backend with localStorage fallback
  const saveProfile = useCallback(
    async (newProfile: UserProfile) => {
      setIsSaving(true);
      setError(null);

      try {
        if (isAuthenticated && actor) {
          // Try backend save first
          try {
            await actor.saveCallerUserProfile(newProfile);
            setProfile(newProfile);
            // Also save to localStorage as backup
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
          } catch (backendError) {
            console.warn('Backend profile save failed, falling back to localStorage:', backendError);
            // Fallback to localStorage only
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
            setProfile(newProfile);
            // Don't throw - we still persisted successfully
          }
        } else {
          // Save to localStorage for unauthenticated users
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
          setProfile(newProfile);
        }
      } catch (err) {
        console.error('Failed to save profile:', err);
        setError('Failed to save profile');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [actor, isAuthenticated]
  );

  // Load profile on mount and when authentication state changes
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    saveProfile,
    refreshProfile: loadProfile,
  };
}
