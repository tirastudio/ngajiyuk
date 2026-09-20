import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, BookmarkCheck } from 'lucide-react';

interface AyatInspiration {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  tadabbur: string;
  theme: string;
}

const DAILY_AYAT_LIST: AyatInspiration[] = [
  {
    surahNumber: 94,
    surahName: 'Asy-Syarh',
    ayahNumber: 6,
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Sesungguhnya beserta kesulitan itu ada kemudahan.',
    tadabbur: 'Setiap kesulitan yang kita hadapi sesungguhnya telah Allah siapkan pintu-pintu jalan keluar dan kemudahan di dalamnya. Jangan putus asa dari rahmat-Nya.',
    theme: 'Harapan & Ketabahan',
  },
  {
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    ayahNumber: 152,
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'Maka ingatlah kepada-Ku, niscaya Aku ingat (pula) kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu mengingkari (nikmat-Ku).',
    tadabbur: 'Dzikir dan rasa syukur adalah kunci keterhubungan hamba dengan Sang Pencipta. Saat kita mengingat Allah dalam lapang maupun sempit, Allah akan selalu menyertai kita.',
    theme: 'Dzikir & Syukur',
  },
  {
    surahNumber: 65,
    surahName: 'At-Talaq',
    ayahNumber: 3,
    arabic: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'Dan Dia memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa bertawakkal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.',
    tadabbur: 'Tawakkal sejati setelah ikhtiar maksimal menghadirkan ketenangan jiwa dan rezeki tak terduga yang datang tepat pada saat dibutuhkan.',
    theme: 'Tawakkal & Rezeki',
  },
  {
    surahNumber: 13,
    surahName: 'Ar-Ra’d',
    ayahNumber: 28,
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: '(Yaitu) orang-orang yang beriman dan hati mereka manjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram.',
    tadabbur: 'Kegelisahan dan kecemasan duniawi akan luruh saat lisan dan hati dipenuhi dengan dzikir dan tilawah kalam ilahi.',
    theme: 'Ketenangan Hati',
  },
  {
    surahNumber: 3,
    surahName: 'Ali ‘Imran',
    ayahNumber: 139,
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    translation: 'Janganlah kamu bersikap lemah, dan janganlah (pula) kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi (derajatnya), jika kamu orang-orang yang beriman.',
    tadabbur: 'Iman memberikan kekuatan batin untuk bangkit dari kegagalan. Jangan biarkan kesedihan memadamkan semangat berbuat kebaikan.',
    theme: 'Kekuatan & Iman',
  },
];

interface DailyAyatInspirationProps {
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
}

export const DailyAyatInspiration: React.FC<DailyAyatInspirationProps> = ({ onOpenSurah }) => {
  // Rotate by day of year, or let user cycle
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const [currentIndex, setCurrentIndex] = useState(dayOfYear % DAILY_AYAT_LIST.length);

  const currentAyat = DAILY_AYAT_LIST[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_AYAT_LIST.length);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      {/* Background Decorative Motifs */}
      <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-700/60 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Ayat & Tadabbur Pilihan Hari Ini
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-700/40 text-emerald-200 border border-emerald-600/30">
              {currentAyat.theme}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white transition-colors cursor-pointer"
            title="Ganti Ayat Pilihan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acak Ayat Lain</span>
          </button>
        </div>

        {/* Arabic Text */}
        <div className="pt-2 text-right">
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-amber-100/95 leading-loose tracking-wide"
          >
            {currentAyat.arabic}
          </p>
        </div>

        {/* Indonesian Translation */}
        <p className="text-sm sm:text-base text-stone-100 font-medium leading-relaxed italic">
          "{currentAyat.translation}"
        </p>

        {/* Tadabbur Hikmah Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40 backdrop-blur-xs text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          <div className="flex items-start gap-2">
            <BookmarkCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Renungan Tadabbur: </span>
              <span>{currentAyat.tadabbur}</span>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-700/40 flex-wrap gap-3">
          <span className="text-xs font-semibold text-emerald-200">
            QS. {currentAyat.surahName} : Ayat {currentAyat.ayahNumber}
          </span>

          <button
            type="button"
            onClick={() => onOpenSurah(currentAyat.surahNumber, currentAyat.ayahNumber)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <span>Baca Surah Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
