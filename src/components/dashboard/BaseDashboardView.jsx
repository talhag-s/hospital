import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, LogOut, ArrowLeft, UserCheck } from 'lucide-react';

// =====================================================
// Shared Base Dashboard View — used by all role pages
// that haven't been fully built yet.
// =====================================================
export function BaseDashboardView({ title, roleName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#2563EB]" />

        {/* User Profile Badge */}
        {user && (
          <div className="flex items-center justify-center space-x-3 mb-6">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
              />
            )}
            <div className="text-left">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                {user.name}
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-xs text-slate-500">{user.department}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {user.role} Role
              </span>
            </div>
          </div>
        )}

        <div className="inline-flex items-center justify-center p-4 bg-blue-50 text-[#2563EB] rounded-2xl mb-4 shadow-xs">
          <UserCheck className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">{title}</h1>

        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Welcome to the <strong className="text-slate-700">{title}</strong>. Full operational metrics, interactive widgets, and module tools will be loaded in the next phase.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md shadow-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BaseDashboardView;
