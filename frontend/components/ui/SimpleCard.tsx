import React from 'react';

export interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = `rounded-lg border border-gray-200 bg-white shadow-sm ${className}`;

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SimpleCard.displayName = 'SimpleCard';

export { SimpleCard as Card };