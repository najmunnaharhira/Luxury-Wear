import { useInView } from "framer-motion";
import { useRef, RefObject } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
}

export const useScrollReveal = (
  options: UseScrollRevealOptions = {}
): {
  ref: RefObject<HTMLDivElement>;
  isInView: boolean;
} => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: options.threshold || 0.2,
    once: options.once !== false,
  });

  return { ref: ref as RefObject<HTMLDivElement>, isInView };
};
