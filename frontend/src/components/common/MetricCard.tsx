import React from 'react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  subtitle?: string;
  badge?: {
    text: string;
    trend?: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
  accent?: 'indigo' | 'emerald' | 'amber' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  badge,
  onClick,
  accent = 'neutral'
}) => {
  const accentBorder = {
    indigo: 'hover:border-indigo-200',
    emerald: 'hover:border-emerald-200',
    amber: 'hover:border-amber-200',
    neutral: 'hover:border-slate-300'
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:shadow-sm ' + accentBorder[accent] : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {badge && (
          <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {badge.text}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {value}
        </div>
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
