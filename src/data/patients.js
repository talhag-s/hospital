// =====================================================
// Hospital ERP Patient Management Data Store
// =====================================================

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-1001',
    name: 'Muhammad Usman',
    fullName: 'Muhammad Usman',
    age: 42,
    gender: 'Male',
    phone: '+92 300 1234567',
    bloodGroup: 'O+',
    status: 'Admitted',
    bedRequired: 'Yes',
    bedNumber: 'CARD-01',
    department: 'Cardiology',
    departmentId: 'dept-01',
    assignedDoctor: 'Dr. Amir Khan',
    doctorId: 'DOC-008',
    diagnosis: 'Coronary Artery Disease',
    admissionDate: '2026-08-01'
  },
  {
    id: 'PAT-1002',
    name: 'Ayesha Bibi',
    fullName: 'Ayesha Bibi',
    age: 36,
    gender: 'Female',
    phone: '+92 301 9876543',
    bloodGroup: 'B+',
    status: 'Outpatient',
    bedRequired: 'No',
    bedNumber: 'N/A',
    department: 'Cardiology',
    departmentId: 'dept-01',
    assignedDoctor: 'Dr. Amir Khan',
    doctorId: 'DOC-008',
    diagnosis: 'Hypertension Consultation',
    admissionDate: '2026-08-03'
  },
  {
    id: 'PAT-1003',
    name: 'Zainab Ahmed',
    fullName: 'Zainab Ahmed',
    age: 29,
    gender: 'Female',
    phone: '+92 302 4567891',
    bloodGroup: 'A+',
    status: 'Admitted',
    bedRequired: 'Yes',
    bedNumber: 'PHARM-01',
    department: 'Pharmacy',
    departmentId: 'dept-03',
    assignedDoctor: 'Dr. Fatima Iqbal',
    doctorId: 'DOC-004',
    diagnosis: 'Clinical Pharmacology Routine',
    admissionDate: '2026-08-02'
  },
  {
    id: 'PAT-1004',
    name: 'Hamza Malik',
    fullName: 'Hamza Malik',
    age: 50,
    gender: 'Male',
    phone: '+92 333 7654321',
    bloodGroup: 'AB+',
    status: 'Outpatient',
    bedRequired: 'No',
    bedNumber: 'N/A',
    department: 'Pharmacy',
    departmentId: 'dept-03',
    assignedDoctor: 'Dr. Fatima Iqbal',
    doctorId: 'DOC-004',
    diagnosis: 'Arrhythmia Follow-up',
    admissionDate: '2026-08-03'
  }
];
