import { cn } from "@/lib/utils";
import { useMotionValue, animate, motion } from "framer-motion";
import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useMeasure();
  const [contentRef, { width: contentWidth, height: contentHeight }] =
    useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  const isHorizontal = direction === "horizontal";
  const contentSpan = isHorizontal ? contentWidth : contentHeight;
  const containerSpan = isHorizontal ? containerWidth : containerHeight;

  // One full period = the size of a single content group plus the trailing gap.
  const period = contentSpan + gap;
  const measured = contentSpan > 0;

  // Repeat the content enough times to cover the container at least twice so the
  // marquee never leaves an empty gap, regardless of how wide the page is.
  const copies =
    measured && containerSpan > 0
      ? Math.max(2, Math.ceil(containerSpan / period) + 2)
      : 2;

  useEffect(() => {
    if (!measured) return;

    let controls;
    const from = reverse ? -period : 0;
    const to = reverse ? 0 : -period;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / period),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    period,
    measured,
    isTransitioning,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max transition-opacity duration-500"
        style={{
          ...(isHorizontal ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: isHorizontal ? "row" : "column",
          opacity: measured ? 1 : 0,
        }}
        {...hoverProps}
      >
        {Array.from({ length: copies }).map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? contentRef : undefined}
            aria-hidden={index > 0}
            className="flex shrink-0"
            style={{
              gap: `${gap}px`,
              flexDirection: isHorizontal ? "row" : "column",
            }}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
