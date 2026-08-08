'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters').max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormValues) {
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const inputClasses =
    'w-full rounded-full border-[1.5px] border-white/[0.06] bg-white/[0.02] px-[18px] py-3.5 text-[0.85rem] text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-accent-cyan focus:bg-accent-cyan/[0.03] focus:shadow-[0_0_0_4px_rgba(6,182,212,0.08)]';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div>
        <input
          {...register('name')}
          type="text"
          placeholder="Your name"
          className={inputClasses}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="mt-1 pl-2 text-xs text-accent-rose">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Your email"
          className={inputClasses}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="mt-1 pl-2 text-xs text-accent-rose">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Your message..."
          className={`${inputClasses} resize-y rounded-[18px]`}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="mt-1 pl-2 text-xs text-accent-rose">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-gradient-btn px-[22px] py-3 text-[0.85rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(6,182,212,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'submitting' && (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Sending...
            </motion.span>
          )}
          {status === 'success' && (
            <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Sent!
            </motion.span>
          )}
          {status === 'error' && (
            <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <XCircle size={16} /> Failed — try again
            </motion.span>
          )}
          {status === 'idle' && (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Send size={16} /> Send Message
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}
