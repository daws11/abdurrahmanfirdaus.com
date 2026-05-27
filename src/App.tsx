import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Projects } from "@/components/sections/projects";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Contact />
        <Projects />
      </main>
      <Analytics />
    </div>
  );
}

export default App;
