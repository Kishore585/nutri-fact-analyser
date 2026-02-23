
import { HistoryItem, User, ScanResult, UserProfile } from '../types';
import { db, doc, setDoc, getDoc, collection, query, orderBy, getDocs, deleteDoc, addDoc } from './firebase';

export const storageService = {
  /**
   * Syncs user metadata and preferences with Firestore
   */
  async syncUser(user: User): Promise<User | null> {
    const userRef = doc(db, 'users', user.id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Merge existing cloud data with new login data
      const cloudData = userDoc.data() as User;
      return { ...user, ...cloudData };
    } else {
      // First time login - initialize profile
      await setDoc(userRef, user);
      return user;
    }
  },

  /**
   * Updates user preferences (Conditions, Theme, etc.) in Firestore
   */
  async updateUserPreferences(userId: string, updates: Partial<User>) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updates, { merge: true });
  },

  /**
   * Saves a new scan result to the user's scan sub-collection in Firestore
   */
  async saveScan(userId: string, result: ScanResult, profile: UserProfile): Promise<void> {
    const historyRef = collection(db, 'users', userId, 'scans');
    
    const newItem = {
      ...result,
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name,
    };

    await addDoc(historyRef, newItem);
  },

  /**
   * Deletes a specific scan record from Firestore
   */
  async deleteScan(userId: string, scanId: string): Promise<void> {
    const scanRef = doc(db, 'users', userId, 'scans', scanId);
    await deleteDoc(scanRef);
  },

  /**
   * Retrieves full scan history for the authenticated user from Firestore
   */
  async getHistory(userId: string): Promise<HistoryItem[]> {
    const historyRef = collection(db, 'users', userId, 'scans');
    const q = query(historyRef, orderBy('timestamp', 'desc'));
    
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryItem[];
    } catch (e) {
      console.error("Failed to fetch history from Firestore", e);
      return [];
    }
  }
};
