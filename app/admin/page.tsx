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

    const formData = new FormData();
    formData.append("file", file);
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

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-4">
            <p className="text-xs text-content-muted">
              Lade Bilder hoch und weise sie einer Position auf der Website zu.
              Erlaubt: JPG, PNG, WebP, AVIF (max. 5 MB).
            </p>

            {Object.entries(slots).map(([slotId, slot]) => (
              <div
                key={slotId}
                className="glass-card rounded-2xl p-5 border border-edge-faint"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-content-strong">
                      {slot.label}
                    </h3>
                    <p className="text-xs text-content-muted mt-1">
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
                        ? "Lädt..."
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

                {/* Image preview */}
                {slot.filename && (
                  <div className="mt-4">
                    <img
                      src={slot.blobbed ? `/api/images/${slotId}?v=${slot.filename?.match(/-(\d+)\./)?.[1] || ""}` : `/images/${slot.filename}`}
                      alt={slot.label}
                      className="rounded-xl border border-edge-faint max-h-48 object-cover w-full"
                    />
                  </div>
                )}
              </div>
            ))}
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
