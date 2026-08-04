import React, { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, X, ChevronLeft, ChevronRight, UserCheck, UserPlus, AlertCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/reception/PageHeader';
import SearchBar from '../../components/reception/SearchBar';
import FilterDropdown from '../../components/reception/FilterDropdown';
import AppointmentTable from '../../components/reception/AppointmentTable';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { getDoctorForUser, isAppointmentForDoctor } from '../../utils/doctorHelpers';

const initialBookingForm = {
  patientName: '',
  phone: '',
  gender: 'Male',
  age: '',
  cnic: '',
  bloodGroup: 'O+',
  address: '',
  emergencyContact: '',
  doctorId: '',
  departmentId: '',
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  status: 'Pending',
  consultationFee: '1500',
  paymentMode: 'Cash',
  paymentStatus: 'Paid'
};

export default function AppointmentManagement() {
  const { user } = useAuth();
  const { patients, appointments, doctors, departments, queue, addPatient, updatePatient, addAppointment, updateAppointment, removeAppointment, addQueueRecord, updateQueueRecord } = useData();
  const [search, setSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [feedback, setFeedback] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [bookingTab, setBookingTab] = useState('registered'); // 'registered' | 'new'
  const perPage = 5;

  const currentDoctor = useMemo(() => {
    if (user?.role !== 'Doctor') return null;
    return getDoctorForUser(user, doctors);
  }, [user, doctors]);

  const scopedAppointments = useMemo(() => {
    if (user?.role === 'Doctor' && currentDoctor) {
      return appointments.filter((a) => isAppointmentForDoctor(a, currentDoctor, user));
    }
    return appointments;
  }, [appointments, user, currentDoctor]);

  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBookingModal]);

  const filteredAppointments = useMemo(() => {
    const selectedDoc = doctors.find((d) => d.id === doctorFilter);
    const targetDocName = selectedDoc?.name ? selectedDoc.name.toLowerCase().replace(/^dr\.\s*/i, '').trim() : '';

    return scopedAppointments.filter((appointment) => {
      const matchSearch = (appointment.patientName || '').toLowerCase().includes(search.toLowerCase());

      const aptDocId = appointment.doctorId;
      const aptDocName = (appointment.doctorName || appointment.doctor || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();

      const legacyMap = {
        'DOC-001': 'DOC-101', 'DOC-101': 'DOC-001',
        'DOC-002': 'DOC-102', 'DOC-102': 'DOC-002',
        'DOC-003': 'DOC-103', 'DOC-103': 'DOC-003'
      };

      const matchDoctor =
        doctorFilter === 'all' ||
        aptDocId === doctorFilter ||
        legacyMap[doctorFilter] === aptDocId ||
        (targetDocName && aptDocName.includes(targetDocName)) ||
        (targetDocName && targetDocName.includes(aptDocName));

      const matchStatus = statusFilter === 'all' || appointment.status === statusFilter;

      return matchSearch && matchDoctor && matchStatus;
    });
  }, [scopedAppointments, search, doctorFilter, statusFilter, doctors]);

  const totalPages = Math.ceil(filteredAppointments.length / perPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredAppointments.slice(start, start + perPage);
  }, [filteredAppointments, page]);

  useEffect(() => {
    setPage(1);
  }, [search, doctorFilter, statusFilter]);

  const selectedDeptObjForModal = useMemo(() => {
    return departments.find((d) => d.id === bookingForm.departmentId || d.name === bookingForm.departmentId) || {};
  }, [departments, bookingForm.departmentId]);

  const selectedDoctorObj = useMemo(() => {
    return doctors.find((d) => d.id === bookingForm.doctorId);
  }, [doctors, bookingForm.doctorId]);

  const isDoctorOnLeaveOnSelectedDate = useMemo(() => {
    if (!bookingForm.doctorId || !bookingForm.date) return false;
    const doc = doctors.find((d) => d.id === bookingForm.doctorId);
    if (!doc) return false;

    // Check if doc has leaveDates matching bookingForm.date
    if (doc.leaveDates && Array.isArray(doc.leaveDates)) {
      const isMatch = doc.leaveDates.some((item) => {
        const dStr = typeof item === 'string' ? item : item.date;
        return dStr === bookingForm.date;
      });
      if (isMatch) return true;
    }

    // Check if overall availability is 'On-Leave' and booking date is today
    const todayISO = new Date().toISOString().slice(0, 10);
    if (doc.availability === 'On-Leave' && bookingForm.date === todayISO) {
      return true;
    }

    return false;
  }, [doctors, bookingForm.doctorId, bookingForm.date]);

  const availableAppointmentDoctors = useMemo(() => {
    if (!bookingForm.departmentId) return doctors;
    const targetDeptName = String(selectedDeptObjForModal?.name || bookingForm.departmentId).trim().toLowerCase();
    const targetDeptId = String(selectedDeptObjForModal?.id || bookingForm.departmentId).trim().toLowerCase();

    const filtered = doctors.filter((doc) => {
      if (!doc) return false;
      const dDept = String(doc.department || doc.departmentId || '').trim().toLowerCase();
      return (
        dDept === targetDeptId ||
        dDept === targetDeptName ||
        (doc.departmentId && String(doc.departmentId).trim().toLowerCase() === targetDeptId) ||
        (targetDeptName && dDept.includes(targetDeptName)) ||
        (targetDeptName.includes('pharm') && dDept.includes('pharm')) ||
        (targetDeptName.includes('emerg') && dDept.includes('emerg')) ||
        (targetDeptName.includes('cardio') && dDept.includes('cardio')) ||
        (targetDeptName.includes('icu') && dDept.includes('icu')) ||
        (targetDeptName.includes('neur') && dDept.includes('neur')) ||
        (targetDeptName.includes('ortho') && dDept.includes('ortho')) ||
        (targetDeptName.includes('pedia') && dDept.includes('pedia')) ||
        (targetDeptName.includes('matern') && dDept.includes('matern'))
      );
    });
    return filtered.length > 0 ? filtered : doctors;
  }, [doctors, bookingForm.departmentId, selectedDeptObjForModal]);

  const handleAppointmentDeptChange = (newDeptId) => {
    const targetDept = departments.find((d) => d.id === newDeptId || d.name === newDeptId) || {};
    const targetDeptName = String(targetDept.name || newDeptId).trim().toLowerCase();
    const targetDeptId = String(newDeptId).trim().toLowerCase();

    const matchingDocs = doctors.filter((doc) => {
      if (!newDeptId) return true;
      if (!doc) return false;
      const dDept = String(doc.department || doc.departmentId || '').trim().toLowerCase();
      return (
        dDept === targetDeptId ||
        dDept === targetDeptName ||
        (doc.departmentId && String(doc.departmentId).trim().toLowerCase() === targetDeptId) ||
        (targetDeptName && dDept.includes(targetDeptName)) ||
        (targetDeptName.includes('pharm') && dDept.includes('pharm')) ||
        (targetDeptName.includes('emerg') && dDept.includes('emerg')) ||
        (targetDeptName.includes('cardio') && dDept.includes('cardio')) ||
        (targetDeptName.includes('icu') && dDept.includes('icu')) ||
        (targetDeptName.includes('neur') && dDept.includes('neur')) ||
        (targetDeptName.includes('ortho') && dDept.includes('ortho')) ||
        (targetDeptName.includes('pedia') && dDept.includes('pedia')) ||
        (targetDeptName.includes('matern') && dDept.includes('matern'))
      );
    });

    const defaultDocId = matchingDocs[0]?.id || '';

    setBookingForm((prev) => ({
      ...prev,
      departmentId: newDeptId,
      doctorId: defaultDocId
    }));
  };

  const openBookingModal = () => {
    setEditingAppointment(null);
    setBookingForm(initialBookingForm);
    setBookingTab('registered');
    setFeedback('');
    setShowBookingModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    const existingPatient = patients.find((p) => (p.name || p.fullName || '').toLowerCase() === appointment.patientName.toLowerCase());
    const initialDepartment = appointment.departmentId
      || departments.find((dept) => dept.name === appointment.department)?.id
      || '';

    setBookingForm({
      patientName: appointment.patientName,
      phone: appointment.patientPhone || existingPatient?.phone || '',
      gender: existingPatient?.gender || 'Male',
      age: existingPatient?.age || '',
      cnic: existingPatient?.cnic || '',
      bloodGroup: existingPatient?.bloodGroup || 'O+',
      address: existingPatient?.address || '',
      emergencyContact: existingPatient?.emergencyContact || '',
      doctorId: appointment.doctorId,
      departmentId: initialDepartment,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    });
    setBookingTab('registered');
    setFeedback('');
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setEditingAppointment(null);
    setBookingForm(initialBookingForm);
    setFeedback('');
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    if (!bookingForm.patientName?.trim() || !bookingForm.doctorId || !bookingForm.date || !bookingForm.time) {
      setFeedback('Please complete all required fields (Patient Name, Doctor, Date, Time).');
      return;
    }

    const doctor = doctors.find((item) => item.id === bookingForm.doctorId);
    const department = departments.find((item) => item.id === bookingForm.departmentId)
      || departments.find((item) => item.name?.toLowerCase() === doctor?.department?.toLowerCase())
      || departments.find((item) => item.name?.toLowerCase() === bookingForm.departmentId?.toLowerCase());

    if (!doctor) {
      setFeedback('Please select a valid doctor for this appointment.');
      return;
    }

    if (!department) {
      setFeedback('Please select a valid department for the chosen doctor.');
      return;
    }

    if (isDoctorOnLeaveOnSelectedDate) {
      setFeedback(`Booking Failed: ${doctor.name} is on scheduled leave on ${bookingForm.date}. Appointments cannot be booked on this day.`);
      return;
    }

    // 1. Check if patient already exists in All Patients list (case-insensitive)
    let patient = patients.find(
      (item) => (item.name || item.fullName || '').trim().toLowerCase() === bookingForm.patientName.trim().toLowerCase()
    );

    // 2. If patient does not exist, automatically add to All Patients list!
    if (!patient) {
      const nextPatientIdNum = patients.reduce((max, p) => {
        const num = Number(String(p.id).replace(/\D/g, ''));
        return Math.max(max, Number.isFinite(num) ? num : 0);
      }, 0);

      const newPatientId = `PAT-${String(nextPatientIdNum + 1).padStart(4, '0')}`;

      patient = {
        id: newPatientId,
        name: bookingForm.patientName.trim(),
        fullName: bookingForm.patientName.trim(),
        phone: bookingForm.phone?.trim() || '',
        phoneNumber: bookingForm.phone?.trim() || '',
        gender: bookingForm.gender || 'Male',
        age: Number(bookingForm.age) || 30,
        cnic: bookingForm.cnic?.trim() || '',
        bloodGroup: bookingForm.bloodGroup || 'O+',
        address: bookingForm.address?.trim() || '',
        emergencyContact: bookingForm.emergencyContact?.trim() || '',
        assignedDoctor: doctor.name,
        doctorId: doctor.id,
        department: department.name,
        departmentId: department.id,
        bedRequired: 'No',
        bedNumber: 'N/A',
        status: 'Outpatient',
        consultationFee: bookingForm.consultationFee || '1500',
        paymentMode: bookingForm.paymentMode || 'Cash',
        paymentStatus: bookingForm.paymentStatus || 'Paid',
        billing: {
          totalAmount: `Rs ${bookingForm.consultationFee || '1500'}`,
          paidAmount: bookingForm.paymentStatus === 'Paid' ? `Rs ${bookingForm.consultationFee || '1500'}` : 'Rs 0.00',
          status: bookingForm.paymentStatus || 'Paid',
          claimStatus: 'Counter Receipt'
        },
        admissionDate: bookingForm.date || new Date().toISOString().slice(0, 10),
        registeredDate: bookingForm.date || new Date().toISOString().slice(0, 10)
      };

      addPatient(patient);
    } else {
      // Update details if provided
      updatePatient(patient.id, {
        ...(bookingForm.phone ? { phone: bookingForm.phone, phoneNumber: bookingForm.phone } : {}),
        ...(bookingForm.gender ? { gender: bookingForm.gender } : {}),
        ...(bookingForm.age ? { age: Number(bookingForm.age) } : {}),
        ...(bookingForm.cnic ? { cnic: bookingForm.cnic } : {}),
        ...(bookingForm.bloodGroup ? { bloodGroup: bookingForm.bloodGroup } : {}),
        ...(bookingForm.address ? { address: bookingForm.address } : {}),
        ...(bookingForm.emergencyContact ? { emergencyContact: bookingForm.emergencyContact } : {}),
        assignedDoctor: doctor.name,
        doctorId: doctor.id,
        department: department.name,
        departmentId: department.id,
        consultationFee: bookingForm.consultationFee || patient.consultationFee || '1500',
        paymentMode: bookingForm.paymentMode || patient.paymentMode || 'Cash',
        paymentStatus: bookingForm.paymentStatus || patient.paymentStatus || 'Paid'
      });
    }

    const appointmentPayload = {
      patientName: patient.name || patient.fullName,
      patientId: patient.id,
      patientPhone: patient.phone || patient.phoneNumber,
      doctorId: doctor.id,
      departmentId: department.id,
      date: bookingForm.date,
      time: bookingForm.time,
      status: bookingForm.status,
      consultationFee: bookingForm.consultationFee || '1500',
      paymentMode: bookingForm.paymentMode || 'Cash',
      paymentStatus: bookingForm.paymentStatus || 'Paid'
    };

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appointmentPayload);
      setFeedback(`Appointment updated for ${patient.name}.`);
    } else {
      const newAppointment = addAppointment(appointmentPayload);

      // Create waiting queue entry if confirmed
      const relatedQueue = queue.find((record) => record.appointmentId === newAppointment.id);
      if (!relatedQueue) {
        addQueueRecord({
          patientName: patient.name || patient.fullName,
          patientId: patient.id,
          doctorId: doctor.id,
          appointmentId: newAppointment.id,
          time: bookingForm.time,
          status: 'Waiting'
        });
      }

      setFeedback(`New appointment booked for ${patient.name}. Registered in patient directory.`);
    }

    setTimeout(() => {
      closeBookingModal();
    }, 900);
  };

  const handleDeleteAppointment = (appointment) => {
    const id = typeof appointment === 'object' ? appointment.id : appointment;
    const confirmDelete = window.confirm('Are you sure you want to cancel and delete this appointment?');
    if (!confirmDelete) return;

    removeAppointment(id);
    setFeedback('Appointment has been removed.');

    const targetQueue = queue.find((record) => record.appointmentId === id);
    if (targetQueue) {
      updateQueueRecord(targetQueue.id, { status: 'Cancelled' });
    }
  };

  const handleToggleStatus = (appointment, newStatus) => {
    const nextStatus = newStatus || (appointment.status === 'Confirmed' ? 'Pending' : 'Confirmed');
    updateAppointment(appointment.id, { status: nextStatus });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          title="Appointment Management"
          description="Schedule, track, and manage all outpatient appointments."
          actionText="Book Appointment"
          actionIcon={CalendarPlus}
          onActionClick={openBookingModal}
        />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBar
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(typeof e === 'string' ? e : e?.target?.value || '')}
          />

          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Filter by Status"
              value={statusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Confirmed', label: 'Confirmed' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]}
              onChange={(e) => setStatusFilter(typeof e === 'string' ? e : e?.target?.value || 'all')}
            />
          </div>
        </div>

        <AppointmentTable
          appointments={paginatedAppointments}
          doctors={doctors}
          departments={departments}
          onEdit={handleEditAppointment}
          onCancel={handleDeleteAppointment}
          onStatusChange={handleToggleStatus}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-colors ${page === p ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingAppointment ? 'Edit Appointment' : 'Book a New Appointment'}
                </h3>
                <p className="text-sm text-slate-500">
                  {editingAppointment
                    ? 'Update appointment details.'
                    : 'Select registered patient or register a new patient for appointment.'}
                </p>
              </div>
              <button type="button" onClick={closeBookingModal} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedback && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </div>
            )}

            {/* ── Patient Type Tab Selector ── */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => setBookingTab('registered')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${bookingTab === 'registered'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                Registered Patient
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingTab('new');
                  setBookingForm((prev) => ({
                    ...prev,
                    patientName: '',
                    phone: '',
                    age: '',
                    cnic: '',
                    address: '',
                    emergencyContact: ''
                  }));
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${bookingTab === 'new'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                New / Unregistered Patient
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* ── 1. REGISTERED PATIENT TAB CONTENT ── */}
              {bookingTab === 'registered' && (
                <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Select Registered Patient <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={(() => {
                        const matched = patients.find(
                          (p) => (p.name || p.fullName || '').toLowerCase() === bookingForm.patientName.trim().toLowerCase()
                        );
                        return matched ? matched.id : '';
                      })()}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const matched = patients.find((p) => p.id === selectedId);
                        if (matched) {
                          setBookingForm((prev) => ({
                            ...prev,
                            patientName: matched.name || matched.fullName || '',
                            phone: matched.phone || matched.phoneNumber || '',
                            gender: matched.gender || prev.gender,
                            age: matched.age || prev.age,
                            cnic: matched.cnic || prev.cnic,
                            bloodGroup: matched.bloodGroup || prev.bloodGroup,
                            address: matched.address || prev.address,
                            emergencyContact: matched.emergencyContact || prev.emergencyContact,
                            doctorId: matched.doctorId || prev.doctorId,
                            departmentId: matched.departmentId || prev.departmentId
                          }));
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required={bookingTab === 'registered'}
                    >
                      <option value="">-- Search & Select Existing Patient --</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} — {p.name || p.fullName} ({p.phone || 'No phone'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {bookingForm.patientName && (
                    <div className="rounded-xl border border-blue-200 bg-white p-3 flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{bookingForm.patientName}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">
                            {(() => {
                              const matched = patients.find(p => (p.name || p.fullName || '').toLowerCase() === bookingForm.patientName.trim().toLowerCase());
                              return matched ? matched.id : 'PAT-REG';
                            })()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Phone: <strong>{bookingForm.phone || 'N/A'}</strong> • Age: <strong>{bookingForm.age || 'N/A'}</strong> • Gender: <strong>{bookingForm.gender}</strong>
                        </p>
                      </div>
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>
              )}

              {/* ── 2. NEW PATIENT TAB CONTENT ── */}
              {bookingTab === 'new' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Patient ID */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Patient ID</label>
                    <input
                      type="text"
                      readOnly
                      value="Auto Generated (PAT-XXXX)"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 font-mono"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Type new patient full name"
                      value={bookingForm.patientName}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, patientName: event.target.value.replace(/[^a-zA-Z\s.'-]/g, '') }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required={bookingTab === 'new'}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="age"
                      placeholder="e.g. 28"
                      value={bookingForm.age}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, age: event.target.value.replace(/[^0-9]/g, '') }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                    <select
                      name="gender"
                      value={bookingForm.gender}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, gender: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      placeholder="e.g. +92 300 1234567"
                      value={bookingForm.phone}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, phone: event.target.value.replace(/[^0-9+\-\s()]/g, '') }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* CNIC */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">CNIC</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="cnic"
                      placeholder="e.g. 35202-1234567-1"
                      value={bookingForm.cnic}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, cnic: event.target.value.replace(/[^0-9\-]/g, '') }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={bookingForm.bloodGroup}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter patient address"
                      value={bookingForm.address}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, address: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      placeholder="Contact name & phone"
                      value={bookingForm.emergencyContact}
                      onChange={(event) => setBookingForm((prev) => ({ ...prev, emergencyContact: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ── COMMON APPOINTMENT DETAILS SECTION ── */}
              <div className="border-t border-slate-200 pt-4 grid gap-4 md:grid-cols-2">
                {/* Department */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
                  <select
                    name="departmentId"
                    value={bookingForm.departmentId}
                    onChange={(event) => handleAppointmentDeptChange(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned Doctor */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Assigned Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctorId"
                    value={bookingForm.doctorId}
                    onChange={(event) => {
                      const selectedDoctor = doctors.find((doc) => doc.id === event.target.value);
                      const selectedDepartment = departments.find((dept) => dept.name === selectedDoctor?.department);
                      setBookingForm((prev) => ({
                        ...prev,
                        doctorId: event.target.value,
                        departmentId: prev.departmentId || selectedDepartment?.id || ''
                      }));
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Select doctor</option>
                    {availableAppointmentDoctors.map((doctor) => {
                      const isDocOnLeaveOnDate = bookingForm.date && (
                        (doctor.leaveDates || []).some(item => (typeof item === 'string' ? item === bookingForm.date : item.date === bookingForm.date)) ||
                        (doctor.availability === 'On-Leave' && bookingForm.date === new Date().toISOString().slice(0, 10))
                      );
                      return (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} {isDocOnLeaveOnDate ? `⚠️ (ON LEAVE ON ${bookingForm.date})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={(event) => setBookingForm((prev) => ({ ...prev, date: event.target.value }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                      isDoctorOnLeaveOnSelectedDate
                        ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500 ring-1 ring-rose-300'
                        : 'border-slate-300 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Appointment Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={bookingForm.time}
                    onChange={(event) => setBookingForm((prev) => ({ ...prev, time: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* DOCTOR ON LEAVE WARNING BANNER */}
                {isDoctorOnLeaveOnSelectedDate && (
                  <div className="md:col-span-2 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-sm text-rose-800 flex items-start gap-3 shadow-2xs">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-900 flex items-center gap-2">
                        Doctor is On Leave on Selected Date ({bookingForm.date})
                      </div>
                      <div className="text-xs text-rose-700 mt-1">
                        {selectedDoctorObj?.name || 'Selected Doctor'} is scheduled on leave on <strong>{bookingForm.date}</strong>. Appointments cannot be booked for this doctor on this date. Please select another date or choose a different doctor.
                      </div>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status"
                    value={bookingForm.status}
                    onChange={(event) => setBookingForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              {/* ── REGISTRATION & CONSULTATION FEE PAYMENT SECTION ── */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Consultation Fee & Payment Details
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Fee Amount (Rs)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="consultationFee"
                      placeholder="1500"
                      value={bookingForm.consultationFee}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, consultationFee: e.target.value.replace(/[^0-9]/g, '') }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Payment Mode</label>
                    <select
                      name="paymentMode"
                      value={bookingForm.paymentMode}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, paymentMode: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white text-slate-900"
                    >
                      <option value="Cash">Cash (Counter)</option>
                      <option value="Debit / Credit Card">Debit / Credit Card</option>
                      <option value="Online / Mobile Banking">Online / Mobile Banking</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Payment Status</label>
                    <select
                      name="paymentStatus"
                      value={bookingForm.paymentStatus}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white font-semibold text-slate-900"
                    >
                      <option value="Paid">Paid (Receipt Issued)</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>



              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingAppointment ? 'Update Appointment' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
