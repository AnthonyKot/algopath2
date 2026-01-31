import { createContext } from 'react';
import type { UserProfileContextValue } from './UserProfileContext';

export const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);
