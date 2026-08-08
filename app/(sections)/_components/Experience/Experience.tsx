'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { EXPERIENCES, EDUCATION } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { Card } from '@/components/ui/Card';

export function Experience() {
  return (
    <section id="experience" className="relative bg-[rgba(6,10,20,0.5)] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(99,102,241,0.2)', width: 170, height: 170, top: '10%', right: '-6%' }} />
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '60%', left: '-10%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            Experience & Education
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Where I&apos;ve worked & studied
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <Card className="mb-5">
            <h3 className="mb-4 flex items-center gap-1.5 text-base font-bold text-white">
              <Briefcase size={16} className="text-accent-cyan" /> Work Experience
            </h3>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative pl-6"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformOrigin: 'top' }}
                className="absolute bottom-0 left-2 top-0 w-[2px] rounded bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-cyan/10"
              />

              {EXPERIENCES.map((exp) => (
                <motion.div key={exp.title} variants={staggerItem} className="relative mb-6 pl-4">
                  <span className="absolute -left-[20px] top-1.5 h-2.5 w-2.5 rounded-full border-[3px] border-[#030711] bg-accent-cyan shadow-[0_0_16px_rgba(6,182,212,0.5)]" />
                  <div className="mb-0.5 font-mono text-[0.72rem] font-semibold tracking-wide text-accent-emerald">
                    {exp.date}
                  </div>
                  <div className="mb-0.5 text-[1.05rem] font-bold tracking-tight text-white">
                    {exp.title}
                  </div>
                  <div className="mb-1.5 text-[0.82rem] text-text-secondary">{exp.org}</div>
                  <ul className="list-none text-[0.78rem] leading-relaxed text-text-muted">
                    {exp.details.map((d) => (
                      <li key={d} className="relative mb-0.5 pl-3">
                        <span className="absolute left-0 font-bold text-accent-cyan">›</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </Card>

          <Card>
            <h3 className="mb-2.5 flex items-center gap-1.5 text-base font-bold text-white">
              <GraduationCap size={16} className="text-accent-cyan" /> Education
            </h3>
            <div className="py-1.5">
              <div className="text-[1.05rem] font-bold tracking-tight text-white">{EDUCATION.title}</div>
              <div className="text-[0.82rem] text-text-secondary">{EDUCATION.org}</div>
              <div className="font-mono text-[0.72rem] font-semibold text-accent-emerald">{EDUCATION.date}</div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
