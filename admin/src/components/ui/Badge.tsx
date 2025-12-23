import React from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'purple'
  | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-background text-text border border-border',
  primary: 'bg-primary/10 text-primary border border-primary/20',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-orange-100 text-orange-800 border border-orange-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
  purple: 'bg-purple-100 text-purple-800 border border-purple-200',
  blue: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-button ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

