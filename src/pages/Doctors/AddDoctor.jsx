import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DoctorForm from '../../components/doctors/DoctorForm';
import { INITIAL_DOCTORS } from '../../data/doctors';
import { useData } from '../../contexts/DataContext';

export default function AddDoctor() {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const { doctors, addDoctor, addUser } = useData();

  const handleSubmit = (formData) => {
    const existing = doctors || INITIAL_DOCTORS;
    const fallbackId = `DOC-${String(Math.max(...existing.map(d => parseInt((d.id || '').replace('DOC-', '') || '0')), 0) + 1).padStart(3, '0')}`;
    const doctorId = formData.employeeId || fallbackId;
    const loginEmail = formData.loginEmail || formData.email;
    const password = formData.password || 'doctor123';

    const newDoctor = {
      ...formData,
      id: doctorId,
      employeeId: doctorId,
      email: loginEmail,
      password: password,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&bg=2563EB&color=fff&size=150`,
      schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
        day, isWorking: (formData.workingDays || []).includes(day),
        startTime: (formData.workingDays || []).includes(day) ? formData.startTime : null,
        endTime: (formData.workingDays || []).includes(day) ? formData.endTime : null,
        appointmentsCount: 0,
      })),
      patients: [],
    };

    addDoctor(newDoctor);

    // Register login credentials in ERP Auth system
    if (addUser) {
      addUser({
        id: doctorId,
        name: formData.name,
        email: loginEmail,
        password: password,
        role: 'Doctor',
        department: formData.department || 'General',
        status: 'Active',
        avatar: newDoctor.photo
      });
    }

    showToast('success', 'Doctor Registered', `${formData.name} (${doctorId}) registered. Can log in with email: ${loginEmail}`);
    navigate('/doctors');
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/doctors')} className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" /> Add New Doctor
          </h1>
          <p className="text-sm text-gray-600 mt-1">Register a new doctor into the Hospital ERP system</p>
        </div>
      </div>
      <DoctorForm onSubmit={handleSubmit} onCancel={() => navigate('/doctors')} />
    </div>
  );
}
