import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import PatientForm from '../../components/reception/PatientForm';
import {
  ArrowLeft, Bed, Users, MapPin, IndianRupee,
  Stethoscope, Activity, CheckCircle2,
  AlertTriangle, BarChart3, Trash2, Edit, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function DepartmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useAuth();
  const { departments = [], patients = [], doctors = [], removePatient, updatePatient, updateDepartment, removeDoctor } = useData();
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const [docPage, setDocPage] = useState(1);
  const [patientPage, setPatientPage] = useState(1);
  const PER_PAGE = 5;

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (editingPatient || patientToDelete || doctorToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingPatient, patientToDelete, doctorToDelete]);

  const handleDeleteDoctor = (doc) => {
    if (doc && doc.id) {
      removeDoctor(doc.id);
      showToast('success', 'Doctor Removed', `${doc.name} has been removed successfully.`);
    }
    setDoctorToDelete(null);
  };

  const department = departments.find((dept) => dept.id === id || dept.code === id || dept.name === id);
  const occupiedPatients = patients.filter((patient) => {
    if (!department) return false;
    return (
      (patient.department === department.name || patient.departmentId === department.id || patient.departmentId === department.code) &&
      patient.status && patient.status.toLowerCase() !== 'discharged' &&
      patient.bedNumber && patient.bedNumber.toLowerCase() !== 'n/a'
    );
  });

  const handleDeletePatient = (patient) => {
    // Decrement bedsOccupied on the department directly
    if (department) {
      const currentOccupied = Number(department.bedsOccupied || 0);
      updateDepartment(department.id, { bedsOccupied: Math.max(0, currentOccupied - 1) });
    }
    removePatient(patient.id);
    showToast('success', 'Patient Discharged', `${patient.name} has been removed from bed assignments.`);
    setPatientToDelete(null);
  };

  if (!department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/admin/departments')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </button>
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
            <h1 className="text-xl font-bold">Department not found</h1>
            <p className="mt-2 text-sm opacity-80">The department you selected could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBeds = Number(department.bedsTotal || 0);
  const occupiedBeds = Number(department.bedsOccupied || 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const isCritical = occupancyPct >= 85;
  const isWarning = occupancyPct >= 60 && occupancyPct < 85;

  const statusConfig = {
    Active: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', Icon: CheckCircle2 },
    Maintenance: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', Icon: AlertTriangle },
    Closed: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500', Icon: AlertTriangle },
  };
  const sc = statusConfig[department.status] || statusConfig.Active;
  const StatusIcon = sc.Icon;

  const barColor = isCritical
    ? 'bg-gradient-to-r from-rose-500 to-red-600'
    : isWarning
    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
    : 'bg-gradient-to-r from-blue-500 to-indigo-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-5">

        {/* ── HERO HEADER CARD ── */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="p-6">
            <button
              type="button"
              onClick={() => navigate('/admin/departments')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
            </button>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Department identity */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm">
                    {department.code}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border ${sc.border} ${sc.bg} px-3 py-1 text-xs font-semibold ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                    {department.status}
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{department.name}</h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                  {department.description || 'A professional overview of department capacity, staff, and patient occupancy information.'}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Stethoscope className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-slate-700">{department.head}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>{department.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>{department.doctorsCount} Doctors</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <IndianRupee className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-700">{department.monthlyBudget}</span>
                  </div>
                </div>
              </div>

              {/* Bed stats */}
              <div className="grid grid-cols-3 gap-3 lg:w-80">
                {[
                  { label: 'Total Beds', value: totalBeds, valueColor: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200', subtext: 'Capacity' },
                  { label: 'Occupied', value: occupiedBeds, valueColor: 'text-rose-600', bg: 'bg-rose-50/60', border: 'border-rose-100', subtext: 'In use' },
                  { label: 'Available', value: availableBeds, valueColor: 'text-emerald-600', bg: 'bg-emerald-50/60', border: 'border-emerald-100', subtext: 'Free' },
                ].map(({ label, value, valueColor, bg, border, subtext }) => (
                  <div key={label} className={`rounded-xl ${bg} border ${border} p-4 text-center`}>
                    <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SUMMARY ROW ── */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Quick Summary */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Summary</p>
            </div>

            <div className="grid gap-3 grid-cols-3">
              {[
                { label: 'Remaining Beds', value: availableBeds, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                { label: 'Occupancy Rate', value: `${occupancyPct}%`, color: isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-800', bg: isCritical ? 'bg-rose-50 border-rose-100' : isWarning ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100' },
                { label: 'Assigned Patients', value: occupiedPatients.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`rounded-xl ${bg} border p-4 text-center`}>
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium leading-tight">{label}</div>
                </div>
              ))}
            </div>

            {/* Occupancy progress bar */}
            {totalBeds > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-2.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                    <Activity className="w-3.5 h-3.5" /> Bed Occupancy
                  </span>
                  <span className={`font-bold ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-600'}`}>
                    {occupiedBeds} / {totalBeds}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${barColor} transition-all duration-700`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
                {isCritical && (
                  <p className="mt-2 text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Critical occupancy — consider expanding capacity
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Status & Budget */}
          <div className="flex flex-col gap-4">
            <div className={`rounded-2xl border ${sc.border} ${sc.bg} p-5 flex-1`}>
              <div className="flex items-center gap-2 mb-3">
                <StatusIcon className={`w-4 h-4 ${sc.color}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
                <p className={`text-base font-bold ${sc.color}`}>{department.status}</p>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Operational state</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly Budget</p>
              </div>
              <p className="text-base font-bold text-emerald-700">{department.monthlyBudget}</p>
              <p className="text-xs text-slate-400 mt-1.5">Allocated per month</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">About this Department</p>
            <p className="text-sm leading-relaxed text-slate-600">
              {department.description || 'No additional description provided for this department.'}
            </p>
          </div>
        </div>

        {/* ── ASSIGNED DEPARTMENT DOCTORS ── */}
        {(() => {
          const deptDocs = (doctors || []).filter((doc) => {
            if (!doc) return false;
            return doc.departmentId === department.id || doc.departmentId === department.code || doc.department === department.name ||
              (department.name && doc.department && String(doc.department).toLowerCase() === String(department.name).toLowerCase());
          });

          const totalDocPages = Math.ceil(deptDocs.length / PER_PAGE) || 1;
          const paginatedDocs = deptDocs.slice((docPage - 1) * PER_PAGE, docPage * PER_PAGE);

          return (
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Department Doctors</h2>
                    <p className="text-xs text-slate-400">Medical specialists assigned to {department.name}</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 border border-blue-200">
                  {deptDocs.length} Doctor{deptDocs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Doctor Name</th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Specialization</th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Phone</th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Hours</th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Availability</th>
                      <th className="px-3.5 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDocs.length > 0 ? (
                      paginatedDocs.map((doc, idx) => (
                        <tr
                          key={doc.id || doc.name}
                          className={`border-b border-slate-50 transition-colors hover:bg-blue-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                        >
                          <td className="px-3.5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {doc.name ? doc.name.replace(/^Dr\.\s*/i, '').charAt(0) : 'D'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                                <p className="text-[11px] text-slate-400 truncate">{doc.email || 'doctor@hospital.com'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3.5 py-3 font-mono text-xs font-semibold text-slate-600">
                            {doc.id || doc.employeeId || 'DOC-001'}
                          </td>
                          <td className="px-3.5 py-3">
                            <span className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              {doc.specialization || 'Specialist'}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-xs font-medium text-slate-600 whitespace-nowrap">
                            {doc.phone || '+1 (555) 234-5678'}
                          </td>
                          <td className="px-3.5 py-3 text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">{doc.startTime && doc.endTime ? `${doc.startTime} - ${doc.endTime}` : '09:00 - 17:00'}</span>
                            <span className="block text-[10px] text-slate-400">Mon - Fri</span>
                          </td>
                          <td className="px-3.5 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              doc.availability === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${doc.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {doc.availability || 'Available'}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/doctors/edit/${doc.id}`, { state: { from: `/admin/departments/${department.id}` } })}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-2xs"
                                title="Edit Doctor Details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDoctorToDelete(doc)}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-all shadow-2xs"
                                title="Remove Doctor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-3.5 py-8 text-center text-xs font-semibold text-slate-400">
                          No doctors currently assigned to {department.name}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Doctors Table Pagination Footer */}
              {deptDocs.length > PER_PAGE && (
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    Showing <span className="font-bold text-slate-700">{(docPage - 1) * PER_PAGE + 1}</span> to <span className="font-bold text-slate-700">{Math.min(docPage * PER_PAGE, deptDocs.length)}</span> of <span className="font-bold text-slate-700">{deptDocs.length}</span> doctors
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={docPage === 1}
                      onClick={() => setDocPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="px-3 font-semibold text-slate-700">Page {docPage} of {totalDocPages}</span>
                    <button
                      type="button"
                      disabled={docPage >= totalDocPages}
                      onClick={() => setDocPage((p) => Math.min(totalDocPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── BED ASSIGNMENTS — FULL WIDTH ── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department Summary</p>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Patient Occupancy &amp; Bed Allocation</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Head of Dept</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{department.head}</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{department.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table subheader */}
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">Bed Assignments</span>
              <span className="rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5">
                {occupiedPatients.length} active
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1">
              {department.bedsOccupied} / {department.bedsTotal}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {(() => {
              const totalPatientPages = Math.ceil(occupiedPatients.length / PER_PAGE) || 1;
              const paginatedPatients = occupiedPatients.slice((patientPage - 1) * PER_PAGE, patientPage * PER_PAGE);

              return (
                <>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Patient</th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Patient ID</th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Department</th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Bed</th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                        <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedPatients.length > 0 ? (
                        paginatedPatients.map((patient, idx) => (
                          <tr
                            key={patient.id}
                            className={`border-b border-slate-50 transition-colors hover:bg-blue-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{patient.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs font-mono text-slate-400 bg-slate-100 rounded px-2 py-0.5 inline-block">{patient.id}</div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">{patient.department || department?.name || '—'}</td>
                            <td className="px-6 py-4 font-medium text-slate-600">{patient.bedNumber || '—'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                patient.status === 'Admitted'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : patient.status === 'ICU'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  patient.status === 'Admitted' ? 'bg-emerald-500'
                                  : patient.status === 'ICU' ? 'bg-rose-500'
                                  : 'bg-slate-400'
                                }`} />
                                {patient.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingPatient(patient)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-xs"
                                  title="Edit Patient"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-16 text-center">
                            <Bed className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-slate-400">No active bed assignments</p>
                            <p className="text-xs text-slate-300 mt-1">All beds in this department are currently unoccupied.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Patients Table Pagination Footer */}
                  {occupiedPatients.length > PER_PAGE && (
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        Showing <span className="font-bold text-slate-700">{(patientPage - 1) * PER_PAGE + 1}</span> to <span className="font-bold text-slate-700">{Math.min(patientPage * PER_PAGE, occupiedPatients.length)}</span> of <span className="font-bold text-slate-700">{occupiedPatients.length}</span> patients
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={patientPage === 1}
                          onClick={() => setPatientPage((p) => Math.max(1, p - 1))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="px-3 font-semibold text-slate-700">Page {patientPage} of {totalPatientPages}</span>
                        <button
                          type="button"
                          disabled={patientPage >= totalPatientPages}
                          onClick={() => setPatientPage((p) => Math.min(totalPatientPages, p + 1))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── EDIT PATIENT MODAL ── */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Edit Patient Details</h2>
                  <p className="text-xs text-slate-400">ID: {editingPatient.id} · {editingPatient.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPatient(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto modal-scrollbar flex-1">
              <PatientForm
                initialData={editingPatient}
                onSave={(updatedData) => {
                  updatePatient(editingPatient.id, updatedData);
                  showToast('success', 'Patient Updated', `Record for ${updatedData.fullName || updatedData.name || editingPatient.name} updated successfully.`);
                  setEditingPatient(null);
                }}
                onCancel={() => setEditingPatient(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE PATIENT CONFIRM MODAL ── */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Remove Bed Assignment</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Remove <span className="font-bold text-slate-800">{patientToDelete.name}</span> from bed <span className="font-bold text-slate-800">{patientToDelete.bedNumber}</span>? This will decrease the occupied bed count for this department.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeletePatient(patientToDelete)}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE DOCTOR CONFIRM MODAL ── */}
      {doctorToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Remove Doctor</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-800">{doctorToDelete.name}</span> from {department?.name || 'this department'}?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDoctorToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDoctor(doctorToDelete)}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Remove Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

