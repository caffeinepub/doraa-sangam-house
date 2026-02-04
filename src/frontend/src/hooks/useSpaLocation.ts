import { useEffect, useState, useCallback } from 'react';

export interface SpaLocation {
  pathname: string;
}

// Create a custom event for navigation updates
const NAVIGATION_EVENT = 'spa-navigation';

export function useSpaLocation(): [SpaLocation, (path: string) => void] {
  const [location, setLocation] = useState<SpaLocation>({
    pathname: window.location.pathname,
  });

  const updateLocation = useCallback(() => {
    setLocation({ pathname: window.location.pathname });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      updateLocation();
    };

    const handleNavigationEvent = () => {
      updateLocation();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(NAVIGATION_EVENT, handleNavigationEvent);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(NAVIGATION_EVENT, handleNavigationEvent);
    };
  }, [updateLocation]);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname === path) return;
    
    window.history.pushState({}, '', path);
    setLocation({ pathname: path });
    
    // Dispatch custom event to notify all useSpaLocation instances
    window.dispatchEvent(new Event(NAVIGATION_EVENT));
  }, []);

  return [location, navigate];
}
