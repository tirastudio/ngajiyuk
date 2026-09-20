import React from 'react';
import {
  BookOpen,
  Clock,
  Sparkles,
  Bookmark,
  Search,
  HeartHandshake,
  User,
  LogIn,
  Scale,
} from 'lucide-react';
import { UserProfile } from '../types/auth';

export type NavTab = 'quran' | 'sholat' | 'ai' | 'bacaan' | 'fiqih' | 'dashboard';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenSearch: () => void;
  audioPlayingSurah?: string | null;
  onJumpToAudio?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookmarkCount,
  onOpenBookmarks,
  onOpenSearch,
  audioPlayingSurah,
  onJumpToAudio,
  currentUser,
  onOpenAuthModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Logo & Brand */}
          <div
            id="nav-logo-btn"
            onClick={() => setActiveTab('quran')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic font-bold text-xl select-none leading-none">۞</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 tracking-tight text-lg sm:text-xl">
                  Al-Qur'an <span className="text-emerald-700 font-extrabold">& Sholat</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded-full">
                  Kemenag RI
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Mushaf Digital Kemenag RI • Waktu Sholat • Fiqih & Doa
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Tidied & Balanced (No Dashboard Menu) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/70 shadow-2xs">
            <button
              id="tab-btn-quran"
              onClick={() => setActiveTab('quran')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'quran'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Al-Qur'an</span>
            </button>

            <button
              id="tab-btn-sholat"
              onClick={() => setActiveTab('sholat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'sholat'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Jadwal Sholat</span>
            </button>

            <button
              id="tab-btn-bacaan"
              onClick={() => setActiveTab('bacaan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bacaan'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Amalan & Doa</span>
            </button>

            <button
              id="tab-btn-fiqih"
              onClick={() => setActiveTab('fiqih')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'fiqih'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Fiqih & Zakat</span>
            </button>

            <button
              id="tab-btn-ai"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya AI</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {audioPlayingSurah && (
              <button
                id="audio-indicator-btn"
                onClick={onJumpToAudio}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-pulse cursor-pointer"
                title="Audio sedang diputar"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Murottal Aktif</span>
              </button>
            )}

            <button
              id="btn-search-trigger"
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Cari Surah atau Ayat"
              aria-label="Cari Surah atau Ayat"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="btn-bookmarks-trigger"
              onClick={onOpenBookmarks}
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Daftar Bookmark"
              aria-label="Daftar Bookmark"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4.5 h-4.5 px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            <button
              id="btn-nav-user-account"
              onClick={() => {
                if (!currentUser && onOpenAuthModal) {
                  onOpenAuthModal();
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                currentUser
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={currentUser ? `Akun: ${currentUser.name}` : 'Masuk atau Buat Akun'}
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Balanced Essential Items) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
        <div className="grid grid-cols-5 py-2 px-1">
          <button
            id="mobile-tab-quran"
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'quran' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Al-Qur'an</span>
          </button>

          <button
            id="mobile-tab-sholat"
            onClick={() => setActiveTab('sholat')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'sholat' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Sholat</span>
          </button>

          <button
            id="mobile-tab-bacaan"
            onClick={() => setActiveTab('bacaan')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'bacaan' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <HeartHandshake className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Amalan</span>
          </button>

          <button
            id="mobile-tab-fiqih"
            onClick={() => setActiveTab('fiqih')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'fiqih' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Scale className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Fiqih</span>
          </button>

          <button
            id="mobile-tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'ai' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-1 text-amber-500" />
            <span className="text-[10px]">Tanya AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
