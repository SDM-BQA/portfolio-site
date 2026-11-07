import { useId, type Ref } from "react";

export type Stage = "college" | "intern" | "professional";

export const AVATAR_SIZE = 40;

const labels: Record<Stage, string> = { college: "student", intern: "intern", professional: "developer" };

/**
 * A small figure that walks the career graph as the page scrolls: a graduation cap at
 * college, an ID lanyard as an intern, and a laptop in the current role. Decorative,
 * since every stage is also written out in the commits beside it.
 */
export function CareerAvatar({ ref, stage }: { ref: Ref<HTMLDivElement>; stage: Stage }) {
  const clip = useId();
  const show = (target: Stage) => ({ opacity: stage === target ? 1 : 0 });

  return (
    <div ref={ref} aria-hidden="true" data-stage={stage} className="career-avatar">
      <svg viewBox="0 0 40 40" width={AVATAR_SIZE} height={AVATAR_SIZE} className="overflow-visible">
        <defs>
          <clipPath id={clip}>
            <circle cx="20" cy="20" r="18" />
          </clipPath>
        </defs>
        <circle cx="20" cy="20" r="19" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
        <g clipPath={`url(#${clip})`}>
          <path d="M7 40C7 30 13 25.5 20 25.5S33 30 33 40Z" fill="var(--accent)" />
          <circle cx="20" cy="17" r="6" fill="var(--ink)" />

          <g className="avatar-gear" style={show("intern")}>
            <path d="M15.5 26 20 32.5 24.5 26" fill="none" stroke="var(--highlight)" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="17.25" y="31" width="5.5" height="6.5" rx="1" fill="var(--highlight)" />
          </g>

          <g className="avatar-gear" style={show("professional")}>
            <rect x="10.5" y="28.5" width="19" height="11" rx="1.5" fill="var(--elevated)" stroke="var(--highlight)" strokeWidth="1.5" />
            <circle cx="20" cy="34" r="1.3" fill="var(--highlight)" />
          </g>
        </g>

        {/* The cap overhangs the badge a little, so it sits outside the clip. */}
        <g className="avatar-gear" style={show("college")}>
          <path d="M14.5 12.5v2.75c0 1.6 11 1.6 11 0V12.5" fill="var(--highlight)" />
          <path d="M20 5.5 32 10.25 20 15 8 10.25Z" fill="var(--highlight)" stroke="var(--surface)" strokeWidth="0.75" strokeLinejoin="round" />
          <path d="M32 10.25v6.5" stroke="var(--highlight)" strokeWidth="1" />
          <circle cx="32" cy="17.5" r="1.2" fill="var(--highlight)" />
        </g>
      </svg>

      {/* .live-dot positions itself relatively for its ping, so a wrapper places it. */}
      {stage === "professional" && (
        <span className="absolute -top-0.5 -right-0.5 grid size-3 place-items-center rounded-full bg-surface">
          <span className="live-dot" />
        </span>
      )}
      <span className="career-avatar-label">{labels[stage]}</span>
    </div>
  );
}
