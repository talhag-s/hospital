import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getDoctorForUser } from '../../utils/doctorHelpers';
import { Clock, Calendar, Save, CheckCircle, AlertCircle, Plus, Trash2, Palmtree, CalendarOff } from 'lucide-react';

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const { doctors, updateDoctor } = useData();
  const [feedback, setFeedback] = useState('');

  // Identify logged-in doctor
  const currentDoctor = useMemo(() => {
    return getDoctorForUser(user, doctors) || {};
  }, [user, doctors]);

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [availability, setAvailability] = useState(currentDoctor.availability || 'Available');
  const [workingDays, setWorkingDays] = useState(
    (currentDoctor.schedule || []).filter(s => s.isWorking).map(s => s.day) || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  );
  const [startTime, setStartTime] = useState(
    (currentDoctor.schedule || []).find(s => s.isWorking)?.startTime || '08:00'
  );
  const [endTime, setEndTime] = useState(
    (currentDoctor.schedule || []).find(s => s.isWorking)?.endTime || '16:00'
  );

  // Scheduled Leave Dates
  const [leaveDates, setLeaveDates] = useState(currentDoctor.leaveDates || []);
  const [customLeaveDate, setCustomLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('Personal Leave');

  // Keep state synced with currentDoctor data changes
  useEffect(() => {
    if (currentDoctor?.availability) setAvailability(currentDoctor.availability);
    if (currentDoctor?.leaveDates) setLeaveDates(currentDoctor.leaveDates);
  }, [currentDoctor]);

  const toggleDay = (day) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Helper date generators
  const getTomorrowISO = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const handleAddLeaveDate = (dateStr, reasonStr = 'Personal Leave') => {
    if (!dateStr) return;
    if (leaveDates.some((item) => (typeof item === 'string' ? item === dateStr : item.date === dateStr))) {
      setFeedback(`Leave for ${dateStr} is already scheduled.`);
      return;
    }
    const newEntry = { date: dateStr, reason: reasonStr, addedAt: new Date().toISOString() };
    setLeaveDates(prev => [...prev, newEntry]);
    setCustomLeaveDate('');
    setFeedback(`Scheduled leave added for ${dateStr}. Click "Save Schedule Settings" to confirm.`);
  };

  const handleRemoveLeaveDate = (dateStr) => {
    setLeaveDates(prev => prev.filter((item) => (typeof item === 'string' ? item !== dateStr : item.date !== dateStr)));
    setFeedback(`Removed leave for ${dateStr}. Click "Save Schedule Settings" to confirm.`);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!currentDoctor.id) return;

    const updatedSchedule = allDays.map(day => ({
      day,
      isWorking: workingDays.includes(day),
      startTime: workingDays.includes(day) ? startTime : null,
      endTime: workingDays.includes(day) ? endTime : null,
      appointmentsCount: ((currentDoctor.schedule || []).find(s => s.day === day)?.appointmentsCount) || 0
    }));

    // Auto update availability if today is a scheduled leave date
    const todayISO = new Date().toISOString().slice(0, 10);
    const isTodayLeave = leaveDates.some(item => (typeof item === 'string' ? item === todayISO : item.date === todayISO));
    const finalAvailability = isTodayLeave ? 'On-Leave' : availability;

    updateDoctor(currentDoctor.id, {
      availability: finalAvailability,
      schedule: updatedSchedule,
      leaveDates
    });

    setFeedback('Your working schedule, availability, and scheduled leave dates have been saved!');
  };

  const tomorrowISO = getTomorrowISO();

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" /> My Working Schedule & Availability
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage consultation shift hours, planned leave dates, and clinic availability for {currentDoctor.name}</p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex justify-between items-center">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> {feedback}
          </span>
          <button onClick={() => setFeedback('')} className="text-xs text-emerald-600 hover:underline font-bold">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSaveSchedule} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Availability Status */}
        <div className="pb-6 border-b border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-2">Current Availability Status</label>
          <div className="flex flex-wrap items-center gap-4">
            {['Available', 'Busy'].map((status) => (
              <label
                key={status}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  availability === status
                    ? status === 'Available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30'
                    : 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  value={status}
                  checked={availability === status}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="hidden"
                />
                <span className={`w-2.5 h-2.5 rounded-full ${
                  status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* ── SCHEDULED LEAVE & OUT-OF-OFFICE DATES ── */}
        <div className="pb-6 border-b border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-rose-500" /> Scheduled Leave & Out-of-Office Dates
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Set specific upcoming dates (e.g. Tomorrow or 6 August) when you will be on leave from OPD consultations.
            </p>
          </div>

          {/* Custom Date Selection Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Select Specific Leave Date</label>
              <input
                type="date"
                value={customLeaveDate}
                onChange={(e) => setCustomLeaveDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white font-mono"
              />
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Leave Reason (Optional)</label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Personal Leave, Conference, Vacation"
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div className="w-full sm:w-auto sm:self-end">
              <button
                type="button"
                onClick={() => handleAddLeaveDate(customLeaveDate, leaveReason)}
                disabled={!customLeaveDate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" /> Add Leave Date
              </button>
            </div>
          </div>

          {/* Scheduled Leave Badges */}
          {leaveDates.length > 0 ? (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-gray-700">Your Upcoming Scheduled Leaves:</span>
              <div className="flex flex-wrap gap-2.5">
                {leaveDates.map((item, idx) => {
                  const dateStr = typeof item === 'string' ? item : item.date;
                  const reasonStr = typeof item === 'string' ? 'Planned Leave' : (item.reason || 'Planned Leave');
                  const isTomorrow = dateStr === tomorrowISO;

                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white border border-rose-200 text-slate-800 rounded-xl shadow-2xs text-xs font-semibold"
                    >
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <div>
                        <span className="font-mono text-rose-700 font-bold">{dateStr}</span>
                        {isTomorrow && <span className="ml-1 text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Tomorrow</span>}
                        <span className="text-[11px] text-gray-500 font-normal ml-1 border-l pl-1.5 border-gray-200">{reasonStr}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLeaveDate(dateStr)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove leave date"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg border border-dashed border-gray-200">
              No upcoming scheduled leave dates added. Use the quick buttons or date picker above to set leave for tomorrow or any date.
            </div>
          )}
        </div>

        {/* Working Days */}
        <div className="pb-6 border-b border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-2">Weekly Consultation Days</label>
          <p className="text-xs text-gray-500 mb-3">Select the days you are available for OPD patient appointments</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {allDays.map((day) => {
              const active = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div>{day}</div>
                  <div className="text-[10px] mt-1 opacity-80">{active ? 'Working' : 'Off'}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shift Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic End Time *</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Save Schedule Settings
          </button>
        </div>
      </form>
    </div>
  );
}
