import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/financeUtils';

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-5 h-72 min-h-[280px]">{children}</div>
    </motion.div>
  );
}

const COLORS = ['#2563EB', '#0F766E', '#F59E0B', '#DC2626', '#7C3AED'];

export default function FinanceCharts({ revenueTrend = [], revenueVsExpenses = [], paymentDistribution = [], monthlyComparison = [] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Revenue Trend" subtitle="Monthly revenue movement across the selected range">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueTrend} margin={{ top: 14, right: 20, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#2563EB" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} padding={{ left: 8, right: 8 }} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip cursor={{ stroke: '#CBD5E1', strokeDasharray: '3 3' }} formatter={(value) => formatCurrency(value)} />
            <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 6 }} fill="url(#trendGradient)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue vs Expenses" subtitle="Compare earnings and costs by month">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueVsExpenses} margin={{ top: 10, right: 8, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#2563EB" />
            <Bar dataKey="expenses" radius={[8, 8, 0, 0]} fill="#0F766E" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Payment Mix" subtitle="How revenue is collected">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={paymentDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {paymentDistribution.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Comparison" subtitle="Current month performance versus the previous month">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyComparison} margin={{ top: 14, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
