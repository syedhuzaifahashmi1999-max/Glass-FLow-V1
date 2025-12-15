
import React, { useEffect, useRef, useState } from 'react';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trailer = trailerRef.current;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const { clientX, clientY } = e;
      
      // Direct DOM manipulation for performance (avoids React render cycle lag)
      if (cursor) {
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      
      // Trailing effect with slight delay
      if (trailer) {
        trailer.animate({
          transform: `translate3d(${clientX - 10}px, ${clientY - 10}px, 0)`
        }, {
          duration: 400,
          fill: "forwards"
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  // Don't render on mobile/touch devices
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ marginTop: '-4px', marginLeft: '-4px' }} 
      />
      
      {/* Trailing Ring */}
      <div 
        ref={trailerRef}
        className={`
          fixed top-0 left-0 w-6 h-6 border border-white/50 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out hidden md:block
          ${isHovering ? 'scale-[2.5] bg-white/10 border-white/0 backdrop-blur-[1px]' : 'scale-100'}
        `}
      />
    </>
  );
};

export default Cursor;
