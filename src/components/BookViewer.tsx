"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { withBasePath } from "@/lib/paths";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type BookViewerProps = {
  src: string;
  title: string;
  onClose: () => void;
};

type FlipBookApi = {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
};

export function BookViewer({ src, title, onClose }: BookViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dims, setDims] = useState({ width: 380, height: 500 });
  const bookRef = useRef<FlipBookApi | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setReady(false);
      setError(null);
      setPages([]);
      setProgress(0);
      setCurrentPage(0);

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = withBasePath(
          "/pdf.worker.min.mjs",
        );

        const doc = await pdfjs.getDocument({ url: withBasePath(src) }).promise;
        if (cancelled) return;

        const urls: string[] = [];
        const total = doc.numPages;
        const viewportCap =
          typeof window !== "undefined"
            ? Math.min(860, Math.max(480, window.innerWidth * 0.4))
            : 520;

        for (let i = 1; i <= total; i++) {
          const pdfPage = await doc.getPage(i);
          if (cancelled) return;

          const base = pdfPage.getViewport({ scale: 1 });
          const scale = viewportCap / base.width;
          const viewport = pdfPage.getViewport({ scale });

          if (i === 1 && !cancelled) {
            const maxSingle =
              typeof window !== "undefined"
                ? Math.min(
                    Math.round(viewport.width),
                    window.innerWidth < 720
                      ? window.innerWidth - 56
                      : Math.floor(window.innerWidth * 0.42),
                  )
                : Math.round(viewport.width);
            const width = Math.max(240, maxSingle);
            const height = Math.max(
              300,
              Math.min(
                Math.round(width * (viewport.height / viewport.width)),
                typeof window !== "undefined"
                  ? Math.floor(window.innerHeight * 0.72)
                  : Math.round(viewport.height),
              ),
            );
            setDims({ width, height });
          }

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas unsupported");

          await pdfPage
            .render({
              canvasContext: ctx,
              canvas,
              viewport,
            })
            .promise;

          urls.push(canvas.toDataURL("image/jpeg", 0.88));
          if (cancelled) return;
          setProgress(Math.round((i / total) * 100));
        }

        if (!cancelled) {
          setPages(urls);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setError("Couldn't open the book. Please try again.");
          setReady(false);
        }
      }
    }

    void loadPdf();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev();
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, flipPrev, flipNext]);

  const pageCount = pages.length;
  const pageLabel =
    pageCount <= 1
      ? pageCount === 1
        ? "1 / 1"
        : ""
      : `${Math.min(currentPage + 1, pageCount)}–${Math.min(currentPage + 2, pageCount)} / ${pageCount}`;

  return (
    <div
      className="book-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="book-viewer__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="book-viewer__close"
          onClick={onClose}
          aria-label="Close book"
        >
          ×
        </button>

        <header className="book-viewer__header">
          <h2>{title}</h2>
          <p>Illustrated by Lara · flip the pages to read</p>
        </header>

        {error ? (
          <p className="book-viewer__status book-viewer__status--error">
            {error}
          </p>
        ) : null}

        {!ready && !error ? (
          <p className="book-viewer__status" aria-live="polite">
            Opening the book… {progress > 0 ? `${progress}%` : ""}
          </p>
        ) : null}

        {ready && pages.length > 0 ? (
          <div className="book-viewer__stage">
            <button
              type="button"
              className="book-viewer__nav book-viewer__nav--prev"
              onClick={flipPrev}
              aria-label="Previous page"
              disabled={currentPage <= 0}
            >
              ‹
            </button>

            <HTMLFlipBook
              ref={bookRef}
              className="book-viewer__flip"
              style={{ margin: "0 auto" }}
              width={dims.width}
              height={dims.height}
              size="stretch"
              minWidth={240}
              maxWidth={dims.width}
              minHeight={300}
              maxHeight={dims.height}
              showCover
              mobileScrollSupport
              usePortrait
              drawShadow
              maxShadowOpacity={0.35}
              flippingTime={700}
              useMouseEvents
              showPageCorners
              startPage={0}
              startZIndex={0}
              autoSize
              clickEventForward
              swipeDistance={30}
              disableFlipByClick={false}
              onFlip={(e: { data: number }) => setCurrentPage(e.data)}
            >
              {pages.map((url, i) => (
                <div
                  className="book-viewer__page"
                  key={`${title}-${i}`}
                  data-density="soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Page ${i + 1} of ${title}`}
                    draggable={false}
                  />
                </div>
              ))}
            </HTMLFlipBook>

            <button
              type="button"
              className="book-viewer__nav book-viewer__nav--next"
              onClick={flipNext}
              aria-label="Next page"
              disabled={currentPage >= Math.max(0, pageCount - 1)}
            >
              ›
            </button>
          </div>
        ) : null}

        {ready && pageCount > 0 ? (
          <p className="book-viewer__pager" aria-live="polite">
            {pageLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
