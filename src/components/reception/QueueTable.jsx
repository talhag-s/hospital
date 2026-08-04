import React from 'react';
import { PhoneCall, CheckCircle2, SkipForward } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function QueueTable({ queue, onCallNext, onComplete, onSkip }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold">#{item.tokenNumber}</td>
                <td className="px-4 py-3">{item.patientName}</td>
                <td className="px-4 py-3">{item.doctorName}</td>
                <td className="px-4 py-3">{item.departmentName}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onCallNext(item)} className="rounded-lg bg-blue-600 p-2 text-white"><PhoneCall className="h-4 w-4" /></button>
                    <button onClick={() => onComplete(item)} className="rounded-lg bg-emerald-600 p-2 text-white"><CheckCircle2 className="h-4 w-4" /></button>
                    <button onClick={() => onSkip(item)} className="rounded-lg bg-amber-500 p-2 text-white"><SkipForward className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
