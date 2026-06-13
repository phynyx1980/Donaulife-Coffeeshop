"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, Trash2, Edit2, LogOut, Check, X,
  RefreshCw, Upload, ImageOff, Images,
} from "lucide-react";
import type { DonauEvent } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────

type GalleryItem = {
  id: number;
  file: string;
  cat: string;
  caption_de: string;
  caption_en: string;
};

// ── Constants ──────────────────────────────────────────────────────────────

const MOCK_EVENTS: DonauEvent[] = [
  { id: "1", title: "Karaoke Night", date_de: "Fr, 30. Mai", date_en: "Fri, May 30th", time: "19:00", description_de: "Jeden letzten Freitag gehört die Bühne euch!", description_en: "Every last Friday the stage is yours!", tag: "Karaoke", tag_color: "#f59e0b", flyer_url: null },
  { id: "2", title: "BPM : Schicht", date_de: "Sa, 7. Juni", date_en: "Sat, June 7th", time: "20:00", description_de: "Elektronische Beats und entspannte Vibes.", description_en: "Electronic beats and relaxed vibes.", tag: "DJ", tag_color: "#8b5cf6", flyer_url: null },
  { id: "3", title: "River Grooves", date_de: "Fr, 13. Juni", date_en: "Fri, June 13th", time: "19:30", description_de: "Live-Musik direkt an der Donau.", description_en: "Live music right by the Danube.", tag: "Live", tag_color: "#06b6d4", flyer_url: null },
];

const EMPTY_EVENT: Omit<DonauEvent, "id"> = {
  title: "", date_de: "", date_en: "", time: "",
  description_de: "", description_en: "",
  tag: "", tag_color: "#39d353", flyer_url: null,
};

function omitId({ id, ...rest }: DonauEvent): Omit<DonauEvent, "id"> {
  void id;
  return rest;
}

const CATS = [
  { key: "vibes", label: "Vibes 🌿" },
  { key: "events", label: "Events 🎉" },
  { key: "drinks", label: "Drinks ☕" },
  { key: "cbd", label: "CBD 🌱" },
];

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"events" | "gallery">("events");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (!res.ok) router.replace("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

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
          <a href="/" target="_blank" style={{ fontSize: "13px", color: "var(--tx2)", textDecoration: "none" }}>Website ↗</a>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 12px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer" }}>
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", gap: "4px" }}>
        {([
          { key: "events", label: "Events", icon: "🎉" },
          { key: "gallery", label: "Galerie", icon: "🖼️" },
        ] as const).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              background: "none", border: "none", borderBottom: `2px solid ${tab === t.key ? "var(--green)" : "transparent"}`,
              padding: "14px 16px", color: tab === t.key ? "var(--green)" : "var(--tx2)",
              fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-syne)",
              transition: "all 0.15s",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: "32px 24px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        {tab === "events"
          ? <EventsTab showToast={showToast} />
          : <GalleryTab showToast={showToast} />
        }
      </main>

      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "var(--green)" : "#ef4444",
          color: toast.ok ? "#080808" : "#fff",
          borderRadius: "50px", padding: "10px 20px", fontSize: "13px", fontWeight: 600,
          zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Events Tab ─────────────────────────────────────────────────────────────

