import type { Metadata } from "next";
import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import { PageContact } from "@/components/PageContact";
import { drawings, drawingsIntro } from "@/data/site";

export const metadata: Metadata = {
  title: "Drawings",
};

export default function DrawingsPage() {
  return (
    <div className="drawings-page">
      <section className="drawings-hero">
        <Image
          src="/images/drawings/banner.png"
          alt="Drawings"
          width={1024}
          height={418}
          priority
          className="drawings-hero__img"
        />
      </section>

      <div className="drawings-body">
        <section className="drawings-intro">
          <h1 className="section-title">{drawingsIntro.heading}</h1>
          <p>{drawingsIntro.body}</p>
        </section>

        <section className="drawings-gallery wrap">
          <Gallery items={drawings} tone="mono" bare />
        </section>
      </div>

      <hr className="home-rule" />
      <PageContact />
    </div>
  );
}
