import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type AlertType = 'error' | 'success' | 'warning' | 'info';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean | string;
}

export interface AlertProps {
  type?: AlertType;
  message: string;
  className?: string;
}