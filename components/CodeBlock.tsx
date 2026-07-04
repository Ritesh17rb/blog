"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";

export function Pre({ children, ...props }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative my-6">
      <pre ref={preRef} {...props} className={`${props.className ?? ""} scrollbar-thin`}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        className="absolute right-3 top-3 rounded-md border border-white/10 bg-white/10 p-1.5 text-zinc-300 opacity-70 backdrop-blur transition-opacity duration-150 hover:bg-white/20 hover:opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
