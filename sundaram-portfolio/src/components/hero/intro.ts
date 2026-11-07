// Survives client-side navigation but not a full page load, so the intro plays
// once per load and returning from a case study never replays it.
let played = false;

export const hasIntroPlayed = () => played;

export function markIntroPlayed() {
  played = true;
}

const replayListeners = new Set<() => void>();

/** Hovering the name replays its decode; the code line above it listens for this. */
export function notifyNameReplay() {
  replayListeners.forEach((listener) => listener());
}

export function onNameReplay(listener: () => void) {
  replayListeners.add(listener);
  return () => {
    replayListeners.delete(listener);
  };
}

/** When the name starts decoding, once the code line has been typed. */
export const REVEAL_DELAY_MS = 1000;
/** How long the decode takes: 8 scramble-only frames plus 4 per letter, at 45ms. */
export const DECODE_MS = 1800;
