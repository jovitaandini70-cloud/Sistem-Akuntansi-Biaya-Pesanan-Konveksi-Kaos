import { useState, useMemo, Fragment } from 'react';
import {
  FileText, LayoutList, TableProperties,
  ChevronDown, TrendingUp, Wallet, Factory, ArrowRight,
  CheckCircle2, AlertCircle, Filter,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder, KodeAkun } from '../types';
import { formatRupiah, formatDate } from '../lib/format';
import {
  buildAllJurnal,
  buildLedgerBaris,
  buildNeracaSaldo,
  CHART_OF_ACCOUNTS,
  JURNAL_TIPE_LABEL,
} from '../lib/jurnalService';

type TabKey = 'jurnal' | 'buku-besar' | 'neraca-saldo';

// ─── Komponen utama ──────────────────────────────────────────────────────────
export default function BukuBesarPage({ orders }: { orders: JobOrder[] }) {
  const [tab, setTab] = useState<TabKey>('jurnal');

  const jurnal = useMemo(() => buildAllJurnal(orders), [orders]);
  const neraca = useMemo(() => buildNeracaSaldo(jurnal), [jurnal]);

  // Stat cards
  const totalDebet   = neraca.reduce((s, r) => s + r.totalDebet, 0);
  const totalKredit  = neraca.reduce((s, r) => s + r.totalKredit, 0);
  const jumlahJurnal = jurnal.length;
  const balanced     = Math.abs(totalDebet - totalKredit) < 1; // tolerance 1 cent

  const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
    { key: 'jurnal',        label: 'Jurnal Umum',   icon: FileText        },
    { key: 'buku-besar',    label: 'Buku Besar',    icon: LayoutList      },
    { key: 'neraca-saldo',  label: 'Neraca Saldo',  icon: TableProperties },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={FileText}     label="Total Transaksi Jurnal" value={`${jumlahJurnal} ayat`}   accent="brand"   />
        <SummaryCard icon={TrendingUp}   label="Total Debet"            value={formatRupiah(totalDebet)} accent="violet"  />
        <SummaryCard icon={Wallet}       label="Total Kredit"           value={formatRupiah(totalKredit)} accent="amber"  />
        <SummaryCard
          icon={balanced ? CheckCircle2 : AlertCircle}
          label="Status Keseimbangan"
          value={balanced ? 'Seimbang ✓' : 'Tidak Seimbang !'}
          accent={balanced ? 'emerald' : 'amber'}
        />
      </div>

      {/* Tab bar */}
      <div className="card overflow-hidden">
        <div className="flex items-center border-b border-brand-100 bg-brand-50/30 px-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                  active
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-ink-400 hover:text-ink-700 hover:bg-white/50'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-0">
          {tab === 'jurnal'       && <JurnalUmumTab jurnal={jurnal} />}
          {tab === 'buku-besar'   && <BukuBesarTab  jurnal={jurnal} />}
          {tab === 'neraca-saldo' && <NeracaSaldoTab neraca={neraca} />}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1: Jurnal Umum ───────────────────────────────────────────────────────
function JurnalUmumTab({ jurnal }: { jurnal: ReturnType<typeof buildAllJurnal> }) {
  const [filterTipe, setFilterTipe] = useState<string>('all');
  const [filterRef, setFilterRef]   = useState('');

  const tipeOptions = Object.keys(JURNAL_TIPE_LABEL);

  const filtered = useMemo(() => {
    return jurnal.filter((j) => {
      const matchTipe = filterTipe === 'all' || j.tipe === filterTipe;
      const matchRef  = !filterRef || j.referensi.toLowerCase().includes(filterRef.toLowerCase());
      return matchTipe && matchRef;
    });
  }, [jurnal, filterTipe, filterRef]);

  if (jurnal.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Belum ada jurnal"
        sub="Jurnal akan otomatis terbuat saat pesanan dibuat, dibayar, dan diproduksi."
      />
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-brand-50">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-ink-400" />
          <button
            onClick={() => setFilterTipe('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterTipe === 'all' ? 'bg-brand-600 text-white' : 'bg-white border border-brand-200 text-ink-500 hover:bg-brand-50'}`}
          >
            Semua
          </button>
          {tipeOptions.map((t) => {
            const meta = JURNAL_TIPE_LABEL[t];
            return (
              <button
                key={t}
                onClick={() => setFilterTipe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterTipe === t ? 'bg-brand-600 text-white' : 'bg-white border border-brand-200 text-ink-500 hover:bg-brand-50'}`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
        <input
          placeholder="Cari nomor pesanan…"
          value={filterRef}
          onChange={(e) => setFilterRef(e.target.value)}
          className="input-field text-xs py-1.5 w-48"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/30">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Referensi</th>
              <th className="px-5 py-3">Tipe</th>
              <th className="px-5 py-3">Keterangan</th>
              <th className="px-5 py-3">Akun</th>
              <th className="px-5 py-3 text-right">Debet</th>
              <th className="px-5 py-3 text-right">Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-400">
                  Tidak ada jurnal yang cocok dengan filter ini
                </td>
              </tr>
            )}
            {filtered.map((j) => {
              const meta = JURNAL_TIPE_LABEL[j.tipe];
              // Render multi-baris per akun
              return j.akun.map((a, ai) => (
                <tr key={`${j.id}-${ai}`} className={ai > 0 ? 'border-t-0' : 'table-row-hover'}>
                  <td className="px-5 py-2.5 text-sm text-ink-500 whitespace-nowrap">
                    {ai === 0 ? formatDate(j.tanggal) : ''}
                  </td>
                  <td className="px-5 py-2.5 text-sm font-semibold text-brand-700">
                    {ai === 0 ? j.referensi : ''}
                  </td>
                  <td className="px-5 py-2.5">
                    {ai === 0 && (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-ink-600 max-w-[280px]">
                    {ai === 0 ? (
                      <span className="truncate block">{j.keterangan}</span>
                    ) : (
                      <span className={`text-ink-500 ${a.kredit > 0 ? 'pl-6 italic' : 'pl-2'}`}>{a.namaAkun}</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-ink-400">
                    {ai === 0 ? '' : ''}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-right whitespace-nowrap">
                    {a.debet > 0
                      ? <span className="font-semibold text-ink-800">{formatRupiah(a.debet)}</span>
                      : <span className="text-ink-300">—</span>}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-right whitespace-nowrap">
                    {a.kredit > 0
                      ? <span className="font-semibold text-ink-600">{formatRupiah(a.kredit)}</span>
                      : <span className="text-ink-300">—</span>}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-brand-100 bg-brand-50/30 flex items-center justify-between">
        <p className="text-xs text-ink-400">{filtered.length} jurnal ditampilkan dari {jurnal.length} total</p>
        <TotalRow jurnal={filtered} />
      </div>
    </div>
  );
}

function TotalRow({ jurnal }: { jurnal: ReturnType<typeof buildAllJurnal> }) {
  const td = jurnal.reduce((s, j) => s + j.akun.reduce((x, a) => x + a.debet, 0), 0);
  const tk = jurnal.reduce((s, j) => s + j.akun.reduce((x, a) => x + a.kredit, 0), 0);
  return (
    <div className="flex items-center gap-6 text-xs font-semibold text-ink-700">
      <span>Debet: <span className="text-ink-900">{formatRupiah(td)}</span></span>
      <span>Kredit: <span className="text-ink-900">{formatRupiah(tk)}</span></span>
    </div>
  );
}

// ─── Tab 2: Buku Besar per Akun ───────────────────────────────────────────────
function BukuBesarTab({ jurnal }: { jurnal: ReturnType<typeof buildAllJurnal> }) {
  const [selectedKode, setSelectedKode] = useState<KodeAkun>('1-103');

  const availableAkun = useMemo(() => {
    const aktifKodes = new Set(jurnal.flatMap((j) => j.akun.map((a) => a.kode)));
    return CHART_OF_ACCOUNTS.filter((a) => aktifKodes.has(a.kode));
  }, [jurnal]);

  const ledgerRows = useMemo(
    () => buildLedgerBaris(jurnal, selectedKode),
    [jurnal, selectedKode]
  );

  const akunInfo = CHART_OF_ACCOUNTS.find((a) => a.kode === selectedKode);
  const totalDebet  = ledgerRows.reduce((s, r) => s + r.debet, 0);
  const totalKredit = ledgerRows.reduce((s, r) => s + r.kredit, 0);
  const saldoAkhir  = ledgerRows.length > 0 ? ledgerRows[ledgerRows.length - 1].saldo : 0;

  const tipeColor: Record<string, string> = {
    Aset: 'bg-brand-50 text-brand-700',
    Kewajiban: 'bg-red-50 text-red-600',
    Pendapatan: 'bg-emerald-50 text-emerald-700',
    Beban: 'bg-amber-50 text-amber-700',
  };

  if (availableAkun.length === 0) {
    return <EmptyState icon={LayoutList} title="Belum ada data buku besar" sub="Data akan muncul setelah ada jurnal yang tercatat." />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Sidebar akun */}
      <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-brand-100 bg-brand-50/20">
        <div className="p-3 border-b border-brand-100">
          <p className="text-xs font-bold text-ink-600 uppercase tracking-wider">Pilih Akun</p>
        </div>
        <div className="overflow-y-auto max-h-[460px]">
          {availableAkun.map((a) => (
            <button
              key={a.kode}
              onClick={() => setSelectedKode(a.kode)}
              className={`w-full text-left px-4 py-3 border-b border-brand-50 transition-colors ${
                selectedKode === a.kode
                  ? 'bg-brand-600 text-white'
                  : 'hover:bg-brand-50 text-ink-600'
              }`}
            >
              <p className={`text-xs font-bold ${selectedKode === a.kode ? 'text-brand-200' : 'text-ink-400'}`}>{a.kode}</p>
              <p className="text-sm font-medium leading-tight mt-0.5">{a.nama}</p>
              <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${selectedKode === a.kode ? 'bg-brand-500 text-white' : tipeColor[a.tipe] ?? ''}`}>
                {a.tipe}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Ledger detail */}
      <div className="flex-1 min-w-0">
        {/* Akun header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100 bg-brand-50/30">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-ink-400">{akunInfo?.kode}</p>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${tipeColor[akunInfo?.tipe ?? 'Aset'] ?? ''}`}>{akunInfo?.tipe}</span>
            </div>
            <h3 className="font-bold text-ink-900 text-base mt-0.5">{akunInfo?.nama}</h3>
            <p className="text-xs text-ink-400 mt-0.5">Posisi Normal: {akunInfo?.posisiNormal}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-400">Saldo Akhir</p>
            <p className="text-xl font-bold text-brand-700">{formatRupiah(saldoAkhir)}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/30">
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Keterangan</th>
                <th className="px-5 py-3">Referensi</th>
                <th className="px-5 py-3 text-right">Debet</th>
                <th className="px-5 py-3 text-right">Kredit</th>
                <th className="px-5 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {/* Saldo awal */}
              <tr className="bg-brand-50/40">
                <td className="px-5 py-3 text-sm text-ink-400">—</td>
                <td className="px-5 py-3 text-sm font-semibold text-ink-600" colSpan={2}>Saldo Awal</td>
                <td className="px-5 py-3 text-sm text-right text-ink-300">—</td>
                <td className="px-5 py-3 text-sm text-right text-ink-300">—</td>
                <td className="px-5 py-3 text-sm font-semibold text-right text-ink-500">{formatRupiah(0)}</td>
              </tr>

              {ledgerRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-400">
                    Belum ada transaksi untuk akun ini
                  </td>
                </tr>
              )}

              {ledgerRows.map((r, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="px-5 py-3 text-sm text-ink-500 whitespace-nowrap">{r.tanggal ? formatDate(r.tanggal) : '—'}</td>
                  <td className="px-5 py-3 text-sm text-ink-700 max-w-[280px] truncate">{r.keterangan}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-brand-600 whitespace-nowrap">{r.referensi}</td>
                  <td className="px-5 py-3 text-sm text-right whitespace-nowrap">
                    {r.debet > 0
                      ? <span className="font-semibold text-ink-800">{formatRupiah(r.debet)}</span>
                      : <span className="text-ink-200">—</span>}
                  </td>
                  <td className="px-5 py-3 text-sm text-right whitespace-nowrap">
                    {r.kredit > 0
                      ? <span className="font-semibold text-ink-600">{formatRupiah(r.kredit)}</span>
                      : <span className="text-ink-200">—</span>}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-right whitespace-nowrap text-brand-700">
                    {formatRupiah(r.saldo)}
                  </td>
                </tr>
              ))}

              {/* Total row */}
              {ledgerRows.length > 0 && (
                <tr className="bg-brand-50 border-t-2 border-brand-200">
                  <td className="px-5 py-4 text-sm font-bold text-ink-800" colSpan={3}>Total</td>
                  <td className="px-5 py-4 text-sm font-bold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalDebet)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalKredit)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-right whitespace-nowrap text-brand-700">{formatRupiah(saldoAkhir)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Neraca Saldo ──────────────────────────────────────────────────────
function NeracaSaldoTab({ neraca }: { neraca: ReturnType<typeof buildNeracaSaldo> }) {
  const totalSaldoDebet  = neraca.reduce((s, r) => s + r.saldoDebet, 0);
  const totalSaldoKredit = neraca.reduce((s, r) => s + r.saldoKredit, 0);
  const balanced = Math.abs(totalSaldoDebet - totalSaldoKredit) < 1;

  const tipeColor: Record<string, string> = {
    Aset: 'bg-brand-50 text-brand-700',
    Kewajiban: 'bg-red-50 text-red-600',
    Pendapatan: 'bg-emerald-50 text-emerald-700',
    Beban: 'bg-amber-50 text-amber-700',
  };

  // Group by tipe
  const groups: Record<string, typeof neraca> = {};
  for (const r of neraca) {
    if (!groups[r.tipe]) groups[r.tipe] = [];
    groups[r.tipe].push(r);
  }
  const tipeOrder = ['Aset', 'Kewajiban', 'Pendapatan', 'Beban'];

  if (neraca.length === 0) {
    return <EmptyState icon={TableProperties} title="Neraca saldo kosong" sub="Akan terisi otomatis saat ada transaksi jurnal." />;
  }

  return (
    <div>
      {/* Balance indicator */}
      <div className={`flex items-center gap-3 px-5 py-3 border-b ${balanced ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
        {balanced
          ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          : <AlertCircle size={18} className="text-amber-500 shrink-0" />}
        <p className={`text-sm font-semibold ${balanced ? 'text-emerald-700' : 'text-amber-700'}`}>
          {balanced
            ? 'Neraca Saldo Seimbang — Total Debet = Total Kredit'
            : `Neraca Tidak Seimbang — Selisih: ${formatRupiah(Math.abs(totalSaldoDebet - totalSaldoKredit))}`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/30">
              <th className="px-5 py-3.5 w-20">Kode</th>
              <th className="px-5 py-3.5">Nama Akun</th>
              <th className="px-5 py-3.5 w-24">Tipe</th>
              <th className="px-5 py-3.5 text-right">Total Debet</th>
              <th className="px-5 py-3.5 text-right">Total Kredit</th>
              <th className="px-5 py-3.5 text-right bg-brand-50/50">Saldo Debet</th>
              <th className="px-5 py-3.5 text-right bg-brand-50/50">Saldo Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {tipeOrder.map((tipe) => {
              const rows = groups[tipe];
              if (!rows || rows.length === 0) return null;
              const subtotalSD = rows.reduce((s, r) => s + r.saldoDebet, 0);
              const subtotalSK = rows.reduce((s, r) => s + r.saldoKredit, 0);
              return (
                <Fragment key={tipe}>
                  {/* Group header */}
                  <tr className="bg-ink-50">
                    <td colSpan={7} className="px-5 py-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${tipeColor[tipe]}`}>{tipe}</span>
                    </td>
                  </tr>
                  {rows.map((r) => (
                    <tr key={r.kode} className="table-row-hover">
                      <td className="px-5 py-3.5 text-xs font-bold text-ink-400">{r.kode}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-ink-800">{r.namaAkun}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tipeColor[r.tipe]}`}>{r.tipe}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{r.totalDebet > 0 ? formatRupiah(r.totalDebet) : '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{r.totalKredit > 0 ? formatRupiah(r.totalKredit) : '—'}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap bg-brand-50/30">{r.saldoDebet > 0 ? formatRupiah(r.saldoDebet) : '—'}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap bg-brand-50/30">{r.saldoKredit > 0 ? formatRupiah(r.saldoKredit) : '—'}</td>
                    </tr>
                  ))}
                  {/* Subtotal per group */}
                  <tr className="bg-ink-50/80 border-t border-brand-200">
                    <td colSpan={3} className="px-5 py-2.5 text-xs font-bold text-ink-500">Subtotal {tipe}</td>
                    <td colSpan={2} />
                    <td className="px-5 py-2.5 text-sm font-bold text-ink-700 text-right whitespace-nowrap bg-brand-50/50">{subtotalSD > 0 ? formatRupiah(subtotalSD) : '—'}</td>
                    <td className="px-5 py-2.5 text-sm font-bold text-ink-700 text-right whitespace-nowrap bg-brand-50/50">{subtotalSK > 0 ? formatRupiah(subtotalSK) : '—'}</td>
                  </tr>
                </Fragment>
              );
            })}

            {/* Grand total */}
            <tr className="bg-brand-50 border-t-2 border-brand-300">
              <td colSpan={3} className="px-5 py-4 text-sm font-bold text-ink-900">TOTAL KESELURUHAN</td>
              <td className="px-5 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(neraca.reduce((s, r) => s + r.totalDebet, 0))}</td>
              <td className="px-5 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(neraca.reduce((s, r) => s + r.totalKredit, 0))}</td>
              <td className={`px-5 py-4 text-sm font-bold text-right whitespace-nowrap ${balanced ? 'text-emerald-700' : 'text-red-600'}`}>{formatRupiah(totalSaldoDebet)}</td>
              <td className={`px-5 py-4 text-sm font-bold text-right whitespace-nowrap ${balanced ? 'text-emerald-700' : 'text-red-600'}`}>{formatRupiah(totalSaldoKredit)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Penjelasan akuntansi */}
      <div className="p-5 border-t border-brand-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'BBB → BDP', ket: 'Bahan baku masuk produksi dicatat sebagai BDP-BBB (D) / Persediaan BB (K)', icon: Factory, color: 'amber' },
          { label: 'BTKL → BDP', ket: 'Upah tenaga kerja langsung dibebankan sebagai BDP-BTKL (D) / Hutang Gaji (K)', icon: ChevronDown, color: 'violet' },
          { label: 'BOP → BOP Dibebankan', ket: 'Overhead pabrik dibebankan ke pesanan: BDP-BOP (D) / BOP Dibebankan (K) — Kredit 2-102', icon: ChevronDown, color: 'orange' },
          { label: 'BDP → BJ', ket: 'Saat produksi selesai, BDP ditransfer ke Persediaan BJ, lalu HPP dicatat', icon: CheckCircle2, color: 'emerald' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-brand-50/50 border border-brand-100 p-3">
            <p className="text-xs font-bold text-brand-700 mb-1 flex items-center gap-1.5">
              <ArrowRight size={12} /> {item.label}
            </p>
            <p className="text-xs text-ink-500 leading-relaxed">{item.ket}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-komponen utilitas ────────────────────────────────────────────────────
function SummaryCard({ icon: Icon, label, value, accent }: {
  icon: LucideIcon; label: string; value: string;
  accent: 'brand' | 'emerald' | 'amber' | 'violet';
}) {
  const map = {
    brand:   'bg-brand-50 text-brand-600 ring-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber:   'bg-amber-50 text-amber-600 ring-amber-100',
    violet:  'bg-violet-50 text-violet-600 ring-violet-100',
  };
  return (
    <div className="card p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-4 mb-3 ${map[accent]}`}>
        <Icon size={22} />
      </div>
      <p className="text-sm text-ink-400 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-ink-900 truncate">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-4">
        <Icon size={28} />
      </div>
      <p className="font-bold text-ink-900 text-base mb-1">{title}</p>
      <p className="text-sm text-ink-400 max-w-xs">{sub}</p>
    </div>
  );
}
