import React from 'react';
import { twMerge } from 'tailwind-merge';

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={twMerge(
      'my-4 border-0 border-t border-gray-200',
      className
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

export { Separator };
