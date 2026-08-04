import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Briefcase,
  Clock,
  Phone,
  AlertCircle,
  Save,
  RotateCcw,
  X,
  Key,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { DEPARTMENTS, SPECIALIZATIONS, QUALIFICATIONS } from '../../data/doctors';
import { validateDoctorForm } from '../../utils/doctorHelpers';
import { useData } from '../../contexts/DataContext';

const DoctorForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  const { doctors = [], departments = [] } = useData();
  const dynamicDepartments = (departments && departments.length > 0)
    ? departments.map((d) => (typeof d === 'string' ? d : d?.name)).filter(Boolean)
    : DEPARTMENTS;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', gender: '', dob: '', cnic: '', phone: '', email: '', loginEmail: '', password: 'doctor123', confirmPassword: 'doctor123', address: '',
    employeeId: '', department: '', specialization: '', qualification: '', experience: '',
    licenseNumber: '', joiningDate: '',
    availability: 'Available', status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00', endTime: '17:00', breakTime: '12:00-13:00',
    emergencyContact: '', emergencyPhone: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    } else if (!isEdit) {
      const existing = doctors || [];
      const nextId = Math.max(...existing.map(d => parseInt((d.id || d.employeeId || '').replace('DOC-', '') || '0')), 0) + 1;
      const autoId = `DOC-${String(nextId).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, employeeId: autoId }));
    }
  }, [initialData, doctors, isEdit]);

  const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const errorInputCls = 'w-full px-4 py-2 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const sectionCls = 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm';

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'email' && (!prev.loginEmail || prev.loginEmail === prev.email)) {
        next.loginEmail = value;
      }
      return next;
    });
    if (touched[name]) {
      const fieldErrors = validateDoctorForm({ ...formData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateDoctorForm(formData);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
  };

  const handleReset = () => {
    setFormData(initialData ? { ...initialData } : {
      name: '', gender: '', dob: '', cnic: '', phone: '', email: '', loginEmail: '', password: 'doctor123', confirmPassword: 'doctor123', address: '',
      employeeId: '', department: '', specialization: '', qualification: '', experience: '',
      licenseNumber: '', joiningDate: '',
      availability: 'Available', status: 'Active',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00', endTime: '17:00', breakTime: '12:00-13:00',
      emergencyContact: '', emergencyPhone: '',
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateDoctorForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched(Object.keys(validationErrors).reduce((acc, key) => { acc[key] = true; return acc; }, {}));
      return;
    }
    onSubmit(formData);
  };

  const renderInput = (name, label, type = 'text', required = true) => {
    const error = errors[name];
    const isTouched = touched[name];
    return (
      <div>
        <label htmlFor={name} className={labelCls}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type} id={name} name={name} value={formData[name]} onChange={handleChange} onBlur={handleBlur}
          className={error && isTouched ? errorInputCls : inputCls}
        />
        {error && isTouched && (
          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
      </div>
    );
  };

  const renderSelect = (name, label, options, required = true) => {
    const error = errors[name];
    const isTouched = touched[name];
    return (
      <div>
        <label htmlFor={name} className={labelCls}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={name} name={name} value={formData[name]} onChange={handleChange} onBlur={handleBlur}
          className={error && isTouched ? errorInputCls : inputCls}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
        {error && isTouched && (
          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Personal Information */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-200">
          <User className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-gray-800">1. Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('name', 'Full Name')}
          {renderSelect('gender', 'Gender', ['Male', 'Female', 'Other'])}
          {renderInput('dob', 'Date of Birth', 'date')}
          {renderInput('cnic', 'CNIC')}
          {renderInput('phone', 'Phone Number', 'tel')}
        </div>
        <div className="mt-4">
          <label htmlFor="address" className={labelCls}>Address<span className="text-red-500 ml-1">*</span></label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur}
            rows="2" className={errors.address && touched.address ? errorInputCls : inputCls}
          />
          {errors.address && touched.address && (
            <p className="text-red-600 text-xs mt-1"><AlertCircle size={12} className="inline mr-1" />{errors.address}</p>
          )}
        </div>
      </div>

      {/* Section 2: Professional Information */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-200">
          <Briefcase className="text-green-600" size={24} />
          <h2 className="text-lg font-bold text-gray-800">2. Professional Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="employeeId" className={labelCls}>
              Employee ID <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 ml-1">Auto-Generated</span>
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-slate-50 font-mono font-bold text-blue-700 cursor-not-allowed shadow-inner"
              placeholder="e.g. DOC-006"
            />
          </div>
          {renderSelect('department', 'Department', dynamicDepartments)}
          {renderSelect('specialization', 'Specialization', SPECIALIZATIONS)}
          {renderSelect('qualification', 'Qualification', QUALIFICATIONS)}
          {renderInput('experience', 'Experience (years)', 'number')}
          {renderInput('licenseNumber', 'License Number')}
          {renderInput('joiningDate', 'Joining Date', 'date')}
        </div>
      </div>

      {/* Section 3: Availability */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-200">
          <Clock className="text-purple-600" size={24} />
          <h2 className="text-lg font-bold text-gray-800">3. Availability & Schedule</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderSelect('availability', 'Availability', ['Available', 'Busy', 'On-Leave'])}
        </div>
        <div className="mb-6">
          <label className={labelCls}>Working Days</label>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {workingDays.map(day => (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                className={`py-2 px-2 rounded text-xs font-semibold transition-colors ${
                  formData.workingDays.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderInput('startTime', 'Start Time', 'time')}
          {renderInput('endTime', 'End Time', 'time')}
          {renderInput('breakTime', 'Break Time (e.g. 12:00-13:00)', 'text', false)}
        </div>
      </div>

      {/* Section 4: Emergency Contact */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-red-200">
          <Phone className="text-red-600" size={24} />
          <h2 className="text-lg font-bold text-gray-800">4. Emergency Contact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('emergencyContact', 'Contact Name', 'text', false)}
          {renderInput('emergencyPhone', 'Contact Phone', 'tel', false)}
        </div>
      </div>

      {/* Section 5: System Login & Account Credentials */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-indigo-200">
          <div className="flex items-center gap-3">
            <Key className="text-indigo-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-800">5. System Login & Account Credentials</h2>
              <p className="text-xs text-gray-500 mt-0.5">Set up login credentials so this doctor can log in to the Hospital ERP system</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck size={14} /> ERP Login Account
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="loginEmail" className={labelCls}>
              Login Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="loginEmail"
              name="loginEmail"
              value={formData.loginEmail || formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. doctor@citycare.com"
              className={errors.loginEmail && touched.loginEmail ? errorInputCls : inputCls}
              required
            />
            {errors.loginEmail && touched.loginEmail && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.loginEmail}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={labelCls}>
              Login Password <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                className={errors.password && touched.password ? errorInputCls : inputCls}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelCls}>
              Confirm Password <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-enter password"
                className={errors.confirmPassword && touched.confirmPassword ? errorInputCls : inputCls}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end bg-gray-50 p-5 rounded-xl border border-gray-200">
        <button type="button" onClick={onCancel}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button type="button" onClick={handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Save Doctor'}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
