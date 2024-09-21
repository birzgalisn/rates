import { HTMLProps, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface Text extends PropsWithChildren, HTMLProps<HTMLParagraphElement> {}

export function Text({ className, children, ...props }: Text) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  );
}