function EventsTab({ showToast }: { showToast: (m: string, ok?: boolean) => void }) {
  const router = useRouter();
  const [events, setEvents] = useState<DonauEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<DonauEvent, "id">>(EMPTY_EVENT);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Omit<DonauEvent, "id">>(EMPTY_EVENT);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) { router.replace("/admin"); return; }
      const data: DonauEvent[] = await res.json();
      setEvents(data.length > 0 ? data : MOCK_EVENTS);
    } catch { setEvents(MOCK_EVENTS); }
    finally { setLoading(false); }
  }, [router]);

  // Daten beim Mount laden — Standard-Fetch-on-Mount-Pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function save(updated: DonauEvent[]) {
    try {
      await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
      setEvents(updated);
      showToast("Gespeichert ✓");
    } catch { showToast("Fehler beim Speichern", false); }
  }

  async function confirmEdit() {
    const updated = events.map((e) => (e.id === editingId ? { ...editForm, id: editingId } : e));
    setEditingId(null);
    await save(updated);
  }

  async function deleteEvent(id: string) {
    if (!confirm("Event wirklich löschen?")) return;
    await save(events.filter((e) => e.id !== id));
  }

  async function addEvent() {
    if (!addForm.title.trim()) return;
    setShowAdd(false);
    await save([...events, { ...addForm, id: `evt-${Date.now()}` }]);
    setAddForm(EMPTY_EVENT);
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", margin: 0 }}>Events verwalten</h2>
          <p style={{ color: "var(--tx2)", fontSize: "13px", margin: "4px 0 0" }}>Erscheinen sofort auf der Homepage</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={load} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer" }}>
            <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
          <button onClick={() => { setShowAdd(true); setAddForm(EMPTY_EVENT); }} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#080808", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)" }}>
            <Plus size={14} /> Neues Event
          </button>
        </div>
      </div>

      {showAdd && <EventForm form={addForm} onChange={setAddForm} onSave={addEvent} onCancel={() => setShowAdd(false)} title="Neues Event" />}

      {loading
        ? [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "12px", marginBottom: "12px" }} />)
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((event) =>
              editingId === event.id
                ? <EventForm key={event.id} form={editForm} onChange={setEditForm} onSave={confirmEdit} onCancel={() => setEditingId(null)} title={`Bearbeiten: ${event.title}`} />
                : <EventRow key={event.id} event={event} onEdit={(e) => { setEditingId(e.id); setEditForm(omitId(e)); }} onDelete={deleteEvent} />
            )}
            {events.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--tx2)", padding: "40px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                Noch keine Events. Klicke auf „Neues Event&quot;.
              </div>
            )}
          </div>
        )
      }
    </>
  );
}

// ── Gallery Tab ────────────────────────────────────────────────────────────

