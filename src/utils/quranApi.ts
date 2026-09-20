import { SurahDetail, Ayah, AITafsirInsight } from '../types/quran';
import { SURAH_LIST } from '../data/surahList';

// In-memory cache for loaded surahs
const surahCache = new Map<number, SurahDetail>();

// High quality bundled fallback data for Al-Fatihah and other core short surahs
const BUNDLED_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    name: 'الفاتحة',
    transliteration: 'Al-Fatihah',
    translation: 'Pembukaan',
    numberOfAyahs: 7,
    revelation: 'Makkiyah',
    juzStart: 1,
    description: 'Surat Al-Fatihah adalah surat pertama dalam Al-Quran yang diturunkan di Mekah. Surat ini merupakan Ummul Qur\'an (induk Al-Qur\'an) dan rukun utama dalam sholat.',
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        juz: 1,
        text: {
          arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          latin: 'Bismillaahir-rahmaanir-rahiim.',
          translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
        }
      },
      {
        number: 2,
        numberInSurah: 2,
        juz: 1,
        text: {
          arab: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          latin: 'Al-hamdu lillaahi rabbil-\'aalamiin.',
          translation: 'Segala puji bagi Allah, Tuhan seluruh alam.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
        }
      },
      {
        number: 3,
        numberInSurah: 3,
        juz: 1,
        text: {
          arab: 'الرَّحْمَٰنِ الرَّحِيمِ',
          latin: 'Ar-rahmaanir-rahiim.',
          translation: 'Yang Maha Pengasih, Maha Penyayang.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3'
        }
      },
      {
        number: 4,
        numberInSurah: 4,
        juz: 1,
        text: {
          arab: 'مَالِكِ يَوْمِ الدِّينِ',
          latin: 'Maaliki yaumid-diin.',
          translation: 'Pemilik hari pembalasan.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
        }
      },
      {
        number: 5,
        numberInSurah: 5,
        juz: 1,
        text: {
          arab: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
          latin: 'Iyyaaka na\'budu wa iyyaaka nasta\'iin.',
          translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3'
        }
      },
      {
        number: 6,
        numberInSurah: 6,
        juz: 1,
        text: {
          arab: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
          latin: 'Ihdinash-shiraathal-mustaqiim.',
          translation: 'Tunjukilah kami jalan yang lurus,'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3'
        }
      },
      {
        number: 7,
        numberInSurah: 7,
        juz: 1,
        text: {
          arab: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
          latin: 'Shiraathal-ladziina an\'amta \'alaihim ghoiril-maghdhuubi \'alaihim waladh-dhaalliin.',
          translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.'
        },
        audio: {
          primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3'
        }
      }
    ]
  },
  112: {
    number: 112,
    name: 'الإخلاص',
    transliteration: 'Al-Ikhlas',
    translation: 'Kemurnian Keesaan Allah',
    numberOfAyahs: 4,
    revelation: 'Makkiyah',
    juzStart: 30,
    description: 'Surat Al-Ikhlas menegaskan keesaan Allah SWT secara mutlak.',
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        juz: 30,
        text: {
          arab: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
          latin: 'Qul huwalloohu ahad.',
          translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa.'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3' }
      },
      {
        number: 2,
        numberInSurah: 2,
        juz: 30,
        text: {
          arab: 'اللَّهُ الصَّمَدُ',
          latin: 'Alloohush-shomad.',
          translation: 'Allah tempat meminta segala sesuatu.'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3' }
      },
      {
        number: 3,
        numberInSurah: 3,
        juz: 30,
        text: {
          arab: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
          latin: 'Lam yalid walam yuulad.',
          translation: '(Allah) tidak beranak dan tidak pula diperanakkan,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3' }
      },
      {
        number: 4,
        numberInSurah: 4,
        juz: 30,
        text: {
          arab: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
          latin: 'Walam yakul-lahuu kufuwan ahad.',
          translation: 'Dan tidak ada sesuatu yang setara dengan Dia."'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3' }
      }
    ]
  },
  113: {
    number: 113,
    name: 'الفلق',
    transliteration: 'Al-Falaq',
    translation: 'Waktu Subuh',
    numberOfAyahs: 5,
    revelation: 'Makkiyah',
    juzStart: 30,
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        juz: 30,
        text: {
          arab: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
          latin: 'Qul a\'uudzu birabbil-falaq.',
          translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3' }
      },
      {
        number: 2,
        numberInSurah: 2,
        juz: 30,
        text: {
          arab: 'مِنْ شَرِّ مَا خَلَقَ',
          latin: 'Min syarri maa khalaq.',
          translation: 'dari kejahatan (makhluk yang) Dia ciptakan,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3' }
      },
      {
        number: 3,
        numberInSurah: 3,
        juz: 30,
        text: {
          arab: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
          latin: 'Wa min syarri ghaasiqin idzaa waqab.',
          translation: 'dan dari kejahatan malam apabila telah gelap gulita,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3' }
      },
      {
        number: 4,
        numberInSurah: 4,
        juz: 30,
        text: {
          arab: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
          latin: 'Wa min syarrin-naffaatsaati fil-\'uqad.',
          translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3' }
      },
      {
        number: 5,
        numberInSurah: 5,
        juz: 30,
        text: {
          arab: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
          latin: 'Wa min syarri haasidin idzaa hasad.',
          translation: 'dan dari kejahatan orang yang dengki apabila dia dengki."'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3' }
      }
    ]
  },
  114: {
    number: 114,
    name: 'الناس',
    transliteration: 'An-Nas',
    translation: 'Manusia',
    numberOfAyahs: 6,
    revelation: 'Makkiyah',
    juzStart: 30,
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        juz: 30,
        text: {
          arab: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
          latin: 'Qul a\'uudzu birabbin-naas.',
          translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3' }
      },
      {
        number: 2,
        numberInSurah: 2,
        juz: 30,
        text: {
          arab: 'مَلِكِ النَّاسِ',
          latin: 'Malikin-naas.',
          translation: 'Raja manusia,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3' }
      },
      {
        number: 3,
        numberInSurah: 3,
        juz: 30,
        text: {
          arab: 'إِلَٰهِ النَّاسِ',
          latin: 'Ilaahin-naas.',
          translation: 'sembahan manusia,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3' }
      },
      {
        number: 4,
        numberInSurah: 4,
        juz: 30,
        text: {
          arab: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
          latin: 'Min syarril-waswaasil-khannaas.',
          translation: 'dari kejahatan (bisikan) setan yang bersembunyi,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3' }
      },
      {
        number: 5,
        numberInSurah: 5,
        juz: 30,
        text: {
          arab: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
          latin: 'Alladzii yuwaswisu fii shuduurin-naas.',
          translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3' }
      },
      {
        number: 6,
        numberInSurah: 6,
        juz: 30,
        text: {
          arab: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
          latin: 'Minal-jinnati wan-naas.',
          translation: 'dari (golongan) jin dan manusia."'
        },
        audio: { primary: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3' }
      }
    ]
  }
};

/**
 * Fetch detailed Surah with Ayahs (Arabic, Latin transliteration, Indonesian translation, and Audio)
 */
export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  // Check in-memory cache
  if (surahCache.has(surahNumber)) {
    return surahCache.get(surahNumber)!;
  }

  const meta = SURAH_LIST.find((s) => s.number === surahNumber);
  if (!meta) {
    throw new Error(`Surah #${surahNumber} tidak ditemukan.`);
  }

  // Check localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`quran_surah_${surahNumber}`);
      if (cached) {
        const parsed: SurahDetail = JSON.parse(cached);
        surahCache.set(surahNumber, parsed);
        return parsed;
      }
    } catch {
      // ignore storage error
    }
  }

  // Attempt 1: Fetch from equran.id API v2 (Official Indonesian Quran API with Kemenag translation & transliteration)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.ayat)) {
        const ayahs: Ayah[] = json.data.ayat.map((item: any) => ({
          number: item.nomorAyat,
          numberInSurah: item.nomorAyat,
          juz: meta.juzStart,
          text: {
            arab: item.teksArab,
            latin: item.teksLatin,
            translation: item.teksIndonesia,
          },
          audio: {
            primary: item.audio?.['05'] || item.audio?.['01'] || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}_${item.nomorAyat}.mp3`,
          },
        }));

        const detail: SurahDetail = {
          ...meta,
          description: json.data.deskripsi?.replace(/<[^>]*>?/gm, ''),
          ayahs,
        };

        surahCache.set(surahNumber, detail);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`quran_surah_${surahNumber}`, JSON.stringify(detail));
          } catch {
            // storage quota
          }
        }
        return detail;
      }
    }
  } catch (err) {
    console.warn(`equran.id fetch failed for Surah ${surahNumber}, trying secondary source...`, err);
  }

  // Attempt 2: Fetch from AlQuran Cloud API (global CDN with Indonesian translation)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian,ar.alafasy`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length >= 2) {
        const arabicEdition = json.data[0];
        const indoEdition = json.data[1];
        const audioEdition = json.data[2];

        const ayahs: Ayah[] = arabicEdition.ayahs.map((ayahObj: any, idx: number) => {
          const indoAyah = indoEdition.ayahs[idx];
          const audioAyah = audioEdition?.ayahs?.[idx];
          return {
            number: ayahObj.number,
            numberInSurah: ayahObj.numberInSurah,
            juz: ayahObj.juz,
            text: {
              arab: ayahObj.text,
              translation: indoAyah ? indoAyah.text : '',
            },
            audio: {
              primary: audioAyah ? audioAyah.audio : `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahObj.number}.mp3`,
            },
          };
        });

        const detail: SurahDetail = {
          ...meta,
          ayahs,
        };

        surahCache.set(surahNumber, detail);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`quran_surah_${surahNumber}`, JSON.stringify(detail));
          } catch {
            // storage quota
          }
        }
        return detail;
      }
    }
  } catch (err) {
    console.warn(`alquran.cloud fetch failed for Surah ${surahNumber}`, err);
  }

  // Fallback to bundled data if available
  if (BUNDLED_SURAHS[surahNumber]) {
    return BUNDLED_SURAHS[surahNumber];
  }

  // If no internet connection and not bundled, provide synthetic placeholder structure with clear guidance
  const placeholderAyahs: Ayah[] = Array.from({ length: Math.min(meta.numberOfAyahs, 10) }, (_, i) => ({
    number: i + 1,
    numberInSurah: i + 1,
    juz: meta.juzStart,
    text: {
      arab: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (آية ${i + 1})`,
      latin: `Ayat ${i + 1} Surat ${meta.transliteration}`,
      translation: `Koneksi internet sedang tidak stabil untuk memuat ayat lengkap Surat ${meta.transliteration}. Silakan periksa koneksi atau klik tombol Muat Ulang.`,
    },
  }));

  return {
    ...meta,
    ayahs: placeholderAyahs,
  };
}

// In-memory cache for loaded surah tafsirs (surahNumber -> { [ayahNumber]: tafsirText })
const tafsirSurahCache = new Map<number, Record<number, string>>();

/**
 * Fetch official Kemenag RI Tafsir for an entire Surah with local persistence
 */
export async function fetchSurahTafsir(surahNumber: number): Promise<Record<number, string>> {
  if (tafsirSurahCache.has(surahNumber)) {
    return tafsirSurahCache.get(surahNumber)!;
  }

  // Check localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`quran_tafsir_${surahNumber}`);
      if (cached) {
        const parsed: Record<number, string> = JSON.parse(cached);
        tafsirSurahCache.set(surahNumber, parsed);
        return parsed;
      }
    } catch {
      // ignore storage error
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://equran.id/api/v2/tafsir/${surahNumber}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.tafsir)) {
        const tafsirMap: Record<number, string> = {};
        json.data.tafsir.forEach((item: any) => {
          if (item && item.ayat && item.teks) {
            tafsirMap[item.ayat] = item.teks;
          }
        });

        tafsirSurahCache.set(surahNumber, tafsirMap);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`quran_tafsir_${surahNumber}`, JSON.stringify(tafsirMap));
          } catch {
            // storage quota
          }
        }
        return tafsirMap;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch tafsir for Surah ${surahNumber} from equran.id:`, err);
  }

  return {};
}

/**
 * Fetch official Kemenag RI Tafsir for a specific Ayah
 */
export async function fetchAyahTafsir(surahNumber: number, ayahNumber: number): Promise<string | null> {
  const surahTafsir = await fetchSurahTafsir(surahNumber);
  return surahTafsir[ayahNumber] || null;
}

/**
 * Fetch AI Tafsir Insight (concise explanation, core theme, lessons, and key terms)
 */
export async function fetchAITafsirInsight(params: {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText?: string;
  translation?: string;
}): Promise<AITafsirInsight> {
  const { surahNumber, surahName, ayahNumber, arabicText, translation } = params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('/api/gemini/tafsir-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        surahNumber,
        surahName,
        ayahNumber,
        arabicText,
        translation,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.title && json.conciseExplanation) {
        return json as AITafsirInsight;
      }
    }
  } catch (err) {
    console.warn('AI Tafsir Insight call failed, using client-side fallback:', err);
  }

  // Client-side fallback if server is unreachable
  return {
    surahNumber,
    surahName,
    ayahNumber,
    title: `Intisari QS. ${surahName} Ayat ${ayahNumber}`,
    conciseExplanation: translation
      ? `Firman Allah dalam ayat ini berbunyi: "${translation}". Ayat ini menanamkan kesadaran iman, membimbing amalan lahir dan batin, serta mengingatkan kita untuk senantiasa bersandar kepada petunjuk Allah SWT.`
      : `Ayat ${ayahNumber} dari QS. ${surahName} memuat petunjuk bagi orang yang bertakwa untuk meningkatkan kualitas ibadah dan keteguhan akhlak.`,
    coreTheme: `Penguatan tauhid, penataan akhlak mulia, dan pengingat akan hikmah wahyu Ilahi.`,
    historicalContext: `Surah ${surahName} ayat ${ayahNumber}.`,
    lessons: [
      'Membaca dan mentadabburi firman Allah sebagai pelita penenang hati di segala keadaan.',
      'Menerapkan nilai-nilai kebaikan, kejujuran, dan ketakwaan dalam kehidupan sehari-hari.',
      'Memperbanyak rasa syukur dan doa agar senantiasa dibimbing di atas jalan yang lurus.',
    ],
    isFallback: true,
    notice: 'Menampilkan intisari dan tadabbur Al-Qur\'an.',
  };
}

