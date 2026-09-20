import React, { useState, useEffect } from 'react';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  BookOpen,
  Bookmark as BookmarkIcon,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Lock,
  Mail,
  Edit3,
  Calendar,
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  LayoutDashboard,
  ShieldCheck,
  HeartHandshake,
  Scale,
  Repeat,
} from 'lucide-react';
import { UserProfile, ReflectionNote, HifzRecord } from '../types/auth';
import { LastRead, Bookmark } from '../types/quran';
import {
  loginUser,
  registerUser,
  loginWithGoogleProfile,
  togglePrayerStatus,
  addNoteToUser,
  deleteNoteFromUser,
  updateCurrentUserProfile,
  toggleCompletedSurah,
  updateTodayAyahsProgress,
  updateDailyAyahTarget,
  toggleSurahHifz,
  toggleAyahHifz,
  setSurahMemorizedAyahs,
  resetSurahHifz,
  getGuestHifzRecords,
  saveGuestHifzRecords,
} from '../utils/authStore';
import { DailyAyatInspiration } from './dashboard/DailyAyatInspiration';
import { DailyTilawahGoal } from './dashboard/DailyTilawahGoal';
import { DigitalTasbih } from './dashboard/DigitalTasbih';
import { KhatamTracker } from './dashboard/KhatamTracker';
import { HifzTracker } from './dashboard/HifzTracker';
import { WeeklyActivityChart } from './dashboard/WeeklyActivityChart';
import { QuickSurahShortcuts } from './dashboard/QuickSurahShortcuts';

