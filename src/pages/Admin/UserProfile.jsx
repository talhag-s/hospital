import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ChevronLeft,
  Mail,
  Phone,
  Briefcase,
  Shield,
  UserCircle2,
  ArrowRight,
  Edit2,
  Save,
  X,
  Camera,
  CheckCircle2,
  Stethoscope,
  Award,
  Key,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getDashboardPathByRole } from '../../utils/auth';

export default function UserProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, updateAuthUser } = useAuth();
  const { doctors, updateDoctor, users, updateUser } = useData();

  const isOwnProfile = !id || id === authUser?.id;

  // 1. Find user object (either from doctors list, admin users list, or authUser)
  const targetDoctor = doctors?.find(
    (d) => id ? d.id === id : (authUser?.email && d.email?.toLowerCase() === authUser.email?.toLowerCase())
  );

  const targetUser = users?.find(
    (u) => id ? u.id === id : (authUser?.email && u.email?.toLowerCase() === authUser.email?.toLowerCase())
  );

  const profileData = targetDoctor || targetUser || authUser || {};

  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    qualification: '',
    experience: '',
    photo: '',
    password: ''
  });

  // Synchronize form data on load or profileData change
  useEffect(() => {
    setFormData({
      name: profileData.name || profileData.fullName || authUser?.name || '',
      email: profileData.email || authUser?.email || '',
      phone: profileData.phone || profileData.phoneNumber || authUser?.phone || '',
      specialization: profileData.specialization || 'Specialist Doctor',
      department: profileData.department || authUser?.department || 'General Medicine',
      qualification: profileData.qualification || 'MBBS, FCPS',
      experience: profileData.experience || '8',
      photo: profileData.photo || profileData.profileImage || profileData.avatar || authUser?.photo || authUser?.profileImage || '',
      password: profileData.password || ''
    });
  }, [profileData, authUser]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, photo: event.target.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (!profileData || (!profileData.name && !authUser)) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-14 h-14 text-red-400" />
        <h2 className="text-xl font-bold text-slate-900">User Profile Not Found</h2>
        <p className="text-sm text-slate-500">The requested user could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const newEmail = formData.email.trim();
    const newPassword = formData.password?.trim();

    const currentRole = profileData.role || authUser?.role || 'Doctor';
    const isDoctor = currentRole.toLowerCase().includes('doc') || targetDoctor;

    const existingId = isDoctor
      ? (targetDoctor?.id || profileData.id || authUser?.id)
      : (targetUser?.id || profileData.id || authUser?.id || (currentRole === 'Admin' ? 'usr_admin_01' : null));

    const photoUrl = formData.photo.trim();

    const patch = {
      id: existingId || (isDoctor ? `DOC-${Date.now()}` : `usr_${Date.now()}`),
      name: formData.name.trim(),
      fullName: formData.name.trim(),
      email: newEmail,
      loginEmail: newEmail,
      phone: formData.phone.trim(),
      phoneNumber: formData.phone.trim(),
      specialization: formData.specialization.trim(),
      department: formData.department.trim(),
      qualification: formData.qualification.trim(),
      experience: formData.experience,
      photo: photoUrl,
      profileImage: photoUrl,
      avatar: photoUrl,
      image: photoUrl,
      role: currentRole,
      ...(newPassword ? { password: newPassword, loginPassword: newPassword } : {})
    };

    // 1. Update logged-in user in AuthContext
    if (isOwnProfile) {
      updateAuthUser(patch);
    }

    // 2. Update Doctor or User in DataContext
    if (isDoctor) {
      updateDoctor(patch.id, patch);
    } else {
      updateUser(patch.id, patch);
    }

    setFeedback('Profile details and photo updated successfully!');
    setIsEditing(false);

    setTimeout(() => {
      setFeedback('');
    }, 5000);
  };

  const currentRole = profileData.role || authUser?.role || 'Doctor';
  const displayPhoto = formData.photo || profileData.photo || profileData.profileImage || profileData.avatar || authUser?.photo || authUser?.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150';

  return (
    <div className="min-h-screen bg-slate-50/80 p-5 space-y-6 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (isOwnProfile ? navigate(getDashboardPathByRole(currentRole)) : navigate(-1))}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isOwnProfile ? 'My Profile' : 'User Profile'}</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{currentRole} Profile Details & Settings</p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex justify-between items-center shadow-2xs">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {feedback}
          </span>
          <button onClick={() => setFeedback('')} className="text-xs text-emerald-600 hover:underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* ── VIEW / EDIT CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {isEditing ? (
          /* ── EDIT PROFILE FORM ── */
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" /> Edit Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^a-zA-Z\s.'-]/g, '') })}
                  placeholder="e.g. Dr. Fatima Iqbal"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. fatima@gmail.com"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\-\s()]/g, '') })}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value.replace(/[^a-zA-Z\s.'&\-]/g, '') })}
                  placeholder="e.g. Senior Cardiologist"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value.replace(/[^a-zA-Z\s.'&\-]/g, '') })}
                  placeholder="e.g. Cardiology"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. MBBS, FCPS (Cardiology)"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="e.g. 8"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              {/* Profile Photo Image Selection & Upload */}
              <div className="md:col-span-2 space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700">
                  Profile Photo Image
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Live Avatar Preview */}
                  <img
                    src={formData.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0 bg-white"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150';
                    }}
                  />

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Upload Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">or paste image URL below</span>
                    </div>

                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="Profile Photo Image URL (https://...)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-xs font-mono text-slate-700 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    className="w-full px-3 py-2 pr-10 border rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    tabIndex={-1}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </div>
          </form>
        ) : (
          /* ── VIEW PROFILE CARD ── */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative shrink-0">
                <img
                  src={displayPhoto}
                  alt={formData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-blue-500 shadow-sm bg-slate-50"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150';
                  }}
                />
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">{formData.name}</h2>
                  <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white">
                    {currentRole}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" /> {formData.specialization}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {formData.department} Department • {formData.qualification}
                  {formData.experience && ` • ${formData.experience} Yrs Experience`}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Mail className="w-4 h-4 text-blue-600" /> Contact Information
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 text-xs">Email</span>
                    <strong className="text-slate-900">{formData.email}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Phone</span>
                    <strong className="text-slate-900">{formData.phone || 'Not provided'}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Award className="w-4 h-4 text-purple-600" /> Professional Details
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 text-xs">Qualification</span>
                    <strong className="text-slate-900">{formData.qualification}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Department</span>
                    <strong className="text-slate-900">{formData.department}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile Information
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
