import React from "react";
import { TIME_OPTIONS, formatPhone, formatIC } from "../utils/helpers";

export default function Borang({ form, onSubmit, onUpdate }) {
  return (
    <section className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-950">Tambah Rekod Pesakit</h2>
          <p className="text-sm text-slate-500">Daftar maklumat pesakit</p>
        </div>
        <div className="space-y-3">
          <Field label="Nama Pesakit">
            <input className="input" value={form.nama} onChange={(e) => onUpdate("nama", e.target.value)} />
          </Field>
          <Field label="No Kad Pengenalan">
            <input className="input" value={form.noKadPengenalan} onChange={(e) => onUpdate("noKadPengenalan", formatIC(e.target.value))} />
          </Field>
          <Field label="No Telefon">
            <input className="input" value={form.noTelefon} onChange={(e) => onUpdate("noTelefon", formatPhone(e.target.value))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarikh">
              <input type="date" className="input" value={form.tarikh} onChange={(e) => onUpdate("tarikh", e.target.value)} />
            </Field>
            <Field label="Masa">
              <select className="input input-time" value={form.masa} onChange={(e) => onUpdate("masa", e.target.value)}>
                {TIME_OPTIONS.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Juruterapi Bertugas">
            <input className="input" value={form.juruterapi} onChange={(e) => onUpdate("juruterapi", e.target.value)} />
          </Field>
          <Field label="Rawatan">
            <input className="input" value={form.rawatan} onChange={(e) => onUpdate("rawatan", e.target.value)} />
          </Field>
          <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Simpan Rekod</button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
