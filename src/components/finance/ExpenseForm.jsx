import React, { useEffect, useState } from 'react';

const initialState = {
  category: 'Medical Supplies',
  amount: '',
  paidBy: 'Hospital Funds',
  date: new Date().toISOString().slice(0, 10),
  notes: ''
};

export default function ExpenseForm({ initialValues = null, onSubmit, onCancel, submitLabel = 'Save expense' }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialState,
        ...initialValues,
        amount: initialValues.amount ?? ''
      });
    } else {
      setForm(initialState);
    }
  }, [initialValues]);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.category || !form.amount || Number(form.amount) <= 0) return;
    onSubmit({
      ...form,
      amount: Number(form.amount),
      id: initialValues?.id || `EXP-${Date.now()}`
    });
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <input
            value={form.category}
            onChange={handleChange('category')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input
            type="number"
            value={form.amount}
            onChange={handleChange('amount')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="0"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Paid by</span>
          <input
            value={form.paidBy}
            onChange={handleChange('paidBy')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <textarea
          value={form.notes}
          onChange={handleChange('notes')}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          rows="3"
          placeholder="Expense notes..."
        />
      </label>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Cancel
        </button>
        <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
