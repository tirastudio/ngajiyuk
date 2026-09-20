import React, { useState, useEffect } from 'react';
import { City, PrayerTimes } from '../types/quran';
import { CITIES } from '../data/cities';
import {
  calculateKemenagPrayerTimes,
  getWeeklyPrayerSchedule,
  getNextPrayer,
  NextPrayerInfo,
} from '../utils/prayerCalculator';
import {
  MapPin,
  Clock,
  Calendar,
  Share2,
  Navigation,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CheckCircle2,
  Bell,
  Search,
} from 'lucide-react';

interface PrayerTimesViewProps {
  onOpenShare: (text: string, title: string) => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ onOpenShare }) => {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]); // Default Jakarta
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [todayTimes, setTodayTimes] = useState<PrayerTimes>(() =>
    calculateKemenagPrayerTimes(CITIES[0])
  );
  const [weeklySchedule, setWeeklySchedule] = useState<PrayerTimes[]>(() =>
    getWeeklyPrayerSchedule(CITIES[0])
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() =>
    getNextPrayer(calculateKemenagPrayerTimes(CITIES[0]))
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Update prayer calculations whenever selected city changes
  useEffect(() => {
    const times = calculateKemenagPrayerTimes(selectedCity);
    setTodayTimes(times);
    setWeeklySchedule(getWeeklyPrayerSchedule(selectedCity));
    setNextPrayer(getNextPrayer(times));
  }, [selectedCity]);

  // Live timer tick every second for next prayer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNextPrayer(getNextPrayer(todayTimes, new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, [todayTimes]);

  // Auto detect location using HTML5 Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Perangkat Anda tidak mendukung geolokasi.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Determine Indonesian timezone based on longitude
        let timezone: 'WIB' | 'WITA' | 'WIT' = 'WIB';
        if (lng > 120 && lng <= 130) timezone = 'WITA';
        if (lng > 130) timezone = 'WIT';

        // Find nearest city or create custom location
        const customCity: City = {
          id: 'custom-location',
          name: 'Lokasi Anda (GPS)',
          province: 'Geolokasi Otomatis',
          latitude: lat,
          longitude: lng,
          timezone,
        };

        setSelectedCity(customCity);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError('Gagal mendeteksi lokasi. Silakan pilih kota secara manual.');
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const filteredCities = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      (c.province && c.province.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const handleShareSchedule = () => {
    const text = `Jadwal Sholat ${selectedCity.name} (${todayTimes.date})\nMetode: Kemenag RI (${selectedCity.timezone})\n\n• Imsak: ${todayTimes.imsak}\n• Subuh: ${todayTimes.subuh}\n• Terbit: ${todayTimes.terbit}\n• Dhuha: ${todayTimes.dhuha}\n• Dzuhur: ${todayTimes.dzuhur}\n• Ashar: ${todayTimes.ashar}\n• Maghrib: ${todayTimes.maghrib}\n• Isya: ${todayTimes.isya}\n\nDipantau via Al-Qur'an & Sholat Digital`;
    onOpenShare(text, `Jadwal Sholat ${selectedCity.name}`);
  };

  const prayerItems = [
    { name: 'Imsak', time: todayTimes.imsak, icon: Moon, note: 'Pengingat sahur' },
    { name: 'Subuh', time: todayTimes.subuh, icon: Sunrise, note: '2 Rakaat' },
    { name: 'Terbit', time: todayTimes.terbit, icon: Sun, note: 'Batas akhir Subuh' },
    { name: 'Dhuha', time: todayTimes.dhuha, icon: Sun, note: 'Sholat sunnah' },
    { name: 'Dzuhur', time: todayTimes.dzuhur, icon: Sun, note: '4 Rakaat' },
    { name: 'Ashar', time: todayTimes.ashar, icon: Sunset, note: '4 Rakaat' },
    { name: 'Maghrib', time: todayTimes.maghrib, icon: Sunset, note: '3 Rakaat' },
    { name: 'Isya', time: todayTimes.isya, icon: Moon, note: '4 Rakaat' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Controls: City Selector & GPS */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* City Picker Dropdown */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                Wilayah / Kota Terpilih
              </label>
              <button
                id="city-picker-btn"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="w-full text-left font-bold text-stone-900 text-base sm:text-lg flex items-center justify-between"
              >
                <span>
                  {selectedCity.name}{' '}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedCity.timezone}
                  </span>
                </span>
                <span className="text-xs text-stone-500 font-normal">Ganti Kota ▼</span>
              </button>
            </div>
          </div>

          {/* Autocomplete Dropdown List */}
          {isCityDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-3 space-y-2 max-h-80 overflow-y-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Ketik nama kota (e.g. Surabaya, Bandung, Medan)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  autoFocus
                />
              </div>

              <div className="divide-y divide-stone-100">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                      setCitySearch('');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between hover:bg-stone-50 transition-colors ${
                      selectedCity.id === city.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-stone-400 text-[11px]">{city.province} ({city.timezone})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GPS Location & Share Actions */}
        <div className="flex items-center gap-2">
          <button
            id="gps-location-btn"
            onClick={handleDetectLocation}
            disabled={gpsLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors active:scale-95"
          >
            <Navigation className={`w-4 h-4 text-emerald-700 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Mencari Lokasi...' : 'Lokasi Saya'}</span>
          </button>

          <button
            id="share-prayer-btn"
            onClick={handleShareSchedule}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Jadwal</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
          {gpsError}
        </div>
      )}

      {/* Hero Countdown Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-600/40">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{todayTimes.dayName}, {todayTimes.date}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Menuju Waktu <span className="text-amber-300">{nextPrayer.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              Pukul {nextPrayer.time} {selectedCity.timezone} • Wilayah {selectedCity.name}
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl text-center self-stretch md:self-auto min-w-[200px]">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold block mb-1">
              Sisa Waktu
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-extrabold text-amber-300 tracking-wider">
              {nextPrayer.formattedRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Prayer Times Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" />
            <span>Jadwal Sholat Hari Ini</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            Standar Kemenag RI (+2m Ihtiyath)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {prayerItems.map((item) => {
            const Icon = item.icon;
            const isNext = nextPrayer.name.toLowerCase() === item.name.toLowerCase();

            return (
              <div
                key={item.name}
                id={`prayer-card-${item.name.toLowerCase()}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-600/20'
                    : 'bg-white border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isNext ? 'text-emerald-800' : 'text-stone-500'}`}>
                    {item.name}
                  </span>
                  <Icon className={`w-4 h-4 ${isNext ? 'text-emerald-700' : 'text-stone-400'}`} />
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-900 tracking-tight">
                  {item.time}
                </div>

                <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>{item.note}</span>
                  {isNext && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Berikutnya
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Prayer Schedule Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              Jadwal Sholat 7 Hari Ke Depan
            </h3>
            <p className="text-xs text-stone-500">
              Perhitungan astronomis Kemenag RI untuk {selectedCity.name}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 font-semibold">Hari & Tanggal</th>
                <th className="py-3 px-2 font-semibold">Imsak</th>
                <th className="py-3 px-2 font-semibold text-emerald-800">Subuh</th>
                <th className="py-3 px-2 font-semibold">Terbit</th>
                <th className="py-3 px-2 font-semibold">Dhuha</th>
                <th className="py-3 px-2 font-semibold text-emerald-800">Dzuhur</th>
                <th className="py-3 px-2 font-semibold text-emerald-800">Ashar</th>
                <th className="py-3 px-2 font-semibold text-emerald-800">Maghrib</th>
                <th className="py-3 px-2 font-semibold text-emerald-800">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {weeklySchedule.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    idx === 0 ? 'bg-emerald-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-stone-900 whitespace-nowrap">
                    {row.dayName}, {row.date} {idx === 0 && <span className="text-[10px] text-emerald-700 ml-1 font-bold">(Hari ini)</span>}
                  </td>
                  <td className="py-3 px-2 font-mono text-stone-600">{row.imsak}</td>
                  <td className="py-3 px-2 font-mono text-emerald-800 font-bold">{row.subuh}</td>
                  <td className="py-3 px-2 font-mono text-stone-400">{row.terbit}</td>
                  <td className="py-3 px-2 font-mono text-stone-600">{row.dhuha}</td>
                  <td className="py-3 px-2 font-mono text-emerald-800 font-bold">{row.dzuhur}</td>
                  <td className="py-3 px-2 font-mono text-emerald-800 font-bold">{row.ashar}</td>
                  <td className="py-3 px-2 font-mono text-emerald-800 font-bold">{row.maghrib}</td>
                  <td className="py-3 px-2 font-mono text-emerald-800 font-bold">{row.isya}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
