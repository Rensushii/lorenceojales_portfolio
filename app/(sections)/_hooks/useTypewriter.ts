'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

interface UseTypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseBeforeDelete?: number;
  pauseBeforeNext?: number;
}

/**
 * Cycles through a list of words with a typewriter (type + delete) effect.
 * Respects prefers-reduced-motion by simply cycling the full word with a fade.
 */
export function useTypewriter(
  words: string[],
  {
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseBeforeDelete = 2000,
    pauseBeforeNext = 500,
  }: UseTypewriterOptions = {}
) {
  const reducedMotion = usePrefersReducedMotion();
  const [text, setText] = useState(words[0] ?? '');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length === 0) {
      setText(words[0] ?? '');
      return;
    }

    let charIndex = text.length;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const currentWord = words[wordIndex % words.length];

      if (!isDeleting) {
        charIndex++;
        setText(currentWord.slice(0, charIndex));
        if (charIndex === currentWord.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, pauseBeforeDelete);
          return;
        }
        timeoutId = setTimeout(tick, typingSpeed);
      } else {
        charIndex--;
        setText(currentWord.slice(0, charIndex));
        if (charIndex === 0) {
          timeoutId = setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
          }, pauseBeforeNext);
          return;
        }
        timeoutId = setTimeout(tick, deletingSpeed);
      }
    }

    charIndex = 0;
    setText('');
    timeoutId = setTimeout(tick, typingSpeed);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, reducedMotion]);

  return text;
}
