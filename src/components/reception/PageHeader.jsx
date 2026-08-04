import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageHeader({ title, description, action, actionText, actionIcon: ActionIcon, onActionClick }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Link to="/reception" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </div>
      {action ? (
        action
      ) : actionText ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4" />}
          <span>{actionText}</span>
        </button>
      ) : null}
    </div>
  );
}
