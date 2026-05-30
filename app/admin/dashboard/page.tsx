"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Edit2, LogOut, Check, X, RefreshCw } from "lucide-react";
import type { DonauEvent } from "@/lib/types";

const MOCK_EVENTS: DonauEvent[] = [
  { id: "1", title: "Karaoke Night", date_de: "Fr, 30. Mai", date_en: "Fri, May 30th", time: "19:00", description_de: "Jeden letzten Freitag gehört die Bühne euch!", description_en: "Every last Friday the stage is yours!", tag: "Karaoke", tag_color: "#f59e0b", flyer_url: null },
  { id: "2", title: "BPM : Schicht", date_de: "Sa, 7. Juni", date_en: "Sat, June 7th", time: "20:00", description_de: "Elektronische Beats und entspannte Vibes mit unserem Resident DJ.", description_en: "Electronic beats and relaxed vibes with our resident DJ.", tag: "DJ", tag_color: "#8b5cf6", flyer_url: null },
  { id: "3", title: "River Grooves", date_de: "Fr, 13. Juni", date_en: "Fri, June 13th", time: "19:30", description_de: "Live-Musik direkt an der Donau — Funk, Soul und gute Laune.", description_en: "Live music right by the Danube — funk, soul and good vibes.", tag: "Live", tag_color: "#06b6d4", flyer_url: null },
  { id: "4", title: "Style Clash", date_de: "Sa, 21. Juni", date_en: "Sat, June 21st", time: "18:00", description_de: "Fashion meets Music — Kreative, Locals und gute Energie.", description_en: "Fashion meets Music — creatives, locals and great energy.", tag: "Special", tag_color: "#f43f5e", flyer_url: null },
];

const EMPTY_EVENT: Omit<DonauEvent, "id"> = {
  title: "", date_de: "", date_en: "", time: "", description_de: "", description_en: "", tag: "", tag_color: "#39d353", flyer_url: null,
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
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
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
      showToast("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(event: DonauEvent) {
    setEditingId(event.id);
    const { id: _id, ...rest } = event;
    setEditForm(rest);
  }

  function cancelEdit() {
    setEditingId(null);
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
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image src="/logo.png" alt="donau LIFE" width={120} height={24} style={{ width: "120px", height: "auto", filter: "brightness(0) invert(1)" }} />
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

        {/* Section: Events */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", margin: 0 }}>Events verwalten</h2>
              <p style={{ color: "var(--tx2)", fontSize: "13px", margin: "4px 0 0" }}>Änderungen erscheinen sofort auf der Website</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={loadEvents} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-dm-sans)" }}>
                <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} /> Aktualisieren
              </button>
              <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#080808", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)" }}>
                <Plus size={14} /> Neues Event
              </button>
            </div>
          </div>

          {/* Add Event Form */}
          {showAdd && (
            <EventForm
              form={addForm}
              onChange={setAddForm}
              onSave={addEvent}
              onCancel={() => { setShowAdd(false); setAddForm(EMPTY_EVENT); }}
              title="Neues Event"
            />
          )}

          {/* Events List */}
          {loading ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "12px" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {events.map((event) => (
                editingId === event.id ? (
                  <EventForm
                    key={event.id}
                    form={editForm}
                    onChange={setEditForm}
                    onSave={confirmEdit}
                    onCancel={cancelEdit}
                    title={`Event bearbeiten: ${event.title}`}
                  />
                ) : (
                  <div key={event.id} style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: event.tag_color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "15px", color: "var(--tx)" }}>{event.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--tx2)", marginTop: "2px" }}>{event.date_de} · {event.time} Uhr · Tag: {event.tag}</div>
                    </div>
                    <p style={{ color: "var(--tx2)", fontSize: "13px", flex: 2, minWidth: "200px", margin: 0, lineHeight: 1.4 }}>{event.description_de}</p>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => startEdit(event)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 12px", color: "var(--tx)", fontSize: "12px", cursor: "pointer" }}>
                        <Edit2 size={12} /> Bearbeiten
                      </button>
                      <button onClick={() => deleteEvent(event.id)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "6px 12px", color: "#f87171", fontSize: "12px", cursor: "pointer" }}>
                        <Trash2 size={12} /> Löschen
                      </button>
                    </div>
                  </div>
                )
              ))}
              {events.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--tx2)", padding: "40px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  Noch keine Events. Klicke auf „Neues Event" um loszulegen.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Gallery Placeholder */}
        <div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "var(--tx)", marginBottom: "8px" }}>Galerie</h2>
          <p style={{ color: "var(--tx2)", fontSize: "13px", marginBottom: "20px" }}>Bilder-Upload kommt in der nächsten Version (benötigt Supabase Storage oder Vercel Blob).</p>
          <div style={{ background: "var(--card)", border: "1px dashed var(--border)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "var(--tx2)", fontSize: "14px" }}>
            🖼️ Galerie-Verwaltung coming soon
          </div>
        </div>

      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          background: saving ? "var(--card)" : "var(--green)",
          color: saving ? "var(--tx)" : "#080808",
          border: "1px solid var(--border)",
          borderRadius: "50px",
          padding: "10px 20px",
          fontSize: "13px",
          fontWeight: 600,
          zIndex: 100,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {toast}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EventForm({
  form,
  onChange,
  onSave,
  onCancel,
  title,
}: {
  form: Omit<DonauEvent, "id">;
  onChange: (f: Omit<DonauEvent, "id">) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}) {
  const field = (key: keyof Omit<DonauEvent, "id">, label: string, placeholder?: string, half?: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)" }}>{label}</label>
      <input
        value={(form[key] as string) ?? ""}
        onChange={(e) => onChange({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "9px 12px",
          color: "var(--tx)",
          fontSize: "13px",
          outline: "none",
          fontFamily: "var(--font-dm-sans)",
        }}
      />
    </div>
  );

  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--green-bdr)",
      borderRadius: "14px",
      padding: "24px",
      marginBottom: "4px",
    }}>
      <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", color: "var(--green)", marginBottom: "20px" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {field("title", "TITEL", "Karaoke Night")}
        {field("time", "UHRZEIT", "19:00", true)}
        {field("date_de", "DATUM (DE)", "Fr, 30. Mai", true)}
        {field("date_en", "DATUM (EN)", "Fri, May 30th", true)}
        {field("description_de", "BESCHREIBUNG (DE)", "Deutsche Beschreibung")}
        {field("description_en", "BESCHREIBUNG (EN)", "English description")}
        {field("tag", "TAG", "Karaoke, DJ, Live...", true)}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--tx2)", letterSpacing: "0.05em", fontFamily: "var(--font-syne)" }}>TAG-FARBE</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="color" value={form.tag_color} onChange={(e) => onChange({ ...form, tag_color: e.target.value })}
              style={{ width: "40px", height: "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", padding: "2px" }} />
            <span style={{ fontSize: "13px", color: "var(--tx2)", fontFamily: "var(--font-dm-sans)" }}>{form.tag_color}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 16px", color: "var(--tx2)", fontSize: "13px", cursor: "pointer" }}>
          <X size={14} /> Abbrechen
        </button>
        <button onClick={onSave} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#080808", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne)" }}>
          <Check size={14} /> Speichern
        </button>
      </div>
    </div>
  );
}
