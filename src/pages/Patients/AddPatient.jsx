import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../../components/reception/PatientForm';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_PATIENTS } from '../../data/patients';
import { generatePatientID } from '../../utils/patientHelpers';
import { useData } from '../../contexts/DataContext';
import { UserPlus, ChevronLeft } from 'lucide-react';

 

export default function AddPatient() {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const { patients, addPatient, updateDepartment, doctors = [], departments = [] } = useData();
  const existingPatients = patients || INITIAL_PATIENTS;
  const newPatientId = generatePatientID(existingPatients);

  const handleSubmit = (formData) => {
    try {
      const selectedDoctor = doctors.find((doc) => doc.id === formData.doctorId || doc.name === formData.assignedDoctor || doc.name === formData.doctorId);
      const selectedDepartment = departments.find((dept) => dept.id === formData.departmentId) || departments.find((dept) => dept.name === formData.department);
      const patientName = formData.fullName || formData.name || 'Unnamed Patient';
      const docName = selectedDoctor?.name || formData.assignedDoctor || formData.doctor || 'Dr. Amir Khan';
      const docId = selectedDoctor?.id || formData.doctorId || 'DOC-008';

      const newPatient = {
        ...formData,
        id: newPatientId,
        name: patientName,
        fullName: patientName,
        fatherName: formData.fatherName || '',
        cnic: formData.cnic || '',
        dob: formData.dob || '',
        age: Number(formData.age) || 0,
        gender: formData.gender || 'Male',
        bloodGroup: formData.bloodGroup || 'O+',
        maritalStatus: formData.maritalStatus || 'Unknown',
        phone: formData.phoneNumber || formData.phone || '',
        phoneNumber: formData.phoneNumber || formData.phone || '',
        email: formData.email || `${patientName.toLowerCase().replace(/\s+/g, '.')}@hospital.local`,
        address: formData.address || '',
        city: formData.city || '',
        province: formData.province || '',
        postalCode: formData.postalCode || '',
        emergencyContactName: formData.emergencyContactName || '',
        emergencyPhone: formData.emergencyContact || '',
        allergies: formData.allergies || '',
        medicalConditions: formData.medicalConditions || '',
        currentMedications: formData.currentMedications || '',
        weight: formData.weight || '',
        height: formData.height || '',
        bloodPressure: formData.bloodPressure || '',
        diabetes: formData.diabetes || '',
        insuranceNumber: formData.insuranceNumber || '',
        department: selectedDepartment?.name || formData.department || 'General',
        departmentId: selectedDepartment?.id || formData.departmentId || 'dept-01',
        assignedDoctor: docName,
        doctor: docName,
        doctorId: docId,
        roomNumber: formData.roomNumber || '',
        bedNumber: formData.bedNumber || '',
        bedRequired: formData.bedRequired || 'No',
        admissionDate: new Date().toISOString().slice(0, 10),
        status: formData.status || 'OPD',
        avatar: formData.avatar || '',
        visits: [],
        surgeries: [],
        prescriptions: [],
        labReports: [],
        consultationFee: formData.consultationFee || '1500',
        paymentMode: formData.paymentMode || 'Cash',
        paymentStatus: formData.paymentStatus || 'Paid',
        billing: {
          totalAmount: `Rs ${formData.consultationFee || '1500'}`,
          paidAmount: formData.paymentStatus === 'Paid' ? `Rs ${formData.consultationFee || '1500'}` : 'Rs 0.00',
          status: formData.paymentStatus || 'Paid',
          claimStatus: 'Counter Receipt'
        },
        admissionDetails: {
          ward: selectedDepartment?.name || formData.department || 'General Ward',
          attendingNurse: 'Nurse Pending Assignment',
          condition: 'Under Evaluation',
          admittedBy: docName
        },
        dischargeDetails: {
          dischargeDate: 'Pending',
          summary: 'Patient recently admitted.',
          followUpDate: 'TBD'
        }
      };

      addPatient(newPatient);
      showToast('success', 'Patient Registered', `${patientName} (${newPatientId}) has been successfully added.`);
      navigate('/patients');
    } catch (err) {
      showToast('error', 'Registration Failed', 'An error occurred while saving patient data. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Register New Patient
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Auto-generated ID: <strong className="font-mono text-blue-600">{newPatientId}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps indicator */}
      <div className="flex items-center gap-2 text-xs">
        {['Personal Info', 'Contact Details', 'Medical Info', 'Hospital Info'].map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-semibold">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              {step}
            </div>
            {idx < 3 && <div className="h-px flex-1 bg-blue-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <PatientForm
        autoId={newPatientId}
        onSave={handleSubmit}
        onCancel={() => navigate('/patients')}
      />
    </div>
  );
}
