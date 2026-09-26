import React, { useRef, useEffect } from 'react';

interface UseDraggableWindowOptions {
  chatWindowRef: React.RefObject<HTMLDivElement | null>;
  windowPos: { x: number; y: number } | null;
  windowSize: { width: number; height: number };
  setWindowPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  disabled?: boolean;
}

export function useDraggableWindow({
  chatWindowRef,
  windowPos,
  windowSize,
  setWindowPos,
  disabled = false,
}: UseDraggableWindowOptions) {
  const dragRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  const handleDesktopDragStart = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture fallback
    }

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const currentPos = windowPos || { x: rect.left, y: rect.top };
    let curX = currentPos.x;
    let curY = currentPos.y;
    let lastX = e.clientX;
    let lastY = e.clientY;
    let hasDragged = false;

    const onPointerMove = (moveEv: PointerEvent) => {
      const totalDist = Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY);
      if (!hasDragged) {
        if (totalDist < 5) return;
        hasDragged = true;
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transition = 'none';
          chatWindowRef.current.style.top = '0px';
          chatWindowRef.current.style.left = '0px';
          chatWindowRef.current.style.right = 'auto';
          chatWindowRef.current.style.bottom = 'auto';
        }
      }

      const dx = moveEv.clientX - lastX;
      const dy = moveEv.clientY - lastY;
      lastX = moveEv.clientX;
      lastY = moveEv.clientY;

      curX += dx;
      curY += dy;

      const widgetWidth = chatWindowRef.current?.offsetWidth || windowSize.width;
      const minX = 8;
      const minY = 8;
      const maxX = Math.max(minX, window.innerWidth - widgetWidth - 8);
      const maxY = Math.max(minY, window.innerHeight - 56);

      curX = Math.max(minX, Math.min(curX, maxX));
      curY = Math.max(minY, Math.min(curY, maxY));

      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = requestAnimationFrame(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        }
      });
    };

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId);
      } catch {
        // Ignore pointer release
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }

      if (hasDragged) {
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transition = '';
        }
        setWindowPos({ x: curX, y: curY });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return { handleDesktopDragStart };
}
