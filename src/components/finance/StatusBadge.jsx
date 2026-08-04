import React from 'react';

const statusStyles = {
  Paid: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200',
  Overdue: 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200',
  Refunded: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
};

export default function StatusBadge({ status, onStatusChange }) {
  if (onStatusChange) {
    return (
      <select
        value={status === 'Paid' ? 'Paid' : 'Pending'}
        onChange={(e) => onStatusChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        title="Click to change status (Paid / Pending)"
        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold outline-none transition-all shadow-sm ${
          status === 'Paid'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
            : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
        }`}
      >
        <option value="Paid" className="bg-white text-emerald-800 font-semibold py-1">Paid</option>
        <option value="Pending" className="bg-white text-amber-800 font-semibold py-1">Pending</option>
      </select>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border ${statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
}
