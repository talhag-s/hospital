export const doctors = [
  { id: 'DOC-010', name: 'Dr. Hina Baig', department: 'Cardiology' },
  { id: 'DOC-009', name: 'Dr. Imran Javed', department: 'Orthopedics' },
  { id: 'DOC-003', name: 'Dr. Hassan Raza', department: 'Emergency' },
  { id: 'DOC-004', name: 'Dr. Fatima Iqbal', department: 'Pharmacy' },
  { id: 'DOC-008', name: 'Dr. Amir Khan', department: 'Cardiology' },
  { id: 'DOC-027', name: 'Abbas Ahmed', department: 'Pharmacy' }
];

export const departments = [
  { id: 'dept-01', name: 'Cardiology' },
  { id: 'dept-02', name: 'ICU' },
  { id: 'dept-03', name: 'Pharmacy' },
  { id: 'dept-04', name: 'Emergency' },
  { id: 'dept-05', name: 'Neurology' }
];

export const patients = [];

export const appointments = [
  {
    id: 'APT-001',
    patientId: 'PAT-1001',
    patientName: 'Muhammad Usman',
    doctorId: 'DOC-008',
    doctorName: 'Dr. Amir Khan',
    department: 'Cardiology',
    date: '2026-08-04',
    time: '09:30',
    status: 'Confirmed'
  },
  {
    id: 'APT-002',
    patientId: 'PAT-1002',
    patientName: 'Ayesha Bibi',
    doctorId: 'DOC-008',
    doctorName: 'Dr. Amir Khan',
    department: 'Cardiology',
    date: '2026-08-04',
    time: '10:15',
    status: 'Completed'
  },
  {
    id: 'APT-003',
    patientId: 'PAT-1003',
    patientName: 'Zainab Ahmed',
    doctorId: 'DOC-004',
    doctorName: 'Dr. Fatima Iqbal',
    department: 'Pharmacy',
    date: '2026-08-04',
    time: '11:00',
    status: 'Confirmed'
  },
  {
    id: 'APT-004',
    patientId: 'PAT-1004',
    patientName: 'Hamza Malik',
    doctorId: 'DOC-010',
    doctorName: 'Dr. Hina Baig',
    department: 'Cardiology',
    date: '2026-08-04',
    time: '11:45',
    status: 'Confirmed'
  }
];

export const queueRecords = [
  {
    id: 'Q-001',
    tokenNumber: 'T-101',
    appointmentId: 'APT-001',
    patientId: 'PAT-1001',
    patientName: 'Muhammad Usman',
    doctorId: 'DOC-008',
    doctorName: 'Dr. Amir Khan',
    department: 'Cardiology',
    status: 'Waiting',
    arrivalTime: '09:15'
  }
];
