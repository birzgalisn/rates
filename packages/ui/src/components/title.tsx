import { HTMLProps, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface Title extends PropsWithChildren, HTMLProps<HTMLHeadingElement> {}

export function Title({ className, children, ...props }: Title) {
  return (
    <h1
      className={cn(
        'text-3xl font-semibold tracking-tight text-gray-900',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
