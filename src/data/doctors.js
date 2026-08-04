// ── DOCTOR MODULE — DUMMY DATA (6 Doctors) ──

export const DEPARTMENTS = [
  'Cardiology',
  'ICU',
  'Pharmacy',
  'Emergency',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
];

export const SPECIALIZATIONS = [
  'Cardiologist',
  'Neurologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Clinical Pharmacology',
  'Emergency Medicine',
];

export const QUALIFICATIONS = [
  'MBBS, FCPS (Cardiology)',
  'MBBS, MD (Neurology)',
  'MBBS, MS (Orthopedics)',
  'MBBS, FCPS (Pediatrics)',
  'MBBS, M.Phil (Pharm)',
  'MBBS, FCPS (Emergency)',
];

const generateSchedule = (days, start = '08:00', end = '16:00') => {
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return allDays.map(day => ({
    day,
    isWorking: days.includes(day),
    startTime: days.includes(day) ? start : null,
    endTime: days.includes(day) ? end : null,
    appointmentsCount: days.includes(day) ? Math.floor(Math.random() * 8) + 3 : 0,
  }));
};

const generatePatients = (doctorId) => [];

export const INITIAL_DOCTORS = [
  {
    id: 'DOC-008',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    name: 'Dr. Amir Khan',
    gender: 'Male',
    dob: '1985-03-15',
    cnic: '35201-8877665-8',
    phone: '+92-300-8877665',
    email: 'amir@gmail.com',
    loginEmail: 'amir@gmail.com',
    password: 'password123',
    address: 'Gulberg III, Lahore',
    employeeId: 'EMP-1008',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    qualification: 'MBBS, FCPS (Cardiology)',
    experience: 12,
    licenseNumber: 'PMC-88776',
    joiningDate: '2015-04-10',
    availability: 'Available',
    status: 'Active',
    patientAccessScope: 'assigned',
    canViewAllPatients: false,
    showZeroPatients: false,
    emergencyContact: 'Tariq Khan',
    emergencyPhone: '+92-300-9988776',
    schedule: generateSchedule(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '08:00', '16:00'),
    patients: generatePatients('DOC-008'),
  },
  {
    id: 'DOC-004',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150',
    name: 'Dr. Fatima Iqbal',
    gender: 'Female',
    dob: '1988-09-18',
    cnic: '35202-4567890-2',
    phone: '+92-301-4567890',
    email: 'fatima@gmail.com',
    loginEmail: 'fatima@gmail.com',
    password: 'password123',
    address: 'House 45, DHA Phase 5, Lahore',
    employeeId: 'EMP-1004',
    department: 'Pharmacy',
    specialization: 'Clinical Pharmacology',
    qualification: 'MBBS, M.Phil (Pharm)',
    experience: 10,
    licenseNumber: 'PMC-45678',
    joiningDate: '2016-05-10',
    availability: 'Available',
    status: 'Active',
    patientAccessScope: 'assigned',
    canViewAllPatients: false,
    showZeroPatients: false,
    emergencyContact: 'Zahid Iqbal',
    emergencyPhone: '+92-301-9988776',
    schedule: generateSchedule(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '09:00', '17:00'),
    patients: generatePatients('DOC-004'),
  }
];
