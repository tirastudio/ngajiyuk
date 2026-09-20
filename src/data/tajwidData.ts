export interface TajwidRule {
  id: string;
  name: string;
  category: 'nun_sukun' | 'mim_sukun' | 'mad' | 'qalqalah' | 'waqaf';
  definition: string;
  letters: string[];
  howToRead: string;
  exampleArabic: string;
  exampleLatin: string;
  exampleAyahSnippet: string;
  colorTag: string; // Tailwind color class badge
}

export const TAJWID_RULES: TajwidRule[] = [
  // 1. Nun Sukun & Tanwin
  {
    id: 'izhar_halqi',
    name: 'Izhar Halqi (Jelas di Tenggorokan)',
    category: 'nun_sukun',
    definition: 'Apabila Nun Sukun (نْ) atau Tanwin (ـًـٍـٌ) bertemu dengan salah satu dari 6 huruf halaq (tenggorokan).',
    letters: ['ء (Hamzah)', 'هـ (Ha)', 'ع (\'Ain)', 'ح (Ha)', 'غ (Ghain)', 'خ (Kha)'],
    howToRead: 'Dibaca secara jelas, terang, tanpa mendengung (ghunnah), dan tanpa jeda.',
    exampleArabic: 'مَنْ ءَامَنَ / عَنْهُمْ',
    exampleLatin: "Man aamana / 'anhum",
    exampleAyahSnippet: 'QS. Al-Baqarah: 62 & QS. Al-Bayyinah: 8',
    colorTag: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'idgham_bighunnah',
    name: 'Idgham Bighunnah (Melebur dengan Dengung)',
    category: 'nun_sukun',
    definition: 'Apabila Nun Sukun (نْ) atau Tanwin bertemu salah satu dari 4 huruf: Ya, Nun, Mim, Wawu (يَنْمُو).',
    letters: ['ي (Ya)', 'ن (Nun)', 'م (Mim)', 'و (Wawu)'],
    howToRead: 'Meleburkan suara nun sukun/tanwin ke huruf berikutnya disertai dengung sepanjang 2 harakat.',
    exampleArabic: 'مَنْ يَقُولُ / هُدًى لِلْمُتَّقِينَ',
    exampleLatin: 'May-yaquulu / hudal lilmuttaqiin',
    exampleAyahSnippet: 'QS. Al-Baqarah: 8 & QS. Al-Baqarah: 2',
    colorTag: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'idgham_bilaghunnah',
    name: 'Idgham Bilaghunnah (Melebur Tanpa Dengung)',
    category: 'nun_sukun',
    definition: 'Apabila Nun Sukun (نْ) atau Tanwin bertemu huruf Lam (ل) atau Ra (ر).',
    letters: ['ل (Lam)', 'ر (Ra)'],
    howToRead: 'Meleburkan suara nun sukun secara sempurna ke huruf Lam atau Ra tanpa dengungan sama sekali.',
    exampleArabic: 'مِنْ رَبِّهِمْ / مَنْ لَمْ',
    exampleLatin: 'Mir-rabbihim / mal-lam',
    exampleAyahSnippet: 'QS. Al-Baqarah: 5',
    colorTag: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'iqlab',
    name: 'Iqlab (Mengubah Suara Menjadi Mim)',
    category: 'nun_sukun',
    definition: 'Apabila Nun Sukun (نْ) atau Tanwin bertemu dengan huruf Ba (ب).',
    letters: ['ب (Ba)'],
    howToRead: 'Menggantikan bunyi Nun/Tanwin menjadi bunyi Mim (م) samar disertai dengung 2 harakat.',
    exampleArabic: 'مِنْ بَعْدِ / كِرَامٍ بَرَرَةٍ',
    exampleLatin: 'Mim-ba’di / kiraamim-bararah',
    exampleAyahSnippet: 'QS. Al-Baqarah: 27 & QS. ‘Abasa: 16',
    colorTag: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'ikhfa_haqiqi',
    name: 'Ikhfa Haqiqi (Menyamarkan Suara)',
    category: 'nun_sukun',
    definition: 'Apabila Nun Sukun (نْ) atau Tanwin bertemu dengan salah satu dari 15 huruf hijaiyah ikhfa.',
    letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
    howToRead: 'Menyamarkan bacaan antara Izhar dan Idgham, disertai dengung 2 harakat menuju makhraj huruf berikutnya.',
    exampleArabic: 'مِنْ قَبْلُ / أَنْفُسَهُمْ / شَيْءٍ قَدِيرٌ',
    exampleLatin: 'Ming-qablu / angfusahum / syay-in qadiir',
    exampleAyahSnippet: 'QS. Al-Baqarah: 20 & 25',
    colorTag: 'bg-purple-50 text-purple-700 border-purple-200',
  },

  // 2. Mim Sukun
  {
    id: 'ikhfa_syafawi',
    name: 'Ikhfa Syafawi (Mim Sukun Samar di Bibir)',
    category: 'mim_sukun',
    definition: 'Apabila Mim Sukun (مْ) bertemu dengan huruf Ba (ب).',
    letters: ['ب (Ba)'],
    howToRead: 'Membaca mim sukun dengan samar-samar pada dua bibir yang dirapatkan ringan disertai dengung 2 harakat.',
    exampleArabic: 'تَرْمِيهِمْ بِحِجَارَةٍ',
    exampleLatin: 'Tarmiihim bi-hijaarah',
    exampleAyahSnippet: 'QS. Al-Fil: 4',
    colorTag: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'idgham_mimi',
    name: 'Idgham Mimi / Mitslain (Meleburkan Dua Mim)',
    category: 'mim_sukun',
    definition: 'Apabila Mim Sukun (مْ) bertemu dengan huruf Mim (م).',
    letters: ['م (Mim)'],
    howToRead: 'Memasukkan mim pertama ke mim kedua dengan tasydid dan dengung sempurna sepanjang 2 harakat.',
    exampleArabic: 'أَطْعَمَهُمْ مِنْ جُوعٍ',
    exampleLatin: 'Ath’amahum min-juu’',
    exampleAyahSnippet: 'QS. Quraisy: 4',
    colorTag: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'izhar_syafawi',
    name: 'Izhar Syafawi (Jelas di Bibir)',
    category: 'mim_sukun',
    definition: 'Apabila Mim Sukun (مْ) bertemu seluruh huruf hijaiyah selain Ba (ب) dan Mim (م).',
    letters: ['Semua huruf hijaiyah kecuali Ba & Mim (26 huruf)'],
    howToRead: 'Membaca mim sukun secara jelas di bibir tanpa dengung, terutama saat bertemu Wawu dan Fa.',
    exampleArabic: 'عَلَيْهِمْ وَلَا الضَّالِّينَ',
    exampleLatin: "‘Alayhim wa ladh-dhaalliin",
    exampleAyahSnippet: 'QS. Al-Fatihah: 7',
    colorTag: 'bg-sky-50 text-sky-700 border-sky-200',
  },

  // 3. Hukum Qalqalah
  {
    id: 'qalqalah_sughra',
    name: 'Qalqalah Sughra (Pantulan Kecil di Tengah Kata)',
    category: 'qalqalah',
    definition: 'Huruf Qalqalah (ق، ط، ب، ج، د) yang berharakat sukun asli di tengah-tengah kata.',
    letters: ['ق (Qaf)', 'ط (Tha)', 'ب (Ba)', 'ج (Jim)', 'د (Dal) - Singkatan: Baju Di Toko'],
    howToRead: 'Dipantulkan dengan pantulan yang ringan dan tidak berlebihan.',
    exampleArabic: 'يَقْطَعُونَ / حَبْلٌ / أَبْنَاءَهُمْ',
    exampleLatin: 'Yaq-tha’uun / hab-lun / ab-naa-ahum',
    exampleAyahSnippet: 'QS. Al-Baqarah: 27',
    colorTag: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  {
    id: 'qalqalah_kubra',
    name: 'Qalqalah Kubra (Pantulan Kuat saat Waqaf)',
    category: 'qalqalah',
    definition: 'Huruf Qalqalah yang berada di akhir kata dan dibaca sukun karena berhenti (waqaf).',
    letters: ['ق', 'ط', 'ب', 'ج', 'د (di akhir kalimat)'],
    howToRead: 'Dipantulkan dengan pantulan tebal, kuat, dan tegas.',
    exampleArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۙ / فِي عَمَدٍ مُّمَدَّدَةٍ ۙ',
    exampleLatin: 'Qul a’uudzu bi rabbil-falaq / fii ‘amadim-mumaddadah',
    exampleAyahSnippet: 'QS. Al-Falaq: 1 & QS. Al-Humazah: 9',
    colorTag: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  },

  // 4. Hukum Mad
  {
    id: 'mad_thabii',
    name: 'Mad Thabi’i / Asli (Panjang 2 Harakat)',
    category: 'mad',
    definition: 'Huruf mad (Alif setelah fathah, Wawu sukun setelah dhammah, Ya sukun setelah kasrah) tanpa sebab hamzah atau sukun.',
    letters: ['ا setelah fathah', 'و sukun setelah dhammah', 'ي sukun setelah kasrah'],
    howToRead: 'Dibaca panjang wajar sepanjang 1 alif (2 harakat / 2 ketukan).',
    exampleArabic: 'نُوحِيهَا / قَالَ / قِيلَ',
    exampleLatin: 'Nuwhiihaa / qaala / qiila',
    exampleAyahSnippet: 'QS. Hud: 49',
    colorTag: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'mad_wajib_muttashil',
    name: 'Mad Wajib Muttashil (Wajib Bersambung)',
    category: 'mad',
    definition: 'Huruf mad bertemu hamzah (ء) dalam SATU kata bersambung.',
    letters: ['Mad + Hamzah dalam 1 kata'],
    howToRead: 'Wajib dibaca panjang 4 sampai 5 harakat (atau 6 harakat saat waqaf).',
    exampleArabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ / السَّمَاءِ',
    exampleLatin: 'Idzaa jaaa-a nashrullaah / as-samaaa-i',
    exampleAyahSnippet: 'QS. An-Nashr: 1 & QS. Al-Baqarah: 19',
    colorTag: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'mad_jaiz_munfashil',
    name: 'Mad Jaiz Munfashil (Boleh Terpisah)',
    category: 'mad',
    definition: 'Huruf mad di akhir suatu kata bertemu hamzah di awal kata berikutnya.',
    letters: ['Mad di akhir kata + Hamzah di awal kata lain'],
    howToRead: 'Boleh dibaca panjang 2, 4, atau 5 harakat (yang paling masyhur 4-5 harakat).',
    exampleArabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ / يَا أَيُّهَا',
    exampleLatin: 'Innaaa anzalnaahu fii laylatil qadr / Yaaa ayyuhan-naas',
    exampleAyahSnippet: 'QS. Al-Qadr: 1 & QS. Al-Baqarah: 21',
    colorTag: 'bg-teal-50 text-teal-700 border-teal-200',
  },

  // 5. Tanda Waqaf
  {
    id: 'waqaf_lazim',
    name: 'Tanda Waqaf Lazim (مـ - Harus Berhenti)',
    category: 'waqaf',
    definition: 'Tanda mim kecil (مـ) yang menunjukkan keharusan untuk berhenti agar tidak merubah makna ayat.',
    letters: ['Tanda Waqaf: مـ'],
    howToRead: 'Wajib berhenti pada kata bertanda ini sebelum melanjutkan kalimat berikutnya.',
    exampleArabic: 'فَلَا يَحْزُنْكَ قَوْلُهُمْ ۘ إِنَّا نَعْلَمُ مَا يُسِرُّونَ',
    exampleLatin: 'Falaa yahzunka qawluhum (waqaf) Innaa na’lamu maa yusirruun',
    exampleAyahSnippet: 'QS. Yasin: 76',
    colorTag: 'bg-red-50 text-red-700 border-red-200',
  },
];
