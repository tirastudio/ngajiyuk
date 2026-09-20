export interface SurahMeta {
  number: number;
  name: string; // Arabic name
  transliteration: string; // Latin name e.g. "Al-Fatihah"
  translation: string; // Indonesian meaning e.g. "Pembukaan"
  numberOfAyahs: number;
  revelation: 'Makkiyah' | 'Madaniyah';
  juzStart: number;
  audioUrl?: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean;
  text: {
    arab: string;
    latin?: string;
    translation: string;
  };
  audio?: {
    primary: string;
    secondary?: string[];
  };
  tafsir?: {
    kemenag?: {
      short?: string;
      long?: string;
    };
  };
}

export interface SurahDetail extends SurahMeta {
  bismillah?: {
    arab: string;
    latin?: string;
    translation?: string;
  };
  description?: string;
  ayahs: Ayah[];
}

export interface JuzInfo {
  index: number;
  name: string;
  start: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
  };
  end: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
  };
}

export interface PrayerTimes {
  date: string;
  dayName: string;
  hijriDate?: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface City {
  id: string;
  name: string;
  province?: string;
  latitude: number;
  longitude: number;
  timezone: 'WIB' | 'WITA' | 'WIT';
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabSnippet: string;
  translationSnippet: string;
  createdAt: number;
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export interface PrayerReading {
  id: string;
  title: string;
  category: 'niat' | 'gerakan' | 'dzikir' | 'doa';
  subtitle?: string;
  arabic: string;
  latin: string;
  translation: string;
  note?: string;
}

export interface NasheedItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  arabicLyrics?: string;
  translation?: string;
  duration?: string;
  audioUrl?: string;
  externalLink?: string;
}

export interface AIRecommendation {
  theme: string;
  mood?: string;
  surahNumber: number;
  surahName: string;
  ayahRange?: string;
  wisdom: string;
  practicalTip: string;
  keyAyah: {
    arabic?: string;
    translation: string;
  };
}

export interface AISummary {
  surahNumber: number;
  surahName: string;
  title: string;
  coreTheme: string;
  historicalContext: string;
  keyPoints: string[];
  takeaways: string;
}

export interface AITafsirInsight {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  title: string;
  conciseExplanation: string;
  coreTheme: string;
  historicalContext?: string;
  lessons: string[];
  keyTerms?: { term: string; meaning: string }[];
  isFallback?: boolean;
  notice?: string;
}
