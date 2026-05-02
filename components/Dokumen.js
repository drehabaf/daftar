import React, { useEffect, useState } from "react";
import { today, TIME_OPTIONS, getNextDocumentNo, formatIC, formatRinggit, displayRinggit, filterDocuments } from "../utils/helpers";

function getLiveTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, "0");
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return String(h12).padStart(2, "0") + ":" + minute + " " + suffix;
}

export default function Dokumen({ draft, documents, onSaveHistory, onDeleteDocument }) {
  const [docType, setDocType] = useState(draft?.type || "resit");
  const [showPreview, setShowPreview] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [docForm, setDocForm] = useState({
    nama: draft?.nama || "",
    noKadPengenalan: draft?.noKadPengenalan || "",
    tarikh: draft?.tarikh || today(),
    masa: draft?.masa || getLiveTime(),
    juruterapi: draft?.juruterapi || "",
    rawatan: draft?.rawatan || "",
    bayaran: draft?.bayaran || "",
    documentNo: getNextDocumentNo(draft?.type || "resit", draft?.tarikh || today(), documents)
  });

  useEffect(() => {
    if (!draft) return;
    setDocType(draft.type || "resit");
    setDocForm({ nama: draft.nama || "", noKadPengenalan: draft.noKadPengenalan || "", tarikh: draft.tarikh || today(), masa: draft.masa || getLiveTime(), juruterapi: draft.juruterapi || "", rawatan: draft.rawatan || "", bayaran: draft.bayaran || "", documentNo: getNextDocumentNo(draft.type || "resit", draft.tarikh || today(), documents) });
  }, [draft, documents]);

  function updateDocForm(key, value) {
    const upper = ["nama", "juruterapi", "rawatan"];
    setDocForm((prev) => ({ ...prev, [key]: upper.includes(key) ? value.toUpperCase() : value }));
  }

  function changeDocType(type) {
    setDocType(type);
    setDocForm((prev) => ({ ...prev, documentNo: getNextDocumentNo(type, prev.tarikh || today(), documents) }));
  }

  function resetDocForm() {
    setDocForm({ nama: "", noKadPengenalan: "", tarikh: today(), masa: getLiveTime(), juruterapi: "", rawatan: "", bayaran: "", documentNo: getNextDocumentNo(docType, today(), documents) });
  }

  const title = docType === "resit" ? "Resit Rawatan" : "Invoice Rawatan";
  const canGeneratePdf = docForm.rawatan.trim() !== "" && Number(docForm.bayaran || 0) > 0;
  const filtered = filterDocuments(documents, docSearch);

  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Dokumen</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Resit & Invoice</h2>
        <p className="mt-1 text-sm text-slate-500">Jana resit dan invoice rawatan pesakit.</p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2 md:w-fit">
        <button type="button" onClick={() => changeDocType("resit")} className={"rounded-xl px-4 py-2 text-sm font-bold " + (docType === "resit" ? "bg-emerald-600 text-white" : "text-slate-600")}>Resit</button>
        <button type="button" onClick={() => changeDocType("invoice")} className={"rounded-xl px-4 py-2 text-sm font-bold " + (docType === "invoice" ? "bg-blue-600 text-white" : "text-slate-600")}>Invoice</button>
      </div>
      <form className="max-w-2xl rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">Maklumat Dokumen</h3>
        <p className="mt-1 text-xs font-bold text-slate-500">No Dokumen: {docForm.documentNo}</p>
        <div className="mt-4 space-y-3">
          <Field label="Nama Pesakit"><input className="input" value={docForm.nama} onChange={(e) => updateDocForm("nama", e.target.value)} /></Field>
          <Field label="No Kad Pengenalan"><input className="input" value={docForm.noKadPengenalan} onChange={(e) => updateDocForm("noKadPengenalan", formatIC(e.target.value))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarikh"><input type="date" className="input" value={docForm.tarikh} onChange={(e) => { updateDocForm("tarikh", e.target.value); setDocForm((prev) => ({ ...prev, documentNo: getNextDocumentNo(docType, e.target.value, documents) })); }} /></Field>
            <Field label="Masa"><select className="input input-time" value={docForm.masa} onChange={(e) => updateDocForm("masa", e.target.value)}>{TIME_OPTIONS.map((time) => <option key={time} value={time}>{time}</option>)}</select></Field>
          </div>
          <Field label="Juruterapi Bertugas"><input className="input" value={docForm.juruterapi} onChange={(e) => updateDocForm("juruterapi", e.target.value)} /></Field>
          <Field label="Rawatan"><input className="input" value={docForm.rawatan} onChange={(e) => updateDocForm("rawatan", e.target.value)} /></Field>
          <Field label="Bayaran RM"><div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white"><span className="flex items-center bg-slate-100 px-3 text-sm font-black text-slate-600">RM</span><input className="w-full bg-white px-3 py-3 text-sm font-bold outline-none" inputMode="decimal" value={docForm.bayaran} onChange={(e) => updateDocForm("bayaran", formatRinggit(e.target.value))} /></div></Field>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={resetDocForm} className="rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-bold text-red-600">Reset</button>
            <button type="button" disabled={!canGeneratePdf} onClick={() => setShowPreview(true)} className={"rounded-xl px-5 py-3 text-sm font-bold text-white " + (canGeneratePdf ? "bg-blue-600" : "cursor-not-allowed bg-slate-300 text-slate-500")}>PDF</button>
          </div>
          {!canGeneratePdf ? <p className="text-xs font-bold text-red-500">Sila isi Rawatan dan Bayaran RM untuk aktifkan PDF.</p> : null}
        </div>
      </form>
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">History Dokumen</p><h3 className="mt-1 text-lg font-bold text-slate-950">Senarai Resit & Invoice</h3></div>
          <input className="input md:max-w-xs" placeholder="Cari resit / invoice" value={docSearch} onChange={(e) => setDocSearch(e.target.value)} />
        </div>
        {documents.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-[#f8fafc] p-4 text-center text-sm font-semibold text-slate-400">Belum ada dokumen dijana.</div> : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">No Dokumen</th><th className="px-4 py-3">Jenis</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Tarikh</th><th className="px-4 py-3">Bayaran</th><th className="px-4 py-3"></th></tr></thead>
              <tbody className="divide-y divide-slate-100">{filtered.map((doc) => <tr key={doc.id}><td className="px-4 py-3 font-bold">{doc.documentNo}</td><td className="px-4 py-3">{doc.type === "invoice" ? "INVOICE" : "RESIT"}</td><td className="px-4 py-3">{doc.nama || "-"}</td><td className="px-4 py-3">{doc.tarikh || "-"}</td><td className="px-4 py-3 font-bold text-blue-600">{displayRinggit(doc.bayaran)}</td><td className="px-4 py-3 text-right"><button onClick={() => onDeleteDocument(doc.id)}>🗑️</button></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
      {showPreview ? <DokumenPreviewPopup docType={docType} docForm={docForm} onSaveHistory={onSaveHistory} onClose={() => setShowPreview(false)} /> : null}
    </main>
  );
}

function DokumenPreviewPopup({ docType, docForm, onSaveHistory, onClose }) {
  const title = docType === "resit" ? "Resit Rawatan" : "Invoice Rawatan";
  const badge = docType === "resit" ? "RESIT" : "INVOICE";
  const canSavePdf = docForm.rawatan.trim() !== "" && Number(docForm.bayaran || 0) > 0;
  function saveAsPdf() {
    if (!canSavePdf) return;
    if (onSaveHistory) onSaveHistory(docType, docForm);
    window.print();
  }
  return (
    <div className="dokumen-modal fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 md:items-center">
      <div className="dokumen-sheet w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Pusat Kesihatan Drehab AF</p><h3 className="mt-1 text-xl font-bold text-slate-950">{title}</h3><p className="mt-1 text-xs font-semibold text-slate-400">No Dokumen: {docForm.documentNo}</p></div>
          <div className="flex items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{badge}</span><button type="button" onClick={onClose} className="no-print rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">Tutup</button></div>
        </div>
        <div className="space-y-3 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-slate-200">
          <InfoRow label="No Dokumen" value={docForm.documentNo} /><InfoRow label="Nama Pesakit" value={docForm.nama || "-"} /><InfoRow label="No Kad Pengenalan" value={docForm.noKadPengenalan || "-"} /><InfoRow label="Tarikh" value={docForm.tarikh || "-"} /><InfoRow label="Masa" value={docForm.masa || "-"} /><InfoRow label="Juruterapi Bertugas" value={docForm.juruterapi || "-"} /><InfoRow label="Rawatan" value={docForm.rawatan || "-"} />
          <div className="mt-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"><div className="flex items-center justify-between gap-3"><span className="text-base font-bold text-slate-950">Jumlah Bayaran</span><span className="text-xl font-black text-blue-600">{displayRinggit(docForm.bayaran)}</span></div></div>
        </div>
        <div className="no-print mt-4"><button type="button" disabled={!canSavePdf} onClick={saveAsPdf} className={"w-full rounded-xl px-4 py-3 text-sm font-bold text-white " + (canSavePdf ? "bg-blue-600" : "cursor-not-allowed bg-slate-300 text-slate-500")}>Save as PDF</button></div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>{children}</label>;
}
function InfoRow({ label, value }) {
  return <div className="flex justify-between gap-3 text-sm"><span className="font-semibold text-slate-500">{label}</span><span className="text-right font-bold text-slate-950">{value}</span></div>;
}
