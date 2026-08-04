import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';

export default function DoctorTable({ doctors, onDelete, sortKey, sortDir, onSort }) {
  const navigate = useNavigate();

  const handleSort = (key) => {
    onSort(key);
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
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <SortHeader label="Doctor ID" sortableKey="id" />
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
            <SortHeader label="Full Name" sortableKey="name" />
            <SortHeader label="Department" sortableKey="department" />
            <SortHeader label="Phone" sortableKey="phone" />
            <SortHeader label="Experience" sortableKey="experience" />
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Availability</th>
            <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {doctors.map(doc => (
            <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-900 align-middle">{doc.id}</td>
              <td className="px-4 py-3.5 align-middle">
                <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              </td>
              <td className="px-4 py-3.5 text-gray-900 font-medium align-middle">{doc.name}</td>
              <td className="px-4 py-3.5 text-gray-600 align-middle">{doc.department}</td>
              <td className="px-4 py-3.5 text-gray-600 text-xs font-mono align-middle">{doc.phone}</td>
              <td className="px-4 py-3.5 text-gray-600 align-middle">{doc.experience} yrs</td>
              <td className="px-4 py-3.5 align-middle">
                <StatusBadge availability={doc.availability} variant="availability" />
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
          ))}
        </tbody>
      </table>
      {doctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">No doctors found</div>
      )}
    </div>
  );
}
