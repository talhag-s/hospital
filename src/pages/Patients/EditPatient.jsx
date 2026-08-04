import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PatientForm from '../../components/reception/PatientForm';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_PATIENTS } from '../../data/patients';
import { ChevronLeft, Edit3, UserCheck, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const { patients, updatePatient, updateDepartment, departments = [] } = useData();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allPatients = patients || INITIAL_PATIENTS;
      const found = allPatients.find((p) => p.id === id);
      setPatient(found || null);
    } catch (err) {
      console.error('Error fetching patient record for edit', err);
    } finally {
      setLoading(false);
    }
  }, [id, patients]);

  const handleSubmit = (updatedFormData) => {
    try {
      updatePatient(id, {
        ...updatedFormData,
        // Sync canonical fields used by PatientList and other views
        name: updatedFormData.fullName || updatedFormData.name || '',
        phone: updatedFormData.phoneNumber || updatedFormData.phone || '',
        admissionDetails: {
          ward: updatedFormData.department,
          admittedBy: updatedFormData.assignedDoctor
        }
      });

      showToast('success', 'Patient Updated', `Record for ${updatedFormData.name} (${id}) updated successfully.`);
      navigate('/patients');
    } catch (err) {
      showToast('error', 'Update Failed', 'Failed to save patient modifications.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center space-y-4 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-900">Patient Not Found</h2>
        <p className="text-sm text-gray-500">
          Cannot edit record because patient ID <strong className="font-mono text-blue-600">{id}</strong> does not exist.
        </p>
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
            title="Cancel & Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              Edit Patient Record
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Updating details for <strong className="text-gray-800">{patient.name}</strong> (
              <span className="font-mono text-blue-600">{patient.id}</span>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Active Record Edit</span>
        </div>
      </div>

      {/* Form with pre-populated patient data */}
      <PatientForm
        initialData={patient}
        autoId={patient.id}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/patients')}
      />
    </div>
  );
}
