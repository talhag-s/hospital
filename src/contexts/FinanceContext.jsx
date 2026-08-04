import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEPARTMENTS,
  DOCTORS,
  PATIENTS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_REFUNDS
} from '../data/financeData';
import { formatCurrency } from '../utils/financeUtils';
import { useData } from './DataContext';

const FinanceContext = createContext(null);

const aggregateByKey = (items, key) =>
  items.reduce((acc, item) => {
    const bucket = item[key] || 'Unknown';
    acc[bucket] = (acc[bucket] || 0) + (item.amount ?? 0);
    return acc;
  }, {});

const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const bucket = item[key] || 'Unknown';
    if (!acc[bucket]) acc[bucket] = [];
    acc[bucket].push(item);
    return acc;
  }, {});

const loadRealInvoices = (passedPatients = null, passedAppts = null) => {
  const invoiceMap = new Map();

  let deletedIds = new Set();
  try {
    const savedDeleted = window.localStorage.getItem('finance_deleted_invoices');
    if (savedDeleted) {
      const parsed = JSON.parse(savedDeleted);
      if (Array.isArray(parsed)) {
        deletedIds = new Set(parsed);
      }
    }
  } catch (e) {}

  // 1. Manually saved/created invoices from localStorage
  try {
    const savedInvoices = window.localStorage.getItem('finance_invoices');
    if (savedInvoices) {
      const parsed = JSON.parse(savedInvoices);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((inv) => {
          if (inv.id && !deletedIds.has(inv.id)) invoiceMap.set(inv.id, inv);
        });
      }
    }
  } catch (error) {
    console.error('Failed loading finance_invoices', error);
  }

  // 2. Real Patients entered into system
  try {
    let patients = passedPatients;
    if (!patients || !Array.isArray(patients) || patients.length === 0) {
      const storedPatients = window.localStorage.getItem('hospital_erp_v4_patients_data') || window.localStorage.getItem('hospital_erp_patients_data');
      if (storedPatients) {
        patients = JSON.parse(storedPatients);
      }
    }
    if (Array.isArray(patients)) {
      patients.forEach((pt, index) => {
        const invId = `INV-${pt.id || ('PAT-' + (1000 + index))}`;
        if (!invoiceMap.has(invId) && !deletedIds.has(invId)) {
          const rawFee = pt.consultationFee || pt.billing?.totalAmount || pt.billing?.paidAmount || '1500';
          const amount = Number(String(rawFee).replace(/\D/g, '')) || 1500;
          const status = (pt.paymentStatus === 'Pending' || pt.billing?.status === 'Pending') ? 'Pending' : 'Paid';
          const paymentMethod = pt.paymentMode || pt.paymentMethod || 'Cash';
          const invoiceDate = pt.admissionDate || pt.registeredDate || pt.date || new Date().toISOString().slice(0, 10);

          invoiceMap.set(invId, {
            id: invId,
            patientId: pt.id || `PAT-${1000 + index}`,
            patientName: pt.name || pt.fullName || 'Patient',
            doctorId: pt.doctorId || 'DR-101',
            doctorName: pt.assignedDoctor || 'Assigned Physician',
            departmentName: pt.department || 'Outpatient (OPD)',
            serviceType: 'Consultation & Registration',
            amount,
            invoiceDate,
            dueDate: invoiceDate,
            paymentMethod,
            status,
            insuranceClaim: Boolean(pt.insuranceNumber && pt.insuranceNumber !== 'N/A' && pt.insuranceNumber !== ''),
            insuranceProvider: pt.insuranceNumber || 'N/A'
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed loading patients for invoices', error);
  }

  // 3. Real Appointments in system
  try {
    let appts = passedAppts;
    if (!appts || !Array.isArray(appts) || appts.length === 0) {
      const storedAppts = window.localStorage.getItem('hospital_erp_v4_appointments_data') || window.localStorage.getItem('hospital_erp_appointments_data');
      if (storedAppts) {
        appts = JSON.parse(storedAppts);
      }
    }
    if (Array.isArray(appts)) {
      appts.forEach((apt, index) => {
        const invId = `INV-${apt.id || ('APT-' + index)}`;
        if (!invoiceMap.has(invId) && apt.patientName && !deletedIds.has(invId)) {
          const rawFee = apt.consultationFee || '1500';
          const amount = Number(String(rawFee).replace(/\D/g, '')) || 1500;
          const status = apt.paymentStatus === 'Pending' ? 'Pending' : 'Paid';
          const paymentMethod = apt.paymentMode || 'Cash';
          const invoiceDate = apt.date || new Date().toISOString().slice(0, 10);

          invoiceMap.set(invId, {
            id: invId,
            patientId: apt.patientId || `PAT-${2000 + index}`,
            patientName: apt.patientName,
            doctorId: apt.doctorId || 'DR-101',
            doctorName: apt.doctorName || apt.doctor || 'Assigned Physician',
            departmentName: apt.department || 'Outpatient (OPD)',
            serviceType: 'OPD Consultation',
            amount,
            invoiceDate,
            dueDate: invoiceDate,
            paymentMethod,
            status,
            insuranceClaim: false,
            insuranceProvider: 'N/A'
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed loading appointments for invoices', error);
  }

  // 4. Initial Invoices fallback if invoiceMap is empty
  if (invoiceMap.size === 0 && Array.isArray(INITIAL_INVOICES)) {
    INITIAL_INVOICES.forEach((inv) => {
      if (inv.id && !invoiceMap.has(inv.id) && !deletedIds.has(inv.id)) {
        invoiceMap.set(inv.id, inv);
      }
    });
  }

  return Array.from(invoiceMap.values());
};

const loadLocalData = (key, fallback) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    return fallback;
  }
};

export function FinanceProvider({ children }) {
  const data = useData();
  const dataPatients = data?.patients || [];
  const dataAppointments = data?.appointments || [];

  const [invoices, setInvoices] = useState(() => loadRealInvoices(dataPatients, dataAppointments));
  const [expenses, setExpenses] = useState(() => loadLocalData('finance_expenses', INITIAL_EXPENSES));
  const [refunds, setRefunds] = useState(() => loadLocalData('finance_refunds', INITIAL_REFUNDS));
  const [deletedInvoice, setDeletedInvoice] = useState(null);

  // Sync invoices dynamically whenever patients or appointments change
  useEffect(() => {
    setInvoices(loadRealInvoices(dataPatients, dataAppointments));
  }, [dataPatients, dataAppointments]);

  useEffect(() => {
    const handleStorageSync = () => {
      setInvoices(loadRealInvoices(dataPatients, dataAppointments));
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [dataPatients, dataAppointments]);

  const totalRevenue = useMemo(
    () => invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices]
  );

  const totalExpenses = useMemo(() => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0), [expenses]);
  const totalRefunds = useMemo(() => refunds.reduce((sum, refund) => sum + Number(refund.amount || 0), 0), [refunds]);

  const monthlyRevenue = useMemo(() => {
    const today = new Date();
    return invoices
      .filter((invoice) => invoice.status === 'Paid')
      .filter((invoice) => new Date(invoice.invoiceDate).getMonth() === today.getMonth())
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  }, [invoices]);

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return invoices
      .filter((invoice) => invoice.invoiceDate === today && invoice.status === 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  }, [invoices]);

  const pendingPayments = useMemo(
    () => invoices.filter((invoice) => invoice.status === 'Pending').reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices]
  );

  const paidInvoicesCount = useMemo(() => invoices.filter((invoice) => invoice.status === 'Paid').length, [invoices]);
  const overdueBillsCount = useMemo(() => invoices.filter((invoice) => invoice.status === 'Overdue').length, [invoices]);
  const totalPatientsBilled = useMemo(() => new Set(invoices.map((invoice) => invoice.patientId)).size, [invoices]);

  const netProfit = totalRevenue - totalExpenses - totalRefunds;

  const departmentRevenue = useMemo(() => {
    return Object.entries(groupBy(invoices.filter((invoice) => invoice.status === 'Paid'), 'departmentName')).map(([department, items]) => ({
      department,
      revenue: items.reduce((sum, invoice) => sum + invoice.amount, 0),
      bills: items.length,
      percentage: items.length ? Math.round((items.length / invoices.length) * 100) : 0
    }));
  }, [invoices]);

  const serviceBreakdown = useMemo(() => {
    const grouped = groupBy(invoices, 'serviceType');
    return Object.entries(grouped).map(([serviceType, items]) => ({
      serviceType,
      revenue: items.reduce((sum, invoice) => sum + invoice.amount, 0),
      bills: items.length,
      percentage: Math.round((items.length / invoices.length) * 100),
      growth: `${randomGrowth(items.length)}%`
    }));
  }, [invoices]);

  const paymentDistribution = useMemo(() => {
    const groups = groupBy(invoices, 'paymentMethod');
    return Object.entries(groups).map(([paymentMethod, items]) => ({
      name: paymentMethod,
      value: items.reduce((sum, invoice) => sum + invoice.amount, 0)
    }));
  }, [invoices]);

  const revenueTrend = useMemo(() => {
    const timeline = {};
    invoices.forEach((invoice) => {
      const date = new Date(invoice.invoiceDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      timeline[key] = (timeline[key] || 0) + invoice.amount;
    });
    return Object.entries(timeline)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, revenue]) => ({ month, revenue }));
  }, [invoices]);

  const revenueVsExpenses = useMemo(() => {
    const row = {};
    invoices.forEach((invoice) => {
      const date = new Date(invoice.invoiceDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      row[key] = row[key] || { month: key, revenue: 0, expenses: 0 };
      row[key].revenue += invoice.amount;
    });
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      row[key] = row[key] || { month: key, revenue: 0, expenses: 0 };
      row[key].expenses += expense.amount;
    });
    return Object.values(row).sort((a, b) => a.month.localeCompare(b.month));
  }, [invoices, expenses]);

  const monthlyComparison = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const year = new Date().getFullYear();

    const totals = invoices.reduce(
      (acc, invoice) => {
        const date = new Date(invoice.invoiceDate);
        if (date.getMonth() === currentMonth && date.getFullYear() === year) {
          acc.current += invoice.amount;
        }
        if (date.getMonth() === lastMonth && date.getFullYear() === year) {
          acc.last += invoice.amount;
        }
        return acc;
      },
      { current: 0, last: 0 }
    );

    return [
      { name: 'Last Month', value: totals.last },
      { name: 'This Month', value: totals.current }
    ];
  }, [invoices]);

  function randomGrowth(count) {
    return (Math.max(2, Math.min(18, Math.round((count / 6) * 8))) || 5).toFixed(1);
  }

  const addInvoice = (invoice) => {
    setInvoices((prev) => {
      const next = [{ ...invoice }, ...prev];
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));
      return next;
    });
  };

  const addExpense = (expense) => {
    setExpenses((prev) => {
      const next = [{ ...expense }, ...prev];
      window.localStorage.setItem('finance_expenses', JSON.stringify(next));
      return next;
    });
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => {
      const next = prev.filter((expense) => expense.id !== id);
      window.localStorage.setItem('finance_expenses', JSON.stringify(next));
      return next;
    });
  };

  const updateExpense = (id, patch) => {
    setExpenses((prev) => {
      const next = prev.map((expense) => (expense.id === id ? { ...expense, ...patch } : expense));
      window.localStorage.setItem('finance_expenses', JSON.stringify(next));
      return next;
    });
  };

  const updateInvoice = (id, patch) => {
    setInvoices((prev) => {
      const next = prev.map((invoice) => (invoice.id === id ? { ...invoice, ...patch } : invoice));
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));

      // Also sync patient/appointment payment status if patch contains status
      if (patch.status) {
        try {
          const storedPts = window.localStorage.getItem('hospital_erp_v4_patients_data') || window.localStorage.getItem('hospital_erp_patients_data');
          if (storedPts) {
            const pts = JSON.parse(storedPts);
            let updated = false;
            const nextPts = pts.map((p) => {
              const match = `INV-${p.id}` === id || p.id === id.replace('INV-', '') || p.id === id;
              if (match) {
                updated = true;
                return {
                  ...p,
                  paymentStatus: patch.status,
                  billing: {
                    ...(p.billing || {}),
                    status: patch.status,
                    paidAmount: patch.status === 'Paid' ? (p.billing?.totalAmount || `Rs ${p.consultationFee || 1500}`) : 'Rs 0.00'
                  }
                };
              }
              return p;
            });
            if (updated) {
              window.localStorage.setItem('hospital_erp_v4_patients_data', JSON.stringify(nextPts));
              window.localStorage.setItem('hospital_erp_patients_data', JSON.stringify(nextPts));
            }
          }
        } catch (e) {}

        try {
          const storedApts = window.localStorage.getItem('hospital_erp_v4_appointments_data') || window.localStorage.getItem('hospital_erp_appointments_data');
          if (storedApts) {
            const apts = JSON.parse(storedApts);
            let updated = false;
            const nextApts = apts.map((a) => {
              const match = `INV-${a.id}` === id || a.id === id.replace('INV-', '') || a.id === id;
              if (match) {
                updated = true;
                return { ...a, paymentStatus: patch.status };
              }
              return a;
            });
            if (updated) {
              window.localStorage.setItem('hospital_erp_v4_appointments_data', JSON.stringify(nextApts));
              window.localStorage.setItem('hospital_erp_appointments_data', JSON.stringify(nextApts));
            }
          }
        } catch (e) {}

        window.dispatchEvent(new Event('storage'));
      }

      return next;
    });
  };

  const deleteInvoice = (id) => {
    setInvoices((prev) => {
      const next = prev.filter((invoice) => invoice.id !== id);
      const target = prev.find((invoice) => invoice.id === id);
      setDeletedInvoice(target || null);
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));

      try {
        const savedDeleted = window.localStorage.getItem('finance_deleted_invoices');
        const deletedArr = savedDeleted ? JSON.parse(savedDeleted) : [];
        if (!deletedArr.includes(id)) {
          deletedArr.push(id);
          window.localStorage.setItem('finance_deleted_invoices', JSON.stringify(deletedArr));
        }
      } catch (e) {}

      return next;
    });
  };

  const duplicateInvoice = (id) => {
    const original = invoices.find((invoice) => invoice.id === id);
    if (!original) return;
    const copy = {
      ...original,
      id: `INV-${Math.floor(9000 + Math.random() * 999)}`,
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'Pending',
      paidAmount: 0,
      refundAmount: 0
    };
    setInvoices((prev) => {
      const next = [copy, ...prev];
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));
      return next;
    });
  };

  const markPaid = (id) => {
    setInvoices((prev) => {
      const next = prev.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status: 'Paid', paidAmount: invoice.amount, refundAmount: 0 }
          : invoice
      );
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));
      return next;
    });
  };

  const refundInvoice = (id, amount) => {
    setInvoices((prev) => {
      const next = prev.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status: 'Refunded', refundAmount: amount, paidAmount: 0 }
          : invoice
      );
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));
      return next;
    });
    const target = invoices.find((invoice) => invoice.id === id);
    if (target) {
      setRefunds((prev) => {
        const next = [
          {
            id: `RFN-${7000 + prev.length}`,
            invoiceId: target.id,
            amount,
            patientName: target.patientName,
            reason: 'Billing adjustment',
            date: new Date().toISOString().slice(0, 10),
            status: 'Completed'
          },
          ...prev
        ];
        window.localStorage.setItem('finance_refunds', JSON.stringify(next));
        return next;
      });
    }
  };

  const undoDelete = () => {
    if (!deletedInvoice) return;
    const restoredId = deletedInvoice.id;
    setInvoices((prev) => {
      const next = [deletedInvoice, ...prev];
      window.localStorage.setItem('finance_invoices', JSON.stringify(next));
      try {
        const savedDeleted = window.localStorage.getItem('finance_deleted_invoices');
        const deletedArr = savedDeleted ? JSON.parse(savedDeleted) : [];
        const nextDeleted = deletedArr.filter((id) => id !== restoredId);
        window.localStorage.setItem('finance_deleted_invoices', JSON.stringify(nextDeleted));
      } catch (e) {}
      return next;
    });
    setDeletedInvoice(null);
  };

  const value = useMemo(
    () => ({
      invoices,
      expenses,
      refunds,
      doctors: DOCTORS,
      patients: PATIENTS,
      departments: DEPARTMENTS,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      pendingPayments,
      paidInvoicesCount,
      overdueBillsCount,
      refundAmount: totalRefunds,
      expensesTotal: totalExpenses,
      netProfit,
      totalPatientsBilled,
      departmentRevenue,
      serviceBreakdown,
      paymentDistribution,
      revenueTrend,
      revenueVsExpenses,
      monthlyComparison,
      addInvoice,
      addExpense,
      deleteExpense,
      updateExpense,
      updateInvoice,
      deleteInvoice,
      duplicateInvoice,
      markPaid,
      refundInvoice,
      undoDelete,
      formatCurrency
    }),
    [
      invoices,
      expenses,
      refunds,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      pendingPayments,
      paidInvoicesCount,
      overdueBillsCount,
      totalRefunds,
      totalExpenses,
      netProfit,
      totalPatientsBilled,
      departmentRevenue,
      serviceBreakdown,
      paymentDistribution,
      revenueTrend,
      revenueVsExpenses,
      monthlyComparison
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
