
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
  profileName: string; // Cached name in case profile def changes
}

export interface UserPreferences {
  baseProfileId: string;
  customConditions: string; // Free text for allergies, specific diseases, etc.
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptContext: string;
  thumbnailUrl?: string;
}

export type AppState = 'AUTH' | 'PROFILE_EDITOR' | 'UPLOAD' | 'ANALYZING' | 'RESULTS' | 'HISTORY' | 'ARCHITECTURE' | 'REPORT' | 'PROJECT_DOC';
