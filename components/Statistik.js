import React from "react";

export default function Statistik({ records, search, setSearch, filterDate, setFilterDate, deleteRecord, openDocumentFromRecord }) {
  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
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
