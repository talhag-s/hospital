import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PATIENTS } from '../../data/patients';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { getDoctorForUser, isAppointmentForDoctor, isPatientForDoctor } from '../../utils/doctorHelpers';
import { downloadCSV } from '../../utils/exportHelpers';
import { Users, UserPlus, Download, Printer, Search, Filter, RotateCcw, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';

 
const PER_PAGE = 5;

export default function PatientList() {
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const { patients, appointments, doctors, removePatient } = useData();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [isPrinting, setIsPrinting] = useState(false);

  const currentDoctor = useMemo(() => {
    if (user?.role !== 'Doctor') return null;
    return getDoctorForUser(user, doctors);
  }, [user, doctors]);

  const doctorAppointments = useMemo(() => {
    if (!currentDoctor) return [];
    return appointments.filter(a => isAppointmentForDoctor(a, currentDoctor, user));
  }, [appointments, currentDoctor, user]);

  const scopedPatients = useMemo(() => {
    if (user?.role === 'Doctor' && currentDoctor) {
      return patients.filter(p => isPatientForDoctor(p, currentDoctor, user, doctorAppointments));
    }
    return patients;
  }, [patients, user, currentDoctor, doctorAppointments]);

  const filtered = scopedPatients.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const patientsToRender = isPrinting ? filtered : paginated;

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} (${id})? This cannot be undone.`)) {
      removePatient(id);
      showToast('success', 'Patient Deleted', `${name}'s record has been removed.`);
      if (paginated.length === 1 && page > 1) setPage(page - 1);
    }
  };

  const handleExport = () => {
    if (!filtered.length) {
      showToast('warning', 'Export Failed', 'No patient records to export.');
      return;
    }

    const rows = filtered.map((patient) => ({
      ID: patient.id,
      Name: patient.name,
      Email: patient.email || '',
      Phone: patient.phone,
      Status: patient.status,
      AdmissionDate: patient.admissionDate || patient.registeredDate || patient.date || patient.registeredAt || new Date().toISOString().split('T')[0],
    }));

    downloadCSV('patient-list.csv', rows);
    showToast('success', 'Export Started', 'Patient list download has started.');
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

  const selectCls = 'text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage patient records and admissions</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => navigate('/patients/add')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" /> Add Patient
          </button>
          <button onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{scopedPatients.length}</div>
          <div className="text-xs text-gray-600 mt-1">Total Patients</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{scopedPatients.filter(p => p.status === 'Admitted').length}</div>
          <div className="text-xs text-gray-600 mt-1">Admitted</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{scopedPatients.filter(p => p.status === 'Discharged').length}</div>
          <div className="text-xs text-gray-600 mt-1">Discharged</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-2xl font-bold text-amber-600">{scopedPatients.filter(p => p.status === 'OPD').length}</div>
          <div className="text-xs text-gray-600 mt-1">OPD Patients</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 no-print">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {search && (
              <button onClick={() => setSearch('')} className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Admission Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientsToRender.length > 0 ? (
                patientsToRender.map(patient => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{patient.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{patient.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{patient.admissionDate || patient.registeredDate || patient.date || patient.registeredAt || new Date().toISOString().split('T')[0]}</td>
                    <td className="px-4 py-3 text-center space-x-2 print:hidden">
                      <button onClick={() => navigate(`/patients/edit/${patient.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(patient.id, patient.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No patients found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
