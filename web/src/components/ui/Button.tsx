import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  shine?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow, shine, children, ...props }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:scale-105',
      secondary: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:scale-105',
      success: 'bg-gradient-to-r from-success-from to-success-to text-white hover:scale-105 shadow-lg hover:shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105',
      ghost: 'text-white hover:bg-white/10 hover:scale-105',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    const glowClass = glow ? 'shadow-glow hover:shadow-glowHover' : '';
    const shineClass = shine ? 'btn-shine' : '';
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClass,
          shineClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };