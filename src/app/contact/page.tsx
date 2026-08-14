import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="simple-page" data-page-hero>
      <h1>Contact</h1>
      <div className="contact-card">
        <p style={{ margin: "0 0 0.35rem", fontWeight: 800 }}>Contact Info</p>
        <p style={{ margin: "0.2rem 0" }}>{site.contactName}</p>
        <p style={{ margin: "0.2rem 0" }}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p style={{ margin: "0.2rem 0" }}>{site.location}</p>
      </div>
    </section>
  );
}
