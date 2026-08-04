const DEPARTMENTS = [
  { id: 'DEPT-OPD', name: 'Outpatient', code: 'OPD', head: 'Dr. Ayesha Khan', color: 'emerald' },
  { id: 'DEPT-IPD', name: 'Inpatient', code: 'IPD', head: 'Dr. Omar Qureshi', color: 'blue' },
  { id: 'DEPT-EMR', name: 'Emergency', code: 'Emergency', head: 'Dr. Sana Malik', color: 'red' },
  { id: 'DEPT-LAB', name: 'Laboratory', code: 'Lab', head: 'Dr. Naveed Ali', color: 'violet' },
  { id: 'DEPT-RAD', name: 'Radiology', code: 'Radiology', head: 'Dr. Zara Iqbal', color: 'cyan' },
  { id: 'DEPT-PHR', name: 'Pharmacy', code: 'Pharmacy', head: 'Dr. Faraz Ahmed', color: 'amber' },
  { id: 'DEPT-ICU', name: 'ICU', code: 'ICU', head: 'Dr. Mehreen Shah', color: 'sky' },
  { id: 'DEPT-OT', name: 'Operation Theatre', code: 'OT', head: 'Dr. Tariq Jameel', color: 'fuchsia' },
  { id: 'DEPT-DEN', name: 'Dental', code: 'Dental', head: 'Dr. Rabia Naseem', color: 'rose' },
  { id: 'DEPT-CARD', name: 'Cardiology', code: 'Cardio', head: 'Dr. Imran Siddiqui', color: 'lime' }
];

const SERVICE_TYPES = [
  'OPD',
  'IPD',
  'Emergency',
  'Laboratory',
  'Radiology',
  'Pharmacy',
  'ICU',
  'Operation Theatre',
  'Dental',
  'Cardiology'
];

const PAYMENT_METHODS = ['Cash', 'Card', 'Insurance', 'UPI', 'Bank Transfer'];
const INVOICE_STATUSES = ['Paid', 'Pending', 'Overdue', 'Refunded'];
const INSURANCE_PROVIDERS = ['BlueCross Health', 'Aetna Care', 'Cigna Medical', 'Medicare Plus', 'UnitedHealthcare'];
const EXPENSE_CATEGORIES = ['Medical Supplies', 'Staff Salaries', 'Facility Maintenance', 'Utilities', 'Insurance Settlements', 'IT Infrastructure'];
const REFUND_REASONS = ['Overpayment', 'Service Cancellation', 'Insurance Adjustment', 'Duplicate Charge', 'Billing Error'];

const FIRST_NAMES = ['Aalia', 'Bilal', 'Saba', 'Usman', 'Leila', 'Hassan', 'Mariam', 'Zain', 'Yasmin', 'Omar', 'Samir', 'Nadia', 'Farah', 'Hamza', 'Ayesha', 'Faris', 'Sana', 'Tariq', 'Kiran', 'Zara'];
const LAST_NAMES = ['Khan', 'Ahmed', 'Malik', 'Ali', 'Qureshi', 'Shah', 'Naseem', 'Hussain', 'Raza', 'Iqbal', 'Butt', 'Saeed', 'Farooq', 'Jamal'];
const DOCTOR_TITLES = ['Dr.', 'Prof.', 'Consultant'];
const PATIENT_PREFIXES = ['PAT-','PAX-','HSP-'];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFrom = (list, index) => list[index % list.length];
const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const generatePatients = () => {
  const patients = [];
  for (let index = 0; index < 70; index += 1) {
    const first = randomFrom(FIRST_NAMES, index);
    const last = randomFrom(LAST_NAMES, index + 3);
    const name = `${first} ${last}`;
    const id = `${randomFrom(PATIENT_PREFIXES, index)}${3000 + index}`;
    const dob = formatDate(addDays(new Date(), -(randomBetween(18, 78) * 365) - randomBetween(0, 365)));
    patients.push({
      id,
      name,
      age: randomBetween(18, 78),
      gender: index % 2 === 0 ? 'Female' : 'Male',
      phone: `03${randomBetween(20, 49)}${randomBetween(1000000, 9999999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@citycare.local`,
      departmentId: randomFrom(DEPARTMENTS, index).id,
      departmentName: randomFrom(DEPARTMENTS, index).name,
      primaryDoctor: `${randomFrom(DOCTOR_TITLES, index)} ${randomFrom(LAST_NAMES, index + 2)}`,
      city: randomFrom(['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Peshawar'], index)
    });
  }
  return patients;
};

