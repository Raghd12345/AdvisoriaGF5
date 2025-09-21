'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RotatingImagesProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function RotatingImages({ images, alt, className = '' }: RotatingImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsVisible(true);
      }, 300);
    }, 60000); // Change every minute

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={images[currentIndex]}
        alt={alt}
        fill
        className={`object-cover transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        }`}
      />
      
      {/* Image indicator dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}