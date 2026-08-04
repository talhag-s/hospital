import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../contexts/FinanceContext';
import { Plus } from 'lucide-react';
import ExpenseTable from '../../components/finance/ExpenseTable';
import ExpenseForm from '../../components/finance/ExpenseForm';
import { formatCurrency } from '../../utils/financeUtils';

export default function Expenses() {
  const { expenses = [], expensesTotal = 0, addExpense } = useFinance();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track hospital spending and add new system expenses from a dedicated page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/financials')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Financials
          </button>
          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Total Expenses</div>
          <div className={`mt-3 text-3xl font-bold ${expensesTotal === 0 ? 'text-slate-400' : 'text-slate-900'}`}>{formatCurrency(expensesTotal)}</div>
          <div className="mt-2 text-sm text-slate-500">{expenses.length} recorded expense{expenses.length === 1 ? '' : 's'}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Expense Overview</div>
          <p className="mt-3 text-sm text-slate-500">New expenses will appear immediately below when added.</p>
        </div>
      </div>

      <div className="space-y-5">
        <ExpenseTable expenses={expenses} />
      </div>

      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add Expense</h2>
                <p className="text-sm text-slate-500">Create a new expense entry for the hospital system.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <ExpenseForm
              onCancel={() => setShowExpenseModal(false)}
              onSubmit={(expense) => {
                addExpense(expense);
                setShowExpenseModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
