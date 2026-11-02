"use client";

import { Menu, SquareTerminal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTerminal } from "@/components/terminal/TerminalProvider";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { navItems, profile } from "@/data/profile";
import { ThemeToggle } from "./ThemeToggle";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band across the middle of the viewport: one section at a time.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const item of navItems) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Navigation() {
  const isHome = usePathname() === "/";
  const active = useActiveSection(isHome);
  const { open: openTerminal } = useTerminal();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-line bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] backdrop-blur-md">
        <div className="flex h-14 items-center justify-between gap-4 pr-2 pl-4">
          <Link href="/#home" className="font-display text-[0.95rem] font-bold tracking-wide whitespace-nowrap">
            SUNDARAM<span className="text-accent">.DEV</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block rounded-md px-3 py-2 text-sm transition-colors hover:text-ink ${isActive ? "font-medium text-ink" : "text-muted"}`}
                    >
                      {item.label}
                      {isActive && <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center">
            <div className="hidden items-center sm:flex">
              <ExternalLink href={profile.github} className="icon-btn" aria-label="GitHub profile">
                <GitHubIcon className="size-[18px]" />
              </ExternalLink>
              <ExternalLink href={profile.linkedin} className="icon-btn" aria-label="LinkedIn profile">
                <LinkedInIcon className="size-[17px]" />
              </ExternalLink>
            </div>
            <button type="button" className="icon-btn" onClick={openTerminal} aria-label="Open terminal" aria-keyshortcuts="Control+K Meta+K">
              <SquareTerminal className="size-[18px]" aria-hidden="true" />
            </button>
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              className="icon-btn lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav id="mobile-menu" aria-label="Mobile" hidden={!menuOpen} className="border-t border-line p-2 lg:hidden">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center gap-2 rounded-lg px-3 hover:bg-elevated ${active === item.id ? "font-medium text-ink" : "text-muted"}`}
                >
                  {item.label}
                  {active === item.id && <span className="eyebrow">· current</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex gap-1 border-t border-line pt-2 sm:hidden">
            <ExternalLink href={profile.github} className="flex min-h-11 flex-1 items-center gap-2 rounded-lg px-3 text-muted hover:bg-elevated">
              <GitHubIcon className="size-4" /> GitHub
            </ExternalLink>
            <ExternalLink href={profile.linkedin} className="flex min-h-11 flex-1 items-center gap-2 rounded-lg px-3 text-muted hover:bg-elevated">
              <LinkedInIcon className="size-4" /> LinkedIn
            </ExternalLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
