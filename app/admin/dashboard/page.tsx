"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Edit2, LogOut, Check, X, RefreshCw, Upload, ImageOff } from "lucide-react";
import type { DonauEvent } from "@/lib/types";

const MOCK_EVENTS: DonauEvent[] = [
  { id: "1", title: "Karaoke Night", date_de: "Fr, 30. Mai", date_en: "Fri, May 30th", time: "19:00", description_de: "Jeden letzten Freitag gehört die Bühne euch!", description_en: "Every last Friday the stage is yours!", tag: "Karaoke", tag_color: "#f59e0b", flyer_url: null },
  { id: "2", title: "BPM : Schicht", date_de: "Sa, 7. Juni", date_en: "Sat, June 7th", time: "20:00", description_de: "Elektronische Beats und entspannte Vibes mit unserem Resident DJ.", description_en: "Electronic beats and relaxed vibes with our resident DJ.", tag: "DJ", tag_color: "#8b5cf6", flyer_url: null },
  { id: "3", title: "River Grooves", date_de: "Fr, 13. Juni", date_en: "Fri, June 13th", time: "19:30", description_de: "Live-Musik direkt an der Donau — Funk, Soul und gute Laune.", description_en: "Live music right by the Danube — funk, soul and good vibes.", tag: "Live", tag_color: "#06b6d4", flyer_url: null },
  { id: "4", title: "Style Clash", date_de: "Sa, 21. Juni", date_en: "Sat, June 21st", time: "18:00", description_de: "Fashion meets Music — Kreative, Locals und gute Energie.", description_en: "Fashion meets Music — creatives, locals and great energy.", tag: "Special", tag_color: "#f43f5e", flyer_url: null },
];

