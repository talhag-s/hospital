import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  HeartPulse, ChevronLeft, ChevronRight, X, LogOut,
  LayoutDashboard, Users, Building2, Stethoscope, Calendar, Bed,
  Activity, FlaskConical, Pill, Receipt, Package, Briefcase,
  IndianRupee, BarChart3, Settings, ClipboardList, FileText,
  UserPlus, Clock, ShieldCheck, Truck, CheckSquare, Users2, User, Heart
} from 'lucide-react';

// ── 1. ADMIN MODULE FEATURES ──
const adminMenuItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/admin/dashboard', end: true },
  { label: 'Doctor Management', icon: Stethoscope, to: '/doctors', end: true },
  { label: 'All Patients', icon: Users, to: '/patients', end: true },
  { label: 'Appointments', icon: Calendar, to: '/admin/appointments', end: true },
  { label: 'Receptionist Management', icon: Users2, to: '/admin/users', end: true },
  { label: 'Department Mgmt', icon: Building2, to: '/admin/departments', end: true },
  { label: 'Financials & Billing', icon: IndianRupee, to: '/admin/financials', end: true },
  { label: 'Reports & Analytics', icon: BarChart3, to: '/admin/reports', end: true },
  { label: 'System Settings', icon: Settings, to: '/admin/settings', end: true },
];

// ── 2. DOCTOR MODULE FEATURES ──
const doctorMenuItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboards/doctor', end: true },
  { label: 'My Appointments', icon: Calendar, to: '/doctor/appointments', end: true },
  { label: 'My Patients', icon: Users, to: '/doctor/patients', end: true },
  { label: 'My Schedule', icon: Clock, to: '/doctor/schedule', end: true },
];

// ── 3. RECEPTIONIST MODULE FEATURES ──
const receptionMenuItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/reception', end: true },
  { label: 'Total Doctors', icon: Stethoscope, to: '/doctors', end: true },
  { label: 'All Patients', icon: Users, to: '/patients', end: true },
  { label: 'Appointments', icon: Calendar, to: '/reception/appointments', end: true },
  { label: 'Queue Management', icon: Clock, to: '/reception/queue', end: true },
];
const defaultMenuItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard', end: true },
  { label: 'Patient Management', icon: Users, to: '/patients', end: true },
  { label: 'Doctor Directory', icon: Stethoscope, to: '/doctors', end: true },
];
function getMenuItemsByRole(role) {
  if (!role) return adminMenuItems;
  const normalized = role.toLowerCase().trim();

  switch (normalized) {
    case 'admin':
      return adminMenuItems;
    case 'doctor':
      return doctorMenuItems;
    case 'receptionist':
    case 'reception':
      return receptionMenuItems;
    default:
      return defaultMenuItems;
  }
}

function SidebarLink({ icon: Icon, label, to, isCollapsed, onClick }) {
  if (!to) return null;

  const location = useLocation();
  const toUrl = new URL(to, 'http://x');
  const isActive = (() => {
    if (toUrl.pathname !== location.pathname) return false;
    if (!toUrl.search) return !location.search;
    return toUrl.search === location.search;
  })();

  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={() =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isCollapsed ? 'justify-center' : ''
        } ${isActive
          ? 'bg-blue-600 text-white font-semibold shadow-sm'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}


export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, closeMobileDrawer }) {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const hospitalDisplayName = settings?.hospitalName || 'CityCare ERP';

  const itemsToRender = getMenuItemsByRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileDrawer}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-800 text-white transition-all duration-200 overscroll-contain ${isCollapsed ? 'w-16' : 'w-56'
          } ${isMobileOpen ? 'translate-x-0 w-56 shadow-xl' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className={`h-14 flex items-center border-b border-slate-700 relative ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className={`w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0 ${
                isCollapsed ? 'cursor-pointer hover:bg-blue-500 transition-colors' : ''
              }`}
              onClick={isCollapsed ? toggleCollapse : undefined}
              title={isCollapsed ? "Expand Sidebar" : undefined}
            >
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white leading-tight truncate max-w-[130px]" title={hospitalDisplayName}>
                  {hospitalDisplayName}
                </div>
                <div className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                  {settings?.hospitalCode || 'Hospital ERP'}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex absolute -right-3 top-4 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-full p-1 border border-slate-600 shadow-md transition-colors z-50"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={closeMobileDrawer}
              className="lg:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= USER PROFILE ================= */}
        <div
          onClick={() => {
            navigate('/profile');
            if (closeMobileDrawer) closeMobileDrawer();
          }}
          title="Click to view & edit profile"
          className="border-b border-slate-700 px-3 py-4 cursor-pointer hover:bg-slate-700/60 transition-all group"
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
              }`}
          >
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.photo ||
                  user?.profileImage ||
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
                }
                alt={user?.name || "User"}
                className="h-12 w-12 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-400 transition-colors bg-slate-700"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150";
                }}
              />

              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>
            </div>

            {/* User Information */}
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {user?.name || "User Profile"}
                </h3>

                <p className="truncate text-xs text-slate-400">
                  {user?.email || "admin@hospital.com"}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {user?.role || "Administrator"}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-2 py-3 space-y-0.5">
          {itemsToRender.map((item) => (
            <SidebarLink
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed}
              onClick={closeMobileDrawer}
            />
          ))}

        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
