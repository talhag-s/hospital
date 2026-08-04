import React from 'react';
import StatusBadge from '../dashboard/StatusBadge';

export default function PatientProfile({ patient }) {
  if (!patient) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-[200px_minmax(300px,1fr)]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Patient ID</p>
            <p className="text-lg font-semibold text-slate-900">{patient.id}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Department</p>
            <p className="text-lg font-semibold text-slate-900">{patient.department || 'N/A'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Doctor</p>
            <p className="text-lg font-semibold text-slate-900">{patient.assignedDoctor || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Name</p>
                <p className="text-2xl font-semibold text-slate-900">{patient.name || patient.fullName}</p>
              </div>
              <StatusBadge status={patient.status || 'Unknown'} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Age</p>
                <p className="text-base font-medium text-slate-900">{patient.age ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="text-base font-medium text-slate-900">{patient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="text-base font-medium text-slate-900">{patient.phone || patient.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-base font-medium text-slate-900">{patient.email || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500">Address</p>
                <p className="text-base font-medium text-slate-900">{patient.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Blood Group</p>
              <p className="text-base font-medium text-slate-900">{patient.bloodGroup || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Emergency Contact</p>
              <p className="text-base font-medium text-slate-900">{patient.emergencyContact || patient.emergencyContactName || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">CNIC</p>
              <p className="text-base font-medium text-slate-900">{patient.cnic || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
