import React, { useEffect, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface CounterNumberProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const { ref, isRevealed } = useReveal<HTMLSpanElement>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isRevealed) return;

    let start = 0;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(update);
  }, [isRevealed, end, duration]);

  return (
    <span ref={ref} className={`font-tabular inline-block ${className}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};
