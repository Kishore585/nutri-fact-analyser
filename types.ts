
export enum SafetyStatus {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  UNSAFE = 'UNSAFE',
  UNKNOWN = 'UNKNOWN'
}

export interface IngredientAnalysis {
  name: string;
  commonName: string;
  description: string;
  status: SafetyStatus;
  reason: string;
}

export interface ScanResult {
  verdict: SafetyStatus;
  summary: string;
  ingredients: IngredientAnalysis[];
  nutritionalHighlights: string[];
}

export interface HistoryItem extends ScanResult {
  id: string;
  timestamp: number;
  profileId: string;
  profileName: string; 
}

export interface UserPreferences {
  baseProfileId: string;
  customConditions: string;
  theme?: 'indigo' | 'emerald' | 'slate' | 'rose';
}

// Added missing UserProfile interface used for health goal profiles
export interface UserProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptContext: string;
  thumbnailUrl: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatar?: string;
  preferences?: UserPreferences;
}

export type AppState = 'AUTH' | 'PROFILE_EDITOR' | 'ACCOUNT_SETTINGS' | 'UPLOAD' | 'ANALYZING' | 'RESULTS' | 'HISTORY' | 'ARCHITECTURE' | 'REPORT' | 'PROJECT_DOC';
