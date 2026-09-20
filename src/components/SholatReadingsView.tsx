import React, { useState } from 'react';
import { PRAYER_READINGS, NASHEED_COLLECTION } from '../data/bacaanSholat';
import { PrayerReading, NasheedItem } from '../types/quran';
import {
  HeartHandshake,
  Music,
  Copy,
  Check,
  Share2,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';

interface SholatReadingsViewProps {
  onOpenShare: (text: string, title: string) => void;
}

export const SholatReadingsView: React.FC<SholatReadingsViewProps> = ({ onOpenShare }) => {
  const [filter, setFilter] = useState<'all' | 'niat' | 'gerakan' | 'dzikir' | 'nasheed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (reading: PrayerReading) => {
    const text = `${reading.title}\n\n${reading.arabic}\n\nLatin: ${reading.latin}\n\nArtinya: "${reading.translation}"`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(reading.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShare = (reading: PrayerReading) => {
    const text = `${reading.title}\n\n${reading.arabic}\n\nLatin: ${reading.latin}\n\nArtinya:\n"${reading.translation}"`;
    onOpenShare(text, reading.title);
  };

  const filteredReadings = PRAYER_READINGS.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'niat') return r.category === 'niat';
    if (filter === 'gerakan') return r.category === 'gerakan';
    if (filter === 'dzikir') return r.category === 'dzikir' || r.category === 'doa';
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/30">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Panduan Ibadah Harian</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Bacaan Sholat, Dzikir & <span className="text-amber-300">Nasheed</span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-base leading-relaxed max-w-2xl">
            Panduan lengkap niat sholat 5 waktu, bacaan rukun & sunnah sholat, doa qunut, dzikir sesudah sholat, serta koleksi sholawat penyejuk hati.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          id="filter-bacaan-all"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Semua Panduan
        </button>

        <button
          id="filter-bacaan-niat"
          onClick={() => setFilter('niat')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'niat'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Niat 5 Waktu
        </button>

        <button
          id="filter-bacaan-gerakan"
          onClick={() => setFilter('gerakan')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'gerakan'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Gerakan Sholat
        </button>

        <button
          id="filter-bacaan-dzikir"
          onClick={() => setFilter('dzikir')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'dzikir'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Dzikir & Doa
        </button>

        <button
          id="filter-bacaan-nasheed"
          onClick={() => setFilter('nasheed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            filter === 'nasheed'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Sholawat & Nasheed</span>
        </button>
      </div>

      {/* Prayer Readings Cards */}
      {filter !== 'nasheed' && (
        <div className="space-y-4">
          {filteredReadings.map((reading) => (
            <div
              key={reading.id}
              id={`reading-card-${reading.id}`}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-emerald-500/40 shadow-xs space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {reading.title}
                  </h3>
                  {reading.subtitle && (
                    <p className="text-xs text-stone-500 mt-0.5">{reading.subtitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(reading)}
                    className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
                    title="Salin Teks"
                  >
                    {copiedId === reading.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(reading)}
                    className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
                    title="Bagikan Bacaan"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <div className="py-2 text-right">
                <p className="font-arabic text-xl sm:text-2xl text-stone-900 leading-[2.2]" dir="rtl">
                  {reading.arabic}
                </p>
              </div>

              {/* Latin */}
              <div className="text-xs sm:text-sm text-emerald-800 font-medium italic border-t border-stone-100 pt-3 leading-relaxed">
                {reading.latin}
              </div>

              {/* Translation */}
              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                "{reading.translation}"
              </div>

              {/* Optional Note */}
              {reading.note && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{reading.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nasheed & Sholawat Section */}
      {(filter === 'nasheed' || filter === 'all') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-t border-stone-200 pt-6">
            <Music className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-lg">
              Koleksi Sholawat & Nasheed Pilihan
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NASHEED_COLLECTION.map((item) => (
              <div
                key={item.id}
                id={`nasheed-card-${item.id}`}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                      Sholawat & Nasheed
                    </span>
                    <span className="text-xs text-stone-400">{item.artist}</span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-base">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>

                  {item.arabicLyrics && (
                    <div className="bg-stone-50 p-3 rounded-xl text-right font-arabic text-sm text-stone-800 leading-loose" dir="rtl">
                      {item.arabicLyrics}
                    </div>
                  )}

                  {item.translation && (
                    <p className="text-xs text-stone-500 italic">
                      "{item.translation}"
                    </p>
                  )}
                </div>

                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-bold border border-stone-200 transition-colors"
                  >
                    <span>Dengarkan di YouTube / Audio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
