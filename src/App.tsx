import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Metrics } from "@/components/sections/metrics";
import { Projects } from "@/components/sections/projects";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Analytics } from "@vercel/analytics/react";
import { DemoRouter } from "@/demos/router";
import { DemoGate } from "@/demos/_shared/DemoGate";

const MarketingSite = (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Metrics />
      <Projects />
      <Work />
      <Experience />
      <Contact />
    </main>
    <Analytics />
  </div>
);

function App() {
  return <DemoGate demo={<DemoRouter />} marketing={MarketingSite} />;
}

export default App;
