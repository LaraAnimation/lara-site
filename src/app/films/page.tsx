import type { Metadata } from "next";
import Image from "next/image";
import { FilmBlock } from "@/components/FilmBlock";
import { PageContact } from "@/components/PageContact";
import { films } from "@/data/site";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Films",
};

export default function FilmsPage() {
  return (
    <div className="films-page">
      <section className="films-banner" data-page-hero>
        <div className="films-banner__media">
          <Image
            src={withBasePath("/images/films/banner.png")}
            alt="Animation & Film"
            width={1442}
            height={600}
            priority
            className="films-banner__img"
          />
        </div>
      </section>

      <div className="films-body">
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
    </div>
  );
}
