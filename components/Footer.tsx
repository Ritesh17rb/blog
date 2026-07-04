import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "./icons/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-sm text-zinc-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Ritesh. Built with Next.js.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-accent"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-colors hover:text-accent"
          >
            <XIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-accent"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href="mailto:ritesh17lifeamazing@gmail.com"
            aria-label="Email"
            className="transition-colors hover:text-accent"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
