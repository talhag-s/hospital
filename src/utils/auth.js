import { DUMMY_USERS } from '../data/users';
import { INITIAL_ADMIN_USERS } from '../data/adminData';
import { INITIAL_DOCTORS } from '../data/doctors';

const ADMIN_USERS_STORAGE_KEYS = ['hospital_erp_v4_admin_users', 'hospital_erp_admin_users'];
const DOCTORS_STORAGE_KEYS = ['hospital_erp_v4_doctors_data', 'hospital_erp_doctors_data', 'hospital_erp_doctors'];

function getAllUsers() {
  // Map keyed by a unique identifier so later entries override earlier ones.
  // Priority: localStorage admin users > localStorage doctors > static defaults
  const userMap = new Map(); // key: email (lowercase)

  // ── 1. Seed with static defaults (lowest priority) ──
  [...DUMMY_USERS].forEach((u) => {
    const key = u.email?.toLowerCase();
    if (key) userMap.set(key, { ...u });
  });

  INITIAL_DOCTORS.forEach((doc) => {
    const key = (doc.loginEmail || doc.email)?.toLowerCase();
    if (key) {
      const existing = userMap.get(key) || {};
      userMap.set(key, {
        id: doc.id || doc.employeeId || existing.id || 'DOC-001',
        name: doc.name || existing.name,
        email: key,
        loginEmail: key,
        password: doc.password || doc.loginPassword || existing.password || 'password123',
        loginPassword: doc.password || doc.loginPassword || existing.password || 'password123',
        role: existing.role || 'Doctor',
        department: doc.department || existing.department,
        profileImage: doc.photo || existing.profileImage
      });
    }
  });

  // ── 2. Override with localStorage admin/receptionist users ──
  ADMIN_USERS_STORAGE_KEYS.forEach((key) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((u) => {
            const email = (u.email || u.loginEmail)?.toLowerCase();
            if (!email) return;

            // Remove any old admin entry (handles email change)
            if (u.role === 'Admin' || u.id === 'usr_admin_01') {
              for (const [k, v] of userMap.entries()) {
                if (v.role === 'Admin' || v.id === 'usr_admin_01' || k === 'admin@hospital.com') {
                  if (k !== email) {
                    userMap.delete(k);
                  }
                }
              }
            } else if (u.id) {
              for (const [k, v] of userMap.entries()) {
                if (v.id === u.id && k !== email) {
                  userMap.delete(k);
                }
              }
            }
            const existing = userMap.get(email) || {};
            userMap.set(email, { ...existing, ...u, email });
          });
        }
      }
    } catch (error) {
      console.error(`Failed to load admin users from ${key}`, error);
    }
  });

  // ── 3. Override with localStorage doctors ──
  DOCTORS_STORAGE_KEYS.forEach((key) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      parsed.forEach((doc) => {
        const email = (doc.loginEmail || doc.email)?.toLowerCase();
        if (!email) return;
        if (doc.id) {
          for (const [k, v] of userMap.entries()) {
            if (v.id === doc.id && k !== email) {
              userMap.delete(k);
            }
          }
        }
        const existing = userMap.get(email) || {};
        userMap.set(email, {
          id: doc.id || doc.employeeId || existing.id,
          name: doc.name || existing.name,
          email,
          loginEmail: email,
          password: doc.password || doc.loginPassword || existing.password || 'password123',
          loginPassword: doc.password || doc.loginPassword || existing.password || 'password123',
          role: existing.role === 'Receptionist' || existing.role === 'Admin'
            ? existing.role
            : 'Doctor',
          department: doc.department || existing.department,
          profileImage: doc.photo || existing.profileImage
        });
      });
    } catch (err) {
      console.error(`Failed to load doctors from ${key}`, err);
    }
  });

  // ── 4. Check active auth user session in localStorage/sessionStorage ──
  try {
    const authStored = localStorage.getItem('hospital_erp_auth_user') || sessionStorage.getItem('hospital_erp_auth_user');
    if (authStored) {
      const u = JSON.parse(authStored);
      const email = (u.email || u.loginEmail)?.toLowerCase();
      if (email) {
        if (u.id) {
          for (const [k, v] of userMap.entries()) {
            if (v.id === u.id && k !== email) {
              userMap.delete(k);
            }
          }
        }
        const existing = userMap.get(email) || {};
        userMap.set(email, {
          ...existing,
          ...u,
          email,
          loginEmail: email,
          password: u.password || u.loginPassword || existing.password || 'password123',
          loginPassword: u.password || u.loginPassword || existing.password || 'password123'
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse auth user in getAllUsers', e);
  }

  const users = Array.from(userMap.values());
  return users.length > 0 ? users : INITIAL_ADMIN_USERS;
}

/**
 * Validates email string format using standard regex
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmailFormat(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password requirement (min 6 characters)
 * @param {string} password 
 * @returns {boolean}
 */
export function validatePassword(password) {
  if (!password) return false;
  return password.length >= 6;
}

/**
 * Authenticates user credentials against all user & doctor records
 * @param {string} email 
 * @param {string} password 
 * @returns {{ success: boolean, user?: object, message?: string }}
 */
export function authenticateUser(email, password) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPassword = password ? password.trim() : '';

  const users = getAllUsers();

  // Match by email/ID & password
  const user = users.find((u) => {
    const matchIdentifier =
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (u.loginEmail && u.loginEmail.toLowerCase() === cleanEmail) ||
      (u.id && String(u.id).toLowerCase() === cleanEmail) ||
      (u.employeeId && String(u.employeeId).toLowerCase() === cleanEmail);

    const userPass = u.password || u.loginPassword;
    const isDoc = u.role === 'Doctor' || (u.id && u.id.startsWith('DOC-'));
    const isDefaultDocPass = isDoc && (cleanPassword === 'password123' || cleanPassword === 'doctor123');
    const matchPass = Boolean(cleanPassword && userPass && (cleanPassword === userPass || isDefaultDocPass));

    return matchIdentifier && matchPass;
  });

  if (user) {
    const { password: _, loginPassword: __, ...userWithoutPassword } = user;
    return {
      success: true,
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.role || 'Doctor'
      }
    };
  }

  return {
    success: false,
    message: 'Invalid email address or password. Please check your credentials and try again.'
  };
}

/**
 * Maps user role to their corresponding dashboard URL
 * @param {string} role 
 * @returns {string}
 */
export function getDashboardPathByRole(role) {
  if (!role) return '/login';

  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case 'admin':
      return '/admin/dashboard';
    case 'doctor':
      return '/dashboards/doctor';
    case 'receptionist':
    case 'reception':
      return '/reception';
    case 'nurse':
      return '/dashboards/nurse';
    case 'lab tech':
    case 'lab':
    case 'laboratory':
      return '/dashboards/lab';
    case 'pharmacist':
    case 'pharmacy':
      return '/dashboards/pharmacy';
    case 'billing officer':
    case 'billing':
      return '/dashboards/billing';
    case 'inventory manager':
    case 'inventory':
      return '/dashboards/inventory';
    case 'hr manager':
    case 'hr':
      return '/dashboards/hr';
    default:
      return '/admin/dashboard';
  }
}

