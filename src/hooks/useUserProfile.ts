import { useMemo } from 'react';
import { useUserProfileContext } from '../context/UserProfileContext';

export function useUserProfile() {
  const ctx = useUserProfileContext();

  return useMemo(() => ctx, [ctx]);
}
