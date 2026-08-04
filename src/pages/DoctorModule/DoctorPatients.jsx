import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getDoctorForUser, isAppointmentForDoctor, isPatientForDoctor } from '../../utils/doctorHelpers';
import { Users, Search, Filter, Phone, Heart, Activity } from 'lucide-react';

export default function DoctorPatients() {
  const { user } = useAuth();
  const { doctors, patients, appointments, admitPatient, dischargePatient } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  // Identify logged-in doctor
  const currentDoctor = useMemo(() => {
    return getDoctorForUser(user, doctors) || {};
  }, [user, doctors]);

  // Filter doctor's appointments strictly to cross reference patients
  const myAppointments = useMemo(() => {
    return appointments.filter((apt) => isAppointmentForDoctor(apt, currentDoctor, user));
  }, [appointments, currentDoctor, user]);

  // Filter doctor's patients strictly
  const myPatients = useMemo(() => {
    return patients.filter((p) => isPatientForDoctor(p, currentDoctor, user, myAppointments));
  }, [patients, currentDoctor, user, myAppointments]);

  const filteredPatients = useMemo(() => {
    return myPatients.filter((p) => {
      const matchSearch = !search ||
        (p.name || p.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        p.id?.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone || p.phoneNumber || '').includes(search);

      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [myPatients, search, statusFilter]);

  const handleAdmit = (p) => {
    if (p.status === 'Admitted' && p.bedNumber && p.bedNumber !== 'N/A' && p.bedNumber !== '—') {
      setFeedback(`Patient ${p.name || p.fullName} has ALREADY taken ${p.bedNumber}!`);
      return;
    }

    const deptName = p.department || currentDoctor.department || 'Cardiology';
    const assignedBed = admitPatient(p.id, deptName);
    if (!assignedBed) {
      setFeedback(`Cannot Admit: ${deptName} Department has a maximum of 4 beds and ALL are currently occupied!`);
    } else {
      setFeedback(`Patient ${p.name || p.fullName} admitted successfully to ${assignedBed}!`);
    }
  };

  const handleDischarge = (p) => {
    dischargePatient(p.id);
    setFeedback(`Patient ${p.name || p.fullName} discharged. Bed released.`);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> My Patients Directory
          </h1>
          <p className="text-sm text-gray-600 mt-1">Patients assigned to or under treatment with {currentDoctor.name}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-indigo-800 text-xs font-semibold">
          Total Assigned Patients: {myPatients.length}
        </div>
      </div>

      {feedback && (
        <div className={`rounded-xl border px-4 py-3 text-sm flex justify-between items-center ${
          feedback.includes('Cannot Admit') || feedback.includes('ALREADY')
            ? 'border-amber-200 bg-amber-50 text-amber-900 font-semibold'
            : 'border-emerald-200 bg-emerald-50 text-emerald-800'
        }`}>
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, ID, phone..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
          >
            <option value="all">All Patient Status</option>
            <option value="Admitted">Admitted</option>
            <option value="OPD">OPD / Outpatient</option>
            <option value="Discharged">Discharged</option>
            <option value="Critical">Critical / ICU</option>
          </select>
        </div>
      </div>

      {/* Patient Table List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Bed Number</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => {
                  const isAdmitted = p.status === 'Admitted' || p.status === 'Critical';
                  const bedNum = p.bedNumber || 'N/A';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-bold text-gray-900">{p.name || p.fullName}</p>
                          <p className="text-xs text-gray-500">
                            {p.age} yrs • {p.gender} • Blood: <strong className="text-red-600">{p.bloodGroup || 'O+'}</strong>
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 font-medium">
                        {p.phone || p.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 font-semibold">
                        {p.department || currentDoctor.department || 'General'}
                      </td>
                      <td className="px-4 py-3">
                        {isAdmitted && bedNum !== 'N/A' && bedNum !== '—' ? (
                          <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            🛏️ {bedNum}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium font-mono">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isAdmitted
                            ? 'bg-rose-100 text-rose-700'
                            : p.status === 'Discharged'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.status || 'Outpatient'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isAdmitted ? (
                          <button
                            type="button"
                            onClick={() => handleDischarge(p)}
                            className="px-3 py-1 bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 rounded-lg text-xs font-semibold border border-gray-300 transition-colors"
                          >
                            Discharge
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdmit(p)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                          >
                            Admit &amp; Assign Bed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500 text-sm">
                    No patients found matching your selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
