import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const getAvailabilityConfig = (status) => {
  const norm = String(status || '').replace('-', ' ').toLowerCase();
  if (norm.includes('busy')) {
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200/90 hover:bg-amber-100/70', dot: 'bg-amber-500', value: 'Busy', label: 'Busy' };
  }
  if (norm.includes('leave') || norm.includes('off') || norm.includes('unavail')) {
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200/90 hover:bg-rose-100/70', dot: 'bg-rose-500', value: 'On Leave', label: 'On Leave' };
  }
  return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100/70', dot: 'bg-emerald-500', value: 'Available', label: 'Available' };
};

export default function DoctorTable({ doctors, onDelete, sortKey, sortDir, onSort }) {
  const navigate = useNavigate();
  const { updateDoctor } = useData() || {};
  const { showToast } = useAuth() || {};

  const handleSort = (key) => {
    onSort(key);
  };

  const handleAvailabilityChange = (doc, newAvailability, e) => {
    if (e) e.stopPropagation();
    if (updateDoctor) {
      updateDoctor(doc.id, { availability: newAvailability });
    }
    if (showToast) {
      showToast(
        'success',
        'Availability Updated',
        `${doc.name} status updated to ${newAvailability}`
      );
    }
  };

  const SortHeader = ({ label, sortableKey, align = 'text-left' }) => (
    <th onClick={() => handleSort(sortableKey)} className={`px-4 py-3.5 ${align} text-xs font-semibold text-gray-700 cursor-pointer select-none uppercase tracking-wider`}>
      <div className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${align === 'text-center' ? 'justify-center' : align === 'text-right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        {sortKey === sortableKey && (
          <span className="text-xs text-blue-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 border-b border-gray-200 sticky top-0">
          <tr>
            <SortHeader label="Doctor ID" sortableKey="id" />
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
            <SortHeader label="Full Name" sortableKey="name" />
            <SortHeader label="Department" sortableKey="department" />
            <SortHeader label="Phone" sortableKey="phone" />
            <SortHeader label="Experience" sortableKey="experience" />
            <th className="px-4 py-3.5 text-center text-xs font-bold text-[#2C3E50] uppercase tracking-wider select-none">
              AVAILABILITY
            </th>
            <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {doctors.map(doc => {
            const config = getAvailabilityConfig(doc.availability);

            return (
              <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-900 align-middle">{doc.id}</td>
                <td className="px-4 py-3.5 align-middle">
                  <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                </td>
                <td className="px-4 py-3.5 text-gray-900 font-medium align-middle">{doc.name}</td>
                <td className="px-4 py-3.5 text-gray-600 align-middle">{doc.department}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs font-mono align-middle">{doc.phone}</td>
                <td className="px-4 py-3.5 text-gray-600 align-middle">{doc.experience} yrs</td>
                <td className="px-4 py-3.5 align-middle text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <select
                      value={config.value}
                      onChange={(e) => handleAvailabilityChange(doc, e.target.value, e)}
                      className={`appearance-none text-xs font-semibold pl-6 pr-6 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${config.bg}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <span className={`w-2 h-2 rounded-full absolute left-2.5 pointer-events-none ${config.dot}`} />
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none opacity-60" />
                  </div>
                </td>
                <td className="px-4 py-3.5 align-middle text-center print:hidden">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => navigate(`/doctors/${doc.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/doctors/edit/${doc.id}`)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(doc.id, doc.name)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {doctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">No doctors found</div>
      )}
    </div>
  );
}


