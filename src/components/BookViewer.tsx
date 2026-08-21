"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { withBasePath } from "@/lib/paths";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const NARROW_BREAKPOINT = 720;

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

type PageDims = {
  width: number;
  height: number;
};

function measureViewport() {
  if (typeof window === "undefined") {
    return { width: 1024, height: 768 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

/** Fit one page into the modal stage; on phones fill nearly the full viewport. */
function computePageDims(
  aspect: number,
  viewport: { width: number; height: number },
): PageDims {
  const narrow = viewport.width < NARROW_BREAKPOINT;
  const chromeY = narrow ? 140 : 168;
  const chromeX = narrow ? 64 : 120;
  const maxW = Math.max(200, viewport.width - chromeX);
  const maxH = Math.max(260, viewport.height - chromeY);

  if (narrow) {
    let width = maxW;
    let height = Math.round(width / aspect);
    if (height > maxH) {
      height = maxH;
      width = Math.round(height * aspect);
    }
    return {
      width: Math.max(200, width),
      height: Math.max(260, height),
    };
  }

  const width = Math.min(
    Math.round(maxW * 0.46),
    Math.floor(viewport.width * 0.42),
    420,
  );
  const height = Math.min(Math.round(width / aspect), maxH);
  return {
    width: Math.max(260, width),
    height: Math.max(320, height),
  };
}

export function BookViewer({ src, title, onClose }: BookViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isNarrow, setIsNarrow] = useState(
    () => measureViewport().width < NARROW_BREAKPOINT,
  );
  const [singlePage, setSinglePage] = useState(
    () => measureViewport().width < NARROW_BREAKPOINT,
  );
  const [layoutKey, setLayoutKey] = useState("init");
  const [dims, setDims] = useState<PageDims>({ width: 380, height: 500 });
  const [viewportWidth, setViewportWidth] = useState(
    () => measureViewport().width,
  );
  const bookRef = useRef<FlipBookApi | null>(null);
  const aspectRef = useRef(0.76);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const applyLayout = () => {
      const vp = measureViewport();
      const next = computePageDims(aspectRef.current, vp);
      const narrow = vp.width < NARROW_BREAKPOINT;
      setViewportWidth(vp.width);
      setDims(next);
      setIsNarrow(narrow);
      setSinglePage(narrow);
      // react-pageflip only reads size props on mount — remount on layout changes
      setLayoutKey(`${narrow ? "n" : "w"}-${next.width}x${next.height}`);
    };

    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(applyLayout, 120);
    };

    applyLayout();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
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
        const vp = measureViewport();
        const dpr =
          typeof window !== "undefined"
            ? Math.min(2.5, window.devicePixelRatio || 1)
            : 1;
        // Sharp enough for a full-width phone page (not half a desktop spread).
        const viewportCap = Math.min(
          1100,
          Math.max(
            560,
            vp.width * (vp.width < NARROW_BREAKPOINT ? 1.2 : 0.55) * dpr,
          ),
        );

        for (let i = 1; i <= total; i++) {
          const pdfPage = await doc.getPage(i);
          if (cancelled) return;

          const base = pdfPage.getViewport({ scale: 1 });
          const scale = viewportCap / base.width;
          const pageViewport = pdfPage.getViewport({ scale });

          if (i === 1 && !cancelled) {
            const aspect = base.width / base.height;
            aspectRef.current = aspect;
            const size = computePageDims(aspect, vp);
            const narrow = vp.width < NARROW_BREAKPOINT;
            setViewportWidth(vp.width);
            setDims(size);
            setIsNarrow(narrow);
            setSinglePage(narrow);
            setLayoutKey(`${narrow ? "n" : "w"}-${size.width}x${size.height}`);
          }

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(pageViewport.width);
          canvas.height = Math.floor(pageViewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas unsupported");

          await pdfPage
            .render({
              canvasContext: ctx,
              canvas,
              viewport: pageViewport,
            })
            .promise;

          urls.push(canvas.toDataURL("image/jpeg", 0.9));
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

  // Force portrait in stretch mode when blockWidth < minWidth * 2.
  const minWidth = isNarrow
    ? Math.max(dims.width, Math.ceil(viewportWidth * 0.55))
    : 240;

  const pageCount = pages.length;
  const pageLabel = (() => {
    if (pageCount <= 0) return "";
    if (pageCount === 1 || singlePage) {
      return `${Math.min(currentPage + 1, pageCount)} / ${pageCount}`;
    }
    return `${Math.min(currentPage + 1, pageCount)}–${Math.min(currentPage + 2, pageCount)} / ${pageCount}`;
  })();

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
              key={layoutKey}
              ref={bookRef}
              className="book-viewer__flip"
              style={{ margin: "0 auto" }}
              width={dims.width}
              height={dims.height}
              size={isNarrow ? "fixed" : "stretch"}
              minWidth={minWidth}
              maxWidth={dims.width}
              minHeight={Math.min(260, dims.height)}
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
              onInit={(e: { data: { page?: number; mode?: string } }) => {
                const mode = e?.data?.mode;
                if (mode === "portrait" || mode === "landscape") {
                  setSinglePage(mode === "portrait");
                }
              }}
              onChangeOrientation={(e: { data: string }) => {
                setSinglePage(e.data === "portrait");
              }}
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
