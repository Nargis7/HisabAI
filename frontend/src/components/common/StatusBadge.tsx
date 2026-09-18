import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'md',
  dot = true
}) => {
  // Derive variant if not explicitly provided
  const normalized = status.toLowerCase();
  let computedVariant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = variant || 'neutral';

  if (!variant) {
    if (['paid', 'healthy', 'completed', 'success', 'confirmed', 'settled'].includes(normalized)) {
      computedVariant = 'success';
    } else if (['pending', 'low', 'warning', 'action needed', 'payment-pending', 'due today'].includes(normalized)) {
      computedVariant = 'warning';
    } else if (['out_of_stock', 'danger', 'overdue', 'rejected', 'critical'].includes(normalized)) {
      computedVariant = 'danger';
    } else if (['ready', 'frequent', 'returning', 'info', 'cash flow'].includes(normalized)) {
      computedVariant = 'info';
    }
  }

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/60',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-200/60',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const dotStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-indigo-500',
    neutral: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide whitespace-nowrap ${variantStyles[computedVariant]} ${sizeStyles[size]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[computedVariant]} shrink-0`} />}
      <span>{status}</span>
    </span>
  );
};
