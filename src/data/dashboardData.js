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
export const todaysAppointments = [];

// ---- RECENTLY REGISTERED PATIENTS ----
export const recentPatients = [];

// ---- RECENT ACTIVITY TIMELINE ----
export const recentActivities = [
  { id: 1, type: 'system', action: 'Hospital ERP System initialized.', actor: 'System', time: '08:00 AM', color: 'blue' }
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

