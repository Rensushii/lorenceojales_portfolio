'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/app/(sections)/_lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonBaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-btn text-white border border-white/10 shadow-[0_6px_28px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_36px_rgba(6,182,212,0.45)] hover:-translate-y-0.5',
  secondary:
    'bg-white/[0.03] text-text-primary border-[1.5px] border-white/15 backdrop-blur-md hover:border-accent-cyan/50 hover:bg-accent-cyan/[0.06] hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-text-secondary hover:text-white hover:bg-accent-cyan/10',
};

const baseClasses =
  'inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm tracking-tight transition-all duration-300 ease-out active:scale-[0.97] whitespace-nowrap';

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant = 'primary', className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(baseClasses, variantClasses[variant], className)}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = 'Button';

interface LinkButtonProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
}

export function LinkButton({
  href,
  external,
  variant = 'primary',
  className,
  children,
}: LinkButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
