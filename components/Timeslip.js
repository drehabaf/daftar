import React, { useState } from "react";
import { getTimeslipNo } from "../utils/helpers";

function getTimeslipStatement() {
  return "Dengan ini disahkan bahawa Pesakit di bawah telah hadir dan menerima Sesi Rawatan Fisioterapi di Pusat Kesihatan Drehab AF pada Tarikh dan Masa yang dinyatakan";
}

export default function Timeslip({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const filtered = records.filter((item) => {
    const text = [item.nama, item.noKadPengenalan, item.noTelefon, item.juruterapi, item.rawatan].join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) && (filterDate ? item.tarikh === filterDate : true);
  });

  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Timeslip</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Surat Pengesahan Rawatan</h2>
        <p className="mt-1 text-sm text-slate-500">Cari pesakit untuk jana timeslip.</p>
      </div>
      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <input className="input" placeholder="Cari nama / IC / telefon" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="input" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">IC</th><th className="px-4 py-3">Tarikh</th><th className="px-4 py-3">Masa</th><th className="px-4 py-3">Tindakan</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center font-semibold text-slate-400">Tiada pesakit dijumpai.</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="hover:bg-violet-50/40">
                <td className="px-4 py-3 font-bold text-slate-950">{item.nama || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{item.noKadPengenalan || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{item.tarikh || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{item.masa || "-"}</td>
                <td className="px-4 py-3"><button type="button" onClick={() => setSelectedRecord(item)} className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">Buka</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRecord ? <TimeslipPopup record={selectedRecord} records={records} onClose={() => setSelectedRecord(null)} /> : null}
    </main>
  );
}

function TimeslipPopup({ record, records, onClose }) {
  const timeslipNo = getTimeslipNo(record, records);
  function openWhatsApp() {
    const message = ["Assalamualaikum, berikut adalah pengesahan rawatan fisioterapi:", "", "No Timeslip: " + timeslipNo, "Nama Pesakit: " + (record.nama || "-"), "No Kad Pengenalan: " + (record.noKadPengenalan || "-"), "Tarikh Rawatan: " + (record.tarikh || "-"), "Masa Rawatan: " + (record.masa || "-"), "Rawatan: " + (record.rawatan || "Fisioterapi"), "Status: Selesai", "Juruterapi Bertugas: " + (record.juruterapi || "-"), "", getTimeslipStatement(), "", "Pusat Kesihatan Drehab AF"].join("\n");
    window.open("https://wa.me/60189562511?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="timeslip-modal fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 md:items-center">
      <div className="timeslip-sheet w-full max-w-xl rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 md:p-5">
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Pusat Kesihatan Drehab AF</p><h3 className="mt-1 text-xl font-bold text-slate-950">Timeslip Rawatan Fisioterapi</h3><p className="mt-1 text-sm font-medium text-slate-500">{timeslipNo}</p></div>
          <button type="button" onClick={onClose} className="no-print rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">Tutup</button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
          <p className="text-sm font-semibold leading-6 text-slate-700">Dengan ini disahkan bahawa <strong>Pesakit</strong> di bawah telah hadir dan menerima <strong>Sesi Rawatan Fisioterapi</strong> di Pusat Kesihatan Drehab AF pada Tarikh dan Masa yang dinyatakan.</p>
          <div className="mt-4 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <InfoRow label="No Timeslip" value={timeslipNo} />
            <InfoRow label="Nama Pesakit" value={record.nama || "-"} />
            <InfoRow label="No Kad Pengenalan" value={record.noKadPengenalan || "-"} />
            <InfoRow label="Tarikh Rawatan" value={record.tarikh || "-"} />
            <InfoRow label="Masa Rawatan" value={record.masa || "-"} />
            <InfoRow label="Jenis Rawatan" value={record.rawatan || "FISIOTERAPI"} />
            <InfoRow label="Status Rawatan" value="SELESAI" />
            <InfoRow label="Juruterapi Bertugas" value={record.juruterapi || "-"} />
          </div>
        </div>
        <div className="no-print mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={openWhatsApp} className="rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-bold text-green-700">WhatsApp</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">PDF</button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return <div className="flex justify-between gap-3 text-sm"><span className="font-semibold text-slate-500">{label}</span><span className="text-right font-bold text-slate-950">{value}</span></div>;
}
