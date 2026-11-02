"use client";

import { useLayoutEffect, useRef } from "react";
import { useTerminal } from "./TerminalProvider";
import { TerminalWindow } from "./TerminalWindow";

/** Native modal dialog: provides the focus trap, Escape and focus restoration. */
export function TerminalDialog() {
  const { isOpen, close } = useTerminal();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A layout effect, so the dialog is shown before TerminalWindow's effect focuses its input.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Portfolio terminal"
      className="terminal-dialog"
      onClose={close}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      {isOpen && <TerminalWindow autoFocus onClose={close} className="h-full max-md:rounded-none" />}
    </dialog>
  );
}