const generateDoctors = () => {
  const doctors = [];
  for (let index = 0; index < 25; index += 1) {
    const first = randomFrom(FIRST_NAMES, index + 1);
    const last = randomFrom(LAST_NAMES, index + 4);
    const department = randomFrom(DEPARTMENTS, index);
    doctors.push({
      id: `DR-${1000 + index}`,
      name: `${randomFrom(DOCTOR_TITLES, index)} ${first} ${last}`,
      specialty: department.name,
      departmentId: department.id,
      departmentName: department.name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@citycare.local`,
      phone: `03${randomBetween(20, 49)}${randomBetween(1000000, 9999999)}`
    });
  }
  return doctors;
};

const buildInvoiceStatus = (index) => {
  if (index % 14 === 0) return 'Overdue';
  if (index % 12 === 0) return 'Refunded';
  if (index % 5 === 0) return 'Pending';
  return 'Paid';
};

const generateInvoices = (patients, doctors) => {
  const invoices = [];
  const today = new Date();
  for (let index = 0; index < 150; index += 1) {
    const patient = randomFrom(patients, index);
    const doctor = randomFrom(doctors, index + 2);
    const serviceType = randomFrom(SERVICE_TYPES, index);
    const department = randomFrom(DEPARTMENTS, index + 1);
    const amount = Math.round((randomBetween(2, 16) * 750) + randomBetween(0, 199));
    const status = buildInvoiceStatus(index);
    const invoiceDate = addDays(today, -randomBetween(0, 120));
    const dueDate = addDays(invoiceDate, 14);
    const paymentMethod = randomFrom(PAYMENT_METHODS, index + 3);
    const insuranceClaim = paymentMethod === 'Insurance';
    const paidAmount = status === 'Paid' ? amount : status === 'Pending' ? Math.round(amount * 0.35) : status === 'Overdue' ? Math.round(amount * 0.25) : 0;
    const refundAmount = status === 'Refunded' ? Math.round(amount * randomBetween(60, 95) / 100) : 0;
    invoices.push({
      id: `INV-${2026}${1000 + index}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: department.id,
      departmentName: department.name,
      serviceType,
      category: serviceType,
      invoiceDate: formatDate(invoiceDate),
      dueDate: formatDate(dueDate),
      amount,
      paidAmount,
      refundAmount,
      status,
      paymentMethod,
      insuranceClaim: insuranceClaim ? {
        provider: randomFrom(INSURANCE_PROVIDERS, index + 1),
        claimStatus: randomFrom(['Approved', 'Pending', 'Processing', 'Rejected'], index),
        policyNumber: `POL-${randomBetween(1000000, 9999999)}`
      } : null,
      notes: status === 'Overdue' ? 'Payment follow-up required.' : status === 'Refunded' ? 'Refund approved and processed.' : 'Processed through billing team.'
    });
  }
  return invoices;
};

const generateExpenses = () => {
  const expenses = [];
  for (let index = 0; index < 30; index += 1) {
    const category = randomFrom(EXPENSE_CATEGORIES, index);
    const amount = Math.round((randomBetween(1, 8) * 850) + randomBetween(100, 900));
    const date = formatDate(addDays(new Date(), -randomBetween(0, 90)));
    expenses.push({
      id: `EXP-${4000 + index}`,
      category,
      amount,
      paidBy: randomFrom(['Hospital Funds', 'Insurance Reserve', 'Operational Cash'], index),
      date,
      notes: `${category} expense for month-end operations.`
    });
  }
  return expenses;
};

const generateRefunds = (invoices) => invoices
  .filter((invoice) => invoice.status === 'Refunded')
  .map((invoice, index) => ({
    id: `RFN-${6000 + index}`,
    invoiceId: invoice.id,
    amount: invoice.refundAmount,
    patientName: invoice.patientName,
    reason: randomFrom(REFUND_REASONS, index),
    date: invoice.invoiceDate,
    status: 'Completed'
  }));

const PATIENTS = generatePatients();
const DOCTORS = generateDoctors();
const INITIAL_INVOICES = generateInvoices(PATIENTS, DOCTORS);
const INITIAL_EXPENSES = generateExpenses();
const INITIAL_REFUNDS = generateRefunds(INITIAL_INVOICES);

export {
  DEPARTMENTS,
  DOCTORS,
  PATIENTS,
  SERVICE_TYPES,
  PAYMENT_METHODS,
  INVOICE_STATUSES,
  EXPENSE_CATEGORIES,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_REFUNDS
};
