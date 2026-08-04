import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({
  icon: IconComponent,
  label,
  to,
  badge,
  isCollapsed,
  isActive,
  onClick
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={({ isActive: isLinkActive }) => {
        const active = isActive !== undefined ? isActive : isLinkActive;
        return `group relative flex items-center transition-all duration-200 font-medium rounded-xl text-sm ${
          isCollapsed ? 'justify-center p-3 my-1' : 'px-3.5 py-2.5 my-1 space-x-3'
        } ${
          active
            ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`;
      }}
    >
      {({ isActive: isLinkActive }) => {
        const active = isActive !== undefined ? isActive : isLinkActive;
        return (
          <>
            {/* Icon */}
            {IconComponent && (
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
            )}

            {/* Label (Shown when expand) */}
            {!isCollapsed && (
              <span className="truncate flex-1 text-sm tracking-wide">
                {label}
              </span>
            )}

            {/* Badge (e.g. unread count or status) */}
            {badge && !isCollapsed && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-blue-400 border border-blue-500/20'
                }`}
              >
                {badge}
              </span>
            )}

            {/* Collapsed Badge indicator */}
            {badge && isCollapsed && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            )}

            {/* Tooltip on Hover when Collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap border border-slate-800">
                {label}
              </div>
            )}
          </>
        );
      }}
    </NavLink>
  );
}
