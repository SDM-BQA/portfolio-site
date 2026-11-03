"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { showSkill } from "@/components/skills/selectSkill";
import { runCommand, type OutputLine } from "./commands";
import { FloatingTerminalButton } from "./FloatingTerminalButton";
import { TerminalDialog } from "./TerminalDialog";

export type TerminalEntry = { id: number; command?: string; lines: OutputLine[] };

const MAX_ENTRIES = 100;

const welcome: TerminalEntry = {
  id: 0,
  lines: [
    { kind: "muted", text: "Welcome. This is a simulated portfolio terminal, not a real shell." },
    { kind: "muted", text: "Type help to get started." },
  ],
};

type TerminalContextValue = {
  entries: TerminalEntry[];
  history: string[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  submit: (command: string) => void;
  print: (command: string, lines: OutputLine[]) => void;
  clear: () => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminal() {
  const value = useContext(TerminalContext);
  if (!value) throw new Error("useTerminal must be used inside TerminalProvider");
  return value;
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TerminalEntry[]>([welcome]);
  const [history, setHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const nextId = useRef(1);

  const print = useCallback((command: string, lines: OutputLine[]) => {
    const entry = { id: nextId.current++, command, lines };
    setEntries((current) => [...current, entry].slice(-MAX_ENTRIES));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const submit = useCallback(
    (command: string) => {
      const trimmed = command.trim();
      if (!trimmed) {
        print("", []);
        return;
      }
      setHistory((current) => [...current, trimmed]);
      const result = runCommand(trimmed);
      if (result.type === "clear") {
        clear();
        return;
      }
      print(trimmed, result.lines);
      if (result.open) window.open(result.open, "_blank", "noopener,noreferrer");
      if (result.showSkill) {
        // Close the modal first so the page can scroll; the next frame runs after it has gone.
        const name = result.showSkill;
        setIsOpen(false);
        window.requestAnimationFrame(() => showSkill(name));
      }
    },
    [clear, print],
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({ entries, history, isOpen, open, close, submit, print, clear }),
    [entries, history, isOpen, open, close, submit, print, clear],
  );

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <FloatingTerminalButton />
      <TerminalDialog />
    </TerminalContext.Provider>
  );
}
