import React, { useState, useMemo } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return SURAH_LIST.slice(0, 8);
    const q = query.toLowerCase().trim();
    return SURAH_LIST.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.number.toString() === q
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[80vh] transition-colors">
        {/* Search Input Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 dark:text-stone-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama surah (e.g. Al-Kahf, Yasin, 67) atau arti..."
            className="w-full text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 flex-1">
          {results.length === 0 ? (
            <div className="py-10 text-center text-stone-400 dark:text-stone-500 text-xs">
              Tidak ada surah yang cocok dengan "{query}".
            </div>
          ) : (
            results.map((surah) => (
              <button
                key={surah.number}
                onClick={() => {
                  onSelectSurah(surah.number);
                  onClose();
                }}
                className="w-full p-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/60 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                    {surah.number}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {surah.transliteration}
                    </h4>
                    <p className="text-xs text-stone-400 dark:text-stone-500">
                      {surah.translation} • {surah.numberOfAyahs} Ayat
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-arabic text-lg text-stone-600 dark:text-stone-300">
                    {surah.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
