'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

interface NavigationProps {
  currentPage: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function Navigation({ 
  currentPage, 
  onBack, 
  onNext, 
  nextDisabled = false,
  nextLabel = 'Next',
  backLabel = 'Back'
}: NavigationProps) {
  const router = useRouter();

  const pageFlow = {
    'signup': { next: '/campaign/new' },
    'campaign': { back: '/signup', next: '/ideas' },
    'ideas': { back: '/campaign/new', next: '/creatives' },
    'creatives': { back: '/ideas', next: '/plan' },
    'plan': { back: '/creatives', next: '/competition' },
    'competition': { back: '/plan', next: '/chat' },
    'chat': { back: '/competition' }
  };

  const currentFlow = pageFlow[currentPage as keyof typeof pageFlow];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentFlow?.back) {
      router.push(currentFlow.back);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentFlow?.next) {
      router.push(currentFlow.next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
      {currentFlow?.back ? (
        <Button
          variant="ghost"
          onClick={handleBack}
          onKeyDown={(e) => handleKeyDown(e, handleBack)}
          tabIndex={0}
          className="flex items-center gap-2"
        >
          ← {backLabel}
        </Button>
      ) : (
        <div />
      )}
      
      {currentFlow?.next && (
        <Button
          variant="primary"
          onClick={handleNext}
          onKeyDown={(e) => handleKeyDown(e, handleNext)}
          disabled={nextDisabled}
          tabIndex={0}
          className="flex items-center gap-2"
        >
          {nextLabel} →
        </Button>
      )}
    </div>
  );
}