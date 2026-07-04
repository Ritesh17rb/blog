export const bio = {
  name: "Ritesh",
  tagline:
    "Software engineer by trade, curious about everything else. I write about whatever I'm currently into.",
  paragraphs: [
    "I'm Ritesh. This site is where I put the notes I'd otherwise lose — sometimes that's something I learned while building a piece of software, sometimes it's just a thought about life that didn't fit anywhere else. I don't limit myself to one topic here.",
    "I care about doing things well, whether that's writing software that feels fast and intentional, or just being thoughtful about how I spend my time. Expect a mix — code, life, and whatever else is on my mind.",
  ],
};

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Rust",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
];

export const timeline = [
  {
    year: "2026",
    title: "Writing about backend + frontend craft",
    description:
      "Sharing what I learn building products, one post at a time.",
  },
  {
    year: "2024",
    title: "Went deep on systems programming",
    description:
      "Picked up Rust and started caring a lot more about performance.",
  },
  {
    year: "2021",
    title: "Started building for the web",
    description: "First lines of JavaScript, and I haven't stopped since.",
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  github: string;
};

export const projects: Project[] = [
  {
    title: "This blog",
    description:
      "A fast, animated personal blog with its own AI chatbot that can answer questions using the site's actual content — the site you're on right now.",
    tags: ["Web app", "AI", "Full-stack"],
    href: "#",
    github: "#",
  },
  {
    title: "Task Flow",
    description:
      "A minimal task manager with keyboard-first navigation and realtime sync.",
    tags: ["React", "WebSockets", "PostgreSQL"],
    href: "#",
    github: "#",
  },
  {
    title: "Palette",
    description:
      "A tool for generating accessible color systems from a single brand color.",
    tags: ["Rust", "WASM", "Color Science"],
    href: "#",
    github: "#",
  },
];

export function buildAboutText(): string {
  return [
    `About Ritesh, the author of this blog.`,
    bio.tagline,
    ...bio.paragraphs,
    `Skills: ${skills.join(", ")}.`,
    "Timeline:",
    ...timeline.map((item) => `${item.year}: ${item.title} — ${item.description}`),
  ].join("\n\n");
}

export function buildProjectsText(): string {
  return [
    "The projects Ritesh has built:",
    ...projects.map(
      (project) => `${project.title}: ${project.description} (${project.tags.join(", ")})`
    ),
  ].join("\n\n");
}
