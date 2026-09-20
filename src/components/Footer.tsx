import React from 'react';
import {
  BookOpen,
  Clock,
  HeartHandshake,
  Scale,
  Sparkles,
  Search,
  Bookmark,
  ArrowUp,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

// Popular Surah quick links for fast navigation
const POPULAR_SURAHS = [
  { number: 1, name: 'Al-Fatihah', meaning: 'Pembuka', ayahCount: 7 },
  { number: 18, name: 'Al-Kahf', meaning: 'Penghuni Gua (Sunnah Jum\'at)', ayahCount: 110 },
  { number: 36, name: 'Yasin', meaning: 'Jantung Al-Qur\'an', ayahCount: 83 },
  { number: 55, name: 'Ar-Rahman', meaning: 'Yang Maha Pengasih', ayahCount: 78 },
  { number: 56, name: 'Al-Waqi\'ah', meaning: 'Hari Kiamat', ayahCount: 96 },
  { number: 67, name: 'Al-Mulk', meaning: 'Kerajaan (Pelindung Kubur)', ayahCount: 30 },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSelectSurah,
  onOpenSearch,
  onOpenBookmarks,
  theme = 'light',
  onToggleTheme,
}) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="mt-auto border-t border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/90 backdrop-blur-md transition-colors duration-200">
      {/* Quranic Ayah Inspiration Banner */}
      <div className="border-b border-stone-100 dark:border-stone-800/80 bg-linear-to-b from-stone-50/50 to-white/40 dark:from-stone-900/50 dark:to-stone-900/20 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
            <span className="font-arabic text-xl select-none">۞</span>
            <span className="text-xs uppercase tracking-widest font-bold">Kalamullah</span>
            <span className="font-arabic text-xl select-none">۞</span>
          </div>

          <p
            className="font-arabic text-stone-800 dark:text-stone-100 text-xl sm:text-2xl sm:leading-loose leading-loose text-center"
            dir="rtl"
          >
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </p>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium italic max-w-xl mx-auto">
            "Dan bacalah Al-Qur'an itu dengan perlahan-lahan (tartil)."
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 font-semibold tracking-wide">
            — QS. Al-Muzzammil [73]: 4
          </p>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <span className="font-arabic text-base">ن</span>
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg leading-tight tracking-tight">
                  ngajiyuk
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                  Al-Qur'an & Ibadah Digital RI
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Portal Al-Qur'an Digital dan panduan ibadah harian berbasis Teks Standar Kementerian Agama Republik Indonesia, dilengkapi audio qari bersanad dan asisten tanya jawab AI.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Mushaf Standar Indonesia (Kemenag RI)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Hisab Akurat Jadwal Sholat Seluruh Indonesia</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigasi Ibadah Utama */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Navigasi Ibadah
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('quran')}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer group text-left"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  <span>114 Surah & 30 Juz Al-Qur'an</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('sholat')}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer group text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  <span>Jadwal Sholat & Imsakiyah Kemenag</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('bacaan')}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer group text-left"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  <span>Doa Harian, Dzikir & Asmaul Husna</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('fiqih')}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer group text-left"
                >
                  <Scale className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  <span>Fiqih Ibadah & Kalkulator Zakat</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ai')}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer group text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Tanya AI Islam (Gemini 3.8 Flash)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Surah Pilihan Umat (Fast Links) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Surah Pilihan
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {POPULAR_SURAHS.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => {
                    onSelectTab('quran');
                    onSelectSurah(surah.number);
                  }}
                  className="flex items-center justify-between py-1 px-2 rounded-lg text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer text-left group"
                >
                  <span className="font-semibold group-hover:translate-x-0.5 transition-transform truncate">
                    {surah.number}. {surah.name}
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 shrink-0 ml-2 font-mono">
                    {surah.ayahCount} ayat
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Fitur Cepat & Preferensi */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Akses Cepat & Tampilan
            </h4>
            <div className="space-y-2.5">
              {/* Quick Search trigger */}
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-all cursor-pointer"
                title="Pencarian cepat Al-Qur'an"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>Cari Surah & Ayat</span>
                </div>
                <span className="text-[10px] font-bold bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500">
                  Ctrl+K
                </span>
              </button>

              {/* Bookmark Modal trigger */}
              <button
                onClick={onOpenBookmarks}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-all cursor-pointer"
                title="Buka ayat tersimpan"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>Ayat Tersimpan (Bookmark)</span>
                </div>
              </button>

              {/* Theme Toggle Card */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-950/50'
                      : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800 hover:bg-emerald-100/70'
                  }`}
                  title={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                    <span>Tema: {theme === 'dark' ? 'Mode Malam (Gelap)' : 'Mode Siang (Terang)'}</span>
                  </div>
                  <span className="text-[10px] font-bold underline">Ubah</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-stone-200/80 dark:border-stone-800" />

        {/* Bottom Bar: Copyright, Badges & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <span>© {new Date().getFullYear()} ngajiyuk</span>
              <span className="hidden sm:inline">•</span>
              <span>Kemenag RI Digital Experience</span>
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              Mushaf Al-Qur'an Standar Indonesia & Terjemahan Resmi Kemenag RI • Dilengkapi Gemini 3.8 Flash
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>Bebas Iklan</span>
            </span>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-semibold text-xs transition-all shadow-2xs cursor-pointer hover:shadow-xs active:scale-95"
              title="Kembali ke Bagian Paling Atas Halaman"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Ke Atas</span>
            </button>
          </div>
        </div>

        {/* Extra Bottom Spacing for Mobile View (Ensuring the fixed mobile bottom bar doesn't cover anything) */}
        <div className="h-16 md:hidden" aria-hidden="true" />
      </div>
    </footer>
  );
};
