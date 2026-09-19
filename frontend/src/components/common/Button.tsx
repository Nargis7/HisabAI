import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none whitespace-nowrap focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none active:translate-y-0';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 focus:ring-indigo-500',
    md: 'text-sm px-4 py-2 gap-2 focus:ring-indigo-500',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold focus:ring-indigo-500'
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white hover:to-indigo-800 active:to-indigo-900 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-px border border-indigo-700/20',
    secondary:
      'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-sm hover:-translate-y-px',
    outline:
      'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm hover:-translate-y-px',
    ghost: 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70 active:bg-indigo-100/70 border border-transparent',
    danger:
      'bg-gradient-to-br from-rose-500 to-rose-700 text-white hover:to-rose-800 active:to-rose-900 shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 hover:-translate-y-px border border-rose-700/20'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
