// src/components/Button.tsx
import { ComponentPropsWithoutRef } from 'react'

export function Button({
  className = '',
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={`bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl px-4 py-3 w-full transition ${className}`}
      {...props}
    />
  )
}
