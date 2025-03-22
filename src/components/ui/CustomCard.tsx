
import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  hover?: boolean;
}

const CustomCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          {
            'glass shadow-subtle': variant === 'glass',
            'border-2': variant === 'outline',
            'transition-all duration-300 hover:shadow-lg hover:-translate-y-1': hover,
          },
          className
        )}
        {...props}
      />
    );
  }
);

CustomCard.displayName = 'CustomCard';

export default CustomCard;
