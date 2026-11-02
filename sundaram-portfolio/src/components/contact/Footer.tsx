import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-wrap items-center justify-between gap-4 pt-6 pb-24 text-sm text-muted">
        <p>
          © 2026 {profile.name}
        </p>
        <Link href="/#home" className="inline-flex min-h-10 items-center gap-1.5 hover:text-ink">
          Back to top
          <ArrowUp className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
