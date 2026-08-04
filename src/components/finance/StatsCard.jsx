import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, trend, subtitle, icon: Icon, tone = 'blue', muted = false }) {
  const toneStyles = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-emerald-600 text-white',
    amber: 'bg-amber-600 text-white',
    red: 'bg-rose-600 text-white',
    purple: 'bg-violet-600 text-white'
  };

  const valueClassName = muted
    ? 'mt-3 text-3xl font-semibold tracking-tight text-slate-400'
    : 'mt-3 text-3xl font-semibold tracking-tight text-slate-900';

  const subtitleClassName = muted ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-500';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{title}</p>
          <p className={valueClassName}>{value}</p>
          <p className={subtitleClassName}>{subtitle}</p>
        </div>
        {Icon && (
          <div className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${toneStyles[tone] || toneStyles.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="border-t border-slate-100 px-5 py-3">
          <span className="text-sm font-semibold text-slate-900">{trend}</span>
          <span className="ml-2 text-sm text-slate-500">vs last period</span>
        </div>
      )}
    </motion.div>
  );
}
