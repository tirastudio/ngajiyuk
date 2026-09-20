import React, { useState } from 'react';
import { Award, CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Target, Calendar } from 'lucide-react';
import { SURAH_LIST } from '../../data/surahList';

interface KhatamTrackerProps {
  completedSurahs: number[];
  dailyAyahTarget: number;
  onToggleSurah: (surahNumber: number) => void;
  onOpenSurah: (surahNumber: number) => void;
}

export const KhatamTracker: React.FC<KhatamTrackerProps> = ({
  completedSurahs = [],
  dailyAyahTarget = 10,
  onToggleSurah,
  onOpenSurah,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalSurahs = 114;
  const completedCount = completedSurahs.length;
  const progressPercentage = Math.round((completedCount / totalSurahs) * 100);

  // Total Ayahs in Al-Quran is 6,236
  const totalQuranAyahs = 6236;
  const estimatedDaysToKhatam = Math.ceil(totalQuranAyahs / (dailyAyahTarget || 10));

  // Filtered surah list for checklist
  const filteredList = SURAH_LIST.filter((s) => {
    const isDone = completedSurahs.includes(s.number);
    const matchesFilter =
      filterMode === 'all' ||
      (filterMode === 'completed' && isDone) ||
      (filterMode === 'uncompleted' && !isDone);

    const matchesSearch =
      searchQuery === '' ||
      s.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
      {/* Header with Khatam Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">Pelacak Khatam Al-Qur'an</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              114 Surah
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Tandai surah yang telah Anda selesaikan untuk memantau perjalanan khatam
          </p>
        </div>

        {/* Action button to expand/collapse surah checklist */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isExpanded ? 'Tutup Daftar Surah' : 'Kelola Surah Selesai'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            {progressPercentage}%
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Surah Dibaca
            </p>
            <p className="text-sm font-bold text-stone-900">
              {completedCount} <span className="text-xs font-normal text-stone-500">/ 114 Surah</span>
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
              Target Harian
            </p>
            <p className="text-sm font-bold text-stone-900">
              {dailyAyahTarget} <span className="text-xs font-normal text-stone-500">ayat/hari</span>
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
              Estimasi Khatam
            </p>
            <p className="text-sm font-bold text-stone-900">
              ~{estimatedDaysToKhatam} <span className="text-xs font-normal text-stone-500">hari istiqomah</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-stone-500">
          <span>Progress Khatam Keseluruhan</span>
          <span className="font-bold text-emerald-800">{progressPercentage}% Selesai</span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, progressPercentage)}%` }}
          />
        </div>
      </div>

      {/* Expandable Checklist Section */}
      {isExpanded && (
        <div className="pt-2 border-t border-stone-100 space-y-3 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500'
                }`}
              >
                Semua (114)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'completed' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500'
                }`}
              >
                Selesai ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('uncompleted')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'uncompleted' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500'
                }`}
              >
                Belum ({totalSurahs - completedCount})
              </button>
            </div>

            <input
              type="text"
              placeholder="Cari surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Surah Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredList.map((surah) => {
              const isChecked = completedSurahs.includes(surah.number);
              return (
                <div
                  key={surah.number}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleSurah(surah.number)}
                    className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                    )}
                    <span className="text-xs font-bold">
                      {surah.number}. {surah.transliteration}
                    </span>
                    <span className="text-[10px] text-stone-400">({surah.numberOfAyahs} ayat)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSurah(surah.number)}
                    className="p-1 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-white text-[11px] font-semibold transition-colors"
                    title="Buka Mushaf"
                  >
                    Buka
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
