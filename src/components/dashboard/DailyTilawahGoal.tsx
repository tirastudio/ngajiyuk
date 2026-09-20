import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Sparkles,
  Plus,
  Minus,
  Edit2,
  Check,
  X,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

interface DailyTilawahGoalProps {
  dailyTarget: number;
  todayAyahsRead: number;
  streakDays?: number;
  onUpdateTarget: (newTarget: number) => void;
  onUpdateProgress: (newCount: number) => void;
  onContinueReading?: (surahNumber?: number, ayahNumber?: number) => void;
}

const PRESET_TARGETS = [5, 10, 20, 50, 100];

export const DailyTilawahGoal: React.FC<DailyTilawahGoalProps> = ({
  dailyTarget = 10,
  todayAyahsRead = 0,
  streakDays = 1,
  onUpdateTarget,
  onUpdateProgress,
  onContinueReading,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(dailyTarget);
  const [customInputTarget, setCustomInputTarget] = useState(String(dailyTarget));

  // Direct manual log input state
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [manualCountInput, setManualCountInput] = useState(String(todayAyahsRead));

  // Sync if prop changes and not actively editing
  React.useEffect(() => {
    if (!isEditingTarget) {
      setTempTarget(dailyTarget);
      setCustomInputTarget(String(dailyTarget));
    }
  }, [dailyTarget, isEditingTarget]);

  React.useEffect(() => {
    if (!isManualInputOpen) {
      setManualCountInput(String(todayAyahsRead));
    }
  }, [todayAyahsRead, isManualInputOpen]);

  const targetSafe = Math.max(1, dailyTarget || 10);
  const progressPercent = Math.min(100, Math.round((todayAyahsRead / targetSafe) * 100));
  const isGoalAchieved = todayAyahsRead >= targetSafe;
  const remainingAyat = Math.max(0, targetSafe - todayAyahsRead);

  const handleSaveTarget = () => {
    const val = parseInt(customInputTarget, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget(val);
      setIsEditingTarget(false);
    }
  };

  const handleSelectPreset = (preset: number) => {
    setCustomInputTarget(String(preset));
    setTempTarget(preset);
    onUpdateTarget(preset);
    setIsEditingTarget(false);
  };

  const handleIncrement = (amount: number) => {
    const nextVal = Math.max(0, todayAyahsRead + amount);
    onUpdateProgress(nextVal);
  };

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(manualCountInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateProgress(val);
      setIsManualInputOpen(false);
    }
  };

  return (
    <div
      id="daily-tilawah-goal-tracker"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5 transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Target className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Target Tilawah Harian (Daily Tilawah Goal)
            </h2>
            {isGoalAchieved ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Target Tercapai!</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>Streak {streakDays} Hari</span>
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500">
            Atur target membaca ayat Al-Qur'an harian dan pantau perkembangan tilawah Anda secara konsisten
          </p>
        </div>

        {/* Edit Target Toggle Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isEditingTarget ? (
            <button
              id="btn-edit-daily-target"
              type="button"
              onClick={() => setIsEditingTarget(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Atur target harian"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Atur Target</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTarget(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Tutup</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Setting Panel (Expandable when editing) */}
      {isEditingTarget && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-stone-800">
              Pilih Target Cepat atau Ketik Jumlah Ayat:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                id="input-custom-target-ayat"
                type="number"
                min="1"
                max="6236"
                value={customInputTarget}
                onChange={(e) => setCustomInputTarget(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Target"
              />
              <span className="text-xs text-stone-500 font-medium">ayat/hari</span>
              <button
                id="btn-save-custom-target"
                type="button"
                onClick={handleSaveTarget}
                className="ml-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan</span>
              </button>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {PRESET_TARGETS.map((preset) => {
              const isActive = dailyTarget === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-stone-700'
                  }`}
                >
                  {preset} Ayat {preset === 20 ? '(1 Lembar)' : preset === 5 ? '(Santai)' : preset === 10 ? '(Disarankan)' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Metric & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Ayah Read / Target */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Tilawah Hari Ini
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-stone-900">
                {todayAyahsRead}
              </span>
              <span className="text-xs font-bold text-stone-500">/ {targetSafe} ayat</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            {progressPercent}%
          </div>
        </div>

        {/* Card 2: Status Sisa */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Sisa Target Hari Ini
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              {isGoalAchieved ? (
                <span className="text-lg sm:text-xl font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Khatam Harian!</span>
                </span>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-stone-900">
                    {remainingAyat}
                  </span>
                  <span className="text-xs font-bold text-stone-500">ayat lagi</span>
                </>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 flex items-center justify-center">
            {isGoalAchieved ? (
              <Award className="w-5 h-5 text-emerald-600" />
            ) : (
              <BookOpen className="w-5 h-5 text-stone-500" />
            )}
          </div>
        </div>

        {/* Card 3: Motivasi Istiqomah */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Khatam Al-Qur'an
            </span>
            <p className="text-xs font-semibold text-stone-800 mt-1">
              {Math.ceil(6236 / targetSafe)} hari lagi
            </p>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Jika istiqomah {targetSafe} ayat/hari
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-stone-600">
          <span className="flex items-center gap-1.5">
            <span>Kemajuan Tilawah Harian</span>
            {isGoalAchieved && (
              <span className="text-emerald-700 font-bold text-[11px]">• Selesai 100%</span>
            )}
          </span>
          <span className="font-bold text-stone-900">{progressPercent}%</span>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60 shadow-inner">
          <div
            id="daily-tilawah-progress-fill"
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalAchieved
                ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 shadow-xs'
                : 'bg-gradient-to-r from-emerald-700 to-teal-600'
            }`}
            style={{ width: `${Math.max(2, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Quick Action Controls: Quick Add, Decrement, Manual Log, Continue Reading */}
      <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Quick Ayah Counter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-stone-600 mr-1">Catat Tilawah:</span>

          <button
            id="btn-add-1-ayah"
            type="button"
            onClick={() => handleIncrement(1)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Tambah 1 ayat telah dibaca"
          >
            +1 Ayat
          </button>

          <button
            id="btn-add-5-ayahs"
            type="button"
            onClick={() => handleIncrement(5)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Tambah 5 ayat telah dibaca"
          >
            +5 Ayat
          </button>

          <button
            id="btn-add-10-ayahs"
            type="button"
            onClick={() => handleIncrement(10)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Tambah 10 ayat telah dibaca"
          >
            +10 Ayat
          </button>

          {todayAyahsRead > 0 && (
            <button
              id="btn-minus-1-ayah"
              type="button"
              onClick={() => handleIncrement(-1)}
              className="p-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-stone-500 text-xs transition-colors cursor-pointer"
              title="Kurangi 1 ayat"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsManualInputOpen(!isManualInputOpen)}
            className="text-xs text-stone-500 hover:text-emerald-700 underline font-medium ml-1 cursor-pointer"
          >
            {isManualInputOpen ? 'Tutup Input' : 'Ketik Manual'}
          </button>
        </div>

        {/* Right: Continue Reading button */}
        {onContinueReading && (
          <button
            id="btn-tilawah-open-mushaf"
            type="button"
            onClick={() => onContinueReading()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lanjut Baca Al-Qur'an</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Manual Count Direct Input Box */}
      {isManualInputOpen && (
        <form
          onSubmit={handleSaveManualLog}
          className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2 max-w-sm"
        >
          <label className="text-xs font-semibold text-stone-700 whitespace-nowrap">
            Jumlah Ayat Dibaca Hari Ini:
          </label>
          <input
            id="input-manual-ayahs-count"
            type="number"
            min="0"
            max="6236"
            value={manualCountInput}
            onChange={(e) => setManualCountInput(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs"
          >
            Simpan
          </button>
        </form>
      )}
    </div>
  );
};
