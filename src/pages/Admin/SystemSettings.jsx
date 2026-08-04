import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import PasswordInput from '../../components/PasswordInput';
import {
  Building2, User, Mail, Phone, Save, Award,
  CheckCircle2, Key, MapPin, ShieldCheck, Sparkles
} from 'lucide-react';

export default function SystemSettings() {
  const { user, updateAuthUser, showToast } = useAuth();
  const { settings, updateSettings, users = [], updateUser } = useData();

  // Find active admin user profile
  const adminUser = (users && users.find((u) => u.role === 'Admin' || u.id === user?.id)) || {
    id: user?.id || 'usr_admin',
    name: user?.name || 'System Administrator',
    email: user?.email || 'admin@hospital.com',
    phone: '+1 (555) 019-2834',
    designation: 'Super Administrator',
    location: 'Executive Block - Suite 101'
  };

  const [hospitalName, setHospitalName] = useState(settings?.hospitalName || 'CityCare General Hospital ERP');
  const [hospitalCode, setHospitalCode] = useState(settings?.hospitalCode || 'CC-ERP-01');

  const [adminName, setAdminName] = useState(user?.name || adminUser.name || 'System Administrator');
  const [adminEmail, setAdminEmail] = useState(user?.email || adminUser.email || 'admin@hospital.com');
  const [adminPhone, setAdminPhone] = useState(user?.phone || adminUser.phone || '+1 (555) 019-2834');
  const [adminDesignation, setAdminDesignation] = useState(user?.designation || adminUser.designation || 'Super Administrator');
  const [adminLocation, setAdminLocation] = useState(user?.location || adminUser.location || 'Executive Block - Suite 101');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.hospitalName) setHospitalName(settings.hospitalName);
      if (settings.hospitalCode) setHospitalCode(settings.hospitalCode);
    }
  }, [settings]);

  const handleSave = (e) => {
    e.preventDefault();

    // 1. Update Hospital Settings
    updateSettings({
      hospitalName,
      hospitalCode
    });

    // 2. Update Admin User Profile in DataContext
    if (adminUser?.id && updateUser) {
      updateUser(adminUser.id, {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        designation: adminDesignation,
        location: adminLocation
      });
    }

    // 3. Update Auth Session
    if (updateAuthUser) {
      updateAuthUser({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        designation: adminDesignation,
        location: adminLocation
      });
    }

    if (newPassword) {
      setCurrentPassword('');
      setNewPassword('');
    }

    setSaveSuccess(true);
    showToast('success', 'Settings Updated', 'Hospital settings and admin profile saved successfully.');
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5";

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Admin Control Panel
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Update hospital identity and manage primary administrator account credentials.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* ── SECTION 1: HOSPITAL INFORMATION ── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hospital Identity</h2>
              <p className="text-xs text-slate-400">Configure the primary name and facility code displayed across ERP modules</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                <Building2 className="w-3.5 h-3.5 text-blue-500" /> Hospital Name
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. CityCare General Hospital ERP"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Facility System Code
              </label>
              <input
                type="text"
                required
                value={hospitalCode}
                onChange={(e) => setHospitalCode(e.target.value)}
                placeholder="e.g. CC-ERP-01"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: ADMIN PROFILE DETAILS ── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Administrator Profile</h2>
              <p className="text-xs text-slate-400">Manage contact information and identity details for the primary admin user</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                <User className="w-3.5 h-3.5 text-blue-500" /> Admin Full Name
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. System Administrator"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Mail className="w-3.5 h-3.5 text-blue-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@hospital.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Phone className="w-3.5 h-3.5 text-blue-500" /> Phone / Contact Number
              </label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Award className="w-3.5 h-3.5 text-blue-500" /> Role / Designation
              </label>
              <input
                type="text"
                required
                value={adminDesignation}
                onChange={(e) => setAdminDesignation(e.target.value)}
                placeholder="e.g. Super Administrator"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Office / Wing Location
              </label>
              <input
                type="text"
                value={adminLocation}
                onChange={(e) => setAdminLocation(e.target.value)}
                placeholder="Executive Block - Suite 101"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: SECURITY CREDENTIALS (OPTIONAL) ── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Password (Optional)</h2>
              <p className="text-xs text-slate-400">Leave blank if you do not wish to modify the administrator password</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <PasswordInput
              id="currentPassword"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <PasswordInput
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
            />
          </div>
        </div>

        {/* ── SAVE ACTION ── */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all shadow-blue-500/20 active:scale-[0.99]"
          >
            <Save className="w-4 h-4" /> Save Settings & Profile
          </button>
        </div>

      </form>
    </div>
  );
}
