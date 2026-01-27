import { HistoryItem, User, ScanResult, UserProfile } from '../types';

const USER_KEY = 'nutriscan_user';
const HISTORY_KEY = 'nutriscan_history';

export const storageService = {
  // --- User Profiles ---
  async syncUser(user?: User): Promise<User | null> {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  async updateUserPreferences(userId: string, preferences: any) {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const user = JSON.parse(stored) as User;
      const updatedUser = { ...user, preferences };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  },

  // --- Scan History ---
  async saveScan(userId: string, result: ScanResult, profile: UserProfile, imageFile?: File): Promise<void> {
    const history = await this.getHistory(userId);
    
    // In local-first mode, we store metadata in localStorage.
    // Base64 image storage is avoided to prevent exceeding the 5MB localStorage limit.
    const newItem: HistoryItem = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name,
    };

    const updatedHistory = [newItem, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  },

  async deleteScan(userId: string, scanId: string): Promise<void> {
    const history = await this.getHistory(userId);
    const updatedHistory = history.filter(item => item.id !== scanId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  },

  async getHistory(userId: string): Promise<HistoryItem[]> {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as HistoryItem[];
      } catch (e) {
        console.error("Failed to parse history", e);
        return [];
      }
    }
    return [];
  },

  async clearAllData() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HISTORY_KEY);
  }
};