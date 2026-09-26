import React, { useRef, useEffect } from 'react';

interface UseBottomSheetGestureOptions {
  chatWindowRef: React.RefObject<HTMLDivElement | null>;
  isExpandedMobile: boolean;
  setIsExpandedMobile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

export function useBottomSheetGesture({
  chatWindowRef,
  isExpandedMobile,
  setIsExpandedMobile,
  setIsOpen,
  disabled = false,
}: UseBottomSheetGestureOptions) {
  const dragRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  const handleMobileSheetPointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture fallback
    }

    const startY = e.clientY;
    let currentDy = 0;
    let hasSwiped = false;
    const startTime = performance.now();

    const onPointerMove = (moveEv: PointerEvent) => {
      const deltaY = moveEv.clientY - startY;
      if (!hasSwiped && Math.abs(deltaY) > 5) {
        hasSwiped = true;
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transition = 'none';
        }
      }
      if (hasSwiped) {
        currentDy = deltaY;
        if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = requestAnimationFrame(() => {
          if (chatWindowRef.current) {
            if (currentDy > 0) {
              // Downward dragging
              chatWindowRef.current.style.transform = `translate3d(0, ${currentDy}px, 0)`;
            } else {
              // Upward dragging: visual elastic feedback
              const upwardResistance = isExpandedMobile ? 0.15 : 0.45;
              const visualDy = Math.max(-90, currentDy * upwardResistance);
              chatWindowRef.current.style.transform = `translate3d(0, ${visualDy}px, 0)`;
            }
          }
        });
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId);
      } catch {
        // Ignore
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }

      const duration = performance.now() - startTime;
      const velocity = currentDy / Math.max(1, duration); // px per ms (positive = down, negative = up)

      if (hasSwiped && chatWindowRef.current) {
        if (currentDy < -30 || velocity < -0.28) {
          // Upward swipe: expand to fullscreen
          setIsExpandedMobile(true);
          chatWindowRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
          chatWindowRef.current.style.transform = 'translate3d(0, 0, 0)';
          setTimeout(() => {
            if (chatWindowRef.current) {
              chatWindowRef.current.style.transform = '';
              chatWindowRef.current.style.transition = '';
            }
          }, 260);
        } else if (currentDy > 0) {
          // Downward swipe
          if (isExpandedMobile) {
            if (currentDy > 160 || velocity > 0.8) {
              // Deep swipe dismisses completely
              chatWindowRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out';
              chatWindowRef.current.style.transform = 'translate3d(0, 100%, 0)';
              chatWindowRef.current.style.opacity = '0';
              setTimeout(() => {
                setIsOpen(false);
                setIsExpandedMobile(false);
                if (chatWindowRef.current) {
                  chatWindowRef.current.style.transform = '';
                  chatWindowRef.current.style.opacity = '';
                  chatWindowRef.current.style.transition = '';
                }
              }, 220);
            } else if (currentDy > 40 || velocity > 0.3) {
              // Moderate swipe down collapses from fullscreen back to standard 85dvh
              setIsExpandedMobile(false);
              chatWindowRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
              chatWindowRef.current.style.transform = 'translate3d(0, 0, 0)';
              setTimeout(() => {
                if (chatWindowRef.current) {
                  chatWindowRef.current.style.transform = '';
                  chatWindowRef.current.style.transition = '';
                }
              }, 260);
            } else {
              // Short drag springs back to fullscreen
              chatWindowRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
              chatWindowRef.current.style.transform = 'translate3d(0, 0, 0)';
              setTimeout(() => {
                if (chatWindowRef.current) {
                  chatWindowRef.current.style.transform = '';
                  chatWindowRef.current.style.transition = '';
                }
              }, 260);
            }
          } else {
            // Standard 85dvh sheet: downward swipe dismisses or springs back
            if (currentDy > 90 || velocity > 0.45) {
              chatWindowRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out';
              chatWindowRef.current.style.transform = 'translate3d(0, 100%, 0)';
              chatWindowRef.current.style.opacity = '0';
              setTimeout(() => {
                setIsOpen(false);
                if (chatWindowRef.current) {
                  chatWindowRef.current.style.transform = '';
                  chatWindowRef.current.style.opacity = '';
                  chatWindowRef.current.style.transition = '';
                }
              }, 220);
            } else {
              chatWindowRef.current.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
              chatWindowRef.current.style.transform = 'translate3d(0, 0, 0)';
              setTimeout(() => {
                if (chatWindowRef.current) {
                  chatWindowRef.current.style.transform = '';
                  chatWindowRef.current.style.transition = '';
                }
              }, 300);
            }
          }
        } else {
          // Neutral release springs back
          chatWindowRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
          chatWindowRef.current.style.transform = 'translate3d(0, 0, 0)';
          setTimeout(() => {
            if (chatWindowRef.current) {
              chatWindowRef.current.style.transform = '';
              chatWindowRef.current.style.transition = '';
            }
          }, 260);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return { handleMobileSheetPointerDown };
}
