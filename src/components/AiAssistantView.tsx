import React, { useState, useEffect } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { AIRecommendation, AISummary } from '../types/quran';
import {
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Heart,
  AlertCircle,
  Info,
} from 'lucide-react';

interface AiAssistantViewProps {
  initialTheme?: string;
  initialSurahForSummary?: { number: number; name: string } | null;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  initialTheme,
  initialSurahForSummary,
  onSelectSurah,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recommend' | 'summary'>('recommend');

  // Recommendation State
  const [themeInput, setThemeInput] = useState(initialTheme || '');
  const [moodInput, setMoodInput] = useState('');
  const [recLoading, setRecLoading] = useState(false);
  const [recResults, setRecResults] = useState<AIRecommendation[] | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [recNotice, setRecNotice] = useState<string | null>(null);

  // Summary State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(
    initialSurahForSummary?.number || 1
  );
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<AISummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryNotice, setSummaryNotice] = useState<string | null>(null);

  // Quick Spiritual Theme Presets
  const themePresets = [
    { label: '🌿 Ketenangan Batin & Atasi Cemas', theme: 'Ketenangan Batin, Mengatasi Kegelisahan dan Cemas' },
    { label: '💰 Rezeki Berkah & Tawakal', theme: 'Rezeki yang Berkah, Kelapangan Hidup, dan Tawakal' },
    { label: '🛡️ Perlindungan Diri & Keluarga', theme: 'Perlindungan dari Kejahatan, Hasad, dan Godaan Setan' },
    { label: '🤲 Pengampunan Dosa & Taubat', theme: 'Pintu Taubat, Pengampunan Dosa, dan Rahmat Allah yang Luas' },
    { label: '⛰️ Sabar Menghadapi Musibah', theme: 'Ketabahan Hati, Kesabaran dalam Sakit dan Ujian Hidup' },
    { label: '🌸 Syukur & Bahagia', theme: 'Mensyukuri Nikmat dan Menemukan Kedamaian Hakiki' },
  ];

  // If passed initialSurahForSummary, switch to summary tab and trigger
  useEffect(() => {
    if (initialSurahForSummary) {
      setActiveSubTab('summary');
      setSelectedSurahNumber(initialSurahForSummary.number);
      fetchSummary(initialSurahForSummary.number);
    }
  }, [initialSurahForSummary]);

  // If passed initialTheme, trigger recommendation
  useEffect(() => {
    if (initialTheme) {
      setThemeInput(initialTheme);
      fetchRecommendations(initialTheme, '');
    }
  }, [initialTheme]);

  const fetchRecommendations = async (theme: string, mood: string) => {
    if (!theme.trim()) return;
    setRecLoading(true);
    setRecError(null);
    setRecNotice(null);

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          mood: mood || 'Mencari bimbingan spiritual dan ketenangan hati',
        }),
      });

      const json = await res.json();
      if (json && json.recommendations && json.recommendations.length > 0) {
        setRecResults(json.recommendations);
        if (json.notice) {
          setRecNotice(json.notice);
        }
      } else if (json && json.error) {
        throw new Error(json.error);
      } else {
        throw new Error('Format respon AI tidak valid');
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setRecError('Gagal memuat rekomendasi AI. Silakan coba kembali sesaat lagi.');
    } finally {
      setRecLoading(false);
    }
  };

  const fetchSummary = async (surahNum: number) => {
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryNotice(null);

    const surahMeta = SURAH_LIST.find((s) => s.number === surahNum);
    const surahName = surahMeta?.transliteration || `Surah ${surahNum}`;

    try {
      const res = await fetch('/api/gemini/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber: surahNum,
          surahName,
          language: 'id',
        }),
      });

      const json = await res.json();
      if (json && (json.title || json.coreTheme)) {
        setSummaryResult(json);
        if (json.notice) {
          setSummaryNotice(json.notice);
        }
      } else if (json && json.error) {
        throw new Error(json.error);
      } else {
        throw new Error('Format data ringkasan tidak valid');
      }
    } catch (err: any) {
      console.error('Error fetching summary:', err);
      setSummaryError('Gagal memuat ringkasan. Silakan coba kembali.');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/30">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Didukung Gemini 3.8 Flash • AI Spiritual Quran Advisor</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tadabbur Al-Qur'an & <span className="text-amber-300">Rekomendasi Cerdas</span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-base leading-relaxed max-w-2xl">
            Temukan ayat-ayat Al-Qur'an yang selaras dengan kondisi hati dan tantangan hidup Anda saat ini, atau pelajari intisari dan asbabun nuzul setiap surah dengan ringkasan mendalam dari AI.
          </p>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex border-b border-stone-200">
        <button
          id="ai-tab-recommend"
          onClick={() => setActiveSubTab('recommend')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'recommend'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Rekomendasi Berdasarkan Kondisi Hati</span>
        </button>

        <button
          id="ai-tab-summary"
          onClick={() => {
            setActiveSubTab('summary');
            if (!summaryResult) {
              fetchSummary(selectedSurahNumber);
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'summary'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ringkasan & Intisari Surah</span>
        </button>
      </div>

      {/* TAB 1: RECOMMENDATION */}
      {activeSubTab === 'recommend' && (
        <div className="space-y-6">
          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Pilih Tema Spiritual Populer:
            </label>
            <div className="flex flex-wrap gap-2">
              {themePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setThemeInput(preset.theme);
                    fetchRecommendations(preset.theme, moodInput);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    themeInput === preset.theme
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input Box */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-700 block">
              Atau Tuliskan Kondisi & Pertanyaan Spiritual Anda:
            </label>
            <textarea
              id="ai-custom-prompt-input"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="Contoh: Saya sedang merasa cemas akan masa depan pekerjaan, ayat apa yang bisa menguatkan hati saya untuk tetap bertawakal?"
              rows={3}
              className="w-full p-3.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-800"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-stone-400">
                AI akan memberikan 3 rekomendasi surah, tadabbur, dan amalan praktis.
              </span>
              <button
                id="ai-generate-rec-btn"
                onClick={() => fetchRecommendations(themeInput, moodInput)}
                disabled={recLoading || !themeInput.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
              >
                {recLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dapatkan Rekomendasi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {recError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{recError}</span>
              </div>
              <button
                onClick={() => fetchRecommendations(themeInput, moodInput)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-all active:scale-95"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Informational Notice if any */}
          {recNotice && !recError && (
            <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs font-medium shadow-xs">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{recNotice}</span>
            </div>
          )}

          {/* Recommendation Results */}
          {recResults && (
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>Rekomendasi Ayat & Tadabbur untuk Anda</span>
              </h3>

              <div className="grid grid-cols-1 gap-5">
                {recResults.map((rec, idx) => (
                  <div
                    key={idx}
                    id={`ai-rec-card-${idx}`}
                    className="bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-emerald-500/50 shadow-sm space-y-4 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                          {rec.theme}
                        </span>
                        <h4 className="text-lg font-bold text-stone-900 mt-2">
                          QS. {rec.surahName} ({rec.ayahRange || `Surah ke-${rec.surahNumber}`})
                        </h4>
                      </div>

                      <button
                        onClick={() => onSelectSurah(rec.surahNumber)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Buka di Mushaf</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>

                    {/* Key Ayah Snippet */}
                    {rec.keyAyah && (
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-2">
                        {rec.keyAyah.arabic && (
                          <p className="font-arabic text-xl sm:text-2xl text-stone-900 text-right leading-loose" dir="rtl">
                            {rec.keyAyah.arabic}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-stone-700 italic font-medium">
                          "{rec.keyAyah.translation}"
                        </p>
                      </div>
                    )}

                    {/* Wisdom / Hikmah */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                        Hikmah Spiritual (Tadabbur):
                      </span>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {rec.wisdom}
                      </p>
                    </div>

                    {/* Practical Tip */}
                    <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Amalan Harian: </strong>
                        <span>{rec.practicalTip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SURAH SUMMARY */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          {/* Surah Dropdown Selector for Summary */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Pilih Surah untuk Diringkas:
              </label>
              <select
                id="summary-surah-picker"
                value={selectedSurahNumber}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSelectedSurahNumber(num);
                  fetchSummary(num);
                }}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.transliteration} ({s.translation}) - {s.numberOfAyahs} Ayat
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-trigger-summary"
              onClick={() => fetchSummary(selectedSurahNumber)}
              disabled={summaryLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 self-end sm:self-auto"
            >
              {summaryLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Meringkas...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Perbarui Ringkasan</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message if any */}
          {summaryError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{summaryError}</span>
              </div>
              <button
                onClick={() => fetchSummary(selectedSurahNumber)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-all active:scale-95"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Informational Notice if any */}
          {summaryNotice && !summaryError && (
            <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs font-medium shadow-xs">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{summaryNotice}</span>
            </div>
          )}

          {/* Summary Display Card */}
          {summaryResult && !summaryLoading && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                    Surah ke-{summaryResult.surahNumber}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
                    {summaryResult.title}
                  </h3>
                </div>

                <button
                  onClick={() => onSelectSurah(summaryResult.surahNumber)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Baca Surah Lengkap</span>
                </button>
              </div>

              {/* Core Theme */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Tema Pokok & Intisari:
                </h4>
                <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                  {summaryResult.coreTheme}
                </p>
              </div>

              {/* Historical Context / Asbabun Nuzul */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Konteks Turunnya Surah (Asbabun Nuzul):
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {summaryResult.historicalContext}
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Poin-Poin Utama Ajaran:
                </h4>
                <ul className="space-y-2">
                  {summaryResult.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Takeaways */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/70 space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Ibrah & Pelajaran Hidup:
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {summaryResult.takeaways}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
