import React from 'react';
import { HeartPulse, Phone, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Footer() {
  const { settings } = useData();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{settings?.hospitalName || 'CityCare Hospital'}</p>
            <p className="text-xs text-slate-500">Simple and reliable care management</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <a href="tel:+15550192834" className="flex items-center gap-2 hover:text-slate-900">
            <Phone className="h-4 w-4" />
            <span>+1 555 019 2834</span>
          </a>
          <a href="mailto:support@citycarehospital.com" className="flex items-center gap-2 hover:text-slate-900">
            <Mail className="h-4 w-4" />
            <span>support@citycarehospital.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
