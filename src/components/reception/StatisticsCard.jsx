import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StatisticsCard({ title, value, icon: Icon, accent, to, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div
      onClick={handleClick}
      role={to || onClick ? 'button' : undefined}
      tabIndex={to || onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((to || onClick) && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${
        to || onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 active:translate-y-0'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            {value}
          </p>
          {(to || onClick) && (
            <p className="mt-1.5 text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:underline">
              View details &rarr;
            </p>
          )}
        </div>
        <div
          className="rounded-xl p-3 transition-transform duration-200 group-hover:scale-110 shadow-2xs shrink-0"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
