import React from 'react';
import { motion } from 'framer-motion';

export default function RevenueBreakdownCard({ title, revenue, bills, percentage, growth, color = 'bg-slate-100 text-slate-900' }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">Rs {revenue.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl px-3 py-1 text-xs font-semibold ${color}`}>{growth}</div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{bills} invoices</span>
        <span>{percentage}% of total</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-slate-800 to-slate-400" style={{ width: `${Math.min(100, percentage)}%` }} />
      </div>
    </motion.div>
  );
}
