// =====================================================
// Hospital ERP Admin Module Data Layer
// =====================================================

// ---- INITIAL USERS DIRECTORY DATA ----
export const INITIAL_ADMIN_USERS = [
  {
    id: "usr_admin_01",
    name: "Dr. Sarah Jenkins",
    email: "admin@hospital.com",
    role: "Admin",
    department: "Executive Management",
    status: "Active",
    joinedDate: "2021-03-15",
    lastActive: "Just now",
    permissions: "Full system access",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "usr_rec_03",
    name: "Emily Watson",
    email: "reception@hospital.com",
    role: "Receptionist",
    department: "Patient Registration",
    status: "Active",
    joinedDate: "2023-05-20",
    lastActive: "5 mins ago",
    permissions: "Patient intake & appointments",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "usr_nurse_04",
    name: "Sister Clara Barton",
    email: "nurse@hospital.com",
    role: "Nurse",
    department: "ICU",
    status: "Active",
    joinedDate: "2022-08-14",
    lastActive: "1 hr ago",
    permissions: "Bed management & care",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300"
  }
];

// ---- DEPARTMENTS DATA ----
export const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-01',
    name: 'Cardiology',
    head: 'Dr. Alexander Wright',
    code: 'CARD',
    doctorsCount: 18,
    nursesCount: 32,
    bedsTotal: 40,
    bedsOccupied: 18,
    monthlyBudget: 'Rs 180,000',
    status: 'Active',
    location: 'Building A - Floor 3',
    description: 'Heart and cardiovascular care.'
  },
  {
    id: 'dept-02',
    name: 'ICU',
    head: 'Dr. Sarah Jenkins',
    code: 'ICU',
    doctorsCount: 12,
    nursesCount: 45,
    bedsTotal: 20,
    bedsOccupied: 14,
    monthlyBudget: 'Rs 250,000',
    status: 'Active',
    location: 'Building B - Floor 2',
    description: 'Critical care and monitoring.'
  },
  {
    id: 'dept-03',
    name: 'Pharmacy',
    head: 'Pharm. Michael Chen',
    code: 'PHARM',
    doctorsCount: 8,
    nursesCount: 10,
    bedsTotal: 40,
    bedsOccupied: 7,
    monthlyBudget: 'Rs 130,000',
    status: 'Active',
    location: 'Ground Floor',
    description: 'Medicine dispensing and inventory.'
  },
  {
    id: 'dept-04',
    name: 'Emergency',
    head: 'Dr. Sana Malik',
    code: 'EMR',
    doctorsCount: 12,
    nursesCount: 22,
    bedsTotal: 30,
    bedsOccupied: 6,
    monthlyBudget: 'Rs 220,000',
    status: 'Active',
    location: 'Ground Floor - Emergency Wing',
    description: 'Emergency care and triage department.'
  },
  {
    id: 'dept-05',
    name: 'Neurology',
    head: 'Dr. Amir Khalid',
    code: 'NEUR',
    doctorsCount: 14,
    nursesCount: 22,
    bedsTotal: 30,
    bedsOccupied: 12,
    monthlyBudget: 'Rs 160,000',
    status: 'Active',
    location: 'Building C - Floor 4',
    description: 'Brain, nerve, and spinal care.'
  },
];

