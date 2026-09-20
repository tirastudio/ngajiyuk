import { GoogleGenAI, Type } from '@google/genai';
import { CITIES } from '../src/data/cities.ts';
import { calculateKemenagPrayerTimes, getWeeklyPrayerSchedule } from '../src/utils/prayerCalculator.ts';
import { getCuratedRecommendations, getCuratedSurahSummary, getCuratedAyahInsight } from './quranKnowledge.ts';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Robust caller for Gemini API with multi-model fallback and retry
 * Handles 503 (high demand) and temporary upstream issues gracefully.
 */
async function generateGeminiJson(prompt: string, schema: any): Promise<any | null> {
  const ai = getAI();
  if (!ai) return null;

  // Order of models to attempt based on gemini-api guidelines:
  // 1. gemini-3.8-flash (primary standard model)
  // 2. gemini-3.1-flash-lite (fast lightweight fallback)
  // 3. gemini-flash-latest (general alias fallback)
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of models) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      // 5-second timeout per model so app remains responsive
      const response = await withTimeout(generatePromise, 5000);

      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} encountered an issue:`, err?.status || err?.message || err);
      // Brief pause before trying next model
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return null;
}

/**
 * Handle AI Quran Recommendation
 */
export async function handleAIRecommendation(body: any) {
  const { theme, mood, readingHistory } = body || {};

  const prompt = `Anda adalah asisten spiritual Al-Qur'an dan konsultan tadabbur Islam yang berpengetahuan luas, santun, dan empatik.
Berdasarkan kondisi pengguna:
- Tema/Kebutuhan Spiritual: "${theme || 'Petunjuk Hidup & Ketenangan Jiwa'}"
- Catatan/Kondisi Hati: "${mood || 'Mencari ketenangan dan petunjuk hidup'}"
- Riwayat Surah Terakhir: "${readingHistory && readingHistory.length ? readingHistory.join(', ') : 'Belum ada riwayat'}"

Berikan 3 rekomendasi Surah Al-Qur'an (atau rangkaian ayat tertentu) yang sangat relevan, menyentuh, dan memberikan motivasi spiritual mendalam dalam format JSON.
Sertakan untuk setiap rekomendasi:
1. surahNumber (angka nomor surah 1-114)
2. surahName (nama surah dalam tulisan Latin resmi Indonesia)
3. ayahRange (misal "Ayat 1-10" atau "Ayat 28")
4. theme (judul fokus tema)
5. wisdom (tadabbur / hikmah spiritual mendalam dalam bahasa Indonesia yang lembut dan menguatkan hati, 2-3 kalimat)
6. practicalTip (amalan praktis sehari-hari yang dapat dilakukan)
7. keyAyah: objek dengan teks arab potongan ayat penting dan terjemahan bahasa Indonesianya.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            surahNumber: { type: Type.INTEGER },
            surahName: { type: Type.STRING },
            ayahRange: { type: Type.STRING },
            theme: { type: Type.STRING },
            wisdom: { type: Type.STRING },
            practicalTip: { type: Type.STRING },
            keyAyah: {
              type: Type.OBJECT,
              properties: {
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
              },
              required: ['translation'],
            },
          },
          required: ['surahNumber', 'surahName', 'theme', 'wisdom', 'practicalTip', 'keyAyah'],
        },
      },
    },
    required: ['recommendations'],
  };

  try {
    const result = await generateGeminiJson(prompt, schema);
    if (result && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
      return result;
    }
  } catch (err: any) {
    console.warn('Gemini recommendation call failed, using verified fallback:', err?.message || err);
  }

  // Graceful fallback to verified authentic Quranic tadabbur if Gemini is experiencing high demand (503)
  return getCuratedRecommendations(theme, mood);
}

/**
 * Handle AI Surah Summary & Tafsir Ringkas
 */
