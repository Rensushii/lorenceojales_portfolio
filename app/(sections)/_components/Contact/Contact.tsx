'use client';

import { motion } from 'framer-motion';
import { Mail, Landmark, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import { PERSONAL_INFO } from '../../_lib/constants';
import { fadeUp, staggerContainer, staggerItem } from '../../_lib/animations';
import { Card } from '@/components/ui/Card';
import { ContactForm } from './ContactForm';

const links = [
  { icon: Mail, label: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}` },
  { icon: Landmark, label: PERSONAL_INFO.universityEmail, href: `mailto:${PERSONAL_INFO.universityEmail}` },
  { icon: Phone, label: PERSONAL_INFO.phone, href: `tel:${PERSONAL_INFO.phone}` },
  {
    icon: MapPin,
    label: PERSONAL_INFO.address,
    href: 'https://maps.google.com/?q=Lipa+City+Batangas',
    external: true,
  },
];

const socials = [
  { icon: Facebook, href: PERSONAL_INFO.socials.facebook, label: 'Facebook' },
  { icon: Instagram, href: PERSONAL_INFO.socials.instagram, label: 'Instagram' },
  { icon: Linkedin, href: PERSONAL_INFO.socials.linkedin, label: 'LinkedIn' },
  { icon: Github, href: PERSONAL_INFO.socials.github, label: 'GitHub' },
];

export function Contact() {
  return (
    <section id="contact" className="relative border-y border-white/5 bg-white/[0.03] px-4 py-16 sm:py-20">
      <div className="section-orb" style={{ background: 'rgba(99,102,241,0.2)', width: 170, height: 170, top: '20%', left: '-10%' }} />
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
            Contact
          </span>
          <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
            Let&apos;s connect
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
          <motion.div variants={staggerItem} className="flex-[1_1_280px]">
            <Card>
              <h3 className="mb-3 flex items-center gap-1.5 text-[0.95rem] font-bold text-white">
                <Send size={16} className="text-accent-cyan" /> Reach me
              </h3>
              {links.map(({ icon: Icon, label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-2.5 border-b border-white/[0.04] py-2.5 text-[0.82rem] text-text-secondary transition-colors last:border-b-0 hover:text-white"
                >
                  <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-accent-cyan/[0.08] text-accent-cyan transition-all group-hover:bg-accent-cyan/[0.18]">
                    <Icon size={14} />
                  </span>
                  <span className="break-all">{label}</span>
                </a>
              ))}

              <div className="mt-3.5 flex flex-wrap gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-text-secondary transition-all hover:-translate-y-1 hover:border-accent-cyan hover:bg-accent-cyan hover:text-white hover:shadow-[0_10px_24px_rgba(6,182,212,0.35)]"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="flex-[2_1_380px]">
            <Card>
              <h3 className="mb-3 flex items-center gap-1.5 text-[0.95rem] font-bold text-white">
                <Send size={16} className="text-accent-cyan" /> Send a message
              </h3>
              <ContactForm />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
