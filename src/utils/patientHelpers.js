// =====================================================
// Patient Management Helper Utilities & Validation Rules
// =====================================================

/**
 * Validates National CNIC / ID format (XXXXX-XXXXXXX-X)
 * @param {string} cnic 
 * @returns {boolean}
 */
export function validateCNIC(cnic) {
  if (!cnic) return false;
  // Accepts XXXXX-XXXXXXX-X format or 13 consecutive digits
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  return cnicRegex.test(cnic.trim());
}

/**
 * Formats raw 13 digits into standard CNIC format (XXXXX-XXXXXXX-X)
 * @param {string} value 
 * @returns {string}
 */
export function formatCNIC(value) {
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

/**
 * Validates Phone number (min 10 digits/characters)
 * @param {string} phone 
 * @returns {boolean}
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

/**
 * Validates Email string using standard regex
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Calculates exact age in years from Date of Birth string (YYYY-MM-DD)
 * @param {string} dobString 
 * @returns {number}
 */
export function calculateAge(dobString) {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Auto-generates next sequential Patient ID (e.g. PAT-8831)
 * @param {Array} existingPatients 
 * @returns {string}
 */
export function generatePatientID(existingPatients = []) {
  if (!existingPatients || existingPatients.length === 0) return 'PAT-8801';
  const highestNum = existingPatients.reduce((max, p) => {
    const num = parseInt(p.id.replace(/\D/g, ''), 10);
    return !isNaN(num) && num > max ? num : max;
  }, 8800);
  return `PAT-${highestNum + 1}`;
}

/**
 * Filters patients list by search term, department, gender, blood group, status, and date range
 * @param {Array} patients 
 * @param {Object} filters 
 * @returns {Array}
 */
export function filterPatients(patients, filters = {}) {
  const { search = '', department = 'All', gender = 'All', bloodGroup = 'All', status = 'All', startDate = '', endDate = '' } = filters;

  const cleanSearch = search.trim().toLowerCase();

  return patients.filter((p) => {
    // Search matching
    const matchesSearch =
      !cleanSearch ||
      p.id.toLowerCase().includes(cleanSearch) ||
      p.name.toLowerCase().includes(cleanSearch) ||
      (p.cnic && p.cnic.includes(cleanSearch)) ||
      (p.phone && p.phone.includes(cleanSearch)) ||
      (p.assignedDoctor && p.assignedDoctor.toLowerCase().includes(cleanSearch)) ||
      (p.department && p.department.toLowerCase().includes(cleanSearch));

    // Dropdown filters
    const matchesDept = department === 'All' || p.department.toLowerCase() === department.toLowerCase();
    const matchesGender = gender === 'All' || p.gender.toLowerCase() === gender.toLowerCase();
    const matchesBlood = bloodGroup === 'All' || p.bloodGroup.toUpperCase() === bloodGroup.toUpperCase();
    const matchesStatus = status === 'All' || p.status.toLowerCase() === status.toLowerCase();

    // Date range filter
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(p.admissionDate) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(p.admissionDate) <= new Date(endDate);
    }

    return matchesSearch && matchesDept && matchesGender && matchesBlood && matchesStatus && matchesDate;
  });
}

/**
 * Sorts patients by given sortKey and direction
 * @param {Array} patients 
 * @param {string} sortKey 
 * @param {string} sortOrder ('asc' | 'desc')
 * @returns {Array}
 */
export function sortPatients(patients, sortKey = 'admissionDate', sortOrder = 'desc') {
  return [...patients].sort((a, b) => {
    let valA = a[sortKey] || '';
    let valB = b[sortKey] || '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Finds the next available unique bed number (e.g. Bed-1, Bed-2...) for a given department.
 * Guarantees that no two patients in the same department share the same bed number.
 * @param {string} deptId 
 * @param {string} deptName 
 * @param {Array} departments 
 * @returns {string}
 */
export function getNormalizedDeptKey(deptId, deptName, departments = []) {
  if (Array.isArray(departments) && departments.length > 0) {
    const matched = departments.find(
      (d) => d && (d.id === deptId || d.name === deptName || d.id === deptName || d.name === deptId)
    );
    if (matched && matched.name) {
      return matched.name.trim().toLowerCase();
    }
  }

  const s = `${deptId || ''} ${deptName || ''}`.trim().toLowerCase();
  if (s.includes('cardio') || s.includes('dept-01') || s.includes('dept_01')) return 'cardiology';
  if (s.includes('icu') || s.includes('dept-02') || s.includes('dept_02')) return 'icu';
  if (s.includes('pharm') || s.includes('dept-03') || s.includes('dept_03')) return 'pharmacy';
  if (s.includes('emerg') || s.includes('emr') || s.includes('dept-04') || s.includes('dept_04')) return 'emergency';
  if (s.includes('neur') || s.includes('dept-05') || s.includes('dept_05')) return 'neurology';
  if (s.includes('ortho') || s.includes('dept-06') || s.includes('dept_06')) return 'orthopedics';
  if (s.includes('pedia') || s.includes('dept-07') || s.includes('dept_07')) return 'pediatrics';
  if (s.includes('matern') || s.includes('dept-08') || s.includes('dept_08')) return 'maternity';

  return (deptName || deptId || 'general').trim().toLowerCase();
}

/**
 * Finds the next available unique bed number (e.g. Bed-1, Bed-2...) for a given department.
 * Enforces the maximum bed capacity (`bedsTotal`) of the department.
 * @param {string} departmentIdentifier 
 * @param {Array} patients 
 * @param {string|null} excludePatientId 
 * @param {Array} departments 
 * @returns {string|null} returns "Bed-N" if available, or null if department is FULL
 */
export function getAvailableBedNumber(departmentIdentifier, patients = [], excludePatientId = null, departments = []) {
  if (!departmentIdentifier) return 'Bed-1';

  let actualDeptName = departmentIdentifier;
  let actualDeptId = departmentIdentifier;

  if (Array.isArray(departments) && departments.length > 0) {
    const found = departments.find(
      (d) => d && (d.id === departmentIdentifier || d.name === departmentIdentifier)
    );
    if (found) {
      actualDeptName = found.name;
      actualDeptId = found.id;
    }
  }

  const targetDeptKey = getNormalizedDeptKey(actualDeptId, actualDeptName, departments);
  const occupiedBeds = new Set();

  let bedsLimit = targetDeptKey === 'cardiology' ? 4 : 40;
  if (Array.isArray(departments) && departments.length > 0) {
    const foundDept = departments.find((d) => {
      if (!d) return false;
      return getNormalizedDeptKey(d.id, d.name, departments) === targetDeptKey;
    });
    if (foundDept && Number(foundDept.bedsTotal) > 0) {
      bedsLimit = Number(foundDept.bedsTotal);
    }
  }

  if (targetDeptKey === 'cardiology') {
    bedsLimit = Math.min(bedsLimit, 4);
  }

  (patients || []).forEach((p) => {
    if (!p) return;
    if (excludePatientId && p.id === excludePatientId) return;

    const pDeptKey = getNormalizedDeptKey(p.departmentId, p.department, departments);
    if (pDeptKey !== targetDeptKey) return;

    const isDischarged = p.status && String(p.status).toLowerCase() === 'discharged';
    const isOPD = p.status && String(p.status).toLowerCase() === 'opd';
    const bed = String(p.bedNumber || '').trim();

    if (!isDischarged && !isOPD && bed && bed.toLowerCase() !== 'n/a' && bed !== '—') {
      const match = bed.match(/^bed-(\d+)$/i);
      if (match) {
        occupiedBeds.add(`bed-${parseInt(match[1], 10)}`);
      } else {
        occupiedBeds.add(bed.toLowerCase());
      }
    }
  });

  for (let i = 1; i <= bedsLimit; i++) {
    if (!occupiedBeds.has(`bed-${i}`)) {
      return `Bed-${i}`;
    }
  }

  // All beds 1..bedsLimit are occupied!
  return null;
}

/**
 * Sanitizes an array of patients to ensure EVERY patient in EVERY department has a UNIQUE bed number.
 * Resolves duplicate bed assignments and enforces maximum department bed limits (e.g. max 4 beds for Cardiology).
 * @param {Array} patientsList 
 * @param {Array} departments 
 * @returns {Array}
 */
export function sanitizePatientBeds(patientsList = [], departments = []) {
  if (!Array.isArray(patientsList)) return [];

  const deptBedsMap = {};

  return patientsList.map((patient) => {
    if (!patient) return patient;

    const rawBed = String(patient.bedNumber || '').trim();
    const isDischarged = patient.status && String(patient.status).toLowerCase() === 'discharged';
    const isBedReq = patient.bedRequired === 'Yes' || patient.bedRequired === true;
    const hasBed = (isBedReq || (rawBed && rawBed.toLowerCase() !== 'n/a' && rawBed !== '—')) && !isDischarged;

    if (!hasBed) {
      return { ...patient, bedNumber: 'N/A', bedRequired: 'No' };
    }

    const deptKey = getNormalizedDeptKey(patient.departmentId, patient.department);
    if (!deptBedsMap[deptKey]) {
      deptBedsMap[deptKey] = new Set();
    }

    let bedsLimit = deptKey === 'cardiology' ? 4 : 40;
    if (Array.isArray(departments) && departments.length > 0) {
      const foundDept = departments.find((d) => getNormalizedDeptKey(d.id, d.name) === deptKey);
      if (foundDept && Number(foundDept.bedsTotal) > 0) {
        bedsLimit = Number(foundDept.bedsTotal);
      }
    }
    if (deptKey === 'cardiology') {
      bedsLimit = Math.min(bedsLimit, 4);
    }

    const match = rawBed.match(/^bed-(\d+)$/i);
    const numericVal = match ? parseInt(match[1], 10) : null;

    if (numericVal && numericVal <= bedsLimit && !deptBedsMap[deptKey].has(`bed-${numericVal}`)) {
      deptBedsMap[deptKey].add(`bed-${numericVal}`);
      return { ...patient, bedNumber: `Bed-${numericVal}`, bedRequired: 'Yes' };
    }

    // Find next available numeric bed 1..bedsLimit
    let n = 1;
    while (n <= bedsLimit && deptBedsMap[deptKey].has(`bed-${n}`)) {
      n++;
    }

    if (n <= bedsLimit) {
      deptBedsMap[deptKey].add(`bed-${n}`);
      return { ...patient, bedNumber: `Bed-${n}`, bedRequired: 'Yes' };
    } else {
      return { ...patient, bedNumber: 'N/A', bedRequired: 'No', status: 'OPD' };
    }
  });
}

