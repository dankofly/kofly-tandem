"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import type { InstagramReel } from "@/lib/instagram";

export default function InstagramCarousel({ reels }: { reels: InstagramReel[] }) {
  const t = useTranslations("Instagram");
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ig-card");
    const w = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  return (
    <section className="relative py-20 lg:py-28 bg-surface-secondary overflow-hidden scroll-mt-20">
      {/* Glow orb */}
      <div
        className="glow-orb glow-orb-accent w-[400px] h-[400px] top-0 right-0 animate-glow-pulse"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-medium">
            {t("tagline")}
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm text-content-muted font-light">
            {t("followUs")}{" "}
            <a
              href="https://www.instagram.com/tandemfluglienz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-500 transition-colors"
            >
              @tandemfluglienz
            </a>
          </p>
          <div className="mt-6 section-divider" />
        </ScrollReveal>

        {/* Carousel wrapper */}
        <ScrollReveal animation="fade-in" delay={150} className="relative">
          {/* Navigation arrows */}
          <button
            onClick={() => scroll(-1)}
            aria-label={t("scrollBack")}
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-edge-subtle bg-surface-primary/80 backdrop-blur-sm items-center justify-center text-content-subtle hover:text-content-primary hover:border-accent-500/50 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label={t("scrollForward")}
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-edge-subtle bg-surface-primary/80 backdrop-blur-sm items-center justify-center text-content-subtle hover:text-content-primary hover:border-accent-500/50 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable track */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 px-6 scrollbar-hide"
          >
            {reels.map((reel) => (
              <a
                key={reel.id}
                href={reel.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-card group flex-shrink-0 w-[260px] sm:w-[280px] snap-start rounded-2xl overflow-hidden border border-edge-faint relative aspect-[9/16]"
              >
                {/* Background: thumbnail or gradient */}
                {reel.thumbnailUrl ? (
                  <Image
                    src={reel.thumbnailUrl}
                    alt={reel.caption || "Instagram Reel"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="280px"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Instagram logo top-left */}
                <div className="absolute top-4 left-4">
                  <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>

                {/* Reels icon top-right */}
                <div className="absolute top-4 right-4">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>

                {/* Play button center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Caption bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-white font-medium leading-snug line-clamp-2">
                    {reel.caption}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/60 font-medium">
                    {t("viewOnInstagram")}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
