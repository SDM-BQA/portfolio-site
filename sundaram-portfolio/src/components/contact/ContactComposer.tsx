"use client";

import { Copy, Send } from "lucide-react";
import { useId, useState } from "react";
import { profile } from "@/data/profile";

const INTENTS = [
  { id: "job", label: "Job opportunity", subject: "A role you might be interested in" },
  { id: "project", label: "Project idea", subject: "A project idea" },
  { id: "engineering", label: "Engineering chat", subject: "A question about your work" },
  { id: "hello", label: "Just saying hi", subject: "Hello from your portfolio" },
];

const MAX_MESSAGE = 1000;

function Row({ name, value, last = false }: { name: string; value: string; last?: boolean }) {
  return (
    <p className="pl-4 wrap-anywhere whitespace-pre-wrap">
      <span className="text-accent">&quot;{name}&quot;</span>: <span className="text-success">{JSON.stringify(value)}</span>
      {!last && ","}
    </p>
  );
}

/**
 * Looks like an API client, but only ever builds a mailto: link. The draft opens in
 * the visitor's own email app; nothing is sent to or stored by this site.
 */
export function ContactComposer() {
  const [intentId, setIntentId] = useState(INTENTS[0].id);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "opened" | "copied" | "copy-failed">("idle");
  const [sends, setSends] = useState(0);
  const nameId = useId();
  const messageId = useId();

  const intent = INTENTS.find((item) => item.id === intentId) ?? INTENTS[0];
  const signature = name.trim() ? `\n\n${name.trim()}` : "";
  const body = `Hi ${profile.firstName},\n\n${message.trim()}${signature}`;
  const href = `mailto:${profile.email}?subject=${encodeURIComponent(intent.subject)}&body=${encodeURIComponent(body)}`;

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(`To: ${profile.email}\nSubject: ${intent.subject}\n\n${body}`);
      setStatus("copied");
    } catch {
      setStatus("copy-failed");
    }
  }

  return (
    <div className="card flex flex-col overflow-hidden shadow-(--shadow)">
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-elevated px-4 py-3 font-mono text-[0.8125rem]">
        <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">POST</span>
        <span className="min-w-0 text-muted">sundaram.dev/inbox</span>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="space-y-4 p-5">
          <fieldset>
            <legend className="eyebrow uppercase">What&apos;s this about?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === intentId}
                  onClick={() => setIntentId(item.id)}
                  className={`min-h-9 rounded-full border px-3 text-sm transition-colors ${
                    item.id === intentId
                      ? "border-accent bg-accent-soft font-medium text-ink"
                      : "border-line text-muted hover:bg-elevated hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor={nameId} className="eyebrow uppercase">
              Your name
            </label>
            <input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoComplete="name"
              placeholder="Optional"
              className="contact-field mt-2"
            />
          </div>
          <div>
            <label htmlFor={messageId} className="eyebrow uppercase">
              Message
            </label>
            <textarea
              id={messageId}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={MAX_MESSAGE}
              rows={4}
              placeholder="What are you building?"
              className="contact-field mt-2 resize-y"
            />
          </div>
        </div>

        <div aria-hidden="true" className="flex flex-col border-line bg-bg/60 p-5 font-mono text-[0.8125rem] leading-relaxed max-md:border-t md:border-l">
          <p className="eyebrow uppercase">Request preview</p>
          <div data-contact-preview className="mt-3 flex-1">
            <p className="text-muted">{"{"}</p>
            <Row name="to" value={profile.firstName} />
            <Row name="from" value={name.trim() || "you"} />
            <Row name="intent" value={intent.label} />
            <Row name="message" value={message.trim() || "..."} last />
            <p className="text-muted">{"}"}</p>
          </div>
        </div>
      </div>

      <div className="contact-wire" aria-hidden="true">
        {sends > 0 && <span key={sends} />}
      </div>

      <div className="flex flex-wrap items-center gap-3 p-5">
        <a
          href={href}
          data-contact-send
          onClick={() => {
            setStatus("opened");
            setSends((value) => value + 1);
          }}
          className="btn btn-primary magnetic"
        >
          <Send className="size-4" aria-hidden="true" />
          Send from my email app
        </a>
        <button type="button" onClick={copyDraft} className="btn btn-ghost">
          <Copy className="size-4" aria-hidden="true" />
          Copy draft
        </button>
        <p role="status" className="w-full text-sm leading-relaxed text-muted">
          {status === "idle" && "Nothing is sent or stored by this site. The draft opens in your own email app."}
          {status === "opened" && `Your email app should now open with this draft. If it didn't, copy the draft and send it to ${profile.email}.`}
          {status === "copied" && `Draft copied. Paste it into an email to ${profile.email}.`}
          {status === "copy-failed" && `Couldn't copy automatically. My email is ${profile.email}.`}
        </p>
      </div>
    </div>
  );
}
