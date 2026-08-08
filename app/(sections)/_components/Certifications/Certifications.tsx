'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { CERTIFICATIONS, CERT_CATEGORY_LABELS } from '../../_lib/constants';
import { fadeUp } from '../../_lib/animations';
import { CertTag } from '@/components/ui/Badge';
import { cn } from '../../_lib/utils';
import { useUIStore } from '@/store/useUIStore';
import type { CertificationCategory } from '../../_types';

const FILTERS: (CertificationCategory | 'all')[] = [
  'all',
  'webinar',
  'icpep',
  'training',
  'seminar',
  'hackathon',
];

export function Certifications() {
  const certFilter = useUIStore((s) => s.certFilter);
  const setCertFilter = useUIStore((s) => s.setCertFilter);
  const openLightbox = useUIStore((s) => s.openLightbox);

  const filtered =
    certFilter === 'all'
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.categories.includes(certFilter));

  const allImages = filtered.map((c) => c.imgUrl);

  return (
    <section id="certifications" className="relative bg-[rgba(6,10,20,0.5)] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(99,102,241,0.2)', width: 170, height: 170, top: '10%', left: '-5%' }} />
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '40%', right: '-8%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            Credentials
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Certifications & Trainings
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setCertFilter(filter)}
              className={cn(
                'rounded-full border px-5 py-2 font-sans text-[0.75rem] font-semibold backdrop-blur-sm transition-colors',
                certFilter === filter
                  ? 'border-accent-cyan bg-accent-cyan text-[#030711] shadow-[0_4px_14px_rgba(6,182,212,0.3)]'
                  : 'border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-accent-cyan hover:bg-accent-cyan/[0.15] hover:text-white'
              )}
            >
              {CERT_CATEGORY_LABELS[filter]}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((cert, i) => (
            <motion.div
              layout
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (i % 6) * 0.04 }}
              className="overflow-hidden rounded-[20px] border border-white/5 bg-[rgba(10,16,30,0.6)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
            >
              <button
                onClick={() => openLightbox(allImages, i)}
                className="relative block aspect-[4/3] w-full overflow-hidden border-b border-white/5 transition-transform hover:scale-[1.02]"
              >
                <Image src={cert.imgUrl} alt={cert.title} fill sizes="360px" className="object-cover" />
              </button>
              <div className="px-4 pb-5 pt-4">
                <div className="mb-1.5 text-[0.9rem] font-extrabold leading-snug tracking-tight text-text-primary">
                  {cert.title}
                </div>
                <div className="mb-2 flex items-center gap-1.5 font-mono text-[0.7rem] text-accent-cyan">
                  <Calendar size={12} /> {cert.date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cert.categories.map((cat) => (
                    <CertTag key={cat}>{CERT_CATEGORY_LABELS[cat]}</CertTag>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
