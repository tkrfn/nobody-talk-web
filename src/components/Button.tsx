// src/components/Button.tsx
'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function Button({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
