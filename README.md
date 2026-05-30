# Donaulife Coffeeshop — Landing Page

Produktionsreife Next.js Landing Page für den Donaulife Coffeeshop in Krems an der Donau.

## Features

- Dark Theme, bilingual DE/EN
- AI-Chatbot (Claude) mit WhatsApp-Reservierungssystem
- Events automatisch via Instagram Hashtag `#donaulifeevent`
- Instagram Posts Live-Feed mit Vercel KV Cache
- Statische Galerie (`/public/gallery/` + `data/gallery.json`)
- Täglicher Cron Job aktualisiert Instagram-Daten
- Mock-Mode (funktioniert ohne API-Keys)

---

## Setup

```bash
npm install
cp .env.local.example .env.local
# Keys eintragen (siehe unten)
npm run dev
```

---

## Instagram Setup

### 1. Facebook Developer App erstellen
1. [developers.facebook.com](https://developers.facebook.com) → Neue App erstellen (Typ: Consumer)
2. Instagram Basic Display → App hinzufügen
3. App verifizieren + Instagram-Konto verknüpfen

### 2. Access Token generieren
1. Developer Console → Instagram Basic Display → User Token Generator
2. Token generieren → als `INSTAGRAM_ACCESS_TOKEN` speichern
3. User ID unter "User Token Generator" anzeigen → als `INSTAGRAM_USER_ID` speichern

> **Token-Gültigkeit:** 60 Tage. Token-Refresh alle 50 Tage via n8n einrichten (siehe unten).

### 3. Vercel KV einrichten
1. Vercel Dashboard → Storage → KV Database erstellen
2. "Connect to Project" → Alle KV_* Umgebungsvariablen werden automatisch gesetzt
3. Alternativ: Keys manuell in `.env.local` eintragen

### 4. Cron Secret setzen
```bash
openssl rand -hex 32
# Output als CRON_SECRET in .env.local eintragen
```

### 5. Ersten manuellen Cron-Aufruf triggern
Nach dem Deployment:
```bash
curl -H "Authorization: Bearer {CRON_SECRET}" \
  https://deine-domain.vercel.app/api/cron/refresh
```

Oder lokal (Dev Server muss laufen):
```bash
curl -H "Authorization: Bearer {CRON_SECRET}" \
  http://localhost:3000/api/cron/refresh
```

Response: `{"success":true,"posts":50,"events":3}`

### 6. Token-Refresh alle 50 Tage (n8n)
```
Trigger: Schedule (alle 50 Tage)
HTTP Request:
  Method: GET
  URL: https://graph.instagram.com/refresh_access_token
  Params:
    grant_type: ig_refresh_token
    access_token: {TOKEN}
```

---

## Inhalte pflegen

### Events
Auf Instagram posten + `#donaulifeevent` in der Caption schreiben.
→ Beim nächsten täglichen Cron (06:00 Uhr) wird der Post automatisch als Event angezeigt.

**Caption-Format für beste Darstellung:**
```
Karaoke Night 🎤
Sa, 30. Mai ab 19:00 Uhr
Die Bühne gehört euch! Komm vorbei.
#donaulifeevent #karaoke #krems
```

Manuell triggern: `GET /api/cron/refresh` (mit Authorization Header)

### Galerie
1. Foto in `/public/gallery/` ablegen (z.B. `vibes-4.jpg`)
2. Eintrag in `data/gallery.json` ergänzen:
```json
{
  "id": 13,
  "file": "vibes-4.jpg",
  "cat": "vibes",
  "caption_de": "Deine Bildunterschrift",
  "caption_en": "Your caption"
}
```
Kategorien: `vibes` | `events` | `drinks` | `cbd`

---

## Deployment auf Vercel

```bash
npm i -g vercel
vercel
```

### Environment Variables
Im Vercel Dashboard → Settings → Environment Variables alle Keys aus `.env.local` eintragen.

> **Wichtig:** `NEXT_PUBLIC_WHATSAPP_NUMBER` muss als "Client" Variable gesetzt werden.

### Pre-Deploy Checklist
```bash
npx tsc --noEmit    # TypeScript
npm run lint        # Lint
npm run build       # Build
```

---

## Architektur

```
Instagram Graph API
    ↓ (täglich 06:00 via Cron)
/api/cron/refresh
    ↓
Vercel KV
  ig:posts → /api/posts → Instagram Section
  ig:events → /api/events → Events Section
    (jeweils Fallback auf Mock-Daten wenn KV leer)

Chatbot:
  /api/chat → Anthropic Claude (oder Mock-Keywords)
  Reservation → WhatsApp wa.me Link (kein Backend nötig)

Gallery:
  data/gallery.json → direkt importiert (kein API Fetch)
  Bilder: /public/gallery/*.jpg
```

---

## Projekt-Struktur

```
donaulife-coffeeshop/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # Claude Chatbot
│   │   ├── events/route.ts         # Events aus KV / Mock
│   │   ├── posts/route.ts          # Instagram Posts aus KV / Mock
│   │   └── cron/refresh/route.ts  # Täglicher Instagram Sync
│   └── ...
├── components/
│   ├── chat/
│   │   ├── ChatWidget.tsx          # Chatbot UI + WhatsApp Flow
│   │   └── ReservationFlow.ts      # State Machine + WA URL Builder
│   └── sections/
│       ├── Gallery.tsx             # Statisch aus gallery.json
│       └── ...
├── data/
│   └── gallery.json               # Galerie-Einträge
├── lib/
│   ├── kv.ts                      # Vercel KV Wrapper
│   ├── instagram.ts               # IG API + KV Cache
│   └── ...
├── public/
│   ├── gallery/                   # Galerie-Bilder
│   └── logo.png                   # Donaulife Logo
└── vercel.json                    # Cron Schedule
```
