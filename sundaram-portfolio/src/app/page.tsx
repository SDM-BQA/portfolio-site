import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Education } from "@/components/education/Education";
import { Hero } from "@/components/hero/Hero";
import { LoadingScreen } from "@/components/hero/LoadingScreen";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { Skills } from "@/components/skills/Skills";
import { TerminalSection } from "@/components/terminal/TerminalSection";
import { Timeline } from "@/components/timeline/Timeline";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Hero />
      <Timeline />
      <ProjectsSection />
      <Education />
      <TerminalSection />
      <About />
      <Skills />
      <Contact />
    </>
  );
}
