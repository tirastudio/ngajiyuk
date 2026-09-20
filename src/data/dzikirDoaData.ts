export interface DzikirItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  targetCount: number;
  fadhilah: string;
  source: string;
}

export interface DoaHarianItem {
  id: string;
  title: string;
  category: 'harian' | 'perlindungan' | 'ibadah' | 'quran' | 'keluarga';
  arabic: string;
  latin: string;
  translation: string;
  fadhilah?: string;
  source: string;
}

export interface PuasaSunnahItem {
  name: string;
  schedule: string;
  niatArabic: string;
  niatLatin: string;
  niatTranslation: string;
  keutamaan: string;
  daysBadge: string;
}

// Koleksi Dzikir Pagi Shahih (Al-Ma'tsurat / Hisnul Muslim)
export const DZIKIR_PAGI_LIST: DzikirItem[] = [
  {
    id: 'pagi-1',
    title: 'Ayat Kursi (Pelindung dari Jin hingga Petang)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: "Allahu laa ilaaha illaa Huwal Hayyul Qayyum, laa ta'khudzuhu sinatuw-walaa nawm, lahu maa fis-samaawaati wa maa fil-ardh, man dzalladzii yasyfa'u 'indahu illaa bi-idznih, ya'lamu maa bayna aydiihim wa maa khalfahum, wa laa yuhiithuuna bisyay-im min 'ilmihi illaa bimaa syaa-a, wasi'a kursiyyuhus-samaawaati wal-ardh, wa laa ya-uuduhu hifzhuhumaa, wa Huwal 'Aliyyul 'Azhiim.",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi...',
    targetCount: 1,
    fadhilah: 'Siapa yang membacanya di pagi hari akan dilindungi dari gangguan jin hingga petang (HR. Al-Hakim).',
    source: 'QS. Al-Baqarah: 255',
  },
  {
    id: 'pagi-2',
    title: 'Membaca Surat Al-Ikhlas, Al-Falaq, & An-Nas (3x)',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    latin: "Qul Huwallahu Ahad... Qul A'uudzu bi Rabbil Falaq... Qul A'uudzu bi Rabbin Naas...",
    translation: 'Katakanlah: Dialah Allah, Yang Maha Esa... Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh... Katakanlah: Aku berlindung kepada Tuhannya manusia...',
    targetCount: 3,
    fadhilah: 'Mencukupkan dari segala mara bahaya dan keburukan (HR. Abu Daud & At-Tirmidzi).',
    source: 'Trio Muawwidzat',
  },
  {
    id: 'pagi-3',
    title: 'Sayyidul Istighfar (Induk Doa Pengampunan Dosa)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: "Allahumma Anta Rabbii laa ilaaha illaa Anta, khalaqtanii wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzambii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa Anta.",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu...',
    targetCount: 1,
    fadhilah: 'Barangsiapa membacanya di pagi hari dengan penuh keyakinan lalu meninggal di hari itu sebelum petang, ia termasuk penghuni surga (HR. Bukhari).',
    source: 'HR. Bukhari no. 6306',
  },
  {
    id: 'pagi-4',
    title: 'Ashbahnaa wa Ashbahal Mulku Lillah',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: "Ash-bahnaa wa ash-bahal mulku lillaah, walhamdulillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa Huwa 'alaa kulli syay-in Qadiir.",
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada tuhan yang berhak disembah selain Allah semata...',
    targetCount: 1,
    fadhilah: 'Mengakui kekuasaan dan kepemilikan mutlak Allah SWT atas seluruh alam semesta di awal hari.',
    source: 'HR. Muslim no. 2723',
  },
  {
    id: 'pagi-5',
    title: 'Doa Perlindungan dari Mara Bahaya (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: "Bismillaahil-ladzii laa yadhurru ma'as-mihi syay-un fil-ardhi wa laa fis-samaa-i wa Huwas-Samii'ul 'Aliim.",
    translation: 'Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.',
    targetCount: 3,
    fadhilah: 'Tidak ada malapetaka atau mara bahaya yang dapat mencelakakannya hingga sore hari (HR. Abu Daud & Tirmidzi).',
    source: 'HR. Abu Daud no. 5088',
  },
  {
    id: 'pagi-6',
    title: 'Keridhaan kepada Allah, Islam, & Rasulullah (3x)',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    latin: "Radhiitu billaahi Rabbaa, wa bil-Islaami diinaa, wa bi Muhammadin shallallaahu 'alayhi wa sallama Nabiyyaa.",
    translation: 'Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad shallallahu alaihi wa sallam sebagai Nabiku.',
    targetCount: 3,
    fadhilah: 'Allah berhak untuk membuatnya ridha pada hari kiamat dan meridhai surga untuknya (HR. At-Tirmidzi).',
    source: 'HR. Abu Daud & Tirmidzi',
  },
  {
    id: 'pagi-7',
    title: 'Subhanallahi wa Bihamdihi (Tasbih 100x)',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: 'Subhaanallaahi wa bihamdih.',
    translation: 'Maha Suci Allah dan segala puji bagi-Nya.',
    targetCount: 100,
    fadhilah: 'Dihapuskan kesalahan-kesalahannya walaupun sebanyak buih di lautan (HR. Bukhari & Muslim).',
    source: 'HR. Bukhari no. 6405',
  },
];

