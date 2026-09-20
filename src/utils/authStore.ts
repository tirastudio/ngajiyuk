import { UserProfile, ReflectionNote, HifzRecord } from '../types/auth';

const USERS_STORAGE_KEY = 'quran_app_users_v1';
const CURRENT_USER_KEY = 'quran_app_active_user_v1';
export const GUEST_HIFZ_STORAGE_KEY = 'quran_app_guest_hifz_v1';

const getTodayKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'demo-user-1',
  name: 'Ahmad Fathan',
  email: 'ahmad.fathan@example.com',
  password: 'password123',
  avatarColor: 'from-emerald-600 to-teal-700',
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 35, // 35 days ago
  dailyAyahTarget: 10,
  dailyReadingMinutesTarget: 15,
  streakDays: 5,
  lastActiveDate: getTodayKey(),
  totalReadingMinutes: 185,
  completedSurahs: [1, 36, 55, 67, 112, 113, 114],
  hifzRecords: {
    1: {
      surahNumber: 1,
      memorizedAyahs: [1, 2, 3, 4, 5, 6, 7],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
    67: {
      surahNumber: 67,
      memorizedAyahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      isFullyMemorized: false,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    93: {
      surahNumber: 93,
      memorizedAyahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    94: {
      surahNumber: 94,
      memorizedAyahs: [1, 2, 3, 4, 5, 6, 7, 8],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    108: {
      surahNumber: 108,
      memorizedAyahs: [1, 2, 3],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 12,
    },
    112: {
      surahNumber: 112,
      memorizedAyahs: [1, 2, 3, 4],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 20,
    },
    113: {
      surahNumber: 113,
      memorizedAyahs: [1, 2, 3, 4, 5],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 20,
    },
    114: {
      surahNumber: 114,
      memorizedAyahs: [1, 2, 3, 4, 5, 6],
      isFullyMemorized: true,
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 20,
    },
  },
  prayerChecklist: {
    [getTodayKey()]: {
      subuh: true,
      dzuhur: true,
      ashar: true,
      maghrib: false,
      isya: false,
      dhuha: true,
    },
  },
  notes: [
    {
      id: 'note-1',
      title: 'Tadabbur QS. Al-Baqarah: 286',
      content: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Pengingat saat menghadapi ujian berat.',
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 286,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: 'note-2',
      title: 'Ketenangan Jiwa di QS. Ar-Ra’d: 28',
      content: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram. Perbanyak dzikir pagi dan petang.',
      surahNumber: 13,
      surahName: 'Ar-Ra’d',
      ayahNumber: 28,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
  ],
  dailyAyahsProgress: {
    [getTodayKey()]: 7,
  },
};

// Retrieve all stored registered users
export const getStoredUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return [DEFAULT_DEMO_USER];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_USER];
  } catch {
    return [DEFAULT_DEMO_USER];
  }
};

// Save users array to storage
export const saveStoredUsers = (users: UserProfile[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
};

// Retrieve currently active logged-in user
export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Set active logged-in user
export const setCurrentUser = (user: UserProfile | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to set current user', err);
  }
};

// Register a new user
export const registerUser = (
  name: string,
  email: string,
  password: string,
  dailyAyahTarget: number = 10
): { success: boolean; user?: UserProfile; error?: string } => {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim()) {
    return { success: false, error: 'Nama lengkap wajib diisi' };
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'Format email tidak valid' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password minimal 6 karakter' };
  }

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'Email sudah terdaftar. Silakan login.' };
  }

  const avatarColors = [
    'from-emerald-600 to-teal-700',
    'from-teal-600 to-emerald-800',
    'from-amber-600 to-emerald-700',
    'from-blue-600 to-teal-700',
    'from-indigo-600 to-emerald-800',
  ];
  const chosenColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newUser: UserProfile = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    avatarColor: chosenColor,
    joinedAt: Date.now(),
    dailyAyahTarget: dailyAyahTarget || 10,
    dailyReadingMinutesTarget: 15,
    streakDays: 1,
    lastActiveDate: getTodayKey(),
    totalReadingMinutes: 0,
    completedSurahs: [],
    prayerChecklist: {
      [getTodayKey()]: {},
    },
    notes: [],
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
};

