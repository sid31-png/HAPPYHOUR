import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** Tracks the OS-level "reduce motion" accessibility setting so animations can be skipped. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      setReduced(value);
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
