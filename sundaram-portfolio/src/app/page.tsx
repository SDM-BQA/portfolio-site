import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { GitHubSection } from "@/components/github/GitHubSection";
import { Education } from "@/components/education/Education";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { Skills } from "@/components/skills/Skills";
import { Timeline } from "@/components/timeline/Timeline";

// Where I work first (the promotion story), then what I've built, then with what.
export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <ProjectsSection />
      <Skills />
      <GitHubSection />
      <About />
      <Education />
      <Contact />
    </>
  );
}
