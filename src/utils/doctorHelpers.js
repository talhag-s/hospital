// ── DOCTOR MODULE — HELPER FUNCTIONS ──

export const filterDoctors = (doctors, filters) => {
  return doctors.filter(doctor => {
    const matchSearch = !filters.search || 
      doctor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      doctor.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      doctor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(filters.search.toLowerCase());

    const matchDept = filters.department === 'All' || doctor.department === filters.department;

    const norm = (str) => String(str || '').replace('-', ' ').toLowerCase();
    const matchAvail = filters.availability === 'All' || norm(doctor.availability) === norm(filters.availability);
    const matchStatus = filters.status === 'All' || norm(doctor.status) === norm(filters.status);

    return matchSearch && matchDept && matchAvail && matchStatus;
  });
};

export const sortDoctors = (doctors, key, direction) => {
  const sorted = [...doctors].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
      return aVal.localeCompare(bVal);
    }
    return aVal - bVal;
  });

  return direction === 'asc' ? sorted : sorted.reverse();
};

export const paginateDoctors = (doctors, page, perPage) => {
  const start = (page - 1) * perPage;
  return doctors.slice(start, start + perPage);
};

export const validateDoctorForm = (form) => {
  const errors = {};

  if (!form.name?.trim()) errors.name = 'Full name is required';

  const userEmail = form.loginEmail || form.email;
  if (!userEmail?.trim()) {
    errors.loginEmail = 'Login email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    errors.loginEmail = 'Invalid login email format';
  }

  if (form.password !== undefined && form.password !== '') {
    if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!form.phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone)) errors.phone = 'Invalid phone number';

  if (!form.department) errors.department = 'Department is required';
  if (!form.specialization) errors.specialization = 'Specialization is required';
  if (!form.qualification) errors.qualification = 'Qualification is required';

  if (!form.experience) errors.experience = 'Experience is required';
  else if (isNaN(form.experience) || form.experience < 0) errors.experience = 'Valid experience required';

  if (!form.licenseNumber?.trim()) errors.licenseNumber = 'License number is required';
  if (!form.joiningDate) errors.joiningDate = 'Joining date is required';

  if (!form.gender) errors.gender = 'Gender is required';
  if (!form.dob) errors.dob = 'Date of birth is required';
  if (!form.address?.trim()) errors.address = 'Address is required';

  return errors;
};

export const calculateAge = (dob) => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getTodayAppointments = (schedule) => {
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });
  const todaySchedule = schedule.find(s => s.day === today);
  return todaySchedule?.appointmentsCount || 0;
};

