import React from 'react';
import { Clock, Users, MapPin } from 'lucide-react';

export default function ScheduleCard({ schedule }) {
  const getStatusColor = (isWorking) => {
    return isWorking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const workingDays = schedule.filter(s => s.isWorking);
  const totalAppointments = schedule.reduce((sum, day) => sum + day.appointmentsCount, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Schedule</h3>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{workingDays.length}</div>
          <div className="text-xs text-gray-600 mt-1">Working Days</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalAppointments}</div>
          <div className="text-xs text-gray-600 mt-1">Total Appointments</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{workingDays.length > 0 ? Math.ceil(totalAppointments / workingDays.length) : 0}</div>
          <div className="text-xs text-gray-600 mt-1">Avg Per Day</div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-2">
        {schedule.map((day, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{day.day}</div>
              {day.isWorking ? (
                <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {day.startTime} - {day.endTime}
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">Off</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {day.isWorking && (
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{day.appointmentsCount}</div>
                  <div className="text-xs text-gray-500">appointments</div>
                </div>
              )}
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(day.isWorking)}`}>
                {day.isWorking ? 'Working' : 'Off'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
