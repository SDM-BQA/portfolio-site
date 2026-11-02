export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Runs inline before first paint so a stored or system theme never flashes. It also
 * decides whether the loading screen shows, and sends a refresh back to the top: some
 * browsers read scrollRestoration before this page runs, so it's set on the way out
 * and restored to "auto" on arrival, which keeps the Back button's position memory.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js");var n=performance.getEntriesByType("navigation")[0],r=!!n&&n.type==="reload";var h=history;addEventListener("pagehide",function(){h.scrollRestoration="manual"});addEventListener("pageshow",function(){if(r){scrollTo({top:0,behavior:"instant"})}setTimeout(function(){h.scrollRestoration="auto"},500)});if(r){h.scrollRestoration="manual";if(location.hash)h.replaceState(h.state,"",location.pathname+location.search)}if(location.pathname==="/"&&(!location.hash||r))d.classList.add("boot");try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t}catch(e){d.dataset.theme="dark"}})()`;

export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function getServerTheme(): Theme {
  return "dark";
}

export function toggleTheme() {
  const root = document.documentElement;
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  root.classList.add("theme-transition");
  root.dataset.theme = next;
  window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be blocked; the theme still applies for this page view.
  }
}
