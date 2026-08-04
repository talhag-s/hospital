import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

function resolveDoctor(appointment, doctors) {
  if (!doctors?.length) return undefined;
  const doctorById = doctors.find((item) => item.id === appointment.doctorId);
  if (doctorById) return doctorById;

  const legacyIdMap = {
    'DOC-101': 'DOC-001',
    'DOC-102': 'DOC-002',
    'DOC-103': 'DOC-003'
  };

  const normalizedId = legacyIdMap[appointment.doctorId] || appointment.doctorId;
  const doctorByNormalizedId = doctors.find((item) => item.id === normalizedId);
  if (doctorByNormalizedId) return doctorByNormalizedId;

  const nameKey = appointment.doctorName || appointment.doctor || appointment.doctorId;
  return doctors.find((item) => item.name === nameKey || item.name?.toLowerCase() === String(nameKey)?.toLowerCase());
}

export default function AppointmentTable({ appointments, doctors, departments, onEdit, onCancel, onStatusChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Appointment ID</th>
              <th className="px-4 py-3 font-medium">Patient Name</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {appointments.map((appointment) => {
              const doctor = resolveDoctor(appointment, doctors);
              const department = departments.find((item) => item.id === appointment.departmentId);
              return (
                <tr key={appointment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{appointment.id}</td>
                  <td className="px-4 py-3">{appointment.patientName}</td>
                  <td className="px-4 py-3">{doctor?.name || appointment.doctorName || appointment.doctor || '—'}</td>
                  <td className="px-4 py-3">{department?.name || '—'}</td>
                  <td className="px-4 py-3">{appointment.date}</td>
                  <td className="px-4 py-3">{appointment.time}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={appointment.status}
                      onStatusChange={(newStatus) => onStatusChange && onStatusChange(appointment, newStatus)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(appointment)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit Appointment"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onCancel(appointment)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="Delete/Cancel Appointment"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
