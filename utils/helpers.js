export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function formatTimeTo12Hour(value) {
  if (!value) return "";
  const [h, m = "00"] = String(value).split(":");
  let hour = Number(h);
  if (!Number.isFinite(hour)) return String(value);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return String(hour).padStart(2, "0") + ":" + m + " " + suffix;
}

export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  return formatTimeTo12Hour(String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"));
});

export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

export function formatPhone(value) {
  let clean = String(value || "").replace(/[^0-9]/g, "").slice(0, 11);
  if (clean.length > 3) clean = clean.slice(0, 3) + "-" + clean.slice(3);
  return clean;
}

export function formatIC(value) {
  let clean = String(value || "").replace(/[^0-9]/g, "").slice(0, 12);
  if (clean.length > 6 && clean.length <= 8) clean = clean.slice(0, 6) + "-" + clean.slice(6);
  else if (clean.length > 8) clean = clean.slice(0, 6) + "-" + clean.slice(6, 8) + "-" + clean.slice(8);
  return clean;
}

export function formatRinggit(value) {
  let clean = String(value || "").replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  if (parts.length > 1) clean = parts[0] + "." + parts.slice(1).join("").slice(0, 2);
  return clean;
}

export function displayRinggit(value) {
  return "RM " + Number(value || 0).toFixed(2);
}

function getPrefix(type) {
  return type === "invoice" ? "INV" : "RS";
}

function getDateKey(date) {
  return String(date || today()).replace(/-/g, "");
}

export function getNextDocumentNo(type, date, documents = []) {
  const prefix = getPrefix(type) + "-" + getDateKey(date) + "-";
  const max = documents.reduce((acc, doc) => {
    const no = String(doc.documentNo || "");
    if (!no.startsWith(prefix)) return acc;
    const num = Number(no.slice(prefix.length));
    return Number.isFinite(num) ? Math.max(acc, num) : acc;
  }, 0);
  return prefix + String(max + 1).padStart(5, "0");
}

export function getTimeslipNo(record, records = []) {
  const dateKey = String(record.tarikh || today()).replace(/-/g, "");
  const prefix = "TS-" + dateKey + "-";
  const sameDay = records.filter((r) => String(r.tarikh || "").replace(/-/g, "") === dateKey);
  const index = sameDay.findIndex((r) => r.id === record.id);
  const num = index >= 0 ? index + 1 : sameDay.length + 1;
  return prefix + String(num).padStart(5, "0");
}

export function filterPatientRecords(records, search, filterDate) {
  return records.filter((item) => {
    const text = [item.nama, item.noKadPengenalan, item.noTelefon, item.juruterapi, item.rawatan].join(" ").toLowerCase();
    return text.includes(String(search || "").toLowerCase()) && (filterDate ? item.tarikh === filterDate : true);
  });
}

export function filterDocuments(documents, search) {
  return documents.filter((doc) => {
    const text = [doc.documentNo, doc.type, doc.nama, doc.noKadPengenalan, doc.tarikh, doc.masa, doc.rawatan].join(" ").toLowerCase();
    return text.includes(String(search || "").toLowerCase());
  });
}

function escapeCSV(cell) {
  return `"${String(cell ?? "").replace(/"/g, '""')}"`;
}

export function buildCSV(headers, rows) {
  return [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");
}
