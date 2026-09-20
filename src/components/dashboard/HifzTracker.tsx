import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Repeat,
  Check,
  RotateCcw,
  Layers,
  LayoutGrid,
  ListFilter,
  ArrowRight,
  HelpCircle,
  Flame,
  BookmarkCheck,
  Percent,
} from 'lucide-react';
import { SURAH_LIST } from '../../data/surahList';
import { HifzRecord } from '../../types/auth';

interface HifzTrackerProps {
  hifzRecords: Record<number, HifzRecord>;
  onToggleSurah: (surahNumber: number, totalAyahs: number, forceState?: boolean) => void;
  onToggleAyah: (surahNumber: number, ayahNumber: number, totalAyahs: number) => void;
  onSetSurahAyahs: (surahNumber: number, ayahs: number[], totalAyahs: number) => void;
  onResetSurah: (surahNumber: number) => void;
  onOpenSurah?: (surahNumber: number, ayahNumber?: number) => void;
}

// Key popular Surahs for memorization
const POPULAR_HIFZ_SURAHS = [1, 18, 32, 36, 55, 56, 67, 76, 112, 113, 114];

export const HifzTracker: React.FC<HifzTrackerProps> = ({
  hifzRecords = {},
  onToggleSurah,
  onToggleAyah,
  onSetSurahAyahs,
  onResetSurah,
  onOpenSurah,
}) => {
  // Primary view tabs: 'list' (Surah & Ayat manager) | 'matrix' (Visual 114 Map) | 'juz' (30 Juz overview)
  const [activeTab, setActiveTab] = useState<'list' | 'matrix' | 'juz'>('list');

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'juz30' | 'popular' | 'completed' | 'in_progress' | 'not_started'>('all');

  // Accordion for expanded Surah ayah editor
  const [expandedSurahNumber, setExpandedSurahNumber] = useState<number | null>(null);

  // Range selection tool state for the expanded surah
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(10);

  // Total Quran Statistics Calculations
  const stats = useMemo(() => {
    let totalMemorizedAyahs = 0;
    let fullyMemorizedSurahsCount = 0;
    let partiallyMemorizedSurahsCount = 0;
    let juz30MemorizedAyahs = 0;

    SURAH_LIST.forEach((surah) => {
      const record = hifzRecords[surah.number];
      const count = record?.memorizedAyahs?.length || 0;
      totalMemorizedAyahs += count;

      if (record?.isFullyMemorized || count >= surah.numberOfAyahs) {
        fullyMemorizedSurahsCount++;
      } else if (count > 0) {
        partiallyMemorizedSurahsCount++;
      }

      // Juz 30 is Surahs 78 to 114
      if (surah.number >= 78 && surah.number <= 114) {
        juz30MemorizedAyahs += count;
      }
    });

    const totalQuranAyahs = 6236;
    const totalJuz30Ayahs = 564;
    const quranPercentage = ((totalMemorizedAyahs / totalQuranAyahs) * 100).toFixed(2);
    const juz30Percentage = Math.round((juz30MemorizedAyahs / totalJuz30Ayahs) * 100);

    return {
      totalMemorizedAyahs,
      totalQuranAyahs,
      quranPercentage,
      fullyMemorizedSurahsCount,
      partiallyMemorizedSurahsCount,
      juz30MemorizedAyahs,
      totalJuz30Ayahs,
      juz30Percentage,
    };
  }, [hifzRecords]);

  // Filtered surah list for list and matrix view
  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter((surah) => {
      const record = hifzRecords[surah.number];
      const memorizedCount = record?.memorizedAyahs?.length || 0;
      const isFull = record?.isFullyMemorized || memorizedCount >= surah.numberOfAyahs;

      // Status Filter
      if (statusFilter === 'juz30' && (surah.number < 78 || surah.number > 114)) return false;
      if (statusFilter === 'popular' && !POPULAR_HIFZ_SURAHS.includes(surah.number)) return false;
      if (statusFilter === 'completed' && !isFull) return false;
      if (statusFilter === 'in_progress' && (isFull || memorizedCount === 0)) return false;
      if (statusFilter === 'not_started' && memorizedCount > 0) return false;

      // Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = surah.transliteration.toLowerCase().includes(query);
        const matchesTranslation = surah.translation.toLowerCase().includes(query);
        const matchesNumber = String(surah.number) === query;
        return matchesName || matchesTranslation || matchesNumber;
      }

      return true;
    });
  }, [hifzRecords, statusFilter, searchQuery]);

  // Handle expanding a surah to edit ayahs
  const handleToggleExpandSurah = (surahNumber: number, numberOfAyahs: number) => {
    if (expandedSurahNumber === surahNumber) {
      setExpandedSurahNumber(null);
    } else {
      setExpandedSurahNumber(surahNumber);
      setRangeStart(1);
      setRangeEnd(Math.min(10, numberOfAyahs));
    }
  };

  // Quick range apply
  const handleApplyRange = (surahNumber: number, numberOfAyahs: number) => {
    const start = Math.max(1, Math.min(rangeStart, numberOfAyahs));
    const end = Math.max(start, Math.min(rangeEnd, numberOfAyahs));

    const existingAyahs = hifzRecords[surahNumber]?.memorizedAyahs || [];
    const newAyahsSet = new Set(existingAyahs);

    for (let i = start; i <= end; i++) {
      newAyahsSet.add(i);
    }

    onSetSurahAyahs(surahNumber, Array.from(newAyahsSet), numberOfAyahs);
  };

  // Quick preset ranges (+5, +10, all)
  const handleQuickPresetRange = (surahNumber: number, numberOfAyahs: number, count: number) => {
    const existingAyahs = hifzRecords[surahNumber]?.memorizedAyahs || [];
    const currentMax = existingAyahs.length > 0 ? Math.max(...existingAyahs) : 0;
    const start = Math.min(numberOfAyahs, currentMax + 1);
    const end = Math.min(numberOfAyahs, currentMax + count);

    const newAyahsSet = new Set(existingAyahs);
    for (let i = start; i <= end; i++) {
      newAyahsSet.add(i);
    }
    onSetSurahAyahs(surahNumber, Array.from(newAyahsSet), numberOfAyahs);
  };

  return (
    <div id="hifz-tracker-section" className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER & OVERVIEW METRICS                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-2xs border border-emerald-200/60">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Pelacak Hafalan Al-Qur'an (Hifz Tracker)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-300/60">
                  Mutqin & Istiqomah
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Tandai Surah atau Ayat yang telah Anda hafal dan pantau progres hafalan di seluruh 114 Surah
              </p>
            </div>
          </div>
        </div>

        {/* View Perspective Switcher */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80 self-start lg:self-center">
          <button
            id="tab-hifz-list"
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Kelola Surah & Ayat</span>
          </button>
          <button
            id="tab-hifz-matrix"
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Peta Visual 114 Surah</span>
          </button>
          <button
            id="tab-hifz-juz"
            type="button"
            onClick={() => setActiveTab('juz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'juz'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Progres 30 Juz</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. PROGRESS HIGHLIGHT TILES (4 CARDS)                          */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Ayat Dihafal */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/40 border border-emerald-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Total Ayat Dihafal
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-200/60 text-emerald-900 flex items-center justify-center font-bold text-xs">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-950">
                {stats.totalMemorizedAyahs.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-stone-600 font-semibold">
                / {stats.totalQuranAyahs.toLocaleString('id-ID')} Ayat
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0.5, Number(stats.quranPercentage)))}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-emerald-800 mt-1.5 flex items-center justify-between">
              <span>{stats.quranPercentage}% dari Al-Qur'an</span>
              <span>{stats.fullyMemorizedSurahsCount} Surah Full</span>
            </p>
          </div>
        </div>

        {/* Card 2: Surah Selesai Dihafal (Khatam Hafal) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/90 to-stone-50 border border-teal-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Surah Hafal Penuh
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-200/60 text-teal-900 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-stone-900">
                {stats.fullyMemorizedSurahsCount}
              </span>
              <span className="text-xs text-stone-500 font-semibold">/ 114 Surah</span>
            </div>
            <div className="w-full bg-teal-200/50 h-2 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.fullyMemorizedSurahsCount / 114) * 100}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-teal-800 mt-1.5 flex items-center justify-between">
              <span>{stats.partiallyMemorizedSurahsCount} Sedang Berproses</span>
              <span>{Math.round((stats.fullyMemorizedSurahsCount / 114) * 100)}%</span>
            </p>
          </div>
        </div>

        {/* Card 3: Progres Juz 'Amma (Juz 30) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/40 border border-amber-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Juz 'Amma (Juz 30)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-200/60 text-amber-900 flex items-center justify-center font-bold text-xs">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-950">
                {stats.juz30MemorizedAyahs}
              </span>
              <span className="text-xs text-stone-600 font-semibold">
                / {stats.totalJuz30Ayahs} Ayat
              </span>
            </div>
            <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.juz30Percentage}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-amber-800 mt-1.5 flex items-center justify-between">
              <span>Fokus Hafalan Awal</span>
              <span>{stats.juz30Percentage}% Selesai</span>
            </p>
          </div>
        </div>

        {/* Card 4: Quick Action & Motivation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Metode Menghafal
            </span>
            <p className="text-xs text-stone-700 font-medium leading-relaxed mt-1">
              "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
            </p>
          </div>
          {onOpenSurah && (
            <button
              id="btn-hifz-open-mushaf-test"
              type="button"
              onClick={() => onOpenSurah(114, 1)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Buka Mode Uji Hafalan</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PERSPECTIVE VIEW CONTENT                                   */}
      {/* ------------------------------------------------------------- */}

      {/* ============================================================= */}
      {/* VIEW A: LIST VIEW (SURAH & AYAT CHECKLIST)                    */}
      {/* ============================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Controls: Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-hifz-search"
                type="text"
                placeholder="Cari Surah (contoh: Al-Baqarah, 67, Al-Mulk)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50/70 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {[
                { id: 'all', label: `Semua (114)` },
                { id: 'juz30', label: 'Juz 30' },
                { id: 'popular', label: 'Pilihan' },
                { id: 'completed', label: `Hafal (${stats.fullyMemorizedSurahsCount})` },
                { id: 'in_progress', label: `Proses (${stats.partiallyMemorizedSurahsCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id as typeof statusFilter)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Surah List Cards */}
          {filteredSurahs.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-200">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">Tidak ada Surah yang cocok dengan filter</p>
              <p className="text-xs text-stone-500 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter status</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSurahs.map((surah) => {
                const record = hifzRecords[surah.number];
                const memorizedList = record?.memorizedAyahs || [];
                const memorizedCount = memorizedList.length;
                const isFullyMemorized = record?.isFullyMemorized || memorizedCount >= surah.numberOfAyahs;
                const percent = Math.round((memorizedCount / surah.numberOfAyahs) * 100);
                const isExpanded = expandedSurahNumber === surah.number;

                return (
                  <div
                    key={surah.number}
                    className={`rounded-2xl border transition-all ${
                      isFullyMemorized
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : memorizedCount > 0
                        ? 'bg-amber-50/30 border-amber-200/70'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Surah Card Header Row */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Surah Info */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                            isFullyMemorized
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : memorizedCount > 0
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {surah.number}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-stone-900">
                              {surah.transliteration}
                            </h3>
                            <span className="font-arabic text-stone-700 text-sm">{surah.name}</span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              • {surah.numberOfAyahs} Ayat
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                              Juz {surah.juzStart}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {surah.translation} ({surah.revelation})
                          </p>

                          {/* Mini Progress Bar for Surah */}
                          <div className="flex items-center gap-2.5 mt-2">
                            <div className="w-32 sm:w-44 bg-stone-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isFullyMemorized
                                    ? 'bg-emerald-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold ${
                                isFullyMemorized
                                  ? 'text-emerald-800'
                                  : memorizedCount > 0
                                  ? 'text-amber-800'
                                  : 'text-stone-500'
                              }`}
                            >
                              {memorizedCount}/{surah.numberOfAyahs} ({percent}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                        {/* One-click Full Surah Toggle */}
                        <button
                          id={`btn-toggle-full-surah-${surah.number}`}
                          type="button"
                          onClick={() => onToggleSurah(surah.number, surah.numberOfAyahs)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isFullyMemorized
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200'
                          }`}
                          title={isFullyMemorized ? 'Tandai belum hafal penuh' : 'Tandai 1 Surah Penuh Hafal'}
                        >
                          {isFullyMemorized ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Hafal Penuh</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-4 h-4 text-stone-400" />
                              <span>Tandai 1 Surah</span>
                            </>
                          )}
                        </button>

                        {/* Expand / Manage Ayah Detail */}
                        <button
                          id={`btn-expand-ayahs-${surah.number}`}
                          type="button"
                          onClick={() => handleToggleExpandSurah(surah.number, surah.numberOfAyahs)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                            isExpanded
                              ? 'bg-stone-800 text-white border-stone-800'
                              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          <span>Kelola Ayat</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {/* Open in Quran Reader / Test */}
                        {onOpenSurah && (
                          <button
                            type="button"
                            onClick={() => onOpenSurah(surah.number, 1)}
                            className="p-2 rounded-xl text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition-colors"
                            title="Buka Surah di Mushaf"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Ayah-by-Ayah Checklist & Range Tool */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-stone-50/80 border-t border-stone-200/80 rounded-b-2xl space-y-4">
                        {/* Range Tool Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-stone-200 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-stone-700">Tandai Rentang Ayat:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-500">Ayat</span>
                              <input
                                type="number"
                                min={1}
                                max={surah.numberOfAyahs}
                                value={rangeStart}
                                onChange={(e) => setRangeStart(Number(e.target.value))}
                                className="w-14 px-2 py-1 border border-stone-300 rounded-lg text-center font-bold text-stone-800"
                              />
                              <span className="text-stone-500">s/d</span>
                              <input
                                type="number"
                                min={rangeStart}
                                max={surah.numberOfAyahs}
                                value={rangeEnd}
                                onChange={(e) => setRangeEnd(Number(e.target.value))}
                                className="w-14 px-2 py-1 border border-stone-300 rounded-lg text-center font-bold text-stone-800"
                              />
                              <button
                                type="button"
                                onClick={() => handleApplyRange(surah.number, surah.numberOfAyahs)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                Terapkan
                              </button>
                            </div>
                          </div>

                          {/* Quick Preset Buttons */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-stone-500 text-[11px]">Tambah Cepat:</span>
                            <button
                              type="button"
                              onClick={() => handleQuickPresetRange(surah.number, surah.numberOfAyahs, 5)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-[11px]"
                            >
                              +5 Ayat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickPresetRange(surah.number, surah.numberOfAyahs, 10)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-[11px]"
                            >
                              +10 Ayat
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleSurah(surah.number, surah.numberOfAyahs, true)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold rounded-lg text-[11px] border border-emerald-200"
                            >
                              Semua ({surah.numberOfAyahs})
                            </button>
                            <button
                              type="button"
                              onClick={() => onResetSurah(surah.number)}
                              className="px-2 py-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-[11px]"
                              title="Reset hafalan surah ini"
                            >
                              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                              Reset
                            </button>
                          </div>
                        </div>

                        {/* Interactive Ayah Grid */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-stone-700">
                              Klik pada nomor ayat untuk menandai hafal/belum:
                            </p>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {memorizedCount} dari {surah.numberOfAyahs} ayat terpilih
                            </span>
                          </div>

                          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5 max-h-60 overflow-y-auto p-2 bg-white rounded-xl border border-stone-200">
                            {Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1).map((ayahNum) => {
                              const isMemorized = memorizedList.includes(ayahNum);
                              return (
                                <button
                                  key={ayahNum}
                                  id={`btn-ayah-${surah.number}-${ayahNum}`}
                                  type="button"
                                  onClick={() => onToggleAyah(surah.number, ayahNum, surah.numberOfAyahs)}
                                  className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                    isMemorized
                                      ? 'bg-emerald-600 text-white shadow-2xs scale-102 hover:bg-emerald-700'
                                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200/60'
                                  }`}
                                  title={`Ayat ${ayahNum}: ${isMemorized ? 'Hafal' : 'Belum'}`}
                                >
                                  {isMemorized ? <Check className="w-3.5 h-3.5" /> : ayahNum}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW B: VISUAL 114 SURAH MAP (HEATMAP / MATRIX)               */}
      {/* ============================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Peta Kemajuan 114 Surah</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Visualisasi lengkap seluruh Surah Al-Qur'an dari Surah 1 (Al-Fatihah) sampai 114 (An-Nas).
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 inline-block" />
                <span>Hafal Penuh</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500 inline-block" />
                <span>Sebagian</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <span className="w-3.5 h-3.5 rounded-md bg-stone-200 inline-block" />
                <span>Belum</span>
              </span>
            </div>
          </div>

          {/* 114 Matrix Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {SURAH_LIST.map((surah) => {
              const record = hifzRecords[surah.number];
              const count = record?.memorizedAyahs?.length || 0;
              const isFull = record?.isFullyMemorized || count >= surah.numberOfAyahs;
              const percent = Math.round((count / surah.numberOfAyahs) * 100);

              return (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => {
                    setActiveTab('list');
                    handleToggleExpandSurah(surah.number, surah.numberOfAyahs);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer group relative flex flex-col justify-between ${
                    isFull
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs hover:bg-emerald-700'
                      : count > 0
                      ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                  title={`${surah.number}. ${surah.transliteration}: ${count}/${surah.numberOfAyahs} ayat (${percent}%)`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold ${isFull ? 'text-emerald-100' : 'text-stone-400'}`}>
                      #{surah.number}
                    </span>
                    {isFull && <Check className="w-3 h-3 text-emerald-200" />}
                  </div>

                  <p className="text-xs font-bold truncate mt-1">{surah.transliteration}</p>

                  <div className="mt-1.5 flex items-center justify-between text-[9px] opacity-80">
                    <span>{count}/{surah.numberOfAyahs}</span>
                    <span>{percent}%</span>
                  </div>

                  {/* Tiny bottom progress bar for partials */}
                  {!isFull && count > 0 && (
                    <div className="w-full bg-amber-200 h-1 rounded-full overflow-hidden mt-1">
                      <div className="bg-amber-600 h-full" style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW C: 30 JUZ BREAKDOWN                                      */}
      {/* ============================================================= */}
      {activeTab === 'juz' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">Progres Hafalan Per-Juz (Juz 1 s/d 30)</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau pencapaian hafalan berdasarkan pembagian 30 Juz Al-Qur'an.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
              // Approximate surahs in this juz based on juzStart
              const surahsInJuz = SURAH_LIST.filter((s) => s.juzStart === juzNum);
              const totalAyahs = surahsInJuz.reduce((acc, s) => acc + s.numberOfAyahs, 0);
              const memorizedAyahs = surahsInJuz.reduce((acc, s) => {
                const rec = hifzRecords[s.number];
                return acc + (rec?.memorizedAyahs?.length || 0);
              }, 0);
              const percent = totalAyahs > 0 ? Math.round((memorizedAyahs / totalAyahs) * 100) : 0;
              const isFull = percent === 100 && totalAyahs > 0;

              return (
                <div
                  key={juzNum}
                  className={`p-4 rounded-2xl border ${
                    isFull
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : memorizedAyahs > 0
                      ? 'bg-amber-50/30 border-amber-200'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">Juz {juzNum}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isFull
                          ? 'bg-emerald-100 text-emerald-800'
                          : memorizedAyahs > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                    <span>{memorizedAyahs} / {totalAyahs} Ayat</span>
                    <span>{surahsInJuz.length} Surah</span>
                  </div>

                  {surahsInJuz.length > 0 && (
                    <p className="text-[10px] text-stone-400 truncate mt-1">
                      {surahsInJuz.map((s) => s.transliteration).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
