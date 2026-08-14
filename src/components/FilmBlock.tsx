import Image from "next/image";
import type { FilmEntry } from "@/data/site";
import { R2Video } from "@/components/media/R2Video";
import { withBasePath } from "@/lib/paths";

export type { FilmEntry };

type FilmBlockProps = {
  film: FilmEntry;
};

export function FilmBlock({ film }: FilmBlockProps) {
  const media = (
    <div className="films-media">
      {film.videoSrc ? (
        <R2Video
          src={film.videoSrc}
          className="films-media__video"
          aria-label={film.title}
        />
      ) : film.embedUrl ? (
        <iframe
          src={film.embedUrl}
          title={film.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="films-media__placeholder">
          <span className="films-media__play" aria-hidden>
            ▶
          </span>
          <strong>{film.thumbnailLabel}</strong>
          <span className="films-media__hint">Add embed URL when ready</span>
        </div>
      )}
    </div>
  );

  const copy = (
    <div className="films-copy">
      <h2 className="films-copy__title">
        {film.title}
        {film.titleNote ? (
          <span className="films-copy__note"> {film.titleNote}</span>
        ) : null}
      </h2>
      <div className="films-copy__pill">
        <p>{film.description}</p>
      </div>
    </div>
  );

  return (
    <article className={`films-block ${film.reverse ? "is-reverse" : ""}`}>
      <div className="films-block__main">
        {film.reverse ? (
          <>
            {copy}
            {media}
          </>
        ) : (
          <>
            {media}
            {copy}
          </>
        )}
      </div>

      {(film.festivals?.length ||
        film.laurels?.length ||
        film.laurelsImage) && (
        <div
          className={`films-block__meta ${film.reverse ? "is-reverse" : ""}`}
        >
          {film.festivals && film.festivals.length > 0 && (
            <ul className="films-festivals">
              {film.festivals.map((f) => (
                <li key={f.label}>
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener noreferrer">
                      {f.label}
                    </a>
                  ) : (
                    <span className="films-festivals__label">{f.label}</span>
                  )}
                  <span className="films-festivals__detail">({f.detail})</span>
                </li>
              ))}
            </ul>
          )}

          {film.laurels && film.laurels.length > 0 ? (
            <ul
              className="films-laurels"
              aria-label={`${film.title} festival selections`}
            >
              {film.laurels.map((src) => (
                <li key={src}>
                  <Image
                    src={withBasePath(src)}
                    alt=""
                    width={280}
                    height={180}
                    className="films-laurels__img"
                  />
                </li>
              ))}
            </ul>
          ) : film.laurelsImage ? (
            <div className="films-laurels-strip">
              <Image
                src={withBasePath(film.laurelsImage)}
                alt={film.laurelsAlt || `${film.title} festival selections`}
                width={900}
                height={360}
                className="films-laurels-strip__img"
              />
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
