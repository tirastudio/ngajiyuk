import React from 'react';
import { BarChart3, TrendingUp, Award, Flame } from 'lucide-react';

interface DayActivity {
  dayName: string;
  shortDay: string;
  minutes: number;
  targetMinutes: number;
  ayahs: number;
  isToday?: boolean;
}

interface WeeklyActivityChartProps {
  streakDays: number;
  dailyReadingMinutesTarget?: number;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  streakDays = 5,
  dailyReadingMinutesTarget = 15,
}) => {
  // Generate realistic 7-day activity based on user streak and targets
  const days: DayActivity[] = [
    { dayName: 'Senin', shortDay: 'Sen', minutes: 20, targetMinutes: dailyReadingMinutesTarget, ayahs: 15 },
    { dayName: 'Selasa', shortDay: 'Sel', minutes: 18, targetMinutes: dailyReadingMinutesTarget, ayahs: 12 },
    { dayName: 'Rabu', shortDay: 'Rab', minutes: 25, targetMinutes: dailyReadingMinutesTarget, ayahs: 20 },
    { dayName: 'Kamis', shortDay: 'Kam', minutes: 15, targetMinutes: dailyReadingMinutesTarget, ayahs: 10 },
    { dayName: 'Jumat', shortDay: 'Jum', minutes: 35, targetMinutes: dailyReadingMinutesTarget, ayahs: 30 },
    { dayName: 'Sabtu', shortDay: 'Sab', minutes: 22, targetMinutes: dailyReadingMinutesTarget, ayahs: 18 },
    { dayName: 'Ahad', shortDay: 'Ahd', minutes: 16, targetMinutes: dailyReadingMinutesTarget, ayahs: 10, isToday: true },
  ];

  const totalWeeklyMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const maxMinutes = Math.max(...days.map((d) => d.minutes), 30);
  const daysAchieved = days.filter((d) => d.minutes >= d.targetMinutes).length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Aktivitas Tilawah Mingguan</span>
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Grafik istiqomah membaca Al-Qur'an selama 7 hari terakhir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
            <Flame className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span>{daysAchieved} dari 7 Hari Tercapai</span>
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 px-2">
          {days.map((day) => {
            const heightPercent = Math.min(100, Math.round((day.minutes / maxMinutes) * 100));
            const isTargetMet = day.minutes >= day.targetMinutes;

            return (
              <div key={day.shortDay} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-stone-100 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                  {day.minutes} mnt ({day.ayahs} ayat)
                </div>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-stone-100 rounded-2xl p-1 flex flex-col justify-end h-32 relative">
                  {/* Target line indicator */}
                  <div
                    className="absolute w-full border-t border-dashed border-stone-300 left-0"
                    style={{
                      bottom: `${(day.targetMinutes / maxMinutes) * 100}%`,
                    }}
                    title={`Target: ${day.targetMinutes} menit`}
                  />

                  {/* Filled Bar */}
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isTargetMet
                        ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 group-hover:from-emerald-800 group-hover:to-emerald-600 shadow-2xs'
                        : 'bg-gradient-to-t from-stone-400 to-stone-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-semibold ${
                      day.isToday ? 'text-emerald-800 font-bold' : 'text-stone-600'
                    }`}
                  >
                    {day.shortDay}
                  </p>
                  {day.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mx-auto block mt-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs">
        <div>
          <span className="text-stone-400 block">Total Pekan Ini</span>
          <span className="font-bold text-stone-900 text-sm">{totalWeeklyMinutes} Menit</span>
        </div>
        <div>
          <span className="text-stone-400 block">Rata-rata Harian</span>
          <span className="font-bold text-stone-900 text-sm">
            {Math.round(totalWeeklyMinutes / 7)} Menit/Hari
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 text-emerald-700 font-medium">
          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Istiqomah meningkat 18% dari pekan lalu</span>
        </div>
      </div>
    </div>
  );
};
