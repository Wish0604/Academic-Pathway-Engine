import { NavLink } from 'react-router-dom';
import { GraduationCap, TableProperties, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header id="main-nav-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink id="nav-brand-link" to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all duration-300 group-hover:scale-105 shadow-sm">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
              Academic Pathway Engine
              <Sparkles className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Scoring-Based Education Recommendation</p>
          </div>
        </NavLink>

        <nav id="header-navigation" className="flex items-center gap-1.5">
          <NavLink
            id="nav-home-link"
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Sparkles className="h-4 w-4" />
            Engine Form
          </NavLink>

          <NavLink
            id="nav-submissions-link"
            to="/submissions"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <TableProperties className="h-4 w-4" />
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
