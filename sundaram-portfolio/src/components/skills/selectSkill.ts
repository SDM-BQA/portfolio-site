/** Lets other parts of the page (such as the terminal) open a tool in the Skills section. */
export const SELECT_SKILL_EVENT = "portfolio:select-skill";

export type SelectSkillDetail = { name: string };

/** Scrolls to the Skills section and asks it to select the named tool. */
export function showSkill(name: string) {
  window.dispatchEvent(new CustomEvent<SelectSkillDetail>(SELECT_SKILL_EVENT, { detail: { name } }));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("skills")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", "#skills");
}
