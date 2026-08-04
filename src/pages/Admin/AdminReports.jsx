import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useFinance } from '../../contexts/FinanceContext';
import { downloadCSV } from '../../utils/exportHelpers';
import {
  BarChart3, Download, FileText, Calendar, Users, Activity,
  ReceiptText, Stethoscope, Bed, Sparkles, RefreshCw,
  TrendingUp, TrendingDown, Building2, CheckCircle2, AlertCircle,
  Clock, ShieldCheck, DollarSign, PieChart, Layers, ArrowUpRight,
  ChevronLeft, ChevronRight, UserCheck, User, Lock, Key
} from 'lucide-react';

const RANGE_OPTIONS = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'];

export default function AdminReports() {
  const { user, showToast } = useAuth();
  const { patients = [], appointments = [], doctors = [], departments = [], queue = [], users = [] } = useData();
  const { invoices = [], expenses = [] } = useFinance();

  const [selectedRange, setSelectedRange] = useState('This Month');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'patients' | 'financials' | 'departments' | 'expenses' | 'logins'

  const [patientPage, setPatientPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const BATCH_SIZE = 8;

  const [editableReports, setEditableReports] = useState({
    patientFlow: 'Patient admission velocity is up 14% this month with steady emergency throughput.',
    billing: 'Revenue collections stand at 84% with minimal pending insurance claims outstanding.',
    staffing: 'Department physician-to-bed ratios are optimal across all 6 primary specialty wings.'
  });

  // Calculate System Statistics dynamically
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const admittedPatients = patients.filter(p => p.status === 'Admitted' || p.status === 'ICU' || p.status === 'Critical').length;
    const opdPatients = patients.filter(p => p.status === 'OPD' || p.status === 'Discharged').length;
    const criticalPatients = patients.filter(p => p.status === 'ICU' || p.status === 'Critical').length;

    const totalDoctors = doctors.length;
    const availableDoctors = doctors.filter(d => d.availability === 'Available').length;

    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length;

    const totalBeds = departments.reduce((sum, d) => sum + (Number(d.bedsTotal) || 0), 0);
    const occupiedBeds = departments.reduce((sum, d) => sum + (Number(d.bedsOccupied) || 0), 0);
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Unpaid');
    
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalPatients,
      admittedPatients,
      opdPatients,
      criticalPatients,
      totalDoctors,
      availableDoctors,
      totalAppointments,
      confirmedAppointments,
      pendingAppointments,
      totalBeds,
      occupiedBeds,
      occupancyRate,
      totalRevenue,
      pendingRevenue,
      totalExpenses,
      netProfit,
      paidInvoicesCount: paidInvoices.length,
      pendingInvoicesCount: pendingInvoices.length,
      activeDepartmentsCount: departments.length
    };
  }, [patients, appointments, doctors, departments, invoices, expenses]);

  // System User Logins & Audit Directory
  // System User Logins & Audit Directory
  const systemLoginAccounts = useMemo(() => {
    const list = [];
    const addedEmails = new Set();

    const isStaleTestEmail = (item) => {
      if (!item) return true;
      const email = String(item?.email || item?.loginEmail || '').toLowerCase();
      const name = String(item?.name || item?.fullName || '').toLowerCase();
      if (['muhammad@gmail.com', 'talha@gmail.com', 'huzaifa@gmail.com', 'muhammad.talha@gmail.com'].includes(email)) return true;
      if (name.includes('talha') || name.includes('muhammad talha')) return true;
      return false;
    };

    // Helper: Normalize & correct user role
    const getCorrectRole = (item, defaultRole = 'Staff') => {
      const email = String(item?.email || item?.loginEmail || '').toLowerCase();
      const name = String(item?.name || item?.fullName || '').toLowerCase();
      if (email.includes('reception') || name.includes('watson')) return 'Receptionist';
      if (email.includes('admin') || name.includes('jenkins')) return 'Admin';
      if (email.includes('nurse') || name.includes('barton')) return 'Nurse';
      return item?.role || defaultRole;
    };

    // 1. Current logged-in active user
    if (user && (user.email || user.loginEmail)) {
      const email = (user.email || user.loginEmail).toLowerCase();
      if (!isStaleTestEmail(user)) {
        addedEmails.add(email);
        list.push({
          id: user.id || 'usr_current',
          name: user.name || user.fullName || 'Active User',
          email: user.email || user.loginEmail,
          role: getCorrectRole(user, 'Admin'),
          department: user.department || 'Executive Management',
          isCurrentSession: true,
          status: 'Active (Signed In Now)',
          loginTime: 'Just Now'
        });
      }
    }

    // 2. Admin / Receptionist / Staff users from DataContext
    (users || [])
      .filter((u) => u && !isStaleTestEmail(u))
      .forEach((u) => {
        const email = (u.email || u.loginEmail)?.toLowerCase();
        if (!email || addedEmails.has(email)) return;
        addedEmails.add(email);
        const role = getCorrectRole(u, 'Staff');

        list.push({
          id: u.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: u.name || u.fullName || 'System User',
          email: u.email || u.loginEmail,
          role,
          department: role === 'Receptionist' ? 'Patient Registration' : (u.department || 'Administration'),
          isCurrentSession: false,
          status: 'Authorized Account',
          loginTime: u.lastActive || 'Registered'
        });
      });

    // 3. All Doctors (including newly added doctors like Dr. Muhammad Talha) from DataContext
    (doctors || [])
      .filter((d) => d && !isStaleTestEmail(d))
      .forEach((d) => {
        const namePart = String(d.name || 'doctor').toLowerCase().replace(/^dr\.\s*/i, '').trim().split(' ')[0] || 'doctor';
        let rawEmail = (d.email || d.loginEmail || '').toLowerCase();
        if (!rawEmail.endsWith('@gmail.com')) {
          rawEmail = `${namePart}@gmail.com`;
        }

        if (!rawEmail || addedEmails.has(rawEmail)) return;
        addedEmails.add(rawEmail);
        list.push({
          id: d.id || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: d.name || 'Dr. Specialist',
          email: rawEmail,
          role: 'Doctor',
          department: d.department || d.specialty || 'Medical Ops',
          isCurrentSession: false,
          status: d.status === 'On-Leave' ? 'On Leave' : 'Authorized Account',
          loginTime: d.joiningDate || 'Registered'
        });
      });

    return list;
  }, [user, users, doctors]);

  // Handle CSV Exports
  const handleExportPatientsReport = () => {
    const rows = patients.map(p => ({
      'Patient ID': p.id,
      'Full Name': p.name,
      'Age': p.age,
      'Gender': p.gender,
      'Department': p.department || 'N/A',
      'Assigned Doctor': p.assignedDoctor || 'N/A',
      'Bed Number': p.bedNumber || 'N/A',
      'Status': p.status || 'Active',
      'Admission Date': p.admissionDate || 'N/A'
    }));
    downloadCSV(`Hospital_Patients_Report_${Date.now()}.csv`, rows);
    showToast('success', 'Report Exported', 'Patients & Admission CSV report downloaded.');
  };

  const handleExportFinancialReport = () => {
    const rows = invoices.map(inv => ({
      'Invoice ID': inv.id,
      'Patient Name': inv.patientName || 'N/A',
      'Department': inv.department || 'N/A',
      'Amount (Rs)': inv.amount,
      'Date': inv.date,
      'Status': inv.status
    }));
    downloadCSV(`Hospital_Financial_Report_${Date.now()}.csv`, rows);
    showToast('success', 'Report Exported', 'Financial & Revenue CSV report downloaded.');
  };

  const handleExportDepartmentsReport = () => {
    const rows = departments.map(d => ({
      'Dept ID': d.id,
      'Department Name': d.name,
      'Code': d.code,
      'Head Physician': d.head,
      'Doctors Count': d.doctorsCount || 0,
      'Nurses Count': d.nursesCount || 0,
      'Beds Occupied': d.bedsOccupied || 0,
      'Beds Total': d.bedsTotal || 0,
      'Occupancy %': d.bedsTotal ? Math.round((d.bedsOccupied / d.bedsTotal) * 100) : 0,
      'Monthly Budget': d.monthlyBudget || 'N/A',
      'Status': d.status || 'Active'
    }));
    downloadCSV(`Hospital_Departments_Report_${Date.now()}.csv`, rows);
    showToast('success', 'Report Exported', 'Department & Utilization CSV report downloaded.');
  };

  const handleExportDoctorsReport = () => {
    const rows = doctors.map(doc => ({
      'Doctor ID': doc.id,
      'Doctor Name': doc.name,
      'Department': doc.department,
      'Specialization': doc.specialization,
      'Experience': `${doc.experience} Years`,
      'Availability': doc.availability,
      'Contact': doc.phone || doc.email || 'N/A'
    }));
    downloadCSV(`Hospital_Doctors_Directory_${Date.now()}.csv`, rows);
    showToast('success', 'Report Exported', 'Doctors Directory CSV report downloaded.');
  };

  const handleExportExpensesReport = () => {
    const rows = expenses.map(exp => ({
      'Expense ID': exp.id,
      'Category': exp.category || 'General',
      'Vendor / Description': exp.title || exp.vendor || 'Operational Expense',
      'Date': exp.date || 'N/A',
      'Amount (Rs)': exp.amount,
      'Status': exp.status || 'Approved'
    }));
    downloadCSV(`Hospital_Expenses_Report_${Date.now()}.csv`, rows);
    showToast('success', 'Report Exported', 'Operating Expenses CSV report downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* ── TOP EXECUTIVE BANNER ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase tracking-wide">
              Hospital Intelligence &amp; Analytics
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Data Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Admin Reports
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Comprehensive system analytics, departmental workloads, financial auditing, and automated report exports.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
          <button
            type="button"
            onClick={handleExportFinancialReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Export All CSV
          </button>
        </div>
      </div>

      {/* ── KPI HIGHLIGHT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected Revenue</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">Rs {stats.totalRevenue.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last period
            </span>
            <span className="text-slate-400 font-mono">{stats.paidInvoicesCount} Invoices</span>
          </div>
        </div>

        {/* Active Patients */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Patients</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.totalPatients}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-blue-600 font-semibold">{stats.admittedPatients} Currently Admitted</span>
            <span className="text-slate-400">{stats.opdPatients} OPD</span>
          </div>
        </div>

        {/* Doctor Roster */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Medical Specialists</p>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.totalDoctors}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {stats.availableDoctors} Available Now
            </span>
            <span className="text-slate-400">{stats.activeDepartmentsCount} Wings</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bed Utilization</p>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-extrabold text-slate-900">{stats.occupancyRate}%</p>
            <span className="text-xs font-medium text-slate-500">({stats.occupiedBeds} / {stats.totalBeds} Beds)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stats.occupancyRate > 85 ? 'bg-rose-500' : stats.occupancyRate > 60 ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, stats.occupancyRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          System Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'patients'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Patient &amp; Admissions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'financials'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Financial &amp; Revenue
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'departments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Department Workload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'expenses'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Operating Expenses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logins'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          User Logins &amp; Audit
        </button>
      </div>

      {/* ── TAB CONTENT ── */}

      {/* 1. OVERVIEW & EXPORTS TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Export Center Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Export Data Reports</h3>
                <p className="text-xs text-slate-400">Download formatted CSV reports</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-800">Patients &amp; Admissions</p>
                  <p className="text-[11px] text-slate-400">{patients.length} Registered records</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportPatientsReport}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all shadow-2xs"
                  title="Export Patients CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-800">Financial Revenue &amp; Invoices</p>
                  <p className="text-[11px] text-slate-400">{invoices.length} Billing transactions</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportFinancialReport}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-all shadow-2xs"
                  title="Export Financial CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-800">Department Occupancy</p>
                  <p className="text-[11px] text-slate-400">{departments.length} Specialty wings</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportDepartmentsReport}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-all shadow-2xs"
                  title="Export Departments CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-800">Doctor Directory &amp; Roster</p>
                  <p className="text-[11px] text-slate-400">{doctors.length} Physicians &amp; specialists</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportDoctorsReport}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-purple-600 hover:bg-purple-50 transition-all shadow-2xs"
                  title="Export Doctors CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-800">Operating Expenses &amp; Outlays</p>
                  <p className="text-[11px] text-slate-400">{expenses.length} Expense transactions</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportExpensesReport}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-all shadow-2xs"
                  title="Export Expenses CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Operational Metrics & Financial Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Key Operational Metrics</h3>
                  <p className="text-xs text-slate-400">Current hospital throughput and balance ledger</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Live Analytics
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Collected Income</p>
                <p className="text-lg font-extrabold text-emerald-700 mt-1">Rs {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Receivables</p>
                <p className="text-lg font-extrabold text-amber-700 mt-1">Rs {stats.pendingRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operating Expenses</p>
                <p className="text-lg font-extrabold text-rose-700 mt-1">Rs {stats.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Profit Margin</p>
                <p className="text-lg font-extrabold text-blue-700 mt-1">
                  Rs {stats.netProfit.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirmed Appointments</p>
                <p className="text-lg font-extrabold text-slate-900 mt-1">{stats.confirmedAppointments}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Waiting Queue</p>
                <p className="text-lg font-extrabold text-indigo-700 mt-1">{stats.pendingAppointments} Patients</p>
              </div>
            </div>

            {/* Editable Executive Notes */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Executive Operational Notes
                </h4>
                <span className="text-[11px] text-slate-400">Auto-saved to memory</span>
              </div>
              <textarea
                value={editableReports.patientFlow}
                onChange={(e) => setEditableReports({ ...editableReports, patientFlow: e.target.value })}
                rows="2"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                placeholder="Type executive notes or commentary..."
              />
            </div>

          </div>

        </div>
      )}

      {/* 2. PATIENT & ADMISSIONS TAB */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Patient Demographics &amp; Admissions</h3>
              <p className="text-xs text-slate-400">Overview of all active hospital patient records and bed allocations</p>
            </div>
            <button
              type="button"
              onClick={handleExportPatientsReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" /> Download List
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <p className="text-xs font-bold text-blue-800">Total Registered</p>
              <p className="text-2xl font-black text-blue-900 mt-1">{stats.totalPatients}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800">Admitted / In-Patient</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">{stats.admittedPatients}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <p className="text-xs font-bold text-amber-800">OPD Consultations</p>
              <p className="text-2xl font-black text-amber-900 mt-1">{stats.opdPatients}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <p className="text-xs font-bold text-rose-800">ICU / Critical Care</p>
              <p className="text-2xl font-black text-rose-900 mt-1">{stats.criticalPatients}</p>
            </div>
          </div>

          {/* Mini Patient Table with 8-per-page Pagination */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            {(() => {
              const totalPatientPages = Math.ceil(patients.length / BATCH_SIZE) || 1;
              const paginatedPatients = patients.slice((patientPage - 1) * BATCH_SIZE, patientPage * BATCH_SIZE);

              return (
                <>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3 text-left">Patient Name</th>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Assigned Doctor</th>
                        <th className="px-4 py-3 text-left">Bed</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedPatients.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{p.id}</td>
                          <td className="px-4 py-3 font-medium">{p.department || 'General'}</td>
                          <td className="px-4 py-3 font-medium text-slate-600">{p.assignedDoctor || 'Unassigned'}</td>
                          <td className="px-4 py-3 font-semibold text-slate-700">{p.bedNumber || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'ICU' || p.status === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {p.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {patients.length > BATCH_SIZE && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        Showing <span className="font-bold text-slate-700">{(patientPage - 1) * BATCH_SIZE + 1}</span> to <span className="font-bold text-slate-700">{Math.min(patientPage * BATCH_SIZE, patients.length)}</span> of <span className="font-bold text-slate-700">{patients.length}</span> patients
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={patientPage === 1}
                          onClick={() => setPatientPage((p) => Math.max(1, p - 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="px-3 font-semibold text-slate-700">Page {patientPage} of {totalPatientPages}</span>
                        <button
                          type="button"
                          disabled={patientPage >= totalPatientPages}
                          onClick={() => setPatientPage((p) => Math.min(totalPatientPages, p + 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 3. FINANCIALS & REVENUE TAB */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Financial Performance &amp; Invoices</h3>
              <p className="text-xs text-slate-400">Revenue breakdowns, pending balances, and operational expense logs</p>
            </div>
            <button
              type="button"
              onClick={handleExportFinancialReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" /> Export Ledger CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Collected Revenue</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">Rs {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-700 mt-1">{stats.paidInvoicesCount} Paid Invoices</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Receivables</p>
              <p className="text-2xl font-black text-amber-900 mt-1">Rs {stats.pendingRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-amber-700 mt-1">{stats.pendingInvoicesCount} Pending Claims</p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Operating Expenses</p>
              <p className="text-2xl font-black text-rose-900 mt-1">Rs {stats.totalExpenses.toLocaleString()}</p>
              <p className="text-[11px] text-rose-700 mt-1">{expenses.length} Expense Transactions</p>
            </div>
          </div>

          {/* Invoices List with 8-per-page Pagination */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            {(() => {
              const totalInvoicePages = Math.ceil(invoices.length / BATCH_SIZE) || 1;
              const paginatedInvoices = invoices.slice((invoicePage - 1) * BATCH_SIZE, invoicePage * BATCH_SIZE);

              return (
                <>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3 text-left">Invoice ID</th>
                        <th className="px-4 py-3 text-left">Patient</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.id}</td>
                          <td className="px-4 py-3 font-semibold">{inv.patientName || 'Patient'}</td>
                          <td className="px-4 py-3 text-slate-500">{inv.department || 'General'}</td>
                          <td className="px-4 py-3 text-slate-500">{inv.date || 'Today'}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">Rs {(inv.amount || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {invoices.length > BATCH_SIZE && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        Showing <span className="font-bold text-slate-700">{(invoicePage - 1) * BATCH_SIZE + 1}</span> to <span className="font-bold text-slate-700">{Math.min(invoicePage * BATCH_SIZE, invoices.length)}</span> of <span className="font-bold text-slate-700">{invoices.length}</span> invoices
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={invoicePage === 1}
                          onClick={() => setInvoicePage((p) => Math.max(1, p - 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="px-3 font-semibold text-slate-700">Page {invoicePage} of {totalInvoicePages}</span>
                        <button
                          type="button"
                          disabled={invoicePage >= totalInvoicePages}
                          onClick={() => setInvoicePage((p) => Math.min(totalInvoicePages, p + 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 4. DEPARTMENT WORKLOAD TAB */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Departmental Capacity &amp; Utilization</h3>
              <p className="text-xs text-slate-400">Physician staffing, bed occupancy percentage, and department budgets</p>
            </div>
            <button
              type="button"
              onClick={handleExportDepartmentsReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" /> Export Wings Report
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Head Physician</th>
                  <th className="px-4 py-3 text-left">Doctors</th>
                  <th className="px-4 py-3 text-left">Beds (Occupied / Total)</th>
                  <th className="px-4 py-3 text-left">Occupancy Rate</th>
                  <th className="px-4 py-3 text-left">Monthly Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {departments.map((d) => {
                  const bTotal = Number(d.bedsTotal) || 0;
                  const bOccupied = Number(d.bedsOccupied) || 0;
                  const rate = bTotal > 0 ? Math.round((bOccupied / bTotal) * 100) : 0;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{d.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{d.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{d.head}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">{d.doctorsCount || 0} Doctors</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{bOccupied} / {bTotal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rate > 80 ? 'bg-rose-500' : rate > 50 ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-800">{rate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{d.monthlyBudget}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. OPERATING EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Operating Expenses &amp; Outlays</h3>
              <p className="text-xs text-slate-400">Hospital expenditure, vendor disbursements, and procurement logs</p>
            </div>
            <button
              type="button"
              onClick={handleExportExpensesReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" /> Export Expenses CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Operating Outflow</p>
              <p className="text-2xl font-black text-rose-900 mt-1">Rs {stats.totalExpenses.toLocaleString()}</p>
              <p className="text-[11px] text-rose-700 mt-1">{expenses.length} Expense Transactions</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Collected Net Surplus</p>
              <p className="text-2xl font-black text-blue-900 mt-1">Rs {stats.netProfit.toLocaleString()}</p>
              <p className="text-[11px] text-blue-700 mt-1">Net Income Surplus</p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Average Outlay / Tx</p>
              <p className="text-2xl font-black text-indigo-900 mt-1">
                Rs {expenses.length > 0 ? Math.round(stats.totalExpenses / expenses.length).toLocaleString() : 0}
              </p>
              <p className="text-[11px] text-indigo-700 mt-1">Transaction average</p>
            </div>
          </div>

          {/* Expenses Table with 8-per-page Pagination */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            {(() => {
              const totalExpensePages = Math.ceil(expenses.length / BATCH_SIZE) || 1;
              const paginatedExpenses = expenses.slice((expensePage - 1) * BATCH_SIZE, expensePage * BATCH_SIZE);

              return (
                <>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3 text-left">Expense ID</th>
                        <th className="px-4 py-3 text-left">Vendor / Description</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedExpenses.length > 0 ? (
                        paginatedExpenses.map((exp) => (
                          <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">{exp.id}</td>
                            <td className="px-4 py-3 font-semibold">{exp.title || exp.vendor || 'Operational Expense'}</td>
                            <td className="px-4 py-3 text-slate-500">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                                {exp.category || 'General'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{exp.date || 'Today'}</td>
                            <td className="px-4 py-3 font-bold text-rose-700">Rs {(exp.amount || 0).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {exp.status || 'Approved'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">
                            No operating expense records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {expenses.length > BATCH_SIZE && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        Showing <span className="font-bold text-slate-700">{(expensePage - 1) * BATCH_SIZE + 1}</span> to <span className="font-bold text-slate-700">{Math.min(expensePage * BATCH_SIZE, expenses.length)}</span> of <span className="font-bold text-slate-700">{expenses.length}</span> expenses
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={expensePage === 1}
                          onClick={() => setExpensePage((p) => Math.max(1, p - 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="px-3 font-semibold text-slate-700">Page {expensePage} of {totalExpensePages}</span>
                        <button
                          type="button"
                          disabled={expensePage >= totalExpensePages}
                          onClick={() => setExpensePage((p) => Math.min(totalExpensePages, p + 1))}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 6. USER LOGINS & SESSION AUDIT TAB */}
      {activeTab === 'logins' && (
        <div className="space-y-6">
          {/* Active Session Banner */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <UserCheck className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Logged In Session
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Session ID: #SYS-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <h2 className="text-xl font-extrabold mt-1 text-slate-900">{user?.name || user?.fullName || 'Active Administrator'}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5 flex-wrap">
                    <span>Email: <strong className="text-slate-800 font-mono font-semibold">{user?.email || user?.loginEmail || 'admin@hospital.com'}</strong></span>
                    <span>•</span>
                    <span>Role: <strong className="text-blue-700 font-semibold">{user?.role || 'Admin'}</strong></span>
                    <span>•</span>
                    <span>Department: <strong className="text-indigo-700 font-semibold">{user?.department || 'Executive Management'}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Security Clearance</p>
                  <p className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Full System Control
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Login Accounts Directory */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  System Login Accounts &amp; Authorized Staff Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit all user accounts authorized to log into the hospital ERP system with their login credentials and active session state.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const rows = systemLoginAccounts.map((u) => ({
                    'Account Name': u.name,
                    'Login Email': u.email,
                    'Role': u.role,
                    'Department': u.department,
                    'Login Access': u.status,
                    'Current Session': u.isCurrentSession ? 'YES (Active Now)' : 'NO'
                  }));
                  downloadCSV(`Hospital_System_User_Logins_${Date.now()}.csv`, rows);
                  showToast('success', 'Logins Exported', 'System login accounts report downloaded.');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> Export Logins CSV
              </button>
            </div>

            {/* Accounts Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3 text-left">User Name</th>
                    <th className="px-4 py-3 text-left">Login Email Address</th>
                    <th className="px-4 py-3 text-left">System Role</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Access Status</th>
                    <th className="px-4 py-3 text-center">Session State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {systemLoginAccounts.map((acc, index) => (
                    <tr key={acc.email || index} className={`hover:bg-slate-50/60 transition-colors ${acc.isCurrentSession ? 'bg-blue-50/40' : ''}`}>
                      <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{acc.name}</p>
                          {acc.isCurrentSession && (
                            <span className="text-[10px] text-blue-600 font-semibold">Active Signed-in User</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-800 font-medium">{acc.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          acc.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : acc.role === 'Doctor'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {acc.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{acc.department}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          acc.status.includes('Active')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {acc.isCurrentSession ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Signed In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                            Authorized
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
