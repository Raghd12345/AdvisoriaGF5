import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  emoji?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, emoji, error, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="flex items-center text-sm font-medium text-gray-700">
            {emoji && <span className="mr-2 text-lg">{emoji}</span>}
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none',
              'bg-white/90 backdrop-blur-sm',
              focused || props.value
                ? 'border-primary-500 shadow-glow transform -translate-y-1'
                : 'border-white/30 hover:border-white/50',
              error ? 'border-red-500' : '',
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };