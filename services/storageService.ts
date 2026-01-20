
import { db, storage } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  deleteDoc,
  Timestamp 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { HistoryItem, User, ScanResult, UserProfile } from '../types';

export const storageService = {
  // --- User Profiles ---
  async syncUser(user: User): Promise<User> {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const firestoreData = userSnap.data();
      return { ...user, ...firestoreData } as User;
    } else {
      await setDoc(userRef, user);
      return user;
    }
  },

  async updateUserPreferences(userId: string, preferences: any) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { preferences }, { merge: true });
  },

  // --- Scan History & Image Storage ---
  async saveScan(userId: string, result: ScanResult, profile: UserProfile, imageFile?: File): Promise<void> {
    const historyRef = collection(db, 'users', userId, 'scans');
    let imageUrl = null;

    // 1. Upload image to Firebase Storage if provided
    if (imageFile) {
      const filename = `scans/${userId}/${Date.now()}-${imageFile.name}`;
      const imageRef = ref(storage, filename);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }
    
    // 2. Save metadata and results to Firestore
    const newItem = {
      ...result,
      imageUrl, // Store the public link to the image
      timestamp: Date.now(),
      profileId: profile.id,
      profileName: profile.name,
      createdAt: Timestamp.now()
    };

    await addDoc(historyRef, newItem);
  },

  async deleteScan(userId: string, scanId: string): Promise<void> {
    // 1. Get the scan data to check for an associated image
    const scanRef = doc(db, 'users', userId, 'scans', scanId);
    const scanSnap = await getDoc(scanRef);
    
    if (scanSnap.exists()) {
      const data = scanSnap.data();
      // 2. If there's an image URL, attempt to delete from Storage
      if (data.imageUrl) {
        try {
          // Extract the path from the URL or recreate it (simplified for this app)
          const imageRef = ref(storage, data.imageUrl);
          await deleteObject(imageRef);
        } catch (e) {
          console.warn("Could not delete image from Storage:", e);
        }
      }
    }

    // 3. Delete the Firestore document
    await deleteDoc(scanRef);
  },

  async getHistory(userId: string): Promise<HistoryItem[]> {
    const historyRef = collection(db, 'users', userId, 'scans');
    const q = query(historyRef, orderBy('createdAt', 'desc'), limit(50));
    
    const querySnapshot = await getDocs(q);
    const items: HistoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data
      } as HistoryItem);
    });
    
    return items;
  }
};
