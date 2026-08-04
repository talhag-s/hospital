import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder = '••••••••'
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      </div>

      <div className="relative rounded-xl shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete="off"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-11 py-2.5 bg-slate-50/50 text-[#1E293B] text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:bg-white ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-3 focus:ring-red-100'
              : 'border-[#E2E8F0] hover:border-slate-300 focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          tabIndex={-1}
          title={showPassword ? 'Hide Password' : 'Show Password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-blue-600" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-red-500 font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
