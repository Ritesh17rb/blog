import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { projects } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
          A few things I&apos;ve built, broken, and (mostly) fixed.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.1}>
            <div className="group h-full rounded-2xl border border-black/5 bg-white/50 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:shadow-black/30">
              <h3 className="text-lg font-semibold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4 text-sm font-medium">
                <a href={project.href} className="flex items-center gap-1 text-accent">
                  Live <ExternalLink size={14} />
                </a>
                <a
                  href={project.github}
                  className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400"
                >
                  Code <GithubIcon className="h-[14px] w-[14px]" />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
