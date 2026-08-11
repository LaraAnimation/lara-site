"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Artwork } from "@/data/site";
import { withBasePath } from "@/lib/paths";

type GalleryProps = {
  items: Artwork[];
  tone?: "color" | "mono";
  /** Hide title/medium under thumbs (paintings page style) */
  bare?: boolean;
};

export function Gallery({ items, tone = "color", bare = false }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const active = index !== null ? items[index] : null;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight")
        setIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setIndex((i) =>
          i === null ? i : (i - 1 + items.length) % items.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length]);

  return (
    <>
      <ul className={`gallery-grid ${bare ? "gallery-grid--bare" : ""}`}>
        {items.map((item, i) => (
          <li key={item.id} className="gallery-item">
            <div className="gallery-item__frame">
              <button
                type="button"
                className={`gallery-thumb gallery-thumb--${tone} ${bare ? "gallery-thumb--bare" : ""}`}
                style={{ ["--accent" as string]: item.accent }}
                onClick={() => setIndex(i)}
              >
                {item.image ? (
                  <Image
                    src={withBasePath(item.image)}
                    alt={item.title}
                    width={600}
                    height={600}
                    className="gallery-thumb__img"
                  />
                ) : (
                  <span className="gallery-thumb__art" aria-hidden />
                )}
                {!bare && (
                  <span className="gallery-thumb__meta">
                    <strong>{item.title}</strong>
                    <span>
                      {[item.medium, item.year].filter(Boolean).join(", ")}
                    </span>
                  </span>
                )}
              </button>
              {item.cta ? (
                <Link href={item.cta.href} className="gallery-cta">
                  {item.cta.label}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {active && index !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setIndex(null)}
        >
          <div
            className={`lightbox__panel ${active.image ? "lightbox__panel--photo" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox__close"
              onClick={() => setIndex(null)}
              aria-label="Close"
            >
              ×
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              onClick={() =>
                setIndex((i) =>
                  i === null ? i : (i - 1 + items.length) % items.length,
                )
              }
              aria-label="Previous"
            >
              ‹
            </button>
            {active.image ? (
              <div className="lightbox__photo">
                <Image
                  src={withBasePath(active.image)}
                  alt={active.title}
                  width={900}
                  height={900}
                  className="lightbox__photo-img"
                />
              </div>
            ) : (
              <div
                className={`lightbox__art lightbox__art--${tone}`}
                style={{ ["--accent" as string]: active.accent }}
              />
            )}
            <div className="lightbox__copy">
              <h2>{active.title}</h2>
              <p>{[active.medium, active.year].filter(Boolean).join(" ")}</p>
              {active.cta ? (
                <p style={{ marginTop: "1rem" }}>
                  <Link
                    href={active.cta.href}
                    className="gallery-cta gallery-cta--inline"
                  >
                    {active.cta.label}
                  </Link>
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              onClick={() =>
                setIndex((i) => (i === null ? i : (i + 1) % items.length))
              }
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
