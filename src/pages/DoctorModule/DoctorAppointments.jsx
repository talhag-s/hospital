import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getDoctorForUser, isAppointmentForDoctor } from '../../utils/doctorHelpers';
import { Calendar, Search, Plus, Filter, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '../../components/reception/StatusBadge';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { doctors, appointments, patients, addAppointment, updateAppointment, addPatient, updateQueueRecord, queue, admitPatient, dischargePatient } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  // 1. Identify logged-in doctor
  const currentDoctor = useMemo(() => {
    return getDoctorForUser(user, doctors) || {};
  }, [user, doctors]);

  // 2. Filter doctor's appointments strictly
  const myAppointments = useMemo(() => {
    return appointments.filter((apt) => isAppointmentForDoctor(apt, currentDoctor, user));
  }, [appointments, currentDoctor, user]);

  const filteredAppointments = useMemo(() => {
    return myAppointments.filter((apt) => {
      const matchSearch = !search || apt.patientName?.toLowerCase().includes(search.toLowerCase()) || apt.id?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [myAppointments, search, statusFilter]);

  // Handle status update
  const handleStatusChange = (appointment, newStatus) => {
    updateAppointment(appointment.id, { status: newStatus });
    const queueRecord = queue.find((q) => q.appointmentId === appointment.id);
    if (queueRecord) {
      const qStatus = newStatus === 'Confirmed' ? 'Waiting' : newStatus === 'Completed' ? 'Completed' : 'Cancelled';
      updateQueueRecord(queueRecord.id, { status: qStatus });
    }
    setFeedback(`Status for ${appointment.patientName} changed to "${newStatus}".`);
  };

  const handleAdmitPatient = (apt) => {
    const assignedBed = admitPatient(apt.patientId || apt.patientName, currentDoctor.department || 'General Medicine');
    updateAppointment(apt.id, { status: 'Confirmed' });
    setFeedback(`Patient ${apt.patientName} admitted successfully! Automatically assigned Bed: ${assignedBed}`);
  };

  const handleDischargePatient = (apt) => {
    dischargePatient(apt.patientId || apt.patientName);
    setFeedback(`Patient ${apt.patientName} discharged. Assigned bed released.`);
  };

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    phone: '',
    gender: 'Male',
    age: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    status: 'Confirmed'
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.patientName?.trim()) return;

    let patientObj = patients.find(p => (p.name || p.fullName || '').toLowerCase() === bookingForm.patientName.trim().toLowerCase());
    if (!patientObj) {
      const nextPId = `PAT-${String(patients.length + 1001).padStart(4, '0')}`;
      patientObj = {
        id: nextPId,
        name: bookingForm.patientName.trim(),
        fullName: bookingForm.patientName.trim(),
        phone: bookingForm.phone || '+92 300 0000000',
        gender: bookingForm.gender || 'Male',
        age: Number(bookingForm.age) || 30,
        department: currentDoctor.department || 'General Medicine',
        assignedDoctor: currentDoctor.name,
        doctorId: currentDoctor.id,
        admissionDate: bookingForm.date,
        status: 'Outpatient'
      };
      addPatient(patientObj);
    }

    const nextAptId = `APT-${String(appointments.length + 1).padStart(3, '0')}`;
    const newApt = {
      id: nextAptId,
      patientName: patientObj.name,
      patientId: patientObj.id,
      patientPhone: patientObj.phone,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      departmentId: currentDoctor.departmentId || 'DEP-001',
      department: currentDoctor.department || 'General Medicine',
      date: bookingForm.date,
      time: bookingForm.time,
      status: bookingForm.status
    };

    addAppointment(newApt);
    setShowModal(false);
    setBookingForm({ patientName: '', phone: '', gender: 'Male', age: '', date: new Date().toISOString().slice(0, 10), time: '09:00', status: 'Confirmed' });
    setFeedback(`New appointment booked for ${patientObj.name}.`);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> My Doctor Appointments
          </h1>
          <p className="text-sm text-gray-600 mt-1">Appointments booked for {currentDoctor.name} ({currentDoctor.department || 'General Medicine'})</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or APT ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Appointment ID</th>
                <th className="px-4 py-3.5">Patient Name</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5 text-right">Bed & Admission Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => {
                  const patientObj = patients.find(
                    (p) => p.id === apt.patientId || (p.name || p.fullName || '').toLowerCase() === apt.patientName.toLowerCase()
                  );
                  const isAdmitted = patientObj?.status === 'Admitted';
                  const bedNum = patientObj?.bedNumber || 'N/A';

                  return (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{apt.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{apt.patientName}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.patientPhone || '—'}</td>
                      <td className="px-4 py-3">{apt.date}</td>
                      <td className="px-4 py-3 font-medium">{apt.time}</td>
                      <td className="px-4 py-3 text-right">
                        {isAdmitted ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                              🛏️ {bedNum}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDischargePatient(apt)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 rounded-lg text-xs font-semibold border border-gray-300 transition-colors"
                            >
                              Discharge
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdmitPatient(apt)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                          >
                            Admit & Assign Bed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No appointments found matching your selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Book Appointment for {currentDoctor.name}</h3>
                <p className="text-xs text-gray-500">Add an appointment specifically for your clinic schedule</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  list="doc-pts-datalist"
                  value={bookingForm.patientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value.replace(/[^a-zA-Z\s.'-]/g, '') })}
                  placeholder="Type patient full name"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                  required
                />
                <datalist id="doc-pts-datalist">
                  {patients.map(p => (<option key={p.id} value={p.name || p.fullName} />))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/[^0-9+\-\s()]/g, '') })}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bookingForm.age}
                    onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="e.g. 28"
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
