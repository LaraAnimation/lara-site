import type { Metadata } from "next";
import Image from "next/image";
import { PageContact } from "@/components/PageContact";
import { aboutBio, aboutCv } from "@/data/site";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-top" data-page-hero>
        <div className="about-top__inner">
          <div className="about-portrait">
            <Image
              src={withBasePath("/images/about/portrait.png")}
              alt="Portrait of Lara Renaud"
              width={720}
              height={1024}
              priority
              className="about-portrait__img"
            />
          </div>
          <div className="about-bio">
            <h1>{aboutBio.name}</h1>
            {aboutBio.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cv">
        <div className="about-cv__card">
          <h2 className="about-cv__title">{aboutCv.title}</h2>

          <h3 className="about-cv__heading">Schools &amp; Education</h3>
          <ul className="about-cv__list">
            {aboutCv.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="about-cv__heading">Shows and Exhibitions</h3>
          <ul className="about-cv__list">
            {aboutCv.exhibitions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="about-cv__heading">
            Film Festivals &amp; Honorable Mentions
          </h3>
          {aboutCv.festivals.map((film) => (
            <div key={film.title} className="about-cv__film">
              <p className="about-cv__film-title">
                <strong>{film.title}</strong>
                <span>{film.credit}</span>
              </p>
              <ul className="about-cv__list about-cv__list--tight">
                {film.entries.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3 className="about-cv__heading">Published Books</h3>
          {aboutCv.books.map((book) => (
            <p key={book.title} className="about-cv__book">
              {book.title}
              <span>{book.credit}</span>
            </p>
          ))}
        </div>
      </section>

      <hr className="home-rule" />
      <PageContact />
    </div>
  );
}
