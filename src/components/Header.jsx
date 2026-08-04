import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, PhoneCall, LogOut, User, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const navigate = useNavigate();

  const hospitalDisplayName = settings?.hospitalName || 'CityCare';

  return (
    <header className="bg-[#001D4A] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1A73E8] group-hover:bg-[#1557B0] flex items-center justify-center text-white shadow-md transition-colors">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-tight">
                {hospitalDisplayName}
              </span>
              <span className="text-[10px] font-semibold text-blue-200 tracking-wider uppercase">
                {settings?.hospitalCode || 'Medical Center ERP'}
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/" 
              className="flex items-center space-x-1.5 text-white hover:text-blue-200 transition-colors duration-150 py-1"
            >
              <Home className="w-4 h-4 text-blue-300" />
              <span>Home</span>
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
}


