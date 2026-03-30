import { HistoryItem, User, ScanResult, UserProfile } from '../types';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  USER: 'nutriscan_user',
  HISTORY: 'nutriscan_history',
};

export const storageService = {
  /**
   * Syncs user metadata and preferences with Supabase
   */
  async syncUser(user: User): Promise<User | null> {
    const { data: dbUser, error: fetchErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchErr);
    }

    if (dbUser) {
      const merged: User = { ...user, ...dbUser };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
      return merged;
    } else {
      const { error: insertErr } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          name: user.name,
        }]);
      
      if (insertErr) console.error('Error creating user record:', insertErr);
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
  },

  async updateUserPreferences(userId: string, updates: Partial<User>) {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const currentData = JSON.parse(storedUser) as User;
      const updatedData = { ...currentData, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedData));
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updates));
    }

    // Prepare payload for public.users table (do not send password to the table)
    const dbPayload = { ...updates };
    const newPassword = dbPayload.password;
    delete dbPayload.password;

    const { error } = await supabase
      .from('users')
      .update(dbPayload)
      .eq('id', userId);
      
    if (error) console.error('Error updating preferences in DB:', error);

    // If the user changed their password, update it using Supabase Auth
    if (newPassword && newPassword.trim() !== '') {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (authError) console.error('Error updating password in Auth:', authError);
    }
  },

  /**
   * Saves a new scan result to Supabase
   */
  async saveScan(userId: string, result: ScanResult, profile: UserProfile): Promise<void> {
    const scanId = crypto.randomUUID();
    const newItem: HistoryItem = {
      ...result,
      id: scanId,
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name,
    };

    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: HistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];
    history.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    const { error } = await supabase
      .from('history')
      .insert([{
        id: scanId,
        user_id: userId,
        timestamp: newItem.timestamp,
        profile_id: newItem.profileId,
        profile_name: newItem.profileName,
        scan_mode: newItem.scanMode,
        verdict: newItem.verdict,
        summary: newItem.summary,
        ingredients: newItem.ingredients,
        nutritional_highlights: newItem.nutritionalHighlights,
        consumption_guidance: newItem.consumptionGuidance,
        food_scan_data: newItem.foodScanData,
        is_nutrition_label: newItem.isNutritionLabel,
        is_food_image: 'isFoodImage' in newItem ? (newItem as any).isFoodImage : undefined
      }]);

    if (error) console.error('Error saving scan to DB:', error);
  },

  /**
   * Deletes a specific scan record from Supabase
   */
  async deleteScan(userId: string, scanId: string): Promise<void> {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (storedHistory) {
      const history: HistoryItem[] = JSON.parse(storedHistory);
      const updatedHistory = history.filter(item => item.id !== scanId);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    }

    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', scanId)
      .eq('user_id', userId);
      
    if (error) console.error('Error deleting scan from DB:', error);
  },

  /**
   * Retrieves full scan history from Supabase
   */
  async getHistory(userId: string): Promise<HistoryItem[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      profileId: row.profile_id,
      profileName: row.profile_name,
      scanMode: row.scan_mode,
      verdict: row.verdict,
      summary: row.summary,
      ingredients: row.ingredients || [],
      nutritionalHighlights: row.nutritional_highlights || [],
      consumptionGuidance: row.consumption_guidance || undefined,
      foodScanData: row.food_scan_data || undefined,
      isNutritionLabel: row.is_nutrition_label,
      isFoodImage: row.is_food_image
    })) as HistoryItem[];

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(mapped));
    return mapped;
  },

  /**
   * Clear all local data (Logout equivalent)
   */
  async clearAllData(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
};
