import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    
    const variants = {
      default: 'glass-card',
      glass: 'glass p-6',
      elevated: 'bg-white shadow-card hover:shadow-cardHover p-6',
    };
    
    const hoverClass = hover ? 'hover:scale-105 hover:-translate-y-1' : '';
    
    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          hoverClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };