import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent' | 'warning';
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'kpi-card group hover:border-accent/30 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
            variant === 'accent' && 'bg-accent/20',
            variant === 'warning' && 'bg-warning/20',
            variant === 'default' && 'bg-secondary'
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              variant === 'accent' && 'text-accent',
              variant === 'warning' && 'text-warning',
              variant === 'default' && 'text-foreground'
            )}
          />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive
                ? 'bg-accent/20 text-accent'
                : 'bg-destructive/20 text-destructive'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground mb-1 font-mono tracking-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default KPICard;
