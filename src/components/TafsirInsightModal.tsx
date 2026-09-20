import React, { useState, useEffect } from 'react';
import { Ayah, AITafsirInsight } from '../types/quran';
import { fetchAyahTafsir, fetchAITafsirInsight } from '../utils/quranApi';
import {
  X,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Share2,
  Play,
  Pause,
  Bookmark as BookmarkIcon,
  RotateCw,
  Lightbulb,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TafsirInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  totalAyahs: number;
  ayah: Ayah | null;
  onNavigateAyah: (newAyahNumber: number) => void;
  onPlayAudio?: (ayah: Ayah, surahName: string) => void;
  isPlayingThisAyah?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpenShare?: (shareData: {
    surahNumber: number;
    surahName: string;
    ayahNumber?: number;
    arabSnippet?: string;
    translationSnippet?: string;
  }) => void;
}

export const TafsirInsightModal: React.FC<TafsirInsightModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  ayahNumber,
  totalAyahs,
  ayah,
  onNavigateAyah,
  onPlayAudio,
  isPlayingThisAyah = false,
  isBookmarked = false,
  onToggleBookmark,
  onOpenShare,
}) => {
  const [activeTab, setActiveTab] = useState<'kemenag' | 'tadabbur'>('kemenag');
  const [kemenagTafsir, setKemenagTafsir] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<AITafsirInsight | null>(null);
  const [isLoadingKemenag, setIsLoadingKemenag] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load tafsirs whenever surahNumber or ayahNumber changes
  useEffect(() => {
    if (!isOpen || !ayah) return;

    let isMounted = true;
    setErrorMessage(null);
    setIsCopied(false);

    // 1. Fetch official Kemenag tafsir
    setIsLoadingKemenag(true);
    fetchAyahTafsir(surahNumber, ayahNumber)
      .then((res) => {
        if (isMounted) {
          setKemenagTafsir(res);
        }
      })
      .catch((err) => {
        console.warn('Error fetching Kemenag tafsir:', err);
        if (isMounted) {
          setKemenagTafsir(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingKemenag(false);
      });

    // 2. Fetch AI / Tadabbur insight
    setIsLoadingAI(true);
    fetchAITafsirInsight({
      surahNumber,
      surahName,
      ayahNumber,
      arabicText: ayah.text.arab,
      translation: ayah.text.translation,
    })
      .then((insight) => {
        if (isMounted) {
          setAiInsight(insight);
        }
      })
      .catch((err) => {
        console.warn('Error fetching AI tafsir insight:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAI(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, surahNumber, ayahNumber, ayah]);

  if (!isOpen || !ayah) return null;

  const handleCopy = async () => {
    const tafsirText =
      activeTab === 'kemenag'
        ? kemenagTafsir || 'Tafsir Kemenag belum tersedia untuk ayat ini.'
        : aiInsight?.conciseExplanation || 'Penjelasan intisari ayat.';

    const textToCopy = `QS. ${surahName} [${surahNumber}]: ${ayahNumber}
    
${ayah.text.arab}

Artinya: "${ayah.text.translation}"

Tafsir & Insight:
${tafsirText}

(Dibagikan melalui Al-Qur'an Digital)`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy tafsir text:', err);
    }
  };

  const handleShare = () => {
    if (onOpenShare) {
      onOpenShare({
        surahNumber,
        surahName,
        ayahNumber,
        arabSnippet: ayah.text.arab.slice(0, 70),
        translationSnippet: ayah.text.translation.slice(0, 90),
      });
    } else if (navigator.share) {
      navigator
        .share({
          title: `Tafsir QS. ${surahName} Ayat ${ayahNumber}`,
          text: `QS. ${surahName} Ayat ${ayahNumber}: "${ayah.text.translation}"\n\n${
            activeTab === 'kemenag' ? kemenagTafsir : aiInsight?.conciseExplanation
          }`,
        })
        .catch(() => {});
    }
  };

  return (
    <div
      id="tafsir-insight-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="tafsir-insight-modal"
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200/90 flex flex-col max-h-[90vh] text-stone-900 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-stone-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  Tafsir Insight
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Ayat {ayahNumber} dari {totalAyahs}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug mt-0.5">
                QS. {surahName} [{surahNumber}]: Ayat {ayahNumber}
              </h3>
            </div>
          </div>

          <button
            id="btn-close-tafsir-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Tutup Modal Tafsir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Ayat Preview Box */}
          <div className="bg-stone-50/90 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                Ayat {ayahNumber}
              </span>
              <div className="flex items-center gap-1">
                {onPlayAudio && (
                  <button
                    type="button"
                    onClick={() => onPlayAudio(ayah, surahName)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
                      isPlayingThisAyah
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                    title={isPlayingThisAyah ? 'Jeda Audio' : 'Dengarkan Ayat Ini'}
                  >
                    {isPlayingThisAyah ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isPlayingThisAyah ? 'Jeda' : 'Murottal'}</span>
                  </button>
                )}

                {onToggleBookmark && (
                  <button
                    type="button"
                    onClick={onToggleBookmark}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                      isBookmarked
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                    }`}
                    title={isBookmarked ? 'Hapus Bookmark' : 'Tandai Ayat'}
                  >
                    <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  title="Salin Ayat & Tafsir"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition-colors cursor-pointer"
                  title="Bagikan Ayat"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="text-right pt-1">
              <p className="font-arabic text-xl sm:text-2xl text-stone-900 leading-[2.2] sm:leading-[2.4] tracking-wide" dir="rtl">
                {ayah.text.arab}
              </p>
            </div>

            {/* Latin Transliteration */}
            {ayah.text.latin && (
              <p className="text-xs sm:text-sm text-emerald-800 font-medium italic leading-relaxed pt-1 border-t border-stone-200/60">
                {ayah.text.latin}
              </p>
            )}

            {/* Indonesian Translation */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
              "{ayah.text.translation}"
            </p>
          </div>

          {/* Tafsir Tabs Navigation */}
          <div className="flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              id="tab-tafsir-kemenag"
              type="button"
              onClick={() => setActiveTab('kemenag')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'kemenag'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tafsir Ringkas Kemenag</span>
            </button>

            <button
              id="tab-tafsir-tadabbur"
              type="button"
              onClick={() => setActiveTab('tadabbur')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tadabbur'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tadabbur & Pelajaran Hidup</span>
            </button>
          </div>

          {/* TAB 1: TAFSIR RINGKAS KEMENAG */}
          {activeTab === 'kemenag' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sumber: Tafsir Ringkas Kementerian Agama RI (Kemenag)</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 font-semibold">
                  Resmi & Terpercaya
                </span>
              </div>

              {isLoadingKemenag ? (
                <div className="py-8 text-center space-y-3">
                  <RotateCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-stone-500">
                    Memuat penjelasan tafsir ayat dari basis data Kemenag...
                  </p>
                </div>
              ) : kemenagTafsir ? (
                <div className="prose prose-stone max-w-none text-stone-800 text-sm leading-relaxed sm:text-base space-y-3 whitespace-pre-line font-sans">
                  {kemenagTafsir}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2 text-xs sm:text-sm">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    Penjelasan belum termuat secara daring
                  </p>
                  <p className="text-stone-600">
                    Anda tetap dapat membaca intisari makna dan tadabbur praktis ayat ini pada tab{' '}
                    <strong>Tadabbur & Pelajaran Hidup</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tadabbur')}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Buka Tadabbur & Pelajaran Hidup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TADABBUR & PELAJARAN HIDUP */}
          {activeTab === 'tadabbur' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isLoadingAI ? (
                <div className="py-8 text-center space-y-3">
                  <Sparkles className="w-6 h-6 text-amber-500 animate-pulse mx-auto" />
                  <p className="text-xs font-semibold text-stone-500">
                    Menganalisis tadabbur dan intisari hikmah ayat...
                  </p>
                </div>
              ) : aiInsight ? (
                <div className="space-y-4">
                  {/* Title & Core Theme */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      <h4 className="font-bold text-emerald-950 text-sm sm:text-base">
                        {aiInsight.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-medium">
                      {aiInsight.coreTheme}
                    </p>
                  </div>

                  {/* Concise Explanation */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Penjelasan & Intisari Makna
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white border border-stone-200/90 rounded-2xl p-4">
                      {aiInsight.conciseExplanation}
                    </p>
                  </div>

                  {/* Lessons / Actionable Takeaways */}
                  {aiInsight.lessons && aiInsight.lessons.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pelajaran Hidup & Amalan Nyata (Ibrah)</span>
                      </h5>
                      <div className="space-y-2">
                        {aiInsight.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Arabic Terms */}
                  {aiInsight.keyTerms && aiInsight.keyTerms.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Kosa Kata Kunci
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {aiInsight.keyTerms.map((termItem, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                          >
                            <span className="font-arabic font-bold text-stone-900 text-sm">
                              {termItem.term}
                            </span>
                            <p className="text-stone-600 leading-normal">{termItem.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Historical context / Asbabun nuzul */}
                  {aiInsight.historicalContext && (
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                      <span className="font-bold text-stone-800">Konteks Turunnya Ayat:</span>
                      <p className="leading-relaxed">{aiInsight.historicalContext}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-xs">
                  Intisari tadabbur belum dapat ditampilkan. Silakan coba kembali.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer: Next / Previous Ayah Navigation */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between shrink-0 gap-2">
          <button
            id="btn-tafsir-prev-ayah"
            type="button"
            disabled={ayahNumber <= 1}
            onClick={() => onNavigateAyah(ayahNumber - 1)}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              ayahNumber <= 1
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden min-[400px]:inline">Ayat Sebelumnya</span>
            <span className="min-[400px]:hidden">Prev</span>
          </button>

          <span className="text-xs font-bold text-stone-500">
            {ayahNumber} / {totalAyahs}
          </span>

          <button
            id="btn-tafsir-next-ayah"
            type="button"
            disabled={ayahNumber >= totalAyahs}
            onClick={() => onNavigateAyah(ayahNumber + 1)}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              ayahNumber >= totalAyahs
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
            }`}
          >
            <span className="hidden min-[400px]:inline">Ayat Selanjutnya</span>
            <span className="min-[400px]:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
