
import { HistoryItem, User, ScanResult, UserProfile } from '../types';

const USER_KEY = 'nutriscan_user';
const HISTORY_PREFIX = 'nutriscan_history_';

// Simple ID generator fallback if crypto is unavailable
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const storageService = {
  // --- Auth ---
  login: (email: string, name?: string): User => {
    // Check if user exists first to preserve preferences
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const existingUser = JSON.parse(stored);
      if (existingUser.email === email) {
        return existingUser;
      }
    }

    // New User
    const user: User = {
      id: btoa(email),
      email,
      name: name || email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${name || email}&background=10b981&color=fff`
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  updateUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // --- History ---
  saveScan: (user: User, result: ScanResult, profile: UserProfile) => {
    const key = `${HISTORY_PREFIX}${user.id}`;
    const currentHistoryStr = localStorage.getItem(key);
    const history: HistoryItem[] = currentHistoryStr ? JSON.parse(currentHistoryStr) : [];

    const newItem: HistoryItem = {
      ...result,
      id: generateId(),
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name
    };

    // Add to beginning
    const updatedHistory = [newItem, ...history];
    
    // Limit to last 50 items to prevent storage issues
    if (updatedHistory.length > 50) {
        updatedHistory.length = 50;
    }

    localStorage.setItem(key, JSON.stringify(updatedHistory));
  },

  getHistory: (user: User): HistoryItem[] => {
    const key = `${HISTORY_PREFIX}${user.id}`;
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : [];
  }
};
