import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/financeUtils';

export default function ExpenseTable({ expenses = [], onDelete = () => {}, onEdit = () => {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const sortedExpenses = useMemo(() => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)), [expenses]);
  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedExpenses = useMemo(() => sortedExpenses.slice((safePage - 1) * pageSize, safePage * pageSize), [safePage, sortedExpenses]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  if (!sortedExpenses.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No expenses found</p>
        <p className="mt-2 text-sm text-slate-500">Adjust the date range or add a new expense to populate this section.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Expense Ledger</h2>
          <p className="text-sm text-slate-500">Review recorded system expenses and payment details.</p>
        </div>
        <div className="text-sm text-slate-500">
          {sortedExpenses.length} expense{sortedExpenses.length === 1 ? '' : 's'} recorded
        </div>
      </div>

      <div className="overflow-x-auto min-w-0">
        <table className="min-w-full text-left text-sm table-auto">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-3 w-28 whitespace-nowrap">Expense ID</th>
              <th className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">Category</th>
              <th className="px-4 py-3 hidden md:table-cell whitespace-nowrap">Paid by</th>
              <th className="px-4 py-3 text-center w-28 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-right w-28 whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 hidden lg:table-cell whitespace-nowrap">Notes</th>
              <th className="px-4 py-3 w-24 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedExpenses.map((expense) => (
              <tr key={expense.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-900 text-xs leading-5 whitespace-nowrap">{expense.id}</td>
                <td className="px-4 py-4 font-medium text-slate-900 max-w-[160px] truncate hidden sm:table-cell">{expense.category}</td>
                <td className="px-4 py-4 text-slate-600 max-w-[140px] truncate hidden md:table-cell">{expense.paidBy}</td>
                <td className="px-6 py-4 text-center text-slate-600 whitespace-nowrap">{expense.date}</td>
                <td className="px-4 py-4 font-semibold text-slate-900 text-right whitespace-nowrap">{formatCurrency(expense.amount)}</td>
                <td className="px-4 py-4 text-slate-600 max-w-[220px] truncate hidden lg:table-cell">{expense.notes}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(expense)}
                      className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expense.id)}
                      className="rounded-full border border-slate-200 bg-white p-2 text-rose-600 hover:bg-slate-50 transition"
                    >
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
          Showing {Math.min(sortedExpenses.length, (safePage - 1) * pageSize + 1)}-{Math.min(sortedExpenses.length, safePage * pageSize)} of {sortedExpenses.length}
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
