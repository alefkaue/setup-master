import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (percentage >= 80) return 'danger';
    if (percentage >= 60) return 'warning';
    return 'default';
  };

  const currentVariant = getVariant();

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span
              className={cn(
                'font-mono font-medium',
                currentVariant === 'danger' && 'text-destructive',
                currentVariant === 'warning' && 'text-warning',
                currentVariant === 'default' && 'text-accent'
              )}
            >
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className={cn(
            'progress-bar-fill',
            currentVariant === 'danger' && 'bg-destructive',
            currentVariant === 'warning' && 'bg-warning'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
