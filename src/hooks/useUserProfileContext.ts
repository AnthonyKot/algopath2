import { useContext } from 'react';
import { UserProfileContext } from '../context/UserProfileContextBase';

export function useUserProfileContext() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfileContext must be used within UserProfileProvider');
  }

  return ctx;
}
