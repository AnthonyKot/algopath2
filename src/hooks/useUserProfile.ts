import { useMemo } from 'react';
import { useUserProfileContext } from './useUserProfileContext';

export function useUserProfile() {
  const ctx = useUserProfileContext();

  return useMemo(() => ctx, [ctx]);
}
