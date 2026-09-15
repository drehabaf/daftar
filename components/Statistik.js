import React, { useMemo, useState } from "react";

const MONTHS = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];

export default function Statistik({ records, allRecords = [], search, setSearch, filterDate, setFilterDate, deleteRecord, openDocumentFromRecord }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const [statsOpen, setStatsOpen] = useState(false);

  const monthlyStats = useMemo(() => {
    const counts = Array(12).fill(0);

    allRecords.forEach((item) => {
      const date = String(item.tarikh || "");
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) return;
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      if (year === currentYear && month >= 0 && month < 12) counts[month] += 1;
    });

    const total = counts.reduce((sum, value) => sum + value, 0);
    const max = Math.max(...counts, 1);

    return counts.map((count, index) => ({
      month: MONTHS[index],
      count,
      rate: total > 0 ? (count / total) * 100 : 0,
      height: count > 0 ? Math.max((count / max) * 100, 10) : 0,
      isCurrent: index === currentMonth,
    }));
  }, [allRecords, currentYear, currentMonth]);

  const totalThisYear = monthlyStats.reduce((sum, item) => sum + item.count, 0);

  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => setStatsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 p-4 text-left"
          aria-expanded={statsOpen}
        >
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Statistik Bulanan</p>
            <div className="mt-1 flex items-baseline gap-2">
              <h2 className="truncate text-base font-bold text-slate-950">Jumlah Pesakit {currentYear}</h2>
              <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">{totalThisYear}</span>
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-blue-600 ring-1 ring-slate-200 transition-transform">
            {statsOpen ? "−" : "+"}
          </span>
        </button>

        {statsOpen ? (
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="grid grid-cols-6 gap-1.5">
              {monthlyStats.map((item) => (
                <div key={item.month} className={"min-w-0 rounded-xl border px-1.5 py-2 text-center " + (item.isCurrent ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white")}>
                  <div className="flex h-16 items-end justify-center rounded-lg bg-slate-50 px-1">
                    <div className="w-full max-w-5 rounded-t-md bg-blue-600 transition-all" style={{ height: `${item.height}%` }} />
                  </div>
                  <p className="mt-1.5 text-[10px] font-black text-slate-700">{item.month}</p>
                  <p className="text-xs font-black text-slate-950">{item.count}</p>
                  <p className="text-[9px] font-bold text-slate-500">{item.rate.toFixed(1)}%</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-slate-400">6 bar setiap baris untuk paparan telefon. Kadar (%) dikira daripada jumlah pesakit yang direkodkan dalam tahun {currentYear}.</p>
          </div>
        ) : null}
      </section>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-950">Senarai Rekod Pesakit</h2>
        <p className="text-sm text-slate-500">Carian dan paparan rekod rawatan.</p>
      </div>
      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <input className="input" placeholder="Cari nama / IC / juruterapi" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="input" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">IC</th><th className="px-4 py-3">Telefon</th><th className="px-4 py-3">Tarikh</th><th className="px-4 py-3">Masa</th><th className="px-4 py-3">Juruterapi</th><th className="px-4 py-3">Rawatan</th><th className="px-4 py-3">Dokumen</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center font-semibold text-slate-400">Tiada rekod.</td></tr>
            ) : records.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/40">
                <td className="px-4 py-3 font-bold text-slate-950">{item.nama}</td>
                <td className="px-4 py-3 text-slate-600">{item.noKadPengenalan}</td>
                <td className="px-4 py-3 text-slate-600">{item.noTelefon}</td>
                <td className="px-4 py-3 text-slate-600">{item.tarikh}</td>
                <td className="px-4 py-3 text-slate-600">{item.masa}</td>
                <td className="px-4 py-3 text-slate-600">{item.juruterapi || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{item.rawatan || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => openDocumentFromRecord(item, "resit")} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Resit</button>
                    <button type="button" onClick={() => openDocumentFromRecord(item, "invoice")} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">Invoice</button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right"><button type="button" onClick={() => deleteRecord(item.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