function GalleryTab({ showToast }: { showToast: (m: string, ok?: boolean) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data: GalleryItem[] = await res.json();
      setItems(data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  // Daten beim Mount laden — Standard-Fetch-on-Mount-Pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function uploadFiles(files: File[]) {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    setUploading(true);
    const newItems: GalleryItem[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress(`${i + 1} / ${imageFiles.length}: ${file.name}`);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok) {
          newItems.push({
            id: Date.now() + i,
            file: data.url,
            cat: "vibes",
            caption_de: "",
            caption_en: "",
          });
        }
      } catch { /* skip failed file */ }
    }
    setUploading(false);
    setUploadProgress(null);
    if (newItems.length) setItems((prev) => [...prev, ...newItems]);
  }

  async function publishGallery() {
    setSaving(true);
    try {
      await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(items) });
      showToast(`${items.length} Bilder veröffentlicht ✓`);
    } catch { showToast("Fehler beim Speichern", false); }
    finally { setSaving(false); }
  }

  function updateItem(id: number, patch: Partial<GalleryItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const isUploaded = (f: string) => f.startsWith("/uploads/") || f.startsWith("http");
  const realImages = items.filter((it) => isUploaded(it.file));
  const placeholders = items.filter((it) => !isUploaded(it.file));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", margin: 0 }}>Galerie verwalten</h2>
          <p style={{ color: "var(--tx2)", fontSize: "13px", margin: "4px 0 0" }}>Bilder hochladen → Kategorie & Caption setzen → Veröffentlichen</p>
        </div>
        <button
          onClick={publishGallery}
          disabled={saving || items.length === 0}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: saving || items.length === 0 ? "var(--border)" : "var(--green)", border: "none", borderRadius: "8px", padding: "10px 18px", color: saving || items.length === 0 ? "var(--tx2)" : "#080808", fontSize: "13px", fontWeight: 700, cursor: saving || items.length === 0 ? "default" : "pointer", fontFamily: "var(--font-syne)" }}>
          <Images size={14} />
          {saving ? "Speichern…" : `${items.length} Bilder veröffentlichen`}
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(Array.from(e.dataTransfer.files)); }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--green)" : "var(--border)"}`,
          borderRadius: "16px", padding: "36px 20px", textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          background: dragOver ? "rgba(57,211,83,0.05)" : "var(--card)",
          transition: "all 0.2s", marginBottom: "28px",
        }}
      >
        {uploading ? (
          <div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--green)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--green)", fontSize: "14px", fontWeight: 600, margin: "0 0 4px", fontFamily: "var(--font-syne)" }}>Wird hochgeladen…</p>
            {uploadProgress && <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0 }}>{uploadProgress}</p>}
          </div>
        ) : (
          <div>
            <Upload size={32} color={dragOver ? "var(--green)" : "var(--tx2)"} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ color: dragOver ? "var(--green)" : "var(--tx)", fontSize: "15px", fontWeight: 700, margin: "0 0 6px", fontFamily: "var(--font-syne)" }}>
              Bilder hier reinziehen
            </p>
            <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0 }}>
              Mehrere Bilder gleichzeitig möglich · JPG, PNG, WebP · max. 8 MB pro Bild
            </p>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }} style={{ display: "none" }} />

      {/* Uploaded Real Images */}
      {realImages.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--tx)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Hochgeladene Bilder ({realImages.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {realImages.map((item) => (
              <GalleryItemRow key={item.id} item={item} onChange={(patch) => updateItem(item.id, patch)} onDelete={() => removeItem(item.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Placeholder SVG Items */}
      {!loading && placeholders.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--tx2)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Platzhalter ({placeholders.length}) — werden durch echte Bilder ersetzt
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "8px" }}>
            {placeholders.map((item) => (
              <div key={item.id} style={{ position: "relative", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/gallery/${item.file}`} alt={item.caption_de} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                <button onClick={() => removeItem(item.id)}
                  style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "12px", marginBottom: "12px" }} />)}
    </>
  );
}

// ── Gallery Item Row ───────────────────────────────────────────────────────

function GalleryItemRow({ item, onChange, onDelete }: {
  item: GalleryItem;
  onChange: (patch: Partial<GalleryItem>) => void;
  onDelete: () => void;
}) {
  const inputStyle = {
    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "8px 10px", color: "var(--tx)", fontSize: "13px", outline: "none",
    fontFamily: "var(--font-dm-sans)", width: "100%", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", display: "flex", gap: "16px", alignItems: "flex-start", padding: "12px", flexWrap: "wrap" }}>
      {/* Thumbnail */}
      <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, position: "relative", border: "1px solid var(--border)" }}>
        <Image src={item.file} alt="" fill style={{ objectFit: "cover" }} />
      </div>

      {/* Fields */}
      <div style={{ flex: 1, minWidth: "280px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)", display: "block", marginBottom: "3px" }}>KATEGORIE</label>
          <select value={item.cat} onChange={(e) => onChange({ cat: e.target.value })} style={{ ...inputStyle }}>
            {CATS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div />
        <div>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)", display: "block", marginBottom: "3px" }}>CAPTION (DE)</label>
          <input value={item.caption_de} onChange={(e) => onChange({ caption_de: e.target.value })} placeholder="Deutsche Bildbeschreibung" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)", display: "block", marginBottom: "3px" }}>CAPTION (EN)</label>
          <input value={item.caption_en} onChange={(e) => onChange({ caption_en: e.target.value })} placeholder="English caption" style={inputStyle} />
        </div>
      </div>

      {/* Delete */}
      <button onClick={onDelete} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "8px 10px", color: "#f87171", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ── Event Row ──────────────────────────────────────────────────────────────

function EventRow({ event, onEdit, onDelete }: {
  event: DonauEvent;
  onEdit: (e: DonauEvent) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px", overflow: "hidden", flexWrap: "wrap" }}>
      <div style={{ width: "72px", height: "72px", flexShrink: 0, background: event.flyer_url ? "transparent" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {event.flyer_url
          ? <Image src={event.flyer_url} alt={event.title} fill style={{ objectFit: "cover" }} />
          : <ImageOff size={20} color="var(--tx2)" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "160px", padding: "0 4px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: event.tag_color, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "15px", color: "var(--tx)" }}>{event.title}</div>
          <div style={{ fontSize: "12px", color: "var(--tx2)", marginTop: "2px" }}>{event.date_de} · {event.time} · {event.tag}</div>
        </div>
      </div>
      <p style={{ color: "var(--tx2)", fontSize: "13px", flex: 2, minWidth: "180px", margin: 0, lineHeight: 1.4, padding: "0 4px" }}>{event.description_de}</p>
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

// ── Event Form ─────────────────────────────────────────────────────────────

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
  const fileRef = useRef<HTMLInputElement>(null);

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

  const inputStyle = {
    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "9px 12px", color: "var(--tx)", fontSize: "13px", outline: "none",
    fontFamily: "var(--font-dm-sans)", width: "100%", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    fontSize: "11px", fontWeight: 600 as const, color: "var(--tx2)" as const,
    letterSpacing: "0.05em", fontFamily: "var(--font-syne)" as const,
    marginBottom: "4px", display: "block" as const,
  };

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--green-bdr)", borderRadius: "14px", padding: "24px", marginBottom: "4px" }}>
      <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", color: "var(--green)", marginBottom: "20px" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>TITEL</label>
          <input value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} placeholder="z.B. Karaoke Night" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>DATUM (DE)</label>
          <input value={form.date_de} onChange={(e) => onChange({ ...form, date_de: e.target.value })} placeholder="Fr, 30. Mai" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>DATUM (EN)</label>
          <input value={form.date_en} onChange={(e) => onChange({ ...form, date_en: e.target.value })} placeholder="Fri, May 30th" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>UHRZEIT</label>
          <input value={form.time} onChange={(e) => onChange({ ...form, time: e.target.value })} placeholder="19:00" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>TAG & FARBE</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input value={form.tag} onChange={(e) => onChange({ ...form, tag: e.target.value })} placeholder="Karaoke, DJ, Live…" style={{ ...inputStyle, flex: 1 }} />
            <input type="color" value={form.tag_color} onChange={(e) => onChange({ ...form, tag_color: e.target.value })}
              style={{ width: "40px", height: "38px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", padding: "2px", flexShrink: 0 }} />
          </div>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>BESCHREIBUNG (DE)</label>
          <textarea value={form.description_de} onChange={(e) => onChange({ ...form, description_de: e.target.value })} rows={2} placeholder="Deutsche Beschreibung…" style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>BESCHREIBUNG (EN)</label>
          <textarea value={form.description_en} onChange={(e) => onChange({ ...form, description_en: e.target.value })} rows={2} placeholder="English description…" style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Flyer Upload */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={labelStyle}>FLYER / BILD</label>
          {form.flyer_url ? (
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ position: "relative", width: "110px", height: "110px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                <Image src={form.flyer_url} alt="Vorschau" fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                <p style={{ color: "var(--tx2)", fontSize: "11px", margin: 0, wordBreak: "break-all" }}>{form.flyer_url}</p>
                <button onClick={() => onChange({ ...form, flyer_url: null })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "5px 10px", color: "#f87171", fontSize: "12px", cursor: "pointer", width: "fit-content" }}>
                  <X size={11} /> Entfernen
                </button>
                <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "5px 10px", color: "var(--tx2)", fontSize: "12px", cursor: "pointer", width: "fit-content" }}>
                  <Upload size={11} /> Anderes Bild
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
              onClick={() => !uploading && fileRef.current?.click()}
              style={{ border: `2px dashed ${dragOver ? "var(--green)" : "var(--border)"}`, borderRadius: "12px", padding: "28px 20px", textAlign: "center", cursor: uploading ? "wait" : "pointer", background: dragOver ? "rgba(57,211,83,0.05)" : "var(--bg)", transition: "all 0.2s" }}
            >
              {uploading ? (
                <div>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid var(--green)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ color: "var(--tx2)", fontSize: "12px", margin: 0 }}>Wird hochgeladen…</p>
                </div>
              ) : (
                <div>
                  <Upload size={24} color={dragOver ? "var(--green)" : "var(--tx2)"} style={{ margin: "0 auto 8px", display: "block" }} />
                  <p style={{ color: dragOver ? "var(--green)" : "var(--tx)", fontSize: "13px", fontWeight: 600, margin: "0 0 3px", fontFamily: "var(--font-syne)" }}>Flyer reinziehen oder klicken</p>
                  <p style={{ color: "var(--tx2)", fontSize: "11px", margin: 0 }}>JPG, PNG, WebP · max. 8 MB</p>
                </div>
              )}
            </div>
          )}
          {uploadError && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>⚠ {uploadError}</p>}
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} style={{ display: "none" }} />
        </div>
      </div>

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
