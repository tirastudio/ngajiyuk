import React, { useState, useMemo } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { JUZ_LIST } from '../data/juzList';
import { SurahMeta, LastRead, JuzInfo } from '../types/quran';
import { Search, BookOpen, Sparkles, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';

interface SurahListViewProps {
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  lastRead: LastRead | null;
  onOpenAiRecommendation: (theme: string) => void;
}

export const SurahListView: React.FC<SurahListViewProps> = ({
  onSelectSurah,
  lastRead,
  onOpenAiRecommendation,
}) => {
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Makkiyah' | 'Madaniyah' | 'popular'>('all');

  // Popular Surahs in daily practice
  const popularSurahNumbers = [1, 18, 36, 55, 56, 67, 112, 113, 114];

  // Filtered Surah list
  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter((surah) => {
      // Revelation filter
      if (revelationFilter === 'Makkiyah' && surah.revelation !== 'Makkiyah') return false;
      if (revelationFilter === 'Madaniyah' && surah.revelation !== 'Madaniyah') return false;
      if (revelationFilter === 'popular' && !popularSurahNumbers.includes(surah.number)) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const numMatch = surah.number.toString() === query;
      const nameMatch = surah.transliteration.toLowerCase().includes(query);
      const arabMatch = surah.name.includes(query);
      const translationMatch = surah.translation.toLowerCase().includes(query);

      return numMatch || nameMatch || arabMatch || translationMatch;
    });
  }, [searchQuery, revelationFilter]);

  // Filtered Juz list
  const filteredJuz = useMemo(() => {
    if (!searchQuery.trim()) return JUZ_LIST;
    const q = searchQuery.toLowerCase().trim();
    return JUZ_LIST.filter(
      (j) =>
        j.name.toLowerCase().includes(q) ||
        j.start.surahName.toLowerCase().includes(q) ||
        j.end.surahName.toLowerCase().includes(q) ||
        j.index.toString() === q
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome & Last Read Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 md:p-10 shadow-lg border border-emerald-700/30">
        {/* Subtle geometric background motif */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="font-arabic text-[360px] select-none text-white">۞</div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Mushaf Standar Indonesia • Kemenag RI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Membaca & Mentadabburi <br className="hidden sm:inline" />
              <span className="text-amber-300">Al-Qur'anul Karim</span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Dilengkapi teks Utsmani terverifikasi, terjemahan resmi Kemenag RI, audio murottal per-ayat, jadwal sholat presisi, serta rekomendasi AI untuk bimbingan spiritual Anda.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-read-al-fatihah"
                onClick={() => onSelectSurah(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-900 font-bold text-sm shadow-md hover:bg-amber-300 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4 text-stone-900" />
                <span>Mulai dari Al-Fatihah</span>
              </button>

              <button
                id="hero-ai-recommendation"
                onClick={() => onOpenAiRecommendation('Ketenangan Batin')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-500/40 text-emerald-100 font-medium text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tadabbur dengan AI</span>
              </button>
            </div>
          </div>

          {/* Last Read Quick Card */}
          {lastRead && (
            <div
              id="card-last-read"
              onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between min-w-[240px] md:max-w-xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" /> Terakhir Dibaca
                </span>
                <span className="text-[11px] text-emerald-300/80">Lanjutkan</span>
              </div>

              <div>
                <p className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {lastRead.surahName}
                </p>
                <p className="text-xs text-emerald-100/80">Ayat ke-{lastRead.ayahNumber}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span>Buka Ayat Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Mode: 114 Surah vs 30 Juz */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        {/* Tab switchers */}
        <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200/70 self-start">
          <button
            id="tab-view-surah"
            onClick={() => setActiveTab('surah')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'surah'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            114 Surah
          </button>
          <button
            id="tab-view-juz"
            onClick={() => setActiveTab('juz')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'juz'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            30 Juz
          </button>
        </div>

        {/* Real-time Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-surah-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'surah'
                ? 'Cari nama surah (e.g. Al-Kahf, Yasin, 67)...'
                : 'Cari Juz 1 - 30...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 p-1"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips for Surah Mode */}
      {activeTab === 'surah' && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="filter-all"
            onClick={() => setRevelationFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              revelationFilter === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua (114)
          </button>
          <button
            id="filter-popular"
            onClick={() => setRevelationFilter('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              revelationFilter === 'popular'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            Surah Populer
          </button>
          <button
            id="filter-makkiyah"
            onClick={() => setRevelationFilter('Makkiyah')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              revelationFilter === 'Makkiyah'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Makkiyah
          </button>
          <button
            id="filter-madaniyah"
            onClick={() => setRevelationFilter('Madaniyah')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              revelationFilter === 'Madaniyah'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Madaniyah
          </button>
        </div>
      )}

      {/* Surah Cards Grid */}
      {activeTab === 'surah' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              id={`surah-card-${surah.number}`}
              onClick={() => onSelectSurah(surah.number)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3 relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5">
                {/* Number Badge with Islamic Diamond Style */}
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200/70 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                  {surah.number}
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                    {surah.transliteration}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {surah.translation}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-stone-400">
                      {surah.numberOfAyahs} Ayat
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {surah.revelation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arabic Name */}
              <div className="text-right">
                <span className="font-arabic text-2xl text-stone-700 group-hover:text-emerald-800 transition-colors leading-loose">
                  {surah.name}
                </span>
              </div>
            </div>
          ))}

          {filteredSurahs.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-500">
              <BookOpen className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <p className="text-base font-semibold text-stone-700">Tidak ada surah yang cocok</p>
              <p className="text-sm">Coba kata kunci lain atau bersihkan pencarian.</p>
            </div>
          )}
        </div>
      )}

      {/* Juz Cards Grid */}
      {activeTab === 'juz' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJuz.map((juz) => (
            <div
              key={juz.index}
              id={`juz-card-${juz.index}`}
              onClick={() => onSelectSurah(juz.start.surahNumber, juz.start.ayahNumber)}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 font-bold flex items-center justify-center text-sm">
                  {juz.index}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  {juz.name}
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Mulai:</span>
                  <span className="font-semibold text-stone-800">
                    QS. {juz.start.surahName} : {juz.start.ayahNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Sampai:</span>
                  <span className="font-semibold text-stone-800">
                    QS. {juz.end.surahName} : {juz.end.ayahNumber}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                <span>Buka Awal Juz Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
