import React from 'react';

export default function FilterDropdown({ label, value, onChange, options }) {
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(e);
    }
  };

  return (
    <label className="text-sm text-slate-600">
      <span className="mb-1 block">{label}</span>
      <select
        value={value}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none cursor-pointer hover:border-slate-300 text-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
