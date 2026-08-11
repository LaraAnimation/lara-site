import Image from "next/image";
import { site } from "@/data/site";

export function PageContact() {
  return (
    <section className="home-contact" id="contact-info">
      <Image
        src="/images/contact-creature.png"
        alt=""
        width={120}
        height={120}
        className="home-contact__creature"
      />
      <div className="home-contact__copy">
        <h2>Contact Info</h2>
        <p>{site.contactName}</p>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p>{site.location}</p>
      </div>
    </section>
  );
}