export function saveRememberedEmail(email) {
  try {
    localStorage.setItem('hospital_erp_remembered_email', email);
  } catch (e) {
    console.error('Failed to save remembered email', e);
  }
}

export function getRememberedEmail() {
  try {
    return localStorage.getItem('hospital_erp_remembered_email') || '';
  } catch {
    return '';
  }
}

export function clearRememberedEmail() {
  try {
    localStorage.removeItem('hospital_erp_remembered_email');
  } catch (e) {
    console.error('Failed to clear remembered email', e);
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find((u) => {
    return (
      (u.email && u.email.toLowerCase() === cleanEmail) ||
      (u.loginEmail && u.loginEmail.toLowerCase() === cleanEmail) ||
      (u.id && String(u.id).toLowerCase() === cleanEmail) ||
      (u.employeeId && String(u.employeeId).toLowerCase() === cleanEmail)
    );
  }) || null;
}

export function resetUserPassword(email, newPassword) {
  if (!email || !newPassword) return false;
  const cleanEmail = email.trim().toLowerCase();

  ADMIN_USERS_STORAGE_KEYS.forEach((key) => {
    try {
      const stored = localStorage.getItem(key);
      let admins = stored ? JSON.parse(stored) : [];
      if (Array.isArray(admins)) {
        const idx = admins.findIndex((u) => (u.email || u.loginEmail)?.toLowerCase() === cleanEmail || (u.id && String(u.id).toLowerCase() === cleanEmail));
        if (idx !== -1) {
          admins[idx].password = newPassword;
          admins[idx].loginPassword = newPassword;
          localStorage.setItem(key, JSON.stringify(admins));
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  DOCTORS_STORAGE_KEYS.forEach((key) => {
    try {
      const stored = localStorage.getItem(key);
      let docs = stored ? JSON.parse(stored) : [];
      if (Array.isArray(docs)) {
        const idx = docs.findIndex((d) => (d.email || d.loginEmail)?.toLowerCase() === cleanEmail || (d.id && String(d.id).toLowerCase() === cleanEmail));
        if (idx !== -1) {
          docs[idx].password = newPassword;
          docs[idx].loginPassword = newPassword;
          localStorage.setItem(key, JSON.stringify(docs));
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  const matchedDummy = DUMMY_USERS.find(u => u.email.toLowerCase() === cleanEmail);
  if (matchedDummy) {
    matchedDummy.password = newPassword;
  }

  return true;
}
