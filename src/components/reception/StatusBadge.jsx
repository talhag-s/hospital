import React from 'react';

const styles = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  Waiting: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
};

export default function StatusBadge({ status, onStatusChange }) {
  if (!onStatusChange) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
        {status}
      </span>
    );
  }

  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      title="Click to select status (Confirmed / Pending)"
      className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer outline-none transition-all shadow-2xs hover:opacity-90 ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
    >
      <option value="Confirmed" className="bg-white text-slate-800 font-semibold py-1">Confirmed</option>
      <option value="Pending" className="bg-white text-slate-800 font-semibold py-1">Pending</option>
      <option value="Completed" className="bg-white text-slate-800 font-semibold py-1">Completed</option>
      <option value="Cancelled" className="bg-white text-slate-800 font-semibold py-1">Cancelled</option>
    </select>
  );
}
