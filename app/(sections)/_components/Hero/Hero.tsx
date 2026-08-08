'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Code, FileText } from 'lucide-react';
import { ROLES } from '../../_lib/constants';
import { heroStagger } from '../../_lib/animations';
import { useTypewriter } from '../../_hooks/useTypewriter';
import { useIsMobile, usePrefersReducedMotion } from '../../_hooks/useMediaQuery';
import { scrollToSection } from '../../_lib/utils';
import { SpecBadge } from '@/components/ui/Badge';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useUIStore } from '@/store/useUIStore';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
});

export function Hero() {
  const role = useTypewriter(ROLES);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const openModal = useUIStore((s) => s.openModal);
  const show3D = !isMobile && !reducedMotion;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-20 sm:pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 25% 35%, rgba(6,182,212,0.1) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 60% 25%, rgba(59,130,246,0.08) 0%, transparent 55%)',
        }}
      />

      <div className="relative z-[5] mx-auto flex w-full max-w-[1150px] flex-wrap items-center gap-8">
        <div className="flex flex-1 flex-col items-center text-center md:min-w-[380px] md:flex-[1_1_380px] md:items-start md:text-left">
          <motion.span
            variants={heroStagger(0.05)}
            initial="hidden"
            animate="visible"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/[0.22] bg-accent-cyan/[0.07] px-3.5 py-1.5 text-[0.78rem] font-medium text-cyan-300"
          >
            👋 Hey, I&apos;m
          </motion.span>

          <motion.h1
            variants={heroStagger(0.15)}
            initial="hidden"
            animate="visible"
            className="mb-1.5 text-[clamp(2.2rem,6vw,5rem)] font-black leading-[1.04] tracking-[-0.045em] text-white"
          >
            <span className="gradient-text block">Lorence B. Ojales</span>
          </motion.h1>

          <motion.div
            variants={heroStagger(0.28)}
            initial="hidden"
            animate="visible"
            className="mb-3.5 flex h-8 items-center justify-center overflow-hidden md:justify-start"
          >
            <span className="whitespace-nowrap font-mono text-base font-semibold text-cyan-300">
              {role}
            </span>
            <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-300 align-text-bottom" />
          </motion.div>

          <motion.p
            variants={heroStagger(0.4)}
            initial="hidden"
            animate="visible"
            className="mb-4 max-w-[480px] text-[0.95rem] leading-relaxed text-text-secondary"
          >
            Designing <strong className="font-semibold text-text-primary">intelligent systems</strong>,
            building <strong className="font-semibold text-text-primary">embedded solutions</strong>, and
            creating <strong className="font-semibold text-text-primary">innovative technologies</strong>{' '}
            that bridge hardware and software.
          </motion.p>

          <motion.div
            variants={heroStagger(0.52)}
            initial="hidden"
            animate="visible"
            className="mb-5 flex flex-wrap justify-center gap-1.5 md:justify-start"
          >
            <SpecBadge color="cyan">Computer Engineering</SpecBadge>
            <SpecBadge color="blue">Embedded Systems</SpecBadge>
            <SpecBadge color="indigo">IoT</SpecBadge>
            <SpecBadge color="emerald">Robotics</SpecBadge>
            <SpecBadge color="gold">Software Dev</SpecBadge>
          </motion.div>

          <motion.div
            variants={heroStagger(0.64)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2.5 md:justify-start"
          >
            <MagneticButton>
              <button
                onClick={() => scrollToSection('#projects')}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-gradient-btn px-[22px] py-3 text-[0.85rem] font-semibold tracking-tight text-white shadow-[0_6px_28px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(6,182,212,0.45)] active:scale-[0.97]"
              >
                <Code size={16} /> View Projects
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={() => openModal('modal-resume')}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-white/15 bg-white/[0.03] px-[22px] py-3 text-[0.85rem] font-semibold tracking-tight text-text-primary backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent-cyan/50 hover:bg-accent-cyan/[0.06] active:scale-[0.97]"
              >
                <FileText size={16} /> View Resume
              </button>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          variants={heroStagger(0.35)}
          initial="hidden"
          animate="visible"
          className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-[22px] shadow-[0_30px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(6,182,212,0.2),0_0_80px_rgba(6,182,212,0.06)] md:aspect-[4/5] md:max-w-[440px] md:rounded-[28px]"
        >
          {show3D ? (
            <Scene imageA="/images/profile/barong.png" imageB="/images/profile/toga.png" />
          ) : (
            <Image
              src="/images/profile/barong.png"
              alt="Lorence Ojales"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-cover"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
