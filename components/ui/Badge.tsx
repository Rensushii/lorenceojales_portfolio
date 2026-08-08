import { cn } from '@/app/(sections)/_lib/utils';

const dotColors: Record<string, string> = {
  cyan: 'bg-accent-cyan shadow-[0_0_6px_rgba(6,182,212,0.6)]',
  blue: 'bg-accent-blue shadow-[0_0_6px_rgba(59,130,246,0.6)]',
  indigo: 'bg-accent-indigo shadow-[0_0_6px_rgba(99,102,241,0.6)]',
  emerald: 'bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.6)]',
  gold: 'bg-accent-gold shadow-[0_0_6px_rgba(245,158,11,0.6)]',
};

interface SpecBadgeProps {
  color: keyof typeof dotColors;
  children: React.ReactNode;
}

export function SpecBadge({ color, children }: SpecBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.07] hover:text-white hover:shadow-[0_4px_16px_rgba(6,182,212,0.1)]">
      <span className={cn('h-[5px] w-[5px] flex-shrink-0 rounded-full', dotColors[color])} />
      {children}
    </span>
  );
}

export function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.08] px-2.5 py-1 font-mono text-[0.68rem] font-medium text-cyan-300 transition-all group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/[0.14] group-hover:shadow-[0_0_14px_rgba(6,182,212,0.2)]">
      {children}
    </span>
  );
}

export function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="cursor-default rounded-full border border-accent-cyan/[0.15] bg-accent-cyan/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.06] hover:border-accent-cyan hover:bg-accent-cyan/[0.16] hover:text-white hover:shadow-[0_6px_16px_rgba(6,182,212,0.2)]">
      {children}
    </span>
  );
}

export function CertTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-accent-cyan/25 bg-accent-cyan/10 px-2.5 py-[3px] text-[0.6rem] font-semibold uppercase tracking-wide text-cyan-200">
      {children}
    </span>
  );
}

export function MedalBadge({
  type,
  children,
}: {
  type: 'silver' | 'participant' | 'gold' | 'bronze';
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    silver: 'bg-gradient-to-br from-[#a0a0a0] to-[#d0d0d0] text-[#1a1a1a]',
    participant: 'bg-gradient-to-br from-accent-indigo to-[#818cf8] text-white',
    gold: 'bg-gradient-to-br from-accent-gold to-[#fbbf24] text-[#1a1a1a]',
    bronze: 'bg-gradient-to-br from-[#b08d57] to-[#d4a76a] text-[#1a1a1a]',
  };
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide',
        styles[type]
      )}
    >
      {children}
    </span>
  );
}
