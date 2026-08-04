import React, { useEffect, useMemo, useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { Search } from 'lucide-react';
import StatsCard from '../../components/finance/StatsCard';
import RevenueBreakdownCard from '../../components/finance/RevenueBreakdownCard';
import InvoiceTable from '../../components/finance/InvoiceTable';
import InvoiceForm from '../../components/finance/InvoiceForm';
import ExpenseTable from '../../components/finance/ExpenseTable';
import FinanceCharts from '../../components/finance/FinanceCharts';
import ExpenseForm from '../../components/finance/ExpenseForm';
import { formatCurrency } from '../../utils/financeUtils';

const rangeOptions = ['All', 'Today', 'This Month', 'Last 90 Days'];

export default function FinancialsOverview() {
  const {
    invoices = [],
    expenses = [],
    expensesTotal = 0,
    addExpense,
    addInvoice,
    deleteExpense,
    markPaid,
    deleteInvoice,
    duplicateInvoice,
    updateInvoice,
    updateExpense
  } = useFinance();

  const [sortOption, setSortOption] = useState({ key: 'invoiceDate', direction: 'desc' });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewType, setViewType] = useState('invoices');
  const [reportRange, setReportRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const hasModalOpen = showExpenseModal || showInvoiceModal || Boolean(editingExpense) || Boolean(editingInvoice);
    document.body.style.overflow = hasModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showExpenseModal, showInvoiceModal, editingExpense, editingInvoice]);

  const filterByRange = (items, dateKey) => {
    if (reportRange === 'All') return items;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (reportRange === 'Today') {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return items.filter((item) => {
        const itemDate = new Date(item[dateKey]);
        return itemDate >= today && itemDate < tomorrow;
      });
    }

    if (reportRange === 'This Month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return items.filter((item) => new Date(item[dateKey]) >= start);
    }

    if (reportRange === 'Last 90 Days') {
      const start = new Date();
      start.setDate(start.getDate() - 90);
      return items.filter((item) => new Date(item[dateKey]) >= start);
    }

    return items;
  };

  const reportInvoices = useMemo(() => filterByRange(invoices, 'invoiceDate'), [invoices, reportRange]);
  const reportExpenses = useMemo(() => filterByRange(expenses, 'date'), [expenses, reportRange]);

  const filteredInvoices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return reportInvoices;
    return reportInvoices.filter((invoice) => [invoice.id, invoice.patientName, invoice.doctorName, invoice.departmentName, invoice.serviceType, invoice.status].some((value) => `${value}`.toLowerCase().includes(query)));
  }, [reportInvoices, searchTerm]);

  const filteredExpenses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return reportExpenses;
    return reportExpenses.filter((expense) => [expense.id, expense.category, expense.paidBy, expense.notes, expense.date].some((value) => `${value}`.toLowerCase().includes(query)));
  }, [reportExpenses, searchTerm]);

  const reportStats = useMemo(() => {
    const paidRevenue = reportInvoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const pendingPayments = reportInvoices.filter((invoice) => invoice.status === 'Pending').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const invoiceRangeExpenses = reportExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const totalExpensesValue = reportRange === 'All' ? Number(expensesTotal) : invoiceRangeExpenses;
    const netProfit = paidRevenue - totalExpensesValue;

    return { paidRevenue, expensesTotal: totalExpensesValue, netProfit, pendingPayments };
  }, [reportInvoices, reportExpenses, reportRange, expensesTotal]);

  const departmentRevenue = useMemo(() => {
    const paidInvoices = reportInvoices.filter((invoice) => invoice.status === 'Paid');
    const grouped = paidInvoices.reduce((acc, invoice) => {
      const key = invoice.departmentName || 'Unknown';
      acc[key] = acc[key] || { department: key, revenue: 0, bills: 0 };
      acc[key].revenue += invoice.amount || 0;
      acc[key].bills += 1;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [reportInvoices]);

  const serviceBreakdown = useMemo(() => {
    const grouped = reportInvoices.reduce((acc, invoice) => {
      const key = invoice.serviceType || 'Unknown';
      acc[key] = acc[key] || { serviceType: key, revenue: 0, bills: 0 };
      acc[key].revenue += invoice.amount || 0;
      acc[key].bills += 1;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [reportInvoices]);

  const paymentDistribution = useMemo(() => {
    const grouped = reportInvoices.reduce((acc, invoice) => {
      const key = invoice.paymentMethod || 'Unknown';
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += invoice.amount || 0;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [reportInvoices]);

  const revenueTrend = useMemo(() => {
    const timeline = reportInvoices.reduce((acc, invoice) => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + (invoice.amount || 0);
      return acc;
    }, {});

    return Object.entries(timeline).sort(([left], [right]) => left.localeCompare(right)).map(([month, revenue]) => ({ month, revenue }));
  }, [reportInvoices]);

  const revenueVsExpenses = useMemo(() => {
    const rows = {};
    reportInvoices.forEach((invoice) => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      rows[monthKey] = rows[monthKey] || { month: monthKey, revenue: 0, expenses: 0 };
      rows[monthKey].revenue += invoice.amount || 0;
    });

    reportExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      rows[monthKey] = rows[monthKey] || { month: monthKey, revenue: 0, expenses: 0 };
      rows[monthKey].expenses += expense.amount || 0;
    });

    return Object.values(rows).sort((left, right) => left.month.localeCompare(right.month));
  }, [reportInvoices, reportExpenses]);

  const monthlyComparison = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const year = new Date().getFullYear();

    const totals = reportInvoices.reduce(
      (acc, invoice) => {
        const date = new Date(invoice.invoiceDate);
        if (date.getMonth() === currentMonth && date.getFullYear() === year) {
          acc.current += invoice.amount || 0;
        }
        if (date.getMonth() === lastMonth && date.getFullYear() === year) {
          acc.last += invoice.amount || 0;
        }
        return acc;
      },
      { current: 0, last: 0 }
    );

    return [{ name: 'Last Month', value: totals.last }, { name: 'This Month', value: totals.current }];
  }, [reportInvoices]);

  const actionHandler = (type, invoice) => {
    if (type === 'updateStatus' && updateInvoice) return updateInvoice(invoice.id, { status: invoice.newStatus, paidAmount: invoice.newStatus === 'Paid' ? invoice.amount : 0 });
    if (type === 'markPaid' && markPaid) return markPaid(invoice.id);
    if (type === 'delete' && deleteInvoice) return deleteInvoice(invoice.id);
    if (type === 'duplicate' && duplicateInvoice) return duplicateInvoice(invoice.id);
    return null;
  };

  const openNewInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceModal(true);
  };

  const openEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const openNewExpense = () => {
    setEditingExpense(null);
    setShowExpenseModal(true);
  };

  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setEditingExpense(null);
  };

  const handleInvoiceSubmit = (invoice) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoice);
    } else {
      addInvoice(invoice);
    }
    closeInvoiceModal();
  };

  const handleExpenseSubmit = (expense) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expense);
    } else {
      addExpense(expense);
    }
    closeExpenseModal();
  };

  const departmentTotal = departmentRevenue.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const serviceTotal = serviceBreakdown.reduce((sum, item) => sum + (item.revenue || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="overflow-x-auto min-w-0">
        <div className="mx-auto w-full max-w-6xl min-w-0 p-5 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Finance & Billing</h1>
              <p className="text-sm text-gray-500 mt-1">Review invoices, expenses, and live analytics for the selected reporting window.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={reportRange}
                onChange={(event) => setReportRange(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
              >
                {rangeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button type="button" onClick={openNewInvoice} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                New Invoice
              </button>
              <button type="button" onClick={openNewExpense} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Add Expense
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard title="Revenue" value={formatCurrency(reportStats.paidRevenue)} subtitle="Paid revenue in range" trend={reportRange === 'All' ? 'Live overview' : `Filtered • ${reportRange}`} />
            <StatsCard title="Expenses" value={formatCurrency(reportStats.expensesTotal)} subtitle="Operational costs" trend="Tracked daily" muted={reportStats.expensesTotal === 0} />
            <StatsCard title="Profit" value={formatCurrency(reportStats.netProfit)} subtitle="Revenue minus costs" trend="Healthy margin" />
            <StatsCard title="Pending" value={formatCurrency(reportStats.pendingPayments)} subtitle="Awaiting payment" trend="Follow up" />
          </div>

          <div className="space-y-5">
            <FinanceCharts revenueTrend={revenueTrend} departmentRevenue={departmentRevenue} paymentDistribution={paymentDistribution} revenueVsExpenses={revenueVsExpenses} monthlyComparison={monthlyComparison} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Ledger View</h2>
                <p className="text-sm text-slate-500">Switch between invoices and expenses, then edit entries inline or through the action buttons.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  <Search className="h-4 w-4" />
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search ledger" className="w-full bg-transparent outline-none" />
                </label>
                <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                  {['invoices', 'expenses'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setViewType(type)}
                      className={`px-4 py-2 text-sm font-semibold transition ${viewType === type ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {type === 'invoices' ? 'Invoices' : 'Expenses'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {viewType === 'invoices' ? (
              <InvoiceTable invoices={filteredInvoices} onAction={actionHandler} currentSort={sortOption} onSortChange={(key, direction) => setSortOption({ key, direction })} onEdit={openEditInvoice} />
            ) : (
              <ExpenseTable expenses={filteredExpenses} onDelete={deleteExpense} onEdit={openEditExpense} />
            )}
          </div>
        </div>

        {showExpenseModal || editingExpense ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-y-auto rounded-none bg-white p-6 shadow-2xl ring-1 ring-slate-200 modal-scrollbar">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{editingExpense ? 'Edit Expense' : 'Add System Expense'}</h2>
                  <p className="text-sm text-slate-500">Update or record hospital operating costs.</p>
                </div>
                <button type="button" onClick={closeExpenseModal} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
                  ✕
                </button>
              </div>
              <ExpenseForm initialValues={editingExpense} onCancel={closeExpenseModal} onSubmit={handleExpenseSubmit} submitLabel={editingExpense ? 'Save Changes' : 'Save Expense'} />
            </div>
          </div>
        ) : null}

        {showInvoiceModal || editingInvoice ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-y-auto rounded-none bg-white p-6 shadow-2xl ring-1 ring-slate-200 modal-scrollbar">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</h2>
                  <p className="text-sm text-slate-500">Create or revise a billing record for the ledger.</p>
                </div>
                <button type="button" onClick={closeInvoiceModal} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
                  ✕
                </button>
              </div>
              <InvoiceForm initialValues={editingInvoice} onCancel={closeInvoiceModal} onSubmit={handleInvoiceSubmit} submitLabel={editingInvoice ? 'Save Changes' : 'Save Invoice'} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
