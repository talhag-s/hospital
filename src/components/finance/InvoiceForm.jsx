import React, { useEffect, useState } from 'react';

const defaultState = {
  patientName: '',
  doctorName: '',
  departmentName: '',
  serviceType: '',
  paymentMethod: 'Cash',
  status: 'Pending',
  amount: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  notes: ''
};

export default function InvoiceForm({ initialValues = null, onSubmit, onCancel, submitLabel = 'Save Invoice' }) {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...defaultState,
        ...initialValues,
        amount: initialValues.amount ?? '',
        invoiceDate: initialValues.invoiceDate ?? defaultState.invoiceDate,
        dueDate: initialValues.dueDate ?? defaultState.dueDate
      });
    } else {
      setForm(defaultState);
    }
  }, [initialValues]);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.patientName || !form.doctorName || !form.departmentName || !form.amount) return;
    onSubmit({
      id: initialValues?.id || `INV-${Date.now()}`,
      patientId: initialValues?.patientId || `PAT-${Math.floor(Math.random() * 9000) + 1000}`,
      doctorId: initialValues?.doctorId || `DR-${Math.floor(Math.random() * 9000) + 1000}`,
      amount: Number(form.amount),
      paidAmount: form.status === 'Paid' ? Number(form.amount) : initialValues?.paidAmount || 0,
      refundAmount: initialValues?.refundAmount || 0,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      paymentMethod: form.paymentMethod,
      status: form.status,
      serviceType: form.serviceType,
      departmentName: form.departmentName,
      doctorName: form.doctorName,
      patientName: form.patientName,
      notes: form.notes
    });
    setForm(defaultState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Patient Name</span>
          <input
            value={form.patientName}
            onChange={handleChange('patientName')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="Patient name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Doctor Name</span>
          <input
            value={form.doctorName}
            onChange={handleChange('doctorName')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="Doctor name"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Department</span>
          <input
            value={form.departmentName}
            onChange={handleChange('departmentName')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="Department"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Service</span>
          <input
            value={form.serviceType}
            onChange={handleChange('serviceType')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="Service type"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={handleChange('amount')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="0"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Payment Method</span>
          <select
            value={form.paymentMethod}
            onChange={handleChange('paymentMethod')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Insurance">Insurance</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Invoice Date</span>
          <input
            type="date"
            value={form.invoiceDate}
            onChange={handleChange('invoiceDate')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Due Date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={handleChange('dueDate')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={form.status}
            onChange={handleChange('status')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Refunded">Refunded</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <input
            value={form.notes}
            onChange={handleChange('notes')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
            placeholder="Optional notes"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
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
