import { useEffect, useState } from 'react';

interface UseOnboardingResult {
  showOnboarding: boolean;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  startOnboarding: () => void;
  closeOnboarding: () => void;
}

const LOCAL_STORAGE_KEY = 'hasSeenOnboarding';

export function useOnboarding(): UseOnboardingResult {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [hasSeenOnboarding]);

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  const resetOnboarding = () => {
    setHasSeenOnboarding(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding,
    startOnboarding,
    closeOnboarding: () => setShowOnboarding(false)
  };
}
