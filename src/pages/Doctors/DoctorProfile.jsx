import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Users, Calendar } from 'lucide-react';
import { INITIAL_DOCTORS } from '../../data/doctors';
import DoctorProfileCard from '../../components/doctors/DoctorProfileCard';
import ScheduleCard from '../../components/doctors/ScheduleCard';
import { useData } from '../../contexts/DataContext';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useData();
  const doctor = (doctors || INITIAL_DOCTORS).find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center space-y-4 bg-gray-50">
        <AlertCircle className="w-14 h-14 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">Doctor Not Found</h2>
        <button onClick={() => navigate('/doctors')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const recentPatients = (doctor.patients || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctors')}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Doctor Profile</h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{doctor.id} · {doctor.department}</p>
          </div>
        </div>

        <DoctorProfileCard doctor={doctor} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            <Calendar className="w-4 h-4" /> Weekly Schedule
          </h3>
          <ScheduleCard schedule={doctor.schedule} />
          <button onClick={() => navigate(`/doctors/${doctor.id}/schedule`)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
            View Full Schedule →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <Users className="w-4 h-4" /> Recent Patients ({recentPatients.length})
          </h3>
          <div className="space-y-2">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{patient.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{patient.diagnosis} • Age {patient.age}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                    patient.status === 'Admitted' ? 'bg-red-100 text-red-700' :
                    patient.status === 'OPD' ? 'bg-blue-100 text-blue-700' :
                    patient.status === 'Discharged' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No patients assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
