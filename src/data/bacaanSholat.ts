import { PrayerReading, NasheedItem } from '../types/quran';

export const PRAYER_READINGS: PrayerReading[] = [
  {
    id: 'niat-subuh',
    category: 'niat',
    title: 'Niat Sholat Subuh (2 Rakaat)',
    subtitle: 'Niat sholat fardhu Subuh sebagai munfarid (sendiri) atau ma\'mum',
    arabic: 'أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushallii fardhas-subhi rak\'ataini mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Subuh dua rakaat menghadap kiblat karena Allah Ta\'ala.',
    note: 'Jika menjadi ma\'mum tambahkan "ma\'muuman", jika menjadi imam tambahkan "imaaman".'
  },
  {
    id: 'niat-dzuhur',
    category: 'niat',
    title: 'Niat Sholat Dzuhur (4 Rakaat)',
    subtitle: 'Niat sholat fardhu Dzuhur',
    arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushallii fardhazh-zhuhri arba\'a raka\'aatin mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Dzuhur empat rakaat menghadap kiblat karena Allah Ta\'ala.'
  },
  {
    id: 'niat-ashar',
    category: 'niat',
    title: 'Niat Sholat Ashar (4 Rakaat)',
    subtitle: 'Niat sholat fardhu Ashar',
    arabic: 'أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushallii fardhal-\'ashri arba\'a raka\'aatin mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Ashar empat rakaat menghadap kiblat karena Allah Ta\'ala.'
  },
  {
    id: 'niat-maghrib',
    category: 'niat',
    title: 'Niat Sholat Maghrib (3 Rakaat)',
    subtitle: 'Niat sholat fardhu Maghrib',
    arabic: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushallii fardhal-maghribi tsalaatsa raka\'aatin mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta\'ala.'
  },
  {
    id: 'niat-isya',
    category: 'niat',
    title: 'Niat Sholat Isya (4 Rakaat)',
    subtitle: 'Niat sholat fardhu Isya',
    arabic: 'أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushallii fardhal-\'isyaa-i arba\'a raka\'aatin mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Isya empat rakaat menghadap kiblat karena Allah Ta\'ala.'
  },
  {
    id: 'takbiratul-ihram',
    category: 'gerakan',
    title: 'Takbiratul Ihram',
    subtitle: 'Mengangkat kedua tangan sejajar telinga/bahu mengawali sholat',
    arabic: 'اللهُ أَكْبَرُ',
    latin: 'Allahu Akbar.',
    translation: 'Allah Maha Besar.'
  },
  {
    id: 'doa-iftitah',
    category: 'gerakan',
    title: 'Doa Iftitah (Sunnah)',
    subtitle: 'Dibaca setelah takbiratul ihram pada rakaat pertama',
    arabic: 'اللهُ أَكْبَرُ كَبِيْرًا وَالْحَمْدُ لِلَّهِ كَثِيْرًا وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيْلًا. وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيْفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِيْنَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِيْنَ، لَا شَرِيْكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِيْنَ.',
    latin: 'Allaahu akbaru kabiiraw-walhamdu lillaahi katsiiraw-wasubhaanallaahi bukrataw-wa-ashiilaa. Wajjahtu wajhiya lilladzii fatharas-samaawaati wal-ardha haniifam-muslimaw-wamaa ana minal-musyrikiin, inna shalaatii wanusukii wamahyaya wamamaatii lillaahi rabbil-\'aalamiin, laa syariika lahuu wabidzaalika umirtu wa-ana minal-muslimiin.',
    translation: 'Allah Maha Besar dengan sebesar-besarnya, dan segala puji yang banyak bagi Allah, serta Maha Suci Allah di waktu pagi dan petang. Aku menghadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan penuh kepatuhan dan kepasrahan, dan bukanlah aku dari golongan orang-orang yang mempersekutukan Allah. Sesungguhnya sholatku, ibadahku, hidupku, dan matiku hanyalah untuk Allah Tuhan seluruh alam, tiada sekutu bagi-Nya, dan demikianlah aku diperintahkan dan aku termasuk orang-orang yang berserah diri.'
  },
  {
    id: 'ruku',
    category: 'gerakan',
    title: 'Bacaan Saat Ruku\'',
    subtitle: 'Dibaca 3 kali saat posisi ruku\' sempurna',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ',
    latin: 'Subhaana rabbiyal-\'azhiimi wabihamdih. (3x)',
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.'
  },
  {
    id: 'itidal',
    category: 'gerakan',
    title: 'Bacaan I\'tidal (Bangkit dari Ruku\')',
    subtitle: 'Dibaca saat berdiri tegak setelah ruku\'',
    arabic: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ مِلْءُ السَّمَاوَاتِ وَمِلْءُ الْأَرْضِ وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ',
    latin: 'Sami\'allaahu liman hamidah. Rabbanaa lakal-hamdu mil\'us-samaawaati wamil\'ul-ardhi wamil\'u maa syi\'ta min syai-in ba\'du.',
    translation: 'Allah Maha Mendengar orang yang memuji-Nya. Wahai Tuhan kami, bagi-Mu lah segala puji sepenuh langit dan sepenuh bumi, serta sepenuh apa yang Engkau kehendaki sesudah itu.'
  },
  {
    id: 'sujud',
    category: 'gerakan',
    title: 'Bacaan Saat Sujud',
    subtitle: 'Dibaca 3 kali saat dahi menempel di tempat sujud',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: 'Subhaana rabbiyal-a\'laa wabihamdih. (3x)',
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.'
  },
  {
    id: 'duduk-antara-dua-sujud',
    category: 'gerakan',
    title: 'Duduk di Antara Dua Sujud (Iftirasy)',
    subtitle: 'Doa memohon ampunan, rahmat, dan rezeki',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
    latin: 'Rabbighfirlii warhamnii wajburnii warfa\'nii warzuqnii wahdinii wa\'aafinii wa\'fu \'annii.',
    translation: 'Wahai Tuhanku ampunilah dosaku, kasihanilah daku, tutuplah aibku, tinggikanlah derajatku, berilah aku rezeki, berilah aku petunjuk, berikanlah aku kesehatan, dan maafkanlah kesalahanku.'
  },
  {
    id: 'tasyahud-akhir',
    category: 'gerakan',
    title: 'Tasyahud Akhir & Sholawat Ibrahimiyah',
    subtitle: 'Dibaca pada rakaat terakhir sebelum salam',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللهِ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيْمَ، وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى سَيِّدِنَا إِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيْمَ، فِي الْعَالَمِيْنَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ.',
    latin: 'Attahiyyaatul-mubaarakaatush-shalawaatuth-thayyibaatu lillaah. Assalaamu \'alaika ayyuhan-nabiyyu warahmatullaahi wabarakaatuh. Assalaamu \'alainaa wa \'alaa \'ibaadillaahish-shaalihiin. Asyhadu allaa ilaaha illallaah wa asyhadu anna Muhammadan rasuulullaah. Allaahumma shalli \'alaa sayyidinaa Muhammad wa \'alaa aali sayyidinaa Muhammad, kamaa shallaita \'alaa sayyidinaa Ibraahiim wa \'alaa aali sayyidinaa Ibraahiim, wabaarik \'alaa sayyidinaa Muhammad wa \'alaa aali sayyidinaa Muhammad, kamaa baarakta \'alaa sayyidinaa Ibraahiim wa \'alaa aali sayyidinaa Ibraahiim, fil-\'aalamiina innaka hamiidum-majiid.',
    translation: 'Segala kehormatan, keberkahan, kebahagiaan dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah dan berkah-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang sholeh. Aku bersaksi bahwa tiada Tuhan selain Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Allah limpahkanlah rahmat kepada junjungan kami Nabi Muhammad dan kepada keluarga junjungan kami Nabi Muhammad, sebagaimana Engkau telah melimpahkan rahmat kepada junjungan kami Nabi Ibrahim dan kepada keluarga junjungan kami Nabi Ibrahim. Dan berkahilah junjungan kami Nabi Muhammad dan keluarga junjungan kami Nabi Muhammad, sebagaimana Engkau berkahi junjungan kami Nabi Ibrahim dan keluarga junjungan kami Nabi Ibrahim. Di seluruh alam semesta, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.'
  },
  {
    id: 'salam',
    category: 'gerakan',
    title: 'Salam Penutup Sholat',
    subtitle: 'Menoleh ke kanan lalu ke kiri untuk mengakhiri sholat',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ',
    latin: 'Assalaamu \'alaikum warahmatullaah.',
    translation: 'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.'
  },
  {
    id: 'doa-qunut',
    category: 'doa',
    title: 'Doa Qunut Subuh (Sunnah)',
    subtitle: 'Dibaca pada rakaat kedua sholat Subuh saat i\'tidal sebelum sujud',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ.',
    latin: 'Allaahummah-dinii fiiman hadait, wa \'aafinii fiiman \'aafait, watawallanii fiiman tawallait, wabaarik lii fiimaa a\'thait, waqinii syarra maa qadhait, fainnaka taqdhii walaa yuqdhaa \'alaik, wa-innahuu laa yadzillu man waalait, walaa ya\'izzu man \'aadait, tabaarakta rabbanaa wata\'aalait, falakal-hamdu \'alaa maa qadhait, astaghfiruka wa-atuubu ilaik, washallallaahu \'alaa sayyidinaa Muhammadin-nabiyyil-ummiyyi wa \'alaa aalihii washahbihii wasallam.',
    translation: 'Ya Allah, berilah aku petunjuk sebagaimana orang yang telah Engkau beri petunjuk, berilah aku kesehatan sebagaimana orang yang telah Engkau beri kesehatan, lindungilah aku sebagaimana orang yang telah Engkau lindungi, berkahilah bagiku apa yang telah Engkau berikan, selamatkanlah aku dari keburukan yang telah Engkau tetapkan. Sesungguhnya Engkaulah yang menetapkan dan tidak ada yang berhak menetapkan atas-Mu. Sesungguhnya tidak akan terhina orang yang Engkau pimpin, dan tidak akan mulia orang yang Engkau musuhi. Maha Berkah Engkau wahai Tuhan kami dan Maha Tinggi. Maka bagi-Mu segala puji atas ketetapan-Mu. Aku memohon ampun kepada-Mu dan bertaubat kepada-Mu. Dan semoga Allah melimpahkan rahmat serta salam kepada junjungan kami Nabi Muhammad sang Nabi yang ummi serta keluarga dan para sahabatnya.'
  },
  {
    id: 'dzikir-ba\'da-sholat',
    category: 'dzikir',
    title: 'Dzikir Ringkas Setelah Sholat Fardhu',
    subtitle: 'Istighfar, tasbih, tahmid, takbir, dan tahlil',
    arabic: 'أَسْتَغْفِرُ اللهَ الْعَظِيْمَ (٣×). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. سُبْحَانَ اللهِ (٣٣×). الْحَمْدُ لِلَّهِ (٣٣×). اللهُ أَكْبَرُ (٣٣×). لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ.',
    latin: 'Astaghfirullaahal-\'azhiim (3x). Allaahumma antas-salaamu waminkas-salaamu tabaarakta yaa dzal-jalaali wal-ikraam. Subhaanallaah (33x). Alhamdulillaah (33x). Allaahu Akbar (33x). Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul-mulku walahul-hamdu wahuwa \'alaa kulli syai-in qadiir.',
    translation: 'Aku memohon ampun kepada Allah Yang Maha Agung (3x). Ya Allah Engkaulah sumber keselamatan, dan dari-Mu keselamatan, Maha Suci Engkau wahai Dzat Pemilik Keagungan dan Kemuliaan. Maha Suci Allah (33x). Segala Puji bagi Allah (33x). Allah Maha Besar (33x). Tiada Tuhan selain Allah semata, tidak ada sekutu bagi-Nya, milik-Nya kerajaan dan milik-Nya segala puji dan Dia Maha Kuasa atas segala sesuatu.'
  }
];

