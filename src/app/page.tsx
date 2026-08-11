import Image from "next/image";
import { PageContact } from "@/components/PageContact";
import { homeIntro, reelEmbedUrl, site } from "@/data/site";
import { withBasePath } from "@/lib/paths";

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero">
        <h1 className="home-hero__title">{site.displayName}</h1>
        <div className="home-hero__art">
          <Image
            src={withBasePath("/images/hero-collage.png")}
            alt="Whimsical character collage by Lara Renaud"
            width={1200}
            height={900}
            priority
            className="home-hero__img"
          />
        </div>
      </section>

      <section className="home-intro">
        <div className="home-intro__portrait">
          <Image
            src={withBasePath("/images/portrait.png")}
            alt="Portrait illustration of Lara Renaud"
            width={280}
            height={280}
            className="home-intro__portrait-img"
          />
        </div>
        <p className="home-intro__tagline">{site.tagline}</p>
        <div className="home-intro__card">
          <p>{homeIntro}</p>
        </div>
      </section>

      <section className="home-reel">
        <h2 className="home-reel__title">Reel • 2024</h2>
        <div className="home-reel__player">
          {reelEmbedUrl ? (
            <iframe
              src={reelEmbedUrl}
              title="Lara Renaud Reel 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="home-reel__placeholder">
              <span className="home-reel__play" aria-hidden>
                ▶
              </span>
              <p>Lara Renaud Reel 2024</p>
              <p className="home-reel__hint">
                Add embed URL in <code>src/data/site.ts</code> →{" "}
                <code>reelEmbedUrl</code>
              </p>
            </div>
          )}
        </div>
      </section>

      <hr className="home-rule" />
      <PageContact />
    </div>
  );
}
