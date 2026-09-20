import { City } from '../types/quran';

export const CITIES: City[] = [
  // DKI Jakarta & Jabodetabek
  { id: 'jakarta', name: 'DKI Jakarta', province: 'DKI Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 'WIB' },
  { id: 'bogor', name: 'Kota Bogor', province: 'Jawa Barat', latitude: -6.5971, longitude: 106.8060, timezone: 'WIB' },
  { id: 'depok', name: 'Kota Depok', province: 'Jawa Barat', latitude: -6.4025, longitude: 106.7942, timezone: 'WIB' },
  { id: 'tangerang', name: 'Kota Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6319, timezone: 'WIB' },
  { id: 'tangerang-selatan', name: 'Kota Tangerang Selatan', province: 'Banten', latitude: -6.2887, longitude: 106.7179, timezone: 'WIB' },
  { id: 'bekasi', name: 'Kota Bekasi', province: 'Jawa Barat', latitude: -6.2383, longitude: 106.9756, timezone: 'WIB' },

  // Jawa Barat & Banten
  { id: 'bandung', name: 'Kota Bandung', province: 'Jawa Barat', latitude: -6.9175, longitude: 107.6191, timezone: 'WIB' },
  { id: 'cirebon', name: 'Kota Cirebon', province: 'Jawa Barat', latitude: -6.7320, longitude: 108.5523, timezone: 'WIB' },
  { id: 'sukabumi', name: 'Kota Sukabumi', province: 'Jawa Barat', latitude: -6.9277, longitude: 106.9300, timezone: 'WIB' },
  { id: 'tasikmalaya', name: 'Kota Tasikmalaya', province: 'Jawa Barat', latitude: -7.3274, longitude: 108.2207, timezone: 'WIB' },
  { id: 'serang', name: 'Kota Serang', province: 'Banten', latitude: -6.1104, longitude: 106.1640, timezone: 'WIB' },
  { id: 'cilegon', name: 'Kota Cilegon', province: 'Banten', latitude: -6.0174, longitude: 106.0538, timezone: 'WIB' },

  // Jawa Tengah & DI Yogyakarta
  { id: 'semarang', name: 'Kota Semarang', province: 'Jawa Tengah', latitude: -6.9667, longitude: 110.4167, timezone: 'WIB' },
  { id: 'surakarta', name: 'Kota Surakarta (Solo)', province: 'Jawa Tengah', latitude: -7.5755, longitude: 110.8243, timezone: 'WIB' },
  { id: 'magelang', name: 'Kota Magelang', province: 'Jawa Tengah', latitude: -7.4797, longitude: 110.2177, timezone: 'WIB' },
  { id: 'pekalongan', name: 'Kota Pekalongan', province: 'Jawa Tengah', latitude: -6.8886, longitude: 109.6753, timezone: 'WIB' },
  { id: 'tegal', name: 'Kota Tegal', province: 'Jawa Tengah', latitude: -6.8694, longitude: 109.1402, timezone: 'WIB' },
  { id: 'purwokerto', name: 'Kab. Banyumas (Purwokerto)', province: 'Jawa Tengah', latitude: -7.4243, longitude: 109.2304, timezone: 'WIB' },
  { id: 'yogyakarta', name: 'Kota Yogyakarta', province: 'DI Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 'WIB' },
  { id: 'sleman', name: 'Kab. Sleman', province: 'DI Yogyakarta', latitude: -7.6883, longitude: 110.3377, timezone: 'WIB' },
  { id: 'bantul', name: 'Kab. Bantul', province: 'DI Yogyakarta', latitude: -7.8897, longitude: 110.3288, timezone: 'WIB' },

  // Jawa Timur
  { id: 'surabaya', name: 'Kota Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521, timezone: 'WIB' },
  { id: 'malang', name: 'Kota Malang', province: 'Jawa Timur', latitude: -7.9666, longitude: 112.6326, timezone: 'WIB' },
  { id: 'kediri', name: 'Kota Kediri', province: 'Jawa Timur', latitude: -7.8480, longitude: 112.0178, timezone: 'WIB' },
  { id: 'madiun', name: 'Kota Madiun', province: 'Jawa Timur', latitude: -7.6298, longitude: 111.5239, timezone: 'WIB' },
  { id: 'jember', name: 'Kab. Jember', province: 'Jawa Timur', latitude: -8.1845, longitude: 113.6681, timezone: 'WIB' },
  { id: 'banyuwangi', name: 'Kab. Banyuwangi', province: 'Jawa Timur', latitude: -8.2192, longitude: 114.3691, timezone: 'WIB' },

  // Sumatera
  { id: 'banda-aceh', name: 'Kota Banda Aceh', province: 'Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 'WIB' },
  { id: 'medan', name: 'Kota Medan', province: 'Sumatera Utara', latitude: 3.5952, longitude: 98.6722, timezone: 'WIB' },
  { id: 'padang', name: 'Kota Padang', province: 'Sumatera Barat', latitude: -0.9471, longitude: 100.4172, timezone: 'WIB' },
  { id: 'pekanbaru', name: 'Kota Pekanbaru', province: 'Riau', latitude: 0.5071, longitude: 101.4478, timezone: 'WIB' },
  { id: 'batam', name: 'Kota Batam', province: 'Kepulauan Riau', latitude: 1.1301, longitude: 104.0529, timezone: 'WIB' },
  { id: 'jambi', name: 'Kota Jambi', province: 'Jambi', latitude: -1.6101, longitude: 103.6131, timezone: 'WIB' },
  { id: 'palembang', name: 'Kota Palembang', province: 'Sumatera Selatan', latitude: -2.9761, longitude: 104.7754, timezone: 'WIB' },
  { id: 'bengkulu', name: 'Kota Bengkulu', province: 'Bengkulu', latitude: -3.8004, longitude: 102.2655, timezone: 'WIB' },
  { id: 'bandar-lampung', name: 'Kota Bandar Lampung', province: 'Lampung', latitude: -5.4500, longitude: 105.2667, timezone: 'WIB' },

  // Kalimantan
  { id: 'pontianak', name: 'Kota Pontianak', province: 'Kalimantan Barat', latitude: -0.0263, longitude: 109.3425, timezone: 'WIB' },
  { id: 'palangkaraya', name: 'Kota Palangka Raya', province: 'Kalimantan Tengah', latitude: -2.2161, longitude: 113.9139, timezone: 'WIB' },
  { id: 'banjarmasin', name: 'Kota Banjarmasin', province: 'Kalimantan Selatan', latitude: -3.3194, longitude: 114.5908, timezone: 'WITA' },
  { id: 'balikpapan', name: 'Kota Balikpapan', province: 'Kalimantan Timur', latitude: -1.2379, longitude: 116.8529, timezone: 'WITA' },
  { id: 'samarinda', name: 'Kota Samarinda', province: 'Kalimantan Timur', latitude: -0.5022, longitude: 117.1536, timezone: 'WITA' },
  { id: 'tarakan', name: 'Kota Tarakan', province: 'Kalimantan Utara', latitude: 3.3270, longitude: 117.5785, timezone: 'WITA' },
  { id: 'ikn', name: 'Ibu Kota Nusantara (IKN)', province: 'Kalimantan Timur', latitude: -0.9744, longitude: 116.7088, timezone: 'WITA' },

  // Bali & Nusa Tenggara
  { id: 'denpasar', name: 'Kota Denpasar', province: 'Bali', latitude: -8.6705, longitude: 115.2126, timezone: 'WITA' },
  { id: 'mataram', name: 'Kota Mataram (Lombok)', province: 'Nusa Tenggara Barat', latitude: -8.5833, longitude: 116.1167, timezone: 'WITA' },
  { id: 'kupang', name: 'Kota Kupang', province: 'Nusa Tenggara Timur', latitude: -10.1772, longitude: 123.6070, timezone: 'WITA' },

  // Sulawesi
  { id: 'makassar', name: 'Kota Makassar', province: 'Sulawesi Selatan', latitude: -5.1477, longitude: 119.4327, timezone: 'WITA' },
  { id: 'manado', name: 'Kota Manado', province: 'Sulawesi Utara', latitude: 1.4748, longitude: 124.8428, timezone: 'WITA' },
  { id: 'palu', name: 'Kota Palu', province: 'Sulawesi Tengah', latitude: -0.9003, longitude: 119.8779, timezone: 'WITA' },
  { id: 'kendari', name: 'Kota Kendari', province: 'Sulawesi Tenggara', latitude: -3.9985, longitude: 122.5126, timezone: 'WITA' },
  { id: 'gorontalo', name: 'Kota Gorontalo', province: 'Gorontalo', latitude: 0.5435, longitude: 123.0568, timezone: 'WITA' },
  { id: 'mamuju', name: 'Kab. Mamuju', province: 'Sulawesi Barat', latitude: -2.6770, longitude: 118.8872, timezone: 'WITA' },

  // Maluku & Papua
  { id: 'ambon', name: 'Kota Ambon', province: 'Maluku', latitude: -3.6954, longitude: 128.1814, timezone: 'WIT' },
  { id: 'ternate', name: 'Kota Ternate', province: 'Maluku Utara', latitude: 0.7905, longitude: 127.3820, timezone: 'WIT' },
  { id: 'jayapura', name: 'Kota Jayapura', province: 'Papua', latitude: -2.5489, longitude: 140.7188, timezone: 'WIT' },
  { id: 'sorong', name: 'Kota Sorong', province: 'Papua Barat Daya', latitude: -0.8762, longitude: 131.2558, timezone: 'WIT' },
  { id: 'merauke', name: 'Kab. Merauke', province: 'Papua Selatan', latitude: -8.4991, longitude: 140.4011, timezone: 'WIT' },
];
