"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";
  delay?: number;
  threshold?: number;
  as?: "div" | "li" | "article" | "p" | "span";
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`sr sr-${animation} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
