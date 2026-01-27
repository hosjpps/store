"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

// Ease-out cubic function for smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedCounter({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const formatNumber = useCallback(
    (value: number): string => {
      return value.toFixed(decimals);
    },
    [decimals]
  );

  const animate = useCallback(() => {
    const startTime = performance.now();
    const startValue = 0;

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing function
      const easedProgress = easeOutCubic(progress);

      // Calculate current value
      const currentValue = startValue + (target - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateValue);
      } else {
        // Ensure we end exactly at the target value
        setDisplayValue(target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateValue);
  }, [target, duration]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animate();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, hasAnimated]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
