'use client';

import { motion } from 'framer-motion';
import { Rocket, User, MapPin, Phone, Mail, Landmark } from 'lucide-react';
import { PERSONAL_INFO } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { Card } from '@/components/ui/Card';

const infoRows = [
  { icon: User, label: 'Full Name', value: PERSONAL_INFO.fullName },
  { icon: MapPin, label: 'Address', value: PERSONAL_INFO.address },
  { icon: Phone, label: 'Contact No.', value: PERSONAL_INFO.phone },
  { icon: Mail, label: 'Email', value: PERSONAL_INFO.email },
  { icon: Landmark, label: 'University Email', value: PERSONAL_INFO.universityEmail },
];

export function About() {
  return (
    <section id="about" className="relative border-y border-white/5 bg-white/[0.03] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(6,182,212,0.3)', width: 260, height: 260, top: '5%', left: '-8%' }} />
      <div className="section-orb" style={{ background: 'rgba(59,130,246,0.25)', width: 200, height: 200, top: '55%', right: '-10%' }} />

      <div className="relative z-[5] mx-auto max-w-[1100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 text-center"
        >
          <span className="mb-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent-cyan">
            About Me
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Get to know me
          </h2>
          <div className="mx-auto mt-3.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-wrap gap-5"
        >
          <motion.div variants={staggerItem} className="flex-[2_1_450px]">
            <Card tone="light">
              <div className="mb-3 h-[3px] w-9 rounded-full bg-accent-cyan" />
              <h3 className="mb-1 text-2xl font-extrabold tracking-tight text-white">My Journey</h3>
              <span className="mb-3.5 block text-sm font-medium text-accent-cyan">
                From Computer Engineering Student to Technology Builder
              </span>
              <p className="mb-2.5 text-[0.88rem] leading-[1.75] text-text-secondary">
                I&apos;m <strong className="text-text-primary">Lorence Ojales</strong>, a Computer
                Engineering graduate passionate about building intelligent systems that combine{' '}
                <strong className="text-text-primary">software, hardware, and data</strong>. My
                experience spans full-stack web development, IoT, embedded systems, artificial
                intelligence, and analytics.
              </p>
              <p className="mb-2.5 text-[0.88rem] leading-[1.75] text-text-secondary">
                I&apos;ve developed projects including <strong className="text-text-primary">Eco Flow</strong>,
                an AI-powered greenhouse automation system, <strong className="text-text-primary">MazeBot</strong>,
                an autonomous wall-following robot, <strong className="text-text-primary">GenbaCheck Attendance</strong>,
                an offline-first IoT event check-in system, <strong className="text-text-primary">NYC Crash Analytics</strong>,
                a full-stack data visualization platform, and <strong className="text-text-primary">TugonLipa</strong>,
                an award-winning smart community solution that earned{' '}
                <strong className="text-text-primary">2nd Place</strong> at the Hack the Future Hackathon.
              </p>
              <p className="text-[0.88rem] leading-[1.75] text-text-secondary">
                With experience in IT support, software development, and emerging technologies, I
                enjoy transforming complex problems into practical, user-focused solutions that
                create real-world impact.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.06] px-3.5 py-2 text-[0.78rem] font-medium text-cyan-300">
                <Rocket size={14} /> Exploring: AI-powered apps, IoT systems, embedded dev & full-stack
                engineering
              </span>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="flex-[1_1_260px]">
            <Card tone="light">
              <h3 className="mb-2.5 flex items-center gap-1.5 text-[0.95rem] font-bold text-white">
                <User size={16} className="text-accent-cyan" /> Details
              </h3>
              <div className="flex flex-col">
                {infoRows.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={
                      'flex items-start gap-2.5 py-2' +
                      (i !== infoRows.length - 1 ? ' border-b border-white/[0.04]' : '')
                    }
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-cyan/[0.08] text-accent-cyan">
                      <Icon size={14} />
                    </div>
                    <div>
                      <div className="mb-0.5 text-[0.65rem] uppercase tracking-wide text-text-muted">
                        {label}
                      </div>
                      <div className="break-all text-[0.82rem] font-medium text-text-primary">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
