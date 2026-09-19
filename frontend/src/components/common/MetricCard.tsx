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
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'neutral';
  /** Colours the value itself, for figures that carry a status signal. */
  tone?: 'default' | 'indigo' | 'emerald' | 'amber' | 'rose';
  /** Small glyph shown in a tinted chip, so a metric is identifiable at a glance. */
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  badge,
  onClick,
  accent = 'neutral',
  tone = 'default',
  icon
}) => {
  const valueTone = {
    default: 'text-slate-900',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600'
  };

  // Tinted chip behind the icon — carries the same signal as the value colour.
  const chipTone = {
    default: 'bg-slate-100 text-slate-600 ring-slate-200/70',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100'
  };

  // Hairline of colour along the top edge, visible only on toned cards.
  const railTone = {
    default: 'bg-transparent',
    indigo: 'bg-gradient-to-r from-indigo-400/70 to-indigo-500/0',
    emerald: 'bg-gradient-to-r from-emerald-400/70 to-emerald-500/0',
    amber: 'bg-gradient-to-r from-amber-400/80 to-amber-500/0',
    rose: 'bg-gradient-to-r from-rose-400/80 to-rose-500/0'
  };

  const accentBorder = {
    indigo: 'hover:border-indigo-300/80',
    emerald: 'hover:border-emerald-300/80',
    amber: 'hover:border-amber-300/80',
    rose: 'hover:border-rose-300/80',
    neutral: 'hover:border-slate-300'
  };

  // Identity colour for the chip: an explicit accent wins, otherwise the card
  // borrows its status tone so single-signal cards stay self-consistent.
  const chipKey = accent !== 'neutral' ? accent : tone;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl border border-slate-200/70 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(16,24,40,0.12)] ' +
            accentBorder[accent]
          : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px ${railTone[tone]}`}
      />

      <div className="flex items-center gap-2.5 mb-4 min-w-0">
        {icon && (
          <span
            className={`grid place-items-center w-9 h-9 rounded-xl ring-1 shrink-0 transition-transform duration-200 group-hover:scale-105 ${chipTone[chipKey]}`}
          >
            {icon}
          </span>
        )}
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.07em] leading-tight">
          {title}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div
          className={`text-[28px] sm:text-[34px] leading-none font-bold tracking-[-0.02em] font-sans tabular-nums ${valueTone[tone]}`}
        >
          {value}
        </div>

        {badge && (
          <span className="mb-1 inline-flex items-center shrink-0 text-[10px] font-semibold text-slate-600 bg-slate-100/80 ring-1 ring-slate-200/60 px-2 py-0.5 rounded-full whitespace-nowrap">
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2.5 text-xs text-slate-500 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
