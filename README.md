# Lara Renee Renaud Animation

Simple Next.js portfolio — replacement for the Wix site.

## Live preview

GitHub Pages: https://jacobbaqleh1.github.io/lara-site/

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

1. **Copy** — edit `src/data/site.ts` (bio, film descriptions, artwork titles, email, video embed URLs).
2. **Images** — add files under `public/` (e.g. `public/hero.png`, `public/art/...`) and wire them into the pages.
3. **Films** — set each film’s `embedUrl` to a YouTube or Vimeo embed link.

## Cloudflare R2 media

Large images, `.mp3`, and `.mp4` can live in R2 instead of `public/`.

1. Copy `.env.example` → `.env.local` and fill in R2 credentials + `NEXT_PUBLIC_R2_PUBLIC_URL`.
2. Enable a public bucket URL (r2.dev) or attach a custom domain in Cloudflare.
3. Upload assets:

```bash
npm run r2:upload -- ./path/to/reel.mp4 --key films/reel-2024.mp4
npm run r2:upload -- ./public/images/paintings --prefix paintings/
```

4. Use the media helpers in components:

```tsx
import { R2Image } from "@/components/media/R2Image";
import { R2Video } from "@/components/media/R2Video";
import { r2Url } from "@/lib/media";

<R2Image src="paintings/hawaii.png" alt="Hawaii" width={800} height={600} />
<R2Video src="films/reel-2024.mp4" className="home-reel__player" />
```

`src/lib/r2.ts` is **server/CLI only** (has secrets). Browser code should only use `r2Url` / `R2Image` / `R2Video`.

## Deploy (cheap / free)

- This repo auto-deploys to GitHub Pages on every push to `main`
- For production later: connect a fork to [Cloudflare Pages](https://pages.cloudflare.com/), [Netlify](https://www.netlify.com/), or [Vercel](https://vercel.com/) and point her domain there

She only needs to pay for the domain (~$10–15/year). Hosting can be free for this site.