export async function handleAISummary(body: any) {
  const { surahNumber = 1, surahName = 'Al-Fatihah', language = 'id' } = body || {};

  const prompt = `Anda adalah seorang mufassir dan pakar studi Al-Qur'an.
Berikan ringkasan komprehensif, padat, dan mencerahkan untuk:
Surah Nomor: ${surahNumber} (${surahName})
Bahasa output: ${language === 'id' ? 'Bahasa Indonesia' : 'English'}

Buatlah ringkasan dalam format JSON yang mencakup:
1. surahNumber: nomor surah
2. surahName: nama surah
3. title: judul ringkasan yang menarik
4. coreTheme: tema pokok atau gagasan sentral surah (1-2 kalimat)
5. historicalContext: konteks turunnya surah (asbabun nuzul atau situasi historis secara ringkas)
6. keyPoints: array berisi 3-5 poin penting pesan utama surah
7. takeaways: pelajaran hidup praktis (ibrah) bagi seorang Muslim di era modern.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      surahNumber: { type: Type.INTEGER },
      surahName: { type: Type.STRING },
      title: { type: Type.STRING },
      coreTheme: { type: Type.STRING },
      historicalContext: { type: Type.STRING },
      keyPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      takeaways: { type: Type.STRING },
    },
    required: ['surahNumber', 'surahName', 'title', 'coreTheme', 'historicalContext', 'keyPoints', 'takeaways'],
  };

  try {
    const result = await generateGeminiJson(prompt, schema);
    if (result && result.title && result.coreTheme) {
      return result;
    }
  } catch (err: any) {
    console.warn('Gemini summary call failed, using verified fallback:', err?.message || err);
  }

  // Graceful fallback to verified authentic summary for the requested surah
  return getCuratedSurahSummary(Number(surahNumber) || 1, surahName, language);
}

/**
 * Handle AI Tafsir Insight for an Individual Ayah
 */
export async function handleAIAyahTafsir(body: any) {
  const {
    surahNumber = 1,
    surahName = 'Al-Fatihah',
    ayahNumber = 1,
    arabicText = '',
    translation = '',
    language = 'id',
  } = body || {};

  const prompt = `Anda adalah seorang ulama tafsir dan pakar tadabbur Al-Qur'an terpercaya.
Berikan tafsir ringkas, padat, mendalam, dan inspiratif untuk:
Surah: QS. ${surahName} (Surah ke-${surahNumber})
Ayat: Ayat ke-${ayahNumber}
Teks Arab: ${arabicText || '(Teks Al-Qur\'an)'}
Terjemahan: "${translation || ''}"
Bahasa output: ${language === 'id' ? 'Bahasa Indonesia' : 'English'}

Buatlah dalam format JSON:
1. surahNumber: nomor surah (angka)
2. surahName: nama surah
3. ayahNumber: nomor ayat (angka)
4. title: judul topik intisari ayat yang menyentuh hati (maks 6-8 kata)
5. conciseExplanation: tafsir ringkas dan jelas yang menerangkan makna ayat (2-4 kalimat)
6. coreTheme: tema pokok atau gagasan sentral ayat (1 kalimat)
7. historicalContext: latar belakang/asbabun nuzul ringkas jika ada, atau letak kaitan ayat
8. lessons: array 2-4 poin pelajaran hidup praktis (ibrah & tadabbur) bagi kehidupan sehari-hari
9. keyTerms: array objek kosa kata kunci { term: string, meaning: string } (1-3 istilah penting)`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      surahNumber: { type: Type.INTEGER },
      surahName: { type: Type.STRING },
      ayahNumber: { type: Type.INTEGER },
      title: { type: Type.STRING },
      conciseExplanation: { type: Type.STRING },
      coreTheme: { type: Type.STRING },
      historicalContext: { type: Type.STRING },
      lessons: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      keyTerms: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            meaning: { type: Type.STRING },
          },
          required: ['term', 'meaning'],
        },
      },
    },
    required: ['surahNumber', 'surahName', 'ayahNumber', 'title', 'conciseExplanation', 'coreTheme', 'lessons'],
  };

  try {
    const result = await generateGeminiJson(prompt, schema);
    if (result && result.title && result.conciseExplanation) {
      return {
        ...result,
        isFallback: false,
      };
    }
  } catch (err: any) {
    console.warn('Gemini ayah tafsir call failed, using verified fallback:', err?.message || err);
  }

  // Graceful fallback to verified curated ayah insight
  return getCuratedAyahInsight(
    Number(surahNumber) || 1,
    Number(ayahNumber) || 1,
    surahName,
    arabicText,
    translation
  );
}

/**
 * Handle Prayer Times with City or Coordinates
 */
export function handlePrayerTimes(query: any) {
  const cityId = query.city?.toLowerCase() || 'jakarta';
  const foundCity = CITIES.find(
    (c) => c.id.toLowerCase() === cityId || c.name.toLowerCase().includes(cityId)
  ) || CITIES[0];

  const today = new Date();
  const times = calculateKemenagPrayerTimes(foundCity, today);
  const weekly = getWeeklyPrayerSchedule(foundCity, today);

  return {
    city: foundCity,
    today: times,
    weekly,
    source: 'Kementerian Agama RI (Kemenag) Standard Calculation & Calibration'
  };
}
