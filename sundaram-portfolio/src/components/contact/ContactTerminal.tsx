"use client";

import { Check, Copy, CornerDownLeft } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { profile } from "@/data/profile";
import { LocalTime } from "./LocalTime";

const GLYPHS = "0123456789abcdef{}<>/=;$#";
const FRAME_MS = 28;
const SUGGESTIONS = [
  "we're hiring a full stack developer…",
  "I have a project idea…",
  "quick question about your GraphQL work…",
  "just saying hi 👋",
];

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One terminal-style card for getting in touch. The "to" line hides the address until
 * hover or focus, then scrambles it in through code symbols; clicking it copies. The
 * message line opens a draft in the visitor's own email app. Nothing is sent to or
 * stored by this site.
 */
export function ContactTerminal() {
  // The "to" line
  const [email, setEmail] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const scrambleTimer = useRef<number | undefined>(undefined);
  const copyTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);

  // The message line
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState(0);
  const [sent, setSent] = useState(false);
  const inputId = useId();

  useEffect(
    () => () => {
      window.clearTimeout(scrambleTimer.current);
      window.clearTimeout(copyTimer.current);
    },
    [],
  );

  // Cycles example messages through the placeholder while the field is idle.
  useEffect(() => {
    if (focused || message || reducedMotion()) return;
    const timer = window.setInterval(() => setHint((value) => (value + 1) % SUGGESTIONS.length), 2800);
    return () => window.clearInterval(timer);
  }, [focused, message]);

  function revealEmail() {
    if (email) return;
    window.clearTimeout(scrambleTimer.current);
    const target = profile.email;
    if (reducedMotion()) {
      setEmail(target);
      return;
    }
    let frame = 0;
    const step = () => {
      frame += 1;
      const resolved = frame * 1.4;
      setEmail(
        target
          .split("")
          .map((char, index) => (index < resolved ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (resolved < target.length) scrambleTimer.current = window.setTimeout(step, FRAME_MS);
    };
    step();
  }

  function hideEmail() {
    window.clearTimeout(scrambleTimer.current);
    setEmail("");
  }

  async function copyEmail() {
    window.clearTimeout(copyTimer.current);
    revealEmail();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    copyTimer.current = window.setTimeout(() => {
      setCopyStatus("idle");
      if (!hovering.current) hideEmail();
    }, 3000);
  }

  function send(event: FormEvent) {
    event.preventDefault();
    const body = `Hi ${profile.firstName},\n\n${message.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={send} className="contact-prompt card flex h-full flex-col overflow-hidden shadow-(--shadow) transition-shadow">
      <div className="flex items-center gap-1.5 border-b border-line bg-elevated px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-error/70" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-(--warning)/70" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-success/70" />
        <span aria-hidden="true" className="ml-3 font-mono text-xs text-muted">
          ~/inbox
        </span>
        <span className="ml-auto max-sm:hidden">
          <LocalTime />
        </span>
      </div>

      <div className="px-5 pt-6 pb-2 md:px-6">
        <p className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-none font-semibold tracking-tight">Say hello</p>
      </div>

      <div className="space-y-1 px-5 pb-4 font-mono text-sm md:px-6">
        {/* to: hover or focus reveals the address, click copies it */}
        <button
          type="button"
          onClick={copyEmail}
          onPointerEnter={(event) => {
            if (event.pointerType !== "mouse") return;
            hovering.current = true;
            revealEmail();
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "mouse") return;
            hovering.current = false;
            if (copyStatus !== "copied") hideEmail();
          }}
          onFocus={revealEmail}
          onBlur={() => copyStatus !== "copied" && hideEmail()}
          className="group flex min-h-10 w-full items-center gap-3 rounded-md text-left"
        >
          <span className="sr-only">Copy my email address, {profile.email}</span>
          <span aria-hidden="true" className="w-18 flex-none text-accent">
            $ to
          </span>
          <span aria-hidden="true" className="min-w-0 flex-1 wrap-anywhere">
            {email ? (
              <span className="text-ink">{email}</span>
            ) : (
              <span className="text-muted">
                <span className="max-md:hidden">hover to reveal my email</span>
                <span className="md:hidden">tap to copy my email</span>
              </span>
            )}
            {copyStatus === "copied" && <span className="text-xs text-success"> · copied ✓</span>}
            {copyStatus === "failed" && <span className="text-xs text-error"> · couldn&apos;t copy</span>}
          </span>
          <span
            aria-hidden="true"
            className="grid size-8 flex-none place-items-center rounded-md text-muted transition-colors group-hover:bg-elevated group-hover:text-accent"
          >
            {copyStatus === "copied" ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </span>
        </button>
        <span role="status" className="sr-only">
          {copyStatus === "copied" && "Email copied to clipboard."}
          {copyStatus === "failed" && `Couldn't copy automatically. My email is ${profile.email}.`}
        </span>

        {/* message: Enter opens a draft in the visitor's email app */}
        <div className="flex min-h-10 items-center gap-3">
          <label htmlFor={inputId} className="w-18 flex-none text-accent">
            <span aria-hidden="true">$ msg</span>
            <span className="sr-only">Message</span>
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              id={inputId}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setSent(false);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={500}
              autoComplete="off"
              className="w-full bg-transparent py-1 text-ink outline-none"
            />
            {!message && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center text-muted">
                {focused ? (
                  <span className="contact-caret" />
                ) : (
                  <span key={hint} className="term-entry truncate">
                    {SUGGESTIONS[hint]}
                  </span>
                )}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex min-h-9 flex-none items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Send
            <CornerDownLeft className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p role="status" className="mt-auto border-t border-dashed border-line px-5 py-2.5 font-mono text-xs text-muted md:px-6">
        {sent
          ? `→ opening your email app… if nothing happens, write to ${profile.email}`
          : "Type a message and press Enter to open it as a draft in your email app. Nothing is stored here."}
      </p>
    </form>
  );
}
