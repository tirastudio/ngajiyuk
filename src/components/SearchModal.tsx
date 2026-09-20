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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama surah (e.g. Al-Kahf, Yasin, 67) atau arti..."
            className="w-full text-sm text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-stone-100 flex-1">
          {results.length === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs">
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
                className="w-full p-3 text-left hover:bg-stone-50 rounded-xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200/60">
                    {surah.number}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {surah.transliteration}
                    </h4>
                    <p className="text-xs text-stone-400">
                      {surah.translation} • {surah.numberOfAyahs} Ayat
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-arabic text-lg text-stone-600">
                    {surah.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
