// =====================================================
// Hospital ERP Admin Dashboard - Complete Data File
// =====================================================

// ---- KPI STATS ----
export const kpiStats = [
  {
    id: 'total-patients',
    title: 'Total Patients',
    value: '4,827',
    raw: 4827,
    change: '+12.5%',
    trend: 'up',
    icon: 'Users',
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100',
    description: 'Registered patients'
  },
  {
    id: 'total-doctors',
    title: 'Total Doctors',
    value: '5',
    raw: 5,
    change: '+0%',
    trend: 'up',
    icon: 'Stethoscope',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-100',
    description: 'Active physicians'
  },
  {
    id: 'appointments',
    title: "Today's Appointments",
    value: '93',
    raw: 93,
    change: '+7.4%',
    trend: 'up',
    icon: 'Calendar',
    color: 'violet',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-100',
    description: 'Scheduled for today'
  },
  {
    id: 'available-beds',
    title: 'Available Beds',
    value: '62',
    raw: 62,
    change: '-4.3%',
    trend: 'down',
    icon: 'Bed',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    description: 'Of 200 total beds'
  },
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 'Rs 128,430',
    raw: 128430,
    change: '+18.7%',
    trend: 'up',
    icon: 'IndianRupee',
    color: 'green',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-100',
    description: 'This month'
  },
  {
    id: 'medicine-stock',
    title: 'Medicine Stock',
    value: '2,341',
    raw: 2341,
    change: '-2.1%',
    trend: 'down',
    icon: 'Pill',
    color: 'orange',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-100',
    description: 'Items in pharmacy'
  },
  {
    id: 'lab-tests',
    title: 'Laboratory Tests',
    value: '389',
    raw: 389,
    change: '+9.8%',
    trend: 'up',
    icon: 'FlaskConical',
    color: 'purple',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-100',
    description: 'Completed this week'
  },
  {
    id: 'emergency',
    title: 'Emergency Cases',
    value: '7',
    raw: 7,
    change: '+40%',
    trend: 'up',
    icon: 'AlertTriangle',
    color: 'red',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-100',
    description: 'Active right now'
  }
];

// ---- HOSPITAL REVENUE (Bar Chart) ----
export const revenueData = [
  { month: 'Jan', opd: 18200, ipd: 34500, pharmacy: 12300, lab: 8400 },
  { month: 'Feb', opd: 15800, ipd: 29800, pharmacy: 10900, lab: 7200 },
  { month: 'Mar', opd: 22100, ipd: 41200, pharmacy: 14800, lab: 9800 },
  { month: 'Apr', opd: 19400, ipd: 37600, pharmacy: 13200, lab: 8900 },
  { month: 'May', opd: 25600, ipd: 48200, pharmacy: 16700, lab: 11200 },
  { month: 'Jun', opd: 28900, ipd: 52100, pharmacy: 18900, lab: 13400 },
  { month: 'Jul', opd: 24300, ipd: 46800, pharmacy: 15600, lab: 10800 }
];

// ---- APPOINTMENTS BY DEPARTMENT (Pie Chart) ----
export const appointmentsByDept = [
  { name: 'Cardiology', value: 28, color: '#2563EB' },
  { name: 'Orthopedics', value: 18, color: '#7C3AED' },
  { name: 'Neurology', value: 14, color: '#0891B2' },
  { name: 'Pediatrics', value: 16, color: '#22C55E' },
  { name: 'Gynecology', value: 12, color: '#F59E0B' },
  { name: 'Dermatology', value: 8, color: '#EF4444' },
  { name: 'Others', value: 4, color: '#94A3B8' }
];

// ---- BED OCCUPANCY (Donut Chart) ----
export const bedOccupancyData = [
  { name: 'Occupied', value: 138, color: '#2563EB' },
  { name: 'Available', value: 62, color: '#E2E8F0' }
];

export const bedOccupancyByWard = [
  { ward: 'ICU', total: 20, occupied: 18, percent: 90 },
  { ward: 'General', total: 80, occupied: 62, percent: 78 },
  { ward: 'Pediatric', total: 30, occupied: 22, percent: 73 },
  { ward: 'Maternity', total: 25, occupied: 19, percent: 76 },
  { ward: 'Surgery', total: 25, occupied: 17, percent: 68 },
  { ward: 'Cardiac', total: 20, occupied: 10, percent: 50 }
];

