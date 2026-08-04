import React, { useState } from 'react';
import { INITIAL_DOCTORS_STAFF } from '../../data/adminData';
import { useAuth } from '../../contexts/AuthContext';
import {
  Stethoscope, Search, Clock, Award, Star, Calendar,
  UserCheck, Activity, CheckCircle, Plus
} from 'lucide-react';

export default function DoctorStaffManagement() {
  const { showToast } = useAuth();
  const [staff, setStaff] = useState(INITIAL_DOCTORS_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('All');

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift =
      selectedShift === 'All' || s.shift.toLowerCase().includes(selectedShift.toLowerCase());
    return matchesSearch && matchesShift;
  });

  const handleToggleDuty = (id) => {
    setStaff((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'On Duty' ? 'Off Duty' : 'On Duty';
          showToast('success', 'Duty Roster Updated', `${item.name} status set to ${nextStatus}.`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" /> Doctor & Staff Oversight
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track doctors, nurses, shifts, and consultation fees in an easy-to-read staff dashboard.
          </p>
        </div>
        <button
          onClick={() => showToast('info', 'Onboard Physician', 'Form to add new specialist physician.')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Medical Staff
        </button>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Total Practitioners</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{staff.length}</div>
          <div className="text-xs text-blue-600 mt-1">Specialists & Nurses</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Currently On Duty</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {staff.filter(s => s.status === 'On Duty').length}
          </div>
          <div className="text-xs text-green-600 mt-1">Active on shift</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Average Staff Rating</div>
          <div className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1">
            4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xs text-gray-400 mt-1">From patient feedback</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Monthly Consultations</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">2,520</div>
          <div className="text-xs text-purple-500 mt-1">OPD & IPD Visits</div>
        </div>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search physician name, specialization, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Filter Shift:</span>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="Night">Night Shift</option>
          </select>
        </div>
      </div>

      {/* ── DOCTORS & STAFF CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <img
                src={doc.avatar}
                alt={doc.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'On Duty'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                <div className="text-xs text-blue-600 font-medium">{doc.specialization}</div>
                <div className="text-xs text-gray-400">{doc.department}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span className="text-gray-500">Qualification:</span>
                <span className="font-semibold text-gray-800">{doc.qualification}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="text-gray-500">Shift Schedule:</span>
                <span className="font-medium text-gray-800">{doc.shift}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium text-gray-800">{doc.experience}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="text-gray-500">Consultation Fee:</span>
                <span className="font-bold text-emerald-600">{doc.consultationFee}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doc.rating}</span>
                <span className="text-gray-400 font-normal">({doc.patientsCount} patients)</span>
              </div>

              <button
                onClick={() => handleToggleDuty(doc.id)}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                  doc.status === 'On Duty'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {doc.status === 'On Duty' ? 'Set Off Duty' : 'Set On Duty'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
