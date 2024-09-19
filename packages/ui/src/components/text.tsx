import { HTMLProps, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface Text extends PropsWithChildren, HTMLProps<HTMLParagraphElement> {}

export function Text({ className, children, ...props }: Text) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}