// Login user
export const loginUser = (
  email: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } => {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const found = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!found) {
    return { success: false, error: 'Email atau password salah' };
  }

  // Check and update streak
  const today = getTodayKey();
  let updatedStreak = found.streakDays;
  if (found.lastActiveDate !== today) {
    // If last active was yesterday, increment streak; otherwise reset to 1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (found.lastActiveDate === yesterdayStr) {
      updatedStreak += 1;
    } else {
      updatedStreak = 1;
    }
  }

  const updatedUser: UserProfile = {
    ...found,
    streakDays: updatedStreak,
    lastActiveDate: today,
  };

  const updatedUsers = users.map((u) => (u.id === found.id ? updatedUser : u));
  saveStoredUsers(updatedUsers);
  setCurrentUser(updatedUser);

  return { success: true, user: updatedUser };
};

// Update current user profile
export const updateCurrentUserProfile = (
  updates: Partial<UserProfile>
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = { ...current, ...updates };
  const users = getStoredUsers().map((u) => (u.id === current.id ? updated : u));

  saveStoredUsers(users);
  setCurrentUser(updated);
  return updated;
};

// Toggle prayer check in checklist
export const togglePrayerStatus = (
  dateKey: string,
  prayerName: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'dhuha' | 'tahajjud'
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const dayChecks = current.prayerChecklist[dateKey] || {};
  const newStatus = !dayChecks[prayerName];

  const updatedPrayerChecklist = {
    ...current.prayerChecklist,
    [dateKey]: {
      ...dayChecks,
      [prayerName]: newStatus,
    },
  };

  return updateCurrentUserProfile({ prayerChecklist: updatedPrayerChecklist });
};

// Add a reflection note
export const addNoteToUser = (
  note: Omit<ReflectionNote, 'id' | 'createdAt'>
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const newNote: ReflectionNote = {
    ...note,
    id: `note_${Date.now()}`,
    createdAt: Date.now(),
  };

  const updatedNotes = [newNote, ...current.notes];
  return updateCurrentUserProfile({ notes: updatedNotes });
};

// Delete a reflection note
export const deleteNoteFromUser = (noteId: string): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const updatedNotes = current.notes.filter((n) => n.id !== noteId);
  return updateCurrentUserProfile({ notes: updatedNotes });
};

// Toggle a completed surah for khatam tracker
export const toggleCompletedSurah = (surahNumber: number): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const list = current.completedSurahs || [];
  const exists = list.includes(surahNumber);
  const updatedList = exists
    ? list.filter((n) => n !== surahNumber)
    : [...list, surahNumber].sort((a, b) => a - b);

  return updateCurrentUserProfile({ completedSurahs: updatedList });
};

