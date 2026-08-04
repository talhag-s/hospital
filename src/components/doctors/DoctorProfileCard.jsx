import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit2, Calendar, Users, Phone, Mail, MapPin, Briefcase,
  ShieldCheck, Clock, Stethoscope, Sparkles, Award, ArrowLeft,
  CheckCircle2, UserCheck
} from 'lucide-react';
import { calculateAge, formatDate } from '../../utils/doctorHelpers';

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-slate-800 break-words">{value || '—'}</div>
      </div>
    </div>
  );
}

export default function DoctorProfileCard({ doctor }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const age = calculateAge(doctor.dob);

  const getInitials = (name) => {
    if (!name) return 'DR';
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80 dot-emerald-500';
      case 'Busy':
        return 'bg-amber-500/10 text-amber-700 border-amber-200/80 dot-amber-500';
      case 'On-Leave':
        return 'bg-rose-500/10 text-rose-700 border-rose-200/80 dot-rose-500';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-200/80 dot-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HERO PROFILE HEADER CARD (CLEAN WHITE DESIGN) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Left: Avatar & Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Doctor Avatar */}
            <div className="relative shrink-0">
              {!imgError && doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-sm bg-slate-50"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 font-extrabold text-3xl shadow-sm flex items-center justify-center tracking-wider select-none">
                  {getInitials(doctor.name)}
                </div>
              )}

              {/* Status pulse dot */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                doctor.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Title & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  doctor.availability === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${doctor.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {doctor.availability || 'Available'}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {doctor.status || 'Active'}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {doctor.id || doctor.employeeId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {doctor.name}
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </h1>

              <p className="text-base font-bold text-blue-600 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-500" />
                {doctor.specialization || 'Specialist Doctor'}
              </p>

              <p className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
                <span>{doctor.department} Department</span>
                <span>•</span>
                <span>{doctor.qualification}</span>
                {doctor.experience && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{doctor.experience} Yrs Experience</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/doctors/edit/${doctor.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all font-semibold text-xs active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" /> Edit Profile
            </button>

            <button
              type="button"
              onClick={() => navigate(`/doctors/${doctor.id}/schedule`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-xs active:scale-95 shadow-blue-500/20"
            >
              <Calendar className="w-3.5 h-3.5" /> View Schedule
            </button>
          </div>

        </div>
      </div>

      {/* ── INFORMATION GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Professional Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Professional Information</h3>
          </div>

          <div className="space-y-1">
            <InfoRow label="Employee ID" value={doctor.employeeId || doctor.id} icon={ShieldCheck} />
            <InfoRow label="Department" value={doctor.department} icon={Award} />
            <InfoRow label="Specialization" value={doctor.specialization} icon={Stethoscope} />
            <InfoRow label="Qualification" value={doctor.qualification} />
            <InfoRow label="Experience" value={doctor.experience ? `${doctor.experience} Years` : null} icon={Clock} />
            <InfoRow label="Medical License" value={doctor.licenseNumber} icon={ShieldCheck} />
            <InfoRow label="Joining Date" value={formatDate(doctor.joiningDate)} icon={Calendar} />
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="space-y-1">
            <InfoRow label="Full Name" value={doctor.name} />
            <InfoRow label="Gender" value={doctor.gender} />
            <InfoRow label="Date of Birth" value={formatDate(doctor.dob)} icon={Calendar} />
            <InfoRow label="Age" value={age ? `${age} Years` : null} />
            <InfoRow label="CNIC / ID Card" value={doctor.cnic} icon={ShieldCheck} />
            <InfoRow label="Phone Number" value={doctor.phone} icon={Phone} />
            <InfoRow label="Email Address" value={doctor.email} icon={Mail} />
          </div>
        </div>

      </div>

      {/* ── ADDRESS & EMERGENCY CONTACT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Residential Address */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Residential Address</h3>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {doctor.address || 'No residential address recorded.'}
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Emergency Contact</h3>
          </div>
          <div className="space-y-1">
            <InfoRow label="Contact Name" value={doctor.emergencyContact} />
            <InfoRow label="Emergency Phone" value={doctor.emergencyPhone} icon={Phone} />
          </div>
        </div>

      </div>

      {/* ── BACK NAVIGATION BUTTON ── */}
      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={() => navigate('/doctors')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctor Directory
        </button>
      </div>

    </div>
  );
}
