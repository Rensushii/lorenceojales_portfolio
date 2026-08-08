'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { PROJECTS, PROJECT_BG_CLASS } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { TechTag } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import type { Project } from '../../_types';

function ProjectCard({ project }: { project: Project }) {
  const openModal = useUIStore((s) => s.openModal);
  const bgColor = PROJECT_BG_CLASS[project.bgClass] ?? '#0a0a1a';

  return (
    <motion.button
      variants={staggerItem}
      onClick={() => openModal(project.id)}
      className="group relative isolate flex min-h-[260px] w-full items-stretch overflow-hidden rounded-md border border-white/5 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan/35 hover:shadow-card-hover sm:min-h-[250px] sm:rounded-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030711] via-[#030711]/70 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-[#030711]/60 sm:to-[#030711]" />
      <div className="absolute inset-0 z-[1] [background:radial-gradient(ellipse_at_35%_50%,transparent_45%,rgba(3,7,17,0.4)_100%)]" />

      <div className="relative z-[3] ml-auto mt-auto w-full max-w-full p-4 sm:w-[42%] sm:min-w-[260px] sm:p-7">
        <h3 className="mb-1 text-[1.05rem] font-extrabold leading-tight tracking-tight text-white sm:text-xl">
          {project.title}
        </h3>
        <p className="mb-2 max-w-[420px] text-[0.76rem] leading-relaxed text-text-secondary sm:text-[0.82rem]">
          {project.description}
        </p>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <TechTag key={tag}>{tag}</TechTag>
          ))}
        </div>
        <span className="mt-0.5 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-accent-cyan transition-all group-hover:gap-3 group-hover:text-cyan-300">
          View more information <ArrowRight size={14} />
        </span>
      </div>
    </motion.button>
  );
}

function ProjectModal({ project }: { project: Project }) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const openLightbox = useUIStore((s) => s.openLightbox);
  const { modalContent: mc } = project;

  return (
    <Modal isOpen={activeModal === project.id} onClose={closeModal} labelledBy={`${project.id}-title`}>
      <h2 id={`${project.id}-title`} className="mb-1 pr-9 text-[1.3rem] font-extrabold tracking-tight text-white">
        {project.title}
      </h2>
      <p className="mb-3.5 text-sm font-medium text-accent-cyan">{mc.subtitle}</p>

      {mc.awardLink && (
        <div className="mb-2.5 rounded-md border border-accent-gold/25 bg-accent-gold/[0.06] p-3">
          <span className="text-[0.85rem] font-bold text-accent-gold">
            🏆 2nd Place Winner — Hack the Future: Smart Batangas Province Hackathon Challenge
          </span>
        </div>
      )}

      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 mt-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-btn px-4 py-2 text-[0.8rem] font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <ExternalLink size={14} /> View Live Site
        </a>
      )}

      {project.gallery.length > 0 && (
        <div className="my-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {project.gallery.map((src, i) => (
            <button
              key={src}
              onClick={() => openLightbox(project.gallery, i)}
              className="relative h-[100px] overflow-hidden rounded-sm border border-white/[0.08] transition-all hover:scale-[1.03] hover:border-accent-cyan sm:h-[120px]"
            >
              <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill sizes="200px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2 text-[0.82rem] leading-relaxed text-text-secondary">
        {mc.problem && (
          <>
            <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">The Problem</h3>
            <p>{mc.problem}</p>
          </>
        )}
        {mc.solution && (
          <>
            <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">The Solution</h3>
            <p>{mc.solution}</p>
          </>
        )}
        {mc.overview && (
          <>
            <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">Overview</h3>
            <p>{mc.overview}</p>
          </>
        )}
        {mc.results && (
          <>
            <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">The Results</h3>
            <p>{mc.results}</p>
          </>
        )}
        {mc.features && (
          <>
            <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">Key Features</h3>
            <ul className="list-disc space-y-1 pl-[18px]">
              {mc.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}

        <h3 className="mt-4 mb-1.5 text-base font-bold tracking-tight text-white">Tech Stack</h3>
        <div className="flex flex-wrap gap-1.5">
          {mc.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-2.5 py-1 font-mono text-[0.7rem] text-text-primary"
            >
              {t}
            </span>
          ))}
        </div>

        {mc.awardLink && (
          <p className="mt-3 italic text-text-muted">
            Recognized 2nd Place — a team effort demonstrating rapid prototyping, AI integration, and
            civic technology innovation.
          </p>
        )}
      </div>
    </Modal>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative border-y border-white/5 bg-[rgba(10,15,25,0.4)] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(59,130,246,0.25)', width: 200, height: 200, top: '20%', left: '-8%' }} />
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '50%', right: '-10%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            Projects
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Featured work
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-[18px]"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>

      {PROJECTS.map((project) => (
        <ProjectModal key={project.id} project={project} />
      ))}
    </section>
  );
}
