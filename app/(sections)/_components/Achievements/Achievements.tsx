'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { ACHIEVEMENTS } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { MedalBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import type { Achievement } from '../../_types';

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <motion.button
      variants={staggerItem}
      onClick={() => openModal(`ach-${achievement.id}`)}
      className="group relative isolate flex min-h-[220px] flex-col justify-end overflow-hidden rounded-lg border border-white/5 p-4 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan/35 hover:shadow-card-hover sm:min-h-[280px] sm:p-5.5"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${achievement.image})` }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#030711] via-[#030711]/70 to-transparent" />

      <div className="relative z-[3]">
        <MedalBadge type={achievement.badge}>
          {achievement.badge === 'silver' ? '2nd Place' : 'Participant'}
        </MedalBadge>
        <h3 className="mt-2 text-[0.95rem] font-extrabold leading-tight tracking-tight text-white sm:text-[1.15rem]">
          {achievement.title}
        </h3>
        <p className="mt-0.5 text-[0.74rem] font-medium text-[#b0c4de] sm:text-[0.82rem]">
          {achievement.subtitle}
        </p>
        <p className="text-[0.68rem] text-text-secondary sm:text-[0.72rem]">{achievement.venue}</p>
        <p className="mb-2 font-mono text-[0.62rem] text-text-muted sm:text-[0.7rem]">{achievement.date}</p>
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-accent-cyan transition-all group-hover:gap-3 group-hover:text-cyan-300 sm:text-[0.78rem]">
          View details <ArrowRight size={13} />
        </span>
      </div>
    </motion.button>
  );
}

function AchievementModal({ achievement }: { achievement: Achievement }) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const modalId = `ach-${achievement.id}`;

  return (
    <Modal isOpen={activeModal === modalId} onClose={closeModal} labelledBy={`${modalId}-title`}>
      <div className="relative mb-3.5 h-56 w-full overflow-hidden rounded-sm border border-white/[0.08] sm:h-72">
        <Image src={achievement.image} alt={achievement.title} fill sizes="900px" className="object-cover" />
      </div>
      <h2 id={`${modalId}-title`} className="mb-1 pr-9 text-[1.3rem] font-extrabold tracking-tight text-white">
        {achievement.title}
      </h2>
      <p className="mb-1.5 text-sm font-medium text-accent-cyan">{achievement.subtitle}</p>
      <p className="mb-0.5 text-[0.8rem] text-text-secondary">{achievement.venue}</p>
      <p className="mb-2.5 font-mono text-[0.75rem] text-text-muted">{achievement.date}</p>
      <p className="text-[0.82rem] leading-relaxed text-text-secondary">{achievement.description}</p>
      {achievement.link && (
        <a
          href={achievement.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent-gold/30 px-3.5 py-1.5 text-[0.78rem] font-semibold text-accent-gold transition-colors hover:bg-accent-gold/[0.08] hover:text-amber-400"
        >
          <ExternalLink size={13} /> Read Article
        </a>
      )}
    </Modal>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(99,102,241,0.2)', width: 170, height: 170, top: '30%', left: '-10%' }} />
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '60%', right: '-8%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            Achievements
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Awards & Competitions
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </motion.div>
      </div>

      {ACHIEVEMENTS.map((achievement) => (
        <AchievementModal key={achievement.id} achievement={achievement} />
      ))}
    </section>
  );
}