const EMPTY_EVENT: Omit<DonauEvent, "id"> = {
  title: "", date_de: "", date_en: "", time: "",
  description_de: "", description_en: "",
  tag: "", tag_color: "#39d353", flyer_url: null,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<DonauEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<DonauEvent, "id">>(EMPTY_EVENT);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Omit<DonauEvent, "id">>(EMPTY_EVENT);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (!res.ok) router.replace("/admin");
  }, [router]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) { router.replace("/admin"); return; }
      const data: DonauEvent[] = await res.json();
      setEvents(data.length > 0 ? data : MOCK_EVENTS);
    } catch {
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth().then(loadEvents);
  }, [checkAuth, loadEvents]);

  async function saveEvents(updated: DonauEvent[]) {
    setSaving(true);
    try {
      await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setEvents(updated);
      showToast("Gespeichert ✓");
    } catch {
      showToast("Fehler beim Speichern", false);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(event: DonauEvent) {
    setEditingId(event.id);
    const { id: _id, ...rest } = event;
    setEditForm(rest);
  }

  async function confirmEdit() {
    const updated = events.map((e) => (e.id === editingId ? { ...editForm, id: editingId } : e));
    setEditingId(null);
    await saveEvents(updated);
  }

  async function deleteEvent(id: string) {
    if (!confirm("Event wirklich löschen?")) return;
    await saveEvents(events.filter((e) => e.id !== id));
  }

  async function addEvent() {
    if (!addForm.title.trim()) return;
    const newEvent: DonauEvent = { ...addForm, id: `evt-${Date.now()}` };
    setShowAdd(false);
    setAddForm(EMPTY_EVENT);
    await saveEvents([...events, newEvent]);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        background: "var(--card)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "16px", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image src="/logo.png" alt="donau LIFE" width={120} height={24}
            style={{ width: "120px", height: "auto", filter: "brightness(0) invert(1)" }} />
          <span style={{ color: "var(--border)", fontSize: "18px" }}>|</span>
          <span style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 700, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" target="_blank" style={{ fontSize: "13px", color: "var(--tx2)", textDecoration: "none" }}>Website ansehen ↗</a>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 12px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-dm-sans)" }}>
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px 24px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>

        {/* Events Section */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", margin: 0 }}>Events verwalten</h2>
              <p style={{ color: "var(--tx2)", fontSize: "13px", margin: "4px 0 0" }}>Änderungen erscheinen sofort auf der Website</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={loadEvents} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer" }}>
                <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} /> Aktualisieren
              </button>
              <button onClick={() => { setShowAdd(true); setAddForm(EMPTY_EVENT); }} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#080808", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)" }}>
                <Plus size={14} /> Neues Event
              </button>
            </div>
          </div>

          {showAdd && (
            <EventForm
              form={addForm}
              onChange={setAddForm}
              onSave={addEvent}
              onCancel={() => { setShowAdd(false); setAddForm(EMPTY_EVENT); }}
              title="Neues Event anlegen"
            />
          )}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: "88px", borderRadius: "12px" }} />)}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {events.map((event) =>
                editingId === event.id ? (
                  <EventForm
                    key={event.id}
                    form={editForm}
                    onChange={setEditForm}
                    onSave={confirmEdit}
                    onCancel={() => setEditingId(null)}
                    title={`Bearbeiten: ${event.title}`}
                  />
                ) : (
                  <EventRow key={event.id} event={event} onEdit={startEdit} onDelete={deleteEvent} />
                )
              )}
              {events.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--tx2)", padding: "40px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  Noch keine Events. Klicke auf „Neues Event" um loszulegen.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery Placeholder */}
        <div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", marginBottom: "8px" }}>Galerie</h2>
          <p style={{ color: "var(--tx2)", fontSize: "13px", marginBottom: "20px" }}>Bilder-Verwaltung kommt in der nächsten Version.</p>
          <div style={{ background: "var(--card)", border: "1px dashed var(--border)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "var(--tx2)", fontSize: "14px" }}>
            🖼️ Galerie-Verwaltung coming soon
          </div>
        </div>
      </main>

      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "var(--green)" : "#ef4444",
          color: toast.ok ? "#080808" : "#fff",
          borderRadius: "50px", padding: "10px 20px",
          fontSize: "13px", fontWeight: 600, zIndex: 100,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Event Row (read view) ──────────────────────────────────────────────────

function EventRow({ event, onEdit, onDelete }: {
  event: DonauEvent;
  onEdit: (e: DonauEvent) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px",
      display: "flex", alignItems: "center", gap: "16px", overflow: "hidden", flexWrap: "wrap",
    }}>
      {/* Flyer thumbnail */}
      <div style={{
        width: "72px", height: "72px", flexShrink: 0,
        background: event.flyer_url ? "transparent" : "var(--bg2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {event.flyer_url ? (
          <Image src={event.flyer_url} alt={event.title} fill style={{ objectFit: "cover" }} />
        ) : (
          <ImageOff size={20} color="var(--tx2)" />
        )}
      </div>

      {/* Color dot + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "160px", padding: "0 4px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: event.tag_color, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "15px", color: "var(--tx)" }}>{event.title}</div>
          <div style={{ fontSize: "12px", color: "var(--tx2)", marginTop: "2px" }}>{event.date_de} · {event.time} Uhr · {event.tag}</div>
        </div>
      </div>

      <p style={{ color: "var(--tx2)", fontSize: "13px", flex: 2, minWidth: "180px", margin: 0, lineHeight: 1.4, padding: "0 4px" }}>
        {event.description_de}
      </p>

      <div style={{ display: "flex", gap: "8px", padding: "0 16px", flexShrink: 0 }}>
        <button onClick={() => onEdit(event)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 12px", color: "var(--tx)", fontSize: "12px", cursor: "pointer" }}>
          <Edit2 size={12} /> Bearbeiten
        </button>
        <button onClick={() => onDelete(event.id)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "6px 12px", color: "#f87171", fontSize: "12px", cursor: "pointer" }}>
          <Trash2 size={12} /> Löschen
        </button>
      </div>
    </div>
  );
}

// ── Event Form (add/edit) with Drag & Drop ────────────────────────────────

function EventForm({ form, onChange, onSave, onCancel, title }: {
  form: Omit<DonauEvent, "id">;
  onChange: (f: Omit<DonauEvent, "id">) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen");
      onChange({ ...form, flyer_url: data.url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "9px 12px",
    color: "var(--tx)",
    fontSize: "13px",
    outline: "none",
    fontFamily: "var(--font-dm-sans)",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 600 as const,
    color: "var(--tx2)" as const,
    letterSpacing: "0.05em",
    fontFamily: "var(--font-syne)" as const,
    marginBottom: "4px",
    display: "block" as const,
  };

  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--green-bdr)",
      borderRadius: "14px", padding: "24px", marginBottom: "4px",
    }}>
      <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", color: "var(--green)", marginBottom: "20px" }}>
        {title}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

        {/* Titel — volle Breite */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>TITEL</label>
          <input value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} placeholder="z.B. Karaoke Night" style={inputStyle} />
        </div>

        {/* Datum DE */}
        <div>
          <label style={labelStyle}>DATUM (DE)</label>
          <input value={form.date_de} onChange={(e) => onChange({ ...form, date_de: e.target.value })} placeholder="Fr, 30. Mai" style={inputStyle} />
        </div>

        {/* Datum EN */}
        <div>
          <label style={labelStyle}>DATUM (EN)</label>
          <input value={form.date_en} onChange={(e) => onChange({ ...form, date_en: e.target.value })} placeholder="Fri, May 30th" style={inputStyle} />
        </div>

        {/* Uhrzeit */}
        <div>
          <label style={labelStyle}>UHRZEIT</label>
          <input value={form.time} onChange={(e) => onChange({ ...form, time: e.target.value })} placeholder="19:00" style={inputStyle} />
        </div>

        {/* Tag + Farbe */}
        <div>
          <label style={labelStyle}>TAG & FARBE</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input value={form.tag} onChange={(e) => onChange({ ...form, tag: e.target.value })} placeholder="Karaoke, DJ, Live…" style={{ ...inputStyle, flex: 1 }} />
            <input type="color" value={form.tag_color} onChange={(e) => onChange({ ...form, tag_color: e.target.value })}
              title="Tag-Farbe wählen"
              style={{ width: "40px", height: "38px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", padding: "2px", flexShrink: 0 }} />
          </div>
        </div>

        {/* Beschreibung DE */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>BESCHREIBUNG (DE)</label>
          <textarea value={form.description_de} onChange={(e) => onChange({ ...form, description_de: e.target.value })}
            placeholder="Deutsche Beschreibung des Events…" rows={2}
            style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Beschreibung EN */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>BESCHREIBUNG (EN)</label>
          <textarea value={form.description_en} onChange={(e) => onChange({ ...form, description_en: e.target.value })}
            placeholder="English event description…" rows={2}
            style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Flyer Upload — Drag & Drop */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>FLYER / BILD</label>

          {form.flyer_url ? (
            /* Preview */
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                <Image src={form.flyer_url} alt="Flyer Vorschau" fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0, wordBreak: "break-all" }}>{form.flyer_url}</p>
                <button onClick={() => onChange({ ...form, flyer_url: null })}
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "6px 12px", color: "#f87171", fontSize: "12px", cursor: "pointer", width: "fit-content" }}>
                  <X size={12} /> Bild entfernen
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 12px", color: "var(--tx2)", fontSize: "12px", cursor: "pointer", width: "fit-content" }}>
                  <Upload size={12} /> Anderes Bild
                </button>
              </div>
            </div>
          ) : (
            /* Drop Zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--green)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "32px 20px",
                textAlign: "center",
                cursor: uploading ? "wait" : "pointer",
                background: dragOver ? "rgba(57,211,83,0.05)" : "var(--bg)",
                transition: "all 0.2s",
              }}
            >
              {uploading ? (
                <div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--green)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  <p style={{ color: "var(--tx2)", fontSize: "13px", margin: 0 }}>Wird hochgeladen…</p>
                </div>
              ) : (
                <div>
                  <Upload size={28} color={dragOver ? "var(--green)" : "var(--tx2)"} style={{ margin: "0 auto 10px", display: "block" }} />
                  <p style={{ color: dragOver ? "var(--green)" : "var(--tx)", fontSize: "14px", fontWeight: 600, margin: "0 0 4px", fontFamily: "var(--font-syne)" }}>
                    Flyer hier reinziehen
                  </p>
                  <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0 }}>oder klicken zum Auswählen · JPG, PNG, WebP · max. 8 MB</p>
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>⚠ {uploadError}</p>
          )}

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect} style={{ display: "none" }} />
        </div>

      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 16px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer" }}>
          <X size={14} /> Abbrechen
        </button>
        <button onClick={onSave} disabled={uploading} style={{ display: "flex", alignItems: "center", gap: "6px", background: uploading ? "var(--border)" : "var(--green)", border: "none", borderRadius: "8px", padding: "8px 16px", color: uploading ? "var(--tx2)" : "#080808", fontSize: "13px", fontWeight: 700, cursor: uploading ? "default" : "pointer", fontFamily: "var(--font-syne)" }}>
          <Check size={14} /> Speichern & veröffentlichen
        </button>
      </div>
    </div>
  );
}
