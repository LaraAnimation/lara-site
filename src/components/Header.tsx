"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";

const HERO_SELECTOR = "[data-page-hero]";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(false);

  useEffect(() => {
    setOpen(false);
    setScrolledAway(false);

    const hero = document.querySelector(HERO_SELECTOR);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide once most of the hero has scrolled off (sooner than waiting for full exit)
        setScrolledAway(entry.intersectionRatio < 0.4);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 1] },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // Keep nav visible while the mobile menu is open
  const hide = scrolledAway && !open;

  return (
    <header className={`site-header${hide ? " is-scrolled-away" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="site-logo" onClick={() => setOpen(false)}>
          {site.name}
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav ${open ? "is-open" : ""}`}>
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