// ---- DOCTORS & STAFF ROSTER ----
export const INITIAL_DOCTORS_STAFF = [
  {
    id: 'DOC-027',
    name: 'Abbas Ahmed',
    department: 'Pharmacy',
    specialization: 'Pharmacist',
    qualification: 'Pharm.D, RPh',
    shift: 'Morning',
    consultationFee: 'Rs 100',
    experience: '2 Years',
    status: 'On Duty',
    rating: 4.7,
    patientsCount: 140,
    email: 'abbas@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'DOC-004',
    name: 'Dr. Fatima Iqbal',
    department: 'Pharmacy',
    specialization: 'Clinical Pharmacology',
    qualification: 'MBBS, M.Phil',
    shift: 'Morning',
    consultationFee: 'Rs 150',
    experience: '10 Years',
    status: 'On Duty',
    rating: 4.9,
    patientsCount: 290,
    email: 'fatima@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'DOC-003',
    name: 'Dr. Hassan Raza',
    department: 'Emergency',
    specialization: 'Emergency Medicine',
    qualification: 'MBBS, FCPS',
    shift: 'Night',
    consultationFee: 'Rs 200',
    experience: '20 Years',
    status: 'Busy',
    rating: 5.0,
    patientsCount: 510,
    email: 'hassan@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'DOC-010',
    name: 'Dr. Hina Baig',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    qualification: 'MBBS, FCPS',
    shift: 'Morning',
    consultationFee: 'Rs 180',
    experience: '9 Years',
    status: 'On Duty',
    rating: 4.8,
    patientsCount: 310,
    email: 'hina@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'DOC-009',
    name: 'Dr. Imran Javed',
    department: 'Orthopedics',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS',
    shift: 'Evening',
    consultationFee: 'Rs 160',
    experience: '24 Years',
    status: 'Off Duty',
    rating: 4.9,
    patientsCount: 620,
    email: 'imran@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  }
];
// ---- FINANCIAL SUMMARY LOGS ----
export const FINANCIAL_BREAKDOWN = [
  { category: 'Inpatient Department (IPD)', monthlyRevenue: 148500, sharePct: 42, growth: '+14%' },
  { category: 'Outpatient Department (OPD)', monthlyRevenue: 92400, sharePct: 26, growth: '+18%' },
  { category: 'Pharmacy Sales', monthlyRevenue: 64200, sharePct: 18, growth: '+9%' },
  { category: 'Laboratory & Diagnostics', monthlyRevenue: 38900, sharePct: 11, growth: '+22%' },
  { category: 'Emergency Services', monthlyRevenue: 11000, sharePct: 3, growth: '+5%' }
];

export const RECENT_INVOICES_ADMIN = [
  { id: 'INV-2026-901', patient: 'James Carter', category: 'IPD Surgery', amount: 'Rs 4,850.00', date: '2026-07-25', status: 'Paid', method: 'Insurance' },
  { id: 'INV-2026-902', patient: 'Eleanor Vance', category: 'Cardiology OPD', amount: 'Rs 350.00', date: '2026-07-25', status: 'Paid', method: 'Credit Card' },
  { id: 'INV-2026-903', patient: 'Marcus Webb', category: 'Ortho Procedure', amount: 'Rs 1,200.00', date: '2026-07-24', status: 'Pending', method: 'Direct Bill' },
  { id: 'INV-2026-904', patient: 'Jason Brooks', category: 'ICU Stay & Meds', amount: 'Rs 6,400.00', date: '2026-07-24', status: 'Paid', method: 'Insurance' },
  { id: 'INV-2026-905', patient: 'Aria Patel', category: 'Maternity Package', amount: 'Rs 2,900.00', date: '2026-07-23', status: 'Overdue', method: 'Pending Claim' }
];

// ---- SYSTEM AUDIT TRAIL ----
export const INITIAL_AUDIT_LOGS = [
  { id: 'AUD-8821', user: 'Dr. Sarah Jenkins (Admin)', action: 'Modified System User Role permissions for Pharmacist', category: 'Security', timestamp: '2026-07-25 10:30 AM', ip: '192.168.1.104' },
  { id: 'AUD-8820', user: 'David Miller (Billing)', action: 'Generated Monthly Financial Report INV-2026-901', category: 'Financial', timestamp: '2026-07-25 09:45 AM', ip: '192.168.1.112' },
  { id: 'AUD-8819', user: 'Dr. Alexander Wright (Doctor)', action: 'Updated EHR medical record for Patient #PAT-8842', category: 'Clinical', timestamp: '2026-07-25 09:12 AM', ip: '192.168.1.108' },
  { id: 'AUD-8817', user: 'System Automated', action: 'Daily Database Backup & Cloud Sync completed successfully', category: 'System', timestamp: '2026-07-25 04:00 AM', ip: '127.0.0.1' }
];

// ---- WARDS DATA ----
export const WARDS_DATA = [
  {
    code: 'CARD-01',
    name: 'Cardiology Ward',
    department: 'Cardiology',
    headNurse: 'Sister Clara Barton',
    totalBeds: 20,
    occupiedBeds: 12,
    floor: 'Building A - Floor 3'
  },
  {
    code: 'ICU-01',
    name: 'Intensive Care Unit (ICU)',
    department: 'ICU',
    headNurse: 'Nurse Rebecca Vance',
    totalBeds: 15,
    occupiedBeds: 14,
    floor: 'Building B - Floor 2'
  },
  {
    code: 'GEN-01',
    name: 'General Medical Ward',
    department: 'Emergency',
    headNurse: 'Nurse Mark Sloan',
    totalBeds: 30,
    occupiedBeds: 18,
    floor: 'Ground Floor'
  },
  {
    code: 'NEUR-01',
    name: 'Neurology Ward',
    department: 'Neurology',
    headNurse: 'Nurse David Kim',
    totalBeds: 20,
    occupiedBeds: 8,
    floor: 'Building C - Floor 4'
  }
];

// ---- OPERATING THEATERS ----
export const OPERATING_THEATERS = [
  {
    id: 'OT-01',
    name: 'Operating Suite 1 (Cardiovascular)',
    currentProcedure: 'Coronary Artery Bypass Surgery',
    surgeon: 'Dr. Alexander Wright',
    status: 'In Surgery',
    duration: '2 hrs 30 mins',
    scheduledEnd: '14:30'
  },
  {
    id: 'OT-02',
    name: 'Operating Suite 2 (Neuro & Ortho)',
    currentProcedure: 'Craniotomy Procedure',
    surgeon: 'Dr. Amir Khalid',
    status: 'In Surgery',
    duration: '1 hr 45 mins',
    scheduledEnd: '16:00'
  },
  {
    id: 'OT-03',
    name: 'Operating Suite 3 (General Surgery)',
    currentProcedure: 'Laparoscopic Appendectomy',
    surgeon: 'Dr. Emily Chen',
    status: 'Available',
    duration: '1 hr',
    scheduledEnd: '11:15'
  },
  {
    id: 'OT-04',
    name: 'Operating Suite 4 (Emergency & Trauma)',
    currentProcedure: 'Emergency Trauma Reconstruction',
    surgeon: 'Dr. Sana Malik',
    status: 'Cleaning / Prep',
    duration: '45 mins',
    scheduledEnd: '12:00'
  }
];

