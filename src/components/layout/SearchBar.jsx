import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative w-full max-w-xs sm:max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Global search (Patients, Doctors, Medical Records)..."
          className="w-full pl-9 pr-14 py-2 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-slate-800 transition-all"
        />
        {query ? (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3 hidden sm:flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
            <span>⌘K</span>
          </div>
        )}
      </div>
    </div>
  );
}
