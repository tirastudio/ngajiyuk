import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface SurahShortcut {
  number: number;
  name: string;
  arabicName: string;
  totalAyah: number;
  fadhilah: string;
  badge: string;
  badgeColor: string;
}

const SHORTCUTS: SurahShortcut[] = [
  {
    number: 18,
    name: 'Al-Kahf',
    arabicName: 'الكهف',
    totalAyah: 110,
    fadhilah: 'Amalan istimewa hari Jumat, menerangi dengan cahaya antara dua Jumat.',
    badge: 'Sunnah Jumat',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    number: 67,
    name: 'Al-Mulk',
    arabicName: 'الملك',
    totalAyah: 30,
    fadhilah: 'Pencegah dan pelindung pembacanya dari azab dan siksa kubur.',
    badge: 'Sebelum Tidur',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    number: 55,
    name: 'Ar-Rahman',
    arabicName: 'الرحمن',
    totalAyah: 78,
    fadhilah: 'Pengingat agung nikmat Allah yang melimpah dan tak terhitung.',
    badge: 'Tadabbur Nikmat',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    number: 56,
    name: 'Al-Waqi’ah',
    arabicName: 'الواقعة',
    totalAyah: 96,
    fadhilah: 'Melapangkan rezeki dan menjauhkan pembacanya dari kefakiran.',
    badge: 'Pembuka Rezeki',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  {
    number: 36,
    name: 'Yasin',
    arabicName: 'يس',
    totalAyah: 83,
    fadhilah: 'Jantung Al-Qur’an, menghadirkan ketenangan dan pengampunan dosa.',
    badge: 'Jantung Al-Qur’an',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    number: 94,
    name: 'Asy-Syarh',
    arabicName: 'الشرح',
    totalAyah: 8,
    fadhilah: 'Melapangkan dada yang sempit dan meyakinkan janji kemudahan.',
    badge: 'Pelipur Lara',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
  },
];

interface QuickSurahShortcutsProps {
  onOpenSurah: (surahNumber: number) => void;
}

export const QuickSurahShortcuts: React.FC<QuickSurahShortcutsProps> = ({ onOpenSurah }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>Surah Pilihan & Amalan Harian</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Pintasan cepat membaca surah-surah yang memiliki keutamaan khusus
          </p>
        </div>
      </div>

      {/* Grid of Surah Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SHORTCUTS.map((s) => (
          <div
            key={s.number}
            className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <span className="font-arabic text-lg font-bold text-emerald-900 group-hover:text-emerald-700">
                  {s.arabicName}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {s.number}. QS. {s.name}
                </h3>
                <p className="text-[11px] text-stone-500">{s.totalAyah} Ayat</p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                {s.fadhilah}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenSurah(s.number)}
              className="w-full py-2 px-3 rounded-xl bg-white group-hover:bg-emerald-700 text-stone-700 group-hover:text-white text-xs font-semibold border border-stone-200 group-hover:border-emerald-700 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka Surah</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
