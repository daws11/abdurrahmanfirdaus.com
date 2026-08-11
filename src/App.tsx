import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { ProjectPage } from "@/components/sections/ProjectPage";
import { Analytics } from "@vercel/analytics/react";
import { DemoRouter } from "@/demos/router";
import { DemoGate } from "@/demos/_shared/DemoGate";
import { Resume } from "@/routes/Resume";

const MarketingSite = (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Contact />
    </main>
    <Analytics />
  </div>
);

const ProjectSite = (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Navbar />
    <main>
      <ProjectPage />
    </main>
    <Analytics />
  </div>
);

function App() {
  if (typeof window !== "undefined" && window.location.pathname === "/resume") {
    return <Resume />;
  }
  return (
    <DemoGate demo={<DemoRouter />} marketing={MarketingSite} project={ProjectSite} />
  );
}

export default App;