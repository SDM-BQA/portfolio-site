"use client";

import { SquareTerminal } from "lucide-react";
import { useTerminal } from "./TerminalProvider";

export function FloatingTerminalButton() {
  const { open } = useTerminal();

  return (
    <button type="button" onClick={open} aria-label="Open terminal" aria-keyshortcuts="Control+K Meta+K" className="terminal-fab">
      <SquareTerminal className="size-5" aria-hidden="true" />
      <span aria-hidden="true" className="font-mono text-sm font-medium">
        Terminal
      </span>
      <kbd aria-hidden="true" className="terminal-fab-key max-md:hidden">
        Ctrl K
      </kbd>
    </button>
  );
}
