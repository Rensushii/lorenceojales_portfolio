'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Server, BrainCircuit, Wrench, type LucideIcon } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { Card } from '@/components/ui/Card';
import { SkillTag } from '@/components/ui/Badge';

const ICONS: Record<string, LucideIcon> = {
  Code2,
  Cpu,
  Server,
  BrainCircuit,
  Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="relative border-y border-white/5 bg-white/[0.03] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(59,130,246,0.25)', width: 200, height: 200, top: '15%', right: '-10%' }} />
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '70%', left: '-8%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            Skills
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Technical expertise
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SKILL_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Code2;
            return (
              <motion.div key={cat.title} variants={staggerItem}>
                <Card className="!p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-[0.9rem] font-bold tracking-tight text-white">
                    <Icon size={16} className="text-accent-cyan" /> {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
