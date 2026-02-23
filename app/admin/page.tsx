"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ImageSlot {
  label: string;
  filename: string | null;
  description: string;
  blobbed?: boolean;
}

type Tab = "prompt" | "images" | "ticker";

const SLOT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  hero:                 { w: 1920, h: 1080 },
  "hero-mobile":        { w: 1080, h: 1920 },
  "whyus-bg":           { w: 1920, h: 1080 },
  "ablauf-hero":        { w: 1920, h: 800  },
  "tile-einfach":       { w: 600,  h: 800  },
  "tile-sicher":        { w: 600,  h: 800  },
  "tile-unvergesslich": { w: 600,  h: 800  },
  about:                { w: 800,  h: 600  },
  "ablauf-flug":        { w: 800,  h: 600  },
  "ablauf-landing":     { w: 800,  h: 600  },
  packages:             { w: 800,  h: 600  },
  "og-image":           { w: 1200, h: 630  },
  "gallery-1":          { w: 800,  h: 800  },
  "gallery-2":          { w: 800,  h: 800  },
  "gallery-3":          { w: 800,  h: 800  },
  "gallery-4":          { w: 800,  h: 800  },
  "gallery-5":          { w: 800,  h: 800  },
  "gallery-6":          { w: 800,  h: 800  },
  "gallery-7":          { w: 800,  h: 800  },
  "gallery-8":          { w: 800,  h: 800  },
  "gallery-9":          { w: 800,  h: 800  },
  "gallery-10":         { w: 800,  h: 800  },
  "ueber-hero":         { w: 1920, h: 800  },
  "ueber-gruender":     { w: 600,  h: 800  },
  "ueber-pilot-1":      { w: 600,  h: 800  },
  "ueber-pilot-2":      { w: 600,  h: 800  },
  "ueber-pilot-3":      { w: 600,  h: 800  },
  "ueber-pilot-4":      { w: 600,  h: 800  },
};

/* ── Slot groups for organised admin display ── */
interface SlotGroup {
  page: string;
  section: string;
  slotIds: string[];
}

const SLOT_GROUPS: SlotGroup[] = [
  { page: "Startseite",  section: "Hero",                    slotIds: ["hero", "hero-mobile"] },
  { page: "Startseite",  section: "Warum wir",               slotIds: ["whyus-bg", "tile-einfach", "tile-sicher", "tile-unvergesslich"] },
  { page: "Startseite",  section: "Über uns / Warum wir",    slotIds: ["about"] },
  { page: "Startseite",  section: "Flugpakete",              slotIds: ["packages"] },
  { page: "Startseite",  section: "Bildgalerie",             slotIds: ["gallery-1", "gallery-2", "gallery-3", "gallery-4", "gallery-5", "gallery-6", "gallery-7", "gallery-8", "gallery-9", "gallery-10"] },
  { page: "Ablauf",      section: "Ablauf-Seite",            slotIds: ["ablauf-hero", "ablauf-flug", "ablauf-landing"] },
  { page: "Über Uns",    section: "Hero & Geschichte",       slotIds: ["ueber-hero", "ueber-gruender"] },
  { page: "Über Uns",    section: "Tandempiloten",           slotIds: ["ueber-pilot-1", "ueber-pilot-2", "ueber-pilot-3", "ueber-pilot-4"] },
  { page: "Allgemein",   section: "Social Media / SEO",      slotIds: ["og-image"] },
];

