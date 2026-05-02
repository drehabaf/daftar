import React, { useEffect, useMemo, useState } from "react";
import Borang from "../components/Borang";
import Statistik from "../components/Statistik";
import Timeslip from "../components/Timeslip";
import Dokumen from "../components/Dokumen";
import { today, createId, filterPatientRecords, buildCSV } from "../utils/helpers";

const STORAGE_KEY = "drehab_records";
const DOCUMENT_STORAGE_KEY = "drehab_documents";

function getLiveTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, "0");
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return String(h12).padStart(2, "0") + ":" + minute + " " + suffix;
}
function loadArray(key) {
  if (typeof window === "undefined") return [];
  try { const data = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(data) ? data : []; } catch { return []; }
}
function saveArray(key, value) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [records, setRecords] = useState(() => loadArray(STORAGE_KEY));
  const [documents, setDocuments] = useState(() => loadArray(DOCUMENT_STORAGE_KEY));
  const [activeTab, setActiveTab] = useState("form");
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(today());
  const [docDraft, setDocDraft] = useState(null);
  const [form, setForm] = useState({ nama: "", noKadPengenalan: "", noTelefon: "", tarikh: today(), masa: getLiveTime(), juruterapi: "", rawatan: "" });

  useEffect(() => saveArray(STORAGE_KEY, records), [records]);
  useEffect(() => saveArray(DOCUMENT_STORAGE_KEY, documents), [documents]);
  const filteredRecords = useMemo(() => filterPatientRecords(records, search, filterDate), [records, search, filterDate]);

  function updateForm(key, value) {
    const upper = ["nama", "juruterapi", "rawatan"];
    setForm((prev) => ({ ...prev, [key]: upper.includes(key) ? value.toUpperCase() : value }));
  }
  function addRecord(e) {
    e.preventDefault();
    if (!form.nama || !form.noKadPengenalan || !form.noTelefon) return;
    setRecords((prev) => [{ id: createId(), ...form }, ...prev]);
    setForm({ nama: "", noKadPengenalan: "", noTelefon: "", tarikh: today(), masa: getLiveTime(), juruterapi: "", rawatan: "" });
  }
  function deleteRecord(id) { setRecords((prev) => prev.filter((item) => item.id !== id)); }
  function openDocumentFromRecord(record, type) {
    setDocDraft({ type, nama: record.nama, noKadPengenalan: record.noKadPengenalan, tarikh: record.tarikh, masa: record.masa, juruterapi: record.juruterapi, rawatan: record.rawatan, bayaran: "" });
    setActiveTab("dokumen");
  }
  function saveDocumentHistory(type, docForm) {
    setDocuments((prev) => [{ id: createId(), type, ...docForm, createdAt: new Date().toISOString() }, ...prev]);
  }
  function deleteDocument(id) { setDocuments((prev) => prev.filter((item) => item.id !== id)); }
  function resetLocalData() {
    const ok = window.confirm("Padam semua rekod?");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DOCUMENT_STORAGE_KEY);
    setRecords([]); setDocuments([]);
  }
  function exportCSV() {
    const headers = ["Nama", "No Kad Pengenalan", "No Telefon", "Tarikh", "Masa", "Juruterapi Bertugas", "Rawatan"];
    const rows = filteredRecords.map((item) => [item.nama, item.noKadPengenalan, item.noTelefon, item.tarikh, item.masa, item.juruterapi, item.rawatan]);
    const blob = new Blob([buildCSV(headers, rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = "senarai-pesakit-" + (filterDate || "semua") + ".csv"; link.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-3 text-slate-900 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><h1 className="text-xl font-bold">Pusat Kesihatan Drehab AF</h1><p className="text-sm text-slate-500">Sistem Rekod Pesakit</p></div>
            <div className="flex gap-2"><button onClick={exportCSV} className="rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700">Export CSV</button><button onClick={resetLocalData} className="rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-bold text-red-600">Reset</button></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
          <Tab label="Borang" active={activeTab === "form"} onClick={() => setActiveTab("form")} />
          <Tab label="Statistik" active={activeTab === "statistik"} onClick={() => setActiveTab("statistik")} />
          <Tab label="Timeslip" active={activeTab === "timeslip"} onClick={() => setActiveTab("timeslip")} />
          <Tab label="Dokumen" active={activeTab === "dokumen"} onClick={() => setActiveTab("dokumen")} />
        </div>
        {activeTab === "form" && <Borang form={form} onSubmit={addRecord} onUpdate={updateForm} />}
        {activeTab === "statistik" && <Statistik records={filteredRecords} search={search} setSearch={setSearch} filterDate={filterDate} setFilterDate={setFilterDate} deleteRecord={deleteRecord} openDocumentFromRecord={openDocumentFromRecord} />}
        {activeTab === "timeslip" && <Timeslip records={records} />}
        {activeTab === "dokumen" && <Dokumen draft={docDraft} documents={documents} onSaveHistory={saveDocumentHistory} onDeleteDocument={deleteDocument} />}
      </div>
      <style>{`.input{text-transform:uppercase;width:100%;border-radius:.85rem;border:1px solid #d6dde8;background:white;padding:.72rem .9rem;font-weight:600;outline:none}.input-time{text-transform:none}@media print{body *{visibility:hidden!important}.timeslip-modal,.timeslip-modal *,.dokumen-modal,.dokumen-modal *{visibility:visible!important}.timeslip-modal,.dokumen-modal{position:fixed!important;inset:0!important;background:white!important;padding:0!important}.timeslip-sheet,.dokumen-sheet{position:absolute!important;top:0!important;left:0!important;width:100%!important;max-width:none!important;box-shadow:none!important;border-radius:0!important;padding:24px!important}.no-print{display:none!important}}`}</style>
    </div>
  );
}
function Tab({ label, active, onClick }) {
  return <button onClick={onClick} className={"rounded-lg px-4 py-2 text-sm font-bold " + (active ? "bg-blue-600 text-white" : "text-slate-600")}>{label}</button>;
}
