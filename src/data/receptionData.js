export const doctors = [
  { id: 'DOC-001', name: 'Dr. Amina Khan', department: 'Cardiology' },
  { id: 'DOC-002', name: 'Dr. Bilal Ahmed', department: 'Orthopedics' },
  { id: 'DOC-003', name: 'Dr. Sara Malik', department: 'Pediatrics' }
];

export const departments = [
  { id: 'DEP-01', name: 'Cardiology' },
  { id: 'DEP-02', name: 'Orthopedics' },
  { id: 'DEP-03', name: 'Pediatrics' }
];

export const patients = [
  {
    id: 'PAT-001',
    fullName: 'Hassan Raza',
    age: 42,
    gender: 'Male',
    phoneNumber: '0300-1234567',
    cnic: '35201-1234567-1',
    bloodGroup: 'O+',
    address: 'Block A, Gulberg',
    emergencyContact: '0300-7654321',
    doctorId: 'DOC-101',
    departmentId: 'DEP-01'
  },
  {
    id: 'PAT-002',
    fullName: 'Ayesha Noor',
    age: 29,
    gender: 'Female',
    phoneNumber: '0312-4567890',
    cnic: '35202-7654321-2',
    bloodGroup: 'A-',
    address: 'Model Town',
    emergencyContact: '0312-9876543',
    doctorId: 'DOC-102',
    departmentId: 'DEP-02'
  },
  {
    id: 'PAT-003',
    fullName: 'Muneeb Ali',
    age: 11,
    gender: 'Male',
    phoneNumber: '0345-9876543',
    cnic: '35203-6543210-3',
    bloodGroup: 'B+',
    address: 'Johar Town',
    emergencyContact: '0345-1112223',
    doctorId: 'DOC-103',
    departmentId: 'DEP-03'
  },
  {
    id: 'PAT-004',
    fullName: 'Sadia Farooq',
    age: 35,
    gender: 'Female',
    phoneNumber: '0321-5556677',
    cnic: '35204-5566778-4',
    bloodGroup: 'AB+',
    address: 'DHA Phase 1',
    emergencyContact: '0321-6677889',
    doctorId: 'DOC-101',
    departmentId: 'DEP-01'
  },
  {
    id: 'PAT-005',
    fullName: 'Zainab Tariq',
    age: 48,
    gender: 'Female',
    phoneNumber: '0333-2223344',
    cnic: '35205-2233445-5',
    bloodGroup: 'O-',
    address: 'Wapda Town',
    emergencyContact: '0333-6677881',
    doctorId: 'DOC-102',
    departmentId: 'DEP-02'
  }
];

export const appointments = [
  {
    id: 'APT-101',
    patientName: 'Hassan Raza',
    doctorId: 'DOC-001',
    departmentId: 'DEP-01',
    date: '2026-07-27',
    time: '09:00 AM',
    status: 'Confirmed'
  },
  {
    id: 'APT-102',
    patientName: 'Ayesha Noor',
    doctorId: 'DOC-002',
    departmentId: 'DEP-02',
    date: '2026-07-27',
    time: '10:30 AM',
    status: 'Pending'
  },
  {
    id: 'APT-103',
    patientName: 'Muneeb Ali',
    doctorId: 'DOC-003',
    departmentId: 'DEP-03',
    date: '2026-07-27',
    time: '11:15 AM',
    status: 'Confirmed'
  },
  {
    id: 'APT-104',
    patientName: 'Sadia Farooq',
    doctorId: 'DOC-001',
    departmentId: 'DEP-01',
    date: '2026-07-28',
    time: '01:00 PM',
    status: 'Pending'
  },
  {
    id: 'APT-105',
    patientName: 'Zainab Tariq',
    doctorId: 'DOC-002',
    departmentId: 'DEP-02',
    date: '2026-07-28',
    time: '03:30 PM',
    status: 'Confirmed'
  }
];

export const queueRecords = [
  {
    id: 'Q-01',
    tokenNumber: 12,
    patientName: 'Hassan Raza',
    doctorId: 'DOC-001',
    departmentId: 'DEP-01',
    status: 'Waiting'
  },
  {
    id: 'Q-02',
    tokenNumber: 13,
    patientName: 'Ayesha Noor',
    doctorId: 'DOC-002',
    departmentId: 'DEP-02',
    status: 'Waiting'
  },
  {
    id: 'Q-03',
    tokenNumber: 14,
    patientName: 'Muneeb Ali',
    doctorId: 'DOC-003',
    departmentId: 'DEP-03',
    status: 'In Progress'
  },
  {
    id: 'Q-04',
    tokenNumber: 15,
    patientName: 'Sadia Farooq',
    doctorId: 'DOC-001',
    departmentId: 'DEP-01',
    status: 'Waiting'
  },
  {
    id: 'Q-05',
    tokenNumber: 16,
    patientName: 'Zainab Tariq',
    doctorId: 'DOC-002',
    departmentId: 'DEP-02',
    status: 'Completed'
  }
];
