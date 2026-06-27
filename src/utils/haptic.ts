// Web-based silent physical vibration haptics (no audio sound effects)
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'scroll' = 'light') {
  // Browser Vibration API (Silent, native device vibrator only)
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'scroll':
          navigator.vibrate(5);
          break;
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(40);
          break;
        case 'success':
          navigator.vibrate([15, 30, 15]);
          break;
      }
    } catch (e) {
      // Ignore vibration blocks/unsupported errors
    }
  }
}

// Hook scroll events of a ref element to trigger haptic feedback periodically
export function attachScrollHaptics(element: HTMLElement | null, pixelsPerTick = 45) {
  if (!element) return () => {};

  let lastScrollTop = element.scrollTop;
  let accumulatedDelta = 0;

  const handleScroll = () => {
    const currentScrollTop = element.scrollTop;
    const delta = Math.abs(currentScrollTop - lastScrollTop);
    lastScrollTop = currentScrollTop;

    accumulatedDelta += delta;
    if (accumulatedDelta >= pixelsPerTick) {
      triggerHaptic('scroll');
      accumulatedDelta = accumulatedDelta % pixelsPerTick;
    }
  };

  element.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    element.removeEventListener('scroll', handleScroll);
  };
}
