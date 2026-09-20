import React, { useState } from 'react';
import {
  DZIKIR_PAGI_LIST,
  DZIKIR_PETANG_LIST,
  DOA_HARIAN_LIST,
  PUASA_SUNNAH_LIST,
  DzikirItem,
  DoaHarianItem,
  PuasaSunnahItem,
} from '../data/dzikirDoaData';
import { PRAYER_READINGS } from '../data/bacaanSholat';
import { PrayerReading } from '../types/quran';
import {
  Sun,
  Moon,
  Heart,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Search,
  Sparkles,
  Info,
  Clock,
  BookOpen,
} from 'lucide-react';

interface AmalanDoaViewProps {
  onOpenShare: (text: string, title: string) => void;
  defaultSubTab?: 'dzikir_pagi' | 'dzikir_petang' | 'doa_harian' | 'puasa_sunnah' | 'sholat';
}

export const AmalanDoaView: React.FC<AmalanDoaViewProps> = ({
  onOpenShare,
  defaultSubTab = 'dzikir_pagi',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dzikir_pagi' | 'dzikir_petang' | 'doa_harian' | 'puasa_sunnah' | 'sholat'
  >(defaultSubTab);

  // Counter states for dzikir
  const [dzikirCounts, setDzikirCounts] = useState<{ [id: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [doaCategory, setDoaCategory] = useState<string>('all');

  // Handle Dzikir Counter Tap
  const handleTapDzikir = (id: string, targetCount: number) => {
    setDzikirCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= targetCount) {
        // Reset if already completed and tapped again
        return { ...prev, [id]: 1 };
      }
      return { ...prev, [id]: current + 1 };
    });

    // Gentle haptic feedback if supported
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
  };

  const handleResetDzikir = (id: string) => {
    setDzikirCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter Doa
  const filteredDoa = DOA_HARIAN_LIST.filter((doa) => {
    const matchesSearch =
      doa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doa.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doa.latin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = doaCategory === 'all' || doa.category === doaCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="amalan-ibadah-view" className="max-w-5xl mx-auto space-y-7 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/30">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Koleksi Amalan & Doa Harian Muslim</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dzikir Pagi Petang, Doa & <span className="text-amber-300">Puasa Sunnah</span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Tuntunan dzikir pagi dan petang shahih terpandu dengan counter hitungan interaktif, doa-doa mustajab harian, niat puasa sunnah, dan panduan sholat lengkap.
          </p>
        </div>
      </div>

      {/* Main Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        <button
          id="tab-dzikir-pagi"
          type="button"
          onClick={() => setActiveSubTab('dzikir_pagi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'dzikir_pagi'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Dzikir Pagi (Al-Ma'tsurat)</span>
        </button>

        <button
          id="tab-dzikir-petang"
          type="button"
          onClick={() => setActiveSubTab('dzikir_petang')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'dzikir_petang'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Dzikir Petang</span>
        </button>

        <button
          id="tab-doa-harian"
          type="button"
          onClick={() => setActiveSubTab('doa_harian')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'doa_harian'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Kumpulan Doa Harian</span>
        </button>

        <button
          id="tab-puasa-sunnah"
          type="button"
          onClick={() => setActiveSubTab('puasa_sunnah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'puasa_sunnah'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Puasa Sunnah</span>
        </button>

        <button
          id="tab-sholat-panduan"
          type="button"
          onClick={() => setActiveSubTab('sholat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'sholat'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bacaan Sholat</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 1. TAB: DZIKIR PAGI & 2. TAB: DZIKIR PETANG                         */}
      {/* ------------------------------------------------------------------- */}
      {(activeSubTab === 'dzikir_pagi' || activeSubTab === 'dzikir_petang') && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                {activeSubTab === 'dzikir_pagi' ? (
                  <>
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>Tuntunan Dzikir Pagi Shahih</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span>Tuntunan Dzikir Petang Shahih</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-stone-500">
                {activeSubTab === 'dzikir_pagi'
                  ? 'Dibaca antara sholat Subuh hingga matahari terbit (atau menjelang siang).'
                  : 'Dibaca antara sholat Ashar hingga menjelang sholat Isya.'}
                {' '}Klik tombol counter pada tiap kartu untuk menghitung target bacaan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDzikirCounts({})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                title="Reset semua hitungan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua</span>
              </button>
            </div>
          </div>

          {/* List of Dzikir Cards */}
          <div className="space-y-4">
            {(activeSubTab === 'dzikir_pagi' ? DZIKIR_PAGI_LIST : DZIKIR_PETANG_LIST).map(
              (dzikir, index) => {
                const count = dzikirCounts[dzikir.id] || 0;
                const isCompleted = count >= dzikir.targetCount;

                return (
                  <div
                    key={dzikir.id}
                    id={`dzikir-card-${dzikir.id}`}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs ${
                      isCompleted
                        ? 'border-emerald-400/80 bg-emerald-50/15 ring-1 ring-emerald-400/30'
                        : 'border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {/* Header: Title, Source & Action buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-700 text-xs font-black flex items-center justify-center border border-stone-200">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{dzikir.title}</h3>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {dzikir.source}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              dzikir.id,
                              `${dzikir.title}\n\n${dzikir.arabic}\n\nLatin: ${dzikir.latin}\n\nArtinya: "${dzikir.translation}"\n\nFadhilah: ${dzikir.fadhilah}`
                            )
                          }
                          className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
                          title="Salin teks dzikir"
                        >
                          {copiedId === dzikir.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenShare(
                              `${dzikir.title}\n\n${dzikir.arabic}\n\nLatin: ${dzikir.latin}\n\nArtinya: "${dzikir.translation}"`,
                              dzikir.title
                            )
                          }
                          className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
                          title="Bagikan dzikir"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse */}
                    <div className="py-4 text-right">
                      <p
                        className="font-arabic text-2xl sm:text-3xl text-stone-900 leading-[2.3] tracking-wide"
                        dir="rtl"
                      >
                        {dzikir.arabic}
                      </p>
                    </div>

                    {/* Latin & Translation */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <p className="text-xs sm:text-sm text-emerald-800/90 font-medium leading-relaxed italic">
                        {dzikir.latin}
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        "{dzikir.translation}"
                      </p>
                    </div>

                    {/* Keutamaan / Fadhilah */}
                    <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Keutamaan: </span>
                        <span>{dzikir.fadhilah}</span>
                      </div>
                    </div>

                    {/* Interactive Counter Tap Section */}
                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-500">Target:</span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800">
                          {dzikir.targetCount}x bacaan
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesai</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {count > 0 && (
                          <button
                            type="button"
                            onClick={() => handleResetDzikir(dzikir.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Reset counter ini"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleTapDzikir(dzikir.id, dzikir.targetCount)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <span>{isCompleted ? '✓ Selesai' : 'Tekan untuk Hitung'}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-black/20 text-white font-mono text-xs">
                            {count} / {dzikir.targetCount}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 3. TAB: DOA HARIAN                                                  */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'doa_harian' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Search & Category Filter */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                id="search-doa-input"
                type="text"
                placeholder="Cari doa harian, kata kunci terjemahan, atau tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Semua Kategori' },
                { id: 'harian', label: 'Harian (Tidur, Bangun)' },
                { id: 'quran', label: 'Doa Al-Qur’an (Rabbana)' },
                { id: 'ibadah', label: 'Masjid & Majelis' },
                { id: 'keluarga', label: 'Orang Tua & Keluarga' },
                { id: 'perlindungan', label: 'Perlindungan & Hutang' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDoaCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    doaCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doa Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoa.map((doa) => (
              <div
                key={doa.id}
                id={`doa-card-${doa.id}`}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 hover:border-emerald-300 shadow-xs flex flex-col justify-between space-y-3 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-emerald-800">{doa.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            doa.id,
                            `${doa.title}\n\n${doa.arabic}\n\nLatin: ${doa.latin}\n\nArtinya: "${doa.translation}"\n(Sumber: ${doa.source})`
                          )
                        }
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                        title="Salin doa"
                      >
                        {copiedId === doa.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenShare(
                            `${doa.title}\n\n${doa.arabic}\n\nLatin: ${doa.latin}\n\nArtinya: "${doa.translation}"`,
                            doa.title
                          )
                        }
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                        title="Bagikan doa"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="py-3 text-right">
                    <p
                      className="font-arabic text-xl sm:text-2xl text-stone-900 leading-[2.2]"
                      dir="rtl"
                    >
                      {doa.arabic}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-emerald-800/90 font-medium italic">{doa.latin}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">"{doa.translation}"</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Sumber: {doa.source}</span>
                  <span className="capitalize px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {doa.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 4. TAB: JADWAL PUASA SUNNAH & NIAT                                  */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'puasa_sunnah' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>Kalender & Panduan Niat Puasa Sunnah</span>
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Puasa sunnah merupakan sarana terbaik mendekatkan diri kepada Allah SWT, menghapus dosa, dan menjaga kesehatan ruhani serta jasmani. Berikut jadwal rutin dan lafadz niatnya.
            </p>
          </div>

          <div className="space-y-4">
            {PUASA_SUNNAH_LIST.map((puasa, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 hover:border-teal-300 shadow-xs space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{puasa.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        <Clock className="w-3 h-3 text-teal-600" />
                        <span>{puasa.schedule}</span>
                      </span>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    {puasa.daysBadge}
                  </span>
                </div>

                {/* Lafadz Niat Puasa */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Lafadz Niat Puasa:
                  </span>
                  <p className="font-arabic text-xl sm:text-2xl text-stone-900 text-right py-1 leading-[2]" dir="rtl">
                    {puasa.niatArabic}
                  </p>
                  <p className="text-xs text-emerald-800 font-medium italic">{puasa.niatLatin}</p>
                  <p className="text-xs text-stone-600">"{puasa.niatTranslation}"</p>
                </div>

                {/* Keutamaan */}
                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Keutamaan & Dalil: </span>
                    <span>{puasa.keutamaan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 5. TAB: BACAAN SHOLAT                                               */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'sholat' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRAYER_READINGS.map((reading) => (
              <div
                key={reading.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-800">{reading.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          reading.id,
                          `${reading.title}\n\n${reading.arabic}\n\nLatin: ${reading.latin}\n\nArtinya: "${reading.translation}"`
                        )
                      }
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                      title="Salin bacaan"
                    >
                      {copiedId === reading.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="py-2 text-right">
                    <p className="font-arabic text-xl sm:text-2xl text-stone-900 leading-[2.2]" dir="rtl">
                      {reading.arabic}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-emerald-800 font-medium italic">{reading.latin}</p>
                    <p className="text-xs text-stone-600">"{reading.translation}"</p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 capitalize pt-2 border-t border-stone-100">
                  Kategori: {reading.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
