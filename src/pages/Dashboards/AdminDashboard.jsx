import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency } from '../../utils/financeUtils';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users, Stethoscope, Calendar, Bed, IndianRupee, Pill,
  FlaskConical, AlertTriangle, TrendingUp, TrendingDown,
  Server, Database, HardDrive, Tag,
  CalendarCheck, Scissors, MessageSquare, Wrench,
  Bell, Package, Activity, Receipt, UserPlus,
  BarChart3, CalendarPlus, FileText, Plus, Eye,
  CheckCircle, Clock, XCircle
} from 'lucide-react';
import {
  kpiStats,
  monthlyPatientData,
  monthlyFinancialData,
  revenueData,
  appointmentsByDept,
  bedOccupancyByWard,
  lowStockMedicines
} from '../../data/dashboardData';

// ─── Live Clock ───────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right">
      <div className="text-sm font-medium text-gray-700">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-xs text-gray-400">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}

// ─── Icon map for KPIs ────────────────────────────────
const iconMap = {
  Users, Stethoscope, Calendar, Bed, IndianRupee, Pill,
  FlaskConical, AlertTriangle, Activity
};

// ─── Status badge (simple) ───────────────────────────
function Badge({ status }) {
  const map = {
    Completed:  'bg-green-100 text-green-700',
    Pending:    'bg-yellow-100 text-yellow-700',
    Cancelled:  'bg-red-100 text-red-700',
    Admitted:   'bg-blue-100 text-blue-700',
    OPD:        'bg-purple-100 text-purple-700',
    ICU:        'bg-red-100 text-red-700',
    Discharged: 'bg-gray-100 text-gray-600',
    Critical:   'bg-red-100 text-red-700',
    Low:        'bg-yellow-100 text-yellow-700',
    Operational:'bg-green-100 text-green-700',
    Running:    'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── Section title ────────────────────────────────────
function SectionTitle({ title, action, onActionClick }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-800 border-l-2 border-blue-600 pl-2">{title}</h2>
      {action && <span onClick={onActionClick} className="text-xs text-blue-600 cursor-pointer hover:underline font-medium">{action}</span>}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

// ─── Chart tooltip ────────────────────────────────────
const SimpleTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded px-3 py-2 text-xs shadow">
        <p className="font-medium text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Event type icon ──────────────────────────────────
function EventIcon({ type }) {
  if (type === 'surgery')     return <Scissors className="w-4 h-4 text-red-500" />;
  if (type === 'meeting')     return <MessageSquare className="w-4 h-4 text-blue-500" />;
  if (type === 'maintenance') return <Wrench className="w-4 h-4 text-yellow-600" />;
  return <CalendarCheck className="w-4 h-4 text-green-600" />;
}

// ─── Quick action icon map ────────────────────────────
const qaIconMap = {
  UserPlus, Stethoscope, CalendarPlus, FileText, Plus,
  BarChart3, Package, Users
};

// ════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { appointments = [], doctors = [], departments = [], patients = [], settings } = useData();
  const { totalRevenue = 0, totalExpenses = 0, netProfit = 0, pendingPayments = 0, expenses = [], invoices = [] } = useFinance();

  const totalPatients = patients.length;
  const outpatientCount = patients.filter((patient) => `${patient.status || ''}`.toLowerCase() === 'opd').length;
  const inpatientCount = patients.filter((patient) => `${patient.status || ''}`.toLowerCase() === 'inpatient').length;
  const totalDoctors = doctors.length;
  const onDutyDoctors = doctors.filter((doctor) => `${doctor.availability || ''}`.toLowerCase() === 'available').length;
  const offDutyDoctors = totalDoctors - onDutyDoctors;

  const bedTotal = departments.reduce((sum, dept) => sum + Number(dept.bedsTotal || dept.totalBeds || 0), 0);
  const bedOccupied = departments.reduce((sum, dept) => sum + Number(dept.bedsOccupied || dept.occupiedBeds || 0), 0);
  const bedAvailable = Math.max(0, bedTotal - bedOccupied);
  const bedPct = bedTotal > 0 ? Math.round((bedOccupied / bedTotal) * 100) : 0;

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((appt) => appt.date === todayISO);
  const completedAppointments = todayAppointments.filter((appt) => ['confirmed', 'completed'].includes(`${appt.status || ''}`.toLowerCase())).length;
  const remainingAppointments = Math.max(0, todayAppointments.length - completedAppointments);

  const latestPatients = [...patients]
    .sort((a, b) => new Date(b.admissionDate || b.createdAt || 0) - new Date(a.admissionDate || a.createdAt || 0))
    .slice(0, 5);

  const findDoctorName = (doctorId) => doctors.find((doc) => doc.id === doctorId)?.name || 'Unknown Doctor';
  const findDepartmentName = (departmentId) => departments.find((dept) => dept.id === departmentId)?.name || 'Unknown';

  const revenueTrend = useMemo(() => {
    const trendMap = {};
    invoices.forEach((inv) => {
      const date = new Date(inv.invoiceDate);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (!trendMap[key]) trendMap[key] = { month: label, amount: 0, key };
      trendMap[key].amount += Number(inv.amount || 0);
    });
    const result = Object.values(trendMap).sort((a, b) => a.key.localeCompare(b.key));
    if (result.length > 0) return result;

    return [
      { month: 'Apr 2026', amount: 73400 },
      { month: 'May 2026', amount: 101700 },
      { month: 'Jun 2026', amount: 113300 },
      { month: 'Jul 2026', amount: 97500 }
    ];
  }, [invoices]);

  const expenseTrend = useMemo(() => {
    const trendMap = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (!trendMap[key]) trendMap[key] = { month: label, amount: 0, key };
      trendMap[key].amount += Number(expense.amount || 0);
    });
    return Object.values(trendMap).sort((a, b) => a.key.localeCompare(b.key));
  }, [expenses]);

  const deptBedOccupancy = useMemo(() => {
    const palette = ['#2563EB', '#7C3AED', '#0891B2', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];
    
    const list = departments
      .map((d, i) => {
        const bedsTotal = Math.max(0, Number(d.bedsTotal) || 0);
        const bedsOccupied = Math.max(0, Number(d.bedsOccupied) || 0);
        return {
          id: d.id,
          name: d.name,
          value: bedsOccupied,
          bedsOccupied,
          bedsTotal,
          chartValue: bedsOccupied > 0 ? bedsOccupied : 0.001,
          color: palette[i % palette.length]
        };
      })
      .filter((d) => d.bedsTotal > 0 || d.bedsOccupied > 0);

    return list;
  }, [departments]);

  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-full overflow-x-hidden">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <LiveClock />
      </div>

      {/* ── HOSPITAL OVERVIEW HERO SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
            Hospital Key Metrics
          </h2>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Real-Time Operational Sync
          </span>
        </div>

        {/* ── 4 PRIMARY HERO KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Patients */}
          <div 
            onClick={() => navigate('/patients')}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{totalPatients}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 flex items-center justify-between">
              <span>Total Registered Patients</span>
              <span className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                View Patients &rarr;
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
              <span>Outpatient (OPD): {outpatientCount}</span>
              <span>Inpatient: {inpatientCount}</span>
            </div>
          </div>

          {/* Card 2: Total Doctors */}
          <div 
            onClick={() => navigate('/doctors')}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-indigo-400 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <TrendingUp className="w-3 h-3" /> +3.2%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{totalDoctors}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 flex items-center justify-between">
              <span>Active Physicians & Specialists</span>
              <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                View Doctors &rarr;
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
              <span className="text-emerald-600 font-medium">{onDutyDoctors} On Duty Today</span>
              <span>{offDutyDoctors} Off Duty</span>
            </div>
          </div>

          {/* Card 3: Today's Appointments */}
          <div 
            onClick={() => navigate('/appointments')}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-violet-400 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <TrendingUp className="w-3 h-3" /> +7.4%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{todayAppointments.length}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 flex items-center justify-between">
              <span>Today's Scheduled Consultations</span>
              <span className="text-[11px] text-violet-600 font-semibold group-hover:underline flex items-center gap-0.5">
                View Appointments &rarr;
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
              <span className="text-blue-600 font-medium">{completedAppointments} Completed</span>
              <span>{remainingAppointments} Remaining</span>
            </div>
          </div>

          {/* Card 4: Bed Occupancy */}
          <div 
            onClick={() => navigate('/admin/departments')}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-emerald-400 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Bed className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {bedPct}% Occupied
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{bedAvailable}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 flex items-center justify-between">
              <span>Available Beds (of {bedTotal} Total)</span>
              <span className="text-[11px] text-emerald-600 font-semibold group-hover:underline flex items-center gap-0.5">
                View Beds &rarr;
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${bedPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL CHARTS ROW: Expense Trend + Department Bed Occupancy ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Revenue (2 Columns Wide) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Total Revenue</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Financial & Billing Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Monthly revenue generated from financial & billing invoices</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/admin/financials')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 group"
                >
                  <span>{formatCurrency(totalRevenue)} Total</span>
                  <span className="text-[10px] opacity-80 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    dy={5}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                    dx={-5}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value;
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 text-xs space-y-1">
                            <p className="text-slate-400 font-medium">{label}</p>
                            <p className="text-sm font-bold text-emerald-400">
                              Total Revenue: {formatCurrency(val)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10B981"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#revenueEmeraldGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    dot={{ r: 5, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2.5 }}
                    activeDot={{ r: 8, fill: '#10B981', stroke: '#ffffff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart — Department Bed Occupied (1 Column Wide) */}
          <div className="lg:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <SectionTitle title="Department Bed Occupied" />
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={deptBedOccupancy} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="chartValue">
                  {deptBedOccupancy.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name, item) => [`${item.payload.bedsOccupied} / ${item.payload.bedsTotal} beds occupied`, item.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {deptBedOccupancy.slice(0, 5).map((d) => {
                const pct = d.bedsTotal > 0 ? Math.round((d.bedsOccupied / d.bedsTotal) * 100) : 0;
                return (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-gray-600 font-medium truncate">{d.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">{d.bedsOccupied}</span>
                      <span className="text-[10px] text-gray-400 font-normal"> / {d.bedsTotal} beds ({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>



      {/* ── TODAY'S APPOINTMENTS ── */}
      <div>
        <SectionTitle 
          title="Today's Appointments" 
          action="View All Appointments →" 
          onActionClick={() => navigate('/appointments')} 
        />
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">ID</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Patient</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Doctor</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Department</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Time</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.id}</td>
                      <td className="px-4 py-3"><span className="text-sm font-medium text-gray-800">{row.patientName}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{findDoctorName(row.doctorId)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{findDepartmentName(row.departmentId)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.time}</td>
                      <td className="px-4 py-3"><Badge status={row.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── RECENT PATIENTS + ACTIVITY ── */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <SectionTitle 
            title="Recently Registered Patients" 
            action="View All Patients →" 
            onActionClick={() => navigate('/patients')} 
          />
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Patient</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Dept</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {latestPatients.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{row.name}</div>
                          <div className="text-xs text-gray-400">{row.age} yrs · {row.gender}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-400">{row.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.department || 'Unknown'}</td>
                      <td className="px-4 py-3"><Badge status={row.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(row.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">{settings?.hospitalName || 'CityCare Hospital ERP'} &bull; v2.4.1 &bull; Admin Dashboard &bull; &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
