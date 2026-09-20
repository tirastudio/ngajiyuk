export interface ReflectionNote {
  id: string;
  title: string;
  content: string;
  surahNumber?: number;
  surahName?: string;
  ayahNumber?: number;
  createdAt: number;
}

export interface HifzRecord {
  surahNumber: number;
  memorizedAyahs: number[];
  isFullyMemorized: boolean;
  lastUpdated: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // stored hashed or base64 in client-persisted storage
  avatarColor: string;
  joinedAt: number;
  dailyAyahTarget: number;
  dailyReadingMinutesTarget: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalReadingMinutes: number;
  completedSurahs: number[];
  hifzRecords?: {
    [surahNumber: number]: HifzRecord;
  };
  prayerChecklist: {
    [dateKey: string]: {
      subuh?: boolean;
      dzuhur?: boolean;
      ashar?: boolean;
      maghrib?: boolean;
      isya?: boolean;
      dhuha?: boolean;
      tahajjud?: boolean;
    };
  };
  notes: ReflectionNote[];
  dailyAyahsProgress?: {
    [dateKey: string]: number;
  };
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}
