import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  size?: 'normal' | 'small';
}

export function Button({
  children,
  variant = 'primary',
  size = 'normal',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={'button button-' + variant + ' button-' + size + ' ' + className}
      {...props}
    >
      {children}
    </button>
  );
}

