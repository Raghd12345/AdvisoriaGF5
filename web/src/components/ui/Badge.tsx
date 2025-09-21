import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  emoji?: string;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', emoji, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105';
    
    const variants = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    
    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {emoji && <span className="mr-1">{emoji}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };