import React, { useState } from 'react';
import { RotateCcw, Check, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface DzikirItem {
  id: string;
  arabic: string;
  latin: string;
  meaning: string;
  target: number;
}

const DZIKIR_PRESETS: DzikirItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    latin: 'Subhanallah',
    meaning: 'Maha Suci Allah',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    latin: 'Alhamdulillah',
    meaning: 'Segala puji bagi Allah',
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allahu Akbar',
    meaning: 'Allah Maha Besar',
    target: 33,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    latin: 'Astaghfirullah',
    meaning: 'Aku memohon ampun kepada Allah',
    target: 100,
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    latin: 'Laa ilaha illallah',
    meaning: 'Tiada tuhan selain Allah',
    target: 100,
  },
  {
    id: 'shalawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    latin: 'Allahumma shalli ‘ala sayyidina Muhammad',
    meaning: 'Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad',
    target: 100,
  },
];

export const DigitalTasbih: React.FC = () => {
  const [selectedDzikirIndex, setSelectedDzikirIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [laps, setLaps] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeDzikir = DZIKIR_PRESETS[selectedDzikirIndex];

  // Optional subtle audio beep on tap using Web Audio API
  const playBeep = (freq = 600, duration = 0.04) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleIncrement = () => {
    const nextCount = count + 1;
    if (nextCount >= activeDzikir.target) {
      setCount(0);
      setLaps((prev) => prev + 1);
      playBeep(880, 0.12); // celebratory pitch
    } else {
      setCount(nextCount);
      playBeep(520, 0.03);
    }
  };

  const handleReset = () => {
    setCount(0);
    setLaps(0);
  };

  const progressPercent = Math.min(100, Math.round((count / activeDzikir.target) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>Tasbih Digital & Dzikir Harian</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Penghitung dzikir praktis dengan target putaran istiqomah
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              soundEnabled
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
            }`}
            title={soundEnabled ? 'Matikan Suara Ketukan' : 'Aktifkan Suara Ketukan'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset Hitungan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dzikir Selection Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DZIKIR_PRESETS.map((d, index) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              setSelectedDzikirIndex(index);
              setCount(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDzikirIndex === index
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600'
            }`}
          >
            {d.latin} ({d.target}x)
          </button>
        ))}
      </div>

      {/* Active Dzikir Display Card */}
      <div className="text-center p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 space-y-1">
        <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-emerald-900 leading-relaxed">
          {activeDzikir.arabic}
        </p>
        <p className="text-sm font-bold text-stone-800">{activeDzikir.latin}</p>
        <p className="text-xs text-stone-500 italic">"{activeDzikir.meaning}"</p>
      </div>

      {/* Main Touch Counter Button */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <button
          id="btn-tasbih-click"
          type="button"
          onClick={handleIncrement}
          className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-800/25 hover:shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center relative select-none cursor-pointer border-4 border-emerald-400/30"
        >
          {/* Progress Ring Glow */}
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
            {count}
          </div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-200/90 font-bold mt-1">
            Target {activeDzikir.target}
          </span>
          <span className="text-[10px] text-emerald-100/70 mt-0.5">Tekan untuk Hitung</span>
        </button>

        {/* Lap & Progress Indicator */}
        <div className="w-full max-w-xs space-y-2 text-center pt-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>Selesai: {progressPercent}%</span>
            <span className="font-bold text-emerald-800">
              Putaran Ke-{laps + 1} ({laps}x Khatam)
            </span>
          </div>

          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
