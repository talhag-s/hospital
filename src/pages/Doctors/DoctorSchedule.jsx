import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, AlertCircle, Clock, Users } from 'lucide-react';
import { INITIAL_DOCTORS } from '../../data/doctors';
import ScheduleCard from '../../components/doctors/ScheduleCard';
import { useData } from '../../contexts/DataContext';

export default function DoctorSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useData();
  const doctor = (doctors || INITIAL_DOCTORS).find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center space-y-4 bg-gray-50">
        <AlertCircle className="w-14 h-14 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">Doctor Not Found</h2>
        <button onClick={() => navigate('/doctors')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const workingDays = (doctor.schedule || []).filter(d => d.isWorking);
  const totalAppointments = workingDays.reduce((sum, d) => sum + (d.appointmentsCount || 0), 0);
  const firstDay = workingDays[0];
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });
  const todaySchedule = (doctor.schedule || []).find(s => s.day === today);

  return (
    <div className="p-5 bg-gray-50 min-h-screen space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/doctors/${id}`)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" /> Doctor Schedule
            </h1>
            <p className="text-sm text-gray-600 mt-1">{doctor.name} · {doctor.department}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&bg=2563EB&color=fff`; }}
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-1">{doctor.specialization} · {doctor.department}</p>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-xl font-bold text-blue-600">{workingDays.length}</div>
            <div className="text-xs text-gray-600">Working Days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{workingDays.length}</div>
              <div className="text-xs text-gray-600 mt-0.5">Working Days</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{totalAppointments}</div>
              <div className="text-xs text-gray-600 mt-0.5">Weekly Appts</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-indigo-600">{firstDay?.startTime || 'N/A'}</div>
              <div className="text-xs text-gray-600 mt-0.5">Start Time</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-600">{firstDay?.endTime || 'N/A'}</div>
              <div className="text-xs text-gray-600 mt-0.5">End Time</div>
            </div>
          </div>
        </div>
      </div>

      {todaySchedule && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">Today's Appointments</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{todaySchedule.appointmentsCount} scheduled</div>
            </div>
            <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>
      )}

      {doctor.leaveDates && doctor.leaveDates.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-600" /> Scheduled Out-of-Office & Leave Dates
          </h3>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {doctor.leaveDates.map((item, idx) => {
              const dateStr = typeof item === 'string' ? item : item.date;
              const reasonStr = typeof item === 'string' ? 'Planned Leave' : (item.reason || 'Planned Leave');
              return (
                <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-mono font-bold">{dateStr}</span>
                  <span className="text-gray-500 font-normal border-l pl-2 border-gray-200">{reasonStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          <Calendar className="w-4 h-4" /> Weekly Schedule
        </h3>
        <ScheduleCard schedule={doctor.schedule} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Day-by-Day Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctor.schedule.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{day.day}</div>
                {day.isWorking ? (
                  <>
                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {day.startTime} - {day.endTime}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500 mt-1">Off</div>
                )}
              </div>
              <div className="text-right">
                {day.isWorking && (
                  <>
                    <div className="text-lg font-bold text-gray-900">{day.appointmentsCount}</div>
                    <div className="text-xs text-gray-500">appointments</div>
                  </>
                )}
                <span className={`mt-2 inline-block px-2 py-1 rounded text-xs font-semibold ${
                  day.isWorking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {day.isWorking ? 'Working' : 'Off'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