// ---- TODAY'S APPOINTMENTS ----
export const todaysAppointments = [
  { id: 'APT-001', patient: 'James Carter', doctor: 'Dr. Alexander Wright', dept: 'Cardiology', time: '09:00 AM', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-002', patient: 'Sofia Martinez', doctor: 'Dr. Sarah Jenkins', dept: 'Neurology', time: '09:30 AM', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-003', patient: 'Robert Kim', doctor: 'Dr. Emily Chen', dept: 'Orthopedics', time: '10:00 AM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-004', patient: 'Priya Sharma', doctor: 'Dr. Alexander Wright', dept: 'Cardiology', time: '10:30 AM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-005', patient: 'David Nguyen', doctor: 'Dr. Michael Torres', dept: 'Pediatrics', time: '11:00 AM', status: 'Cancelled', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-006', patient: 'Emma Wilson', doctor: 'Dr. Sarah Jenkins', dept: 'Gynecology', time: '11:30 AM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-007', patient: 'Ahmed Hassan', doctor: 'Dr. Robert Vance', dept: 'Urology', time: '12:00 PM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=80' },
  { id: 'APT-008', patient: 'Linda Park', doctor: 'Dr. Emily Chen', dept: 'Dermatology', time: '02:00 PM', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=80' }
];

// ---- RECENTLY REGISTERED PATIENTS ----
export const recentPatients = [
  { id: 'PAT-8842', name: 'Eleanor Vance', age: 34, gender: 'Female', dept: 'Cardiology', status: 'Admitted', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80', registeredAt: '2 hrs ago' },
  { id: 'PAT-8841', name: 'Marcus Webb', age: 52, gender: 'Male', dept: 'Orthopedics', status: 'OPD', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', registeredAt: '4 hrs ago' },
  { id: 'PAT-8840', name: 'Aria Patel', age: 28, gender: 'Female', dept: 'Maternity', status: 'Admitted', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=80', registeredAt: '5 hrs ago' },
  { id: 'PAT-8839', name: 'Jason Brooks', age: 67, gender: 'Male', dept: 'Neurology', status: 'ICU', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=80', registeredAt: '7 hrs ago' },
  { id: 'PAT-8838', name: 'Chloe Zhang', age: 19, gender: 'Female', dept: 'Pediatrics', status: 'Discharged', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', registeredAt: '9 hrs ago' }
];

// ---- RECENT ACTIVITY TIMELINE ----
export const recentActivities = [
  { id: 1, type: 'doctor', action: 'New doctor Dr. Emily Chen added to Dermatology dept.', actor: 'Admin', time: '08:14 AM', color: 'blue' },
  { id: 2, type: 'appointment', action: 'Appointment booked: James Carter with Dr. Alexander Wright.', actor: 'Reception', time: '09:02 AM', color: 'violet' },
  { id: 3, type: 'patient', action: 'Patient Eleanor Vance (#PAT-8842) admitted to Cardiology Ward.', actor: 'Dr. Wright', time: '10:30 AM', color: 'emerald' },
  { id: 4, type: 'invoice', action: 'Invoice #INV-2024-1192 generated for Rs 1,840 — Patient Marcus Webb.', actor: 'Billing', time: '11:45 AM', color: 'amber' },
  { id: 5, type: 'pharmacy', action: 'Batch purchase of Amoxicillin 500mg x500 units received.', actor: 'Pharmacy', time: '01:10 PM', color: 'purple' },
  { id: 6, type: 'lab', action: 'CBC & Lipid Panel report finalized for Jason Brooks.', actor: 'Dr. Vance', time: '02:35 PM', color: 'cyan' }
];


// ---- SYSTEM STATUS ----
export const systemStatus = [
  { id: 1, label: 'Primary Server', status: 'Operational', color: 'green', icon: 'Server' },
  { id: 2, label: 'Database Cluster', status: 'Operational', color: 'green', icon: 'Database' },
  { id: 3, label: 'Backup System', status: 'Running', color: 'green', icon: 'HardDrive' },
  { id: 4, label: 'System Version', status: 'v2.4.1', color: 'blue', icon: 'Tag' },
  { id: 5, label: 'Storage Usage', status: '64% / 2TB', color: 'amber', icon: 'HardDrive' }
];

// ---- MONTHLY PATIENT TRENDS ----
export const monthlyPatientData = [
  { month: 'Jan', opd: 420, ipd: 140, emergency: 65 },
  { month: 'Feb', opd: 380, ipd: 125, emergency: 50 },
  { month: 'Mar', opd: 510, ipd: 160, emergency: 78 },
  { month: 'Apr', opd: 460, ipd: 145, emergency: 62 },
  { month: 'May', opd: 590, ipd: 185, emergency: 84 },
  { month: 'Jun', opd: 640, ipd: 210, emergency: 95 },
  { month: 'Jul', opd: 580, ipd: 190, emergency: 88 }
];

// ---- MONTHLY FINANCIAL TRENDS ----
export const monthlyFinancialData = [
  { month: 'Jan', revenue: 73400, expenses: 48000, profit: 25400 },
  { month: 'Feb', revenue: 63700, expenses: 42000, profit: 21700 },
  { month: 'Mar', revenue: 87900, expenses: 53000, profit: 34900 },
  { month: 'Apr', revenue: 79100, expenses: 49000, profit: 30100 },
  { month: 'May', revenue: 101700, expenses: 61000, profit: 40700 },
  { month: 'Jun', revenue: 113300, expenses: 67000, profit: 46300 },
  { month: 'Jul', revenue: 97500, expenses: 59000, profit: 38500 }
];

// ---- LOW STOCK MEDICINES ----
export const lowStockMedicines = [
  { id: 'MED-001', name: 'Amoxicillin 500mg', category: 'Antibiotics', currentStock: 24, minThreshold: 100, status: 'Critical' },
  { id: 'MED-002', name: 'Paracetamol 650mg', category: 'Analgesics', currentStock: 45, minThreshold: 150, status: 'Low Stock' },
  { id: 'MED-003', name: 'Insulin Glargine 100IU', category: 'Endocrinology', currentStock: 12, minThreshold: 50, status: 'Critical' },
  { id: 'MED-004', name: 'Atorvastatin 20mg', category: 'Cardiology', currentStock: 38, minThreshold: 120, status: 'Low Stock' }
];

