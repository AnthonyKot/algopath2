import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserProfileContext } from './UserProfileContextBase';

export interface UserProfile {
  pin: string;
  alias?: string;
  focus?: string;
  createdAt: string;
}

export interface UserProfileContextValue {
  profile: UserProfile | null;
  generatePin: (data?: { alias?: string; focus?: string }) => string;
  saveProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const LOCAL_STORAGE_KEY = 'algopath:user-profile';

const createPin = () => (Math.floor(1000 + Math.random() * 9000)).toString();

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load user profile from storage', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to persist user profile', error);
    }
  }, [profile]);

  const generatePin = useCallback((data?: { alias?: string; focus?: string }) => {
    const pin = createPin();
    const nextProfile: UserProfile = {
      pin,
      alias: data?.alias?.trim() || undefined,
      focus: data?.focus?.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    setProfile(nextProfile);
    return pin;
  }, []);

  const saveProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) {
        if (!updates.pin) {
          return prev;
        }
        return {
          pin: updates.pin,
          alias: updates.alias,
          focus: updates.focus,
          createdAt: updates.createdAt || new Date().toISOString()
        };
      }

      return {
        ...prev,
        ...updates,
        pin: updates.pin || prev.pin,
        createdAt: updates.createdAt || prev.createdAt
      };
    });
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ profile, generatePin, saveProfile, clearProfile }), [profile, generatePin, saveProfile, clearProfile]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}
