import React from 'react';
import { Play, Pause, X, Volume2, Repeat } from 'lucide-react';

interface AudioPlayerBarProps {
  surahName: string;
  ayahNumber: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  progress: number; // 0 to 100
  durationFormatted?: string;
  currentTimeFormatted?: string;
  repeatCount?: number; // 1, 3, 5, 10, or 999
  currentIteration?: number;
  onChangeRepeatCount?: (count: number) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  surahName,
  ayahNumber,
  isPlaying,
  onTogglePlay,
  onClose,
  progress,
  durationFormatted,
  currentTimeFormatted,
  repeatCount = 1,
  currentIteration = 1,
  onChangeRepeatCount,
}) => {
  const repeatOptions = [1, 3, 5, 10, 999];

  const handleCycleRepeat = () => {
    if (!onChangeRepeatCount) return;
    const currentIndex = repeatOptions.indexOf(repeatCount);
    const nextIndex = (currentIndex + 1) % repeatOptions.length;
    onChangeRepeatCount(repeatOptions[nextIndex]);
  };

  const getRepeatLabel = (count: number) => {
    if (count >= 999) return '∞ Loop';
    return `${count}x Ulang`;
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-stone-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      {/* Surah & Ayah info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Volume2 className="w-5 h-5 animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold truncate">
            QS. {surahName} : Ayat {ayahNumber}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="truncate">Syaikh Misyari Rasyid Al-Afasy</span>
            {repeatCount > 1 && (
              <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                Putaran {currentIteration}/{repeatCount >= 999 ? '∞' : repeatCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Play Controls & Repeat Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Loop / Muroja'ah Repetition Button */}
        {onChangeRepeatCount && (
          <button
            type="button"
            onClick={handleCycleRepeat}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              repeatCount > 1
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
            title="Ubah jumlah pengulangan ayat untuk muroja'ah/hafalan"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="text-[11px] whitespace-nowrap">{getRepeatLabel(repeatCount)}</span>
          </button>
        )}

        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button
          onClick={onClose}
          className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          title="Tutup Pemutar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
