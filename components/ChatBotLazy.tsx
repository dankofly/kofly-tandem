"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false, loading: () => null });

export default function ChatBotLazy() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = () => setShouldLoad(true);

    // Trigger 1: Nach Idle (hauptsächlich für Desktop mit guter Verbindung)
    const hasIdleCallback = "requestIdleCallback" in window;
    const idleHandle: number = hasIdleCallback
      ? window.requestIdleCallback(trigger, { timeout: 3000 })
      : window.setTimeout(trigger, 2000);

    // Trigger 2: Erste User-Interaktion (Scroll, Touch, Klick, Keyboard)
    const events: (keyof WindowEventMap)[] = ["scroll", "pointerdown", "keydown", "touchstart"];
    const onInteraction = () => {
      setShouldLoad(true);
      events.forEach((e) => window.removeEventListener(e, onInteraction));
    };
    events.forEach((e) => window.addEventListener(e, onInteraction, { passive: true, once: true }));

    // Trigger 3: Listen for explicit Header-Button click (open-chat event)
    const onOpenChat = () => setShouldLoad(true);
    window.addEventListener("open-chat", onOpenChat);

    return () => {
      if (hasIdleCallback) {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
      events.forEach((e) => window.removeEventListener(e, onInteraction));
      window.removeEventListener("open-chat", onOpenChat);
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;
  return <ChatBot />;
}
