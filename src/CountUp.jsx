import { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({ value, duration = 1000, decimals = 0, lang = 'en' }) {
  const [current, setCurrent] = useState(0);
  const target = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = Number.isFinite(target);
  const startRef = useRef(null);

  useEffect(() => {
    if (!isNumeric) return;
    let frameId;
    const startVal = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = startVal + (target - startVal) * ease;
      setCurrent(val);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, isNumeric]);

  if (!isNumeric) return <>{value}</>;

  return (
    <span>
      {current.toLocaleString(lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}
