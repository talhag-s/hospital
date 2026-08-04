import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCount, getRecentDateLabel, formatCurrency } from '../../utils/financeUtils';

const sortOptions = [
  { key: 'invoiceDate', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'patientName', label: 'Patient' },
  { key: 'departmentName', label: 'Department' }
];

export default function InvoiceTable({ invoices = [], onAction = () => { }, currentSort = { key: 'invoiceDate', direction: 'desc' }, onSortChange = () => { }, onEdit = () => { } }) {
  const [hoverId, setHoverId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const sortedInvoices = useMemo(() => {
    if (!currentSort.key) return invoices;
    return [...invoices].sort((a, b) => {
      const left = a[currentSort.key] ?? '';
      const right = b[currentSort.key] ?? '';
      if (typeof left === 'string') {
        return currentSort.direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
      }
      return currentSort.direction === 'asc' ? left - right : right - left;
    });
  }, [invoices, currentSort]);

  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedInvoices = useMemo(() => sortedInvoices.slice((safePage - 1) * pageSize, safePage * pageSize), [safePage, sortedInvoices]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  if (!sortedInvoices.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No invoices found</p>
        <p className="mt-2 text-sm text-slate-500">Try changing the date range or search term to locate the billing records you need.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Invoice Ledger</h2>
          <p className="text-sm text-slate-500">Interact with invoices, update payment state, and review recent activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>Sort by</span>
          <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none" value={currentSort.key} onChange={(e) => onSortChange(e.target.value, currentSort.direction)}>
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
          <button onClick={() => onSortChange(currentSort.key, currentSort.direction === 'asc' ? 'desc' : 'asc')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 hover:bg-slate-100">
            {currentSort.direction === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-w-0">
        <table className="min-w-full text-left text-sm table-auto">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-3 w-28 whitespace-nowrap">Invoice</th>
              <th className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">Patient</th>
              <th className="px-4 py-3 hidden lg:table-cell whitespace-nowrap">Doctor</th>
              <th className="px-4 py-3 hidden lg:table-cell whitespace-nowrap">Department</th>
              <th className="px-4 py-3 text-center w-28 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-right w-28 whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 hidden md:table-cell whitespace-nowrap">Status</th>
              <th className="px-4 py-3 w-24 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedInvoices.map((invoice) => (
              <tr key={invoice.id} onMouseEnter={() => setHoverId(invoice.id)} onMouseLeave={() => setHoverId(null)} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-900 text-xs leading-5 whitespace-nowrap">{invoice.id}</td>
                <td className="px-4 py-4 font-medium text-slate-900 max-w-[160px] truncate hidden sm:table-cell">{invoice.patientName}</td>
                <td className="px-4 py-4 text-slate-600 max-w-[140px] truncate hidden lg:table-cell">{invoice.doctorName}</td>
                <td className="px-4 py-4 text-slate-600 max-w-[140px] truncate hidden lg:table-cell">{invoice.departmentName}</td>
                <td className="px-6 py-4 text-center text-slate-600 whitespace-nowrap">
                  <div className="text-sm font-medium">{getRecentDateLabel(invoice.invoiceDate)}</div>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900 text-right whitespace-nowrap">{formatCurrency(invoice.amount)}</td>
                <td className="px-4 py-4 align-middle hidden md:table-cell whitespace-nowrap">
                  <StatusBadge
                    status={invoice.status}
                    onStatusChange={(newStatus) => onAction('updateStatus', { ...invoice, newStatus })}
                  />
                </td>
                <td className="px-4 py-4 align-middle whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button title="Edit" type="button" onClick={() => onEdit(invoice)} className="rounded-full bg-white border border-slate-100 p-2 shadow-sm text-slate-700 hover:bg-slate-50 transition">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button title="Delete" onClick={() => onAction('delete', invoice)} className="rounded-full bg-white border border-slate-100 p-2 shadow-sm text-rose-600 hover:bg-slate-50 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">
        <span>
          Showing {Math.min(sortedInvoices.length, (safePage - 1) * pageSize + 1)}-{Math.min(sortedInvoices.length, safePage * pageSize)} of {sortedInvoices.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safePage === totalPages}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
