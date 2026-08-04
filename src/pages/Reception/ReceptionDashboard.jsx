import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, Clock3, UserPlus, CalendarRange, CheckCircle2, ListChecks } from 'lucide-react';
import StatisticsCard from '../../components/reception/StatisticsCard';
import { useData } from '../../contexts/DataContext';
export default function ReceptionDashboard() {
  const { patients, appointments, queue } = useData();

  const todayISO = new Date().toISOString().slice(0, 10);
  const todaysAppointmentsCount = appointments.filter((a) => a.date === todayISO || !a.date).length || appointments.length;
  const waitingQueueCount = queue.filter((record) => record.status === 'Waiting' || record.status === 'In Progress' || !record.status).length || queue.length;

  const stats = [
    { title: "Today's Patients", value: patients.length, icon: Users, accent: '#2563EB', to: '/patients' },
    { title: "Today's Appointments", value: todaysAppointmentsCount, icon: CalendarDays, accent: '#22C55E', to: '/reception/appointments' },
    { title: 'Waiting Queue', value: waitingQueueCount, icon: Clock3, accent: '#EF4444', to: '/reception/queue' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Reception Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">A simple overview of today’s patient flow and appointments.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <StatisticsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Appointments</h2>
              <Link to="/reception/appointments" className="text-sm font-medium text-blue-600">View all</Link>
            </div>
            <div className="space-y-3">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{appointment.patientName}</p>
                    <p className="text-sm text-slate-500">{appointment.time}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{appointment.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Registered Patients</h2>
              <Link to="/patients" className="text-sm font-medium text-blue-600">View all</Link>
            </div>
            <div className="space-y-3">
              {patients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{patient.name || patient.fullName}</p>
                    <p className="text-sm text-slate-500">{patient.phone || patient.phoneNumber}</p>
                  </div>
                  <span className="text-sm text-slate-600">{patient.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