// Login or register with Google OAuth profile
export const loginWithGoogleProfile = (googleUser: {
  email: string;
  name: string;
  avatarUrl?: string;
}): UserProfile => {
  const users = getStoredUsers();
  const normalizedEmail = googleUser.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    const today = getTodayKey();
    let updatedStreak = existing.streakDays;
    if (existing.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (existing.lastActiveDate === yesterdayStr) {
        updatedStreak += 1;
      } else {
        updatedStreak = 1;
      }
    }
    const updatedUser: UserProfile = {
      ...existing,
      name: googleUser.name || existing.name,
      streakDays: updatedStreak,
      lastActiveDate: today,
    };
    const updatedUsers = users.map((u) => (u.id === existing.id ? updatedUser : u));
    saveStoredUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return updatedUser;
  }

  // Create new user from Google profile
  const newUser: UserProfile = {
    id: `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: googleUser.name || 'Pengguna Google',
    email: normalizedEmail,
    avatarColor: 'from-blue-600 to-indigo-700',
    joinedAt: Date.now(),
    dailyAyahTarget: 10,
    dailyReadingMinutesTarget: 15,
    streakDays: 1,
    lastActiveDate: getTodayKey(),
    totalReadingMinutes: 0,
    completedSurahs: [],
    prayerChecklist: {
      [getTodayKey()]: {},
    },
    notes: [],
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setCurrentUser(newUser);
  return newUser;
};

// Update or increment today's read ayat count
export const updateTodayAyahsProgress = (
  value: number,
  isDelta: boolean = false
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const today = getTodayKey();
  const currentProgressMap = current.dailyAyahsProgress || {};
  const currentTodayCount = currentProgressMap[today] || 0;
  const newCount = Math.max(0, isDelta ? currentTodayCount + value : value);

  return updateCurrentUserProfile({
    dailyAyahsProgress: {
      ...currentProgressMap,
      [today]: newCount,
    },
  });
};

// Update daily ayah target
export const updateDailyAyahTarget = (target: number): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;
  const cleanTarget = Math.max(1, Math.min(6236, target));
  return updateCurrentUserProfile({ dailyAyahTarget: cleanTarget });
};

// ==========================================
// HIFZ TRACKER (HAFALAN AL-QUR'AN) FUNCTIONS
// ==========================================

export const getGuestHifzRecords = (): Record<number, HifzRecord> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GUEST_HIFZ_STORAGE_KEY);
    if (!raw) {
      // Default guest sample: Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas
      const initial: Record<number, HifzRecord> = {
        1: {
          surahNumber: 1,
          memorizedAyahs: [1, 2, 3, 4, 5, 6, 7],
          isFullyMemorized: true,
          lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 5,
        },
        112: {
          surahNumber: 112,
          memorizedAyahs: [1, 2, 3, 4],
          isFullyMemorized: true,
          lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 5,
        },
        113: {
          surahNumber: 113,
          memorizedAyahs: [1, 2, 3, 4, 5],
          isFullyMemorized: true,
          lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 5,
        },
        114: {
          surahNumber: 114,
          memorizedAyahs: [1, 2, 3, 4, 5, 6],
          isFullyMemorized: true,
          lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 5,
        },
        67: {
          surahNumber: 67,
          memorizedAyahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          isFullyMemorized: false,
          lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 1,
        },
      };
      localStorage.setItem(GUEST_HIFZ_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveGuestHifzRecords = (records: Record<number, HifzRecord>): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_HIFZ_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save guest hifz records', err);
  }
};

// Toggle full surah memorized status
export const toggleSurahHifz = (
  surahNumber: number,
  totalAyahs: number,
  forceState?: boolean
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const records = { ...(current.hifzRecords || {}) };
  const existing = records[surahNumber];
  const isCurrentlyFull = existing?.isFullyMemorized ?? false;
  const shouldBeFull = forceState !== undefined ? forceState : !isCurrentlyFull;

  if (shouldBeFull) {
    const allAyahs = Array.from({ length: totalAyahs }, (_, i) => i + 1);
    records[surahNumber] = {
      surahNumber,
      memorizedAyahs: allAyahs,
      isFullyMemorized: true,
      lastUpdated: Date.now(),
    };
  } else {
    records[surahNumber] = {
      surahNumber,
      memorizedAyahs: [],
      isFullyMemorized: false,
      lastUpdated: Date.now(),
    };
  }

  return updateCurrentUserProfile({ hifzRecords: records });
};

// Toggle a specific ayah memorized in a surah
export const toggleAyahHifz = (
  surahNumber: number,
  ayahNumber: number,
  totalAyahs: number
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const records = { ...(current.hifzRecords || {}) };
  const existing = records[surahNumber];
  const currentAyahs = existing?.memorizedAyahs ? [...existing.memorizedAyahs] : [];

  let newAyahs: number[];
  if (currentAyahs.includes(ayahNumber)) {
    newAyahs = currentAyahs.filter((a) => a !== ayahNumber);
  } else {
    newAyahs = [...currentAyahs, ayahNumber].sort((a, b) => a - b);
  }

  const isFull = newAyahs.length >= totalAyahs && totalAyahs > 0;

  records[surahNumber] = {
    surahNumber,
    memorizedAyahs: newAyahs,
    isFullyMemorized: isFull,
    lastUpdated: Date.now(),
  };

  return updateCurrentUserProfile({ hifzRecords: records });
};

// Set custom range or list of memorized ayahs for a surah
export const setSurahMemorizedAyahs = (
  surahNumber: number,
  ayahs: number[],
  totalAyahs: number
): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const records = { ...(current.hifzRecords || {}) };
  const cleanAyahs = Array.from(new Set(ayahs))
    .filter((a) => a >= 1 && a <= totalAyahs)
    .sort((a, b) => a - b);

  const isFull = cleanAyahs.length >= totalAyahs && totalAyahs > 0;

  records[surahNumber] = {
    surahNumber,
    memorizedAyahs: cleanAyahs,
    isFullyMemorized: isFull,
    lastUpdated: Date.now(),
  };

  return updateCurrentUserProfile({ hifzRecords: records });
};

// Reset all memorization for a surah
export const resetSurahHifz = (surahNumber: number): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;

  const records = { ...(current.hifzRecords || {}) };
  delete records[surahNumber];

  return updateCurrentUserProfile({ hifzRecords: records });
};


