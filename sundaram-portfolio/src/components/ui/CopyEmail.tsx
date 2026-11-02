"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

type Status = "idle" | "copied" | "failed";

export function CopyEmail({ className = "btn btn-ghost" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
      timer.current = window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div>
      <button type="button" onClick={copy} className={className}>
        {status === "copied" ? (
          <Check className="size-4 text-success" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {status === "copied" ? "Email copied" : "Copy email"}
      </button>
      <p role="status" className="mt-2 text-sm text-muted empty:hidden">
        {status === "copied" && `Copied ${profile.email} to your clipboard.`}
        {status === "failed" && `Couldn't copy automatically. My email is ${profile.email}.`}
      </p>
    </div>
  );
}
