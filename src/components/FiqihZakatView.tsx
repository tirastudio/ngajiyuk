import React, { useState } from 'react';
import { TAJWID_RULES, TajwidRule } from '../data/tajwidData';
import {
  Calculator,
  BookOpen,
  DollarSign,
  Scale,
  Coins,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';

export const FiqihZakatView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'zakat' | 'tajwid'>('zakat');

  // Zakat Calculator State
  const [zakatType, setZakatType] = useState<'maal' | 'profesi' | 'emas' | 'fitrah'>('maal');
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(1450000); // Rp 1.450.000/gram default

  // Zakat Maal State
  const [tabungan, setTabungan] = useState<number>(130000000);
  const [propertiInvestasi, setPropertiInvestasi] = useState<number>(0);
  const [hutangJatuhTempo, setHutangJatuhTempo] = useState<number>(0);

  // Zakat Profesi State
  const [gajiBulanan, setGajiBulanan] = useState<number>(15000000);
  const [pendapatanLain, setPendapatanLain] = useState<number>(2000000);
  const [kebutuhanPokokBulanan, setKebutuhanPokokBulanan] = useState<number>(7000000);

  // Zakat Emas State
  const [beratEmasGram, setBeratEmasGram] = useState<number>(90);
  const [beratEmasPakaiGram, setBeratEmasPakaiGram] = useState<number>(0);

  // Zakat Fitrah State
  const [jumlahJiwa, setJumlahJiwa] = useState<number>(4);
  const [hargaBerasPerKg, setHargaBerasPerKg] = useState<number>(16000);

  // Tajwid Filter State
  const [tajwidCategory, setTajwidCategory] = useState<
    'all' | 'nun_sukun' | 'mim_sukun' | 'mad' | 'qalqalah' | 'waqaf'
  >('all');
  const [selectedTajwidRule, setSelectedTajwidRule] = useState<TajwidRule | null>(
    TAJWID_RULES[0]
  );

  // -------------------------------------------------------------
  // Zakat Calculation Math
  // -------------------------------------------------------------
  const nisabEmasTahun = 85 * goldPricePerGram; // 85 gram emas
  const nisabEmasBulan = nisabEmasTahun / 12;

  // 1. Zakat Maal
  const totalHartaMaal = Math.max(0, tabungan + propertiInvestasi - hutangJatuhTempo);
  const isMaalWajib = totalHartaMaal >= nisabEmasTahun;
  const nominalZakatMaal = isMaalWajib ? totalHartaMaal * 0.025 : 0;

  // 2. Zakat Profesi (Penghasilan Bersih)
  const totalPendapatanBersihBulan = Math.max(
    0,
    gajiBulanan + pendapatanLain - kebutuhanPokokBulanan
  );
  const isProfesiWajib = totalPendapatanBersihBulan >= nisabEmasBulan;
  const nominalZakatProfesiBulan = isProfesiWajib ? totalPendapatanBersihBulan * 0.025 : 0;
  const nominalZakatProfesiTahun = nominalZakatProfesiBulan * 12;

  // 3. Zakat Emas
  const emasWajibZakat = Math.max(0, beratEmasGram - beratEmasPakaiGram);
  const isEmasWajib = emasWajibZakat >= 85;
  const nominalZakatEmasGram = isEmasWajib ? emasWajibZakat * 0.025 : 0;
  const nominalZakatEmasRupiah = nominalZakatEmasGram * goldPricePerGram;

  // 4. Zakat Fitrah
  const totalBerasKg = jumlahJiwa * 2.5;
  const totalBerasLiter = jumlahJiwa * 3.5;
  const totalNominalFitrahRupiah = totalBerasKg * hargaBerasPerKg;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTajwid = TAJWID_RULES.filter(
    (rule) => tajwidCategory === 'all' || rule.category === tajwidCategory
  );

  return (
    <div id="fiqih-muamalah-view" className="max-w-5xl mx-auto space-y-7 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/30">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>Fiqih & Muamalah Praktis</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Kalkulator Zakat & <span className="text-amber-300">Panduan Tajwid</span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Hitung kewajiban zakat harta, profesi, emas, dan fitrah sesuai nisab syar'i secara transparan, serta pelajari hukum tajwid Al-Qur'an lengkap dengan contoh bacaan interaktif.
          </p>
        </div>
      </div>

      {/* Main Switch: Kalkulator Zakat vs Panduan Tajwid */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          id="btn-switch-zakat"
          type="button"
          onClick={() => setActiveTab('zakat')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'zakat'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Kalkulator Zakat Syar'i</span>
        </button>

        <button
          id="btn-switch-tajwid"
          type="button"
          onClick={() => setActiveTab('tajwid')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tajwid'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Panduan Tajwid Al-Qur'an</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. KALKULATOR ZAKAT                                                 */}
      {/* =================================================================== */}
      {activeTab === 'zakat' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Zakat Type Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'maal', label: 'Zakat Maal (Harta)', icon: Coins },
              { id: 'profesi', label: 'Zakat Profesi (Gaji)', icon: DollarSign },
              { id: 'emas', label: 'Zakat Emas & Logam', icon: Scale },
              { id: 'fitrah', label: 'Zakat Fitrah', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = zakatType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setZakatType(tab.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isActive ? 'text-emerald-900' : 'text-stone-700'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reference: Nisab & Gold Price Info Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-amber-900">Standar Nisab Emas: </span>
                <span className="text-amber-800">
                  85 gram emas = <strong>{formatRupiah(nisabEmasTahun)}</strong> / tahun (atau ~
                  {formatRupiah(nisabEmasBulan)} / bulan)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-stone-500 font-medium whitespace-nowrap">Harga Emas:</span>
              <input
                type="number"
                value={goldPricePerGram}
                onChange={(e) => setGoldPricePerGram(Math.max(100000, Number(e.target.value)))}
                className="w-28 px-2 py-1 rounded-lg border border-stone-300 bg-white text-right font-bold text-xs"
              />
              <span className="text-stone-500 text-[11px]">/gr</span>
            </div>
          </div>

          {/* Form & Result Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Inputs (Left: 7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              {/* Zakat Maal Form */}
              {zakatType === 'maal' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Uang Tunai, Tabungan, & Deposito (Rp)
                    </label>
                    <input
                      type="number"
                      value={tabungan}
                      onChange={(e) => setTabungan(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">Telah mencapai haul 1 tahun</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Investasi Lain / Surat Berharga / Properti Produktif (Rp)
                    </label>
                    <input
                      type="number"
                      value={propertiInvestasi}
                      onChange={(e) => setPropertiInvestasi(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Hutang yang Jatuh Tempo Tahun Ini (Rp)
                    </label>
                    <input
                      type="number"
                      value={hutangJatuhTempo}
                      onChange={(e) => setHutangJatuhTempo(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">Pengurang harta kena zakat</span>
                  </div>
                </div>
              )}

              {/* Zakat Profesi Form */}
              {zakatType === 'profesi' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Gaji / Pendapatan Pokok per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={gajiBulanan}
                      onChange={(e) => setGajiBulanan(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Bonus, THR, atau Pendapatan Tambahan per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={pendapatanLain}
                      onChange={(e) => setPendapatanLain(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Kebutuhan Pokok / Cicilan Mendesak per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={kebutuhanPokokBulanan}
                      onChange={(e) => setKebutuhanPokokBulanan(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">
                      Metode bersih (setelah kebutuhan asasi sandang, pangan, papan keluarga)
                    </span>
                  </div>
                </div>
              )}

              {/* Zakat Emas Form */}
              {zakatType === 'emas' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Total Emas Simpanan / Batangan (Gram)
                    </label>
                    <input
                      type="number"
                      value={beratEmasGram}
                      onChange={(e) => setBeratEmasGram(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">
                      Nisab emas murni: 85 gram telah tersimpan 1 tahun
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Emas yang Dipakai untuk Perhiasan Wajar (Gram)
                    </label>
                    <input
                      type="number"
                      value={beratEmasPakaiGram}
                      onChange={(e) => setBeratEmasPakaiGram(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">
                      Perhiasan wajar yang rutin dipakai tidak dikenai zakat menurut mayoritas ulama
                    </span>
                  </div>
                </div>
              )}

              {/* Zakat Fitrah Form */}
              {zakatType === 'fitrah' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Jumlah Anggota Keluarga / Jiwa yang Ditanggung
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={jumlahJiwa}
                      onChange={(e) => setJumlahJiwa(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">
                      Kewajiban 2,5 kg beras (atau 3,5 liter) per jiwa
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Harga Beras yang Dikonsumsi Sehari-hari per Kg (Rp)
                    </label>
                    <input
                      type="number"
                      value={hargaBerasPerKg}
                      onChange={(e) => setHargaBerasPerKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Result Box (Right: 5 Cols) */}
            <div className="lg:col-span-5 bg-stone-50 rounded-3xl p-6 border border-stone-200/90 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Ringkasan Perhitungan Syar'i
                </span>

                {/* Status Nisab Badge */}
                {zakatType === 'maal' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isMaalWajib ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                      <span className="text-xs font-bold text-stone-800">
                        {isMaalWajib ? 'Harta Mencapai Nisab (Wajib Zakat)' : 'Belum Mencapai Nisab'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Total harta bersih:{' '}
                      <strong className="text-stone-900">{formatRupiah(totalHartaMaal)}</strong>{' '}
                      (Nisab: {formatRupiah(nisabEmasTahun)})
                    </p>
                  </div>
                )}

                {zakatType === 'profesi' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isProfesiWajib ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                      <span className="text-xs font-bold text-stone-800">
                        {isProfesiWajib
                          ? 'Penghasilan Mencapai Nisab (Wajib Zakat)'
                          : 'Belum Mencapai Nisab'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Pendapatan bersih/bln:{' '}
                      <strong className="text-stone-900">
                        {formatRupiah(totalPendapatanBersihBulan)}
                      </strong>{' '}
                      (Nisab/bln: {formatRupiah(nisabEmasBulan)})
                    </p>
                  </div>
                )}

                {zakatType === 'emas' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isEmasWajib ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                      <span className="text-xs font-bold text-stone-800">
                        {isEmasWajib ? 'Emas Mencapai Nisab (85 Gr)' : 'Belum Mencapai Nisab (85 Gr)'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Total emas simpanan wajib: <strong>{emasWajibZakat} gram</strong>
                    </p>
                  </div>
                )}

                {zakatType === 'fitrah' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold text-stone-800">
                        Kewajiban Zakat Fitrah ({jumlahJiwa} Jiwa)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Bentuk makanan pokok: <strong>{totalBerasKg} kg beras</strong> (atau{' '}
                      {totalBerasLiter} liter)
                    </p>
                  </div>
                )}

                {/* Final Calculation Amount */}
                <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300/80 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                    Total Zakat yang Harus Ditunaikan:
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {zakatType === 'maal' && formatRupiah(nominalZakatMaal)}
                    {zakatType === 'profesi' && (
                      <>
                        {formatRupiah(nominalZakatProfesiBulan)}
                        <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                          Atau {formatRupiah(nominalZakatProfesiTahun)} / tahun
                        </span>
                      </>
                    )}
                    {zakatType === 'emas' && (
                      <>
                        {nominalZakatEmasGram.toFixed(2)} gram
                        <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                          Setara {formatRupiah(nominalZakatEmasRupiah)}
                        </span>
                      </>
                    )}
                    {zakatType === 'fitrah' && formatRupiah(totalNominalFitrahRupiah)}
                  </div>
                </div>
              </div>

              {/* 8 Asnaf Info Note */}
              <div className="p-3 rounded-2xl bg-white border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <span className="font-bold text-stone-700 block">
                  8 Golongan Berhak Menerima Zakat (QS. At-Taubah: 60):
                </span>
                <p>
                  Fakir, Miskin, Amil Zakat, Mualaf, Riqab (Hamba Sahaya), Gharimin (Terlilit Hutang),
                  Fii Sabilillah, dan Ibnu Sabil (Musafir).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PANDUAN TAJWID AL-QUR'AN INTERAKTIF                              */}
      {/* =================================================================== */}
      {activeTab === 'tajwid' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Hukum' },
              { id: 'nun_sukun', label: 'Nun Sukun & Tanwin' },
              { id: 'mim_sukun', label: 'Mim Sukun' },
              { id: 'qalqalah', label: 'Qalqalah' },
              { id: 'mad', label: 'Hukum Mad' },
              { id: 'waqaf', label: 'Tanda Waqaf' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTajwidCategory(cat.id as any)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  tajwidCategory === cat.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Tajwid Rule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTajwid.map((rule) => (
              <div
                key={rule.id}
                id={`tajwid-card-${rule.id}`}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 hover:border-teal-300 shadow-xs flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-900">{rule.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rule.colorTag}`}>
                      {rule.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{rule.definition}</p>

                  {/* Letters / Huruf */}
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Huruf Tajwid:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {rule.letters.map((ltr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-teal-900"
                        >
                          {ltr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cara Membaca */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Cara Pelafalan:
                    </span>
                    <p className="text-xs text-emerald-800 font-medium">{rule.howToRead}</p>
                  </div>

                  {/* Contoh Potongan Ayat */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-teal-900 block">
                      Contoh Lafadz dalam Al-Qur'an:
                    </span>
                    <p className="font-arabic text-xl sm:text-2xl text-stone-900 text-right py-1 leading-loose" dir="rtl">
                      {rule.exampleArabic}
                    </p>
                    <p className="text-xs text-stone-700 italic font-medium">
                      Lafadz: {rule.exampleLatin}
                    </p>
                    <p className="text-[11px] text-teal-800">
                      Rujukan: <strong>{rule.exampleAyahSnippet}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
