import React, { useState, useEffect, useRef } from 'react';
import { SurahDetail, Ayah, Bookmark, LastRead } from '../types/quran';
import { fetchSurahDetail } from '../utils/quranApi';
import { SURAH_LIST } from '../data/surahList';
import { TafsirInsightModal } from './TafsirInsightModal';
import {
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Bookmark as BookmarkIcon,
  BookOpen,
  Share2,
  Copy,
  Check,
  Type,
  Sparkles,
  Info,
  Volume2,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

interface QuranReaderViewProps {
  surahNumber: number;
  initialAyahNumber?: number;
  onBack: () => void;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  bookmarks: Bookmark[];
  onToggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  onSetLastRead: (lastRead: LastRead) => void;
  onOpenShare: (text: string, title: string) => void;
  onOpenAISummary: (surahNumber: number, surahName: string) => void;
  onPlayAyahAudio: (ayah: Ayah, surahName: string) => void;
  currentPlayingAyahId: string | null;
  isPlayingAudio: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const QuranReaderView: React.FC<QuranReaderViewProps> = ({
  surahNumber,
  initialAyahNumber,
  onBack,
  onSelectSurah,
  bookmarks,
  onToggleBookmark,
  onSetLastRead,
  onOpenShare,
  onOpenAISummary,
  onPlayAyahAudio,
  currentPlayingAyahId,
  isPlayingAudio,
  theme = 'light',
  onToggleTheme,
}) => {
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reader display preferences
  const [arabicFontSize, setArabicFontSize] = useState<number>(32); // 26, 32, 38, 44
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Tafsir Insight Modal state
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState<Ayah | null>(null);
  const [isTafsirModalOpen, setIsTafsirModalOpen] = useState<boolean>(false);

  const handleOpenTafsir = (ayah: Ayah) => {
    setSelectedAyahForTafsir(ayah);
    setIsTafsirModalOpen(true);
  };

  const handleNavigateTafsirAyah = (newAyahNumber: number) => {
    if (!surahDetail) return;
    const target = surahDetail.ayahs.find((a) => a.numberInSurah === newAyahNumber);
    if (target) {
      setSelectedAyahForTafsir(target);
    }
  };

  // Mode Muroja'ah / Uji Hafalan (Hifz Mode)
  const [isHifzMode, setIsHifzMode] = useState<boolean>(false);
  const [revealedAyahs, setRevealedAyahs] = useState<Record<number, boolean>>({});
  const [hifzMaskMode, setHifzMaskMode] = useState<'blur' | 'hide'>('blur');

  const toggleAyahReveal = (ayahNum: number) => {
    setRevealedAyahs((prev) => ({
      ...prev,
      [ayahNum]: !prev[ayahNum],
    }));
  };

  const revealAllAyahs = () => {
    if (!surahDetail) return;
    const allRevealed: Record<number, boolean> = {};
    surahDetail.ayahs.forEach((a) => {
      allRevealed[a.numberInSurah] = true;
    });
    setRevealedAyahs(allRevealed);
  };

  const hideAllAyahs = () => {
    setRevealedAyahs({});
  };

  // Scroll progress state within current surah (0% - 100%)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Non-intrusive session reading timer (tracks active time spent in seconds)
  const [sessionReadingSeconds, setSessionReadingSeconds] = useState<number>(0);

  // Track active reading duration, pausing automatically if user leaves the tab
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setSessionReadingSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatReadingDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    let textDescription = '';
    if (hours > 0) {
      textDescription = `${hours}j ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      textDescription = `${minutes}m ${seconds}s`;
    } else {
      textDescription = `${seconds}s`;
    }

    const digitalTime = hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

    return { textDescription, digitalTime };
  };

  // Ref to target ayah for smooth scroll
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setScrollProgress(0);
    setShowBackToTop(false);

    fetchSurahDetail(surahNumber)
      .then((data) => {
        if (isMounted) {
          setSurahDetail(data);
          setLoading(false);

          // Save last read on surah open
          onSetLastRead({
            surahNumber: data.number,
            surahName: data.transliteration,
            ayahNumber: initialAyahNumber || 1,
            timestamp: Date.now(),
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat surah. Silakan coba lagi.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  // Track scroll position within surah view and floating Back to Top visibility
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const el = containerRef.current;
            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const containerTop = rect.top + scrollTop;
            const containerHeight = el.offsetHeight;
            const windowHeight = window.innerHeight;

            const scrollableDistance = containerHeight - windowHeight;

            if (scrollableDistance <= 0) {
              setScrollProgress(100);
            } else {
              const currentScroll = scrollTop - containerTop;
              const progress = (currentScroll / scrollableDistance) * 100;
              setScrollProgress(Math.min(100, Math.max(0, progress)));
            }

            // Show floating Back to Top button after scrolling down more than 400px
            setShowBackToTop(scrollTop > 400);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading, surahNumber]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Scroll to initialAyahNumber once loaded
  useEffect(() => {
    if (!loading && initialAyahNumber && ayahRefs.current[initialAyahNumber]) {
      setTimeout(() => {
        ayahRefs.current[initialAyahNumber]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [loading, initialAyahNumber]);

  const handleCopyAyah = (ayah: Ayah) => {
    const textToCopy = `${ayah.text.arab}\n\n${ayah.text.latin ? ayah.text.latin + '\n\n' : ''}"${ayah.text.translation}"\n(QS. ${surahDetail?.transliteration}: ${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedAyah(ayah.numberInSurah);
      setTimeout(() => setCopiedAyah(null), 2000);
    });
  };

  const handleShareAyah = (ayah: Ayah) => {
    const shareText = `Al-Qur'an Surat ${surahDetail?.transliteration} Ayat ${ayah.numberInSurah}\n\n${ayah.text.arab}\n\n${ayah.text.latin ? ayah.text.latin + '\n\n' : ''}Artinya:\n"${ayah.text.translation}"`;
    onOpenShare(shareText, `QS. ${surahDetail?.transliteration}: ${ayah.numberInSurah}`);
  };

  const isBookmarked = (ayahNumber: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  };

  const currentMeta = SURAH_LIST.find((s) => s.number === surahNumber);

  return (
    <div ref={containerRef} className="QuranReaderView max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20 sm:pb-24 relative">
      {/* Fixed Progress Bar at the top of the screen tracking vertical scroll within surah content */}
      <div
        id="quran-reader-scroll-progress"
        className="fixed top-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-stone-200/50 backdrop-blur-xs pointer-events-none"
        role="progressbar"
        aria-label="Progres membaca surah"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-[width] duration-100 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Reader Controls Toolbar - Refactored for seamless mobile & desktop experience */}
      <div className="sticky top-16 sm:top-[72px] z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 relative overflow-hidden transition-colors duration-200">
        {/* Row 1: Back Button + Surah Dropdown Selector + Progress Badge */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
            <button
              id="reader-back-btn"
              onClick={onBack}
              className="p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
              title="Kembali ke Daftar Surah"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Surah Dropdown Selector with responsive width and truncation */}
            <select
              id="reader-surah-dropdown"
              value={surahNumber}
              onChange={(e) => onSelectSurah(Number(e.target.value))}
              className="flex-1 sm:flex-initial max-w-[200px] xs:max-w-[260px] sm:max-w-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-300/80 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 truncate"
            >
              {SURAH_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.transliteration} ({s.translation})
                </option>
              ))}
            </select>
          </div>

          {/* Reading progress percentage badge */}
          <span
            className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-stone-500 dark:text-stone-400 px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200/70 dark:border-stone-700 shrink-0 select-none"
            title={`Progres membaca surah: ${Math.round(scrollProgress)}%`}
          >
            {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Row 2: Secondary Font Size & Display Toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
          {/* Font Size Button Group */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 sm:p-1 border border-stone-200 dark:border-stone-700 shrink-0">
            <button
              onClick={() => setArabicFontSize((prev) => Math.max(22, prev - 3))}
              className="px-1.5 sm:px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              title="Perkecil Font Arab"
            >
              A-
            </button>
            <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-300 px-1 select-none">
              {arabicFontSize}px
            </span>
            <button
              onClick={() => setArabicFontSize((prev) => Math.min(48, prev + 3))}
              className="px-1.5 sm:px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              title="Perbesar Font Arab"
            >
              A+
            </button>
          </div>

          {/* Toggle Latin */}
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
              showLatin
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
            }`}
            title="Tampilkan / Sembunyikan Latin"
          >
            Latin
          </button>

          {/* Toggle Translation */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
              showTranslation
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
            }`}
            title="Tampilkan / Sembunyikan Terjemahan"
          >
            Arti
          </button>

          {/* Mode Hafalan (Hifz) Toggle */}
          <button
            id="reader-hifz-mode-btn"
            onClick={() => setIsHifzMode(!isHifzMode)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              isHifzMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/30'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
            title="Mode Uji Hafalan / Muroja'ah (Samarkan ayat untuk menguji ingatan)"
          >
            {isHifzMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden min-[380px]:inline">Hafalan</span>
          </button>

          {/* AI Summary Button */}
          {surahDetail && (
            <button
              id="reader-ai-summary-btn"
              onClick={() => onOpenAISummary(surahDetail.number, surahDetail.transliteration)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] sm:text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all shrink-0 cursor-pointer"
              title="Buka Ringkasan & Tafsir AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden min-[420px]:inline">Ringkasan AI</span>
            </button>
          )}

          {/* Theme Toggle Button in Reader (Sangat esensial saat membaca di mobile) */}
          {onToggleTheme && (
            <button
              id="reader-theme-toggle-btn"
              onClick={onToggleTheme}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/40 hover:bg-amber-400/30'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title={theme === 'dark' ? 'Mode Malam Aktif • Klik untuk beralih ke Mode Siang' : 'Mode Siang Aktif • Klik untuk beralih ke Mode Malam'}
              aria-label={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden min-[340px]:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden min-[340px]:inline">Gelap</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mode Hafalan / Muroja'ah Interactive Banner */}
      {isHifzMode && surahDetail && (
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-amber-950 space-y-2.5 sm:space-y-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold">
                Mode Uji Hafalan Aktif
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-900">
                {Object.values(revealedAyahs).filter(Boolean).length} / {surahDetail.ayahs.length} Ayat Diingat
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center bg-amber-100/90 rounded-xl p-0.5 border border-amber-200 text-xs">
                <button
                  type="button"
                  onClick={() => setHifzMaskMode('blur')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                    hifzMaskMode === 'blur'
                      ? 'bg-white text-amber-950 shadow-2xs'
                      : 'text-amber-800 hover:text-amber-950'
                  }`}
                >
                  Efek Buram
                </button>
                <button
                  type="button"
                  onClick={() => setHifzMaskMode('hide')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                    hifzMaskMode === 'hide'
                      ? 'bg-white text-amber-950 shadow-2xs'
                      : 'text-amber-800 hover:text-amber-950'
                  }`}
                >
                  Sembunyikan
                </button>
              </div>

              <button
                type="button"
                onClick={revealAllAyahs}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300/80 text-[11px] sm:text-xs font-bold hover:bg-amber-100 text-amber-900 cursor-pointer shadow-2xs"
              >
                Buka Semua
              </button>
              <button
                type="button"
                onClick={hideAllAyahs}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300/80 text-[11px] sm:text-xs font-bold hover:bg-amber-100 text-amber-900 cursor-pointer shadow-2xs"
              >
                Kunci Semua
              </button>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
            Teks ayat disamarkan untuk melatih daya ingat hafalan. Ketuk kartu ayat atau teks buram untuk mengintip/menguji hafalan ayat demi ayat.
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 font-medium text-sm">
            Memuat Surah {currentMeta?.transliteration || surahNumber}...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 space-y-3">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => onSelectSurah(surahNumber)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
        </div>
      )}

      {/* Surah Detail Content */}
      {!loading && surahDetail && (
        <>
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-4 sm:p-8 text-center space-y-3 sm:space-y-4 border border-emerald-700/40 shadow-lg">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-200">
              <span className="bg-emerald-800/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-500/30">
                {surahDetail.revelation} • {surahDetail.numberOfAyahs} Ayat
              </span>
              <span className="bg-emerald-800/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-500/30">
                Juz {surahDetail.juzStart}
              </span>
            </div>

            <div className="py-1 sm:py-2">
              <h1 className="font-arabic text-3xl sm:text-5xl text-amber-300 font-bold mb-1.5 sm:mb-2">
                {surahDetail.name}
              </h1>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {surahDetail.transliteration}
              </h2>
              <p className="text-emerald-200 text-xs sm:text-sm italic font-medium">
                "{surahDetail.translation}"
              </p>
            </div>

            {surahDetail.description && (
              <p className="text-[11px] sm:text-sm text-emerald-100/80 max-w-xl mx-auto leading-relaxed border-t border-emerald-700/40 pt-2.5 sm:pt-3">
                {surahDetail.description}
              </p>
            )}

            {/* Bismillah Header (Except Surah 9 At-Taubah) */}
            {surahDetail.number !== 9 && (
              <div className="pt-3 sm:pt-4 border-t border-emerald-700/40">
                <p className="font-arabic text-xl sm:text-3xl text-amber-200 py-0.5 sm:py-1 leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-[11px] sm:text-xs text-emerald-200/80">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                </p>
              </div>
            )}
          </div>

          {/* Ayah List */}
          <div className="space-y-3 sm:space-y-4">
            {surahDetail.ayahs.map((ayah) => {
              const ayahAudioId = `${surahDetail.number}_${ayah.numberInSurah}`;
              const isPlayingThisAyah =
                isPlayingAudio && currentPlayingAyahId === ayahAudioId;

              return (
                <div
                  key={ayah.numberInSurah}
                  ref={(el) => {
                    ayahRefs.current[ayah.numberInSurah] = el;
                  }}
                  id={`ayah-${ayah.numberInSurah}`}
                  className={`bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border transition-all ${
                    isPlayingThisAyah
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  {/* Ayah Action Header */}
                  <div className="flex items-center justify-between pb-2.5 sm:pb-4 mb-2.5 sm:mb-4 border-b border-stone-100 dark:border-stone-800/80 text-stone-500 dark:text-stone-400 gap-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 font-bold flex items-center justify-center text-[11px] sm:text-xs border border-stone-200 dark:border-stone-700 shrink-0">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-[11px] sm:text-xs text-stone-400 dark:text-stone-500 font-medium truncate">
                        QS. {surahDetail.transliteration} : {ayah.numberInSurah}
                      </span>

                      {/* Hifz Mode Status Tag */}
                      {isHifzMode && (
                        <button
                          type="button"
                          onClick={() => toggleAyahReveal(ayah.numberInSurah)}
                          className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                            revealedAyahs[ayah.numberInSurah]
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
                          }`}
                          title="Klik untuk intip atau sembunyikan ayat"
                        >
                          {revealedAyahs[ayah.numberInSurah] ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="hidden min-[360px]:inline">Diingat</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                              <span className="hidden min-[360px]:inline">Uji</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      {/* Tafsir Insight Button */}
                      <button
                        id={`btn-tafsir-insight-${ayah.numberInSurah}`}
                        onClick={() => handleOpenTafsir(ayah)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer text-xs font-semibold shadow-2xs group"
                        title={`Buka Tafsir Insight QS. ${surahDetail.transliteration} Ayat ${ayah.numberInSurah}`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
                        <span className="hidden min-[360px]:inline">Tafsir</span>
                        <span className="hidden sm:inline">Insight</span>
                      </button>

                      {/* Play Audio Button */}
                      <button
                        onClick={() => onPlayAyahAudio(ayah, surahDetail.transliteration)}
                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${
                          isPlayingThisAyah
                            ? 'bg-emerald-600 text-white'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400'
                        }`}
                        title={isPlayingThisAyah ? 'Jeda Murottal' : 'Putar Murottal Ayat'}
                      >
                        {isPlayingThisAyah ? (
                          <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() =>
                          onToggleBookmark({
                            surahNumber: surahDetail.number,
                            surahName: surahDetail.transliteration,
                            ayahNumber: ayah.numberInSurah,
                            arabSnippet: ayah.text.arab.slice(0, 60),
                            translationSnippet: ayah.text.translation.slice(0, 80),
                          })
                        }
                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${
                          isBookmarked(ayah.numberInSurah)
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                        title={
                          isBookmarked(ayah.numberInSurah)
                            ? 'Hapus Bookmark'
                            : 'Tandai Ayat Ini'
                        }
                      >
                        <BookmarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyAyah(ayah)}
                        className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                        title="Salin Ayat & Terjemahan"
                      >
                        {copiedAyah === ayah.numberInSurah ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShareAyah(ayah)}
                        className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                        title="Bagikan Ayat"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Verse with dynamic font size, generous line height & Hifz Mode masking */}
                  {isHifzMode && !revealedAyahs[ayah.numberInSurah] ? (
                    <div
                      onClick={() => toggleAyahReveal(ayah.numberInSurah)}
                      className="py-4 sm:py-6 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-dashed border-amber-300 dark:border-amber-700 text-center cursor-pointer hover:bg-amber-100/60 dark:hover:bg-amber-950/50 transition-all select-none group"
                    >
                      {hifzMaskMode === 'blur' ? (
                        <div className="relative">
                          <p
                            className="font-arabic font-normal text-stone-900 dark:text-stone-100 leading-[2.1] sm:leading-[2.4] tracking-wide blur-md select-none opacity-40"
                            style={{
                              fontSize: `clamp(${Math.max(22, arabicFontSize - 6)}px, 5.5vw, ${arabicFontSize}px)`,
                            }}
                            dir="rtl"
                          >
                            {ayah.text.arab}
                          </p>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] sm:text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ketuk untuk Intip Ayat {ayah.numberInSurah}</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 sm:py-4 space-y-1">
                          <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 mx-auto" />
                          <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
                            Ayat {ayah.numberInSurah} Disembunyikan
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400">
                            Ketuk untuk mencocokkan hafalan Anda
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-1.5 sm:py-2 text-right">
                      <p
                        className="font-arabic font-normal text-stone-900 dark:text-stone-100 leading-[2.1] sm:leading-[2.4] tracking-wide"
                        style={{
                          fontSize: `clamp(${Math.max(22, arabicFontSize - 6)}px, 5.5vw, ${arabicFontSize}px)`,
                        }}
                        dir="rtl"
                      >
                        {ayah.text.arab}
                        <span className="inline-flex items-center justify-center font-sans font-bold text-[10px] sm:text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/80 rounded-full w-6 h-6 sm:w-7 sm:h-7 mx-1.5 sm:mx-2 border border-emerald-200/90 dark:border-emerald-800 select-none align-middle shadow-2xs">
                          {ayah.numberInSurah}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Latin Transliteration */}
                  {showLatin && ayah.text.latin && (!isHifzMode || revealedAyahs[ayah.numberInSurah]) && (
                    <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-400/95 font-medium leading-relaxed italic">
                      {ayah.text.latin}
                    </div>
                  )}

                  {/* Indonesian Translation */}
                  {showTranslation && (!isHifzMode || revealedAyahs[ayah.numberInSurah]) && (
                    <div className="mt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{ayah.text.translation}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Non-intrusive Reading Timer displaying total time spent reading in current session */}
          {(() => {
            const { textDescription, digitalTime } = formatReadingDuration(sessionReadingSeconds);
            return (
              <div
                id="quran-reading-session-timer"
                className="flex items-center justify-center pt-2 sm:pt-3 pb-1"
              >
                <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-100/90 dark:bg-stone-800/90 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/90 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-[11px] sm:text-xs font-medium shadow-2xs transition-colors">
                  <div className="relative flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span>
                    Durasi sesi ini:{' '}
                    <span className="text-stone-900 dark:text-stone-100 font-semibold font-mono tracking-tight ml-1">
                      {digitalTime}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 ml-1">({textDescription})</span>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Bottom Surah Navigation (Prev & Next) */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-800 gap-2">
            {surahDetail.number > 1 ? (
              <button
                onClick={() => onSelectSurah(surahDetail.number - 1)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span><span className="hidden min-[420px]:inline">Surah </span>Sebelumnya</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
            >
              Kembali ke Atas
            </button>

            {surahDetail.number < 114 ? (
              <button
                onClick={() => onSelectSurah(surahDetail.number + 1)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <span><span className="hidden min-[420px]:inline">Surah </span>Selanjutnya</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}

      {/* Floating 'Back to Top' Button */}
      <button
        id="quran-reader-floating-back-to-top"
        type="button"
        onClick={handleScrollToTop}
        aria-label="Kembali ke atas"
        title="Kembali ke atas surah"
        className={`fixed right-3 sm:right-6 md:right-8 z-40 flex items-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl border border-emerald-600/40 backdrop-blur-xs transition-all duration-300 ease-out active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer ${
          isPlayingAudio ? 'bottom-32 md:bottom-20' : 'bottom-20 md:bottom-8'
        } ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-6 pointer-events-none scale-90'
        }`}
      >
        <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">Ke Atas</span>
      </button>

      {/* Tafsir Insight Modal */}
      {surahDetail && selectedAyahForTafsir && (
        <TafsirInsightModal
          isOpen={isTafsirModalOpen}
          onClose={() => setIsTafsirModalOpen(false)}
          surahNumber={surahDetail.number}
          surahName={surahDetail.transliteration}
          ayahNumber={selectedAyahForTafsir.numberInSurah}
          totalAyahs={surahDetail.numberOfAyahs}
          ayah={selectedAyahForTafsir}
          onNavigateAyah={handleNavigateTafsirAyah}
          onPlayAudio={onPlayAyahAudio}
          isPlayingThisAyah={
            isPlayingAudio &&
            currentPlayingAyahId === `${surahDetail.number}_${selectedAyahForTafsir.numberInSurah}`
          }
          isBookmarked={isBookmarked(selectedAyahForTafsir.numberInSurah)}
          onToggleBookmark={() =>
            onToggleBookmark({
              surahNumber: surahDetail.number,
              surahName: surahDetail.transliteration,
              ayahNumber: selectedAyahForTafsir.numberInSurah,
              arabSnippet: selectedAyahForTafsir.text.arab.slice(0, 60),
              translationSnippet: selectedAyahForTafsir.text.translation.slice(0, 80),
            })
          }
          onOpenShare={() => handleShareAyah(selectedAyahForTafsir)}
        />
      )}
    </div>
  );
};
