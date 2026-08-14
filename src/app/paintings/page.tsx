import type { Metadata } from "next";
import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import { PageContact } from "@/components/PageContact";
import { paintings, paintingsIntro } from "@/data/site";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Paintings",
};

export default function PaintingsPage() {
  return (
    <div className="paintings-page">
      <section className="paintings-hero" data-page-hero>
        <Image
          src={withBasePath("/images/paintings/banner.png")}
          alt="Paintings"
          width={1200}
          height={675}
          priority
          className="paintings-hero__img"
        />
      </section>

      <div className="paintings-body">
        <section className="paintings-intro">
          <h1 className="section-title">{paintingsIntro.heading}</h1>
          <p>{paintingsIntro.body}</p>
        </section>

        <section className="paintings-gallery wrap">
          <Gallery items={paintings} tone="color" bare />
        </section>
      </div>

      <hr className="home-rule" />
      <PageContact />
    </div>
  );
}
