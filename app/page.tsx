import { Header } from './(sections)/_components/Header/Header';
import { Hero } from './(sections)/_components/Hero/Hero';
import { About } from './(sections)/_components/About/About';
import { Experience } from './(sections)/_components/Experience/Experience';
import { Projects } from './(sections)/_components/Projects/Projects';
import { Achievements } from './(sections)/_components/Achievements/Achievements';
import { Skills } from './(sections)/_components/Skills/Skills';
import { Certifications } from './(sections)/_components/Certifications/Certifications';
import { Contact } from './(sections)/_components/Contact/Contact';
import { Footer } from './(sections)/_components/Footer';
import { ResumeModal } from './(sections)/_components/ResumeModal';
import { Lightbox } from '@/components/ui/Lightbox';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Achievements />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />

      {/* Global overlays */}
      <ResumeModal />
      <Lightbox />
    </main>
  );
}