// Koleksi Dzikir Petang Shahih
export const DZIKIR_PETANG_LIST: DzikirItem[] = [
  {
    id: 'petang-1',
    title: 'Ayat Kursi (Pelindung hingga Pagi Hari)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ...',
    latin: "Allahu laa ilaaha illaa Huwal Hayyul Qayyum, laa ta'khudzuhu sinatuw-walaa nawm...",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur...',
    targetCount: 1,
    fadhilah: 'Barangsiapa membacanya ketika petang hari, ia akan dilindungi dari gangguan jin sampai pagi (HR. Al-Hakim).',
    source: 'QS. Al-Baqarah: 255',
  },
  {
    id: 'petang-2',
    title: 'Amsaynaa wa Amsal Mulku Lillah',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: "Amsaynaa wa amsal mulku lillaah, walhamdulillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa Huwa 'alaa kulli syay-in Qadiir.",
    translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah...',
    targetCount: 1,
    fadhilah: 'Memperbaharui tauhid dan kepasrahan kepada Allah saat pergantian hari menuju malam.',
    source: 'HR. Muslim no. 2723',
  },
  {
    id: 'petang-3',
    title: 'Perlindungan dengan Kalimat Allah yang Sempurna (3x)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    latin: "A'uudzu bi kalimaatillaahit-taammaati min syarri maa khalaq.",
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.',
    targetCount: 3,
    fadhilah: 'Tidak akan ada bahaya sengatan berbisa atau kejahatan makhluk malam yang dapat mencelakakannya (HR. Muslim).',
    source: 'HR. Muslim no. 2709',
  },
  {
    id: 'petang-4',
    title: 'Sayyidul Istighfar Petang',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...',
    latin: "Allahumma Anta Rabbii laa ilaaha illaa Anta, khalaqtanii wa ana 'abduka...",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada sesembahan yang berhak disembah selain Engkau...',
    targetCount: 1,
    fadhilah: 'Siapa yang membacanya di waktu sore dengan yakin lalu wafat malam itu, ia menjadi penghuni surga (HR. Bukhari).',
    source: 'HR. Bukhari no. 6306',
  },
  {
    id: 'petang-5',
    title: 'Astaghfirullah wa Atuubu Ilaih (100x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    latin: 'Astaghfirullaaha wa atuubu ilayh.',
    translation: 'Aku memohon ampun kepada Allah dan bertaubat kepada-Nya.',
    targetCount: 100,
    fadhilah: 'Rasulullah SAW beristighfar dan bertaubat lebih dari 70 sampai 100 kali dalam sehari (HR. Bukhari & Muslim).',
    source: 'HR. Muslim no. 2702',
  },
];

// Koleksi Doa Harian Mustajab
export const DOA_HARIAN_LIST: DoaHarianItem[] = [
  {
    id: 'doa-1',
    title: 'Doa Sebelum Tidur',
    category: 'harian',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bismika Allaahumma amuutu wa ahyaa.',
    translation: 'Dengan nama-Mu ya Allah, aku mati (tidur) dan aku hidup.',
    source: 'HR. Bukhari no. 6324',
  },
  {
    id: 'doa-2',
    title: 'Doa Bangun Tidur',
    category: 'harian',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdulillaahil-ladzii ahyaanaa ba’da maa amaatanaa wa ilayhin-nusyuur.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan hanya kepada-Nya kami kembali.',
    source: 'HR. Bukhari no. 6312',
  },
  {
    id: 'doa-3',
    title: 'Doa Kedua Orang Tua',
    category: 'keluarga',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, serta kasihanilah keduanya sebagaimana mereka telah mendidikku di waktu kecil.',
    source: 'QS. Al-Isra: 24',
  },
  {
    id: 'doa-4',
    title: 'Doa Sapu Jagat (Kebaikan Dunia & Akhirat)',
    category: 'quran',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa ‘adzaaban-naar.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    source: 'QS. Al-Baqarah: 201',
  },
  {
    id: 'doa-5',
    title: 'Doa Masuk Masjid',
    category: 'ibadah',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allaahummaftah lii abwaaba rahmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    source: 'HR. Muslim no. 713',
  },
  {
    id: 'doa-6',
    title: 'Doa Keluar Masjid',
    category: 'ibadah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allaahumma innii as-aluka min fadhlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon keutamaan dan karunia dari-Mu.',
    source: 'HR. Muslim no. 713',
  },
  {
    id: 'doa-7',
    title: 'Doa Memohon Kelapangan Hati & Kemudahan Urusan',
    category: 'quran',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    latin: 'Rabbisyrah lii shadrii wa yassir lii amrii wahlul ‘uqdatam mil-lisaanii yafqahuu qawlii.',
    translation: 'Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, agar mereka mengerti perkataanku.',
    source: 'QS. Thaha: 25-28',
  },
  {
    id: 'doa-8',
    title: 'Doa Penutup Majelis (Kafaratul Majlis)',
    category: 'ibadah',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    latin: 'Subhaanaka Allaahumma wa bihamdika, asyhadu allaa ilaaha illaa Anta, astaghfiruka wa atuubu ilayk.',
    translation: 'Maha Suci Engkau ya Allah, dengan memuji-Mu. Aku bersaksi bahwa tidak ada tuhan selain Engkau, aku memohon ampun dan bertaubat kepada-Mu.',
    source: 'HR. At-Tirmidzi no. 3433',
  },
  {
    id: 'doa-9',
    title: 'Doa Perlindungan dari Kesedihan & Hutang',
    category: 'perlindungan',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    latin: 'Allaahumma innii a’uudzu bika minal hammi wal hazan, wal ‘ajzi wal kasal, wal bukhli wal jubn, wa dhala’id-dayni wa ghalabatir-rijaal.',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari rasa gundah dan gelisah, rasa lemah dan malas, sifat kikir dan penakut, serta lilitan hutang dan penindasan orang lain.',
    source: 'HR. Bukhari no. 2893',
  },
];