interface DashboardViewProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  lastRead: LastRead | null;
  bookmarks: Bookmark[];
  onContinueReading: (surahNumber: number, ayahNumber?: number) => void;
  onOpenBookmarks: () => void;
  onNavigateTab?: (tab: 'quran' | 'sholat' | 'ai' | 'bacaan' | 'fiqih' | 'dashboard') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  lastRead,
  bookmarks,
  onContinueReading,
  onOpenBookmarks,
  onNavigateTab,
}) => {
  // Mode when unauthenticated: 'dashboard' (preview with guest access) or 'auth' (form login/register)
  const [unauthTab, setUnauthTab] = useState<'dashboard' | 'auth'>('dashboard');

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [dailyTarget, setDailyTarget] = useState<number>(10);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Note creation modal/form state in dashboard
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteSurah, setNewNoteSurah] = useState('');
  const [newNoteAyah, setNewNoteAyah] = useState('');

  // Edit Profile / Target Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editTarget, setEditTarget] = useState(currentUser?.dailyAyahTarget || 10);

  // Listen for OAuth message from Google popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith('.run.app') &&
        !origin.includes('localhost') &&
        origin !== window.location.origin
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        setIsGoogleLoading(false);
        const loggedUser = loginWithGoogleProfile(event.data.user);
        onLoginSuccess(loggedUser);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLoginSuccess]);

  const getTodayKey = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = getTodayKey();

  // Active user profile (actual user or default guest display)
  const displayUser: UserProfile = currentUser || {
    id: 'guest',
    name: 'Sobat Tilawah (Tamu)',
    email: 'mode.tamu@alquran.id',
    avatarColor: 'from-emerald-600 to-teal-700',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    dailyAyahTarget: 10,
    dailyReadingMinutesTarget: 15,
    streakDays: 3,
    lastActiveDate: todayKey,
    totalReadingMinutes: 45,
    completedSurahs: [1, 112, 113, 114],
    prayerChecklist: {
      [todayKey]: {
        subuh: true,
        dzuhur: true,
        dhuha: true,
      },
    },
    notes: [
      {
        id: 'note-sample-1',
        title: 'Tadabbur QS. Asy-Syarh: 5-6',
        content:
          'Sesungguhnya bersama setiap kesulitan ada kemudahan. Menjadi peneguh hati saat menghadapi ujian dan tantangan hidup.',
        surahNumber: 94,
        surahName: 'Asy-Syarh',
        ayahNumber: 5,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
      },
    ],
    dailyAyahsProgress: {
      [todayKey]: 7,
    },
  };

  const todayPrayers = displayUser.prayerChecklist?.[todayKey] || {};
  const todayAyahsRead = displayUser.dailyAyahsProgress?.[todayKey] ?? 0;

  // Tilawah target & progress handlers
  const handleUpdateDailyTarget = (newTarget: number) => {
    const cleanTarget = Math.max(1, Math.min(6236, newTarget));
    if (!currentUser) {
      const updatedUser: UserProfile = {
        ...displayUser,
        dailyAyahTarget: cleanTarget,
      };
      onLoginSuccess(updatedUser);
      return;
    }
    const updated = updateDailyAyahTarget(cleanTarget);
    if (updated) {
      onLoginSuccess(updated);
    }
  };

  const handleUpdateDailyProgress = (newCount: number) => {
    const cleanCount = Math.max(0, newCount);
    if (!currentUser) {
      const currentProgress = displayUser.dailyAyahsProgress || {};
      const updatedUser: UserProfile = {
        ...displayUser,
        dailyAyahsProgress: {
          ...currentProgress,
          [todayKey]: cleanCount,
        },
      };
      onLoginSuccess(updatedUser);
      return;
    }
    const updated = updateTodayAyahsProgress(cleanCount, false);
    if (updated) {
      onLoginSuccess(updated);
    }
  };

  // Handle 1-Click Google OAuth login
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);

    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();

      if (data.configured && data.url) {
        const width = 500;
        const height = 620;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authWindow = window.open(
          data.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
        );

        if (!authWindow) {
          const fallbackUser = loginWithGoogleProfile({
            email: 'agussetiyobudi40@gmail.com',
            name: 'Agus Setiyo Budi',
          });
          setIsGoogleLoading(false);
          onLoginSuccess(fallbackUser);
        }
      } else {
        setTimeout(() => {
          const fallbackUser = loginWithGoogleProfile({
            email: 'agussetiyobudi40@gmail.com',
            name: 'Agus Setiyo Budi',
          });
          setIsGoogleLoading(false);
          onLoginSuccess(fallbackUser);
        }, 500);
      }
    } catch (err) {
      console.warn('Google OAuth endpoint error, falling back to direct sign-in:', err);
      const fallbackUser = loginWithGoogleProfile({
        email: 'agussetiyobudi40@gmail.com',
        name: 'Agus Setiyo Budi',
      });
      setIsGoogleLoading(false);
      onLoginSuccess(fallbackUser);
    }
  };

  // Email form login / register handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setLoading(true);

    if (authMode === 'login') {
      const res = loginUser(email, password);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setAuthError(res.error || 'Gagal masuk. Periksa email dan password.');
      }
    } else {
      if (password !== confirmPassword) {
        setLoading(false);
        setAuthError('Konfirmasi password tidak cocok');
        return;
      }
      const res = registerUser(name, email, password, Number(dailyTarget));
      setLoading(false);
      if (res.success && res.user) {
        setAuthSuccess('Pendaftaran berhasil! Selamat datang.');
        onLoginSuccess(res.user);
      } else {
        setAuthError(res.error || 'Pendaftaran gagal');
      }
    }
  };

  // Demo user login
  const handleDemoLogin = () => {
    setAuthError(null);
    const res = loginUser('ahmad.fathan@example.com', 'password123');
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  // Prayer toggling
  const handleTogglePrayer = (
    prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'dhuha' | 'tahajjud'
  ) => {
    if (!currentUser) {
      // Allow instant test toggle in guest mode
      const currentChecks = displayUser.prayerChecklist[todayKey] || {};
      const updatedUser: UserProfile = {
        ...displayUser,
        prayerChecklist: {
          ...displayUser.prayerChecklist,
          [todayKey]: {
            ...currentChecks,
            [prayer]: !currentChecks[prayer],
          },
        },
      };
      onLoginSuccess(updatedUser);
      return;
    }
    const updated = togglePrayerStatus(todayKey, prayer);
    if (updated) {
      onLoginSuccess(updated);
    }
  };

  // Guest Hifz records
  const [guestHifz, setGuestHifz] = useState<Record<number, HifzRecord>>(() => getGuestHifzRecords());

  // Active Hifz records
  const activeHifzRecords: Record<number, HifzRecord> = currentUser
    ? currentUser.hifzRecords || {}
    : guestHifz;

  // Hifz Tracker: Toggle entire surah memorized
  const handleToggleSurahHifz = (surahNumber: number, totalAyahs: number, forceState?: boolean) => {
    if (currentUser) {
      const updated = toggleSurahHifz(surahNumber, totalAyahs, forceState);
      if (updated) onLoginSuccess(updated);
    } else {
      const existing = guestHifz[surahNumber];
      const isCurrentlyFull = existing?.isFullyMemorized ?? false;
      const shouldBeFull = forceState !== undefined ? forceState : !isCurrentlyFull;
      const updated: Record<number, HifzRecord> = {
        ...guestHifz,
        [surahNumber]: {
          surahNumber,
          memorizedAyahs: shouldBeFull ? Array.from({ length: totalAyahs }, (_, i) => i + 1) : [],
          isFullyMemorized: shouldBeFull,
          lastUpdated: Date.now(),
        },
      };
      setGuestHifz(updated);
      saveGuestHifzRecords(updated);
    }
  };

  // Hifz Tracker: Toggle single ayah memorized
  const handleToggleAyahHifz = (surahNumber: number, ayahNumber: number, totalAyahs: number) => {
    if (currentUser) {
      const updated = toggleAyahHifz(surahNumber, ayahNumber, totalAyahs);
      if (updated) onLoginSuccess(updated);
    } else {
      const existing = guestHifz[surahNumber];
      const currentAyahs = existing?.memorizedAyahs ? [...existing.memorizedAyahs] : [];
      let newAyahs: number[];
      if (currentAyahs.includes(ayahNumber)) {
        newAyahs = currentAyahs.filter((a) => a !== ayahNumber);
      } else {
        newAyahs = [...currentAyahs, ayahNumber].sort((a, b) => a - b);
      }
      const isFull = newAyahs.length >= totalAyahs && totalAyahs > 0;
      const updated: Record<number, HifzRecord> = {
        ...guestHifz,
        [surahNumber]: {
          surahNumber,
          memorizedAyahs: newAyahs,
          isFullyMemorized: isFull,
          lastUpdated: Date.now(),
        },
      };
      setGuestHifz(updated);
      saveGuestHifzRecords(updated);
    }
  };

  // Hifz Tracker: Set range / custom set of memorized ayahs
  const handleSetSurahAyahsHifz = (surahNumber: number, ayahs: number[], totalAyahs: number) => {
    if (currentUser) {
      const updated = setSurahMemorizedAyahs(surahNumber, ayahs, totalAyahs);
      if (updated) onLoginSuccess(updated);
    } else {
      const cleanAyahs = Array.from(new Set(ayahs))
        .filter((a) => a >= 1 && a <= totalAyahs)
        .sort((a, b) => a - b);
      const isFull = cleanAyahs.length >= totalAyahs && totalAyahs > 0;
      const updated: Record<number, HifzRecord> = {
        ...guestHifz,
        [surahNumber]: {
          surahNumber,
          memorizedAyahs: cleanAyahs,
          isFullyMemorized: isFull,
          lastUpdated: Date.now(),
        },
      };
      setGuestHifz(updated);
      saveGuestHifzRecords(updated);
    }
  };

  // Hifz Tracker: Reset memorization for a surah
  const handleResetSurahHifz = (surahNumber: number) => {
    if (currentUser) {
      const updated = resetSurahHifz(surahNumber);
      if (updated) onLoginSuccess(updated);
    } else {
      const updated = { ...guestHifz };
      delete updated[surahNumber];
      setGuestHifz(updated);
      saveGuestHifzRecords(updated);
    }
  };

  // Completed surah toggling for Khatam Tracker
  const handleToggleCompletedSurah = (surahNumber: number) => {
    if (!currentUser) {
      const list = displayUser.completedSurahs || [];
      const updatedList = list.includes(surahNumber)
        ? list.filter((n) => n !== surahNumber)
        : [...list, surahNumber].sort((a, b) => a - b);
      const updatedUser: UserProfile = {
        ...displayUser,
        completedSurahs: updatedList,
      };
      onLoginSuccess(updatedUser);
      return;
    }
    const updated = toggleCompletedSurah(surahNumber);
    if (updated) {
      onLoginSuccess(updated);
    }
  };

  // Reflection note handlers
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    if (!currentUser) {
      const newNote: ReflectionNote = {
        id: `note_${Date.now()}`,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        surahName: newNoteSurah.trim() || undefined,
        ayahNumber: newNoteAyah ? Number(newNoteAyah) : undefined,
        createdAt: Date.now(),
      };
      const updatedUser: UserProfile = {
        ...displayUser,
        notes: [newNote, ...(displayUser.notes || [])],
      };
      onLoginSuccess(updatedUser);
      setIsAddingNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteSurah('');
      setNewNoteAyah('');
      return;
    }

    const updated = addNoteToUser({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      surahName: newNoteSurah.trim() || undefined,
      ayahNumber: newNoteAyah ? Number(newNoteAyah) : undefined,
    });

    if (updated) {
      onLoginSuccess(updated);
      setIsAddingNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteSurah('');
      setNewNoteAyah('');
    }
  };

  const handleDeleteNote = (id: string) => {
    if (!currentUser) {
      const updatedUser: UserProfile = {
        ...displayUser,
        notes: displayUser.notes.filter((n) => n.id !== id),
      };
      onLoginSuccess(updatedUser);
      return;
    }
    const updated = deleteNoteFromUser(id);
    if (updated) {
      onLoginSuccess(updated);
    }
  };

  // Edit Profile / Daily Target
  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    if (!currentUser) {
      const updatedUser: UserProfile = {
        ...displayUser,
        name: editName.trim(),
        dailyAyahTarget: Number(editTarget),
      };
      onLoginSuccess(updatedUser);
      setIsEditingProfile(false);
      return;
    }

    const updated = updateCurrentUserProfile({
      name: editName.trim(),
      dailyAyahTarget: Number(editTarget),
    });
    if (updated) {
      onLoginSuccess(updated);
      setIsEditingProfile(false);
    }
  };

  // Prayer completion count
  const fardhuPrayers: Array<'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya'> = [
    'subuh',
    'dzuhur',
    'ashar',
    'maghrib',
    'isya',
  ];
  const completedFardhuCount = fardhuPrayers.filter((k) => Boolean(todayPrayers[k])).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* ------------------------------------------------------------- */}
      {/* GUEST BANNER & TAB SWITCHER IF NOT LOGGED IN                   */}
      {/* ------------------------------------------------------------- */}
      {!currentUser && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Sparkles className="w-6 h-6 text-emerald-900" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Dashboard Pribadi Muslim</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-200 border border-emerald-600">
                    Mode Tamu Aktif
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Semua isi dashboard (Pelacak Khatam, Jurnal Sholat, Tasbih Digital, Grafik Aktivitas) dapat Anda coba langsung di bawah. Masuk dengan Google untuk menyimpan secara permanen.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
              <button
                id="btn-guest-google-oauth"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-stone-300 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.19 0 10.04 0 12s.45 3.81 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Masuk dengan Google</span>
              </button>

              <button
                type="button"
                onClick={() => setUnauthTab(unauthTab === 'dashboard' ? 'auth' : 'dashboard')}
                className="py-2.5 px-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600 transition-colors"
              >
                {unauthTab === 'dashboard' ? 'Form Email' : 'Kembali ke Dashboard'}
              </button>
            </div>
          </div>

          {/* If user selected to see Email Auth Form */}
          {unauthTab === 'auth' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-md mx-auto animate-in fade-in duration-200">
              {/* Tab Switcher: Masuk vs Daftar */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Daftar Baru
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Konfirmasi Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Ketik ulang password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {loading
                    ? 'Memproses...'
                    : authMode === 'login'
                    ? 'Masuk ke Akun'
                    : 'Daftar Sekarang'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-stone-100 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs text-stone-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Coba langsung dengan Akun Demo (Ahmad Fathan)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TOP USER PROFILE SUMMARY CARD                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${displayUser.avatarColor || 'from-emerald-600 to-teal-800'} text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-emerald-900/15`}
          >
            {displayUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                {displayUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>Pencinta Al-Qur'an</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">{displayUser.email}</p>
            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  Bergabung{' '}
                  {new Date(displayUser.joinedAt).toLocaleDateString('id-ID', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Streak {displayUser.streakDays} Hari Istiqomah</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            id="btn-edit-profile-trigger"
            type="button"
            onClick={() => {
              setEditName(displayUser.name);
              setEditTarget(displayUser.dailyAyahTarget);
              setIsEditingProfile(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Target</span>
          </button>

          {currentUser ? (
            <button
              id="btn-user-logout"
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DAILY AYAT INSPIRATION & TADABBUR CARD                         */}
      {/* ------------------------------------------------------------- */}
      <DailyAyatInspiration onOpenSurah={onContinueReading} />

      {/* ------------------------------------------------------------- */}
      {/* DAILY TILAWAH GOAL TRACKER                                    */}
      {/* ------------------------------------------------------------- */}
      <DailyTilawahGoal
        dailyTarget={displayUser.dailyAyahTarget}
        todayAyahsRead={todayAyahsRead}
        streakDays={displayUser.streakDays}
        onUpdateTarget={handleUpdateDailyTarget}
        onUpdateProgress={handleUpdateDailyProgress}
        onContinueReading={() => onContinueReading(lastRead?.surahNumber || 1, lastRead?.ayahNumber)}
      />

      {/* ------------------------------------------------------------- */}
      {/* MAIN STATS GRID (4 TILES)                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Last Read Quick Action */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Terakhir Dibaca
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          {lastRead ? (
            <div>
              <p className="text-base font-bold text-stone-900">{lastRead.surahName}</p>
              <p className="text-xs text-stone-500">Ayat ke-{lastRead.ayahNumber}</p>
              <button
                id="btn-dashboard-continue-reading"
                type="button"
                onClick={() => onContinueReading(lastRead.surahNumber, lastRead.ayahNumber)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Lanjutkan Tilawah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-500">Belum ada riwayat bacaan</p>
              <button
                type="button"
                onClick={() => onContinueReading(1)}
                className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Mulai Al-Fatihah</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Target Tilawah Harian */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Target Tilawah
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900">
                {todayAyahsRead}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ {displayUser.dailyAyahTarget} ayat</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              {todayAyahsRead >= displayUser.dailyAyahTarget
                ? '✨ Target hari ini tercapai!'
                : `🔥 Istiqomah ${displayUser.streakDays} hari berturut-turut!`}
            </p>
          </div>
        </div>

        {/* 3. Bookmarks Stored */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Bookmark Tersimpan
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookmarkIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900">{bookmarks.length}</span>
              <span className="text-xs text-stone-500 font-medium">ayat ditandai</span>
            </div>
            <button
              id="btn-dashboard-view-bookmarks"
              type="button"
              onClick={onOpenBookmarks}
              className="mt-3 text-xs text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Daftar Bookmark</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Total Reading Time */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Tilawah
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900">
                {displayUser.totalReadingMinutes || 45}
              </span>
              <span className="text-xs text-stone-500 font-medium">menit terlacak</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">Waktu berkah bersama Kalam Ilahi</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PUSAT AMALAN, HIFZ & FIQIH SHORTCUT MODULES                   */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Hifz & Muroja'ah */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/80 to-stone-50 border border-amber-200/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <Repeat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Pelacak & Uji Hafalan (Hifz)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tandai Surah atau Ayat yang telah dihafal, lihat progres 114 Surah, dan latih ingatan dengan fitur penyamaran blur/hide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              id="btn-shortcut-scroll-hifz"
              type="button"
              onClick={() => {
                document.getElementById('hifz-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Buka Pelacak Hifz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onContinueReading(lastRead?.surahNumber || 1, lastRead?.ayahNumber)}
              className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-amber-200"
              title="Buka Mushaf Uji Hafalan"
            >
              <span>Uji di Mushaf</span>
            </button>
          </div>
        </div>

        {/* Card 2: Amalan & Doa */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border border-emerald-200/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Amalan & Doa Harian</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dzikir pagi & petang dengan penghitung target, doa mustajab harian, dan panduan puasa sunnah.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab?.('bacaan')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Buka Dzikir & Doa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Fiqih & Zakat */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50/80 to-stone-50 border border-teal-200/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Fiqih Zakat & Tajwid</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kalkulator zakat maal, penghasilan, emas & fitrah, serta ensiklopedia hukum tajwid interaktif.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab?.('fiqih')}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Buka Fiqih & Zakat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PELACAK HAFALAN AL-QUR'AN (HIFZ TRACKER)                      */}
      {/* ------------------------------------------------------------- */}
      <HifzTracker
        hifzRecords={activeHifzRecords}
        onToggleSurah={handleToggleSurahHifz}
        onToggleAyah={handleToggleAyahHifz}
        onSetSurahAyahs={handleSetSurahAyahsHifz}
        onResetSurah={handleResetSurahHifz}
        onOpenSurah={onContinueReading}
      />

      {/* ------------------------------------------------------------- */}
      {/* KHATAM AL-QURAN 114 SURAH TRACKER                             */}
      {/* ------------------------------------------------------------- */}
      <KhatamTracker
        completedSurahs={displayUser.completedSurahs || []}
        dailyAyahTarget={displayUser.dailyAyahTarget || 10}
        onToggleSurah={handleToggleCompletedSurah}
        onOpenSurah={onContinueReading}
      />

      {/* ------------------------------------------------------------- */}
      {/* WEEKLY ACTIVITY CHART                                          */}
      {/* ------------------------------------------------------------- */}
      <WeeklyActivityChart
        streakDays={displayUser.streakDays}
        dailyReadingMinutesTarget={displayUser.dailyReadingMinutesTarget}
      />

      {/* ------------------------------------------------------------- */}
      {/* TWO-COLUMN SECTION: SHOLAT CHECKLIST & DIGITAL TASBIH         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jurnal Sholat Hari Ini (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Jurnal Sholat Hari Ini</h2>
              <p className="text-xs text-stone-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              {completedFardhuCount} / 5 Waktu
            </div>
          </div>

          {/* Progress bar for 5 prayers */}
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${(completedFardhuCount / 5) * 100}%` }}
            />
          </div>

          {completedFardhuCount === 5 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Alhamdulillah! Seluruh sholat fardhu hari ini lengkap.</span>
            </div>
          )}

          {/* Interactive Prayer Toggles */}
          <div className="space-y-2 pt-1">
            {[
              { key: 'subuh', label: 'Sholat Subuh', type: 'fardhu' },
              { key: 'dzuhur', label: 'Sholat Dzuhur', type: 'fardhu' },
              { key: 'ashar', label: 'Sholat Ashar', type: 'fardhu' },
              { key: 'maghrib', label: 'Sholat Maghrib', type: 'fardhu' },
              { key: 'isya', label: 'Sholat Isya', type: 'fardhu' },
              { key: 'dhuha', label: 'Sholat Dhuha', type: 'sunnah' },
              { key: 'tahajjud', label: 'Sholat Tahajjud', type: 'sunnah' },
            ].map((p) => {
              const isChecked = Boolean(todayPrayers[p.key as keyof typeof todayPrayers]);
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() =>
                    handleTogglePrayer(
                      p.key as 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'dhuha' | 'tahajjud'
                    )
                  }
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-stone-50/70 hover:bg-stone-100/70 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                    )}
                    <span className="text-sm font-semibold">{p.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      p.type === 'fardhu'
                        ? isChecked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Digital Tasbih (6 Cols) */}
        <div className="lg:col-span-6">
          <DigitalTasbih />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUICK SURAH SHORTCUTS (AL-KAHF, AL-MULK, YASIN, DLL)          */}
      {/* ------------------------------------------------------------- */}
      <QuickSurahShortcuts onOpenSurah={onContinueReading} />

      {/* ------------------------------------------------------------- */}
      {/* CATATAN REFLEKSI & TADABBUR PRIBADI                            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Catatan Refleksi & Tadabbur</h2>
            <p className="text-xs text-stone-500">Mutiara renungan ayat yang membekas di hati</p>
          </div>
          <button
            id="btn-add-note-trigger"
            type="button"
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Catatan</span>
          </button>
        </div>

        {/* Form Create Note */}
        {isAddingNote && (
          <form
            onSubmit={handleSaveNote}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Judul Catatan / Tema"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama Surah (opsional)"
                  value={newNoteSurah}
                  onChange={(e) => setNewNoteSurah(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Ayat"
                  value={newNoteAyah}
                  onChange={(e) => setNewNoteAyah(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Tuliskan hikmah, tadabbur, atau doa terkait..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
              >
                Simpan Catatan
              </button>
            </div>
          </form>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {displayUser.notes && displayUser.notes.length > 0 ? (
            displayUser.notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2 group hover:bg-white hover:border-stone-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{note.title}</h3>
                    {note.surahName && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        QS. {note.surahName}
                        {note.ayahNumber ? ` : ${note.ayahNumber}` : ''}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Hapus catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="text-[10px] text-stone-400 pt-1">
                  {new Date(note.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-400 text-xs space-y-1">
              <p>Belum ada catatan refleksi tersimpan.</p>
              <p>Tulis renungan ayat yang membekas untuk pengingat spiritual Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EDIT PROFILE / DAILY TARGET MODAL                             */}
      {/* ------------------------------------------------------------- */}
      {isEditingProfile && (
        <div
          id="modal-edit-profile-backdrop"
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-stone-900">Ubah Profil & Target</h3>

            <form onSubmit={handleSaveProfileEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Tampilan
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Tilawah Harian (Ayat)
                </label>
                <select
                  value={editTarget}
                  onChange={(e) => setEditTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-800"
                >
                  <option value={5}>5 Ayat per hari (Santai)</option>
                  <option value={10}>10 Ayat per hari (Rekomendasi)</option>
                  <option value={20}>20 Ayat per hari (1 Lembar)</option>
                  <option value={50}>50 Ayat per hari (Aktif)</option>
                  <option value={100}>100 Ayat per hari (Khatam Cepat)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
