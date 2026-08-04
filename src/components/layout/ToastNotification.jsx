import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastIconByType = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function ToastNotification() {
  const { toast, hideToast } = useAuth();
  const Icon = toastIconByType[toast.type] || Info;

  useEffect(() => {
    if (!toast.show) return undefined;
    const timer = window.setTimeout(() => hideToast(), 4000);
    return () => window.clearTimeout(timer);
  }, [toast.show, hideToast]);

  if (!toast.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm px-4 sm:px-0">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <div className={`mt-0.5 text-slate-800 ${toast.type === 'success' ? 'text-emerald-500' : toast.type === 'error' ? 'text-red-500' : toast.type === 'warning' ? 'text-amber-500' : 'text-sky-500'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
            <p className="mt-1 text-xs text-slate-500 leading-5">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={hideToast}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
