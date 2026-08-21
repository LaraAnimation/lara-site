import { r2PosterUrl, r2Url } from "@/lib/media";

export const site = {
  name: "Lara Renee Renaud Animation",
  displayName: "Lara Renee Renaud Animation",
  brandShort: "LaraReneeRenaudAnimation",
  tagline: "Creative • Eclectic • Passionate • Fun",
  email: "lararrenaud@gmail.com",
  phone: "503-915-6889",
  location: "Portland OR",
  contactName: "Lara Renaud",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/films", label: "Films" },
  { href: "/paintings", label: "Paintings" },
  { href: "/drawings", label: "Drawings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const homeIntro =
  "LaraRenéeRenaudAnimation offers professional creative solutions for a wide range of animation projects. Animator Lara Renaud specializes in creating stylized animations that are captivating, whimsical, unique, and larger than life. She provides exceptional services that include 2D animation, character animation, motion graphics, visual effects, cell animation, video editing, digital puppet rigging, and more. A recent college grad, Lara has a portfolio of published and unpublished work that includes, animation, illustration and fine art. She is at all times professional, efficient, conscientious, and versatile in her work approach.";

export type FestivalLink = {
  label: string;
  detail: string;
  href?: string;
};

export type FilmEntry = {
  id: string;
  title: string;
  titleNote?: string;
  description: string;
  /** YouTube/Vimeo iframe embed URL */
  embedUrl?: string;
  /** R2 key or full public URL for HTML5 video */
  videoSrc?: string;
  /** R2 key or URL for poster/thumbnail image (shown before play) */
  posterSrc?: string;
  thumbnailLabel: string;
  /** media on left when false; media on right when true */
  reverse?: boolean;
  festivals?: FestivalLink[];
  laurelsImage?: string;
  laurelsAlt?: string;
  laurels?: string[];
};

/** YouTube/Vimeo embed URL (optional). Prefer `reelVideoSrc` for R2-hosted files. */
export const reelEmbedUrl = "";

/** R2 object key or full public URL for the home / films reel */
export const reelVideoSrc = r2Url("films/reel-2024-update3.mp4");

/** Poster for the home / films reel (generate with scripts/generate-video-posters.ts) */
export const reelPosterSrc = r2PosterUrl("films/reel-2024-update3.mp4");

export const films: FilmEntry[] = [
  {
    id: "the-household",
    title: "The Household",
    description:
      "Senior thesis project - a culmination of animation, video, sound. This emotional, storytelling piece leads the viewer through an abstract world depicting the trauma experienced by a little girl in a family tormented by alcoholism.",
    videoSrc: r2Url("films/the-household.mp4"),
    posterSrc: r2PosterUrl("films/the-household.mp4"),
    thumbnailLabel: "The Household",
  },
  {
    id: "the-escape",
    title: "The Escape",
    description:
      "Junior film - a precursor to 'The HouseHold'. A personal project that grew out of life experiences and explored themes such as anxiety, trauma, depression and coping. An experimental piece, Lara explored different digital aesthetics and styles.",
    videoSrc: r2Url("films/the-escape.mp4"),
    posterSrc: r2PosterUrl("films/the-escape.mp4"),
    thumbnailLabel: "THE ESCAPE",
    reverse: true,
  },
  {
    id: "merry",
    title: "Merry",
    description:
      "Merry, 2022, is animated and co-directed by Lara Renaud and Quinn Kelly. Quinn Kelly is also responsible for sound design. The Poet Laurette of Vancouver BC 2022, Fiona Tinwei Lam wrote, narrated, commissioned, co-directed, and produced this film. Merry discusses plastic consumption and toxic consumerist culture around Christmas time.",
    videoSrc: r2Url("films/merry.mp4"),
    posterSrc: r2PosterUrl("films/merry.mp4"),
    thumbnailLabel: "Merry",
    festivals: [
      {
        label: "Ó Bhéal’s 10th Winter Warmer Poetry festival",
        detail: "Cork, Ireland, Nov 27, 2022 and available online afterward",
      },
      {
        label: "HECare Film Festival (Human-Environment Care Film Festival HECFF)",
        detail: "Toronto, Ontario, Dec 16, 2022",
      },
      {
        label: "REEL poetry/Houston TX 2023 International Festival",
        detail: "Houston, TX Feb 23-26, 2023",
      },
      {
        label: "International Poetry Film Festival",
        detail: "Beyond Baroque, Venice, CA, April 28, 2023",
      },
      {
        label: "International Migration and Environmental Film Festival IMEFF",
        detail: "Online Toronto, Ontario, June 5-11, 2023",
      },
    ],
    laurels: [
      "/images/films/laurels/poetry-la-2023.png",
      "/images/films/laurels/obheal-2022.png",
      "/images/films/laurels/reelpoetry-houston-2023.png",
      "/images/films/laurels/so-limitless-2024.png",
      "/images/films/laurels/hecare-2022.png",
      "/images/films/laurels/imeff-2023.png",
    ],
  },
  {
    id: "un-write",
    title: "Un/Write",
    description:
      "Un/Write, 2023, animated and co-directed by Lara Renaud and Quinn Kelly. Sound design also by Quinn Kelly. Written, commissioned, produced, vocalized and co-directed by the Poet Laureate of Vancouver BC, Fiona Tinwei Lam. This poetry film celebrates the idea of the deterioration and construction of creativity.",
    videoSrc: r2Url("films/un-write.mp4"),
    posterSrc: r2PosterUrl("films/un-write.mp4"),
    thumbnailLabel: "Un/Write",
    reverse: true,
    festivals: [
      {
        label: "JÁ Fest 2023, International Poetry Film Competition",
        detail: "Lisbon, Portugal, April 13, 2023",
      },
      {
        label: "Aotearoa Poetry Film Festival",
        detail: "Wellington, New Zealand, November 2, 2023",
      },
      {
        label: "Nature & Culture Festival",
        detail: "Copenhagen, Denmark, November 20-30, 2023",
      },
      {
        label: "REEL poetry Houston",
        detail: "Houston, Texas, April 1-7, 2024",
      },
    ],
    laurels: [
      "/images/films/laurels/resonans-2023.png",
      "/images/films/laurels/reelpoetry-houston-2024.png",
      "/images/films/laurels/midwest-video-poetry-2023.png",
      "/images/films/laurels/obheal-2024.png",
      "/images/films/laurels/ja-lisbon-2023.png",
      "/images/films/laurels/aotearoa-2023.png",
      "/images/films/laurels/imeff-2023.png",
    ],
  },
  {
    id: "reel",
    title: "Reel",
    description:
      "This is a reel sharing Lara Renaud's animations created from 2020-2024.",
    videoSrc: reelVideoSrc,
    posterSrc: reelPosterSrc,
    thumbnailLabel: "Lara Renaud Reel 2024",
  },
  {
    id: "paradox",
    title: "Paradox",
    titleNote: "(Performed by Orchid Tooth)",
    description:
      "This is a live music video shot by the Video & Sound class of PNCA 2022. Each student then took the footage to create their own edits, this is Lara's. Lara also operated camera 1. (Worms eye close up shots)",
    videoSrc: r2Url("films/paradox.mp4"),
    posterSrc: r2PosterUrl("films/paradox.mp4"),
    thumbnailLabel: "ORCHID TOOTH — PARADOX",
    reverse: true,
  },
];

export type Artwork = {
  id: string;
  title: string;
  medium: string;
  year: string;
  accent: string;
  image?: string;
  /** Optional illustrated book PDF — opens a flip-through viewer on click */
  bookSrc?: string;
  /** Optional CTA overlay on the thumbnail (e.g. Let's Talk) */
  cta?: { label: string; href?: string };
};

export const paintings: Artwork[] = [
  {
    id: "day-trip-in-portland",
    title: "Day Trip in Portland",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#7ac74f",
    image: "/images/paintings/day-trip-in-portland.png",
  },
  {
    id: "starry-night-table",
    title: "Starry Night Table",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#3d4a8a",
    image: "/images/paintings/starry-night-table.png",
  },
  {
    id: "pacific-city",
    title: "Pacific City",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#c45c26",
    image: "/images/paintings/pacific-city.png",
  },
  {
    id: "stuck",
    title: "Stuck",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#2f6b4f",
    image: "/images/paintings/stuck.png",
  },
  {
    id: "wasteland",
    title: "Wasteland",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#8b4513",
    image: "/images/paintings/wasteland.png",
  },
  {
    id: "utica",
    title: "Utica",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#2a9d8f",
    image: "/images/paintings/utica.png",
  },
  {
    id: "hawaii",
    title: "Hawaii",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#7b5ea7",
    image: "/images/paintings/hawaii.png",
  },
  {
    id: "figure-reclining",
    title: "Figure",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#4a3f8a",
    image: "/images/paintings/figure-reclining.png",
  },
  {
    id: "smeagol",
    title: "Smeagol",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#e0899a",
    image: "/images/paintings/smeagol.png",
  },
  {
    id: "cats-wine",
    title: "Cats & Wine",
    medium: "Mixed Media",
    year: "",
    accent: "#6aaa45",
    image: "/images/paintings/cats-wine.png",
  },
  {
    id: "ezra",
    title: "Ezra",
    medium: "Ink and Watercolor",
    year: "",
    accent: "#c96f22",
    image: "/images/paintings/ezra.png",
  },
  {
    id: "figure-torso",
    title: "Figure Study",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#4a4a4a",
    image: "/images/paintings/figure-torso.png",
  },
  {
    id: "self-portrait",
    title: "Self Portrait",
    medium: "Acrylic on Canvas",
    year: "",
    accent: "#c77dff",
    image: "/images/paintings/self-portrait.png",
  },
  {
    id: "jose-cuervo",
    title: "Jose Cuervo",
    medium: "Acrylic on Panel",
    year: "",
    accent: "#8fbc8f",
    image: "/images/paintings/jose-cuervo.png",
  },
  {
    id: "lets-talk",
    title: "Let's Talk",
    medium: "Illustration",
    year: "",
    accent: "#e0893a",
    image: "/images/paintings/lets-talk.png",
    bookSrc: "/pdfs/lets-talk.pdf",
    cta: { label: "Read the book" },
  },
];

export const paintingsIntro = {
  heading: "Influenced by the Fine Arts",
  body: "Lara has painted ever since she had the motor skills to. She was inspired by her father, Jeff Renaud. She often watched as he created his masterpieces of color in the garage and knew from a young age that making art would also be her passion. Lara studied at at Pratt MWP, NY, where she learned Classic painting and color theory from painters Christopher Cirilo and Gregg Lawler. She studied drawing and life drawing under Steve Arnison and Eulia Neal at Pratt MWP, NY, and Ardis DeFreece at the Pacific Northwest School of the Arts, OR. The skills she developed under these masters, in addition to her studies of the Impressionists, Cubists, and French Canadian landscape artists, influenced her style and creativity in the digital arts.",
};

export const drawings: Artwork[] = [
  {
    id: "seated-profile",
    title: "Seated Figure",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#4a4a4a",
    image: "/images/drawings/seated-profile.png",
  },
  {
    id: "muscle-study",
    title: "Facial Muscle Study",
    medium: "Pencil on Paper",
    year: "",
    accent: "#5a5a5a",
    image: "/images/drawings/muscle-study.png",
  },
  {
    id: "skull-study",
    title: "Skull Study",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#3d3d3d",
    image: "/images/drawings/skull-study.png",
  },
  {
    id: "male-portrait",
    title: "Portrait Study",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#555555",
    image: "/images/drawings/male-portrait.png",
  },
  {
    id: "figure-group",
    title: "Figure Studies",
    medium: "Charcoal on Toned Paper",
    year: "",
    accent: "#6b5a4a",
    image: "/images/drawings/figure-group.png",
  },
  {
    id: "gesture-studies",
    title: "Gesture Studies",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#6e6a63",
    image: "/images/drawings/gesture-studies.png",
  },
  {
    id: "reclining-torso",
    title: "Reclining Torso",
    medium: "Charcoal and Chalk on Toned Paper",
    year: "",
    accent: "#4a4038",
    image: "/images/drawings/reclining-torso.png",
  },
  {
    id: "seated-figure",
    title: "Seated Figure",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#4a4a4a",
    image: "/images/drawings/seated-figure.png",
  },
  {
    id: "reclining-back",
    title: "Reclining Figure",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#5c5c5c",
    image: "/images/drawings/reclining-back.png",
  },
  {
    id: "self-portrait",
    title: "Self Portrait",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#3a3a3a",
    image: "/images/drawings/self-portrait.png",
  },
  {
    id: "charcoal-study",
    title: "Charcoal Study",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#2f2c28",
    image: "/images/drawings/charcoal-study.png",
  },
  {
    id: "studio-scene",
    title: "Today / Tomorrow",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#4a4a4a",
    image: "/images/drawings/studio-scene.png",
  },
  {
    id: "drapery",
    title: "Drapery Study",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#333333",
    image: "/images/drawings/drapery.png",
  },
  {
    id: "still-life",
    title: "Still Life",
    medium: "Charcoal on Paper",
    year: "",
    accent: "#5a5a5a",
    image: "/images/drawings/still-life.png",
  },
  {
    id: "this-is-bullshit",
    title: "This is Bull Shit",
    medium: "Ink on Paper",
    year: "",
    accent: "#2a2a2a",
    image: "/images/drawings/this-is-bullshit.png",
  },
];

export const drawingsIntro = {
  heading: "Traditional to Digital",
  body: "Lara studied drawing and life drawing under Steve Arnison and Eulia Neal at Pratt MWP, NY, and Ardis DeFreece at Pacific Northwest College of Art, OR. Learning the basics provided a foundation of skills that Lara has applied to her skills in animation including anatomy, drama, exaggeration, and action of the body.",
};

export const aboutBio = {
  name: "Lara Renaud",
  paragraphs: [
    "A young new animator who studied for two years at Pratt Institute, NY, and recently graduated with a BFA in Animation from the Pacific Northwest College of the Arts, OR. A published illustrator and freelance animator, Lara has an accomplished body of work that reflects her technical expertise and range of skills in animation and cinematography and her passion to do exceptional, meaningful work. Based in the Pacific Northwest, Lara works in 2D, 3D, digital, and analog animation. Her unique painterly and whimsical style lends itself to storytelling, messaging, mood-setting backgrounds, and more. When her creative visions come to life on the screen, they are emotionally charged, engaging, impactful, and captivating.",
    "Currently seeking permanent work! Looking to secure a position with a studio or company. Is excited to learn and grow her skills in animation … Works well as an independent and driven technician and artist, and also as a member of a creative team and collaborator.",
  ],
};

export const aboutCv = {
  title: "CV and Resume",
  education: [
    "Pratt MWP 2017-2019 Associates in Fine Art",
    "Pacific Northwest College Of Art 2020-2023 BFA in Animation",
  ],
  exhibitions: [
    "2021-2022. Portland Museum & Center for Holocaust Education, LAB, Portland OR",
    "2021-2022 Future Ephemera: Intermedia Department Student Exhibition, Pacific Northwest",
    "2019 PrattMWP, Sophomore Show, Utica, NY",
    "2019 Sophomore Student Curated Exhibition, Utica, NY",
    "2018 PrattMWP, Freshman Show Utica NY",
  ],
  festivals: [
    {
      title: "Merry, 2021",
      credit: "Created by Lara Renaud Fiona Lam & Quinn Kelly",
      entries: [
        "Ó Bhéal’s 10th Winter Warmer Poetry festival (Cork, Ireland, Nov 27/22 and available online afterward)",
        "HECare Film Festival (Human-Environment Care Film Festival HECFF) (Toronto, Ontario, Dec 16/22)* REELpoetry/Houston TX 2023 International Festival (Houston, TX Feb 23-26/23)*",
        "International Poetry Film Festival (Beyond Baroque, Venice, CA, April 28/23)*",
        "International Migration and Environmental Film Festival IMEFF (Online Toronto, Ontario, June 5-11/23)",
      ],
    },
    {
      title: "Un/Write, 2023",
      credit: "Created by Lara Renaud, Fiona Lam, & Quinn Kelly",
      entries: [
        "JÁ Fest 2023, International Poetry Film Competition (Lisbon, Portugal, April 13/23)",
        "Aotearoa Poetry Film Festival (Wellington, New Zealand, November 2, 2023)",
        "Nature & Culture Festival (Copenhagen, Denmark, November 20-30, 2023)",
        "REEL poetry Houston (Houston, Texas, April 1-7, 2024)",
      ],
    },
  ],
  books: [
    {
      title: "Let's Talk! The Life of Dixie Doodle (2021)",
      credit: "Written by Patsy Gallagher, Illustrated by Lara Renaud",
    },
  ],
};
