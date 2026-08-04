import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PATIENTS } from '../data/patients';
import { appointments as INITIAL_APPOINTMENTS, queueRecords as INITIAL_QUEUE_RECORDS } from '../data/receptionData';
import { INITIAL_DOCTORS } from '../data/doctors';
import { WARDS_DATA, OPERATING_THEATERS, INITIAL_DEPARTMENTS, INITIAL_ADMIN_USERS } from '../data/adminData';
import { sanitizePatientBeds, getAvailableBedNumber } from '../utils/patientHelpers';

const DATA_KEYS = {
  PATIENTS: 'hospital_erp_v4_patients_data',
  APPOINTMENTS: 'hospital_erp_v4_appointments_data',
  DOCTORS: 'hospital_erp_v4_doctors_data',
  DEPARTMENTS: 'hospital_erp_v4_departments_data',
  USERS: 'hospital_erp_v4_admin_users',
  QUEUE: 'hospital_erp_v4_queue_data',
  WARDS: 'hospital_erp_v4_wards_data',
  THEATERS: 'hospital_erp_v4_theaters_data',
  SETTINGS: 'hospital_erp_v4_system_settings'
};

const INITIAL_SYSTEM_SETTINGS = {
  hospitalName: 'CityCare General Hospital ERP',
  hospitalCode: 'CC-ERP-01',
  primaryCurrency: 'INR (Rs)',
  timezone: 'Asia/Kolkata (UTC+5:30)',
  sessionTimeout: '30 Minutes',
  emergencyHotline: '+1 (800) 555-9111',
  patientPrefix: 'PAT-',
  enableTwoFactor: true,
  autoBackupFrequency: 'Daily at 04:00 AM'
};