// Kalender & Amalan Puasa Sunnah
export const PUASA_SUNNAH_LIST: PuasaSunnahItem[] = [
  {
    name: 'Puasa Sunnah Senin & Kamis',
    schedule: 'Setiap Hari Senin dan Hari Kamis',
    niatArabic: 'نَوَيْتُ صَوْمَ يَوْمِ الاِثْنَيْنِ / يَوْمِ الْخَمِيسِ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaytu shawma yawmil-itsnayni / yawmil-khamiisi sunnatan lillaahi Ta’aalaa.',
    niatTranslation: 'Aku berniat puasa sunnah hari Senin / hari Kamis karena Allah Ta’ala.',
    keutamaan: 'Hari di mana amalan-amalan hamba diangkat kepada Allah SWT, dan Rasulullah SAW menyukai amalannya diangkat dalam keadaan berpuasa (HR. Tirmidzi).',
    daysBadge: 'Rutin Mingguan',
  },
  {
    name: 'Puasa Ayyamul Bidh (Hari Putih)',
    schedule: 'Tanggal 13, 14, dan 15 Setiap Bulan Hijriah',
    niatArabic: 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaytu shawma ayyaamil-biidh sunnatan lillaahi Ta’aalaa.',
    niatTranslation: 'Aku berniat puasa sunnah hari-hari putih (Ayyamul Bidh) karena Allah Ta’ala.',
    keutamaan: 'Pahalanya seperti berpuasa sepanjang tahun penuh (HR. Bukhari no. 1979 & Muslim no. 1159).',
    daysBadge: 'Tiap Bulan Hijriah',
  },
  {
    name: 'Puasa Asyura (10 Muharram)',
    schedule: 'Tanggal 10 Muharram (Disunnahkan beserta 9 Muharram/Tasu’a)',
    niatArabic: 'نَوَيْتُ صَوْمَ عَاشُورَاءَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaytu shawma ‘Aasyuuraa-a sunnatan lillaahi Ta’aalaa.',
    niatTranslation: 'Aku berniat puasa sunnah Asyura karena Allah Ta’ala.',
    keutamaan: 'Dapat menghapuskan dosa-dosa kecil setahun yang lalu (HR. Muslim no. 1162).',
    daysBadge: 'Bulan Muharram',
  },
  {
    name: 'Puasa Hari Arafah (9 Dzulhijjah)',
    schedule: 'Tanggal 9 Dzulhijjah (Bagi yang tidak menunaikan haji)',
    niatArabic: 'نَوَيْتُ صَوْمَ عَرَفَةَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaytu shawma ‘Arafata sunnatan lillaahi Ta’aalaa.',
    niatTranslation: 'Aku berniat puasa sunnah Arafah karena Allah Ta’ala.',
    keutamaan: 'Menghapuskan dosa setahun yang lalu dan dosa setahun yang akan datang (HR. Muslim no. 1162).',
    daysBadge: 'Bulan Dzulhijjah',
  },
  {
    name: 'Puasa 6 Hari Bulan Syawal',
    schedule: 'Enam hari di bulan Syawal setelah Idul Fitri',
    niatArabic: 'نَوَيْتُ صَوْمَ سِتَّةِ أَيَّامٍ مِنْ شَوَّالٍ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaytu shawma sittati ayyaamin min Syawwaalin sunnatan lillaahi Ta’aalaa.',
    niatTranslation: 'Aku berniat puasa sunnah enam hari di bulan Syawal karena Allah Ta’ala.',
    keutamaan: 'Barangsiapa berpuasa Ramadhan lalu melanjutkannya dengan 6 hari Syawal, bagaikan berpuasa setahun penuh (HR. Muslim).',
    daysBadge: 'Bulan Syawal',
  },
];
