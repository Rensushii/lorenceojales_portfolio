'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../_lib/constants';
import { scrollToSection, cn } from '../../_lib/utils';
import { useUIStore } from '@/store/useUIStore';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav);
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);

      let current = 'home';
      NAV_LINKS.forEach((link) => {
        const section = document.querySelector(link.href) as HTMLElement | null;
        if (section && window.scrollY >= section.offsetTop - 140) {
          current = link.href.replace('#', '');
        }
      });
      setActiveSection(current);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleNavClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    scrollToSection(href);
    closeMobileNav();
  }

  return (
    <header
      className="fixed left-0 right-0 z-[1000] mx-auto max-w-[1150px] px-4"
      style={{ top: 'max(10px, env(safe-area-inset-top, 0px))' }}
    >
      <div
        className={cn(
          'flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300',
          'border-white/[0.08] bg-[rgba(8,14,26,0.8)] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
          scrolled &&
            'border-accent-cyan/30 bg-[rgba(8,14,26,0.94)] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(6,182,212,0.15)]'
        )}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex flex-shrink-0 items-center gap-2 text-[1.1rem] font-extrabold tracking-tight text-white"
        >
          <span className="inline-block h-2 w-2 flex-shrink-0 animate-pulse-dot rounded-full bg-accent-cyan" />
          <span className="gradient-text">Lorence Ojales</span>
        </a>

        <nav>
          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8rem] font-medium tracking-tight text-text-secondary transition-colors hover:bg-accent-cyan/10 hover:text-white',
                      isActive && 'bg-accent-cyan/[0.18] font-semibold text-white'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            onClick={toggleMobileNav}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/[0.06] md:hidden"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-3 right-3 top-[75px] z-[999] flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto rounded-3xl border border-accent-cyan/30 bg-[rgba(8,14,26,0.97)] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl md:hidden"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'rounded-2xl px-4 py-3.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-accent-cyan/[0.14]',
                    isActive && 'bg-accent-cyan/[0.14]'
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