export const NASHEED_COLLECTION: NasheedItem[] = [
  {
    id: 'thalaal-badru',
    title: 'Thala\'al Badru \'Alayna (طلع البدر علينا)',
    artist: 'Lagu Tradisional Sambutan Rasulullah SAW',
    description: 'Qasidah tertua dalam sejarah Islam, disenandungkan oleh kaum Anshar menyambut kedatangan Nabi Muhammad SAW di Madinah.',
    arabicLyrics: 'طَلَعَ البَدْرُ عَلَيْنَا ۞ مِنْ ثَنِيَّاتِ الوَدَاعِ\nوَجَبَ الشُّكْرُ عَلَيْنَا ۞ مَا دَعَا لِلَّهِ دَاعِ\nأَيُّهَا المَبْعُوثُ فِينَا ۞ جِئْتَ بِالأَمْرِ المُطَاعِ',
    translation: 'Bulan purnama telah terbit menyinari kami, dari celah-celah bukit Tsaniyyatul Wada\'. Wajiblah bagi kami bersyukur, selama penyeru mengajak kepada Allah. Wahai Rasul yang diutus kepada kami, engkau datang membawa perintah yang ditaati.',
    externalLink: 'https://www.youtube.com/results?search_query=tala+al+badru+alayna+official'
  },
  {
    id: 'sholawat-tibbil-qulub',
    title: 'Sholawat Tibbil Qulub (Obat Hati)',
    artist: 'Sholawat Penenang Jiwa & Kesembuhan',
    description: 'Sholawat permohonan kesehatan jasmani dan ketenangan rohani melalui berkah junjungan Nabi Muhammad SAW.',
    arabicLyrics: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا، وَعَافِيَةِ الْأَبْدَانِ وَشِفَائِهَا، وَنُورِ الْأَبْصَارِ وَضِيَائِهَا، وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ.',
    translation: 'Ya Allah limpahkanlah rahmat kepada junjungan kami Nabi Muhammad sebagai obat hati dan penawarnya, penyehat badan dan kesembuhannya, serta cahaya mata dan sinarnya, dan curahkanlah kepada keluarga dan para sahabatnya.',
    externalLink: 'https://www.youtube.com/results?search_query=sholawat+tibbil+qulub+merdu'
  },
  {
    id: 'sholawat-nariyah',
    title: 'Sholawat Nariyah (Tafrijiyyah)',
    artist: 'Syekh Ahmad At-Tazi',
    description: 'Sholawat pembuka jalan keluar dari kesulitan, melapangkan rezeki, dan mengabulkan hajat dengan izin Allah.',
    arabicLyrics: 'اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضَى بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ وَعَلَى آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ.',
    translation: 'Ya Allah, limpahkanlah shalawat yang sempurna dan keselamatan yang utuh kepada junjungan kami Nabi Muhammad, yang dengan berkahnya segala ikatan terurai, kesusahan dihilangkan, segala hajat dipenuhi, dan segala keinginan serta husnul khatimah tercapai.',
    externalLink: 'https://www.youtube.com/results?search_query=sholawat+nariyah+official'
  },
  {
    id: 'deen-assalam',
    title: 'Deen Assalam (Agama Perdamaian)',
    artist: 'Sulaiman Al Mughni / Sabyan',
    description: 'Nasheed populer yang menyuarakan keindahan Islam sebagai agama yang membawa pesan cinta kasih, toleransi, dan kedamaian semesta.',
    arabicLyrics: 'كَلِّ هَذِي الْأَرْضِ مَا تَكْفِي مَسَاحَة ۞ لَوْ نَعِيْشِ بِلَا سَمَاحَة\nوَإِنْ تَعَايَشْنَا بِحُبٍّ ۞ لَوْ بضِيقِ الْأَرْضِ كُنَّا رُحَبَا\nدِيْنُنَا دِيْنُ السَّلَامِ ۞ دِيْنُنَا دِيْنُ الْأَمَانِ',
    translation: 'Seluruh bumi ini takkan cukup luasnya, jika kita hidup tanpa toleransi. Namun jika kita hidup berdampingan dengan cinta, sesempit apapun bumi ini kita kan bahagia. Agama kita adalah agama perdamaian, agama keselamatan.',
    externalLink: 'https://www.youtube.com/results?search_query=deen+assalam+official'
  }
];
