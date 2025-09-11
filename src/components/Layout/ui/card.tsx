import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
