import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();

  // Split path segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatSegment = (segment) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
      <Link
        to="/"
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.length > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={to}>
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[150px]">
                {formatSegment(value)}
              </span>
            ) : (
              <>
                <Link
                  to={to}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[120px]"
                >
                  {formatSegment(value)}
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