function safeRead(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

function normalizeDepartment(d) {
  if (!d) return d;
  const bedsTotal = Math.max(0, Number(d.bedsTotal) || 0);
  const rawOccupied = Math.max(0, Number(d.bedsOccupied) || 0);
  const bedsOccupied = bedsTotal > 0 ? Math.min(bedsTotal, rawOccupied) : rawOccupied;
  return {
    id: d.id ?? `dept_${Math.random().toString(36).slice(2,8)}`,
    name: d.name ?? d.title ?? 'Unknown Department',
    head: d.head ?? d.headOfDept ?? 'TBD',
    code: d.code ?? d.code?.toUpperCase() ?? (d.name ? d.name.replace(/\s+/g,'_').toUpperCase() : 'DEPT'),
    doctorsCount: Number(d.doctorsCount) || 0,
    nursesCount: Number(d.nursesCount) || 0,
    bedsTotal,
    bedsOccupied,
    monthlyBudget: d.monthlyBudget ?? 'Rs 0',
    status: d.status ?? 'Active',
    location: d.location ?? 'Unknown',
    description: d.description ?? ''
  };
}

function sanitizeAppointments(list) {
  if (!Array.isArray(list)) return [];
  let maxIdNum = list.reduce((max, a) => {
    const num = Number(String(a?.id || '').replace(/\D/g, ''));
    return Math.max(max, Number.isFinite(num) ? num : 0);
  }, 0);

  return list.map((a) => {
    if (!a) return a;
    if (a.id) return a;
    maxIdNum += 1;
    return {
      ...a,
      id: `APT-${String(maxIdNum).padStart(3, '0')}`
    };
  });
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    const raw = safeRead(DATA_KEYS.PATIENTS, INITIAL_PATIENTS);
    return sanitizePatientBeds(raw, INITIAL_DEPARTMENTS);
  });
  const [appointments, setAppointments] = useState(() => {
    const raw = safeRead(DATA_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    return sanitizeAppointments(raw);
  });
  const [doctors, setDoctors] = useState(() => {
    const raw = safeRead(DATA_KEYS.DOCTORS, INITIAL_DOCTORS);
    if (!Array.isArray(raw)) return INITIAL_DOCTORS;
    return raw
      .filter(d => {
        if (!d) return false;
        const email = String(d.email || d.loginEmail || '').toLowerCase();
        const name = String(d.name || '').toLowerCase();
        if (['muhammad@gmail.com', 'talha@gmail.com', 'huzaifa@gmail.com', 'muhammad.talha@gmail.com'].includes(email)) return false;
        if (name.includes('talha') || name.includes('muhammad talha')) return false;
        return true;
      })
      .map(d => {
        if (!d) return d;
        const existingEmail = (d.email || d.loginEmail || '').trim().toLowerCase();
        const email = existingEmail || `${String(d.name || 'doctor').toLowerCase().replace(/^dr\.\s*/i, '').trim().split(' ')[0]}@gmail.com`;
        let scope = d.patientAccessScope || 'assigned';
        if (d.id === 'DOC-008' || d.id === 'DOC-004') {
          scope = 'assigned';
        }
        return {
          ...d,
          email,
          loginEmail: email,
          password: d.password || d.loginPassword || 'password123',
          patientAccessScope: scope,
          canViewAllPatients: scope === 'all',
          showZeroPatients: scope === 'none'
        };
      });
  });
  const [wards, setWards] = useState(() => safeRead(DATA_KEYS.WARDS, WARDS_DATA));
  const [theaters, setTheaters] = useState(() => safeRead(DATA_KEYS.THEATERS, OPERATING_THEATERS));
  const [departments, setDepartments] = useState(() => {
    if (typeof window === 'undefined') {
      return INITIAL_DEPARTMENTS.map(normalizeDepartment);
    }

    try {
      const raw = localStorage.getItem(DATA_KEYS.DEPARTMENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeDepartment);
        }
      }
    } catch {
      // ignore parsing errors and fallback to defaults
    }

    return INITIAL_DEPARTMENTS.map(normalizeDepartment);
  });
  const [users, setUsers] = useState(() => {
    const raw = safeRead(DATA_KEYS.USERS, INITIAL_ADMIN_USERS);
    if (!Array.isArray(raw)) return INITIAL_ADMIN_USERS;
    return raw
      .filter(u => {
        if (!u) return false;
        const email = String(u.email || u.loginEmail || '').toLowerCase();
        const name = String(u.name || u.fullName || '').toLowerCase();
        if (['muhammad@gmail.com', 'talha@gmail.com', 'huzaifa@gmail.com', 'muhammad.talha@gmail.com'].includes(email)) return false;
        if (name.includes('talha') || name.includes('muhammad talha')) return false;
        return true;
      })
      .map(u => {
        const email = String(u.email || u.loginEmail || '').toLowerCase();
        if (email === 'reception@hospital.com' || u.name?.toLowerCase().includes('emily watson')) {
          return { ...u, role: 'Receptionist', department: 'Patient Registration' };
        }
        return u;
      });
  });
  const [queue, setQueue] = useState(() => safeRead(DATA_KEYS.QUEUE, INITIAL_QUEUE_RECORDS));
  const [settings, setSettings] = useState(() => safeRead(DATA_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS));

  // Sync department bedsOccupied count dynamically with real active bed patient count
  useEffect(() => {
    setDepartments((prevDepts) =>
      prevDepts.map((dept) => {
        const count = patients.filter((p) => {
          const matchDept = p.departmentId === dept.id || p.departmentId === dept.code || p.department === dept.name;
          const isDischarged = p.status && String(p.status).toLowerCase() === 'discharged';
          const bed = String(p.bedNumber || '').trim();
          return matchDept && !isDischarged && bed && bed.toLowerCase() !== 'n/a' && bed !== '—';
        }).length;
        const total = Math.max(0, Number(dept.bedsTotal || 0));
        const cappedCount = total > 0 ? Math.min(total, count) : count;
        if (dept.bedsOccupied === cappedCount) return dept;
        return { ...dept, bedsOccupied: cappedCount };
      })
    );
  }, [patients]);

  // Sync department doctorsCount dynamically with real active doctor count
  useEffect(() => {
    setDepartments((prevDepts) =>
      prevDepts.map((dept) => {
        const count = doctors.filter((doc) => {
          if (!doc) return false;
          const matchDept = doc.departmentId === dept.id || doc.departmentId === dept.code || doc.department === dept.name ||
            (dept.name && doc.department && String(doc.department).toLowerCase() === String(dept.name).toLowerCase());
          return matchDept && doc.status !== 'Inactive';
        }).length;
        if (dept.doctorsCount === count) return dept;
        return { ...dept, doctorsCount: count };
      })
    );
  }, [doctors]);

  // Persist on change
  useEffect(() => { safeWrite(DATA_KEYS.PATIENTS, patients); }, [patients]);
  useEffect(() => { safeWrite(DATA_KEYS.APPOINTMENTS, appointments); }, [appointments]);
  useEffect(() => {
    safeWrite(DATA_KEYS.DOCTORS, doctors);
    safeWrite('hospital_erp_doctors_data', doctors);
  }, [doctors]);
  useEffect(() => { safeWrite(DATA_KEYS.WARDS, wards); }, [wards]);
  useEffect(() => { safeWrite(DATA_KEYS.THEATERS, theaters); }, [theaters]);
  useEffect(() => { safeWrite(DATA_KEYS.DEPARTMENTS, departments); }, [departments]);
  useEffect(() => { safeWrite(DATA_KEYS.USERS, users); }, [users]);
  useEffect(() => { safeWrite(DATA_KEYS.QUEUE, queue); }, [queue]);
  useEffect(() => { safeWrite(DATA_KEYS.SETTINGS, settings); }, [settings]);

  const findDepartment = (identifier) => {
    if (!identifier) return null;
    return departments.find((d) => d.id === identifier || d.name === identifier || d.code === identifier) || null;
  };

  const adjustDepartmentOccupancy = (deptId, delta) => {
    if (!deptId) return;
    setDepartments((prevDepartments) => prevDepartments.map((dept) => {
      if (dept.id !== deptId) return dept;
      const total = Math.max(0, Number(dept.bedsTotal || 0));
      const current = Math.max(0, Number(dept.bedsOccupied || 0));
      const nextOccupied = total > 0 ? Math.min(total, Math.max(0, current + delta)) : Math.max(0, current + delta);
      return normalizeDepartment({ ...dept, bedsOccupied: nextOccupied });
    }));
  };

  // Patients CRUD
  const addPatient = (patient) => {
    setPatients((prev) => {
      const sanitized = sanitizePatientBeds([{ ...patient }, ...prev], departments);
      return sanitized;
    });
    const selectedDept = findDepartment(patient.departmentId) || findDepartment(patient.department);
    if (selectedDept && (patient.bedRequired === 'Yes' || patient.bedRequired === true)) {
      adjustDepartmentOccupancy(selectedDept.id, 1);
    }
    return patient;
  };

  const updatePatient = (id, patch) => {
    setPatients((prevPatients) => {
      const patient = prevPatients.find((p) => p.id === id);
      if (!patient) return prevPatients;

      const updated = { ...patient, ...patch };
      const oldDept = findDepartment(patient.departmentId) || findDepartment(patient.department);
      const newDept = findDepartment(updated.departmentId) || findDepartment(updated.department);
      const oldBedRequired = patient.bedRequired === 'Yes' || patient.bedRequired === true;
      const newBedRequired = updated.bedRequired === 'Yes' || updated.bedRequired === true;

      if (oldDept && newDept && oldDept.id === newDept.id && oldBedRequired !== newBedRequired) {
        adjustDepartmentOccupancy(newDept.id, newBedRequired ? 1 : -1);
      } else if (oldDept && newDept && oldDept.id !== newDept.id) {
        if (oldBedRequired) adjustDepartmentOccupancy(oldDept.id, -1);
        if (newBedRequired) adjustDepartmentOccupancy(newDept.id, 1);
      } else if (oldDept && !newDept && oldBedRequired) {
        adjustDepartmentOccupancy(oldDept.id, -1);
      } else if (!oldDept && newDept && newBedRequired) {
        adjustDepartmentOccupancy(newDept.id, 1);
      }

      if (newDept) {
        updated.department = newDept.name;
      }

      const updatedList = prevPatients.map((p) => (p.id === id ? updated : p));
      return sanitizePatientBeds(updatedList, departments);
    });

    return patients.find((p) => p.id === id);
  };

  const removePatient = (id) => {
    setPatients((prev) => {
      const patientToRemove = prev.find((p) => p.id === id);
      if (patientToRemove && (patientToRemove.bedRequired === 'Yes' || patientToRemove.bedRequired === true)) {
        const dept = findDepartment(patientToRemove.departmentId) || findDepartment(patientToRemove.department);
        if (dept) {
          adjustDepartmentOccupancy(dept.id, -1);
        }
      }
      return prev.filter((p) => p.id !== id);
    });
    // remove related appointments and queue entries
    setAppointments((prev) => prev.filter((a) => a.patientId !== id && a.patientName !== id));
    setQueue((prev) => prev.filter((q) => q.patientId !== id && q.patientName !== id));
  };

  const admitPatient = (identifier, departmentOverride) => {
    let assignedBed = null;
    let isFull = false;

    setPatients((prevPatients) => {
      let targetIndex = prevPatients.findIndex(
        (p) => p.id === identifier || (p.name || p.fullName || '').toLowerCase() === String(identifier).toLowerCase()
      );

      let newList = [...prevPatients];

      if (targetIndex === -1) {
        const nextIdNum = newList.reduce((max, p) => {
          const num = Number(String(p.id).replace(/\D/g, ''));
          return Math.max(max, Number.isFinite(num) ? num : 0);
        }, 8800);
        const newPatientId = `PAT-${nextIdNum + 1}`;
        const dept = departmentOverride || 'General Medicine';
        assignedBed = getAvailableBedNumber(dept, newList, null, departments);

        if (!assignedBed) {
          isFull = true;
          return prevPatients;
        }

        const newPatientObj = {
          id: newPatientId,
          name: String(identifier),
          fullName: String(identifier),
          phone: '',
          gender: 'Male',
          age: 30,
          status: 'Admitted',
          bedRequired: 'Yes',
          bedNumber: assignedBed,
          department: dept,
          admissionDate: new Date().toISOString().slice(0, 10)
        };

        newList.unshift(newPatientObj);
      } else {
        const targetPatient = newList[targetIndex];
        const dept = departmentOverride || targetPatient.departmentId || targetPatient.department || 'General Medicine';

        // Check if patient ALREADY has a valid assigned bed
        if (targetPatient.status === 'Admitted' && targetPatient.bedNumber && targetPatient.bedNumber !== 'N/A' && targetPatient.bedNumber !== '—') {
          assignedBed = targetPatient.bedNumber;
        } else {
          assignedBed = getAvailableBedNumber(dept, newList, targetPatient.id, departments);
          if (!assignedBed) {
            isFull = true;
            return prevPatients;
          }
        }

        const updated = {
          ...targetPatient,
          status: 'Admitted',
          bedRequired: 'Yes',
          bedNumber: assignedBed,
          department: targetPatient.department || dept
        };
        newList[targetIndex] = updated;
      }

      const sanitized = sanitizePatientBeds(newList, departments);
      safeWrite(DATA_KEYS.PATIENTS, sanitized);
      return sanitized;
    });

    if (isFull) return null;
    return assignedBed;
  };

  const dischargePatient = (identifier) => {
    setPatients((prevPatients) => {
      const targetIndex = prevPatients.findIndex(
        (p) => p.id === identifier || (p.name || p.fullName || '').toLowerCase() === String(identifier).toLowerCase()
      );

      if (targetIndex === -1) return prevPatients;

      const targetPatient = prevPatients[targetIndex];
      const updated = {
        ...targetPatient,
        status: 'Discharged',
        bedRequired: 'No',
        bedNumber: 'N/A'
      };

      const newList = [...prevPatients];
      newList[targetIndex] = updated;
      const sanitized = sanitizePatientBeds(newList);
      safeWrite(DATA_KEYS.PATIENTS, sanitized);
      return sanitized;
    });
  };


  // Users CRUD (admin users)
  const addUser = (user) => {
    const next = [{ ...user }, ...users];
    setUsers(next);
    return user;
  };

  const updateUser = (id, patch) => {
    let found = false;
    const next = users.map((u) => {
      const isMatch =
        (id && u.id === id) ||
        (patch?.email && u.email?.toLowerCase() === patch.email.toLowerCase()) ||
        (patch?.loginEmail && u.loginEmail?.toLowerCase() === patch.loginEmail.toLowerCase()) ||
        (patch?.name && u.name?.toLowerCase() === patch.name.toLowerCase());
      if (isMatch) {
        found = true;
        return { ...u, ...patch };
      }
      return u;
    });

    if (!found) {
      const newUser = { id: id || `usr_${Date.now()}`, ...patch };
      next.unshift(newUser);
      setUsers(next);
      safeWrite(DATA_KEYS.USERS, next);
      return newUser;
    }

    setUsers(next);
    safeWrite(DATA_KEYS.USERS, next);
    return next.find((u) => u.id === id || u.email === patch?.email);
  };

  const removeUser = (id) => {
    const next = users.filter((u) => u.id !== id);
    setUsers(next);
    safeWrite(DATA_KEYS.USERS, next);
  };

  // Appointments CRUD
  const addAppointment = (appointment) => {
    let apptId = appointment.id;
    if (!apptId) {
      const maxIdNum = appointments.reduce((max, a) => {
        const num = Number(String(a?.id || '').replace(/\D/g, ''));
        return Math.max(max, Number.isFinite(num) ? num : 0);
      }, 0);
      apptId = `APT-${String(maxIdNum + 1).padStart(3, '0')}`;
    }

    const created = { ...appointment, id: apptId };
    const next = [created, ...appointments];
    setAppointments(next);
    safeWrite(DATA_KEYS.APPOINTMENTS, next);
    return created;
  };

  const updateAppointment = (id, patch) => {
    const next = appointments.map((a) => (a.id === id ? { ...a, ...patch } : a));
    setAppointments(next);
    safeWrite(DATA_KEYS.APPOINTMENTS, next);
    return next.find((a) => a.id === id);
  };

  const removeAppointment = (id) => {
    const next = appointments.filter((a) => a.id !== id);
    setAppointments(next);
    safeWrite(DATA_KEYS.APPOINTMENTS, next);
  };

  // Doctors CRUD
  const addDoctor = (doctor) => {
    const next = [{ ...doctor }, ...doctors];
    setDoctors(next);
    safeWrite(DATA_KEYS.DOCTORS, next);
    return doctor;
  };

  const updateDoctor = (id, patch) => {
    let found = false;
    const next = doctors.map((d) => {
      const isMatch =
        (id && d.id === id) ||
        (patch?.email && d.email?.toLowerCase() === patch.email.toLowerCase()) ||
        (patch?.loginEmail && (d.loginEmail || d.email)?.toLowerCase() === patch.loginEmail.toLowerCase()) ||
        (patch?.name && d.name?.toLowerCase() === patch.name.toLowerCase());
      if (isMatch) {
        found = true;
        return { ...d, ...patch };
      }
      return d;
    });

    if (!found) {
      const newDoctor = {
        id: id || `DOC-${String(doctors.length + 1).padStart(3, '0')}`,
        role: 'Doctor',
        status: 'Active',
        availability: 'Available',
        ...patch
      };
      next.unshift(newDoctor);
      setDoctors(next);
      safeWrite(DATA_KEYS.DOCTORS, next);
      return newDoctor;
    }

    setDoctors(next);
    safeWrite(DATA_KEYS.DOCTORS, next);
    return next.find((d) => d.id === id || d.email === patch?.email);
  };

  const removeDoctor = (id) => {
    const next = doctors.filter((d) => d.id !== id);
    setDoctors(next);
    safeWrite(DATA_KEYS.DOCTORS, next);
  };

  // Departments CRUD
  const addDepartment = (dept) => { const nd = normalizeDepartment(dept); const next = [nd, ...departments]; setDepartments(next); return nd; };
  const updateDepartment = (id, patch) => { const next = departments.map((d) => (d.id === id ? normalizeDepartment({ ...d, ...patch }) : d)); setDepartments(next); return next.find((d) => d.id === id); };
  const removeDepartment = (id) => { setDepartments((prev) => prev.filter((d) => d.id !== id)); };

  // Ward management
  const addWard = (ward) => {
    const next = [...wards, ward];
    setWards(next);
    return ward;
  };
  const updateWard = (code, patch) => {
    const next = wards.map((w) => (w.code === code ? { ...w, ...patch } : w));
    setWards(next);
    return next.find((w) => w.code === code);
  };
  const removeWard = (code) => {
    const next = wards.filter((w) => w.code !== code);
    setWards(next);
  };

  // Operating theater management
  const addTheater = (theater) => {
    const next = [...theaters, theater];
    setTheaters(next);
    return theater;
  };
  const updateTheater = (id, patch) => {
    const next = theaters.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTheaters(next);
    return next.find((t) => t.id === id);
  };
  const removeTheater = (id) => {
    const next = theaters.filter((t) => t.id !== id);
    setTheaters(next);
  };

  // Queue management
  const addQueueRecord = (record) => { const next = [...queue, record]; setQueue(next); return record; };
  const updateQueueRecord = (id, patch) => { const next = queue.map((r) => (r.id === id ? { ...r, ...patch } : r)); setQueue(next); return next.find((r) => r.id === id); };
  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    return { ...settings, ...patch };
  };

  const removeQueueRecord = (id) => { setQueue((prev) => prev.filter((r) => r.id !== id)); };

  const resetToDefaultData = () => {
    setPatients(sanitizePatientBeds(INITIAL_PATIENTS, INITIAL_DEPARTMENTS));
    setDoctors(INITIAL_DOCTORS);
    setDepartments(INITIAL_DEPARTMENTS.map(normalizeDepartment));
    setAppointments(INITIAL_APPOINTMENTS);
    setQueue(INITIAL_QUEUE_RECORDS);
    setWards(WARDS_DATA);
    setTheaters(OPERATING_THEATERS);
    setUsers(INITIAL_ADMIN_USERS);
    safeWrite(DATA_KEYS.PATIENTS, INITIAL_PATIENTS);
    safeWrite(DATA_KEYS.DOCTORS, INITIAL_DOCTORS);
    safeWrite(DATA_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    safeWrite(DATA_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    safeWrite(DATA_KEYS.QUEUE, INITIAL_QUEUE_RECORDS);
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        appointments,
        doctors,
        wards,
        theaters,
        departments,
        users,
        queue,
        settings,
        addPatient,
        updatePatient,
        admitPatient,
        dischargePatient,
        addDepartment,
        updateDepartment,
        removeDepartment,
        addWard,
        updateWard,
        removeWard,
        addTheater,
        updateTheater,
        removeTheater,
        addUser,
        updateUser,
        removeUser,
        removePatient,
        addAppointment,
        updateAppointment,
        removeAppointment,
        addDoctor,
        updateDoctor,
        removeDoctor,
        addQueueRecord,
        updateQueueRecord,
        removeQueueRecord,
        updateSettings,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}

export default DataContext;