export const getAvailabilityColor = (availability) => {
  switch (availability) {
    case 'Available':
      return 'bg-green-100 text-green-700';
    case 'Busy':
      return 'bg-yellow-100 text-yellow-700';
    case 'On-Leave':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-700';
    case 'On-Leave':
      return 'bg-orange-100 text-orange-700';
    case 'Probation':
      return 'bg-purple-100 text-purple-700';
    case 'Inactive':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const generateDoctorId = (existing) => {
  if (!existing || existing.length === 0) return 'DOC-001';
  const ids = existing.map(d => parseInt(d.id.replace('DOC-', '')));
  const max = Math.max(...ids, 0);
  return `DOC-${String(max + 1).padStart(3, '0')}`;
};

export const formatExperience = (exp) => {
  return exp ? `${exp} ${exp === 1 ? 'year' : 'years'}` : 'N/A';
};

export const formatCurrency = (amount) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getDoctorForUser = (user, doctors = []) => {
  if (!user) return doctors[0] || null;

  // 1. Match by exact doctor ID
  if (user.id) {
    const foundById = doctors.find((d) => d.id === user.id);
    if (foundById) return foundById;
  }

  // 2. Match by email or loginEmail
  const userEmail = (user.email || user.loginEmail || '').toLowerCase().trim();
  if (userEmail) {
    const foundByEmail = doctors.find((d) =>
      (d.email || d.loginEmail || '').toLowerCase().trim() === userEmail
    );
    if (foundByEmail) return foundByEmail;
  }

  // 3. Match by doctor name (stripping "Dr. " prefix)
  const cleanUserName = (user.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
  if (cleanUserName) {
    const foundByName = doctors.find((d) => {
      const cleanDocName = (d.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
      return cleanDocName === cleanUserName || cleanDocName.includes(cleanUserName) || cleanUserName.includes(cleanDocName);
    });
    if (foundByName) return foundByName;
  }

  // 4. If user role is Doctor, construct a fallback doctor object for user to avoid leaking another doctor's data
  if (user.role === 'Doctor') {
    return {
      id: user.id || 'DOC-CURRENT',
      name: user.name || 'Doctor',
      email: user.email || '',
      department: user.department || 'General Medicine',
      specialization: 'Consultant',
      availability: 'Available',
      schedule: [],
      patientAccessScope: user.patientAccessScope || 'assigned',
      canViewAllPatients: user.canViewAllPatients,
      showZeroPatients: user.showZeroPatients
    };
  }

  return doctors[0] || null;
};

export const isAppointmentForDoctor = (apt, currentDoctor, user) => {
  if (!apt) return false;
  if (!currentDoctor && !user) return false;

  const docId = (currentDoctor?.id || user?.id || '').toLowerCase().trim();
  const docNameClean = (currentDoctor?.name || user?.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();

  const aptDocId = (apt.doctorId || '').toLowerCase().trim();
  if (docId && aptDocId) {
    if (aptDocId === docId) return true;
    const legacyMap = {
      'doc-001': 'doc-008', 'doc-008': 'doc-001', 'doc-101': 'doc-008',
      'doc-002': 'doc-004', 'doc-004': 'doc-002', 'doc-102': 'doc-004'
    };
    if (legacyMap[docId] === aptDocId || legacyMap[aptDocId] === docId) return true;
  }

  const aptDocNameClean = (apt.doctorName || apt.doctor || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();
  if (docNameClean && aptDocNameClean) {
    if (docNameClean === aptDocNameClean || docNameClean.includes(aptDocNameClean) || aptDocNameClean.includes(docNameClean)) {
      return true;
    }
  }

  return false;
};

export const isPatientForDoctor = (patient, currentDoctor, user, doctorAppointments = []) => {
  if (!patient) return false;
  if (!currentDoctor && !user) return false;

  // Determine patient access scope for this doctor
  const scope = currentDoctor?.patientAccessScope || currentDoctor?.patientVisibility || user?.patientAccessScope || user?.patientVisibility;

  // 1. If scope is 'none' / 'zero' or showZeroPatients is true -> doctor can view 0 patients
  if (scope === 'none' || scope === 'zero' || currentDoctor?.showZeroPatients === true || user?.showZeroPatients === true) {
    return false;
  }

  // 2. If scope is 'all' or canViewAllPatients is true -> doctor can view ALL patients in system
  if (scope === 'all' || currentDoctor?.canViewAllPatients === true || user?.canViewAllPatients === true) {
    return true;
  }

  // 3. Default scope ('assigned'): Doctor sees ONLY explicitly assigned patients
  const docId = (currentDoctor?.id || user?.id || '').toLowerCase().trim();
  const docNameClean = (currentDoctor?.name || user?.name || '').toLowerCase().replace(/^dr\.\s*/i, '').trim();

  // 1. Match by patient.doctorId
  const pDocId = (patient.doctorId || '').toLowerCase().trim();
  if (docId && pDocId) {
    if (pDocId === docId) return true;
    const legacyMap = {
      'doc-001': 'doc-008', 'doc-008': 'doc-001', 'doc-101': 'doc-008',
      'doc-002': 'doc-004', 'doc-004': 'doc-002', 'doc-102': 'doc-004'
    };
    if (legacyMap[docId] === pDocId || legacyMap[pDocId] === docId) return true;
  }

  // 2. Match by patient.assignedDoctor / doctor / admittedBy
  const assignedStr = (
    patient.assignedDoctor ||
    patient.doctor ||
    patient.admittedBy ||
    patient.admissionDetails?.admittedBy ||
    ''
  ).toLowerCase().replace(/^dr\.\s*/g, '').trim();

  if (docNameClean && assignedStr) {
    if (docNameClean === assignedStr || docNameClean.includes(assignedStr) || assignedStr.includes(docNameClean)) {
      return true;
    }
  }

  // 3. Match if patient exists in doctor's appointments
  const patientId = (patient.id || '').toLowerCase().trim();
  const patientNameClean = (patient.name || patient.fullName || '').toLowerCase().trim();

  const matchApt = (doctorAppointments || []).some((a) => {
    if (patientId && a.patientId && a.patientId.toLowerCase().trim() === patientId) return true;
    const aptPNameClean = (a.patientName || '').toLowerCase().trim();
    return patientNameClean && aptPNameClean && patientNameClean === aptPNameClean;
  });

  if (matchApt) return true;

  return false;
};
