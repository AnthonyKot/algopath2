
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserProfileContext } from './UserProfileContextBase';
import { firebaseService } from '../services/firebaseService';
import { db } from '../config/firebase';

export interface UserProfile {
  pin: string;
  alias?: string;
  focus?: string;
  createdAt: string;
  lastActive?: any;
}

export interface UserProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean; // True if connected to Firebase
  generatePin: (data?: { alias?: string; focus?: string }) => Promise<string>;
  login: (pin: string) => Promise<boolean>;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
  dismissError: () => void;
}

const LOCAL_STORAGE_KEY = 'algopath:user-profile';

const createPin = () => (Math.floor(1000 + Math.random() * 9000)).toString();

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Load from local storage on mount
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

  // Persist to local storage whenever profile changes
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

  const login = useCallback(async (pin: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try Firebase if configured
      if (db) {
        try {
          const remoteProfile = await firebaseService.getUser(pin);
          if (remoteProfile) {
            setProfile(remoteProfile);
            setIsOnline(true);
            return true;
          } else {
            setError('PIN not found');
            return false;
          }
        } catch (err) {
          console.warn('Firebase login failed, likely network or config:', err);
          // Fallthrough to local? No, if requested login fails, it fails.
          setError('Could not connect to verify PIN');
          return false;
        }
      } else {
        // 2. Mock Mode / Offline Check
        // If we are strictly offline/local, we can only "login" if the local storage matches?
        // Actually, for "Local Only" usage, we don't really have "Login" other than just loading what's there.
        // If user enters a PIN that matches LOCAL storage, we say OK.
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const localProfile = JSON.parse(stored);
          if (localProfile.pin === pin) {
            setProfile(localProfile);
            return true;
          }
        }
        setError('Database not configured. Cannot verify PIN.');
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePin = useCallback(async (data?: { alias?: string; focus?: string }) => {
    setLoading(true);
    setError(null);
    const pin = createPin();
    const newProfile: UserProfile = {
      pin,
      alias: data?.alias?.trim() || undefined,
      focus: data?.focus?.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    // Optimistic Update: Set profile immediately so UI feels instant
    setProfile(newProfile);

    try {
      // Try to save to Cloud (Background Sync)
      if (db) {
        // We don't await this to block UI, but we catch errors to handle fallback
        firebaseService.createUser(pin, newProfile)
          .then(() => setIsOnline(true))
          .catch((err) => {
            console.warn('Failed to Create User on Cloud, falling back to local', err);
            setIsOnline(false);
          });
      }

      return pin;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setLoading(true);
    try {
      // Optimistic update
      setProfile((prev) => {
        if (!prev) return null;
        return { ...prev, ...updates };
      });

      // Sync to cloud if online and profile exists
      if (db && profile && profile.pin) {
        await firebaseService.updateUser(profile.pin, updates);
      }
    } catch (err) {
      console.error('Failed to save profile updates', err);
      // We don't block the UI for this, local storage backup handles it
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setIsOnline(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    profile,
    loading,
    error,
    isOnline,
    generatePin,
    login,
    saveProfile,
    clearProfile,
    dismissError
  }), [profile, loading, error, isOnline, generatePin, login, saveProfile, clearProfile, dismissError]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}
