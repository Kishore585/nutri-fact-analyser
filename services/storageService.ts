
import { HistoryItem, User, ScanResult, UserProfile } from '../types';

const STORAGE_KEYS = {
  USER: 'nutriscan_user',
  HISTORY: 'nutriscan_history',
};

export const storageService = {
  /**
   * Syncs user metadata and preferences with localStorage
   */
  async syncUser(user: User): Promise<User | null> {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (storedUser) {
      const localData = JSON.parse(storedUser) as User;
      // If the IDs match, merge. Otherwise, we might be switching users (though local is usually single-user)
      return { ...user, ...localData };
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
  },

  /**
   * Updates user preferences in localStorage
   */
  async updateUserPreferences(userId: string, updates: Partial<User>) {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const currentData = JSON.parse(storedUser) as User;
      const updatedData = { ...currentData, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedData));
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updates));
    }
  },

  /**
   * Saves a new scan result to localStorage
   */
  async saveScan(userId: string, result: ScanResult, profile: UserProfile): Promise<void> {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: HistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];
    
    const newItem: HistoryItem = {
      ...result,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name,
    };

    history.unshift(newItem); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  /**
   * Deletes a specific scan record from localStorage
   */
  async deleteScan(userId: string, scanId: string): Promise<void> {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!storedHistory) return;
    
    const history: HistoryItem[] = JSON.parse(storedHistory);
    const updatedHistory = history.filter(item => item.id !== scanId);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  },

  /**
   * Retrieves full scan history from localStorage
   */
  async getHistory(userId: string): Promise<HistoryItem[]> {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  },

  /**
   * Clear all local data (Logout equivalent)
   */
  async clearAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
};
