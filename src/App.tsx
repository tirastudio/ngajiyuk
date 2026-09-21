import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { SurahListView } from './components/SurahListView';
import { QuranReaderView } from './components/QuranReaderView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { AiAssistantView } from './components/AiAssistantView';
import { AmalanDoaView } from './components/AmalanDoaView';
import { FiqihZakatView } from './components/FiqihZakatView';
import { BookmarksModal } from './components/BookmarksModal';
import { SearchModal } from './components/SearchModal';
import { ShareModal } from './components/ShareModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ThemeBackground } from './components/ThemeBackground';
import { Bookmark, LastRead, Ayah } from './types/quran';
import { UserProfile } from './types/auth';
import { getCurrentUser, setCurrentUser as persistCurrentUser } from './utils/authStore';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('quran');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [targetAyahNumber, setTargetAyahNumber] = useState<number | undefined>(undefined);

  // User Authentication State
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => getCurrentUser());

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    persistCurrentUser(null);
    setCurrentUserState(null);
  };

  // Local storage persisted state
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('quran_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ngajiyuk_theme') || localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  // Apply theme class to <html> and sync localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      try {
        localStorage.setItem('ngajiyuk_theme', theme);
        localStorage.setItem('theme', theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modal states
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{ isOpen: boolean; title: string; text: string }>({
    isOpen: false,
    title: '',
    text: '',
  });

  // AI navigation targets
  const [aiTheme, setAiTheme] = useState<string>('');
  const [aiSummarySurah, setAiSummarySurah] = useState<{ number: number; name: string } | null>(null);

  // Audio player state
  const [currentAyahAudioUrl, setCurrentAyahAudioUrl] = useState<string | null>(null);
  const [currentAyahId, setCurrentAyahId] = useState<string | null>(null);
  const [audioSurahName, setAudioSurahName] = useState<string>('');
  const [audioAyahNumber, setAudioAyahNumber] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioRepeatCount, setAudioRepeatCount] = useState<number>(1);
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState<number>(1);
  const audioRepeatCountRef = useRef<number>(1);
  const currentRepeatIterationRef = useRef<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Sync lastRead to localStorage
  const handleSetLastRead = (item: LastRead) => {
    setLastRead(item);
    try {
      localStorage.setItem('quran_last_read', JSON.stringify(item));
    } catch {
      // ignore
    }
  };

  const handleToggleBookmark = (newBm: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const existingIndex = bookmarks.findIndex(
      (b) => b.surahNumber === newBm.surahNumber && b.ayahNumber === newBm.ayahNumber
    );

    if (existingIndex > -1) {
      setBookmarks((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      const created: Bookmark = {
        ...newBm,
        id: `${newBm.surahNumber}_${newBm.ayahNumber}_${Date.now()}`,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [created, ...prev]);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearAllBookmarks = () => {
    if (window.confirm('Yakin ingin menghapus semua bookmark?')) {
      setBookmarks([]);
    }
  };

  const handleSelectSurah = (surahNumber: number, targetAyah?: number) => {
    setSelectedSurahNumber(surahNumber);
    setTargetAyahNumber(targetAyah);
    setActiveTab('quran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiRecommendation = (theme: string) => {
    setAiTheme(theme);
    setActiveTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiSummary = (surahNumber: number, surahName: string) => {
    setAiSummarySurah({ number: surahNumber, name: surahName });
    setActiveTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShare = (text: string, title: string) => {
    setShareData({
      isOpen: true,
      title,
      text,
    });
  };

  // Audio playback handler
  const handlePlayAyahAudio = (ayah: Ayah, surahName: string) => {
    const ayahAudioId = `${selectedSurahNumber}_${ayah.numberInSurah}`;
    const audioUrl = ayah.audio?.primary;

    if (!audioUrl) return;

    if (currentAyahId === ayahAudioId && isPlayingAudio) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      return;
    }

    // Play new audio
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    setCurrentAyahId(ayahAudioId);
    setCurrentAyahAudioUrl(audioUrl);
    setAudioSurahName(surahName);
    setAudioAyahNumber(ayah.numberInSurah);
    setIsPlayingAudio(true);
    currentRepeatIterationRef.current = 1;
    setCurrentRepeatIteration(1);

    audioRef.current.play().catch((err) => {
      console.warn('Audio play error:', err);
      setIsPlayingAudio(false);
    });

    audioRef.current.ontimeupdate = () => {
      if (audioRef.current && audioRef.current.duration) {
        setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    };

    audioRef.current.onended = () => {
      const maxLoops = audioRepeatCountRef.current;
      const currentLoop = currentRepeatIterationRef.current;

      if (maxLoops > 1 && (maxLoops >= 999 || currentLoop < maxLoops)) {
        const nextLoop = currentLoop + 1;
        currentRepeatIterationRef.current = nextLoop;
        setCurrentRepeatIteration(nextLoop);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.warn('Loop playback failed:', e));
        }
      } else {
        setIsPlayingAudio(false);
        setAudioProgress(0);
        currentRepeatIterationRef.current = 1;
        setCurrentRepeatIteration(1);
      }
    };
  };

  const handleTogglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const handleCloseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setCurrentAyahId(null);
    setCurrentAyahAudioUrl(null);
  };

  return (
    <div className="min-h-screen bg-transparent text-stone-900 dark:text-stone-100 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100 transition-colors duration-200 relative">
      {/* Immersive Islamic Theme Background (Desert for Light, Lailatul Qadr for Dark) */}
      <ThemeBackground theme={theme} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'quran') {
            setSelectedSurahNumber(null);
          }
        }}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        audioPlayingSurah={isPlayingAudio ? audioSurahName : null}
        onJumpToAudio={() => {
          if (selectedSurahNumber) {
            setActiveTab('quran');
          }
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container - Optimized for small mobile screens */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-24 md:pb-12">
        {activeTab === 'quran' && !selectedSurahNumber && (
          <SurahListView
            onSelectSurah={handleSelectSurah}
            lastRead={lastRead}
            onOpenAiRecommendation={handleOpenAiRecommendation}
          />
        )}

        {activeTab === 'quran' && selectedSurahNumber && (
          <QuranReaderView
            surahNumber={selectedSurahNumber}
            initialAyahNumber={targetAyahNumber}
            onBack={() => setSelectedSurahNumber(null)}
            onSelectSurah={handleSelectSurah}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSetLastRead={handleSetLastRead}
            onOpenShare={handleOpenShare}
            onOpenAISummary={handleOpenAiSummary}
            onPlayAyahAudio={handlePlayAyahAudio}
            currentPlayingAyahId={currentAyahId}
            isPlayingAudio={isPlayingAudio}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {activeTab === 'sholat' && (
          <PrayerTimesView onOpenShare={handleOpenShare} />
        )}

        {activeTab === 'ai' && (
          <AiAssistantView
            initialTheme={aiTheme}
            initialSurahForSummary={aiSummarySurah}
            onSelectSurah={handleSelectSurah}
          />
        )}

        {activeTab === 'bacaan' && (
          <AmalanDoaView onOpenShare={handleOpenShare} />
        )}

        {activeTab === 'fiqih' && (
          <FiqihZakatView />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            lastRead={lastRead}
            bookmarks={bookmarks}
            onContinueReading={handleSelectSurah}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Sticky Audio Player Bar */}
      {currentAyahAudioUrl && (
        <AudioPlayerBar
          surahName={audioSurahName}
          ayahNumber={audioAyahNumber}
          isPlaying={isPlayingAudio}
          onTogglePlay={handleTogglePlayAudio}
          onClose={handleCloseAudio}
          progress={audioProgress}
          repeatCount={audioRepeatCount}
          currentIteration={currentRepeatIteration}
          onChangeRepeatCount={(count) => {
            setAudioRepeatCount(count);
            audioRepeatCountRef.current = count;
            setCurrentRepeatIteration(1);
            currentRepeatIterationRef.current = 1;
          }}
        />
      )}

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectSurah}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSurah={handleSelectSurah}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ isOpen: false, title: '', text: '' })}
        title={shareData.title}
        text={shareData.text}
      />

      {/* Authentication Modal with Google OAuth Social Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Enhanced Multi-Device Footer */}
      <Footer
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedSurahNumber(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectSurah={(surahNumber, ayahNumber) => {
          setSelectedSurahNumber(surahNumber);
          setTargetAyahNumber(ayahNumber);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}
export default App;
