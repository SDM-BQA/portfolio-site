"use client";

import Link from "next/link";
import { Eraser, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { completeCommand, type OutputLine } from "./commands";
import { site } from "@/data/profile";
import { useTerminal } from "./TerminalProvider";

const PROMPT = `visitor@${site.domain}:~$`;
const SUGGESTIONS = ["help", "whoami", "experience", "projects", "skills", "stack --details react", "contact"];

const lineStyles = {
  text: "text-ink",
  heading: "font-semibold text-ink",
  muted: "text-muted",
  error: "text-error",
};

function Line({ line, onNavigate }: { line: OutputLine; onNavigate?: () => void }) {
  if (line.kind !== "link") {
    return <p className={lineStyles[line.kind]}>{line.text}</p>;
  }
  if (line.external || line.href.startsWith("mailto:")) {
    return (
      <p>
        <a
          className="text-link"
          href={line.href}
          {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {line.label}
          {line.external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      </p>
    );
  }
  return (
    <p>
      <Link className="text-link" href={line.href} onClick={onNavigate}>
        {line.label}
      </Link>
    </p>
  );
}

export function TerminalWindow({
  autoFocus = false,
  onClose,
  className = "",
}: {
  autoFocus?: boolean;
  onClose?: () => void;
  className?: string;
}) {
  const { entries, history, submit, print, clear } = useTerminal();
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Scrolls only the log itself, so an embedded terminal never moves the page.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries]);

  function send(command: string) {
    submit(command);
    setInput("");
    setHistoryIndex(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      send(input);
    } else if (event.key === "ArrowUp") {
      if (!history.length) return;
      event.preventDefault();
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    } else if (event.key === "ArrowDown") {
      if (historyIndex === null) return;
      event.preventDefault();
      const index = historyIndex + 1;
      setHistoryIndex(index < history.length ? index : null);
      setInput(index < history.length ? history[index] : "");
    } else if (event.key === "Tab" && input.trim()) {
      // An empty input keeps Tab's normal focus behaviour, so keyboard users are not trapped.
      event.preventDefault();
      const matches = completeCommand(input);
      if (matches.length === 1) setInput(matches[0]);
      // Lists just the word being completed, e.g. tool names rather than whole command lines.
      else if (matches.length > 1) print(input, [{ kind: "muted", text: matches.map((match) => match.trim().split(" ").pop()).join("  ") }]);
    }
  }

  function focusInput(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button") || window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <div
      className={`card flex min-h-0 flex-col overflow-hidden font-mono text-[0.8125rem] leading-relaxed shadow-[var(--shadow)] md:text-[0.9375rem] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-elevated py-1 pr-1 pl-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-accent" />
        </div>
        <p className="min-w-0 flex-1 truncate text-center text-xs text-muted">{site.domain} — terminal</p>
        <button type="button" className="icon-btn" onClick={clear} aria-label="Clear terminal output">
          <Eraser className="size-4" aria-hidden="true" />
        </button>
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close terminal">
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col" onClick={focusInput}>
        <div
          ref={logRef}
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          tabIndex={0}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 whitespace-pre-wrap [overflow-wrap:anywhere]"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="term-entry space-y-0.5">
              {entry.command !== undefined && (
                <p>
                  <span className="text-accent">{PROMPT}</span> {entry.command}
                </p>
              )}
              {entry.lines.map((line, index) => (
                <Line key={index} line={line} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTIONS.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => send(command)}
              className="min-h-8 rounded-md border border-line px-2 text-xs text-muted transition-colors hover:bg-elevated hover:text-ink"
            >
              {command}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-line px-4 py-3">
          <label htmlFor={inputId} className="flex-none text-accent">
            <span aria-hidden="true" className="max-sm:hidden">
              {PROMPT}
            </span>
            <span aria-hidden="true" className="sm:hidden">
              $
            </span>
            <span className="sr-only">Terminal command</span>
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={onKeyDown}
            placeholder="type a command"
            maxLength={80}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            className="min-w-0 flex-1 bg-transparent text-base text-ink caret-accent outline-none placeholder:text-muted md:text-[0.9375rem]"
          />
        </div>
      </div>
    </div>
  );
}
