import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Edit2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DoctorForm from '../../components/doctors/DoctorForm';
import { INITIAL_DOCTORS } from '../../data/doctors';
import { useData } from '../../contexts/DataContext';

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useAuth();
  const { doctors, updateDoctor } = useData();

  const returnPath = location.state?.from || '/doctors';
  const existing = doctors || INITIAL_DOCTORS;
  const doctor = existing.find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center space-y-4 bg-gray-50">
        <AlertCircle className="w-14 h-14 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">Doctor Not Found</h2>
        <p className="text-sm text-gray-600">No doctor record: <strong className="text-blue-600">{id}</strong></p>
        <button onClick={() => navigate(returnPath)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const initialData = {
    ...doctor,
    workingDays: (doctor.schedule || []).filter(s => s.isWorking).map(s => s.day),
    startTime: (doctor.schedule || []).find(s => s.isWorking)?.startTime || '08:00',
    endTime: (doctor.schedule || []).find(s => s.isWorking)?.endTime || '16:00',
  };

  const handleSubmit = (formData) => {
    const updatedSchedule = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
      day, isWorking: (formData.workingDays || []).includes(day),
      startTime: (formData.workingDays || []).includes(day) ? formData.startTime : null,
      endTime: (formData.workingDays || []).includes(day) ? formData.endTime : null,
      appointmentsCount: ((doctor.schedule || []).find(s => s.day === day)?.appointmentsCount) || 0,
    }));
    updateDoctor(id, { ...formData, schedule: updatedSchedule, patients: doctor.patients });
    showToast('success', 'Doctor Updated', `${formData.name}'s profile has been updated.`);
    navigate(returnPath);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(returnPath)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-amber-600" /> Edit Doctor
          </h1>
          <p className="text-sm text-gray-600 mt-1">{doctor.name} · {doctor.id}</p>
        </div>
      </div>
      <DoctorForm initialData={initialData} onSubmit={handleSubmit} onCancel={() => navigate(returnPath)} isEdit />
    </div>
  );
}
