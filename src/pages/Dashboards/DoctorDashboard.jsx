import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getDoctorForUser, isAppointmentForDoctor, isPatientForDoctor } from '../../utils/doctorHelpers';
import {
  Stethoscope, Calendar, Users, Clock, Plus, CheckCircle,
  Activity, Search, ChevronRight, UserPlus, Filter, ShieldCheck
} from 'lucide-react';
import StatusBadge from '../../components/reception/StatusBadge';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { doctors, appointments, patients, queue, updateDoctor, updateAppointment, updateQueueRecord, addAppointment, addPatient, departments } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
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

  // 3. Filter doctor's patients strictly
  const myPatients = useMemo(() => {
    return patients.filter((p) => isPatientForDoctor(p, currentDoctor, user, myAppointments));
  }, [patients, currentDoctor, user, myAppointments]);

  // 4. Filter doctor's queue strictly
  const myQueue = useMemo(() => {
    return queue.filter((q) => isAppointmentForDoctor(q, currentDoctor, user));
  }, [queue, currentDoctor, user]);

  // Handle status updates
  const handleStatusChange = (appointment, newStatus) => {
    updateAppointment(appointment.id, { status: newStatus });
    const queueRecord = queue.find((q) => q.appointmentId === appointment.id);
    if (queueRecord) {
      const qStatus = newStatus === 'Confirmed' ? 'Waiting' : newStatus === 'Completed' ? 'Completed' : 'Cancelled';
      updateQueueRecord(queueRecord.id, { status: qStatus });
    }
    setFeedback(`Status for ${appointment.patientName} updated to "${newStatus}".`);
  };

  // Toggle Doctor Availability State
  const handleToggleAvailability = (newAvail) => {
    if (currentDoctor?.id) {
      updateDoctor(currentDoctor.id, { availability: newAvail });
      setFeedback(`Your availability has been updated to "${newAvail}".`);
    }
  };

  // Booking Form State for Doctor
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
    if (!bookingForm.patientName?.trim()) {
      setFeedback('Please enter patient name.');
      return;
    }

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
        department: currentDoctor.department || 'Cardiology',
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
      department: currentDoctor.department || 'Cardiology',
      date: bookingForm.date,
      time: bookingForm.time,
      status: bookingForm.status
    };

    addAppointment(newApt);
    setShowBookingModal(false);
    setBookingForm({ patientName: '', phone: '', gender: 'Male', age: '', date: new Date().toISOString().slice(0, 10), time: '09:00', status: 'Confirmed' });
    setFeedback(`New appointment booked for ${patientObj.name}.`);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* ── Doctor Welcome Header Banner (Professional White Design) ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentDoctor.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150'}
              alt={currentDoctor.name}
              className="w-14 h-14 rounded-full border border-gray-200 object-cover shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900">{currentDoctor.name || 'Doctor Dashboard'}</h1>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                  {currentDoctor.specialization || 'Consultant'}
                </span>
                {currentDoctor.patientAccessScope === 'all' || currentDoctor.canViewAllPatients ? (
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Can Show All 4 Patients
                  </span>
                ) : currentDoctor.patientAccessScope === 'none' || currentDoctor.showZeroPatients ? (
                  <span className="text-xs bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                    🔒 Can Show 0 Patients (Restricted)
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                <span>Department of <strong className="text-gray-800">{currentDoctor.department || 'General Medicine'}</strong></span>
                <span className="text-gray-300">•</span>
                <span className="font-mono text-gray-500 font-semibold">ID: {currentDoctor.id || 'DOC-001'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="text-xs text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Appointments */}
        <div
          onClick={() => {
            setStatusFilter('all');
            navigate('/doctor/appointments');
          }}
          className="group bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
          title="Click to view all appointments"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
              Today's Appointments
            </p>
            <h3 className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 mt-1">
              {myAppointments.length}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{myAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length} Active / Confirmed</span>
              <span className="text-blue-600 opacity-0 group-hover:opacity-100 font-semibold transition-opacity">&rarr;</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* My Total Patients */}
        <div
          onClick={() => navigate('/doctor/patients')}
          className="group bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
          title="Click to view total patients"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
              My Total Patients
            </p>
            <h3 className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700 mt-1">
              {myPatients.length}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>Under Active Care</span>
              <span className="text-indigo-600 opacity-0 group-hover:opacity-100 font-semibold transition-opacity">&rarr;</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Today */}
        <div
          onClick={() => {
            setStatusFilter('Completed');
          }}
          className="group bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
          title="Click to filter completed consultations"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">
              Completed Today
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700 mt-1">
              {myAppointments.filter(a => a.status === 'Completed').length}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>Consultations Done</span>
              <span className="text-emerald-600 opacity-0 group-hover:opacity-100 font-semibold transition-opacity">&rarr;</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Today's Appointments & Consultations Section ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" /> Patient Consultations & Appointments
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage appointment status and patient visits for {currentDoctor.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient name..."
                className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">APT ID</th>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{apt.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{apt.patientName}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{apt.date} at {apt.time}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {apt.department || apt.doctorDepartment || currentDoctor.department || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleStatusChange(apt, apt.status === 'Completed' ? 'Confirmed' : 'Completed')}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                          apt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                        }`}
                      >
                        {apt.status === 'Completed' ? 'Reopen Visit' : 'Mark Completed'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                    No appointments scheduled for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── My Assigned Patients Grid ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> My Patients Directory
          </h2>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            View All Patients <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPatients.slice(0, 6).map((patient) => (
            <div key={patient.id} className="p-4 rounded-xl border border-gray-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{patient.id}</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{patient.name || patient.fullName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{patient.age} yrs • {patient.gender} • {patient.phone || patient.phoneNumber || 'N/A'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  patient.status === 'Admitted' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {patient.status || 'Outpatient'}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-600 flex justify-between">
                <span>Blood: <strong>{patient.bloodGroup || 'O+'}</strong></span>
                <span>Admitted: <strong>{patient.admissionDate || '2026-07-25'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Book Appointment Modal for Doctor ── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Book Appointment for {currentDoctor.name}</h3>
                <p className="text-xs text-gray-500">Create a direct consultation appointment for this doctor</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  list="doc-patient-datalist"
                  value={bookingForm.patientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                  placeholder="Type patient full name"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                  required
                />
                <datalist id="doc-patient-datalist">
                  {patients.map(p => (<option key={p.id} value={p.name || p.fullName} />))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={bookingForm.age}
                    onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                    placeholder="e.g. 35"
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
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
