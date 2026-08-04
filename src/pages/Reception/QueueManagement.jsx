import React, { useMemo } from 'react';
import PageHeader from '../../components/reception/PageHeader';
import QueueTable from '../../components/reception/QueueTable';
import { useData } from '../../contexts/DataContext';

export default function QueueManagement() {
  const { appointments, queue, doctors, departments, updateQueueRecord, removeQueueRecord } = useData();

  const displayQueue = queue
    .filter((record) => record.status !== 'Completed')
    .map((record) => ({
      ...record,
      doctorName: doctors.find((d) => d.id === record.doctorId || d.name?.includes(record.doctorName))?.name || record.doctorName || 'Dr. Amina Khan',
      departmentName: departments.find((d) => d.id === record.departmentId || d.name?.includes(record.departmentName))?.name || record.departmentName || 'General Medicine'
    }));

  const handleCallNext = (item) => updateQueueRecord(item.id, { status: 'In Progress' });
  const handleComplete = (item) => removeQueueRecord(item.id);
  const handleSkip = (item) => updateQueueRecord(item.id, { status: 'Waiting' });

  const summary = useMemo(() => {
    const waiting = displayQueue.filter((item) => item.status === 'Waiting' || !item.status).length;
    const currentToken = displayQueue.find((item) => item.status === 'In Progress')?.tokenNumber || displayQueue[0]?.tokenNumber || 0;
    const completed = queue.filter((record) => record.status === 'Completed').length;
    const active = displayQueue.length;
    return { waiting, currentToken, active, completed };
  }, [displayQueue, queue]);

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="mx-auto max-w-6xl space-y-4">
        <PageHeader title="Queue Management" description="Call patients, complete visits, and manage the current queue." />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Waiting Patients</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.waiting}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Current Token</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">#{summary.currentToken}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Completed Today</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.completed}</p>
          </div>
        </div>

        <QueueTable queue={displayQueue} onCallNext={handleCallNext} onComplete={handleComplete} onSkip={handleSkip} />
      </div>
    </div>
  );
}
