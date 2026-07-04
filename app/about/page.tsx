import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "A little about who I am and what I work on.",
};

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Rust",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
];

const timeline = [
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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Image
            src="/images/avatar.svg"
            alt="Ritesh"
            width={96}
            height={96}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">About me</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Software engineer. I build things, break things, and write
              about both.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal
        delay={0.1}
        className="prose prose-zinc mt-10 max-w-none dark:prose-invert"
      >
        <p>
          I&apos;m Ritesh — I write code for a living and, increasingly, for
          fun. This site is where I put the notes I&apos;d otherwise lose:
          things I learn while building backend services, debugging a gnarly
          React re-render, or just obsessing over a color palette for too
          long.
        </p>
        <p>
          I care about software that feels fast and looks intentional — the
          kind of craft that&apos;s hard to point at but easy to feel. Most
          of what I write about lives at the intersection of performance,
          design, and developer experience.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <h2 className="mt-14 text-xl font-bold tracking-tight">
          What I work with
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <h2 className="mt-14 text-xl font-bold tracking-tight">Journey</h2>
        <div className="mt-6 space-y-8 border-l border-black/10 pl-6 dark:border-white/10">
          {timeline.map((item) => (
            <div key={item.year} className="relative">
              <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="text-sm font-semibold text-accent">{item.year}</p>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
