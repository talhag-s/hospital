import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_DOCTORS } from '../../data/doctors';
import { useData } from '../../contexts/DataContext';
import { filterDoctors, sortDoctors, paginateDoctors } from '../../utils/doctorHelpers';
import { useAuth } from '../../contexts/AuthContext';
import { downloadCSV } from '../../utils/exportHelpers';
import DoctorTable from '../../components/doctors/DoctorTable';
import { UserPlus, Download, Printer, RotateCcw, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const PER_PAGE = 5;

export default function DoctorList() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const { doctors, removeDoctor, departments } = useData();

  const [filters, setFilters] = useState({ search: '', department: 'All', availability: 'All', status: 'All' });
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const [isPrinting, setIsPrinting] = useState(false);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ search: '', department: 'All', availability: 'All', status: 'All' });
    setPage(1);
  };

  const filtered = filterDoctors(doctors || INITIAL_DOCTORS, filters);
  const sorted = sortDoctors(filtered, sortKey, sortDir);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated = paginateDoctors(sorted, page, PER_PAGE);

  const doctorsToRender = isPrinting ? sorted : paginated;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleExport = () => {
    if (!sorted.length) {
      showToast('warning', 'Export Failed', 'No doctor records to export.');
      return;
    }

    const rows = sorted.map((doctor) => ({
      ID: doctor.id,
      Name: doctor.name,
      Department: doctor.department,
      Specialization: doctor.specialization || '',
      Availability: doctor.availability,
      Status: doctor.status,
    }));

    downloadCSV('doctor-list.csv', rows);
    showToast('success', 'Export Started', 'Doctor list download has started.');
  };

  const handlePrint = () => {
    showToast('info', 'Print Started', 'Opening print dialog...');
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 100);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} (${id})? This cannot be undone.`)) {
      removeDoctor(id);
      showToast('success', 'Doctor Deleted', `${name}'s record has been removed.`);
      if (paginated.length === 1 && page > 1) setPage(page - 1);
    }
  };

  const selectCls = 'text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage doctors, schedules, and availability</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={() => navigate('/doctors/add')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
          <div className="text-xs text-gray-600 mt-1">Total Doctors</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">{doctors.filter(d => d.availability === 'Available').length}</div>
          <div className="text-xs text-gray-600 mt-1">Available Now</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-amber-600">{doctors.filter(d => d.status === 'Active').length}</div>
          <div className="text-xs text-gray-600 mt-1">Active Doctors</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 no-print">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, ID, email, specialization..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={filters.department} onChange={e => handleFilter('department', e.target.value)} className={selectCls}>
              <option value="All">All Departments</option>
              {departments.map((dept) => {
                const value = typeof dept === 'string' ? dept : (dept.name || dept.id);
                const label = typeof dept === 'string' ? dept : (dept.name || dept.id);
                return <option key={value} value={value}>{label}</option>;
              })}
            </select>
            <select value={filters.availability} onChange={e => handleFilter('availability', e.target.value)} className={selectCls}>
              <option value="All">All Availability</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
            <select value={filters.status} onChange={e => handleFilter('status', e.target.value)} className={selectCls}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="On-Leave">On-Leave</option>
              <option value="Probation">Probation</option>
            </select>
            {(filters.search || filters.department !== 'All' || filters.availability !== 'All' || filters.status !== 'All') && (
              <button onClick={handleReset} className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <DoctorTable doctors={doctorsToRender} onDelete={handleDelete} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />

      {!isPrinting && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 no-print">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg font-semibold ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
