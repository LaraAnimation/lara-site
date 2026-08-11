import type { Metadata } from "next";
import Image from "next/image";
import { FilmBlock } from "@/components/FilmBlock";
import { PageContact } from "@/components/PageContact";
import { films } from "@/data/site";

export const metadata: Metadata = {
  title: "Films",
};

export default function FilmsPage() {
  return (
    <div className="films-page">
      <section className="films-banner">
        <Image
          src="/images/films/banner.png"
          alt="Animation & Film"
          width={1200}
          height={675}
          priority
          className="films-banner__img"
        />
      </section>

      <div className="films-list">
        {films.map((film, i) => (
          <div key={film.id}>
            {i > 0 ? <hr className="home-rule films-rule" /> : null}
            <FilmBlock film={film} />
          </div>
        ))}
      </div>

      <hr className="home-rule" />
      <PageContact />
    </div>
  );
}
