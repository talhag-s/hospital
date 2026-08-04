import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck, RefreshCw, Filter, Search, Plus, Download,
  CheckCircle2, Clock, AlertCircle, Sparkles
} from 'lucide-react';

export default function RoleFeatureView({ title, moduleName, description, icon: IconComponent, stats = [], mockData = [] }) {
  const { user, showToast } = useAuth();

  const handleAction = (actionName) => {
    showToast('info', `${title} Action`, `Triggered ${actionName} within ${moduleName} module.`);
  };

  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
              {moduleName} Module
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mt-1">
            {IconComponent && <IconComponent className="w-6 h-6 text-blue-600" />}
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {description || `Operational management workspace for ${title.toLowerCase()} within CityCare Hospital ERP.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('Export Data')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" /> Export
          </button>
          <button
            onClick={() => handleAction('Primary Task')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>
      </div>

      {/* ── STATS SUMMARY CARDS ── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              {s.change && (
                <div className="text-xs text-blue-600 font-medium mt-1">{s.change}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TOOLBAR ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select className="text-xs border border-gray-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500">
            <option value="All">All Records</option>
            <option value="Active">Active / Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Active {title} Workspace
        </h2>

        {mockData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Reference Code</th>
                  <th className="text-left px-4 py-3">Item / Subject</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Updated At</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-bold">{item.code || `REF-00${index + 1}`}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.category || moduleName}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{item.date || 'Today, 10:00 AM'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> {item.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleAction(`Manage ${item.title}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View & Manage &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200 space-y-2">
            <ShieldCheck className="w-8 h-8 text-blue-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-800">Operational Workspace Loaded</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Real-time records and interactive data controls for <strong className="text-gray-700">{title}</strong> are synced with the backend data store.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