async function optimizeImage(file: File, slot: string): Promise<File> {
  const dim = SLOT_DIMENSIONS[slot] || { w: 1920, h: 1080 };

  const img = new window.Image();
  const url = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  URL.revokeObjectURL(url);

  let { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.min(dim.w / w, dim.h / h, 1);
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/webp", 0.82)
  );

  const name = file.name.replace(/\.[^.]+$/, ".webp");
  return new File([blob], name, { type: "image/webp" });
}

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("prompt");

  // Prompt state
  const [prompt, setPrompt] = useState("");
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  // Images state
  const [slots, setSlots] = useState<Record<string, ImageSlot>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Ticker state
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [isSavingTicker, setIsSavingTicker] = useState(false);

  // Shared message
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/admin/prompt", {
      headers: { Authorization: `Bearer ${password}` },
    });

    if (res.ok) {
      const data = await res.json();
      setAuthToken(password);
      setPrompt(data.prompt);
      setIsAuthenticated(true);
      setPassword("");
      loadImages(password);
      loadTicker(password);
    } else {
      setMessage({ type: "error", text: "Falsches Passwort." });
    }
  }

  async function loadImages(token?: string) {
    const res = await fetch("/api/admin/images", {
      headers: { Authorization: `Bearer ${token || authToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSlots(data.slots);
    }
  }

  async function loadTicker(token?: string) {
    const res = await fetch("/api/admin/ticker", {
      headers: { Authorization: `Bearer ${token || authToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTickerItems(data.items);
    }
  }

  async function handleSaveTicker() {
    setIsSavingTicker(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/ticker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ items: tickerItems }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Lauftext gespeichert!" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Speichern." });
      }
    } catch {
      setMessage({ type: "error", text: "Verbindungsfehler." });
    } finally {
      setIsSavingTicker(false);
    }
  }

  async function handleSavePrompt() {
    setIsSavingPrompt(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/prompt", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Prompt gespeichert!" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Speichern." });
      }
    } catch {
      setMessage({ type: "error", text: "Verbindungsfehler." });
    } finally {
      setIsSavingPrompt(false);
    }
  }

  async function handleUpload(slot: string, file: File) {
    setUploadingSlot(slot);
    setMessage(null);

    const optimized = await optimizeImage(file, slot);

    const formData = new FormData();
    formData.append("file", optimized);
    formData.append("slot", slot);

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Bild hochgeladen!" });
        loadImages();
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Fehler beim Hochladen.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Verbindungsfehler." });
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleDelete(slot: string) {
    setMessage(null);

    try {
      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ slot }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Bild entfernt." });
        loadImages();
      } else {
        setMessage({ type: "error", text: "Fehler beim Entfernen." });
      }
    } catch {
      setMessage({ type: "error", text: "Verbindungsfehler." });
    }
  }

  function triggerUpload(slot: string) {
    setSelectedSlot(slot);
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && selectedSlot) {
      handleUpload(selectedSlot, file);
    }
    e.target.value = "";
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center px-4">
        <div className="w-full max-w-sm glass-card rounded-2xl p-8 border border-edge-faint">
          <h1 className="text-xl font-bold text-content-strong mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full px-4 py-3 rounded-xl border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!password}
              className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-medium btn-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Anmelden
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-surface-primary px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-content-strong">
            Admin
          </h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setAuthToken("");
              setPrompt("");
              setSlots({});
              router.push("/");
            }}
            className="px-4 py-2 rounded-xl border border-edge-default text-content-muted hover:text-content-strong hover:border-edge-secondary transition-colors text-sm"
          >
            Abmelden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 glass-card rounded-xl border border-edge-faint w-fit">
          <button
            onClick={() => { setActiveTab("prompt"); setMessage(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "prompt"
                ? "bg-accent-500 text-white"
                : "text-content-muted hover:text-content-strong"
            }`}
          >
            ChatBot Prompt
          </button>
          <button
            onClick={() => { setActiveTab("images"); setMessage(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "images"
                ? "bg-accent-500 text-white"
                : "text-content-muted hover:text-content-strong"
            }`}
          >
            Bilder
          </button>
          <button
            onClick={() => { setActiveTab("ticker"); setMessage(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "ticker"
                ? "bg-accent-500 text-white"
                : "text-content-muted hover:text-content-strong"
            }`}
          >
            Lauftext
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={onFileSelected}
          className="hidden"
        />

        {/* Prompt Tab */}
        {activeTab === "prompt" && (
          <div className="glass-card rounded-2xl p-6 border border-edge-faint">
            <label className="block text-sm font-medium text-content-body mb-2">
              System-Prompt
            </label>
            <p className="text-xs text-content-muted mb-4">
              Dieser Prompt definiert die Persönlichkeit und das Wissen des
              ChatBots. Änderungen werden sofort wirksam.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={24}
              className="w-full px-4 py-3 rounded-xl border border-edge-input bg-surface-input text-content-strong text-sm leading-relaxed font-mono placeholder:text-content-placeholder focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-colors resize-y"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-content-muted">
                {prompt.length} Zeichen
              </p>
              <button
                onClick={handleSavePrompt}
                disabled={isSavingPrompt}
                className="px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-medium btn-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isSavingPrompt ? "Speichern..." : "Prompt speichern"}
              </button>
            </div>
          </div>
        )}

        {/* Images Tab – grouped by page & section */}
        {activeTab === "images" && (
          <div className="space-y-6">
            <p className="text-xs text-content-muted">
              Lade Bilder hoch und weise sie einer Position auf der Website zu.
              Bilder werden automatisch in WebP konvertiert und auf die optimale Gr&ouml;&szlig;e skaliert.
            </p>

            {(() => {
              /* Group sections by page */
              const pages = SLOT_GROUPS.reduce<Record<string, SlotGroup[]>>((acc, g) => {
                (acc[g.page] ??= []).push(g);
                return acc;
              }, {});

              return Object.entries(pages).map(([pageName, sections]) => (
                <div key={pageName} className="space-y-4">
                  {/* Page heading */}
                  <div className="flex items-center gap-3 pt-2">
                    <h2 className="text-base font-bold text-content-strong whitespace-nowrap">
                      {pageName}
                    </h2>
                    <div className="flex-1 h-px bg-edge-faint" />
                  </div>

                  {sections.map((group) => (
                    <details key={group.section} className="glass-card rounded-2xl border border-edge-faint group" open>
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-content-strong">
                            {group.section}
                          </h3>
                          <span className="text-[11px] text-content-muted bg-surface-secondary px-2 py-0.5 rounded-full">
                            {group.slotIds.filter((id) => slots[id]?.filename).length}/{group.slotIds.length}
                          </span>
                        </div>
                        <svg className="w-4 h-4 text-content-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>

                      <div className="px-5 pb-5 space-y-3">
                        {group.slotIds.map((slotId) => {
                          const slot = slots[slotId];
                          if (!slot) return null;
                          return (
                            <div key={slotId} className="rounded-xl border border-edge-faint bg-surface-secondary/50 p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-content-strong truncate">
                                    {slot.label}
                                  </h4>
                                  <p className="text-xs text-content-muted mt-0.5">
                                    {slot.description}
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => triggerUpload(slotId)}
                                    disabled={uploadingSlot === slotId}
                                    className="px-3 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium disabled:opacity-40 transition-all"
                                  >
                                    {uploadingSlot === slotId
                                      ? "L\u00e4dt..."
                                      : slot.filename
                                        ? "Ersetzen"
                                        : "Hochladen"}
                                  </button>
                                  {slot.filename && (
                                    <button
                                      onClick={() => handleDelete(slotId)}
                                      className="px-3 py-1.5 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs font-medium transition-all"
                                    >
                                      Entfernen
                                    </button>
                                  )}
                                </div>
                              </div>
                              {slot.filename && (
                                <div className="mt-3">
                                  <img
                                    src={slot.blobbed ? `/api/images/${slotId}?v=${slot.filename?.match(/-(\d+)\./)?.[1] || ""}` : `/images/${slot.filename}`}
                                    alt={slot.label}
                                    className="rounded-lg border border-edge-faint max-h-40 object-cover w-full"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              ));
            })()}
          </div>
        )}

        {/* Ticker Tab */}
        {activeTab === "ticker" && (
          <div className="glass-card rounded-2xl p-6 border border-edge-faint">
            <label className="block text-sm font-medium text-content-body mb-2">
              Lauftext-Eintr&auml;ge
            </label>
            <p className="text-xs text-content-muted mb-4">
              Jede Zeile wird als eigener Eintrag angezeigt, getrennt durch &bdquo;|&ldquo;.
              Die Eintr&auml;ge scrollen automatisch &uuml;ber die Seite.
            </p>

            <div className="space-y-3">
              {tickerItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...tickerItems];
                      updated[i] = e.target.value;
                      setTickerItems(updated);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-edge-input bg-surface-input text-content-strong text-sm placeholder:text-content-placeholder focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-colors"
                  />
                  <button
                    onClick={() => {
                      setTickerItems(tickerItems.filter((_, j) => j !== i));
                    }}
                    className="px-3 py-2 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs font-medium transition-all shrink-0"
                    aria-label="Eintrag entfernen"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTickerItems([...tickerItems, ""])}
              className="mt-4 px-4 py-2 rounded-lg border border-edge-default text-content-muted hover:text-content-strong hover:border-edge-secondary transition-colors text-sm"
            >
              + Eintrag hinzuf&uuml;gen
            </button>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-edge-faint">
              <p className="text-xs text-content-muted">
                {tickerItems.filter((t) => t.trim()).length} Eintr&auml;ge
              </p>
              <button
                onClick={handleSaveTicker}
                disabled={isSavingTicker}
                className="px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-medium btn-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isSavingTicker ? "Speichern..." : "Lauftext speichern"}
              </button>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
