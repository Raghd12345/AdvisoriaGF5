'use client';

import { useEffect, useState } from 'react';

export function MouseSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }, 10);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
      }}
      aria-hidden="true"
    />
  );
}